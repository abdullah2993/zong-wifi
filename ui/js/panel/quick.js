$(function() {
    initQuickPageWords();
    //获取wlan安全信息
    $.cgi.onGetXml('uapxb_wlan_security_settings', getWlanQuickSetData);
    //获取wlan基本信息
	$.cgi.onGetXml('uapxb_wlan_basic_settings', function (xml) {
	    $(xml).find("wlan_settings").each(function () {
	        _q2netEnable = $(this).find("wlan_enable").text();
	    });
	});
});

//初始化设置向导显示文字
function initQuickPageWords(){
	$("#lQuickSet").text(jQuery.i18n.prop("quickTitle"));
	$("#guide_username_title").text(jQuery.i18n.prop("SSIDName"));
	$("#guide_password_title").text(jQuery.i18n.prop("SSIDPassword"));
	$("#q2devlunmaskpass").text(jQuery.i18n.prop("q2devlunmaskpass"));
}
<!-- ###############################设置向导页面公共变量################################### -->
var _q2netEnable; //网络使能，开启/关闭
var _q2xmlData = ''; 
var _q2strSSID=''; //SSID名称
var _q2ssidLimit='0'; //SSID格式限制，是/否
var _q2securityType=''; //802.11认证方式
var _q2modeKey=''; //密码
var _q2wapiKeyType=''; //WAPI-PSK模式下的编码方式（ascii/hex）
var _q2wepEncrypt=''; //WEP模式下的加密方式（64 bit/128 bit）
var _q2controlMapExisting=new Array(0);
var _q2controlMapCurrent=new Array(0);
var dev_ssid_pwd = "";
<!-- ###############################设置向导页面公共变量################################### -->
//初始化设置向导页面数据函数
function initQuickSetting(){	
    $.cgi.sendCmd('uapxb_wlan_basic_settings');
    $.cgi.sendCmd('uapxb_wlan_security_settings');
}
//获取wlan安全信息 成功回调函数
function getWlanQuickSetData(data,textStatus) {
	_q2xmlData = data;
	var ver = g_objXML.getInternetExplorerVersion();
	if ( ver > -1 ){
		if (ver <= 9.0){
			_q2securityType =  $(_q2xmlData).find("mode")[0].text;
		}else{
			_q2securityType =  $(_q2xmlData).find("mode")[0].textContent.toString();
		}
	}else{
        _q2securityType =  $(_q2xmlData).find("mode")[0].textContent.toString();
    }
	$(_q2xmlData).find("wlan_security").each(function(){
		_q2strSSID=$(this).find("ssid").text();
		_q2ssidLimit = $(this).find("ssid_limit").text();
		dev_ssid_pwd = $(this).find("dev_ssid_pwd").text();
	});
	switch(_q2securityType)
	{
        case 'WPA2-PSK':
		case 'WPA-PSK':
		case 'Mixed':
		{
            q2loadWPAData(_q2securityType);
			break;
        }
        case 'None':
        {
            q2loadDisabledData();
            break;
        }
        case 'WEP':
		{
            q2loadWEPData(_q2securityType);
			break;
        }
  		case 'WAPI-PSK':
		{
            q2loadWAPI_PSKData(_q2securityType);
			break;
        }
    }
	_q2controlMapCurrent = g_objXML.copyArray(_q2controlMapExisting, _q2controlMapCurrent);
	displayWlanQuickSetData(); 
}
//Mixed加密模式 SSID名称 密码
function q2loadWPAData(type){
	$(_q2xmlData).find(type).each(function()
	{
        _q2modeKey=$(this).find("key").text();
    });	
	var index=0;
    _q2controlMapExisting = g_objXML.putMapElement(_q2controlMapExisting,index++, "RGW/wlan_security/ssid",_q2strSSID);
    _q2controlMapExisting = g_objXML.putMapElement(_q2controlMapExisting,index++, "RGW/wlan_security/"+type+"/key",_q2modeKey);
}
//none加密模式 SSID名称
function q2loadDisabledData(){
    var index=0;
    _q2controlMapExisting = g_objXML.putMapElement(_q2controlMapExisting,index++, "RGW/wlan_security/ssid",_q2strSSID);
}
//WEP加密模式 SSID名称 密码1 密码2
function q2loadWEPData(type) {
    $(_q2xmlData).find(type).each(function () {
        _q2modeKey = $(this).find("key1").text();
        _q2wepEncrypt = $(this).find("encrypt").text();
    });
    var index = 0;
    _q2controlMapExisting = g_objXML.putMapElement(_q2controlMapExisting, index++, "RGW/wlan_security/ssid", _q2strSSID);
    _q2controlMapExisting = g_objXML.putMapElement(_q2controlMapExisting, index++, "RGW/wlan_security/" + type + "/key1", _q2modeKey);
    _q2controlMapExisting = g_objXML.putMapElement(_q2controlMapExisting, index++, "RGW/wlan_security/" + type + "/key", _q2modeKey);
}
//WAPI-PSK加密模式 SSID名称 密码
function q2loadWAPI_PSKData(type) {
    $(_q2xmlData).find(type).each(function () 
    {
        _q2wapiKeyType = $(this).find("key_type").text();
        _q2modeKey = $(this).find("key").text();
    });

	var index=0;
    _q2controlMapExisting = g_objXML.putMapElement(_q2controlMapExisting,index++, "RGW/wlan_security/ssid",_q2strSSID);
    _q2controlMapExisting = g_objXML.putMapElement(_q2controlMapExisting,index++, "RGW/wlan_security/"+type+"/key",_q2modeKey); 
}
//显示设置向导页面数据
function displayWlanQuickSetData(){
	$("#q2Error").text("");
	//SSID名称
	$("#q2tbSSID").val(_q2strSSID);
	//显示密码未选中
	setCheckboxValue("q2chkUnmask",0);
	//显示加密输入框
	$("#q2tbpass").show();
	//隐藏加密输入框
	$("#q2tbpassText").hide();
	//修改密码 输入长度最大值
	document.getElementById("q2tbpass").maxLength = 63;      
	document.getElementById("q2tbpassText").maxLength = 63;
	//设置密码值
	$("#q2tbpass").val(_q2modeKey);
	$("#q2tbpassText").val(_q2modeKey);
	//是否加密SSID密码
	if (dev_ssid_pwd == "0"){
        setCheckboxValue("q2chkSsid",1);
    }
   	//WLAN加密方式
	switch (_q2securityType) {
		case 'WPA2-PSK':
		case 'WPA-PSK':
		case 'Mixed':
		case 'WAPI-PSK':
		{
			break;
		}
		case 'WEP':
		{
		    document.getElementById("q2tbpass").maxLength = 26;
		    document.getElementById("q2tbpassText").maxLength = 26;  
			break;
        }
		case 'None':
        {
            $("#q2tr4").hide();
            $("#q2tr44").hide();
            $("#q2tr5").hide();
            $("#q2tr55").hide();
            break;
        }
    }
	
	//WLAN未开启
	if(_q2netEnable == 0)
	{
	    $("#q2Error").text(jQuery.i18n.prop("lNoNwWarn"));
		document.getElementById("q2tbSSID").readOnly = true;
		document.getElementById("q2tbpass").readOnly = true;
		document.getElementById("q2tbpassText").readOnly = true;
		$("#q2btnApply").hojyBnEnable(false); 
	}else{
        $("#q2Error").text("");
        if ("None" == _q2securityType) {
            $("#q2Error").text(jQuery.i18n.prop("Encrypt_None"));
        }
	    document.getElementById("q2tbSSID").readOnly = false;
	    document.getElementById("q2tbpass").readOnly = false;
	    document.getElementById("q2tbpassText").readOnly = false;
	    $("#q2btnApply").hojyBnEnable(true); 
	}
}
//显示密码 隐藏密码 切换函数
function q2showHidePassword(){
	var strPass = '';
	if (getCheckboxValue("q2chkUnmask") == 1){    
	    strPass = $("#q2tbpassText").val();
	    $("#q2tbpass").show();
	    $("#q2tbpassText").hide();
	    $("#q2tbpass").val(strPass);		
	}else{       
	    strPass = $("#q2tbpass").val();
	    $("#q2tbpassText").show();
	    $("#q2tbpass").hide();
	    $("#q2tbpassText").val(strPass);
    }
}
//验证页面值的合法性，提交cgi处理
function PostWlanQuickSet(){    
    var mapData = new Array(0);
	var index=0;
    var url = "";
    var host = window.location.protocol + "//" + window.location.host + "/";
    var pageSSID = $("#q2tbSSID").val();
	var pageModeKey = '';
    var pageDevSSidPwd = "";
	$("#q2Error").text("");
	if (getCheckboxValue("q2chkUnmask") == 1){
	    pageModeKey = $("#q2tbpassText").val();
	}else{
	    pageModeKey = $("#q2tbpass").val();
	}
    if (getCheckboxValue("q2chkSsid") == 1){
	    pageDevSSidPwd = 0;
	}else{
	    pageDevSSidPwd = 1;
	}
	if (isValidWlan(_q2securityType, pageSSID, pageModeKey, _q2wepEncrypt, _q2wapiKeyType, "q2Error", _q2ssidLimit)){
        $("#q2Error").text("");
		_q2controlMapCurrent[index++][1] = pageSSID;
		if(_q2securityType != 'None'){
			_q2controlMapCurrent[index++][1] = pageModeKey;
		}
		mapData = g_objXML.copyArray(_q2controlMapCurrent,mapData);
	    mapData = g_objXML.getChangedArray(_q2controlMapExisting,mapData,true);
        mapData = putMapElement(mapData,"RGW/wlan_security/dev_ssid_pwd",pageDevSSidPwd,index++);
	    if (mapData.length > 0){
            open_dialog_loading();
            $.cgi.postCmd("uapxb_wlan_security_settings", mapData, successPostWlanQuickSet, failPostWlanQuickSet, 10000);
		}
	}
}
//验证页面值的合法性，提交cgi处理，成功回调函数
function successPostWlanQuickSet(data){
	close_dialog_loading();
	//刷新当前页面数据
	getWlanQuickSetData(data);
	open_dialog_info(jQuery.i18n.prop("successApply"));
}
//验证页面值的合法性，提交cgi处理，失败回调函数
function failPostWlanQuickSet(xmldate,textStatus){
    close_dialog_loading();
	if(g_mp_switch == CTA_SELECT){
		open_dialog_info(jQuery.i18n.prop("lPostWlanSuccess"));
	}else{
		open_dialog_info(jQuery.i18n.prop("lPostSuccess")); 
	}
}


