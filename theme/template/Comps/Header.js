import React from 'react'
import {Link} from 'react-router'

export default ({}) =>
    <nav className="nav">
        <div className="nav-container">
            <Link href={'/'}>
                <h2 className="nav-title">Me</h2>
            </Link>
            <ul>
                <li><Link to={'/' + "about"}>About</Link></li>
                {/*<li><Link to="/tags">Tags</Link></li>*/}
            </ul>
        </div>
    </nav>