import React from 'react'
import NProgress from 'nprogress'


export default function hoc(Component) {
    return class HOC extends React.Component {
        componentDidMount(...args) {
            NProgress.done();
        }

        render() {
            const {children, ...props} = this.props;
            return <Component {...props}>{children}</Component>
        }
    }
}