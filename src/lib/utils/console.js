import chalk from 'chalk'

const warn = chalk.keyword('orange');
const debug = chalk.keyword('pink');
const error = chalk.bold.red;

export default {
    log(...args) {
        console.log.call(console, chalk.blue('Info :'), ...args)
    },
    warn(...args) {
        console.warn.call(console, warn('Warn :'), ...args)
    },
    error(...args) {
        console.error.call(console, error('Error!'), ...args)
    },
    debug(...args) {
        console.log.call(console, debug('@DEBUG'), ...args)
    }
}