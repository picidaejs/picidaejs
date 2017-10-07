/**
 * Generate Meta / LazyLoad Data For Webpack
 */

const yamlFront = require('yaml-front-matter')
const fs = require('fs')
const nps = require('path')
const moment = require('moment')

/**
 * @param filesMap
 *   posts/a.md: 'absolute path'
 */
function generateLazyLoad(filesMap, lazy) {

    function tpl({require, name}) {
        return lazy ? `
    '${name}': function () {
        return new Promise(function (resolve) {
            require.ensure([], function (require) {
                resolve(require('${require}'));
            }, '${name}')
        })
    },` : `
    '${name}': function() {
        return new Promise(function (resolve) {
            resolve(require('${require}'));
        })    
    },`
    }

    let lazyload = ''
    for (let path in filesMap) {
        lazyload += tpl({require: filesMap[path], name: path}) + '\n';
    }

    return lazyload;
}

function generatePickedMeta(filesMap, picker) {
    picker = picker || (meta => meta);

    let picked = {}
    for (let path in filesMap) {
        let meta = yamlFront.loadFront(fs.readFileSync(filesMap[path]).toString());
        let content = meta.__content;
        meta.datetime = moment(meta.datetime || fs.statSync(filesMap[path]).mtime).format();
        meta.filename = nps.relative(process.cwd(), filesMap[path]);
        delete meta.__content;

        meta = picker(meta, content, filesMap[path]);
        if (meta) {
            picked[path] = meta;
        }
    }

    return picked;
}

function pluginsStr (plugins = []) {
    return plugins.map(({path, opt}) => `require('${path}')(${JSON.stringify(opt)})`).join(',')
}

function generate(filesMap, {plugins = [], transformers = [], picker}, lazyload = true) {
    return '{' +
        '\n  lazyload: {' + generateLazyLoad(filesMap, lazyload) +
        '  },' +
        '\n  meta: ' + JSON.stringify(generatePickedMeta(filesMap, picker), null, 2) +
        '\n,' +
        '\n  plugins: [' + pluginsStr(plugins) + '],' +
        '\n  transformers: [' + pluginsStr(transformers) + ']' +
        '\n};'
}

module.exports = generate;
