<%@ page language="java" contentType="text/html; charset=utf-8"%>
  <div on-click="prevent" class="model {{expand ? 'model-zoom' : ''}} {{detail ? 'model-detail' : ''}}" 
    id={{id}} hidden="{{hidden}}">
    <div class="model-wrap {{detail ? 'bottom' : ''}}">
      {{#detail}}
        <div style="left:{{left}}px" class="arrow"></div>
      {{/detail}}
      <h3 class="model-head">

			{{title}}

			<!-- 指标说明 -->
			{{#if indexes}}
			<span class="help-map">

				<i class="fa fa-question-circle"
					decorator="popover:{{getIndexInfo(indexes.split(','))}}"></i>
			</span>
			{{/if}}
			
			{{#if detail}}
			<!-- 切换视图:表格或者图表 -->
			{{^disableSwitch}}
			<div class="graphical btn-group pull-right">
				<a href="javascript:;" class="btn btn-default btn-xs {{isTable ? '' : 'active'}}" on-click="toggleMode:0">
					<i class="fa fa-area-chart"></i>
				</a>
				<a href="javascript:;" class="btn btn-default btn-xs {{isTable ? 'active' : ''}}" on-click="toggleMode:1">
					<i class="fa fa-table"></i>
				</a>
			</div>
			{{/disableSwitch}}
			{{/if}}
			
			{{^detail}}
			<span class="pull-right" style="position:relative;">
				<!-- 放大 -->
				<a title="{{expand ? '还原' : '全屏'}}" 
					class="btn btn-icon" on-click="modelZoom:{{expand ? '' : 'expand'}}">
					<i class="fa fa-{{expand ? 'compress' : 'expand'}}"></i>
				</a>
				{{^disableDownload}}
				<!-- 下载组件 -->
				<!-- download的url和data根据tabs的配置变化 -->
				<download />
				{{/disableDownload}}
			</span>	
			{{/detail}}		
		</h3>

      <!-- 
			这里tabs.length始终为1，BUG！！！
		-->
      {{#if !hideTabs && tabs[1]}}
      <div class="model-tabs">
        <ul class="nav nav-sm nav-tabs">
          {{#tabs}}
          <li class="{{.selected ? 'active' : ''}}">
            <a href="javascript:;" on-click="viewTab">{{.label}}</a>
          </li>
          {{/tabs}}
        </ul>
      </div>
      {{/if}}

      <div class="model-body">
		    {{#if !hideTabs}} 
          {{#tabs:i}} 
            {{#if .selected && .children}}
            <div class="btn-group-body">
              {{#if style !== 'select'}}
                  <div class="btn-group">
                  {{#children}}
                    <a class="btn btn-sm btn-{{.selected ? 'primary' : 'default'}}" href="javascript:;"
                      on-click="viewTab:{{tabs[i].name}},{{.name}}">
                      {{.label}}
                    </a>
                  {{/children}}
                  </div>
              {{else}}
                <select value="{{subTabName}}" on-change="viewTabBySelect">
                  {{#children}}
                  <option value="{{.name}}">{{.label}}</option>
                  {{/children}}
                </select>
              {{/if}}
            </div>
            {{/if}} 
          {{/tabs}} 
        {{/if}}
        <!-- 概览数据 -->
        {{#if glance}}
        <div class="glance pull-left">
          {{#glance:i}}
            <span>{{k}}</span> 
            {{#if i != (glance.length - 1)}}
              <em>|</em>
            {{/if}} 
            {{#if i == (glance.length - 1)}}
              <em>:</em>
            {{/if}}
          {{/glance}} 
          {{#glance:i}}
            <span class="red">{{format(i, V)}}</span> 
            {{#if i != (glance.length - 1)}}
              <em class="red">|</em>
            {{/if}}
          {{/glance}}
        </div>
        {{/if}} 
        
        {{^detail}}
          <!-- 切换视图:表格或者图表 -->
          {{^disableSwitch}}
          <div class="graphical btn-group pull-right">
            <a href="javascript:;" class="btn btn-default btn-xs {{isTable ? '' : 'active'}}" on-click="toggleMode:0">
              <i class="fa fa-area-chart"></i>
            </a>
            <a href="javascript:;" class="btn btn-default btn-xs {{isTable ? 'active' : ''}}" on-click="toggleMode:1">
              <i class="fa fa-table"></i>
            </a>
          </div>
          {{/disableSwitch}} 
        {{/detail}} 

        <div class="model-table" hidden="{{!isTable}}">
          {{#if gridOptions}}
          <datagrid options="{{gridOptions}}">
            <!-- 外部需要显示指定一个partial id -->
            {{>datagrid}}
          </datagrid>
          {{/if}}
        </div>

        <div class="model-error" hidden="{{isTable}}">
          {{#ajaxError}}
          <div class="rerror text-center">
            <i class="fa fa-exclamation-circle"></i>
            <div>
              请求出错，请稍后重试
              <br> ({{.statusCode}}:{{.content || '网络连接错误'}} - {{.id}})
            </div>
          </div>
          {{else}} 
            {{#emptyChart}}
              <div class="rloading text-center">
                <i class="fa fa-exclamation-circle"></i>
                <div>暂无数据</div>
              </div>
            {{else}}
              <chart /> 
			  {{#total}}
              <pager name="chart" total={{total}} pagesize={{pagesize}} simple="true"></pager>
              {{/total}} 
            {{/emptyChart}} 
          {{/ajaxError}}
        </div>
        {{>content}}
      </div>
    </div>
  </div>