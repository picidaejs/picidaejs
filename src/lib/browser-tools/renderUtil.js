import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
import html2React from 'html2react';



class MarkdownRoot extends React.Component {
    componentDidMount() {
        const {callbackCollection = []} = this.props;

        const dom = ReactDOM.findDOMNode(this);
        callbackCollection.forEach(callback => callback(dom))
    }

    render() {
        const pageData = this.props.pageData;
        if (!pageData || !pageData.markdown) {
            return null;
        }

        return (
            <article>
                {
                    html2React(pageData.markdown.content, {
                        a: ({href, ...props}) => (
                            /^\s*(http:|https:|ftp:)\/\//.test(href)
                                ? <a href={href} {...props}/>
                                : <Link {...props} to={href}/>
                        )
                    })
                }
            </article>
        );
    }
}

export default function renderUtil(pageData, transformers = []) {
    const collection = [];

    function tailTransformer(pageData) {
        return <MarkdownRoot callbackCollection={collection} pageData={pageData} />;
    }
    transformers = transformers.concat(tailTransformer);

    return transformers.reduce(
        (pageData, transformer) =>
            transformer.call({
                callbackCollect(callback) {
                    if (typeof callback === 'function') {
                        collection.push(callback);
                    }
                }
            }, pageData),
        pageData
    );
}