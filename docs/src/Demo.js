import React from 'react';

export default class Demo extends React.Component {
    componentDidMount() {
        this.t = setInterval(() => this.forceUpdate(), 500)
    }
    componentWillUnmount() {
        clearInterval(this.t)
    }
    render() {
        return (
            <div>
                <h3>This is cool times {Date.now()}</h3>
                <PureText/>
            </div>
        )
    }
}