$(function(){
	//实例化搜索实网下拉框
	initOptions("searchType");
	//实例化网络模式下拉框
	initOptions("pNetMode");
	initNetWorkPageWords();
	//注册获取网络信息 XML事件
	$.cgi.onGetXml('wan_choose_net', getWanNetData);
});
<!-- ####################################  公共变量  ############################### -->
var pageNetPrior;//网络优先
var totalItem = 0;
var _wanNetMode=''; //网络模式 0:4G/3G/2G  1:4G/3G  2:3G/2G  3:4G/2G  4:4G 5:3G 6:2G 7:自动 8:LTE 9:TDS 10:GSM 11:WCDMA 12:CDMA 13:HDR  
var _wanNetPrior=''; //网络优先 0:4G  1:3G/2G  2:3G
var _wanRatMode=''; //模式 5/3/2模
var _wanXml = '';
var _productId=''; //产品Id  8:l625 9:l625cOled 10:l625cLed 23:l366 24:l561 26:l681&&l681s 
var _controlMapOld=new Array(0);
var _controlMapNew=new Array(0);
var gManualTableData = new Array();
var gManualTableDataCount = 0;
var CheckConnecttimer;
var ChooseNetType = 0; //自动/手动搜网   0/1
var MODE_4G_3G_2G_AND_3G_2G_PRIORITY = 1;
var hasBeenQueriedIsp = false;//是否已经查询过uplmn
var uplmn_hide_or_show;//uplmn是否显示 0|1/隐藏|显示
var gNetwork_mnc_mcc;//当前运营商的mnc_mcc
<!-- ####################################  公共变量  ############################### -->
<!-- ####################################  网络函数  ############################### -->
function initNetwork(){
	if($.hojyStatus.sim == "1") {
		$('#uplmnErr').text(jQuery.i18n.prop("noSIM"));
		$("#Uplmn_tb1_label").hide();
        $("#Uplmn_tb1_button").hide();
        $("#Uplmn_tb1_table").hide();
        $("#Uplmn_tb2_label").hide();
        $("#Uplmn_tb2_button").hide();
        $("#Uplmn_tb2_table").hide();
    }else if($.hojyStatus.sim == "2") {
        $('#uplmnErr').text(jQuery.i18n.prop("uneffectSIM"));
        $("#Uplmn_tb1_label").hide();
        $("#Uplmn_tb1_button").hide();
        $("#Uplmn_tb1_table").hide();
        $("#Uplmn_tb2_label").hide();
        $("#Uplmn_tb2_button").hide();
        $("#Uplmn_tb2_table").hide();
    }else{
		$("#uplmnErr").text("");
	}
	//判断当前是否可以
	if(IsNeedDisconnectedNetwork() == true){	
		$("#SearchApply").val(jQuery.i18n.prop("SearchApply"));	
	}else{
		$("#SearchApply").val(jQuery.i18n.prop("DsearchNetwork"));	
	}
    //获取获取网络模式信息
	$.cgi.sendCmd("wan_choose_net");
}
//获取网络信息 成功回调函数
function getWanNetData(data,textStatus){
	_wanXml = data;
	_wanNetMode = $(_wanXml).find("wan_choose_net").text();
	_wanNetPrior = $(_wanXml).find("wan_prior_choose").text();
	_wanRatMode = $(_wanXml).find("wan_rat_mode").text();
	ChooseNetType = $(_wanXml).find("choose_net_type").text();
	gNetwork_mnc_mcc = $(_wanXml).find("network_mnc_mcc").text();
    //uplmn显示还是隐藏
    uplmn_hide_or_show = $(_wanXml).find("uplmn_hide_or_show").text();
    var index = 0;
   	_controlMapOld = g_objXML.putMapElement(_controlMapOld,index++, "RGW/wan_choose_net", _wanNetMode);
   	_controlMapOld = g_objXML.putMapElement(_controlMapOld,index, "RGW/wan_prior_choose", _wanNetPrior);
    _controlMapNew = g_objXML.copyArray(_controlMapOld,_controlMapNew);
	//设置默认的搜索方式 自动搜索
	SetOptionValue("searchType",0);
	//当前网络模式
	var _wanNetModeInt = parseInt(_wanNetMode);
	//匹配 L625c
	if((g_operator_version == TELECOM_SELECT) && (_wanNetModeInt < 7))
	{
	  	_wanNetModeInt = _wanNetModeInt + 20;
	  	//设置当前的使用的网络模式
	  	SetOptionValue("pNetMode",_wanNetModeInt);
	}else if((g_operator_version == TELECOM_SELECT) && (_wanNetModeInt >= 20)){//匹配 L625c
		_wanNetModeInt = _wanNetModeInt;
	  	//设置当前的使用的网络模式
	  	SetOptionValue("pNetMode",_wanNetModeInt);
	}else{
		//搜索方式 自动-0
		if(ChooseNetType == 0){
			SetOptionValue("searchType",0);
		}else{//搜索方式 手动-1
			SetOptionValue("searchType",1);
		}
        
        if(_wanNetModeInt >= MODE_4G_3G_2G_AND_3G_2G_PRIORITY)
        {
            _wanNetModeInt = _wanNetModeInt - 1;
        }

	}
	SetOptionValue("pNetMode",_wanNetModeInt);

	//设置首页显示网络模式
	SetOptionValue("network_type_select",_wanNetModeInt);
	
    //show or hide the page of UPLNM 0-隐藏 1-显示
    if(uplmn_hide_or_show == 0)
    {
        $("#Uplmn_tb1_label").hide();
        $("#Uplmn_tb1_button").hide();
        $("#Uplmn_tb1_table").hide();
        $("#Uplmn_tb2_label").hide();
        $("#Uplmn_tb2_button").hide();
        $("#Uplmn_tb2_table").hide();
    }else{
        $("#Uplmn_tb1_label").show();
        $("#Uplmn_tb1_button").show();
        $("#Uplmn_tb1_table").show();
        $("#Uplmn_tb2_label").show();
        $("#Uplmn_tb2_button").show();
        $("#Uplmn_tb2_table").show();
    }
}
//获取当前网络是否已经注册上
function IsNeedDisconnectedNetwork(){
    var ret = true;
    if((g_operator_version != CMCC_SELECT) && (gConn_disConn == "cellular")){
        ret = true;
    }else{
        ret = false;
    }
    return ret;
}
//查询网络
function QueryNetwork(){
	$("#uplmnErr").text("");
	var itemIndex=0;
	mapData = null;
	mapData = new Array();
	mapData = putMapElement(mapData,"RGW/uplmn/uplmn_operate", "query", itemIndex++);
	if(mapData.length>0){
		open_dialog_loading();
		$.cgi.postCmd("wan_choose_net", mapData, QueryNetworkSuccess, QueryNetworkFail, 10000);
	}
}

//查询网络 成功回调函数
function QueryNetworkSuccess(data,textStatus){
	close_dialog_loading();
	var xmlData = data;	
	var index = 0;
	var UplmnTableData = new Array();
    hasBeenQueriedIsp = true;
    //获取搜索到的网络数据
	$(xmlData).find("uplmn_list Item").each(function () {
		var id = $(this).find("index").text();
	    var alpha_long = $(this).find("alpha_long").text();
	    var technology = $(this).find("technology").text();
	    var mcc_mnc = $(this).find("mcc_mnc").text();
		if(technology == "0")
		{
			technology = "";
		}
		else if(technology == "3")
		{
			technology = "UTRAN";
		}
		else if(technology == "14")
		{
			technology = "LTE";
		}		
		else if(technology == "16")
		{
			technology = "GSM";
		}
	    UplmnTableData[index] = new Array(4);
	    UplmnTableData[index][0] = id;
	    UplmnTableData[index][1] = alpha_long;
	    UplmnTableData[index][2] = mcc_mnc;
	    UplmnTableData[index][3] = technology;
	    index++;
	});	
	totalItem = index;
	var tableUplmn = document.getElementById("UplmnTable");
	var tbodyUplmn = tableUplmn.getElementsByTagName("tbody")[0];
	clearTableRows("UplmnTable");
	var copsNum = UplmnTableData.length;
	for(var i = 0; i < copsNum; i ++){
		var arrayRow = UplmnTableData[i];
		var row = tbodyUplmn.insertRow(-1);
		
		$(row).css("background-color","#feffed");
		$(row).click(function(){
			$(this).siblings().css("background-color", "#feffed");
			$(this).siblings().removeClass("itemColor");
			$(this).css("background-color","#c9176f");
			$(this).addClass("itemColor");
		});

		var colNo = row.insertCell(0);
		var colType = row.insertCell(1);
		var colCopsName = row.insertCell(2);
		var colCopsCode = row.insertCell(3);
		var colTech = row.insertCell(4);
		//填充数据
		colNo.innerHTML = "<div>" + arrayRow[0] + "</div>";
		colType.innerHTML = "<div>2</div>";
		colCopsName.innerHTML = "<div>" + arrayRow[1] + "</div>";
		colCopsCode.innerHTML = "<div>" + arrayRow[2] + "</div>";
		colTech.innerHTML = "<div>" + arrayRow[3] + "</div>";
	}
}
//查询网络 失败回调函数
function QueryNetworkFail(){
	close_dialog_loading();	
}
//添加网络
function AddNetwork(){
	$("#uplmnErr").text("");
	if(totalItem == 32){
		open_dialog_info(jQuery.i18n.prop("lErrorUplmn"));
		return false;
	}
	boxMBAddNewCops("AddUPLMN");
}

//打开添加对话框
function boxMBAddNewCops(titleId){
	//实例化下拉选中框
	initOptions("techOption");
	$("#opt1").text(jQuery.i18n.prop("opt1"));
	//初始化按钮文字
	$("#confirmAdd").val(jQuery.i18n.prop("btnOk"));
	$("#cancelAdd").val(jQuery.i18n.prop("btnCancel"));
	//初始化说明文字
	$("#indexlabel").text(jQuery.i18n.prop("indexlabel"));
	$("#copsNumber").text(jQuery.i18n.prop("copsNumber"));
	$("#technology").text(jQuery.i18n.prop("technology"));
	//清空输入框的值
	$("#vIspNumber").val("");
	$("#vIndex").val("");
	//设置请选择接入方式
	SetOptionValue("techOption",1);
	//清空错误信息
	$("#lUplmnError").text("");	
	//打开对话框
	$("#AddUplmnDialog").dialog({
        modal:true,
        height: 320,
        width: 420,
        resizable:false,
        title: jQuery.i18n.prop(titleId)
    });
}

//确认添加函数
function ConfirmAddUplmn(){
	var addIspNum = $("#vIspNumber").val();
	var addIndex = $("#vIndex").val();
	var addTech = GetOptionsValue("techOption");
	var technology = "";
	if(addTech == 1){
		open_dialog_info(jQuery.i18n.prop("opt1"));
		return false;
	}

	if(addTech == 3){
		technology = "3";
	}else if(addTech == 4){
		technology = "14";
	}else if(addTech == 2){
		technology = "16";
	}

	var re = /^\d{4,6}$/;
	if (!re.test(addIspNum)) {
		open_dialog_info(jQuery.i18n.prop("lErrorCops1"));
		return false;
	}
	if (parseInt(parseFloat(addIspNum)) == 0){
		open_dialog_info(jQuery.i18n.prop("lErrorCops2"));
		return false;
	}
	$("#AddUplmnDialog").dialog("destroy");
	open_dialog_loading();
	addIspItem(addIspNum,"", technology);		
}
//取消添加函数
function CancelAddUplmn(){
	$("#AddUplmnDialog").dialog("destroy");
}
function CancelModifyUplmn(){
	$("#ModifyUplmnDialog").dialog("destroy");
}
//addIspTtem
function addIspItem(mcc_mnc, operator_alpha_long, radio_technology){
	var index = 0;
	mapData = new Array();
	mapData = putMapElement(mapData, "RGW/uplmn/uplmn_operate", "add", index++);
	mapData = putMapElement(mapData, "RGW/uplmn/uplmn_list/mcc_mnc", mcc_mnc, index++);
	mapData = putMapElement(mapData, "RGW/uplmn/uplmn_list/alpha_long", operator_alpha_long, index++);
	mapData = putMapElement(mapData, "RGW/uplmn/uplmn_list/technology", radio_technology, index++);
	if(mapData.length>0){
        if(hasBeenQueriedIsp == false){
            hasBeenQueriedIsp = true;
            queryIspItem();
        }
        $.cgi.postCmd('wan_choose_net', mapData, successAddtIspSetting, failAddIspSetting, 200000); 
	}
}
//addIspTtem 成功回调函数
function successAddtIspSetting(data){
	QueryNetworkSuccess(data);
}
//addIspTtem 是啊比回调函数
function failAddIspSetting(){
	close_dialog_loading();
	open_dialog_info(jQuery.i18n.prop("lErrorFailAdd"));
}
//queryIspItem
function queryIspItem(){
	var itemIndex=0;
	var queryData = new Array();
	queryData = putMapElement(queryData,"RGW/uplmn/uplmn_operate", "query", itemIndex++);
	if(queryData.length>0){
		$.cgi.postCmdSynch("wan_choose_net", queryData, null, null, 200000);
	}
}
//删除网络函数
function DeleteNetwork(){		
	$("#uplmnErr").text("");
	if($("#UplmnTable").find(".itemColor").length <= 0){
		open_dialog_info(jQuery.i18n.prop("lErrorDelete"));
		return false;		
	}else{
		open_dialog_loading();
		//选中的行
		var itemIndex = $($("#UplmnTable").find(".itemColor div")[0]).text();
		deleteIspItem(itemIndex);
	}	
}
//删除网络cgi提交函数
function deleteIspItem(ItemIndex){
	var itemIndex = 0;
	mapData = null;
	mapData = new Array();
	mapData = putMapElement(mapData, "RGW/uplmn/uplmn_operate", "delete", itemIndex++);
	mapData = putMapElement(mapData, "RGW/uplmn/uplmn_list/index", ItemIndex, itemIndex++);
	if(mapData.length>0){
		 $.cgi.postCmd("wan_choose_net", mapData, successDeleteIspSetting, failDeleteIspSetting, 200000);
    }
}
//删除网络cgi提交函数 成功回调函数
function successDeleteIspSetting(){
	QueryNetwork();
}
//删除网络cgi提交函数 失败回调函数
function failDeleteIspSetting(){
	close_dialog_loading();
	open_dialog_info(jQuery.i18n.prop("lErrorFailDelete"));
}
//修改网络函数
function ModifyNetwork(){
	$("#uplmnErr").text("");
	
	if($("#UplmnTable").find(".itemColor").length == 0){
		open_dialog_info(jQuery.i18n.prop("lErrorEdit"));
		return false;		
	}	
	boxMBMofifyNewCops("ModifyUPLMN");
	var index = $($(".itemColor").children()[0]).text();
	var copsName = $($(".itemColor").children()[2]).text();
	var copsCode = $($(".itemColor").children()[3]).text();
	var tech = $($(".itemColor").children()[4]).text();
	$("#pIndex").val(index);
	$("#pIspNumber").val(copsCode);
	//接入技术
	if(tech == "GSM"){
		SetOptionValue("TechOption",2);
	}else if(tech == "UTRAN"){
		SetOptionValue("TechOption",3);
	}else if(tech == "LTE"){
	    SetOptionValue("TechOption",4);
	}
}
//打开修改网络 对话框
function boxMBMofifyNewCops(titleId){
	//实例化下来选择框
	initOptions("TechOption");
	$("#Opt1").text(jQuery.i18n.prop("opt1"));
	//显示按钮文字
	$("#confirmModify").val(jQuery.i18n.prop("btnOk"));
	$("#cancelModify").val(jQuery.i18n.prop("btnCancel"));
	//初始化说明文字
	$("#indexModify").text(jQuery.i18n.prop("indexModify"));
	$("#modifyCopsNumber").text(jQuery.i18n.prop("copsNumber"));
	$("#TechNology").text(jQuery.i18n.prop("technology"));
	//清空输入框数据
	$("#pIspNumber").val("");
	//设置下拉的值
	SetOptionValue("TechOption",1);
	//清空错误提示文字
	$("#vUplmnError").text("");	
	//打开修改对话框
	$("#ModifyUplmnDialog").dialog({
        modal:true,
        height: 320,
        width: 420,
        resizable:false,
        title: jQuery.i18n.prop(titleId)
    });
}
//确认修改
function ConfirmModifyUplmn(){
	var modifyIspNum = $("#pIspNumber").val();
	var modifyCopsName = "";
	var modifyTech = GetOptionsValue("TechOption");
	var technology = "";
	if(modifyTech == 1){
		open_dialog_info(jQuery.i18n.prop("opt1"));
		return false;
	}if(modifyTech == 3){
		technology = "3";
	}else if(modifyTech == 4){
		technology = "14";
	}else if(modifyTech == 2){
		technology = "16";
	}
	var re = /^\d{4,6}$/;
	if (!re.test(modifyIspNum)){
		open_dialog_info(jQuery.i18n.prop("lErrorCops1"));
		return false;
	}
	if (parseInt(parseFloat(modifyIspNum)) == 0){
		open_dialog_info(jQuery.i18n.prop("lErrorCops2"));
		return false;
	}
	$("#ModifyUplmnDialog").dialog("close");
	open_dialog_loading();
	var index = $($("#UplmnTable").find(".itemColor div")[0]).text();			
	modifyIspItem(parseInt(index), modifyIspNum, modifyCopsName, technology);
}
//修改CGI提交函数
function modifyIspItem(number, mcc_mnc, operator_alpha_long, radio_technology){
	var index = 0;
	mapData = new Array();
	mapData = putMapElement(mapData, "RGW/uplmn/uplmn_operate", "modify", index++);
	mapData = putMapElement(mapData, "RGW/uplmn/uplmn_list/index", number, index++);
	mapData = putMapElement(mapData, "RGW/uplmn/uplmn_list/mcc_mnc", mcc_mnc, index++);
	mapData = putMapElement(mapData, "RGW/uplmn/uplmn_list/technology", radio_technology, index++);
	if(mapData.length>0){ 
        $.cgi.postCmd('wan_choose_net', mapData, successAddtIspSetting, failAddIspSetting, 200000); 
	}
}
//修改CGI提交函数 成功回调函数
function successAddtIspSetting(data){
	QueryNetworkSuccess(data);
}
//修改CGI提交函数 失败回调函数
function failAddIspSetting(){
	close_dialog_loading();
	open_dialog_info(jQuery.i18n.prop("lErrorFailModify"));
}

//搜网按钮点击函数
function SelectSearchNetMethod(){
	var mapData = new Array();
	if (gNetworkType == 10 || gNetworkType == 11){
        open_dialog_info(jQuery.i18n.prop("searchNetworkDisabe"));
        return;
    }
    //检查当前是否已经注册上，注册上，则提示需要断开网络。
	if(IsNeedDisconnectedNetwork() == true){
		boxMBConfirmFactoryNetWork(jQuery.i18n.prop("ldialMessage"), jQuery.i18n.prop("alarmInfo"), function () {
	        mapData = putMapElement(mapData, "RGW/wan/connect_disconnect", "disabled", 0);
			if (gConnType == "disabled"){
				mapData = putMapElement(mapData, "RGW/wan/proto", "cellular", 1);
			}
			//断开网络
			open_dialog_loading();
			$.cgi.postCmd("wan", mapData, ConnectStatusChangeSuccessCallBack, ConnectStatusChangeFailCallBack, 200000);
			return;
	    });	
	}
	CheckConnectStatus();
}
//检查网络连接状态
function CheckConnectStatus(){
	var itemIndex=0;
	var mapData = new Array();
	//当前搜索方式0-自动 1-手动
	if((IsNeedDisconnectedNetwork() == false) || (gConn_disConn != "cellular")){
		if(GetOptionsValue("searchType") == 0){
			var param = "auto_Search_networks";
			mapData = putMapElement(mapData,"RGW/cops/cops_param", param, itemIndex++);
			mapData = putMapElement(mapData,"RGW/cops/cops_action", 1, itemIndex++);
			if(mapData.length>0){
				open_dialog_loading(); 
				$.cgi.postCmd("wan_choose_net", mapData, successChooseNet, failPostWanNetSetting, 200000);
			} 
		}else if(GetOptionsValue("searchType") == 1){
			boxMBConfirmFactoryNetWork(jQuery.i18n.prop("lpromptinformation"), jQuery.i18n.prop("alarmInfo"), function () {
		        mapData = putMapElement(mapData, "RGW/wan/connect_disconnect", "disabled", 0);
				if (gConnType == "disabled"){
					mapData = putMapElement(mapData, "RGW/wan/proto", "cellular", 1);
				}
				open_dialog_loading();
				$.cgi.postCmd("wan", mapData, deactive_data_connect_callback, ConnectStatusChangeFailCallBack, 200000);
		    });
	    }
	}
}
//CheckConnectStatus 成功回调函数
function deactive_data_connect_callback(){
    var itemIndex = 0;
    var mapData = new Array();
    var param = "manual_Search_networks";
    mapData = putMapElement(mapData,"RGW/cops/cops_param", param, itemIndex++);
    mapData = putMapElement(mapData,"RGW/cops/cops_action", 2, itemIndex++);	
    if(mapData.length>0){
    	open_dialog_loading();
        $.cgi.postCmd("wan_choose_net", mapData, successSearchNetwork, failSearchNetwork,200000);
    }
}

//打开搜索网络结果
function boxMBManualNetwork(){
	$("#confirmManual").val(jQuery.i18n.prop("btnRegister"));
	$("#cancelManual").val(jQuery.i18n.prop("btnCancel"));

	$("#lCopsInfo").text(jQuery.i18n.prop("lCopsInfo"));
	$("#copsNumber1").text(jQuery.i18n.prop("copsNumber1"));
	$("#state").text(jQuery.i18n.prop("state"));

	$("#SearchNetwork").dialog({
        modal:true,
        height: 400,
        width: 460,
        resizable:false,
        title: jQuery.i18n.prop("lResult")
    });
}
//手动搜网成功回调函数
function successSearchNetwork(data){
	var copsnumber;
	var numeric;
	var technology;
	var state;
	var stateInt;    //0-不可用 1-可用
	var CurrentWanChooseNet = "#optMode"; 
	var Temp = "";
	var vIspName="";

	close_dialog_loading();	
	boxMBManualNetwork();

	$("#ManualTable").find(".itemColor").removeClass("itemColor");

	var xmlData = data;	
	var index = 0;	
	var ManualTableData = new Array();
	Temp = $(data).find("wan_choose_net").text();
    if (g_operator_version != TELECOM_SELECT){
        if (Temp >= MODE_4G_3G_2G_AND_3G_2G_PRIORITY){
            Temp = Temp - 1;
        }
    }

	CurrentWanChooseNet += Temp;

	$(xmlData).find("cops_list Item").each(function(){
		copsname = $(this).find("copsName").text();
		act = $(this).find("act").text();
		copsnumber = $(this).find("copsNumber").text();//运营商编码
		technology = $(this).find("technology").text();
 
		//默认可用
		state = jQuery.i18n.prop("NetworkEnable");
		if(act == 0){
			act = "2G";
        }else if(act == 1){
			act = "3G";
        }else if(act == 2){
			act = "4G";
		}

		//判断当前锁定的网络模式
		if(Temp == 0){
			Temp = "4G/3G/2G";
		}else if(Temp == 1){
			Temp = "4G/3G";
		}else if(Temp == 2){
			Temp = "3G/2G";
		}else if(Temp == 3){
			Temp = "4G/2G";
		}else if(Temp == 4){
			Temp = "4G";
		}else if(Temp == 5){
			Temp = "3G";
		}else if(Temp == 6){
			Temp = "2G";
		}else if(Temp == 20){
			Temp = "4G/3G/2G";
		}else if(Temp == 21){
			Temp = "4G";
		}else if(Temp == 22){
			Temp = "3G";
		}else if(Temp == 23){
			Temp = "2G";
		}else if(Temp == 24){
			Temp = "3G";
		}else if(Temp == 25){
			Temp = "2G";
		}
	    
	    if( (gNetwork_mnc_mcc == copsnumber) && (Temp.indexOf(act) >= 0)){
	    	stateInt = 1;
	    	state == jQuery.i18n.prop("NetworkEnable")
	    }else{
	    	stateInt = 0;
	    	state = jQuery.i18n.prop("NetworkDisable");
	    }
		
		ManualTableData[index] = new Array(4);
		ManualTableData[index][0] = index;
		ManualTableData[index][1] = copsname;
		ManualTableData[index][2] = act;
		ManualTableData[index][3] = copsnumber;
        ManualTableData[index][4] = state;
        ManualTableData[index][5] = stateInt;//是否可用
		
		gManualTableData[index] = new Array(2);
		gManualTableData[index][0] = copsnumber;
		gManualTableData[index][1] = technology;
		index++;
	});
	gManualTableDataCount = index;
	
	var tableManual = document.getElementById("ManualTable");
	var tbodyManual = tableManual.getElementsByTagName("tbody")[0];
	clearTableRows("ManualTable");
	
	for(var i = 0; i < ManualTableData.length; i ++){
		var arrayRow = ManualTableData[i];
		var row = tbodyManual.insertRow(-1);
		
		$(row).css("background-color","#feffed");
		$(row).click(function(){
			$(this).siblings().css("background-color", "#feffed");
			$(this).siblings().removeClass("itemColor");
			$(this).css("background-color","#c9176f");
			$(this).addClass("itemColor");
		});
       
		var colCopsName = row.insertCell(0);
		var colCopsCode = row.insertCell(1);
		var colState = row.insertCell(2);
		colCopsName.innerHTML = "<div>" + arrayRow[1] + "(" + arrayRow[2] + ")" + "</div>";
		colCopsCode.innerHTML = "<div>" + arrayRow[3] + "</div>";
		colState.innerHTML = "<div class='" +arrayRow[5]+ "'>" + arrayRow[4] + "</div>";
	}
	
	$.cgi.sendCmd('status1');
}
//手动搜网失败回调函数
function failSearchNetwork(){
	open_dialog_info(jQuery.i18n.prop("lFailSearch"));
	close_dialog_loading();
	$.cgi.sendCmd('status1');
}

//手动搜网确认函数
function ConfirmManualNetwork(){	
	var manualType = "1";
	if($("#ManualTable").find(".itemColor").length > 0){
		if($.hojyStatus.sim != 0){
			open_dialog_info(jQuery.i18n.prop("lErrorRegister1"));
			return false;
		}
		$("#SearchNetwork").dialog("destroy");
		var div1 = $($("#ManualTable").find(".itemColor div")[0]).text();
		var div2 = $($("#ManualTable").find(".itemColor div")[1]).text();
		var div3 = $($("#ManualTable").find(".itemColor div")[2]).text();
		//0-禁用 1-可用
		var div3Class = $($("#ManualTable").find(".itemColor div")[2]).attr("class");
		var actIndex = div1.indexOf("(") + 1;
		var act = div1.substring(actIndex,actIndex+2);	
		var rowNum = getRowNo($("#ManualTable").find(".itemColor div")[0]);
		if(div3Class == "0"){
			open_dialog_info(jQuery.i18n.prop("lErrorState")); 
			return false;
		}
		if(act == "2G"){
			act = 0;
		}
		else if(act == "3G"){
			act = 1;
		}
		else if(act == "4G"){
			act = 2;
		}
	}else{
		open_dialog_info(jQuery.i18n.prop("lErrorRegister"));
		return false;
	}

	var param = "register_nettworks";
	var itemIndex=0;
	mapData=null;
	mapData = new Array();
	mapData = putMapElement(mapData,"RGW/cops/numeric", gManualTableData[rowNum][0], itemIndex++);
	mapData = putMapElement(mapData,"RGW/cops/technology", gManualTableData[rowNum][1], itemIndex++);
	mapData = putMapElement(mapData,"RGW/cops/cops_param", param, itemIndex++);
	mapData = putMapElement(mapData,"RGW/cops/cops_action", 2, itemIndex++);
	if(mapData.length>0){
		open_dialog_loading();
		$.cgi.postCmd("wan_choose_net", mapData, RegisterSuccess, RegisterFail, 200000);
	} 
}
//手动搜网取消函数
function CancelManualNetwork(){
	$("#SearchNetwork").dialog("destroy");
}
//注册网络成功 回调函数
function RegisterSuccess(){
	close_dialog_loading();
}
//注册网络失败 回调函数
function RegisterFail(){
	close_dialog_loading();
}
function successChooseNet(){
	close_dialog_loading();
	$.cgi.sendCmd("wan_choose_net");
	open_dialog_info(jQuery.i18n.prop("successApply"));
}
function failPostWanNetSetting(){
	close_dialog_loading();
	open_dialog_info(jQuery.i18n.prop("failApply"));
}
//选网设置 应用按钮点击函数
function PostWanNetSetting(){
	var pageNetMode = parseInt(GetOptionsValue("pNetMode"));
	if (pageNetMode == 0){
		pageNetPrior = parseInt(pageNetPrior);
	}else{
		pageNetPrior = _wanNetPrior;
	}
	
	var index = 0;
	var mapData = new Array(0);

	if (g_operator_version != TELECOM_SELECT)
    {
        if(!((pageNetMode == 0) && (pageNetPrior == 0)))
        {
            pageNetMode ++;
        }
    }

    _controlMapNew[index++][1] = pageNetMode;
    _controlMapNew[index++][1] = 0;//默认4G优先
	mapData = g_objXML.copyArray(_controlMapNew,mapData);
	
	if(mapData.length>0) {
		open_dialog_loading();
		$.cgi.postCmd('wan_choose_net', mapData, successPostWanNetSetting, failPostWanNetSetting, 200000); 
	}
}

//首页选网设置 应用按钮点击函数
function PostWanNetSettingForIndexPage(){
	var pageNetMode = parseInt(GetOptionsValue("network_type_select"));
	if (pageNetMode == 0){
		pageNetPrior = parseInt(pageNetPrior);
	}else{
		pageNetPrior = _wanNetPrior;
	}
	
	var index = 0;
	var mapData = new Array(0);

	if (g_operator_version != TELECOM_SELECT)
    {
        if(!((pageNetMode == 0) && (pageNetPrior == 0)))
        {
            pageNetMode ++;
        }
    }

    _controlMapNew[index++][1] = pageNetMode;
    _controlMapNew[index++][1] = 0;//默认4G优先
	mapData = g_objXML.copyArray(_controlMapNew,mapData);
	
	if(mapData.length>0) {
		open_dialog_loading();
		$.cgi.postCmd('wan_choose_net', mapData, successPostWanNetSetting, failPostWanNetSetting, 200000); 
	}
}

//选网设置 应用按钮点击函数 成功回调函数
function successPostWanNetSetting() {
    close_dialog_loading();
	$.cgi.sendCmd("wan_choose_net");
	open_dialog_info(jQuery.i18n.prop("successApply"));
}
//获取tr对象
function getRowObj(obj){
   var i = 0;
   while(obj.tagName.toLowerCase() != "tr"){
		obj = obj.parentNode;
		if(obj.tagName.toLowerCase() == "table"){
			return null;
		}
   }
   return obj;
}
//获取行对象编号
function getRowNo(obj){
	var trObj = getRowObj(obj); 
	var trArr = trObj.parentNode.children;
	for(var trNo= 0; trNo < trArr.length; trNo++){
		if(trObj == trObj.parentNode.children[trNo]){
			return (trNo);
		}
	}
}
<!-- ####################################  网络函数  ############################### -->
//初始化NetWork显示文字
function initNetWorkPageWords(){
	$("#lUPLMNManagement").text(jQuery.i18n.prop("lUPLMNManagement"));
	$("#number").text(jQuery.i18n.prop("number"));
	$("#displayType").text(jQuery.i18n.prop("displayType"));
	$("#copsName").text(jQuery.i18n.prop("copsName"));
	$("#copsNumber2").text(jQuery.i18n.prop("copsNumber"));
	$("#techNology").text(jQuery.i18n.prop("technology"));
	$("#lManualSearch").text(jQuery.i18n.prop("lManualSearch"));
	$("#manual_search_type_title").text(jQuery.i18n.prop("searchMode"));
	$("#manualSearch").text(jQuery.i18n.prop("manualSearch"));
	$("#autoSearch").text(jQuery.i18n.prop("autoSearch"));
	$("#lWanNetSet").text(jQuery.i18n.prop("lWanNetSet"));
	$("#network_mode_title").text(jQuery.i18n.prop("lNetMode"));

	$("#optMode0").text(jQuery.i18n.prop("optMode0"));
	$("#optMode1").text(jQuery.i18n.prop("optMode1"));
	$("#optMode2").text(jQuery.i18n.prop("optMode2"));
	$("#optMode3").text(jQuery.i18n.prop("optMode3"));
	$("#optMode4").text(jQuery.i18n.prop("optMode4"));
	$("#optMode5").text(jQuery.i18n.prop("optMode5"));
	$("#optMode6").text(jQuery.i18n.prop("optMode6"));
	$("#optMode20").text(jQuery.i18n.prop("optMode20"));
	$("#optMode21").text(jQuery.i18n.prop("optMode21"));
	$("#optMode22").text(jQuery.i18n.prop("optMode22"));
	$("#optMode23").text(jQuery.i18n.prop("optMode23"));
	$("#optMode24").text(jQuery.i18n.prop("optMode24"));
	$("#optMode25").text(jQuery.i18n.prop("optMode25"));
}
