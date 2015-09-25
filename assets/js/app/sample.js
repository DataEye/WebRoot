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
  'jquery', 'ractive', 'text!tpl/sample.html', 'lodash',
  'rvc!components/dropdown', 'rvc!components/pager', 'rvc!components/text-input',
  'rvc!components/datagrid'
], function($, Ractive, tpl, _, Dropdown, Pager, TextInput, DataGrid) {
  var app;
  return {
    render: function() {
      Ractive.components.dropdown = Dropdown
      Ractive.components.pager = Pager
      Ractive.components.textinput = TextInput
      Ractive.components.datagrid = DataGrid

      var datasource = []
      _.times(33, function(i) {
        datasource.push({
          x: i + 1,
          y: Math.random() * 100,
          z: Math.random() * 100
        })
      })

      app = new Ractive({
        template: tpl,
        el: '#wrapper',
        data: {
          val: 20,
          x: 'abc@abc.com',
          items: [
            {label: 10, value: 10},
            {label: 20, value: 20},
            {label: 50, value: 50}
          ],
          total: 51,
          pageid: 2,
          width: 2,
          pagesize: 10,
          datasource: datasource
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

      app.on('pager.pagechange', function(e, data) {
        console.log('翻页了', data.pageid)
      })

      app.on('textinput.input', function(e) {
        console.log(e.node.value)
      })

      app.fire('selectChange', null, 20)
    },
    destroy: function() {
      app.teardown()
    }
  }
});
