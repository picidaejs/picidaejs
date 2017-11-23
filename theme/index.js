var getPickerUtils = require('picidae-tools/node/getPickerUtils');


module.exports = {
    routes: [{
        path: '/',
        component: './Layout',
        indexRoute: {
            component: './PureMD',
        },
        childRoutes: [
            {
                path: 'doc/*',
                component: './Post'
            },
            {
                path: 'docs/:page',
                component: './Archive'
            },
            {
                path: 'changelog',
                component: './PureMD'
            },
            {
                path: 'about',
                component: './PureMD'
            },
            {
                path: 'guide',
                component: './PureMD'
            },
        ]
    }],
    notFound: './NotFound',

    root: './template',

    plugins: [
        // 'toc?depth=3'
    ],

    picker(metaData, gift, require) {
        var content = gift.content,
            filename = gift.filename,
            getMarkdownData = gift.getMarkdownData,
            path = gift.path;
        var utils = getPickerUtils(metaData, gift, require);

        return utils.getToc()
            .then(function (toc) {
                var meta = Object.assign(metaData, {toc: toc});
                if (!path.includes('/')) {
                    return meta
                }
                return getMarkdownData().then(data => Object.assign(meta, {desc: data}))
            })
    },
}