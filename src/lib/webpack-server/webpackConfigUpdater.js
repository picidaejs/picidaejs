
function preAppendEntry(entry) {
    let preset = ['babel-polyfill', 'webpack-hot-middleware/client?reload=true']
    if (typeof entry === 'string') {
        entry = preset.concat(entry)
    }
    else if (Array.isArray(entry)) {
        entry = preset.concat(...entry)
    }
    else {
        for (let k in entry) {
            entry[k] = preAppendEntry(entry[k])
        }
    }
    return entry;
}

export default function webpackConfigUpdater(config = {}) {
    let {entry = {}} = config;

    entry = preAppendEntry(entry)

    return {
        ...config,
        entry
    }
}