/**
 * Generate Meta / LazyLoad Data For Webpack
 */

const yamlFront = require('yaml-front-matter')
const fs = require('fs')

/**
 * @param filesMap
 *   posts/a.md: 'absolute path'
 */
function generateLazyLoad(filesMap) {

    function tpl({require, name}) {
        return `
    '${name}': function () {
        return new Promise(function (resolve) {
            require.ensure([], function (require) {
                resolve(require('${require}'));
            }, '${name}')
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
        delete meta.__content;

        meta = picker(meta, content, filesMap[path]);
        if (meta) {
            picked[path] = meta;
        }
    }

    return picked;
}

function generate(filesMap, picker) {
    return '{' +
        '\n  lazyload: {' + generateLazyLoad(filesMap) +
        '  },' +
        '\n  meta: ' + JSON.stringify(generatePickedMeta(filesMap, picker), null, 2) +
        '\n}'
}

module.exports = generate;
