import nps from 'path'

module.exports = {
    theme: nps.join(__dirname, '../theme'),

    publicPath: '/',
    docRoot: './docs',
    distRoot: './public',
    templateRoot: './templates',
    themeConfigsRoot: './theme-configs',

    picker(metaData, content, filename) {
        return metaData;
    },

    excludes: [/\.ignore\./],

    transformers: [],

    commanders: []
}