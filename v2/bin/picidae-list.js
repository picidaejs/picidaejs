#!/usr/bin/env node
// var nps = require('path')
var chalk = require('chalk')


module.exports = function list() {
    var optionalDependencies = require('../package.json').optionalDependencies || {}

    var keys = Object.keys(optionalDependencies)
    if (keys.length === 0) {
        console.error(chalk.red.bold(' Sorry, you don\'t installed any package. '))
        process.exit(1)
    }

    keys.forEach(function (key) {
        console.log(' ', chalk.white.bold(key), chalk.cyan.bold('v' + optionalDependencies[key]))
    })
    process.exit()
}
