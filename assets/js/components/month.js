define([
	'jquery', 'ractive', 'tmpl',
	'components/menu-clean'
], function($, Ractive, tmpl){
	'use strict'

	function formatMonth(month) {
		return month < 10 ? '0' + month : month
	}

	function defaults(app, data) {
		var now = new Date()

		if (!data.year) {
			app.set('year', now.getUTCFullYear())
		}

		if (!data.month) {
			app.set('month', now.getMonth() + 1)
		}

		if (!data.maxYear) {
			app.set('maxYear', now.getUTCFullYear())
		}

		app.set('multiple', !!data.multiple)

		if (data.multiple) {
			if (!data.start) {
				app.set('start', {
					year: app.get('year'),
					month: app.get('month')
				})
			}

			if (!data.end) {
				app.set('end', {
					year: app.get('year'),
					month: app.get('month')
				})
			}

			var start = app.get('start')
			var end = app.get('end')
			var s = start.year * 100 + start.month
			var e = end.year * 100 + end.month

			app.get('checked').push(s)
			s !== e && app.get('checked').push(e)
		}
	}

	var widget = Ractive.extend({
		template: tmpl.month,
		data: {
			formatMonth: formatMonth,
			monthList: [
				1, 2, 3, 4, 5, 6,
				7, 8, 9, 10, 11, 12
			],
			multiple: false,
			isSelected: function(year, month) {
				var data = this.get()
				if (!data.multiple) {
					return data.year === year && data.month === month
				}

				return data.selected && data.selected.indexOf(year * 100 + month) > -1
			},
			// 最终确认的选择
			checked: [],
			// 展示在界面上的已选择
			selected: []
		},
		oninit: function() {
			var app = this
			var data = app.get()

			defaults(app, data)

			app.on('openPanel', function(e) {
				if (app.get('isOpen')) return

				// clone
				if (app.get('multiple')) {
					app.set('selected', app.get('checked').map(function(i) {
						return i
					}))
				}

				app.set('title', app.get('year'))
				app.set('isOpen', true)

				app.fire('save', e)
			})

			// 只有多选才会有
			app.on('savePanel', function(e){
				var selected = app.get('selected')
				var last = selected.length - 1
				app.set('start', {
					year: parseInt(selected[0] / 100),
					month: selected[0] % 100
				})
				app.set('end', {
					year: parseInt(selected[last] / 100),
					month: selected[last] % 100
				})
				app.set('checked', selected)
				app.set('isOpen', false)

				app.fire('save', e)
			})

			app.on('closePanel', function() {
				app.set('isOpen', false)
			})

			app.on('select', function(e) {
				var data = app.get()
				if (!data.multiple) {
					app.set('month', e.context)
					app.set('year', app.get('title'))

					app.set('isOpen', false)
					app.fire('save', e)
					return
				}

				var year = data.title
				var month = e.context

				var val = year * 100 + month
				var index = app.get('selected').indexOf(val)
				if (index > -1) {
					app.get('selected').splice(index, 1)
				} else {
					app.get('selected').push(val)
					app.get('selected').sort()
				}
			})

			app.on('changeYear', function(e, step) {
				app.add('title', step)
			})
		}
	})

	widget.prototype.getValue = function() {
		var data = this.get()
		if (!data.multiple) {
			return {
				year: this.get('year'),
				month: this.get('month')
			}
		}

		return data.checked.map(function(item) {
			return {
				year: parseInt(item.year / 100),
				month: item.year % 100
			}
		})

	}

	Ractive.components.month = widget

	return widget
})
