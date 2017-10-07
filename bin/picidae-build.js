var nps = require('path');
var Picidae = require('../lib');


module.exports = function (commander) {
    var configPath = nps.join(process.cwd(), commander.config || 'picidae.config.js')
    var config = require(configPath)
    // console.log(commander);
    config.force = commander.force;
    config.noSpider = !commander.spider;
    config.sourceMap = commander.sourceMap;
    config.id = require('md5')(configPath).substr(2, 8)
    config.watch = false;
    config.ssr = true;

    var picidae = new Picidae(config)
    picidae.build(function () {
        picidae.clearTmp();
    });
    process.on('SIGINT', function () {
        picidae.clearTmp();
        process.exit(1);
    });
}