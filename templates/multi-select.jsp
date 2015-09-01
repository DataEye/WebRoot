<%@ page language="java" contentType="text/html; charset=utf-8"%>
<div class="filter-content clearfix" decorator="cleanmenu:{{id? 'multi-select' + id : 'multi-select'}}">
	{{#if items}}
	<div class="pull-right panel-search" style="margin-top:-40px;">
		<input type="text" class="form-control"  on-keyup="search" value="{{keyword}}">
	</div>
	{{/if}}
	
	{{#ajaxError}}
	<div class="rerror text-center">
		<i class="fa fa-exclamation-circle"></i>
		<div>
			请求出错，请稍后重试。<br>
			({{statusCode}}:{{content || '网络连接错误'}} - {{id}})
		</div>
	</div>
	{{else}}
		{{#if items != null}}
			{{#items}}
				{{^hide}}
				<a href="javascript:;" class="col-md-3 filter-list {{checked ? 'selected' : ''}}"
					on-click="toggleStatus" title="{{label}}">
					{{#if .checked}}
					<i class="fa fa-{{single ? 'dot-circle-o' : 'check-square'}}"></i>
					{{else}}
					<i class="fa fa-{{single ? 'circle' : 'square'}}-o"></i>
					{{/if}}
					{{label}}
					</a>
				{{/hide}}
			{{else}}
				<div class="col-md-12  filter-list text-center">
					数据为空
				</div>
			{{/items}}

			{{#no_search_result}}
				<div class="col-md-12 filter-list text-center">
					查询结果为空
				</div>
			{{/no_search_result}}
		{{else}}
			<div class="col-md-12  filter-list text-center">
				<div class="rloading text-center">
					<i class="fa fa-spinner fa-pulse"></i>
					<div>正在加载，请稍候...</div>
				</div>
			</div>
		{{/if}}
	{{/ajaxError}}
</div>
