/**
 * @file: check-theme-config-file
 * @author: Cuttle Cong
 * @date: 2017/11/23
 * @description: 
 */

const PropTypes = require('prop-types')


const routeType = PropTypes.shape({
    path: PropTypes.string.isRequired,
    component: PropTypes.string.isRequired,
    indexRoute: PropTypes.shape({
       component: PropTypes.string,
    }),
    childRoutes: PropTypes.arrayOf(
        PropTypes.shape({
            path: PropTypes.string.isRequired,
            component: PropTypes.string.isRequired,
        })
    )
})
const except = {
    root: PropTypes.string.isRequired,
    routes: PropTypes.oneOfType([
        routeType, PropTypes.arrayOf(routeType)
    ]),
    notFound: PropTypes.string.isRequired,
    config: PropTypes.shape({
        routesMap: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
    }),
    plugins: PropTypes.arrayOf(PropTypes.string),
    picker: PropTypes.func
};

function check(props) {
    PropTypes.checkPropTypes(except, props, 'config', 'Picidae Theme Configuration')
}

module.exports = check