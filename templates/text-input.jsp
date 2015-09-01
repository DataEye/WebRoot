<%@ page language="java" contentType="text/html; charset=utf-8"%>
<div on-click="{{disabled ? '' : 'focus'}}"
	class="de-text-box {{focus?'de-text-box-focus ':''}}
	{{! 只有输入了值以后才切换到输入是否合法状态}}
	{{#value}}
		 {{valid && !error ?' de-text-box-valid ':' de-text-box-invalid '}}
	{{/value}}
">
	{{^value}}
	<span class="de-text-label">{{placeholder}}</span>
	{{/value}}

	{{#if disabled}}
	<input type="{{type == 'password' ? 'password' : 'text'}}" disabled
		class="de-text-input" value="{{value}}" />
	{{else}}
	<input type="{{type == 'password' ? 'password' : 'text'}}"
		class="de-text-input" value="{{value}}"
		on-focus="focus" on-keyup="onInput" on-blur="onBlur" />
	{{/if}}


	{{^disabled}}
		{{#required}}
			{{! 初次载入时不展示信息}}
			{{#clicked}}
				{{! 必填项目，未输入或者输入非法时展示提示}}
				{{#if !value || !valid || error}}
					<span class="de-text-tips {{position}}">{{error || tip}}</span>
				{{/if}}
			{{/clicked}}
		{{else}}
			{{! 选填项目，默认不提示，输入值以后才展示}}
			{{#value}}
				{{#if !valid || error}}
					<span class="de-text-tips {{position}}">{{error || tip}}</span>
				{{/if}}
				{{/value}}
		{{/required}}
	{{/disabled}}
</div>
