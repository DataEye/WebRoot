define(['jquery', 'lodash', 'spa', 'oss'], function($, _, spa, OSS) {
	var el = $('#side')
	var title = document.title

	OSS.defaults = {
		abortless: 1
	}

	OSS.flush()

	el.on('click', '.fa-angle-down', function(e) {
		e.stopPropagation()
		el.find('h3').removeClass('current')
		var h3 = $(this).parent()
		h3.addClass("current")
		// 打开自身的二级菜单，隐藏打开的二级菜单
		h3.next().slideDown(function() {
			$(this).addClass('menu-child-expanded')
		})
		el.find('.menu-child-expanded').slideUp(function() {
			$(this).removeClass('menu-child-expanded')
		})

		// 同步箭头状态
		$('.fa-angle-up').removeClass('fa-angle-up').addClass('fa-angle-down')
		$(this).removeClass('fa-angle-down').addClass('fa-angle-up')
	})

	el.on('click', '.fa-angle-up', function(e) {
		e.stopPropagation()
		var h3 = $(this).parent()
		el.find('h3').removeClass('current')
		// 隐藏自身的打开状态
		el.find('.menu-child-expanded').slideUp(function() {
			$(this).removeClass('menu-child-expanded')
		})
		// 同步箭头状态
		$(this).removeClass('fa-angle-up').addClass('fa-angle-down')
	})

	el.on('click', 'h3>a, li>a', function(e) {
		el.find('.current').removeClass('current')
		var self = $(this)
		var parent = self.parent()
		var text = self.text().trim()
		parent.addClass('current')

		document.title = text + ' - ' + title

		// 如果父节点是一级菜单则，隐藏打开的二级菜单，同步箭头状态
		if (parent.is('h3')) {
			// 移除当前选中项目，选中自己的父节点
			$('.menu-child-expanded').slideUp(function() {
				$(this).removeClass('menu-child-expanded')
			})
			$('.fa-angle-up').removeClass('fa-angle-up').addClass('fa-angle-down')
		} else {
			// 如果是li下面的a则选中上级菜单
			parent.parents('.menu-child-list').prev().addClass('current')
		}

		OSS.send({
			name: text,
			path: self.attr('href').slice(1) || App.defaultRoute
		})
	})

	// 点击普遍标签时触发展开或折叠箭头的事件
	el.on('click', 'h3', function(e) {
		$(this).find('.fa-angle-up, .fa-angle-down').trigger('click')
	})

	~function locateMenu() {
		// 如果有查询字符串则忽略
		var hash = location.hash.split('?')[0]
		var node = el.find('a[href="' + hash + '"]')
		// 当前页面不能够对应到菜单，属于当前菜单的子页面，通过url层级关系来关联。
		// 比如/function/event/detail需要对应到/function/event
		if (!node.length) {
			var segments = hash.split('/')
			segments.pop()
			while (segments.length > 1) {
				node = el.find('a[href="' + segments.join('/') + '"]')
				if (node.length) {
					break
				} else {
					segments.pop()
				}
			}
		}

		document.title = node.text().trim() + ' - ' + title

		node = node.eq(0).parent().addClass('current')
		if (node.is('li')) {
			var container = node.parents('.menu-child-list')
			container.slideDown(function() {
				$(this).addClass('menu-child-expanded').prev().addClass('current')
			})
		}
	}()

	// 给最后一个一级菜单加样式
	el.find('h3').last().addClass('menu-list-last')

	/**
	 * 需要避免被abort
	 */
	$('#menu').one('mouseenter', function loadProductList() {
		$.post(App.contextPath + '/gamecenter/getGameCenterList.do', {userID: App.user.userID}).then(function(json) {
			json = json ? json.content : []
			var id = 'appList' + Date.now()
			var html = '<div id="' + id + '" class="dropdown-menu app-list">'
			html += '<div class="dropdown-menu-search"> <input type="text" class="form-control"> </div>'
			html += '<ul><li><a href="./home.jsp">全部应用</a>'
			_.each(json, function(item) {
				var className = location.href.indexOf(item.appID) > -1 ? ' current ' : ' '
				html += '<li class="app-list-item ' + className + '"><a href="./main.jsp?appID=' + item.appID + '">' +
					item.appName + '</a></li>'
			})
			html += '</ul><a class="btn btn-dropdown" href="./create_app.jsp"> <i class="fa fa-plus-circle"></i> 创建应用</a></div>'
			$('body').append(html)

			$('#appCenter').on('click', function(e){
				e.stopPropagation()
				$(this).addClass('hover')
				$('#' + id).css({
					left: $(this).offset().left
				}).show()
			})

			$('body').on('click', function() {
				$('#' + id).hide()
				$('#appCenter').removeClass('hover')
			})

			var timer
			$('#' + id).on('click', function(e) {
				e.stopPropagation()
			}).find('.app-list-item>a').on('click', function(e) {
				// 切换APPID之后，回到当前模块
				location.href = $(this).attr('href') + location.hash
				return false
			}).end().find('.dropdown-menu-search input').on('keyup', function(e) {
				var self = this
				if (timer)
					clearTimeout(timer)

				timer = setTimeout(function() {
					var keyword = self.value.trim()
					if (!keyword) {
						$('#' + id + ' li').show()
						return
					}

					$('#' + id + ' li').each(function(t, i) {
						var show = $(this).text().indexOf(keyword) > -1
						if (i === 0 || !show) {
							$(this).hide()
							return
						}

						$(this).show()
					})
				})
			})
		})
	})
})
