// #!/usr/bin/env node
// var commander = require('commander');

var nps = require('path');
var Picidae = require('../lib');

module.exports = function (commander) {
    var configPath = nps.join(process.cwd(), commander.config || 'picidae.config.js')
    var config = require(configPath)
    config.watch = true;

    if (commander.ssr) {
        config.ssr = true;
    }
    var picidae = new Picidae(config)
    picidae.start();
    process.on('SIGINT', function () {
        picidae.clearTmp();
        picidae.stop(function () {
            process.exit(1);
        });
    });
}


