#!/usr/bin/env node
var over = require('../lib/lib/utils/overwrite-require');
over.register()
var commander = require('commander');
var nps = require('path')
var pkg = require('../package.json')
var parsePkg = require('../lib/lib/utils/parse-query');
var Picidae = require('../lib');

commander
    .version(pkg.version)

commander
    .command('init [path]')
    .description('The first step of picidae')
    .action(function (path) {
        require('./picidae-init')(path)
    })

commander
    .command('start')
    .description('start a webpack server for development.')
    .option('-c --config [file]', 'set config path. (default `./picidae.config.js`)')
    // .option('--ssr', 'turn on ssr')
    .action(function (opts) {
        require('./picidae-start')(opts)
    })


commander
    .command('build')
    .description('build static pages for production.')
    .option('-c --config [file]', 'set config path. (default `./picidae.config.js`)')
    .option('-f --force', 'force build Mode: will EMPTY previous build files.')
    .option('--no-spider', 'disable smart spider mode')
    .option('--no-ssr', 'disable Server Side Render mode')
    .option('--source-map', 'enable source map')
    .action(function (opts) {
        require('./picidae-build')(opts)
    });

commander
    .command('use <package>')
    .description('install <package>, we recommend use the command in global')
    .action(function (pkg) {
        if (!pkg) return
        require('./picidae-use')(pkg)
    })

commander
    .command('unuse <package>')
    .description('uninstall <package>, we recommend use the command in global')
    .action(function (pkg) {
        if (!pkg) return
        require('./picidae-unuse')(pkg)
    })

var config = {}
try {
    var defaultConfigPath = nps.resolve('./picidae.config.js')
    config = require(defaultConfigPath);
    config = Picidae.assignOption(config);
} catch (ex) {}

try {
    var commanders = config.commanders || [];
    commanders = commanders.map(function (path) {
        return parsePkg(path, 'picidae-commander-');
    });
    commanders.forEach(function (ent) {
        require(ent.path)(commander, ent.opt, Object.assign({}, config), require);
    })
} catch (ex) {
    console.error(ex)
}

commander.parse(process.argv);

