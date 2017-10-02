
export default {

    routes: {
        path: '/',
        component: './Layout',
        indexRoute: {
            component: './Archive',
            path: '',
        },
        childRoutes: [
            {
                path: '/post/:title',
                component: './Post'
            },
            {
                path: '/tags',
                component: './TagsCloud'
            },
            {
                path: '/tags/:tag',
                component: './Tag'
            }
        ]
    },
    404: './NotFound',

    root: './template',
}