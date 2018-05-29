/**
 * @file IConfiguration
 * @author Cuttle Cong
 * @date 2018/5/17
 * @description
 */

export type Glob = string
export type Mather = RegExp | Glob | Function

// markdown
export type NodeTransformer = {
  markdownTransformer?: Function
  remarkTransformer?: Function
  rehypeTransformer?: Function
}

// TODO
export type BrowserTransformer = Function

export type Plugin = string | Function | [string | Function, any]
export type Transformer = string | [string, any]

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

  transformers: Transformer[]
  // `commanders` is used in cli
  commanders: Plugin[]
  plugins: Plugin[]
}
