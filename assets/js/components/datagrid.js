define([
	"./pager",
	"./dropdown",
	"jquery",
	"components/async-render",
	"utils",
	"require",
	"ractive"
], function(
	__import0__,
	__import1__,
	__import2__,
	__import3__,
	__import4__,
	require,
	Ractive
){

var __options__ = {
	template: {v:3,t:[{p:[4,1,117],t:7,e:"div",a:{"class":"rdatagrid"},f:[{t:4,f:[{p:[6,3,161],t:7,e:"div",a:{"class":["rwrapper ",{t:2,x:{r:["options.leftColumns","options.rightColumns"],s:"_0||_1?\"fixed-cols\":\"\""},p:[6,24,182]}]},f:[{t:4,f:[{p:[8,5,275],t:7,e:"div",a:{"class":"rerror text-center"},f:[{p:[9,7,314],t:7,e:"i",a:{"class":"fa fa-exclamation-circle"}}," ",{p:[11,7,362],t:7,e:"div",f:["请求出错，请稍后重试 ",{p:[12,20,387],t:7,e:"br"}," (",{t:2,r:"statusCode",p:[13,10,401]},":",{t:2,x:{r:["content"],s:"_0||\"网络连接错误\""},p:[13,25,416]}," - ",{t:2,r:"id",p:[13,51,442]},")"]}]}],r:"ajaxError",p:[7,5,256]},{t:4,n:51,f:[{t:4,f:[{t:4,f:[{p:[19,5,535],t:7,e:"div",a:{"class":"mask-loading"},f:[{p:[20,7,568],t:7,e:"div",a:{"class":"rloading text-center"},f:[{p:[21,9,611],t:7,e:"i",a:{"class":"fa fa-spinner fa-pulse"}}," ",{p:[23,9,659],t:7,e:"div",f:["正在加载，请稍候..."]}]}]}],n:50,r:"reloadList",p:[18,5,512]}," ",{t:4,f:[{p:[29,5,755],t:7,e:"div",a:{"class":"rleftcols"},f:[{t:8,r:"content",p:[30,7,785]}]}],n:50,r:"options.leftColumns",p:[28,5,723]}," ",{p:[34,5,826],t:7,e:"div",a:{"class":"rcols"},f:[{t:8,r:"content",p:[35,7,852]}]}," ",{t:4,f:[{p:[39,5,914],t:7,e:"div",a:{"class":"rrightcols"},f:[{t:8,r:"content",p:[40,7,945]}]}],n:50,r:"options.rightColumns",p:[38,5,881]}],n:50,r:"datalist",p:[17,5,491]},{t:4,n:51,f:[{t:4,f:[{p:[45,5,1027],t:7,e:"div",a:{"class":"rloading text-center"},f:[{p:[46,7,1068],t:7,e:"i",a:{"class":"fa fa-spinner fa-pulse"}}," ",{p:[48,7,1114],t:7,e:"div",f:["正在加载，请稍候..."]}]}],n:50,x:{r:["datalist"],s:"_0==null"},p:[44,5,998]},{t:4,n:51,f:[{p:[51,5,1165],t:7,e:"div",a:{"class":"rempty text-center"},f:[{p:[52,7,1204],t:7,e:"i",a:{"class":"fa fa-exclamation-circle"}}," ",{p:[54,7,1252],t:7,e:"div",f:["暂无数据"]}]}],x:{r:["datalist"],s:"_0==null"}}],r:"datalist"}],r:"ajaxError"}]}],n:50,r:"options",p:[5,3,143]}," ",{p:[63,3,1367],t:7,e:"pager"}]}]},
	components:{	pager: __import0__,
	dropdown: __import1__}
},
component={},
__prop__,
__export__;

  var $ = require('jquery')
  var _ = reqiore('lodash')
  var AsyncRender = require('components/async-render')
  var utils = require('utils')

  // 服务端json字段名称配置
  var jsonNameConfig = {
    totalRecordName: 'totalRecord',
    dataSourceName: 'content',
    pageIDName: 'pageID',
    pageSizeName: 'pageSize'
  }

  function getJsonField(app) {
    return app.get('jsonFieldName') || jsonNameConfig.dataSourceName
  }

  // 获取ajax的动态参数
  var getParams = function (params, pageID, pageSize) {
    var postData = $.isFunction(params) ? params() : (params || {})
    if (!$.isPlainObject(postData)) {
      throw new Error('params配置错误')
    }
    postData[jsonNameConfig.pageIDName] = pageID
    postData[jsonNameConfig.pageSizeName] = pageSize
    return postData
  }

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

  // ajax请求统一处理，服务端分页需要在翻页时清空错误对象
  function onAjaxError(app) {
    return function (xhr) {
      app.set('ajaxError', wrapError(xhr))
    }
  }

  /**
   * 是否对表格数据进行补齐
   * 比如只有三条数据，则剩余的使用空行补齐
   */
  function normalizeDatalist(app, datalist, pageSize) {
    datalist = datalist || []

    if (!app.get('padding') || datalist.length === 0 || datalist.length === pageSize) {
      app.set('datalist', datalist)
      return
    }

    _.times(pageSize - datalist.length, function () {
      datalist.push({isPadding: true})
    })
    app.set('datalist', datalist)
  }

  // 表头排序
  var sortOrder = {}

  // 存储排序字段的降序升序信息
  var setOrderClass = function (app, field) {
    var lastOrderASC = sortOrder[field] === 'ASC'
    // 设置表头样式
    for (var key in sortOrder) {
      app.set('order.' + key, '')
    }
    app.set('order.' + field, lastOrderASC ? 'sort-desc' : 'sort-asc')
    sortOrder[field] = lastOrderASC ? 'DESC' : 'ASC'
  }

  // 设置固定列
  function setFixedCols(app) {
    var options = app.get('options')
    var selector = 'thead>tr, tbody>tr'

    if (options.leftColumns > 0) {
      $(app.find('.rleftcols')).find(selector).each(function () {
        $('*:lt(' + options.leftColumns + ')', this).show()
      })
    }

    if (options.rightColumns > 0) {
      $(app.find('.rrightcols')).find(selector).each(function () {
        $('*:gt(' + (-1 * options.rightColumns - 1) + ')', this).show()
      })
    }
  }

  // 获取表格数据相关信息（本页总和、平均，全部总和、平均）
  // 服务端分页获取中位数和全部总和需要服务端返回数据
  function compute(field, computeType, isFloat) {
    var app = this
    var options = app.get('options')
    var ret = 0
    var avg = 0

    // 本页数据求和、求平均
    if (computeType === 'avg' || computeType === 'sum') {
      var datalist = app.get('datalist') || []
      _.each(datalist, function (item) {
        ret += $.isNumeric(item[field]) ? item[field] : 0
      })

      if (computeType === 'avg') {
        avg = ret / datalist.length
        return isFloat ? avg : Math.floor(avg)
      }

      return ret
    }

    if (!options.serverPagination) {
      var datasource = app.get('datasource') || []

      if (computeType === 'sumTotal') {
        _.each(datasource, function (item) {
          ret += $.isNumeric(item[field]) ? item[field] : 0
        })
        return ret
      }

      // 全部数据的中位数
      var len = datasource.length
      if (len === 0) return 0

      // 先将数据全部排序
      datasource = _.clone(datasource, true).sort(function (a, b) {
        return a[field] < b[field] ? -1 : 1
      })

      if (len % 2 === 1) {
        return datasource[Math.floor(len / 2)][field]
      } else {
        avg = (datasource[len / 2][field] + datasource[(len / 2) - 1][field]) / 2
        return isFloat ? avg : Math.floor(avg)
      }
    }

    // TODO服务端需要返回一个属性计算每个字段的总和
  }

  // 开始渲染表格，设置关键数据源
  function renderClientPagination(app, pager, json) {
    pager.set('total', json.length)

    // 保存一份源数据
    app.set('datasource', json)

    // 页面跳转
    app.off('pager.goto').on('pager.goto', function (e) {
      var pageid = pager.get('pageid')
      var pagesize = pager.get('pagesize')
      var datasource = app.get('datasource')
      pager.set('total', datasource.length)
      normalizeDatalist(app, datasource.slice((pageid - 1) * pagesize, pageid * pagesize), pagesize)
      setFixedCols(app)
    })

    // 页码大小改变
    app.off('pager.pageSizeChange').on('pager.pageSizeChange', function (e, pagesize) {
      var datasource = app.get('datasource') || []
      var pageid = pager.get('pageid')
      normalizeDatalist(app, datasource.slice((pageid - 1) * pagesize, pageid * pagesize), pagesize)
      setFixedCols(app)
    })

    app.off('sortBy').on('sortBy', function (e, field) {
      // todo 数字字符排序
      var isASC = sortOrder[field] === 'ASC'
      app.get('datasource').sort(function (a, b) {
        if (isASC) {
          return Utils.getProperty(a, field) < Utils.getProperty(b, field) ? -1 : 1
        } else {
          return Utils.getProperty(a, field) < Utils.getProperty(b, field) ? 1 : -1
        }
      })

      setOrderClass(app, field)
      pager.fire('goto', {}, 1, true)

      // TODO 如果加了固定列的话要操作另外的表格
      $(e.node).parent().children().removeClass('sort-asc sort-desc')
      $(e.node).addClass(app.get('order')[field])
    })

    pager.fire('goto', {}, pager.get('pageid') || 1, true)
    setFixedCols(app)
  }

  component.exports = {
    removeItem: function (where) {
      var app = this
      if ($.isNumeric(where) && where > -1) {
        // 这里始终返回一个数组
        var items = app.get('datalist').splice(where, 1)
        var datasource = app.get('datasource')
        if (datasource && items.length) {

          var index = $.inArray(items[0], datasource)
          if (index > -1) {
            app.get('datasource').splice(index, 1)
          }
        }

        // 同步更新pager的total
        var pager = app.findComponent('pager')
        pager.subtract('total')
        return true
      }
    },
    isolated: false,
    data: {
      // 是否对表格数据进行补齐
      padding: false,
      compute: compute
    },
    oninit: function () {
      var app = this
      var pager = app.findComponent('pager')
      var data = this.get()
      var options = data.options
      if (!options) return

      for (var key in jsonNameConfig) {
        options[key] && (jsonNameConfig[key] = options[key])
      }

      options.pageid = options.pageid || 1
      // 设置pagesize
      var sizes = options.sizes || '10,20,50'
      options.pagesize = parseInt(sizes.toString().split(',')[0])

      // 分页条配置
      var pagerOptions = ['pageid', 'width', 'sizes', 'pagesize']
      $.each(pagerOptions, function (i, field) {
        options[field] && pager.set(field, options[field])
      })

      // 固定列配置
      options.leftColumns = $.isNumeric(options.leftColumns) && options.leftColumns > 0 ? options.leftColumns : 0
      options.rightColumns = $.isNumeric(options.rightColumns) && options.rightColumns > 0 ? options.rightColumns : 0

      // ajax配置
      if (options.ajaxUrl) {
        var errorHandler = onAjaxError(app)
        // 服务端分页
        if (options.serverPagination) {
          // 初始化排序信息
          var orderInfo = data.orderInfo
          if (orderInfo && orderInfo.defaults) {
            app.set('sortID', orderInfo[orderInfo.defaults.field][orderInfo.defaults.order])
            // 将当前排序信息存起来
            app.set('orderInfo.current', {
              field: orderInfo.defaults.field,
              order: orderInfo.defaults.order
            })
          }

          var requestByPage = function (fn) {
            var options = app.get('options')
            var pageSize = pager.get('pagesize')
            var data = getParams(options.params, pager.get('pageid'), pageSize)

            data.sortID = app.get('sortID') || 0

            $.post(options.ajaxUrl, data).then(function onSuccess(json) {
              app.set('ajaxError', null)
              var field = getJsonField(app)
              // 后台分页返回的数据全部在content里面
              json = json || {}
              json = json[field]
              // 服务端分页需要区分第一次请求和后续请求，第一次请求之后立马设置总条数和源数据
              pager.set('total', json[jsonNameConfig.totalRecordName] || 0)
              pager.fire('refresh', {})
              app.set('totalRecord', json[jsonNameConfig.totalRecordName] || 0)

              normalizeDatalist(app, json[field] || [], pageSize)

              setFixedCols(app)

              AsyncRender.done(app, fn, [null, json])
            }).fail(function onFail(xhr) {
              errorHandler(xhr)

              AsyncRender.done(app, fn, [xhr])
            })
          }

          var invokeTimes = 0
          app.on('request', function (e, pageid, callback) {
            // 在第一次请求完毕之后才绑定事件，不然会执行两次(pager的observer导致)
            if (invokeTimes < 1) {
              app.on('pager.goto', function (e, pageid) {
                app.set('options.pageid', pageid || 1)
                app.findComponent('pager').set('pageid', pageid || 1)
                requestByPage(callback)
              })

              app.on('sortBy', function (e, field) {
                var orderInfo = app.get('orderInfo')
                if (!orderInfo) throw new Error('datagrid.orderInfo must be set.')

                var current = orderInfo.current
                var orderBy
                if (current && current.field === field) {
                  // 如果上次排序也是自身
                  orderBy = current.order === 'desc' ? 'asc' : 'desc'
                  app.set('sortID', orderInfo[field][orderBy])
                  app.set('orderInfo.current.order', orderBy)
                } else {
                  // 如果上次不是自身则使用降序排列
                  orderBy = 'desc'
                  app.set('sortID', orderInfo[field][orderBy])
                  app.set('orderInfo.current', {
                    field: field, order: orderBy
                  })
                }

                $(e.node).parents('thead').find('.datagrid-sort').removeClass('sort-asc sort-desc')
                $(e.node).addClass('sort-' + orderBy)

                pager.fire('goto', {}, app.get('options.pageid'), true)
              })
              invokeTimes += 1
            }

            app.fire('pager.goto', e, pageid, true)
          })

          return
        }

        // 暴漏给外部调用
        app.on('request', function (e, pageid, callback) {
          var options = app.get('options')
          // 前端分页
          var data = getParams(options.params, pageid || options.pageid, options.pagesize || 10)

          $.post(options.ajaxUrl, data).then(function onSuccess(json) {
            app.set('ajaxError', null)

            var field = getJsonField(app)
            renderClientPagination(app, pager, json[field])

            AsyncRender.done(app, callback, [null, json])
          }).fail(function onFail(xhr) {
            errorHandler(xhr)

            AsyncRender.done(app, callback, [xhr])
          })
        })

        return
      }

      // 直接传入数组数据
      if (options.hasOwnProperty('datalist')) {
        options.serverPagination = false

        renderClientPagination(app, pager, options.datalist || [])
        return
      }

      throw new Error('缺少配置：ajaxUrl或datalist')
    }
  }

if ( typeof component.exports === "object" ) {
	for ( __prop__ in component.exports ) {
		if ( component.exports.hasOwnProperty(__prop__) ) {
			__options__[__prop__] = component.exports[__prop__];
		}
	}
}

__export__ = Ractive.extend( __options__ );


	return __export__;
});