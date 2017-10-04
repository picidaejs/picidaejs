
const fs = require('fs')

fs.copySync = function (src, dest) {
    return fs.writeFileSync(dest, fs.readFileSync(src))
}

module.exports = fs