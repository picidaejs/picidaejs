/**
 * Generate Meta / LazyLoad Data For Webpack
 */

const yamlFront = require('yaml-front-matter')
const fs = require('fs')
const nps = require('path')
const moment = require('moment')

const {toHTML} = require('../markdown-loader/generate')
const {chain, split} = require('../../utils/transformerUtils');

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

async function generatePickedMeta(filesMap, {picker, fromPath = process.cwd(), transformers = []}) {
    picker = picker || (meta => meta);

    let picked = {}
    for (let path in filesMap) {
        let meta = yamlFront.loadFront(fs.readFileSync(filesMap[path]).toString());
        let content = meta.__content;
        delete meta.__content;

        content = await chain(transformers, content, {meta: {...meta}, filename: filesMap[path]});

        meta.datetime = moment(meta.datetime || fs.statSync(filesMap[path]).mtime).format();
        meta.filename = nps.relative(fromPath, filesMap[path]);
        function getHTML(md = content) {
            return toHTML(md);
        }
        meta = await picker(meta, {content, filename: filesMap[path], getHTML}, require);
        if (meta) {
            picked[path] = meta;
        }
    }

    return picked;
}

function pluginsStr (plugins = []) {
    return plugins.map(({path, opt}) => `require('${path}')(${JSON.stringify(opt)})`).join(',')
}

async function generate(filesMap, {plugins = [], nodeTransformers, transformers = [], picker, docRoot}, lazyload = true) {
    let meta = await generatePickedMeta(filesMap, {
        picker, fromPath: docRoot, transformers: split(nodeTransformers).markdownTransformers
    });
    return Promise.resolve('{' +
        '\n  lazyload: {' + generateLazyLoad(filesMap, lazyload) +
        '  },' +
        '\n  meta: ' + JSON.stringify(meta, null, 2) +
        '\n,' +
        '\n  plugins: [' + pluginsStr(plugins) + '],' +
        '\n  transformers: [' + pluginsStr(transformers) + ']' +
        '\n};')
}

module.exports = generate;
