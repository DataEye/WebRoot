<%@ page language="java" contentType="text/html; charset=utf-8"%>
<div class="content-head clearfix">
	<filter start="{{dStart}}" end="{{dEnd}}" max="{{dMax}}" min="{{dMin}}" today="{{dToday}}"
		disableResource="1" suffix="{{suffix}}" disableApp="1" disableCountry="1" disableArea="1" urlSettings="{{filterSettings}}" />
</div>

<div class="content-body">
	<panel title="新增玩家" isTable="false" id="add_playrs" indexes="">
		<config name="addPlayer" label="新增玩家" data="getPostData" formatters=",,formatPercentage"
			url="/addplayer/getAddPlayer.do"
			chart.xAxisFormatter="formatShortDate" chart.type="line" chart.yAxisSymbols=",,%" 
			chart.yAxisRightIndexes="2" />
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">日期</th>
					<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
					<th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
					<th class="datagrid-sort" on-click="sortBy:y2">{{datatitle.y2}}</th>
				</tr>
			</thead>
			<tbody>
			{{#datalist}}
				<tr>
					<td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
					<td>{{y0}}</td>
					<td>{{y1}}</td>
					<td>{{formatPercentage(y2)}}</td>
				</tr>
			{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	
	<panel title="流量来源" isTable="false" id="allika" indexes="">
		<config name="channel" label="渠道" url="/addplayer/getAddPlayerChan.do" data="getPostData"
		  chart.type="line" chart.types="column" chart.suffix="formatPercentage" 
		  chart.switchVar="allikaDetail" chart.childID="allikaDetail"/>
			
		<config name="country" label="国家" url="/addplayer/getAddPlayerCountry.do" data="getPostData"
		  chart.type="line" chart.types="column" chart.suffix="formatPercentage" 
		  chart.switchVar="allikaDetail" chart.childID="allikaDetail" />
			
		<config name="city" label="城市" url="/addplayer/getAddPlayerCity.do" data="getPostData" 
		  chart.type="line" chart.types="column" chart.suffix="formatPercentage" 
		  chart.switchVar="allikaDetail" chart.childID="allikaDetail" />
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th>
						{{tabName === 'channel' ? '渠道' : ''}}
						{{tabName === 'country' ? '国家' : ''}}
						{{tabName === 'city' ? '城市' : ''}}
					</th>
					<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
					<th class="datagrid-sort" on-click="sortBy:z0">{{datatitle.z0}}</th>
					<th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
					<th class="datagrid-sort" on-click="sortBy:z1">{{datatitle.z1}}</th>
				</tr>
			</thead>
			<tbody>
				{{#datalist}}
				<tr>
					<td>{{x}}</td>
					<td>{{y0}}</td>
					<td>{{formatPercentage(z0)}}</td>
					<td>{{y1}}</td>
					<td>{{formatPercentage(z1)}}</td>
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	
	{{#allikaDetail}}
	<panel detail="true" title="{{title}}" id="allikaDetail" isTable="false" hideTabs="1">
		<config name="channel" label="渠道" download="false" data="getAllikaData"
			chart.xAxisFormatter="formatShortDate"
			url="/addplayer/getAddPlayerChanDetail.do" chart.type="line" />
		<config name="country" label="国家" download="false"  data="getAllikaData" 
			chart.xAxisFormatter="formatShortDate"
			url="/addplayer/getAddPlayerCountryDetail.do" chart.type="line" />
		<config name="city" label="城市" download="false"  data="getAllikaData" 
			chart.xAxisFormatter="formatShortDate"
			url="/addplayer/getAddPlayerCityDetail.do" chart.type="line" />
		
    <!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">日期</th>
					<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
					<th class="datagrid-sort" on-click="sortBy:z0">{{datatitle.z0}}</th>
					<th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
					<th class="datagrid-sort" on-click="sortBy:z1">{{datatitle.z1}}</th>
				</tr>
			</thead>
			<tbody>
				{{#datalist}}
				<tr>
					<td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
					<td>{{y0}}</td>
					<td>{{formatPercentage(z0)}}</td>
					<td>{{y1}}</td>
					<td>{{formatPercentage(z1)}}</td>
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	{{/allikaDetail}}	

	<panel title="流量质量" isTable="false" id="quality" indexes="">
		<config name="retentionByCountry" label="国家留存分析" data="getPostData"
			url="/addplayer/getAddPlayerRetainCountry.do" formatters="formatPercentage,formatPercentage,formatPercentage"
			chart.type="line" chart.types="column" 
			chart.yAxisSymbols="%,%,%,%,%"
			chart.switchVar="qualityDetail" chart.childID="qualityDetail" />
			
		<config name="payByCountry" label="国家付费分析" data="getPostData"
			chart.type="line" chart.types="column,areaspline" 
			chart.switchVar="qualityDetail" 
			chart.childID="qualityDetail" 
			chart.yAxisRightIndexes="1" 
			url="/addplayer/getAddPlayerPayCountry.do" />
			
		<config name="retentionByCity" label="城市留存分析" data="getPostData"
			url="/addplayer/getAddPlayerRetainCity.do" formatters="formatPercentage,formatPercentage,formatPercentage"
			chart.type="line" chart.types="column" 
			chart.yAxisSymbols="%,%,%,%,%" 
			chart.switchVar="qualityDetail" chart.childID="qualityDetail" />
			
		<config name="payByCity" label="城市付费分析" data="getPostData"
			url="/addplayer/getAddPlayerPayCity.do" 
			chart.switchVar="qualityDetail" 
			chart.childID="qualityDetail" 
			chart.yAxisRightIndexes="1" 
			chart.type="line" chart.types="column,areaspline" />
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th>
						{{tabName === 'retentionByCountry' ? '国家' : ''}}
						{{tabName === 'payByCountry' ? '国家' : ''}}
						{{tabName === 'retentionByCity' ? '城市' : ''}}
						{{tabName === 'payByCity' ? '城市' : ''}}
					</th>
					<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
					<th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
					{{#if tabName === 'retentionByCountry' || tabName === 'retentionByCity'}}
					<th class="datagrid-sort" on-click="sortBy:y2">{{datatitle.y2}}</th>
					<th class="datagrid-sort" on-click="sortBy:y3">{{datatitle.y3}}</th>
					{{/if}}
				</tr>
			</thead>
			<tbody>
				{{#datalist}}
				<tr>
					<td>{{x}}</td>
					{{#if tabName === 'retentionByCountry' || tabName === 'retentionByCity'}}
					<td>{{formatPercentage(y0)}}</td>
					<td>{{formatPercentage(y1)}}</td>
					<td>{{formatPercentage(y2)}}</td>
					<td>{{formatPercentage(y3)}}</td>
					{{/if}}
					{{#if tabName === 'payByCountry' || tabName === 'payByCity'}}
					<td>{{y0}}</td>
					<td>{{y1}}</td>
					{{/if}}
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
  
	{{#qualityDetail}}
	<panel detail="true" parent={{parent}} title="{{title}}" id="qualityDetail" isTable="false" hideTabs="1">
		<config name="retentionByCountry" label="qualityDetailTab" download="false" data="getFormData"
      url="/addplayer/getAddPlayerRetainCountryDetail.do"
			chart.xAxisFormatter="formatShortDate" chart.type="line"  />
		<config name="payByCountry" label="qualityDetailTab" download="false" data="getFormData"
      url="/addplayer/getAddPlayerPayCountryDetail.do"
			chart.xAxisFormatter="formatShortDate" chart.type="line" chart.yAxisRightIndexes="1"  />
    <config name="retentionByCity" label="qualityDetailTab" download="false" data="getFormData"
      url="/addplayer/getAddPlayerRetainCityDetail.do"
			chart.xAxisFormatter="formatShortDate" chart.type="line"  />
    <config name="payByCity" label="qualityDetailTab" download="false" data="getFormData"
      url="/addplayer/getAddPlayerPayCityDetail.do"
			chart.xAxisFormatter="formatShortDate" chart.type="line" chart.yAxisRightIndexes="1" />
    
    <!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					<th class="datagrid-sort" on-click="sortBy:x">日期</th>
					<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
					<th class="datagrid-sort" on-click="sortBy:y1">{{datatitle.y1}}</th>
					{{#if parent === 'retentionByCountry' || parent === 'retentionByCity'}}
					<th class="datagrid-sort" on-click="sortBy:y2">{{datatitle.y2}}</th>
					{{/if}}
				</tr>
			</thead>
			<tbody>
				{{#datalist}}
				<tr>
					<td>{{formatShortDate(x, 'YYYY-MM-DD')}}</td>
					{{#if parent === 'retentionByCountry' || parent === 'retentionByCity'}}
					<td>{{formatPercentage(y0)}}</td>
					<td>{{formatPercentage(y1)}}</td>
					<td>{{formatPercentage(y2)}}</td>
					{{/if}}
					{{#if parent === 'payByCountry' || parent === 'payByCity'}}
					<td>{{y0}}</td>
					<td>{{y1}}</td>
					{{/if}}
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	{{/qualityDetail}}
	
	<panel title="流量流向" isTable="false" id="flow" indexes="">
		<config name="role" label="角色" data="getPostData" url="/addplayer/getAddPlayerRole.do"
			formatters=",formatPercentage" 
			chart.type="pie" chart.types="pie" />
			
		<config name="roleRate" label="角色占比" data="getPostData"
			url="/addplayer/getAddPlayerRoleRateDetail.do" 
			chart.xAxisFormatter="formatShortDate"
			chart.type="line" chart.types="column" chart.suffix="formatPercentage"
			chart.stacking="normal"
			chart.group.0.index="0,1" chart.group.0.tipsValue.0.name="t0"
			chart.group.0.tipsValue.0.suffix="formatPercentage"
			chart.group.1.suffix="formatPercentage" />
			
		<config name="retentionByCity" label="渠道创角占比" data="getPostData"
			url="/addplayer/getAddPlayerChanRoleRate.do" 
			chart.type="line" chart.types="column" chart.suffix="formatPercentage"
			chart.stacking="normal"
			chart.group.0.index="0,1" chart.group.0.tipsValue.0.name="t0"
			chart.group.0.tipsValue.0.suffix="formatPercentage"
			chart.group.1.suffix="formatPercentage" />
			
		<config name="payByCity" label="国家创角占比" data="getPostData"
			url="/addplayer/getAddPlayerCountryRoleRate.do" 
			chart.type="line" chart.types="column" chart.suffix="formatPercentage"
			chart.stacking="normal"
			chart.group.0.index="0,1" chart.group.0.tipsValue.0.name="t0"
			chart.group.0.tipsValue.0.suffix="formatPercentage"
			chart.group.1.suffix="formatPercentage" />
		<!-- 这个模板会传到datagrid组件内部 -->
		{{#partial datagrid}}
		<table class="table-single">
			<thead>
				<tr>
					{{#if tabName === 'role'}}
						<th>角色</th>
						<th class="datagrid-sort" on-click="sortBy:y0">{{datatitle.y0}}</th>
						<th class="datagrid-sort" on-click="sortBy:z0">{{datatitle.z0}}</th>
					{{else}}
						<th class="datagrid-sort" on-click="sortBy:x">渠道</th>
						{{#sortedTitles}}
							<th class="datagrid-sort" on-click="sortBy:{{label}}">{{value}}</th>
						{{/sortedTitles}}
					{{/if}}
				</tr>
			</thead>
			<tbody>
				{{#datalist:i}}
				<tr>
					{{#if tabName === 'role'}}
						<td>{{x}}</td>
						<td>{{y0}}</td>
						<td>{{formatPercentage(z0)}}</td>
					{{else}}
						<td>{{tabName === 'roleRate' ? formatShortDate(x) : x}}</td>
						{{#sortedTitles}}
							<td>{{datalist[i][label]}}</td>
						{{/}}
					{{/if}}
				</tr>
				{{/datalist}}
			</tbody>			
		</table>
		{{/partial}}
	</panel>
	
</div>
