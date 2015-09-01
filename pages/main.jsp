<%@ page language="java" contentType="text/html; charset=utf-8"%>
<%@ include file="../includes/header.jsp"%>

<div id="main">
	<div class="content">
		<div class="rloading text-center">
			<i class="fa fa-spinner fa-pulse"></i>
			<div>正在加载，请稍候...</div>
		</div>
	</div>
</div>
<%@ include file="../includes/footer.jsp"%>
<script>
	// 单页应用需要配置
	App.spa = true
	// 默认路由，根据菜单动态获取
	App.defaultRoute = 'sample'
	App.i18n = {
	
			AddPlayerRole:'角色',
			AddPlayerRoleRate:'角色占比',
			AddPlayerRoleRateByChannel:'渠道创角占比',
			AddPlayerRoleRateByCountry:'国家创角占比',
			
			//新增留存菜单
			AddRetain:'新增留存',
			AddRetainDay1:'次日',
			AddRetainDay3:'3日',
			AddRetainDay7:'7日',
			AddRetainDay14:'14日',
			AddRetainDay30:'30日',
			
			
			//新增玩家菜单指标说明
			IndexEquipAct:'天|||设备激活',
			IndexEquipActInfo:'统计所选时期内,每日新增的玩家安装游戏客户端,并运行游戏的可连接网络设备的数量,每台设备只计算一次。',
			IndexEquipNew:'天|||新增设备',
			IndexEquipNewInfo:'统计所选时期内,每日玩家激活游戏后,进行了自动或者手动注册有ID信息或者账户信息的玩家设备数量,每台设备只计算一次。',
			IndexAccountNew:'天|||新增帐号',
			IndexAccountNewInfo:'统计所选时期内，每日玩家激活游戏后，进行了自动或者手动注册有ID信息或者账户信息的玩家账户数量。',
			IndexPlayerConversion:'天|||玩家转化率',
			IndexPlayerConversionInfo:'统计所选时期内，每日玩家激活游戏后，进行了自动或者手动注册有ID信息或者账户信息的玩家设备数量，单设备中多个帐号只计算一次成功转化。',
			
			IndexUserDisByFGT:'首次游戏时长',
			IndexUserDisByFGTInfo:'统计所选时期内，新增玩家首次进行游戏的游戏时间区间分布。',
			IndexUserDisBySmallAccount:'小号分析',
			IndexUserDisBySmallAccountInfo:'统计所选时期内，新增设备上存在多个新增玩家游戏账号的数量情况。',
			IndexUserDisByArea:'地区',
			IndexUserDisByAreaInfo:'统计所选时期内，新增玩家注册信息中地区分布情况。',
			IndexUserDisByConutry:'国家',
			IndexUserDisByConutryInfo:'统计所选时期内，新增玩家注册信息中国家分布情况。',
			IndexUserDisBySex:'性别',
			IndexUserDisBySexInfo:'统计所选时期内，新增玩家注册信息中性别分布情况。',
			IndexUserDisByAge:'年龄',
			IndexUserDisByAgeInfo:'统计所选时期内，新增玩家注册信息中年龄分布情况。',
			IndexUserDisByAccountType:'帐号类型',
			IndexUserDisByAccountTypeInfo:'统计所选时期内，新增玩家所选注册账户类型分布情况。',

			//付费转化菜单
			dayPayPercent:'日付费率',
			weekPayPercent:'周付费率',
			monthPayPercent:'月付费率',
			totalPayPercent: '总体付费率',

			firstDayPayPercent:'首日付费率',
			firstWeekPayPercent:'首周付费率',
			firstMonthPayPercent:'首月付费率',
			
			channel:'渠道',
			
			//付费转化菜单指标说明
			IndexFirstDayPayPercent:'天|||首日付费率',
			IndexFirstDayPayPercentInfo:'统计所选时期内，当日新增玩家中成功付费玩家的数量占当日新增玩家数量的比例。',
			IndexFirstWeekPayPercent:'首周付费率',
			IndexFirstWeekPayPercentInfo:'当日新增玩家中在当日推后7天（当日计入天数）的时间内有成功充值行为的玩家数量，占当日新增玩家数量的比例。',
			IndexFirstMonthPayPercent:'首月付费率',
			IndexFirstMonthPayPercentInfo:'当日新增玩家中在当日推后30天（当日计入天数）的时间内有成功充值行为的玩家数量，占当日新增玩家数量的比例。',
			
			IndexDayPayRate:'天|||日付费率',
			IndexDayPayRateInfo:'统计所选时期内，每日成功付费玩家占当日活跃玩家的比例。',
			IndexWeekPayRate:'周付费率',
			IndexWeekPayRateInfo:'统计所选时期内，每自然周进行充值的玩家占当周活跃玩家数量的比例，去重。',
			IndexMonthPayRate:'月付费率',
			IndexMonthPayRateInfo:'统计所选时期内，每自然月进行充值的玩家占当月活跃玩家数量的比例，去重。',
			IndexSumPayRate:'累计付费率',
			IndexSumPayRateInfo:'统计所选时期内，截至当日为止，曾成功充过值得玩家数量占所有曾有过登录行为的玩家数量的比例。',

			IndexPayConversionDisByArea:'地区日均付费率',
			IndexPayConversionDisByAreaInfo:'统计所选时期内，地区每日付费率平均值。',
			IndexPayConversionDisByConutry:'国家日均付费率',
			IndexPayConversionDisByConutryInfo:'统计所选时期内，国家每日付费率平均值。',
			IndexPayConversionDisByChannel:'渠道日均付费率',
			IndexPayConversionDisByChannelInfo:'统计所选时期内，各渠道每日付费率平均值。',
			IndexPayConversionDisBySex:'性别日均付费率',
			IndexPayConversionDisBySexInfo:'统计所选时期内，各性别玩家每日付费率平均值。',
			IndexPayConversionDisByAge:'年龄日均付费率',
			IndexPayConversionDisByAgeInfo:'统计所选时期内，各年龄段玩家每日付费率平均值。',

			newPlayer: '新增玩家',
			payPlayer: '付费玩家',
			nopayPlayer: '非付费玩家',
			DAU: 'DAU',
			WAU: 'WAU',
			MAU: 'MAU',
			DAUDivideMAU: 'DAU/MAU',
			
			
			Stay2Rate:'次日留存率',
			Stay7Rate:'7日留存率',
			Stay30Rate:'30日留存率',
			Lost7Num:'7日流失人数',
			Lost14Num:'14日流失人数',
			Lost30Num:'30日流失人数',
			Back7Num:'7日回流人数',
			Back14Num:'14日回流人数',
			Back30Num:'30日回流人数',
			PlayerNum:'玩家数',
			
			Today:'今日',
			Yesterday:'昨日',
			Day:'日',
			Week:'周',
			Month:'月',
			
			ActivePlayerAmount:'活跃玩家(¥)',
			FirstPayPlayerAmount:'首次付费玩家(¥)',
			FirstDayPayPlayerAmount:'首日付费玩家(¥)',
			ActivePlayer:'活跃玩家',
			FirstPayPlayer:'首次付费玩家',
			FirstDayPayPlayer:'首日付费玩家',
			
			PayAmount:'付费金额(¥)',
			PayNum:'付费次数',
			
			Device:'设备',
			Net:'设备网络类型',
			BroadBand:'宽带运营商',
			Mobile:'移动运营商',
			Resolution:'分辨率',
			System:'操作系统',
			
			LostDay:'每日流失',
			BackDay:'每日回流',
			
			RoleNum:'创角数量',
			DayActive:'日活跃',
			NewPayPlayer:'新增付费玩家',
			Income:'收入',
			PayTimes:'付费次数',
			PayPeopleNum:'付费人数',
			PayRate:'付费率',
			
			Unknow:'未知',
			CountIndex:'数量指标',
			QualityIndex:'质量指标',
			RetainRate:'留存率',
			
			Stay2:'次日留存',
			Stay3:'三日留存',
			Stay7:'七日留存',
			RealOnline:'实时在线',
			
			IncomeAmount:'收入金额',
			PayIncomeAmount:'付费金额',
			
			FirstPayDis:'首充游戏时间分布',
			SecondPayDis:'二充到首充时间分布',
			ThirdPayDis:'三充到二充时间分布',
			
			
			
			
			//指标说明-玩家分析-活跃玩家
			IndexActivePlayer:'天|||活跃玩家',
			IndexActivePlayerInfo:'当日有过在线的设备去重计数（与历史去重）。',
			IndexActivePlayerDisByCountry:'天|||活跃玩家-国家分布',
			IndexActivePlayerDisByCountryInfo:'通过玩家上报的IP判断出的国家分布。',
			IndexActivePlayerDisByArea:'天|||活跃玩家-地区分布',
			IndexActivePlayerDisByAreaInfo:'通过玩家上报的IP判断出的地区分布',
			IndexActivePlayerDisByDevice:'天|||活跃玩家-机型分布',
			IndexActivePlayerDisByDeviceInfo:'通过SDK取出的机型品牌信息分布，取top10',
			IndexActivePlayerDisByDownloadRes:'天|||活跃玩家-下载资源分布',
			IndexActivePlayerDisByDownloadResInfo:'活跃玩家下载资源大类分布统计',
			IndexActivePlayerDisByDownloadTimes:'天|||活跃玩家-下载次数分布',
			IndexActivePlayerDisByDownloadTimesInfo:'活跃玩家当日下载次数分布统计',
			IndexActivePlayerDisByNewDownload:'天|||活跃玩家-新增下载占比',
			IndexActivePlayerDisByNewDownloadInfo:'活跃玩家当日进行下载的占比',
			IndexDAU:'天|||DAU（日活跃玩家数量）',
			IndexDAUInfo:'统计所选时期内，每日成功登录游戏的玩家数量',
			IndexWAU:'天|||WAU（周活跃玩家数量）',
			IndexWAUInfo:'统计所选时期内，当日往前推7日（当日计入天数）期间内，登陆过游戏的玩家总数量，按照玩家ID排重',
			IndexMAU:'天|||MAU（月活跃玩家数量）',
			IndexMAUInfo:'统计所选时期内，当日往前推30日（当日计入天数）期间内，登陆过游戏的玩家总数量，按照玩家ID排重。',
			//指标说明-玩家分析-留存统计
			IndexStayPlayer2Day:'天|||次日留存率',
			IndexStayPlayer2DayInfo:'统计所选时期内，当日成功登陆游戏的新增玩家中，第二日再次登陆游戏的玩家数量，占当日游戏新增玩家数量的比例',
			IndexStayPlayer7Day:'天|||7日留存率',
			IndexStayPlayer7DayInfo:'统计所选时期内，当日成功登陆游戏的新增玩家中，往后推第7日（当日不计入天数）登陆游戏的玩家数量，占当日游戏新增玩家数量的比例',
			IndexStayPlayer30Day:'天|||30日留存率',
			IndexStayPlayer30DayInfo:'统计所选时期内，当日成功登陆游戏的新增玩家中，往后推第30日（当日不计入天数）登陆游戏的玩家数量，占当日游戏新增玩家数量的比例',
			
			//指标说明-玩家分析-流失统计
			IndexLostPlayerDay:'天|||每日流失',
			IndexLostPlayerDayInfo:"统计所选时期内，当日往后推连续7日/14日/30日（当日不计入天数）未登录游戏的活跃/付费玩家数量",
			IndexBackPlayerDay:'天|||每日回流',
			IndexBackPlayerDayInfo:"统计所选时期内，当日往后推连续7日/14日/30日（当日计入天数）未登录游戏的活跃/付费玩家，在第8日/第15日/第31日又登录游戏的活跃/付费玩家数量",
			
			//指标说明-玩家分析-设备详情
			IndexDeviceDis:'机型',
			IndexDeviceDisInfo:"统计所选时期内，所选玩家（新增/活跃/付费）设备的机型分布情况",
			IndexResolutionDis:'分辨率',
			IndexResolutionDisInfo:"统计所选时期内，所选玩家（新增/活跃/付费）设备的分辨率分布情况",
			IndexSystemDis:'操作系统',
			IndexSystemDisInfo:"统计所选时期内，所选玩家（新增/活跃/付费）设备的操作系统分布情况",
			IndexNetDis:'联网方式',
			IndexNetDisInfo:"统计所选时期内，所选玩家（新增/活跃/付费）设备联网方式分布情况",
			IndexBroadbandDis:'宽带运营商',
			IndexBroadbandDisInfo:"统计所选时期内，所选玩家（新增/活跃/付费）设备所连宽带运营商分布情况",
			IndexMobileDis:'移动通信运营商',
			IndexMobileDisInfo:"统计所选时期内，所选玩家（新增/活跃/付费）设备移动通信运营商分布情况",
			
			//指标说明-付费分析-付费数据
			
			IndexPaymentPayAmount:'天|||付费金额',
			IndexPaymentPayAmountInfo:"统计所选时期内，每日玩家成功充值的金额总值",
			IndexPaymentPayPeopleNum:'天|||付费人数',
			IndexPaymentPayPeopleNumInfo:"统计所选时期内，每日成功充值的玩家数量，去重",
			IndexPaymentPayNum:'天|||付费次数',
			IndexPaymentPayNumInfo:"统计所选时期内，每日玩家成功充值总次数",
			
			//指标说明-付费分析-付费行为
			IndexPaymentPayAmountLevel:'付费金额(等级)',
			IndexPaymentPayAmountLevelInfo:"统计所选时期内，玩家在所处等级进行充值时，充值总金额和等级对应分布情况",
			IndexPaymentPayNumLevel:'付费次数(等级)',
			IndexPaymentPayNumLevelInfo:"统计所选时期内，玩家在所处等级付费总次数与等级对应分布",
			
			IndexPaymentActionFirst:'首充游戏时间',
			IndexPaymentActionFirstInfo:"统计所选时期内，玩家从注册游戏开始第一次有成功充值行为时，累计进行的游戏时间区间分布",
			IndexPaymentActionSecond:'二充到首充游戏时间',
			IndexPaymentActionSecondInfo:"统计所选时期内，玩家第二次成功充值距离第一次成功充值时，累计进行的游戏时间区间分布",
			IndexPaymentActionThird:'三充到二充游戏时间',
			IndexPaymentActionThirdInfo:"统计所选时期内，玩家第三次成功充值距离第二次成功充值时，累计进行的游戏时间区间分布",
			
		    //指标说明-渠道区服-区服分析
			IndexAvgRoleDau:'平均日活跃角色数',
			IndexAvgRoleDauInfo:"统计所选时期内，每日角色活跃数的平均值",

			IndexRoleAvgLevel:'平均角色日活等级',
			IndexRoleAvgLevelInfo:"统计所选时期内，每日活跃角色等级平均值的平均值"
	}
	// 配置页面默认显示图表还是表格
	App.defaultMode = 'chart'
	App.ajaxParams = {
		userID: App.user.userID,
		appID: App.product.appID,
		platFormID: App.product.platFormType,
		appCreateTime: App.product.appCreateTime / 1000
	}
	// 获取筛选条件的各种url配置参数
	App.filterSettings = (function() {
		var t = Date.now()
		var params = '?userID=' + App.user.userID + '&appID=<%=request.getParameter("appID")%>&type='
		var baseURI = App.contextPath + '/common/getSelectorByType.do'

		return {
			'channelUrl': 			 baseURI + params + 301,
			'regionUrl': 			 baseURI + params + 302,
			'versionUrl': 			 baseURI + params + 303
		}
	})()

	// 无权限处理逻辑（接口）
	window['418handler'] = function(xhr) {
		// 提示无权限信息，等待三秒跳转到默认页面
		redirectAlert(xhr.responseJSON.content, '#' + App.defaultRoute, 2000, 'warn')
	}
	require(['app/main'])
</script>
