
module.exports = function (commander, opt, config, require) {
    var nps = require('path')

    return commander
        .command('preview')
        .option('-p --port <number>', '', Number)
        .description('preview build pages')
        .action(function (opt) {
            var port = opt.port || 10000;

            var docRoot = nps.resolve(config.distRoot);

            var express = require('express');
            var app = express();
            app.use(express.static(docRoot));
            app.listen(port, function () {
                console.log(docRoot);
                console.log('http://localhost:%d', port);
            });
        })
}