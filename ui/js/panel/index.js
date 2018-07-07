$(function(){
	//首页下拉网络类型 2G 3G 4G
	initOptionsNetwork_type_select("network_type_select");

	initIndexPageWords();
	//注册USSID XML事件
	$.cgi.onGetXml('ussd_business', getUssdGetData);

	$("#ussdTextCode").focus(function(){
	  $("#ussdTextCode").val("");
	  $("#newUssdCode").val("");
	});

	//获取浏览器当前显示内容的高度 宽度 广告自适应
	init_page_zoom();
});

var _sy6controlMapCurrent=new Array(0);
var _getUssdBusinessTime;
var _releaseUssdBusinessTime;
var gettimes = 0;
var releaseWaitTimes = 0
var disablebtn = false;
var disableCancel = true;
var disableFastCheck = true;
var anserflag = false;
var _displaylistdata=new Array();
var recharge_flag = false;

//初始首页显示的文字
function initIndexPageWords(){
	$("#lConnectionSettings").text(jQuery.i18n.prop("lConnectionSettings"));
	$("#lCurrentUsage").text(jQuery.i18n.prop("lCurrentUsage"));
	$("#lWLANStatus").text(jQuery.i18n.prop("lWLANStatus"));
	$("#lservices").text(jQuery.i18n.prop("lservices"));
	$("#lbundles").text(jQuery.i18n.prop("lbundles"));
	$("#laddons").text(jQuery.i18n.prop("laddons"));
	$("#btnUssdSend").val(jQuery.i18n.prop("btnRecharge"));
	$("#btnUSSDSend").val(jQuery.i18n.prop("btnSend"));
	$("#btnUSSDCancel").val(jQuery.i18n.prop("btnUSSDCancel"));

	$("#lwlanstatusSwitch").text(jQuery.i18n.prop("lwlanstatusSwitch"));
	$("#lwlansconnectednum").text(jQuery.i18n.prop("lwlansconnectednum"));
	$("#lDownFlux").text(jQuery.i18n.prop("lDownFlux"));
	$("#lUpFlux").text(jQuery.i18n.prop("lUpFlux"));
	$("#lAllTime").text(jQuery.i18n.prop("lAllTime"));

	$("#IoptMode0").text(jQuery.i18n.prop("optMode0"));
	$("#IoptMode1").text(jQuery.i18n.prop("optMode1"));
	$("#IoptMode2").text(jQuery.i18n.prop("optMode2"));
	$("#IoptMode3").text(jQuery.i18n.prop("optMode3"));
	$("#IoptMode4").text(jQuery.i18n.prop("optMode4"));
	$("#IoptMode5").text(jQuery.i18n.prop("optMode5"));
	$("#IoptMode6").text(jQuery.i18n.prop("optMode6"));
	$("#IoptMode20").text(jQuery.i18n.prop("optMode20"));
	$("#IoptMode21").text(jQuery.i18n.prop("optMode21"));
	$("#IoptMode22").text(jQuery.i18n.prop("optMode22"));
	$("#IoptMode23").text(jQuery.i18n.prop("optMode23"));
	$("#IoptMode24").text(jQuery.i18n.prop("optMode24"));
	$("#IoptMode25").text(jQuery.i18n.prop("optMode25"));
}

//打开左侧广告链接地址
function openLeftBanber(){
	var BannerWindow;
	var url = "";
	if(url == ""){
		open_dialog_info("No http link");
		return;
	}
	BannerWindow = window.open(url);
	BannerWindow.focus();
}
//打开右侧侧广告链接地址
function openRightBanber(){
	var BannerWindow;
	var url = "";
	if(url == ""){
		open_dialog_info("No http link");
		return;
	}
	BannerWindow = window.open(url);
	BannerWindow.focus();
}

//跳转WLAN页面
function JumpToWaln(){
	$("#nav-link-5").click();
	$("#setting_wlan_img").click();
}

//关闭左侧悬浮广告
function BannerButtonLeftTipClose(){
	$("#index_float_left").hide();
}
//关闭右侧悬浮广告
function BannerButtonRightTipClose(){
	$("#index_float_right").hide();
}

//打开MBB网站首页，跳转函数
function openOnlineRecharge(){
	var OnlineRechargeWindow;
	var url = "https://o2oonlinerecharge.zong.com.pk/O2O/PaymentDesign.aspx?utm_source=ZongWebsite&utm_medium=Button_campaign=ZongOnlineRecharge";
	OnlineRechargeWindow = window.open(url);
	OnlineRechargeWindow.focus();
}

//拨号上网
function CellularED() {
	//提示是否修改拨号状态
	boxMBConfirmFactory(jQuery.i18n.prop("ldialMessage"), jQuery.i18n.prop("lConfirmModifyDialStatus"), function () {
        var mapData = new Array();
	    if (gConn_disConn == "cellular"){
	        mapData = putMapElement(mapData, "RGW/wan/connect_disconnect", "disabled", 0);
	    }else{
	        mapData = putMapElement(mapData, "RGW/wan/connect_disconnect", "cellular", 0);
	    }
		if (gConnType == "disabled"){
	        mapData = putMapElement(mapData, "RGW/wan/proto", "cellular", 1);
		}
		open_dialog_loading();
		$.cgi.postCmd("wan", mapData, ConnectStatusChangeSuccessCallBack, ConnectStatusChangeFailCallBack, 20000);   
    });  
}

//拨号成功回调函数
function ConnectStatusChangeSuccessCallBack(data, textStatus) {
	var url = "";
	var host = window.location.protocol + "//" + window.location.host + "/";
	url = host + 'xml_action.cgi?method=get&module=duster&file=' + 'status1';
	$.cgi.getDevice(url, function(xmlData){
		gConn_disConn = $(xmlData).find("ConnType").text();
		$(xmlData).find("wan").each(function(){
			gIpAddressInternet = $(this).find("ip").text();
			gIpv6AddressInternet = $(this).find("ip_v6").text(); 
		});
		//显示拨号图片状态 Cellular.png-已连接 Cellular1-未连接 lwf
		if (gConn_disConn == "cellular" && (gIpAddressInternet != "" || gIpv6AddressInternet != "") ){
			document.getElementById("wifi").src = "../images/signals/cellular_network.png";
			$("#wlanStatus").text(jQuery.i18n.prop("lconnected"));
			g_connectedStatus = 0;	
			//提示拨号成功
			close_dialog_loading();
			open_dialog_info(jQuery.i18n.prop("successApply"));
		}else{//未连接
			document.getElementById("wifi").src = "../images/signals/cellular_network-1.png";
			$("#wlanStatus").text(jQuery.i18n.prop("ldisconnected"));
			g_connectedStatus = 1;
			//提示断开拨号成功
			close_dialog_loading();
			open_dialog_info(jQuery.i18n.prop("successApply"));
		}
	}, function(){
		//提示应用失败,关闭数据刷新窗口
		close_dialog_loading();
		open_dialog_info(jQuery.i18n.prop("failApply"));
	}, 5000);
}

//拨号失败回调函数
function ConnectStatusChangeFailCallBack() {
	close_dialog_loading();
	open_dialog_info(jQuery.i18n.prop("failApply"));
}

//wifi连接
function wifiStatusSet(){
	//提示是否修改WiFi状态
	boxMBConfirmFactory(jQuery.i18n.prop("ldialMessage"), jQuery.i18n.prop("lConfirmModifyWiFiStatus"), function () {
        var mapData = new Array();
		if( gWifiStatus == "0" ){
			mapData = putMapElement(mapData,"RGW/wlan_settings/wlan_enable","1",0);
		}
		else{
			mapData = putMapElement(mapData,"RGW/wlan_settings/wlan_enable","0",0);     	
		}
		open_dialog_loading();
		$.cgi.postCmd("uapxb_wlan_basic_settings", mapData, wifiStatusSetSuccessCallBack, wifiStatusSetFailCallBack);	   
    }); 
}

//通过USB访问，WIFI连接断开成功
function wifiStatusSetSuccessCallBack(data,textStatus){
	close_dialog_loading();
	var xmlData = data;
	var wifiStatus = $(xmlData).find("wlan_enable").text();
	if(wifiStatus == "0"){
		//提示关闭WiFi成功
		open_dialog_info(jQuery.i18n.prop("lCloseWiFiSuccess"));
		$("#lwlanStatus").text(jQuery.i18n.prop("lwlanOff"));
		document.getElementById("topwifi").src = "../images/signals/TopWifi-1.png";
		document.getElementById("WifiBtn").src = "../images/signals/Wifi-1.png";
	}
	else if(wifiStatus == "1"){
		//提示开启WiFi成功
		open_dialog_info(jQuery.i18n.prop("lOpenWiFiSuccess"));
	    $("#lwlanStatus").text(jQuery.i18n.prop("lwlanOn"));
	    document.getElementById("topwifi").src = "../images/signals/TopWifi.png";
	    document.getElementById("WifiBtn").src = "../images/signals/Wifi.png";
	}
}

//通过WIFI访问，WIFI连接断开成功
function wifiStatusSetFailCallBack(){
	close_dialog_loading();
	open_dialog_info(jQuery.i18n.prop("lDisconnect")); 
    setTimeout(function(){
    	$.hojyStatus.isLogin = false;
    	clearTimeout(timer);
    	$("#login").show();
		$("#content").hide();
		$("body").attr("class", "login_body");
		//隐藏左右两边广告窗口
		$("#index_float_left").hide();
		$("#index_float_right").hide();
		$("#index_float_bottom").hide();
    },3000); 
}

//设备关机
function shutdownDevice() {
    boxMBConfirmFactory(jQuery.i18n.prop("ldialMessage"), jQuery.i18n.prop("lConfirmShutdown"), function () {
        $.cgi.sendCmd("shutdown");   
        open_dialog_info(jQuery.i18n.prop("lshutdownTip"));
        setTimeout(function(){
        	$.hojyStatus.isLogin = false;
        	clearTimeout(timer);
	    	$("#login").show();
			$("#content").hide();
			$("body").attr("class", "login_body");
			//隐藏左右两边广告窗口
			$("#index_float_left").hide();
			$("#index_float_right").hide();
			$("#index_float_bottom").hide();
        },3000); 
    });
}

//状态栏短信图标，点击打开短信页面函数
function openSMSMenu(){
    openMenu(3,5);
}

<!-- ############################### USSD ################################-->
//取消USSD发送
function UssdCancelBusiness(){
	if(disableCancel == true){
		clearTimeout(_releaseUssdBusinessTime);
		var cancelUssdCode; 
		open_dialog_loading();
		var index = 0;
		var mapItemData = new Array();
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/ussdcode", cancelUssdCode);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/requestflag", 0);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/answerflag", 0);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/cancelclag", 1);
		$.cgi.postCmd('ussd_business', mapItemData, succesCancelBusiness, failPostCancelUssdSending);
	}else{
		open_dialog_info(jQuery.i18n.prop("noussdError"));
	}
}

function succesCancelBusiness(){
	close_dialog_loading();
	$("#displayussdbusiness").val("");
	_displaylistdata = "";
}

function failPostCancelUssdSending(){
	close_dialog_loading();
	_displaylistdata+="\r\n";
	$("#displayussdbusiness").val(_displaylistdata);
	getDisplaySssdBusinessBottom();
}

function getUssdGetData(data) {
	var ussd_business_data = $(data).find("ussdbusiness").text();
	var release_business_data = $(data).find("releaseflag").text();
	var sendRecieveView = jQuery.i18n.prop("receiveUssd");
	var sendReleaseView = jQuery.i18n.prop("ussdclosed");
	
	if(recharge_flag == true){
		if((release_business_data != 0) && (release_business_data != 1)){
			clearTimeout(_getUssdBusinessTime);
			clearTimeout(_releaseUssdBusinessTime);
			close_dialog_loading();
			UssdCancelBusiness();
			open_dialog_info(jQuery.i18n.prop("ussdSendError"));
			return 0;
		}else if(1 == release_business_data){
			gettimes = 0;
			if(ussd_business_data.length != 0){
				if(ussd_business_data.indexOf("unicode") > 0){
					ussd_business_data = eval("'" + ussd_business_data + "'");
					ussd_business_data = unescape(ussd_business_data.replace(/\u/g, "%u"));	
					while(ussd_business_data.indexOf("unicode") > 0){
						ussd_business_data = ussd_business_data.replace("unicode","\r\n");
					}
				}else if(ussd_business_data.indexOf("ascii") > 0){
					while(ussd_business_data.indexOf("ascii") > 0){
						ussd_business_data = ussd_business_data.replace("ascii","\r\n");
					}
				}else if(ussd_business_data.indexOf("8bit") > 0){
					while(ussd_business_data.indexOf("8bit") > 0){
						ussd_business_data = ussd_business_data.replace("8bit","\r\n");
					}
				}
				
				close_dialog_loading();
				open_dialog_info(ussd_business_data);
			}
			disablebtn = false;
			recharge_flag = false;
			close_dialog_loading();
			clearTimeout(_getUssdBusinessTime);
			clearTimeout(_releaseUssdBusinessTime);
			return 0;
		}else if(ussd_business_data.length != 0){
			gettimes = 0;
			disablebtn = false;
			clearTimeout(_getUssdBusinessTime);
			if(ussd_business_data.indexOf("unicode") > 0){
				ussd_business_data = eval("'" + ussd_business_data + "'");
				ussd_business_data = unescape(ussd_business_data.replace(/\u/g, "%u"));	
				while(ussd_business_data.indexOf("unicode") > 0){
					ussd_business_data = ussd_business_data.replace("unicode","\r\n");
				}
			}
			else if(ussd_business_data.indexOf("ascii") > 0){
				while(ussd_business_data.indexOf("ascii") > 0){
					ussd_business_data = ussd_business_data.replace("ascii","\r\n");
				}
			}
			else if(ussd_business_data.indexOf("8bit") > 0){
				while(ussd_business_data.indexOf("8bit") > 0)
				{
					ussd_business_data = ussd_business_data.replace("8bit","\r\n");
				}
			}
			close_dialog_loading();
			open_dialog_info(ussd_business_data);
			return 0;
		}
	}else{
		if((release_business_data != 0) && (release_business_data != 1)){
			clearTimeout(_getUssdBusinessTime);
			clearTimeout(_releaseUssdBusinessTime);
			close_dialog_loading();
			UssdCancelBusiness();
			open_dialog_info(jQuery.i18n.prop("ussdSendError"));
			return 0;
		}
		if(1 == release_business_data){
			gettimes = 0;
			if(ussd_business_data.length != 0){
				if(ussd_business_data.indexOf("unicode") > 0){
					ussd_business_data = eval("'" + ussd_business_data + "'");
					ussd_business_data = unescape(ussd_business_data.replace(/\u/g, "%u"));	
					while(ussd_business_data.indexOf("unicode") > 0){
						ussd_business_data = ussd_business_data.replace("unicode","\r\n");
					}
				}else if(ussd_business_data.indexOf("ascii") > 0){
					while(ussd_business_data.indexOf("ascii") > 0){
						ussd_business_data = ussd_business_data.replace("ascii","\r\n");
					}
				}else if(ussd_business_data.indexOf("8bit") > 0){
					while(ussd_business_data.indexOf("8bit") > 0){
						ussd_business_data = ussd_business_data.replace("8bit","\r\n");
					}
				}
				ussd_business_data+="\r\n";
				_displaylistdata += sendRecieveView;
				_displaylistdata+=ussd_business_data;
				$("#displayussdbusiness").val(_displaylistdata);
				getDisplaySssdBusinessBottom();
				open_USSD_dial();
			}
			close_dialog_loading();
			clearTimeout(_getUssdBusinessTime);
			clearTimeout(_releaseUssdBusinessTime);
			_displaylistdata += sendRecieveView;
			_displaylistdata += sendReleaseView;
			$("#displayussdbusiness").val(_displaylistdata);
			getDisplaySssdBusinessBottom();
			open_USSD_dial();
			return 0;
		}
		if(ussd_business_data.length != 0){
			gettimes = 0;
			if(disablebtn == true){
				
			}
			disablebtn = false;
			clearTimeout(_getUssdBusinessTime);
			
			if(ussd_business_data.indexOf("unicode") > 0){
				ussd_business_data = eval("'" + ussd_business_data + "'");
				ussd_business_data = unescape(ussd_business_data.replace(/\u/g, "%u"));	
				while(ussd_business_data.indexOf("unicode") > 0){
					ussd_business_data = ussd_business_data.replace("unicode","\r\n");
				}
			}else if(ussd_business_data.indexOf("ascii") > 0){
				while(ussd_business_data.indexOf("ascii") > 0){
					ussd_business_data = ussd_business_data.replace("ascii","\r\n");
				}
			}else if(ussd_business_data.indexOf("8bit") > 0){
				while(ussd_business_data.indexOf("8bit") > 0){
					ussd_business_data = ussd_business_data.replace("8bit","\r\n");
				}
			}
			
			ussd_business_data+="\r\n";
			_displaylistdata += sendRecieveView;
			_displaylistdata+=ussd_business_data;
			close_dialog_loading();
			$("#displayussdbusiness").val(_displaylistdata);
			getDisplaySssdBusinessBottom();
			open_USSD_dial();
			return 0;
		}
	}
}

function checkRequestUssdData(){
	gettimes += 1;
	clearTimeout(_getUssdBusinessTime);
	_getUssdBusinessTime = setTimeout(checkRequestUssdData, 2000);
	$.cgi.sendCmd("ussd_business");
	if(gettimes > 10){
		gettimes = 0;
		close_dialog_loading();
		UssdCancelBusiness();
		clearTimeOutFunction();
		open_dialog_info(jQuery.i18n.prop("requestTimeOut"));
	}
}

function clearTimeOutFunction(){
	clearTimeout(_releaseUssdBusinessTime);
	clearTimeout(_getUssdBusinessTime);
}

function successPostUssdSending(data) {
	$("#ussdTextCode").val("");
	$("#newUssdCode").val("");
}

function UssdCancelBusinessTest(){
	if(disableCancel == true){
		clearTimeout(_releaseUssdBusinessTime);
		var cancelUssdCode;
		var index = 0;
		var mapItemData = new Array();
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/ussdcode", cancelUssdCode);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/requestflag", 0);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/answerflag", 0);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/cancelclag", 1);
		$.cgi.postCmd('ussd_business', mapItemData, succesCancelBusinessTest, failPostCancelUssdSending);
	}else{
		open_dialog_info(jQuery.i18n.prop("noussdError"));
	}
}

function succesCancelBusinessTest(){
	$("#ussdTextCode").val("");
	$("#newUssdCode").val("");
}

function failPostCancelUssdSending(){
	close_dialog_loading();
	_displaylistdata+="\r\n";
	$("#displayussdbusiness").val(_displaylistdata);
	getDisplaySssdBusinessBottom();
}

function failPostUssdRequest(){
	close_dialog_loading();
	clearTimeOutFunction();
	$("#ussdTextCode").val("");
	$("#newUssdCode").val("");
}

//弹出框发送USSD函数
function send_USSD_dial(){
	var sendView = jQuery.i18n.prop("sendUssdview");
	var sendUssdCode = $('#newUssdCode').val();
	if(sendUssdCode.length != 0)
	{
		$("#displayussdbusiness").val("");
		_displaylistdata = "";
		disablebtn = true;
		recharge_flag = false;
		open_dialog_loading();
		var index = 0;
		var mapItemData = new Array();
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/ussdcode", sendUssdCode);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/requestflag", 1);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/answerflag", 0);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/cancelclag", 0);
		
		$.cgi.postCmd('ussd_business', mapItemData, successPostUssdSending, sendUSSDDialFail);
		
		sendUssdCode+="\r\n";
		_displaylistdata += sendView;
		_displaylistdata+=sendUssdCode;
		$("#displayussdbusiness").val(_displaylistdata);
		getDisplaySssdBusinessBottom();
		clearTimeout(_getUssdBusinessTime);
        _getUssdBusinessTime = setTimeout(checkRequestUssdData, 2000);		
	}
	else
	{
		open_dialog_info(jQuery.i18n.prop("noussdcode"));
		return;
	}
}

function sendUSSDDialFail(){
	$('#newUssdCode').val("");
}

//发送USSD函数
function SendUssdBusiness(){

	//执行USSD时，保留信号值
	$("#networkTypeLabel").hide();
	$("#USSDnetworkTypeLabel").show();
	$("#signal").hide();
	$("#signal-5").show();
	$("#max-signal").hide();
	$("#max-signal-5").show();
	setTimeout(function(){
		$("#networkTypeLabel").show();
		$("#USSDnetworkTypeLabel").hide();
		$("#signal").show();
		$("#signal-5").hide();
		$("#max-signal").show();
		$("#max-signal-5").hide();
	}, 5000);
	//执行USSD时，保留信号值

	var sendView = jQuery.i18n.prop("sendUssdview");
	var sendUssdCode = $('#ussdTextCode').val();
	if(sendUssdCode.length != 0){
		$("#displayussdbusiness").val("");
		_displaylistdata = "";
		disablebtn = true;
		recharge_flag = false;
		open_dialog_loading();
		var index = 0;
		var mapItemData = new Array();
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/ussdcode", sendUssdCode);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/requestflag", 1);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/answerflag", 0);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/cancelclag", 0);
		$.cgi.postCmd('ussd_business', mapItemData, successPostUssdSending, failPostUssdRequest);
		sendUssdCode+="\r\n";
		_displaylistdata += sendView;
		_displaylistdata+=sendUssdCode;
		$("#displayussdbusiness").val(_displaylistdata);
		getDisplaySssdBusinessBottom();
		clearTimeout(_getUssdBusinessTime);
        _getUssdBusinessTime = setTimeout(checkRequestUssdData, 2000);		
	}else{
		open_dialog_info(jQuery.i18n.prop("noussdcode"));
		return;
	}
}

function CheckBanlance(){

	//执行USSD时，保留信号值
	$("#networkTypeLabel").hide();
	$("#USSDnetworkTypeLabel").show();
	$("#signal").hide();
	$("#signal-5").show();
	$("#max-signal").hide();
	$("#max-signal-5").show();
	setTimeout(function(){
		$("#networkTypeLabel").show();
		$("#USSDnetworkTypeLabel").hide();
		$("#signal").show();
		$("#signal-5").hide();
		$("#max-signal").show();
		$("#max-signal-5").hide();
	}, 5000);
	//执行USSD时，保留信号值

	UssdCancelBusinessTest();
	var checkBalanceCode = "*222#";
	var sendBalanceView = jQuery.i18n.prop("sendUssdview");
	if(checkBalanceCode.length != 0){

		$("#displayussdbusiness").val("");
		open_dialog_loading();

		_displaylistdata = "";
		disablebtn = true;
		recharge_flag = false;

		var index = 0;
		var mapItemData = new Array();
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/ussdcode", checkBalanceCode);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/requestflag", 1);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/answerflag", 0);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/cancelclag", 0);
		
		$.cgi.postCmd('ussd_business', mapItemData, successPostUssdSending, failPostUssdRequest);
		checkBalanceCode += "\r\n";
		_displaylistdata += sendBalanceView;
		_displaylistdata += checkBalanceCode;

		$("#displayussdbusiness").val(_displaylistdata);
		getDisplaySssdBusinessBottom();
		clearTimeout(_getUssdBusinessTime);
        _getUssdBusinessTime = setTimeout(checkRequestUssdData, 2000);	
	}else{
		open_dialog_info(jQuery.i18n.prop("notussdSend"));
		return;
	}
}

function CheckDataUsage(){
	UssdCancelBusinessTest();
	var dataUsageCode = "*102#";
	var sendCheckView = jQuery.i18n.prop("sendUssdview");
	if(dataUsageCode.length != 0){

		$("#displayussdbusiness").val("");
		open_dialog_loading();

		_displaylistdata = "";
		disablebtn = true;
		recharge_flag = false;
		var index = 0;
		var mapItemData = new Array();
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/ussdcode", dataUsageCode);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/requestflag", 1);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/answerflag", 0);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/cancelclag", 0);
		
		$.cgi.postCmd('ussd_business', mapItemData, successPostUssdSending, failPostUssdRequest);
		dataUsageCode += "\r\n";
		_displaylistdata += sendCheckView;
		_displaylistdata += dataUsageCode;

		$("#displayussdbusiness").val(_displaylistdata);
		getDisplaySssdBusinessBottom();
		clearTimeout(_getUssdBusinessTime);
        _getUssdBusinessTime = setTimeout(checkRequestUssdData, 2000);	
	}else{
		open_dialog_info(jQuery.i18n.prop("noussdcode"));
		return;
	}
}

function UpdateMyMasterNumber(){
	UssdCancelBusinessTest();
	var myMaster = jQuery.i18n.prop("sendUssdview");
	var myMasterCode = "*6363#";
	if(myMasterCode.length != 0){
		$("#displayussdbusiness").val("");
		open_dialog_loading();
		_displaylistdata = "";
		disablebtn = true;
		recharge_flag = false;
		var index = 0;
		var mapItemData = new Array();
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/ussdcode", myMasterCode);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/requestflag", 1);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/answerflag", 0);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/cancelclag", 0);
		$.cgi.postCmd('ussd_business', mapItemData, successPostUssdSending, failPostUssdRequest);
		myMasterCode += "\r\n";
		_displaylistdata += myMaster;
		_displaylistdata += myMasterCode;
		$("#displayussdbusiness").val(_displaylistdata);
		getDisplaySssdBusinessBottom();
		clearTimeout(_getUssdBusinessTime);
        _getUssdBusinessTime = setTimeout(checkRequestUssdData, 2000);	
	}else {
		open_dialog_info(jQuery.i18n.prop("notussdSend"));
		return;
	}
}

function ShowMyZongMBBNumber(){

	//执行USSD时，保留信号值
	$("#networkTypeLabel").hide();
	$("#USSDnetworkTypeLabel").show();
	$("#signal").hide();
	$("#signal-5").show();
	$("#max-signal").hide();
	$("#max-signal-5").show();
	setTimeout(function(){
		$("#networkTypeLabel").show();
		$("#USSDnetworkTypeLabel").hide();
		$("#signal").show();
		$("#signal-5").hide();
		$("#max-signal").show();
		$("#max-signal-5").hide();
	}, 5000);
	//执行USSD时，保留信号值

	UssdCancelBusinessTest();
	var sendZongView = jQuery.i18n.prop("sendUssdview");
	var zongMbbCode = "*8#";
	if(zongMbbCode.length != 0){
		$("#displayussdbusiness").val("");
		open_dialog_loading();
		_displaylistdata = "";
		disablebtn = true;
		recharge_flag = false;
		
		var index = 0;
		var mapItemData = new Array();
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/ussdcode", zongMbbCode);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/requestflag", 1);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/answerflag", 0);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/cancelclag", 0);
		
		$.cgi.postCmd('ussd_business', mapItemData, successPostUssdSending, failPostUssdRequest);

		zongMbbCode += "\r\n";
		_displaylistdata += sendZongView;
		_displaylistdata += zongMbbCode;

		$("#displayussdbusiness").val(_displaylistdata);
		getDisplaySssdBusinessBottom();
		
		clearTimeout(_getUssdBusinessTime);
        _getUssdBusinessTime = setTimeout(checkRequestUssdData, 2000);	
	}else {
		open_dialog_info(jQuery.i18n.prop("notussdSend"));
		return;
	}
}

//action等于1 未发送短信 data 指令 num 地址 
function sendSMSRecharge(action,data,num){
	var pagePeople = $.trim(num);
	var pageContent = data;
	_smsAction = action;
    if(isValidSms(pagePeople,pageContent,_smsAction)){
		var index = 0;
		var mapData = new Array(0);
		mapData = putMapElement(mapData,"RGW/send_message/mailbox_flag",gSmsBoxFlag,index++);
		mapData = putMapElement(mapData,"RGW/send_message/message_id",gSmsId,index++);
		mapData = putMapElement(mapData,"RGW/send_message/action",action,index++);
		mapData = putMapElement(mapData,"RGW/send_message/addressee",pagePeople,index++);
		mapData = putMapElement(mapData,"RGW/send_message/message_content",pageContent,index++);
		open_dialog_loading();
		_flagSms = "1";
		$.cgi.postCmd("send_message", mapData, indexSendSmsSuccessCallBack, indexSendSmsFailCallBack, 50000);
	}
}

//首页发送短信成功回调函数
function indexSendSmsSuccessCallBack(data) {
    close_dialog_loading();
    _flagSms = "0";
    //短信发送状态
	var state = "";
	//_smsAction等于1时，表示发送短信
	if(_smsAction == "1"){
		state = $(data).find("send_state").text();
	}else{
		state = $(data).find("save_state").text();
	}
	//发送失败
	if(state != "0"){
		//重新发送窗口弹出
		ResendSms();
	}else{
		//发送成功提醒
		if(_smsAction == "1"){
		 	open_dialog_info(jQuery.i18n.prop("successSend"));
		}else{//保存成功提醒
			open_dialog_info(jQuery.i18n.prop("successSave"));
		}
	}
    $.cgi.sendCmd('message_drafts');
    $.cgi.sendCmd('message_outbox');
	$.cgi.sendCmd('message');
}
//首页发送短信失败回调函数
function indexSendSmsFailCallBack(){
	close_dialog_loading();
	_flagSms = "0";
	ResendSms();
}


//Update My Master Number发送函数
function UpdateMBBMasterNum(){
	var lNewMasterNumberText = $("#lNewMasterNumberText").val();
	var lMBBNumberText = $("#lMBBNumberText").val();
	//发送短信格式 MC 031XXXXXXXX CN 031XXXXXXXX
	var sendCode = "MC "+lNewMasterNumberText+" CN "+ lMBBNumberText;
	close_UpdateMasterNumberDial();
	sendSMSRecharge(1,sendCode,'6234');
}

//USSD回复函数
function SendAnswerBusiness(){
	//执行USSD时，保留信号值
	$("#networkTypeLabel").hide();
	$("#USSDnetworkTypeLabel").show();
	$("#signal").hide();
	$("#signal-5").show();
	$("#max-signal").hide();
	$("#max-signal-5").show();
	setTimeout(function(){
		$("#networkTypeLabel").show();
		$("#USSDnetworkTypeLabel").hide();
		$("#signal").show();
		$("#signal-5").hide();
		$("#max-signal").show();
		$("#max-signal-5").hide();
	}, 5000);
	//执行USSD时，保留信号值

	var sendAnswerView = jQuery.i18n.prop("sendUssdview");
	var sendUssdCode = $("#newUssdCode").val();
	if(sendUssdCode.length != 0){
		anserflag = true;
		recharge_flag = false;
		open_dialog_loading();
		var index = 0;
		var mapItemData = new Array();
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/ussdcode", sendUssdCode);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/requestflag", 0);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/answerflag", 1);
		mapItemData = g_objXML.putMapElement(mapItemData, index++, "RGW/Ussd/cancelclag", 0);
		$.cgi.postCmd('ussd_business', mapItemData, successPostUssdSending, answerFailPostUssdSending);
		_displaylistdata += sendAnswerView;
		sendUssdCode+="\r\n";
		_displaylistdata+=sendUssdCode;
		$("#displayussdbusiness").val(_displaylistdata);
		getDisplaySssdBusinessBottom();
		gettimes = 0;
		clearTimeout(_getUssdBusinessTime); 
        _getUssdBusinessTime = setTimeout(checkAnswerUssdData, 2000);	
		releaseWaitTimes = 0;
		clearTimeout(_releaseUssdBusinessTime);
        _releaseUssdBusinessTime = setTimeout(releaseUssdBusinessTime, 5000);	
	}else{
		open_dialog_info(jQuery.i18n.prop("ussdSelectError"));
		return;
	}
}

function answerFailPostUssdSending(){
	close_dialog_loading();
	clearTimeout(_getUssdBusinessTime);
	$("#newUssdCode").val("");
	_displaylistdata+="\r\n";
	$("#displayussdbusiness").val(_displaylistdata);
	getDisplaySssdBusinessBottom();
}

//检查USSD回复内容
function checkAnswerUssdData(){
	gettimes += 1;
	clearTimeout(_getUssdBusinessTime);
	_getUssdBusinessTime = setTimeout(checkAnswerUssdData, 1000);
	$.cgi.sendCmd("ussd_business");
	if(gettimes > 50){
		gettimes = 0;
		close_dialog_loading();
		UssdCancelBusiness();
		clearTimeout(_getUssdBusinessTime);
		_displaylistdata+="\r\n";
		$("#displayussdbusiness").val(_displaylistdata);
		getDisplaySssdBusinessBottom();
	}
}

function releaseUssdBusinessTime(){
	releaseWaitTimes += 1;
	clearTimeout(_releaseUssdBusinessTime);
	_releaseUssdBusinessTime = setTimeout(releaseUssdBusinessTime, 1000);
	var getReleaseTimeOut = jQuery.i18n.prop("requestTimeOut");
	$.cgi.sendCmd("ussd_business");
	if(releaseWaitTimes > 300){
		releaseWaitTimes = 0;
		close_dialog_loading();
		UssdCancelBusiness();
		clearTimeout(_releaseUssdBusinessTime);
		open_dialog_info(getReleaseTimeOut);
		_displaylistdata += "\r\n";
		$("#displayussdbusiness").val(_displaylistdata);
		getDisplaySssdBusinessBottom();
	}
}

//控制USSD显示框，永远显示到最新消息
function getDisplaySssdBusinessBottom(){
	document.getElementById("displayussdbusiness").scrollTop = document.getElementById("displayussdbusiness").scrollHeight;
}

