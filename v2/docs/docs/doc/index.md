---
title: Picidae？
datetime: 2017-10-10 10:00
---

Picidae 做的事情：
```
               (webpack/react)
document files -> picidae <- theme(react)
                     |
                     |
                     |
                static pages
                 (spa/ssr)
```


我说 Picidae，易扩展，自定义，优体验，那么下面就来具体说说都体现在哪里

1. 易扩展、自定义

Picidae 中包括 commander/transformer/plugin/theme 四种可配置扩展的概念。

- commander (命令)  
Picidae 中可自定义或者选择，自己想要的commander.
Picidae 命令行工具基于第三方包 [commander](https://github.com/tj/commander.js/)

在 `picidae.config.js` 中加入 `commanders` 配置

```js
{
    commanders: ['./path/to/your/commander?query']
}
```


```js
// `./path/to/your/commander`

module.exports = function (commander, opt, config, require) {
    return commander
        .command('new [title]')
        .description('create a new markdown')
        .action(function (title) {
            console.log(title)
        })
}
```

 

2. 优体验