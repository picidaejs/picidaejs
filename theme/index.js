
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
                path: 'post/:title',
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


}