/**
 * @file: loadFront
 * @author: Cuttle Cong
 * @date: 2017/11/5
 * @description: 
 */

const yamlFront = require('yaml-front-matter');

const load = yamlFront.loadFront;
yamlFront.loadFront = function (content, name) {
    const data = load(content, name);
    const offset = new Date().getTimezoneOffset();
    for (let key in data) {
        if (data[key] instanceof Date) {
            data[key].setMinutes(data[key].getMinutes() + offset);
        }
    }
    return data;
};
module.exports = yamlFront;