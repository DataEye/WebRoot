define([
  'jquery', 'lodash', 'ractive', 'charts', 'moment', 'tmpl',
  'components/async-render', 'utils',
  'components/dropdown', 'components/filter', 'components/panel',
  'spa'
], function($, _, Ractive, Charts, moment, tmpl, AsyncRender) {
  var app
  return {
    render: function() {
      function drawTrend(json, node) {
        var param = {
          id: node,
          data: {
            title: _.map(json, function(i) { return moment(i.label * 1000).format('MM-DD')}),
            data: [_.map(json, function(i) { return i.value})]
          },
          titles: [App.i18n.downloadTrend],
          type: ['areaspline'],
          dashStyle: 'Solid',
          // Y轴比例符号
          symbol: ['']
        }
        Charts.drawLine(param)
      }

      function drawTop(json, node) {
        var list = []
        _.each(json, function(item) {
          list.push([item.label, item.value])
        })
        var paramPie = {
          id: node,
          data: list
        }
        Charts.drawPie(paramPie)
      }

      // 如果tabs只有一个，name和label可以随便写，不会被展示
      var mainTabs = [
        {
          name: 'main', label: 'main',
          url: App.contextPath + '/rl/getResLocationExposureClickAndDownload.do'
        }
      ]

      var subTabs = [
        {
          name: 'trend', label: '下载走势',
          url: App.contextPath + '/rl/getResLocationDownDetail.do',
          draw: drawTrend
        },
        {
          name: 'top', label: '应用下载TOP 10占比',
          url: App.contextPath + '/rl/getResLocationResourceDownload.do',
          draw: drawTop
        }
      ]

      app = new Ractive({
        template: tmpl.resource_analysis,
        data: {
          mainTabs: mainTabs,
          subTabs: subTabs,
          filterSettings: App.filterSettings,
          suffix: App.params.appID
        }
      })

      // 筛选条件 + 基础参数
      var postData

      // 使用异步渲染组件
      AsyncRender.init(app, '#main>.content', 1)

      // 查看详情
      app.on('datagrid.view', function datagrid$view(e) {
        app.set('currentItem', e.context)

        var panel = app.findAllComponents('panel')[1]
        panel.fire('viewTab', e, 'trend', $.extend({id: e.context.rlID}, postData))
      })

      //返回
      app.on('panel.goBack', function panel$goBack() {
        app.set('currentItem', null)
      })

      var filter = app.findComponent('filter')

      filter.on('save', function(e, params) {
        app.set('currentItem', null)

        postData = $.extend({}, App.ajaxParams, params)
        var panel1 = app.findComponent('panel')
        panel1.fire('viewTab', e, 'main', postData)
      })

      filter.fire('save', {}, filter.getParams())
    },
    destroy: function() {
      //app.teardown()
    }
  }
})
