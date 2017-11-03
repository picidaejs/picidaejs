
module.exports = {
    webpackConfigUpdater(config, webpack) {
        return config;
    },
    port: 9999,

    publicPath: '/picidaejs/public/',
    // publicPath: '/',

    expressSetup(app) {
        // console.log('expressSetup');
    },

    theme: '../theme',

    docRoot: './docs',
    distRoot: './public',
    templateRoot: './templates',
    extraRoot: './extra',
    themeConfigsRoot: './theme-configs',

    templateData: {
        buildTime: '' + new Date().getTime()
    },

    host: 'https://picidaejs.github.io/',

    excludes: [/example/, /api/, /\/refs\//],

    transformers: [
        'picidae-transformer-react-render?lang=render-jsx',
        'picidae-transformer-file-syntax',
        './test/style-loader?lang=style'
    ],

    commanders: [
        '../commanders/new?title=abc',
        '../commanders/preview',
        // 'gh-pages?repo=',
        // 'deploy'
    ]
}