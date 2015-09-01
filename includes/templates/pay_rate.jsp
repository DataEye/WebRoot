<%@ page language="java" contentType="text/html; charset=utf-8" %>
<div class="content-head clearfix">
  <filter start="{{dStart}}" end="{{dEnd}}" max="{{dMax}}" min="{{dMin}}" today="{{dToday}}"
    disableResource="1" suffix="{{suffix}}" disableApp="1" disableCountry="1" disableArea="1"
    urlSettings="{{filterSettings}}" />
</div>

<div class="content-body">
  <panel title="付费率分布" isTable="false" indexes="">
    <config ref="tabs.0" name="day" label="日付费率" data="getFormData" 
		url="/promotePayRate/listDayPayRate.do" 
		formatters="formatPercentage" 
		chart.xAxisFormatter="formatShortDate" 
		chart.yAxisSymbols=",%" 
		chart.yAxisRightIndexes="1" 
		chart.type="line" 
		chart.types="column,areaspline" />
      
    <config ref="tabs.1" name="week" label="周付费率" data="getFormData" 
		url="/promotePayRate/listWeekPayRate.do" 
		formatters="formatPercentage" 
		chart.xAxisFormatter="formatShortDate" 
		chart.yAxisSymbols=",%" 
		chart.yAxisRightIndexes="1" 
		chart.type="line" 
		chart.types="column,areaspline" />
      
    <config ref="tabs.2" name="month" label="月付费率" data="getFormData" 
		url="/promotePayRate/listMonthPayRate.do" 
		formatters="formatPercentage" 
		chart.xAxisFormatter="formatShortDate" 
		chart.yAxisSymbols=",%" 
		chart.yAxisRightIndexes="1" 
		chart.type="line" 
		chart.types="column,areaspline" />
		
    <!-- 这个模板会传到datagrid组件内部 -->
    {{#partial datagrid}}
    <table class="table-single">
      <thead>
        <tr>
          <th>
          	日期
          </th>
          <th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
          <th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
        </tr>
      </thead>
      <tbody>
        {{#datalist}}
        <tr>
          <td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
          <td>{{y0}}</td>
          <td>{{y1}}</td>
        </tr>
        {{/datalist}}
      </tbody>      
    </table>
    {{/partial}}
  </panel>
  
  <panel title="早期付费率分布" isTable="false" indexes="">
    <config ref="tabs.0" name="day" label="首日付费率" data="getFormData" 
		url="/promotePayRate/listFirstDayPayRate.do" 
		formatters="formatPercentage" 
		chart.xAxisFormatter="formatShortDate" 
		chart.yAxisSymbols=",%" 
		chart.yAxisRightIndexes="1" 
		chart.type="line" 
		chart.types="column,areaspline" />
      
    <config ref="tabs.1" name="week" label="首周付费率" data="getFormData" 
		url="/promotePayRate/listFirstWeekPayRate.do" 
		formatters="formatPercentage" 
		chart.xAxisFormatter="formatShortDate" 
		chart.yAxisSymbols=",%" 
		chart.yAxisRightIndexes="1" 
		chart.type="line" 
		chart.types="column,areaspline" />
	
    <!-- 这个模板会传到datagrid组件内部 -->
    {{#partial datagrid}}
    <table class="table-single">
      <thead>
        <tr>
          <th>
           日期
          </th>
          <th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
          <th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
        </tr>
      </thead>
      <tbody>
        {{#datalist}}
        <tr>
          <td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
          <td>{{y0}}</td>
          <td>{{y1}}</td>
        </tr>
        {{/datalist}}
      </tbody>      
    </table>
    {{/partial}}
  </panel>


  <panel title="付费时间节点" isTable="false" indexes="">
    <config ref="tabs.0" name="day" label="累计时间天" data="getFormData" 
		url="/promotePayRate/listPayDays.do" 
		chart.suffix="formatPercentage" 
		chart.type="line" 
		chart.types="column" />
      
    <config ref="tabs.1" name="duration" label="累计时长" data="getFormData" 
		url="/promotePayRate/listPayHours.do"
		chart.suffix="formatPercentage" 
		chart.type="line" 
		chart.types="column" />
	
    <!-- 这个模板会传到datagrid组件内部 -->
    {{#partial datagrid}}
    <table class="table-single">
      <thead>
        <tr>
          <th>
            {{tabName === 'day' ? '累计时间天' : ''}}
            {{tabName === 'duration' ? '累计时长' : ''}}
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
    
  <panel title="流量来源对比" isTable="false" indexes="">
    <config ref="tabs.0" name="channel" label="渠道" data="getFormData" 
		url="/promotePayRate/listChannelPayRate.do" 
		formatters="formatPercentage" 
		chart.yAxisSymbols="%" 
		chart.type="line" 
		chart.types="column" 
		chart.switchVar="allikaDetail" 
		chart.childID="allikaDetail" />
      
    <config ref="tabs.1" name="country" label="国家" data="getFormData" 
		url="/promotePayRate/listCountryPayRate.do" 
		formatters="formatPercentage" 
		chart.yAxisSymbols="%" 
		chart.type="line" 
		chart.types="column" 
		chart.switchVar="allikaDetail" 
		chart.childID="allikaDetail" />
	
    <!-- 这个模板会传到datagrid组件内部 -->
    {{#partial datagrid}}
    <table class="table-single">
      <thead>
        <tr>
          <th>
            {{tabName === 'channel' ? '渠道' : ''}}
            {{tabName === 'country' ? '国家' : ''}}
          </th>
          <th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
        </tr>
      </thead>
      <tbody>
        {{#datalist}}
        <tr>
          <td>{{x}}</td>
          <td>{{formatPercentage(y0)}}</td>
        </tr>
        {{/datalist}}
      </tbody>      
    </table>
    {{/partial}}
  </panel>
  
	{{#allikaDetail}}
	<panel detail="true" title="{{title}}" id="allikaDetail" isTable="false" hideTabs="1">
		<config name="channel" label="channel" download="false" data="getFormData"
			url="/promotePayRate/listDayPayRate.do" 
			chart.xAxisFormatter="formatShortDate" 
			chart.yAxisSymbols="%" 
			chart.type="line" />
			
		<config name="country" label="country" download="false"  data="getFormData" 
			url="/promotePayRate/listCountryPayRateDetail.do"
			chart.xAxisFormatter="formatShortDate" 
			chart.yAxisSymbols="%" 
			chart.type="line" />
			
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
					<td>{{formatPercentage(y0)}}</td>
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	{{/allikaDetail}}
	
	<panel title="流量归属对比" isTable="false" indexes="">
		<config ref="tabs.0" name="region" label="区服" data="getFormData" 
			url="/promotePayRate/listRegionPayRate.do" 
			formatters="formatPercentage" 
			chart.yAxisSymbols="%" 
			chart.type="line" 
			chart.types="column" 
			chart.switchVar="affilDetail" 
			chart.childID="affilDetail" />
		  
		<config ref="tabs.1" name="version" label="版本" data="getFormData" 
			url="/promotePayRate/listVersionPayRate.do" 
			formatters="formatPercentage" 
			chart.yAxisSymbols="%" 
			chart.type="line" 
			chart.types="column" 
			chart.switchVar="affilDetail" 
			chart.childID="affilDetail" />
			
		<config ref="tabs.1" name="role" label="角色" data="getFormData" 
			url="/promotePayRate/listRolePayRate.do" 
			formatters="formatPercentage" 
			chart.yAxisSymbols="%" 
			chart.type="line" 
			chart.types="column" 
			chart.switchVar="affilDetail" 
			chart.childID="affilDetail" />
		
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
		  <thead>
			<tr>
			  <th>
				{{tabName === 'region' ? '渠道' : ''}}
				{{tabName === 'version' ? '国家' : ''}}
				{{tabName === 'role' ? '角色' : ''}}
			  </th>
			  <th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
			</tr>
		  </thead>
		  <tbody>
			{{#datalist}}
			<tr>
			  <td>{{x}}</td>
			  <td>{{formatPercentage(y0)}}</td>
			</tr>
			{{/datalist}}
		  </tbody>      
		</table>
		{{/partial}}
	</panel>
	
	{{#affilDetail}}
	<panel detail="true" title="{{title}}" id="affilDetail" isTable="false" hideTabs="1">
		<config name="region" label="region" download="false" data="getFormData"
			url="/promotePayRate/listDayPayRate.do" 
			chart.xAxisFormatter="formatShortDate" 
			chart.yAxisSymbols="%" 
			chart.type="line" />
			
		<config name="version" label="version" download="false"  data="getFormData" 
			url="/promotePayRate/listDayPayRate.do"
			chart.xAxisFormatter="formatShortDate" 
			chart.yAxisSymbols="%" 
			chart.type="line" />
			
		<config name="role" label="role" download="false"  data="getFormData" 
			url="/promotePayRate/listRolePayRateDetail.do"
			chart.xAxisFormatter="formatShortDate" 
			chart.yAxisSymbols="%" 
			chart.type="line" />
			
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">日期</th>
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
	{{/affilDetail}}

</div>
