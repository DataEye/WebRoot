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
				template: tmpl.pay_ltv,
				data: {
					dMax: moment().add(-14, 'days').format('YYYY-MM-DD'),
					filterSettings: App.filterSettings,
					suffix: App.params.appID,
					getFormData: function(tabName, custom) {
						return $.extend({}, postData)
					}
				}
			})
			
			// 筛选条件 + 基础参数
			var postData

			// 使用异步渲染组件
			AsyncRender.init(app, '#main>.content', 3)
			
			// 点击其他地方隐藏站开的子面板
			$('body').on('click', function () {
				app.set('sourceDetail', null)
				app.set('ltvDetail', null)
			})
												
			var filter = app.findComponent('filter')

			filter.on('save', function(e, params) {
				postData = $.extend({}, App.ajaxParams, params)				
				app.findAllComponents('panel')[0].fire('viewTab', e, 'day')	
				app.findAllComponents('panel')[1].fire('viewTab', e, 'channel')
				app.findAllComponents('panel')[2].fire('viewTab', e, 'region')
			})

			filter.fire('save', {}, filter.getParams())
		},
		destroy: function() {
			app.teardown()
		}
	}
})
