define([
  'jquery', 'lodash', 'ractive', 'charts', 'moment', 'tmpl', 'utils',
  'components/async-render', 'components/result', 'components/config',
  'components/panel', 'components/filter',
  'spa'
], function ($, _, Ractive, Charts, moment, tmpl, utils, AsyncRender) {
  var app
  return {
    render: function () {
      app = new Ractive({
        template: tmpl.voolu_channel,
        data: {
          filterSettings: App.filterSettings,
          suffix: App.params.appID,
          formatPercentage: utils.formatPercentage,
          formatTimeAxis: Charts.formatTimeAxis,
          getChanData: function (tabName, custom) {
            var fields = {
              'avgActive': 1,
              '7avgActive': 7,
              '30avgActive': 30
            } 
            var ret = {
              channel: custom && custom.id,
              period: fields[tabName]
            }
            return $.extend({}, postData, ret)
          }
        }
      })
			
      // 筛选条件 + 基础参数
      var postData

      // 使用异步渲染组件
      AsyncRender.init(app, '#main>.content', 2)

      var filter = app.findComponent('filter')

      $('body').on('click', function () {
        app.set('chanValueDetail', null)
        app.set('goldDetail', null)
      })

      filter.on('save', function (e, params) {
        $('body').trigger('click')

        postData = $.extend({}, App.ajaxParams, params)

        var panels = app.findAllComponents('panel')
        panels[0].fire('viewTab', e, 'importPlayers')
        panels[1].fire('viewTab', e, 'payRate')
      })

      filter.fire('save', {}, filter.getParams())
    },
    destroy: function () {
      app.teardown()
    }
  }
})
