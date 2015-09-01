define(['ractive', 'tmpl', 'components/dropdown'], function(Ractive, tmpl){
	var Pager = Ractive.extend({
		template: tmpl.pager,
		isolated: true,
		onrender: function() {
			var app = this
			// 支持配置的参数：total, sizes, pageid, width
			var sizes = app.get('sizes') || [10, 20, 50]
			sizes = sizes.toString().split(',').map(function(i){
				return parseInt(i)
			})
			var size = sizes.length ? sizes[0] : app.get('pagesize')
			// 跳转到第几页
			var switchTo = function(current) {
				var total = app.get('total') || 0
				var size = app.get('pagesize')
				var width = app.get('width') || 2
				var totalPage = Math.ceil(total / size)
				var start = Math.max(1, current - width)
				var end = Math.min(current + width, totalPage)
				var items = []
				for (var i = start; i <= end; i++) {
					items.push(i)
				}

				var paddingLen = width * 2 + 1 - items.length
					// boundary problems
				if (paddingLen > 0) {
					for (var i = 1; i <= paddingLen; i++) {
						// footer padding
						if (start === 1 && i + end <= totalPage) {
							items.push(i + end)
						}
						// header padding
						if (end === totalPage && start - i >= 1) {
							items.unshift(start - i)
						}
					}
				}

				app.set('pages', items)
				app.set('totalPage', totalPage)
			}

			app.set('pagesize', size)
			sizes = sizes.sort(function(a, b) {
				return a < b ? -1 : 1
			}).map(function(i) {
				return {label: String(i), value: String(i)}
			})
			app.set('pagesizes', sizes)
			app.set('pageid', app.get('pageid') || 1)
			app.set('total', app.get('total') || 0)
			app.set('totalPage', Math.ceil(app.get('total') / size))

			// force指定强制渲染dom
			app.on('goto', function(e, pageNo, force) {
				if (app.get('pageid') !== pageNo) {
					app.set('pageid', pageNo)
				} else {
					// 如果与当前页面相等时，使用force强制更新。ajax第一次获取数据时常常需要用到
					force && switchTo(pageNo)
				}
			})

			app.on('refresh', function(e) {
				switchTo(app.get('pageid') || 1)
			})

			// 页码转换事件，暴漏给外部使用
			app.on('pageSizeChange', function(e, size) {})

			// 切换页码总是跳回到第一页，并强制更新
			app.on('dropdown.select', function(e) {
				app.fire('goto', e, 1, true)
				app.fire('pageSizeChange', e, e.context.value)
			})

			app.observe('pageid', switchTo)
		}
	})

	Ractive.components.pager = Pager
	return Pager
})
