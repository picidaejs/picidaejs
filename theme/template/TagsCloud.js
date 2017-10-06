import React from 'react'

export default (props) =>
    <div>
        <p>TagCloud</p>
        <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>