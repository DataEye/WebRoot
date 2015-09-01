// 模板字符串
define(['jquery'], function($) {
	var tmpl = {}

	$('script[type=text]').each(function() {
		var id = $(this).attr('id').replace('_tmpl', '').replace(/-/g, '_')

		if (tmpl[id]) throw new Error('模板ID已经存在:' + id)

		tmpl[id] = $(this).html()
	})
	return tmpl
})
