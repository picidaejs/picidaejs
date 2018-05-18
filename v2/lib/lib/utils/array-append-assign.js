"use strict";

function assign(source) {
    for (var _len = arguments.length, list = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        list[_key - 1] = arguments[_key];
    }

    return list.reduce(function (source, obj) {
        if (Array.isArray(source)) {
            source.push(obj);
        } else {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (Array.isArray(obj[key])) {
                        source[key] = Array.isArray(source[key]) ? source[key] : [];
                        source[key] = source[key].concat(obj[key]);
                    } else {
                        if (Array.isArray(source[key])) {
                            source[key].push(obj[key]);
                        } else {
                            source[key] = obj[key];
                        }
                    }
                }
            }
        }

        return source;
    }, source);
}

module.exports = assign;