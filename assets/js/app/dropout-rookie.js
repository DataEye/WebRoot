define([
	'jquery', 'lodash', 'ractive', 'charts', 'moment', 'tmpl', 'utils', 
	'components/async-render', 'components/result', 'components/config', 
	'components/panel', 'components/filter', 'components/slider',
	'spa'
], function($, _, Ractive, Charts, moment, tmpl, utils, AsyncRender) {
	var app
	return {
		render: function() {			
			app = new Ractive({
				template: tmpl.dropout_rookie,
				data: {
					filterSettings: App.filterSettings,
					suffix: App.params.appID,
					getFormData: function(tabName, custom) {
						var ret = {}
						ret[tabName] = custom && custom.id
						return $.extend({}, postData, ret)
					}
				}
			})
			
			// 筛选条件 + 基础参数
			var postData

			// 使用异步渲染组件
			AsyncRender.init(app, '#main>.content', 2)
												
			var filter = app.findComponent('filter')
						
			$('body').on('click', function(){
				app.set('allikaDetail', null)
				app.set('standeDetail', null)
			})

			filter.on('save', function(e, params) {
				$('body').trigger('click')

				postData = $.extend({}, App.ajaxParams, params)
				var panels = app.findAllComponents('panel')

				var panel0 = panels[0]
				// 修改用户成本
				panel0.on('slider.valuechange', function(e, val, percentage) {
					
					var grid = this.findComponent('grid')
					if (!grid) {
						this.set('totalUserCost', 0)
						return
					}

					var list = grid.get('json.content')
					var totalUser = _.reduce(list, function(total, n) {
						return total + n.y0
					}, list[0].y0)
					
					this.set('totalUserCost', utils.formatNumber(val * totalUser))
				})
				panel0.fire('viewTab', e, 'rookie')	

				var panel1 = panels[1]
				panel1.fire('viewTab', e, 'channel')			

				var panel2 = panels[2]
				panel2.fire('viewTab', e, 'region')
			})

			filter.fire('save', {}, filter.getParams())
		},
		destroy: function() {
			app.teardown()
		}
	}
})
