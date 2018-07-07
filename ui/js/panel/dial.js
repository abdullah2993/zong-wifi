$(function() {
    initDialPageWords();
    //实例化profile列表下拉框
	initOptionsProfileList("profile_list_select");
	//实例化profile连接方式下拉框
	initOptionsprofileConnect("profile_connect_select");
	//实例化profile协议下拉框
	initOptions("profile_agreement_select");
	//实例化profile的IP协议下拉框
	initOptions("profile_ip_agreement_select");
	
	//绑定获取wan信息函数
	$.cgi.onGetXml("wan", getConnectionData);
});
//初始化设置向导显示文字
function initDialPageWords(){
	$("#lDialSet").text(jQuery.i18n.prop("dialTitle"));
	$("#profile_list_title").text(jQuery.i18n.prop("profileList"));
	$("#profile_mask_title").text(jQuery.i18n.prop("lRoamCheckBoxTitle"));
	$("#profile_connect_title").text(jQuery.i18n.prop("lConnectType"));
	$("#lprofileInfo").text(jQuery.i18n.prop("profileInfo"));
	$("#profile_name_title").text(jQuery.i18n.prop("profileName"));
	$("#profile_apn_title").text(jQuery.i18n.prop("apn"));
	$("#profile_username_title").text(jQuery.i18n.prop("apnUerName"));
	$("#profile_password_title").text(jQuery.i18n.prop("apnPassword"));
	$("#profile_agreement_title").text(jQuery.i18n.prop("lProtocol"));
	$("#profile_ip_agreement_title").text(jQuery.i18n.prop("lIPProtocol"));
	$("#optAuto").text(jQuery.i18n.prop("optAuto"));
	$("#optManual").text(jQuery.i18n.prop("optManual"));
	$("#optPro0").text(jQuery.i18n.prop("optPro0"));
	$("#optPro1").text(jQuery.i18n.prop("optPro1"));
	$("#optPro2").text(jQuery.i18n.prop("optPro2"));
	$("#optPro3").text(jQuery.i18n.prop("optPro3"));

	$("#optProfileIpType0").text(jQuery.i18n.prop("optProfileIpType0"));
	$("#optProfileIpType1").text(jQuery.i18n.prop("optProfileIpType1"));
	$("#optProfileIpType2").text(jQuery.i18n.prop("optProfileIpType2"));
}
<!-- ###############################拨号页面公共变量################################### -->
var _d3connectType = ''; //连接方式
var _arrayISPProvider = new Array(0); //Profile列表1
var _arrayISPProvider4G = new Array(0); //Profile列表2
var _valueSelect = 0;
var _valueSelect4G = 0;
var _activeIsp='';
var _defaultIsp = '';
var _activeIsp4G='';
var _d3xmlData = ''; 
var _d3controlMapExisting=new Array(0);
var _d3controlMapCurrent=new Array(0);
var MACRO_SUPPORT_CHAR_MIN = 32;
var MACRO_SUPPORT_CHAR_MAX = 127;
//表示字符编码的全局变量
var MACRO_NOT_SUPPORT_CHAR_COMMA = 44; //,
var MACRO_NOT_SUPPORT_CHAR_QUOTATION_MARK = 34; //"
var MACRO_NOT_SUPPORT_CHAR_COLON = 58; //:
var MACRO_NOT_SUPPORT_CHAR_SEMICOLON = 59; //;
var MACRO_NOT_SUPPORT_BACKSLASH_MARK = 92; //\
var MACRO_NOT_SUPPORT_CHAR_38 = 38; //&
var MACRO_NOT_SUPPORT_CHAR_37 = 37; //%
var MACRO_NOT_SUPPORT_CHAR_43 = 43; //+
var MACRO_NOT_SUPPORT_CHAR_39 = 39; //'
var MACRO_NOT_SUPPORT_CHAR_60 = 60; //<
var MACRO_NOT_SUPPORT_CHAR_62 = 62; //>
var MACRO_NOT_SUPPORT_CHAR_63 = 63;
//表示字符编码的全局变量
var _userChoseMapCurrent = new Array(0); //用户选择内容
<!-- ###############################拨号页面公共变量################################### -->
<!-- ###############################拨号设置################################### -->
//发送获取wan信息的请求
function initDialSetting(){
    //获取无线基本设置
    $.cgi.sendCmd('wan');
    //Profile禁用编辑
    $("#textProfileName").hojyBnEnable(false);
}
//获取连接数据
function getConnectionData(data){
	_d3xmlData = data;
	_arrayISPProvider = new Array(0);
	_arrayISPProvider4G = new Array(0);
	d3loadCellularData();
	_d3controlMapCurrent = g_objXML.copyArray(_d3controlMapExisting, _d3controlMapCurrent);
}

//加载当前应用的Profile信息
function d3loadCellularData(){
    var indexISP = 0;
    var connect_mode = "";
	var protocol_text = "";
	var protocol_num = "0";
	var ipProtocol_text = "";
	var ipProtocol_num = "0";
	connect_mode = $(_d3xmlData).find("profile").find("connect_mode").text();
	_activeIsp = $(_d3xmlData).find("profile active_isp_name").text();
	_defaultIsp = $(_d3xmlData).find("default_isp_name").text();
    $(_d3xmlData).find("cellular").each(function(){
        $(this).find("profile Item").each(function(){
			_arrayISPProvider[indexISP] = new Array(7);
			_arrayISPProvider[indexISP][0] = $(this).find("ISP").text();
			_arrayISPProvider[indexISP][1] = $(this).find("APN_name").text();
			_arrayISPProvider[indexISP][2] = $(this).find("uname").text();
			_arrayISPProvider[indexISP][3] = $(this).find("pswd").text();
			protocol_text = $(this).find("protocol").text();
			ipProtocol_text = $(this).find("ip_version").text();
			//协议
			if(protocol_text == "PAP"){
				protocol_num = "1";
			}else if(protocol_text == "CHAP"){
				protocol_num = "2";
			}else if(protocol_text == "PAP|CHAP"){
				protocol_num = "3";
			}else{
				protocol_num = "0";
			}
			_arrayISPProvider[indexISP][4] = protocol_num;
			//IP协议
			if(ipProtocol_text == "IPV4"){
				ipProtocol_num = "0";
			}else if(ipProtocol_text == "IPV6"){
				ipProtocol_num = "1";
			}else if(ipProtocol_text == "IPV4V6"){
				ipProtocol_num = "2";
			}
			_arrayISPProvider[indexISP][5] = ipProtocol_num;
			indexISP++;
        });
    });

    if(_arrayISPProvider[indexISP]){
        delete(_arrayISPProvider[indexISP]);
    }	

    //匹配当前使用的Profile
    for(i=0;i<_arrayISPProvider.length;i++){
        if(_activeIsp==_arrayISPProvider[i][0]){
            _valueSelect = i;
            break;
        }
    }
    //设置当前连接方式
	connect_mode_display(connect_mode);
	loadProfileData();
}
//设置当前连接方式函数
function connect_mode_display(connect_mode){
	if (connect_mode == 0){
		//2-手动连接
		SetOptionValue("profile_connect_select",2);
		//隐藏漫游时自动连接选中按钮
		$("#trRoam").hide();
		$("#trRoamLabel").hide();
	}else if(connect_mode == 1) {
		//1-自动连接
		SetOptionValue("profile_connect_select",1);
		//显示漫游时自动连接选中按钮
		$("#trRoam").show();
		$("#trRoamLabel").show();
		//设置漫游时自动连接 为选中状态
		setCheckboxValue("profile_mask_value",1);
	}else{
		//1-自动连接
		SetOptionValue("profile_connect_select",1);
		//显示漫游时自动连接选中按钮
		$("#trRoam").show();
		$("#trRoamLabel").show();
		//设置漫游时自动连接 为未选中状态
		setCheckboxValue("profile_mask_value",0);
	}

}
//加载当前ProfileData数据
function loadProfileData(){
	//清空Profile列表
	$("#pProfile").empty();
	
	//当前提供的Profile列表
    for(i = 0 ; i < _arrayISPProvider.length ; i++){
        $("#pProfile").append("<option value='"+i+"' id='" + _arrayISPProvider[i][0] + "'>" + _arrayISPProvider[i][0] + "</option>");
    }
	if( _arrayISPProvider.length > 0){
		//设置当前应用的Profile
		SetOptionValue("profile_list_select",_valueSelect);
		//根据当前应用的Profile显示 Profile信息
		$("#textProfileName").val(_arrayISPProvider[_valueSelect][0]);
		$("#textAPNName").val(_arrayISPProvider[_valueSelect][1]);
		$("#textUserName").val(_arrayISPProvider[_valueSelect][2]);
		$("#textPassword").val(_arrayISPProvider[_valueSelect][3]);
		//设置协议
		SetOptionValue("profile_agreement_select",_arrayISPProvider[_valueSelect][4]);
		//设置IP协议
		SetOptionValue("profile_ip_agreement_select",_arrayISPProvider[_valueSelect][5]);

		//当前使用的和默认 不允许删除
		if(_arrayISPProvider[_valueSelect][0] == _activeIsp || _arrayISPProvider[_valueSelect][0] == _defaultIsp){
		    $("#btnDeleteISP").hojyBnEnable(false); 
		}else{			
    	    $("#btnDeleteISP").hojyBnEnable(true); 
		}

		//默认的不允许修改
		if(_arrayISPProvider[_valueSelect][0] == _defaultIsp){
			$("#textAPNName").hojyBnEnable(false); 
			$("#textUserName").hojyBnEnable(false); 
			$("#textPassword").hojyBnEnable(false); 
			$("#profile_agreement_select").hojyBnEnable(false);
			$("#protocol_option_select").attr("disabled","disabled");
			$("#profile_ip_agreement_select").hojyBnEnable(false);
			$("#ip_protocol_option_select").attr("disabled","disabled");
			$("#btnDialModifyProfile").hojyBnEnable(false);
			protocol_display(false);	
		}else{
			$("#textAPNName").hojyBnEnable(true); 
			$("#textUserName").hojyBnEnable(true); 
			$("#textPassword").hojyBnEnable(true); 
			$("#profile_agreement_select").hojyBnEnable(true);
			$("#protocol_option_select").removeAttr("disabled");
			$("#profile_ip_agreement_select").hojyBnEnable(true);
			$("#ip_protocol_option_select").removeAttr("disabled");
			$("#btnDialModifyProfile").hojyBnEnable(true);
			protocol_display(true);
		}
	} else {
		$("#textProfileName").val("");
		$("#textAPNName").val("");
		$("#textUserName").val("");
		$("#textPassword").val("");
	}
	var index=0;
	if( _arrayISPProvider.length > 0){
	    _d3controlMapExisting = g_objXML.putMapElement(_d3controlMapExisting, index++, "RGW/wan/cellular/profile/ISP_name", _arrayISPProvider[_valueSelect][0]);
		_d3controlMapExisting = g_objXML.putMapElement(_d3controlMapExisting, index++, "RGW/wan/cellular/profile/apn_name", _arrayISPProvider[_valueSelect][1]);
	    _d3controlMapExisting = g_objXML.putMapElement(_d3controlMapExisting, index++, "RGW/wan/cellular/profile/username", _arrayISPProvider[_valueSelect][2]);
	    _d3controlMapExisting = g_objXML.putMapElement(_d3controlMapExisting, index++, "RGW/wan/cellular/profile/password", _arrayISPProvider[_valueSelect][3]);
		_d3controlMapExisting = g_objXML.putMapElement(_d3controlMapExisting, index++, "RGW/wan/cellular/profile/protocol", _arrayISPProvider[_valueSelect][4]); 
	}
}
//协议 IP协议 隐藏和显示设置函数
function  protocol_display(isShow){
	if(isShow == false){ 
		optionHide("optPro0");
		optionHide("optPro1");
		optionHide("optPro2");
		optionHide("optPro3");
		optionHide("optProfileIpType0");
		optionHide("optProfileIpType2");
	}else{
		optionShow("optPro0");
		optionShow("optPro1");
		optionShow("optPro2");
		optionShow("optPro3");
		optionShow("optProfileIpType0");
		optionShow("optProfileIpType2");
	}
}

//拨号设置应用函数
function postUserSetProfileData() {
    var Profilename = $("#textProfileName").val();
    var APNname = $("#textAPNName").val();
    var Username = $("#textUserName").val();
    var Password = $("#textPassword").val();
    var AccessNumber = "";
	var errorString = validate1(Profilename, APNname, Username, Password, AccessNumber);
	if(errorString != "OK"){
		open_dialog_info(jQuery.i18n.prop(errorString));
		return;
	}

    var ConnMode;
	var pageConnMode = GetOptionsValue("profile_connect_select");
  	//当前连接模式是否为手动 1-自动 2-手动
    if (pageConnMode == "2"){
        ConnMode = 0;
	}else{
		//漫游时是否自动连接 是否选中0-未选中 1-选中
        if (getCheckboxValue("profile_mask_value") == 1){
			ConnMode = 1;
        }else{
			ConnMode = 2;
		}
	}
    var itemIndex=0;
	var operate = "apply";
    var mapItemData = new Array(0);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/connect_mode",ConnMode);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/operate",operate);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/isp_supported_list/Item#index",itemIndex);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/isp_supported_list/Item/ISP",Profilename);
	open_dialog_loading();
	$.cgi.postCmd("wan", mapItemData, successPostDialSetting, failPostDialSetting, 10000); 
}
//拨号设置 应用成功 回调函数
function successPostDialSetting(){
	close_dialog_loading();
	initDialSetting();
	open_dialog_info(jQuery.i18n.prop("successApply"));
}
//拨号设置 应用失败 回调函数
function failPostDialSetting(xmldate, textStatus){
    close_dialog_loading();
    $.cgi.sendCmd("status1");
    open_dialog_info(jQuery.i18n.prop("failApply")); 
}
<!-- ###############################拨号设置################################### -->
<!-- ###############################拨号设置公共函数################################### -->
//验证拨号设置 应用时 提交的数据是否OK
function validate1(Profilename,APNname,Username,Password,AccessNumber){
    if(Profilename==""){
        return "EMPTY_PROFILE_NAME";
    }
	var re2 = /.*[^-_a-zA-Z0-9]+.*$/;
	if(false == checkInputChar(APNname)){
		return "lInvalidCharacter1";
	}
	if (false == checkInputChar(Profilename)){
		return "Profile_Name_Invalid_Character";
	}
    return "OK";
}

//验证输入字符 字符集是否正确
function checkInputChar(str) {
    var i;
    var char_i;
    var num_char_i;
    if (str == "") {
        return true;
    }
    for(i = 0; i < str.length; i++){
        char_i = str.charAt(i);
        num_char_i = char_i.charCodeAt();
        if ((num_char_i > MACRO_SUPPORT_CHAR_MAX) || (num_char_i < MACRO_SUPPORT_CHAR_MIN)) {
            return false;
        }else if((MACRO_NOT_SUPPORT_CHAR_COMMA == num_char_i) || (MACRO_NOT_SUPPORT_CHAR_QUOTATION_MARK == num_char_i) || (MACRO_NOT_SUPPORT_CHAR_COLON == num_char_i) || (MACRO_NOT_SUPPORT_CHAR_SEMICOLON == num_char_i) || (MACRO_NOT_SUPPORT_BACKSLASH_MARK == num_char_i) || (MACRO_NOT_SUPPORT_CHAR_38 == num_char_i) || (MACRO_NOT_SUPPORT_CHAR_37 == num_char_i) || (MACRO_NOT_SUPPORT_CHAR_43 == num_char_i) || (MACRO_NOT_SUPPORT_CHAR_39 == num_char_i) || (MACRO_NOT_SUPPORT_CHAR_60 == num_char_i) || (MACRO_NOT_SUPPORT_CHAR_62 == num_char_i) || (MACRO_NOT_SUPPORT_CHAR_63 == num_char_i)) {
            return false;
        } else {
            continue;
        }
    }
    return true;
}
<!-- ###############################拨号设置公共函数################################### -->
<!-- ###############################Profile信息################################### -->
//新增Profile函数
function addNewProfile() {
	var profileNums;
	profileNums = _arrayISPProvider.length;
    var maxLength = 5;
    if (profileNums < maxLength) {
        boxMBAddNewProfile();
    } else {
        open_dialog_info(jQuery.i18n.prop("maxProfile"));
    }
}

//打开新增Profile对话框
function boxMBAddNewProfile(){
    //设置页面显示的文字
    $("#btnOk").val(jQuery.i18n.prop("btnOk"));
    $("#btnCancel").val(jQuery.i18n.prop("btnCancel"));
    $("#lNewProfileName").text(jQuery.i18n.prop("lNewProfileName"));
    $("#lNewAPN").text(jQuery.i18n.prop("lNewAPN"));
    $("#lNewCAccessNumber").text(jQuery.i18n.prop("lNewCAccessNumber"));
    $("#lNewCUserName").text(jQuery.i18n.prop("lNewCUserName"));
    $("#lNewCPassword").text(jQuery.i18n.prop("lNewCPassword"));
    $("#lNewProtocol").text(jQuery.i18n.prop("lNewProtocol"));
    $("#textProfileIpProtocol").text(jQuery.i18n.prop("textProfileIpProtocol"));
    $("#optNewPro0").text(jQuery.i18n.prop("optPro0"));
	$("#optNewPro1").text(jQuery.i18n.prop("optPro1"));
	$("#optNewPro2").text(jQuery.i18n.prop("optPro2"));
	$("#optNewPro3").text(jQuery.i18n.prop("optPro3"));
	$("#optProfileNewIpType0").text(jQuery.i18n.prop("optProfileIpType0"));
	$("#optProfileNewIpType1").text(jQuery.i18n.prop("optProfileIpType1"));
	$("#optProfileNewIpType2").text(jQuery.i18n.prop("optProfileIpType2"));
	$("#d3NewlabelId").text(jQuery.i18n.prop("lRoamCheckBoxTitle"));

    //初始化 协议和IP协议下拉
    initOptions("textNewProtocol");
    initOptions("profileNewIpProtocol");

    $("#txtNewProfileName").val("");
    $("#txtNewAPNName").val("");
    $("#txtNewUserName").val("");
    $("#txtNewPassword").val("");

    //设置默认显示协议 为-无
	SetOptionValue("textNewProtocol",0);

	//设置默认显示IP协议 为-IPv4
	SetOptionValue("profileNewIpProtocol",0);

	//设置默认 漫游时自动拨号 未选中
	setCheckboxValue("d3NewchkUnmask",0);

    $("#MBAddNewProfile").dialog({
        modal:true,
        height: 540,
        width: 450,
        resizable:false,
        title: jQuery.i18n.prop("lAddNewProfile")
    });
}

//确定新建Profile配置 提交函数
function btnOkClickedProfile(){
	var Profilename = $("#txtNewProfileName").val(); 
	var APNname = $("#txtNewAPNName").val(); 
	var Username = $("#txtNewUserName").val(); 
	var Password = $("#txtNewPassword").val();
	var AccessNumber = "";

	//判断当前是否已经存在相同的APN，判断标准Profile名称
	for(var i = 0 ; i < _arrayISPProvider.length ; i++){
		if(Profilename == _arrayISPProvider[i][0]){
			open_dialog_info(jQuery.i18n.prop("lWarnSameProfile"));
			return;
		}
	}

	//获取选中的协议
	var protocol_num = GetOptionsValue("textNewProtocol");
	Protocol = protocolToText(parseInt(protocol_num));

	//获取选中的IP协议
	var ipProtocol_num = GetOptionsValue("profileNewIpProtocol");
	ProfileIpprotocolType = ipProtocolToText(parseInt(ipProtocol_num));

	//验证新建Profile参数是否 合法
	var errorString = validate(Profilename,APNname,Username,Password,AccessNumber);
	if(errorString=="OK"){
	    $("#MBAddNewProfile").dialog("destroy");
	    open_dialog_loading();
		addProfilePost(Profilename, APNname, Username, Password, Protocol, ProfileIpprotocolType);
	}
	else{
		open_dialog_info(jQuery.i18n.prop(errorString));	
	}
}

//取消新建Profile配置 提交函数
function btnCancelClickedProfile(){
    $("#MBAddNewProfile").dialog("destroy");
}

//根据值转换成相对应的协议
function protocolToText(protocol_num)
{
	var protocol_text = "";
	if(protocol_num == 1){
		protocol_text = "PAP";
	}else if(protocol_num == 2){
		protocol_text = "CHAP";
	}else if(protocol_num == 3){
		protocol_text = "PAP|CHAP";
	}else{
		protocol_text = "";
	}
	return protocol_text;
}

//根据值转换成相对应的IP协议
function ipProtocolToText(ipProtocolNum)
{
	var ret = "";
	if(ipProtocolNum == 0){
		ret = "IPV4";
	}else if(ipProtocolNum == 1){
		ret = "IPV6";
	}else if(ipProtocolNum == 2){
		ret = "IPV4V6";
	}
	return ret;
}

//验证拨号设置 新增时 提交的数据是否OK
function validate(Profilename,APNname,Username,Password,AccessNumber){
    if(Profilename==""){
        return "EMPTY_PROFILE_NAME";
    }
	var firstProfilename = $("#Profiledropdown").text();
	if(Profilename == firstProfilename){
	  return "faultAddprofile";
	}
	if(false == checkInputChar(APNname)){
		return "lInvalidCharacter1";
	}
	if (false == checkInputChar(Profilename)){
		return "Profile_Name_Invalid_Character";
	}
	return "OK";
}

//新建Profile 提交cgi处理函数
function addProfilePost(Profilename, APNname, Username, Password, Protocol, IpProtocol){
    var itemIndex=0;
	var operate = "add";
    var mapItemData = new Array(0);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/operate","add");
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/isp_supported_list/Item#index",itemIndex);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/isp_supported_list/Item/ISP",Profilename);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/isp_supported_list/Item/APN_name",APNname);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/isp_supported_list/Item/uname",Username);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/isp_supported_list/Item/pswd",Password);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/isp_supported_list/Item/protocol",Protocol);  
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/isp_supported_list/Item/ip_version",IpProtocol); 
	$.cgi.postCmd('wan', mapItemData, successAddDialSetting, failAddDialSetting, 10000); 
}
//Profile信息 删除按钮点击函数
function deleteProfile(){   
    var pageProfile = $("#textProfileName").attr("value");
	open_dialog_loading();
	deleteProfilePost(pageProfile);
}
//删除Profile 提交cgi处理函数
function deleteProfilePost(Profilename){
    var itemIndex=0;
	var operate = "delete";
    var mapItemData = new Array(0);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/operate",operate);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/isp_supported_list/Item#index",itemIndex);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/isp_supported_list/Item/ISP",Profilename);
	$.cgi.postCmd('wan', mapItemData, successDeleteDialSetting, failDeleteDialSetting, 10000); 
}

//删除Profile 提交cgi处理函数 成功回调函数
function successDeleteDialSetting(){
	close_dialog_loading();
	initDialSetting();
	open_dialog_info(jQuery.i18n.prop("successDelete"));
}
//删除Profile 提交cgi处理函数 失败回调函数
function failDeleteDialSetting(xmldate, textStatus){
    close_dialog_loading();
    $.cgi.sendCmd('status1');
    open_dialog_info(jQuery.i18n.prop("failDelete")); 
}

//添加Profile 提交cgi处理函数 成功回调函数
function successAddDialSetting(){
	close_dialog_loading();
	initDialSetting();
	open_dialog_info(jQuery.i18n.prop("successAdd"));
}
//添加Profile 提交cgi处理函数 失败回调函数
function failAddDialSetting(xmldate, textStatus){
    close_dialog_loading();
    $.cgi.sendCmd('status1');
    open_dialog_info(jQuery.i18n.prop("failAdd")); 
}

//Profile信息 修改按钮点击函数
function modifyProfile(){   
    var Profilename = $("#textProfileName").val();
    var APNname = $("#textAPNName").val();
    var Username = $("#textUserName").val();
    var Password = $("#textPassword").val();
    var AccessNumber = "";
	var errorString = validate1(Profilename, APNname, Username, Password, AccessNumber);
	if(errorString != "OK")
	{
		open_dialog_info(jQuery.i18n.prop(errorString));	
		return;
	}

	//获取选中的协议
	var protocol_num = GetOptionsValue("profile_agreement_select");
	Protocol = protocolToText(parseInt(protocol_num));
	//获取选中的IP协议
	var ipProtocol_num = GetOptionsValue("profile_ip_agreement_select");
	ProfileIpprotocolType = ipProtocolToText(parseInt(ipProtocol_num));
    //提交修改cgi请求
	modifyProfilePost(Profilename, APNname, Username, Password, Protocol, ProfileIpprotocolType);
}

//Profile信息提交修改cgi请求
function modifyProfilePost(Profilename, APNname, Username, Password, Protocol, ipProtocol){
    var itemIndex=0;
	var operate = "modify";
    var mapItemData = new Array(0);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/operate",operate);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/isp_supported_list/Item#index",itemIndex);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/isp_supported_list/Item/ISP",Profilename);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/isp_supported_list/Item/APN_name",APNname);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/isp_supported_list/Item/uname",Username);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/isp_supported_list/Item/pswd",Password);
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/isp_supported_list/Item/protocol",Protocol);  
	mapItemData = g_objXML.putMapElement(mapItemData,itemIndex++, "RGW/wan/cellular/profile/isp_supported_list/Item/ip_version",ipProtocol);  
	open_dialog_loading();
	$.cgi.postCmd('wan', mapItemData, successPostModifyDialSetting, failPostModifyDialSetting, 10000); 
}
function successPostModifyDialSetting(){
	close_dialog_loading();
	initDialSetting();
	open_dialog_info(jQuery.i18n.prop("successModify"));
}

function failPostModifyDialSetting(xmldate, textStatus){
    close_dialog_loading();
    open_dialog_info(jQuery.i18n.prop("failModify")); 
}

//Profile List 修改函数
function changedProfiledrpdwn(){
    var value = $("#Profiledropdown").text();
	var arrayISPTemp = new Array(0); 
	var ispTemp = "";
	arrayISPTemp = _arrayISPProvider;
	ispTemp = _activeIsp;
    for(i = 0; i < arrayISPTemp.length; i++){
        if(value == arrayISPTemp[i][0]){
			$("#textProfileName").val(arrayISPTemp[i][0]);
			$("#textAPNName").val(arrayISPTemp[i][1]);
			$("#textUserName").val(arrayISPTemp[i][2]);
			$("#textPassword").val(arrayISPTemp[i][3]);
			SetOptionValue("profile_agreement_select",arrayISPTemp[i][4]);
			SetOptionValue("profile_ip_agreement_select",arrayISPTemp[i][5]);
        }
    }

	//当前使用的和默认允许不允许删除
    if((value == ispTemp) || (value == _defaultIsp)){
	    $("#btnDeleteISP").hojyBnEnable(false);
	}
    else{
        $("#btnDeleteISP").hojyBnEnable(true);
	}
	
	//默认的不允许修改
	if(value == _defaultIsp){
		$("#textAPNName").hojyBnEnable(false); 
		$("#textUserName").hojyBnEnable(false); 
		$("#textPassword").hojyBnEnable(false); 
		$("#profile_agreement_select").hojyBnEnable(false);
		$("#protocol_option_select").attr("disabled","disabled");
		$("#profile_ip_agreement_select").hojyBnEnable(false);
		$("#ip_protocol_option_select").attr("disabled","disabled");
		$("#btnDialModifyProfile").hojyBnEnable(false);
		protocol_display(false);
	}else{
		$("#textAPNName").hojyBnEnable(true); 
		$("#textUserName").hojyBnEnable(true); 
		$("#textPassword").hojyBnEnable(true); 
		$("#profile_agreement_select").hojyBnEnable(true);
		$("#protocol_option_select").removeAttr("disabled");
		$("#profile_ip_agreement_select").hojyBnEnable(true);
		$("#ip_protocol_option_select").removeAttr("disabled");
		$("#btnDialModifyProfile").hojyBnEnable(true);
		protocol_display(true);
	}
}
//Connet Mode 修改函数
function changedConnMode(){
	var value = GetOptionsValue("profile_connect_select");
    if(value == 2){
		$("#trRoam").hide();
		$("#trRoamLabel").hide();
    }else{
		$("#trRoam").show();
		$("#trRoamLabel").show();
		setCheckboxValue("profile_mask_value",0);
    }
}
<!-- ###############################Profile信息################################### -->