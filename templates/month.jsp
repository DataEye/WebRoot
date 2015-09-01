<%@ page language="java" contentType="text/html; charset=utf-8"%>
<div class="btn-group" decorator="cleanmenu:{{id? 'month' + id : 'month'}}">
	<button type="button" class="btn btn-default"
		title="{{multiple ? selected.join(', ') : ''}}"
		on-click="openPanel">
		{{#if multiple}}
			{{start.year}}-{{formatMonth(start.month)}}~{{end.year}}-{{formatMonth(end.month)}}
		{{else}}
			{{year}}-{{formatMonth(month)}}
		{{/if}}
	</button>

	<button type="button" class="btn btn-default dropdown-toggle" on-click="openPanel">
		<span class="caret"></span>
	</button>

	{{#if isOpen}}
	<ul class="dropdown-menu" role="menu" style="display: block;">
		<li style="text-align: center">
			<a class="pull-left" on-click="changeYear:-1" href="javascript:;">
				<i class="fa fa-chevron-left"></i>
			</a>

			<span>{{title}}</span>

			{{#if title < maxYear}}
			<a class="pull-right" href="javascript:;" on-click="changeYear:1">
				<i class="fa fa-chevron-right"></i>
			</a>
			{{else}}
			<a class="pull-right" href="javascript:;">
				<i class="fa fa-chevron-right"></i>
			</a>
			{{/if}}

			<div class="clearfix"></div>
		</li>

		<li class="divider"></li>

		<li>
			<div class="col-md-12">
				{{#monthList}}
					<div class="col-md-3 {{isSelected(title, .) ? 'selected' : ''}}">
						<a href="javascript:;" on-click="select">{{.}}</a>
					</div>
				{{/monthList}}
			</div>
		</li>

		{{#if multiple}}
		<li class="divider"></li>
		<li>
			<div class="col-md-12 text-center">
				<button class="btn btn-xs btn-primary" on-click="savePanel">确定</button>
				<button class="btn btn-xs btn-default" on-click="closePanel">取消</button>
			</div>
		</li>
		{{/if}}
	</ul>
	{{/if}}
</div>
