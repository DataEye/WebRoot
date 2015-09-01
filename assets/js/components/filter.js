/**
 * 组合筛选
 */
define([
	'jquery', 'ractive', 'moment', 'tmpl', 'lodash', 'components/dialog-resize', 
	'components/multi-select', 'components/res-filter', 'components/calendar'
], function($, Ractive, moment, tmpl, _) {
	var MS_IN_DAY = 3600 * 1000 * 24
	
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

	// 判断当前日期属于今天还是昨天，-1表示全部（创建时间到今天）
	function detectDaysGap() {
		var start = Date.parse(this.get('start'))
		var end = Date.parse(this.get('end'))
		var today = this.get('today')
		var max = Date.parse(this.get('max') || today)
		var min = Date.parse(this.get('min'))

		var days = (end- start) / MS_IN_DAY

		if (this.get('end') === today && [0, 1, 7, 30].indexOf(days) > -1) return days

		if (start === min && end === max) return -1
	}

	// 设置默认值, 最大日期为今天
	function defaults(self) {
		var data = self.get()
		var today = moment().format('YYYY-MM-DD')

		if (!data.today) {
			self.set('today', today)
		}
		if (!data.max) {
			self.set('max', today)
		}
	}

	// 2015-03-12 => 20150312
	function transformDate(date) {
		return date ? moment(date).format('YYYYMMDD') : ''
	}

	var widget = Ractive.extend({
		template: tmpl.filter,
		isolated: true,
		data: {
			collapsed: true,
			detectDaysGap: detectDaysGap,
			// 默认不展示app
			disableApp: true
		},
		oninit: function() {
			var self = this
			defaults(self)
			
			//切换筛选条件
			self.on('filterName', function(e, filterName){
				self.set('filterName', filterName)
				
			})
			//请求筛选接口
			var urls = []
			var keys = []
			for(key in self.get('urlSettings')){
				keys.push(key.replace('Url', ''))
				urls.push($.ajax(self.get('urlSettings')[key]))
			}
			$.when.apply($, urls).done(function(){
				self.set('ajaxError', null)
				$.each(arguments, function(i, item){
					var filter = findRactiveComponent(self, 'multiselect', {id: keys[i]})					
					filter && filter.set('items', item[0] ? item[0].content : [])						
					// 同步元素选中状态
					var items = self.get('items') || []
					var selected = self.get('selected') || []

					_.each(selected, function(item) {
						var i = _.findIndex(items, {value: item.value})
						i !== -1 && self.set('items.' + i + '.checked', true)
					})
				})
			}).fail(function(xhr) {
				self.set('ajaxError', wrapError(xhr))
			})
			self.fire('filterName', {}, 'channel')
			
			//展开筛选面板
			self.on('toggleExpand', function(e) {
				self.toggle('collapsed')
			})
			
			//关闭筛选结果
			self.on('closeResult', function(e) {
				self.set('list', [])
				_.each(self.findAllComponents('multiselect'), function(plugin) {
					var selected = _.filter(plugin.get('items'), {checked: true})
					_.each(selected, function(item){
						item.checked = false
					})
					plugin.set('items', plugin.get('items'))
				})
				self.fire('save', e, self.getParams())
			})
			
			// 修改日期
			self.on('changeDate', function(e, days) {
				var today = Date.parse(self.get('today'))
				var start = moment(today - days * MS_IN_DAY).format('YYYY-MM-DD')
				self.set('start', days === -1 ? self.get('min') : start)
				self.set('end', moment(today).format('YYYY-MM-DD'))

				// 只触发当前日历控件的save事件
				var calendarID = self.get('collapsed') ? 'outside' : 'inside'
				var calendar = self.findComponent('calendar', {id: calendarID})
				calendar.fire('save')
			})

			/**
			 * Ractive组件的事件触发机制比较诡异
			 * 这里的事件触发顺序是filter#save，然后是ractive#save最后是components(multiselect)#save
			 * 也就一级组件 > Ractive实例 > 一级组件的内部组件
			 */
			self.on('save', function(e, params) {
				//TODO 未来这里要干掉，params从外部传进来
				if (!params || _.keys(params).length) return
				// 这里不能对params直接赋值，只能extend扩展属性才能传递给上层
				$.extend(params, self.getParams())
			})			
			
			// 保存
			self.on('savePanel', function(e) {
				var list = []
				_.each(self.findAllComponents('multiselect'), function(plugin) {
					var selected = _.filter(plugin.get('items'), {checked: true})
					_.each(selected, function(item){
						item.id = plugin.get().id
					})
					if(selected.length > 0){
						list.push({
							title: plugin.get().title,
							id: plugin.get().id,
							selected: selected
						})
					}
				})
				self.set('list', list)
				self.set('collapsed', true)
				//updateLocalStorage(self)
				self.fire('save', e, self.getParams())
			})
			
			// 从已选中项目中删除
			self.on('removeFromSelected', function(e) {
				var item = _.find(self.get('list'), {id: e.context.id})				
				var sIndex = _.findIndex(item.selected, {value: e.context.value})
				
				item.selected.splice(sIndex, 1)				
				if(!item.selected.length > 0){
					var oIndex = _.findIndex(self.get('list'), item)
					self.get('list').splice(oIndex, 1)					
				}				
				var filter = findRactiveComponent(self, 'multiselect', {id: e.context.id})
				var iIndex = _.findIndex(filter.get('items'), {value: e.context.value})
				iIndex > -1 && filter.set('items.' + iIndex + '.checked', false)
				
				self.fire('save', e, self.getParams())
			})
			
			// 关闭面板
			self.on('closePanel', function() {
				self.set('collapsed', true)
			})

			_.each(self.findAllComponents(), function(app) {
				/**
				 * 这里的save事件优于component自身的save事件，所以selected属性无法得到
				 * 必须遍历原始数据获取值
				 */
				app.on('save', function(e) {
					self.fire('save', e, self.getParams())
				})

				// 绑定数据，方便展示筛选数目
				app.observe('selected', function(val) {
					self.set(app.get('id') + 'Items', val)
				}, {init: false})
			})
		}
	})

	/**
	 * 获取组件参数
	 * @returns {Object} 以component的name属性为key的对象
	 */
	widget.prototype.getParams = function() {
		var params = {}
		var list = []
		var self = this
		_.each(self.findAllComponents(), function(plugin) {
			var data = plugin.get()
			if (plugin.component.name === 'calendar') {
				params.startTime = transformDate(data.start)
				params.endTime = transformDate(data.end)
			} else if (plugin.component.name === 'resfilter'){
				// 资源大类小类的数据绑定在types属性上
				var total = 0
				// 记住选择，面板还没有打开，types没有数据
				if (!data.types || !data.types.length) {
					_.each(data.selected, function(item) {
						list.push(item.value)
					})

					params[data.name] = list.length === 0 ? -1 : list.join(',')
					return
				}

				data.loopTypes(data.types, function(item) {
					total += 1
					if (item.checked) {
						list.push(item.value)
					}
				})

				params[data.name] = (list.length === 0 || list.length === total) ? -1 : list.join(',')
			} else { // 渠道，国家，地区，版本
				// 全选传 -1
				var items = data.items || []
				var selected = data.selected || []
				var remembered = false
				// 如果使用的是上次记住，但是没有打开过面板则items是空的
				if (items.length === 0 && selected.length) {
					items = selected
					remembered = true
				}
				list = _.map(_.filter(items, {checked: true}), function(item) {
					return item.value
				})
				// 记住选择只需要判断选项为0即可
				if (remembered) {
					params[data.name] = list.length === 0 ? -1 : list.join(',')
					return
				}

				params[data.name] = (list.length === 0 || list.length === items.length) ? -1 : list.join(',')
			}
		})
		return params
	}

	Ractive.components.filter = widget

	return widget
})
