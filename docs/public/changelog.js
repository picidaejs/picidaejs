webpackJsonp([7,8],{455:function(n,a){n.exports={content:'<h2 id="发行版"><a href="#%E5%8F%91%E8%A1%8C%E7%89%88" aria-hidden="true"><span class="icon icon-link"></span></a>发行版</h2>\n<ul>\n<li>\n<p>v0.0.16<br>\n修复不支持文件名中包含<code>\'</code>bug</p>\n</li>\n<li>\n<p>v0.0.15<br>\nNodeTransformer 支持 Markdown、Remark、HTML Transformer<br>\nBrowserTransformer 支持 callbackCollect/unmountCallbackCollect</p>\n</li>\n</ul>\n<h2 id="测试版"><a href="#%E6%B5%8B%E8%AF%95%E7%89%88" aria-hidden="true"><span class="icon icon-link"></span></a>测试版</h2>\n<h3 id="初始版本"><a href="#%E5%88%9D%E5%A7%8B%E7%89%88%E6%9C%AC" aria-hidden="true"><span class="icon icon-link"></span></a>初始版本</h3>\n<h4 id="功能"><a href="#%E5%8A%9F%E8%83%BD" aria-hidden="true"><span class="icon icon-link"></span></a>功能</h4>\n<ol>\n<li><code>picidae start</code><br>\n开启webpack服务器，根据picidae配置（theme，routesMap，transformer, plugin...）生成前端代码。\n根据文档目录，自动生成 docsEntry（支持懒加载）</li>\n</ol>\n<p>docsEntry: 指的是 <code>url -> absolute filename</code> 的映射</p>\n<p>start 就是开发环境，除了加入热更新 (WebpackHotMiddlemare) ，同时检测主题配置文件和文档目录中文件的变动。\n自动同步更新前端代码。</p>\n<p>其中：文档（markdown）内容包括 meta/content，如下 文本开头的<code>--- * ---</code> 中的为meta文本（yaml格式），\n之后的为 markdown 内容本身，即content</p>\n<pre><code class="hljs language-markdown">---\ntitle: im title of meta\n<span class="hljs-section">datetime: 2017-09-09 10:22\n---</span>\n\nim content</code></pre>\n<ol start="2">\n<li><code>build</code><br>\n首先同样需要同 <code>start</code> 一样，生成前端代码，执行 webpack build。\n之后再一次执行 webpack build, <code>target: node</code>, 用来生成node环境下执行的代码（逻辑为生成routes）\n之后在node环境执行第二次webpack打包的代码，得到routes。\n最后就是根据docsEntry和主题配置中的routes得到初版的routes，结合Server Side Render 依次得到每个路由的HTML，并写入文件。\n（还有spider的概念，根据生成的html，得到新的path，进而产生新的html）</li>\n</ol>\n<h4 id="特性"><a href="#%E7%89%B9%E6%80%A7" aria-hidden="true"><span class="icon icon-link"></span></a>特性</h4>\n<ul>\n<li>Transfomers：<br>\ntransformer 分为两类：NodeTransformer / BrowserTransformer\n其中 NodeTransformer 分为 MarkdownTransformer 和 HTMLTransformer，分别对 markdown/html 文本进行自定义的转换，得到新的 data（执行环境在node）<br>\nBrowserTransformer 则为在浏览器环境下执行的转换，其中在浏览器中的 data 为 html 本身。</li>\n</ul>\n<ol>\n<li>\n<p>react-render<br>\n使用 HTMLTransformer 和 BrowserTransformer 实现。<br>\n用法：在markdown文本中，书写如下，就可以在markdown下面自动生成该组件的View</p>\n<pre><code class="hljs language-markdown"><span class="hljs-code">```render-jsx\nexport default () => &#x3C;h1>im H1&#x3C;/h1>\n```</span></code></pre>\n</li>\n<li>\n<p>file-syntax<br>\n使用 MarkdownTransformer 实现。<br>\n用法1：在markdown文本中，书写如下，可以直接得到其中的文本的内容。其中路径只能是相对于本文件路径。\n(不支持自己读取本身内容，会循环嵌套)</p>\n<pre><code class="hljs language-markdown">@./path/to/file@</code></pre>\n<p>用法2：在markdown文本中，书写如下，可以直接页面生成一个跳转到该文件的link。（根据docsEntry实现）</p>\n<pre><code class="hljs language-markdown">@link::[title]./path/to/file@\n@link::./path/to/file@</code></pre>\n<p>在meta中书写</p>\n<pre><code class="hljs language-yaml"><span class="hljs-meta">---</span>\n<span class="hljs-comment"># both： 功能全部关闭</span>\n<span class="hljs-comment"># link： link 功能关闭</span>\n<span class="hljs-comment"># file-content： file-content 功能关闭</span>\n<span class="hljs-attr">disable-file-syntax:</span> <span class="hljs-string">both</span>\n<span class="hljs-meta">---</span></code></pre>\n</li>\n</ol>\n<ul>\n<li>\n<p>Plugins:<br>\nplugin执行在浏览器端，适合于主题开发者，默认注入了 utils plugin</p>\n</li>\n<li>\n<p>Commanders：<br>\n支持扩展命令行</p>\n</li>\n<li>\n<p>Theme：\n自定义开发主题</p>\n</li>\n</ul>\n'}}});