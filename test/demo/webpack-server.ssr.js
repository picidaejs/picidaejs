var assert = require('assert')
var nps = require('path')
var nunjucks = require('nunjucks')
var fs = require('fs')

var WebpackServer = require('../../lib/lib/webpack-server').default
var build = require('../../lib/lib/webpack-server/build').default
var fixturePath = require('../utils').fixturePath

var ssrEntryPath = nps.join(__dirname, 'ssr/entry.js')
var ssrTemplatePath = nps.join(__dirname, 'template.html')

var tpl = fs.readFileSync(ssrTemplatePath, {encoding: 'utf8'})

var opt = {
    webpackConfigGetter(config) {
        config.entry = {
            app: require.resolve(fixturePath('webpack-server/entry-1.js')),
            ssr: ssrEntryPath
        }
        config.module.loaders.push({
            test: /\.md$/,
            loader: require.resolve('../../lib/lib/loaders/markdown-loader'),
            options: {
                a: 'nnn'
            }
        })
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
                    {root: '/', content: content, entry: 'ssr'}
                )
            )
        })
    })