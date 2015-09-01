/**
 * panel 插入的tab配置如下
 * <config 
 *  label="tab展示名称" 
 *  name="唯一的name" 
 *  url="请求地址" 
 *  data="获取POST参数的函数名称" 
 *  download="是否包含下载" 
 *  chart.xxx="图表配置参考component/chart.js" 
 * /> 
 */
define([
  'jquery', 'ractive', 'tmpl', 'lodash', 'utils',
  'components/pager', 'components/datagrid', 'components/download', 'components/popover',
  'components/chart'
], function ($, Ractive, tmpl, _, utils) {
  // 封装统一的ajaxError对象
  function wrapError(xhr) {
    if (xhr.responseJSON)
      return xhr.responseJSON

    return {
      statusCode: xhr.status,
      content: xhr.responseText + xhr.statusText,
      id: Date.now()
    }
  }

  /**
   * 根据name查找应当选中的tab
   */
  function findTabIndexByName(tabs, name) {
    return _.findIndex(tabs, { name: name })
  }

  /**
   * 获取当前含有selected属性的tab
   */
  function findCurrentTabIndex(tabs) {
    return _.findIndex(tabs, { selected: true })
  }
  
  /**
   * oninit时初始化tabs配置
   */
  function findConfigs(app) {
    var configList = app.findAllComponents('config')
    var tabs = []

    _.each(configList, function (config) {
      var download = config.get('download')
      var formatters = config.get('formatters')
      var tab = {
        label: config.get('label'),
        name: config.get('name'),
        url: config.get('url'),
        data: config.get('data'),
        download: !!download || download === undefined,
        formatters: formatters ? formatters.split(',').map(function (i) {
          var func = app.root.get(i)
          return _.isFunction(func) ? func : ''
        }) : [],
        // 每个tab存储一份初始的值，防止子面板切换后上一次的相关配置没有被销毁
        // 详细配置项目参考component/chart.js
        chart: {}
      }

      var configData = config.get()
      var configDataKeys = _.keys(configData)
      var chartOptions = configDataKeys.filter(function (k) {
        return k.indexOf('chart.') === 0
      })
      _.each(chartOptions, function (k) {
        tab.chart[k.replace('chart.', '')] = configData[k]
      })
      
      /**
       * 设置子面板
       * 目前仅支持每个子面板共享图表配置
       * 子面板只需配置lables和names
       */
      var names = configData['sub.names']
      var labels = configData['sub.labels']
      if (names && labels) {
        names = names.split(',')
        labels = labels.split(',')
        
        if (names.length !== labels.length) {
          console.log('子面板设置不匹配：' + names.join(',') + ':' + labels.join(','))
        } else {
          tab.style = configData['sub.style'] || 'tab'
          tab.children = names.map(function(name, i) {
            return {
              label: labels[i],
              name: name
            }
          })
        }
      }
      
      tabs.push(tab)
    })

    return tabs
  }

  var Panel = Ractive.extend({
    template: tmpl.panel,
    isolated: false,
    data: {
      // 展示表格或者图表
      isTable: false,
      // 禁用图表和表格视图切换
      disableSwitch: false,
      /*
       * 自定义格式化，传入函数名称则按传入的函数名称格式化
       * 默认使用数字格式化
       */
      format: function (i, value) {
        var tabs = this.get('tabs')
        var tab = tabs[findCurrentTabIndex(tabs)]
        if (tab) {          
          var fn = tab.formatters[i]
          if (_.isFunction(fn)) return fn(value)
          if (_.isNumber(value)) return utils.formatNumber(value)
        }
        
        return value 
      }
    },
    // 这里只能在init时候绑定事件等，不能使用onrender?
    oninit: function () {
      var app = this

      app.set('tabs', findConfigs(app))

      // 全屏切换
      app.on('modelZoom', function (e, expand) {
        app.set('expand', expand || false)
        var grid = app.findComponent('datagrid')
        app.fire('draw', e, grid.get('json'))
      })

      // 图形和表格切换
      app.on('toggleMode', function toggleMode(e, isTable) {
        app.set('isTable', !!isTable)

        if (!isTable) {
          var grid = app.findComponent('datagrid')
          app.fire('draw', e, grid.get('json'))
        }
      })
      
      app.on('viewTabBySelect', function(e) {
        var tabName = app.get('tabName')
        var subTabName = app.get('subTabName')
        
        app.fire('viewTab', e, tabName, subTabName)
      })

      // 查看TAB
      app.on('viewTab', function viewTab(e, tabName, subTabName) {
        tabName = tabName || e.context.name

        var tabs = app.get('tabs')
        var pos = findTabIndexByName(tabs, tabName)
        if (pos === -1) {
          console.warn('不存在的tabName:' + tabName)
          return
        }
        
        var tab = tabs[pos]
        // 第一次subTabName为空，自动取第一个
        if (tab.children && !subTabName) {
          subTabName = tab.children[0].name
        }
        
        var subPos = -1
        if (subTabName) {
          subPos = findTabIndexByName(tab.children, subTabName)
          if (subPos === -1) {
            console.warn('不存在的subTabName:' + tabName)
            return
          }
        }
        
        // 上次请求的主tab名称，这里要传给画图方法去判断是否需要重置相关设置
        // 因为目前子tab共用画图所以无需传子tab名称
        var lastTabName = app.get('tabName')

        app.set('total', '')
        //清空glance
        app.set('glance', '')
        // glance的格式化函数
        app.set('formatters', tab.formatters || {})
        app.set('tabs.*.selected', false)
        app.set('tabs.' + pos + '.selected', true)
        app.set('tabName', tab.name)
        // 设置子面板相关信息
        if (subPos !== -1) {
          app.set('tabs.' + pos + '.children.*.selected', false)
          app.set('tabs.' + pos + '.children.' + subPos + '.selected', true)
          app.set('subTabName', subTabName)
        } else {
          app.set('tabs.*.children.*.selected', false)
          app.set('subTabName', null)
        }

        var ajaxUrl = tab.url
        if (!app.get('gridOptions')) {
          app.set('gridOptions', {
            ajaxUrl: ajaxUrl
          })
        }

        var grid = app.findComponent('datagrid')
        grid.set('options.ajaxUrl', ajaxUrl)
        var dataFuncName = tab.data
        if (!dataFuncName) {
          console.log(tabName + '缺少ajax请求的data配置函数名')
          return
        }

        // 有subTabName则传subTabName
        var params = app.root.get(tab.data).call(app.root, subTabName || tabName, app.get('parentInfo'), app)
        params && grid.set('options.params', params)

        app.set('disableDownload', !tab.download)
        // 动态变更下载的url和data
        if (tab.download) {
          var download = app.findComponent('download')
          var downloadParams = _.keys(params).length ? params : grid.get('options.params')

          download.set('url', ajaxUrl)
          download.set('data', $.extend({
            download: 1,
            downloadFlag: 1
          }, downloadParams))
        }

        grid.fire('request', e, 1, function (errorXHR, json) {
          if (errorXHR) {
            app.set('ajaxError', wrapError(errorXHR))
            return
          }

          var field = app.get('jsonFieldName') || 'content'
          var list = utils.getProperty(json, field)
          var isEmpty = !json || !json.name || !_.isArray(list) || !list.length

          app.set('ajaxError', null)
          app.set('emptyChart', isEmpty)
          app.set('glance', json.glance)

          // 如果数据为空后面不再执行
          if (!isEmpty && !app.get('isTable')) {
            app.fire('draw', e, json, lastTabName)
          }

          app.fire('tabchange', e, json, lastTabName)
        })
      })

      /**
       * 对chart组件画图
       */
      app.on('draw', function (e, json, lastTabName) {
        // 获取当前tab的图表配置
        var tabs = app.get('tabs')
        var pos = findTabIndexByName(tabs, app.get('tabName'))
        var tab = tabs[pos]

        // 把tab的chart相关的属性都赋值给chart组件
        var options = tab.chart
        var chart = this.findComponent('chart')
		
		if (!chart) return
        
        /**
         * 找到上次画图使用的配置，如果和当前配置不一样则清除上次使用的记录
         */
        var lastPos = lastTabName ? findTabIndexByName(tabs, lastTabName) : -1
        var lastChartConfig = lastPos > -1 && tabs[lastPos] && tabs[lastPos].chart
        
        if (lastChartConfig) {
          for (var key in lastChartConfig) {
            chart.set(key, null)
          }
          // group.0.index之类的需要将整个group设置为空
          chart.set('group', null)
        }
        
        for (var key in options) {
          chart.set(key, options[key])
        }
        
        // 如果设置了图表分页大小则对图表进行分页
        // 一般只有柱状图才分页
        var n = options.pageSize
        var list = json.content

        if (n && list.length > n) {
          app.set('pagesize', n)
          app.set('total', list.length)

          var data = _.clone(json, true)
          var field = app.get('jsonFieldName') || 'content'
          var pager = app.findComponent('pager')
          pager.on('goto', function (e, pageid) {
            pageid = pageid || pager.get('pageid') || 1
            var pagesize = pager.get('pagesize')
            data[field] = list.slice((pageid - 1) * pagesize, pageid * pagesize)

            chart.set('json', data)
            chart.fire('draw')
          })

          pager.fire('goto', {}, 1)
          return
        }

        chart.set('json', json)
        chart.fire('draw')
      })

      // 子面板点击的时候阻止冒泡
      // 用于自动关闭子面板
      app.on('prevent', function (e) {
        if (this.get('detail')) {
          e.original.stopPropagation()
        }
      })
    }
  })

  Ractive.components.panel = Panel

  return Panel
})
