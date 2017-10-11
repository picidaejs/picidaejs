import React from 'react'

function wrap(Component, extra) {
    return class HOC extends React.Component {
        componentDidMount(...args) {
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


export default function hoc({location, ...data}) {
    return Component => {
        Component[location.pathname] = data;
        return Component;
    }
}