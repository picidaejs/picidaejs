import nps from 'path'

exports.tmpPath = nps.join(__dirname, '../tmp');
exports.templatePath = nps.join(__dirname, '../templates');

exports.assign = function (data) {
    Object.assign(exports, data);
}