/**
 * 组件配置扩展
 * 上级组件自己讲数据写入对应的配置项目
 * 1）避免将复杂配置写在脚本里面
 * 2）方便国际化
 *
 */
define([ 'ractive' ], function(Ractive) {
	var widget = Ractive.extend({
	})

	Ractive.components.config = widget

	return widget
})
