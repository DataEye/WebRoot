/**
 * 应用和资源位筛选框，支持多选和搜索
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

	// 循环types
	function loopTypes(types, fn) {
		_.each(types, function(type, i) {
			_.each(type.child, function(subType, j) {
				_.each(subType.child, function(item, k) {
					// 方便操作keypath
					fn(item, i, j, k)
				})
			})
		})
	}

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

	function ajaxErrorHandler(self) {
		return function(xhr) {
			self.set('ajaxError', wrapError(xhr))
		}
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

	// 同步叶子的选中状态
	function syncItemsStatus(self) {
		var items = self.get('items') || []
		var selected = self.get('selected') || []

		_.each(selected, function(item) {
			var i = _.findIndex(items, {value: item.value})
			i !== -1 && self.set('items.' + i + '.checked', true)
		})
	}

	// 大类小类请求成功后初始化相关事件
	function initialize(self, error) {
		// 点击大类展示小类
		self.on('showSubMenus', function(e) {
			// 清除搜索结果
			self.set('search_result', null)
			// 清除其它项目选中
			self.set('types.*.checked', '')
			// 设置自身选中
			self.set(e.keypath + '.checked', true)

			var subTypes = e.context.child || []
			// 设置子类第一项选中（如果有才设置）
			subTypes.length && self.set(e.keypath + '.child.0.checked', true)
			self.set('subTypes', subTypes)

			// 自动加载第一个小类的全部叶子节点
			var subTypeVal = subTypes[0] && subTypes[0].value
			if (subTypeVal) {
				self.fire('showItems', {
					keypath: 'subTypes.0',
					context: subTypes[0]
				})
			} else {
				// 没有子类清空叶子
				self.set('items', [])
			}
		})

		// ajax获取叶子节点
		self.on('showItems', function(e) {
			// 清除其它小类选中状态
			self.set('subTypes.*.checked', '')
			self.set(e.keypath + '.checked', true)

			// 如果已经获取过叶子元素，则直接操作
			if (e.context.child && e.context.child.length) {
				self.set('items', e.context.child)
				// 这里不需要再次syncItemsStatus(self)同步状态，因为没有异步操作，状态在types中保存了
			} else {
				$.get(this.get('itemsUrl'), {
					id: e.context.value
				}).then(function(json) {
					json = json ? json.content : []
					self.set(e.keypath + '.child', json)
					self.set('items', json)

					syncItemsStatus(self)
				}).fail(error)
			}
		})

		// 更改叶子选中状态
		self.on('toggleStatus', function(e) {
			self.toggle(e.keypath + '.checked')
		})

		// 删除直接重新请求
		self.on('removeFromSelected', function(e, i) {
			// items可能为空
			var index = _.findIndex(self.get('items'), {value: e.context.value})
			index > -1 && self.set('items.' + index + '.checked', false)

			self.set(e.keypath + '.checked', false)
			self.get('selected').splice(i, 1)

			updateLocalStorage(self)

			self.fire('save', e)
		})

		var timer
		// 手动查询
		self.on('search', function(e) {
			if (timer) clearTimeout(timer)

			timer = setTimeout(function() {
				var keyword = self.get('keyword')
				if (!keyword) {
					var searching = self.get('search_result') !== null

					// 如果还处于搜索状态则清除启动默认状态，如果不处于则不做任何事
					searching && self.fire('showSubMenus', {
						keypath: 'types.0',
						context: self.get('types')[0]
					})
					return
				}

				$.post(self.get('searchUrl'), {
					key: keyword.trim()
				}).then(function(json) {
					// 搜索结果并不一定属于单个大类或小类，所以清除大类小类的选中状态
					self.set('types.*.checked', '')
					self.set('subTypes.*.checked', '')
					self.set('search_result', json ? json.content : [])
				}).fail(error)
			}, 250)
		})

		// 点击搜索结果直接同步到types
		self.on('syncSearchItemClick', function(e) {
			self.toggle(e.keypath + '.checked')
			var status = self.get(e.keypath + '.checked')

			loopTypes(self.get('types'), function(item, i, j, k) {
				if (item.value === e.context.value) {
					var keypath = ['types', i, 'child', j, 'child', k].join('.')
					self.set(keypath + '.checked', status)
				}
			})
		})
	}

	var widget = Ractive.extend({
		template: tmpl.res_filter,
		isolated: true,
		data: {
			search_result: null,
			loopTypes: loopTypes,
			useLocalStorage: true,
			left: 0,
			width: 550
		},
		onrender: function() {
			var self = this
			var error = ajaxErrorHandler(self)
			// 动态后缀，每个appid使用不同的后缀，避免共享json
			var suffix = self.get('suffix')
			if (suffix) {
				SUFFIX.json = '_json_' + suffix
			}

			/**
			 * “记住所选”功能会向本地存储写2个key，一个是数据项，一个是设置项目
			 * 组件默认使用本地存储，所以要弃用需要设置本地存储值为0，其它设置都表示使用本地存储
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

			// 打开面板
			self.on('openPanel', function(e) {
				if (this.get('isOpen')) return

				autoAdjust(self, e.node)

				self.set('isOpen', true)
				var json = self.get('types') || []
				if (!json.length) return

				self.fire('showSubMenus', {
					keypath: 'types.0',
					context: json[0]
				})
			})

			// 关闭面板
			self.on('closePanel', function() {
				this.set('isOpen', false)
			})

			self.on('savePanel', function(e) {
				var selected = []
				var types = self.get('types')
				loopTypes(types, function(item, i, j, k) {
					if (self.get(['types', i, 'child', j, 'child', k].join('.')).checked) {
						selected.push(item)
					}
				})

				self.set('keyword', '')
				self.set('selected', selected)
				self.set('isOpen', false)

				updateLocalStorage(self)

				self.fire('save', e)
			})

			self.on('save', function(e) {})

			// 先获取大类小类数据，再打开不会再次请求
			$.get(self.get('typesUrl')).then(function(json) {
				self.set('types', json ? json.content : [])

				initialize(self, error)
			}).fail(error)
		}
	})

	widget.prototype.getSelectedItems = function() {
		var data = this.get()
		// 资源大类小类的数据绑定在types属性上
		var list = []
		// 记住选择，面板还没有打开，types没有数据
		if (!data.types || !data.types.length) {
			_.each(data.selected, function(item) {
				list.push(item)
			})

			return list
		}

		loopTypes(data.types, function(item) {
			if (item.checked) {
				list.push(item)
			}
		})

		return list
	}

	Ractive.components.resfilter = widget

	return widget
})
