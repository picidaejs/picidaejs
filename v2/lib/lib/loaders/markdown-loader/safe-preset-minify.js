'use strict';

exports.settings = {
    entities: {
        omitOptionalSemicolons: true,
        useShortestReferences: true
    },
    quoteSmart: true,
    preferUnquoted: true,
    // Fix table minified
    omitOptionalTags: false,
    collapseEmptyAttributes: true,
    tightCommaSeparatedLists: true,
    tightAttributes: true,
    allowParseErrors: true,
    allowDangerousCharacters: true
};

exports.plugins = [require('rehype-minify-attribute-whitespace'), require('rehype-minify-css-style'), require('rehype-minify-event-handler'), require('rehype-minify-javascript-script'), require('rehype-minify-javascript-url'), require('rehype-minify-json-script'), require('rehype-minify-style-attribute'), require('rehype-minify-whitespace')];