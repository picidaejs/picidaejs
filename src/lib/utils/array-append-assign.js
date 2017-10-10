
function assign(source, ...list) {
    return list.reduce(function (source, obj) {
        if (Array.isArray(source)) {
            source.push(obj);
        }
        else {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (Array.isArray(obj[key])) {
                        source[key] = Array.isArray(source[key]) ? source[key] : []
                        source[key] = source[key].concat(obj[key])
                    }
                    else {
                        if (Array.isArray(source[key])) {
                            source[key].push(obj[key])
                        }
                        else {
                            source[key] = obj[key]
                        }
                    }
                }
            }
        }

        return source;
    }, source)
}


module.exports = assign