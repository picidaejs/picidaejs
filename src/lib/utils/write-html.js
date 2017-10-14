/**
 * @file: write-html
 * @author: cong
 */

const fs = require('fs');
const {sync} = require('mkdirp');
const nps = require('path');
const nunjucks = require('nunjucks')
const cheerio = require('cheerio')

module.exports = function (tpl, ctx, opt = {}) {
    let {path, spider, pathname = ''} = opt;

    let htmlString = nunjucks.renderString(tpl, ctx);
    let hrefList = [];

    if (spider) {
        let $ = cheerio.load(htmlString);
        let links = $('a');
        links.map(function () {
            let href = $(this).attr('href') || '';
            href = href.trim()
            if (href && !href.startsWith('#')) {
                href = require('url').resolve(pathname, href).trim();
                if (!/^(\/\/|https?:|ftp:|file:)/.test(href)) {
                    hrefList.push(href)
                }
            }
        })
    }

    function writep(path) {
        return new Promise(resolve => {
            fs.writeFileSync(path, htmlString);
            resolve({
                path,
                hrefList
            });
            // fs.writeFile(path, htmlString, (err) => {
            //     if (err) {
            //         resolve('');
            //     }
            //     else {
            //         resolve({
            //             path,
            //             hrefList
            //         });
            //     }
            // })
        });
    }
    return writep(path);
}