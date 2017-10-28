module.exports = {
    hello: 'world -> default',
    pageSize: 10,

    routesMap: function (pathname) {
        console.log(pathname);

        var map = {
            'CHANGELOG.md': 'changelog',
            'home.md': 'index.md',
            // 'doc/index.md': 'changelog',
            // 'doc': ''
            // 'api': 'post',
        };

        return map[pathname];
    }
}