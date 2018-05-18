
module.exports = {
    webpackConfigUpdater(config, webpack) {
        return config;
    },
    port: 9999,
    hotReloadTests: [/refs/, /\.jsx?$/],
    // publicPath: '/picidae/docs/public/',
    publicPath: '/',

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

    host: 'https://picidaejs.github.io/picidaejs/',

    excludes: [/example/, /api/, /\/refs\//],

    transformers: [
        'picidae-transformer-react-render?lang=render-jsx',
        'picidae-transformer-file-syntax',
        './test/style-loader?lang=style'
    ],

    commanders: [
        '../commanders/gh-pages?repo=git@github.com:picidaejs/picidaejs.git',
        // 'gh-pages?repo=',
        // 'deploy'
    ]
}
