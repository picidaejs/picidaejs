# Picidae

![](./logo/picidae-2x.png)

Picidae is a document generator which has gentle experience. :dash:  
As shown below

![](https://i.loli.net/2017/11/07/5a01c6630dc5f.jpg)

[Picidae Video](https://picidaejs.github.io/picidaejs/public)

## Theme

We can write customized Theme using React.  
[Default Theme](./theme)

## Commander

We can write customized Commander using `commander`.  
[Commander: New](./commanders/new)

## Transformer

We can write customized Transformer which is divided into NodeTransformer & BrowserTransformer  
As shown below

** mdast -> remark transformer -> markdown -> markdown transfromer -> markdown -> html -> html transformer -> html -> browser transformer (converter) -> html-to-react **

- [picidae-transformer-style-loader](https://github.com/picidaejs/picidae-transformer-style-loader)  
- [picidae-transformer-react-render](https://github.com/picidaejs/picidae-transformer-react-render)  
- [picidae-transformer-file-syntax](https://github.com/picidaejs/picidae-transformer-file-syntax)  
- ...

## Dev Record

1. [remark](https://github.com/wooorm/remark/tree/master/packages/remark)  
    A markdown processor
2. [yaml-front-matter](https://github.com/dworthen/js-yaml-front-matter)  
    Parses yaml or json at the front of a file


## Thinking

use remark convert markdown to html with: 
1. [remark-align](https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-align)
2. remark-html
3. remark-highlight.js
4. remark-slug
5. remark-gemoji-to-emoji
6. remark-auto-heading

    
## Todo

1. [x] SSR Demo
2. [x] data-loader Demo
3. [x] posts/api posts/doc ... -> multiply directory
4. [x] routes supports Object/Array
5. [x] **mdast -> remark transformer -> markdown -> markdown transformer -> markdown -> html -> html transformer -> html -> browser transformer (converter) -> html-to-react **
6. [x] markdown-loader -> meta/content
7. [x] ssr build
8. [x] utils / tools
9. [x] transformers -> react render + file link
10. [x] spider for better seo.