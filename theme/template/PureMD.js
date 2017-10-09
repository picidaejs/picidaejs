import React from 'react'
import collect from 'picidae-tools/browser/collect'
import moment from 'moment'
import {Link} from 'react-router'


const View = (props) => {
    const {render} = props;

    return (
        <div className="post">
            <div className="post-info">
                <div className="post-info">
                    <span>Written&nbsp;</span>
                    <span>on&nbsp;</span>
                    <time dateTime={props.pageData.meta.datetime}>{moment(props.pageData.meta.datetime).format('ll')}</time>
                </div>
            </div>
            <h1 className="post-title">{props.pageData.meta.title}</h1>
            <div className="post-line"></div>
            {/*<article dangerouslySetInnerHTML={{__html: props.pageData.markdown.content}}></article>*/}
            {render()}
            <div className="pagination">
                <a href="#" className="top">Top</a>
            </div>
        </div>
    )
}

export default collect()(View)

