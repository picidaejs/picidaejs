webpackJsonp([3],{463:function(e,n,s){e.exports={content:'<div class="transformer-react-render-container"><pre><code class="hljs language-render-jsx" data-query="{&#x22;editable&#x22;:true}" data-lang="render-jsx"><span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> () => <span class="xml"><span class="hljs-tag">&#x3C;<span class="hljs-name">h1</span>></span>HHHH<span class="hljs-tag">&#x3C;/<span class="hljs-name">h1</span>></span></span></code></pre><transformer-react-render data-id="0"></transformer-react-render></div>\n<div class="transformer-react-render-container"><pre><code class="hljs language-render-jsx" data-query="{}" data-lang="render-jsx"><span class="hljs-regexp">//</span> 中文测试\n<span class="hljs-regexp">//</span> <span class="hljs-keyword">import</span> React <span class="hljs-keyword">from</span> <span class="hljs-string">\'react\'</span>\nconst PureText = <span class="hljs-function"><span class="hljs-params">()</span> =></span>\n    &#x3C;div>Text&#x3C;/div>;\n\n\n<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">Demo</span> <span class="hljs-keyword">extends</span> <span class="hljs-title">React</span>.<span class="hljs-title">Component</span> {</span>\n    componentDidMount() {\n        setInterval(<span class="hljs-function"><span class="hljs-params">()</span> =></span> <span class="hljs-keyword">this</span>.forceUpdate(), <span class="hljs-number">500</span>)\n    }\n    render() {\n        <span class="hljs-keyword">return</span> (\n            &#x3C;div>\n                &#x3C;h3>This <span class="hljs-keyword">is</span> cool times {Date.now()}&#x3C;/h3>\n                &#x3C;PureText/>\n            &#x3C;/div>\n        )\n    }\n}</code></pre><transformer-react-render data-id="1"></transformer-react-render></div>\n<div class="transformer-react-render-container"><pre><code class="hljs language-render-jsx" data-query="{}" data-lang="render-jsx"><span class="hljs-regexp">//</span> 中文测试\n<span class="hljs-regexp">//</span> <span class="hljs-keyword">import</span> React <span class="hljs-keyword">from</span> <span class="hljs-string">\'react\'</span>\nconst PureText = <span class="hljs-function"><span class="hljs-params">()</span> =></span>\n    &#x3C;div>Text&#x3C;/div>;\n\n\n<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">Demo</span> <span class="hljs-keyword">extends</span> <span class="hljs-title">React</span>.<span class="hljs-title">Component</span> {</span>\n    componentDidMount() {\n        setInterval(<span class="hljs-function"><span class="hljs-params">()</span> =></span> <span class="hljs-keyword">this</span>.forceUpdate(), <span class="hljs-number">500</span>)\n    }\n    render() {\n        <span class="hljs-keyword">return</span> (\n            &#x3C;div>\n                &#x3C;h3>This <span class="hljs-keyword">is</span> cool times {Date.now()}&#x3C;/h3>\n                &#x3C;PureText/>\n            &#x3C;/div>\n        )\n    }\n}</code></pre><transformer-react-render data-id="2"></transformer-react-render></div>\n',extra:{},"transformer-react-render":{list:[['function anonymous(React,Component,ReactDOM,require\n/*``*/) {\n\nvar exports = {}, module = {};\nmodule.exports = exports;\n(function picidaeTransformerReactRender() {\n  Object.defineProperty(exports, "__esModule", {\n    value: true\n  });\n\n  exports.default = function () {\n    return React.createElement(\n      "h1",\n      null,\n      "HHHH"\n    );\n  };\n})(exports, module)\nreturn module.exports.default || module.exports;\n}',{editable:!0}],['function anonymous(React,Component,ReactDOM,require\n/*``*/) {\n\nvar exports = {}, module = {};\nmodule.exports = exports;\n(function picidaeTransformerReactRender() {\n    Object.defineProperty(exports, "__esModule", {\n        value: true\n    });\n\n    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\n    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n\n    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }\n\n    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\n    // 中文测试\n    // import React from \'react\'\n    var PureText = function PureText() {\n        return React.createElement(\n            "div",\n            null,\n            "Text"\n        );\n    };\n\n    var Demo = function (_React$Component) {\n        _inherits(Demo, _React$Component);\n\n        function Demo() {\n            _classCallCheck(this, Demo);\n\n            return _possibleConstructorReturn(this, (Demo.__proto__ || Object.getPrototypeOf(Demo)).apply(this, arguments));\n        }\n\n        _createClass(Demo, [{\n            key: "componentDidMount",\n            value: function componentDidMount() {\n                var _this2 = this;\n\n                setInterval(function () {\n                    return _this2.forceUpdate();\n                }, 500);\n            }\n        }, {\n            key: "render",\n            value: function render() {\n                return React.createElement(\n                    "div",\n                    null,\n                    React.createElement(\n                        "h3",\n                        null,\n                        "This is cool times ",\n                        Date.now()\n                    ),\n                    React.createElement(PureText, null)\n                );\n            }\n        }]);\n\n        return Demo;\n    }(React.Component);\n\n    exports.default = Demo;\n})(exports, module)\nreturn module.exports.default || module.exports;\n}',{}],['function anonymous(React,Component,ReactDOM,require\n/*``*/) {\n\nvar exports = {}, module = {};\nmodule.exports = exports;\n(function picidaeTransformerReactRender() {\n    Object.defineProperty(exports, "__esModule", {\n        value: true\n    });\n\n    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\n    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n\n    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }\n\n    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\n    // 中文测试\n    // import React from \'react\'\n    var PureText = function PureText() {\n        return React.createElement(\n            "div",\n            null,\n            "Text"\n        );\n    };\n\n    var Demo = function (_React$Component) {\n        _inherits(Demo, _React$Component);\n\n        function Demo() {\n            _classCallCheck(this, Demo);\n\n            return _possibleConstructorReturn(this, (Demo.__proto__ || Object.getPrototypeOf(Demo)).apply(this, arguments));\n        }\n\n        _createClass(Demo, [{\n            key: "componentDidMount",\n            value: function componentDidMount() {\n                var _this2 = this;\n\n                setInterval(function () {\n                    return _this2.forceUpdate();\n                }, 500);\n            }\n        }, {\n            key: "render",\n            value: function render() {\n                return React.createElement(\n                    "div",\n                    null,\n                    React.createElement(\n                        "h3",\n                        null,\n                        "This is cool times ",\n                        Date.now()\n                    ),\n                    React.createElement(PureText, null)\n                );\n            }\n        }]);\n\n        return Demo;\n    }(React.Component);\n\n    exports.default = Demo;\n})(exports, module)\nreturn module.exports.default || module.exports;\n}',{}]],pkg:{react:s(10),"react-dom":s(99)}}}}});