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
import chCwdFlow from './lib/utils/chcwd-flow'
import unique from './lib/utils/array-unique'
import boss from './lib/loaders/common/boss'
import summary from './lib/loaders/data-loader/summary-generator'
import ssr from './lib/utils/ssr'
import checkThemeConfig from './lib/utils/check-theme-config-file'
// import createGlobalRequire from './lib/utils/createGlobalRequire'
import * as over from './lib/utils/overwrite-require'
import context from './lib/context'
import {value as defaultConfig, type as picidaeConfigType} from './lib/default-config'
import chokidar from 'chokidar'
import PropTypes from 'prop-types'
import url from 'url'
import chalk from 'chalk'

const isDebug = !!process.env.PICIDAE_DEBUG;
// const require = createGlobalRequire(__dirname)

process.on('uncaughtException', console.error)
process.on('unhandledRejection', err => {
    throw err;
})
over.register()

function webpackConfigGetter(config = {}) {
   // console.log(config.module.loaders)
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
            let key = replace(root.substring(outRoot.length + 1)).replace(/\.(md|markdown)$/i, '')
            // if (nps.basename(key) === 'index') {
            //     // `api/index` -> 'api/'
            //     key = key.replace(/\/index\s*$/, '/');
            // }
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

function assignOption(opts) {
    return assign({}, defaultConfig, opts);
}

class Picidae extends EventEmitter {

    static assignOption = assignOption

    constructor(opts) {
        super();
        context.__init({picidae: this});

        PropTypes.checkPropTypes(picidaeConfigType, opts, 'config', 'Picidae Configuration')

        this.opts = assignOption(opts);
        this.id = this.opts.id || 'ID';

        // process.stdout.write(chalk.yellow(logoText));
        this.tmpPath = nps.join(tmpPath); //, '..', require('md5')(Date.now()).substr(0, 15))
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
                    let pureName = str.replace(/\?.*?$/, '')
                    let moduleName = parseQuery.autoPrefix(pureName, 'picidae-transformer-');
                    let modulePath = '';
                    if (suffix === 'node.js') {
                        try {
                            return {
                                ...parseQuery(str),
                                path: require.resolve(resolve.isNodeModule(str) ? str : nps.resolve(str))
                            }
                        } catch (ex) {
                            if (ex.code !== 'MODULE_NOT_FOUND') {
                                console.error(ex)
                            }
                        }
                    }
                    try {
                        let name = parseQuery.injectJoin(moduleName, suffix)
                        modulePath = resolve(name);

                        if (!fs.isFile(modulePath)) {
                            return false;
                        }
                    } catch (ex) {
                        if (ex.code === 'MODULE_NOT_FOUND') {
                            console.warn(`\`${moduleName}/${suffix}\` transformer is not found.`);
                        }
                        else {
                            console.error(ex)
                        }
                        return false;
                    }

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
            {
                root: this.opts.publicPath,
                themeDataPath: resolve.toUriPath(tmpThemeDataPath),
                dataSuffix: this.id
            },
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
                    try {
                        await this.generateSummary();
                    } catch (ex) {
                        console.error(ex);
                    }
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
            {body: JSON.stringify({root: resolve.toUriPath(root), notFound, routes, themeConfig: config})},
            this.themeDataPath
        );


        this.opts.ssr
        && renderTemplate(
            nps.join(templatePath, 'routes-generator.template.js'),
            {root: resolve.toUriPath(root), /*routesMap: JSON.stringify(routesMap), */dataSuffix: `${this.id}.ssr`},
            nps.join(this.tmpPath, `routes-generator.${this.id}.ssr.js`),
        );

        renderTemplate(
            nps.join(templatePath, 'routes-generator.template.js'),
            {root: resolve.toUriPath(root), /*routesMap: JSON.stringify(routesMap), */dataSuffix: this.id},
            nps.join(this.tmpPath, `routes-generator.${this.id}.js`),
        );
        try {
            await this.generateSummary(plugins);
        } catch (ex) {
            console.error(ex);
            return
        }
    }

    clearTmp() {
        !isDebug &&
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
            let ssrEntryPath = nps.join(this.tmpPath, `routes-generator.${this.id}.ssr.js`)
            ssrWebpackConfig.devtool = null;
            ssrWebpackConfig.entry = {
                [ssrEntryName]: [
                    ssrEntryPath
                ]
            };
            ssrWebpackConfig.target = 'node';
            // // https://github.com/webpack/webpack/issues/1599
            // ssrWebpackConfig.node = {
            //     __dirname: false,
            //     __filename: false
            // };
            ssrWebpackConfig.output = Object.assign({}, ssrWebpackConfig.output, {
                path: this.tmpPath,
                library: 'ssr',
                libraryTarget: 'commonjs',
            });

            const ignorePluginsType = isDebug
                ? [webpack.optimize.CommonsChunkPlugin, webpack.DefinePlugin, webpack.optimize.UglifyJsPlugin]
                : [webpack.optimize.CommonsChunkPlugin, webpack.optimize.UglifyJsPlugin]

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

            let themeSSR = null
            try {
                this.themeSSRPath = resolve(this.themeSSRPath)
                themeSSR = require(this.themeSSRPath)
                console.log('Found ssr module of theme:\n   ', nps.relative(process.cwd(), this.themeSSRPath))
            } catch (ex) {
                if (ex.code !== 'MODULE_NOT_FOUND') {
                    console.error(ex)
                }
                this.themeSSRPath = null
            }

            ssrWebpackConfig.externals = ssrWebpackConfig.externals || []
            if (!Array.isArray(ssrWebpackConfig.externals)) {
                ssrWebpackConfig.externals = [ssrWebpackConfig.externals]
            }

            const configExternals = ssrWebpackConfig.externals
            configExternals.push([
                function (context, request, callback) {
                    if (/^\s*picidae-/.test(request)) {
                        return callback();
                    }
                    if (/^\s*!/.test(request)) {
                        return callback();
                    }
                    if (resolve.isNodeModule(request)) {
                        // external!
                        return callback(null, 'commonjs ' + request);
                    }
                    return callback()
                }
            ])

            const externals = themeSSR && themeSSR.externals
            if (externals) {
                configExternals.push(externals)

                if (isDebug) {
                    console.debug('webpack.externals', ssrWebpackConfig.externals)
                } else {
                    console.log('theme ssr\'s externals: ', externals)
                }
            }

            if (typeof this.opts.ssrWebpackConfigUpdater === 'function') {
                ssrWebpackConfig = this.opts.ssrWebpackConfigUpdater(ssrWebpackConfig)
            }

            const themeNodeModulePath = nps.join(nps.dirname(this.themePath), 'node_modules')
            if (!!ssrWebpackConfig.resolve && !!ssrWebpackConfig.resolve.root) {
                if (!Array.isArray(ssrWebpackConfig.resolve.root)) {
                    ssrWebpackConfig.resolve.root = [ssrWebpackConfig.resolve.root]
                }
                !ssrWebpackConfig.resolve.root.includes(themeNodeModulePath)
                    && ssrWebpackConfig.resolve.root.push(themeNodeModulePath)
            }
            if (!!ssrWebpackConfig.resolveLoader && !!ssrWebpackConfig.resolveLoader.root) {
                if (!Array.isArray(ssrWebpackConfig.resolveLoader.root)) {
                    ssrWebpackConfig.resolveLoader.root = [ssrWebpackConfig.resolveLoader.root]
                }
                !ssrWebpackConfig.resolveLoader.root.includes(themeNodeModulePath)
                    && ssrWebpackConfig.resolveLoader.root.push(themeNodeModulePath)
            }

            const buildMethod = this.opts.ssr ? build : (config, callback) => callback(null);
            buildMethod(ssrWebpackConfig, () => {
                let routes = require(this.themeDataPath).routes;
                let method = (url, callback) => callback('');
                let sitemap = require('./lib/utils/sitemap-generator')
                if (this.opts.ssr) {
                    over.logout()
                    over.register(this.themeSSRPath || void 0)
                    let gen = require(nps.join(this.tmpPath, ssrEntryName)).ssr
                    routes = gen(require(this.themeDataPath));
                    method = ssr(routes, false, this.opts.publicPath);
                }

                const methodProm = function (path) {
                    return new Promise((resolve, reject) => {
                        method(path, (content, props) => {
                            if (content == null) {
                                resolve()
                            }
                            resolve(content)
                        })
                    })
                }

                let sites = sitemap(routes, this.docsEntry);
                let tpl = fs.readFileSync(this.htmlTempate).toString();

                let pool = [];
                pool.push(...sites);

                let count = 1;

                function logPath(path) {
                    count++;
                    console.log(chalk.green(' `' + nps.relative(process.cwd(), path) + '`'), 'File Created successfully.')
                }

                const createProm = (sites, ctxData, opt = {}) => {
                    const {publicPath, dirRoot, templateData} = ctxData;
                    let {noSpider = false} = opt;

                    return Promise.all(
                        sites.map(({path, html}) => {
                            let absoluteHtml = nps.join(dirRoot, html.replace(/^\/+/, ''));
                            sync(nps.dirname(absoluteHtml));
                            return new Promise((resolve, reject) => {
                                method('/' + path.replace(/^\/+/, ''), async (content, renderProps) => {
                                    if (content == null) {
                                        resolve()
                                    }
                                    else {
                                        let opts = {path: absoluteHtml, pathname: path, spider: true};
                                        // try {
                                        let inputArg = {...renderProps}
                                        let themeTemplateData = null;
                                        if (themeSSR && typeof themeSSR === 'function') {
                                            themeTemplateData = themeSSR(inputArg)
                                        }
                                        let actualTemplateData = typeof templateData === 'function' ? templateData(inputArg, 'prod') : templateData;
                                        actualTemplateData = {...actualTemplateData} || {}
                                        actualTemplateData.themeData = themeTemplateData || {}
                                        boss.queue({
                                            type: 'renderHtml',
                                            args: [tpl, {content, root: publicPath, ...actualTemplateData}, opts],
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
                                                                return !pool.find(x => x.path === decodeURIComponent(href))
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

                const ctxData = {
                    dirRoot: this.distRoot,
                    publicPath: this.opts.publicPath,
                    templateData: this.opts.templateData
                };
                createProm(sites, ctxData, {noSpider: this.opts.noSpider})
                    .then(async () => {
                        over.logout()
                        boss.jobDone();
                        let src = nps.resolve(this.opts.extraRoot);
                        let target = nps.join(this.distRoot);

                        console.log('');
                        console.log(chalk.green(` ${count}`), 'Files Created successfully\n');

                        // precache services-worker.js
                        if (!this.opts.noSw) {
                            await require('sw-precache').write(nps.join(this.distRoot, 'service-worker.js'), {
                                staticFileGlobs: [nps.join(this.distRoot, '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}')],
                                stripPrefix: this.distRoot,
                                navigateFallback: nps.join(this.opts.publicPath, 'index.html'),
                                replacePrefix: this.opts.publicPath.replace(/\/+$/, ''),
                                templateFilePath: nps.join(templatePath, 'service-worker.tmpl'),
                                logger: message => {
                                    console.log(message)
                                },
                                maximumFileSizeToCacheInBytes: 4194304 // 4MB
                            })
                        }

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
        let theme = parseQuery.autoPrefix(this.opts.theme, 'picidae-theme-')
        let themeKey = resolve.isNodeModule(this.opts.theme)
            ? theme : 'default'
        let themePath = this.themePath = resolve.isNodeModule(this.opts.theme)
            ? resolve(theme) : nps.join(resolve(this.opts.theme), 'index.js');
        this.themeSSRPath = resolve.isNodeModule(theme)
            ? parseQuery.injectJoin(theme, 'ssr.js')
            : parseQuery.injectJoin(theme, 'ssr.js')

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

        let themeConfigOrigin = require(themePath).default || require(themePath)
        checkThemeConfig(themeConfigOrigin)
        let {
            root,
            routes,
            notFound,
            picker,
            config: themeConfig = {},
            plugins = []
        } = themeConfigOrigin;

        chCwdFlow(nps.dirname(themePath), () => {
            plugins = ['utils'].concat(plugins);
            plugins = plugins.map(f =>
                parseQuery(f, 'picidae-plugin-')
            );
            root = nps.resolve(root)
        });

        this.opts.picker = picker;
        try {
            themeConfig = require(themeConfigFile)
        } catch (ex) {
            if (ex && 'MODULE_NOT_FOUND' !== ex.code) {
                console.error(ex)
            }
            themeConfigFile = themePath;
        }
        console.log(chalk.gray('Theme Configuration In File: '))
        console.log('    ', chalk.green(nps.relative(process.cwd(), require.resolve(themeConfigFile))))

        this.opts.themeConfig = themeConfig;

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
        this.wpServer.inject(async (req, res) => {
            res.type('html');

            let templateData = this.opts.templateData || {}
            templateData = typeof templateData === 'function' ? await templateData({}, 'dev') : {...templateData};
            // Fake ThemeData
            templateData.themeData = {}

            if (this.opts.ssr) {
                let gen = require(nps.join(this.tmpPath, `routes-generator.${this.id}.ssr.js`));
                let routes = gen(require(this.themeDataPath));
                ssr(routes, true, this.opts.publicPath)(req.url, content => {
                    res.send(renderTemplate(this.htmlTempate, {
                        content,
                        root: this.opts.publicPath,
                        ...templateData
                    }))
                });
                return;
            }

            res.send(renderTemplate(this.htmlTempate, {
                content: '',
                root: this.opts.publicPath,
                ...templateData
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
