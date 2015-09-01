<%@ page language="java" contentType="text/html; charset=utf-8"%>
<div hidden={{!list.length > 0}} class="panel panel-primary result">
	<div class="panel-body">
		{{#list}}
		<div class="select-result">
			<span class="select-result-title">{{title}}</span>
			<span class="select-result-content clearfix">
				{{#selected}}
				<a href="javascript:;" on-click="removeFromSelected" class="btn btn-default btn-xs">
					<font>{{label}}</font>
					<span class="fa fa-close-custom"></span>
				</a>
				{{/selected}}
			</span>
		<div>
		{{/list}}
	</div>
</div>