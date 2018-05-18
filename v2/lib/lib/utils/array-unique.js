"use strict";

/**
 * @file: array-unique
 * @author: Cuttle Cong
 * @date: 2017/10/29
 * @description: 
 */

function unique() {
    var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var getKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (key) {
        return key;
    };

    var map = {};
    var list = [];
    arr.forEach(function (val, i) {
        var k = getKey(val, i);
        if (!map[k]) {
            map[k] = true;
            list.push(val);
        }
    });

    return list;
}

module.exports = unique;