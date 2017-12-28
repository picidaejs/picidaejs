// #!/usr/bin/env node
var nps = require('path')
var child = require('child_process')
var chalk = require('chalk')

var over = require('../lib/lib/utils/overwrite-require')
var _console = require('../lib/lib/utils/console').default
var info = over.getInfo()


function uninstall(pkg) {
    var cmd = 'npm uninstall ' + pkg
    console.log('  running: ', chalk.yellow.bold(cmd))
    var output = child.execSync(cmd, { cwd: info.path.rootPath })
    console.log(output.toString())
}

module.exports = function use(pkg) {
    if (info.type === 'local') {
        console.log(
            chalk.read.bold('  ERROR: Picidae is in local position, you should run `npm uninstall ' + pkg + ' --save`!\n')
        )
    }
    else {
        uninstall(pkg)
    }
    process.exit()
}
