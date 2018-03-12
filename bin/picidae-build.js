var nps = require('path');
var Picidae = require('../lib');
var getPath = require('./lib/getPath');


module.exports = function (commander) {
    var p = getPath(commander.config)
    var configPath = p.configPath, cwd = p.cwd
    var config = require(configPath)

    process.chdir(cwd)

    config.force = commander.force;
    config.noSpider = !commander.spider;
    config.noSw = !commander.sw;
    config.sourceMap = commander.sourceMap;
    config.id = require('md5')(configPath).substr(2, 8)
    config.watch = false;
    config.ssr = commander.ssr;

    var picidae = new Picidae(config)
    picidae.build(function () {
        picidae.clearTmp();
    });
    process.on('SIGINT', function () {
        picidae.clearTmp();
        process.exit(1);
    });
}
