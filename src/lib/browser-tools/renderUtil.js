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
            const href = node.attribs && node.attribs['href'];
            return node.name === 'a'
                && href != null
                && !href.startsWith('#')
                && !/^(http:|https:|ftp:)\/\//.test(href.trim());
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

    componentWillUnmount() {
        const {unmountCollection = []} = this.props;
        unmountCollection.forEach(callable => callable(this.props));
    }

    render() {
        const {pageData, convertRules} = this.props;
        if (!pageData || !pageData.markdown) {
            return null;
        }

        let comp = htmlToReactParser.parseWithInstructions(
            pageData.markdown.content,
            isValidNode,
            convertRules.concat(processingInstructions)
        );

        return (
            <article>
                {comp}
            </article>
        );
    }
}

export default function renderUtil(pageData, transformers = []) {
    const collection = [];
    const unmountCollection = [];
    function callbackCollect(callback) {
        if (typeof callback === 'function') {
            collection.push(callback);
        }
    }
    function unmountCallbackCollect(callback) {
        if (typeof callback === 'function') {
            unmountCollection.push(callback);
        }
    }

    const convertRules = transformers.reduce(
        (convertRules, transformer) => {
            const ret = transformer.call({callbackCollect, unmountCallbackCollect}, pageData);
            if (typeof ret === 'object') {
                convertRules = convertRules.concat(ret);
            }
            return convertRules;
        }, []
    );

    return <MarkdownRoot convertRules={convertRules} unmountCollection={unmountCollection} callbackCollection={collection} pageData={pageData} />;
}