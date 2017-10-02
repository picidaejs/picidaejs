import React from 'react'
import ReactDOMServer from 'react-dom/server';
import {match, RouterContext} from 'react-router'

import routes from './routes'
import createElement from './createElement'

export default function ssr(url, callback) {

    match({ routes: routes, location: url }, function (error, redirectLocation, renderProps) {
        if (error) {
            callback('');
        } else if (redirectLocation) {
            callback(''); // TODO
        } else if (renderProps) {
            // renderToStaticMarkup
            const content = ReactDOMServer.renderToString(
                <RouterContext
                    {...renderProps}
                    createElement={createElement}
                />
            );
            callback(content);
        } else {
            callback(''); // TODO
        }
    });
}
