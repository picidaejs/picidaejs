import {EventEmitter} from 'events'
import {sync} from 'mkdirp'
import nps from 'path'
import WebpackServer from './lib/webpack-server'
import build from './lib/webpack-server/build'
import fs from './lib/utils/fs'
import Error from './lib/utils/Error'
import defaultConfig from './lib/default-config'
import assign from './lib/utils/array-append-assign'
import {fileIsMarkdown, renderTemplate} from './lib/utils'
import {tmpPath, templatePath} from './lib/utils/context'
import console from './lib/utils/console'
import resolve from './lib/utils/resolve-path'
import file2Tree from './lib/utils/files-to-tree'
import parseQuery from './lib/utils/parse-query'
import match from './lib/utils/rule-match'
import summary from './lib/loaders/data-loader/summary-generator'
import boss from './lib/loaders/common/boss'
import ssr from './lib/utils/ssr'
import chokidar from 'chokidar'

const chalk = require('chalk')

function webpackConfigGetter(config = {}) {

    if (config.module && config.module.loaders) {
        config.module.loaders.push({
            test: filename => {
                return /\.(md|markdown)\.js/.test(filename) || fileIsMarkdown(filename)
            },
            excludes: [/(node_modules|bower_components)/],
            loader: require.resolve('./lib/loaders/markdown-loader')
        })
    }
    return config;
}

function looseRoutesMap(map = {}) {
    Object.keys(map).forEach(key => {
        map[key.replace(/^\/+/, '').replace(/\/+$/, '')] = map[key]
    })
    return map;
}

function generateEntry(fileTree, routesMap = {}) {
    routesMap = looseRoutesMap(routesMap);

    function replace(pathname) {
        let matched = false;
        return pathname
            .split('/')
            .map((chunk) => {
                if (!matched) {
                    if (routesMap[chunk]) {
                        matched = true;
                    }
                    return routesMap[chunk] || chunk;
                }
                else {
                    return chunk;
                }
            })
            .join('/');
    }

    function generateEntryInner(root, fileTree, container = {}) {
        if (fileTree.files) {
            fileTree.files.forEach(ent => {
                generateEntryInner(nps.join(root, ent.file), ent, container);
            })
        }
        else {
            container[
                replace(root/*.replace(/\..*$/, '')*/.substring(outRoot.length + 1))
            ] = root
        }
        return container;
    }

    let outRoot = fileTree.file
    /*.replace(/\..*$/, '');*/
    return generateEntryInner(fileTree.file, fileTree);
}

class Picidae extends EventEmitter {

    constructor(opts) {
        super();
        this.opts = assign({}, defaultConfig, opts);

        this.tmpPath = nps.join(tmpPath) //, '..', require('md5')(Date.now()).substr(0, 15))
        sync(this.tmpPath);
        let entryFile = nps.join(this.tmpPath, 'entry.js');
        let tmpThemeDataPath = nps.join(this.tmpPath, 'theme-data.js');
        let tplHtmlPath = nps.join(templatePath, 'template.html');
        let customTplHtmlPath = nps.join(this.opts.templateRoot, 'index.html')
        sync(this.opts.templateRoot);

        !fs.existsSync(customTplHtmlPath) && fs.copySync(tplHtmlPath, customTplHtmlPath);

        this.htmlTempate = customTplHtmlPath;
        this.themeDataPath = tmpThemeDataPath;
        this.docPath = nps.resolve(this.opts.docRoot);


        this.watchTheme();
        this.watchSummary();


        this.webpackConfigGetter = config => {
            config = webpackConfigGetter(config);
            config.entry = {
                ...config.entry,
                app: entryFile,
                // ...generateEntry(tree)
            }
            config.output.publicPath = this.opts.publicPath || config.output.publicPath;
            config.output.path = nps.resolve(this.opts.distRoot);

            if (this.opts.webpackConfigUpdater) {
                return this.opts.webpackConfigUpdater(config, require('webpack'))
            }
            return config;
        };

        // Write Files for Webpack
        renderTemplate(
            nps.join(templatePath, 'entry.template.js'),
            {root: this.opts.publicPath, themeDataPath: tmpThemeDataPath},
            entryFile
        );

        // initial webpackServer
        this.wpServer = new WebpackServer({
            ...this.opts,
            dev: this.opts.watch,
            webpackConfigGetter: this.webpackConfigGetter
        });
    }

    generateSummary(plugins = this.initialThemeConfig().plugins, callback) {
        this.summaryPath = nps.join(this.tmpPath, 'data.js');
        this.summarySSrPath = nps.join(this.tmpPath, 'data.ssr.js');
        let tree = file2Tree(this.docPath, filename => {
            return fileIsMarkdown(filename) && !match(this.opts.excludes, filename)
        });
        // console.log(this.opts.picker && this.opts.picker.toString());
        boss.queue({
            type: 'summary',
            args: [generateEntry(tree, this.routesMap), plugins, this.opts.picker && this.opts.picker.toString(), true],
            callback: (err, result) => {
                console.log(`\`${this.summaryPath}\` Updated.`)
                fs.writeFileSync(this.summaryPath, 'module.exports = ' + result);

                if (this.opts.ssr) {
                    let str = fs.readFileSync(nps.join(templatePath, 'data-ssr.template.js')).toString();
                    fs.writeFileSync(this.summarySSrPath, str + '\nmodule.exports = ' + result);
                }
                callback && callback()
            }
        });
    }

    watchSummary = () => {
        if (this.opts.watch) {
            this.summaryLock = false
            this.summaryWatcher = chokidar.watch(this.docPath, {ignoreInitial: true});
            this.summaryWatcher.on('all', (event, path) => {
                if (fileIsMarkdown(path) && !this.summaryLock) {
                    this.generateSummary(null, () => {
                        this.summaryLock = true;
                    })
                }
            });
        }
    }

    watchTheme = () => {
        const {
            themeConfigFiles,
            root,
            notFound,
            routes,
            themeConfig,
            plugins
        } = this.initialThemeConfig();

        try {
            delete require.cache[require.resolve(this.themeDataPath)]
        } catch (ex) {
        }

        // initial Watcher
        if (this.opts.watch && themeConfigFiles.length) {
            this.themeWatcher = chokidar.watch(themeConfigFiles, {persistent: true, ignoreInitial: true})
            this.themeWatcher.on('all', (event, path, stat) => {
                console.log(path, ':', event);
                this.themeWatcher.close();
                this.themeWatcher = null;
                this.watchTheme();
            })
        }

        // Write Routes/ThemeConfig to file
        const {routesMap = {}, ...config} = themeConfig;
        this.routesMap = routesMap;
        renderTemplate(
            nps.join(templatePath, 'commonjs.template.js'),
            {body: JSON.stringify({root, notFound, routes, themeConfig: config})},
            this.themeDataPath
        );

        renderTemplate(
            nps.join(templatePath, 'routes-generator.template.js'),
            {root, /*routesMap: JSON.stringify(routesMap), */dataSuffix: ''},
            nps.join(this.tmpPath, 'routes-generator.js'),
        );

        this.opts.ssr
        && renderTemplate(
            nps.join(templatePath, 'routes-generator.template.js'),
            {root, /*routesMap: JSON.stringify(routesMap), */dataSuffix: '.ssr'},
            nps.join(this.tmpPath, 'routes-generator.ssr.js'),
        );


        this.generateSummary(plugins, () => {
        });
    }

    clearTmp() {
        require('empty-dir').sync(this.tmpPath);
    }

    build(callback) {


        console.log(chalk.green('Building.'));
        build(this.wpServer.getWebpackConfig(), () => {
            console.log(chalk.green('Build successfully.'));
            boss.jobDone();
            this.clearTmp()
            callback && callback();
        })
    }

    initialThemeConfig() {
        let themeKey = resolve.isNodeModule(this.opts.theme)
            ? parseQuery.autoPrefix(this.opts.theme, 'picidae-theme-') : 'default';
        let themePath = resolve.isNodeModule(this.opts.theme)
            ? resolve(this.opts.theme) : nps.join(resolve(this.opts.theme), 'index.js');

        let themeConfigsRoot = nps.resolve(this.opts.themeConfigsRoot);
        let themeConfigFile = nps.join(themeConfigsRoot, themeKey);
        let themeConfigFiles = [themePath, themeConfigFile];

        if (this.opts.watch) {
            try {
                delete require.cache[require.resolve(themePath)];
                delete require.cache[require.resolve(themeConfigFile)];
            } catch (ex) {
            }
        }

        let {
            root,
            routes,
            notFound,
            config: themeConfig = {},
            plugins = []
        } = require(themePath) || require(themePath).default;
        plugins = ['utils'].concat(plugins);
        plugins = plugins.map(f =>
            parseQuery(f, 'picidae-plugin-')
        )

        try {
            themeConfig = require(themeConfigFile)
        } catch (ex) {
            themeConfigFile = themePath;
        }
        console.log(chalk.gray('Theme Configuration In File: '))
        console.log('    ', chalk.green(require.resolve(themeConfigFile)))

        this.opts.themeConfig = themeConfig;
        root = nps.join(nps.dirname(themePath), root);

        themeConfigFiles = themeConfigFiles
            .map(x => {
                try {
                    return require.resolve(x)
                } catch (ex) {
                    return false
                }
            })
            .filter(Boolean)

        return {
            themeConfigFiles,
            root,
            notFound,
            routes,
            themeConfig,
            plugins
        }
    }

    start(callback) {
        if (this.opts.ssr) {
            console.log(chalk.underline.blue('Server Side Render Model is OPEN.'))
        }

        this.wpServer.inject((req, res) => {
            res.type('html');
            if (this.opts.ssr) {
                let gen = require(nps.join(this.tmpPath, 'routes-generator.ssr.js'));
                let routes = gen(require(this.themeDataPath));
                ssr(routes)(req.url, content => {
                    res.send(renderTemplate(this.htmlTempate, {
                        content,
                        root: this.opts.publicPath
                    }))
                });
                return;
            }

            res.send(renderTemplate(this.htmlTempate, {
                content: '',
                root: this.opts.publicPath
            }))
        })
        this.wpServer.start(callback);
    }

    stop(callback) {
        this.clearTmp()
        if (!this.wpServer) {
            // throw new Error('WebpackServer is NOT running currently!')
        }
        this.themeWatcher.close();
        this.wpServer && this.wpServer.stop(callback)
        this.wpServer = null;
    }


}

module.exports = Picidae