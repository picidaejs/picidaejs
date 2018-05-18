/**
 * @file: array-unique
 * @author: Cuttle Cong
 * @date: 2017/10/29
 * @description: 
 */

function unique(arr = [], getKey = key => key) {
    const map = {};
    const list = [];
    arr.forEach((val, i) => {
        let k = getKey(val, i);
        if (!map[k]) {
            map[k] = true;
            list.push(val);
        }
    });

    return list;
}

module.exports = unique;