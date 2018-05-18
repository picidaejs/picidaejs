var nps = require('path')
var fs = require('fs')

var build = require('../../lib/lib/webpack-server/build').default

var ssrEntryPath = nps.join(__dirname, 'ssr/entry.js')


var opt = {
    webpackConfigUpdater(config) {
        config.entry = {
            ssr: ssrEntryPath
        }
        return config;
    },
    dev: true
};

build(opt)

