import remark from 'remark'
import remarkAlign from 'remark-align'
import toEmoji from 'remark-gemoji-to-emoji'
import slug from 'remark-slug'
import highlight from 'remark-highlight.js'
import yamlFront from '../../utils/loadFront'
import headings from 'remark-autolink-headings'
import remark2rehype from 'remark-rehype'
import raw from 'rehype-raw'
import mini from './safe-preset-minify'
import rehypeStringify from 'rehype-stringify'
import DetectChanged from 'detect-one-changed/remark-plugin'

import visit from 'unist-util-visit'
import loaderUtils from 'loader-utils'

export const alignClass = {
  left: 'align-left',
  center: 'align-center',
  right: 'align-right'
}

function generate(
  content,
  info,
  callback,
  remarkTransformers = [],
  rehypeTransformers = []
) {
  const { __content, ...meta } = yamlFront.loadFront(content)

  toHTML(__content, info, remarkTransformers, rehypeTransformers)
    .then(data => callback(null, meta, data))
    .catch(err => callback(err))
}

generate.toHTML = toHTML

const detectChanged = DetectChanged.create()

function toHTML(md, info = {}, remarkTransformers, rehypeTransformers) {
  const extra = {}

  function middleForThis() {
    this.picidae = () => ({
      info,
      inject(key, value) {
        extra[key] = value
      }
    })

    return node => {
      visit(node, 'code', codeNode => {
        let lang = codeNode.lang || ''

        let i = lang.lastIndexOf('?')
        let query = {}
        if (i >= 0) {
          query = loaderUtils.parseQuery(lang.substr(i))
          lang = lang.substring(0, i)
        }
        codeNode.lang = lang
        codeNode.data = codeNode.data || {}
        codeNode.data.hProperties = codeNode.data.hProperties || {}
        codeNode.data.hProperties['data-query'] = JSON.stringify(query)
        codeNode.data.hProperties['data-lang'] = lang
      })
    }
  }

  const { filesMap, path } = info
  const filepath = filesMap[path]
  detectChanged.options = { filepath }
  remarkAlign.options = alignClass
  const presetTransformers = [
    process.env.PICIDAE_ENV !== 'production' && detectChanged,
    toEmoji,
    remarkAlign,
    slug,
    headings,
    middleForThis
  ].filter(Boolean)
  remark2rehype.options = { allowDangerousHTML: true }

  let appended = [remark2rehype, raw]
    .concat(rehypeTransformers)
    .concat([mini, rehypeStringify])
  let source = remark()
  let transformers = presetTransformers.concat(
    remarkTransformers,
    highlight,
    appended
  )
  return new Promise((resolve, reject) => {
    source = transformers.reduce(
      (source, transformer) =>
        source.use(transformer, transformer.options || {}),
      source
    )
    source.process(md, function(err, file) {
      if (err) {
        reject(err)
      } else {
        resolve({
          content: file.contents,
          extra
        })
      }
    })
  })
}

module.exports = generate
