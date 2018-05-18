"use strict";

module.exports = function () {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    if (str.length == 0) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;").replace(/\'/g, "&apos;").replace(/\"/g, "&quot;").replace(/\n/g, "<br/>");
};