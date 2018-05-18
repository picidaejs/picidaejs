/**
 * @file browser
 * @author Cuttle Cong
 * @date 2018/3/14
 * @description
 */
import utils from 'html-to-react/lib/utils'

module.exports = function (opt) {
    return function (pageData) {
        let array = pageData.markdown.extra['_image-loader_'] || [];

        return [
            {
                replaceChildren: false,
                shouldProcessNode: function (node) {
                    return node.name === 'img'
                           && 'data-image-loader' in node.attribs
                           && !isNaN(node.attribs['data-image-loader'])
                },
                processNode: function (node, children = [], index) {
                    const i = parseInt(node.attribs['data-image-loader'])
                    node.attribs['src'] = array[i]
                    global.__picidae__emitter.emit('after-img-loader-replace-src', node, children)
                    // pageData
                    return utils.createElement(node, index, node.data, children)
                }
            }
        ]
    }
}
