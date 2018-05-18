exports.chain = function (transformers = [], beginData, extra = {}) {
    return transformers.reduce(
        (promise, transformer) =>
            promise.then(data =>
                transformer({ data, ...extra }, require)
            ),
        Promise.resolve(beginData)
    )
}

exports.split = function (transformers = []) {
    let remarkTransformers = []
    let rehypeTransformers = []
    let markdownTransformers = []
    let htmlTransformers = []
    transformers.forEach(({ path, opt }) => {
        let transformer = require(path)
        if (typeof transformer.remarkTransformer === 'function') {
            transformer.remarkTransformer.options = opt
            remarkTransformers.push(transformer.remarkTransformer)
        }
        if (typeof transformer.rehypeTransformer === 'function') {
            transformer.rehypeTransformer.options = opt
            rehypeTransformers.push(transformer.rehypeTransformer)
        }
        if (typeof transformer.markdownTransformer === 'function') {
            markdownTransformers.push(transformer.markdownTransformer.bind(null, opt))
        }
        if (typeof transformer.htmlTransformer === 'function') {
            htmlTransformers.push(transformer.htmlTransformer.bind(null, opt))
        }
        if (typeof transformer === 'function') {
            transformer.options = opt
            remarkTransformers.push(transformer)
        }
    })

    return { htmlTransformers, rehypeTransformers, markdownTransformers, remarkTransformers }
}
