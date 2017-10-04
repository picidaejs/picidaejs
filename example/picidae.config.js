
module.exports = {
    webpackConfigUpdater(config, webpack) {
        return config;
    },
    port: 9999,
    verbose: true,

    publicPath: '/',

    theme: '../theme',

    docRoot: './docs',
    distRoot: './public',
    templateRoot: './templates',

    excludes: [/\.ignore\./],

    transformers: [
        // 'picidae-transformer-react-render'
    ],


    commanders: [
        'picidae-commander-new?title=',
        // 'gh-pages?repo=',
        // 'deploy'
    ]
}