/**
 * @file getExternalExports
 * @author Cuttle Cong
 * @date 2018/3/13
 * @description
 */

export default function externalExports(computedTransformers, transformers) {

    computedTransformers.forEach(({ opt, path, index }, i) => {
        let {
            use = []
        } = require(path)
        if (!Array.isArray(use)) {
            use = [use]
        }
        use = use.filter(item => typeof item === 'string')
        transformers.splice(index, 0, ...use)
    })
}
