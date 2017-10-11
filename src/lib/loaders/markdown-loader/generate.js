import remark from 'remark'
import remarkHtml from 'remark-html'
import remarkAlign from 'remark-align'
import toEmoji from 'remark-gemoji-to-emoji'
import slug from 'remark-slug'
import highlight from 'remark-highlight.js'
import yamlFront from 'yaml-front-matter'
import headings from 'remark-autolink-headings'


export const alignClass = {
    left: 'align-left',
    center: 'align-center',
    right: 'align-right'
}

function generate(content, callback) {
    const {__content, ...meta} = yamlFront.loadFront(content);

    toHTML(__content)
        .then(content =>
            callback(null, meta, {
                content
            })
        )
        .catch(err => callback(err))
}

generate.toHTML = toHTML
function toHTML(md) {
    return new Promise((resolve, reject) => {
        remark()
            .use(toEmoji)
            .use(remarkHtml)
            .use(slug)
            .use(headings)
            .use(highlight)
            .use(remarkAlign, alignClass)
            .process(md, function (err, file) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(file.contents)
                }
            });
    })
}

module.exports = generate;