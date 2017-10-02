var assert = require('assert')
var nps = require('path')
var nunjucks = require('nunjucks')
var fs = require('fs')

var WebpackServer = require('../../lib/lib/webpack-server').default
var fixturePath = require('../utils').fixturePath

var ssrEntryPath = nps.join(__dirname, 'ssr/entry.js')
var ssrTemplatePath = nps.join(__dirname, 'template.html')

var tpl = fs.readFileSync(ssrTemplatePath, {encoding: 'utf8'})

var opt = {
    webpackConfigGetter(config) {
        config.entry = {
            app: nps.join(__dirname, 'custom-loader/entry.js'),
            // ssr: ssrEntryPath
        }
        config.module.loaders.push(
            {
                test: function (name) {
                    if (name.includes('custom-loader-data')) {
                        return true;
                    }
                },
                loaders: [require.resolve('./custom-loader')]
            }
        )
        return config;
    }
};

var wps = new WebpackServer(opt)

var ssr = require('./ssr')
wps
    .start(function (err) {
        // assert(err, null)
    })
    .inject(function (req, res, next) {
        ssr(req.url, function (content) {
            res.type('html')
            res.send(
                nunjucks.renderString(
                    tpl,
                    {root: '/', content: content, entry: 'app'}
                )
            )
        })
    })