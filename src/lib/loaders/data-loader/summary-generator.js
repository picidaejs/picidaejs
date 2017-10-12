/**
 * Generate Meta / LazyLoad Data For Webpack
 */

const yamlFront = require('yaml-front-matter')
const fs = require('fs')
const nps = require('path')
const moment = require('moment')

const generate = require('../markdown-loader/generate')
const context = require('../../context')
const {chain, split} = require('../../utils/transformerUtils');
const stringify = require('../../utils/stringify');

const mdLoaderPath = require.resolve('../markdown-loader')

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
                resolve(require('${mdLoaderPath}!${require}'));
            }, '${name}')
        })
    },` : `
    '${name}': function() {
        return new Promise(function (resolve) {
            resolve(require('${mdLoaderPath}!${require}'));
        })    
    },`
    }

    let lazyload = ''
    for (let path in filesMap) {
        lazyload += tpl({require: filesMap[path], name: path}) + '\n';
    }

    return lazyload;
}

async function generatePickedMeta(filesMap, {
    picker, fromPath = process.cwd(), htmlTransformers = [], markdownTransformers = [], remarkTransformers = []
}) {
    picker = picker || (meta => meta);

    let picked = {};
    const {opts: {publicPath}} = context.picidae;
    for (let path in filesMap) {
        let meta = yamlFront.loadFront(fs.readFileSync(filesMap[path]).toString());
        let content = meta.__content;
        let filename = filesMap[path]
        delete meta.__content;

        content = await chain(markdownTransformers, content, {meta: {...meta}, path, filesMap: {...filesMap}});

        function getMarkdownData(md = content) {
            return new Promise((resolve, reject)=> {
                generate(md, function (err, meta, data) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(
                            chain(htmlTransformers, data, {meta: {...meta}, path, filesMap: {...filesMap}})
                                // .then(data => stringify(data))
                        )
                    }
                }, remarkTransformers);
            })
        }

        meta.datetime = moment(meta.datetime || fs.statSync(filename).mtime).format();
        meta.filename = meta.filename || nps.relative(fromPath, filename);
        meta = await picker(meta, {content, filename, getMarkdownData, path}, require);
        if (meta) {
            picked[path] = meta;
        }
    }

    return picked;
}

function pluginsStr (plugins = []) {
    return plugins.map(({path, opt}) => `require('${path}')(${JSON.stringify(opt)})`).join(',')
}

async function summaryGenerate(filesMap, {plugins = [], nodeTransformers, transformers = [], picker, docRoot}, lazyload = true) {
    let {markdownTransformers, htmlTransformers, remarkTransformers} = split(nodeTransformers)
    let meta = await generatePickedMeta(filesMap, {
        picker, fromPath: docRoot,
        markdownTransformers, htmlTransformers, remarkTransformers
    });
    return Promise.resolve('{' +
        '\n  lazyload: {' + generateLazyLoad(filesMap, lazyload) +
        '  },' +
        '\n  meta: ' + stringify(meta, null, 2) +
        '\n,' +
        '\n  plugins: [' + pluginsStr(plugins) + '],' +
        '\n  transformers: [' + pluginsStr(transformers) + ']' +
        '\n};')
}

module.exports = summaryGenerate;
