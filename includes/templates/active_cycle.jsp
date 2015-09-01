<%@ page language="java" contentType="text/html; charset=utf-8"%>
<div class="content-head clearfix">
	<filter start="{{dStart}}" end="{{dEnd}}" max="{{dMax}}" min="{{dMin}}" today="{{dToday}}"
		disableResource="1" suffix="{{suffix}}" disableApp="1" disableCountry="1" disableArea="1" urlSettings="{{filterSettings}}" />
</div>

<div class="content-body">
	<panel title="活跃周期分析" isTable="false" indexes="" id="active">
		<config ref="tabs.0" name="region" label="区服活跃周期" data="getData" 
			url="/activeperoid/getActiveRegionDetail.do" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" 
			chart.types="areaspline" />
			
		<config ref="tabs.1" name="version" label="版本活跃周期" data="getData" 
			url="/activeperoid/getActiveVersionDetail.do" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" 
			chart.types="areaspline" />			
		
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">时间</th>
					<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>					
				</tr>
			</thead>
			<tbody>
				{{#datalist}}
				<tr>
					<td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
					<td>{{y0}}</td>					
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
			
</div>
