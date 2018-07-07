$(function(){
	//防火墙开关 0-关闭 1-开启
	initCheckboxs("firewall_status_checkbox");
	//IP地址过滤开关 0-关闭 1-开启
	initCheckboxs("ip_filter_status_checkbox");
	//mac地址过滤开关 0-关闭 1-开启
	initCheckboxs("mac_filter_status_checkbox");
	//dns地址过滤开关 0-关闭 1-开启
	initCheckboxs("dns_filter_status_checkbox");
	//mac地址过滤模式 0-白名单 1-黑名单
	initCheckboxs("mac_filter_mode_status_checkbox");

	initFirewallPageWords();

	//实例化下拉选择框
	initOptions("textIpNewProto");

	//Registe Xml Events
	$.cgi.onGetXml('custom_fw', getCustomFWData);
});
<!-- ##############################	防火墙公共变量 ################################ -->
var _arrayTableDataIp = new Array(0);
var _arrayTableDataMac = new Array(0);
var _arrayTableDataDns = new Array(0);
var _customFWMode = 0;
var _macMode;
var _macFilterMode;
var _totalItemIp = 0;
var _totalItemMac = 0;
var _totalItemDns = 0;
var _controlMapOld=new Array(0);
var _controlMapNew=new Array(0);
var _currentPage = 1;
var _totalItemMacWhite = 0;

<!-- ##############################	防火墙公共变量 ################################ -->
<!-- ##############################	防火墙公共函数 ################################ -->
//打开防火墙面板
function firewall_status_open_click(){
	$("#filter_tab_div").show();
	//默认打开IP地址过滤面板
	setFilterTab('filter',1,3)
}
//关闭防火墙面板
function firewall_status_close_click(){
	$("#filter_tab_div").hide();
}

// Tab JS
function setFilterTab(name,cursel,n){
 	for(i=1;i<=n;i++)
	{
		var menu = document.getElementById(name+i);
		var con = document.getElementById("con_"+name+"_"+i);
		menu.className=i==cursel?"hover":"";
		con.style.display=i==cursel?"block":"none";
 	}
 	_currentPage = cursel;
}
//打开IP地址过滤表格
function ip_filter_status_open_click(){
	$("#ip_filter_text_table").show();
	$("#ip_filter_btn").show();
}
//关闭IP地址过滤表格
function ip_filter_status_close_click(){
	$("#ip_filter_text_table").hide();
	$("#ip_filter_btn").hide();
}

//打开dns地址过滤表格
function dns_filter_status_open_click(){
	$("#dns_filter_text_table").show();
	$("#dns_filter_btn").show();
}
//关闭IP地址过滤表格
function dns_filter_status_close_click(){
	$("#dns_filter_text_table").hide();
	$("#dns_filter_btn").hide();
}

//打开mac过滤模式 选择框
function mac_filter_status_open_click(){
	$("#mac_filter_mode_list_table").show();
	$("#mac_filter_mode_table").show();
	//Open MAC Address Filter 判断当前选中的 1-白名单 0-黑名单
	if(getCheckboxsValue("mac_filter_mode_status_checkbox") == 1){
		mac_filter_mode_status_open_click();
	}else{
		mac_filter_mode_status_close_click();
	}
}
//关闭 mac过滤模式 选择框
function mac_filter_status_close_click(){
	$("#mac_filter_mode_list_table").hide();
	$("#mac_filter_mode_table").hide();	
}

//打开mac地址 白名单
function mac_filter_mode_status_open_click(){
	$("#white_list").show();
	$("#black_list").hide();
}
//打开mac地址 黑名单
function mac_filter_mode_status_close_click(){
	$("#white_list").hide();
	$("#black_list").show();
}
//初始化IPv6显示文字
function initFirewallPageWords(){
	$("#lCustomFWRule").text(jQuery.i18n.prop("lCustomFWRule"));
	$("#lFWSwitch").text(jQuery.i18n.prop("lFWSwitch"));
	$("#ip_filter").text(jQuery.i18n.prop("lIpFilter"));
	$("#mac_filter").text(jQuery.i18n.prop("lMacFilter"));
	$("#dns_filter").text(jQuery.i18n.prop("lDnsFilter"));
	$("#ip_filter_status_title").text(jQuery.i18n.prop("lIpFilter"));
	$("#mac_filter_status_title").text(jQuery.i18n.prop("lMacFilter"));
	$("#dns_filter_status_title").text(jQuery.i18n.prop("lDnsFilter"));
	$("#mac_filter_mode_status_title").text(jQuery.i18n.prop("lMacFilterMode"));
	$("#mac_filter_mode_status_close_title").text(jQuery.i18n.prop("lMacFilterBlacklist"));
	$("#mac_filter_mode_status_open_title").text(jQuery.i18n.prop("lMacFilterWhitelist"));
	$("#lIpListTitle").text(jQuery.i18n.prop("lIpListTitle"));
	$("#lMacListTitle").text(jQuery.i18n.prop("lMacListTitle"));
	$("#lMacListWhiteTitle").text(jQuery.i18n.prop("lMacListWhiteTitle"));
	$("#lDnsListTitle").text(jQuery.i18n.prop("lDnsListTitle"));
	$("#ipIndex").text(jQuery.i18n.prop("ipIndex"));
	$("#ipWanAddr").text(jQuery.i18n.prop("ipWanAddr"));
	$("#ipPort").text(jQuery.i18n.prop("ipPort"));
	$("#ipProto").text(jQuery.i18n.prop("ipProto"));
	$("#ipOperate").text(jQuery.i18n.prop("ipOperate"));
	$("#macIndex").text(jQuery.i18n.prop("macIndex"));
	$("#macAddr").text(jQuery.i18n.prop("macAddr"));
	$("#macOperate").text(jQuery.i18n.prop("macOperate"));
	$("#macWhiteIndex").text(jQuery.i18n.prop("macIndex"));
	$("#macWhiteAddr").text(jQuery.i18n.prop("macAddr"));
	$("#macWhiteOperate").text(jQuery.i18n.prop("macOperate"));
	$("#dnsIndex").text(jQuery.i18n.prop("dnsIndex"));
	$("#dnsAddr").text(jQuery.i18n.prop("dnsAddr"));
	$("#dnsOperate").text(jQuery.i18n.prop("dnsOperate"));
	//实例化添加对话框显示文字
	$("#ipNewWanAddr").text(jQuery.i18n.prop("ipNewWanAddr"));
	$("#ipNewPortStart").text(jQuery.i18n.prop("ipNewPortStart"));
	$("#ipNewPortEnd").text(jQuery.i18n.prop("ipNewPortEnd"));
	$("#ipNewProto").text(jQuery.i18n.prop("ipNewProto"));
	$("#optTcp").text(jQuery.i18n.prop("optTcp"));
	$("#optUdp").text(jQuery.i18n.prop("optUdp"));
	$("#optAll").text(jQuery.i18n.prop("optAll"));
	$("#btnIpOk").val(jQuery.i18n.prop("btnOk"));
	$("#btnIpCancel").val(jQuery.i18n.prop("btnCancel"));
	$("#macNewAddr").text(jQuery.i18n.prop("macNewAddr"));
	$("#btnMacOk").val(jQuery.i18n.prop("btnOk"));
	$("#btnMacCancel").val(jQuery.i18n.prop("btnCancel"));
	$("#dnsNewAddr").text(jQuery.i18n.prop("dnsNewAddr"));
	$("#btnDnsOk").val(jQuery.i18n.prop("btnOk"));
	$("#btnDnsCancel").val(jQuery.i18n.prop("btnCancel"));
}
//验证添加IP地址过滤信息 是否合法
function isValidIpFilter(ip1, port1, port2){
	if(!validateIPAddress(ip1)){
		open_dialog_info(jQuery.i18n.prop("lIPErrorMsg"));
		return false;
	}
	if (port1.length == 0 || port2.length == 0){
        open_dialog_info(jQuery.i18n.prop("lIPErrorPort3"));
        return false;
    }
	var re = /^[0-9]{0,5}$/;
    if (!re.test(port1) || !re.test(port2)){
        open_dialog_info(jQuery.i18n.prop("lIPErrorPort"));
        return false;
    }
	if (parseInt(port1) < 1 || parseInt(port2) > 65535) {
        open_dialog_info(jQuery.i18n.prop("lIPErrorPort1"));
        return false;
    }
	if(parseInt(port1) > parseInt(port2)){
        open_dialog_info(jQuery.i18n.prop("lIPErrorPort2"));
        return false;
    }
	return true;
}

//删除过滤规则
function deleteFilterItem(tableId, index){

	$("#customFwError").text("");
	var itemIndex = 0;
    var mapItemData = new Array(0);

	if(tableId == "ip_filter_text_table"){
		var ports = _arrayTableDataIp[index][2];
		mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/ip_filters/ip_list/Item#index",itemIndex);
		mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/ip_filters/ip_list/Item/wan_ip#delete",_arrayTableDataIp[index][1]);
		mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/ip_filters/ip_list/Item/src_port", ports.split("-")[0]);
		mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/ip_filters/ip_list/Item/dst_port", ports.split("-")[1]);
		mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/ip_filters/ip_list/Item/proto", _arrayTableDataIp[index][3]);
		
		_currentPage = 1;
	}else if(tableId == "mac_filter_text_table"){
		//判断是前模式是否为防火墙开启 MAC过滤开启 黑名单模式
		if( !(_customFWMode == 1 && _macMode == 1 && _macFilterMode == 0) ){
			open_dialog_info(jQuery.i18n.prop("lMacModeError"));
			return;
		}
		//判断是前模式是否为防火墙开启 MAC过滤开启 黑名单模式
		
		mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/mac_filters/mac_list/Item#index",itemIndex);
		mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/mac_filters/mac_list/Item/mac#delete",_arrayTableDataMac[index][1]);
		_currentPage = 2;
	}else if(tableId == "mac_filter_white_text_table"){
		//判断是前模式是否为防火墙开启 MAC过滤开启 白名单模式
		if( !(_customFWMode == 1 && _macMode == 1 && _macFilterMode == 1) ){
			open_dialog_info(jQuery.i18n.prop("lMacModeWhiteError"));
			return;
		}
		//判断是前模式是否为防火墙开启 MAC过滤开启 黑名单模式
		
		//白名单规则数量大于1
		mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/mac_filters/mac_list_white/Item#index",itemIndex);
		mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/mac_filters/mac_list_white/Item/mac#delete",_arrayTableDataMacWhite[index][1]);
		_currentPage = 2;
		//白名单规则数量大于1
	}else if(tableId == "dns_filter_text_table"){
		mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/dns_filters/dns_list/Item#index",itemIndex);
		mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/dns_filters/dns_list/Item/dns#delete",_arrayTableDataDns[index][1]);
		_currentPage = 3;
	}
	
	if(mapItemData.length>0){
		open_dialog_loading();
		$.cgi.postCmd('custom_fw', mapItemData, successAddDeletePostCustomFW, failPostCustomFW); 
	}
}

<!-- ##############################	防火墙公共函数 ################################ -->
<!-- ##############################	防火墙功能函数 ################################ -->
function initCustomFWSetting(){
	_currentPage = 1;
    $.cgi.sendCmd("custom_fw");
}
//初始化页面数据
function getCustomFWData(data,textStatus){
    var xmlData = data;
	_customFWMode = $(xmlData).find("custom_fw").children("mode").text();
    var ipMode = $(xmlData).find("ip_filters").children("mode").text();
	var macMode = $(xmlData).find("mac_filters").children("mode").text();
	_macMode = macMode;
	var dnsMode = $(xmlData).find("dns_filters").children("mode").text();
	var macFilterMode = $(xmlData).find("mac_filters").children("filter_mode").text();
	_macFilterMode = macFilterMode;
	var index = 0;
   	_controlMapOld = g_objXML.putMapElement(_controlMapOld,index++, "RGW/custom_fw/mode", _customFWMode);
   	_controlMapOld = g_objXML.putMapElement(_controlMapOld,index++, "RGW/ip_filters/mode", ipMode);
	_controlMapOld = g_objXML.putMapElement(_controlMapOld,index++, "RGW/mac_filters/mode", macMode);
	_controlMapOld = g_objXML.putMapElement(_controlMapOld,index++, "RGW/mac_filters/filter_mode", macFilterMode);
	_controlMapOld = g_objXML.putMapElement(_controlMapOld,index++, "RGW/dns_filters/mode", dnsMode);
    _controlMapNew = g_objXML.copyArray(_controlMapOld,_controlMapNew);
	
	_arrayTableDataIp = new Array(0);
	_arrayTableDataMac = new Array(0);
	_arrayTableDataDns = new Array(0);
	_arrayTableDataMacWhite = new Array(0);
	//IP地址过滤
	var indexIp = 0;
	$(xmlData).find("ip_list").each(function(){
		$(this).find("Item").each(function(){
			_arrayTableDataIp[indexIp] = new Array(4);
			_arrayTableDataIp[indexIp][0] = indexIp+1;
			_arrayTableDataIp[indexIp][1] = $(this).find("wan_ip").text();
			_arrayTableDataIp[indexIp][2] = $.trim($(this).find("src_port").text()) + "-" + $.trim($(this).find("dst_port").text());
			_arrayTableDataIp[indexIp][3] = $(this).find("proto").text();
			indexIp++;
		});
	});

	//MAC地址黑名单过滤
	var indexMac = 0;
	$(xmlData).find("mac_list").each(function(){
		$(this).find("Item").each(function(){
			_arrayTableDataMac[indexMac] = new Array(2);
			_arrayTableDataMac[indexMac][0] = indexMac+1;
			_arrayTableDataMac[indexMac][1] = $(this).find("mac").text();
			indexMac++;
		});
	});
	//MAC地址白名单过滤
	var indexMacWhite = 0;
	$(xmlData).find("mac_list_white").each(function(){
		$(this).find("Item").each(function(){
			_arrayTableDataMacWhite[indexMacWhite] = new Array(2);
			_arrayTableDataMacWhite[indexMacWhite][0] = indexMacWhite+1;
			_arrayTableDataMacWhite[indexMacWhite][1] = $(this).find("mac").text();
			indexMacWhite++;
		});
	});

	//DNS地址过滤
	var indexDns = 0;
	$(xmlData).find("dns_list").each(function(){
		$(this).find("Item").each(function(){
			_arrayTableDataDns[indexDns] = new Array(2);
			_arrayTableDataDns[indexDns][0] = indexDns+1;
			_arrayTableDataDns[indexDns][1] = $(this).find("dns").text();
			indexDns++;
		});
	});
	
	_totalItemIp = indexIp;
	_totalItemMac = indexMac;
	_totalItemDns = indexDns;
	_totalItemMacWhite = indexMacWhite;
	
	if(_arrayTableDataIp[indexIp])
        delete(_arrayTableDataIp[indexIp]);
	if(_arrayTableDataMac[indexMac])
        delete(_arrayTableDataMac[indexMac]);
	if(_arrayTableDataDns[indexDns])
        delete(_arrayTableDataDns[indexDns]);
	if(_arrayTableDataMacWhite[indexMacWhite])
        delete(_arrayTableDataMacWhite[indexMacWhite]);
	
    $("#customFwError").text("");
	//防火墙开关状态 1-开启 0-关闭
	if (_customFWMode == 1) {
		setCheckboxsValue("firewall_status_checkbox",1);
		$("#filter_tab_div").show();
	}else {
	    setCheckboxsValue("firewall_status_checkbox",0);
		$("#filter_tab_div").hide();
	}
	
	//IP地址过滤开关 1-开启 0-关闭
	if (ipMode == 1) {
		setCheckboxsValue("ip_filter_status_checkbox",1);
		$("#ip_filter_btn").show();
		$("#ip_filter_text_table").show();
	}else {
	    setCheckboxsValue("ip_filter_status_checkbox",0);
		$("#ip_filter_btn").hide();
		$("#ip_filter_text_table").hide();
	}

	//MAC地址过滤开关 1-开启 0-关闭
	if (macMode == 1) {
		setCheckboxsValue("mac_filter_status_checkbox",1);
		$("#mac_filter_mode_list_table").show();
		//黑名单
		if(macFilterMode == 0){
			setCheckboxsValue("mac_filter_mode_status_checkbox",0);	
			$("#black_list").show();
			$("#white_list").hide();
		}else{
			setCheckboxsValue("mac_filter_mode_status_checkbox",1);
			$("#black_list").hide();
			$("#white_list").show();
		}
	}else {
	    setCheckboxsValue("mac_filter_status_checkbox",0);
		$("mac_filter_mode_list_table").hide();
		//黑名单
		if(macFilterMode == 0){
			setCheckboxsValue("mac_filter_mode_status_checkbox",0);	
			$("#black_list").show();
			$("#white_list").hide();	

		}else{
			setCheckboxsValue("mac_filter_mode_status_checkbox",1);
			$("#black_list").hide();
			$("#white_list").show();
		}
		
		$("#mac_filter_mode_table").hide();
		$("#black_list").hide();
		$("#white_list").hide();
	}
	//DNS地址过滤开关 1-开启 0-关闭
	if (dnsMode == 1) {
		setCheckboxsValue("dns_filter_status_checkbox",1);	
		$("#dns_filter_btn").show();
		$("#dns_filter_text_table").show();
	}else {
	    setCheckboxsValue("dns_filter_status_checkbox",0);	
		$("#dns_filter_btn").hide();
		$("#dns_filter_text_table").hide();
	}
	
	//判断是否显示IP过滤的添加按钮
	if (_customFWMode == 1 && ipMode == 1){
		$("#btnIpAdd").show();
	}
	else{
		$("#btnIpAdd").hide();
	}
	
	//判断是否显示MAC过滤的添加按钮
	if(_customFWMode == 1 && macMode == 1 ){
		if(macFilterMode == 1){
			$("#btnMacAdd").hide();
			$("#btnMacWhiteAdd").show();
		}else{
			$("#btnMacAdd").show();
			$("#btnMacWhiteAdd").hide();
		}
	}else{
		$("#btnMacAdd").hide();
		$("#btnMacWhiteAdd").hide();
	}

	//判断是否显示域名过滤的添加按钮
	if (_customFWMode == 1 && dnsMode == 1){
		$("#btnDnsAdd").show();
	}else{
		$("#btnDnsAdd").hide();
	}
	//加载数据为table	
	loadTableData(_arrayTableDataIp, "ip_filter_text_table", (_customFWMode == 1 && ipMode == 1)?'1':'0' );
	loadTableData(_arrayTableDataMac, "mac_filter_text_table", (_customFWMode == 1 && macMode == 1 )?'1':'0' );
	loadTableData(_arrayTableDataMacWhite, "mac_filter_white_text_table", (_customFWMode == 1 && macMode == 1 )?'1':'0' );
	loadTableData(_arrayTableDataDns, "dns_filter_text_table", (_customFWMode == 1 && dnsMode == 1)?'1':'0' );
	//显示当前选项卡
	setFilterTab('filter',_currentPage,3);
}

//组成数据成为Table格式，页面显示
function loadTableData(arrayTableData,tableId,flag){
	var tableFilterList = document.getElementById(tableId);
	var tbodyFilterList = tableFilterList.getElementsByTagName("tbody")[0];
	clearTableRows(tableId);
	
	for(var i = 0; i < arrayTableData.length; i++){
		var arrayRow = arrayTableData[i];
		var row = tbodyFilterList.insertRow(-1);
		
		$(row).css("background-color","#feffed");
		$(row).click(function(){
			$(this).siblings().css("background-color", "#feffed");
			$(this).siblings().removeClass("itemColor");
			$(this).css("background-color","#eae8e8");
			$(this).addClass("itemColor");
		});

		var col = "";
		for(var j = 0; j < arrayRow.length; j++){
			col = row.insertCell(j);
			col.innerHTML = arrayRow[j];
		}
		
		col = row.insertCell(j);
		if(flag == '1'){
			col.innerHTML = "<a onclick=\"deleteFilterItem('"+tableId+"',"+i+")\" style='cursor:pointer;'><img src='images/close.png' class='del_40_40' alt='' title='"+jQuery.i18n.prop("warnDelete")+"' border='0' /></a>";
		}else{
			col.innerHTML = "<img src='images/disclose.png' class='del_40_40' alt='' title='"+jQuery.i18n.prop("warnOperate")+"' border='0' />";
		}
	}
}
//防火墙应用 提交函数
function PostCustomFWSet(){
	$("#customFwError").text("");
	var pageCustomFWEnable = getCheckboxsValue("firewall_status_checkbox"); 
	var pageIpFilterEnable = getCheckboxsValue("ip_filter_status_checkbox"); 
	var pageDnsFilterEnable = getCheckboxsValue("dns_filter_status_checkbox"); 
	var pageMacFilterEnable = getCheckboxsValue("mac_filter_status_checkbox");
	var pageMacFilterBlacklist =getCheckboxsValue("mac_filter_mode_status_checkbox");
	
	var mapData = new Array(0);
	if(pageCustomFWEnable != '1'){
		if(pageCustomFWEnable != _customFWMode)
			mapData = putMapElement(mapData,"RGW/custom_fw/mode",pageCustomFWEnable,0);
	}else{
		var index = 0;
		_controlMapNew[index++][1] = pageCustomFWEnable;
		_controlMapNew[index++][1] = pageIpFilterEnable;
		_controlMapNew[index++][1] = pageMacFilterEnable;
		_controlMapNew[index++][1] = pageMacFilterBlacklist;
		_controlMapNew[index++][1] = pageDnsFilterEnable;
		mapData = g_objXML.copyArray(_controlMapNew,mapData);
		mapData = g_objXML.getChangedArray(_controlMapOld,mapData,true);
	}

	if(mapData.length>0) {
		open_dialog_loading();
		$.cgi.postCmd("custom_fw", mapData, successPostCustomFW, failPostCustomFW);
	}
}
//防火墙应用 提交函数 成功回调函数
function successPostCustomFW(data) {
    close_dialog_loading();
	getCustomFWData(data);
	open_dialog_info(jQuery.i18n.prop("lsuccessAddDelete"));
}
//防火墙应用 提交函数 失败回调函数
function failPostCustomFW(){
	close_dialog_loading();
	open_dialog_info(jQuery.i18n.prop("failApply"));
}

//防火墙添加删除 成功回调函数
function successAddDeletePostCustomFW(data) {
    close_dialog_loading();
	getCustomFWData(data);
	open_dialog_info(jQuery.i18n.prop("lsuccessAddDelete"));
}

//IP地址过滤 添加函数
function PostIpFilterAdd(){
	$("#customFwError").text("");
	if(_totalItemIp == 10){
		open_dialog_info(jQuery.i18n.prop("lErrorMaxIp"));
		return false;
	}
	//设置对话框的默认值
	$("#txtIpNewWanAddr").val("");
	$("#txtIpNewPortStart").val("");
	$("#txtIpNewPortEnd").val("");
	SetOptionValue("textIpNewProto",1);
	//清空错误信息
	$("#lErrorNewIp").text("");	
	
	$("#AddIpFilterDialog").dialog({
        modal:true,
        height: 370,
        width: 430,
        resizable:false,
        title: jQuery.i18n.prop("titleAdd")
    });
}

//确认添加IP地址过滤函数
function ConfirmAddIpFilter(){
	var ipWanAddr = $("#txtIpNewWanAddr").val();
	var portStart = $("#txtIpNewPortStart").val();
	var portEnd = $("#txtIpNewPortEnd").val();
	var pageProto = GetOptionsValue("textIpNewProto");
	if(pageProto == 1){
		pageProto = "tcp";
	}else if(pageProto == 2){
		pageProto = "udp";
	}else if(pageProto == 3){
		pageProto = "both";
	}
	//验证提交的数据是否合法
	if(isValidIpFilter(ipWanAddr, portStart, portEnd)){
		for(i=0;i<_arrayTableDataIp.length;i++){
			if(ipWanAddr == _arrayTableDataIp[i][1] && (portStart+ "-" +portEnd) == _arrayTableDataIp[i][2] && pageProto.toLowerCase() == _arrayTableDataIp[i][3].toLowerCase()){
				open_dialog_info(jQuery.i18n.prop("lErrorFilterSame"));
				return;
			}
		}
		$("#AddIpFilterDialog").dialog("destroy");
		open_dialog_loading();
		var itemIndex = 0;
		var mapItemData = new Array(0);
		mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/ip_filters/ip_list/Item#index", itemIndex);
		mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/ip_filters/ip_list/Item/wan_ip", ipWanAddr);
		mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/ip_filters/ip_list/Item/src_port", portStart);
		mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/ip_filters/ip_list/Item/dst_port", portEnd);
		mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/ip_filters/ip_list/Item/proto", pageProto);
		_currentPage = 1;
		$.cgi.postCmd('custom_fw', mapItemData, successAddDeletePostCustomFW, failPostCustomFW); 	
	}
}
//取消添加IP地址过滤函数
function CancelAddIpFilter(){
	$("#AddIpFilterDialog").dialog("destroy");
}
//MAC地址黑名单过滤 添加函数
function PostMacFilterAdd(){
	$("#customFwError").text("");
	if(_totalItemMac == 10){
		open_dialog_info(jQuery.i18n.prop("lErrorMaxMac"));
		return false;
	}
	//设置对话框的默认值
	$("#txtMacNewAddr").val("");
	$("#lErrorNewMac").text("");
	$("#AddMacFilterDialog").dialog({
        modal:true,
        height: 200,
        width: 430,
        resizable:false,
        title: jQuery.i18n.prop("titleAdd")
    });
}

//MAC地址黑名单过滤 确认添加函数
function ConfirmAddMacFilter(){
	var addMac = $("#txtMacNewAddr").val();
	if(!validateMACAddress(addMac)){
		open_dialog_info(jQuery.i18n.prop("lMacErrorMsg"));
		return;
	}

	//验证黑名单合法性
	if(getCheckboxsValue("mac_filter_mode_status_checkbox") == 0){
		//判断黑名单是否重复
		for(i = 0; i < _arrayTableDataMac.length; i++){
			if(addMac.toLowerCase() == _arrayTableDataMac[i][1].toLowerCase()){
				open_dialog_info(jQuery.i18n.prop("lErrorFilterSame"));
				return;
			}
		}
		//判断黑名单是否存在白名单中
		for(i = 0; i < _arrayTableDataMacWhite.length; i++){
			if(addMac.toLowerCase() == _arrayTableDataMacWhite[i][1].toLowerCase()){
				open_dialog_info(jQuery.i18n.prop("lMacInWhiteBlackError"));
				return;
			}
		}
	}else{//验证白名单合法性
		//判断白名单是否重复
		for(i = 0; i < _arrayTableDataMacWhite.length; i++){
			if(addMac.toLowerCase() == _arrayTableDataMacWhite[i][1].toLowerCase()){
				open_dialog_info(jQuery.i18n.prop("lErrorFilterSame"));
				return;
			}
		}
		//判断白名单是否存在黑名单中
		for(i = 0; i < _arrayTableDataMac.length; i++){
			if(addMac.toLowerCase() == _arrayTableDataMac[i][1].toLowerCase()){
				open_dialog_info(jQuery.i18n.prop("lMacInWhiteBlackError"));
				return;
			}
		}
	}
	
	//关闭添加MAC过滤对话框
	$("#AddMacFilterDialog").dialog("destroy");

	open_dialog_loading();
	var itemIndex = 0;
	var mapItemData = new Array(0);
	//添加黑名单提交数据
	if(getCheckboxsValue("mac_filter_mode_status_checkbox") == 0){
		mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/mac_filters/mac_list/Item#index", itemIndex);
		mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/mac_filters/mac_list/Item/mac", addMac);
	}else{//添加白名单提交数据
		mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/mac_filters/mac_list_white/Item#index", itemIndex);
		mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/mac_filters/mac_list_white/Item/mac", addMac);
	}
	_currentPage = 2;
	$.cgi.postCmd('custom_fw', mapItemData, successAddDeletePostCustomFW, failPostCustomFW); 	
}
//MAC地址黑名单过滤 取消添加函数
function CancelAddMacFilter(){
	$("#AddMacFilterDialog").dialog("destroy");
}
function PostMacFilterWhiteAdd(){
	$("#customFwError").text("");
	if(_totalItemMacWhite == 10){
		open_dialog_info(jQuery.i18n.prop("lErrorMaxMac"));
		return false;
	}
	$("#txtMacNewAddr").val("");
	$("#lErrorNewMac").text("");
	$("#AddMacFilterDialog").dialog({
        modal:true,
        height: 200,
        width: 430,
        resizable:false,
        title: jQuery.i18n.prop("titleAdd")
    });
}
//DNS地址过滤 添加函数
function PostDnsFilterAdd(){
	$("#customFwError").text("");
	if(_totalItemDns == 10){
		open_dialog_info(jQuery.i18n.prop("lErrorMaxDns"));
		return false;
	}
	$("#txtDnsNewAddr").val("");
	$("#lErrorNewDns").text("");
	$("#AddDnsFilterDialog").dialog({
        modal:true,
        height: 200,
        width: 430,
        resizable:false,
        title: jQuery.i18n.prop("titleAdd")
    });
}
//DNS地址过滤 确认添加函数
function ConfirmAddDnsFilter(){
	var addDns = $("#txtDnsNewAddr").val();
	if(!validateDomainName(addDns)){
		open_dialog_info(jQuery.i18n.prop("lDnsErrorMsg"));
		return;
	}
	for(i=0;i<_arrayTableDataDns.length;i++){
		if(addDns.toLowerCase() == _arrayTableDataDns[i][1].toLowerCase()){
			$("#lErrorNewDns").text(jQuery.i18n.prop("lErrorFilterSame"));
			return;
		}
	}
	$("#AddDnsFilterDialog").dialog("destroy");
	open_dialog_loading();
	var itemIndex = 0;
	var mapItemData = new Array(0);
	mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/dns_filters/dns_list/Item#index", itemIndex);
	mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/dns_filters/dns_list/Item/dns", addDns);
	_currentPage = 3;
	$.cgi.postCmd('custom_fw', mapItemData, successAddDeletePostCustomFW, failPostCustomFW); 
}
//DNS地址过滤 取消添加函数
function CancelAddDnsFilter(){
	$("#AddDnsFilterDialog").dialog("destroy");
}
<!-- ##############################	防火墙功能函数 ################################ -->