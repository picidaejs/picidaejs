import React from 'react'
import {Link} from 'react-router'

export default ({publicPath}) =>
    <nav className="nav">
        <div className="nav-container">
            <Link href={publicPath}>
                <h2 className="nav-title">Me</h2>
            </Link>
            <ul>
                <li><Link to={publicPath + "about"}>About</Link></li>
                {/*<li><Link to="/tags">Tags</Link></li>*/}
            </ul>
        </div>
    </nav>