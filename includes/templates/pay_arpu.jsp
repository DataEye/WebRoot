<%@ page language="java" contentType="text/html; charset=utf-8" %>
<div class="content-head clearfix">
  <filter start="{{dStart}}" end="{{dEnd}}" max="{{dMax}}" min="{{dMin}}" today="{{dToday}}"
    disableResource="1" suffix="{{suffix}}" disableApp="1" disableCountry="1" disableArea="1"
    urlSettings="{{filterSettings}}" />
</div>

<div class="content-body">
  <panel title="付费分布" isTable="false" indexes="">
    <config ref="tabs.0" name="payDis" label="付费分布" data="getFormData" 
		url="/promoteArpu/listPayDistribution.do" 
		chart.xAxisFormatter="formatShortDate" 
		chart.yAxisRightIndexes="2" 
		chart.type="line" 
		chart.types="column,column,areaspline" />
		
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
			<th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y2}}</th>
        </tr>
      </thead>
      <tbody>
        {{#datalist}}
        <tr>
			<td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
			<td>{{y0}}</td>
			<td>{{y1}}</td>
			<td>{{y2}}</td>
        </tr>
        {{/datalist}}
      </tbody>      
    </table>
    {{/partial}}
  </panel>
  
  <panel title="ARPU/ARPPU分布" isTable="false" indexes="">
    <config ref="tabs.0" name="day" label="日" data="getFormData" 
		url="/promoteArpu/listDayArpuArppu.do" 
		chart.xAxisFormatter="formatShortDate"
		chart.type="line" 
		chart.types="areaspline,areaspline,areaspline" />
      
    <config ref="tabs.1" name="week" label="周" data="getFormData" 
		url="/promoteArpu/listWeekArpuArppu.do" 
		chart.xAxisFormatter="formatShortDate" 
		chart.type="line" 
		chart.types="areaspline,areaspline,areaspline" />
		
	<config ref="tabs.2" name="month" label="月" data="getFormData" 
		url="/promoteArpu/listMonthArpuArppu.do" 
		chart.xAxisFormatter="formatShortDate" 
		chart.type="line" 
		chart.types="areaspline,areaspline,areaspline" />
	
    <!-- 这个模板会传到datagrid组件内部 -->
    {{#partial datagrid}}
    <table class="table-single">
		<thead>
			<tr>
				<th>日期</th>
				<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
				<th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
				<th class="datagrid-sort" on-click="sortBy:y2">{{datatitle.y2}}</th>
			</tr>
		</thead>
		<tbody>
        {{#datalist}}
        <tr>
			<td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
			<td>{{y0}}</td>
			<td>{{y1}}</td>
			<td>{{y2}}</td>
        </tr>
        {{/datalist}}
		</tbody>      
    </table>
    {{/partial}}
  </panel>


  <panel title="付费能力对比" isTable="false" indexes="">
    <config ref="tabs.0" name="channel" label="渠道" data="getFormData" 
		url="/promoteArpu/listChannelArpuArppu.do" 
		chart.type="line" 
		chart.types="column,column" 
		chart.switchVar="abilityDetail" 
		chart.childID="abilityDetail" />
      
    <config ref="tabs.1" name="country" label="国家" data="getFormData" 
		url="/promoteArpu/listCountryArpuArppu.do" 
		chart.type="line" 
		chart.types="column,column" 
		chart.switchVar="abilityDetail" 
		chart.childID="abilityDetail" />
		
	<config ref="tabs.2" name="region" label="区服" data="getFormData" 
		url="/promoteArpu/listRegionArpuArppu.do" 
		chart.type="line" 
		chart.types="column,column" 
		chart.switchVar="abilityDetail" 
		chart.childID="abilityDetail" />
		
	<config ref="tabs.3" name="role" label="角色" data="getFormData" 
		url="/promoteArpu/listRoleArpuArppu.do" 
		chart.type="line" 
		chart.types="column,column" 
		chart.switchVar="abilityDetail" 
		chart.childID="abilityDetail" />
	
    <!-- 这个模板会传到datagrid组件内部 -->
    {{#partial datagrid}}
    <table class="table-single">
      <thead>
        <tr>
          <th>
            {{tabName === 'channel' ? '渠道' : ''}}
            {{tabName === 'country' ? '国家' : ''}}
			{{tabName === 'region' ? '区服' : ''}}
			{{tabName === 'role' ? '角色' : ''}}
          </th>
          <th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
          <th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
        </tr>
      </thead>
      <tbody>
        {{#datalist}}
        <tr>
          <td>{{x}}</td>
          <td>{{y0}}</td>
          <td>{{y1}}</td>
        </tr>
        {{/datalist}}
      </tbody>      
    </table>
    {{/partial}}
  </panel>
  
	{{#abilityDetail}}
	<panel detail="true" title="{{title}}" id="abilityDetail" isTable="false" hideTabs="1">
		<config name="channel" label="channel" download="false" data="getFormData"
			url="/promoteArpu/listDayArpuArppu.do" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" />
			
		<config name="country" label="country" download="false"  data="getFormData" 
			url="/promoteArpu/listCountryArpuArppuDetail.do"
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" />
		
		<config name="region" label="region" download="false"  data="getFormData" 
			url="/promoteArpu/listDayArpuArppu.do"
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" />
			
		<config name="role" label="role" download="false"  data="getFormData" 
			url="/promoteArpu/listRoleArpuArppuDetail.do"
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" />
			
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">日期</th>
					<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
					<th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
				</tr>
			</thead>
			<tbody>
				{{#datalist}}
				<tr>
					<td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
					<td>{{y1}}</td>
					<td>{{y2}}</td>
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	{{/abilityDetail}}
    
</div>
