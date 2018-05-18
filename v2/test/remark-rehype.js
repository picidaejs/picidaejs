/**
 * @file remark-rehype
 * @author Cuttle Cong
 * @date 2018/3/14
 * @description
 */
// var vfile = require('to-vfile');
var visit = require('unist-util-visit')
// var report = require('vfile-reporter');
var raw = require('rehype-raw')
// var unified = require('unified')
// var markdown = require('remark-parse')
var remark = require('remark')
var remark2rehype = require('remark-rehype')
var highlight = require('remark-highlight.js')
// var doc = require('rehype-document')
// var format = require('rehype-format')
var html = require('rehype-stringify')
// var rhtml = require('remark-html')
// var mini = require('rehype-preset-minify')
var unescape = require('unescape')
var mdtext = `
##Hello world
> block quote.ss  

~~~_html
<div> </div>
export default () => <h1>HHHH</h1>
~~~

![](ss)

<img src="./sss"></img>

some *emplhsds* 
`

function remarkPlugin() {
    return function () {

    }
}

function rehype() {
    return function (node) {
        visit(node, function (node) {
            return node.type === 'element' && node.tagName === 'img'
        }, function (node) {
            console.log(node)
        })
    }
}
function htmlDecode(str) {
    // 一般可以先转换为标准 unicode 格式（有需要就添加：当返回的数据呈现太多\\\u 之类的时）
    str = unescape(str.replace(/\\u/g, "%u"));
    // 再对实体符进行转义
    // 有 x 则表示是16进制，$1 就是匹配是否有 x，$2 就是匹配出的第二个括号捕获到的内容，将 $2 以对

    str = str.replace(/&#(x)?(\w+);/g, function($, $1, $2) {
        return String.fromCharCode(parseInt($2, $1? 16: 10));
    });

    return str;
}

remark()
    .use(remarkPlugin)
    .use(highlight)
    .use(remark2rehype, { allowDangerousHTML: true })
    .use(raw)
    .use(html)
    // .use(rhtml)
    .process(mdtext, function (err, file) {
        // console.error(report(err || file));
        // unescape(
        console.log(String(file))
    })

console.log(unescape('export default () => &lt;h1>HHHH&lt;/h1>\n'))
