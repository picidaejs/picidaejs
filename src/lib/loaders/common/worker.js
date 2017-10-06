const summary = require('../data-loader/summary-generator');
const marked = require('../markdown-loader/generate');



process.on('message', (task) => {
    let {
        filename,
        content,
        plugins,
        transformers,
        type,
        args
    } = task;

    let data;
    if (type === 'markdown') {
        args = [content];
        args.push((err, data) => {
            process.send(JSON.stringify(data, null, 2));
        });
        marked.apply(null, args);
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
