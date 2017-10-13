
const db = {}

function removeStyle(name) {
    if (db[name]) {
        db[name].forEach(dom => {
            if (dom.tagName.toLowerCase() === 'style') {
                dom.remove();
            }
        });
        delete db[name];
    }

}

function insertStyle(styleText, name) {
    var style = document.createElement('style');
    style.innerHTML = styleText;
    style.type = 'text/css';
    style.rel = 'stylesheet';
    // style.id = 'style-loader-' + name;
    document.head.appendChild(style);

    db[name] = db[name] || []
    db[name].push(style);
}


module.exports = function (opt) {
    var lang = opt.lang || 'css';
    return function (pageData) {
        var id = pageData.meta.filename

        var lang = opt.lang || 'css';
        var callbackCollect = this.callbackCollect;
        var unmountCallbackCollect = this.unmountCallbackCollect;

        unmountCallbackCollect(function (props) {
            removeStyle(id);
        });

        callbackCollect(function (ele) {
            removeStyle(id);

            var codeElements = ele.getElementsByTagName('code');
            codeElements = [...codeElements];

            var styleElements = codeElements
                .filter(codeElement => codeElement.classList.contains('language-' + lang));

            styleElements.forEach(style => {
                insertStyle(style.innerText, id);
            })
        })
    }
}
