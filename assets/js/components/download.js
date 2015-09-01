define([
	'jquery', 'ractive', 'tmpl', 'lodash',
	'components/menu-clean'
], function($, Ractive, tmpl, _) {
	// 封装统一的ajaxError对象
	function wrapError(xhr) {
		if (xhr.responseJSON)
			return xhr.responseJSON

		return {
			statusCode: xhr.status,
			content: xhr.responseText + xhr.statusText ,
			id: Date.now()
		}
	}

	var widget = Ractive.extend({
		template: tmpl.download,
		data: {
			loading: false,
			generated: false
		},
		onrender: function() {
			var app = this

			app.on('generateReport', function(e) {
				var url = app.get('url')
				var data = app.get('data') || {}

				if (!url) {
					console.log('没有配置url')
					return
				}

				app.set('loading', true)
				app.set('generated', false)
				app.set('empty', false)
				app.set('isOpen', true)
				$.post(url, data).then(function(json, txt, xhr) {
					var status = json.statusCode
					app.set('generated', status == 200)
					app.set('empty', status == 201)
				}).fail(function(xhr) {
					app.set('ajaxError', wrapError(xhr))
				}).always(function() {
					app.set('loading', false)
				})
			})
		}
	})

	Ractive.components.download = widget
	return widget
})
