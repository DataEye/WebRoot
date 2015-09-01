<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%if(DEBUG){%>
	<%@ include file="./templates.jsp" %>
<%}%>

</div>

<div id="footer">
	<a target="_blank" href="http://www.dataeye.com/about.html">关于我们</a> |
	<a target="_blank" href="http://weibo.com/DataEye">微博</a> |
	<a target="_blank" href="https://g.dataeye.com/service.jsp">隐私政策</a> |
	<a target="_blank" href="http://www.grg2013.com">GRG游戏研究组</a><br>
    Copyright © 2013 DataEye产品团队 粤ICP备13074195-1号
</div>

<!-- 兼容IE 8的代码不需要使用requirejs包裹，所以在requirejs之前加载 -->
<!--[if lt IE 9]>
<script src="<%=ReadManifest.getKey("/js/ie8/es5-shim.js", STATIC_DIR, DEBUG)%>"></script>
<script src="<%=ReadManifest.getKey("/js/ie8/html5shiv.js", STATIC_DIR, DEBUG)%>"></script>
<script src="<%=ReadManifest.getKey("/js/ie8/json2.js", STATIC_DIR, DEBUG)%>"></script>
<script src="<%=ReadManifest.getKey("/js/ie8/respond.js", STATIC_DIR, DEBUG)%>"></script>
<![endif]-->

<script src="<%=ReadManifest.getKey("/js/require.js", STATIC_DIR, DEBUG)%>"></script>

<%if(!DEBUG){%>
<!-- 加载全部基础脚本 -->
<script src="<%=ReadManifest.getKey("/js/base.js", STATIC_DIR, DEBUG)%>"></script>
<script src="<%=ReadManifest.getKey("/js/components.js", STATIC_DIR, DEBUG)%>"></script>
<script src="<%=ReadManifest.getKey("/js/app-base-" + lang + ".js", STATIC_DIR, DEBUG)%>"></script>
<script src="<%=ReadManifest.getKey("/js/app.js", STATIC_DIR, DEBUG)%>"></script>
<script src="<%=ReadManifest.getKey("/js/charts.js", STATIC_DIR, DEBUG)%>"></script>
<%}%>
<script>
	require.config(App.requireConfig)
</script>
