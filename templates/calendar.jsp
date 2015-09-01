<%@ page language="java" contentType="text/html; charset=utf-8"%>
<div class="de-calendar"
	decorator="cleanmenu:{{id? 'calendar' + id : 'calendar'}}, 'show'">
	<span class="btn-group {{show ? 'open' : ''}}">
		<span class="form-control dropdown-toggle" on-click="openPanel" style="cursor: pointer;">
			<i class="fa fa-calendar"></i>
			<span class="de-calendar-text">{{start}}
			{{#isRange}}
				~ {{end}}
			{{/}}
			</span>
		</span>
	</span>

	{{#show}}
	<div class="de-calendar-container {{next ? 'de-calendar-range':''}}">
		<div class="de-calendar-current">
			<table class="table">
				<thead>
					<tr>
						<td>
							<a href="javascript:;"><i class="fa fa-backward" on-click="goto:-1"></i></a>
						</td>
						<td colspan="5" style="text-align: center;">{{currentYear}}-{{currentMonth}}</td>
						{{^next}}
						<td>
							<a href="javascript:;"><i class="fa fa-forward" on-click="goto:1"></i></a>
						</td>
						{{/next}}
					</tr>
				</thead>
				<tbody>
					<tr class="de-calendar-week">
						<td>一</td>
						<td>二</td>
						<td>三</td>
						<td>四</td>
						<td>五</td>
						<td>六</td>
						<td>日</td>
					</tr>
					{{#current}}
						<tr>
							{{#.}}
								{{#if .month == currentMonth}}
									{{#if disabled}}
										<td title="{{getHoverTip(distance, '天前', '天后')}}"
											class="day unselectable">
											<div>{{.date}}</div>
										</td>
									{{else}}
										<td class="day {{.selected}} {{.hovered}}"
											title="{{getHoverTip(distance, '天前', '天后')}}"
											on-click="choose" on-mouseenter="hover">
											<div>{{.date}}</div>
										</td>
									{{/if}}
								{{/if}}

								{{#if .month !== currentMonth}}
								<td class="day"></td>
								{{/if}}
							{{/}}
						</tr>
					{{/current}}
				</tbody>
			</table>
		</div>

		{{^isRange}}
		<div class="clearfix"></div>
		{{/}}

		{{#if next}}
		<div class="de-calendar-next">
			<table class="table">
				<thead>
					<tr>
						<td></td>
						<td colspan="5" style="text-align: center;">{{nextYear}}-{{nextMonth}}</td>
						<td>
							<a href="javascript:;"><i class="fa fa-forward" on-click="goto:1"></i></a>
						</td>
					</tr>
				</thead>
				<tbody>
					<tr class="de-calendar-week">
						<td>一</td>
						<td>二</td>
						<td>三</td>
						<td>四</td>
						<td>五</td>
						<td>六</td>
						<td>日</td>
					</tr>
					{{#next}}
						<tr>
							{{#.}}
								{{#if .month == nextMonth}}
									{{#disabled}}
										<td title="{{getHoverTip(distance, '天前', '天后')}}"
											class="day unselectable">
											<div>{{.date}}</div>
										</td>
									{{else}}
										<td title="{{getHoverTip(distance, '天前', '天后')}}"
											class="day {{.selected}} {{.hovered}}"
											on-click="choose"
											on-mouseenter="hover">
											<div>{{.date}}</div>
										</td>
									{{/disabled}}
								{{/if}}

								{{#if .month !== nextMonth}}
								<td class="day"></td>
								{{/if}}
							{{/}}
						</tr>
					{{/next}}
				</tbody>
			</table>
		</div>

		<div class="clearfix"></div>
		{{/if}}

		{{#if !autoSubmit}}
		<div class="de-calendar-footer">
			<div class="de-calendar-input">
				<span class="form-control">{{format(startDate)}}</span>
				~
				<span class="form-control">{{format(endDate)}}</span>
			</div>

			<div class="de-calendar-btns">
				<div class="btn-group">
					<a href="javascript:;" class="btn btn-zs btn-primary" on-click="savePanel">
						确定
					</a>
					<a href="javascript:;" class="btn btn-zs btn-default" on-click="closePanel">
						关闭
					</a>
				</div>
			</div>

			<div class="clearfix"></div>
		</div>
		{{/if}}

	</div>
	{{/}}
</div>
