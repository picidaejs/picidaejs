
export default class Demo extends React.Component {
    componentDidMount() {
        setInterval(() => this.forceUpdate(), 500)
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