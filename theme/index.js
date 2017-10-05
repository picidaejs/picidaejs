
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
            {
                path: 'tags',
                component: './TagsCloud'
            },
            {
                path: 'tags/:tag',
                component: './Tag'
            }
        ]
    },
    notFound: './NotFound',

    root: './template',

    picker(metaData, content, filename) {
        return Object.assign(metaData, {desc: content});
    },
}