import webpack from 'webpack'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackDevMiddleware from 'webpack-dev-middleware'
import express from 'express'
import chalk from 'chalk'
import console from '../utils/console'


export default function maker({webpackConfig, static: staticPath, verbose, callback, port, log = console.log}) {
    const app = express();

    if (typeof staticPath === 'string' && staticPath) {
        app.use(express.static(staticPath));
    } else if (
        Array.isArray(staticPath)
        && typeof staticPath[1] === 'string'
        && typeof staticPath[0] === 'string'
    ) {
        const [route, path] = staticPath;
        app.use(route, express.static(path));
    }


    const server = app.listen(port, err => {
        app._listening = true;
        let port = server.address().port;
        if (port && verbose) {
            console.log(' WebpackServer run on', chalk.underline.red(`${'http://localhost:' + port + '/'}`) );
        }
        const compiler = webpack(webpackConfig);
        app.compiler = compiler;
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
        }));

        app.use(webpackHotMiddleware(compiler, {
            log: verbose && log,
            // path: hmrPath
        }));

        callback && callback(err, port);
    });

    app._server = server;

    return app;
}
