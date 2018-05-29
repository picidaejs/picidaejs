/**
 * @file nodeTransform
 * @author Cuttle Cong
 * @date 2018/5/21
 * @description
 */
import { NodeTransformer } from '../types/IConfiguration'

import * as remark from 'remark'

export type MarkdownAsset = {
  content: string
  meta: object
  filename: string
  // Extension for custom
  data: object
}

export default function nodeTransform(
  transformers: NodeTransformer[] = [],
  options: any
) {
  return function(markdownAsset: MarkdownAsset, picidae) {
    // remark().use()
  }
}
