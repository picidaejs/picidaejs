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
        const defaultWebpackConfig = getWebpackConfig({ cwd: process.cwd(), dev: this.opt.dev })
        this.webpackConfig = webpackConfigUpdater(this.opt.webpackConfigGetter(defaultWebpackConfig), this.opt.dev)
    }

    getWebpackConfig() {
        return this.webpackConfig;
    }


    injectList = []

    setInjected() {
        if (this.app && this.injectList.length) {
            this.injectList.forEach(args => this.app.use.apply(this.app, args));
            this.injectList = []
        }
    }

    inject(routerPatternOrRequestHandler, requestHandler) {
        this.setInjected();

        if (typeof routerPatternOrRequestHandler === 'string') {
            if (!this.app) {
                this.injectList.push([routerPatternOrRequestHandler, requestHandler])
            }

            this.app && this.app.use(routerPatternOrRequestHandler, requestHandler);
        }
        else if (typeof routerPatternOrRequestHandler === 'function') {
            if (!this.app) {
                this.injectList.push([routerPatternOrRequestHandler])
            }
            this.app && this.app.use(routerPatternOrRequestHandler);
        }

        return this;
    }

    start(callback) {
        if (this._server) {
            throw new Error('WebpackServer is running currently!')
        }
        this.app = serverMaker({
            verbose: this.opt.verbose,
            staticPath: fs.isDirectory(this.opt.static) && this.opt.static,
            webpackConfig: this.webpackConfig
        });
        this.setInjected();

        this._server = this.app.listen(this.opt.port, err => {
            let port = this._server.address().port;
            if (port && this.opt.verbose) {
                console.log(' WebpackServer run on', chalk.underline.red(`${'http://localhost:' + port + '/'}`) );
            }
            callback && callback(err, port);
        })
        return this;
    }

    stop(callback) {
        if (this._server) {
            this._server.close(callback)
            this._server = void 0
            this.app = void 0;
        }
        else {
            callback(new Error('WebpackServer isn\'t running'))
        }
        return this;
    }

}