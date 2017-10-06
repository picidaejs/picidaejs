// #!/usr/bin/env node
// var commander = require('commander');

var nps = require('path');
var Picidae = require('../lib');

module.exports = function (commander) {
    var configPath = nps.join(process.cwd(), commander.config || 'picidae.config.js')
    var config = require(configPath)
    config.id = require('md5')(configPath).substr(0, 8)
    config.watch = true;
    config.ssr = false;

    var picidae = new Picidae(config)
    picidae.start();

    process.on('SIGINT', function () {
        picidae.clearTmp();
        picidae.stop(function () {
        });
        process.exit(1);
    });
}


