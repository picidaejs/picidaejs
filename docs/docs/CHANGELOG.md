---
title: 更新说明
---

## 发行版

- v0.0.16  
修复不支持文件名中包含`'`bug

- v0.0.15  
NodeTransformer 支持 Markdown、Remark、HTML Transformer  
BrowserTransformer 支持 callbackCollect/unmountCallbackCollect

## 测试版

### 初始版本

#### 功能

1. `picidae start`  
开启webpack服务器，根据picidae配置（theme，routesMap，transformer, plugin...）生成前端代码。
根据文档目录，自动生成 docsEntry（支持懒加载）

docsEntry: 指的是 `url -> absolute filename` 的映射

start 就是开发环境，除了加入热更新 (WebpackHotMiddlemare) ，同时检测主题配置文件和文档目录中文件的变动。
自动同步更新前端代码。

其中：文档（markdown）内容包括 meta/content，如下 文本开头的`--- * ---` 中的为meta文本（yaml格式），
之后的为 markdown 内容本身，即content

```markdown
---
title: im title of meta
datetime: 2017-09-09 10:22
---

im content
```


2. `build`  
首先同样需要同 `start` 一样，生成前端代码，执行 webpack build。
之后再一次执行 webpack build, `target: node`, 用来生成node环境下执行的代码（逻辑为生成routes）
之后在node环境执行第二次webpack打包的代码，得到routes。
最后就是根据docsEntry和主题配置中的routes得到初版的routes，结合Server Side Render 依次得到每个路由的HTML，并写入文件。
（还有spider的概念，根据生成的html，得到新的path，进而产生新的html）


#### 特性

- Transfomers：  
transformer 分为两类：NodeTransformer / BrowserTransformer
其中 NodeTransformer 分为 MarkdownTransformer 和 HTMLTransformer，分别对 markdown/html 文本进行自定义的转换，得到新的 data（执行环境在node）  
BrowserTransformer 则为在浏览器环境下执行的转换，其中在浏览器中的 data 为 html 本身。

1. react-render  
  使用 HTMLTransformer 和 BrowserTransformer 实现。  
  用法：在markdown文本中，书写如下，就可以在markdown下面自动生成该组件的View
  ````markdown
  ```render-jsx
  export default () => <h1>im H1</h1>
  ```
  ````

2. file-syntax  
  使用 MarkdownTransformer 实现。  
  用法1：在markdown文本中，书写如下，可以直接得到其中的文本的内容。其中路径只能是相对于本文件路径。
  (不支持自己读取本身内容，会循环嵌套)
  ```markdown
  @./path/to/file@
  ```

  用法2：在markdown文本中，书写如下，可以直接页面生成一个跳转到该文件的link。（根据docsEntry实现）
  ```markdown
  @link::[title]./path/to/file@
  @link::./path/to/file@
  ```

  在meta中书写
  ````yaml
  ---
  # both： 功能全部关闭
  # link： link 功能关闭
  # file-content： file-content 功能关闭
  disable-file-syntax: both
  ---
  ````

- Plugins:  
plugin执行在浏览器端，适合于主题开发者，默认注入了 utils plugin

- Commanders：  
支持扩展命令行

- Theme： 
自定义开发主题