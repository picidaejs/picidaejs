import { EventEmitter } from 'events'
import {sync} from 'mkdirp'
import nps from 'path'
import WebpackServer from './lib/webpack-server'
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
                generateEntryInner(root, ent, container);
            })
        }
        else {
            container[fileTree.file] = nps.join(root, fileTree.file)
        }
        return container;
    }

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

        let tree = file2Tree(this.docPath, filename => {
            return fileIsMarkdown(filename) && !match(this.opts.excludes, filename)
        });

        const watchTheme = () => {
            const {
                themeConfigFiles,
                root,
                notFound,
                routes,
                themeConfig
            } = this.initialThemeConfig();

            try {
                delete require.cache[require.resolve(tmpThemeDataPath)]
            } catch (ex) {}

            // initial Watcher
            if (this.opts.watch && themeConfigFiles.length) {
                this.watchTheme = chokidar.watch(themeConfigFiles, {persistent: true, ignoreInitial: true})
                this.watchTheme.on('all', (event, path, stat) => {
                    console.log(path, ':', event);
                    this.watchTheme.close();
                    this.watchTheme = null;
                    watchTheme();
                })
            }

            // Write Routes/ThemeConfig to file
            renderTemplate(
                nps.join(templatePath, 'commonjs.template.js'),
                {body: JSON.stringify({root, notFound, routes, themeConfig})},
                tmpThemeDataPath
            );

            renderTemplate(
                nps.join(templatePath, 'routes-generator.template.js'),
                {root},
                nps.join(tmpPath, 'routes-generator.js'),
            );
        }
        watchTheme();

        this.webpackConfigGetter = config => {
            config = webpackConfigGetter(config);
            config.entry = {
                ...config.entry,
                app: entryFile,
                ...generateEntry(tree)
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
            webpackConfigGetter: this.webpackConfigGetter
        });
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
            console.log(themeConfigFile)
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
            let routes = routesGenerator(require(this.themeDataPath))
            ssr(routes)(req.url, content => {
                res.type('html');
                res.send(renderTemplate(this.htmlTempate, {
                    content,
                    root: this.opts.publicPath
                }))
            })
        })
        this.wpServer.start(callback);
    }

    stop(callback) {
        if (!this.wpServer) {
            throw new Error('WebpackServer is NOT running currently!')
        }
        this.watchTheme.close()
        this.wpServer.stop(callback)
        this.wpServer = null;
    }


}

module.exports = Picidae