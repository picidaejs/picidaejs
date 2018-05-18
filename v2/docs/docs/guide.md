---
title: 粗心的向导
---

come on，put your hand up！:hand:

## 安装/使用

<iframe width="854" height="480" src="https://www.youtube.com/embed/zHrFPTQ-2v0" frameborder="0" allowfullscreen></iframe>

## Transformer 的使用

<iframe width="854" height="480" src="https://www.youtube.com/embed/cnLSxesDt1U" frameborder="0" allowfullscreen></iframe>

## Picidae Build

<iframe width="854" height="480" src="https://www.youtube.com/embed/AmX3L9oh9tk" frameborder="0" allowfullscreen></iframe>

### Picidae 配置

```js
module.exports = {
    // 更新webpack的配置
    webpackConfigUpdater(config, webpack) {
        return config;
    },
    // picidae start 服务的端口
    port: 9999,
    // 与webpack中publicPath概念相同
    publicPath: '/picidaejs/public/',
    // 配置的主题
    theme: '../theme',
    // 文档的根目录
    docRoot: './docs',
    // build后资源放置的根目录
    distRoot: './public',
    // 模板的根目录，其中html模板为 templateRoot 下的index.html
    templateRoot: './templates',
    // build过程中额外的资源，将会被复制到distRoot
    extraRoot: './extra',
    // 主题的配置根目录
    themeConfigsRoot: './theme-configs',
    // docRoot中被排除的规则，可以是 RegExp | String | (filename) => exclude
    excludes: [/example/, /api/, /\/refs\//],

    transformers: [
        'picidae-transformer-react-render?lang=render-jsx', 'picidae-transformer-file-syntax',
        './test/style-loader?lang=style'
    ],

    commanders: [
        '../commanders/new?title=abc',
        '../commanders/preview',
        // 'gh-pages?repo=',
        // 'deploy'
    ]
}
```

### 主题配置
