import React from 'react';

export default function renderUtil(pageData, transformers = []) {

    function tailTransformer(pageData) {
        if (!pageData || !pageData.markdown) {
            return null;
        }
        return (
            <article dangerouslySetInnerHTML={{__html: pageData.markdown.content}} />
        );
    }
    transformers = transformers.concat(tailTransformer);

    return transformers.reduce(
        (pageData, transformer) => transformer(pageData),
        pageData
    );
}