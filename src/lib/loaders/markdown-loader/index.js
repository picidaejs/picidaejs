const loaderUtils = require('loader-utils')
const boss = require('../common/boss')


module.exports = function mdLoader(content, sourceMap) {
    if (this.cachable) {
        this.cachable();
    }
    const callback = this.async();

    const webpackRemainingChain = loaderUtils.getRemainingRequest(this).split('!');
    const filename = webpackRemainingChain[webpackRemainingChain.length - 1];
    const options = loaderUtils.getOptions(this) || {}
    const {transformers = []} = options;

    boss.queue({
        content,
        transformers,
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