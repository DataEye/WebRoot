/**
 * debug环境加载文本，production加载js
 * r.js会默认inlineText定义模块，build时要关掉
 * 新思路
 * app-zh
 * app-en
 * components-zh
 *
 */
define([
  'jquery', 'ractive', 'text!tpl/sample.html'
], function($, Ractive, tpl) {
  var app;
  return {
    render: function() {
      app = new Ractive({
        template: tpl,
        el: '#wrapper',
        data: {

        }
      })
    },
    destroy: function() {
      app.teardown()
    }
  }
});
