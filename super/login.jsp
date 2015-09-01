<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@ include file="../includes/header.jsp"%>

<div class="wrapper-top text-center">
	<h2 class="blue">DataEye渠道版</h2>
</div>

<div id="form_login">
	<div class="rloading text-center" style="padding:122px 0 182px 0;">
		<i class="fa fa-spinner fa-pulse"></i>
		<div>正在加载，请稍候...</div>
	</div>
</div>


<script type="text" id="form_login_tmpl">
<form class="unique-form" on-submit="login">
	<fieldset>
		<legend>登录</legend>

		<div class="form-group form-group-big">
			<textinput required maxlength="60" type="email" name="userID"
				placeholder="电子邮箱" tip="请输入Email地址" />
		</div>

		<div class="form-group form-group-big">
			<textinput required minlength="6" maxlength="16" type="password" name="password"
				placeholder="密码" tip="请输入6-16位密码" />
		</div>

		<div class="form-group form-group-big" style="position:relative;">
			<textinput required type="text" name="companyName" value="{{companyName}}"
				placeholder="公司名称" tip="请输入输入公司名称" />
			{{#isResults}}
			<div class="list-group btn-block" style="position:absolute">
				{{#company}}
  				<a href="javascript:;" on-click="selectResults" class="list-group-item">{{label}}</a>
				{{/company}}
			</div>
			{{/isResults}}
		</div>

		<div class="form-group">
			<button type="submit" disabled class="btn btn-primary btn-block" disabled="{{disableSubmit}}">
				{{#disableSubmit}}
				<i class="fa fa-spinner fa-pulse"></i>
				正在登录，请稍候...
				{{else}}
				立即登录
				{{/disableSubmit}}
			</button>
		</div>

		<div class="form-group">
			还没有DataEye的账号？请<a target="_blank" href="<%=CONTEXT_PATH%>/reg.jsp">立即注册</a>
		</div>

	</fieldset>
</form>
</script>

<%@ include file="../includes/footer.jsp"%>

<script>
	App.i18n = {
		ok: "登录成功"
	}
	require(['app/super-login'])
</script>

