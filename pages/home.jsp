<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@ include file="../includes/header.jsp"%>

<div id="menu" class="menu clearfix">
	<a class="app-home" href="<%=CONTEXT_PATH%>/pages/home.jsp">
		<i class="fa fa-home"></i>
	</a>
	<span class="app-home white">产品中心</span>
</div>

<div id="data_center">
	<div class="rloading text-center" style="padding:235px 0;">
		<i class="fa fa-spinner fa-pulse"></i>
		<div>正在加载，请稍候...</div>
	</div>
</div>
<script type="text/plain" id="data_center_tmpl">
<div class="de-top clearfix">
	<div class="btn-group">
		<a href="create_app.jsp" class="btn btn-zs btn-primary">
			<i class="fa fa-plus"></i>
			创建产品
		</a>
		<a  target="_blank" href="http://wiki.dataeye.com/s.html"
			class="btn btn-zs btn-default">
			<i class="fa fa-download"></i>
			下载SDK
		</a>
	</div>
	<span class="help-map">
		<i class="fa fa-question-circle"
			decorator="popover:{{getIndexInfo(
				'IndexHomeTotalInstalled',
				'IndexHomeDateAdded',
				'IndexHomeTodayDownloadNum',
				'IndexHomeTodayDownloadTimes'
			)}}"></i>
	</span>
	<div class="pull-right font16">
		离下次 <a href="javascript:;" on-click="refresh">刷新</a> 还有约
		<strong class="red">{{countdown}}</strong>
	</div>
</div>
<div class="wrapper wrapper-center">
<datagrid options="{{gridOptions}}" padding="true">
	<table class="table-unique">
		<thead>
			<tr>
				<th class="text-center">产品</th>
				<th class="text-center">累计安装数</th>
				<th class="text-center">当日新增数</th>
				<th class="text-center">当日下载人数</th>
				<th class="text-center">当日下载次数</th>
				<th class="text-center">操作</th>
			</tr>
		</thead>
		<tbody>
			{{#datalist:i}}
				{{#if isPadding}}
					<tr class=""><td colspan="6" class="no-padding">&nbsp;</td></tr>
				{{else}}
					<tr on-mouseover="highlighted:{{i}}"
						class="{{highlighted === i ? "highlighted" : ""}}">
						<td class="text-center" width="30%">
						{{#if appOrigin === 2}}
						<a decorator="tooltip:'您已被授权，可以查看此款产品'" class="font18" href="main.jsp?appID={{appID}}">
						{{appName}}
						</a>
						<i class="fa fa-eye gray"></i>
						{{else}}
						<a class="font18" href="main.jsp?appID={{appID}}">{{appName}}</a>
						{{/if}}
						<!--<i class="fa fa-{{platFormType === 1 ? "apple" : (platFormType === 2 ? "android" : "windows")}} gray-light"></i>-->
						</td>
						<td class="text-center">{{cumuPlayerNum}}</td>
						<td class="text-center">{{newPlayerNum}}</td>
						<td class="text-center">{{downloadPlayerNum}}</td>
						<td class="text-center">{{downloadNum}}</td>
						<td width="15%" class="text-justify">
						<a class="col-md-6" href="main.jsp?appID={{appID}}">
						<i class="fa fa-area-chart"></i>报表</a>
						{{#if appOrigin === 1}}
						<a class="col-md-6 text-right" href="javascript:;" on-click="edit">
						<i class="fa fa-pencil-square-o"></i>编辑</a>
						{{/if}}
						</td>
					</tr>
				{{/if}}
			{{/datalist}}
		</tbody>
		<tfoot>
			<tr>
				<td class="text-center">
					<div class="form-group-zs">
						<dropdown items="[
						{label: '求总和', value: 'sumTotal'},
						{label: '求本页总和', value: 'sum'},
						{label: '求本页平均', value: 'avg'},
						{label: '求中位数', value: 'avgTotal'}
						]" value="{{.computeType}}" />
					</div>
				</td>
				<td class="text-center">{{compute('cumuPlayerNum', .computeType)}}</td>
				<td class="text-center">{{compute('newPlayerNum', .computeType)}}</td>
				<td class="text-center">{{compute('downloadPlayerNum', .computeType)}}</td>
				<td class="text-center">{{compute('downloadNum', .computeType)}}</td>
				<td></td>
			</tr>
		</tfoot>
	</table>
</datagrid>
{{#collapsed}}
{{#appInfo}}
<div class="mask">
	<div class="model model-dialog" decorator="dialogresize">
		<div class="model-head">
			编辑产品
			<a href="javascript:;" on-click="closeDialog" class="fa fa-times pull-right"></a>
		</div>
		<div class="model-body clearfix">
			<div class="form-horizontal horizontal-dialog">
				<div class="form-group form-group-md">
					<label class="col-sm-2 control-label text-right">产品名称</label>
					<div class="col-sm-9">
						<textinput required maxlength="30" type="text" value="{{appName}}"
							placeholder="请输入产品名称" tip="产品名称不能多于30个字符" name="appName" />
					</div>
				</div>

				<div class="form-group form-group-md">
					<label class="col-sm-2 control-label text-right">APPID</label>
					<div class="col-sm-9">
						<div class="well de-well">{{appID}}</div>
					</div>
				</div>

				<!--<div class="form-group form-group-md">
					<label class="col-sm-2 control-label text-right">SDK版本</label>
					<div class="col-sm-9">
						<div class="well de-well">{{sdkVersion}}</div>
					</div>
				</div>-->

				<div class="form-group form-group-md">
					<label class="col-sm-2 control-label text-right">平台</label>
					<div class="col-sm-9 dropdown-width">
						<dropdown name="platform" value="{{platFormType}}" items="{{platforms}}" />
					</div>
				</div>

				<div class="form-group form-group-md">
					<label class="col-sm-2 control-label text-right">创建时间</label>
					<div class="col-sm-9">
						<div class="well de-well">{{formatTime(appCreateTime)}}</div>
					</div>
				</div>

				<div class="form-group form-group-md" style="margin-top:30px;">
					<button class="btn btn-default btn-block red" on-click="deleteApp" disabled="{{disableSubmit}}">
						{{#disableSubmit}}
						<i class="fa fa-exclamation-circle"></i>
						正在删除，请稍候......
						{{else}}
						删除产品
						{{/disableSubmit}}
					</button>
				</div>
			</div>
		</div>
		<div class="model-foot text-right">
			<div class="btn-group">
				<a class="btn btn-zs btn-primary" on-click="submit">
					<i class="fa fa-check-circle"></i> 确定</a>
				<a class="btn btn-zs btn-default" on-click="closeDialog">
					<i class="fa fa-trash-o"></i> 取消</a>
			</div>
		</div>
	</div>
</div>
{{/appInfo}}
{{/collapsed}}
</div>
</script>

<%@ include file="../includes/footer.jsp"%>

<script>
	App.i18n = {
		deleteTips: "您确定要删除些款产品吗？",
		deleteOk: "删除成功!",
		editOk: "编辑成功!",
		//指标说明-数据中心
		IndexHomeTotalInstalled:'累计安装',
		IndexHomeTotalInstalledInfo:'应用覆盖的设备个数，重复安装不会多次计算。',
		IndexHomeDateAdded:'当日新增数',
		IndexHomeDateAddedInfo:'当日新增安装的设备个数。',
		IndexHomeTodayDownloadNum:'当日下载人数',
		IndexHomeTodayDownloadNumInfo:'当日通过渠道下载应用的总人数。',
		IndexHomeTodayDownloadTimes:'当日下载次数',
		IndexHomeTodayDownloadTimesInfo:'当日通过渠道下载应用的总次数。'
	}
	require(['app/home'])

</script>
