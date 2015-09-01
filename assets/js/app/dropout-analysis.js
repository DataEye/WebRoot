define([
	'jquery', 'lodash', 'ractive', 'charts', 'moment', 'tmpl', 'utils', 
	'components/async-render', 'components/result', 'components/config', 
	'components/panel', 'components/filter', 
	'spa'
], function($, _, Ractive, Charts, moment, tmpl, utils, AsyncRender) {
	var app
	return {
		render: function() {
			var fields = {
				channel: 'channel',
				country: 'country',
				city: 'city'
			}
			var detailUrls = {
				channel: '/newbieGuide/listLostUserByChannelDetail.do',
				country: '/newbieGuide/listLostUserByCountryDetail.do',
				city: '/newbieGuide/listLostUserByCityDetail.do',
				region: '/newbieGuide/listLostUserByRegionDetail.do',
				version: '/newbieGuide/listLostUserByVersionDetail.do',
				role: '/newbieGuide/listLostUserByRoleDetail.do'
			}
			app = new Ractive({
				template: tmpl.dropout_analysis,
				data: {
					filterSettings: App.filterSettings,
					suffix: App.params.appID,
					days: [
						{
							label: 3,
							value: 3
						},
						{
							label: 4,
							value: 4
						},
						{
							label: 5,
							value: 5
						},
						{
							label: 6,
							value: 6
						},
						{
							label: 7,
							value: 7
						},
						{
							label: 10,
							value: 10
						},
						{
							label: 14,
							value: 14
						}
					],
					day: 3,
					getFormData: function(tabName) {						
						return $.extend({}, postData)
					}
				}
			})
			
			// 筛选条件 + 基础参数
			var postData

			// 使用异步渲染组件
			AsyncRender.init(app, '#main>.content', 2)
												
			var filter = app.findComponent('filter')
			
			filter.on('save', function(e, params) {
				$('body').trigger('click')

				postData = $.extend({conditionDay: app.get('day')}, App.ajaxParams, params)

				app.findAllComponents('panel')[0].fire('viewTab', e, 'dropout')	

				app.findAllComponents('panel')[1].fire('viewTab', e, 'days')
				
			})

			app.observe('day', function() {
				filter.fire('save', {}, filter.getParams())
			})

			// observe以后不用手动fire
			// filter.fire('save', {}, filter.getParams())
		},
		destroy: function() {
			app.teardown()
		}
	}
})
