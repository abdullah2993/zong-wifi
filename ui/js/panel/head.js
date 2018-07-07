$(function(){
	//帮助按钮显示文字
	$("#help").text(jQuery.i18n.prop("help"));
	//退出按钮显示文字
	$("#logout").text(jQuery.i18n.prop("logout"));
	//绑定短信刷新函数
	$.cgi.onGetXml('message_state', getMessageStateSuccessCallBack);
	$.cgi.onGetXml('status1', getStatus1InfoSuccessCallBack, getStatus1InfoFailCallBack);
	$.cgi.onGetXml('battery_charge', getBatteryChargeSuccessCallBack, getBatteryChargeFailCallBack);
});

//持续刷新事件
var timer;
//当前wifi是否已经断开标记,当连续获取status1数据失败3次，判断哪位已经断开wifi 
var WiFiStatusCountTip = 0;
//立即执行一次，每5秒执行一次
function loadingStatus(){
	open_dialog_loading();
	$.cgi.sendCmd('status1');
	//获取获取网络模式信息
	$.cgi.sendCmd("wan_choose_net");
	setTimeout(function(){
	    //登录成功刷新数据
        $("#login").hide();
		$("#content").show();
		//显示左右两边广告窗口
		$("#index_float_left").show();
		$("#index_float_right").show();
		$("#index_float_bottom").show();
		$("body").attr("class", "content_body");
        //查询是否有新版本
        postCheckNewVersion();
        //每次登陆显示首页
		openMenu(1,5);
		close_dialog_loading();
	},5000); 
}

//打开MBB网站首页，跳转函数
function openMBBWebSite(){
	var zongWindow;
	var url = "http://www.zong.com.pk/mbb/";
	zongWindow = window.open(url);
	zongWindow.focus();
}

//打开openMBBMBBFAQ，跳转函数
function openMBBFAQ(){
	var MBBFAQWindow;
	var url = "";
	if(url == ""){
		open_dialog_info("No http link");
		return;
	}
	MBBFAQWindow = window.open(url);
	MBBFAQWindow.focus();
}

//打开MBB网站首页，跳转函数
function openMBBFeedback(){
	var MBBFeedbackWindow;
	var url = "";
	if(url == ""){
		open_dialog_info("No http link");
		return;
	}
	MBBFeedbackWindow = window.open(url);
	MBBFeedbackWindow.focus();
}

//登出函数
function onLogout() {
    window.location.reload();
}

//帮助函数
function getMainHelp(){
	//地址
	var host = window.location.protocol + "//" + window.location.host + "/";
	//语言
	var lan = g_webLanguage;
	lan = (lan != "cn" && lan != "th" && "tw") ? "en" : lan;
    //是否有电池
    var BatteryInfo = "true";
    if($.hojyStatus.Battery == "no"){
        BatteryInfo = "false";
    }else{
        BatteryInfo = "true";
    }
    //帮助文件页面地址
	var url = host + "help/help_" + lan + ".html?sysTimeSet=" + $.hojyStatus.sysTimeSet + "&upgradeMode=" + $.hojyStatus.upgradeMode 
				+ "&freqFiveEnable=" + $.hojyStatus.freqFiveEnable + "&ipv6Switch=" + $.hojyStatus.ipv6Switch 
				+ "&isContainBatteryInfo=" + BatteryInfo;	
	
	//打开新窗口
	var helpWindow;
	helpWindow = window.open(url,"Help");
	helpWindow.focus();
}
//用户自定义变量 lwf
var pageHeadID;
var lPageHeadID;
var infoType = -1;
var failTemp = 0; 
var batteryHeadID;
var _batteryCapacity = 100;		//默认满电状态
var _BatteryCharged;    		//0-未充电,1-正在充电
//获取status1成功回调函数
function getStatus1InfoSuccessCallBack(data, textStatus){
	//获取数据成功，重置WiFI是否断开标记
	WiFiStatusCountTip = 0;

	failTemp = 0;
	//status1的xml数据
	var xmlData = data;
	var clientName,macAddress,ipAddress,connectTime,connected,conntype;		
	var index=0;

	if ($.hojyStatus.isLogin) {
	    clearTimeout(timer);
	    timer = setTimeout(function () {
	        $.cgi.sendCmd('status1');
            if($.hojyStatus.Battery == "yes"){
                $.cgi.sendCmd('battery_charge');
            }else{
            	$("#battery").hide();
            }
            $.cgi.sendCmd('message_state');
	    }, 5000);
	}

    //刷新完数据，清空gArrayTableData，防止数据重复
	var len = gArrayTableData.length;
	while(index != len)
	{
		gArrayTableData.pop();
		len--;
	} 
	$(xmlData).find("Item").each(function () {
	    clientName = $(this).find("name").text();
	    macAddress = $(this).find("mac").text();
	    ipAddress = $(this).find("ip_address").text();
	    connectTime = $(this).find("conn_time").text();
	    connected = $(this).find("connected").text(); 
	    conntype = $(this).find("conn_type").text();
	    gArrayTableData[index] = new Array(7);
	    gArrayTableData[index][0] = index;
	    gArrayTableData[index][1] = clientName;
	    gArrayTableData[index][2] = macAddress;
	    gArrayTableData[index][3] = ipAddress;
	    gArrayTableData[index][4] = connectTime;
	    gArrayTableData[index][5] = connected;
	    gArrayTableData[index][6] = conntype;
	    index++;
	});	

	//获取客户端table元素
	var tableClient = document.getElementById("tableClient");
	var tbodyClient = tableClient.getElementsByTagName("tbody")[0];
	clearTableRows("tableClient"); 
	for(var i = 0; i < gArrayTableData.length; i++)
	{
		//检索出已连接的客户端
		if (gArrayTableData[i][5] == 1) 
		{
			var arrayRow = gArrayTableData[i];
			var row = tbodyClient.insertRow(-1);
			var strConntime = "" + arrayRow[4];
			
			strConntime = strConntime.replace(/hours/g, "");
			strConntime = strConntime.replace(/mins/g, "");
			strConntime = strConntime.replace(/secs/g, "");
			var splitedByComma = strConntime.split(",");
			for (var j = 0; j < splitedByComma.length; j++) {
				var temp = splitedByComma[j] + "";   
				splitedByComma[j] = $.trim(temp);
				if (parseInt(splitedByComma[j]) < 10) {
					splitedByComma[j] = "0" + splitedByComma[j];
				}
			}
			strConntime = splitedByComma[0] + ":" + splitedByComma[1] + ":" + splitedByComma[2]
			arrayRow[4] = strConntime;
			row.insertCell(0).innerHTML = arrayRow[1];
			row.insertCell(1).innerHTML = arrayRow[3];
			row.insertCell(2).innerHTML = arrayRow[2];
			row.insertCell(3).innerHTML = arrayRow[4];
			row.insertCell(4).innerHTML = arrayRow[6];
		}
	} 
	// 循环调用当前连接的客户端数据
	
	//当前连接wifi数据
	gWificonnect_disconnect = $(xmlData).find("wlan_hot").children("connect_disconnect").text();
    gWifi_Td = $(xmlData).find("Conn_net_type").text(); 
    gWifiSSID = $(xmlData).find("wifi_spot").children("ssid").text();

	//IP地址
    gWifiIpAddressInternet = $(xmlData).find("wlan_hot").children("ip").text();
    
	$(xmlData).find("wan").each(function(){
		gIpAddressInternet = $(this).find("ip").text();
		gIpv6AddressInternet = $(this).find("ip_v6").text(); 
	});
	//网络类型  0-没有网络 
	gNetworkType = $(xmlData).find("sys_submode").text();
	
	//SIM卡状态信息
    $.hojyStatus.sim = $(xmlData).find("sim_status").text();
	$.hojyStatus.pin = $(xmlData).find("pin_status").text();
	var pinAttempts = $(xmlData).find("pin_attempts").text();
	var pukAttempts = $(xmlData).find("puk_attempts").text();

    if ($.hojyStatus.sim != 0) {
        gNetworkType == "0";
    }

    //网络类型 
	var networkType = gNetworkType;
	var rssi = $(xmlData).find("rssi").text();

   	//信号格数 1-5 lwf
	if(networkType == 0){        
		document.getElementById("max-signal").src = "../images/signals/max-signal-0.png";
		document.getElementById("signal").src = "../images/signals/Signal-0.png";
	}else if(rssi == 1){
		document.getElementById("max-signal").src = "../images/signals/max-signal-1.png";
		document.getElementById("signal").src = "../images/signals/Signal-1.png";
	}else if(rssi == 2){
		document.getElementById("max-signal").src = "../images/signals/max-signal-2.png";
		document.getElementById("signal").src = "../images/signals/Signal-2.png";
	}else if(rssi == 3){
		document.getElementById("max-signal").src = "../images/signals/max-signal-3.png";
		document.getElementById("signal").src = "../images/signals/Signal-3.png";
	}else if(rssi == 4){
		document.getElementById("max-signal").src = "../images/signals/max-signal-4.png";
		document.getElementById("signal").src = "../images/signals/Signal-4.png";
	}else if(rssi == 5){		
        document.getElementById("max-signal").src = "../images/signals/max-signal-5.png";
        document.getElementById("signal").src = "../images/signals/Signal-5.png";
    }else{
		document.getElementById("max-signal").src = "../images/signals/max-signal-0.png";
		document.getElementById("signal").src = "../images/signals/Signal-0.png";	
	}
	//信号格数 lwf
	
	//SIM卡 lwf
	if ($.hojyStatus.sim == 0) {
		//网络类型 E G 2G 3G 4G lwf
	    if (networkType == 1 || networkType == 2 || networkType == 10){
            if (g_operator_version == TELECOM_SELECT){
            	$("#networkTypeLabel").text("2G");
                $("#networkTypeLabel").attr("color", "#d8dadb");
            }else {
                $("#networkTypeLabel").text("G");
            }
        }else if (networkType == 3){
            if (g_operator_version == TELECOM_SELECT){
                $("#networkTypeLabel").text("2G");
            }else{
                $("#networkTypeLabel").text("E");
            }
        }else if(networkType == 4 || networkType == 5 || networkType == 6 || networkType == 7 || networkType == 8 || networkType == 11){
            $("#networkTypeLabel").text("3G");
        }else if (networkType == 9){
            $("#networkTypeLabel").text("4G");
        }else{
            $("#networkTypeLabel").text("4G");
            $("#networkTypeLabel").attr("color", "#d8dadb");
        }

	    //PIN码与PUK码状态异常
	    if ($.hojyStatus.pin == "1" || $.hojyStatus.pin == "2" || (pinAttempts == "-1" && pukAttempts == "-1")) {
	        $("#CellularBtn").hide();
	        if ($.hojyStatus.pin == "1") {
	        	$("#wlanStatus").hide();
	        	$("#SimStatus").show();
	            $("#SimStatus").text(jQuery.i18n.prop("pinLock"));
	        }else if ($.hojyStatus.pin == "2") {
	        	$("#wlanStatus").hide();
	        	$("#SimStatus").show();
	            $("#SimStatus").text(jQuery.i18n.prop("pukLock"));
	        }else if (pinAttempts == "-1" && pukAttempts == "-1") {
	        	$("#wlanStatus").hide();
	        	$("#SimStatus").show();
	            $("#SimStatus").text(jQuery.i18n.prop("invalidSIM"));
	        }
	    }else{		
	        $("#CellularBtn").show();
	        $("#SimStatus").hide();
	        $("#SimStatus").text("");
	    }
	}else if($.hojyStatus.sim == 1){
	    $("#CellularBtn").hide();
	    $("#wlanStatus").hide();
	    $("#SimStatus").show();
	    $("#SimStatus").text(jQuery.i18n.prop("noSIM"));
	    document.getElementById("max-signal").src = "../images/signals/max-signal-0.png";
		document.getElementById("signal").src = "../images/signals/Signal-0.png";	
	}else if($.hojyStatus.sim == 2) {  
	    $("#CellularBtn").hide();
	    $("#wlanStatus").hide();
	    $("#SimStatus").show();
	    $("#SimStatus").text(jQuery.i18n.prop("uneffectSIM"));
	    document.getElementById("max-signal").src = "../images/signals/max-signal-0.png";
		document.getElementById("signal").src = "../images/signals/Signal-0.png";	
    }else {
	    $("#CellularBtn").hide();	
	    $("#wlanStatus").hide();
	    $("#SimStatus").show();
	    $("#SimStatus").text(jQuery.i18n.prop("specialstate"));
	    document.getElementById("max-signal").src = "../images/signals/max-signal-0.png";
		document.getElementById("signal").src = "../images/signals/Signal-0.png";	
	}
	//SIM卡 lwf

	//wifi状态
	gWifiStatus = $(xmlData).find("wlan_enable").text();
	if(gWifiStatus == "0"){//关闭状态
		$("#lwlanStatus").text(jQuery.i18n.prop("lwlanOff"));
		document.getElementById("topwifi").src = "../images/signals/TopWifi-1.png";
		document.getElementById("WifiBtn").src = "../images/signals/Wifi-1.png";
	}else if(gWifiStatus == "1"){//开启状态
	    $("#lwlanStatus").text(jQuery.i18n.prop("lwlanOn"));
	    document.getElementById("topwifi").src = "../images/signals/TopWifi.png";
	    document.getElementById("WifiBtn").src = "../images/signals/Wifi.png";
	}
	//当前wifi连接数
	$(xmlData).find("device_management").each(function () {
        gWifiConnet = $(this).find("nr_connected_dev").text();
    });
    
	$("#vCurrentClientIndex").text(gWifiConnet);
	//当前wifi连接数

	gConnType = $(xmlData).find("proto").text();
	gConn_disConn = $(xmlData).find("ConnType").text();

	//流量统计设备
    gCurrentWifiDownFlux = $(xmlData).find("wifi_spot").children("rx_byte").text(); //本次下载流量
    gCurrentWifiUpFlux = $(xmlData).find("wifi_spot").children("tx_byte").text();	//本次上传流量
    gHistWifiDownFlux = $(xmlData).find("wifi_spot").children("rx_byte_all").text(); //历史下载流量
    gHistWifiUpFlux = $(xmlData).find("wifi_spot").children("tx_byte_all").text();	//历史上传流量
    gWifiUpRate = $(xmlData).find("wifi_spot").children("tx_rate").text();			//wifi下行速度
    gWifiDownRate = $(xmlData).find("wifi_spot").children("rx_rate").text();		//wifi下行速度

    //当前连接用户的
	gCurrentUpFlux = $(xmlData).find("WanStatistics").children("tx_byte").text();   //本次上传流量
    gCurrentDownFlux = $(xmlData).find("WanStatistics").children("rx_byte").text(); //本次下载流量
    gHistUpFlux = $(xmlData).find("WanStatistics").children("tx_byte_all").text();  //历史上传流量
    gHistDownFlux = $(xmlData).find("WanStatistics").children("rx_byte_all").text();//历史下载流量
    
	var currentDate = new Date();  
	var currentTime = currentDate.getTime();
	var interval = Math.round((currentTime - gPreTime) / 1000);//时间间隔(s)
	if(gPreUpFlux != "0")
	{
		gUpRate = Math.round((gCurrentUpFlux - gPreUpFlux) / interval);
	}
	if(gPreDownFlux != "0")
	{
		gDownRate = Math.round((gCurrentDownFlux - gPreDownFlux) / interval);
	}
	gPreUpFlux = gCurrentUpFlux;
	gPreDownFlux = gCurrentDownFlux;
	gPreTime = currentTime;
		
	var day = $(xmlData).find("conn_days").text();	
	var hour = $(xmlData).find("conn_hours").text();
	var minutes = $(xmlData).find("conn_minutes").text();
	var seconds = $(xmlData).find("conn_seconds").text();	
	
	var dayAll = $(xmlData).find("conn_days_all").text();	
	var hourAll = $(xmlData).find("conn_hours_all").text();
	var minutesAll = $(xmlData).find("conn_minutes_all").text();
	var secondsAll = $(xmlData).find("conn_seconds_all").text();	
	
	if(day == ""){
		day = 0;
	}
	if(hour == ""){
		hour = 0;
	}
	if(minutes == ""){
		minutes = 0;
	}
	if(dayAll == ""){
		dayAll = 0;
	}
	if(hourAll == ""){
		hourAll = 0;
	}
	if(minutesAll == ""){
		minutesAll = 0;
	}
    hour = parseInt(hour) + parseInt(day)*24;
	if (hour >= 10){
	    hour = hour + ":";
	}else{
	    hour = "0" + hour + ":";
	}
	if (minutes >= 10){
	    minutes = minutes + ":";
	}else{
	    minutes = "0" + minutes + ":";
	}
	if (seconds < 10){
	    seconds = "0" + seconds;
	}
	hourAll = parseInt(dayAll)* 24 + parseInt(hourAll);
	if (hourAll >= 10){
	    hourAll = hourAll + ":";
	}else{
	    hourAll = "0" + hourAll + ":";
	}
	if (minutesAll >= 10){
	    minutesAll = minutesAll + ":";
	}else{
	    minutesAll = "0" + minutesAll + ":";
	}
	if (secondsAll < 10){
	    secondsAll = "0" + secondsAll;
	}

	var currentTime = hour + minutes + seconds;
	var histAllTime = hourAll + minutesAll + secondsAll;
	//本次运行时间
	gCurrentTime = currentTime;
	//历史运行时间
	gHistAllTime = histAllTime;	

	var strUpFlux = getflux(gCurrentUpFlux);//计算本次上传流量
	var strDownFlux = getflux(gCurrentDownFlux);//计算本次下载流量
	var strHistDownFlux = getflux(gHistDownFlux + gHistWifiDownFlux); //计算历史下载流量和本次下载流量
	var strHistUpFlux = getflux(gHistUpFlux + gHistWifiUpFlux); //计算历史上传流量和本次上传流量
	var strWifiUpFlux = getflux(gCurrentWifiUpFlux);
	var strWifiDownFlux = getflux(gCurrentWifiDownFlux);
	var strAllCurrentFlux = getflux(parseInt(gCurrentUpFlux)+parseInt(gCurrentDownFlux));
	var strAllHistoryFlux = getflux(parseInt(gHistUpFlux)+parseInt(gHistDownFlux));
	//首页显示数据
	$("#vHistDownFluxIndex").text(strHistDownFlux);
	$("#vHistUpFluxIndex").text(strHistUpFlux);
	$("#vHistAllTimeIndex").text(gHistAllTime);
	//流量统计页面显示数据
	if (gWifi_Td == "WIFI") {
	    $("#vDownFlux").text(strWifiDownFlux);
	    $("#vUpFlux").text(strWifiUpFlux);
	} else {
	    $("#vDownFlux").text(strDownFlux);
	    $("#vUpFlux").text(strUpFlux);
	}
	$("#vHistDownFlux").text(strHistDownFlux);
	$("#vHistUpFlux").text(strHistUpFlux);
	$("#vAllTime").text(gCurrentTime);
	$("#vHistAllTime").text(gHistAllTime);
	$("#vAllFluxCurrent").text(strAllCurrentFlux);
	$("#vAllFluxHistory").text(strAllHistoryFlux);

	//流量统计

    //显示拨号图片状态 Cellular.png-已连接 Cellular1-未连接 lwf
	if (gConn_disConn == "cellular" && (gIpAddressInternet != "" || gIpv6AddressInternet != "") ){
		document.getElementById("wifi").src = "../images/signals/cellular_network.png";
		document.getElementById("CellularBtn").src = "../images/signals/Cellular.png";
		$("#wlanStatus").text(jQuery.i18n.prop("lconnected"));
		g_connectedStatus = 0;	
	}else{//未连接
		document.getElementById("wifi").src = "../images/signals/cellular_network-1.png";
		document.getElementById("CellularBtn").src = "../images/signals/Cellular-1.png";
		$("#wlanStatus").text(jQuery.i18n.prop("ldisconnected"));
		g_connectedStatus = 1;
	}

	//流量设置
	//月结日
	xmlPaymentDay = $(xmlData).find("payment_day").text();
	//流量包
	xmlPaymentPackage = $(xmlData).find("payment_package").text();
	//初始化月结日
    displayPaymentDay(xmlPaymentDay);

    //包月流量包 数据显示
	var retdata;
	if(parseInt(xmlPaymentPackage) == 0){
		//当前设置包月流量为0时，显示红色提示文字(请设置包月流量信息)
		$("#checkMonthFlowError").text(jQuery.i18n.prop("SettingFlowNote"));
		$("#setMonthFlowId").text(xmlPaymentPackage + " MB");
	}else if((parseInt(xmlPaymentPackage) < 1024) && (parseInt(xmlPaymentPackage) > 0)){
		$("#checkMonthFlowError").text("");
		$("#setMonthFlowId").text(xmlPaymentPackage + " MB");
	}else{
		$("#checkMonthFlowError").text("");
		//计算当前包月流量是否刚刚好为1024的倍数
		if(xmlPaymentPackage % 1024 == 0){
			retdata = (xmlPaymentPackage / 1024).toString() + " GB";
		}else{
			var payment = changeTwoDecimal(xmlPaymentPackage/1024);
			retdata = payment + " GB";
		}
		$("#checkMonthFlowError").text("");
		$("#setMonthFlowId").text(retdata);
	}
}

//获取status1失败回调函数
function getStatus1InfoFailCallBack(){
	if($.hojyStatus.isLogin == false) {
        return;
    }
	WiFiStatusCountTip++;
	if(WiFiStatusCountTip >3){
		WiFiStatusCountTip = 0;
		$.hojyStatus.isLogin = false;
    	clearTimeout(timer);
    	$("#login").show();
		$("#content").hide();
		$("body").attr("class", "login_body");
		//隐藏左右两边广告窗口
		$("#index_float_left").hide();
		$("#index_float_right").hide();
		$("#index_float_bottom").hide();
	}else{
		if(_flagSms == "1"){
			return;
		}
		timer = setTimeout(function () {
			$.cgi.sendCmd('status1');
		}, 5000);
	}
}

//获取电池信息回调成功
function getBatteryChargeSuccessCallBack(data, textStatus) {
    var xmlData = data;
	var batterry_per;
	//电量
    _batteryCapacity = $(xmlData).find("capacity").text();
    //是否充电
    _BatteryCharged = $(xmlData).find("battery_charge").find("charge").find("status").text();
    if ($.hojyStatus.SwVersion.toUpperCase().indexOf("363") < 0) {
        $("#battery").show();
		batterry_per = _batteryCapacity + "%";
		$("#battery_per").text(batterry_per);
        if ((_BatteryCharged == 1) && (_batteryCapacity < 100)) {
            if (_batteryCapacity > 80) {
                $("#battery").attr("src", "../images/battery/batteryCharge5.png");
            } else if (_batteryCapacity > 60) {
                $("#battery").attr("src", "../images/battery/batteryCharge4.png");
            } else if (_batteryCapacity > 40) {
                $("#battery").attr("src", "../images/battery/batteryCharge3.png");
            } else if (_batteryCapacity > 20) {
                $("#battery").attr("src", "../images/battery/batteryCharge2.png");
            } else if (_batteryCapacity > 10) {
                $("#battery").attr("src", "../images/battery/batteryCharge1.png");
            } else {
                $("#battery").attr("src", "../images/battery/batteryCharge0.png");
            }
        } else {
            if (_batteryCapacity > 80) {
                $("#battery").attr("src", "../images/battery/battery5.png");
            } else if (_batteryCapacity > 60) {
                $("#battery").attr("src", "../images/battery/battery4.png");
            } else if (_batteryCapacity > 40) {
                $("#battery").attr("src", "../images/battery/battery3.png");
            } else if (_batteryCapacity > 20) {
                $("#battery").attr("src", "../images/battery/battery2.png");
            } else if (_batteryCapacity > 10) {
                $("#battery").attr("src", "../images/battery/battery1.png");
            } else {
                $("#battery").attr("src", "../images/battery/battery0.png");
            }
        }
    } else {
		$("#battery").hide();
    }
}
//获取电池信息回调失败
function getBatteryChargeFailCallBack(xmldate, textStatus) {
    
}
