
function preAppendEntry(entry, dev) {
    let preset = ['babel-polyfill', dev && 'webpack-hot-middleware/client?reload=true'].filter(Boolean)
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

export default function webpackConfigUpdater(config = {}, dev = true) {
    let {entry = {}} = config;

    entry = preAppendEntry(entry, dev)

    return {
        ...config,
        entry
    }
}