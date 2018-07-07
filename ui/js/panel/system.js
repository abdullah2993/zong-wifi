$(function(){
	initSystemPageWords();
	$.cgi.onGetXml('admin', getUserManagementData);
    $.cgi.onGetXml('time_setting', getSystemTimeData);
	$.cgi.onGetXml('ntp_server', getNtpserver);
});
//初始化System显示文字
function initSystemPageWords(){
	$("#lUserManagement").text(jQuery.i18n.prop("lUserManagement"));
	$("#route_username_title").text(jQuery.i18n.prop("lUsername"));
	$("#route_password_title").text(jQuery.i18n.prop("lPassword"));
	$("#lNtpserverSet").text(jQuery.i18n.prop("lNtpserverSet"));
	$("#ntp_address_title").text(jQuery.i18n.prop("lntpserverlabel"));
	$("#dst_title").text(jQuery.i18n.prop("dstserverlable"));
	$("#system_time_title").text(jQuery.i18n.prop("lcurrentsystime"));
	$("#lResotreFactSetting").text(jQuery.i18n.prop("lResotreFactSetting"));
	$("#system_reboot_title").text(jQuery.i18n.prop("lResotreFactSettingText"));
	$("#btnRestoreFactorySettings").val(jQuery.i18n.prop("btnRestoreFactorySettings"));
	$("#utc_time_title").text(jQuery.i18n.prop("lutctimetitle"));

	$("#h1TimeSet").text(jQuery.i18n.prop("h1TimeSet"));
	$("#lYear").text(jQuery.i18n.prop("lYear"));
	$("#lMonth").text(jQuery.i18n.prop("lMonth"));
	$("#lDay").text(jQuery.i18n.prop("lDay"));
	$("#lHour").text(jQuery.i18n.prop("lHour"));
	$("#lMinute").text(jQuery.i18n.prop("lMinute"));
	$("#lSecond").text(jQuery.i18n.prop("lSecond"));

	$("#lRebooting").text(jQuery.i18n.prop("lRebooting"));
	$("#network_reboot_title").text(jQuery.i18n.prop("lRebootTip"));
	$("#btnReboot").val(jQuery.i18n.prop("btnReboot"));

	//实例化NTP服务器下拉选择框
	initOptions("NtpSerVer_select");
	//实例化UTC时区下拉选择框
	initOptions("icurrentutctime");
}

var _sy6username=''; //用户名
var _sy6password=''; //密码
var _sy6xmlData = ''; 
var _sy6controlMapExisting=new Array(0);
var _sy6controlMapCurrent=new Array(0);
var _systemtimescroll;//系统时间刷新事件
var _systemtimescrollnum = 0;//系统时间刷新次数
function initSystemSetting(){
    $.cgi.sendCmd("admin");
    $.cgi.sendCmd("time_setting");
	$.cgi.sendCmd("ntp_server");
}

function getUserManagementData(data,textStatus){
    _sy6xmlData = data;  
    $(_sy6xmlData).find("management").each(function()
    {
        _sy6username = decodeURIComponent($(this).find("router_username").text());
        _sy6password = decodeURIComponent($(this).find("router_password").text());
    });  
    var index = 0;
    _sy6controlMapExisting = g_objXML.putMapElement(_sy6controlMapExisting,index++, "RGW/management/router_username", _sy6username);
    _sy6controlMapExisting = g_objXML.putMapElement(_sy6controlMapExisting,index, "RGW/management/router_password", _sy6password);
    _sy6controlMapCurrent = g_objXML.copyArray(_sy6controlMapExisting,_sy6controlMapCurrent);       
    displayUserData();
}

function displayUserData() {
    $("#sy6Error").text("");
	$("#tbrouter_passwordText").hide();
	$("#tbrouter_password").show();
	$("#tbrouter_username").val(_sy6username);
	$("#tbrouter_password").val(_sy6password);
	$("#tbrouter_passwordText").val(_sy6password);
	setCheckboxValue("sy6labelId",0);
}
//获取时间信息
function getSystemTimeData(data){
	//清除刷新系统时间轮询
	clearTimeout(_systemtimescroll);
	//启动刷新系统时间轮询，当已经拨号且轮序次数小于5
	if( _systemtimescrollnum < 5 && g_connectedStatus == 0){
		_systemtimescrollnum += 1;
		 _systemtimescroll = setTimeout(function () {
	       $.cgi.sendCmd("time_setting");
	    }, 5000);
	}
   

	var xmlData = data;
	var Year='',Monthe='',Day='',Hour='',Minite='',Second='';
	$(xmlData).find("time_setting").each(function () {
		Year = $(this).find("year").text();
		Monthe = $(this).find("month").text();
		Day = $(this).find("day").text();
		Hour = $(this).find("hour").text();
		Minite = $(this).find("minute").text();
		Second = $(this).find("second").text();  
	});
	
	$("#lSetTimeError").text("");
	
	if(parseInt(Year) < 1000){
		Year = "2012";
	}
	$('#sysTimeY').val(Year);		
	if(parseInt(Monthe) < 10){
		Monthe = "0"+Monthe;
	}	
	$('#sysTimeMon').val(Monthe);
	if(parseInt(Day) < 10){
		Day = "0"+Day;
	}		
	$('#sysTimeD').val(Day);	
	if(parseInt(Hour) < 10){
		Hour = "0"+Hour;
	}	
	$('#sysTimeH').val(Hour);	
	if (parseInt(Minite) < 10){
		Minite = "0"+Minite;
	}		
	$('#sysTimeMin').val(Minite);	
	if(parseInt(Second) < 10){
		Second = "0"+Second;
	}		
	$('#sysTimeS').val(Second);
	if(g_time_fomat == 1){
		$("#icurrentsystime").val(Day+"/"+Monthe+"/"+Year+" "+Hour+":"+Minite+":"+Second);
	}else{
		$("#icurrentsystime").val(Year+jQuery.i18n.prop("lYear")+Monthe+jQuery.i18n.prop("lMonth")+Day+jQuery.i18n.prop("lDay")+Hour+jQuery.i18n.prop("lHour")+Minite+jQuery.i18n.prop("lMinute")+Second+jQuery.i18n.prop("lSecond"));
	}
}
//设置时间
function SetSystemTime() {
    var year = $('#sysTimeY').val();
    var month = $('#sysTimeMon').val();
    var day = $('#sysTimeD').val();
    var hour = $('#sysTimeH').val();
    var minute = $('#sysTimeMin').val();
    var second = $('#sysTimeS').val();
	$("#lSetTimeError").text("");
    if (year > 2020 || year < 1970 || month > 12 || month < 1 || day < 1 || day > 31 || hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second>59 || hour == "" || minute == "" || second == "") {
        open_dialog_info(jQuery.i18n.prop("lErrorTime"));
        return;
    }
	else if(year%4 == 0 && year%100 != 0 || year%400 == 0){           
        if(month == 2 && day>29){
			open_dialog_info(jQuery.i18n.prop("lErrorTime"));
    	    return; 	    	
    	}	
    }
	else if(month == 2 && day>28){
        open_dialog_info(jQuery.i18n.prop("lErrorTime"));
        return;
    }
                
    if(day>31 && (month == 1 || month == 3 || month == 5 || month == 7|| month == 8|| month == 10 || month == 12)){
        open_dialog_info(jQuery.i18n.prop("lErrorTime"));
        return;
    }
                
    if(day>30 && (month == 4 || month == 6 || month == 9 || month == 11)) {
        open_dialog_info(jQuery.i18n.prop("lErrorTime"));
        return;
    }  
    open_dialog_loading();
    var mapItemData = new Array();
    var itemIndex = 0;
    mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/time_setting/year", year);
    mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/time_setting/month", month);
    mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/time_setting/day", day);
    mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/time_setting/hour", hour);
    mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/time_setting/minute", minute);
    mapItemData = g_objXML.putMapElement(mapItemData, itemIndex++, "RGW/time_setting/second", second);
    $.cgi.postCmd('time_setting', mapItemData, SuccessSetTime, failSetTime);
}
function SuccessSetTime(data) {
	close_dialog_loading();
	getSystemTimeData(data);	
    open_dialog_info(jQuery.i18n.prop("successApply"));
}
function failSetTime(){
	close_dialog_loading();
	open_dialog_info(jQuery.i18n.prop("failApply"));
}
//设置NTP信息
function getNtpserver(data){
	var xmlData = data;
	$("#lSetNtpServerError").text("");
	var server_name = $(xmlData).find("ntp_server").text();
	var utc_time = $(xmlData).find("utc_time").text();
	//根据NTP服务器地址，设置不同的下拉值
	if(server_name == "time.windows.com"){
		SetOptionValue("NtpSerVer_select",1);
	}else if(server_name == "time.nist.gov"){
		SetOptionValue("NtpSerVer_select",2);
	}else if(server_name == "time-nw.nist.gov"){
		SetOptionValue("NtpSerVer_select",3);
	}else if(server_name == "time-a.nist.gov"){
		SetOptionValue("NtpSerVer_select",4);
	}else if(server_name == "time-b.nist.gov"){
		SetOptionValue("NtpSerVer_select",5);
	}
	//设置当前设备使用的时区
	SetOptionValue("icurrentutctime",utc_time);
	//初始化夏令时，根据系统是否设置，显示不同状态
	var dst_switch = $(xmlData).find("dst_switch").text();
	setDstServerLable(dst_switch);
}

//设置夏令时信息
function setDstServerLable(dst_switch){
	//初始化DST css style
	if(dst_switch=="0"){//DST OFF
		setCheckboxValue("dstserver",0);
	}else if(dst_switch=="1"){//DST ON	
		setCheckboxValue("dstserver",1);
	}
}

function sy6showHidePassword(){
	var strPass = '';
	if (getCheckboxValue("sy6labelId") == 1){    
	    strPass = $("#tbrouter_passwordText").val();
		$("#tbrouter_password").show();
       	$("#tbrouter_passwordText").hide();
        $("#tbrouter_password").val(strPass);		
	}else{       
	    strPass = $("#tbrouter_password").val();
		$("#tbrouter_passwordText").show();
        $("#tbrouter_password").hide();
		$("#tbrouter_passwordText").val(strPass);
    }
}

//用户管理设置
function PostUserManagementSet(){
    var pageUsername = $("#tbrouter_username").val();
	var pagePassword = "";
	
	if(getCheckboxValue("sy6labelId") == 1){
		pagePassword = $("#tbrouter_passwordText").val();
	}else{
		pagePassword = $("#tbrouter_password").val();
	}

	$("#sy6Error").text("");
	
    if(isValidSystem(pageUsername,pagePassword,"sy6Error")){
        $("#sy6Error").text("");
        var index = 0;
        var mapData = new Array(0);
        _sy6controlMapCurrent[index++][1] = encodeURIComponent(pageUsername);
        _sy6controlMapCurrent[index++][1] = encodeURIComponent(pagePassword);
        mapData = g_objXML.copyArray(_sy6controlMapCurrent,mapData);
        mapData = g_objXML.getChangedArray(_sy6controlMapExisting,mapData,true); 
        if(mapData.length>0) {
            open_dialog_loading();
            $.cgi.postCmd('admin', mapData, successPostSystemSetting, failPostSystemSetting); 
		}
    }
}
function successPostSystemSetting(data) {
    close_dialog_loading();
    var newUserName = $("#tbrouter_username").val();
    if (newUserName && newUserName != "") {
        setCookie("userName", newUserName, 365);
    }
	getUserManagementData(data);
	open_dialog_info(jQuery.i18n.prop("successApply"));
}

function failPostSystemSetting(){
	close_dialog_loading();
	open_dialog_info(jQuery.i18n.prop("failApply"));
}
function isValidSystem(username, password, labelID){
    if(username.length<4 || username.length>25 || password.length<4 || password.length>25){
        open_dialog_info(jQuery.i18n.prop('lLengthError4_25'));
        return false;
    }     
	var re2 = /.*[^-_a-zA-Z0-9]+.*$/;
       
	if (re2.test(username) || re2.test(password)){
	    open_dialog_info(jQuery.i18n.prop("ErrInvalidUserPass"));
		return false;
	}
    return true;
}
function SetNtpserver(){
	$("#lSetNtpServerError").text("");

	var ntpServer = GetOptionsValue("NtpSerVer_select");
	//根据NTP服务器地址，设置不同的下拉值
	if(ntpServer == 1){
		ntpServer = "time.windows.com";
	}else if(ntpServer == 2){
		ntpServer = "time.nist.gov";
	}else if(ntpServer == 3){
		ntpServer = "time-nw.nist.gov";
	}else if(ntpServer == 4){
		ntpServer = "time-a.nist.gov";
	}else if(ntpServer == 5){
		ntpServer = "time-b.nist.gov";
	}
	//根据NTP服务器地址，设置不同的下拉值
	
	//获取DST的值
	var dstServer = getCheckboxValue("dstserver");
	//获取UTC的值
	var utc_time = GetOptionsValue("icurrentutctime");

	//验证当前已经拨号成功 g_connectedStatus 0-拨号成功 1-拨号失败 只有拨号成功才允许修改系统NTP服务器，系统时区
	if(g_connectedStatus == 1){
		open_dialog_info(jQuery.i18n.prop("lSystemTimeError"));
		return;
	}

	//检验NTP服务器地址合法性
	if(checkeURL(ntpServer)){
		open_dialog_loading();
	    var mapItemData = new Array();
		mapItemData = g_objXML.putMapElement(mapItemData, 0, "RGW/ntp_server_setting/ntp_server", ntpServer);
		mapItemData = g_objXML.putMapElement(mapItemData, 1, "RGW/ntp_server_setting/dst_switch", dstServer);
		mapItemData = g_objXML.putMapElement(mapItemData, 2, "RGW/ntp_server_setting/utc_time", utc_time);
		$.cgi.postCmd('ntp_server', mapItemData, SuccessSetNtpserver, failSetNtpserver);
	}else{
		 open_dialog_info(jQuery.i18n.prop("lErrorNtpServer"));
		 return;
	}
}
function SuccessSetNtpserver(data) {
	close_dialog_loading();
	var server_name = $(data).find("ntp_server").text();
	var utc_time = $(data).find("utc_time").text();
	if(server_name == "time.windows.com"){
		SetOptionValue("NtpSerVer_select",1);
	}else if(server_name == "time.nist.gov"){
		SetOptionValue("NtpSerVer_select",2);
	}else if(server_name == "time-nw.nist.gov"){
		SetOptionValue("NtpSerVer_select",3);
	}else if(server_name == "time-a.nist.gov"){
		SetOptionValue("NtpSerVer_select",4);
	}else if(server_name == "time-b.nist.gov"){
		SetOptionValue("NtpSerVer_select",5);
	}
	//设置当前设备使用的时区
	SetOptionValue("icurrentutctime",utc_time);
	//发送获取当前系统时间事件
	_systemtimescrollnum = 0;
	$.cgi.sendCmd("time_setting");
	
    open_dialog_info(jQuery.i18n.prop("successApply"));
}
function failSetNtpserver(){
	close_dialog_loading();
	open_dialog_info(jQuery.i18n.prop("failApply"));
}
// 验证url  
function checkeURL(str_url) {
    var strRegex="^((https|http|ftp|rtsp|mms)?://)" + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + "(([0-9]{1,3}\.){3}[0-9]{1,3}" + "|" + "([0-9a-z_!~*'()-]+\.)*" + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." + "[a-z]{2,6})" + "(:[0-9]{1,4})?" + "((/?)|" + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"; 
    var re=new RegExp(strRegex); 
    return re.test(str_url); 
}

//重启网关
function onReboot() {
    boxMBConfirmFactory(jQuery.i18n.prop("lConfirmResotre"), null, function () {
        $.cgi.sendCmd("reset");
        open_dialog_info(jQuery.i18n.prop("lrestartTip"));
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

//恢复出厂设置
function RestoreFactoryConfiguration(){
    boxMBConfirmFactory(jQuery.i18n.prop("lResotreFactSetting"), null, function () {
        $.cgi.sendCmd("restore_defaults");
        open_dialog_info(jQuery.i18n.prop("lResotreFactTip"));
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