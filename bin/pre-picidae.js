#!/usr/bin/env node
var cp = require('child_process')
var nps = require('path')
var chalk = require('chalk')
var over = require('../lib/lib/utils/overwrite-require');

var argv = process.argv.slice(2)
if (!argv.length) {
    console.error('  ' + chalk.red.bold('`picidae -h`') + ' for help ')
    process.exit(1)
}

over.logPkgLocation()
var info = over.getInfo()
var opts = {
    stdio: 'inherit'
}
console.log('')
if (info.type === 'local') {
    cp.execFileSync(require.resolve(nps.join(info.path.workRoot, '../../bin/picidae')), argv, opts)
}
else {
    cp.execFileSync(require.resolve(nps.join(info.path.localRoot, '../../bin/picidae')), argv, opts)
}
