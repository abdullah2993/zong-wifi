$(function(){
	//实例化小区
	initCheckboxs("areas_checkbox");
	//实例化机卡
	initCheckboxs("card_checkbox");

	initAdvancePageWords();

	 //注册获取网络高级设置信息XML事件
    $.cgi.onGetXml('net_advace_set', getadvanceset);
});

//网络高级设置公共变量
var _bandlockstate = 0;
var _bandlocklist;
var _bandlockoriginallist;
var _celllockstate = 0;
var _celllock ;
var _celllocklist;
var _cardlock;
var _province;
var _globalcellid;
var _phycellid;
var _earfcn;
var _band;
var _bandwidth;
var _xmldata;
var _currentdatalist =new Array(0);
var _Existingdatalist =new Array(0);
var originalBandArray;
var lockBandArray;

//初始化高级设置页面数据
function initAdvaceSetting(){
	open_dialog_loading();
	//发送获取数据请求
	$.cgi.sendCmd("net_advace_set");
}

//页面数据处理函数
function getadvanceset(data){
	_xmldata =data;
	_bandlockstate = $(_xmldata).find("bandenable").text();
	_bandlocklist =  $(_xmldata).find("bandlist").text();
	_bandlockoriginallist = $(_xmldata).find("bandoriginallist").text();
	_celllock = $(_xmldata).find("cell").text();
	_celllockstate = $(_xmldata).find("cellenable").text();
	_cardlock = $(_xmldata).find("lock_card").text();
	_province = $(_xmldata).find("product_province").text();

	_celllocklist = $(_xmldata).find("lockcelllist").text();
 	_globalcellid = $(_xmldata).find("global_cell_id").text();
 	_phycellid = $(_xmldata).find("physical_cell_id").text();
 	_earfcn = $(_xmldata).find("earfcn").text();
 	_band = $(_xmldata).find("band").text();
 	_bandwidth = $(_xmldata).find("bandwidth").text();
	
	 var index=0;
	_Existingdatalist = g_objXML.putMapElement(_Existingdatalist,index++, "RGW/lockband/bandenable", _bandlockstate);
	_Existingdatalist = g_objXML.putMapElement(_Existingdatalist,index++, "RGW/lockband/bandlist", _bandlocklist); 
	_Existingdatalist = g_objXML.putMapElement(_Existingdatalist,index++, "RGW/lockband/bandlist", _bandlockoriginallist);
	_Existingdatalist = g_objXML.putMapElement(_Existingdatalist,index++, "RGW/lockcell/cellenable", _celllockstate); 
	_Existingdatalist = g_objXML.putMapElement(_Existingdatalist,index++, "RGW/lockcell/cell", _celllock); 
	_Existingdatalist = g_objXML.putMapElement(_Existingdatalist,index++, "RGW/lock_card", _cardlock); 
	_Existingdatalist = g_objXML.putMapElement(_Existingdatalist,index++, "RGW/product_province", _province); 
	_Existingdatalist = g_objXML.putMapElement(_Existingdatalist,index++, "RGW/lockcellinfo/lockcelllist", _celllocklist);
	_Existingdatalist = g_objXML.putMapElement(_Existingdatalist,index++, "RGW/cellinfo/global_cell_id", _globalcellid); 
	_Existingdatalist = g_objXML.putMapElement(_Existingdatalist,index++, "RGW/cellinfo/physical_cell_id", _phycellid); 
	_Existingdatalist = g_objXML.putMapElement(_Existingdatalist,index++, "RGW/cellinfo/earfcn", _earfcn); 
	_Existingdatalist = g_objXML.putMapElement(_Existingdatalist,index++, "RGW/cellinfo/band", _band); 
	_Existingdatalist = g_objXML.putMapElement(_Existingdatalist,index++, "RGW/cellinfo/bandwidth", _bandwidth); 

	_currentdatalist =  g_objXML.copyArray(_Existingdatalist,_currentdatalist);
	
	//显示可锁定频段信息、锁小区开关状态、机卡互锁状态
	displayadvanceset();
	displaySysManager();

	close_dialog_loading();
}

function displayadvanceset(){
	//显示设备支持锁定的频段
	var originalBandListTable = "";
	originalBandArray = _bandlockoriginallist.split(",");
	for(var index = 0 ; index < originalBandArray.length ; index++){
		if (originalBandArray[index] != ""){
			originalBandListTable += '<td class="td_w_50">Band'+originalBandArray[index]+'</td>';
			originalBandListTable += '<td class="td_w_50">';
			originalBandListTable += '<div class="checkbox-black">';					
			originalBandListTable += '<input type="checkbox" value="0" id="Band_'+originalBandArray[index]+'_checkbox"/>';					
			originalBandListTable += '<label class="bglabel" for="Band_'+originalBandArray[index]+'_checkbox"></label>';				
			originalBandListTable += '</div>';
			originalBandListTable += '</td>';	
		}
	}
	$("#originalBandListTable").empty();
    $("#originalBandListTable").append(originalBandListTable);
	//显示设备支持锁定的频段
	
	//设置当前设备锁定的频段
	lockBandArray = _bandlocklist.split(",");
	for(var index = 0 ; index < lockBandArray.length ; index++){
		if($.inArray(lockBandArray[index],originalBandArray) >= 0 && lockBandArray[index] != ""){
			var BandCheckBox = "Band_"+lockBandArray[index]+"_checkbox";
			setCheckboxValue(BandCheckBox,1);
		}
	}
	//设置当前设备锁定的频段
	
	//锁小开关状态
	if (_celllockstate == 1) {
		setCheckboxsValue("areas_checkbox",1);
        $("#cell_amount_tr").show();
		$("#txcellId").val(_celllock);
    }else {
    	setCheckboxsValue("areas_checkbox",0);
        $("#cell_amount_tr").hide();
		$("#txcellId").val("");
    }
    //锁小开关状态
    
    //机卡互锁状态
	if (_cardlock == 1) {
        setCheckboxsValue("card_checkbox",1);
        //开启机卡互锁，安全菜单禁用
        $("#setting_security_img").hide();
        $("#SIMPINTitle").hide();
    }else {
    	 //关闭机卡互锁，安全菜单启用
        setCheckboxsValue("card_checkbox",0);
        $("#setting_security_img").show();
        $("#SIMPINTitle").show();
    }
    //机卡互锁状态
}

//显示小区信息
function displaySysManager(){
	//锁小区状态信息
    if (_celllockstate == 1) {
        $("#textLockCell").text(jQuery.i18n.prop("Open"));
        $("#sysMan_cell_1").show();
        $("#textLockCelNum").text(_celllock);
        $("#textLockCellInfo").text(_celllocklist);
    }else{
        $("#textLockCell").text(jQuery.i18n.prop("Close"));
        $("#sysMan_cell_1").hide();
        $("#textLockCelNum").text(_celllock);
        $("#textLockCellInfo").text(_celllocklist);
    }

    //当前驻网小区信息
    $("#textGcellid").text(_globalcellid);
    $("#textPcellid").text(_phycellid);
    $("#textFreqband").text(_band);
    $("#textEarfcn").text(_earfcn);
    $("#textBandwidth").text(_bandwidth);

    if (_province == "none"){
        $("#textDevProvince").text(jQuery.i18n.prop("unknownPro"));
    }else{
        $("#textDevProvince").text(_province);
    }

}

//网络高级设置提交函数
function PostNetworkAdvaceSet(){
	var lockbandlist = "";
	var lockcellid;
	var index = 0;
	var mapData = new Array(0);

	//锁频段状态默认开启
	var lockbandstate = "1";
	var lockcellstate = getCheckboxsValue("areas_checkbox");
	var lockcardstate = getCheckboxsValue("card_checkbox");

	//锁定频段开关状态
	if(lockbandstate == "1"){
		//获取当前选中的锁定的频段
		for(var i = 0 ; i < originalBandArray.length ; i++){
			if (originalBandArray[i] != ""){
				var checkBandId = "Band_"+originalBandArray[i]+"_checkbox";
				if(getCheckboxValue(checkBandId) == 1){
					var band_tmp_index = originalBandArray[i] + ",";
					lockbandlist += band_tmp_index;
				}
			}
		}
        if(lockbandlist == ""){
            open_dialog_info(jQuery.i18n.prop("errorBandEmpty"));
            return;
        }
	}else{
		lockbandlist = "";
	}

	//锁小区开关状态
	if (lockcellstate == 1){
		//锁定小区数量
		lockcellid = $("#txcellId").val();

        if(lockcellid == ""){
            open_dialog_info(jQuery.i18n.prop("errorAreaEmpty"));
            return;
        }

        //验证输入小区数量是否符合要求
        if(check_cell_id(lockcellid) == false){
            open_dialog_info(jQuery.i18n.prop("errorAreaRange"));
            return;
        }
	}else{
		lockcellid = "";
	}

	//组装提交的数据
	_currentdatalist[index++][1] = lockbandstate;
	_currentdatalist[index++][1] = lockbandlist;
	_currentdatalist[index++][1] = _bandlockoriginallist;
	_currentdatalist[index++][1] = lockcellstate;
	_currentdatalist[index++][1] = lockcellid;
	_currentdatalist[index++][1] = lockcardstate;
	
	//判断是否修改了数据，只有修改了数据才提交
	mapData = g_objXML.copyArray(_currentdatalist, mapData);
    if (mapData.length > 0){
        open_dialog_loading();
        $.cgi.postCmd('net_advace_set', mapData, successPostAdvanceSet, failPostAdvanceSet);                           
    }
	
}

//网络高级设置提交应用成功 回调函数
function successPostAdvanceSet(data){
	getadvanceset(data);
	open_dialog_info(jQuery.i18n.prop("successApply"));
}

//网络高级设置提交应用失败 回调函数
function failPostAdvanceSet(data){
	close_dialog_loading();
	open_dialog_info(jQuery.i18n.prop("successApply"));
}

//清楚当前锁定小区信息
function PostClearLockCell(){
    open_dialog_loading();
    $.cgi.postCmd('lock_cell_clear', 0, successPostClearLockCell, failPostClearLockCell);
}

//清楚当前锁定小区信息成功 回调函数
function successPostClearLockCell(data){
    getadvanceset(data);
    open_dialog_info(jQuery.i18n.prop("successApply"));
}
//清楚当前锁定小区信息失败 回调函数
function failPostClearLockCell(data){
    close_dialog_loading();
    open_dialog_info(jQuery.i18n.prop("successApply"));
}

//初始化高级设置页面文字
function initAdvancePageWords(){
	$("#lnetAdvaceSet").text(jQuery.i18n.prop("lnetAdvaceSet"));
	$("#lBandSwitch").text(jQuery.i18n.prop("lBandSwitch"));
	$("#lcelllock").text(jQuery.i18n.prop("lcelllock"));
	$("#lcardlock").text(jQuery.i18n.prop("lcardlock"));
	$("#lcellId").text(jQuery.i18n.prop("lcellId"));
	$("#functionState").text(jQuery.i18n.prop("functionState"));
	$("#clearLockCell").val(jQuery.i18n.prop("clearLockCell"));
	$("#lockCell").text(jQuery.i18n.prop("lockCell"));
	$("#lockCellNum").text(jQuery.i18n.prop("lockCellNum"));
	$("#lockCellInfo").text(jQuery.i18n.prop("lockCellInfo"));
	$("#currentCell").text(jQuery.i18n.prop("currentCell"));
	$("#gcellid").text(jQuery.i18n.prop("gcellid"));
	$("#pcellid").text(jQuery.i18n.prop("pcellid"));
	$("#earfcn").text(jQuery.i18n.prop("earfcn"));
	$("#freqband").text(jQuery.i18n.prop("freqband"));
	$("#bandwidth").text(jQuery.i18n.prop("bandwidth"));
	$("#devProvince").text(jQuery.i18n.prop("devProvince"));
}

//锁小区开关 选中开
function areas_open_click(){
	if(getCheckboxsValue("areas_checkbox") == 1){
		return;
	}
	$("#txcellId").attr("disabled",false); 
	$("#cell_amount_tr").show();		
}

//锁小区开关 选中关
function areas_close_click(){
	if(getCheckboxsValue("areas_checkbox") == 0){
		return;
	}
	$("#txcellId").attr("disabled",true); 
	$("#txcellId").val("");
	$("#cell_amount_tr").hide();
}

//机卡互锁开关 选中开
function card_open_click(){
	if(getCheckboxsValue("card_checkbox") == 1){
		return;
	}
	open_dialog_info(jQuery.i18n.prop("lcardError"));
    $("#setting_security_img").hide();
    $("#SIMPINTitle").hide();
}

//机卡互锁开关 选中关
function card_close_click(){
	if(getCheckboxsValue("card_checkbox") == 0){
		return;
	}
	$("#setting_security_img").show();
    $("#SIMPINTitle").show();
}

//验证输入小区数量是否正确
function check_cell_id(id){
    obj = id;
    var exp = "^[0-9]*$";
    var reg = obj.match(exp);
    if((reg == null) ||(id > 10 || id < 1)){
        return false;
    }else{
        return true;
    }
}