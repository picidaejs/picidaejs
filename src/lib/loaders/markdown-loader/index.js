const loaderUtils = require('loader-utils');
const boss = require('../common/boss');

const context = require('../../context');


module.exports = function mdLoader(content, sourceMap) {
    if (this.cachable) {
        this.cachable();
    }
    const callback = this.async();

    const webpackRemainingChain = loaderUtils.getRemainingRequest(this).split('!');
    const filename = webpackRemainingChain[webpackRemainingChain.length - 1];
    // const options = loaderUtils.getOptions(this) || {}
    const {nodeTransformers: transformers, docsEntry: filesMap, opts: {publicPath}} = context.picidae;
    let path = Object.keys(filesMap).find(path => filesMap[path] === filename);


    boss.queue({
        content,
        path,
        filesMap,
        transformers,
        publicPath,
        filename,
        callback(err, result) {
            callback(err,
                [
                    '/*markdown-loader*/',
                    'module.exports = ' + result
                ].join('\n')
            )
        },
        type: 'markdown'
    })
}