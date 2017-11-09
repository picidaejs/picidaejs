import {EventEmitter} from 'events'
import {sync} from 'mkdirp'
import nps from 'path'
import WebpackServer from './lib/webpack-server'
import webpack from 'webpack'
import build from './lib/webpack-server/build'
import fs from './lib/utils/fs'
import Error from './lib/utils/Error'
import assign from './lib/utils/array-append-assign'
import {fileIsMarkdown, renderTemplate} from './lib/utils'
import {tmpPath, templatePath} from './lib/utils/context'
import console from './lib/utils/console'
import resolve from './lib/utils/resolve-path'
import file2Tree from './lib/utils/files-to-tree'
import {toRobots, toSitemap} from './lib/utils/seo-helper'
import each from './lib/utils/each'
import parseQuery from './lib/utils/parse-query'
import match from './lib/utils/rule-match'
import unique from './lib/utils/array-unique'
import boss from './lib/loaders/common/boss'
import summary from './lib/loaders/data-loader/summary-generator'
import ssr from './lib/utils/ssr'
// import writeHtml from './lib/utils/write-html'
import context from './lib/context'
import defaultConfig from './lib/default-config'
import chokidar from 'chokidar'
import url from 'url'
const chalk = require('chalk');

const logoText = fs.readFileSync(nps.join(__dirname, 'lib/logo')).toString();

function webpackConfigGetter(config = {}) {

    // if (config.module && config.module.loaders) {
    //     config.module.loaders.push({
    //         test: filename => {
    //             return /\.(md|markdown)\.js/.test(filename) || fileIsMarkdown(filename)
    //         },
    //         excludes: [/(node_modules|bower_components)/],
    //         loader: ,
    //         // query: JSON.stringify({transformers, filesMap})
    //     })
    // }
    return config;
}

function looseRoutesMap(map = {}) {
    Object.keys(map).forEach(key => {
        map[key.replace(/^\/+/, '').replace(/\/+$/, '')] = map[key]
    })
    return map;
}

function generateEntry(fileTree, routesMap = {}) {
    if (typeof routesMap !== 'function') {
        routesMap = looseRoutesMap(routesMap);
    }
    // console.log(routesMap);
    function replace(pathname) {
        if (typeof routesMap === 'function') {
            return routesMap(pathname) || pathname;
        }

        let matched = false;
        return pathname
            .split('/')
            .map(chunk => {
                // console.log(chunk);
                if (!matched) {
                    if (routesMap[chunk]) {
                        matched = true;
                    }
                    return typeof routesMap[chunk] === 'string' ? routesMap[chunk] : chunk;
                }
                else {
                    return chunk;
                }
            })
            .join('/')
            .replace(/\/\//, '/');
    }

    function generateKey(container = {}, key) {
        let id = 1;
        let newKey = key;
        while (newKey in container) {
            newKey = key + '-' + id++;
        }
        return newKey;
    }

    function generateEntryInner(root, fileTree, container = {}) {
        if (fileTree.files) {
            fileTree.files.forEach(ent => {
                generateEntryInner(nps.join(root, ent.file), ent, container);
            })
        }
        else {
            let key = replace(root/*.replace(/\..*$/, '')*/.substring(outRoot.length + 1)).replace(/\.(md|markdown)$/i, '')
            if (nps.basename(key) === 'index') {
                // ignore `index`
                key = key.replace(/\/index\s*$/, '');
            }
            container[generateKey(container, key)] = {
                path: root,
                lastmod: fileTree.lastmod
            }
        }
        return container;
    }

    let outRoot = fileTree.file
    /*.replace(/\..*$/, '');*/
    return generateEntryInner(fileTree.file, fileTree);
}

class Picidae extends EventEmitter {
    static assignOption(opts) {
        return assign({}, defaultConfig, opts);
    }

    constructor(opts) {
        super();

        context.__init({picidae: this});
        this.opts = Picidae.assignOption(opts);
        this.id = this.opts.id || 'ID';

        process.stdout.write(chalk.yellow(logoText));

        this.tmpPath = nps.join(tmpPath) //, '..', require('md5')(Date.now()).substr(0, 15))
        sync(this.tmpPath);
        let entryFile = nps.join(this.tmpPath, `entry.${this.id}.js`);
        let tmpThemeDataPath = nps.join(this.tmpPath, `theme-data.${this.id}.js`);
        let tplHtmlPath = nps.join(templatePath, 'template.html');
        let customTplHtmlPath = nps.join(this.opts.templateRoot, 'index.html')
        sync(this.opts.templateRoot);

        !fs.existsSync(customTplHtmlPath) && fs.copySync(tplHtmlPath, customTplHtmlPath);

        this.htmlTempate = customTplHtmlPath;
        this.themeDataPath = tmpThemeDataPath;
        this.docPath = nps.resolve(this.opts.docRoot);
        this.distRoot = nps.resolve(this.opts.distRoot);

        // initial webpackServer
        this.wpServer = new WebpackServer({
            ...this.opts,
            static: nps.resolve(this.opts.extraRoot),
            dev: this.opts.watch,
            webpackConfigGetter: config => {
                config.entry = {
                    ...config.entry,
                    PICIDAE_ENTRY: entryFile,
                    // ...generateEntry(tree)
                }
                config.output.publicPath = this.opts.publicPath || config.output.publicPath;
                config.output.path = this.distRoot;

                if (this.opts.webpackConfigUpdater) {
                    config = this.opts.webpackConfigUpdater(config, require('webpack'))
                }
                config = webpackConfigGetter(config);
                return config;
            }
        });



        this.opts.transformers = this.opts.transformers || [];

        function getTransformers(transformers, suffix) {
            return transformers
                .map(str => {
                    let moduleName = parseQuery.autoPrefix(str.replace(/\?.*?$/, ''), 'picidae-transformer-');
                    let modulePath = '';
                    try {
                        let name = parseQuery.injectJoin(moduleName, suffix)
                        modulePath = resolve(name);

                        if (!fs.isFile(modulePath)) {
                            return false;
                        }
                    } catch (ex) {
                        console.warn(`\`${moduleName}/${suffix}\` transformer is not found.`);
                        return false;
                    };
                    return parseQuery(
                        parseQuery.injectJoin(str, suffix), 'picidae-transformer-', {allowNotExists: true}
                    )
                })
                .filter(Boolean);
        }

        this.nodeTransformers = getTransformers(this.opts.transformers, 'node.js')
        this.browserTransformers = getTransformers(this.opts.transformers, 'browser.js');

        this.watchTheme()
            .then(() => this.watchSummary())


        // Write Files for Webpack
        renderTemplate(
            nps.join(templatePath, 'entry.template.js'),
            {root: this.opts.publicPath, themeDataPath: tmpThemeDataPath, dataSuffix: this.id},
            entryFile
        );

    }

    async generateSummary(plugins = this.initialThemeConfig().plugins) {
        this.summaryPath = nps.join(this.tmpPath, `data.${this.id}.js`);
        this.summarySSrPath = nps.join(this.tmpPath, `data.${this.id}.ssr.js`);
        let tree = file2Tree(this.docPath, filename => {
            return fileIsMarkdown(filename) && !match(this.opts.excludes, filename)
        });
        this.docsEntityEntry = generateEntry(tree, this.routesMap);

        this.docsEntry = {};
        each(this.docsEntityEntry, ({path}, key, index, data) => {
            this.docsEntry[key] = path;
        });

        let opt = {
            plugins,
            transformers: this.browserTransformers,
            nodeTransformers: this.nodeTransformers,
            picker: this.opts.picker || (a => a),
            docRoot: this.docPath
        };

        if (this.opts.ssr) {
            let result = await summary(this.docsEntry, opt, false);
            let str = fs.readFileSync(nps.join(templatePath, 'data-ssr.template.js')).toString();
            fs.writeFileSync(this.summarySSrPath, str + '\nmodule.exports = ' + result);
        }

        let lazyresult = await summary(this.docsEntry, opt, true);

        // console.log(`\`${nps.resolve(process.cwd(), this.summaryPath)}\` Updated.`)
        fs.writeFileSync(this.summaryPath, 'module.exports = ' + lazyresult);
    }

    watchSummary() {

        if (this.opts.watch) {
            this.summaryLock = false;
            this.summaryWatcher = chokidar.watch(this.docPath, {ignoreInitial: true});
            this.summaryWatcher.on('all', async (event, path) => {
                if (match(this.opts.hotReloadTests, path)) {
                    console.log('Detect File ' + event + ' :', nps.relative(this.docPath, path));
                    await this.generateSummary();
                    this.summaryLock = true;
                }
            });
        }
    }

    async watchTheme() {
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


        this.opts.ssr
        && renderTemplate(
            nps.join(templatePath, 'routes-generator.template.js'),
            {root, /*routesMap: JSON.stringify(routesMap), */dataSuffix: `${this.id}.ssr`},
            nps.join(this.tmpPath, `routes-generator.${this.id}.ssr.js`),
        );

        renderTemplate(
            nps.join(templatePath, 'routes-generator.template.js'),
            {root, /*routesMap: JSON.stringify(routesMap), */dataSuffix: this.id},
            nps.join(this.tmpPath, `routes-generator.${this.id}.js`),
        );

        await this.generateSummary(plugins);
    }

    clearTmp() {
        require('del').sync([nps.join(this.tmpPath, `*${this.id}*`)], {force: true});
    }

    build(callback) {
        console.log(chalk.green('Building...'));
        if (this.opts.force) {
            console.log(chalk.red(' FORCE Mode is OPEN'));
            require('del').sync([nps.join(this.distRoot, '*'), '!' + nps.join(this.distRoot, '.git')], {force: true});
        }
        if (!this.opts.ssr) {
            console.log(chalk.red(' SSR Mode is CLOSED'));
        }
        if (!this.opts.noSpider) {
            console.log(chalk.green(' Spider Mode is OPEN'));
        }

        let webpackConfig = this.wpServer.getWebpackConfig();
        if (this.opts.sourceMap) {
            webpackConfig.devtool = 'source-map'
        }
        build(webpackConfig, () => {
            console.log(chalk.green('\n Webpack Build successfully.') + '\n');

            // let
            let ssrWebpackConfig = webpackConfig;
            let ssrEntryName = `node-routes-generator.${this.id}`;

            ssrWebpackConfig.devtool = null;
            ssrWebpackConfig.entry = {
                [ssrEntryName]: nps.join(this.tmpPath, `routes-generator.${this.id}.ssr.js`)
            };
            ssrWebpackConfig.target = 'node';
            ssrWebpackConfig.output = Object.assign({}, ssrWebpackConfig.output, {
                path: this.tmpPath,
                library: 'ssr',
                libraryTarget: 'commonjs',
            });

            const isDebug = !!process.env.PICIDAE_DEBUG;
            const ignorePluginsType = isDebug
                ? [webpack.optimize.CommonsChunkPlugin, webpack.DefinePlugin, webpack.optimize.UglifyJsPlugin]
                : [webpack.optimize.CommonsChunkPlugin]

            ssrWebpackConfig.plugins = ssrWebpackConfig.plugins
                .filter(plugin =>
                    ignorePluginsType.findIndex(Type => plugin instanceof Type) < 0
                )

            if (isDebug) {
                ssrWebpackConfig.debug = true
                ssrWebpackConfig.plugins.push(
                    new webpack.DefinePlugin({
                        'process.env.NODE_ENV': '"development"'
                    })
                )
            }

            const buildMethod = this.opts.ssr ? build : (config, callback) => callback(null);
            buildMethod(ssrWebpackConfig, () => {
                let routes = require(this.themeDataPath).routes;
                let method = (url, callback) => callback('');
                let sitemap = require('./lib/utils/sitemap-generator')
                if (this.opts.ssr) {
                    let gen = require(nps.join(this.tmpPath, ssrEntryName)).ssr
                    routes = gen(require(this.themeDataPath));
                    method = ssr(routes, false, this.opts.publicPath);
                }

                let sites = sitemap(routes, this.docsEntry);
                let tpl = fs.readFileSync(this.htmlTempate).toString();

                let pool = [];
                pool.push(...sites);

                let count = 1;

                function logPath(path) {
                    count++;
                    console.log(chalk.green(' `'+ nps.relative(process.cwd(), path) +'`'), 'File Created successfully.')
                }

                const createProm = (sites, ctxData, opt = {}) => {
                    const {publicPath, dirRoot, templateData} = ctxData;
                    let {noSpider = false} = opt;

                    return Promise.all(
                        sites.map(({path, html}) => {
                            let absoluteHtml = nps.join(dirRoot, html.replace(/^\/+/, ''));
                            sync(nps.dirname(absoluteHtml));
                            return new Promise((resolve, reject) => {
                                method('/' + path.replace(/^\/+/, ''), content => {
                                    if (content == null) {
                                        resolve()
                                    }
                                    else {
                                        let opts = {path: absoluteHtml, pathname: path, spider: true};
                                        boss.queue({
                                            type: 'renderHtml',
                                            args: [tpl, {content, root: publicPath, ...templateData}, opts],
                                            callback(err, obj) {
                                                if (err || !obj) resolve();
                                                else {
                                                    logPath(obj.path);
                                                    if (!noSpider) {
                                                        let newSites = obj.hrefList
                                                            .map(href => {
                                                                if (href.startsWith(publicPath)) {
                                                                    href = href.substring(publicPath.length)
                                                                    href = href.startsWith('/') ? href : ('/' + href);
                                                                }
                                                                return href
                                                            })
                                                            .filter(href => {
                                                                return !pool.find(x => x.path === href)
                                                            });
                                                        newSites = newSites.map(sitemap.transform);
                                                        if (newSites && newSites.length) {
                                                            console.log(path, '->', newSites);
                                                            pool = pool.concat(newSites);
                                                            resolve(createProm(newSites, ctxData, {noSpider}))
                                                            return;
                                                        }
                                                    }
                                                    resolve(obj.path);
                                                }
                                            }
                                        });
                                    }
                                })
                            })
                            .catch(console.error);
                        })
                    )
                };

                const ctxData = {dirRoot: this.distRoot, publicPath: this.opts.publicPath, templateData: this.opts.templateData};
                createProm(sites, ctxData, {noSpider: this.opts.noSpider})
                    .then(() => {
                        boss.jobDone();
                        let src = nps.resolve(this.opts.extraRoot);
                        let target = nps.join(this.distRoot);

                        console.log('');
                        console.log(chalk.green(` ${count}`), 'Files Created successfully\n');

                        if (this.opts.ssr && this.opts.host) {
                            if (this.docsEntityEntry['index']) {
                                this.docsEntityEntry[''] = this.docsEntityEntry['index'];
                                delete this.docsEntityEntry['index'];
                            }
                            let sites = [];
                            each(this.docsEntityEntry, (val, key) => {
                                sites.push({
                                    loc: key,
                                    lastmod: val.lastmod
                                })
                            });

                            const host = url.resolve(this.opts.host, this.opts.publicPath);
                            sites = unique(
                                sites.concat(
                                    pool.filter(({path}) => path !== 'NOT_FOUND_PAGE')
                                        .map(({path}) => path.replace(/^\/*/, ''))
                                ),
                                obj => typeof obj === 'string' ? obj : obj.loc
                            );
                            const sitemapText = toSitemap({host, minify: true, sites});
                            const robotsText = toRobots(host);
                            const writeFile = (filename, data, logText) => {
                                fs.writeFileSync(filename, data);
                                console.log(chalk.cyan(logText), 'File Created');
                            };
                            writeFile(nps.join(this.distRoot, 'robots.txt'), robotsText, 'robots.txt');
                            writeFile(nps.join(this.distRoot, 'sitemap.xml'), sitemapText, 'sitemap.xml');
                        }


                        if (fs.existsSync(src) && fs.statSync(src).isDirectory()) {
                            console.log(chalk.green(' Copying Extra Directory'));
                            sync(target);
                            require('copy-dir').sync(src, target);
                        }

                        console.log(chalk.green(' Done!  :P'));
                        callback && callback();
                    })
                    .catch(console.error);

            });
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
            picker,
            config: themeConfig = {},
            plugins = []
        } = require(themePath) || require(themePath).default;
        plugins = ['utils'].concat(plugins);
        plugins = plugins.map(f =>
            parseQuery(f, 'picidae-plugin-')
        );
        this.opts.picker = picker;

        try {
            themeConfig = require(themeConfigFile)
        } catch (ex) {
            themeConfigFile = themePath;
        }
        console.log(chalk.gray('Theme Configuration In File: '))
        console.log('    ', chalk.green(nps.relative(process.cwd(), require.resolve(themeConfigFile))))

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

        this.wpServer.start(callback);
        if (typeof this.opts.expressSetup === 'function') {
            this.opts.expressSetup(this.wpServer.app);
        }
        this.wpServer.inject((req, res) => {
            res.type('html');
            if (this.opts.ssr) {
                let gen = require(nps.join(this.tmpPath, `routes-generator.${this.id}.ssr.js`));
                let routes = gen(require(this.themeDataPath));
                ssr(routes, true, this.opts.publicPath)(req.url, content => {
                    res.send(renderTemplate(this.htmlTempate, {
                        content,
                        root: this.opts.publicPath,
                        ...this.opts.templateData
                    }))
                });
                return;
            }

            res.send(renderTemplate(this.htmlTempate, {
                content: '',
                root: this.opts.publicPath,
                ...this.opts.templateData
            }))
        });
    }

    stop(callback) {
        if (!this.wpServer) {
            // throw new Error('WebpackServer is NOT running currently!')
        }
        this.clearTmp();
        this.themeWatcher && this.themeWatcher.close();
        this.themeWatcher = null;
        this.summaryWatcher && this.summaryWatcher.close();
        this.summaryWatcher = null
        this.wpServer && this.wpServer.stop(callback)
        this.wpServer = null;
    }


}

module.exports = Picidae