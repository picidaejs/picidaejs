// #!/usr/bin/env node
var nps = require('path')
var child = require('child_process')
var chalk = require('chalk')

var over = require('../lib/lib/utils/overwrite-require')
var _console = require('../lib/lib/utils/console').default
var info = over.getInfo()


function install(pkg) {
    var cmd = 'npm install ' + pkg
    console.log('  running: ', chalk.yellow.bold(cmd))
    child.execSync(cmd, { cwd: info.path.rootPath })
}

module.exports = function use(pkg) {
    if (info.type === 'local') {
        console.log(
            chalk.read.bold('  ERROR: Picidae is in local position, you should run `npm install ' + pkg + ' --save`!\n')
        )
    }
    else {
        install(pkg)
    }
    process.exit()
}
