import React from 'react'
import NProgress from 'nprogress'


export default function createElement(Component, props) {
    console.log('Custom createElement: ');
    console.log('  Component: ', Component);
    console.log('      props: ', props);

    NProgress.done();
    return React.createElement(Component, props)
}