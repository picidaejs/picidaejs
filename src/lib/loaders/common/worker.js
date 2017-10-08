const summary = require('../data-loader/summary-generator');
const marked = require('../markdown-loader/generate');
const {chain, split} = require('../../utils/transformerUtils');
const YFM = require('yaml-front-matter');


function stringify(obj) {
    let str = JSON.stringify(obj, function (key, value) {
        if (value && value.PICIDAE_EVAL_CODE === true) {
            if (typeof value.value === 'string' && value.value) {
                return 'PICIDAE_EVAL_CODE' + value.value + 'PICIDAE_EVAL_CODE'
            }
        }
        return value;
    }, 2);

    return str.replace(/(['"])PICIDAE_EVAL_CODE([^]+?)PICIDAE_EVAL_CODE\1/g, '$2')
}

process.on('message', (task) => {
    let {
        filename,
        content,
        plugins,
        transformers,
        type,
        args
    } = task;


    if (type === 'markdown') {

        let {markdownTransformers, htmlTransformers} = split(transformers)
        let {__content, ...meta} = YFM.loadFront(content);

        let promise = chain(markdownTransformers, content, {meta: {...meta}, filename});

        promise
            .then(md => {
                return new Promise(resolve => {
                    marked(md, (err, _meta, data) => {
                        if (err) {
                            console.error(err);
                            process.send(JSON.stringify(data, null, 2));
                            return
                        }
                        resolve({meta: _meta, data});
                    })
                });
            })
            .then(({meta, data}) => {
                return chain(htmlTransformers, data, {meta: {...meta}, filename});
            })
            .then(data => {
                process.send(stringify(data, null, 2));
            }).catch(err => {
                console.error(err);
                process.send(stringify(data, null, 2));
            });
    }
    // else if (type === 'summary') {
    //     if (args[1] && args[1].picker) {
    //         eval('args[1].picker = ' + args[1].picker);
    //     }
    //     data = summary.apply(null, args);
    //     process.send(data);
    // }
    else if (type === 'renderHtml') {
        let fs = require('fs');

        let tpl = args[0];
        let ctx = args[1];
        let opt = args[2] || {};
        let {path, spider, pathname = ''} = opt

        let htmlString = require('nunjucks').renderString(tpl, ctx);
        let hrefList = [];

        if (spider) {
            let $ = require('cheerio').load(htmlString);
            let links = $('a');
            links.map(function () {
                let href = $(this).attr('href') || '';
                href = href.trim()
                if (href && !href.startsWith('#')) {
                    href = require('url').resolve(pathname, href).trim();
                    if (!/^(\/\/|https?:)/.test(href)) {
                        hrefList.push(href)
                    }
                }
            })
        }

        fs.writeFile(path, htmlString, (err) => {
            if (err) {
                process.send('');
            }
            else {
                process.send({
                    path,
                    hrefList
                });
            }
        })
    }
});
