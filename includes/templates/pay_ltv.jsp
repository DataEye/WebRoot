<%@ page language="java" contentType="text/html; charset=utf-8" %>
<div class="content-head clearfix">
  <filter selected={{dMax}} max="{{dMax}}" min="{{dMin}}" today="{{dToday}}"
    disableResource="1" suffix="{{suffix}}" disableApp="1" disableCountry="1" disableArea="1"
    urlSettings="{{filterSettings}}" />
</div>

<div class="content-body">
  <panel title="玩家LTV趋势" isTable="false" id="trend" indexes="">
    <config ref="tabs.0" name="day" label="按日统计" data="getFormData" 
		url="/promoteLtv/listDayLtvTrend.do"
		chart.titleFormatter="formatShortDate" 
		chart.type="line" />
      
    <config ref="tabs.1" name="week" label="按周统计" data="getFormData" 
		url="/promoteLtv/listWeekLtvTrend.do" 
		chart.titleFormatter="formatShortDate" 
		chart.type="line" />
      
    <config ref="tabs.2" name="month" label="按月统计" data="getFormData" 
		url="/promoteLtv/listMonthLtvTrend.do" 
		chart.titleFormatter="formatShortDate" 
		chart.type="line" />
    <!-- 这个模板会传到datagrid组件内部 -->
    {{#partial datagrid}}
    <table class="table-single">
      <thead>
        <tr>
          <th>
          	日期
          </th>
          <th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
          <th class="datagrid-sort" on-click="sortBy:z0">{{datatitle.z0}}</th>
          <th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
          <th class="datagrid-sort" on-click="sortBy:z1">{{datatitle.z1}}</th>
        </tr>
      </thead>
      <tbody>
        {{#datalist}}
        <tr>
          <td>{{x}}</td>
          <td>{{y0}}</td>
          <td>{{z0}}</td>
          <td>{{y1}}</td>
          <td>{{z1}}</td>
        </tr>
        {{/datalist}}
      </tbody>      
    </table>
    {{/partial}}
  </panel>
  
  <panel title="流量来源对比" isTable="false" id="source" indexes="">
    <config ref="tabs.0" name="channel" label="渠道" data="getFormData" 
		url="/promotePayRate/listChannelPayRate.do"
		chart.type="line" 
		chart.types="column" 
		chart.group.0.index="0" 
		chart.group.0.tipsValue.0.name="t0"
		chart.switchVar="sourceDetail" 
		chart.childID="sourceDetail" />
      
    <config ref="tabs.1" name="country" label="国家" data="getFormData" 
		url="/promotePayRate/listCountryPayRate.do"
		chart.type="line" 
		chart.types="column" 
		chart.group.0.index="0" 
		chart.group.0.tipsValue.0.name="t0" 
		chart.switchVar="sourceDetail" 
		chart.childID="sourceDetail" />
	
    <!-- 这个模板会传到datagrid组件内部 -->
    {{#partial datagrid}}
    <table class="table-single">
      <thead>
        <tr>
          <th>
            {{tabName === 'channel' ? '渠道' : ''}}
            {{tabName === 'country' ? '国家' : ''}}
            {{tabName === 'city' ? '城市' : ''}}
          </th>
          <th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
          <th class="datagrid-sort" on-click="sortBy:t0">{{datatitle.t0}}</th>
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

	{{#sourceDetail}}
	<panel detail="true" title="{{title}}" id="sourceDetail" isTable="false" hideTabs="1">
		<config name="channel" label="channel" download="false" 
			url="/promotePayRate/listDayPayRate.do" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" />
		
		<config name="country" label="country" download="false" 			
			url="/promotePayRate/listCountryPayRateDetail.do" 
			chart.xAxisFormatter="formatShortDate" 
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
			  <td>{{y0}}</td>
			</tr>
			{{/datalist}}
		  </tbody>      
		</table>
		{{/partial}}
	</panel>
	{{/sourceDetail}}

  <panel title="LTV对比" isTable="false" indexes="">
    <config ref="tabs.0" name="region" label="区服" data="getFormData" 
		url="/promoteLtv/listDayLtvTrendByRegion.do"
		chart.type="line" 
		chart.types="column"
		chart.switchVar="ltvDetail" 
		chart.childID="ltvDetail" />
      
    <config ref="tabs.1" name="version" label="版本" data="getFormData" 
		url="/promoteLtv/listDayLtvTrendByVersion.do"
		chart.type="line" 
		chart.types="column"
		chart.switchVar="ltvDetail" 
		chart.childID="ltvDetail" />
      
    <config ref="tabs.2" name="role" label="角色" data="getFormData" 
		url="/promoteLtv/listDayLtvTrendByRole.do" 
		chart.type="pie" 
		chart.types="pie" 
		chart.switchVar="ltvDetail" 
		chart.childID="ltvDetail" />
    <!-- 这个模板会传到datagrid组件内部 -->
    {{#partial datagrid}}
    <table class="table-single">
      <thead>
        <tr>
          <th>
            {{tabName === 'region' ? '区服' : ''}}
            {{tabName === 'version' ? '版本' : ''}}
            {{tabName === 'role' ? '角色' : ''}}
          </th>
          <th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
          <th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
          <th class="datagrid-sort" on-click="sortBy:t0">{{datatitle.t0}}</th>
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

	{{#ltvDetail}}
	<panel detail="true" title="{{title}}" id="ltvDetail" isTable="false" hideTabs="1">
		<config name="region" label="region" download="false" 
			url="/promoteLtv/listDayLtvTrendByRegionDetail.do" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" 
			chart.types="column" />
		
		<config name="version" label="version" download="false"
			url="/promoteLtv/listDayLtvTrendByVersionDetail.do" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" 
			chart.types="column" />
		
		<config name="role" label="role" download="false" 
			url="/promoteLtv/listDayLtvTrendByRoleDetail.do" 
			chart.xAxisFormatter="formatShortDate" 
			chart.type="line" 
			chart.types="aeraspline" />
    <!-- 这个模板会传到datagrid组件内部 -->
    {{#partial datagrid}}
    <table class="table-single">
      <thead>
        <tr>
          <th class="datagrid-sort" on-click="sortBy:x">日期</th>
          <th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
          <th class="datagrid-sort" on-click="sortBy:t0">{{datatitle.t0}}</th>
        </tr>
      </thead>
      <tbody>
        {{#datalist}}
        <tr>
          <td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
          <td>{{y0}}</td>
          <td>{{t0}}</td>
        </tr>
        {{/datalist}}
      </tbody>      
    </table>
    {{/partial}}
  </panel>
  {{/ltvDetail}}
</div>
