var assert = require('assert')
var WebpackServer = require('../lib/lib/webpack-server').default
var fixturePath = require('./utils').fixturePath

// describe('lib/webpack-server', function () {
    var opt = {
        webpackConfigGetter(config) {
            config.entry = {
                app: require.resolve(fixturePath('webpack-server/entry-1.js'))
            }
            return config;
        }
    };
    var wps = new WebpackServer(opt)

    // it('server should be started successfully', function () {
        wps.start(function (err) {
            // assert(err, null)
        })
//     })
// })