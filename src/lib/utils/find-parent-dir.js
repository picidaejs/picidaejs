/**
 * @file: find-parent-dir
 * @author: Cuttle Cong
 * @date: 2017/11/9
 * @description: 
 */
const fs = require('./fs')
const nps = require('path')

function findParent(flag, start = process.cwd()) {
    if (!flag) return

    const path = nps.join(start, flag)
    if (fs.isFile(path)) {
        return start
    }

    if (start === nps.resolve('/')) return
    return findParent(flag, nps.dirname(start))
}

module.exports = findParent