define(function() {
	// 页面url配置
	var pageUrls = [
	'/realtime',
	'/players/add',
	'/players/active',
	'/players/stay',
	'/players/lost',
	'/players/uid',
	'/pay/data',
	'/pay/action',
	'/pay/transform',
	'/pay/whale',
	'/pay/whale/detail',
	'/online/analysis',
	'/online/habits',
	'/prom/channel',
	'/setting/download',
	'/setting/config',
	'/setting/test',
	'/setting/log',
	'/prom/gameserver',
	'/setting/download'
	]

	var routes = {}

	/**
	 * 将url中的/替换为-，如果url是/abc/xyz，那么对应的js文件为assets/js/app/abc-xyz
	 */
	pageUrls.forEach(function(url) {
		// js脚本文件中分隔符统一使用横杠
		// url中的下划线和斜线统一替换为横杠
		routes[url] = 'app/' + url.slice(1).replace(/\/|_/g, '-')
	})

	return routes
})
