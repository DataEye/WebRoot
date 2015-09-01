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
				template: tmpl.retain_add,
				data: {					
					filterSettings: App.filterSettings,
					suffix: App.params.appID,
					formatPercentage: formatPercentage,
					formatTimeAxis: Charts.formatTimeAxis,
					getData: function(tabName, custom) {
						if (!custom) {
						  return postData
						}
						return $.extend({}, postData, { region: custom.id })
					}
				}
			})
			
			// 筛选条件 + 基础参数
			var postData

			// 使用异步渲染组件
			AsyncRender.init(app, '#main>.content', 1)
												
			var filter = app.findComponent('filter')
						
			

			filter.on('save', function(e, params) {

				postData = $.extend({}, App.ajaxParams, params)
				app.findAllComponents('panel')[0].fire('viewTab', e, 'distribution')
				app.findAllComponents('panel')[1].fire('viewTab', e, '1day')
				app.findAllComponents('panel')[2].fire('viewTab', e, '1day')
				app.findAllComponents('panel')[3].fire('viewTab', e, '1day')
				app.findAllComponents('panel')[4].fire('viewTab', e, '1day')
				app.findAllComponents('panel')[5].fire('viewTab', e, '1day')
			})

			filter.fire('save', {}, filter.getParams())
		},
		destroy: function() {
			app.teardown()
		}
	}
})
