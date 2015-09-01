<%@ page language="java" contentType="text/html; charset=utf-8"%>
<div class="content-head clearfix">
	<filter start="{{dStart}}" end="{{dEnd}}" max="{{dMax}}" min="{{dMin}}" today="{{dToday}}"
		disableResource="1" suffix="{{suffix}}" disableApp="1" urlSettings="{{filterSettings}}" />
</div>

<div class="content-body">
	<div class="model">
		<h3 class="model-head">
			用户留存
			<ul class="nav nav-tabs nav-tabs-head pull-right">
			  	<li role="presentation">
			  		<download id="download" />
			  	</li>
			</ul>
			<span class="help-map">
				<i class="fa fa-question-circle"
					decorator="popover:{{getIndexInfo()}}"></i>
			</span>
		</h3>
		<div class="model-body">
			<div class="row">
				<div class="col-md-4">
					留存定义 : 				
					在后续统计周期内至少进入游戏
					<dropdown id="main" items="{{timesList}}" value="{{times}}" />
				</div>
				<div class="col-md-4 text-center">
					统计周期 :
					<dropdown id="main" items="{{days}}" value="{{day}}" />
				</div>
				<div class="col-md-4 text-right">
					<dropdown id="main" items="{{types}}" value="{{type}}" />				
				</div>
			</div>
			{{#ajaxError}}
				<div class="rerror text-center">
					<i class="fa fa-exclamation-circle"></i>
					<div>
						请求出错，请稍后重试 <br>
						({{statusCode}}:{{content || '网络连接错误'}} - {{id}})
					</div>
				</div>
			{{else}}
			{{#if datalist}}
			{{#if datalist.length > 0}}
			<table class="table-single">
				<thead>
					<tr>
						<th width="{{day === 'day' ? '10%' : '16%'}}" rowspan="2">样本周期</th>
						<th width="{{day === 'day' ? '8%' : '10%'}}" rowspan="2">
						<dropdown id="player" group="filter" items="{{players}}" value="{{player}}" />
						</th>
						<th class="no-padding">
							{{#if start !== 0 && day === 'day'}}
							<a class="label label-primary label-slide"
								href="javascript:;" on-click="switchPage:-1">
								<i class="fa fa-caret-left"></i>
							</a>
							{{else}}
							<span class="label label-gray label-slide">
								<i class="fa fa-caret-left gray"></i>
							</span>
							{{/if}}
						</th>
						{{#theadTitles}}
							<th width="{{tabName === 'day' ? '8%' : '8%'}}" class="bhead">
								+{{.}}
								{{day === 'day' ? '日' : ''}}
								{{day === 'week' ? '周' : ''}}
								{{day === 'month' ? '月' : ''}}
							</th>
						{{/theadTitles}}
						<th class="no-padding">
							{{#if end !== numFun(datalist[0]).length - 1 && end < numFun(datalist[0]).length - 2 && day === 'day'}}
							<a class="label label-primary label-slide"
								href="javascript:;" on-click="switchPage:1">
								<i class="fa fa-caret-right"></i>
							</a>
							{{else}}
							<span class="label label-gray label-slide">
								<i class="fa fa-caret-right gray"></i>
							</span>
							{{/if}}
						</th>
					</tr>
				</thead>
				<tbody>
					{{#datalist:j}}
						<tr>
							<td>{{x}}</td>
							<td>{{y0}}</td>
							{{#numFun(datalist[j]):i}}
							{{#if i >= (start + offset - 1) && i < (end + offset - 1)}}
								<td colspan="{{i == (start + offset - 1) ? 2 : (i == (end + offset - 1 - 1) ? 2 : '')}}">
								{{type == 'rate' ? datalist[j][.] ? formatPercentage(datalist[j][.]) : '' : datalist[j][.]}}
								</td>
							{{/if}}
							{{/}}
						</tr>
					{{/datalist}}
				</tbody>
			</table>
			{{else}}
			<div class="rempty text-center">
				<i class="fa fa-exclamation-circle"></i>
				<div>查询结果为空</div>
			</div>
			{{/if}}
			{{else}}
			<div class="rloading text-center">
				<i class="fa fa-spinner fa-pulse"></i>
				<div>正在加载，请稍候...</div>
			</div>
			{{/if}}
			{{/if}}
		</div>
	</div>
</div>
