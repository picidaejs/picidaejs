
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

    excludes: [/guide/],

    transformers: [
        // 'picidae-transformer-react-render'
    ],

    plugins: [
        // 'picidae-plugin-utils'
    ],

    commanders: [
        'picidae-commander-new?title=',
        // 'gh-pages?repo=',
        // 'deploy'
    ]
}