<%@ page language="java" contentType="text/html; charset=utf-8"%>
<div class="clearfix">
	{{^disableCalendar}}
	<div class="btn-group de-calendar-group pull-left">
	
		{{^selected}}
		<calendar id="outside" start="{{start}}" name="filter" end="{{end}}" max="{{max}}" min="{{min}}" />
		{{/selected}}
		{{#selected}}
		<calendar selected={{selected}} autoSubmit="true" id="inside" name="filter" max="{{max}}" min="{{min}}" />
		{{/selected}}
		
		{{^selected}}
		<div class="de-calendar-quick" style="display: inline-block;">
			<a on-click="changeDate:0"  class="{{detectDaysGap() === 0 ? 'selected' : ''}}" href="javascript:;">今日</a>
			<a on-click="changeDate:1"  class="{{detectDaysGap() === 1 ? 'selected' : ''}}" href="javascript:;">昨日</a>
			<a on-click="changeDate:7"  class="{{detectDaysGap() === 7 ? 'selected' : ''}}" href="javascript:;">近7日</a>
			<a on-click="changeDate:30" class="{{detectDaysGap() === 30 ? 'selected' : ''}}" href="javascript:;">近30日</a>
			<a on-click="changeDate:-1" class="{{detectDaysGap() === -1 ? 'selected' : ''}}" href="javascript:;">全部</a>
		</div>
		{{/selected}}
	</div>
	{{/disableCalendar}}

	<div class="{{disableCalendar ? 'pull-left' : 'pull-right'}}">
		<div class="btn-group" on-click="toggleExpand">
			<a class="btn btn-default btn-lg">
				<i class="fa fa-filter"></i>
			</a>
			<a class="btn btn-default btn-lg">
				数据筛选
			</a>			
		</div>
	</div>
</div>
<div class="mask" style="visibility:{{collapsed ? 'hidden' : 'visible'}}">
	<div class="model model-dialog" decorator="dialogresize">
		<div class="model-head">
			数据筛选
			<a href="javascript:;" on-click="closePanel" class="fa fa-close-custom pull-right"></a>
		</div>
		{{^ajaxError}}
		<div class="model-body clearfix">
			<div class="btn-group">
				{{^disableChannel}}
				<a class="btn btn-{{filterName == 'channel' ? 'primary' : 'default'}}" on-click="filterName:channel">
					渠道
				</a>
				{{/disableChannel}}
				{{^disableGameRegion}}
				<a class="btn btn-{{filterName == 'region' ? 'primary' : 'default'}}" on-click="filterName:region">
					区服
				</a>
				{{/disableGameRegion}}
				{{^disableCountry}}
				<a class="btn btn-{{filterName == 'country' ? 'primary' : 'default'}}" on-click="filterName:country">
					国家
				</a>
				{{/disableCountry}}
				{{^disableArea}}
				<a class="btn btn-{{filterName == 'area' ? 'primary' : 'default'}}" on-click="filterName:area">
					地区
				</a>
				{{/disableArea}}
				{{^disableVersion}}
				<a class="btn btn-{{filterName == 'version' ? 'primary' : 'default'}}" on-click="filterName:version">
					版本
				</a>
				{{/disableVersion}}
				{{^disableResource}}
				<a class="btn btn-{{filterName == 'resource' ? 'primary' : 'default'}}" on-click="filterName:resource">
					资源位
				</a>
				{{/disableResource}}
				{{^disableApp}}
				<a class="btn btn-{{filterName == 'app' ? 'primary' : 'default'}}" on-click="filterName:app">
					应用
				</a>
				{{/disableApp}}
			</div>
			{{^disableChannel}}
			<div hidden="{{!(filterName == 'channel')}}">
			<multiselect title="渠道" id="channel" name="channelID"  suffix="{{suffix}}" />
			</div>
			{{/disableChannel}}
			
			{{^disableGameRegion}}
			<div hidden="{{!(filterName == 'region')}}">
			<multiselect title="区服" id="region" name="regionID"  suffix="{{suffix}}" />
			</div>
			{{/disableGameRegion}}

			{{^disableCountry}}
			<div hidden="{{!(filterName == 'country')}}">
			<multiselect title="国家" id="country" name="countryID"  suffix="{{suffix}}" />
			</div>
			{{/disableCountry}}

			{{^disableArea}}
			<div hidden="{{!(filterName == 'area')}}">
			<multiselect title="地区" id="area" name="provinceID"  suffix="{{suffix}}" />
			</div>
			{{/disableArea}}

			{{^disableVersion}}
			<div hidden="{{!(filterName == 'version')}}">
			<multiselect title="版本" id="version" name="versionID"  suffix="{{suffix}}" />
			</div>
			{{/disableVersion}}

			{{^disableResource}}
			<div hidden="{{!(filterName == 'resource')}}">
			<resfilter title="资源位" id="resource" name="ids" suffix="{{suffix}}"
				typesUrl="{{urlSettings.resourceTypesUrl}}"
				searchUrl="{{urlSettings.resourceSearchUrl}}"
				itemsUrl="{{urlSettings.resourceItemsUrl}}" />
			</div>
			{{/disableResource}}

			{{^disableApp}}
			<div hidden="{{!(filterName == 'app')}}">
			<resfilter title="应用" id="app" name="appKey" suffix="{{suffix}}"
				typesUrl="{{urlSettings.appTypesUrl}}"
				searchUrl="{{urlSettings.appSearchUrl}}"
				itemsUrl="{{urlSettings.appItemsUrl}}" />
			</div>
			{{/disableApp}}
		</div>
		<div class="model-foot text-right">
			<div class="btn-group">
				<a class="btn btn-xs btn-primary" on-click="savePanel">
					<i class="fa fa-check-circle"></i> 确定</a>
				<a class="btn btn-xs btn-default" on-click="closePanel">
					<i class="fa fa-trash-o"></i> 取消</a>
			</div>
		</div>
		{{/ajaxError}}
	</div>
</div>
<div hidden={{!list.length > 0}} class="panel panel-primary result">
	<a href="javascript:;" on-click="closeResult" 
		class="fa fa-close-custom-circle pull-right"></a>
	<div class="panel-body">
		{{#list}}
		<div class="select-result">
			<span class="select-result-title">{{title}}</span>
			<span class="select-result-content clearfix">
				{{#selected}}
				<a href="javascript:;" on-click="removeFromSelected" class="btn btn-default btn-xs">
					<font>{{label}}</font>
					<span class="fa fa-close-custom"></span>
				</a>
				{{/selected}}
			</span>
		<div>
		{{/list}}
	</div>
</div>