// #!/usr/bin/env node
var nps = require('path')
var child = require('child_process')
var chalk = require('chalk')

var over = require('../lib/lib/utils/overwrite-require')
var _console = require('../lib/lib/utils/console').default
var info = over.getInfo()
var optionalDependencies = require(nps.join(info.path.rootPath, 'package.json')).optionalDependencies || {}

function uninstall(pkg) {
    var arr = pkg.split(/(?=@)/)
    arr.length > 1 && arr.pop()
    if (!optionalDependencies[arr.join('')]) {
        console.warn(chalk.red.bold('  Warn: '), '`' + arr.join('') + '`', 'is not be installed')
        return
    }
    var cmd = 'npm uninstall ' + pkg + ' --save-optional'
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
