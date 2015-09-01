<%@ page language="java" contentType="text/html; charset=utf-8"%>
<div class="btn-group dropdown dropdown-select {{isOpen ? 'open' : ''}}"
	decorator="cleanmenu:{{id? 'dropdown' + id : 'dropdown'}}"
	style="display: inline-block;">
	<button class="btn btn-select dropdown-toggle" type="button" on-click="{{items.length ? 'toggleShow' : ''}}">
    {{#items}}
      {{#if .selected}}
        {{#icon}}
          <i class="fa {{icon}}"></i>
        {{/icon}}

        {{label}}
      {{/if}}
    {{else}}
      {{emptyText || '暂无数据'}}
    {{/items}}

    <span class="caret"></span>
	</button>

	{{#isOpen}}
	<ul class="dropdown-menu" style="display: block;min-width: inherit;max-height: 200px; overflow: auto;">
		{{#items:i}}
			<li class="{{selected.value === value ? 'selected-dropdown-menu' : ''}}" on-click="select:{{i}}">
				<a tabindex="-1" href="javascript:;">
					{{#icon}}
					<i class="fa {{icon}}"></i>
					{{/icon}}
					{{label}}
				</a>
			</li>
		{{else}}
			<li class="">
				<a href="javascript:;">
                  {{emptyText || '暂无数据'}}
				</a>
			</li>
		{{/items}}
	</ul>
	{{/isOpen}}
</div>
