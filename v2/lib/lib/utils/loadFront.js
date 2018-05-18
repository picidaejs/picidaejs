'use strict';

/**
 * @file: loadFront
 * @author: Cuttle Cong
 * @date: 2017/11/5
 * @description: 
 */

var yamlFront = require('yaml-front-matter');

var load = yamlFront.loadFront;
yamlFront.loadFront = function (content, name) {
    var data = load(content, name);
    var offset = new Date().getTimezoneOffset();
    for (var key in data) {
        if (data[key] instanceof Date) {
            data[key].setMinutes(data[key].getMinutes() + offset);
        }
    }
    return data;
};
module.exports = yamlFront;