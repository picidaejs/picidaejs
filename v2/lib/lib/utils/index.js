'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fileIsMarkdown = fileIsMarkdown;
exports.renderTemplate = renderTemplate;

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fileIsMarkdown(filename) {
    return (/\.(md|markdown)$/i.test(filename)
    );
}

function renderTemplate(templateFile, data, saveFile) {
    var rendered = _nunjucks2.default.renderString((0, _fs.readFileSync)(templateFile, { encoding: 'utf8' }), data);

    if (saveFile) {
        (0, _fs.writeFileSync)(saveFile, rendered);
    }
    return rendered;
}