
const fs = require('fs')
const nps = require('path')
const utils = require('util')

const ruleMatch = require('./rule-match')

function filesToTree(root, file, filter) {
    if (fs.statSync(file).isFile()) {
        if (ruleMatch(filter, file)) {
            return {
                type: 'file',
                file: file.substring(root.length).replace(/^\//, '')
            }
        }
    }
    else {
        let files = fs.readdirSync(file)
        files = files.map(f => filesToTree(root, nps.join(file, f), filter)).filter(Boolean)

        return {
            type: 'dir',
            file: file.substring(root.length).replace(/^\//, ''),
            files
        };
    }
}


function file2Tree(root, filter) {
    root = nps.resolve(root);
    let tree = filesToTree(root, root, filter);
    if (!tree) return tree;
    tree.file = root;
    return tree;
}

module.exports = file2Tree;