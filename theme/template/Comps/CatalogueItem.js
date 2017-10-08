import React from 'react'
import {Link} from 'react-router'
import moment from 'moment'

export default ({datetime, to, title, content, render}) =>
    <a href={to} className="catalogue-item">
        <div>
            <time dateTime={datetime} className="catalogue-time">{moment(datetime).format('ll')}</time>
            <h1 className="catalogue-title">{title}</h1>
            <div className="catalogue-line"></div>
            {render ? render() : <p dangerouslySetInnerHTML={{__html: content}}/>}
        </div>
    </a>