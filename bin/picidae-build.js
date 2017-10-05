#!/usr/bin/env node
var commander = require('commander');
var nps = require('path');
var Picidae = require('../lib');

commander
    .option('-c --config [file]', 'set config path. (default `picidae.config.js`)')
    .parse(process.argv);

var configPath = nps.join(process.cwd(), commander.config || 'picidae.config.js')
var config = require(configPath)
config.watch = false;

var picidae = new Picidae(config)
picidae.build();
process.on('SIGINT', function () {
    picidae.clearTmp();
    process.exit(1);
});