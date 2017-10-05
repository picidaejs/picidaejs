import React from 'react'
import collect from 'picidae-tools/browser/collect'


async function collector(nextProps) {
    if (nextProps.pageData) {
        let data = await nextProps.pageData()
        return {pageData: data};
    }
    return false;
}

const View = ({pageData}) =>
    <div>
        <p>Post</p>
        <pre>{JSON.stringify(pageData)}</pre>
    </div>

export default collect(collector)(View)