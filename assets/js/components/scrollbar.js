define([
	'jquery', 'ractive', 'tmpl', 'lodash'
], function($, Ractive, tmpl, _) {
	
	var Scrollbar = Ractive.extend({
		template: tmpl.scrollbar,
		isolated: true,
		onrender: function() {
			var app = this
			var startX
			// 标志位，是否命中滑动监控
			var monitoring = false			
			app.on('onMouseDown', function (e) {
				e.original.preventDefault()
				monitoring = true
				startX = e.original.pageX - $(e.node).find('.dragger').position().left
			})
			
			app.on('onMouseMove', function(e) {				
				if (monitoring) {
					var mouseMoveX = e.original.pageX - startX
					app.set('mouseMoveX', mouseMoveX)
					return false;
				}
			})

			app.on('onMouseUp', function(e) {				
				monitoring = false
				var steps = app.get('steps')
				var width = $(e.node).width()
				var mouseMoveX = app.get('mouseMoveX')
				var step = width / steps				
				var n = Math.ceil(mouseMoveX ? (mouseMoveX / step) : 0)
				
				app.set('mouseMoveX', step * (n - 1) )
			})
		}
	})

	Ractive.components.scrollbar = Scrollbar

	return Scrollbar
})
