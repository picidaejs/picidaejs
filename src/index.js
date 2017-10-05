import { EventEmitter } from 'events'
import {sync} from 'mkdirp'
import nps from 'path'
import WebpackServer from './lib/webpack-server'
import build from './lib/webpack-server/build'
import fs from './lib/utils/fs'
import Error from './lib/utils/Error'
import defaultConfig from './lib/default-config'
import assign from './lib/utils/array-append-assign'
import { fileIsMarkdown, renderTemplate } from './lib/utils'
import { tmpPath, templatePath } from './lib/utils/context'
import console from './lib/utils/console'
import resolve from './lib/utils/resolve-path'
import file2Tree from './lib/utils/files-to-tree'
import match from './lib/utils/rule-match'
import summary from './lib/loaders/data-loader/summary-generator'
import boss from './lib/loaders/common/boss'

import ssr from './lib/utils/ssr'
import routesGenerator from './lib/utils/routesGenerator'

import chokidar from 'chokidar'

function webpackConfigGetter(config = {}) {
    if (config.module && config.module.loaders) {
        config.module.loaders.push({
            test: fileIsMarkdown,
            excludes: [/(node_modules|bower_components)/],
            loader: require.resolve('./lib/loaders/markdown-loader')
        })
    }
    return config;
}

function generateEntry(fileTree) {
    function generateEntryInner(root, fileTree, container = {}) {
        if (fileTree.files) {
            fileTree.files.forEach(ent => {
                generateEntryInner(nps.join(root, ent.file), ent, container);
            })
        }
        else {
            container[root.substring(outRoot.length + 1)] = root
        }
        return container;
    }

    let outRoot = fileTree.file;
    return generateEntryInner(fileTree.file, fileTree);
}

class Picidae extends EventEmitter {

    constructor(opts) {
        super();
        this.opts = assign({}, defaultConfig, opts);

        let entryFile = nps.join(tmpPath, 'entry.js');
        let tmpThemeDataPath = nps.join(tmpPath, 'theme-data.js');
        let tplHtmlPath = nps.join(templatePath, 'template.html');
        let customTplHtmlPath = nps.join(this.opts.templateRoot, 'index.html')
        sync(tmpPath);
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

    generateSummary(callback) {
        this.summaryPath = nps.join(tmpPath, 'data.js');
        let tree = file2Tree(this.docPath, filename => {
            return fileIsMarkdown(filename) && !match(this.opts.excludes, filename)
        });
        // console.log(this.opts.picker && this.opts.picker.toString());
        boss.queue({
            type: 'summary',
            args: [generateEntry(tree), this.opts.picker && this.opts.picker.toString()],
            callback: (err, result) => {
                console.log(`\`${this.summaryPath}\` Updated.`)
                fs.writeFileSync(this.summaryPath, 'module.exports = ' + result);

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
                    this.generateSummary(() => {
                        this.summaryLock = true;
                    })
                }
            });
        }
        else {
            this.generateSummary();
        }
    }

    watchTheme = () => {
        const {
            themeConfigFiles,
            root,
            notFound,
            routes,
            themeConfig
        } = this.initialThemeConfig();

        try {
            delete require.cache[require.resolve(this.themeDataPath)]
        } catch (ex) {}

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
        const {routesMap = {}, ...config} = themeConfig
        renderTemplate(
            nps.join(templatePath, 'commonjs.template.js'),
            {body: JSON.stringify({root, notFound, routes, themeConfig: config})},
            this.themeDataPath
        );

        renderTemplate(
            nps.join(templatePath, 'routes-generator.template.js'),
            {root, routesMap: JSON.stringify(routesMap)},
            nps.join(tmpPath, 'routes-generator.js'),
        );
    }

    build() {
        // let routes = routesGenerator(require(this.themeDataPath))
        // ssr(routes)()

        build(this.wpServer.getWebpackConfig(), function () {
            console.log('Build successfully.');
            boss.jobDone();
        })
    }

    initialThemeConfig() {
        let themeKey = resolve.isNodeModule(this.opts.theme) ? this.opts.theme : 'default';
        let themePath = resolve(this.opts.theme);

        let themeConfigsRoot = nps.resolve(this.opts.themeConfigsRoot);
        let themeConfigFile = nps.join(themeConfigsRoot, themeKey);
        let themeConfigFiles = [themePath, themeConfigFile];

        if (this.opts.watch) {
            try {
                delete require.cache[require.resolve(themePath)];
                delete require.cache[require.resolve(themeConfigFile)];
            } catch (ex) {}
        }

        let {
            root,
            routes,
            notFound,
            config: themeConfig = {}
        } = require(themePath) || require(themePath).default;

        try {
            themeConfig = require(themeConfigFile)
        } catch (ex) {
            themeConfigFile = themePath;
        }
        console.log('Theme Configuration In File: ')
        console.log('       ', require.resolve(themeConfigFile))

        this.opts.themeConfig = themeConfig;
        root = nps.join(themePath, root);

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
            themeConfig
        }
    }

    start(callback) {
        this.wpServer.inject((req, res) => {
            // let routes = routesGenerator(require(this.themeDataPath))
            res.type('html');
            res.send(renderTemplate(this.htmlTempate, {
                content: '',
                root: this.opts.publicPath
            }))
        })
        this.wpServer.start(callback);
    }

    stop(callback) {
        if (!this.wpServer) {
            throw new Error('WebpackServer is NOT running currently!')
        }
        this.themeWatcher.close()
        this.wpServer.stop(callback)
        this.wpServer = null;
    }


}

module.exports = Picidae