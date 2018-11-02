import React from 'react'

import '../assets/style.less'

import Header from './Comps/Header'
import Footer from './Comps/Footer'

class Layout extends React.Component {

    render() {
        const {publicPath} = this.props;
        return (
            <div>
                <Header publicPath={publicPath}/>
                <main>{this.props.children}</main>
                <Footer/>
            </div>
        )
    }
}


export default Layout
