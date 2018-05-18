"use strict";

/**
 * @file: each
 * @author: Cuttle Cong
 * @date: 2017/10/29
 * @description: 
 */

module.exports = function (data, fn) {
    if (Array.isArray(data)) {
        data.forEach(function (val, i, all) {
            return fn(val, i, i, all);
        });
    } else {
        Object.keys(data).forEach(function (key, i) {
            return fn(data[key], key, i, data);
        });
    }
};