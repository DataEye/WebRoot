<%@page import="com.dataeye.ga.utils.ApplicationContextUtil"%>
<%@page import="com.dataeye.ga.vo.app.AppInfo"%>
<%@page import="com.dataeye.ga.vo.user.User"%>
<%@page import="com.dataeye.ga.utils.ReadManifest"%>
<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%
	// 是否开发环境，决定了资源的加载方式
	Boolean DEBUG = request.getHeader("Host").indexOf("g.dataeye.com") == -1;
	// Boolean DEBUG = false;
	String CONTEXT_PATH = request.getContextPath();
//	Tracker tracker = new Tracker();
	// 静态资源目录
	String STATIC_DIR = DEBUG ? CONTEXT_PATH + "/assets" : CONTEXT_PATH + "/assets-build";
	// 资源原件md5信息
	String MANIFEST_CONTENT = ReadManifest.getMap();
	String lang = "zh";
	//因为统一登录尚未完成，这里手工设置用户信息代替登录
	Boolean isLogin = true;
	User user = new User();
	user.setUID(1);
	user.setUserID("demo@dataeye.com");
	user.setUserName("demo");
	user.setCompanyName("dataeye");
	user.setCreateTime(1433088000);

%>
<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="renderer" content="webkit">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title>APP游戏分析平台</title>
		<link rel="shortcut icon" href="https://g.dataeye.com/resources/images/favicon.ico" />
		<link rel="stylesheet" href="<%=ReadManifest.getKey("/css/core.css", STATIC_DIR, DEBUG)%>" />
		<link rel="stylesheet" href="<%=ReadManifest.getKey("/css/combined.css", STATIC_DIR, DEBUG)%>" />
		<script>
		var App = {
			lang: '<%=lang%>',
			// 是否是非标准浏览器（< IE 9）
			outdated: !window.JSON && !window.addEventListener,
			// web根目录
			contextPath: '<%=CONTEXT_PATH%>',
			// 静态资源目录
			staticPath: '<%=STATIC_DIR%>',
			spa: false,
			// location.search中包含的查询字符串
			params: {},
			// location.hash 中包含的查询字符串
			hashParams: {},
			// requirejs默认配置项目
			requireConfig: {
				baseUrl: '<%=STATIC_DIR%>/js',
				paths: {}
			},
			// 资源文件md5信息
			manifest: <%=MANIFEST_CONTENT%>
		}

		<%if(isLogin){%>
		App.user = {
			userID: '<%=user.getUserID()%>',
			userName: '<%=user.getUserName()%>',
			companyName: '<%=user.getCompanyName()%>'
		}
		<%}%>
		
		App.product = {
			appID: 'C2A40C8B755C7870C002622569F893F77',
			appName: '游戏名称',
			platFormType: 1,
			appCreateTime: 1418659200 * 1000
		}
		
		<%if(DEBUG){%>
		App.debug = true
		App.requireConfig.shim = {
			// 非AMD脚本依赖配置，dev和product的有区别，参考tools/config.js
			'highcharts': {
				exports: 'Highcharts'
			},
			'highcharts-3d': {
				deps: ['highcharts']
			}
		}
		App.requireConfig.urlArgs = 'v=' + Date.now()
		<%} else {%>
		;(function(manifest, config) {
			// 根据manifest重写js资源path
			for (var key in manifest) {
				var moduleName = key.replace(/(^\/js\/)|(\.js$)/g, '')
				config.paths[moduleName] = './' + moduleName + '.js?v=' + manifest[key]
			}
		})(App.manifest, App.requireConfig)
		<%}%>
		</script>
	</head>
	<body>
		
		<div id="header">
			<div class="logo"><a href="www.dataeye.com"></a></div>
			
			<div class="app-center">
				<a href="<%=CONTEXT_PATH%>/pages/home.jsp" class="fa fa-home"></a>
				<span id="appCenter">游戏名称</span>
				<i class="fa fa-caret-down"></i>
			</div>			
			
			<div class="top-tool">
				<a  class="top-menu" href="http://wiki.dataeye.com/s.html" target="_blank">
					<i class="fa fa-book"></i>
					开发者中心
				</a>
				<a href="<%=CONTEXT_PATH%>/pages/accounts/user_list.jsp" id="userCenter" class="user-center">
					<i class="fa fa-user"></i>
					<%=user.getUserID()%>
				</a>
				<a href="<%=CONTEXT_PATH%>/user/logout.do?userID=<%=user.getUserID()%>" class="exit">
					<i class="fa fa-power-off"></i>
					注销
				</a>
			</div>
		</div>

		<div id="container" class="clearfix">