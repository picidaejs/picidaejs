import chalk from 'chalk'

export default {
    log(...args) {
        console.log.call(chalk.green('Log:'), ...args)
    },
    warn(...args) {
        console.warn.call(chalk.orange('Warn:'), ...args)
    }
}