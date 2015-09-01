/**
 * 封装的图表组件，基于Highcharts
 */
(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery', 'highcharts', 'highcharts-3d'], factory)
	} else if (typeof module !== 'undefined' && typeof exports === 'object'){
		module.exports = factory(require('jquery'), require('highcharts'), require('highcharts-3d'))
	} else {
		window.Charts = factory(root.jQuery, root.Highcharts)
	}
})(this, function($, Highcharts) {
	Highcharts.setOptions({
	    colors: [
	    	'#4da1ff', '#f4533c', '#ffae00', '#1aba9b', '#e552b0', '#af6bcb', '#9aab4f', '#6673d1', '#3ebb43',
			'#2c81e1', '#dd4544', '#e49518', '#0c967b', '#bd3998', '#944cb2', '#7b8d43', '#4e5ab0', '#299e2e',
			'#1665bd', '#bd3b47', '#d97707', '#06715d', '#8f2e73', '#7b3499', '#69821c', '#4a498f', '#18851d'
	    ]
	})

	var GraphicBasic = {
		funLeft: function(symbol){
			return function(){
				var unit = "";
				if(symbol){
	    			unit = symbol;
	    		}
				if(this.value >= 10000){
					return (this.value)/10000 +  "万" + unit;
				}else if(this.value >= 100000000){
					return (this.value)/100000000 + "亿" + unit;
				}else{
					return this.value + symbol;
				}
			}
		},
		tooltip: function(param){
			return function() {
				var data = this.points || [this.point]
				var groups = param.group || []
				//自定数据(不需画图的数据)
				var custom = $(data[0].category || data[0].x).attr('data-custom') ? JSON.parse($(data[0].category || data[0].x).attr('data-custom')) : {}
				//重组points				
				var indexs = []
				_.each(groups, function(group){
					var index = group.index[(group.index.length - 1)] + 1
					indexs.push(index) 
				})
				
				var arrays = []
				var j = 0
				_.each(indexs, function(index){
					arrays.push(data.slice(j, index))
					j = j + index
				})
				
				_.each(arrays, function(array, i){					
					if(groups[i].tipsValue){
						_.each(groups[i].tipsValue, function(item){
							var obj = {
								'series': {
									'name': item.name,
									'stackKey': 'column' + groups[i].name
								}, 
								'y': item.suffix ? item.suffix(custom[item.indexName]) : custom[item.indexName]
							}
							array.splice(indexs[i], 0, obj)
						})
					}
				})
				
				var points = arrays.length > 0 ? arrays : [data]
				var num = points.length > 1 ? points.length : 0
				var total = 0;
				var dataList = []				
				_.each(points, function(point){
					total = total + point.length
				})
				
				_.each(points, function(point){
					var n = point.length					
					var percent = []
					//数据后缀
					if(param.suffix){
						var keys = _.keys(custom).sort().filter(function(i) {return i[0] === 'z'})
						_.each(keys, function(key){
							percent.push(' (' + param.suffix(custom[key]) + ')')
						})				
					}
					var list = [];
					if(total > 5){
						list.push('<ul class="tip-list">')
					}
					for(var i = 0; i < n; i++){
						var obj = {};
						obj.name = point[i].series.name || ''
						obj.color = point[i].series.color || ''
						obj.type = point[i].series.type || 'empty'
						obj.value = point[i].y + (percent[i] ? percent[i] : '')
						//分组后的数据后缀
						var group = point[i].series.stackKey
						_.each(param.group, function(item){						
							if(item.suffix){
								if(group.replace('column', '') == item.name){
									obj.value = point[i].y + (percent[i] ? percent[i] : '');
								}else{
									obj.value = point[i].y;
								}
							}
						})
						//数据单位(默认无)
						if(param.symbols){
							obj.value = point[i].y + param.symbols[i] + (percent[i] ? percent[i] : '');
						}
						list.push(
							'<li><span class="pull-right">' + obj.value + '</span>' +
							'<span style="background:' + obj.color + '" ' +
							'class="' + obj.type + '"></span>' + obj.name + ':</li>'
						)
						//每列不得超过5个
						if((i + 1)%5 == 0 && n != 5){
							list.push('</ul><ul class="tip-list">')
						}
					}
					if(n / 5 > 1){
						num = num + Math.ceil(n / 5)
					}
					if(total > 5){
						list.push('</ul>')
					}
					dataList.push(list.join(''))
				})
				var html = total < 6 ? '<ul class="tip-list">' + dataList.join('') + '</ul>' : dataList.join('')
		    	return '<h5 class="tip-title">' + $(this.x).attr('title') + '</h5>' + 
						'<div class="tip-content tip-content-' + (total < 6 ? 1 : num) + '">' + html + '</div>'
				
			}
		}
	};
	//渲染曲线图
	/*
	 * @param id:                   图表需要绘制的容器 id
	 * @param data:                 图表使用的数据 {
											xAxisList:[{
												text: '0725',//X轴
												custom: {
													z: 0,
													t:0
												},//是否在X轴加入自定义属性
											}],//X轴显示内容
											yAxisList:[[0, 1, 2, 3], //数组元素类型为Number
												   [2, 5, 6, 7]]//y轴显示内容，每一个数据为一条曲线, 数组个数需与titles对应
										  }
	 * @param titles:               图表曲线名称 ['曲线1', '曲线2']
	 * @param types:                图表类型['area', 'line', 'areaspline', 'column', 'bar']
	 * @param symbols:              tooltip的符号['%', '%', '次'] //需要与titles对应
	 * @param special:              tooltips显示样式 special: function(){}
	 * @param suffix:               是否tooltips的后缀 suffix: utils.formatPercentage
	 * @param hideLine:             需要隐藏的曲线[0, 1] //需要与titles对应
	 * @param yAxisRightIndexes:    Y轴显示在右侧的数据[2]
	 * @param colors:               曲线色彩 [red, blue] //需要与titles对应
	 * @param dashStyle:            曲线样式String("Solid" //默认为实线
									"ShortDash"
									"ShortDot"
									"ShortDashDot"
									"ShortDashDotDot"
									"Dot"
									"Dash"
									"LongDash"
									"DashDot"
									"LongDashDot"
									"LongDashDotDot")
	 * @param events                图表点击事件
	 * @param stacking:             启用堆叠(null:禁用; normal:绝对值; percent: 百分比)
	 * @param hideLegend:           是否隐藏图例(false：显示, true：隐藏, 默认显示)
	 * @param group:                分组[{
										index:[0, 1], //曲线0 和曲线1为同一组 
										suffix: utils.formatPercentage, //此组tooltips后缀
										name: name //组名
							            }](只有column才有)
	 */
	GraphicBasic.drawLine = function(param){
	    //xAxis数据
		var xAxisList = param.data.xAxisList;
		//曲线连接点是否显示(默认为不显示)
		var pointFlag = false;
		if(xAxisList.length == 1){
			//单日期曲线，显示曲线连接点
			pointFlag = true;
		}
		//xAxis步长
		var step = setStep(xAxisList);

		//图例开关(默认为打开)
		var legendFlag = true;
		if(param.hideLegend){
			legendFlag = false;
		}
		var axis = [];
		var seriesList = [];
		for(var i = 0; i < param.data.yAxisList.length; i++){
			//绘制曲线数据
			var obj = {};
			obj.data = param.data.yAxisList[i];
			obj.name = param.titles[i];
			obj.type = param.types[i];
			//图表点击事件
			if(param.events){
				obj.events = {
					click: param.events
				}
			}
			
			//分组
			if(param.group){
				$.each(param.group, function(j, item){
					if($.inArray(i, item.index) > -1){
						obj.stack = item.name
						return false
					}else{						
						obj.stack = item.name
					}
				})
			}
			
			//隐藏曲线(默认为显示)
			if(param.hideLine){
				if($.inArray(Number(i), param.hideLine) > -1){
					//设置隐藏的曲线
					obj.visible = false;
				}
			}
			//设置yAxis
			var objAxis = {
				title: {
					text: ''
				},
				min: 0,
				gridLineColor: '#E0E0E0',
				gridLineDashStyle: "Dash",
				labels: {
					formatter: this.funLeft(param.symbols ? param.symbols[i] : null)
				}
			};
			//自定义曲线色
			if(param.colors){
				obj.color = param.colors[i];
			}
			//指定坐标显示在右侧
			if(param.yAxisRightIndexes){
				if($.inArray(Number(i), param.yAxisRightIndexes) > -1){
					//设置隐藏的曲线
					objAxis.opposite = true;
					obj.yAxis = i;
				}
			}
			seriesList.push(obj);
			axis.push(objAxis);
		}
		//图表类型
		var chart = {
			type: param.types[0],
			backgroundColor: 'rgba(0,0,0,0)'
		};
		//tips特殊值
		var tooltipSpecial = this.tooltip(param)
		if(param.special){
			tooltipSpecial = param.special;
		}
		
		//构建图表
		$(typeof param.id === 'string' ? '#' + param.id : param.id).highcharts({
			chart: chart,
	        title: {
	            text: ''
	        },
	        legend: {
	        	borderWidth: 0,
				enabled: legendFlag,
				margin: 0,
				maxHeight: 50,
				itemStyle: {
					color: '#636A7C',
					fontWeight: 'normal'
				}
	        },
	        xAxis: {
	            categories: cutItem(xAxisList),//对xAxis数据重组(兼容xAxis item字符过长的问题)
				tickmarkPlacement: 1,
				gridLineColor: '#E8EBF2',
				gridLineWidth: 1,
				tickInterval: step,
	            labels: {
					maxStaggerLines: 1,//限定用多少行来显示轴轴标签自动地的避免某些标签的重叠。设置为1表示禁用重叠检测
	            	useHTML: true,
					style: {
						fontSize: 12
					}
				}
	        },
	        yAxis: axis,
	        tooltip: {
	        	shared: true,
	 			valueSuffix: '',
	 			borderRadius: 3,
				backgroundColor: 'rgba(41, 55, 69, 0.8)',
				borderColor: '#010202',
				borderRadius: 5,
				shadow: true,
				hideDelay: 10,//提示框隐藏延时。当鼠标移出图标后，数据提示框会在设定的延迟时间后消失。
	 			style: {
	 				color: '#FFFFFF'
	 			},
	 			crosshairs:{//控制十字线
	 	             width:1,
	 	             color:"#39B54A",
	 	             dashStyle:"shortdot"
	 	        },
	 	        useHTML: true,
		        formatter: tooltipSpecial
	        },
	        credits: {
	            enabled: false
	        },
	        plotOptions: {
	        	areaspline: {
			        fillOpacity: 0.08,
					lineWidth: 2,
					//shadow: true,//是否为曲线加阴影
					marker: {
						enabled: pointFlag,
						symbol: 'circle',
						radius: 3,
						fillColor: 'white',
						lineColor: null,
						lineWidth: 1
					}
	        	},
				area: {
					stacking: param.stacking, //是否启用堆叠
					fillOpacity: 0.7,
					lineWidth: 2,
					//shadow: true,//是否为曲线加阴影
					marker: {
						enabled: pointFlag,
						symbol: 'circle',
						radius: 3,
						fillColor: 'white',
						lineColor: null,
						lineWidth: 1
					}
				},				
				bar: {
	            	stacking: param.stacking,
	                dataLabels: {
	                    enabled: true
	                }
					//pointWidth: param.data.data.length > 2 ? null : 15
	            },
				column: {
					cursor: 'pointer',
					stacking: param.stacking
	            	//pointWidth: param.data.data.length > 2 ? null : 20
	            }
	        },
	        series: seriesList
		});
	}
	
	//渲染饼图
	/*
	 * @param id:          图表需要绘制的容器 id
	 * @param data:        图表使用的数据 Array[Array, Array]
	 */
	GraphicBasic.drawPie = function(param){
		//饼图显示个数限制为10个
		var valuelist = [];
		for(var i in param.data){
			valuelist.push(param.data[i]);
		}
		$(typeof param.id === 'string' ? '#' + param.id : param.id).highcharts({
			chart: {
				type: "pie"
			},
			title: {
				text: ''
			},
			tooltip: {
				borderRadius: 3,
				backgroundColor: 'rgba(41, 55, 69, 0.8)',
				borderColor: '#010202',
				borderRadius: 5,
				shadow: true,
	 			style: {
	 				color: '#FFFFFF'
	 			},
				formatter: function() {
					return '<b>'+ this.point.name +'</b>: '+
							(this.percentage).toFixed(2) +'%' +
							'(' + this.y + ')';
				},
				percentageDecimals: 1
			},
			legend: {
				borderWidth: 0,
				layout: 'vertical',
				verticalAlign: 'right',
				align: "right",
				x: -10,
				y: 0,
				itemMarginTop: 5,
				itemMarginBottom: 5,
				enabled: true
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					depth: 35,
					dataLabels: {
						enabled: true,
						color: '#000000',
						connectorColor: '#000000',
						formatter: function() {
							return '<b>'+ this.point.name +'</b>: ' +
									(this.percentage).toFixed(2) +' %';
						}
					},
					showInLegend: true
				}
			},
			credits: {
				enabled: false
			},
			series: [{
				innerSize: '50%',
				data: valuelist
			}]
		});
	}
	
	//判断xAxis item字符过长(判断基准是xAxis数量为5, item字符为10)
	function cutItem(data){
		var arr = [];
		for(var i = 0; i < data.length; i++){
			//储存自定义xAxis
			var custom = data[i].custom ? JSON.stringify(data[i].custom) : ''
			if(data.length > 5){				
				//转换汉字为英文,得出真正的字符长度
				var n = 0;
				for(var j = 0; j < data[i].text.length; j++){
					n = n + data[i].text[j].replace(/^[\u4E00-\u9FFF]/, "aa").length;
				}				
				if(n > 10){
					//item字符过长进行截取
					if(data[i].text.length == n){
						arr.push(
							"<em data-custom='" + custom + "' title='" + data[i].text +"'>" +
							data[i].text.slice(0,10) + "</em>" + "..."
						);
					}else if(data[i].text.length >= n/2){
						arr.push(
							"<em data-custom='" + custom + "' title='" + data[i].text +"'>" +
							data[i].text.slice(0,5) + "</em>" + "..."
						);
					}
				}else{
					arr.push(
						"<em data-custom='" + custom + "' title='" + data[i].text +"'>" + data[i].text + "</em>"
					);
				}
			}else{
				arr.push(
					"<em data-custom='" + custom + "' title='" + data[i].text +"'>" + data[i].text + "</em>"
				);
			}
		}
		return arr;
	}
	//设置步长(以12为基准)
	function setStep(data){
		var step = 1;
		if(data.length>12){
			if((data.length)%12 > 0){
				step = parseInt((data.length)/12) + 1;
			}else{
				step = parseInt((data.length)/12);
			}
		}
		return step;
	}
  
	return GraphicBasic
})
