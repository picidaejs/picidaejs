const express = require('express');
const {EventEmitter} = require('events')

export const defaultWebpackConfig = {
    
}

export default class WPServer extends EventEmitter {
    static defaultOptions = {
        port: 8989,
        webpackConfigGetter: config => config
    }

    /**
     *
     * @param opt
     */
    constructor(opt) {
        opt = {
            ...opt,
            ...WPServer.defaultOptions
        }
        super(opt);
        this.opt = opt;
    }


    start() {

    }
}