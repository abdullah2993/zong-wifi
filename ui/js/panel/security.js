$(function(){
	//实例化PIN码管理下拉框
	initOptionsSelectPinOpt("enablePin");
	initSecurityPageWords();
	$.cgi.onGetXml('pin_puk', getSecurityData);
});
//初始化Security显示文字
function initSecurityPageWords(){
	$("#lPinSet").text(jQuery.i18n.prop("lPinSet"));
	$("#pin_code_title").text(jQuery.i18n.prop("lPinSet"));
	$("#lPinInput").text(jQuery.i18n.prop("lPinInput"));
	$("#lPukInput").text(jQuery.i18n.prop("lPukInput"));
	$("#lNewPinInput").text(jQuery.i18n.prop("lNewPinInput"));
	$("#lNewPinCodeAgain").text(jQuery.i18n.prop("lNewPinCodeAgain"));
	$("#lPinLeave").text(jQuery.i18n.prop("lPinLeave"));
	$("#lPukLeave").text(jQuery.i18n.prop("lPukLeave"));
	$("#lPinOpen").text(jQuery.i18n.prop("lPinOpen"));
	$("#lPinClose").text(jQuery.i18n.prop("lPinClose"));
	$("#lCurrentPcodeStatus").text(jQuery.i18n.prop("lCurrentPcodeStatus"));
}
//储存PIN剩余次数
var PinRemainTimes = 0;
//存储PUK剩余次数
var PukRemainTimes = 0;
//初始化页面数据
function initSecuritySetting() {
	if($.hojyStatus.sim == "1") {
		$('#lPinErrorInfo').text(jQuery.i18n.prop("noSIM"));
		$("#bnPinApply").hide();
		$("#Pin_tb1").hide();
		return;
    }else if ($.hojyStatus.sim == "2") {
        $('#lPinErrorInfo').text(jQuery.i18n.prop("uneffectSIM"));
        $("#bnPinApply").hide();
		$("#Pin_tb1").hide();
        return;
    }
	
	$("#bnPinApply").show();
	$("#Pin_tb1").show();
	$("#trPukCode").hide();
	$("#trNewPinCode").hide();
	$('#lPinErrorInfo').text("");
	$("#pPin").empty();
	
	if(g_mp_switch == CTA_SELECT){
		$("#trNewPinCodeAgain").hide();
	}else{
		$("#trNewPinCodeAgain").hide();
	}
	
    $.cgi.sendCmd('pin_puk');
}
//初始化下拉选择框
function onSelectPinOpt() {
	var pinOpt = GetOptionsValue("enablePin");
	$("#txtPukCode").val("");
	$("#txtPinCode").val("");
	$("#txtNewPinCode").val("");
	if(g_mp_switch == CTA_SELECT){
		$("#txtNewPinCodeAgain").val("");
	}
	$("#lPinErrorInfo").text("");

    if (pinOpt == 5) {//修改
		$("#trPukCode").hide();
		$("#lPinInput").text(jQuery.i18n.prop("lOldPinInput")); 
		$("#trNewPinCode").show();
		if(g_mp_switch == CTA_SELECT)	{
			$("#trNewPinCodeAgain").show();
			$("#lNewPinCodeAgain").text(jQuery.i18n.prop("lPinInputAgain"));
		}
	}else if(pinOpt == 1) {//重置PIN码
		$("#trNewPinCode").hide();
		$("#lPinInput").text(jQuery.i18n.prop("lPinInput"));
		if(g_mp_switch == CTA_SELECT)	{
			$("#trNewPinCodeAgain").show();
			$("#lNewPinCodeAgain").text(jQuery.i18n.prop("lPinInputAgain"));
		}
        $("#trPukCode").show();
	}else{
		$("#trNewPinCode").hide();
		$("#lPinInput").text(jQuery.i18n.prop("lPinInput"));
		if(g_mp_switch == CTA_SELECT){
			$("#trNewPinCodeAgain").hide();
		}
		$("#trPukCode").hide();
	}
}
//获取页面信息，并显示
function getSecurityData(data) {
	var xml = data;
	$(xml).find("pin_puk").each(function () {
		var pin_attempts = $(this).find("pin_attempts").text();
		var puk_attempts = $(this).find("puk_attempts").text();
		var pin_enabled = $(this).find("pin_enabled").text();
		var cmd_status = $(this).find("cmd_status").text();
		
		//储存当前Pin剩余次数
		PinRemainTimes = parseInt(pin_attempts);
		//储存当前Puk剩余次数
		PukRemainTimes = parseInt(puk_attempts);
		
		if(cmd_status != ""){
			$.hojyStatus.pin = cmd_status;
		}
		$("#txtPinCode").val("");
		$("#txtNewPinCode").val("");
		if(g_mp_switch == CTA_SELECT){
			$('#txtNewPinCodeAgain').val("");
		}
		$("#txtPukCode").val("");
		$("#lPinAttemptCount").text(pin_attempts);
		$("#lPukAttemptCount").text(puk_attempts);
		//清空下拉框
		$("#pPin").empty();
		if ($.hojyStatus.sim == "1") {
			$('#lPinErrorInfo').text(jQuery.i18n.prop("noSIM"));
		} else if ($.hojyStatus.sim == "2") {
			$('#lPinErrorInfo').text(jQuery.i18n.prop("uneffectSIM"));
		} else if (pin_attempts == "-1" || puk_attempts == "-1") {
			$('#lPinErrorInfo').text(jQuery.i18n.prop("invalidSIM"));
		} else if (pin_attempts == "0" && puk_attempts == "0") {
			$('#lPinErrorInfo').text(jQuery.i18n.prop("lPukExhausted"));
		} else if (pin_attempts == "0" && puk_attempts != "0") {
			$('#lPinErrorInfo').text(jQuery.i18n.prop("lPinExhausted"));
			$("#pPin").append("<option value='1' id='optResetPin'>"+jQuery.i18n.prop("optResetPin")+"</option>");
			SetOptionValue("enablePin",1);
		} else {
			if ($.hojyStatus.pin == "1") {
				$("#pPin").append("<option value='2' id='optProvidePin'>"+jQuery.i18n.prop("optProvidePin")+"</option>");
				SetOptionValue("enablePin",2);
			} else {
				if (pin_enabled == "0") {
					$("#pPin").append("<option value='3' id='optEnablePin'>"+jQuery.i18n.prop("optEnablePin")+"</option>");
					SetOptionValue("enablePin",3);
				} else {
					$("#pPin").append("<option value='4' id='optDisablePin'>"+jQuery.i18n.prop("optDisablePin")+"</option>");
					$("#pPin").append("<option value='5' id='optChangePin'>"+jQuery.i18n.prop("optChangePin")+"</option>");
					SetOptionValue("enablePin",4);
				}
			}
		}
		
		//当前pin状态 0-关闭
		if (pin_enabled == "0"){
			$("#VCurrentPcodeStatus").text(jQuery.i18n.prop("optDisablePin"));
		}
		//1-开启
		else{
			$("#VCurrentPcodeStatus").text(jQuery.i18n.prop("optEnablePin"));
		}
		onSelectPinOpt();
	});
}
//初始化PIN管理应用按钮点击函数
function onApplyPin() {
    var pinValue = $.trim($('#txtPinCode').val()) ;  
    var pinOpt = GetOptionsValue("enablePin");
	$('#lPinErrorInfo').text("");
	if(!validate_pin(pinValue)) {
		open_dialog_info(jQuery.i18n.prop("linvalidPin"));
		return;
	}
    open_dialog_loading();
    
    if (pinOpt == 4){// 禁用pin码
        var mapItemData = new Array();
        var itemIndex = 0;
        mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/pin_puk/command", 2);
        mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/pin_puk/pin", pinValue);
        $.cgi.postCmd('pin_puk', mapItemData, onSetTimeSuccess, onFailSetTime);
    }else if(pinOpt == 3){// 启用pin码
        var mapItemData = new Array();
        var itemIndex = 0;
        mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/pin_puk/command", 1);
        mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/pin_puk/pin", pinValue);
        $.cgi.postCmd('pin_puk', mapItemData, onSetTimeSuccess, onFailSetTime);
    }else if(pinOpt == 5){//修改PIN码
        var newPin = $.trim($("#txtNewPinCode").val());
		if(!validate_pin(newPin)) {
			close_dialog_loading();
			open_dialog_info(jQuery.i18n.prop("linvalidPin"));
			return;
		} 
		if(g_mp_switch == CTA_SELECT){
			var newPinAgain = $.trim($("#txtNewPinCodeAgain").val());
			if(! validate_pin(newPinAgain)){
				close_dialog_loading();
				open_dialog_info(jQuery.i18n.prop("linvalidPin"));
				return;
			}		
			if(newPin != newPinAgain) {
				close_dialog_loading();
				open_dialog_info(jQuery.i18n.prop("linvalidPinAgain"));
				return;
			}		
		}
        var mapItemData = new Array();
        var itemIndex = 0;
        mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/pin_puk/command", 3);
        mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/pin_puk/pin", pinValue);
        mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/pin_puk/new_pin", newPin);
		$.cgi.postCmd('pin_puk', mapItemData, onSetTimeSuccess, onFailSetTime); 
    }else if(pinOpt == 2) {//解锁PIN码
        var mapItemData = new Array();
        var itemIndex = 0;
        mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/pin_puk/command", 5);
        mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/pin_puk/pin", pinValue);
		$.cgi.postCmd('pin_puk', mapItemData, onSetTimeSuccess, onFailSetTime);
		callProductXML("pin_puk");
    }else if(pinOpt == 1) {
		var puk = $.trim($("#txtPukCode").val()) ;  
		if(! validate_puk(puk)) {
			close_dialog_loading();
			open_dialog_info(jQuery.i18n.prop("linvalidPuk"));
			return;
		}
		if(g_mp_switch == CTA_SELECT){
			var PinAgain = $.trim($("#txtNewPinCodeAgain").val());
			if(!validate_pin(PinAgain)) {
				close_dialog_loading();
				open_dialog_info(jQuery.i18n.prop("linvalidPin"));
				return;
		    }
		    if(pinValue != PinAgain) {
		    	close_dialog_loading();
				open_dialog_info(jQuery.i18n.prop("linvalidPinAgain"));
				return;
			}		
		}	
        var mapItemData = new Array();
        var itemIndex = 0;
		mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/pin_puk/command", 4);
        mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/pin_puk/puk", puk);
        mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/pin_puk/new_pin", pinValue);
		$.cgi.postCmd('pin_puk', mapItemData, onPinPukSuccess, onFailSetTime);
    }
}

function onPinPukSuccess(data) {
	close_dialog_loading();
	//判断当前Puk是否正确
	var NewPukRemainTimes;
	$(data).find("pin_puk").each(function () {
		NewPukRemainTimes = $(this).find("puk_attempts").text();
	});
	
	if(parseInt(NewPukRemainTimes) < parseInt(PukRemainTimes)){
		open_dialog_info(jQuery.i18n.prop("lpukInputagain"));
	}else{
		open_dialog_info(jQuery.i18n.prop("successApply"));
	}
	getSecurityData(data);
}
//验证pin码合法性
function validate_pin(pin){
	var ret = true;
	if (pin.length < 4 || pin.length > 8){
		ret = false;
	}
	if (!(/\d/.test(pin))){
		ret = false;
	}
	return ret;
}
//验证puk码合法性
function validate_puk(puk){
	var ret = true;
	if (puk.length != 8){
		ret = false;
	}
	if (!(/\d/.test(puk))){
		ret = false;
	}
	return ret;
}
function onSetTimeSuccess(data) {
	close_dialog_loading();
	//判断当前Pin是否正确
	var NewPinRemainTimes;
	$(data).find("pin_puk").each(function () {
		NewPinRemainTimes = $(this).find("pin_attempts").text();
	});
	if(parseInt(NewPinRemainTimes) < parseInt(PinRemainTimes)){
		open_dialog_info(jQuery.i18n.prop("lpinInputagain"));
	}else{
		open_dialog_info(jQuery.i18n.prop("successApply"));
	}
	getSecurityData(data);
}

function onFailSetTime() {
	close_dialog_loading();
	open_dialog_info(jQuery.i18n.prop("failApply"));
}