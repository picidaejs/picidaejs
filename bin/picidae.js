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
    .option('--quick-hot', 'enable quick hot mode. (NOTE: maybe cause the meta data such as `title` can\'t be updated.)')
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
    .option('--no-sw', 'disable Service Worker(Offline) mode')
    .option('--source-map', 'enable source map')
    .action(function (opts) {
        require('./picidae-build')(opts)
    });

commander
    .command('use <package...>')
    .description('install <package>, we recommend use the command in global')
    .action(function (pkgs) {
        if (!pkgs.length) return
        require('./picidae-use')(pkgs)
    })

commander
    .command('unuse <package...>')
    .description('uninstall <package>, we recommend use the command in global')
    .action(function (pkgs) {
        if (!pkgs.length) return
        require('./picidae-unuse')(pkgs)
    })

commander
    .command('list')
    .description('list the packages which you are installed by `picidae use`')
    .action(function () {
        require('./picidae-list')()
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

