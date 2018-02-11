import {EventEmitter} from 'events'
import serverMaker from './serverMaker'
import Error from '../utils/Error'
import getWebpackConfig from './getWebpackConfig'
import webpackConfigUpdater from './webpackConfigUpdater'
import console from '../utils/console'
import chalk from 'chalk'
import fs from '../utils/fs'

export default class WebpackServer {
    static defaultOptions = {
        port: 8989,
        publicPath: '/',
        webpackConfigGetter: config => config,
        verbose: true,
        static: null,
        dev: true
    }


    /**
     *
     * @param opt
     */
    constructor(opt) {
        opt = {
            ...WebpackServer.defaultOptions,
            ...opt,
        }
        this.opt = opt;
        const defaultWebpackConfig = getWebpackConfig({ cwd: process.cwd(), dev: this.opt.dev, publicPath: opt.publicPath })
        this.webpackConfig = webpackConfigUpdater(this.opt.webpackConfigGetter(defaultWebpackConfig), this.opt.dev)
    }

    getWebpackConfig() {
        return this.webpackConfig;
    }


    injectList = [];

    useInjected() {
        if (this.app && this.app._listening && this.injectList.length) {
            this.injectList.forEach(args => this.app.use.apply(this.app, args));
            this.injectList = []
        }
    }

    inject(routerPatternOrRequestHandler, requestHandler) {
        if (typeof routerPatternOrRequestHandler === 'string') {
            this.injectList.push([routerPatternOrRequestHandler, requestHandler])
        }
        else if (typeof routerPatternOrRequestHandler === 'function') {
            this.injectList.push([routerPatternOrRequestHandler])
        }

        this.useInjected();
        return this;
    }

    start(callback) {
        if (this.app && this.app._server) {
            throw new Error('WebpackServer is running currently!')
        }
        this.app = serverMaker({
            port: this.opt.port,
            callback: (err, port) => {
                callback && callback(err, port);
                this.useInjected();
            },
            verbose: this.opt.verbose,
            static: [this.opt.publicPath, fs.isDirectory(this.opt.static) && this.opt.static],
            webpackConfig: this.webpackConfig
        });

        return this;
    }

    stop(callback) {
        if (this.app && this.app._server) {
            this.app._server.close(callback);
            this.app._server = void 0;
            this.app = void 0;
        }
        else {
            callback(new Error('WebpackServer isn\'t running'))
        }
        return this;
    }

}
