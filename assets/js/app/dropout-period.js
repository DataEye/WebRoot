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
				template: tmpl.dropout_period,
				data: {
					filterSettings: App.filterSettings,
					suffix: App.params.appID,
					getFormData: function() {
						return postData
					}
				}
			})
			
			// 筛选条件 + 基础参数
			var postData

			// 使用异步渲染组件
			AsyncRender.init(app, '#main>.content', 1)
												
			var filter = app.findComponent('filter')
						
			filter.on('save', function(e, params) {
				postData = $.extend({conditionDay: app.get('conditionDay')}, App.ajaxParams, params)

				app.findAllComponents('panel')[0].fire('viewTab', e, 'region')	
			})

			filter.fire('save', {}, filter.getParams())
		},
		destroy: function() {
			app.teardown()
		}
	}
})
