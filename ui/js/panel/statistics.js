$(document).ready(function(){ 
	initStatisticsPageWords();
	//实例化流量单位选择按钮
	initCheckboxs("flowUnitGroup");
	//实例化流量单位选择按钮
	initCheckboxs("excessGroup");
	initCheckboxs("fluxUnitGroup");
});

//初始化流量页面显示的文字
function initStatisticsPageWords(){
	//lable
	$("#flux").text(jQuery.i18n.prop("flux"));
	$("#PaymentNote").text(jQuery.i18n.prop("PaymentNote"));
	$("#flowType").text(jQuery.i18n.prop("flowType"));
	$("#currentRecord").text(jQuery.i18n.prop("currentRecord"));
	$("#histRecord").text(jQuery.i18n.prop("histRecord"));
	$("#kUpFlux").text(jQuery.i18n.prop("kUpFlux"));
	$("#kDownFlux").text(jQuery.i18n.prop("kDownFlux"));
	$("#kAllUseFlux").text(jQuery.i18n.prop("kAllUseFlux"));
	$("#kAllTime").text(jQuery.i18n.prop("kAllTime"));
	$("#payment").text(jQuery.i18n.prop("payment"));
	$("#VmonthFlow").text(jQuery.i18n.prop("VmonthFlow"));
	$("#paymentDay").text(jQuery.i18n.prop("paymentDay"));
	$("#flowExcessSet").text(jQuery.i18n.prop("flowExcessSet"));
	$("#ExcessDisnetSwitch").text(jQuery.i18n.prop("ExcessDisnetSwitch"));
	$("#FlowThouldValue").text(jQuery.i18n.prop("FlowThouldValue"));
	$("#wifiClient").text(jQuery.i18n.prop("wifiClient"));
	$("#hostName").text(jQuery.i18n.prop("hostName"));
	$("#ipAddress").text(jQuery.i18n.prop("ipAddress"));
	$("#macAddress").text(jQuery.i18n.prop("macAddress"));
	$("#networTime").text(jQuery.i18n.prop("networTime"));
	$("#connType").text(jQuery.i18n.prop("connType"));
	//button
	$("#clearRecord").val(jQuery.i18n.prop("clearRecord"));
	$("#paymentSetting").val(jQuery.i18n.prop("paymentSetting"));
	$("#excessPaymentSetting").val(jQuery.i18n.prop("excessPaymentSetting"));
}

//点击菜单【流量统计】时，执行该函数，初始化数据
function initStatisticsPage(){
	$.cgi.sendCmd("traffic_excess_set");
	$.cgi.onGetXml('traffic_excess_set', getTraffiExcessDataCallBack, failgetTraffiExcessDataCallBack);
}

//流量超额断网设置 成功回调函数
function getTraffiExcessDataCallBack(data){
	var _dataBit;
	var _retdata;
	var _xmlData = data;
	_xmlFlowExcessFuncShow = $(_xmlData).find("FuncShow").text();
	if (_xmlFlowExcessFuncShow == 1){
		$("#flowexcessLabel").show();
		$("#flowexcessBtn").show();
		$("#flowexcessContent").show();
	}else{
		$("#flowexcessLabel").hide();
		$("#flowexcessBtn").hide();
		$("#flowexcessContent").hide();
		return;
	}

	_xmlFlowExcessState = $(_xmlData).find("SwitchState").text();
	_xmlFlowExcessValue = $(_xmlData).find("ExcessValue").text();
	if(_xmlFlowExcessState == 1){
		$("#setExcessDisnetSwitchId").text(jQuery.i18n.prop("ExcessEnable"));
	}else{
		$("#setExcessDisnetSwitchId").text(jQuery.i18n.prop("ExcessDisable"));
	}

	if(parseInt(_xmlFlowExcessValue) < 1024){
		$("#setFlowThouldValueId").text(_xmlFlowExcessValue + " MB");
	}else{
		if(_xmlFlowExcessValue % 1024 == 0){
			_retdata = (_xmlFlowExcessValue / 1024).toString();
		}else{
			_dataBit = (_xmlFlowExcessValue / 1024 + '0').indexOf(".")+3;
			_retdata = (_xmlFlowExcessValue/1024 + '0').substring(0,_dataBit);
		}
		$("#setFlowThouldValueId").text(_retdata + " GB");
	}

}

//流量超额断网设置 失败回调函数
function failgetTraffiExcessDataCallBack(data){
	
}

//流量清零函数
function clearRecord() {
	var mapData = new Array();
	mapData = putMapElement(mapData, "RGW/statistics/WanStatistics/reset", "1", 0);
	open_dialog_loading();
	$.cgi.postCmd("statistics", mapData, clearRecordSuccessCallBack, clearRecordFailCallBack);
}

//流量清零函数 成功回调函数
function clearRecordSuccessCallBack() {
	close_dialog_loading();
	open_dialog_info(jQuery.i18n.prop("successApply"));
}
//流量清零函数 失败函数
function clearRecordFailCallBack() {
	close_dialog_loading();
	open_dialog_info(jQuery.i18n.prop("failApply"));
}

//显示月结日
function displayPaymentDay(paymentDay){
    if(g_webLanguage == "en"){
        if(paymentDay == "1"){
            $("#setPaymentDayId").text("1st");
        }else if(paymentDay == "2"){
            $("#setPaymentDayId").text("2nd");
        }else if(paymentDay == "3"){
            $("#setPaymentDayId").text("3rd");
        }else{
            $("#setPaymentDayId").text(paymentDay + "th");
        }
    }
    else{
        $("#setPaymentDayId").text(paymentDay + "  " + jQuery.i18n.prop("lDay"));
    }
}

//月结日选择不同流量单位单位
function selectFlowUnitMB(){
	document.getElementById("FlowScope").innerHTML = jQuery.i18n.prop("MBFlowScope");
}
function selectFlowUnitGB(){
	document.getElementById("FlowScope").innerHTML = jQuery.i18n.prop("GBScope");
	
}

//流量超额断网选择不同流量单位单位
function selectFluxUnitMB(){
	document.getElementById("flowSetScope").innerHTML = jQuery.i18n.prop("MBFlowScope");
}
function selectFluxUnitGB(){
	document.getElementById("flowSetScope").innerHTML = jQuery.i18n.prop("GBScope");
	
}

//设置月结日 提交函数
function setPaymentInfo() {
	var mapData = new Array();
	var setMonthFlow="";
	var index = 0;
	var setPaymentDay = $("#setPaymentDay_id").val();
	//验证月结日输入是否正确
	if((parseInt(setPaymentDay)>31)|| (parseInt(setPaymentDay)<=0) || setPaymentDay == "" || setPaymentDay.substr(0, 1) == "0"){
		open_dialog_info(jQuery.i18n.prop("outoffDateRange"));
		return;
	}
	
	//验证包月流量输入是否正确
	if(document.getElementById("setMonthFlow").value.indexOf(".") == -1){
		var flowUnitGroupValue = getCheckboxsValue("flowUnitGroup");
		//选择GB单位
		if(flowUnitGroupValue == 0){
			//获取设置包月流量，单位MB
			setMonthFlow = parseInt($("#setMonthFlow").val()) * 1024;
			if( parseInt($("#setMonthFlow").val()) > 1024 || parseInt($("#setMonthFlow").val()) < 1 || $("#setMonthFlow").val() == ""){
				open_dialog_info(jQuery.i18n.prop("FlowGBScopeNote"));
				return;
			}
		}
		//选择MB单位
		else{
			//获取设置包月流量值，单位MB
			setMonthFlow = parseInt( $("#setMonthFlow").val() );
			if( parseInt($("#setMonthFlow").val()) < 100 || $("#setMonthFlow").val() == "" || parseInt($("#setMonthFlow").val()) > 9999){
				open_dialog_info(jQuery.i18n.prop("FlowMBScopeNote"));
				return;
			}
		}
		mapData = putMapElement(mapData, "RGW/payment/payment_package", setMonthFlow, index++);
	}else{
		close_paymentSettingDlg();
	}

	mapData = putMapElement(mapData, "RGW/payment/payment_day", setPaymentDay, index++);
	open_dialog_loading();
	$.cgi.postCmd("status1", mapData, setPaymentInfoSuccess, setPaymentInfoFail);
}

//设置月结日 成功回调函数
function setPaymentInfoSuccess(){
	close_dialog_loading();
	close_paymentSettingDlg();
	open_dialog_info(jQuery.i18n.prop("successApply"));
}

//设置月结日 失败回调函数
function setPaymentInfoFail(){
	close_dialog_loading();
	close_paymentSettingDlg();
	open_dialog_info(jQuery.i18n.prop("failApply"));
}

//设置流量超额断网 提交函数
function postFlowExcessInfo(){
	var mapData = new Array();
	var setThouldValue="";
	var index = 0;
	//获取超额断网开关选择值 开启-1 关闭-0
	var _Status = getCheckboxsValue("excessGroup");
	mapData = putMapElement(mapData, "RGW/TrafficExcess/SwitchState", _Status, index++);
	//判断输入的流量阈值是否符合要求
	if(document.getElementById("setThouldValue").value.indexOf(".") == -1){
		var fluxUnitGroupValue = getCheckboxsValue("fluxUnitGroup");
		//选择GB单位
		if (fluxUnitGroupValue == 0){
			setThouldValue = parseInt($("#setThouldValue").val()) * 1024;
			if(_Status == 1){
				if((parseInt($("#setThouldValue").val()) > 1024) || (parseInt($("#setThouldValue").val()) < 1) || $("#setThouldValue").val() == ""){
					open_dialog_info(jQuery.i18n.prop("FlowScopeNote"));
					return;
				}
			}
		}
		//选择MB单位
		else{
			setThouldValue = parseInt($("#setThouldValue").val());
			if(_Status == 1){
				if( setThouldValue < 100 || $("#setThouldValue").val() == "" || setThouldValue > 9999 ){
					open_dialog_info(jQuery.i18n.prop("FlowScopeNote"));
					return;
				}
			}
		}
		mapData = putMapElement(mapData, "RGW/TrafficExcess/ExcessValue", setThouldValue, index++);
	}else{
		close_flowExcessSettingDlg();
	}
	open_dialog_loading();
	$.cgi.postCmd("traffic_excess_set", mapData, successPostFlowExcessInfo, failPostFlowExcessInfo);
}
//设置流量超额断网 成功回调函数
function successPostFlowExcessInfo(data){
    close_dialog_loading();
    close_flowExcessSettingDlg();
    getTraffiExcessDataCallBack(data);
    open_dialog_info(jQuery.i18n.prop("successApply"));
   
}
//设置流量超额断网 失败回调函数
function failPostFlowExcessInfo(data){
    close_dialog_loading();
    close_flowExcessSettingDlg();
    open_dialog_info(jQuery.i18n.prop("failApply"));
}