/**
 * DEMO: 多选周
 * <calendar isRange="1" hoverDays="week"
 * 	start="{{dStart}}" end="{{dEnd}}" max="{{dMax}}" min="{{dMin}}"
 * 	today="{{dToday}}" />
 */
define([
	'jquery', 'ractive', 'tmpl', 'store', 'lodash',
	'components/menu-clean'
], function($, Ractive, tmpl, Store, _){
	'use strict'

	/**
	 * 把一维数组转换成二维表格数组
	 * @param items {Array}
	 * @param rowLen {Number} 行高
	 * @param colLen {Number} 列宽
	 * @returns {Array}
	 */
	function tablify(items, rowLen, colLen) {
		var results = []
		for (var i = 0; i < rowLen; i++) {
			var array = []
			for (var j = 0; j < colLen; j++) {
				var item = items[i * colLen + j]
				/**
				 * 指明当天属于每月第几周以及每周第几天
				 */
				item.weekInMonth = i
				item.dayInWeek = j
				array.push(item)
			}
			results.push(array)
		}
		return results
	}

	/**
	 * 获取当天属于今年的第几周
	 * 参考 http://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
	 */
	function getWeekNumberInYear(year, month, date) {
		var d = new Date(year, month, date)
		d.setHours(0, 0, 0)
		// Set to nearest Thursday: current date + 4 - current day number
		// Make Sunday's day number 7
		d.setDate(d.getDate() + 4 - (d.getDay()||7))
		// Get first day of year
		var yearStart = new Date(d.getFullYear(), 0, 1)
		// Calculate full weeks to nearest Thursday
		return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
	}

	// 遍历日历面板包含的二维数组
	function iterate(app, fn) {
		['current', 'next'].forEach(function(key) {
			var list = app.get(key)
			list && list.forEach(function(items, row) {
				items.forEach(function(item, col) {
					fn(key, item, row, col)
				})
			})
		})
	}

	// 格式化私有日期对象
	function formatDate(item) {
		return item.year + '-' + uniform(item.month) + '-' + uniform(item.date)
	}

	function uniform(i) {
		return i < 10 ? '0' + i : i
	}

	// 转换 'xxxx-xx-xx' 为私有日期对象
	function parseDate(txt) {
		if (!txt) return

		var items = txt.split(/-|\//g)
		return {
			year: parseInt(items[0]),
			month: parseInt(items[1]),
			date: parseInt(items[2])
		}
	}

	// 比较两个私有日期对象的大小
	function compare(a, b) {
		return (a.year * 10000 + a.month * 100 + a.date) - (b.year * 10000 + b.month * 100 + b.date)
	}

	// 获取两个私有日期对象相差多少天
	function subtract(a, b) {
		return (new Date(a.year, a.month - 1, a.date) - new Date(b.year, b.month - 1, b.date)) / (1000 * 24 * 3600)
	}

	// 私有日期是否可选择
	function isSelectable(item, max, min, filter) {
		if (compare(max, item) >= 0 && compare(item, min) >= 0) {
			return $.isFunction(filter) ? !!filter(item) : true
		}

		return false
	}
  
  // 调整面板位置
  function fixPanelPosition(app) {
    var node = app.find('.de-calendar')
    var el = $(app.find('.de-calendar-container'))
    var offset = $(node).offset()
    var offsetWidth = el.outerWidth()
    var pageWidth = document.documentElement.clientWidth
    var left = pageWidth - offset.left - offsetWidth - 12

    if (left < 0) {
      el.css('left', left + 'px')
    }
  }

	/**
	 * 计算指定月份有多少天
	 * 以及该月一号是周几，用于填补开始的空白
	 */
	function getMonthInfo(year, month) {
		var date = new Date(year, month, 1)
		var current = new Date(date.getTime() - 24 * 3600 * 1000)
		return {
			year: current.getFullYear(),
			month: current.getMonth() + 1,
			days: current.getDate(),
			// 周日是最后一天
			day: new Date(year, month - 1, 1).getDay() || 7
		}
	}

	function isMultipleWeeks(app) {
		return app.get('hoverDays') === 'week' && app.get('isRange')
	}

	function defaults(app) {
		// use start/end to control the final values
		// use startDate/endDate to store the temp values
		var start = app.get('start')
		var end = app.get('end')
		var max = app.get('max')
		var min = app.get('min')
		var selected = app.get('selected')
		var autoSubmit = !!app.get('autoSubmit')
		// 本地存储的key
		var name = app.get('name')
		var lastSelected = {}

		if (name) {
			var key = PREFIX + name
			var str = Store.get(key)
			lastSelected = str ? JSON.parse(str) : {}
		}

		// is single mode
		var isRange = false
		if (start && end) {
			isRange = true
			app.set('start', lastSelected.start || start)
			app.set('end', lastSelected.end || end)
			start = parseDate(lastSelected.start || start)
			end = parseDate(lastSelected.end || end)
		} else {
			selected = lastSelected.selected || selected
			start = parseDate(selected)
			end = parseDate(selected)
			app.set('start', selected)
			app.set('end', selected)
			// auto submit on single mode
			app.set('autoSubmit', true)
		}

		app.set('startDate', start)
		app.set('endDate', end)

		app.set('isRange', isRange)
		app.set('name', name)

		max && app.set('maxDate', parseDate(max))
		min && app.set('minDate', parseDate(min))
	}

	/**
	 * 获取日历面板中当月以及下月的每一天的私有日期对象
	 * 当月可能包含上月几天，下月可能包含下下个月几天
	 * 最后将这些数据转换为 6* 7的二维数组
	 * @param filter {Function} 自定义过滤函数，设置某天是否可选择
	 * @returns {Array}
	 */
	function getCalendarDays(year, month, maxDate, minDate, disableToday, filter) {
		var current = getMonthInfo(year, month)
		var prev = getMonthInfo(year, month - 1)
		var next = getMonthInfo(year, month + 1)
		var now = new Date()
		var today = {
			year: now.getUTCFullYear(),
			month: now.getMonth() + 1,
			date: now.getDate()
		}
		var items = []
		var item

		for (var i = 0; i < current.day - 1; i += 1) {
			item = {
				year: prev.year,
				month: prev.month,
				// 当月几号
				date: prev.days - i,
				// 当月1号是周几
				day: prev.day
			}

			// 距离今天有多少天
			item.distance = subtract(item, today)
			if (disableToday && item.distance === 0) {
				item.disabled = true
			} else {
				item.disabled = !isSelectable(item, maxDate, minDate, filter)
			}
			items.unshift(item)
		}

		for (var j = 1; j <= current.days; j += 1) {
			item = {
				year: current.year,
				month: current.month,
				date: j,
				day: current.day
			}

			item.distance = subtract(item, today)
			if (disableToday && item.distance === 0) {
				item.disabled = true
			} else {
				item.disabled = !isSelectable(item, maxDate, minDate, filter)
			}
			items.push(item)
		}

		var paddingLen = 6 * 7 - current.days - (current.day - 1)
		for (var k = 1; k <= paddingLen; k += 1) {
			item = {
				year: next.year,
				month: next.month,
				date: k,
				day: next.day
			}

			item.distance = subtract(item, today)
			if (disableToday && item.distance === 0) {
				item.disabled = true
			} else {
				item.disabled = !isSelectable(item, maxDate, minDate, filter)
			}
			items.push(item)
		}
		return tablify(items, 6, 7, filter)
	}

	var PREFIX = 'calendar-'

	var Calendar = Ractive.extend({
		isolated: true,
		template: tmpl.calendar,
		data: {
			format: formatDate,
			getHoverTip: function(distance, forward, backward) {
				if (distance === 0) return

				if (distance > 0) return distance + backward

				if (distance < 0) return distance * -1 + forward
			},
			multipleWeeks: []
		},
		oninit: function() {
			var app = this
			// 选天时的标志位，用于区分选多天和单选一天
			var clickTime = 0

			defaults(app)

			app.on({
				// 根据选择的月份来填充当前日历面板数据
				'dateChange': function(year, month) {
					var maxDate = app.get('maxDate') || {year: 2048, month: 1, date: 1}
					var minDate = app.get('minDate') || {year: 1024, month: 1, date: 1}
					var filter = app.get('filter')
					var disableToday = app.get('disableToday')
					filter = $.isFunction(filter) ? filter.bind(app) : null
					app.set('current', getCalendarDays(year, month, maxDate, minDate, disableToday, filter))
					app.set('currentYear', year)
					app.set('currentMonth', month)

					if (app.get('isRange')) {
						var next = new Date(year, month, 1)
						var nextYear = next.getFullYear()
						var nextMonth = next.getMonth() + 1
						app.set('next', getCalendarDays(nextYear, nextMonth, maxDate, minDate, disableToday, filter))
						app.set('nextYear', nextYear)
						app.set('nextMonth', nextMonth)
					}

					/**
					 * 同步视图使用不同的事件
					 * 按周多选可以间断，区别于其它只有开始和结束时间
					 */
					var syncEvent = isMultipleWeeks(app) ? 'syncMultipleWeeks' : 'syncStatus'
					app.fire(syncEvent)
				},

				/**
				 * 同步日历单元格选择状态
				 * 判断日期如果在开始和结束时间之间则选中
				 */
				'syncStatus': function setDaysSelected() {
					var startDate = app.get('startDate')
					var endDate = app.get('endDate')
					iterate(app, function(key, item, i, j) {
						var result1 = compare(item, startDate)
						var result2 = compare(item, endDate)
						var selected = result1 >= 0 && result2 <= 0 ? 'selected' : ''
						if (result1 === 0) {
							selected += ' start-date'
						}
						if (result2 === 0) {
							selected += ' end-date'
						}
						app.set(key + '.' + i + '.' + j + '.selected', selected)
					})
				},

				/**
				 * 同步多选周视图
				 */
				'syncMultipleWeeks': function() {
					var data = app.get()
					_.each(data.multipleWeeks, function(item) {
						['current', 'next'].forEach(function(key) {
							if (data[key + 'Year'] === item.year && data[key + 'Month'] === item.month) {
								var basePath = key + '.' + item.weekInMonth
								app.set(basePath + '.*.selected', 'selected')
								// 设置首尾样式
								app.set(basePath + '.0.selected', 'selected start-date')
								app.set(basePath + '.6.selected', 'selected end-date')
							}
						})
					})
				},

				/**
				 * 单元格点击事件
				 */
				'choose': function onTableCellClick(e) {
					if (isMultipleWeeks(app)) {
						app.fire('chooseMultipleWeeks', e)
						return
					}

					var item = e.context
					var startDate, endDate
					var autoSubmit = app.get('autoSubmit')
					var isRange = app.get('isRange')

					// 设置了鼠标悬浮选中，要区分是否允许多次
					if (app.get('hoverDays')) {
						iterate(app, function(key, obj, i, j) {
							if (obj.hovered) {
								if (!startDate) {
									startDate = obj
								}
								endDate = obj
							}
							app.set(key + '.' + i + '.' + j + '.hovered', '')
						})

						app.set('startDate', startDate || item)
						app.set('endDate', endDate || item)
					} else {
						// 是否允许选择多天
						clickTime = isRange ? clickTime + 1 : 1
						if (clickTime % 2 === 1) {
							app.set('startDate', item)
							app.set('endDate', item)
							autoSubmit = isRange ? autoSubmit : true
						} else {
							startDate = app.get('startDate')
							endDate = app.get('endDate')
							app.set('startDate', compare(item, startDate) <= 0 ? item : startDate)
							app.set('endDate', compare(item, endDate) >= 0 ? item : endDate)
						}
					}

					app.fire('syncStatus')
					autoSubmit && app.fire('savePanel')
				},

				/**
				 * 不连续地按周选
				 */
				'chooseMultipleWeeks': function(e) {
					var context = e.context
					var basePath = e.keypath.split('.')[0] + '.' + context.weekInMonth
					var weeks = app.get('multipleWeeks')
					var filter = {
						year: context.year,
						month: context.month,
						weekInMonth: context.weekInMonth
					}
					var index = _.findIndex(weeks, filter)

					app.set(basePath + '.*.selected', index > -1 ? '' : 'selected')

					if (index === -1) {
						weeks.push(filter)

						app.set(basePath + '.0.selected', 'selected start-date')
						app.set(basePath + '.6.selected', 'selected end-date')
					} else {
						weeks.splice(index, 1)
					}

					weeks.sort(function(a, b) {
						return a.year * 100 + a.month + a.weekInMonth * 0.1 > (b.year * 100 + b.month + b.weekInMonth * 0.1) ? 1 : -1
					})

					console.log(this.get('multipleWeeks'))
				},

				// 向前或向后跳跃日历面板
				'goto': function(e, num) {
					var currentYear = app.get('currentYear')
					var currentMonth = app.get('currentMonth')
					var next = new Date(currentYear, currentMonth - 1 + num, 1)
					app.fire('dateChange', next.getFullYear(), next.getMonth() + 1)
				},

				// 暴露给外部
				'save': function() {
					// 将选择的项目存到本地存储
					var name = app.get('name')
					if (name) {
						var obj = app.get('isRange') ? {
							start: app.get('start'),
							end: app.get('end')
						} : {selected: app.get('start')}
						Store.set(PREFIX + name, JSON.stringify(obj))
					}
				},

				// 打开面板
				'openPanel': function(e) {
					app.set('show', true)

					var startDate = app.get('startDate')
					app.fire('dateChange', startDate.year, startDate.month)
          // 最后执行，保证next已经设置
          fixPanelPosition(app)
				},

				'savePanel': function(e) {
					app.set('show', false)
					app.set('start', formatDate(app.get('startDate')))
					app.set('end', formatDate(app.get('endDate')))

					app.fire('save', e)
				},

				'closePanel': function(e) {
					app.set('show', false)
				},

				// mouseenter event
				'hover': function(e) {
					var days = app.get('hoverDays')
					var target = e.context
					if (!days) {
						return
					}

					if ($.isNumeric(days)) {
						// 向后选择指定天
						iterate(app, function(key, item, i, j) {
							if (item.disabled) return

							var gapDays = days > 0 ? subtract(item, e.context) : subtract(e.context, item)
							var isIn = gapDays >= 0 && gapDays < Math.abs(days)
							app.set(key + '.' + i + '.' + j + '.hovered', isIn ? 'hovered' : '')
						})
					} else if (days === 'week') {
						// 选择当前周，如果要选择月使用month控件
						var currentWeekNumInYear = getWeekNumberInYear(target.year, target.month - 1, target.date)
						iterate(app, function(key, item, i, j) {
							if (item.disabled) return

							var isHovered =  currentWeekNumInYear === getWeekNumberInYear(item.year, item.month - 1, item.date)
							app.set(key + '.' + i + '.' + j + '.hovered', isHovered ? 'hovered' : '')
						})
					}  else if ($.isFunction(days)) {
						// 自定义函数
						iterate(app, function(key, item, i, j) {
							if (item.disabled) return

							var isHovered = days(target, item)
							app.set(key + '.' + i + '.' + j + '.hovered', isHovered ? 'hovered' : '')
						})
					}
				}
			})

			// 外部调用直接设置start end，同步变化到对应的date对象
			app.observe('start end max min', function(val, old, keypath) {
				app.set(keypath + 'Date', parseDate(val))
			})
		}
	})

	Ractive.components.calendar = Calendar

	Calendar.prototype.getValue = function() {
		if (!isMultipleWeeks(this)) {
			return [this.get('start'), this.get('end')]
		}

		return this.get('multipleWeeks')
	}

	return Calendar
})
