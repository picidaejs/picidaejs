import React from 'react'
import collect from 'picidae-tools/browser/collect'
import moment from 'moment'
import {Link} from 'react-router'

const View = (props) => {
    let render = props.render;
    let publicPath = props.publicPath;
    let utils = props.pluginData && props.pluginData.utils;
    let pagination = utils && utils.pagination('post') || {}

    return (
        <div className="post">
            <div className="post-info">
                <div className="post-info">
                    <span>Written&nbsp;</span>
                    <br/>
                    <span>on&nbsp;</span>
                    <time dateTime={props.pageData.meta.datetime}>{moment(props.pageData.meta.datetime).format('lll')}</time>
                </div>
            </div>
            <h1 className="post-title">{props.pageData.meta.title}</h1>
            <div className="post-line"></div>
            {render()}
            <div className="pagination">
                {pagination.prev && <Link to={'/' + pagination.prev._key} title={pagination.prev.title} className="left arrow">←</Link>}
                {pagination.next && <Link to={'/' + pagination.next._key} title={pagination.next.title} className="right arrow">→</Link>}
                <a href="#" className="top">Top</a>
            </div>
        </div>
    )
}

export default collect()(View)
