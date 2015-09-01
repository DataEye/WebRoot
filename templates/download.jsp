<%@ page language="java" contentType="text/html; charset=utf-8"%>
{{#if url}}
<a href="javascript:;" class="btn btn-icon" title="下载" 
	decorator="cleanmenu: {{id ? 'download-' + id : 'download'}}"
	on-click="generateReport">
	<i class="fa fa-download"></i>
</a>
{{#isOpen}}
<div class="tooltip fade bottom in download-box">
	<div class="tooltip-arrow"></div>
	<div class="tooltip-inner">
		{{#if loading}}
		<i class="fa fa-spinner fa-pulse"></i>
		正在提交下载任务，请稍候...
		{{/if}}

		{{#if generated}}
		下载任务已提交,请前往<a class="blue-light" target="_blank" href="#/settings/download">下载中心</a>查看进度。
		{{/if}}

		{{#if empty}}
		数据为空
		{{/if}}
	</div>
</div>
{{/isOpen}}
{{/if}}
