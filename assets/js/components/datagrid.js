define([
	"./pager",
	"./dropdown",
	"jquery",
	"lodash",
	"require",
	"ractive"
], function(
	__import0__,
	__import1__,
	__import2__,
	__import3__,
	require,
	Ractive
){

var __options__ = {
	template: {v:3,t:[{p:[4,1,117],t:7,e:"div",a:{"class":"rdatagird"},f:[" ",{t:4,f:[{p:[7,3,198],t:7,e:"div",a:{"class":"rwrapper"},f:[" ",{t:4,f:[{p:[10,5,263],t:7,e:"div",a:{"class":"rerror text-center"},f:[{p:[11,7,302],t:7,e:"i",a:{"class":"fa fa-exclamation-circle"}}," ",{p:[13,7,350],t:7,e:"div",f:["请求出错，请稍后重试 ",{p:[14,20,375],t:7,e:"br"}," (",{t:2,r:"ajaxError.statusCode",p:[15,10,389]},":",{t:3,x:{r:["ajaxError.content"],s:"_0||\"网络连接错误\""},p:[15,35,414]}," - ",{t:2,r:"ajaxError.id",p:[15,73,452]},")"]}]}],n:50,r:"ajaxError",p:[9,5,241]}," ",{t:4,f:[{p:[22,5,563],t:7,e:"div",a:{"class":"mask-loading"},f:[{p:[23,7,596],t:7,e:"div",a:{"class":"rloading text-center"},f:[{p:[24,9,639],t:7,e:"i",a:{"class":"fa fa-spinner fa-pulse"}}," ",{p:[26,9,687],t:7,e:"div",f:["正在加载，请稍候..."]}]}]}],n:50,r:"isLoading",p:[21,5,541]}," ",{t:4,f:[{p:[33,5,815],t:7,e:"div",a:{"class":"rcols"},f:[{t:8,r:"content",p:[34,7,841]}]}],n:50,x:{r:["ajaxError","datalist"],s:"!_0&&_1"},p:[32,5,780]}," ",{t:4,f:[{p:[39,5,918],t:7,e:"div",a:{"class":"rempty text-center"},f:[{p:[40,7,957],t:7,e:"i",a:{"class":"fa fa-exclamation-circle"}}," ",{p:[42,7,1005],t:7,e:"div",f:["暂无数据"]}]}],n:50,x:{r:["ajaxError","datalist"],s:"!_0&&!_1"},p:[38,5,882]}]}," ",{t:4,f:[{p:[48,3,1072],t:7,e:"pager",a:{pageid:[{t:2,r:"pageid",p:[48,18,1087]}],pagesize:[{t:2,r:"pagesize",p:[48,40,1109]}],total:[{t:2,r:"total",p:[48,61,1130]}]},v:{pagechange:"request"}}],n:50,r:"total",p:[47,3,1056]}],n:50,x:{r:["url","datasource"],s:"_0||_1"},p:[6,3,170]}]}]},
	components:{	pager: __import0__,
	dropdown: __import1__}
},
component={},
__prop__,
__export__;

  var $ = require('jquery')
  var _ = require('lodash')
  var MSG = {
    REQ_ERROR: '请求出错',
    MISSING_CLIENT_OPTS: '客户端分页需要配置请求url或者datasource',
    MISSING_SERVER_OPTS: '服务端分页需要配置url'
  }

  function tryExec(str) {
    return $.isFunction(str) ? str() : str
  }

  /**
   * 获取对象属性，支持嵌套获取 getProperty(window, 'location.href')
   */
  function getProperty(obj, field) {
    if (!obj) return obj

    field = field || String(field)
    var fields = field.split('.')

    return fields.reduce(function(prev, current) {
      return prev[current]
    }, obj)
  }

  // 封装统一的ajaxError对象
  function wrapError(xhr) {
    if (xhr.responseJSON)
      return xhr.responseJSON

    var text = xhr.responseText.length > 64 ? '<span>' + MSG.REQ_ERROR +
      '</span>' : xhr.responseText

    return {
      statusCode: xhr.status,
      content: text + xhr.statusText,
      id: Date.now()
    }
  }

  // ajax请求统一处理，服务端分页需要在翻页时清空错误对象
  function onAjaxError(app) {
    return function (xhr) {
      app.set('ajaxError', wrapError(xhr))
    }
  }

  // 开始渲染表格，设置关键数据源
  function renderClientPagination(app, data, errorHandler) {
    /*
     * 不依赖于第一次请求成功
     * 后续修改数据源也可以正常工作
     * 这里要放在最前面，如果直接设置数据源需要先绑定事件
     */
    app.on('request', function datagridPageChange(e, info) {
      var datasource = app.get('datasource')
      // 可能请求还没有加载完成
      if (!datasource) return

      var pageid = info.pageid
      var pagesize = info.pagesize
      var start = (pageid - 1) * pagesize
      var end = start + pagesize
      var datalist = datasource.slice(start, end)

      app.set('datalist', datalist)

      // TODO 直接设置datasource不会触发这里
      app.fire('pagechange', null, info)
    })

    /*
     * 客户端分页有两种情况：
     * 1)直接请求一次；
     * 2)直接设置数据源
     */
    if (data.url) {
      var url = tryExec(data.url)
      var params = tryExec(data.params) || {}

      app.set('isLoading', true)
      $.post(url, params).then(function requestData(json) {
        var datasource = json.content || []
        app.set('datasource', datasource)
        app.set('ajaxError', null)
        /**
         * 这里的设置要放在最后，如果放在前面，触发的事件无法获取datasource
         */
        app.set('total', datasource.length)
      }).fail(errorHandler).always(function always() {
        app.set('isLoading', false)
      })
    } else if (data.datasource) {
      app.set('ajaxError', null)
      app.set('isLoading', false)
      app.set('total', data.datasource.length)
    } else {
      throw new Error(MSG.MISSING_CLIENT_OPTS)
    }

    /**
     * 排序只能根据一个字段排
     */
    app.on('sortBy', function datagridSort(e, field) {
      var datasource = app.get('datasource')
      var currentField = app.get('sortField')
      var sortOrder = app.get('sortOrder')
      if (currentField === field) {
        app.set('sortOrder', !sortOrder || sortOrder === 'asc' ? 'desc' : 'asc')
      } else {
        app.set('sortField', field)
        app.set('sortOrder', 'desc')
      }

      var sortVal = app.get('sortOrder') === 'desc' ? -1 : 1
      var sorted = _.sortBy(datasource, function(item) {
        // 返回正数升序
        return getProperty(item, field) * sortVal
      })
      app.set('datasource', sorted)

      /**
       * 如果当前为第一页需要主动触发
       */
      if (app.get('pageid') === 1) {
        app.fire('request', null, {
          pageid: 1,
          pagesize: app.get('pagesize')
        })
      } else {
        app.set('pageid', 1)
      }
    })
  }

  function renderSeverPagination(app, data, errorHandler) {
    function requestByPage(pageid, pagesize, callback) {
      var url = tryExec(data.url)
      var params = tryExec(data.params) || {}
      params.pageID = pageid
      params.pageSize = pagesize

      app.set('isLoading', true)
      $.post(url, params).then(function requestPageData(json) {
        app.set('datalist', json.content || [])
        app.set('datasource', json.content || [])
        app.set('ajaxError', null)

        app.fire('pagechange', null, {
          pageid: pageid,
          pagesize: pagesize
        })

        callback && callback(json)
      }).fail(errorHandler).always(function always() {
        app.set('isLoading', false)
      })
    }

    /*
     * 先请求一次获取总条数然后绑定事件
     */
    requestByPage(data.pageid, data.pagesize, function(json) {
      // ?? 这里是每一次都设置还是只设置一次
      app.set('total', json.total)
      app.on('request', function datagridPageChange(e, info) {
        requestByPage(info.pageid, info.pagesize)
      })
    })
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
      isLoading: true,
      ajaxError: null,
      // 当页数据
      datalist: [],
      // 全部数据
      datasource: [],
      // 数据条数
      total: 0,
      // 排序字段信息
      sortField: '',
      // 默认排序信息
      sortOrder: '',
      // 获取字段当前排序顺序asc, desc
      getSortClass: function(field) {
        if (this.get('sortField') === field) {
          return 'sortable-' + this.get('sortOrder')
        }

        return 'sortable'
      }
    },
    onrender: function () {
      var app = this
      var data = this.get()
      var errorHandler = onAjaxError(app)

      if (!data.pageid) {
        app.set('pageid', 1)
      }

      if (!data.pagesize) {
        app.set('pagesize', 10)
      }

      // 客户端分页
      if (!data.server) {
        renderClientPagination(app, data, errorHandler)
        return
      }

      // 服务端分页
      if (data.url) {
        renderSeverPagination(app, data, errorHandler)
        return
      }

      throw new Error(MSG.MISSING_SERVER_OPTS)
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