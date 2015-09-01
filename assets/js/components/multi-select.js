/**
 * 应用和资源位筛选框，支持多选和搜索
 * Example:
 * 获取选中项目: ractive.get('selected')
 */

define([
	'ractive', 'tmpl', 'jquery', 'lodash', 'store',
	'components/menu-clean'
], function(Ractive, tmpl, $, _, Store) {
	// 本地存储的后缀
	var SUFFIX = {
		remember: '_remember',
		json: '_json'
	}

	function updateLocalStorage(self) {
		var useLocalStorage = self.get('useLocalStorage')
		var name = self.get('name')

		// 初始化时保证了必须有name才使用本地存储
		if (useLocalStorage) {
			var selected = self.get('selected')
			if (selected && selected.length) {
				Store.set(name + SUFFIX.json, JSON.stringify(selected))
			} else {
				Store.remove(name + SUFFIX.json)
			}
			Store.set(name + SUFFIX.remember, '1')
		} else {
			// 不使用本地存储只有在设置了name以后才会本地数据，但是会保留设置（0表示不使用本地存储）
			if (name) {
				Store.set(name + SUFFIX.remember, '0')
				Store.remove(name + SUFFIX.json)
			}
		}
	}

	/**
	 * 自动调整面板展开的横向位置
	 */
	function autoAdjust(app, el) {
		var offset = $(el).offset()
		var docWidth = $('body').width()
		var btnWidth = $(el).outerWidth()
		var panelWidth = app.get('width')
		if (docWidth - offset.left < panelWidth) {
			app.set('left', btnWidth - panelWidth)
		} else {
			app.set('left', 0)
		}
	}

	var widget = Ractive.extend({
		template: tmpl.multi_select,
		isolated: true,
		data: {
			// 是否使用本地存储
			useLocalStorage: true,
			// 面板向左偏移
			left: 0,
			// 面板宽度
			width: 550
		},
		onrender: function() {
			var self = this, timer
			// 动态后缀，每个appid使用不同的后缀，避免共享json
			var suffix = self.get('suffix')
			if (suffix) {
				SUFFIX.json = '_json_' + suffix
			}

			/**
			 * “记住所选”功能会向本地存储写2个key，一个是数据项，一个是设置项目
			 * 组件默认使用本地存储，所以要弃用需要设置本地存储值为0
			 * 使用本地存储功能组件必须有name属性，没有则默认不使用本地存储功能，即使强制设置为使用也不行
			 */
			var componentName = self.get('name')
			if (componentName) {
				var localSetting = Store.get(componentName + SUFFIX.remember)
				// 本地设置了不记住所选，则不使用本地存储（设置为0表示不使用）
				if (localSetting) {
					self.set('useLocalStorage', localSetting !== '0')
				}

				if (self.get('useLocalStorage')) {
					var storageItems = Store.get(componentName + SUFFIX.json)
					if (storageItems) {
						storageItems = JSON.parse(storageItems)
						self.set('selected', storageItems)
					}
				} else {
					// 不使用记住所选则保存设置到本地存储
					Store.set(componentName + SUFFIX.remember, '0')
				}
			} else {
				self.set('useLocalStorage', false)
			}

			// 更改item选中状态
			self.on('toggleStatus', function(e) {
				var isSingle = !!self.get('single')
				var status = e.context.checked
				if (isSingle) {
					self.set('items.*.checked', false)
					!status && self.set(e.keypath + '.checked', true)
				} else {
					self.toggle(e.keypath + '.checked')
				}
			})

			// 客户端查询
			self.on('search', function(e) {
				if (timer) clearTimeout(timer)

				timer = setTimeout(function() {
					var keyword = self.get('keyword')
					if (!keyword) {
						self.set('items.*.hide', false)
						self.set('no_search_result', false)
						return
					}

					var result = 0
					_.each(self.get('items'), function(item, i) {
						var hide = item.label.indexOf(keyword) === -1
						self.set('items.' + i + '.hide', hide)

						if (!hide) {
							result += 1
						}
					})

					self.set('no_search_result', result === 0)
				}, 250)
			})
		}
	})

	// 获取选中项目
	widget.prototype.getSelectedItems = function() {
		var data = this.get()
		// 全选传 -1
		var items = data.items || []
		var selected = data.selected || []
		if (items.length === 0 && selected.length) {
			items = selected
		}

		return _.filter(items, {checked: true})
	}

	Ractive.components.multiselect = widget
	return widget
})
