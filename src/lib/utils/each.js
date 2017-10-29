/**
 * @file: each
 * @author: Cuttle Cong
 * @date: 2017/10/29
 * @description: 
 */

module.exports = function (data, fn) {
    if (Array.isArray(data)) {
        data.forEach((val, i, all) => fn(val, i, i, all))
    }
    else {
        Object.keys(data).forEach((key, i) => fn(data[key], key, i, data))
    }
}