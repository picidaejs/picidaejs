/**
 * @file: globalRequire
 * @author: Cuttle Cong
 * @date: 2017/12/26
 * @description:
 */

const resolvePath = require('resolve')
const nps = require('path')

module.exports = function create(dirname = __dirname) {

    function globalRequire (modulePath) {
        const path = globalRequire.resolve(modulePath)
        return require(path)
    }

    return Object.assign(globalRequire, require, {
        resolve (modulePath) {
            // if (modulePath.trim().startsWith('.')) {
            //     modulePath = nps.join(dirname, modulePath)
            // }
            let path
            try {
                path = require.resolve(modulePath)
            } catch (ex) {
                path = resolvePath.sync(modulePath, { basedir: process.cwd() })
            }
            return path
        }
    })
}
