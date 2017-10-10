import nps from 'path'

module.exports = {
    theme: nps.join(__dirname, '../../theme'),

    publicPath: '/',
    docRoot: './docs',
    distRoot: './public',
    templateRoot: './templates',
    extraRoot: './extra',

    themeConfigsRoot: './theme-configs',

    excludes: [/\.ignore\./],

    transformers: [],

    commanders: []
};