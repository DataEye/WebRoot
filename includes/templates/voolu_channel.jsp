<%@ page language="java" contentType="text/html; charset=utf-8"%>
<div class="content-head clearfix">
	<filter start="{{dStart}}" end="{{dEnd}}" max="{{dMax}}" min="{{dMin}}" today="{{dToday}}"
		disableResource="1" suffix="{{suffix}}" disableApp="1" disableCountry="1" disableArea="1" urlSettings="{{filterSettings}}" />
</div>

<div class="content-body">
	<panel title="渠道价值" isTable="false" id="chanValue" indexes="" >
		<config name="importPlayers" label="导入玩家" data="getChanData"
			url="/chan/getChanImportPlayer.do" 
			formatters=",,,formatPercentage"
			chart.type="line" 
			chart.types="column" 
			chart.suffix="formatPercentage"
			chart.stacking="normal"
			chart.group.0.index="0" 
			chart.group.1.index="1" 
			chart.group.2.tipsValue.0.name="t0"	
			chart.group.2.tipsValue.0.suffix="formatPercentage"
			chart.switchVar="chanValueDetail" 
			chart.childID="chanValueDetail" 
    />
			
		<config name="distribution" label="留存分布" data="getChanData"
			url="/chan/getChanRetain.do" 
			formatters=",formatPercentage,formatPercentage,formatPercentage" 
			chart.yAxisSymbols="%,%,%,%,%" 
			chart.type="line" 
			chart.types="column" 
			chart.suffix="formatPercentage" 
			chart.switchVar="chanValueDetail" 
			chart.childID="chanValueDetail" 
    />
			
		<config name="avgActive" label="平均活跃" data="getChanData"
			url="/chan/getChanAvgActive.do"
      sub.names="avgActive,7avgActive,30avgActive" sub.labels="日平均活跃,7日平均活跃,30日平均活跃" 
			chart.type="line" 
			chart.types="column,column,areaspline"
			chart.yAxisRightIndexes="2" 
			chart.switchVar="chanValueDetail" 
			chart.childID="chanValueDetail" 
    />
			
		<config name="payContribution" label="付费贡献" data="getChanData" 
			url="/chan/getChanContribution.do" 
			chart.yAxisRightIndexes="1" 
			formatters="formatCurrency" 
			chart.type="line" 
			chart.types="column,areaspline" 
			chart.switchVar="chanValueDetail" 
			chart.childID="chanValueDetail" 
		/>
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">渠道</th>
					<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
					<th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
					{{#if tabName === 'importPlayers'}}
					<th class="datagrid-sort" on-click="sortBy:y2">{{datatitle.y2}}</th>
					<th class="datagrid-sort" on-click="sortBy:t0">{{datatitle.t0}}</th>
					{{/if}}
					{{#if tabName === 'distribution'}}
					<th class="datagrid-sort" on-click="sortBy:y2">{{datatitle.y2}}</th>
					<th class="datagrid-sort" on-click="sortBy:y3">{{datatitle.y3}}</th>
					<th class="datagrid-sort" on-click="sortBy:y4">{{datatitle.y4}}</th>
					{{/if}}
				</tr>
			</thead>
			<tbody>
			{{#datalist}}
				<tr>
					<td>{{x}}</td>
					<td>{{tabName === 'distribution' ? formatPercentage(y0) : y0}}</td>
					<td>{{tabName === 'distribution' ? formatPercentage(y1) : y1}}</td>
					{{#if tabName === 'importPlayers'}}
					<td>{{y2}}</td>
					<td>{{formatPercentage(t0)}}</td>
					{{/if}}
					{{#if tabName === 'distribution'}}
					<td>{{formatPercentage(y2)}}</td>
					<td>{{formatPercentage(y3)}}</td>
					<td>{{formatPercentage(y4)}}</td>
					{{/if}}
				</tr>
			{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	
	{{#chanValueDetail}}
	<panel detail="true" title="{{title}}" id="chanValueDetail" isTable="false" hideTabs="1">
		<config name="importPlayers" label="importPlayers" download="false" data="getChanData"
			url="/chan/getChanImportPlayerDetail.do" 
			chart.xAxisFormatter="formatShortDate"
      chart.type="line"
      chart.group.0.index="0,1,2,3"
      chart.group.0.tipsValue.0.name="t0"	
			chart.group.0.tipsValue.0.suffix="formatPercentage"
    />
		<config name="distribution" label="chanValueDetail" download="false" data="getChanData"
			url="/chan/getChanRetainDetail.do" 
			chart.xAxisFormatter="formatShortDate"
      chart.type="line"
    />
    <config name="avgActive" label="avgActive" download="false" data="getChanData"
			url="/chan/getChanAvgActiveDetail.do" 
			chart.xAxisFormatter="formatShortDate"
      chart.type="line" 
      chart.types="column,column,areaspline"
      chart.stacking="normal"
      chart.yAxisRightIndexes="2"
    />
    <config name="payContribution" label="payContribution" download="false" data="getChanData"
			url="/chan/getChanContributionDetail.do" 
			chart.xAxisFormatter="formatShortDate"
      chart.type="line" 
      chart.types="column,areaspline"
      chart.yAxisRightIndexes="1"
    />
    
    <!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">日期</th>
					<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
					<th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
					{{#if tabName == 'importPlayers'}}
					<th class="datagrid-sort" on-click="sortBy:y2">{{datatitle.y2}}</th>
					<th class="datagrid-sort" on-click="sortBy:y3">{{datatitle.y3}}</th>
					<th class="datagrid-sort" on-click="sortBy:t0">{{datatitle.t0}}</th>
					{{/if}}
					{{#if tabName == 'distribution'}}
					<th class="datagrid-sort" on-click="sortBy:y2">{{datatitle.y2}}</th>
					<th class="datagrid-sort" on-click="sortBy:y3">{{datatitle.y3}}</th>
					<th class="datagrid-sort" on-click="sortBy:y4">{{datatitle.y4}}</th>
					{{/if}}
				</tr>
			</thead>
			<tbody>
				{{#datalist}}
				<tr>
					<td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
					<td>{{y0}}</td>
					<td>{{y1}}</td>
					{{#if parentTabName == 'importPlayers'}}
					<td>{{y2}}</td>
					<td>{{y3}}</td>
					<td>{{t0}}</td>
					{{/if}}
					{{#if parentTabName == 'distribution'}}
					<td>{{y2}}</td>
					<td>{{y3}}</td>
					<td>{{y4}}</td>
					{{/if}}
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	{{/chanValueDetail}}
		
	<panel title="渠道吸金能力" isTable="false" id="gold" indexes="">
		<config name="payRate" label="平均付费率" data="getChanData"
			url="/chan/getChanPayRate.do" 
			formatters=",formatPercentage" 
			chart.yAxisSymbols="%," 
			chart.type="line" 
			chart.types="column" 
			chart.switchVar="goldDetail" 
			chart.childID="goldDetail" 
    />
			
		<config name="arpu" label="平均ARPU" data="getChanData"
			url="/chan/getChanArpu.do" 
			chart.type="line" 
			chart.types="column" 
			chart.switchVar="goldDetail" 
			chart.childID="goldDetail" 
    />
			
		<config name="arppu" label="平均ARPPU" data="getChanData"
			url="/chan/getChanArppu.do" 
			chart.type="line" 
			chart.types="column" 
			chart.switchVar="goldDetail" 
			chart.childID="goldDetail" 
    />
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">渠道</th>
					<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
				</tr>
			</thead>
			<tbody>
				{{#datalist}}
				<tr>
					<td>{{x}}</td>
					<td>{{y0}}</td>
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	
	{{#goldDetail}}
	<panel detail="true" title="{{title}}" id="goldDetail" isTable="false" hideTabs="1">
		<config name="payRate" label="payRate" download="false" data="getChanData" 
			url="/chan/getChanPayRateDetail.do" 
			chart.xAxisFormatter="formatShortDate"
      chart.type="line" 
    />
    <config name="arpu" label="arpu" download="false" data="getChanData"
			url="/chan/getChanArpuDetail.do" 
			chart.xAxisFormatter="formatShortDate"
      chart.type="line" 
    />
    <config name="arppu" label="arppu" download="false" data="getChanData"
			url="/chan/getChanArppuDetail.do" 
			chart.xAxisFormatter="formatShortDate"
      chart.type="line" 
    />
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">日期</th>
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
	{{/goldDetail}}
	
		
</div>
