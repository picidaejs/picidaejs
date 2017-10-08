var getPickerUtils = require('picidae-tools/node/getPickerUtils');


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

    picker(metaData, gift, require) {
        var content = gift.content,
            filename = gift.filename,
            getHTML = gift.getHTML;
        var utils = getPickerUtils(metaData, gift, require);


        return utils.md2Toc(content)
            .then(function (toc) {
                return getHTML()
                    .then(function (html) {
                        return Object.assign(metaData, {desc: content, toc: toc});
                    })
            })
    },
}