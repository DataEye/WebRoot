/**
 * 主要提供单页应用的相关逻辑处理
 * 如果页面不是单页应用，加载也没有关系，能够使用App的一些便利属性
 *
 * 引入utils是因为$.abortAll在utils里面
 */
define(['jquery', 'router', 'query-string', 'utils'], function($, Router, queryString, utils) {
	/**
	 * 查询字符串解析到params上（不包含hash）
	 */
	if (location.search) {
		App.params = $.extend(App.params, queryString.parse(location.search))
	}

	var router = new Router()

	router.configure({
		/**
		 * 下一个路由进入时自动解析hash中的查询字符串
		 */
		before: function() {
			if (location.hash.indexOf('?') > -1) {
				var fragments = location.hash.split('?')[1]

				App.hashParams = queryString.parse(fragments)
			}
		},
		/**
		 * 404页面
		 */
		notfound: function() {
      location.hash = '#' + App.defaultRoute
		},
		on: function() {},
		/**
		 * 上一个路由离开时触发，如果首次加载则不会执行
		 */
		after: function() {}
	})

  router.on('.*', function() {
    /**
     * SPA脚本必须返回一个带有render方法的对象，destroy可选，建议也加上
     * 如果页面中有定时器，则必须加上destroy方法
     */
    var currentView = App.view
    if (currentView && $.isFunction(currentView.destroy)) {
      currentView.destroy()
    }

    App.view = null

    /**
     * 在当前视图加载时取消掉所有的ajax请求，否则在网络不稳定时容易导致回调无序
     * 这个操作必须在destroy方法之后执行，因为可能定时器会发起其它请求，导致回调报错
     */
    $.abortAll()

    var pageName = location.hash.slice(1)
    var scriptName = pageName[0] === '/' ? pageName.slice(1) : pageName
    scriptName = 'app/' + scriptName.replace(/\//g, '-')
    require([scriptName], function(View) {
      if (!View) {
        throw new Error('没有定义任何模块，请使用define定义模块')
      }

      if (!$.isFunction(View.render)) {
        throw new Error('代码不规范，请返回一个带有render方法的对象')
      }

      // 设置当前view到App上
      App.view = View
      View.render()
    })
  })

	if (App.spa) {
		router.init(location.hash || App.defaultRoute)
	}
})
