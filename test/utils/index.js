var nps = require('path')

module.exports = {
    fixturePath(subPath){
        return nps.join(__dirname, '../fixture', subPath)
    }
}