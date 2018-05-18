const React = require('react');
const NProgress = require('nprogress');

module.exports = function createElement(Component, props) {
    NProgress.done();
    const key = props.location.pathname;
    return <Component {...props} {...Component[key]} />;
};