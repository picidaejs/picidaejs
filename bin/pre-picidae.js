#!/usr/bin/env node
var cp = require('child_process')
var nps = require('path')
var chalk = require('chalk')
var os = require('os')
var over = require('../lib/lib/utils/overwrite-require');

var argv = process.argv.slice(2)
if (!argv.length) {
    console.error('  ' + chalk.red.bold('`picidae -h`') + ' for help ')
    process.exit(1)
}

var execSync
if (os.platform() === 'win32') {
    execSync = function execSync(file, argv, opts) {
        return cp.spawnSync('node', [file].concat(argv), opts)
    }
}
else {
    execSync = function execSync(file, argv, opts) {
        return cp.execFileSync(file, argv, opts)
    }
}

over.logPkgLocation()
var info = over.getInfo()
var opts = {
    stdio: 'inherit'
}
console.log('')
try {
if (info.type === 'local') {
    execSync(require.resolve(nps.join(info.path.workRoot, '../../bin/picidae')), argv, opts)
}
else {
    execSync(require.resolve(nps.join(info.path.localRoot, '../../bin/picidae')), argv, opts)
}
} catch (ex) {
    process.exit(1)
}

