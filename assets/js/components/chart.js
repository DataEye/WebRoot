/**
 * highcharts图表封装组件
 * panel中有用到
 *
 * Example:
 *
 * <chart type="line"
 *  xAxisFormatter="{{func}}" // X轴value格式化函数
 *  yAxisFormatter="{{func}}" // Y轴value格式化函数，只能返回数字
 *  yAxisSymbols="%,,%" // Y轴附加单位
 *  yAxisRightIndexes="0,3" // 双Y轴，分布在右侧的线条索引
 *  types="[]"  // 各个曲线的类型
 *  titleFormatter="{{func}}" //曲线名称格式化函数
 *  dashStyle="solid"
 *  colors="#ddd,#eee,#ddd" // 各个曲线的颜色
 *  stacking="normal"
 *  group.0.index="0,1" // 控制索引项目分组，如果不确定的列可以不填
 *  group.0.tipsValue.0.name="t0"
 *  group.0.tipsValue.0.suffix="funcStr" // 格式化的函数，加%等
 *  group.1.suffix="formatPercentage"
 *  data="getFormData" // 获取额外数据（POST）
 *  >
 *
 * </chart>
 */
define([
  'ractive', 'charts', 'jquery', 'lodash', 'utils'
], function (Ractive, Charts, $, _, utils) {
  var drawUtils = {
    // 曲线和柱状图只有types不同，其他配置一模一样（包括数据）
    drawLine: function () {
      var options = this.get()
      var json = this.get('json')
      var root = this.root
      var chart = this
      // json.name存储各个字段的名称
      //  找到在Y轴显示的key
      var yAxisKeys = _.keys(json.name).sort().filter(function (i) { return i[0] === 'y' })
      var symbols = options.yAxisSymbols && options.yAxisSymbols.split(',')

      var param = {
        id: this.find('.model-chart'),
        // 数据内容
        data: {
          // X轴数据，一维数组
          xAxisList: _.map(json.content, function (item) {
            var formatter = options.xAxisFormatter ? options.xAxisFormatter :
              (/^\d{8,8}$/.test(item.x) && options.formatShortDate)
            if (typeof formatter === 'string') {
              formatter = root.get(formatter)
            }

            return {
              text: formatter ? formatter(item.x) : item.x,
              custom: item
            }
          }),
          // Y轴数据
          yAxisList: _.map(yAxisKeys, function (key, i) {
            return _.map(json.content, function (row) {
              var value = symbols && symbols[i] === '%' ? Number((row[key] * 100).toFixed(2)) : row[key]
              return options.yAxisFormatter ? options.yAxisFormatter(value) : value
            })
          })
        },
        // 各个曲线的名称
        titles: _.map(yAxisKeys, function (key) {
			var formatter = options.titleFormatter 
            if (typeof formatter === 'string') {
				formatter = root.get(formatter)
            }
			return formatter ? formatter(json.name[key]) : json.name[key] 
		}),
        // 各个曲线的线条类型
        types: options.types ? options.types.split(',') : ['areaspline'],
        dashStyle: options.dashStyle || 'solid',
        colors: options.colors && options.colors.split(','),
        yAxisRightIndexes: options.yAxisRightIndexes && String(options.yAxisRightIndexes).split(',').map(function (i) { return parseInt(i) }),
        // Y轴和tooltip附加的单位，比如%
        symbols: symbols
      }

      // 百分后缀，可以传入函数或者字符串去根节点找函数
      if (options.suffix) {
        param.suffix = _.isFunction(options.suffix) ? options.suffix : root.get(options.suffix)
      }

      // 图表点击事件
      if (options.switchVar) {
        param.events = function (e) {
          var app = chart.root
          // 主面板
          var parentPanel = chart.parent
          // 子面板的ID
          var panelID = options.switchVar || options.childID
          var node = _.find(e.path, function (i) { return i.tagName.toUpperCase() == 'SVG' })
          var left = $(node).find('g.highcharts-axis>path[visibility="visible"]').offset().left
          var custom = JSON.parse($(e.point.category).attr('data-custom') || '{}')

          var info = {
            left: e.point.clientX + (left - $(node).offset().left),
            title: $(e.point.category).attr('title'),
            parentTabName: parentPanel.get('tabName'),
            parentSubTabName: parentPanel.get('subTabName')
          }

          // 先展示子面板
          root.set(options.switchVar, info)
          var subPanel = utils.findRactiveComponent(app, 'panel', { id: panelID })
          if (!subPanel) {
            console.warn('点击展开的面板未找到')
            return
          }
          
          // 根据主面板的tabName找到对应的子面板
          // 如果只有一个子面板则始终使用这个子面板
          var subTabs = subPanel.get('tabs')
          var subTabName = info.parentTabName
          var subTab = _.find(subTabs, { name: subTabName })
          if (!subTab) {
            subTab = subTabs[0]
            subTabName = subTab.name
          }

          custom.parentTabName = info.parentTabName
          custom.parentSubTabName = info.parentSubTabName
          // 将主面板节点信息存储到子面板字段中
          subPanel.set('parentInfo', custom)
          subPanel.fire('viewTab', e, subTabName)
        }
      }

      // 柱状图纵向分组
      if (options.group) {
        param.group = []
        // 当总列不固定，但是只能确定少数列固定
        var autoFillIndex = -1
        // 已经明确指定的index
        var filled = []
         
        _.each(options.group, function (row, i) {
          var setting = {
            name: 'group' + i,
            tipsValue: [],
            // 传递函数
            suffix: row.suffix && root.get(row.suffix)
          }
          // 明确指定index，如果没有明确指定需要计算
          if (row.index || row.index === 0) {
            setting.index = String(row.index).split(',').map(function (item) {
              filled.push(item)
              return parseInt(item)
            })
          } else {
            autoFillIndex = i
          }

          _.each(row.tipsValue, function (item) {
            // t0 => json.name.t0
            setting.tipsValue.push({
              name: json.name[item.name],
              suffix: item.suffix && root.get(item.suffix),
              indexName: item.name
            })
          })

          param.group.push(setting)
        })

        // 只有一列未知
        if (autoFillIndex > -1) {
          var indexes = []
          _.keys(json.content[0]).forEach(function (key) {
            if (key.indexOf('y') > -1) {
              var indexStr = key.replace('y', '')
              if (filled.indexOf(indexStr) === -1) {
                indexes.push(parseInt(indexStr))
              }
            }
          })

          param.group[autoFillIndex].index = indexes
        }
      }

      // 堆叠
      if (options.stacking) {
        param.stacking = options.stacking
      }
      Charts.drawLine(param)
    },
	//饼图
    drawPie: function () {
		var options = this.get()
		var chart = this
		var root = this.root
		var json = this.get('json')
		var list = _.map(json.content, function (item) {
			var obj = {
				name: item.x,
				y: item.y0				
			}
			// 图表点击事件
			if (options.switchVar){
				obj.events = {
					click:function (e) {
						var app = chart.root
						// 主面板
						var parentPanel = chart.parent
						// 子面板的ID
						var panelID = options.switchVar || options.childID						
						var custom = JSON.parse($(e.point.category).attr('data-custom') || '{}')

						var info = {
							title: $(e.point.category).attr('title'),
							parentTabName: parentPanel.get('tabName'),
							parentSubTabName: parentPanel.get('subTabName')
						}

						// 先展示子面板
						root.set(options.switchVar, info)
						var subPanel = utils.findRactiveComponent(app, 'panel', { id: panelID })
						if (!subPanel) {
							console.warn('点击展开的面板未找到')
							return
						}
					  
						// 根据主面板的tabName找到对应的子面板
						// 如果只有一个子面板则始终使用这个子面板
						var subTabs = subPanel.get('tabs')
						var subTabName = info.parentTabName
						var subTab = _.find(subTabs, { name: subTabName })
						if (!subTab) {
							subTab = subTabs[0]
							subTabName = subTab.name
						}

						custom.parentTabName = info.parentTabName
						custom.parentSubTabName = info.parentSubTabName
						// 将主面板节点信息存储到子面板字段中
						subPanel.set('parentInfo', custom)
						subPanel.fire('viewTab', e, subTabName)
					}
				}
			}
			return obj
		})
		
		var param = {
			id: this.find('.model-chart'),
			data: list
		}

		Charts.drawPie(param)
    }
  }

  var Chart = Ractive.extend({
    template: '<div class="model-chart"></div>',
    isolated: true,
    onrender: function () {
      this.on('draw', function (noWarn) {
        var type = this.get('type')
        if (!type) {
          !noWarn && console.warn('还没有设置chart.type')
          return
        }

        var method = 'draw' + type[0].toUpperCase() + type.slice(1)
        if (!Charts[method]) return

        var json = this.get('json')
        if (!json || _.isEmpty(json.name)) {
          // TODO 数据为空的其他处理
          console.log('数据为空')
          return
        }

        // 进入这里肯定是有数据了
        drawUtils[method].apply(this, arguments)
      })

      // 初始化没有设置type的时候不执行warn
      this.fire('draw', true)
    }
  })

  Ractive.components.chart = Chart

  return Chart
})
