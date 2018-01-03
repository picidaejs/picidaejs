# Picidae

![](./logo/picidae-2x.png)

<!--[![build status](https://img.shields.io/travis/picidaejs/picidae/master.svg?style=flat-square)](https://travis-ci.org/picidaejs/picidae)-->
<!--[![Test coverage](https://img.shields.io/codecov/c/github/picidaejs/picidae.svg?style=flat-square)](https://codecov.io/github/picidaejs/picidae?branch=master)-->
[![NPM version](https://img.shields.io/npm/v/picidae.svg?style=flat-square)](https://www.npmjs.com/package/picidae)
[![NPM Downloads](https://img.shields.io/npm/dm/picidae.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/picidae)

Picidae is a document generator which has gentle experience. :dash:  
As shown below

![](https://i.loli.net/2017/11/07/5a01c6630dc5f.jpg)

[Picidae Video](https://picidaejs.github.io/picidaejs/public)

## Where use it
- [Myself own Blog](https://imcuttle.github.io/)
- [Baidu EUX](https://be-fe.github.io/picidae-theme-eux-blog/)
- [Picidae Document](https://picidaejs.github.io/picidaejs/)

## Starter

````bash
npm install picidae -g

picidae init [blog]
cd [blog]
# install Globally
picidae use picidae-theme-grass
# or install Locally
npm install picidae picidae-theme-grass --save

picidae start
open http://localhost:8989
# build the site for deploy
picidae build

# install Globally
picidae use picidae-commander-gh-pages
# or install Locally
npm install picidae-commander-gh-pages --save

# ```
# // append the configuration.
# commanders: [
#   'gh-pages?repo=git@github.com:[username]/[username].github.io.git&branch=master&remote=origin'
# ]
# ```
picidae gh-pages # deploy the static assets to the github
````

## Theme

We can write customized Theme using React.  
[Default Theme](./theme)

## Commander

We can write customized Commander using `commander`.  
[Commander: New](commanders/gh-pages)

## Transformer

We can write customized Transformer which is divided into NodeTransformer & BrowserTransformer  
As shown below

** mdast -> remark transformer -> markdown -> markdown transfromer -> markdown -> html -> html transformer -> html -> browser transformer (converter) -> html-to-react **

- [picidae-transformer-style-loader](https://github.com/picidaejs/picidae-transformer-style-loader)  
- [picidae-transformer-react-render](https://github.com/picidaejs/picidae-transformer-react-render)  
- [picidae-transformer-file-syntax](https://github.com/picidaejs/picidae-transformer-file-syntax)  
- ...

