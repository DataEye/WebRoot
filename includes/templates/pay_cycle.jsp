<%@ page language="java" contentType="text/html; charset=utf-8" %>
<div class="content-head clearfix">
  <filter start="{{dStart}}" end="{{dEnd}}" max="{{dMax}}" min="{{dMin}}" today="{{dToday}}"
		disableResource="1" suffix="{{suffix}}" disableApp="1" disableCountry="1" disableArea="1" urlSettings="{{filterSettings}}" />
</div>

<div class="content-body">
	<div class="model">
		<h3 class="model-head">
			付费周期追踪			
		</h3>
		<div class="model-body">
			
		</div>
	</div>

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
