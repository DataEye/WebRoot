define([
	'ractive', 'jquery', 'md5', 'lodash',
	'components/text-input', 'utils', 'spa'
], function(Ractive, $, md5, _) {
	var app = new Ractive({
		el: '#form_login',
		template: '#form_login_tmpl'
	})

	app.on('login', function(e) {
		e.original.preventDefault()

		var params = {}, errorCount = 0
		_.each(app.findAllComponents('textinput'), function(plugin) {
			var name = plugin.get('name')
			var type = plugin.get('type')
			var val  = plugin.get('value')

			if (!plugin.get('valid')) {
				plugin.find('input').focus()
				errorCount += 1
				return false
			}
			params[name] = type === 'password' ? md5(val) : val
		})

		if (errorCount > 0) return
		app.set('disableSubmit', true)
		$.post(App.contextPath + '/user/login.do', params).then(function(json) {
			location.href = App.contextPath + '/pages/home.jsp'
		}).fail(jqErrorHandler).always(function() {
			app.set('disableSubmit', false)
		})
	})
})
