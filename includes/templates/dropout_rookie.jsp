<%@ page language="java" contentType="text/html; charset=utf-8" %>
<div class="content-head clearfix">
  <filter start="{{dStart}}" end="{{dEnd}}" max="{{dMax}}" min="{{dMin}}" today="{{dToday}}"
    disableResource="1" suffix="{{suffix}}" disableApp="1" disableCountry="1" disableArea="1"
    urlSettings="{{filterSettings}}" />
</div>

<div class="content-body">
  <panel title="新手停滞" isTable="false" indexes="">
    <config ref="tabs.0" name="rookie" label="新手停滞" data="getFormData" 
		url="/newbieGuide/listLostUser.do"
        chart.type="line" chart.types="column" />
    <div class="model-footer">
      
      <div class="col-md-12">
        用户获取成本：
      </div>
      <div class="col-md-9">
        <slider max="100" style="lose" min="1" step="1" value="5" width="100%"/>		
      </div>    
      <div class="col-md-3">
		<div class="btn btn-warning btn-block btn-custom-lose">
			<span class="pull-left">损失</span>
			<span class="pull-left split"></span>
			<span class="pull-left value">￥{{totalUserCost}}</span>
		</div>
      </div>
      <div style="clear: both;"></div>
    </div>
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
        <td>{{x}}</td>
        <td>{{y0}}</td>
        <td>{{y1}}</td>
        <td>{{formatPercentage(y2)}}</td>
      </tr>
      {{/datalist}}
      </tbody>
    </table>
    {{/partial}}
  </panel>

  <panel title="流量来源" isTable="false" id="source" indexes="">
    <config ref="tabs.0" name="channel" label="渠道" data="getFormData" 
		url="/newbieGuide/listLostUserByChannel.do"
		formatters=",,formatPercentage" 
		chart.type="line" 
		chart.types="column,column,spline" 
		chart.yAxisSymbols=",,%" 
		chart.yAxisRightIndexes="2" 		
		chart.switchVar="allikaDetail" 
		chart.childID="allikaDetail" />
      
    <config ref="tabs.1" name="country" label="国家" data="getFormData" 
		url="/newbieGuide/listLostUserByCountry.do" 
		formatters=",,formatPercentage" 
		chart.type="line" 
		chart.types="column,column,spline" 
		chart.switchVar="allikaDetail" 
		data="getFormData" />
      
    <!--<config ref="tabs.2" name="city" label="城市" 
		url="/newbieGuide/listLostUserByCity.do" 
		chart.type="line" 
		chart.types="column" 
		chart.suffix="formatPercentage" 
		chart.switchVar="allikaDetail" 
		data="getFormData" />-->
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
          <th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
		  <th class="datagrid-sort" on-click="sortBy:y2">{{datatitle.y2}}</th>
        </tr>
      </thead>
      <tbody>
        {{#datalist}}
        <tr>
          <td>{{x}}</td>
          <td>{{y0}}</td>
          <td>{{y1}}</td>
		  <td>{{formatPercentage(y2)}}</td>
        </tr>
        {{/datalist}}
      </tbody>      
    </table>
    {{/partial}}
  </panel>
  
  {{#allikaDetail}}
  <panel detail="true" title="{{title}}" id="allikaDetail" isTable="false" hideTabs="1">
    <config name="channel" label="channel" download="false" data="getFormData" 
		chart.xAxisFormatter="formatShortDate"
		url="/promoteLtv/listDayLtvTrend.do" 
		chart.type="line" 
		chart.types="column" />
	
	<config name="country" label="country" download="false" data="getFormData" 
		chart.xAxisFormatter="formatShortDate"
		url="/promoteLtv/listDayLtvTrendByCountryDetail.do" 
		chart.type="line" 
		chart.types="column" />
	
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
				<td>{{datalist[i][label]}}</td>
			{{/}}
        </tr>
        {{/datalist}}
      </tbody>      
    </table>
    {{/partial}}
  </panel>
  {{/allikaDetail}}

	<panel title="停滞对比" isTable="false" id="stand" indexes="">
		<config ref="tabs.0" name="region" label="区服" data="getFormData" 
			url="/newbieGuide/listLostUserByRegion.do" 
			formatters=",,formatPercentage" 
			chart.type="line" 
			chart.types="column,column,spline" 
			chart.yAxisSymbols=",,%" 
			chart.yAxisRightIndexes="2" 
			chart.switchVar="standeDetail" 
			chart.childID="standeDetail" />
      
		<config ref="tabs.1" name="version" label="版本" data="getFormData" 
			url="/newbieGuide/listLostUserByVersion.do" 
			formatters=",,formatPercentage" 
			chart.type="line" 
			chart.types="column,column,spline" 
			chart.yAxisSymbols=",,%" 
			chart.yAxisRightIndexes="2" 		
			chart.switchVar="standeDetail" 
			chart.childID="standeDetail" />
      
		<config ref="tabs.2" name="role" label="角色" data="getFormData" 
			url="/newbieGuide/listLostUserByRole.do" 
			formatters=",formatPercentage" 
			chart.type="pie" 
			chart.types="pie" 	
			chart.switchVar="standeDetail" 
			chart.childID="standeDetail" />
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
				<th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
				<th class="datagrid-sort" on-click="sortBy:y2">{{datatitle.y2}}</th>
			</tr>
			</thead>
			<tbody>
			{{#datalist}}
			<tr>
				<td>{{x}}</td>
				<td>{{y0}}</td>
				<td>{{y1}}</td>
				<td>{{formatPercentage(y2)}}</td>
			</tr>
			{{/datalist}}
			</tbody>      
		</table>
		{{/partial}}
	</panel>

   {{#standeDetail}}
	<panel detail="true" title="{{title}}" id="standeDetail" isTable="false" hideTabs="1">
		<config name="region" label="region" download="false" data="getFormData" 
			url="/newbieGuide/listLostUserByChannelDetail.do" 
			formatters=",,formatPercentage" 
			chart.type="line" 
			chart.types="column,column,spline" 
			chart.yAxisSymbols=",,%" 
			chart.yAxisRightIndexes="2" />
		
		<config name="version" label="version" download="false" data="getFormData" 
			url="/newbieGuide/listLostUserByVersionDetail.do" 
			formatters=",,formatPercentage" 
			chart.type="line" 
			chart.types="column,column,spline" 
			chart.yAxisSymbols=",,%" 
			chart.yAxisRightIndexes="2" />
		
		<config name="role" label="role" download="false" data="getFormData" 
			url="/newbieGuide/listLostUserByRoleDetail.do" 
			formatters=",,formatPercentage" 
			chart.type="line" 
			chart.types="column,column,spline" 
			chart.yAxisSymbols=",,%" 
			chart.yAxisRightIndexes="2" />
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
			<tr>
				<th class="datagrid-sort" on-click="sortBy:x">步骤</th>
				<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
				<th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
				<th class="datagrid-sort" on-click="sortBy:y2">{{datatitle.y2}}</th>
			</tr>
			</thead>
			<tbody>
			{{#datalist}}
			<tr>
				<td>{{x}}</td>
				<td>{{y0}}</td>
				<td>{{y1}}</td>
				<td>{{formatPercentage(y2)}}</td>
			</tr>
			{{/datalist}}
		</tbody>      
		</table>
		{{/partial}}
	</panel>
	{{/standeDetail}}

</div>
