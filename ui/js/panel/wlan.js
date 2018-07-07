<!-- ###############################WLAN页面公共变量################################### -->
var _w4netEnable; //网络使能，开启关闭
var _w4netMode; //网络模式 (802.11n/802.11)
var _w4netChannel; //信道
var _w4xmlData = ''; 
var _w4strSSID=''; //SSID名称
var _w4ssidLimit='0'; //SSID格式限制，是/否
var _w4ssidBcast=''; //SSID广播状态，可见不可见
var _w4apIsolate=0;
var _w4securityType=''; //802.11认证方式
var _w4modeKey=''; //密码
var _w4cipherType=''; //加密方式（TKIP/AES-CCMP)
var isSSIDBcastPost = 0;
var _w4wepEncrypt = ''; //WEP模式下的加密方式 64 bit("0"),128 bit("1")
var _w4wepAuth;  		//WEP模式下的加密模式选项Open/Shared
var _w4wapiPskKeyType;   //WAPI模式下的编码方式hex("1"),ascii("0")
var _w4multiSSID=0;   //多重ssid开关
var _w4multistrSSID=''; //副SSID名称
var _w4multissidLimit='0'; //副SSID格式限制，是/否
var _w4multissidBcast='1'; //副SSID广播状态，可见不可见
var _w4multiapIsolate=0;
var _w4multisecurityType=''; //副802.11认证方式
var _w4multimodeKey=''; //副密码
var _w4multicipherType=''; //副加密方式（TKIP/AES-CCMP)
var _w4multinetMode = 0;
var _w4multiwepEncrypt = ''; //副WEP模式下的加密方式 64 bit("0"),128 bit("1")
var _w4multiwepAuth;  		//副WEP模式下的加密模式选项Open/Shared
var _w4multiwapiPskKeyType;   //副WAPI模式下的编码方式hex("1"),ascii("0")
var _w4multicontrolMapExisting=new Array(0);
var _w4multicontrolMapCurrent=new Array(0);
var _w4multiChangeSecriteType = 0;  //加密方式是否改变，默认未修改
var _w4controlMapExisting=new Array(0);
var _w4controlMapCurrent=new Array(0);
var _w4controlMapNwOld=new Array(0);
var _w4controlMapNwNew=new Array(0);
var _w4ChangeSecriteType = 0;  //加密方式是否改变，默认未修改
var _w4WlanLteEnable = "0";  //wlan与LTE共存，0|1 为关闭|打开
var _w4WlanAutoDisconnect = "0";  //wlan自动断开功能，0|1 为禁用|启用
var _w4WalnBandwidthMode = 2; //0-20M 1-40M 2-Auto  默认20M
var _w4timeset = 10;//自动断开的时间设定,默认设置为10分钟
var _w4wifi_version;//wifi芯片型号
var _w4device_type = 0;//0:cpe;1:mifi
var _multi_show_state = 0;//0-hidden 1-show 是否显示多SSID和客户端隔离功能
<!-- ###############################WLAN页面公共变量################################### -->

<!-- ###############################WLAN设置################################### -->
$(function() {
	//初始化页面显示文字,下拉框,选中框
    initWlanPageWords();
   	changeBand();
   	//获取WLAN高级设置
    $.cgi.onGetXml('uapxb_wlan_security_settings', getWlanSecurityData);
	//获取无线基本设置
    $.cgi.onGetXml('uapxb_wlan_basic_settings', function (data) {
        getWlanWlanBasicData(data);
        //获取无线安全设置
        $.cgi.sendCmd('uapxb_wlan_security_settings');
    });
    //获取自动WLAN自动卸载设置
    $.cgi.onGetXml('wlan_auto_setting', get_wlan_auto_disconnect_data); 
});

//初始化页面数据函数
function initWlanSetting(){
	$.cgi.sendCmd('uapxb_wlan_basic_settings');
	$.cgi.sendCmd('wlan_auto_setting');
   
	_w4ChangeSecriteType = 0;
	_w4multiChangeSecriteType = 0;

	if($.hojyStatus.freqFiveEnable == "1"){
		$("#trFB").show();
		optionShow("opt80211a");
		optionShow("opt80211an");
	}else{
		$("#trFB").hide();
		optionHide("opt80211a");
		optionHide("opt80211an");
	}
}
//获取WLAN基本设置信息
function getWlanWlanBasicData(data){
	var xml = data;
	$(xml).find("wlan_settings").each(function () {
		_w4netEnable = $(this).find("wlan_enable").text();
		_w4netMode = $(this).find("net_mode").text();
		_w4netChannel = $(this).find("channel").text();
		_w4netBand = $(this).find("bandwidth").text();
		_w4netFreq = $(this).find("frequency").text();
		//add tanggw 2012/8/13 reason bug3951 and 3796 maxClient
		gMaxClient = $(this).find("max_clients").text();
		gWebMaxClient = $(this).find("web_max_clients").text();
		_w4WlanLteEnable = $(this).find("lte_wifi_enable").text();
		_w4wifi_version = $(this).find("wifi_version").text();
		_w4device_type = $(this).find("device_type").text();
		_w4WalnBandwidthMode = $(this).find("waln_bandwidth_mode").text();
	    _multi_show_state = $(this).find("show_state").text();

	});
	var index = 0;
	_w4controlMapNwOld = g_objXML.putMapElement(_w4controlMapNwOld, index++, "RGW/wlan_settings/wlan_enable", _w4netEnable);//[0][1]
	_w4controlMapNwOld = g_objXML.putMapElement(_w4controlMapNwOld, index++, "RGW/wlan_settings/net_mode", _w4netMode);//[1][1]
	_w4controlMapNwOld = g_objXML.putMapElement(_w4controlMapNwOld, index++, "RGW/wlan_settings/channel", _w4netChannel);//[2][1]
	_w4controlMapNwOld = g_objXML.putMapElement(_w4controlMapNwOld, index++, "RGW/wlan_settings/bandwidth", _w4netBand);//[3][1]
	_w4controlMapNwOld = g_objXML.putMapElement(_w4controlMapNwOld, index++, "RGW/wlan_settings/frequency", _w4netFreq);//[4][1]
	_w4controlMapNwOld = g_objXML.putMapElement(_w4controlMapNwOld, index++, "RGW/wlan_settings/max_clients", gMaxClient);//[5][1]
	_w4controlMapNwOld = g_objXML.putMapElement(_w4controlMapNwOld, index++, "RGW/wlan_settings/web_max_clients", gWebMaxClient);//[6][1]
	_w4controlMapNwOld = g_objXML.putMapElement(_w4controlMapNwOld, index++, "RGW/wlan_settings/lte_wifi_enable", _w4WlanLteEnable);//[7][1]	
	_w4controlMapNwOld = g_objXML.putMapElement(_w4controlMapNwOld, index++, "RGW/wlan_settings/wlan_auto_disconnect", _w4WlanAutoDisconnect);//[8][1]
	_w4controlMapNwOld = g_objXML.putMapElement(_w4controlMapNwOld, index++, "RGW/wlan_settings/waln_bandwidth_mode", _w4WalnBandwidthMode);//[9][1]
	_w4controlMapNwNew = g_objXML.copyArray(_w4controlMapNwOld, _w4controlMapNwNew);
	displayWlanBasicData();
}
//根据xml内容刷新界面显示
function displayWlanBasicData(){
	//wifi device type not euqal RTL8189ES,hide this
    if(_w4wifi_version != 3 && !(_w4wifi_version == 4 &&  _w4device_type == 1)){
        $("#displaywlan_auto").hide();
    }
	if(_w4ChangeSecriteType == 1){
		return;
	}

	//显示最大连接数
	if(g_mp_switch == OTA_SELECT){
		for(var i=11;i<=32;i++){
			optionShow("optMax"+i);
		}			
	}else{
		if(gWebMaxClient > 32){
			gWebMaxClient = 32;
		}
		for(var i=32;i>gWebMaxClient;i--){
			optionHide("optMax"+i);	
		}	
	}
	//显示最大连接数当前设置最大连接数
	SetOptionValue("selMaxClient",gMaxClient);

	//设置WiFi_Bandwidth_Mode的值
	SetOptionValue("WiFiBandwidthMode",_w4WalnBandwidthMode);

	if(_w4netFreq == 0 && _w4netChannel == 0){
	    SetOptionValue("2GChannel",0);	
		$("#5GChannel").css("display","none");
		$("#2GChannel").css("display","block");	
	}else if(_w4netFreq == 1 && _w4netChannel == 0){	
	    SetOptionValue("5GChannel",0);	
		$("#5GChannel").css("display","block");
		$("#2GChannel").css("display","none");    
	}else{
		if(_w4netFreq == 1) {
			SetOptionValue("5GChannel",_w4netChannel);	
			$("#5GChannel").css("display","block");
			$("#2GChannel").css("display","none");
		}
		else { 
			SetOptionValue("2GChannel",_w4netChannel);	
			$("#5GChannel").css("display","none");
			$("#2GChannel").css("display","block");
		}		
	}

	//设置当前802.11模式值
	SetOptionValue("drpdwnMode",_w4netMode);	
	//判断当前802.11模式 802.11n(兼容模式) 或者 802.11n模式 显示带宽选择模式
	if(_w4netMode == 0 || _w4netMode == 2){
		$("#WiFiBandwidthMode").show();
		$("#lwifibandwidth").show();
	}else{
		$("#WiFiBandwidthMode").hide();
		$("#lwifibandwidth").hide();
	}

	SetOptionValue("drpdwnFreq",(parseInt(_w4netFreq)+1));
	if(_w4netMode == 2){
		$("#frequency1").css("display","block");
		$("#frequency2").css("display","block");
	}else if(_w4netMode == 0 || _w4netMode == 1){
		$("#frequency1").css("display","block");
		$("#frequency2").css("display","none");	
	}else if(_w4netMode == 3 || _w4netMode == 4){
		$("#frequency1").css("display","none");
		$("#frequency2").css("display","block");
	}
	
	changeBand();

	SetOptionValue("drpdwnBand",_w4netBand);
	//无线局域网 1-开启 0-关闭
	if (_w4netEnable == 1) {
		setCheckboxsValue("simple_network",1);
		$("#w4tr1").show();
		$("#w4tr2").show();
		$("#w4tr3").show();
		$("#w4tr4").show();
		$("#tbWlanAdvancedSet").show();

        if(_multi_show_state == 1){
            $("#w4tr5").show();
            $("#w4tr_multiSSIDradiolist").show();
        }
	   
	    if (_w4multiSSID == 1){
			$("#w4tr_multiSSIDradiolist").show();
			$("#w4tr6").show();
			$("#w4tr7").show();
			$("#w4tr8").show();
		}
	}else {
        setCheckboxsValue("simple_network",0);
		$("#w4tr1").hide();
		$("#w4tr2").hide();
		$("#w4tr3").hide();
		$("#w4tr4").hide();
		$("#w4tr5").hide();
		$("#w4tr6").hide();
		$("#w4tr7").hide();
		$("#w4tr8").hide();
	    $("#tbWlanAdvancedSet").hide();
	    $("#w4tr_multiSSIDradiolist").hide();
	}
	
	//LTE干扰 1-开启 0-关闭
	if(_w4WlanLteEnable == "1"){
		SetOptionValue("iLteWlanEnable",1);
	}else{
		SetOptionValue("iLteWlanEnable",0);
	}	
}
//WALN自动关闭设置信息
function get_wlan_auto_disconnect_data(data){
	//wifi芯片型号为RTL8189ES
    if(3 == _w4wifi_version || 4 == _w4wifi_version) {
        var xmlData = data;
        $(xmlData).find("wlan_auto").each(function (){
            _w4WlanAutoDisconnect = $(this).find("wlan_auto_disconnect").text();
            _w4timeset = $(this).find("time_set").text();
        });
        display_wlan_auto_disconnect_data();
    }
}
//WALN自动关闭设置信息显示函数
function display_wlan_auto_disconnect_data(){
    //wifi芯片型号为RTL8189ES
    if(3 == _w4wifi_version || 4 == _w4wifi_version){
    	//开启
        if(1 == _w4WlanAutoDisconnect){
        	setCheckboxsValue("wlan_autoloader_checkbox",1);        
            if(10 == _w4timeset){
            	SetOptionValue("dropdowntime",1);
            }else if(20 == _w4timeset){
            	SetOptionValue("dropdowntime",2);
            }else if(30 == _w4timeset){
            	SetOptionValue("dropdowntime",3);
            }
            $("#timesetdisplay").show();
        }
        else{          
            setCheckboxsValue("wlan_autoloader_checkbox",0); 
            
            $("#timesetdisplay").hide();
        }
    }else{
        $("#timesetdisplay").hide();
    }
}
//WLAN安全信息
function getWlanSecurityData(data){
    _w4xmlData = data;

	var ver = g_objXML.getInternetExplorerVersion();
	if ( ver > -1 ){
		if (ver <= 9.0){
			_w4securityType = $(_w4xmlData).find("mode")[0].text;
		}
		else{
			_w4securityType = $(_w4xmlData).find("mode")[0].textContent.toString();
		}
	}else{
        _w4securityType = $(_w4xmlData).find("mode")[0].textContent.toString();
    }

	$(_w4xmlData).find("wlan_security").each(function (){
	    _w4strSSID = $(this).find("ssid").text();
		_w4apIsolate =$(this).find("ap_isolate").text();
	    _w4ssidBcast = $(this).find("ssid_bcast").text();
		g_carrieroperator_select = $(this).find("ssid_limit").text();
		
	});

	$(_w4xmlData).find("wlan_security_b").each(function (){
		_w4multisecurityType = $(this).find("mode_b").text();
	    _w4multistrSSID = $(this).find("ssid").text();
		_w4multiapIsolate =$(this).find("ap_isolate").text();
	    _w4multissidBcast = $(this).find("ssid_bcast").text();
		_w4multiSSID = $(this).find("multiSSID").text();
	});
	
	if(g_carrieroperator_select == TELECOM_SELECT){
		document.getElementById("w4tbSSID").maxLength = 13;
		$("#w4tbSSID").attr("title",jQuery.i18n.prop("lInvalidCharacter5"));
		$("#w4tbpass").attr("title",jQuery.i18n.prop("lInvalidCharacter6"));
		$("#w4tbpassText").attr("title",jQuery.i18n.prop("lInvalidCharacter6"));
		document.getElementById("w4tbmultiSSID").maxLength = 13;
		$("#w4tbmultiSSID").attr("title",jQuery.i18n.prop("lInvalidCharacter5"));
		$("#multiw4tbpass").attr("title",jQuery.i18n.prop("lInvalidCharacter6"));
		$("#multiw4tbpassText").attr("title",jQuery.i18n.prop("lInvalidCharacter6"));
	}else{
		document.getElementById("w4tbSSID").maxLength = 32;
		document.getElementById("w4tbmultiSSID").maxLength = 32;
	}
		
	switch (_w4securityType)
	{
        case 'WPA2-PSK':
		case 'WPA-PSK':
		case 'Mixed':
		{
		    w4loadWPAData(_w4securityType);
            break;
        }
        case 'None':
        {
            w4loadDisabledData();
            break;
        }
        case 'WEP':
		{
		    w4loadWEPData(_w4securityType);
			break;
        }
  		case 'WAPI-PSK':
		{
		    w4loadWAPI_PSKData(_w4securityType);
            break;
        }
    }
	switch (_w4multisecurityType)
	{
        case 'WPA2-PSK':
		case 'WPA-PSK':
		case 'Mixed':
		{
		    w4multiloadWPAData(_w4multisecurityType);
            break;
        }
        case 'None':
        {
            w4multiloadDisabledData(_w4multisecurityType);
            break;
        }
        case 'WEP':
		{
		    w4multiloadWEPData(_w4multisecurityType);
			break;
        }
  		case 'WAPI-PSK':
		{
		    w4multiloadWAPI_PSKData(_w4multisecurityType);
            break;
        }
    }
	_w4controlMapCurrent = g_objXML.copyArray(_w4controlMapExisting,_w4controlMapCurrent);	
	_w4multicontrolMapCurrent = g_objXML.copyArray(_w4multicontrolMapExisting,_w4multicontrolMapCurrent);
	
	displayWlanSecurityData(); 
}
//WLAN安全信息 显示函数
function displayWlanSecurityData(){
    $("#w4tbSSID").val(_w4strSSID);
	if(_w4ChangeSecriteType == 1){
		return;
	}
    displayIsolate(_w4apIsolate);
	displaySSIDBcast(_w4ssidBcast);
	displaymultissidswitch(_w4multiSSID);
	displayMultiSSID();

	setCheckboxsValue("w4chkUnmask",0);

	$("#w4tbpassText").hide();
	$("#w4tbpass").show();
	document.getElementById("w4tbpass").maxLength = 63;
	document.getElementById("w4tbpassText").maxLength = 63;
	$("#w4tbpass").val(_w4modeKey);
	$("#w4tbpassText").val(_w4modeKey);
    //L360产品型号
    if(g_product_name == PRODUCT_L360){
        $("#w4tbpassText").show();
        $("#w4tbpass").hide();  
    }
	if (_w4securityType == "Mixed") {
		SetOptionValue("drpdwnSecurityType","optMixed");
	}else if (_w4securityType == "None") {
	    SetOptionValue("drpdwnSecurityType","optNone");
	}else{
		SetOptionValue("drpdwnSecurityType",_w4securityType);
	}

	$("#pCipher").empty();
	$("#w4tdEncryptMode").hide();
	$("#w4tdSecurityType").hide();
	
    if (_w4netEnable == 1) {
    	$("#w4tr2").show();
    	$("#w4tr3").show();
    	$("#w4td1").show();
    	$("#drpdwnCipher").show();
    	$("#multidrpdwnCipher").show();
    }
	
    switch (_w4securityType) 
	{
        case 'WPA2-PSK':
        {
            $("#pCipher").append("<option value='AES-CCMP' id='AES-CCMP'>" + "AES-CCMP" + "</option>");
            SetOptionValue("drpdwnCipher","AES-CCMP");
            break;
        }
		case 'WPA-PSK':
		{
            $("#pCipher").append("<option value='TKIP' id='TKIP'>" + "TKIP" + "</option>");
            SetOptionValue("drpdwnCipher","TKIP");
			break;
		}
		case 'Mixed':
	    {           
	        $("#pCipher").append("<option value='AES-CCMP' id='AES-CCMP'>" + "WPA-TKIP/WPA2-AES" + "</option>");
	        SetOptionValue("drpdwnCipher","AES-CCMP");
			break;
		}
		case 'WEP':
		{
			$("#pCipher").append("<option value='bit64' id='bit64'>" + "64bit-5 ASCII/10Hex" + "</option>");
			$("#pCipher").append("<option value='bit128' id='bit128'>" + "128bit-13 ASCII/26Hex" + "</option>");
			if(_w4wepEncrypt == "0"){
				SetOptionValue("drpdwnCipher","bit64");
			}else{
				SetOptionValue("drpdwnCipher","bit128");
			}
			
			$("#w4tdSecurityType").show();
			if (_w4wepAuth == "Open") {
				SetOptionValue("w4tdSecurityType",1);
			}
			else {
				SetOptionValue("w4tdSecurityType",2);
			}
			document.getElementById("w4tbpass").maxLength = 26;
			document.getElementById("w4tbpassText").maxLength = 26;
			break;
		}
        case 'WAPI-PSK':
        {
            $("#pCipher").empty();
            $("#w4td1").hide();
            $("#drpdwnCipher").hide();
            $("#multidrpdwnCipher").hide();
			
			$("#w4tdEncryptMode").show();
			if (_w4wapiPskKeyType == "0") {
				SetOptionValue("w4tdEncryptMode",2);
			}else{
				SetOptionValue("w4tdEncryptMode",1);
			}
            break;
        }
		case 'None':
		{	
			$("#w4tr2").hide();	
			$("#w4tr3").hide();		
			break;
		}
    }
}
//多重网络模式 显示函数
function displayMultiSSID(){
	$("#w4tbmultiSSID").val(_w4multistrSSID);
	if(_w4multiChangeSecriteType == 1){
		return;
	}
	setCheckboxValue("w4chkmultiUnmask",0);
	$("#multiw4tbpassText").hide();
	$("#multiw4tbpass").show();
	document.getElementById("multiw4tbpass").maxLength = 63; 
	document.getElementById("multiw4tbpassText").maxLength = 63;
	$("#multiw4tbpass").val(_w4multimodeKey);
	$("#multiw4tbpassText").val(_w4multimodeKey);

    if(g_product_name == PRODUCT_L360){
        $("#multiw4tbpassText").show();
        $("#multiw4tbpass").hide();
    }

	if (_w4multisecurityType == "Mixed") {
		SetOptionValue("multidrpdwnSecurityType","moptMixed");
	}else if (_w4multisecurityType == "None") {
	    SetOptionValue("multidrpdwnSecurityType","moptNone");
	}else {
		var tmp_w4multisecurityType = "m"+_w4multisecurityType;
    	SetOptionValue("multidrpdwnSecurityType",tmp_w4multisecurityType);
	}

	$("#multipCipher").empty();
	$("#w4multiencryptMode").hide();
	$("#w4lSSID").text(jQuery.i18n.prop("w4lSSID"));

    if (_w4netEnable == 1) {
		if(_w4multiSSID == 1){
			$("#w4tr7").show();
			$("#w4tr8").show();
			$("#w4lSSID").text(jQuery.i18n.prop("primaryssid"));
		}else{
			$("#w4tr7").hide();
			$("#w4tr8").hide();			
			$("#w4lSSID").text(jQuery.i18n.prop("w4lSSID")); 
		}
	}else{
		$("#w4tr7").hide();
		$("#w4tr8").hide();			 
		$("#w4lSSID").text(jQuery.i18n.prop("w4lSSID"));
	}

    switch (_w4multisecurityType) 
	{
        case 'WPA2-PSK':
        {
            $("#multipCipher").append("<option value='mAES-CCMP' id='mAES-CCMP'>" + "AES-CCMP" + "</option>");
            SetOptionValue("multidrpdwnCipher","mAES-CCMP");
            break;
        }
		case 'WPA-PSK':
		{
            $("#multipCipher").append("<option value='mTKIP' id='mTKIP'>" + "TKIP" + "</option>");
            SetOptionValue("multidrpdwnCipher","mTKIP");
			break;
		}
		case 'Mixed':
	    {           
	        $("#multipCipher").append("<option value='mAES-CCMP' id='mAES-CCMP'>" + "WPA-TKIP/WPA2-AES" + "</option>");
	        SetOptionValue("multidrpdwnCipher","mAES-CCMP");
			break;
		}
		case 'WEP':
		{
			$("#multipCipher").append("<option value='mbit64' id='mbit64'>" + "64bit-5 ASCII/10Hex" + "</option>");
			$("#multipCipher").append("<option value='mbit128' id='mbit128'>" + "128bit-13 ASCII/26Hex" + "</option>");
			if(_w4multiwepEncrypt == "0"){
				SetOptionValue("multidrpdwnCipher","mbit64");
			}else{
				SetOptionValue("multidrpdwnCipher","mbit128");
			}

			$("#multiw4tdSecurityType").show();
			if (_w4multiwepAuth == "Open") {
				SetOptionValue("multiw4tdSecurityType",1);
			}else {
				SetOptionValue("multiw4tdSecurityType",2);
			}
			document.getElementById("multiw4tbpass").maxLength = 26;
			document.getElementById("multiw4tbpassText").maxLength = 26;
			break;
		}
        case 'WAPI-PSK':
        {
            $("#multipCipher").empty();
			$("#w4multiencryptMode").show();
			if (_w4multiwapiPskKeyType == "0") {
				SetOptionValue("w4multiencryptMode",2);
				
			}else{
				SetOptionValue("w4multiencryptMode",1);
			}
            break;
        }
		case 'None':
		{	
			$("#w4tr7").hide();	
			$("#w4tr8").hide();	
			break;
		}
    }
}
<!-- ###############################WALN设置################################### -->
//初始化WLan设置显示文字
function initWlanPageWords(){
	$("#lWlanBasicSet").text(jQuery.i18n.prop("lwlanBaseSettingTitle"));
	$("#lNetwork").text(jQuery.i18n.prop("lNetwork"));
	$("#lmultiSSID").text(jQuery.i18n.prop("lmultiSSID"));
	$("#w4lSSID").text(jQuery.i18n.prop("SSIDNameTitle"));
	$("#lWireSecurity").text(jQuery.i18n.prop("lmultiWireSecurity"));
	$("#w4lpass").text(jQuery.i18n.prop("SSIDPasswordTitle"));
	$("#lwpa").text(jQuery.i18n.prop("lmultiwpa"));
	$("#lSSIDCast").text(jQuery.i18n.prop("lSSIDCast"));
	$("#lapIsolate").text(jQuery.i18n.prop("lapIsolate"));
	$("#w4lmultiSSID").text(jQuery.i18n.prop("ViceSSIDTitle"));
	$("#lmultiWireSecurity").text(jQuery.i18n.prop("lmultiWireSecurity"));
	$("#w4lmultipass").text(jQuery.i18n.prop("SSIDPasswordTitle"));
	$("#lmultiwpa").text(jQuery.i18n.prop("lmultiwpa"));
	$("#lWlanAdvancedSet").text(jQuery.i18n.prop("lwlanAdvancedSettingTitle"));
	$("#l80211_mode").text(jQuery.i18n.prop("l80211Mode"));
	$("#lChannel").text(jQuery.i18n.prop("lChannel"));
	$("#lFrequency").text(jQuery.i18n.prop("lFrequency"));
	$("#lBand").text(jQuery.i18n.prop("lBand"));
	$("#lMaxClient").text(jQuery.i18n.prop("lMaxClient"));
	$("#lLteWlanEnable").text(jQuery.i18n.prop("lLteWlanEnable"));
	$("#wlan_auto_disconnect_set").text(jQuery.i18n.prop("wlan_auto_disconnect_set"));
	$("#wlan_auto_disconnect").text(jQuery.i18n.prop("wlan_auto_disconnect"));
	$("#time_select").text(jQuery.i18n.prop("time_select"));
	$("#time10").text(jQuery.i18n.prop("time10"));
	$("#time20").text(jQuery.i18n.prop("time20"));
	$("#time30").text(jQuery.i18n.prop("time30"));
	$("#SecurityOpen").text(jQuery.i18n.prop("LabelOpen"));
	$("#SecurityShared").text(jQuery.i18n.prop("LabelShared"));
	$("#multiSecurityOpen").text(jQuery.i18n.prop("LabelOpen"));
	$("#multiSecurityShared").text(jQuery.i18n.prop("LabelShared"));

	$("#opt80211bgn").text(jQuery.i18n.prop("opt80211bgn"));
	$("#opt80211").text(jQuery.i18n.prop("opt80211"));
	$("#opt80211n").text(jQuery.i18n.prop("opt80211n"));
	$("#opt80211a").text(jQuery.i18n.prop("opt80211a"));
	$("#opt80211an").text(jQuery.i18n.prop("opt80211an"));
	$("#opt80211b").text(jQuery.i18n.prop("opt80211b"));
	$("#opt80211g").text(jQuery.i18n.prop("opt80211g"));

	$("#optAutomatic").text(jQuery.i18n.prop("optAutomatic"));
	$("#optChannel1").text(jQuery.i18n.prop("optChannel1"));
	$("#optChannel2").text(jQuery.i18n.prop("optChannel2"));
	$("#optChannel3").text(jQuery.i18n.prop("optChannel3"));
	$("#optChannel4").text(jQuery.i18n.prop("optChannel4"));
	$("#optChannel5").text(jQuery.i18n.prop("optChannel5"));
	$("#optChannel6").text(jQuery.i18n.prop("optChannel6"));
	$("#optChannel7").text(jQuery.i18n.prop("optChannel7"));
	$("#optChannel8").text(jQuery.i18n.prop("optChannel8"));
	$("#optChannel9").text(jQuery.i18n.prop("optChannel9"));
	$("#optChannel10").text(jQuery.i18n.prop("optChannel10"));
	$("#optChannel11").text(jQuery.i18n.prop("optChannel11"));
	$("#optChannel12").text(jQuery.i18n.prop("optChannel12"));
	$("#optChannel13").text(jQuery.i18n.prop("optChannel13"));
	$("#optChannel149").text(jQuery.i18n.prop("optChannel149"));
	$("#optChannel153").text(jQuery.i18n.prop("optChannel153"));
	$("#optChannel157").text(jQuery.i18n.prop("optChannel157"));
	$("#optChannel161").text(jQuery.i18n.prop("optChannel161"));

	$("#frequency1").text(jQuery.i18n.prop("frequency1"));
	$("#frequency2").text(jQuery.i18n.prop("frequency2"));

	$("#band0").text(jQuery.i18n.prop("band0"));
	$("#band1").text(jQuery.i18n.prop("band1"));
	$("#band2").text(jQuery.i18n.prop("band2"));

	$("#optNone").text(jQuery.i18n.prop("optNone"));
	$("#optMixed").text(jQuery.i18n.prop("optMixed"));
	$("#moptNone").text(jQuery.i18n.prop("optNone"));
	$("#moptMixed").text(jQuery.i18n.prop("optMixed"));
	$("#5GAuto").text(jQuery.i18n.prop("5GAuto"));

	$("#WiFiBandwidthMode20M").text(jQuery.i18n.prop("WiFiBandwidthMode20M"));
	$("#WiFiBandwidthMode40M").text(jQuery.i18n.prop("WiFiBandwidthMode40M"));
	$("#WiFiBandwidthModeAuto").text(jQuery.i18n.prop("WiFiBandwidthModeAuto"));
	$("#lwifibandwidth").text(jQuery.i18n.prop("lwifibandwidth"));

	$("#LteWlanEnableClose").text(jQuery.i18n.prop("LteWlanEnableClose"));
	$("#LteWlanEnableOpen").text(jQuery.i18n.prop("LteWlanEnableOpen"));

	//下拉框
	initOptionsChangedSecuritySetting("drpdwnSecurityType");
	initOptionsMultichangedSecuritySetting("multidrpdwnSecurityType");
	initOptionsChangedDefaltPasswd("drpdwnCipher");
	initOptionsMultichangedDefaltPasswd("multidrpdwnCipher");
	initOptionsChangeFreq("drpdwnMode");
	initOptionsChangeChannel("drpdwnFreq");
	initOptions("w4tdEncryptMode");
	initOptions("w4tdSecurityType");
	initOptions("w4multiencryptMode");
	initOptions("multiw4tdSecurityType");
	initOptions("2GChannel");
	initOptions("5GChannel");
	initOptions("drpdwnBand");
	initOptions("selMaxClient");
	initOptions("iLteWlanEnable");
	initOptions("dropdowntime");
	initOptions("WiFiBandwidthMode");

	//初始化选中按钮
	initCheckboxs("simple_network");
	initCheckboxs("multiple_network");
	initCheckboxs("radioCast");
	initCheckboxs("radioapIsolate");
	initCheckboxs("wlan_autoloader_checkbox");
}

function changeBand(){
	if(GetOptionsValue("drpdwnFreq") == 1){
		$("#band1").css("display","block");
		$("#band2").css("display","none");
		SetOptionValue("drpdwnBand",1);
		
		if(GetOptionsValue("drpdwnMode") == 1){
			$("#band0").css("display","none");
		}else if(GetOptionsValue("drpdwnMode") == 0){
			$("#band0").css("display","block");	
		}
	}else if(GetOptionsValue("drpdwnFreq") == 2){
		$("#band1").css("display","block");
		$("#band2").css("display","none");
		SetOptionValue("drpdwnBand",1);

		if(GetOptionsValue("drpdwnMode") == 3){
			$("#band0").css("display","none");
		}else if(GetOptionsValue("drpdwnMode") == 4){
			$("#band0").css("display","block");
		}
	}

	if(GetOptionsValue("drpdwnMode") == 2){
		$("#band1").css("display","block");
		$("#band2").css("display","block");
		$("#band0").css("display","block");
		SetOptionValue("drpdwnBand",1);	
	}
}

function changedSecuritySetting(){
    var value = GetOptionsValue("drpdwnSecurityType");
	if(value != _w4securityType){
		_w4ChangeSecriteType = 1;
	}else{
		_w4ChangeSecriteType = 0;
	}
   
    _w4controlMapExisting = null;
    _w4controlMapCurrent = null;
    _w4controlMapExisting = new Array(0);
    _w4controlMapCurrent = new Array(0);
    setCheckboxValue("w4chkUnmask",0);
    $("#w4tbpassText").hide();
    $("#w4tbpass").show();
    document.getElementById("w4tbpass").maxLength = 63;
    document.getElementById("w4tbpassText").maxLength = 63;
    $("#pCipher").empty();
	$("#w4tdEncryptMode").hide();
	$("#w4tdSecurityType").hide();
	$("#w4tr2").show();
	$("#w4tr3").show();
	$("#w4td1").show();

	$("#multidrpdwnCipher").show();
    $("drpdwnCipher").show();

	switch(value)
	{
        case 'WPA2-PSK':
        {
            w4loadWPAData(value);
            $("#pCipher").append("<option value='AES-CCMP' id='AES-CCMP'>" + "AES-CCMP" + "</option>");
            SetOptionValue("drpdwnCipher","AES-CCMP");
            break;
        }
		case 'WPA-PSK':
		{
		    w4loadWPAData(value);
            $("#pCipher").append("<option value='TKIP' id='TKIP'>" + "TKIP" + "</option>");
            SetOptionValue("drpdwnCipher","TKIP");
			break;
		}
        case 'optMixed':
		{
		    w4loadWPAData("Mixed");
		    $("#pCipher").append("<option value='AES-CCMP' id='AES-CCMP'>" + "WPA-TKIP/WPA2-AES" + "</option>");
		    SetOptionValue("drpdwnCipher","AES-CCMP");
			break;
        }
		case 'WEP':
        {
            if (_w4netMode == 0 || _w4netMode == 2) {
                open_dialog_info(jQuery.i18n.prop("lnoWEPfor11n"));
                if (_w4securityType == "Mixed") {
                	SetOptionValue("drpdwnSecurityType","optMixed");
                }else if (_w4securityType == "None") {
                    SetOptionValue("drpdwnSecurityType","optNone");
                }else {
                    SetOptionValue("drpdwnSecurityType",_w4securityType);
                }
                if (_w4securityType != "WEP") {
                    changedSecuritySetting();
                }
                return;
            }
            $("#pCipher").append("<option value='bit64' id='bit64'>" + "64bit-5 ASCII/10Hex" + "</option>");
            $("#pCipher").append("<option value='bit128' id='bit128'>" + "128bit-13 ASCII/26Hex" + "</option>");

            if (_w4wepEncrypt == "0") {
            	SetOptionValue("drpdwnCipher","bit64");
            }else {
                SetOptionValue("drpdwnCipher","bit128");
            }

            $("#w4tdSecurityType").show();
            if (_w4wepAuth == "Open") {
            	SetOptionValue("w4tdSecurityType",1);
            }else{
                SetOptionValue("w4tdSecurityType",2);
            }
            w4loadWEPData(value);
            document.getElementById("w4tbpass").maxLength = 26;
            document.getElementById("w4tbpassText").maxLength = 26;

            break;
        }
  		case 'WAPI-PSK':
		{
			w4loadWAPI_PSKData(value);
			$("#pCipher").empty();
			$("#w4td1").hide();
			$("#drpdwnCipher").hide();
			$("#multidrpdwnCipher").hide();
			
			$("#w4tdEncryptMode").show();
			if (_w4wapiPskKeyType == "0") {
				SetOptionValue("w4tdEncryptMode",2);
			}else{
				SetOptionValue("w4tdEncryptMode",1);
			}
            break;
        }
        case 'optNone':
		{
		    w4loadDisabledData();		
			$("#w4tr2").hide();
			$("#w4tr3").hide();
			break;
		}
    }

    _w4controlMapCurrent = g_objXML.copyArray(_w4controlMapExisting, _w4controlMapCurrent);

	var pageSecurityType = GetOptionsValue("drpdwnSecurityType");
	if((pageSecurityType == "optMixed" && _w4securityType == "Mixed") || pageSecurityType == _w4securityType){
    	$("w4tbpass").val(_w4modeKey);
    	$("#w4tbpassText").val(_w4modeKey);
	}else{
		$("#w4tbpass").val("");
		$("#w4tbpassText").val("");
	}
}

function w4loadWPAData(type){
    $(_w4xmlData).find(type).each(function ()
	{
	    _w4modeKey = $(this).find("key").text();
        _w4cipherType=$(this).find("mode").text();
    });	
    
    var index=0;
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/ssid", _w4strSSID);
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/ssid_bcast", _w4ssidBcast);
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/ap_isolate", _w4apIsolate);
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/mode", _w4securityType);
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/" + type + "/key", _w4modeKey);
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/" + type +"/mode",_w4cipherType);  
}

function w4loadWEPData(type){
    $(_w4xmlData).find("WEP").each(function ()
	{
	    _w4modeKey = $(this).find("key1").text();
        _w4wepAuth=$(this).find("auth").text();
        _w4wepEncrypt=$(this).find("encrypt").text();
    });
    
    var index=0;
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/ssid", _w4strSSID);
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/ssid_bcast", _w4ssidBcast);
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/ap_isolate", _w4apIsolate);
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/mode", _w4securityType);
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/" + type + "/key1", _w4modeKey);
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/" + type + "/auth", _w4wepAuth);
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/" + type + "/encrypt",_w4wepEncrypt);
}

function w4loadWAPI_PSKData(type){
    $(_w4xmlData).find("WAPI-PSK").each(function ()
	{
    	_w4wapiPskKeyType=$(this).find("key_type").text();
    	_w4modeKey = $(this).find("key").text();
    });
    var index=0;
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/ssid", _w4strSSID);
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/ssid_bcast", _w4ssidBcast);
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/ap_isolate", _w4apIsolate);
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/mode", _w4securityType);
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/" + type + "/key", _w4modeKey);
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/" + type + "/key_type", _w4wapiPskKeyType);
}

function checkSSIDLimit(obj){
	if(g_carrieroperator_select == TELECOM_SELECT){
		var prefix = "ChinaNet-";
		var objValue = obj.value;
		$("#w4tbSSID").val(prefix+objValue.substr(prefix.length,4));
	}
}
function w4loadDisabledData(){
    var index=0;
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/ssid", _w4strSSID);
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/ssid_bcast", _w4ssidBcast);
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/ap_isolate", _w4apIsolate);
    _w4controlMapExisting = g_objXML.putMapElement(_w4controlMapExisting, index++, "RGW/wlan_security/mode", _w4securityType);
}

function multichangedSecuritySetting(){
	var value = GetOptionsValue("multidrpdwnSecurityType");
	if(value != _w4multisecurityType){
		_w4multiChangeSecriteType = 1;
	}else{
		_w4multiChangeSecriteType = 0;
	}
    
    _w4multicontrolMapExisting = null;
    _w4multicontrolMapCurrent = null;
    _w4multicontrolMapExisting = new Array(0);
    _w4multicontrolMapCurrent = new Array(0);
    setCheckboxValue("w4chkmultiUnmask",0);
    $("#multiw4tbpassText").hide();
    $("#multiw4tbpass").show();
    document.getElementById("multiw4tbpass").maxLength = 63;
    document.getElementById("multiw4tbpassText").maxLength = 63;
    $("#multipCipher").empty();
	$("#multiw4tdSecurityType").hide();
	$("#w4tr7").show();
	$("#w4tr8").show();
	switch(value)
	{
        case 'mWPA2-PSK':
        {
			value = value.substr(1);
            w4multiloadWPAData(value);
            $("#multipCipher").append("<option value='mAES-CCMP' id='mAES-CCMP'>" + "AES-CCMP" + "</option>");
            SetOptionValue("multidrpdwnCipher","mAES-CCMP");
            break;
        }
		case 'mWPA-PSK':
		{
			value = value.substr(1);
		    w4multiloadWPAData(value);
            $("#multipCipher").append("<option value='mTKIP' id='mTKIP'>" + "TKIP" + "</option>");
           	SetOptionValue("multidrpdwnCipher","mTKIP");
			break;
		}
        case 'moptMixed':
		{
		    value = value.substr(1);
		    w4multiloadWPAData("Mixed");
		    $("#multipCipher").append("<option value='mAES-CCMP' id='mAES-CCMP'>" + "WPA-TKIP/WPA2-AES" + "</option>");
		    SetOptionValue("multidrpdwnCipher","mAES-CCMP");
			break;
        }
		case 'mWEP':
        {
			value = value.substr(1);
            if ( _w4multinetMode == 2) {
                open_dialog_info(jQuery.i18n.prop("lnoWEPfor11n"));
                if (_w4multisecurityType == "Mixed") {
                	SetOptionValue("multidrpdwnSecurityType","moptMixed");
                }else if (_w4multisecurityType == "None") {
                	SetOptionValue("multidrpdwnSecurityType","moptNone");
                }else {
                	var tmp_w4securityType= "m" + _w4securityType;
                	SetOptionValue("multidrpdwnSecurityType",tmp_w4securityType);
                }
                if (_w4multisecurityType != "WEP") {
                    multichangedSecuritySetting();
                }
                return;
            }
          
            $("#multipCipher").append("<option value='mbit64' id='mbit64'>" + "64bit-5 ASCII/10Hex" + "</option>");
            $("#multipCipher").append("<option value='mbit128' id='mbit128'>" + "128bit-13 ASCII/26Hex" + "</option>");   
            
			if (_w4multiwepEncrypt == "0") {
				SetOptionValue("multidrpdwnCipher","mbit64");
            }else {
            	SetOptionValue("multidrpdwnCipher","mbit128");
            }
            $("#multiw4tdSecurityType").show();
            if (_w4multiwepAuth == "Open") {
            	SetOptionValue("multiw4tdSecurityType",1);

            }else {
                SetOptionValue("multiw4tdSecurityType",2);
            }
            w4multiloadWEPData(value);
            document.getElementById("multiw4tbpass").maxLength = 26;
            document.getElementById("multiw4tbpassText").maxLength = 26;
            break;
        }
  		case 'mWAPI-PSK':
		{
			value = value.substr(1);
			w4multiloadWAPI_PSKData(value);
			$("#multipCipher").empty();
            break;
        }
        case 'moptNone':
		{
		    w4multiloadDisabledData();
			$("#w4tr7").hide();
			$("#w4tr8").hide();
			break;
		}
    }
    
	var pageSecurityType = GetOptionsValue("multidrpdwnSecurityType");
	if((pageSecurityType == "moptMixed" && _w4multisecurityType == "Mixed") || pageSecurityType == ("m"+_w4multisecurityType)){
    	$("#multiw4tbpass").val(_w4multimodeKey);
    	$("#multiw4tbpassText").val(_w4multimodeKey);
	}else{
		$("#multiw4tbpass").val("");
		$("#multiw4tbpassText").val("");
	}
}

function w4multiloadWPAData(type){
	type = type+"_b";
    $(_w4xmlData).find(type).each(function ()
	{
	    _w4multimodeKey = $(this).find("key").text();
        _w4multicipherType=$(this).find("mode").text();
    });	
    var index=0;
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/ssid", _w4multistrSSID);
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/ssid_bcast", _w4multissidBcast);
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/ap_isolate", _w4multiapIsolate);
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/mode_b", _w4multisecurityType);
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/" + type + "/key", _w4multimodeKey);
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/" + type +"/mode",_w4multicipherType);  
	_w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/"+"multiSSID",_w4multiSSID); 
}

function w4multiloadWEPData(type){
	type = type+"_b";
    $(_w4xmlData).find(type).each(function ()
	{
	    _w4multimodeKey = $(this).find("key1").text();
        _w4multiwepAuth=$(this).find("auth").text();
        _w4multiwepEncrypt=$(this).find("encrypt").text();
    });
    var index=0;
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/ssid", _w4multistrSSID);
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/ssid_bcast", _w4multissidBcast);
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/ap_isolate", _w4multiapIsolate);
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/mode_b", _w4multisecurityType);
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/" + type + "/key1", _w4multimodeKey);
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/" + type + "/auth", _w4multiwepAuth);
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/" + type + "/encrypt",_w4multiwepEncrypt);
	_w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/"+"multiSSID",_w4multiSSID); 
}

function w4multiloadWAPI_PSKData(type){
	type = type+"_b"
    $(_w4xmlData).find(type).each(function (){
    	_w4multiwapiPskKeyType=$(this).find("key_type").text();
    	_w4multimodeKey = $(this).find("key").text();
    });
    var index=0;
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/ssid", _w4multistrSSID);
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/ssid_bcast", _w4multissidBcast);
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/ap_isolate", _w4multiapIsolate);
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/mode", _w4multisecurityType);
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/" + type + "/key", _w4multimodeKey);
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/" + type + "/key_type", _w4multiwapiPskKeyType);
	_w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/"+"multiSSID",_w4multiSSID); 
}

function w4multiloadDisabledData(){
    var index=0;
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/ssid", _w4multistrSSID);
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/ssid_bcast", _w4multissidBcast);
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/ap_isolate", _w4multiapIsolate);
    _w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/mode_b", _w4multisecurityType);
	_w4multicontrolMapExisting = g_objXML.putMapElement(_w4multicontrolMapExisting, index++, "RGW/wlan_security_b/"+"multiSSID",_w4multiSSID); 
}

function changedDefaltPasswd(){
    if (_w4securityType == "WEP") {
        if (_w4wepEncrypt == 0) {
            if (GetOptionsValue("drpdwnCipher") == "bit128") {
                $("#w4tbpass").val("1234567890123");
                $("#w4tbpassText").val("1234567890123");
            } else if (GetOptionsValue("drpdwnCipher") == "bit64") {
                $("#w4tbpass").val(_w4modeKey);
                $("#w4tbpassText").val(_w4modeKey);
            }
        } else {
            if (GetOptionsValue("drpdwnCipher") == "bit64") {
                $("#w4tbpass").val("12345");
                $("#w4tbpassText").val("12345");
            } else if (GetOptionsValue("drpdwnCipher") == "bit128") {
                $("#w4tbpass").val(_w4modeKey);
                $("#w4tbpassText").val(_w4modeKey);
            }
        }
    } else {    
        if (_w4wepEncrypt == 1) {
            if (GetOptionsValue("drpdwnCipher") == "bit128") {
                $("#w4tbpass").val("1234567890123");
                $("#w4tbpassText").val("1234567890123");
            } else if (GetOptionsValue("drpdwnCipher") == "bit64") {
                $("#w4tbpass").val("12345");
                $("#w4tbpassText").val("12345");
            }
        } else {
            if (GetOptionsValue("drpdwnCipher") == "bit64") {
                $("#w4tbpass").val("12345");
                $("#w4tbpassText").val("12345");
            } else if (GetOptionsValue("drpdwnCipher") == "bit128") {
                $("#w4tbpass").val("1234567890123");
                $("#w4tbpassText").val("1234567890123");
            }
        }
    }
}

function multichangedDefaltPasswd(){
    if (_w4multisecurityType == "WEP") {
        if (_w4multiwepEncrypt == 0) {
            if (GetOptionsValue("multidrpdwnCipher") == "mbit128") {
                $("#multiw4tbpass").val("1234567890123");
                $("#multiw4tbpassText").val("1234567890123");
            } else if (GetOptionsValue("multidrpdwnCipher") == "mbit64") {
                $("#multiw4tbpass").val(_w4multimodeKey);
                $("#multiw4tbpassText").val(_w4multimodeKey);
            }
        } else {
            if (GetOptionsValue("multidrpdwnCipher") == "mbit64") {
                $("#multiw4tbpass").val("12345");
                $("#multiw4tbpassText").val("12345");
            } else if (GetOptionsValue("multidrpdwnCipher") == "mbit128") {
                $("#multiw4tbpass").val(_w4multimodeKey);
                $("#multiw4tbpassText").val(_w4multimodeKey);
            }
        }
    } else {   
        if (_w4wepEncrypt == 1) {
            if (GetOptionsValue("multidrpdwnCipher") == "mbit128") {
                $("#multiw4tbpass").val("1234567890123");
                $("#multiw4tbpassText").val("1234567890123");
            } else if (GetOptionsValue("multidrpdwnCipher") == "mbit64") {
                $("#multiw4tbpass").val("12345");
                $("#multiw4tbpassText").val("12345");
            }
        } else {
            if (GetOptionsValue("multidrpdwnCipher") == "mbit64") {
                $("#multiw4tbpass").val("12345");
                $("#multiw4tbpassText").val("12345");
            } else if (GetOptionsValue("multidrpdwnCipher") == "mbit128") {
                $("#multiw4tbpass").val("1234567890123");
                $("#multiw4tbpassText").val("1234567890123");
            }
        }
    }
}

function changeFreq(){
	if(GetOptionsValue("drpdwnMode") == 0 || GetOptionsValue("drpdwnMode") == 1){
		$("#frequency1").css("display","block");
		$("#frequency2").css("display","none");
		SetOptionValue("drpdwnFreq",1);
	}else if(GetOptionsValue("drpdwnMode") == 3 || GetOptionsValue("drpdwnMode") == 4){
		$("#frequency1").css("display","none");
		$("#frequency2").css("display","block");
		SetOptionValue("drpdwnFreq",2);		
	}else if(GetOptionsValue("drpdwnMode") == 2){
		$("#frequency1").css("display","block");
		$("#frequency2").css("display","block");
		SetOptionValue("drpdwnFreq",1);
	}
	changeChannel();
	changeBand();

	//判断当前802.11模式 802.11n(兼容模式) 或者 802.11n模式 显示带宽选择模式
	if(GetOptionsValue("drpdwnMode") == 0 || GetOptionsValue("drpdwnMode") == 2){
		$("#WiFiBandwidthMode").show();
		$("#lwifibandwidth").show();
	}else{
		$("#WiFiBandwidthMode").hide();
		$("#lwifibandwidth").hide();
	}
}

function changeChannel(){
	if(GetOptionsValue("drpdwnFreq") == 1){
		$("#5GChannel").css("display","none");
		$("#2GChannel").css("display","block");
		if(_w4netChannel > 0 && _w4netChannel <= 13){     
			SetOptionValue("2GChannel",_w4netChannel);
		}else{
			SetOptionValue("2GChannel",0);	
		}
	}else{
		$("#5GChannel").css("display","block");
		$("#2GChannel").css("display","none");

		if(_w4netChannel >= 149 && _w4netChannel <= 161){
			SetOptionValue("5GChannel",_w4netChannel);
		}else{
			SetOptionValue("5GChannel",0);	  
		} 		
	}	
	changeBand();
}

function displayIsolate(ap_isolate){
	if(ap_isolate == 1){
		setCheckboxsValue("radioapIsolate",1);
	}else{
		setCheckboxsValue("radioapIsolate",0);
	}
}

function displaySSIDBcast(isVisable){
    if (isVisable == 1) {
    	setCheckboxsValue("radioCast",1);
	}else{
		setCheckboxsValue("radioCast",0);
	}
}

function displaymultissidswitch(mswitch){
	if(mswitch == 1){
		setCheckboxsValue("multiple_network",1);
		$("#w4tr6").show();
		$("#w4tr7").show();
		$("#w4tr8").show();
	}else{
		setCheckboxsValue("multiple_network",0);
		$("#w4tr6").hide();
		$("#w4tr7").hide();
		$("#w4tr8").hide();
	}
}

//无线局域网开启
function EDWirelessNW_Enable(){
	var EDWireless = getCheckboxsValue("simple_network");
	if(EDWireless == 1){
		return;
	}
	$("#w4tr1").show(); 
	if (_w4securityType != "None") {
	    $("#w4tr2").show(); 
	    $("#w4tr3").show(); 
	}

	if (getCheckboxsValue("multiple_network") == 1){
		$("#w4tr6").show();
		if (GetOptionsValue("multidrpdwnSecurityType") == "moptNone"){
			$("#w4tr7").show();
			$("#w4tr8").show();
		}
	}
   
    if( _multi_show_state == 1 ){
        $("#w4tr_multiSSIDradiolist").show(); 
        $("#w4tr5").show(); 
    }	
    
    $("#w4tr4").show(); 
	$("#tbWlanAdvancedSet").show(); 
}
//无线局域网关闭
function EDWirelessNW_Disable(){
	var EDWireless = getCheckboxsValue("simple_network");
	if(EDWireless == 0){
		return;
	}
	$("#w4tr1").hide();
	$("#w4tr2").hide();
	$("#w4tr3").hide();
	$("#w4tr4").hide();
	$("#w4tr5").hide();
	$("#w4tr6").hide();
	$("#w4tr7").hide();
	$("#w4tr8").hide();

	$("#tbWlanAdvancedSet").hide();
	$("#w4tr_multiSSIDradiolist").hide();
	displaySSIDBcast(_w4ssidBcast);
	displayIsolate(_w4apIsolate);
	if(g_carrieroperator_select != TELECOM_SELECT){ 
		if(_w4netEnable == 1){
		  setCheckboxsValue("radioCast",1);
		}
	}
}

//多重网络名称开启
function EDmultiSSID_Enable(){
	var EDmultiSSID = getCheckboxsValue("multiple_network");
	if(EDmultiSSID == 1){
		return;
	}
	$("#w4tr6").show();
	if(GetOptionsValue("multidrpdwnSecurityType") != "moptNone"){
		$("#w4tr7").show();
		$("#w4tr8").show();
	}
	$("#w4lSSID").text(jQuery.i18n.prop("primaryssid"));
}
//多重网络名称关闭
function EDmultiSSID_Disable(){
	var EDmultiSSID = getCheckboxsValue("multiple_network");
	if(EDmultiSSID == 0){
		return;
	}
	$("#w4tr6").hide();
	$("#w4tr7").hide();
	$("#w4tr8").hide();
	$("#w4lSSID").text(jQuery.i18n.prop("w4lSSID"));
}

//自动卸载WIFI开关状态设置
function open_wlan_auto_switch(){
	var wlanautoswitch = getCheckboxsValue("wlan_autoloader_checkbox");
	if(wlanautoswitch == 1){
		return;
	}
	_w4WlanAutoDisconnect = 1;
    if(_w4timeset == 0){
        SetOptionValue("dropdowntime",1);
        _w4timeset = 10;
    }
    $("#timesetdisplay").show();
}
function close_wlan_auto_switch(){
	var wlanautoswitch = getCheckboxsValue("wlan_autoloader_checkbox");
	if(wlanautoswitch == 0){
		return;
	}
	 _w4WlanAutoDisconnect = 0;        
    $("#timesetdisplay").hide();
}

function w4showHidemultiPassword(){
	var strPass = '';
    if(getCheckboxValue("w4chkmultiUnmask") == 1){      
		strPass = $("#multiw4tbpassText").val();
		$("#multiw4tbpass").show();
		$("#multiw4tbpassText").hide();
		$("#multiw4tbpass").val(strPass);
   	 }else{       
		strPass = $("#multiw4tbpass").val();
		$("#multiw4tbpassText").show();
		$("#multiw4tbpass").hide();
		$("#multiw4tbpassText").val(strPass);
    }
}

function w4showHidePassword(){
	var strPass = '';
    if(getCheckboxValue("w4chkUnmask") == 1){      
		strPass = $("#w4tbpassText").val();
		$("#w4tbpass").show();
		$("#w4tbpassText").hide();
		$("#w4tbpass").val(strPass);
   	 }else{       
		strPass = $("#w4tbpass").val();
		$("#w4tbpassText").show();
		$("#w4tbpass").hide();
		$("#w4tbpassText").val(strPass);
    }
}

//验证页面值的合法性，提交cgi处理
function PostWlanSecuritySet(){
	//获取无线局域网开关状态 0-关 1-开
    var pageNwEnable = getCheckboxsValue("simple_network");
	var index=0;
    var mapData = new Array(0);
    var mapdata2 = new Array(0);

    //判断开关状态是否改变了 修改状态和初始状态是否更改 只有更改了才提交修改
    if (pageNwEnable == 0 && pageNwEnable != _w4netEnable){
		// 网络关闭
	    mapData = putMapElement(mapData,"RGW/wlan_settings/wlan_enable",0,0);
		if(g_carrieroperator_select == TELECOM_SELECT){
			boxMBConfirmFactory(jQuery.i18n.prop("lCloseWifi"), jQuery.i18n.prop("lWarnCloseWifi"), function () {
				open_dialog_loading();
				$.cgi.postCmd("uapxb_wlan_basic_settings", mapData, successPostWlanSetting, failPostWlanSetting, 10000);
			});
		}else{
			open_dialog_loading();
			$.cgi.postCmd("uapxb_wlan_basic_settings", mapData, successPostWlanSetting, failPostWlanSetting, 10000);
		}
        return;
    }

    var pageMode = GetOptionsValue("drpdwnSecurityType"); 
    if (pageMode == "optNone"){
        pageMode = "None";
    }else if (pageMode == "optMixed"){
        pageMode = "Mixed";
    }
	var pageMode_b = GetOptionsValue("multidrpdwnSecurityType").substr(1);
    if (pageMode_b == "optNone"){
        pageMode_b = "None";
    }else if (pageMode_b == "optMixed"){
        pageMode_b = "Mixed";
    }
	var pageSSID = $("#w4tbSSID").val();
	var pageCastEnable = getCheckboxsValue("radioCast");
	var pageIsolateEnable = getCheckboxsValue("radioapIsolate");
	var pageModeKey = '';
	var pageChiperType = GetOptionsValue("drpdwnCipher");
	var pagewepAuth = (GetOptionsValue("w4tdSecurityType") == 1) ? 'Open' : 'Shared';
	var pagewapiPskKeyType = (GetOptionsValue("w4tdEncryptMode") == 2) ? '0' : '1';
	var pagewepEncrypt = '0';
	var pageSSID_b = $("#w4tbmultiSSID").val();
	var pageModeKey_b = '';

	if (pageMode_b != "None"){
		var pageChiperType_b = GetOptionsValue("multidrpdwnCipher").substr(1);
	}
	var pagewepAuth_b = (GetOptionsValue("multiw4tdSecurityType") == 1 ) ? 'Open' : 'Shared';
	var pagewapiPskKeyType_b = (GetOptionsValue("w4multiencryptMode") == 2 ) ? '0' : '1';
	var pagewepEncrypt_b = '0';
	var pagemultiSSID= getCheckboxsValue("multiple_network");

	if (pageMode != "None" && pageChiperType == null){
		open_dialog_info(jQuery.i18n.prop("EMPTY_CHIPERTYPE"));
        return false;
	}
	
	if(pageChiperType == "bit64"){
		pagewepEncrypt = "0";
	}else if(pageChiperType == "bit128"){
		pagewepEncrypt = "1";
	}
	
	if(getCheckboxValue("w4chkUnmask") == 1){
		pageModeKey = $("#w4tbpassText").val();
	}else{
		pageModeKey = $("#w4tbpass").val();
	}

    if(ModeToSecurityLimitConfirm(pageMode,0) == false){
        return;
    }

	if(pageChiperType_b == "bit64")
	{
		pagewepEncrypt_b = "0";
	}else if(pageChiperType_b == "bit128"){
		pagewepEncrypt_b = "1";
	}

	if(getCheckboxValue("w4chkmultiUnmask") == 1){
		pageModeKey_b = $("#multiw4tbpassText").val();
	}else{
		pageModeKey_b = $("#multiw4tbpass").val();
	}

	if(ModeToSecurityLimitConfirm(pageMode_b,1) == false){
		return;
	}
	
	if (isValidWlan(pageMode, pageSSID, pageModeKey, pagewepEncrypt, pagewapiPskKeyType, "w4Error", g_carrieroperator_select)){
	    //验证主SSID加密模式和加密算法
        if(false == WpsFunctionLimitConfirm(pageMode, pageChiperType,0)){
            return;
        }

		var index=0;
		_w4controlMapCurrent[index++][1] = pageSSID;
		_w4controlMapCurrent[index++][1] = pageCastEnable;
		_w4controlMapCurrent[index++][1] = pageIsolateEnable;
		_w4controlMapCurrent[index++][1] = pageMode;
		
	    switch(pageMode)
		{
	        case 'WPA2-PSK':
	        case 'Mixed':
			{
				_w4controlMapCurrent[index++][1] = pageModeKey;
				_w4controlMapCurrent[index++][1] = pageChiperType;
	            break;
	        }
            case 'WPA-PSK':
            {
				_w4controlMapCurrent[index++][1] = pageModeKey;
				_w4controlMapCurrent[index++][1] = pageChiperType;
	            break;
            }
	        case 'None':
	            break;
	        case 'WEP':
			{
	            _w4controlMapCurrent[index++][1] = pageModeKey;
	            _w4controlMapCurrent[index++][1] = pagewepAuth;
	            _w4controlMapCurrent[index++][1] = pagewepEncrypt;
	            break;
			}
	        case 'WAPI-PSK':
			{
				_w4controlMapCurrent[index++][1] = pageModeKey;
				_w4controlMapCurrent[index++][1] = pagewapiPskKeyType;
				break;
			}
	    }

		if((1 == _w4wifi_version)||(4 == _w4wifi_version)){
			if (isValidWlan(pageMode_b, pageSSID_b, pageModeKey_b, pagewepEncrypt_b, pagewapiPskKeyType_b, "w4Error", g_carrieroperator_select)){
				//验证副SSID加密模式和加密算法
				if(false == WpsFunctionLimitConfirm(pageMode_b, pageChiperType_b,1)){
					return;
				}

				var index = 0;
				_w4multicontrolMapCurrent=g_objXML.copyArray(_w4multicontrolMapExisting,_w4multicontrolMapCurrent);
				_w4multicontrolMapCurrent[index++][1] = pageSSID_b;
				_w4multicontrolMapCurrent[index++][1] = 1;
				_w4multicontrolMapCurrent[index++][1] = 0;
				_w4multicontrolMapCurrent[index++][1] = pageMode_b;

				switch(pageMode_b)
				{
					case 'WPA2-PSK':
					case 'Mixed':
					{
						_w4multicontrolMapCurrent[index++][1] = pageModeKey_b;
						_w4multicontrolMapCurrent[index++][1] = pageChiperType_b;
						break;
					}
					case 'WPA-PSK':
					{
						_w4multicontrolMapCurrent[index++][1] = pageModeKey_b
						_w4multicontrolMapCurrent[index++][1] = pageChiperType_b;
						break;
					}
					case 'None':
						break;
					case 'WEP':
					{
						_w4multicontrolMapCurrent[index++][1] = pageModeKey_b;
						_w4multicontrolMapCurrent[index++][1] = pagewepAuth_b;
						_w4multicontrolMapCurrent[index++][1] = pagewepEncrypt_b;
						break;
					}
					case 'WAPI-PSK':
					{
						_w4multicontrolMapCurrent[index++][1] = pageModeKey_b;
						_w4multicontrolMapCurrent[index++][1] = pagewapiPskKeyType_b;
						break;
					}
				}
				_w4multicontrolMapCurrent[index++][1] = pagemultiSSID;	
				mapdata2 = g_objXML.copyArray(_w4multicontrolMapCurrent,mapdata2);
			}else{
				return;
			}
		}
		
		mapData = g_objXML.copyArray(_w4controlMapCurrent,mapData);
	
		if ((mapData.length == 1) && (mapData[0][0] == "RGW/wlan_security/ssid_bcast") && (mapData[0][1] == "0")) {
			isSSIDBcastPost = 1;
		}else {
			isSSIDBcastPost = 0;
		}
		
		//网络开启
		var mapData1 = new Array(0);
		_w4controlMapNwNew[0][1] = pageNwEnable;
		mapData1 = g_objXML.copyArray(_w4controlMapNwNew,mapData1);
		
		if((1 == _w4wifi_version)||(4 == _w4wifi_version)){
			mapData=mapData.concat(mapdata2);
		}
	    mapData1 = g_objXML.getChangedArray(_w4controlMapNwOld,mapData1,true);

	    //只有修改了当前数据才提交修改
        if(mapData1.length > 0){

			// 网络安全设置
			if(mapData.length>0){
				open_dialog_loading();
			    $.cgi.postCmd('uapxb_wlan_basic_settings', mapData1, null, failPostWlanSetting);
			    $.cgi.postCmd('uapxb_wlan_security_settings', mapData, successPostWlanSettinglong, failPostWlanSetting,20000);
            }else{
                open_dialog_loading();
			    $.cgi.postCmd('uapxb_wlan_basic_settings', mapData1, successPostWlanSetting, failPostWlanSetting);
			}
		}else{
			//网络安全设置
			if(mapData.length>0){
			    open_dialog_loading();
			    $.cgi.postCmd('uapxb_wlan_security_settings', mapData, successPostWlanSetting, failPostWlanSetting,20000);
			} 
		}
	}
}


function successPostWlanSettinglong(){
	close_dialog_loading();
	initWlanSetting();
	_w4ChangeSecriteType = 0;
	open_dialog_info(jQuery.i18n.prop("lPostSuccess"));
}

function successPostWlanSetting(){
	close_dialog_loading();
	initWlanSetting();
	_w4ChangeSecriteType = 0;
	open_dialog_info(jQuery.i18n.prop("lPostSuccess"));
}

function failPostWlanSetting(xmldate,textStatus){
    close_dialog_loading();
    _w4ChangeSecriteType = 0;
    open_dialog_info(jQuery.i18n.prop("lPostSuccess"));	
}
//验证SSID加密方式，并作出相应的提示 type:0-主 1-副
function ModeToSecurityLimitConfirm(securityType,type){
    //如果当前802.11模式为opt80211n,而且SSID加密方式为WPA-PSK，则提示WPA-PSK加密方式与802.11n模式不兼容
	var simple_network_status = getCheckboxsValue("simple_network");
	var multiple_network_status = getCheckboxsValue("multiple_network");
	if(type == 0){
		if(simple_network_status == 1){
			if(_w4netMode == 2){
		        if(securityType == "WPA-PSK"){
		            open_dialog_info(jQuery.i18n.prop("WPA_PSK_80211N_WARNING"));
		            return false;
		        }
		    }else{
		    	return true;
		    }
		}else{
			return true;
		}
	}else{
		if(multiple_network_status == 1){
			if(_w4netMode == 2){
		        if(securityType == "WPA-PSK"){
		            open_dialog_info(jQuery.i18n.prop("WPA_PSK_80211N_WARNING"));
		            return false;
		        }
		    }else{
		    	return true;
		    }
		}else{
			return true;
		}
	}
}

//WPS提示
function WpsFunctionLimitConfirm(mode, encryptionType,type){
	var simple_network_status = getCheckboxsValue("simple_network");
	var multiple_network_status = getCheckboxsValue("multiple_network");
	if(type == 0){
		if(simple_network_status == 1){
			if(encryptionType == "TKIP"){
		        if(mode == "WPA-PSK"){
		            if(confirm(jQuery.i18n.prop("WPA_PSK_TKIP_WARNING")) == false){
		                return false;
		            }
		        }else if(mode == "WPA2-PSK"){
		            if(confirm(jQuery.i18n.prop("WPA2_PSK_TKIP_WARNING")) == false){
		                return false;
		            }
		        }
		    }else if(mode == "WEP"){
		        if(confirm(jQuery.i18n.prop("WEP_WARNING")) == false){
		            return false;
		        }
		    }
		    return true;
		}else{
			return true;
		}
	}else{
		if(multiple_network_status == 1){
			if(encryptionType == "TKIP"){
		        if(mode == "WPA-PSK"){
		            if(confirm(jQuery.i18n.prop("WPA_PSK_TKIP_WARNING")) == false){
		                return false;
		            }
		        }else if(mode == "WPA2-PSK"){
		            if(confirm(jQuery.i18n.prop("WPA2_PSK_TKIP_WARNING")) == false){
		                return false;
		            }
		        }
		    }else if(mode == "WEP"){
		        if(confirm(jQuery.i18n.prop("WEP_WARNING")) == false)
		        {
		            return false;
		        }
		    }
		    return true;
		}else{
			return true;
		}
	}
}

function ChangeDrpdwnModeToStr(mode){
	if(mode == 0){
		return "opt80211bgn";
	}else if(mode == 1){
		return "opt80211";
	}else if(mode == 2){
		return "opt80211n";
	}else if(mode == 3){
		return "opt80211a";
	}else if(mode == 4){
		return "opt80211an";
	}else if(mode == 5){
		return "opt80211b";
	}else if(mode == 6){
		return "opt80211g";
	}
}

function SecurityToModeLimitConfirm(mode){
    if(_w4securityType == "WPA-PSK"){
        if(mode == "opt80211n"){
            confirm(jQuery.i18n.prop("WPA_PSK_80211N_WARNING"));
            return false;
        }
    }
    return true;
}

function PostWlanAdvancedSet() {
	
	if(GetOptionsValue("2GChannel") == -1 && GetOptionsValue("5GChannel") == -1){
		open_dialog_info(jQuery.i18n.prop("channelIsEmpty"));
		return false;	
	}
    var pageNetMode = ChangeDrpdwnModeToStr(GetOptionsValue("drpdwnMode"));
    
    if (_w4securityType == "WEP" && (pageNetMode == "opt80211bgn" || pageNetMode == "opt80211n")) {
        open_dialog_info(jQuery.i18n.prop("lnoWEPfor11n"));
        return;
    }

    if(SecurityToModeLimitConfirm(pageNetMode) == false){
        return;
    }

	var pageNetChannel = 0;
	if(GetOptionsValue("drpdwnFreq") == 1){
		pageNetChannel = GetOptionsValue("2GChannel");
	}else{
		pageNetChannel = GetOptionsValue("5GChannel");
	}

	var mapData1 = new Array(0);

	_w4controlMapNwNew[0][1] = 1;	
	_w4controlMapNwNew[1][1] = GetOptionsValue("drpdwnMode");
	_w4controlMapNwNew[2][1] = pageNetChannel;	
	_w4controlMapNwNew[3][1] = GetOptionsValue("drpdwnBand");
	_w4controlMapNwNew[9][1] = GetOptionsValue("WiFiBandwidthMode");

	if(GetOptionsValue("drpdwnFreq") == 1){
		_w4controlMapNwNew[4][1] = 0;
	}else if(GetOptionsValue("drpdwnFreq") == 2){
		_w4controlMapNwNew[4][1] = 1;
	}
	
	var pageMaxClient = parseInt(GetOptionsValue("selMaxClient"));
	_w4controlMapNwNew[5][1] = pageMaxClient;
	

	var WlanLteEnable = GetOptionsValue("iLteWlanEnable");
	if(WlanLteEnable == 1 && _w4WlanLteEnable == "0"){
		if(confirm(jQuery.i18n.prop("WlanLteEnable"))){
			_w4controlMapNwNew[7][1] = 1;
		}
	}else if(WlanLteEnable == 0 && _w4WlanLteEnable=="1"){
		_w4controlMapNwNew[7][1] = 0;
	}

	mapData1 = g_objXML.copyArray(_w4controlMapNwNew,mapData1);
	
	//获取改变的数据，且只发送改变的数据
    mapData1 = g_objXML.getChangedArray(_w4controlMapNwOld,mapData1,true);

	if(mapData1.length > 0){
        open_dialog_loading();
	    $.cgi.postCmd('uapxb_wlan_basic_settings', mapData1, successPostWlanAdvancedSet, failPostWlanAdvancedSet);
	}
}

function successPostWlanAdvancedSet(data){
	getWlanWlanBasicData(data);
	$.cgi.sendCmd('uapxb_wlan_security_settings');
	close_dialog_loading();
	open_dialog_info(jQuery.i18n.prop("lPostSuccess"));
}

function failPostWlanAdvancedSet(xmldate, textStatus) {
    close_dialog_loading();
    $.cgi.sendCmd('uapxb_wlan_basic_settings');
    open_dialog_info(jQuery.i18n.prop("lPostSuccess")); 
}

//WiFi自动卸载提交函数
function post_wlan_auto_disconnect_data(){
	//wifi芯片型号为RTL8189ES
    if(3 == _w4wifi_version || 4 == _w4wifi_version) {
        var Index=0;
        var mapData = new Array(0);
      
        if(1 == _w4WlanAutoDisconnect){
            var timeid = GetOptionsValue("dropdowntime");
            if(timeid == 1)
            {
                _w4timeset = 10;
            }
            else if(timeid == 2)
            {
                _w4timeset = 20;
            }
            else if(timeid == 3)
            {
                _w4timeset = 30;
            }
        
            mapItemData = g_objXML.putMapElement(mapData, Index++, "RGW/wlan_auto/wlan_auto_disconnect",_w4WlanAutoDisconnect);
            mapItemData = g_objXML.putMapElement(mapData, Index++, "RGW/wlan_auto/time_set",_w4timeset);
        }else                         {
            mapItemData = g_objXML.putMapElement(mapData, Index++, "RGW/wlan_auto/wlan_auto_disconnect",_w4WlanAutoDisconnect);
            mapItemData = g_objXML.putMapElement(mapData, Index++, "RGW/wlan_auto/time_set",_w4timeset);
        }
        open_dialog_loading();
        $.cgi.postCmd('wlan_auto_setting', mapData, successpost_wlan_auto, failpostpost_wlan_auto);
    }
}

function successpost_wlan_auto(data){
    close_dialog_loading();
    get_wlan_auto_disconnect_data(data);
    open_dialog_info(jQuery.i18n.prop("successApply"));
}

function failpostpost_wlan_auto(){
    close_dialog_loading();
    open_dialog_info(jQuery.i18n.prop("failApply")); 
}