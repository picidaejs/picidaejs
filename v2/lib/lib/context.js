"use strict";

exports.__init = function (data) {
    delete data.__init;
    return Object.assign(exports, data);
};