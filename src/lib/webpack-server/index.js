import express from 'express'
import {EventEmitter} from 'events'
import serverMaker from './serverMaker'
import Error from '../utils/Error'
import getWebpackConfig from './getWebpackConfig'
import webpackConfigGetter from './webpackConfigGetter'
import console from '../utils/console'

export const defaultWebpackConfig = getWebpackConfig({ cwd: process.cwd() })

export default class WPServer {
    static defaultOptions = {
        port: 8989,
        webpackConfigGetter: webpackConfigGetter,
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
            webpackConfig: this.opt.webpackConfigGetter(defaultWebpackConfig)
        })
    }


    start(callback) {
        this._server = this.app.listen(this.opt.port, err => {
            let port = this._server.address().port;
            if (port && this.opt.verbose) {
                console.log('WebpackServer run on http://localhost:' + port + '/');
            }
            callback && callback(err, port);
        })
    }

    stop(callback) {
        this.removeAllListeners();
        if (this._server) {
            this._server.close(callback)
        }
        else {
            let err = new Error('No server currently running.')
            callback(err)
        }
    }
}