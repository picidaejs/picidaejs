
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
    extraRoot: './extra',

    excludes: [/guide/],

    transformers: [
        // 'picidae-transformer-react-render'
    ],

    commanders: [
        '../commanders/new?title=abc',
        // 'gh-pages?repo=',
        // 'deploy'
    ]
}