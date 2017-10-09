function stringify(obj) {
    let str = JSON.stringify(obj, function (key, value) {
        if (value && value.PICIDAE_EVAL_CODE === true) {
            if (typeof value.value === 'string' && value.value) {
                return 'PICIDAE_EVAL_CODE' + value.value + 'PICIDAE_EVAL_CODE'
            }
        }
        return value;
    }, 2);

    return str.replace(/(['"])PICIDAE_EVAL_CODE([^]+?)PICIDAE_EVAL_CODE\1/g, '$2')
}

module.exports = stringify