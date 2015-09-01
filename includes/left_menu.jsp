<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@page import="java.util.List"%>
<%@page import="com.dataeye.h5.module.common.vo.MenuItem"%>
<%@page import="com.dataeye.h5.module.dao.PrivilegeDao"%>
<%@page import="com.dataeye.utils.ApplicationContextUtil"%>
<%
	//获取菜单信息,因为统一登录暂未完成，所以这里暂时这样取菜单，以后要从session里面取
	PrivilegeDao privilegeDao = (PrivilegeDao)ApplicationContextUtil.getBean("privilegeDao");
	List<MenuItem> menuList = privilegeDao.getMenu(user.getUID(),appID);
	int currentTime = (int) (System.currentTimeMillis()/1000);
	int period = 3600 * 24 * 7;
	int currentGroup = 0;
	String defaultRoute = null;
%>
<div id="side">
	<div class="sidemenu">
		<%for (MenuItem m : menuList) {%>
		<%
			List<MenuItem> children = m.getChild();
			Boolean isNewMenu = currentTime - m.getCreateTime() < period;
		%>
		<%if(m.isVisible() == true){%>
		<% if(currentGroup != 0 && currentGroup != m.getGroupID()) {%>
			<div class="menu-divider" hidden></div>
		<%}%>
		<%
			// 分组ID
			currentGroup = m.getGroupID();
		%>
		<h3 class="<%=m.getIsFinal() == 1 ? "" : "text-right"%>">
			<%if(m.getIsFinal() == 0){%>
				<span class="icon icon-<%=m.getTitle()%>"></span>
				<span>
					<%if("en".equals(lang)){%>
						<%=m.getNameEn()%>
					<%} else if ("ft".equals(lang)) {%>
						<%=m.getNameFt()%>
					<%} else {%>
						<%=m.getName()%>
					<%}%>
					<%if(isNewMenu){%>
						<i class="fa fa-circle"></i>
					<%}%>
				</span>
				<i class="fa fa-angle-down"></i>
			<%} else {%>
				<%
					if (defaultRoute == null) {
						defaultRoute = m.getPath();
					}
				%>
				<a href="#<%=m.getPath()%>">
					<span class="icon icon-<%=m.getTitle()%>"></span>
					<%if("en".equals(lang)){%>
						<%=m.getNameEn()%>
					<%} else if ("ft".equals(lang)) {%>
						<%=m.getNameFt()%>
					<%} else {%>
						<%=m.getName()%>
					<%}%>
					<%if(isNewMenu){%>
						<i class="fa fa-circle"></i>
					<%}%>
				</a>
			<%}%>
		</h3>
		<%if(m.getIsFinal() == 0){%>
		<div class="menu-child-list">
			<ul>
				<%for (MenuItem child : children) {%>
				<%
					Boolean isNewSubMenu = currentTime - child.getCreateTime() < period;
				%>
				<%if(child.isVisible() == true){%>
				<%
					if (defaultRoute == null) {
						defaultRoute = child.getPath();
					}
				%>
				<li>
					<a href="#<%=child.getPath()%>">
						<%if("en".equals(lang)){%>
							<%=child.getNameEn()%>
						<%} else if ("ft".equals(lang)) {%>
							<%=child.getNameFt()%>
						<%} else {%>
							<%=child.getName()%>
						<%}%>
						<%if( !isNewMenu && isNewSubMenu){%>
							<i class="fa fa-circle"></i>
						<%}%>
					</a>
				</li>
				<%}%>
				<%}%>
			</ul>
		</div>
		<%}%>
		<%}%>
	<%}%>

	</div>
</div>
