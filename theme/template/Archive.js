import React from 'react'
import {Link} from 'react-router'

import CatalogueItem from './Comps/CatalogueItem'

export default ({data, pluginData: {utils}, themeConfig: {pageSize = 2}, params: {page = 1}}) => {
    let posts = utils.group('post');
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
                posts.map(({title, datetime, desc, _key}, i) =>
                    <CatalogueItem key={i} datetime={datetime} to={'/' + _key} title={title} content={desc}/>
                )
            }
            <div className="pagination">
                {pagination.prev && <Link to={'/posts/' + pagination.prev} className="left arrow">←</Link>}
                {pagination.next && <Link to={'/posts/' + pagination.next} className="right arrow">→</Link>}
                <a href="#" className="top">Top</a>
            </div>
        </div>
    )
}