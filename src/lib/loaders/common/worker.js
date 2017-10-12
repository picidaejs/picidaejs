const summary = require('../data-loader/summary-generator');
const marked = require('../markdown-loader/generate');
const {chain, split} = require('../../utils/transformerUtils');
const stringify = require('../../utils/stringify');
const YFM = require('yaml-front-matter');


process.on('message', (task) => {
    let {
        filename,
        filesMap = {},
        path,
        content,
        plugins,
        transformers,
        type,
        args
    } = task;


    if (type === 'markdown') {

        let {markdownTransformers, htmlTransformers, remarkTransformers} = split(transformers)
        let {__content, ...meta} = YFM.loadFront(content);

        let promise = chain(markdownTransformers, content, {meta: {...meta}, filesMap: {...filesMap}, path});

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
                    }, remarkTransformers)
                });
            })
            .then(({meta, data}) => {
                return chain(htmlTransformers, data, {meta: {...meta}, filesMap: {...filesMap}, path});
            })
            .then(data => {
                process.send(stringify(data, null, 2));
            }).catch(err => {
                console.error(err);
                process.send(stringify({}, null, 2));
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
        let {sync} = require('mkdirp');
        let nps = require('path');

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

        function write(path) {
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
        write(path);
    }
});
