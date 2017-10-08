
module.exports = {
    webpackConfigUpdater(config, webpack) {
        return config;
    },
    port: 9999,
    verbose: true,

    publicPath: '/picidaejs/public/',

    theme: '../theme',

    docRoot: './docs',
    distRoot: './public',
    templateRoot: './templates',
    extraRoot: './extra',

    excludes: [/guide/],

    transformers: [
        'picidae-transformer-react-render?lang=render-jsx', 'file-syntax'
    ],

    commanders: [
        '../commanders/new?title=abc',
        '../commanders/preview',
        // 'gh-pages?repo=',
        // 'deploy'
    ]
}