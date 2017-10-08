import React from 'react'
import {Link} from 'react-router'

export default ({}) =>
    <nav className="nav">
        <div className="nav-container">
            <Link to={'/'}>
                <h2 className="nav-title">Picidae</h2>
            </Link>
            <ul>
                <li><Link activeClassName={"active-header"} to={'/guide'}>Guide</Link></li>
                <li><Link activeClassName={"active-header"} to={'/docs/1'}>Document</Link></li>
                <li><Link activeClassName={"active-header"} to={'/changelog'}>ChangeLog</Link></li>
                <li><Link activeClassName={"active-header"} to={'/about'}>About Me</Link></li>
            </ul>
        </div>
    </nav>