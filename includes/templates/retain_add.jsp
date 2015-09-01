<%@ page language="java" contentType="text/html; charset=utf-8"%>
<div class="content-head clearfix">
	<filter start="{{dStart}}" end="{{dEnd}}" max="{{dMax}}" min="{{dMin}}" today="{{dToday}}"
		disableResource="1" suffix="{{suffix}}" disableApp="1" disableCountry="1" disableArea="1" urlSettings="{{filterSettings}}" />
</div>

<div class="content-body">
	<panel title="新增留存-留存分布" isTable="false" indexes="" id="retain_add">
		<config ref="tabs.0" name="distribution" label="留存分布" data="getData" 
			url="/newUserRetention/listRetentionDistribution.do" 
			formatters="formatPercentage,formatPercentage,formatPercentage,formatPercentage,formatPercentage"
			chart.yAxisSymbols="%,%,%,%,%" 
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
					<th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
					<th class="datagrid-sort" on-click="sortBy:y2">{{datatitle.y2}}</th>
					<th class="datagrid-sort" on-click="sortBy:y3">{{datatitle.y3}}</th>
					<th class="datagrid-sort" on-click="sortBy:y4">{{datatitle.y4}}</th>
				</tr>
			</thead>
			<tbody>
				{{#datalist}}
				<tr>
					<td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
					<td>{{formatPercentage(y0)}}</td>
					<td>{{formatPercentage(y1)}}</td>
					<td>{{formatPercentage(y2)}}</td>
					<td>{{formatPercentage(y3)}}</td>
					<td>{{formatPercentage(y4)}}</td>
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>

	<panel title="渠道留存对比" isTable="false" indexes="" id="vs_channel">
		<config ref="tabs.0" name="1day" label="次日" data="getData" 
			url="/newUserRetention/listChannelRetention.do?conditionDay=1" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" 
			chart.types="areaspline" />
			
		<config ref="tabs.1" name="3day" label="3日" data="getData" 
			url="/newUserRetention/listChannelRetention.do?conditionDay=3" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" 
			chart.types="areaspline" />
			
		<config ref="tabs.2" name="7day" label="7日" data="getData" 
			url="/newUserRetention/listChannelRetention.do?conditionDay=7" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" 
			chart.types="areaspline" />
			
		<config ref="tabs.3" name="14day" label="14日" data="getData" 
			url="/newUserRetention/listChannelRetention.do?conditionDay=14" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" 
			chart.types="areaspline" />
			
		<config ref="tabs.4" name="30day" label="30日" data="getData" 
			url="/newUserRetention/listChannelRetention.do?conditionDay=30" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" 
			chart.types="areaspline" />
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">时间</th>
					{{#sortedTitles}}
						<th class="datagrid-sort" on-click="sortBy:{{label}}">{{value}}</th>
					{{/sortedTitles}}
				</tr>
			</thead>
			<tbody>
				{{#datalist:i}}
				<tr>
					<td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
					{{#sortedTitles}}
						<td>{{formatPercentage(datalist[i][label])}}</td>
					{{/}}
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	
	<panel title="国家留存对比" isTable="false" indexes="" id="vs_country">
		<config ref="tabs.0" name="1day" label="次日" data="getData" 
			url="/newUserRetention/listCountryRetention.do?conditionDay=1" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="areaspline" />
			
		<config ref="tabs.1" name="3day" label="3日" data="getData" 
			url="/newUserRetention/listCountryRetention.do?conditionDay=3" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="areaspline" />
			
		<config ref="tabs.2" name="7day" label="7日" data="getData" 
			url="/newUserRetention/listCountryRetention.do?conditionDay=7" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="areaspline" />
			
		<config ref="tabs.3" name="14day" label="14日" data="getData" 
			url="/newUserRetention/listCountryRetention.do?conditionDay=14" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="areaspline" />
			
		<config ref="tabs.4" name="30day" label="30日" data="getData" 
			url="/newUserRetention/listCountryRetention.do?conditionDay=30" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="areaspline" />
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">时间</th>
					{{#sortedTitles}}
						<th class="datagrid-sort" on-click="sortBy:{{label}}">{{value}}</th>
					{{/sortedTitles}}
				</tr>
			</thead>
			<tbody>
				{{#datalist:i}}
				<tr>
					<td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
					{{#sortedTitles}}
						<td>{{formatPercentage(datalist[i][label])}}</td>
					{{/}}
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	
	<panel title="区服留存对比" isTable="false" indexes="" id="vs_region">
		<config ref="tabs.0" name="1day" label="次日" data="getData" 
			url="/newUserRetention/listRegionRetention.do?conditionDay=1" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="areaspline" />
			
		<config ref="tabs.1" name="3day" label="3日" data="getData" 
			url="/newUserRetention/listRegionRetention.do?conditionDay=3" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="areaspline" />
			
		<config ref="tabs.2" name="7day" label="7日" data="getData" 
			url="/newUserRetention/listRegionRetention.do?conditionDay=7" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="areaspline" />
			
		<config ref="tabs.3" name="14day" label="14日" data="getData" 
			url="/newUserRetention/listRegionRetention.do?conditionDay=14" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="areaspline" />
			
		<config ref="tabs.4" name="30day" label="30日" data="getData" 
			url="/newUserRetention/listRegionRetention.do?conditionDay=30" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="areaspline" />
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">时间</th>
					{{#sortedTitles}}
						<th class="datagrid-sort" on-click="sortBy:{{label}}">{{value}}</th>
					{{/sortedTitles}}
				</tr>
			</thead>
			<tbody>
				{{#datalist:i}}
				<tr>
					<td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
					{{#sortedTitles}}
						<td>{{formatPercentage(datalist[i][label])}}</td>
					{{/}}
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	
	<panel title="版本留存对比" isTable="false" indexes="" id="vs_version">
		<config ref="tabs.0" name="1day" label="次日" data="getData" 
			url="/newUserRetention/listVersionRetention.do?conditionDay=1" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="column" />
			
		<config ref="tabs.1" name="3day" label="3日" data="getData" 
			url="/newUserRetention/listVersionRetention.do?conditionDay=3" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="column" />
			
		<config ref="tabs.2" name="7day" label="7日" data="getData" 
			url="/newUserRetention/listVersionRetention.do?conditionDay=7" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="column" />
			
		<config ref="tabs.3" name="14day" label="14日" data="getData" 
			url="/newUserRetention/listVersionRetention.do?conditionDay=14" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="column" />
			
		<config ref="tabs.4" name="30day" label="30日" data="getData" 
			url="/newUserRetention/listVersionRetention.do?conditionDay=30" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="column" />
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">时间</th>
					{{#sortedTitles}}
						<th class="datagrid-sort" on-click="sortBy:{{label}}">{{value}}</th>
					{{/sortedTitles}}
				</tr>
			</thead>
			<tbody>
				{{#datalist:i}}
				<tr>
					<td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
					{{#sortedTitles}}
						<td>{{formatPercentage(datalist[i][label])}}</td>
					{{/}}
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	
	<panel title="角色留存" isTable="false" indexes="" id="vs_role">
		<config ref="tabs.0" name="1day" label="次日" data="getData" 
			url="/newUserRetention/listRoleRetention.do?conditionDay=1" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="column" />
			
		<config ref="tabs.1" name="3day" label="3日" data="getData" 
			url="/newUserRetention/listRoleRetention.do?conditionDay=3" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="column" />
			
		<config ref="tabs.2" name="7day" label="7日" data="getData" 
			url="/newUserRetention/listRoleRetention.do?conditionDay=7" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="column" />
			
		<config ref="tabs.3" name="14day" label="14日" data="getData" 
			url="/newUserRetention/listRoleRetention.do?conditionDay=14" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="column" />
			
		<config ref="tabs.4" name="30day" label="30日" data="getData" 
			url="/newUserRetention/listRoleRetention.do?conditionDay=30" 
			formatters="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="column" />
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">时间</th>
					{{#sortedTitles}}
						<th class="datagrid-sort" on-click="sortBy:{{label}}">{{value}}</th>
					{{/sortedTitles}}
				</tr>
			</thead>
			<tbody>
				{{#datalist:i}}
				<tr>
					<td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
					{{#sortedTitles}}
						<td>{{formatPercentage(datalist[i][label])}}</td>
					{{/}}
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
			
</div>
