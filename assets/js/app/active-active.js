define([
	'jquery', 'lodash', 'ractive', 'charts', 'moment', 'tmpl', 'utils', 
	'components/async-render', 'components/result', 'components/config', 
	'components/panel', 'components/filter', 
	'spa'
], function($, _, Ractive, Charts, moment, tmpl, utils, AsyncRender) {
	var app
	return {
		render: function() {
			app = new Ractive({
				template: tmpl.active_active,
				data: {					
					filterSettings: App.filterSettings,
					suffix: App.params.appID,
					formatPercentage: formatPercentage,
					formatTimeAxis: Charts.formatTimeAxis,
					getData: function(tabName, custom, panel) {
						custom = custom || {}
						var fields = {
							'day1': 1,
							'day7': 7,
							'day30': 30
						}
						var ret = {
							period: fields[custom.parentSubTabName || tabName]
						}
						ret[panel.get('tabName')] = custom.id
						return $.extend({}, postData, ret)
					}
				}
			})
			
			// 筛选条件 + 基础参数
			var postData

			// 使用异步渲染组件
			AsyncRender.init(app, '#main>.content', 1)
			
			var filter = app.findComponent('filter')
			
			$('body').on('click', function () {
				app.set('sourceDetail', null)
				app.set('attrDetail', null)
			})

			filter.on('save', function(e, params) {
				$('body').trigger('click')

				postData = $.extend({}, App.ajaxParams, params)
				app.findAllComponents('panel')[0].fire('viewTab', e, 'dau')
				app.findAllComponents('panel')[1].fire('viewTab', e, 'channel')
				app.findAllComponents('panel')[2].fire('viewTab', e, 'region')
				app.findAllComponents('panel')[3].fire('viewTab', e, 'playDay')
				app.findAllComponents('panel')[4].fire('viewTab', e, 'peak')
			})

			filter.fire('save', {}, filter.getParams())
		},
		destroy: function() {
			app.teardown()
		}
	}
})
