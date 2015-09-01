<%@ page language="java" contentType="text/html; charset=utf-8"%>
<div class="resource-filter-container input-group row"
	decorator="cleanmenu:{{id? 'res-filter' + id : 'res-filter'}}">
  <span class="input-group-addon">{{title}}</span>

  <div class="btn-group">
  	{{#selected:i}}
	  	<span type="button" class="btn resource-filter-item"  on-click="removeFromSelected:{{i}}">
				{{label}}
	  		<i class="fa fa-times"></i>
	  	</span>
  	{{/selected}}

  	<div class="btn-group {{isOpen ? 'open' : ''}}">
			<button type="button" class="btn resource-filter-more dropdown-toggle"  on-click="openPanel">
				{{#if selected}}
					更多
				{{else}}
					请选择{{title}}
				{{/if}}
				<span class="caret"></span>
			</button>

			{{#isOpen}}
		  <div class="dropdown-panel"  style="display: block; left: {{left}}px">
		  	<div class="panel panel-filter panel-{{width}}">
					<div class="panel-heading">
						{{title}}选择
						<span class="tips">(多选)</span>
						<div class="pull-right panel-search">
							<input type="text" class="form-control"  on-keyup="search" value="{{keyword}}">
						</div>
					</div>

					{{#ajaxError}}
					<div class="panel-body">
						<div class="rerror text-center">
							<i class="fa fa-exclamation-circle"></i>
							<div>
								请求出错，请稍后重试。<br>
								({{statusCode}}:{{content || '网络连接错误'}} - {{id}})
							</div>
						</div>
					</div>
					{{else}}
					<div class="panel-body">
						<div class="category-big-list col-md-4">
							<div class="panel-body-th">一级分类</div>
							<div class="pre-scrollable">
								{{#types}}
								<a class="filter-list-block {{.checked?'selected':''}}"
									on-click="showSubMenus" href="javascript:;" title="{{label}}">
									{{#if .checked}}
									<i class="fa fa-caret-right blue"></i>
									{{else}}
									<i class="fa fa-caret-right white"></i>
									{{/if}}
									{{label}}
									</a>
								{{/types}}
							</div>
						</div>
						<div class="category-small-list col-md-4">
							<div class="panel-body-th">二级分类</div>
							<div class="pre-scrollable">
								{{#subTypes}}
								<a class="filter-list-block {{.checked?'selected':''}}"
									on-click="showItems" href="javascript:;" title="{{label}}">
									{{#if .checked}}
									<i class="fa fa-caret-right blue"></i>
									{{else}}
									<i class="fa fa-caret-right white"></i>
									{{/if}}
									{{label}}
								</a>
								{{else}}
								<span class="filter-list-block" href="javascript:;">数据为空</span>
								{{/subTypes}}
							</div>
						</div>
						<div class="results-list col-md-4">
							<div class="panel-body-th">{{title}}列表</div>
							<div class="pre-scrollable">
								{{#if search_result !== null}}
									{{#search_result}}
									<a class="filter-list-block {{.checked?'selected':''}}"
										on-click="syncSearchItemClick" href="javascript:;" title="{{label}}">
										{{#if .checked}}
										<i class="fa fa-check font10 blue"></i>
										{{else}}
										<i class="fa fa-check font10 white"></i>
										{{/if}}
										{{label}}
										</a>
									{{else}}
									<span class="filter-list-block text-center">查询结果为空</span>
									{{/search_result}}
								{{else}}
									{{#items}}
									<a class="filter-list-block {{.checked?'selected':''}}"
										on-click="toggleStatus" href="javascript:;" title="{{label}}">
										{{#if .checked}}
										<i class="fa fa-check font10 blue"></i>
										{{else}}
										<i class="fa fa-check font10 white"></i>
										{{/if}}
										{{label}}
										</a>
									{{else}}
									<span class="filter-list-block text-center">数据为空</span>
									{{/items}}
								{{/if}}
							</div>
						</div>
					</div>

					<div class="panel-foot">
						{{#name}}
						<div class="checkbox">
							<label class="font12">
								<input type="checkbox" checked="{{useLocalStorage}}">记住所选
							</label>
						</div>
						{{/name}}
						<div class="btn-group panel-btn-group">
							<button type="button" class="btn btn-xs btn-primary" on-click="savePanel">
								<i class="fa fa-check-circle"></i> 确定</button>
							<button type="button" class="btn btn-xs btn-default" on-click="closePanel">
								<i class="fa fa-trash-o"></i> 取消</button>
						</div>
					</div>
					{{/ajaxError}}
				</div>
		  </div>
		  {{/isOpen}}

		</div>
	</div>
</div>
