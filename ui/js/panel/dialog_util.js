//写入提示信息，并打开信息提示框函数
function open_dialog_info(info_value){
	$("#dialogInfoOkBtn").val(jQuery.i18n.prop("BtnClose"));
	$("#dialog_message_info_text").text(info_value);
	$( "#dialog_message_info" ).dialog({
		modal: true,
	    resizable: false,
    	width:400,
    	height:200,
    	title:jQuery.i18n.prop("ldialMessage"),
    	open:function (event, ui) {
    	    $(".ui-dialog-titlebar-close", $(this).parent()).hide();
        },
        close: function() {
		    $("#dialog_message_info" ).dialog("destroy");
		}
    });

    //提示信息3S后自动关闭
    setTimeout(function(){
    	close_dialog_info();
    },3000); 
}

//关闭信息提示框
function close_dialog_info(){
	$("#dialog_message_info" ).dialog("destroy");
}

//打开刷新提示框函数
function open_dialog_loading(){
	$( "#dialog_message_loading" ).dialog({
		resizable: false,
    	modal:true,
    	width:400,
    	height:200,
    	title:jQuery.i18n.prop("lloadingMessage"),
    	open: function (event, ui) {
    	    $(".ui-dialog-titlebar-close", $(this).parent()).hide();
        },
        close: function() {
		    $("#dialog_message_loading" ).dialog( "destroy" );
		}
    });
}
//关闭刷新提示框函数
function close_dialog_loading(){
	$("#dialog_message_loading" ).dialog( "destroy" );
}

//打开设置月结日对话框
function SetPaymentSettingDlg(){
	var retdata;
	//月结日 显示 和 值 和 值范围
	$("#pamentDay").text(jQuery.i18n.prop("pamentDay"));
	$("#setPaymentDay_id").val(xmlPaymentDay);
	$("#DateScopeNote").text(jQuery.i18n.prop("DateScopeNote"));
	$("#setPaymentTip").text(jQuery.i18n.prop("setPaymentTip"));

	//包月流量 显示 和 值 和 值范围
	$("#monthFlow").text(jQuery.i18n.prop("monthFlow"));

	if(parseInt(xmlPaymentPackage) < 1024){
		//设置选中值为1 流量单位为MB
		setCheckboxsValue("flowUnitGroup",1);
		document.getElementById("setMonthFlow").value = xmlPaymentPackage;
		document.getElementById("FlowScope").innerHTML = jQuery.i18n.prop("MBFlowScope");
	}else{
		//设置选中值为0 流量单位为GB
		setCheckboxsValue("flowUnitGroup",0);
		if(xmlPaymentPackage % 1024 == 0){
			retdata = (xmlPaymentPackage/1024).toString();
		}else{
			retdata = changeTwoDecimal(xmlPaymentPackage/1024);
		}
		document.getElementById("setMonthFlow").value = retdata;
		document.getElementById("FlowScope").innerHTML = jQuery.i18n.prop("GBScope");
	}

	//流量单位 显示 flowUnitMbLab
	$("#flowUnit").text(jQuery.i18n.prop("flowUnit"));
	$("#flowUnitMbLab").text(jQuery.i18n.prop("flowUnitMbLab"));
	$("#flowUnitGbLab").text(jQuery.i18n.prop("flowUnitGbLab"));

	$("#paymentSettingDlg").dialog({
		modal: true,
	    resizable: false,
        height: 400,
        width: 600,
        title: jQuery.i18n.prop("titleSetpayment")
    });
}
//关闭设置月结日对话框
function close_paymentSettingDlg(){
	$("#paymentSettingDlg").dialog("destroy");
}

//打开超额流量断网设置对话框
function SetFlowExcessSettingDlg(){
	var dataBit;
	var retdata;
	//超额断网开关
	$("#pExcessDisnetSwitch").text(jQuery.i18n.prop("pExcessDisnetSwitch"));
	//流量阈值
	$("#pFlowThouldValue").text(jQuery.i18n.prop("pFlowThouldValue"));
	//流量单位
	$("#flowSetUnit").text(jQuery.i18n.prop("flowSetUnit"));
	//流量单位MB
	$("#flowUnitMB").text(jQuery.i18n.prop("flowUnitMB"));
	//流量单位GB
	$("#flowUnitGB").text(jQuery.i18n.prop("flowUnitGB"));
	//超额断网开关 状态-开启
	if (_xmlFlowExcessState == 1){
		setCheckboxsValue("excessGroup",1);
	}else{//超额断网开关 状态-关闭
		setCheckboxsValue("excessGroup",0);
	}

	if(parseInt(_xmlFlowExcessValue) < 1024){
		//设置选中值为1 流量单位为MB
		setCheckboxsValue("fluxUnitGroup",1);
		document.getElementById("setThouldValue").value = _xmlFlowExcessValue;
		document.getElementById("flowSetScope").innerHTML = jQuery.i18n.prop("MBFlowScope");
	}else{
		//设置选中值为0 流量单位为MB
		setCheckboxsValue("fluxUnitGroup",0);
		if(_xmlFlowExcessValue % 1024 == 0){
			retdata = (_xmlFlowExcessValue / 1024).toString();
		}else{
			dataBit = (_xmlFlowExcessValue/1024 + '0').indexOf(".")+3;
			retdata = (_xmlFlowExcessValue/1024 + '0').substring(0,dataBit);
		}
		document.getElementById("setThouldValue").value = retdata;
		document.getElementById("flowSetScope").innerHTML = jQuery.i18n.prop("GBScope");
	}

	$("#flowExcessSettingDlg").dialog({
        modal: true,
	    resizable: false,
        height: 400,
        width: 600,
        title: jQuery.i18n.prop("titleSetFlowExcess")
    });
}

//关闭超额流量断网设置对话框
function close_flowExcessSettingDlg(){
	$("#flowExcessSettingDlg").dialog("destroy");
}

//初始化发送短信对话框
function open_BoxSendSmsDialog(){
	$("#lBoxDate").text(jQuery.i18n.prop("lBoxDate"));
	$("#lContent").text(jQuery.i18n.prop("lContent"));
	$("#SmsSendDialog").dialog({
        modal:true,
        resizable: false,
        height: 430,
        width: 520,
        title: jQuery.i18n.prop("ldialMessage")
    });
}
//初始化发送短信对话框
function close_BoxSendSmsDialog(){
    $("#SmsSendDialog").dialog("destroy");
}

//确认对话框
var _okhandle = null;
function boxMBConfirmFactory(title, content, okHandle) {
    _okhandle = okHandle;
    if (!title || $.trim(title) == "") { 
    	title = jQuery.i18n.prop("ldialMessage"); 
    }
    $("#btnDlgOk").val(jQuery.i18n.prop("btnOk"));
    $("#btnDlgCancel").val(jQuery.i18n.prop("btnCancel"));
	$("#MBConfirmFactory").dialog({
	    modal: true,
	    height: 270,
	    width: 450,
	    resizable: false,
	    title: title
	});
	if (!content){
		content = "";
	}
	$("#lConfirmText1").text(content);
}

//添加搜完弹出框，确认按钮修改为继续按钮
function boxMBConfirmFactoryNetWork(title, content, okHandle) {
    _okhandle = okHandle;

    if (!title || $.trim(title) == "") { 
    	title = jQuery.i18n.prop("ldialMessage"); 
    }
    $("#btnDlgOk").val(jQuery.i18n.prop("lcontinue"));
    $("#btnDlgCancel").val(jQuery.i18n.prop("btnCancel"));
	$("#MBConfirmFactory").dialog({
	    modal: true,
	    height: 270,
	    width: 450,
	    resizable: false,
	    title: title
	});
	if (!content) { content = " " }
	$("#lConfirmText1").text(content);
}

//关闭确认框
function cancelFactoryConfirmed() {
    $("#MBConfirmFactory").dialog("destroy");
}

//确认框 点击确认函数
function confFactoryConfirmed() {
    $("#MBConfirmFactory").dialog("destroy")
    if (_okhandle) {
        _okhandle();
    }
}

//重启网关函数
var _afterRebootID; 
function boxMBRebooting(){

	//退出到登录页面
	$.hojyStatus.isLogin = false;
	clearTimeout(timer);
    $("#login").show();
	$("#content").hide();
	$("body").attr("class", "login_body");
	
	clearInterval(_upgradetimer);
	clearInterval(_afterRebootID);
	clearAuthheader();

    open_dialog_loading();
    setTimeout(function () {
        var url = "";
        var host = window.location.protocol + "//" + window.location.host + "/";
        url = host + 'xml_action.cgi?method=get&module=duster&file=' + "status1";
        var count = 0;
        _afterRebootID = setInterval(function () {
            count++;
            if (count > 30) {
                close_dialog_loading();
            }else{
                $.cgi.getDevice(url, function () {
                    close_dialog_loading();
                }, null, 1000);
            }
        }, 4000);
    }, 5000);
}

//打开ussd信息对话框
function open_USSD_dial(){
	$("#ussddial").dialog({
        resizable: false,
        modal:true,
        height: 400,
        width: 500,
        title: jQuery.i18n.prop("ussdboxtitlt")
    });
}
//关闭ussd信息对话框
function close_USSD_dial(){
	$("#ussddial" ).dialog("destroy");
}

function open_UpdateMasterNumberDial(){
	$("#btnUpdateMBBMasterNum").val(jQuery.i18n.prop("btnSend"));
	$("#btnCancleMBBMasterNum").val(jQuery.i18n.prop("btnUSSDCancel"));
	$("#updateMasterNumberDial").dialog({
        resizable: false,
        modal:true,
        height: 300,
        width: 500,
        title: "Update My Master Number"
    });
}

function close_UpdateMasterNumberDial(){
	$("#updateMasterNumberDial" ).dialog("destroy");
}

function open_SmsTipBoxDial(smsFrom){
	$("#smsTipBox").dialog({
        resizable: false,
        modal:true,
        height: 200,
        width: 200,
        title: smsFrom
    });
    //提示信息3S后自动关闭
    setTimeout(function(){
    	$("#smsTipBox" ).dialog("destroy");
    },10000); 
}