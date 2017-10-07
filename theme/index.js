var getUtilsByRequire = require('picidae-tools/node/getUtilsByRequire');


module.exports = {

    routes: {
        path: '/',
        component: './Layout',
        indexRoute: {
            component: './Archive',
            path: '',
        },
        childRoutes: [
            {
                path: 'post/*',
                component: './Post'
            },
            // {
            //     path: 'tags',
            //     component: './TagsCloud'
            // },
            // {
            //     path: 'tags/:tag',
            //     component: './Tag'
            // },
            {
                path: 'posts/:page',
                component: './Archive'
            },
            {
                path: 'about',
                component: './About'
            }
        ]
    },
    notFound: './NotFound',

    root: './template',

    plugins: [
        'toc?depth=3'
    ],

    picker(metaData, {content, filename}, require) {
        var utils = getUtilsByRequire(require);
        return utils.md2Toc(content)
            .then(function (toc) {
                return Object.assign(metaData, {desc: content.substring(0, 50), toc: toc});
            })
    },
}