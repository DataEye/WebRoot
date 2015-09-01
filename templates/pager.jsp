<%@ page language="java" contentType="text/html; charset=utf-8"%>
<!-- 用total判断某些情况会导致dropdown销毁的时候出现异常 -->
<div class="rpager" hidden="{{total < 10}}">
	
	{{#simple}}
		<div class="rpager-pagination-simple pull-left">
			<ul class="pagination">
				{{#if pageid == 1}}
				<li onselectstart="return false" class="prev pull-left disabled">
					<i class="fa fa-caret-left"></i>
				</li>
				{{/if}}

				{{#if pageid != 1}}
				<li onselectstart="return false" class="prev pull-left" on-click="goto:{{pageid - 1}}">
					<i class="fa fa-caret-left"></i>
				</li>
				{{/if}}				
				
				<li class="pull-left">{{pageid}}/{{totalPage}}</li>				

				{{#if pageid == totalPage}}
				<li onselectstart="return false" class="next pull-left disabled">
					<i class="fa fa-caret-right"></i>
				</li>
				{{/if}}

				{{#if pageid != totalPage}}
				<li onselectstart="return false" class="next pull-left" on-click="goto:{{pageid + 1}}">
					<i class="fa fa-caret-right"></i>
				</li>
				{{/if}}
			</ul>
		</div>
	{{/simple}}

	{{^simple}}
	<div class="rpager-switch pull-left form-group-xs">
		<span>每页显示</span>
		<dropdown items="{{pagesizes}}" value="{{pagesize}}"></dropdown>

		<span>条记录</span>(共{{totalPage}}页，{{total}}条记录)
	</div>	

	<div class="rpager-pagination pull-right">
		<ul class="pagination">
			{{#if pageid == 1}}
			<li class="first disabled">
				<a href="javascript:;" class="disabled">
					<i class="fa fa-angle-double-left fa-lg"></i>
				</a>
			</li>
		  <li class="prev disabled">
				<a href="javascript:;">
					<i class="fa fa fa-angle-left fa-lg"></i>
				</a>
			</li>
			{{/if}}

			{{#if pageid != 1}}
			<li class="first">
				<a href="javascript:;" on-click="goto:1">
					<i class="fa fa-angle-double-left fa-lg"></i>
				</a>
			</li>
			<li class="prev">
				<a href="javascript:;" on-click="goto:{{pageid - 1}}">
					<i class="fa fa fa-angle-left fa-lg"></i>
				</a>
			</li>
			{{/if}}

			{{#pages}}
			<li class="{{pageid === . ? 'active' : ''}}">
				<a href="javascript:;"  on-click="goto:{{.}}">{{.}}</a>
			</li>
			{{/pages}}

			{{#if pageid == totalPage}}
			<li class="next disabled">
				<a href="javascript:;">
					<i class="fa fa fa-angle-right fa-lg"></i>
				</a>
			</li>
			<li class="last disabled">
				<a href="javascript:;">
					<i class="fa fa-angle-double-right fa-lg"></i>
				</a>
			</li>
			{{/if}}

			{{#if pageid != totalPage}}
			<li class="next">
				<a href="javascript:;"  on-click="goto:{{pageid + 1}}">
					<i class="fa fa-angle-right fa-lg"></i>
				</a>
			</li>
			<li class="last">
				<a href="javascript:;" on-click="goto:{{totalPage}}">
					<i class="fa fa-angle-double-right fa-lg"></i>
				</a>
			</li>
			{{/if}}
		</ul>
	</div>
	{{/simple}}

	<div style="clear: both;"></div>
</div>
