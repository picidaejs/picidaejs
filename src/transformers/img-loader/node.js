/**
 * @file node
 * @author Cuttle Cong
 * @date 2018/3/14
 * @description
 */
import visit from 'unist-util-visit'
import fs from '../../lib/utils/fs'
import nps from 'path'
import url from 'url'

function isUrlString(str) {
    return url.parse(str).slashes || str.startsWith('//')
}

exports.rehypeTransformer = function rehypeTransformer(option) {
    const {
        info: {
            path,
            filesMap,
            meta
        },
        inject
    } = this.picidae()
    const array = []
    let index = 0
    inject('_image-loader_', array)
    const filename = filesMap[path]
    const dirname = nps.dirname(filename)
    // console.log(filename)
    return function process(node) {
        visit(node, 'element', function (node) {
            if (node.tagName !== 'img') {
                return
            }
            const properties = node.properties
            if (properties.src && !isUrlString(properties.src)) {
                const imgFilePath = nps.resolve(dirname, properties.src)
                if (fs.isFile(imgFilePath)) {
                    properties['data-image-loader'] = index++
                    array.push({
                        PICIDAE_EVAL_CODE: true,
                        value: 'require(' + JSON.stringify(imgFilePath) + ')'
                    })
                }
            }
        })
    }
}
