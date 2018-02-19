import remark from 'remark'
import remarkHtml from 'remark-html'
import remarkAlign from 'remark-align'
import toEmoji from 'remark-gemoji-to-emoji'
import slug from 'remark-slug'
import highlight from 'remark-highlight.js'
import yamlFront from '../../utils/loadFront'
import headings from 'remark-autolink-headings'

import visit from 'unist-util-visit';
import loaderUtils from 'loader-utils';

export const alignClass = {
    left: 'align-left',
    center: 'align-center',
    right: 'align-right'
}

function generate(content, info, callback, transformers = []) {
    const {__content, ...meta} = yamlFront.loadFront(content);

    toHTML(__content, info, transformers)
        .then(data =>
            callback(null, meta, data)
        )
        .catch(err => callback(err))
}

generate.toHTML = toHTML;
function toHTML(md, info = {}, transformers = []) {
    const extra = {};
    function middleForThis() {
        this.picidae = () => ({
            info,
            inject(key, value) {
                extra[key] = value;
            }
        });

        return (node) => {
            visit(node, 'code', (codeNode) => {
                let lang = codeNode.lang || '';

                let i = lang.lastIndexOf('?');
                let query = {};
                if (i >= 0) {
                    query = loaderUtils.parseQuery(lang.substr(i));
                    lang = lang.substring(0, i);
                }
                codeNode.lang = lang;
                codeNode.data = codeNode.data || {};
                codeNode.data.hProperties = codeNode.data.hProperties || {};
                codeNode.data.hProperties['data-query'] = JSON.stringify(query);
                codeNode.data.hProperties['data-lang'] = lang;
            });
        }
    }

    remarkAlign.options = alignClass;
    const presetTransformers = [toEmoji, remarkAlign, remarkHtml, slug, headings, middleForThis]
    let source = remark();

    transformers = presetTransformers.concat(transformers, highlight);
    return new Promise((resolve, reject) => {
        source = transformers.reduce((source, transformer) => source.use(transformer, transformer.options || {}), source);
        source.process(md, function (err, file) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({
                        content: file.contents,
                        extra
                    })
                }
            });
    })
}

module.exports = generate;
