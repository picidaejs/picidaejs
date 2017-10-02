import NProgress from 'nprogress'

export default [
    {
        path: '/',
        onEnter: () => {
            if (typeof document !== 'undefined') {
                NProgress.start();
            }
        },
        component: void 0,
        getComponent: () => {
            return new Promise(resolve => {
                require.ensure
                ? require.ensure([], () =>
                    resolve(require('./pages/Index').default || require('./pages/Index'))
                )
                : resolve(require('./pages/Index').default || require('./pages/Index'))
            });
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
            return new Promise(resolve => {
                require.ensure
                    ? require.ensure([], () =>
                    resolve(require('./pages/Other').default || require('./pages/Other'))
                )
                    : resolve(require('./pages/Other').default || require('./pages/Other'))
            });
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
            return new Promise(resolve => {
                require.ensure
                    ? require.ensure([], () =>
                    resolve(require('./pages/NotFound').default || require('./pages/NotFound'))
                )
                    : resolve(require('./pages/NotFound').default || require('./pages/NotFound'))
            });
        }
    }
]