import webpack from 'webpack'
import getWebpackConfig from './getWebpackConfig'


export default function build(opt = {}, callback = () => {}) {
    const {webpackConfigUpdater, ...rest} = opt
    let config = getWebpackConfig({dev: false, ...rest})
    if (webpackConfigUpdater) {
        config = webpackConfigUpdater(config)
    }
    webpack(config, (err, stats) => {
        if (err !== null) {
            callback(err)
            return console.error(err);
        }

        if (stats.hasErrors()) {
            console.log(stats.toString('errors-only'));
            callback(stats.toString('errors-only'))
            return;
        }

        callback();
    })

}