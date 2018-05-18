/**
 * @file: find-parent-dir
 * @author: Cuttle Cong
 * @date: 2017/11/9
 * @description:
 */
const fs = require('./fs')
const nps = require('path')

function findParent(flag, start = process.cwd(), isFile = true) {
    if (!flag) return

    const path = nps.join(start, flag)
    if (isFile ? fs.isFile(path) : fs.isDirectory(path)) {
        return start
    }

    if (start === nps.resolve('/')) return
    return findParent(flag, nps.dirname(start), isFile)
}

module.exports = findParent
