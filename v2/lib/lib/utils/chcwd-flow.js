"use strict";

/**
 * @file: chcwd-flow
 * @author: Cuttle Cong
 * @date: 2017/11/9
 * @description: 
 */

module.exports = function () {
  var where = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.cwd();
  var workflow = arguments[1];

  var old = process.cwd();
  process.chdir(where);
  workflow && workflow();
  process.chdir(old);
};