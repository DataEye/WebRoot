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
        template: tmpl.voolu_add,
        data: {
          filterSettings: App.filterSettings,
          suffix: App.params.appID,
          getPostData: function () {
            return postData
          },
          getAllikaData: function (tabName, custom) {
            var data = {}
            data[tabName] = custom.id
            return $.extend(data, postData)
          },
          getFormData: function (tabName, custom) {
            var data = {}
            var tab = {
              'retentionByCountry': 'country',
              'payByCountry': 'country',
              'retentionByCity': 'city',
              'payByCity': 'city'
            }

            data[tab[tabName]] = custom.id
            return $.extend(data, postData)
          }
        }
      })

      // 筛选条件 + 基础参数
      var postData

      // 使用异步渲染组件
      AsyncRender.init(app, '#main>.content', 4)

      var filter = app.findComponent('filter')

      // 点击其他地方隐藏站开的子面板
      $('body').on('click', function () {
        app.set('allikaDetail', null)
        app.set('qualityDetail', null)
      })

      filter.on('save', function (e, params) {
        $('body').trigger('click')

        postData = $.extend({}, App.ajaxParams, params)

        var panels = app.findAllComponents('panel')
        panels[0].fire('viewTab', e, 'addPlayer')
        panels[1].fire('viewTab', e, 'channel')
        panels[2].fire('viewTab', e, 'retentionByCountry')
        panels[3].fire('viewTab', e, 'role')
      })

      filter.fire('save', {}, filter.getParams())
    },
    destroy: function () {
      app.teardown()
    }
  }
})
