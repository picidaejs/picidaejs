webpackJsonp([7,9],{431:function(e,n,s){e.exports={content:'<p>hello, im <code>api/a.markdown</code>!</p>\n<pre><code class="hljs language-render-jsx"><span class="hljs-regexp">//</span> <span class="hljs-keyword">import</span> React <span class="hljs-keyword">from</span> <span class="hljs-string">&apos;react&apos;</span>\nconst PureText = <span class="hljs-function"><span class="hljs-params">()</span> =&gt;</span>\n    &lt;div&gt;Text&lt;/div&gt;;\n\n<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">Demo</span> <span class="hljs-keyword">extends</span> <span class="hljs-title">React</span>.<span class="hljs-title">Component</span> {</span>\n    componentDidMount() {\n        setInterval(<span class="hljs-function"><span class="hljs-params">()</span> =&gt;</span> <span class="hljs-keyword">this</span>.forceUpdate(), <span class="hljs-number">500</span>)\n    }\n    render() {\n        <span class="hljs-keyword">return</span> (\n            &lt;div&gt;\n                &lt;h3&gt;This <span class="hljs-keyword">is</span> cool times {Date.now()}&lt;/h3&gt;\n                &lt;PureText/&gt;\n            &lt;/div&gt;\n        )\n    }\n}</code><transformer-react-render data-id="0"><div data-reactroot="" data-reactid="1" data-react-checksum="2057847566"><h3 data-reactid="2"><!-- react-text: 3 -->This is cool times <!-- /react-text --><!-- react-text: 4 -->1507439148053<!-- /react-text --></h3><div data-reactid="5">Text</div></div></transformer-react-render></pre>\n<pre><code class="hljs language-render-jsx">const hoc = <span class="hljs-type">Comp</span> =&gt; (<span class="hljs-type">Comp</span>.title = <span class="hljs-symbol">&apos;new</span> <span class="hljs-type">Title</span>&apos;, <span class="hljs-type">Comp</span>)\n\n<span class="hljs-meta">@hoc</span>\nexport <span class="hljs-keyword">default</span> <span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">Comp</span> <span class="hljs-keyword">extends</span> <span class="hljs-title">React</span>.<span class="hljs-title">Component</span> </span>{\n  static title = <span class="hljs-symbol">&apos;titl</span>e&apos;\n  componentDidMount() {\n    \n  }\n  render() {\n    <span class="hljs-keyword">return</span> (\n        &lt;h3 onClick={() =&gt; alert(<span class="hljs-type">Date</span>.now())}&gt;\n          {<span class="hljs-type">Comp</span>.title}\n        &lt;/h3&gt;\n    )\n  }\n}</code><transformer-react-render data-id="1"><h3 data-reactroot="" data-reactid="1" data-react-checksum="-543813258">new Title</h3></transformer-react-render></pre>\n<pre><code class="hljs language-jsx"><span class="hljs-comment">// import React from &apos;react&apos;</span>\n<span class="hljs-keyword">const</span> PureText = <span class="hljs-function"><span class="hljs-params">()</span> =&gt;</span>\n    &lt;div&gt;Text&lt;<span class="hljs-regexp">/div&gt;;</span></code></pre>\n',"transformer-react-render":{list:['function anonymous(React,Component,ReactDOM,require\n/*``*/) {\n\nvar exports = {}, module = {};\nmodule.exports = exports;\n(function picidaeTransformerReactRender() {\n    Object.defineProperty(exports, "__esModule", {\n        value: true\n    });\n\n    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\n    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n\n    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }\n\n    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\n    // import React from \'react\'\n    var PureText = function PureText() {\n        return React.createElement(\n            "div",\n            null,\n            "Text"\n        );\n    };\n\n    var Demo = function (_React$Component) {\n        _inherits(Demo, _React$Component);\n\n        function Demo() {\n            _classCallCheck(this, Demo);\n\n            return _possibleConstructorReturn(this, (Demo.__proto__ || Object.getPrototypeOf(Demo)).apply(this, arguments));\n        }\n\n        _createClass(Demo, [{\n            key: "componentDidMount",\n            value: function componentDidMount() {\n                var _this2 = this;\n\n                setInterval(function () {\n                    return _this2.forceUpdate();\n                }, 500);\n            }\n        }, {\n            key: "render",\n            value: function render() {\n                return React.createElement(\n                    "div",\n                    null,\n                    React.createElement(\n                        "h3",\n                        null,\n                        "This is cool times ",\n                        Date.now()\n                    ),\n                    React.createElement(PureText, null)\n                );\n            }\n        }]);\n\n        return Demo;\n    }(React.Component);\n\n    exports.default = Demo;\n})(exports, module)\nreturn module.exports.default || module.exports;\n}','function anonymous(React,Component,ReactDOM,require\n/*``*/) {\n\nvar exports = {}, module = {};\nmodule.exports = exports;\n(function picidaeTransformerReactRender() {\n  Object.defineProperty(exports, "__esModule", {\n    value: true\n  });\n\n  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\n  var _class, _class2, _temp;\n\n  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n\n  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn\'t been initialised - super() hasn\'t been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }\n\n  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\n  var hoc = function hoc(Comp) {\n    return Comp.title = \'new Title\', Comp;\n  };\n\n  var Comp = hoc(_class = (_temp = _class2 = function (_React$Component) {\n    _inherits(Comp, _React$Component);\n\n    function Comp() {\n      _classCallCheck(this, Comp);\n\n      return _possibleConstructorReturn(this, (Comp.__proto__ || Object.getPrototypeOf(Comp)).apply(this, arguments));\n    }\n\n    _createClass(Comp, [{\n      key: "componentDidMount",\n      value: function componentDidMount() {}\n    }, {\n      key: "render",\n      value: function render() {\n        return React.createElement(\n          "h3",\n          {\n            onClick: function onClick() {\n              return alert(Date.now());\n            }\n          },\n          Comp.title\n        );\n      }\n    }]);\n\n    return Comp;\n  }(React.Component), _class2.title = \'title\', _temp)) || _class;\n\n  exports.default = Comp;\n})(exports, module)\nreturn module.exports.default || module.exports;\n}'],React:s(12),ReactDOM:s(186)}}}});
//# sourceMappingURL=a.js.map