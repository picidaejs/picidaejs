import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
const HtmlToReact = require('html-to-react');
const camelAttributeNames = require('html-to-react/lib/camel-case-attribute-names');
const utils = require('html-to-react/lib/utils');
const {Parser} = HtmlToReact;
const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
const htmlToReactParser = new Parser();

const processingInstructions = [
    {
        replaceChildren: false,
        shouldProcessNode: function (node) {
            return node.name === 'a'
                && ('href' in node.attribs)
                && !/^\s*(http:|https:|ftp:)\/\//.test(node.attribs['href']);
        },
        processNode: function (node, children, index) {
            node.name = Link;
            node.attribs['to'] = node.attribs['href'];
            delete node.attribs['href'];
            return utils.createElement(node, index, node.data, children);
        }
    },
    {
        shouldProcessNode: function (node) {
            return true;
        },
        processNode: processNodeDefinitions.processDefaultNode
    }
];

const isValidNode = function () {
    return true;
};



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
            {htmlToReactParser.parseWithInstructions(pageData.markdown.content, isValidNode, processingInstructions)}
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