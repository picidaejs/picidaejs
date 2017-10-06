import React from 'react'

import '../assets/style.css'

import Header from './Comps/Header'
import Footer from './Comps/Footer'

class Layout extends React.Component {

    render() {
        const {pluginData: {utils}} = this.props;
        return (
            <div>
                <Header/>
                <main>{this.props.children}</main>
                <Footer/>
            </div>
        )
    }
}


export default Layout