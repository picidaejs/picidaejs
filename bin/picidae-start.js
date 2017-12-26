// #!/usr/bin/env node
// var commander = require('commander');

var Picidae = require('../lib');
var getPath = require('./lib/getPath');

module.exports = function (commander) {
    var p = getPath(commander.config)
    var configPath = p.configPath, cwd = p.cwd
    var config = require(configPath)

    process.chdir(cwd)

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


