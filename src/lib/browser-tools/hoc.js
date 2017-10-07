import React from 'react'
import NProgress from 'nprogress'
import hoistNonReactStatic from 'hoist-non-react-statics';


function wrap(Component, extra) {
    return class HOC extends React.Component {
        componentDidMount(...args) {
            NProgress.done();
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
            NProgress.done();
        }
    }
}


export default function hoc({nextState, ...data}) {
    return Component => {
        // let matcher = Component['PICIDAE_MATCH_PATH']
        // if (nextState && matcher) {
        //     if (!matcher(nextState, data)) {
        //         return 'NOT_FOUND';
        //     }
        // }

        let Comp = wrap(Component, data);
        hoistNonReactStatic(Comp, Component);
        return Comp;
    }
}