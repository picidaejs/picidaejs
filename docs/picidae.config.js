
module.exports = {
    webpackConfigUpdater(config, webpack) {
        return config;
    },
    port: 9999,

    publicPath: '/picidaejs/public/',
    // publicPath: '/',

    theme: '../theme',

    docRoot: './docs',
    distRoot: './public',
    templateRoot: './templates',
    extraRoot: './extra',

    excludes: [/example/, /api/, /\/refs\//],

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