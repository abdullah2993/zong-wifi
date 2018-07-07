$(function(){
	$.cgi.onGetXml('status1',initStatus1ShowSuccessCallBack,initStatus1ShowFailCallBack);
	initLoginPageWords();
	initLogin();
});

//初始登录页显示的文字
function initLoginPageWords(){
	$("#wifi_username").attr("placeholder",jQuery.i18n.prop("UserNamePlaceholder"));
	$("#wifi_password").attr("placeholder",jQuery.i18n.prop("PasswordPlaceholder"));
	$("#btnLogin").val(jQuery.i18n.prop("lbtnLogin"));
	$("#logintip").text(jQuery.i18n.prop("logintip"));
	$("#llanguagetitle").text(jQuery.i18n.prop("llanguagetitle"));
	$("#loginAppMifiNameLabel").text(jQuery.i18n.prop("loginAppMifiNameLabel"));
	$("#loginAppDownlaodDescriptionLabel").text(jQuery.i18n.prop("loginAppDownlaodDescriptionLabel"));
}

//关闭APP下载横幅
function btnCloseAppDownloadTip()
{
	$("#divLoginPageAppDownloadTip").hide();
}
//初始化login页面和登录前获取一些必要的数据
function initLogin(){
	//登录状态为 未登录
	$.hojyStatus.isLogin = false;
	//获取status1数据，并初始化
	initStatus1Show();
	initAppFunSupportListShow();
}

//登录函数
function onLogin(){
	$("#loginErr").text("");
	//把字符串作为URI组件进行编码,防止编码出错
	var username = encodeURIComponent($("#wifi_username").val());
	var password = encodeURIComponent($("#wifi_password").val());
	//验证用户输入是否为空
	if("" == username || "" == password){
		$("#loginErr").text(jQuery.i18n.prop("lErrorlogin"));
		return;
	}
	//验证当前用户输入的账户密码是否正确
	var login_done = doLogin(username, password);
	if(login_done == 1) {
		$.hojyStatus.loginDate = new Date();//登录时间
		$.hojyStatus.isLogin = true;//登录成功
		//登录成功 隐藏APP下载页
		$("#divLoginPageAppDownloadTip").hide();

		//判断当前登录的用户 如果是root 显示高级设置中的详细信息
	    if(username == "root"){
			$("#setting_advanced_img").show();
	    	$("#advanceSetTitle").show();	
			$("#lAdvaceSet_1").show();
			$("#lAdvaceSet_2").show();
			$("#lAdvaceSet_3").show();
			$("#lAdvaceSet_4").show();
		}

		//登录成功实时刷新status1数据 3秒刷一次 该函数在head.js中
		loadingStatus();
	}else{
		$.hojyStatus.isLogin = false;//登录失败
		if(login_done == 0){
			$("#loginErr").text(jQuery.i18n.prop("lErrorlogin"));
		}else if(login_done == -1){
			$("#loginErr").text(jQuery.i18n.prop("lnoconn"));
		}
	}
}
//初始化Status1
function initStatus1Show(){
	//发送请求
	$.cgi.sendCmd('status1');
}
function initStatus1ShowSuccessCallBack(xmlData) {
    $(xmlData).find("sysinfo").each(function () {
	    var SwVersionT = $(this).find("version_num").text();
	    var LBatteryCapacityT = $(this).find("lbattery_capacity").text();
	    var HwVersionT = $(this).find("hardware_version").text();
	    var ProductTypeT = $(this).find("device_name").text();

        g_app_download_page = $(this).find("app_download_page").text(); 
        g_battery_percent_switch = $(this).find("battery_percent_switch").text();
        g_time_fomat = $(this).find("time_fomat").text();
        g_language_switch = $(this).find("language_switch").text();
        g_zong_mbb = $(this).find("zong_mbb").text();
	    newsms_remind = $(this).find("newsms_remind").text();
	    g_SIMPINTitle_switch = $(this).find("SIMPINTitle_switch").text();
        
	    //判断当前是否显示APP下载横幅
	    if(g_app_download_page == 1 && $.hojyStatus.isLogin == false){
	        $("#divLoginPageAppDownloadTip").show();
	    }else{
	    	$("#divLoginPageAppDownloadTip").hide();
	    }

	    //判断当前是否显示APP下载横幅
	    //
	    if (SwVersionT != null){
	        $.hojyStatus.SwVersion = SwVersionT;
	    }
	    if (HwVersionT != null){
	        $.hojyStatus.HwVersion = HwVersionT;
	    }
	    if (ProductTypeT != null){
	        $.hojyStatus.ProductType = ProductTypeT;
	    }
	    if (LBatteryCapacityT != null){
	    	$.hojyStatus.BatteryCapacity = LBatteryCapacityT;
	    }		
	   
	    //判断当前需要显示的语言列表
		if(g_language_switch == 0){//cn en
	        $("#ChinaLan").show();
	        $("#EnglishLan").show();
	    }else if(g_language_switch == 1){//en th
	        $("#EnglishLan").show();
	        $("#ThaiLan").show();
	    }else if(g_language_switch == 2){//en  
	        $("#EnglishLan").show();
	    }else if(g_language_switch == 3){// en | tw
	        $("#EnglishLan").show();
	        $("#TraditionalLan").show();
	    }

	    //判断当前是否需要显示MBBWebSite
	    if (g_zong_mbb == 1){
	        $("#nav-link-6").show();
	        $("#nav-link-7").show();
	        $("#nav-link-8").show();
	    }else{
	    	$("#nav-link-6").hide();
	    	$("#nav-link-7").hide();
	    	$("#nav-link-8").hide();
	    }

	    //是否显示安全菜单管理 0-显示 1-关闭
	    if(g_SIMPINTitle_switch == 1){
	        $("#setting_security_img").hide();
	        $("#SIMPINTitle").hide();
	    }

	    //运营商名称
	    IspName = $(xmlData).find("ISP_name").text();

	});
}
function initStatus1ShowFailCallBack(){
	
}
//获取app_fun_support_list定制信息
function initAppFunSupportListShow(){
	$.cgi.sendCmd('app_fun_support_list');
	$.cgi.onGetXml('app_fun_support_list', function (xmlData) {

		$.hojyStatus.sysTimeSet = $(xmlData).find("sys_time_set").text();
		$.hojyStatus.pppoe_switch = $(xmlData).find("pppoe_switch").text();
		$.hojyStatus.ussd_switch = $(xmlData).find("ussd_switch").text();
		$.hojyStatus.wifi_version = $(xmlData).find("wifi_version").text();
		$.hojyStatus.upgradeMode = $(xmlData).find("mp_switch").text();
		$.hojyStatus.freqFiveEnable = $(xmlData).find("freq_five_enable").text();
		$.hojyStatus.ipv6Switch = $(xmlData).find("ipv6_switch").text();
		$.hojyStatus.Battery = (parseInt($(xmlData).find("battery").text()) == 1) ? "yes" : "no";
		$.hojyStatus.lockNetList = $(xmlData).find("lock_net_list").text();
		
		g_mp_switch = $(xmlData).find("mp_switch").text();
        g_operator_version = $(xmlData).find("product_operator_id").text();
        g_product_name = $(xmlData).find("mifi_product_name").text();
        //是否隐藏SSID密码
      	g_hidden_pwd = $(xmlData).find("hidden_passwd").text();
      	if (g_hidden_pwd == "0"){
            $("#q2tr6").hide();
            $("#q2tr66").hide();
        }else if (g_hidden_pwd == "1"){
            $("#q2tr6").show();
            $("#q2tr66").show();
        }

        var str = new Array();
        str = $.hojyStatus.lockNetList.split("");
		
		//判断锁网显示的 网络模式
		if(g_operator_version == TELECOM_SELECT){
			optionShow("optMode25");
			optionShow("optMode24");
			optionShow("optMode23");
			optionShow("optMode22");
			optionShow("optMode21");
			optionShow("optMode20");
	    
	        optionHide("optMode6");
	        optionHide("optMode5");
	        optionHide("optMode4");
	        optionHide("optMode3");
	        optionHide("optMode2");
	        optionHide("optMode1");
	        optionHide("optMode0");
	       
	        optionShow("IoptMode25");
			optionShow("IoptMode24");
			optionShow("IoptMode23");
			optionShow("IoptMode22");
			optionShow("IoptMode21");
			optionShow("IoptMode20");
	       
	        optionHide("IoptMode6");
	        optionHide("IoptMode5");
	        optionHide("IoptMode4");
	        optionHide("IoptMode3");
	        optionHide("IoptMode2");
	        optionHide("IoptMode1");
	        optionHide("IoptMode0");


	        if(str[0] == "1"){
	        	optionShow("optMode20");
	        	optionShow("IoptMode20");
			}
			else{
				optionHide("optMode20");
				optionHide("IoptMode20");
			}

			if(str[1] == "1"){
				optionShow("optMode21");
	        	optionShow("IoptMode21");
			}else{
				optionHide("optMode21");
				optionHide("IoptMode21");
			}

			if(str[2] == "1"){
				optionShow("optMode22");
	        	optionShow("IoptMode22");
			}else{
				optionHide("optMode22");
				optionHide("IoptMode22");
			}

			if(str[3] == "1"){
				optionShow("optMode23");
	        	optionShow("IoptMode23");
			}else{
				optionHide("optMode23");
				optionHide("IoptMode23");
			}

			if(str[4] == "1"){
				optionShow("optMode24");
	        	optionShow("IoptMode24");
			}else{
				optionHide("optMode24");
				optionHide("IoptMode24");
			}
	       
	        if(str[5] == "1"){
	        	optionShow("optMode25");
	        	optionShow("IoptMode25");
	        }else{
	        	optionHide("optMode25");
				optionHide("IoptMode25");
	        }
		}else{
			optionShow("optMode0");
			optionShow("optMode1");
			optionShow("optMode2");
			optionShow("optMode3");
			optionShow("optMode4");
			optionShow("optMode5");
			optionShow("optMode6");

			optionHide("optMode20");
			optionHide("optMode21");
			optionHide("optMode22");
			optionHide("optMode23");
			optionHide("optMode24");
			optionHide("optMode25");

			optionShow("IoptMode0");
			optionShow("IoptMode1");
			optionShow("IoptMode2");
			optionShow("IoptMode3");
			optionShow("IoptMode4");
			optionShow("IoptMode5");
			optionShow("IoptMode6");

			optionHide("IoptMode20");
			optionHide("IoptMode21");
			optionHide("IoptMode22");
			optionHide("IoptMode23");
			optionHide("IoptMode24");
			optionHide("IoptMode25");

			if(str[0] == "1"){
				optionShow("optMode6");
				optionShow("IoptMode6");
			}else{
				optionHide("optMode6");
				optionHide("IoptMode6");
			}

			if(str[1] == "1"){
				optionShow("optMode5");
				optionShow("IoptMode5");
			}else{
				optionHide("optMode5");
				optionHide("IoptMode5");
			}

			if(str[2] == "1"){
				optionShow("optMode4");
				optionShow("IoptMode4");
			}else{
				optionHide("optMode4");
				optionHide("IoptMode4");
			}

			if(str[3] == "1"){
				optionShow("optMode3");
				optionShow("IoptMode3");
			}else{
				optionHide("optMode3");
				optionHide("IoptMode3");
			}

			if(str[4] == "1"){
				optionShow("optMode2");
				optionShow("IoptMode2");
			}else{
				optionHide("optMode2");
				optionHide("IoptMode2");
			}

			if(str[5] == "1"){
				optionShow("optMode1");
				optionShow("IoptMode1");
			}else{
				optionHide("optMode1");
				optionHide("IoptMode1");
			}

			if(str[6] == "1"){
				optionShow("optMode0");
				optionShow("IoptMode0");
			}else{
				optionHide("optMode0");
				optionHide("IoptMode0");
			}
	    }

		//system time
	    if(g_mp_switch != MP_SELECT){
			if($.hojyStatus.sysTimeSet == "0"){
				$("#timeSetBlock").show();
				$("#timeSetBlockLabel").show();
				$("#timeSetBlockButton").show();
				$("#timeSetBlockError").show();
			}else{
				$("#timeSetBlock").hide();
				$("#timeSetBlockLabel").hide();
				$("#timeSetBlockButton").hide();
				$("#timeSetBlockError").hide();
			}	
		}else{
			$("#timeSetBlock").hide();
			$("#timeSetBlockLabel").hide();
			$("#timeSetBlockButton").hide();
			$("#timeSetBlockError").hide();
		}
		
	    //PPPoE菜单显示和隐藏
	    if($.hojyStatus.pppoe_switch == 0){
	        $("#setting_pppoe_img").hide();
	        $("#pppoeTitle").hide();
	    }else{
	        $("#setting_pppoe_img").show();
	        $("#pppoeTitle").show();
	    }

	    //高级设置显示和隐藏
	    if(g_mp_switch == OTA_SELECT){
	    	$("#setting_advanced_img").show();
	    	$("#advanceSetTitle").show();	
	    	//显示网络高级设置
	    	$("#lAdvaceSet_1").show();
	    	//显示下载访问日志按钮
			$("#btnDownload").show();
	    }else{
	    	$("#setting_advanced_img").hide();
	    	$("#advanceSetTitle").hide();
	    	//显示网络高级设置
	    	$("#lAdvaceSet_1").hide();
	    	//显示下载访问日志按钮
			$("#btnDownload").hide();
	    }

	});
}
//验证当前输入的用户名和密码是否登录成功
function doLogin(username1, passwd1)
{
	var url = window.location.protocol + "//" + window.location.host + "/login.cgi";
	var loginParam =  getAuthType(url);
	if(loginParam!=null){
		var loginParamArray = loginParam.split(" ");
		if(loginParamArray[0] =="Digest"){
			Authrealm = getValue(loginParamArray[1]);
			nonce = getValue(loginParamArray[2]);
			AuthQop = getValue(loginParamArray[3]);
			username = username1;
			passwd = passwd1;
			Gnonce = nonce;	
			var rand, date, salt, strResponse;
			var tmp, DigestRes;
			var HA1, HA2;
			HA1 = hex_md5(username+ ":" + Authrealm + ":" + passwd);
 			HA2 = hex_md5("GET" + ":" + "/cgi/protected.cgi");
    		rand = Math.floor(Math.random()*100001)
    		date = new Date().getTime();
			salt = rand+""+date;
			tmp = hex_md5(salt);
			AuthCnonce = tmp.substring(0,16);
    		DigestRes = hex_md5(HA1 + ":" + nonce + ":" + "00000001" + ":" + AuthCnonce + ":" + AuthQop + ":" + HA2);
			url = url+ "?Action=Digest&username="+username+"&realm="+Authrealm+"&nonce="+nonce+"&response="+DigestRes+"&qop="+AuthQop+"&cnonce="+AuthCnonce + "&temp=marvell";
 			if(login_done(authentication(url))){
    			strResponse = "Digest username=\"" + username + "\", realm=\"" + Authrealm + "\", nonce=\"" + nonce + "\", uri=\"" + "/cgi/protected.cgi" + "\", response=\"" + DigestRes + "\", qop=" + AuthQop + ", nc=00000001" + ", cnonce=\"" + AuthCnonce + "\"" ;
    			return 1;
 			}else{
    			return 0;
    		}
    		return strResponse;
		}
	}
	return -1;
}

//根据状态判断是否登录成功
function login_done(urlData)
{
	if(urlData.indexOf("200 OK") != -1 ){
        return true;
    }else{
       	return false;
    }
}

