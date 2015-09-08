<%@ page language="java" contentType="text/html; charset=utf-8"%>
<div class="rdatagrid">
	{{#if options}}
	<div class="rwrapper {{options.leftColumns || options.rightColumns ? 'fixed-cols' : ''}}">
		{{#ajaxError}}
			<div class="rerror text-center">
				<i class="fa fa-exclamation-circle"></i>
				<div>
					请求出错，请稍后重试 <br>
					({{statusCode}}:{{content || '网络连接错误'}} - {{id}})
				</div>
			</div>
		{{else}}
			{{#if datalist}}
				{{#if isLoading}}
				<div class="mask-loading">
					<div class="rloading text-center">
						<i class="fa fa-spinner fa-pulse"></i>
						<div>正在加载，请稍候...</div>
					</div>
				</div>
				{{/if}}
				
				{{#if options.leftColumns}}
				<div class="rleftcols">
					{{>content}}
				</div>
				{{/if}}

				<div class="rcols">
					{{>content}}
				</div>

				{{#if options.rightColumns}}
				<div class="rrightcols">
					{{>content}}
				</div>
				{{/if}}
			{{else}}
				{{#if datalist == null}}
					<div class="rloading text-center">
						<i class="fa fa-spinner fa-pulse"></i>
						<div>正在加载，请稍候...</div>
					</div>
				{{else}}
					<div class="rempty text-center">
						<i class="fa fa-exclamation-circle"></i>
						<div>暂无数据</div>
					</div>
				{{/if}}
			{{/if}}
		{{/ajaxError}}
	</div>
	{{/if}}

	{{! 这个需要放在外层，js会用到}}
	<pager></pager>
</div>
