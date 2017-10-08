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

async function generatePickedMeta(filesMap, {picker, fromPath = process.cwd(), htmlTransformers = [], markdownTransformers = []}) {
    picker = picker || (meta => meta);

    let picked = {};
    const {opts: {publicPath}} = context.picidae;
    for (let path in filesMap) {
        let meta = yamlFront.loadFront(fs.readFileSync(filesMap[path]).toString());
        let content = meta.__content;
        let filename = filesMap[path]
        delete meta.__content;

        content = await chain(markdownTransformers, content, {meta: {...meta}, publicPath, path, filesMap: {...filesMap}});

        function getHTML(md = content) {
            return new Promise((resolve, reject)=> {
                generate(md, function (err, meta, data) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(
                            chain(htmlTransformers, data, {meta: {...meta}, publicPath, path, filesMap: {...filesMap}})
                                .then(data => data.content)
                        )
                    }
                });
            })
        }

        meta.datetime = moment(meta.datetime || fs.statSync(filename).mtime).format();
        meta.filename = meta.filename || nps.relative(fromPath, filename);
        meta = await picker(meta, {content, filename, getHTML}, require);
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
    let {markdownTransformers, htmlTransformers} = split(nodeTransformers)
    let meta = await generatePickedMeta(filesMap, {
        picker, fromPath: docRoot,
        markdownTransformers, htmlTransformers
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

module.exports = summaryGenerate;
