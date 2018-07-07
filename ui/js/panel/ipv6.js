$(function(){
	//实例化IP协议 下拉框
	initOptions("textIpMode");
	//实例化MTU修改 0-关闭 1-开启
	initCheckboxs("mtu_status_checkbox");
	//实例化地址配置 0-无状态 1-有状态
	initCheckboxs("ip_address_setting_checkbox");
	//初始化页面显示文字
	initIPv6PageWords();

    $.cgi.onGetXml('wan_ip', getProtocolData);
	$.cgi.onGetXml('status1', function (xmlData) {
		$(xmlData).find("wan").each(function () {
			//显示IPv6地址
			$('#lNetInfoIpV6').text($(this).find("ip_v6").text());
			//显示DNS v6地址
			var dns1V6 = $(this).find("dns1_v6").text();
			var dns2V6 = $(this).find("dns2_v6").text();
			if (dns1V6 != null && dns1V6 != "" && dns2V6 != null && dns2V6 != "") {
				$('#lNetInfoDnsV6').text(dns1V6 + ' , ' + dns2V6);
			}else if(dns1V6 != null && dns1V6 != "") {
				$('#lNetInfoDnsV6').text(dns1V6);
			}else if(dns2V6 != null && dns2V6 != "") {
				$('#lNetInfoDnsV6').text(dns2V6);
			}
		});
	});
});

var _mtuStatus = "";
var _mtuContent = "";
var _addrStatus = "";
var _ipv6controlMapExisting=new Array(0);
var _ipv6controlMapCurrent=new Array(0);

function initProtocolSetting(){
    $.cgi.sendCmd("wan_ip");
}

function changeIpMode(){
	var IpMode =GetOptionsValue("textIpMode");
	if(IpMode == 1){
		$("#HideV4_tb1").hide();
		$("#HideV4_tb2").hide();
		$("#HideV4_tb22").hide();
	}else{
		$("#HideV4_tb1").show();
		$("#HideV4_tb2").show();
		$("#HideV4_tb22").show();
	}
}
//获取页面信息
function getProtocolData(data,textStatus){
    var xmlData = data;
	_mtuStatus = $(xmlData).find("mtu_switch").text();
    _mtuContent = $(xmlData).find("mtu").text();
	_addrStatus = $(xmlData).find("addr_status").text();
	var networkmode = $(xmlData).find("network_mode").text();
    
    var index = 0;
	_ipv6controlMapExisting = g_objXML.putMapElement(_ipv6controlMapExisting,index++, "RGW/wan_ip/mtu_switch", _mtuStatus);
    _ipv6controlMapExisting = g_objXML.putMapElement(_ipv6controlMapExisting,index++, "RGW/wan_ip/mtu", _mtuContent);
	_ipv6controlMapExisting = g_objXML.putMapElement(_ipv6controlMapExisting,index++, "RGW/wan_ip/addr_status", _addrStatus);
	_ipv6controlMapExisting = g_objXML.putMapElement(_ipv6controlMapExisting,index++, "RGW/wan_ip/network_mode", networkmode);
    _ipv6controlMapCurrent = g_objXML.copyArray(_ipv6controlMapExisting,_ipv6controlMapCurrent);
            
    $("#ipSetError").text("");
	$("#textMTU").val(_mtuContent);
	
	SetOptionValue("textIpMode",networkmode);
	
	if(networkmode != "0"){
		$("#HideV4_tb1").show();
		$("#HideV4_tb2").show();
		$("#HideV4_tb22").show();
	}else{
		$("#HideV4_tb1").hide();
		$("#HideV4_tb2").hide();
		$("#HideV4_tb22").hide();
	}
	
	gIpMode = networkmode;
	
	//有状态
	if (parseInt(_addrStatus) == 1) {
		setCheckboxsValue("ip_address_setting_checkbox",1);
	}else{//无状态
	    setCheckboxsValue("ip_address_setting_checkbox",0);
	}	
	//开启
	if (parseInt(_mtuStatus) == 1) {
        setCheckboxsValue("mtu_status_checkbox",1);
		$("#textMTU").hojyBnEnable(true);
	}else{//关闭		
	    setCheckboxsValue("mtu_status_checkbox",0);
		$("#textMTU").hojyBnEnable(false);
	}
}
//开启MTU修改
function open_MtuStatus(){
	$("#textMTU").hojyBnEnable(true);
}
//关闭MTU修改
function close_MtuStatus(){
	$("#textMTU").hojyBnEnable(false);
}
//初始化IPv6显示文字
function initIPv6PageWords(){
	$("#lProtocolSet").text(jQuery.i18n.prop("lProtocolSet"));
	$("#ipv6_mode_title").text(jQuery.i18n.prop("lIpMode"));
	$("#optIpv1").text(jQuery.i18n.prop("optIpv1"));
	$("#optIpv2").text(jQuery.i18n.prop("optIpv2"));
	$("#optIpv3").text(jQuery.i18n.prop("optIpv3"));
	$("#mtu_title").text(jQuery.i18n.prop("lMTU"));
	$("#mtu_status_title").text(jQuery.i18n.prop("lMTUEdit"));
	$("#ip_address_setting_title").text(jQuery.i18n.prop("lAddrStatus"));
	$("#ip_address_setting_open_title").text(jQuery.i18n.prop("laddrEnable"));
	$("#ip_address_setting_close_title").text(jQuery.i18n.prop("laddrDisable"));
	$("#h1NetworkInfoV6").text(jQuery.i18n.prop("h1NetworkInfoV6"));
	$("#ipv6_address_title").text(jQuery.i18n.prop("ipAddress1V6"));
	$("#dnsv6_address_title").text(jQuery.i18n.prop("lDnsV6"));
}

//应用提交函数
function PostProtocolSet(){
	$("#ipSetError").text("");
    var pageMTU = $("#textMTU").val();
	var pageAddrEnable = getCheckboxsValue("ip_address_setting_checkbox"); 
	var pageMtuEnable = getCheckboxsValue("mtu_status_checkbox"); 
    var IpMode = parseInt(GetOptionsValue("textIpMode"));
	
	if(IpMode != 0){
		if(pageMtuEnable == '1'){
			if(!isValidProtocol(pageMTU))
				return;
		}else{
			pageMTU = _mtuContent;
		}
	}else{
		pageMtuEnable = _mtuStatus;
		pageMTU = _mtuContent;
		pageAddrEnable = _addrStatus;
	}
	
	$("#ipSetError").text("");
	
	var index = 0;
	var mapData = new Array(0);
	_ipv6controlMapCurrent[index++][1] = pageMtuEnable;
	_ipv6controlMapCurrent[index++][1] = pageMTU;
	_ipv6controlMapCurrent[index++][1] = pageAddrEnable;
	_ipv6controlMapCurrent[index++][1] = IpMode;
	mapData = g_objXML.copyArray(_ipv6controlMapCurrent,mapData);
	mapData = g_objXML.getChangedArray(_ipv6controlMapExisting,mapData,true);
	 
	if(mapData.length>0) {
		open_dialog_loading();
		$.cgi.postCmd('wan_ip', mapData, successPostProtocolSet, failPostProtocolSet); 
	}
}
function successPostProtocolSet(data) {
    close_dialog_loading();
	getProtocolData(data);
	open_dialog_info(jQuery.i18n.prop("lSuccessIPv6")); 
}

function failPostProtocolSet(){
	close_dialog_loading();
	open_dialog_info(jQuery.i18n.prop("failApply"));
}
//验证MTU合法性
function isValidProtocol(mtu){
    var re = /^\d$/;
    if (re.test(mtu)){
        open_dialog_info(jQuery.i18n.prop("lErrorMTU"));
        return false;
    }
	if(mtu > 1500 || mtu < 1280){
		open_dialog_info(jQuery.i18n.prop("lErrorMTU1"));
        return false;
	}
    return true;
}