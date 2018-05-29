/**
 * @file remark
 * @author Cuttle Cong
 * @date 2018/5/21
 * @description
 */
import * as remark from 'remark'

it('test remark plugin for pure markdown text', function() {
  function md() {
    // Can't access pure content
    // console.log(arguments, this)
    return function (node) {
      // console.log(arguments)
    }
  }

  remark()
    .use(md)
    .process('# Head', function(err, file) {
      if (err) throw err
      console.log(String(file))
    })
})
