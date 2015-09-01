<%@ page language="java" contentType="text/html; charset=utf-8" %>
<div class="content-head clearfix">
  <filter start="{{dStart}}" end="{{dEnd}}" max="{{dMax}}" min="{{dMin}}" today="{{dToday}}"
    disableResource="1" suffix="{{suffix}}" disableApp="1" disableCountry="1" disableArea="1"
    urlSettings="{{filterSettings}}" />
</div>

<div class="content-body">
  <panel title="流失周期分析" isTable="false" indexes="">
    <config ref="tabs.0" name="region" label="区服流失分布" 
		url="/churnCycleAnalysis/listRegionChurn.do"
        chart.type="line" data="getFormData" />
    <config ref="tabs.1" name="version" label="版本流失分布" 
		url="/churnCycleAnalysis/listVersionChurn.do"
        chart.type="line" data="getFormData" />
    <config ref="tabs.2" name="role" label="角色流失分布" 
		url="/churnCycleAnalysis/listRoleChurn.do"
        chart.type="line" data="getFormData" />

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
</div>
