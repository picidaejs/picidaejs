import React from 'react'
import {Link} from 'react-router'

import CatalogueItem from './Comps/CatalogueItem'

export default ({data, render, publicPath, pluginData: {utils}, themeConfig: {pageSize = 2}, params: {page = 1}}) => {
    let posts = utils.group('doc');
    let pagination = {};

    page = Number(page)
    let start = (page - 1) * pageSize;
    let end = start + pageSize;

    if (page * pageSize < posts.length) {
        pagination.next = page + 1;
    }
    if (page > 1) {
        pagination.prev = page - 1;
    }

    posts = posts.slice(start, end);
    return (
        <div className="catalogue">
            {
                posts.map(({title, datetime, desc, _key, ...rest}, i) => {
                    let content = render({
                        markdown: desc,
                        meta: {title, datetime, ...rest}
                    });
                    return <CatalogueItem key={i} datetime={datetime} to={_key} title={title} content={content}/>
                })
            }
            <div className="pagination">
                {pagination.prev && <Link to={'/docs/' + pagination.prev} className="left arrow">←</Link>}
                {pagination.next && <Link to={'/docs/' + pagination.next} className="right arrow">→</Link>}
                <a href="#" className="top">Top</a>
            </div>
        </div>
    )
}