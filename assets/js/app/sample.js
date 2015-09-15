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
          val: 20,
          items: [
            {label: 10, value: 10},
            {label: 20, value: 20},
            {label: 50, value: 50}
          ]
        }
      })

      // dropdown内部事件触发
      app.on('selectChange', function(e, value) {
        console.log('ajaxing with value', value)
      })

      app.on('changeValue', function(e, val) {
        app.set('val', val)
      })

      app.on('changeItems', function() {
        app.set('items', [
          {label: 1, value: 1},
          {label: 2, value: 2},
          {label: 3, value: 3}
        ])

        app.set('val', 3)

        var dropdown = app.findComponent('dropdown')
        console.log('selected', dropdown.get('selected'))
      })

      app.fire('selectChange', null, 20)
    },
    destroy: function() {
      app.teardown()
    }
  }
});
