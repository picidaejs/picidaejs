/**
 * @file IConfiguration
 * @author Cuttle Cong
 * @date 2018/5/17
 * @description
 */

export type Glob = string
export type Mather = RegExp | Glob | Function

export type NodeTransformer = {
    markdownTransformer?: Function
    remarkTransformer?: Function
    rehypeTransformer?: Function
}

export type BrowserTransformer = {
    markdownTransformer?: Function
    remarkTransformer?: Function
    rehypeTransformer?: Function
}

export default interface IConfiguration {
    verbose?: boolean

    id: string
    host?: string
    publicPath?: string
    theme?: string
    port?: number
    expressSetup?: Function
    webpackConfigUpdater?: Function
    ssrWebpackConfigUpdater?: Function

    docRoot?: string
    distRoot?: string
    template?: string
    extraAssetsRoot?: string

    themeConfigsRoot?: string
    // External hot reload
    hotReloadTests?: Mather[]

    // `excludes` renames to `ignores`
    ignores: Mather[]

    transformers: string[]
    // `commanders` is used in cli
    commanders: []
}
