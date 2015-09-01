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
				template: tmpl.voolu_rollServer,
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
						
			$('body').on('click', function(){
				app.set('analysisDetail', null)
			})

			filter.on('save', function(e, params) {	
				app.set('analysisDetail', null)

				postData = $.extend({}, App.ajaxParams, params)
				app.findAllComponents('panel')[0].fire('viewTab', e, 'add')
				app.findAllComponents('panel')[1].fire('viewTab', e, 'grade')
				app.findAllComponents('panel')[2].fire('viewTab', e, 'retention')
				app.findAllComponents('panel')[3].fire('viewTab', e, 'income')
			})

			filter.fire('save', {}, filter.getParams())
		},
		destroy: function() {
			app.teardown()
		}
	}
})
