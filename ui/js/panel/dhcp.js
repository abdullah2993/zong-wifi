$(function(){
	//实例化DHCP服务器 0-关闭 1-开启
	initCheckboxs("dhcp_server_checkbox");
	initDHCPPageWords();
	//注册XML事件
	$.cgi.onGetXml("lan", getDhcpData, failGetDhcpData);
});
//初始化DHCP显示文字
function initDHCPPageWords(){
	$("#dhcp_ip_title").text(jQuery.i18n.prop("DHCPIPAddress"));
	$("#dhcp_mask_title").text(jQuery.i18n.prop("DHCPMaskAddress"));
	$("#dhcp_server_title").text(jQuery.i18n.prop("DHCPServerAddress"));
	$("#dhcp_start_ip_title").text(jQuery.i18n.prop("DHCPStartAddress"));
	$("#dhcp_end_ip_title").text(jQuery.i18n.prop("DHCPEndAddress"));
	$("#dhcp_leases_title").text(jQuery.i18n.prop("DHCPLeaseTime"));
}
<!-- ####################################  公共变量  ############################### -->
var _serverStatus; // DHCP状态
var _ipStart; //起始IP地址
var _ipEnd; //结束IP地址
var _leaseTime; //DHC租期
var _routerIp; //设备局域网的IP地址
var _routerMask; //设备局域网的子网掩码

var _dh5xmlData = ''; 
var _dhcpData = '';
var _dh5controlMapExisting=new Array(0);
var _dh5controlMapCurrent=new Array(0);
<!-- ####################################  公共变量  ############################### -->
<!-- ####################################  DHCP处理函数  ############################### -->
//点击DHCP图标 初始化页面数据函数
function initDhcpSetting() {
    $.cgi.sendCmd("lan");
}
//获取DHCP数据 成功回调函数
function getDhcpData(data,textStatus){
    _dh5xmlData = data;
    _routerIp = $(_dh5xmlData).find("ip").text();
    _routerMask = $(_dh5xmlData).find("mask").text();
    $(_dh5xmlData).find("dhcp").each(function (){
        _serverStatus=$(this).find("status").text();
        _ipStart=$(this).find("start").text();
        _ipEnd=$(this).find("end").text();
        _leaseTime=$(this).find("lease_time").text();
    }); 
    var index=0;
    _dh5controlMapExisting = g_objXML.putMapElement(_dh5controlMapExisting,index++, "RGW/lan/ip", _routerIp);
    _dh5controlMapExisting = g_objXML.putMapElement(_dh5controlMapExisting,index++, "RGW/lan/mask", _routerMask);      
    _dh5controlMapExisting = g_objXML.putMapElement(_dh5controlMapExisting,index++, "RGW/lan/dhcp/status", _serverStatus);
    _dh5controlMapExisting = g_objXML.putMapElement(_dh5controlMapExisting,index++, "RGW/lan/dhcp/start", _ipStart);
    _dh5controlMapExisting = g_objXML.putMapElement(_dh5controlMapExisting,index++, "RGW/lan/dhcp/end", _ipEnd);
    _dh5controlMapExisting = g_objXML.putMapElement(_dh5controlMapExisting,index++, "RGW/lan/dhcp/lease_time", _leaseTime);
    _dh5controlMapCurrent = g_objXML.copyArray(_dh5controlMapExisting,_dh5controlMapCurrent);
    displayDhcpData();
}
//获取DHCP数据 失败回调函数
function failGetDhcpData() {
    
}
//根据获取的DHCP数据，显示内容
function displayDhcpData() {
    $("#ipText").val(_routerIp);
    $("#maskText").val(_routerMask);
    $("#ipStartText").val(_ipStart);
    $("#ipEndText").val(_ipEnd);
    $("#tbdhcplt").val(_leaseTime);
   	//DHCP服务器开启
    if (_serverStatus == 1) {
    	setCheckboxsValue("dhcp_server_checkbox",1);
    	//启用IP地址编辑
        $("#ipText").hojyBnEnable(true);
		//禁用子网掩码地址编辑
		$("#maskText").hojyBnEnable(false);
		//显示起始地址 结束地址 DHCP租期
        $("#tr_ipStartText").show();
        $("#tr_ipEndText").show();
        $("#tr_tbdhcplt").show();
    }else{//DHCP服务器关闭
        setCheckboxsValue("dhcp_server_checkbox",0);
        //禁用IP地址编辑
        $("#ipText").hojyBnEnable(false);
        //禁用子网掩码地址编辑
        $("#maskText").hojyBnEnable(false);
        //隐藏起始地址 结束地址 DHCP租期
        $("#tr_ipStartText").hide();
        $("#tr_ipEndText").hide();
        $("#tr_tbdhcplt").hide();
    }
}
//DHCP 开启按钮 选中
function open_dhcp_server_click(){
	//启用IP地址编辑
    $("#ipText").hojyBnEnable(true);
	//禁用子网掩码地址编辑
	$("#maskText").hojyBnEnable(false);
	//显示起始地址 结束地址 DHCP租期
    $("#tr_ipStartText").show();
    $("#tr_ipEndText").show();
    $("#tr_tbdhcplt").show();
}
//DHCP 关闭按钮 选中
function close_dhcp_server_click(){
	//禁用IP地址编辑
    $("#ipText").hojyBnEnable(false);
    //禁用子网掩码地址编辑
    $("#maskText").hojyBnEnable(false);
    //隐藏起始地址 结束地址 DHCP租期
    $("#tr_ipStartText").hide();
    $("#tr_ipEndText").hide();
    $("#tr_tbdhcplt").hide();
}
//DHCP应用提交函数
function PostDhcpSet(){
    var pageIP = $("#ipText").val();
    var pageMask = $("#maskText").val();
    var pageIpStart = $("#ipStartText").val();
    var pageIpEnd = $("#ipEndText").val();
    var pageLeastTime = $("#tbdhcplt").val();
    var pageDhcpEnable = getCheckboxsValue("dhcp_server_checkbox");

    //验证设置的DHCP合法性 ip地址 起始地址 结束地址 不允许相同
    if(pageIP == pageIpStart || pageIP == pageIpEnd || pageIpStart == pageIpEnd){
        open_dialog_info(jQuery.i18n.prop("lIpSameError1"));
        return;
    }

    //IP结束地址必须大于IP起始地址
    if(compareIP(pageIpEnd,pageIpStart) == -1){
        open_dialog_info(jQuery.i18n.prop("lIpSameError2"));
        return;
    }
    
    //IP地址必须小于IP起始地址
    if(compareIP(pageIpStart,pageIP) == -1){
        open_dialog_info(jQuery.i18n.prop("lIpSameError3"));
        return;
    }

    var index=0;
    var mapData = new Array(0);
    //在应用的时候判断是选择禁用还是启用
    if (pageDhcpEnable == 1){
		if (isValidDhcp(pageIP, pageMask, pageIpStart, pageIpEnd, pageLeastTime)) {
			pageIP = check_ip_addr_format(pageIP);
			pageMask = check_ip_addr_format(pageMask);
			pageIpStart = check_ip_addr_format(pageIpStart);
			pageIpEnd = check_ip_addr_format(pageIpEnd);
			pageLeastTime = parseInt(pageLeastTime);
			_dh5controlMapCurrent[index++][1] = pageIP;
			_dh5controlMapCurrent[index++][1] = pageMask;
			_dh5controlMapCurrent[index++][1] = pageDhcpEnable;
			_dh5controlMapCurrent[index++][1] = pageIpStart;
			_dh5controlMapCurrent[index++][1] = pageIpEnd;
			_dh5controlMapCurrent[index++][1] = pageLeastTime;
			mapData = g_objXML.copyArray(_dh5controlMapCurrent, mapData);
			mapData = g_objXML.getChangedArray(_dh5controlMapExisting, mapData, true);
		}
    }else {
        if (_dh5controlMapCurrent[2][1] != pageDhcpEnable){
            _dh5controlMapCurrent[2][1] = pageDhcpEnable;
            mapData[0] = new Array(2);
            mapData[0] = _dh5controlMapCurrent[2];
        }
    }
    if (mapData.length > 0) {
        open_dialog_loading();
		//判断是否只修改了DHCP开关状态
		if(pageDhcpEnable == 0 && _routerIp == pageIP && _routerMask == pageMask && _ipStart == pageIpStart && _ipEnd == pageIpEnd && _leaseTime == pageLeastTime){
			$.cgi.postCmd("lan", mapData, successPostDhcpSetBySwitch, failPostDhcpSet);
		}else{
			$.cgi.postCmd("lan", mapData, successPostDhcpSet, failPostDhcpSet);
		}                            
    }
}
//DHCP应用提交函数 成功回调函数,未修改开关状态
function successPostDhcpSet(data){
    close_dialog_loading();
    getDhcpData(data);
    open_dialog_info(jQuery.i18n.prop("lsuccessAddDelete"));
}
//DHCP应用提交函数 成功回调函数,只修改开关状态
function successPostDhcpSetBySwitch(data){
    close_dialog_loading();
    getDhcpData(data);
    open_dialog_info(jQuery.i18n.prop("successApply"));
}
//DHCP应用提交函数 失败回调函数
function failPostDhcpSet(){
    close_dialog_loading();
    open_dialog_info(jQuery.i18n.prop("failApply")); 
}
<!-- #############################   公共函数   ############################## -->
//验证 DHCP提价的参数 是否符合要求
function isValidDhcp(pageIP, pageMask, pageIpStart, pageIpEnd, pageLeastTime){
    if (!(isIPFULL(pageIP, true) && isIPFULL(pageMask, true) && isIPFULL(pageIpStart, true) && isIPFULL(pageIpEnd, true))) {
        open_dialog_info(jQuery.i18n.prop("lIPErrorMsg"));
        return false;
    } 
    var partsIp = _routerIp.split(".");
    var partsPageIp = pageIP.split(".");
	if(parseInt(parseFloat(partsIp[0])) != parseInt(parseFloat(partsPageIp[0]))
        || parseInt(parseFloat(partsIp[1])) != parseInt(parseFloat(partsPageIp[1]))){
        open_dialog_info(jQuery.i18n.prop("lIPErrorEdit1"));
        return false;
    }
	if(parseInt(parseFloat(partsPageIp[2])) == 1 && $.hojyStatus.product_model == "mifi"){
        open_dialog_info(jQuery.i18n.prop("lIPErrorEdit5"));
        return false;
    }
    var partsPageIpStart = pageIpStart.split(".");
    var partsPageIpEnd = pageIpEnd.split(".");
    if(parseInt(parseFloat(partsPageIpStart[0])) != parseInt(parseFloat(partsPageIp[0]))
        || parseInt(parseFloat(partsPageIpStart[1])) != parseInt(parseFloat(partsPageIp[1]))
        || parseInt(parseFloat(partsPageIpStart[2])) != parseInt(parseFloat(partsPageIp[2]))
        || parseInt(parseFloat(partsPageIpEnd[0])) != parseInt(parseFloat(partsPageIp[0]))
        || parseInt(parseFloat(partsPageIpEnd[1])) != parseInt(parseFloat(partsPageIp[1]))
        || parseInt(parseFloat(partsPageIpEnd[2])) != parseInt(parseFloat(partsPageIp[2])))
    {
        open_dialog_info(jQuery.i18n.prop("lIPErrorEdit2"));
        return false;
    }
	if(parseInt(parseFloat(partsPageIpStart[3])) == 0 || parseInt(parseFloat(partsPageIpStart[3])) == 255
		|| parseInt(parseFloat(partsPageIpEnd[3])) == 0 || parseInt(parseFloat(partsPageIpEnd[3])) == 255
		|| parseInt(parseFloat(partsPageIp[3])) == 0 || parseInt(parseFloat(partsPageIp[3])) == 255)
	{
		open_dialog_info(jQuery.i18n.prop("lIPErrorEdit4"));
		return false;
	}
    if(parseInt(parseFloat(partsPageIpStart[3])) > parseInt(parseFloat(partsPageIpEnd[3]))){
        open_dialog_info(jQuery.i18n.prop("lIPErrorEdit3"));
        return false;
    }
    var re = /^[0-9]{1,10}$/;
    if (!re.test(pageLeastTime)){
        open_dialog_info(jQuery.i18n.prop("lErrorNumber"));
        return false;
    }
    if (parseInt(pageLeastTime) < 86400 || parseInt(pageLeastTime) > 604800) {
        open_dialog_info(jQuery.i18n.prop("lErrorDHCPTimeSet"));
        return false;
    }
    return true;
}
//验证IP地址格式 是否符合要求
function isIPFULL(inputString,flag) {
    var re = /^(\d{1,3}\.){3}\d{1,3}$/;
    if(!flag){
        if(inputString=="..."){
            return true;
        }else{
            isIPFULL(inputString,true);
        }
    }
    if (re.test(inputString)) 
    {
        //now, validate the separate parts
        var parts = inputString.split(".");
        if (parseInt(parseFloat(parts[0])) == 0) 
        {
            return false;
        }
        for (var i=0; i<parts.length; i++) {
            if (parseInt(parseFloat(parts[i])) > 255){
                return false;
            }
        }
        return true;
    }else{
        return false;
    }
}
//检验IP地址格式
function check_ip_addr_format(ipaddr){
    var ip_addr = ipaddr.split(".");
    var tmp_val;
    tmp_val = parseInt(parseFloat(ip_addr[0])) + "." + parseInt(parseFloat(ip_addr[1])) + "."+ parseInt(parseFloat(ip_addr[2])) + "." + parseInt(parseFloat(ip_addr[3]));
    return tmp_val;
}

//比较IP地址大小 IPv4
function compareIP(ipBegin, ipEnd){  
    var temp1;  
    var temp2;    
    temp1 = ipBegin.split(".");  
    temp2 = ipEnd.split(".");     
    for (var i = 0; i < 4; i++){  
        if (temp1[i] > temp2[i]){  
            return 1;  
        }else if (temp1[i]<temp2[i]){  
            return -1;  
        }  
    }  
    return 0;     
}  