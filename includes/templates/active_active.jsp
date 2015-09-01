<%@ page language="java" contentType="text/html; charset=utf-8"%>
<div class="content-head clearfix">
	<filter start="{{dStart}}" end="{{dEnd}}" max="{{dMax}}" min="{{dMin}}" today="{{dToday}}"
		disableResource="1" suffix="{{suffix}}" disableApp="1" disableCountry="1" disableArea="1" urlSettings="{{filterSettings}}" />
</div>

<div class="content-body">
	<panel title="活跃玩家" isTable="false" indexes="" id="active">
		<config ref="tabs.0" name="dau" label="DAU" data="getData" 
			url="/activeanalysic/getActiveDAU.do" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" 
			chart.types="column,column,areaspline,areaspline" 
			chart.group.0.index="0,1,2,3" 
			chart.group.0.tipsValue.0.name="t0" />
			
		<config ref="tabs.1" name="wau" label="WAU" data="getData" 
			url="/activeanalysic/getActiveWAU.do" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" 
			chart.types="areaspline,areaspline" 
			chart.group.0.index="0,1,2,3" 
			chart.group.0.tipsValue.0.name="t0" />
			
		<config ref="tabs.2" name="mau" label="MAU" data="getData" 
			url="/activeanalysic/getActiveMAU.do" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" 
			chart.types="areaspline,areaspline" 
			chart.group.0.index="0,1,2,3" 
			chart.group.0.tipsValue.0.name="t0" />
			
		<config ref="tabs.3" name="daumau" label="DAU/MAU" data="getData" 
			url="/activeanalysic/getActiveDAUMAU.do" 
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
					{{#if tabName != 'daumau'}}
					<th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
					{{#if tabName == 'dau'}}
					<th class="datagrid-sort" on-click="sortBy:y2">{{datatitle.y2}}</th>
					<th class="datagrid-sort" on-click="sortBy:y3">{{datatitle.y3}}</th>
					{{/if}}
					<th class="datagrid-sort" on-click="sortBy:t0">{{datatitle.t0}}</th>
					{{/if}}
				</tr>
			</thead>
			<tbody>
				{{#datalist}}
				<tr>
					<td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
					<td>{{y0}}</td>
					{{#if tabName != 'daumau'}}
					<td>{{y1}}</td>
					{{#if tabName == 'dau'}}
					<td>{{y2}}</td>
					<td>{{y3}}</td>
					{{/if}}
					<td>{{t0}}</td>
					{{/if}}
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>

	<panel title="活跃来源" isTable="false" indexes="" id="source">
		<config ref="tabs.0" name="channel" label="渠道" data="getData" 
			url="/activeanalysic/getActiveChan.do" 
			sub.names="day1,day7,day30" 
			sub.labels="当天,7天,30天" 
			formatters=",formatPercentage" 
			chart.suffix="formatPercentage" 
			chart.type="line" chart.types="column" 
			chart.switchVar="sourceDetail" 
			chart.childID="sourceDetail" />
			
		<config ref="tabs.1" name="country" label="国家" data="getData" 
			url="/activeanalysic/getActiveCountry.do" 
			sub.names="day1,day7,day30" 
			sub.labels="当天,7天,30天" 
			formatters=",formatPercentage" 
			chart.suffix="formatPercentage" 
			chart.type="line" chart.types="column" 
			chart.switchVar="sourceDetail" 
			chart.childID="sourceDetail" />	
			
		<config ref="tabs.2" name="city" label="城市" data="getData" 
			url="/activeanalysic/getActiveCity.do" 
			sub.names="day1,day7,day30" 
			sub.labels="当天,7天,30天" 
			formatters=",formatPercentage" 
			chart.suffix="formatPercentage" 
			chart.type="line" chart.types="column" 
			chart.switchVar="sourceDetail" 
			chart.childID="sourceDetail" />	
		
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">
					{{#if tabName == 'channel'}}
					渠道
					{{/if}}
					{{#if tabName == 'country'}}
					国家
					{{/if}}
					{{#if tabName == 'city'}}
					城市
					{{/if}}
					</th>
					<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
					<th class="datagrid-sort" on-click="sortBy:z0">{{datatitle.z0}}</th>
				</tr>
			</thead>
			<tbody>
				{{#datalist}}
				<tr>
					<td>{{x}}</td>					
					<td>{{y0}}</td>
					<td>{{formatPercentage(z0)}}</td>
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	
	{{#sourceDetail}}
	<panel detail="true" title="{{title}}" id="sourceDetail" isTable="false" hideTabs="1">
		<config name="channel" label="channel" download="false" data="getData"
			url="/activeanalysic/getActiveChanDetail.do" 
			chart.xAxisFormatter="formatShortDate"
			chart.type="line"
			chart.types="column"
			chart.suffix="formatPercentage" />
			
		<config name="country" label="country" download="false" data="getData"
			url="/activeanalysic/getActiveCountryDetail.do" 
			chart.xAxisFormatter="formatShortDate"
			chart.type="line"
			chart.types="column"
			chart.suffix="formatPercentage" />
			
		<config name="city" label="city" download="false" data="getData"
			url="/activeanalysic/getActiveCityDetail.do" 
			chart.xAxisFormatter="formatShortDate"
			chart.type="line"
			chart.types="column"
			chart.suffix="formatPercentage" />
    
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">日期</th>
					<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
					<th class="datagrid-sort" on-click="sortBy:z0">{{datatitle.z0}}</th>					
				</tr>
			</thead>
			<tbody>
				{{#datalist}}
				<tr>
					<td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
					<td>{{y0}}</td>
					<td>{{z0}}</td>					
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	{{/sourceDetail}}
	
	<panel title="活跃归属" isTable="false" indexes="" id="attribution">
		<config ref="tabs.0" name="region" label="区服活跃" data="getData" 
			url="/activeanalysic/getActiveRegion.do" 
			sub.names="day1,day7,day30" 
			sub.labels="当天,7天,30天" 
			formatters=",formatPercentage" 
			chart.suffix="formatPercentage" 
			chart.type="line" 
			chart.types="column" 
			chart.switchVar="attrDetail" 
			chart.childID="attrDetail" />
			
		<config ref="tabs.1" name="role" label="角色" data="getData" 
			url="/activeanalysic/getActiveRole.do" 			
			formatters=",formatPercentage" 
			chart.suffix="formatPercentage" 
			chart.type="line" 
			chart.types="column" 
			chart.switchVar="attrDetail" 
			chart.childID="attrDetail" />
	
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">
					{{#if tabName == 'region'}}
					区服
					{{/if}}
					{{#if tabName == 'role'}}
					角色
					{{/if}}
					</th>
					<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
					<th class="datagrid-sort" on-click="sortBy:z0">{{datatitle.z0}}</th>
				</tr>
			</thead>
			<tbody>
				{{#datalist}}
				<tr>
					<td>{{x}}</td>
					<td>{{y0}}</td>
					<td>{{formatPercentage(z0)}}</td>
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	
	{{#attrDetail}}
	<panel detail="true" title="{{title}}" id="attrDetail" isTable="false" hideTabs="1">
		<config name="region" label="region" download="false" data="getData"
			url="/activeanalysic/getActiveRegionDetail.do" 
			chart.xAxisFormatter="formatShortDate"
			chart.type="line"
			chart.types="column"
			chart.suffix="formatPercentage" />
			
		<config name="role" label="role" download="false" data="getData"
			url="/activeanalysic/getActiveRoleDetail.do" 
			chart.xAxisFormatter="formatShortDate"
			chart.type="line"
			chart.types="column"
			chart.suffix="formatPercentage" />			
    
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">日期</th>
					<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
					<th class="datagrid-sort" on-click="sortBy:z0">{{datatitle.z0}}</th>					
				</tr>
			</thead>
			<tbody>
				{{#datalist}}
				<tr>
					<td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
					<td>{{y0}}</td>
					<td>{{z0}}</td>					
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	{{/attrDetail}}
	
	<panel title="玩家活跃特征" isTable="false" indexes="" id="features">
		<config ref="tabs.0" name="playDay" label="游戏时间天" data="getData" 
			url="/activeanalysic/getActiveGameDayDetail.do" 
			chart.stacking="normal"
			chart.suffix="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="column" />
			
		<config ref="tabs.1" name="playTime" label="游戏时长" data="getData" 
			url="/activeanalysic/getActiveGameHourDetail.do" 
			chart.stacking="normal" 
			chart.suffix="formatPercentage" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="column" />
			
		<config ref="tabs.2" name="playFrequency " label="游戏频次" data="getData" 
			url="/activeanalysic/getActiveGameTimesDetail.do" 
			chart.stacking="normal" 
			chart.suffix="formatPercentage" 
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
	
	<panel title="在线峰值" isTable="false" indexes="" disableSwitch="true" id="peak">
		<config ref="tabs.0" name="peak" label="在线峰值" data="getData" 
			url="/activeanalysic/getActiveGameOnlinePeakDetail.do" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" chart.types="scatter" 
			chart.group.0.index="0" 
			chart.group.0.tipsValue.0.name="t0"
			chart.group.0.tipsValue.0.suffix="formatShortTimePeriod" />	
		{{#partial datagrid}}
		
		{{/partial}}
	</panel>
			
</div>
