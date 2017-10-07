import remark from 'remark'
import remarkHtml from 'remark-html'
import remarkAlign from 'remark-align'
import toEmoji from 'remark-gemoji-to-emoji'
import slug from 'remark-slug'
import highlight from 'remark-highlight.js'
import yamlFront from 'yaml-front-matter'


export const alignClass = {
    left: 'align-left',
    center: 'align-center',
    right: 'align-right'
}

function generate(content, callback) {
    const {__content, ...meta} = yamlFront.loadFront(content);
    remark()
        .use(remarkAlign, alignClass)
        .use(remarkHtml)
        .use(toEmoji)
        .use(slug)
        .use(highlight)
        .process(__content, function (err, file) {
            if (err) {
                callback(err);
            }
            else {
                callback(null, meta, {
                    // todo -> transformers
                    content: file.contents
                })
            }
        });
}

module.exports = generate;