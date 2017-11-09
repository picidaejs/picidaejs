/**
 * @file: chcwd-flow
 * @author: Cuttle Cong
 * @date: 2017/11/9
 * @description: 
 */


module.exports = function (where = process.cwd(), workflow) {
    const old = process.cwd()
    process.chdir(where)
    workflow && workflow()
    process.chdir(old)
}