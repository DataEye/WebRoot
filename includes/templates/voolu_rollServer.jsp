<%@ page language="java" contentType="text/html; charset=utf-8"%>
<div class="content-head clearfix">
	<filter start="{{dStart}}" end="{{dEnd}}" max="{{dMax}}" min="{{dMin}}" today="{{dToday}}"
		disableResource="1" suffix="{{suffix}}" disableApp="1" disableCountry="1" disableArea="1" urlSettings="{{filterSettings}}" />
</div>

<div class="content-body">
	<panel title="滚服玩家" isTable="false" id="player" indexes="" >
		<config name="add" label="滚服新增" data="getData"
      url="/transregion/getTransRegionDetail.do" 
      formatters=",,formatPercentage"
      chart.xAxisFormatter="formatShortDate" 
      chart.type="line" 
      chart.types="areaspline" 
      chart.group.0.index="0,1,2" 
      chart.group.0.tipsValue.0.name="t0"	
      chart.group.0.tipsValue.0.suffix="formatPercentage"	
    />
			
		<config name="active" label="滚服活跃" data="getData" 
      url="/transregion/getTransRegionActive.do" 
      chart.stacking="normal" 
      chart.type="line" 
      chart.types="column" 
      chart.group.0.index="0,1,2" 
      chart.group.0.tipsValue.0.name="t0"	
    />
					
		<!--<config ref="tabs.2" name="pay" label="滚服付费" data="getData" 
		url="/transregion/getTransRegionPayDetail.do" 
		formatters=",,formatPercentage" 
		chart.xAxisFormatter="formatShortDate" 
		chart.yAxisSymbols=",,%,"
		chart.type="line" 
		chart.types="areaspline" />-->
		
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">
					{{tabName == 'distribution' ? '区服' : '时间'}}
					</th>
					<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
					<th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
					<th class="datagrid-sort" on-click="sortBy:y2">{{datatitle.y2}}</th>
					<th class="datagrid-sort" on-click="sortBy:y2">{{datatitle.t0}}</th>
				</tr>
			</thead>
			<tbody>
			{{#datalist}}
				<tr>
					<td>
					{{tabName == 'distribution' ? x : formatShortDate(x, 'YYYY-MM-DD')}}
					</td>
					<td>{{y0}}</td>
					<td>{{y1}}</td>
					<td>{{y2}}</td>
					<td>{{formatPercentage(t0)}}</td>
				</tr>
			{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
		
	<panel title="滚服前状态" isTable="false" id="currentType" indexes="">
		<config name="grade" label="滚服等级" data="getData" 
			url="/transregion/getTransRegionLevel.do" 
			chart.yAxisSymbols=",%"
			chart.type="line" 
			chart.types="column" />
			
		<config name="day" label="游戏时间天" data="getData" 
			url="/transregion/getTransRegionPlayDay.do" 
			chart.yAxisSymbols=",%"
			chart.type="line" chart.types="column" />
			
		<config name="time" label="游戏时长" data="getData" 
			url="/transregion/getTransRegionPlayTime.do" 
			chart.yAxisSymbols=",%"
			chart.type="line" chart.types="column" />
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">渠道</th>
					<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
					<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.t0}}</th>
				</tr>
			</thead>
			<tbody>
				{{#datalist}}
				<tr>
					<td>{{x}}</td>
					<td>{{y0}}</td>
					<td>{{t0}}</td>
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	
	<panel title="滚服后粘性-留存" isTable="false" id="sticky" indexes="">
		<config ref="tabs.0" name="retention" label="留存" data="getData" 
			url="/transregion/getTransRegionRetain.do" 
			formatters=",formatPercentage,formatPercentage,formatPercentage"
			chart.yAxisSymbols="%,%,%,%,%"
			chart.type="line" 
			chart.types="column" />
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">渠道</th>
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
					<td>{{x}}</td>
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
	
	<panel title="滚服后分析" isTable="false" id="analysis" indexes="">
		<config name="income" label="区服收入" data="getData" 
			url="/transregion/getTransRegionRegionPay.do" 
			chart.yAxisSymbols=",%" 
			chart.type="line" 
			chart.types="column" 
			chart.switchVar="analysisDetail" 
			chart.childID="analysisDetail" 
			chart.data="getData" />
			
		<config name="dayPay" label="滚服首日付费" data="getData" 
			url="/transregion/getTransRegionRegionFirstDayPay.do" 
			chart.yAxisRightIndexes="1" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" 
			chart.types="column,areaspline" />
			
		<config name="payRate" label="付费率" data="getData" 
			url="/transregion/getTransRegionRegionPayRate.do" 
			chart.yAxisSymbols="%" 
			chart.type="line" 
			chart.types="column" 
			chart.switchVar="analysisDetail" 
			chart.childID="analysisDetail" 
			chart.data="getData" />
			
		<config name="arpuArppu" label="ARPU/ARPPU" data="getData" 
			url="/transregion/getTransRegionRegionAvgArpu.do" 
			chart.yAxisRightIndexes="1,2" 
			chart.type="line" 
			chart.types="areaspline,column,column" 
			chart.switchVar="analysisDetail" 
			chart.childID="analysisDetail" 
			chart.data="getData" />
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">{{tabName == 'dayPay' ? '时间' : '区服'}}</th>
					<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
					{{#if tabName == 'income'}}
					<th class="datagrid-sort" on-click="sortBy:t0">{{datatitle.t0}}</th>
					{{/if}}
					{{#if tabName == 'dayPay'}}
					<th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
					{{/if}}
					{{#if tabName == 'arpuArppu'}}
					<th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
					<th class="datagrid-sort" on-click="sortBy:y2">{{datatitle.y2}}</th>
					{{/if}}
				</tr>
			</thead>
			<tbody>
				{{#datalist}}
				<tr>
					<td>{{tabName == 'dayPay' ? formatShortDate(x, 'YYYY-MM-DD') : x}}</td>
					<td>{{tabName == 'payRate' ? formatPercentage(y0) : y0}}</td>
					{{#if tabName == 'income'}}
					<td>{{formatPercentage(t0)}}</td>
					{{/if}}
					{{#if tabName == 'dayPay'}}
					<td>{{y1}}</td>
					{{/if}}
					{{#if tabName == 'arpuArppu'}}
					<td>{{y1}}</td>
					<td>{{y2}}</td>
					{{/if}}
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	
	{{#analysisDetail}}
	<panel detail="true" title="{{title}}" id="analysisDetail" isTable="false" hideTabs="1">
		<config name="income" label="income" download="false" data="getData" 
			url="/transregion/getTransRegionRegionPlayerPay.do" 
			chart.xAxisFormatter="formatShortDate"
			chart.yAxisRightIndexes="1" 
			chart.type="line" 
			chart.types="column,areaspline" />
			
		<config name="payRate" label="payRate" download="false" data="getData" 
			url="/transregion/getTransRegionRegionPayRateDetail.do" 
			chart.xAxisFormatter="formatShortDate"
			chart.type="line" 
			chart.yAxisSymbols="%" />
			
		<config name="arpuArppu" label="arpuArppu" download="false" data="getData" 
			url="/transregion/getTransRegionRegionAvgArpuDetail.do" 
			chart.xAxisFormatter="formatShortDate"
			chart.type="line" 
			chart.yAxisRightIndexes="1,2" />
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
