import express from 'express'
import {EventEmitter} from 'events'
import serverMaker from './serverMaker'
import Error from '../utils/Error'
import getWebpackConfig from './getWebpackConfig'
import webpackConfigUpdater from './webpackConfigUpdater'
import console from '../utils/console'

export const defaultWebpackConfig = getWebpackConfig({ cwd: process.cwd() })

export default class WPServer {
    static defaultOptions = {
        port: 8989,
        webpackConfigGetter: config => config,
        verbose: true,
    }


    /**
     *
     * @param opt
     */
    constructor(opt) {
        opt = {
            ...WPServer.defaultOptions,
            ...opt,
        }
        this.opt = opt;

        this.app = serverMaker({
            verbose: this.opt.verbose,
            webpackConfig: webpackConfigUpdater(this.opt.webpackConfigGetter(defaultWebpackConfig))
        })
    }

    inject(routerPatternOrRequestHandler, requestHandler) {
        if (typeof routerPatternOrRequestHandler === 'string') {
            this.app.use(routerPatternOrRequestHandler, requestHandler);
        }
        else if (typeof routerPatternOrRequestHandler === 'function') {
            this.app.use(routerPatternOrRequestHandler);
        }

        return this;
    }

    start(callback) {
        this._server = this.app.listen(this.opt.port, err => {
            let port = this._server.address().port;
            if (port && this.opt.verbose) {
                console.log(' WebpackServer run on http://localhost:' + port + '/');
            }
            callback && callback(err, port);
        })
        return this;
    }

    stop(callback) {
        if (this._server) {
            this._server.close(callback)
            this._server = void 0
        }
        else {
            callback(new Error('WebpackServer isn\'t running'))
        }
        return this;
    }

}