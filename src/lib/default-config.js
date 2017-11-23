const nps = require('path')
const PropTypes = require('prop-types')

module.exports = {
    value: {
        theme: nps.join(__dirname, '../../theme'),
        verbose: false,
        port: 8989,
        publicPath: '/',
        expressSetup: null,
        webpackConfigUpdater: null,
        docRoot: './docs',
        distRoot: './public',
        templateRoot: './templates',
        extraRoot: './extra',

        themeConfigsRoot: './theme-configs',

        hotReloadTests: [/\.(md|markdown)$/i],

        excludes: [/\.ignore\./],

        transformers: [],

        commanders: []
    },
    type: {
        host: PropTypes.string,
        templateData: PropTypes.object,
        theme: PropTypes.string,
        verbose: PropTypes.bool,
        port: PropTypes.number,
        publicPath: PropTypes.string,
        expressSetup: PropTypes.func,
        webpackConfigUpdater: PropTypes.func,
        docRoot: PropTypes.string,
        distRoot: PropTypes.string,
        templateRoot: PropTypes.string,
        extraRoot: PropTypes.string,
        themeConfigsRoot: PropTypes.string,
        hotReloadTests: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.instanceOf(RegExp),
                PropTypes.func,
                PropTypes.string
            ])
        ),
        excludes: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.instanceOf(RegExp),
                PropTypes.func,
                PropTypes.string
            ])
        ),
        transformers: PropTypes.arrayOf(PropTypes.string),
        commanders: PropTypes.arrayOf(PropTypes.string)
    }
};
