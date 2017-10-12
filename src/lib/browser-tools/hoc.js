import React from 'react'
import NProgress from 'nprogress'

function wrap(Component, extra) {
    return class HOC extends React.Component {
        componentDidMount(...args) {
            NProgress.done()
        }

        render() {
            const {children, ...props} = this.props;
            return <Component {...extra} {...props}>{children}</Component>
        }
    }
}

function inverseExtend(Component) {
    return class HOC extends Component {
        componentDidMount(...args) {
            super.componentDidMount && super.componentDidMount.apply(this, args);
        }
    }
}


export default function hoc(data) {
    return Component =>
        wrap(Component, data);
}