exports.chain = function (transformers = [], beginData, extra = {}) {
    return transformers.reduce(
        (promise, transformer) =>
            promise.then(data =>
                transformer({data, ...extra}, require)
            ),
        Promise.resolve(beginData)
    );
}

exports.split = function (transformers = []) {
    let markdownTransformers = []
    let htmlTransformers = []
    transformers.forEach(({path, opt}) => {
        let transformer = require(path);
        if (typeof transformer.markdownTransfomer === 'function') {
            markdownTransformers.push(transformer.markdownTransfomer.bind(null, opt));
        }
        if (typeof transformer.htmlTransfomer === 'function') {
            htmlTransformers.push(transformer.htmlTransfomer.bind(null, opt));
        }
        if (typeof transformer === 'function') {
            htmlTransformers.push(transformer.bind(null, opt));
        }
    });

    return {htmlTransformers, markdownTransformers}
}