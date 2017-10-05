if (typeof document === 'undefined') {
    var mdGenerate = require('../loaders/markdown-loader/generate')
    var origin = require;
    require = function(p) {
        if (/\.(md|markdown)$/.test(p)) {
            var s = require('fs').readFileSync(origin.resolve(p)).toString();
            return new Promise(function (resolve) {
                mdGenerate(s, function (err, data) {
                    if (err) console.error(err);
                    resolve(data || {})
                })
            })
        }
        return origin(p);
    }
    for (var k in origin) {
        require[k] = origin[k]
    }
}
require.ensure = require.ensure || function (dependences, callback) {
        return callback(require);
    }

