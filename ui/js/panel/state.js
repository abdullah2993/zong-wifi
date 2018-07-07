$(function(){
	initStatePageWords();

	clearInterval(_runTimeIntervalID);
    _runTimeIntervalID = setInterval(function () { _lastGetRunnedSeconds++; setSysRunTimeText(); }, 1000);

    $.cgi.onGetXml('status1', displayDiagnosisData);
    $.cgi.onGetXml('net_advace_set', getNetAdvanceSet);
    $.cgi.onGetXml('detailed_log', function (xmlData) {
        //日志
        _sysLogData = new Array(0);
        var index = 0;
        var strs = new Array();
		var strb = new Array();
		var outimeformat= new Array();
        $(xmlData).find("detailed_log_list").each(function () {
			$(this).find("item").each(function () {
				var event = $(this).find("event").text();
				var ctime = $(this).find("ctime").text();
				if(g_time_fomat == 1){
					strs = ctime.split("-");
					strb = strs[2].split(" ");
					outimeformat += strb[0];
					outimeformat += "/";
					outimeformat += strs[1];
					outimeformat += "/";
					outimeformat += strs[0];
					outimeformat += " ";
					outimeformat += strb[1];
				}else{
					outimeformat = ctime;
				}
				_sysLogData[index] = new Array(3);
				_sysLogData[index][0] = index+1;
				_sysLogData[index][1] = event;
				_sysLogData[index][2] = outimeformat;
				outimeformat="";
				index++;
			})
        });
        loadSysLogTable(index, 0);
    });
});
//初始化State显示文字
function initStatePageWords(){
	$("#lDeviceInfo").text(jQuery.i18n.prop("lDeviceInfo"));
	$("#lSwVersion").text(jQuery.i18n.prop("lSwVersion"));
	$("#lHwVersion").text(jQuery.i18n.prop("lHwVersion"));
	$("#lRunTime").text(jQuery.i18n.prop("lRunTime"));
	$("#lProductType").text(jQuery.i18n.prop("lProductType"));
	$("#lImei").text(jQuery.i18n.prop("lImei"));
	$("#lBatteryType").text(jQuery.i18n.prop("lBatteryType"));	
	$("#textBatteryType").text(jQuery.i18n.prop("textBatteryType"));
	$("#h1NetworkInfo").text(jQuery.i18n.prop("h1NetworkInfo"));
	$("#ipv4Address").text(jQuery.i18n.prop("ipv4Address"));
	$("#hostMask").text(jQuery.i18n.prop("hostMask"));
	$("#lGateway").text(jQuery.i18n.prop("lGateway"));
	$("#lDnsv4").text(jQuery.i18n.prop("lDnsv4"));
	$("#lMacAddr").text(jQuery.i18n.prop("macAddr"));
	$("#lCurrentCellInfo").text(jQuery.i18n.prop("lCurrentCellInfo"));
	$("#lGcellid").text(jQuery.i18n.prop("lGcellid"));
	$("#lPcellid").text(jQuery.i18n.prop("lPcellid"));
	$("#lEarfcn").text(jQuery.i18n.prop("lEarfcn"));
	$("#lFreqband").text(jQuery.i18n.prop("lFreqband"));
    $("#lUlBandwidth").text(jQuery.i18n.prop("lUlBandwidth"));
	$("#lDlBandwidth").text(jQuery.i18n.prop("lDlBandwidth"));
	$("#h1Log").text(jQuery.i18n.prop("h1Log"));
	$("#btnClear").val(jQuery.i18n.prop("btnClear"));
	$("#lNumber").text(jQuery.i18n.prop("lNumber"));
	$("#lEvent").text(jQuery.i18n.prop("lEvent"));
	$("#lTime").text(jQuery.i18n.prop("lTime"));
	$("#lMeid").text(jQuery.i18n.prop("lMeid"));
	$("#btnDownload").val(jQuery.i18n.prop("btnDownload"));
}

//公共变量
var _runTimeIntervalID;
var _lastGetRunnedSeconds = 0;
var _sysLogData = new Array();
//初始化页面数据函数
function loadDiagPage() {
    if($.hojyStatus.Battery == "no"){
        /*隐藏系统状态电池类型，电池容量*/
        $("#lBatteryType").hide();
        $("#textBatteryType").hide();
    }
    $.cgi.sendCmd('detailed_log');
    $.cgi.sendCmd('net_advace_set');

	//入库版显示 日志下载按钮
    if(g_mp_switch == OTA_SELECT){
    	$("#btnDownload").show();	
    }else{
    	$("#btnDownload").hide();
    }
}
//运行时间
function setSysRunTimeText() {
    if (_lastGetRunnedSeconds <= 0){
        return;
    }
    var run_days = parseInt(_lastGetRunnedSeconds / 60 / 60 / 24);
    var run_hours = parseInt(_lastGetRunnedSeconds / 60 / 60) % 24;
    var run_minutes = parseInt(_lastGetRunnedSeconds / 60) % 60;
    var run_seconds = _lastGetRunnedSeconds % 60;

    run_hours = run_hours + run_days * 24;
    if (run_hours >= 10){
        run_hours = run_hours + ":";
    }
    else{
        run_hours = "0"+run_hours + ":";
    }

    if (run_minutes >= 10){
        run_minutes = run_minutes + ":";
    }
    else{
        run_minutes ="0"+ run_minutes + ":";
    }

    if (run_seconds < 10){
        run_seconds = "0"+run_seconds;
    }

    var runTime =run_hours + run_minutes + run_seconds;
    $("#textRunTime").text(runTime);
}

function displayDiagnosisData(xmlData) {
    //求运行时间
    var run_seconds = '';
    if (gWifi_Td == "WIFI") {
        var wifiGateway = $(xmlData).find("wlan_hot").children("gateway").text();
        var wifiMask = $(xmlData).find("wlan_hot").children("mask").text();
        var wifiIp = $(xmlData).find("wlan_hot").children("ip").text();
        $('#lNetInfoIp').text(wifiIp);
        $('#lNetInfoMask').text(wifiMask);
        $('#lNetInfoGate').text(wifiGateway);
    }else{
        $(xmlData).find("wan").each(function () {
            $('#lNetInfoIp').text($(this).find("ip").text());
            $('#lNetInfoMask').text($(this).find("mask").text());
            $('#lNetInfoGate').text($(this).find("gateway").text());
          
            var dns1 = $(this).find("dns1").text();
            var dns2 = $(this).find("dns2").text();
            if (dns1 != null && dns1 != "" && dns2 != null && dns2 != "") {
                $('#lNetInfoDns').text(dns1 + ' , ' + dns2);
            } else if (dns1 != null && dns1 != "") {
                $('#lNetInfoDns').text(dns1);            
            } else if (dns2 != null && dns2 != "") {
                $('#lNetInfoDns').text(dns2);
            }
        });
    }
	
    var gIMEI = $(xmlData).find("IMEI").text();
	$("#textImei").text(gIMEI);

    //是否为电信运营商，电信运营商，显示MEID
	if (g_operator_version == TELECOM_SELECT){
        var gMEID = $(xmlData).find("MEID").text();
        $("#IMeid_tr").show();
		$("#textMeid").text(gMEID);
		$("#lMeid").show();
		$("#textMeid").show();
	}else{
        $("#IMeid_tr").hide();
        $("#textMeid").text("");
	    $("#lMeid").hide();
	    $("#textMeid").hide();
	}
	
    $("#textSwVersion").text($.hojyStatus.SwVersion);
    $("#textHwVersion").text($.hojyStatus.HwVersion);
    $("#textProductType").text($.hojyStatus.ProductType);
    
    $(xmlData).find("lan").each(function () {
        run_seconds = $(this).find("run_seconds").text();
        $("#lNetInfoMac").text($(this).find("mac").text());
    });
	
    run_seconds = parseInt((run_seconds != '') ? run_seconds : 0);
    _lastGetRunnedSeconds = run_seconds;
}

function getNetAdvanceSet(xmlData){
 	var m_globalcellid = $(xmlData).find("global_cell_id").text();
 	var m_phycellid = $(xmlData).find("physical_cell_id").text();
 	var m_earfcn = $(xmlData).find("earfcn").text();
 	var m_band = $(xmlData).find("band").text();
 	var m_bandwidth = $(xmlData).find("bandwidth").text();
    var m_ul_bandwidth = $(xmlData).find("ul_bandwidth").text();
    var m_dl_bandwidth = $(xmlData).find("dl_bandwidth").text();
	
	$("#textGcellid_s").text(m_globalcellid);
	$("#textPcellid_s").text(m_phycellid);
	$("#textFreqband_s").text(m_band);
	$("#textEarfcn_s").text(m_earfcn);
	$("#textUlBandwidth").text(m_ul_bandwidth);
    $("#textDlBandwidth").text(m_dl_bandwidth);
}

function loadSysLogTable(pageCount, pageIndex) {
    var i = document.getElementById("tbSysLogBody").rows.length;
    while (i > 0) {
        document.getElementById("tbSysLogBody").deleteRow(i - 1);
        i--;
    }
    var tableClient = document.getElementById("tbSysLogBody");
    var tbodyClient = tableClient.getElementsByTagName("tbody")[0];
    var emptyStrings = "&nbsp;";
    for (var j = 0; j < 10; j++) {
        emptyStrings = emptyStrings + "&nbsp;";
    }
    
    for (var i = 0; i < _sysLogData.length; i++) {
        var arrayRow = _sysLogData[i];
        var row = tbodyClient.insertRow(-1);
     
        var col0 = row.insertCell(0);col0.style.width = "60px";
        var col1 = row.insertCell(1);col1.style.width = "362px";
        var col2 = row.insertCell(2);col2.style.width = "200px";
        
        for (var k = 0; k < 3; k++) {
            if (arrayRow[k] == "0") {
                arrayRow[k] = emptyStrings + arrayRow[k] + emptyStrings;
            }
        }   
		col0.innerHTML = "<div>" + arrayRow[0] + "</div>";
        col1.innerHTML = "<div>" + arrayRow[1] + "</div>";
        col2.innerHTML = "<div>" + arrayRow[2] + "</div>";
    }
}

//清除访问日志
function onClearSysLog() {
    var mapItemData = new Array();
    var index = _sysLogData.length-1;
    while (index >=0) {
        mapItemData = g_objXML.putMapElement(mapItemData, 0, "RGW/detailed_log/detailed_log_list", index);
        index--;
    }
    open_dialog_loading();
	$.cgi.postCmdSynch('detailed_log', mapItemData, onClearSysLogSuccess);
    $.cgi.sendCmd('detailed_log');
}

function onClearSysLogSuccess(){
    close_dialog_loading();
    open_dialog_info(jQuery.i18n.prop("successApply"));
}

function onDownloadSysLog() {
	var url="images/dum.bmp";
	document.getElementById("clicktodownloade").click();
}