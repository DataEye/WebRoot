<%@ page language="java" contentType="text/html; charset=utf-8" %>
<div class="content-head clearfix">
  <filter start="{{dStart}}" end="{{dEnd}}" max="{{dMax}}" min="{{dMin}}" today="{{dToday}}"
    disableResource="1" suffix="{{suffix}}" disableApp="1" disableCountry="1" disableArea="1"
    urlSettings="{{filterSettings}}" />
	
	<div class="row">
	流失条件：连续 
	<dropdown id="main" items="{{days}}" value="{{day}}" />
	天未登录的玩家视为流失
	</div>
</div>
<div class="content-body">

	<panel title="流失分析" isTable="false" indexes="">
		<config ref="tabs.0" name="dropout" label="流失" data="getFormData"
			url="/churnAnalysis/listChurn.do" 
			chart.type="line" />
		
		<config ref="tabs.1" name="dropin" label="回流" data="getFormData" 
			url="/churnAnalysis/listReturn.do" 
			chart.type="line" />

		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
		  <thead>
		  <tr>
			<th>日期</th>
			<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
			<th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
			<th class="datagrid-sort" on-click="sortBy:y2">{{datatitle.y2}}</th>
			{{#if tabName === 'dropout'}}
			<th class="datagrid-sort" on-click="sortBy:y2">{{datatitle.y3}}</th>
			{{/if}}
		  </tr>
		  </thead>
		  <tbody>
		  {{#datalist}}
		  <tr>
			<td>{{formtatShortDate(x)}}</td>
			<td>{{y0}}</td>
			<td>{{y1}}</td>
			<td>{{y2}}</td>
			{{#if tabName === 'dropout'}}
			<td>{{formatPercentage(y3)}}</td>
			{{/if}}
		  </tr>
		  {{/datalist}}
		  </tbody>
		</table>
		{{/partial}}
	</panel>

  <panel title="流失时间节点" isTable="false" indexes="">
    <config ref="tabs.0" name="days" label="累计时间天" data="getFormData" 
		url="/churnAnalysis/listGameDays.do"
        chart.type="line" chart.types="column" />
	
    <config ref="tabs.1" name="hours" label="累计时长" data="getFormData" 
		url="/churnAnalysis/listGameHours.do"
        chart.type="line" chart.types="column" />

    <!-- 这个模板会传到datagrid组件内部 -->
    {{#partial datagrid}}
    <table class="table-single">
      <thead>
      <tr>
        <th>角色</th>
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
        <td>{{formatPercentage(y1)}}</td>
      </tr>
      {{/datalist}}
      </tbody>
    </table>
    {{/partial}}
  </panel>

  <!--panel title="流失系统节点" isTable="false" indexes="">
    <config ref="tabs.0" name="system" label="角色等级" url="/churnAnalysis/listGameSystem.do"
            chart.type="line" chart.types="columns" chart.data="getFormData" />

    {{#partial datagrid}}
    <table class="table-single">
      <thead>
      <tr>
        <th>角色</th>
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
        <td>{{formatPercentage(y1)}}</td>
      </tr>
      {{/datalist}}
      </tbody>
    </table>
    {{/partial}}
  </panel-->
</div>
