define([
	'jquery', 'lodash', 'ractive', 'charts', 'moment', 'tmpl',
	'components/datagrid', 'components/filter', 'components/popover', 'components/download',
	'utils', 'spa'
], function($, _, Ractive, Charts, moment, tmpl) {
	var app
	return {
		render: function() {
			app = new Ractive({
				el: '#main>.content',
				template: tmpl.retain_custom,
				debug: App.debug,
				data: {
					filterSettings: App.filterSettings,
					players: [
						{
							label: '新增玩家',
							value: 0
						},{
							label: '活跃玩家',
							value: 1
						},{
							label: '付费玩家',
							value: 2
						}
					],
					player: 0,
					timesList: [
						{
							label: '1次',
							value: 1
						},{
							label: '2次',
							value: 2
						},{
							label: '3次',
							value: 3
						}
					],
					times: 1,
					types: [
						{
							label: '留存人数',
							value: 'num'
						},{
							label: '百分比',
							value: 'rate'
						}
					],
					type: 'num',
					days: [
						{
							label: '日留存',
							value: 'day'
						},{
							label: '周留存',
							value: 'week'
						},{
							label: '月留存',
							value: 'month'
						}
					],
					day: 'day',
					start: 0,
					end: 10,
					suffix: App.params.appID,
					offset: 2,
					// 1新增 2活跃
					playerType: 1,
					numFun: function(obj){
						return _.keys(obj).sort().filter(function(i) {return i[0] === 'y'})
					}
				}
			})

			//错误处理方法
			function wrapError(xhr) {
				if (xhr.responseJSON)
					return xhr.responseJSON

				return {
					statusCode: xhr.status,
					content: xhr.responseText + xhr.statusText ,
					id: Date.now()
				}
			}
			
			//补全数据
			function completeFun(obj, n){
				var numberArr = []
				var nums = []
				var keys = _.keys(obj).sort().filter(function(i) {return i[0] === 'y'})
				_.each(keys, function(key){
					nums.push(key.replace('y', ''))
				})
				for(var i = 0; i < n; i++){
					if($.inArray(String(i), nums) > -1){
						continue
					}
					numberArr.push(i)
				}
				
				_.each(numberArr, function(i){
					obj['y' + i] = ''
				})
				return obj
			}

			var ajaxUrls = {
				day: App.contextPath + '/customRetention/listDayCustomRetention.do',
				week: App.contextPath + '/customRetention/listWeekCustomRetention.do',
				month: App.contextPath + '/customRetention/listMonthCustomRetention.do'
			}
			var postData
			
			app.on('dropdown.select', function(e) {
				var params = {
					userType: app.get('player'),
					gameTimes: app.get('times'),
					dataType: app.get('type')
				}
				app.set('start', 0)
				// 按日共30条，每页10条
				app.set('end', app.get('day') !== 'day' ? 9 : 10)
				// 按周多返回一个时间
				app.set('offset', app.get('day') !== 'week' ? 2 : 2)
				//清空数据
				app.set('datalist', [])

				$.post(ajaxUrls[app.get('day')], $.extend({}, postData, params)).then(function(json) {					
					json = json ? json.content : []
					var data = []
					_.each(json, function(obj){
						var keys = app.get('numFun')(obj)
						var n = (app.get('day') === 'day') ? 31 : 10
						data.push(keys.length < n ? completeFun(obj, n) : obj)
					})
					
					// 将表格数据规范化，后端数据返回长度不一致
					var width = app.get('day') === 'day' ? 30 : 9
					var offset = app.get('offset')
					_.each(data, function(row) {
						_.times(width + offset - row.length, function() {
							row.push('')
						})
					})
					app.set('datalist', data)
				}).fail(function(xhr){
					app.set('ajaxError', wrapError(xhr))
				})
			})
						
			app.on('switchPage', function(e, i) {
				var size = (app.get('end') - app.get('start')) * i
				app.set('start', size + app.get('start'))
				app.set('end', size + app.get('end'))
			})

			app.observe('start end', function() {
				var start = app.get('start')
				var end = app.get('end')
				var titles = []
				for(var i = start;i < end; i += 1) {
					titles.push(i + 1)
				}
				app.set('theadTitles', titles)
			})

			var filter = findRactiveComponent(app, 'filter')

			filter.on('save', function(e, params) {
				postData = $.extend({}, App.ajaxParams, params)
				app.fire('dropdown.select', e, 1)
			})

			// 开启查询
			filter.fire('save', {}, {})
		},
		destroy: function() {
			app.teardown()
		}
	}
})
