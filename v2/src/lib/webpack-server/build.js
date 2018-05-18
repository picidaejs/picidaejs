import webpack from 'webpack'
import getWebpackConfig from './getWebpackConfig'


export default function build(config, callback = () => {}) {
    let compiler = webpack(config, (err, stats) => {
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
    });

}