
function match(rule, value) {
    if (typeof rule === 'function') {
        return rule(value)
    }
    if (typeof rule === 'string') {
        return value.indexOf(rule) >= 0
    }
    if (rule instanceof RegExp) {
        return !!rule.exec(value)
    }

    if (Array.isArray(rule)) {
        return rule.some(singleRule => match(singleRule, value))
    }
    return false;
}

module.exports = match;