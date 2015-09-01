define([
	'ractive', 'jquery', 'md5', 'lodash', 'moment', 'utils',
	'components/text-input', 'components/dialog-resize', 'components/datagrid',
	'components/dropdown', 'components/popover', 'components/tooltip',
	'spa'
], function(Ractive, $, md5, _, moment, Utils) {
	var platforms = [
		{label: 'iOS', value: '1', icon: 'fa-apple'},
		{label: 'Android', value: '2', icon: 'fa-android'},
		{label: 'windows phone', value: '3', icon: 'fa-windows'}
	]
	var app = new Ractive({
		el: '#data_center',
		template: '#data_center_tmpl',
		data: {
			collapsed: false,
			platforms: platforms,
			formatTime : function(val) {
				return moment(val * 1000).format('YYYY-MM-DD HH:mm')
			},
			gridOptions: {
				// 后台接口地址
				ajaxUrl: App.contextPath + '/gamecenter/getGameCenterList.do'
			}
		}
	})

	var grid = app.findComponent('datagrid')
	var formatTime = app.get('formatTime')
	grid.set('options.params', {userID: App.user.userID})
	grid.set('collapsed', app.get('collapsed'))
	grid.fire('request', {}, 1)

	var params = {}
	$.post(App.contextPath + '/gamecenter/getnextupdatetime.do', {
		userID: App.user.userID
	}).then(function(json) {
		app.set('countdown', Utils.formatSeconds(json.content))
	}).fail(Utils.jqErrorHandler)


	grid.on('edit', function(e) {
		app.set('appInfo', _.clone(e.context))
		app.set('collapsed', true)
	})

	grid.on('highlighted', function(e, i) {
		grid.set('highlighted', i)
	})

	app.on('closeDialog', function(e) {
		app.set('collapsed', false)
	})
	
	//刷新
	app.on('refresh', function() {
		location.reload()
	})

	//删除
	app.on('deleteApp', function(e) {
		var flag = confirm(App.i18n.deleteTips);
		if(flag){
			app.set('disableSubmit', true)
			$.post(App.contextPath + '/app/deleteApp.do', {
				userID: App.user.userID,
				appID: e.context.appID
			}).then(function(json) {
				Utils.redirectAlert(App.i18n.deleteOk, 'home.jsp')
			}).fail(Utils.jqErrorHandler).always(function() {
				app.set('disableSubmit', false)
			})
		}
	})

	//更新
	app.on('submit', function(e) {
		var appName = Utils.findRactiveComponent(app, 'textinput', {name: 'appName'})
		var plat = Utils.findRactiveComponent(app, 'dropdown', {name: 'platform'})
		if (!appName.get('valid')) {
			app.findComponent('textinput').find('input').focus()
			return
		}
		$.post(App.contextPath + '/app/updateApp.do', {
			userID: App.user.userID,
			appID: e.context.appID,
			appName: appName.get('value'),
			platFormType: plat.get('value')
		}).then(function(json) {
			Utils.redirectAlert(App.i18n.editOk, 'home.jsp')
		}).fail(Utils.jqErrorHandler)
	})
})
