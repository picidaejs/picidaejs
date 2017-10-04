import webpack from 'webpack'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackDevMiddleware from 'webpack-dev-middleware'
import express from 'express'

import console from '../utils/console'


export default function maker({webpackConfig, verbose, log = console.log}) {
    const app = express();

    const compiler = webpack(webpackConfig)
    app.use(webpackDevMiddleware(compiler, {
        noInfo: !verbose,
        stats: {
            chunks: false,
            hash: false,
            colors: {level: 2, hasBasic: true, has256: true, has16m: false}
        },
        publicPath: webpackConfig.output && webpackConfig.output.publicPath || '/',
        hot: true,
        quiet: !verbose,
        log: verbose && log
    }))

    app.use(webpackHotMiddleware(compiler, {
        log: verbose && log,
        // path: hmrPath
    }))

    return app;
}