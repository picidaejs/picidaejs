
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
        'picidae-transformer-react-render?lang=render-jsx', '/Users/yaozhiqiu/self/picidajs/example/node_modules/picidae-transformer-file-syntax'
    ],

    commanders: [
        '../commanders/new?title=abc',
        '../commanders/preview',
        // 'gh-pages?repo=',
        // 'deploy'
    ]
}