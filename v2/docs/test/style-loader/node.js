/**
 * @file node.js
 * @author Cuttle Cong
 * @date 2018/3/13
 * @description
 */

// exports.use = ['file-syntax']
var visit = require('unist-util-visit')

exports.rehypeTransformer = function () {
    return function (node) {
        visit(node, 'element', function (node) {
            if (node.tagName === 'img') {
                // console.log(node)
                // node.properties.src = 'https://i.loli.net/2017/11/07/5a01b0438ea5b.jpg'
                // node.properties.width = '300'
                // node.properties.height = '700'
            }
        })
    }
}
