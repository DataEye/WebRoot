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
  'jquery', 'ractive', 'text!tpl/sample.html', 'rvc!components/dropdown'
], function($, Ractive, tpl, Dropdown) {
  var app;
  return {
    render: function() {
      Ractive.components.dropdown = Dropdown

      app = new Ractive({
        template: tpl,
        el: '#wrapper',
        data: {
          items: [
            {label: 10, value: 10},
            {label: 20, value: 20, selected: true},
            {label: 50, value: 50}
          ]
        }
      })

      // dropdown内部事件触发
      app.on('selectChange', function(e, value) {
        console.log(value)
      })

      app.fire('selectChange', null, 20)
    },
    destroy: function() {
      app.teardown()
    }
  }
});
