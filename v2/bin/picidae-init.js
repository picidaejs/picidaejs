// #!/usr/bin/env node
var mkdirp = require('mkdirp')
var nps = require('path')
var child = require('child_process')
var cp = require('copy-dir')
var chalk = require('chalk')

var fs = require('../lib/lib/utils/fs')
var _console = require('../lib/lib/utils/console').default

var resPath = nps.join(__dirname, 'res')

//
// init picidae project
// 1. check [path] is whether exited, mkdir path
// 2. check $path/picidae.config.js is whether exited
// 3.1. if $path/picidae.config.js is existed, exit 1
// 3.2. if $path/picidae.config.js isn't existed, entry step 4
// 4. create $path/picidae.config.js
// 5. log the recommended theme
//
module.exports = function (path) {
    path = path || process.cwd()
    path = nps.resolve(path)
    if (fs.isFile(path)) {
        _console.error('The File ' + chalk.yellow('(' + nps.relative(process.cwd(), path) + ')') + ' has already existed')
        process.exit(1)
    }
    !fs.existsSync(path) && mkdirp.sync(path)

    var configFilename = nps.join(path, 'picidae.config.js')
    if (fs.existsSync(configFilename)) {
        _console.error('The Config File ' + chalk.yellow('(' + nps.relative(process.cwd(), configFilename) + ')') + ' has already existed')
        process.exit(1)
    }

    console.log('  running: ', chalk.yellow.bold('npm init -y'))
    child.execSync('npm init -y', { cwd: path })

    cp.sync(resPath, path)

    var preappend = ''
    if (path !== process.cwd()) {
        preappend = 'cd ' + nps.relative(process.cwd(), path) + ' && '
    }
    // child.execSync('npm link ' + nps.join(__dirname, '..'), { cwd: path })

    console.log([
        chalk.cyan('\n  Thanks for you using picidae 🐦\n'),
        '    We recommend using the theme `picidae-theme-grass`',
        '    By running: ',
        '          ' + chalk.green.bold('`' + preappend +  'picidae use picidae-theme-grass && picidae start`'),
        '    And some other vendor likes ' + chalk.green.bold('`picidae use picidae-commander-gh-pages`')
    ].join('\n'))

    process.exit()
}


