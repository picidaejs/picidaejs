import NProgress from 'nprogress'

if (typeof require.ensure !== 'function') {
    require.ensure = (dependencies, callback) => {
        return callback(require)
    }
}

export default [
    {
        path: '/',
        onEnter: () => {
            if (typeof document !== 'undefined') {
                NProgress.start();
            }
        },
        component: void 0,
        getComponent: (nextState, callback) => {
            require.ensure([], require =>
                callback(null, require('./pages/Index').default || require('./pages/Index'))
            )
        }
    },
    {
        path: '/1',
        onEnter: () => {
            if (typeof document !== 'undefined') {
                NProgress.start();
            }
        },
        component: void 0,
        getComponent: (nextState, callback) => {
            require.ensure([], require =>
                callback(null, require('./pages/Index').default || require('./pages/Index'))
            )
        }
    },
    {
        path: '/other',
        onEnter: () => {
            if (typeof document !== 'undefined') {
                console.log('onEnter')
                NProgress.start();
            }
        },
        component: undefined,
        getComponent: (location, callback) => {
            require.ensure([], require =>
                callback(null, require('./pages/Other').default || require('./pages/Other'))
            )
        }
    },
    {
        path: '*',
        onEnter: () => {
            if (typeof document !== 'undefined') {
                console.log('onEnter')
                NProgress.start();
            }
        },
        component: undefined,
        getComponent: (location, callback) => {
            require.ensure([], require =>
                callback(null, require('./pages/NotFound').default || require('./pages/NotFound'))
            )
        }
    }
]