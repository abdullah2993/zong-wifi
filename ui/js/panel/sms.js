$(function(){
	initCheckboxs("sms_news_status");
	initSMSPageWords();
	$.cgi.onGetXml('message', displayAllMessage, failFetchMessage);
	$.cgi.onGetXml('message_outbox', displayOutAllMessage, failFetchMessage);
	$.cgi.onGetXml('message_drafts', displayDraftAllMessage, failFetchMessage);
});
<!-- #############################################短信全局变量################################################### -->
var currentPage;
var _messageArray = new Array(0);
var SMS_FULL_STATE = 2; //短信满状态
var _sendReport;//发送报告状态
var _messageDraftArray = new Array(0);//草稿箱数据数组
var smsDraftTotalNum,currentDraftPage,totalDraftPage;//草稿箱总数量 当前页码 总页码
var draftNo,draftMs;
var smsDraftNum = 0; 
var _flagSms = "0";
var smsAction;
var _smsAction;
var gSmsBoxFlag ;
var gSmsId ;
var smsOutboxPollID;
var _messageOutArray = new Array(0);
var smsOutTotalNum,currentOutPage,totalOutPage;
var smsOutNum = 0;
var smsTotalNum,currentPage,totalPage;
var smsNum = 0;
var unReadNum = 0;
var smsOutNumBox = 0;
var smsIsFull = 0;
<!-- #############################################短信全局变量################################################### -->

<!-- #############################################收件箱################################################### -->
//初始化收件箱数据
function initSMS(){
	if($.hojyStatus.sim == "1") {
		$('#LabelSimChose').text(jQuery.i18n.prop("noSIM"));
		$("#sms_in_label").hide();
		$("#tableSMS").hide();
		$("#sms_in_page").hide();
    } 
	else if ($.hojyStatus.sim == "2") {
        $('#LabelSimChose').text(jQuery.i18n.prop("uneffectSIM"));
        $("#sms_in_label").hide();
		$("#tableSMS").hide();
		$("#sms_in_page").hide();
    }else{
		$("#LabelSimChose").text("");
        $.cgi.sendCmd('message');
		currentPage = 0;
		toFirstPage();
	}

	//点击每行，弹出对话框显示内容
    $(".messageRow").live("click", function () {
        var state = $($(this).children("td")[1]).text();
		var index = $($(this).find(".contentdiv")).attr("ids");
        var no = $($(this).children("td")[2]).text();
        var dt = $($(this).children("td")[4]).text();
		var ms = _messageArray[$($(this).find(".contentdiv")).attr("smsIndex")][2];
		$("#lBoxPeople").text(jQuery.i18n.prop("lBoxNumFrom"));
		$("#textPeople").hojyBnEnable(true);   
		$("#textPeople").val(no);
		$("#tr_send1").show();
		$("#tr_send2").show();
		$("#textDate").text(dt);
		$("#SendContent").attr("readonly","readonly");
        smsAction = "view";
		document.getElementById("SendContent").value = ms;
		$("#btnSmsSend").hide();
		$("#btnSmsSave").hide();
		$("#btnSmsReply").show();
		$("#btnSmsTransmit").show();
		gSmsBoxFlag = "-1";
		gSmsId = "-1";
		boxSendSmsDialog();
        if (state == jQuery.i18n.prop("sUnread")) {
            changeSMSReadStatus(index);
        }
    });
}

//刷新未读短信
function changeSMSReadStatus(smsIndex){
	var itemIndex = 0;
    var operator = "sms_state"
	mapData = new Array();
	mapData = putMapElement(mapData,"RGW/message/read_message_table",smsIndex,itemIndex++);
	mapData = putMapElement(mapData,"RGW/message/operator",operator,itemIndex++);
    mapData = putMapElement(mapData,"RGW/message/page_number",currentPage,itemIndex++);
	if(mapData.length > 0){
		$.cgi.postCmd("message", mapData, displayAllMessage, null);	
	}
}
//获取收件箱数据
function displayAllMessage(data){
	$("#LabelSimChose").text("");
	var smsFrom, smsSubject, smsRecvTime, smsStatus, psmIndex, smslocation;
	var smsIndex = 0;
	var xml = data;
	_messageArray = null;
	_messageArray = new Array(0);
	var strs = new Array();
	var strb = new Array();
	var outimeformat= new Array();
	$(xml).find("message_list").each(function () {
		$(this).find("Item").each(function () {
			smsFrom = $(this).find("from").text();
			smsSubject = $(this).find("subject").text();
			smsRecvTime = $(this).find("received").text();
			smsStatus = $(this).find("status").text();
			psmIndex = $(this).find("index").text();
			smslocation = $(this).find("location").text();
			if(g_time_fomat == 1){
				strs = smsRecvTime.split("-");
				var tmp_strs = strs[2];
				strb = tmp_strs.split(" ");
				outimeformat += strb[0];
				outimeformat += "/";
				outimeformat += strs[1];
				outimeformat += "/";
				outimeformat += strs[0];
				outimeformat += " ";
				outimeformat += strb[1];
			}else{
				outimeformat = smsRecvTime;
			}
			_messageArray[smsIndex] = new Array(7);
			_messageArray[smsIndex][0] = smsIndex;
			_messageArray[smsIndex][1] = smsFrom;
			_messageArray[smsIndex][2] = smsSubject;
			_messageArray[smsIndex][3] = outimeformat;
			_messageArray[smsIndex][4] = smsStatus;
			_messageArray[smsIndex][5] = psmIndex;
			_messageArray[smsIndex][6] = smslocation;
			outimeformat = "";
			smsIndex++;
		})
	});
	  
	loadMessageTableData(_messageArray);
	smsTotalNum = $(xml).find("total_number").text();
	currentPage = $(xml).find("page_number").text();
	smsUnreadNum = $(xml).find("unread_number").text();
	smsIsFull = $(xml).find("isFull").text();
	smsNum = smsTotalNum;
	unReadNum = smsUnreadNum;
	$("#smsNum").text("("+unReadNum+"/"+smsNum+")");
	
	if(smsIsFull == SMS_FULL_STATE){
	  	open_dialog_info(jQuery.i18n.prop("smsFull"));
	}
	if (currentPage == ""){
		currentPage = 1;
	}
	if (smsTotalNum == "0"){
		totalPage = 1;
	}else if (parseInt(smsTotalNum) > parseInt(smsTotalNum / 10) * 10){
		totalPage = parseInt(smsTotalNum / 10) + 1;
	}else{
		totalPage = parseInt(smsTotalNum / 10);
	}
	$("#vCurrentPage").text(currentPage + "/" + totalPage);

	//每次刷新全选按钮重置
	$("#selectAllCheckBox").removeClass("checked");
	$("#selectAll").attr("checked",false);
}

//获取收件箱数据失败
function failFetchMessage(){
	//关闭获取短信内容失败提醒,防止用户等待过程中退出WEB,要想使用取消注释即可
	//open_dialog_info(jQuery.i18n.prop("lErrorFetch"));
}
//显示收件箱数据
function loadMessageTableData(val){
	var tableSMS = document.getElementById("tableSMS");
	var tbodySMS = tableSMS.getElementsByTagName("tbody")[0];
	clearTableRows("tableSMS");

	var smsNumber = val.length;
	for(var i=0;i<smsNumber;i++){
		var arrayRow = val[i];
		var row = tbodySMS.insertRow(-1);
		var colDelete = row.insertCell(0);
		var colStatus = row.insertCell(1);
		var colFrom = row.insertCell(2);
		var colSubject = row.insertCell(3);
		var colRecvTime = row.insertCell(4);
		$(row).attr("class", "messageRow");
		STATUSID = "Status" + i;
		DELETEID = "Delete" + i;
		SUBJECTID = "Subject" + i;
		LOCATIONID = "Location" + i;
		var deleteDivId = "divId" + i;
		var deleteCheckId = "delCheck" + i;
		colFrom.innerHTML = "<div class='nodiv'><span title='" + arrayRow[1] + "'>"+arrayRow[1]+"</span></div>";
		colSubject.innerHTML = "<div class='contentdiv' ids=" + arrayRow[5] + " smsIndex=" + arrayRow[0] + "><label id=" + SUBJECTID + " title='" + arrayRow[2] + "'>" + arrayRow[2] + "</label></div>";
		colRecvTime.innerHTML = "<span>"+arrayRow[3]+"</span>";
		colStatus.innerHTML = "<div align='center'><span id=" + STATUSID + "></span></div>";
		colDelete.innerHTML = "<div align='center' id=" + deleteDivId + "><input type='checkbox' style='display: none;align:center' id=" + deleteCheckId + "><label class='rowlabel checkbox' id=" + DELETEID + "></label></div>";
		
		if (arrayRow[4] == "0") {
		    $("#" + STATUSID).text(jQuery.i18n.prop("sUnread"));
		}
		else if (arrayRow[4] == "1") {
		    $("#" + STATUSID).text(jQuery.i18n.prop("sReaded"));
		}
		else if(arrayRow[4] == "2") {//marvell的短信存在unsend的信息，所以加此判断
		    $("#" + STATUSID).text(jQuery.i18n.prop("sNoSend"));
		}
		else if (arrayRow[4] == "3") {//marvell的短信存在send的信息，所以加此判断
		    $("#" + STATUSID).text(jQuery.i18n.prop("sSended"));
		}
		$("#"+deleteDivId).hcheckbox();	
	}
}
//收件箱第一页数据
function toFirstPage(){
	$("#LabelSimChose").text("");
    $("#tableSMS label").removeClass("checked");
	var mapData = new Array();
	if(currentPage == "1"){
		return;
	}
	putMapElement(mapData,"RGW/message/page_number", 1, 0);
	if(mapData.length > 0){
		$.cgi.postCmd("message", mapData, displayAllMessage, null);	
	}
}
//收件箱上一页数据
function toUpPage(){
	$("#LabelSimChose").text("");
    $("#tableSMS label").removeClass("checked"); 
	var mapData = new Array();
	if(currentPage == "1"){
		return;	 
	}
	var page_number = parseInt(currentPage) -1;
	putMapElement(mapData,"RGW/message/page_number", page_number, 0);
	if(mapData.length > 0){
		$.cgi.postCmd("message", mapData, displayAllMessage, null);	
	}
}
//收件箱下一页数据
function toNextPage(){
	$("#LabelSimChose").text("");
    $("#tableSMS label").removeClass("checked");	
	var mapData = new Array();
	if(currentPage == totalPage){
		return;
	}
	var page_number = parseInt(currentPage) +1;
	putMapElement(mapData,"RGW/message/page_number", page_number, 0);
	if(mapData.length > 0){
		$.cgi.postCmd("message", mapData, displayAllMessage, null);	
	}	
}
//最后一页数据
function toLastPage(){
	$("#LabelSimChose").text("");
    $("#tableSMS label").removeClass("checked");
	var mapData = new Array();
	if(currentPage == totalPage){
		return;
	}
	putMapElement(mapData,"RGW/message/page_number", totalPage, 0);
	if(mapData.length > 0){
		$.cgi.postCmd("message", mapData, displayAllMessage, null);	
	}	
}
//收件箱选中所有数据 取消选中所有数据 切换函数
function selectAllCheckBox(){
	if(document.getElementById("selectAll").checked == true){
		for(var i=0;i<10;i++){
			var del = "Delete"+i;
			var tmpdel = "delCheck"+i;
			$("#"+del).removeClass("checked");
			$("#"+tmpdel).attr("checked",false)
		} 	
	}else{	
		for(var i=0;i<10;i++){
			var del = "Delete"+i;
			var tmpdel = "delCheck"+i;
			$("#"+del).addClass("checked");
			$("#"+tmpdel).attr("checked",true)
		}
	}
}
//刷新收件箱函数
function refreshSMSList(){
	$.cgi.sendCmd("message");
}
//收件箱删除函数 对话框实例化
function smsDelComfirm(){
	if (!checkDeleteInRowNum()) {
	    open_dialog_info(jQuery.i18n.prop("smsChose"));
	    return;
    }
	$("#lCoInfo").text(jQuery.i18n.prop("IComfInfo"));
	$("#comYes").val(jQuery.i18n.prop("comYes"));
	$("#comNo").val(jQuery.i18n.prop("comNo"));
	$("#smsDelComfDialog").dialog({
        modal:true,
        height: 150,
        width: 420,
        resizable:false,
        title: jQuery.i18n.prop("titleComfirm")
    });
}
//收件箱删除短息函数
function btnYesClickedComfirm(){
    $("#smsDelComfDialog").dialog("destroy");
	deleteSMSOk();
}
//收件箱取消删除短息函数
function btnNoClickedComfirm() {
    $("#smsDelComfDialog").dialog("destroy");
}
//收件箱删除函数 请求函数
function deleteSMSOk(){
	var deleteSMSList = '';
	var smsIndex;
	var count = 0;
	
	if (!checkDeleteInRowNum()) {
	    open_dialog_info(jQuery.i18n.prop("smsChose"));
	    return;
    }
	for(var i=0;i<10;i++)
	{
		var del = "delCheck" + i;
		if($("#"+del).attr("checked"))
		{
			smsIndex = _messageArray[i][5];
			deleteSMSList = deleteSMSList + smsIndex + ',' ;
			count++;
		}
	}
	var itemIndex = 0;
    var operator = "delete_sms"
	mapData = new Array();
	mapData = putMapElement(mapData,"RGW/message/delete_message_table",deleteSMSList,itemIndex++);
	mapData = putMapElement(mapData,"RGW/message/operator",operator,itemIndex++);
    mapData = putMapElement(mapData,"RGW/message/page_number",1,itemIndex++);

	if(mapData.length > 0)
	{
	    open_dialog_loading();
        $.cgi.postCmd("message", mapData, deleteSMSSuccessCallBack, deleteSMSFailCallBack, 50000);	
	}
}
//删除收件箱短信成功回调函数
function deleteSMSSuccessCallBack(data,textStatus){
	refreshSMSList();
	$("#tableSMS label").removeClass("checked");
	displayAllMessage(data);
	close_dialog_loading();
}
//删除收件箱短信失败回调函数
function deleteSMSFailCallBack(){
    close_dialog_loading();
	open_dialog_info(jQuery.i18n.prop("lErrorFailDelete"));
}
//短信回复函数
function replySms(){
	$("#lBoxPeople").text(jQuery.i18n.prop("lBoxNumTo"));
	$("#textPeople").hojyBnEnable(true);
	$("#tr_send1").hide();
	$("#tr_send2").hide();
	document.getElementById("SendContent").disabled = false;
	document.getElementById("SendContent").value = "";
    $("#SendContent").removeAttr("readonly");
    smsAction = "reply";
	$("#btnSmsSend").show();
	$("#btnSmsSave").show();
	$("#btnSmsReply").hide();
	$("#btnSmsTransmit").hide();
	$("#lSmsCount").text("");
	$("#SendContent").focus();
}
function transmitSms(){
	$("#lBoxPeople").text(jQuery.i18n.prop("lBoxNumTo"));
	$("#textPeople").hojyBnEnable(true);
	$("#textPeople").val("");
	$("#tr_send1").hide();
	$("#tr_send2").hide();
	document.getElementById("SendContent").disabled = false;
    $("#SendContent").removeAttr("readonly");
    smsAction = "transmit";
	$("#btnSmsSend").show();
	$("#btnSmsSave").show();
	$("#btnSmsReply").hide();
	$("#btnSmsTransmit").hide();
	$("#textPeople").focus();
}
<!-- #############################################收件箱################################################### -->

<!-- #############################################发件箱################################################### -->
//初始化发件箱
function initOutBox(){
	if($.hojyStatus.sim == "1") {
		$('#lErrorOut').text(jQuery.i18n.prop("noSIM"));
		$("#sms_out_label").hide();//隐藏收件箱短信数量
		$("#tableOutSMS").hide();//隐藏收件箱数据
		$("#sms_out_page").hide();//隐藏收件箱页面操作
    }else if ($.hojyStatus.sim == "2") {
        $('#lErrorOut').text(jQuery.i18n.prop("uneffectSIM"));
        $("#sms_out_label").hide();//隐藏收件箱短信数量
		$("#tableOutSMS").hide();//隐藏收件箱数据
		$("#sms_out_page").hide();//隐藏收件箱页面操作
    }else{
		$("#lErrorOut").text("");
        $.cgi.sendCmd('message_outbox');
		currentOutPage = 0;
		toFirstOutPage();
	}

	//点击每行，弹出对话框显示内容
	$(".messageOutRow").live("click", function () {
        var index = $($(this).find(".contentdiv")).attr("ids");
        var no = $($(this).children("td")[1]).text();
        var dt = $($(this).children("td")[3]).text();
		var ms = _messageOutArray[$($(this).find(".contentdiv")).attr("smsIndex")][2];
		
		$("#lBoxPeople").text(jQuery.i18n.prop("lBoxNumTo"));
		$("#textPeople").hojyBnEnable(false);
		$("#textPeople").val(no);
		$("#tr_send1").show();
		$("#tr_send2").show();
		$("#textDate").text(dt);
        $("#SendContent").attr("readonly","readonly");
		document.getElementById("SendContent").value = ms;
		$("#btnSmsSend").hide();
		$("#btnSmsSave").hide();
		$("#btnSmsReply").hide();
		$("#btnSmsTransmit").show();
		gSmsBoxFlag = "-1";
		gSmsId = "-1";
		boxSendSmsDialog();
    });
}
//显示发件箱第一页数据
function toFirstOutPage(){
	$("#lErrorOut").text("");
    $("#tableOutSMS label").removeClass("checked");
	var mapData = new Array();
	if(currentOutPage == "1"){
		return;
	}
	putMapElement(mapData,"RGW/message_outbox/page_number", 1, 0);
	if(mapData.length > 0){
		$.cgi.postCmd("message_outbox", mapData, displayOutAllMessage, null);	
	}
}
//获取发件箱数据成功回调函数
function displayOutAllMessage(data){
	$("#lErrorOut").text("");
	var smsTo, smsSubject, smsTime, psmIndex, smslocation;
    var smsStatus;
	var smsIndex = 0;
	var xml = data;
	_messageOutArray = null;
	_messageOutArray = new Array(0);
	var strf = new Array();
	var strd = new Array();
	var outime_format= new Array();
	$(xml).find("message_list").each(function () {
		$(this).find("Item").each(function () {
			smsTo = $(this).find("addressee").text();
			smsSubject = $(this).find("message_content").text();
			smsTime = $(this).find("send_time").text();
			psmIndex = $(this).find("index").text();
			smslocation = $(this).find("location").text();
            smsStatus = $(this).find("status").text();
			if(g_time_fomat == 1){
				strf = smsTime.split("-");
				var tmp_strf =  strf[2];
				strd = tmp_strf.split(" ");	
				outime_format += strd[0];
				outime_format += "/";
				outime_format += strf[1];
				outime_format += "/";
				outime_format += strf[0];
				outime_format += " ";
				outime_format += strd[1];
			}else{
				outime_format = smsTime;
			}
			_messageOutArray[smsIndex] = new Array(7);
			_messageOutArray[smsIndex][0] = smsIndex;
			_messageOutArray[smsIndex][1] = smsTo;
			_messageOutArray[smsIndex][2] = smsSubject;
			_messageOutArray[smsIndex][3] = outime_format;
			_messageOutArray[smsIndex][4] = psmIndex;
			_messageOutArray[smsIndex][5] = smslocation;
            _messageOutArray[smsIndex][6] = smsStatus;
			outime_format = "";
			smsIndex++;
		})
	});
	
	loadOutTableData(_messageOutArray);
    //发件箱总数
	smsOutTotalNum = $(xml).find("total_number").text();
	//发件箱总页数
	currentOutPage = $(xml).find("page_number").text();
	smsOutNum = smsOutTotalNum;
	//显示发箱数量
	$("#smsOutNum").text("("+smsOutNum+")");
	if (currentOutPage == ""){
		currentOutPage = 1;
	}
	if (smsOutTotalNum == "0"){
		totalOutPage = 1;
	}else if (parseInt(smsOutTotalNum) > parseInt(smsOutTotalNum / 10) * 10){
		totalOutPage = parseInt(smsOutTotalNum / 10) + 1;
	}else{
		totalOutPage = parseInt(smsOutTotalNum / 10);
	}
	$("#vCurrentOutPage").text(currentOutPage + "/" + totalOutPage);

	//每次刷新全选按钮重置
	$("#selectOutAllCheckBox").removeClass("checked");
	$("#selectOutAll").attr("checked",false);
    smsOutboxInfoPoll();
}
//发件箱全选按钮切换函数
function selectOutAllCheckBox(){
	if(document.getElementById("selectOutAll").checked == true){
		for(var i=0;i<10;i++){
			var del = "DeleteOut"+i;
			var tmpdel = "delOutCheck"+i;
			$("#"+del).removeClass("checked");
			$("#"+tmpdel).attr("checked",false)
		}
	}else{	
		for(var i=0;i<10;i++){
			var del = "DeleteOut"+i;
			var tmpdel = "delOutCheck"+i;
			$("#"+del).addClass("checked");
			$("#"+tmpdel).attr("checked",true)
		}
	}
}

//处理发件箱数据 组装成表格数据 显示出来
function loadOutTableData(val){
    var imageHtml;
    var imageId;
    var spanId;
    var displayValue;
	var tableSMS = document.getElementById("tableOutSMS");
	var tbodySMS = tableSMS.getElementsByTagName("tbody")[0];
	clearTableRows("tableOutSMS");
	var smsNumber = val.length;
	for(var i=0;i<smsNumber;i++){
		var arrayRow = val[i];
		var row = tbodySMS.insertRow(-1);
		var colDelete = row.insertCell(0);
		var colTo = row.insertCell(1);
		var colSubject = row.insertCell(2);
		var colTime = row.insertCell(3);
		$(row).attr("class", "messageOutRow");
		DELETEID = "DeleteOut" + i;
		SUBJECTID = "SubjectOut" + i;
		LOCATIONID = "LocationOut" + i;
		var deleteDivId = "divOutId" + i;
		var deleteCheckId = "delOutCheck" + i;
        imageId = "imageSmsOutboxStatus_" + i;
        spanId = "spanSmsOutbox_" + i;
        if(arrayRow[6] == "unsend"){
            displayValue = "block";
            imageHtml = "<img id=" + imageId + " src='images/message/sms_unsend.png'" + "title=" + jQuery.i18n.prop("UnsendTips") +" style='float: left;display:"+ displayValue +"'/>";
        } else if(arrayRow[6] == "delivered"){
            displayValue = "block";
            imageHtml = "<img id=" + imageId + " src='images/message/sms_arrived.png'" + "title=" + jQuery.i18n.prop("ArriveTarget") +" style='float: left;display:"+ displayValue +"'/>";
        }else{
            displayValue = "none";
            imageHtml = "<img id=" + imageId + " src='images/message/sms_arrived.png'" + "title=" + jQuery.i18n.prop("ArriveTarget") +" style='float: left;display:"+ displayValue +"'/>";
            imageHtml = imageHtml + "<span id="+ spanId +" style='width:16px;float:left;padding: 5px 0px 0px 3px;'></span>";
        }
		colTo.innerHTML = "<div class='nodiv'>" + imageHtml + "<span title='" + arrayRow[1] + "'>"+arrayRow[1]+"</span></div>";
		colSubject.innerHTML = "<div class='contentdiv' ids=" + arrayRow[4] + " smsIndex=" + arrayRow[0] + "><label id=" + SUBJECTID + " title='" + arrayRow[2] + "'>" + arrayRow[2] + "</label></div>";
		colTime.innerHTML = "<span>"+arrayRow[3]+"</span>";
		colDelete.innerHTML = "<div align='center' id=" + deleteDivId + "><input type='checkbox' style='display: none;align:center' id=" + deleteCheckId + "><label class='rowlabel checkbox' id=" + DELETEID + "></label></div>";
		$("#"+deleteDivId).hcheckbox();	
	}
}
//检查是否有短信正在发送
function smsOutboxInfoPoll(){
	//_flagSms == "1":短信正在发送
    if(_flagSms == "1"){
        clearTimeout(smsOutboxPollID);
    }else{
        clearTimeout(smsOutboxPollID);
        smsOutboxPollID = setTimeout(function () { smsOutboxCurrentPage(); }, 3000);
    }
}

//刷新当前发件箱数据
function smsOutboxCurrentPage(){
    var mapData = new Array();
	var page_number = parseInt(currentOutPage);
	putMapElement(mapData,"RGW/message_outbox/page_number", page_number, 0);
	if(mapData.length > 0){
		$.cgi.postCmd("message_outbox", mapData, displayOutboxMessageState, null);	
	}
}
//重新刷新发件箱数据
function displayOutboxMessageState(data){
    var smsIndex = 0;
	var xml = data;
	var TempMessageOutArray = null;
	TempMessageOutArray = new Array(0);
	var strs = new Array();
	var strb = new Array();
	var outimeformat= new Array();
	$(xml).find("message_list").each(function () {
		$(this).find("Item").each(function () {
			smsTo = $(this).find("addressee").text();
			smsSubject = $(this).find("message_content").text();
			smsTime = $(this).find("send_time").text();
			psmIndex = $(this).find("index").text();
			smslocation = $(this).find("location").text();
            smsStatus = $(this).find("status").text();
			if(g_time_fomat == 1){
				strs = smsTime.split("-");
				var tmp_strs = strs[2];
				strb = tmp_strs.split(" ");
				outimeformat += strb[0];
				outimeformat += "/";
				outimeformat += strs[1];
				outimeformat += "/";
				outimeformat += strs[0];
				outimeformat += " ";
				outimeformat += strb[1];
			}else{
				outimeformat = smsTime;
			}
			TempMessageOutArray[smsIndex] = new Array(7);
			TempMessageOutArray[smsIndex][0] = smsIndex;
			TempMessageOutArray[smsIndex][1] = smsTo;
			TempMessageOutArray[smsIndex][2] = smsSubject;
			TempMessageOutArray[smsIndex][3] = outimeformat;
			TempMessageOutArray[smsIndex][4] = psmIndex;
			TempMessageOutArray[smsIndex][5] = smslocation;
            TempMessageOutArray[smsIndex][6] = smsStatus;
	    	outimeformat = "";
			smsIndex++;
		})
	});
	if(_flagSms != "1"){
        refreshOutboxTableStatus(TempMessageOutArray);
    }
    smsOutboxInfoPoll();
}
//重新刷新发件箱数据 显示发送成功 发送失败 图标
function refreshOutboxTableStatus(val){
    var imageId;
    var spanId;
	var smsNumber = val.length;
	for(var i=0;i<smsNumber;i++){
		var arrayRow = val[i];
        imageId = "imageSmsOutboxStatus_" + i;
        if(arrayRow[6] == "unsend"){
            document.getElementById(imageId).src = "images/message/sms_unsend.png";
        }else if(arrayRow[6] == "delivered"){
            document.getElementById(imageId).src = "images/message/sms_arrived.png";
            spanId = "spanSmsOutbox_" + i;
            if(document.getElementById(spanId)){
                $("#" + spanId).hide();
            }
            $("#" + imageId).show();
        }
	}
}
//发件箱删除短信
function smsOutDelComfirm(){
	if (!checkDeleteOutRowNum()) {
		open_dialog_info(jQuery.i18n.prop("smsChose"));
	    return;
    }
	$("#lOutCoInfo").text(jQuery.i18n.prop("IComfInfo"));
	$("#comOutYes").val(jQuery.i18n.prop("comOutYes"));
	$("#comOutNo").val(jQuery.i18n.prop("comOutNo"));
	$("#smsOutDelComfDialog").dialog({
        modal:true,
        height: 150,
        width: 420,
        resizable:false,
        title: jQuery.i18n.prop("titleComfirm")
    });
}
//发件箱确认删除短信
function btnYesOutClickedComfirm(){
    $("#smsOutDelComfDialog").dialog("destroy");
	deleteOutSMSOk();
}
//取消删除短信
function btnNoOutClickedComfirm() {
    $("#smsOutDelComfDialog").dialog("destroy");
}
//删除发件箱函数
function deleteOutSMSOk(){
	var deleteSMSList = '';
	var smsIndex;
	var count = 0;
	
	if (!checkDeleteOutRowNum()) {
		open_dialog_info(jQuery.i18n.prop("smsChose"));
	    return;
    }
	for(var i=0;i<10;i++){
		var del = "delOutCheck" + i;
		if($("#"+del).attr("checked"))
		{
			smsIndex = _messageOutArray[i][4];
			deleteSMSList = deleteSMSList + smsIndex + ',' ;
			count++;
		}
	}
	var itemIndex = 0;
	mapData = new Array();
	mapData = putMapElement(mapData,"RGW/message_outbox/delete_message_table",deleteSMSList,itemIndex++);
    mapData = putMapElement(mapData,"RGW/message_outbox/page_number",1,itemIndex++);

	if(mapData.length > 0){
	    open_dialog_loading();
        $.cgi.postCmd("message_outbox", mapData, deleteOutSMSSuccessCallBack, deleteOutSMSFailCallBack, 50000);	
	}
}
//删除发件箱函数 成功回调函数
function deleteOutSMSSuccessCallBack(data,textStatus){
	refreshOutSMSList();
	$("#tableOutSMS label").removeClass("checked");
	//重新刷新发件箱数据
	displayOutAllMessage(data);
	close_dialog_loading();
}
//删除发件箱函数 失败回调函数
function deleteOutSMSFailCallBack(){
    close_dialog_loading();
	$("#lErrorOut").text(jQuery.i18n.prop("lErrorFailDelete"));
}
//刷新发件箱数据
function refreshOutSMSList(){
	$.cgi.sendCmd("message_outbox");
}
//发件箱第一页
function toFirstOutPage(){
	$("#lErrorOut").text("");
    $("#tableOutSMS label").removeClass("checked");
	var mapData = new Array();
	if(currentOutPage == "1"){
		return;
	}
	putMapElement(mapData,"RGW/message_outbox/page_number", 1, 0);
	if(mapData.length > 0){
		$.cgi.postCmd("message_outbox", mapData, displayOutAllMessage, null);	
	}
}
//发件箱上一页
function toUpOutPage(){
	$("#lErrorOut").text("");
    $("#tableOutSMS label").removeClass("checked");
	var mapData = new Array();
	if(currentOutPage == "1"){
		return;	 
	}
	var page_number = parseInt(currentOutPage) -1;
	putMapElement(mapData,"RGW/message_outbox/page_number", page_number, 0);
	if(mapData.length > 0){
		$.cgi.postCmd("message_outbox", mapData, displayOutAllMessage, null);	
	}
}
//发件箱下一页
function toNextOutPage(){
	$("#lErrorOut").text("");
    $("#tableOutSMS label").removeClass("checked");
	var mapData = new Array();
	if(currentOutPage == totalOutPage){
		return;
	}
	var page_number = parseInt(currentOutPage) +1;
	putMapElement(mapData,"RGW/message_outbox/page_number", page_number, 0);
	if(mapData.length > 0){
		$.cgi.postCmd("message_outbox", mapData, displayOutAllMessage, null);	
	}	
}
//发件箱最后一页
function toLastOutPage(){
	$("#lErrorOut").text("");
    $("#tableOutSMS label").removeClass("checked");
	var mapData = new Array();
	if(currentOutPage == totalOutPage){
		return;
	}
	putMapElement(mapData,"RGW/message_outbox/page_number", totalOutPage, 0);
	if(mapData.length > 0){
		$.cgi.postCmd("message_outbox", mapData, displayOutAllMessage, null);	
	}	
}
<!-- #############################################发件箱################################################### -->
<!-- #############################################草稿箱################################################### -->
//初始化草稿箱数据
function initDraftBox(){
	if($.hojyStatus.sim == "1") {
		$('#lErrorDraft').text(jQuery.i18n.prop("noSIM"));
		$("#sms_draft_label").hide();//隐藏草稿数量
		$("#tableDraftSMS").hide();//隐藏草稿箱数据
		$("#sms_draft_page").hide();//隐藏草稿箱页面操作
    } 
	else if ($.hojyStatus.sim == "2") {
        $('#lErrorDraft').text(jQuery.i18n.prop("uneffectSIM"));
        $("#sms_draft_label").hide();//隐藏草稿数量
		$("#tableDraftSMS").hide();//隐藏草稿箱数据
		$("#sms_draft_page").hide();//隐藏草稿箱页面操作
    }else{
		$("#lErrorDraft").text("");
        $.cgi.sendCmd('message_drafts');
		currentDraftPage = 0;
	}

	//点击每行，弹出对话框显示内容
	$(".messageDraftRow").live("click", function () {
        var index = $($(this).find(".contentdiv")).attr("ids");
        var no = $($(this).children("td")[1]).text();
        var dt = $($(this).children("td")[3]).text();
		
		var ms = _messageDraftArray[$($(this).find(".contentdiv")).attr("smsIndex")][2];
		
		$("#lBoxPeople").text(jQuery.i18n.prop("lBoxNumTo"));
		$("#lContent").text(jQuery.i18n.prop("lContent"));
		document.getElementById("textPeople").disabled = false;
		document.getElementById("textPeople").value = no;
		
		$("#tr_send1").hide();
		$("#tr_send2").hide();
		document.getElementById("SendContent").disabled = false;
		document.getElementById("SendContent").value = ms;
		$("#btnSmsSend").show();
		$("#btnSmsSave").show();
		$("#btnSmsReply").hide();
		$("#btnSmsTransmit").hide();
		gSmsBoxFlag = "2";
		gSmsId = index;
		draftNo = no;
		draftMs = ms;
		boxSendSmsDialog();
    });
}

//获取草稿箱数据成功回调函数
function displayDraftAllMessage(data){
	$("#lErrorDraft").text("");
	var smsTo, smsSubject, smsTime, psmIndex, smslocation;
	var smsIndex = 0;
	var xml = data;
	//每次都清空，在填充数据
	_messageDraftArray = null;
	_messageDraftArray = new Array(0);
	//每行数据处理
	var strs = new Array();
	var strb = new Array();
	var outimeformat= new Array();
	$(xml).find("message_list").each(function () {
		$(this).find("Item").each(function () {
			smsTo = $(this).find("addressee").text();
			smsSubject = $(this).find("message_content").text();
			smsTime = $(this).find("send_time").text();
			//系统是否格式化时间
			if(g_time_fomat == 1){
				strs = smsTime.split("-");
				strb = strs[2].split(" ");
				outimeformat += strb[0];
				outimeformat += "/";
				outimeformat += strs[1];
				outimeformat += "/";
				outimeformat += strs[0];
				outimeformat += " ";
				outimeformat += strb[1];
			}else{
				outimeformat = smsTime;
			}
			psmIndex = $(this).find("index").text();
			smslocation = $(this).find("location").text();
			_messageDraftArray[smsIndex] = new Array(6);
			_messageDraftArray[smsIndex][0] = smsIndex;
			_messageDraftArray[smsIndex][1] = smsTo;
			_messageDraftArray[smsIndex][2] = smsSubject;
			_messageDraftArray[smsIndex][3] = outimeformat;
			_messageDraftArray[smsIndex][4] = psmIndex;
			_messageDraftArray[smsIndex][5] = smslocation;
			outimeformat = "";
			smsIndex++;
		})
	});
	loadDraftTableData(_messageDraftArray);
	//总数
	smsDraftTotalNum = $(xml).find("total_number").text();
	//总页数
	currentDraftPage = $(xml).find("page_number").text();
	smsDraftNum = smsDraftTotalNum;
	//草稿箱数量
	$("#smsDraftNum").text("("+smsDraftNum+")");
	if (currentDraftPage == ""){
		currentDraftPage = 1;
	}
	if (smsDraftTotalNum == "0"){
		totalDraftPage = 1;
	}else if (parseInt(smsDraftTotalNum) > parseInt(smsDraftTotalNum / 10) * 10){
		totalDraftPage = parseInt(smsDraftTotalNum / 10) + 1;
	}else{
		totalDraftPage = parseInt(smsDraftTotalNum / 10);
	}
	//分页页码显示
	$("#vCurrentDraftPage").text(currentDraftPage + "/" + totalDraftPage);
	//每次刷新全选按钮重置
	$("#selectDraftAllCheckBox").removeClass("checked");
	$("#selectDraftAll").attr("checked",false);
	
}

//把获取到的草稿箱数据，生成表格数据，显示出来
function loadDraftTableData(val){
	var tableSMS = document.getElementById("tableDraftSMS");
	var tbodySMS = tableSMS.getElementsByTagName("tbody")[0];
	//清空表格数据
	clearTableRows("tableDraftSMS");
	//短信条数
	var smsNumber = val.length;
	for(var i=0;i<smsNumber;i++){
		var arrayRow = val[i];
		var row = tbodySMS.insertRow(-1);
		var colDelete = row.insertCell(0);
		var colTo = row.insertCell(1);
		var colSubject = row.insertCell(2);
		var colTime = row.insertCell(3);
		$(row).attr("class", "messageDraftRow");
		DELETEID = "DeleteDraft" + i;
		SUBJECTID = "SubjectDraft" + i;
		LOCATIONID = "LocationDraft" + i;
		var deleteDivId = "divDraftId" + i;
		var deleteCheckId = "delDraftCheck" + i;
		colTo.innerHTML = "<div class='nodiv'><span title='" + arrayRow[1] + "'>"+arrayRow[1]+"</span></div>";
		colSubject.innerHTML = "<div class='contentdiv' ids=" + arrayRow[4] + " smsIndex=" + arrayRow[0] + "><label id=" + SUBJECTID + " title='" + arrayRow[2] + "'>" + arrayRow[2] + "</label></div>";
		colTime.innerHTML = "<span>"+arrayRow[3]+"</span>";
		colDelete.innerHTML = "<div align='center' id=" + deleteDivId + "><input type='checkbox' style='display: none;align:center' id=" + deleteCheckId + "><label class='rowlabel checkbox' id=" + DELETEID + "></label></div>";
		$("#"+deleteDivId).hcheckbox();	
	}
}
//删除草稿箱短信确认框
function smsDraftDelComfirm(){
	if (!checkDeleteDraftRowNum()) {
	    open_dialog_info(jQuery.i18n.prop("smsChose"));
	    return;
    }
	$("#lDraftCoInfo").text(jQuery.i18n.prop("IComfInfo"));
	$("#comDraftYes").val(jQuery.i18n.prop("comDraftYes"));
	$("#comDraftNo").val(jQuery.i18n.prop("comDraftNo"));
	$("#smsDraftDelComfDialog").dialog({
        modal:true,
        height: 150,
        width: 420,
        resizable:false,
        title: jQuery.i18n.prop("titleComfirm")
    });
}
//确认删除草稿箱短信
function btnYesDraftClickedComfirm(){
    $("#smsDraftDelComfDialog").dialog("destroy");
	deleteDraftSMSOk();
}
//取消删除草稿箱短信
function btnNoDraftClickedComfirm() {
    $("#smsDraftDelComfDialog").dialog("destroy");
}
//删除草稿箱短信函数
function deleteDraftSMSOk(){
	var deleteSMSList = '';
	var smsIndex;
	var count = 0;
	
	if (!checkDeleteDraftRowNum()) {
	    open_dialog_info(jQuery.i18n.prop("smsChose"));
	    return;
    }
	for(var i=0;i<10;i++)
	{
		var del = "delDraftCheck" + i;
		if($("#"+del).attr("checked"))
		{
			smsIndex = _messageDraftArray[i][4];
			deleteSMSList = deleteSMSList + smsIndex + ',' ;
			count++;
		}
	}
	var itemIndex = 0;
	mapData = new Array();
	mapData = putMapElement(mapData,"RGW/message_drafts/delete_message_table",deleteSMSList,itemIndex++);
	mapData = putMapElement(mapData,"RGW/message_drafts/page_number",1,itemIndex++);
	if(mapData.length > 0)
	{
	    open_dialog_loading();
        $.cgi.postCmd("message_drafts", mapData, deleteDraftSMSSuccessCallBack, deleteDraftSMSFailCallBack, 50000);	
	}
}
//删除草稿箱短信函数成功回调函数
function deleteDraftSMSSuccessCallBack(data,textStatus){
	$("#tableDraftSMS label").removeClass("checked");
	displayDraftAllMessage(data);
	close_dialog_loading();
}
//删除草稿箱短信函数成功回调函数
function deleteDraftSMSFailCallBack(){
    close_dialog_loading();
	open_dialog_info(jQuery.i18n.prop("lErrorFailDelete"));
}
//选中所有草稿箱行函数
function selectDraftAllCheckBox(){
	if(document.getElementById("selectDraftAll").checked == true){
		for(var i=0;i<10;i++)
		{
			var del = "DeleteDraft"+i;
			var tmpdel = "delDraftCheck"+i;
			$("#"+del).removeClass("checked");
			$("#"+tmpdel).attr("checked",false);
		}
	}else{	
		for(var i=0;i<10;i++){
			var del = "DeleteDraft"+i;
			var tmpdel = "delDraftCheck"+i;
			$("#"+del).addClass("checked");
			$("#"+tmpdel).attr("checked",true);
		}
	}
}

//刷新草稿箱数据
function refreshDraftSMSList(){
	$.cgi.sendCmd("message_drafts");
}
//草稿箱第一页
function toFirstDraftPage(){
	$("#lErrorDraft").text("");
    $("#tableDraftSMS label").removeClass("checked");
	var mapData = new Array();
	if(currentDraftPage == "1"){
		return;
	}
	putMapElement(mapData,"RGW/message_drafts/page_number", 1, 0);
	if(mapData.length > 0){
		$.cgi.postCmd("message_drafts", mapData, displayDraftAllMessage, null);	
	}
}
//草稿箱上一页
function toUpDraftPage(){
	$("#lErrorDraft").text("");
    $("#tableDraftSMS label").removeClass("checked");
	var mapData = new Array();
	if(currentDraftPage == "1")
		return;	 
	var page_number = parseInt(currentDraftPage) -1;
	putMapElement(mapData,"RGW/message_drafts/page_number", page_number, 0);
	if(mapData.length > 0){
		$.cgi.postCmd("message_drafts", mapData, displayDraftAllMessage, null);	
	}
}
//草稿箱下一页
function toNextDraftPage(){
	$("#lErrorDraft").text("");
    $("#tableDraftSMS label").removeClass("checked");
	var mapData = new Array();
	if(currentDraftPage == totalDraftPage){
		return;
	}
	var page_number = parseInt(currentDraftPage) +1;
	putMapElement(mapData,"RGW/message_drafts/page_number", page_number, 0);
	if(mapData.length > 0){
		$.cgi.postCmd("message_drafts", mapData, displayDraftAllMessage, null);	
	}	
}
//草稿箱最后一页
function toLastDraftPage(){
	$("#lErrorDraft").text("");
    $("#tableDraftSMS label").removeClass("checked");
	var mapData = new Array();
	if(currentDraftPage == totalDraftPage){
		return;
	}
	putMapElement(mapData,"RGW/message_drafts/page_number", totalDraftPage, 0);
	if(mapData.length > 0){
		$.cgi.postCmd("message_drafts", mapData, displayDraftAllMessage, null);	
	}	
}
<!-- #############################################草稿箱################################################### -->

<!-- #######################################打开不同的短信菜单############################################# -->
//打开收件箱
function open_sms_in(){
	$("#sms_tab_in").show();
	$("#sms_tab_out").hide();
	$("#sms_tab_draft").hide();
	$("#sms_tab_setting").hide();
	//替换选中功能的ICON背景图片
	$("#sms_in_img").attr("src","images/sms/sms_in_active.png");
	$("#sms_out_img").attr("src","images/sms/sms_out.png");
	$("#sms_draft_img").attr("src","images/sms/sms_draft.png");
	$("#sms_setting_img").attr("src","images/sms/sms_setting.png");
	//初始化收件箱的数据
	initSMS();
}
//打开发件箱
function open_sms_out(){
	$("#sms_tab_in").hide();
	$("#sms_tab_out").show();
	$("#sms_tab_draft").hide();
	$("#sms_tab_setting").hide();
	//替换选中功能的ICON背景图片
	$("#sms_in_img").attr("src","images/sms/sms_in.png");
	$("#sms_out_img").attr("src","images/sms/sms_out_active.png");
	$("#sms_draft_img").attr("src","images/sms/sms_draft.png");
	$("#sms_setting_img").attr("src","images/sms/sms_setting.png");
	//实例化收件箱数据
	initOutBox();
}
//打开草稿箱
function open_sms_draft(){
	$("#sms_tab_in").hide();
	$("#sms_tab_out").hide();
	$("#sms_tab_draft").show();
	$("#sms_tab_setting").hide();
	//替换选中功能的ICON背景图片
	$("#sms_in_img").attr("src","images/sms/sms_in.png");
	$("#sms_out_img").attr("src","images/sms/sms_out.png");
	$("#sms_draft_img").attr("src","images/sms/sms_draft_active.png");
	$("#sms_setting_img").attr("src","images/sms/sms_setting.png");
	initDraftBox();
}
//打开短信设置
function open_sms_setting(){
	$("#sms_tab_in").hide();
	$("#sms_tab_out").hide();
	$("#sms_tab_draft").hide();
	$("#sms_tab_setting").show();
	//替换选中功能的ICON背景图片
	$("#sms_in_img").attr("src","images/sms/sms_in.png");
	$("#sms_out_img").attr("src","images/sms/sms_out.png");
	$("#sms_draft_img").attr("src","images/sms/sms_draft.png");
	$("#sms_setting_img").attr("src","images/sms/sms_setting_active.png");
	//初始化短信设置数据
	initSmsSetup();
}
//初始化当前短信显示的文字
function initSMSPageWords(){
	//lable
	$(".linbox").text(jQuery.i18n.prop("linbox"));
	$(".loutbox").text(jQuery.i18n.prop("loutbox"));
	$(".ldraft").text(jQuery.i18n.prop("ldraft"));
	$(".lSmsSet").text(jQuery.i18n.prop("lSmsSet"));
	$("#lBoxNumFrom").text(jQuery.i18n.prop("lBoxNumFrom"));
	$("#lBoxNumTo").text(jQuery.i18n.prop("lBoxNumTo"));
	$("#lDraftBoxNumTo").text(jQuery.i18n.prop("lBoxNumTo"));
	$(".lstate").text(jQuery.i18n.prop("lstate"));
	$(".lBoxDate").text(jQuery.i18n.prop("lBoxDate"));
	$(".lContent").text(jQuery.i18n.prop("lContent"));
	$("#lSmsReport").text(jQuery.i18n.prop("lSmsReport"));
	//button
	$("#btnSmsSetApply").val(jQuery.i18n.prop("btnSmsSetApply"));
	$("#btnSmsSend").val(jQuery.i18n.prop("btnSmsSend"));
	$("#btnSmsSave").val(jQuery.i18n.prop("btnSmsSave"));
	$("#btnSmsReply").val(jQuery.i18n.prop("btnSmsReply"));
	$("#btnSmsTransmit").val(jQuery.i18n.prop("btnSmsTransmit"));
	$("#btnSmsCancel").val(jQuery.i18n.prop("btnSmsCancel"));
}
<!-- ########################################打开不同的短信菜单############################################## -->

<!-- #############################################短信设置################################################### -->
//初始化短信设置函数
function initSmsSetup(){
	if($.hojyStatus.sim == "1") {
		$('#lSmsSetError').text(jQuery.i18n.prop("noSIM"));
		$("#sms_setting_label").hide();
		$("#sms_setting_table").hide();
    } else if ($.hojyStatus.sim == "2") {
        $('#lSmsSetError').text(jQuery.i18n.prop("uneffectSIM"));
        $("#sms_setting_label").hide();
		$("#sms_setting_table").hide();
    }else{
		$("#lSmsSetError").text("");
		$("#sms_setting_label").show();
		$("#sms_setting_table").show();
		$.cgi.sendCmd('message_set');
		$.cgi.onGetXml('message_set', getSmsSetData, failGetSmsSetData);
	}
}
//获取短信设置 成功回调函数
function getSmsSetData(data,textStatus){
	_sendReport = $(data).find("send_report").text();
	if (_sendReport == 1) {//开启
	setCheckboxsValue("sms_news_status",1)
	}else {//关闭
	    setCheckboxsValue("sms_news_status",0)
	}
}
//获取短信设置 失败回调函数
function failGetSmsSetData(){
	
}
//短信设置因应用提交函数
function PostSmsSet(){
	var pageSmsReport = getCheckboxsValue("sms_news_status");
	$("#lSmsSetError").text("");
	var mapData = new Array(0);
	mapData = putMapElement(mapData,"RGW/message_set/send_report",pageSmsReport,0);	
	open_dialog_loading();
    $.cgi.postCmd('message_set', mapData, successPostSmsSet, failPostSmsSet);   
}
//短信设置因应用 回调成功函数
function successPostSmsSet(data){
    close_dialog_loading();
    getSmsSetData(data);
    open_dialog_info(jQuery.i18n.prop("successApply"));
}
//短信设置因应用 回调失败函数
function failPostSmsSet(){
    close_dialog_loading();
    open_dialog_info(jQuery.i18n.prop("failApply"));
}
<!-- #############################################短信设置################################################### -->



<!-- #############################################短信公共################################################### -->
//确定重新发送
function btnYesClickedResend(){
    $("#ResendSmsDialog").dialog("destroy");
	sendSms(_smsAction);
}
//取消重新发送
function btnNoClickedResend() {
    $("#ResendSmsDialog").dialog("destroy");
    $.cgi.sendCmd('status1');
}
//打开短信发送对话框
function newSms(){
	$("#textPeople").val("");
	$("#lBoxPeople").text(jQuery.i18n.prop("lBoxNumTo"));
	$("#lContent").text(jQuery.i18n.prop("lContent"));
	document.getElementById("textPeople").disabled = false;
	document.getElementById("SendContent").value = "";
	$("#tr_send1").hide();
	$("#tr_send2").hide();
	document.getElementById("SendContent").disabled = false;
	document.getElementById("SendContent").value = "";
    $("#SendContent").removeAttr("readonly");
    smsAction = "new";
	$("#btnSmsSend").show();
	$("#btnSmsSave").show();
	$("#btnSmsReply").hide();
	$("#btnSmsTransmit").hide();
	gSmsBoxFlag = "-1";
	gSmsId = "-1";
	boxSendSmsDialog();
	$("#lSmsCount").text("");
}
//检查收件箱当前是否有选中删除的记录
function checkDeleteInRowNum(){
	var isCheck = false;
	for(var i=0;i<10;i++){
		var del = "delCheck" + i;
		if($("#"+del).attr("checked"))
		{
			isCheck = true;
		}
	} 
	return isCheck;
}
//检查草稿箱当前是否有选中删除的记录
function checkDeleteDraftRowNum(){
	var isCheck = false;
	for(var i=0;i<10;i++){
		var del = "delDraftCheck" + i;
		if($("#"+del).attr("checked"))
		{
			isCheck = true;
		}
	}
	return isCheck;
}
//检查发件箱当前是否有选中删除的记录
function checkDeleteOutRowNum(){
	var isCheck = false;
	for(var i=0;i<10;i++)
	{
		var del = "delOutCheck" + i;
		if($("#"+del).attr("checked"))
		{
			isCheck = true;
		}
	}
	return isCheck;
}
//初始化发送短信对话框
function boxSendSmsDialog(){
	$("#lErrorSendSms").text("");
	_flagSms = "0";
	textareaMaxProc();
	open_BoxSendSmsDialog();
}

//发送短信
function sendSms(action){
	var pagePeople = $.trim($("#textPeople").val());
	var pageContent = document.getElementById("SendContent").value;
	_smsAction = action;
	$("#lErrorSendSms").text("");
	
    if(isValidSms(pagePeople,pageContent,_smsAction))
    {
        $("#lErrorSendSms").text("");
		var index = 0;
		var mapData = new Array(0);
		mapData = putMapElement(mapData,"RGW/send_message/mailbox_flag",gSmsBoxFlag,index++);
		mapData = putMapElement(mapData,"RGW/send_message/message_id",gSmsId,index++);
		mapData = putMapElement(mapData,"RGW/send_message/action",action,index++);
		mapData = putMapElement(mapData,"RGW/send_message/addressee",pagePeople,index++);
		mapData = putMapElement(mapData,"RGW/send_message/message_content",pageContent,index++);
		open_dialog_loading();
		_flagSms = "1";
		$.cgi.postCmd("send_message", mapData, sendSmsSuccessCallBack, sendSmsFailCallBack, 50000);
	}
}
//发送短信成功回调函数
function sendSmsSuccessCallBack(data) {
    close_dialog_loading();
    _flagSms = "0";
    //短信发送状态
	var state = "";
	//_smsAction等于1时，表示发送短信
	if(_smsAction == "1"){
		state = $(data).find("send_state").text();
	}
	else{
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
		//关闭短信发送窗口
		btnCancelSmsDialog();
	}
    $.cgi.sendCmd('message_drafts');
    $.cgi.sendCmd('message_outbox');
	$.cgi.sendCmd('message');
}
//发送短信失败回调函数
function sendSmsFailCallBack(){
	close_dialog_loading();
	_flagSms = "0";
	ResendSms();
}
//重新发送短信
function ResendSms(){
	var str = "";
	if(_smsAction == "1")
	{
		str = jQuery.i18n.prop("titleResend");
		$("#lReInfo").text(jQuery.i18n.prop("lResendInfo"));
	}
	else
	{
		str = jQuery.i18n.prop("titleResave");
		$("#lReInfo").text(jQuery.i18n.prop("lResaveInfo"));
	}
	$("#btnYes").val(jQuery.i18n.prop("btnYes"));
	$("#btnNo").val(jQuery.i18n.prop("btnNo"));
	$("#ResendSmsDialog").dialog({
        modal:true,
        height: 150,
        width: 420,
        resizable:false,
        title: str
    });
}

//检验短信内容最大值函数
function textareaMaxProc(){
	var textareaValue = document.getElementById("SendContent").value;
	var total;
    if(isChineseChar(textareaValue)){
		total = 200;
    }else{
		total = 450;
	}
	if (textareaValue.length <= total){
        last_length = textareaValue.length;
        last_content = textareaValue;
        $("#lErrorSendSms").text("");
	}
	if (textareaValue.length > total){
        if (smsAction == "view"){
            document.getElementById("SendContent").value = textareaValue;
            $("#lSmsCount").text("(" + textareaValue.length + "/" + textareaValue.length + ")");
        }else{
            document.getElementById("SendContent").value = textareaValue.substr(0,total);
            $("#lSmsCount").text("(" + total + "/" + total + ")");
			open_dialog_info(jQuery.i18n.prop("inputFull"));
        }
	}else{
		$("#lSmsCount").text("(" + textareaValue.length + "/" + total + ")");
	}
}
//关闭发送短信对话框
function btnCancelSmsDialog(){
	$("#SmsSendDialog").dialog("destroy");
}
//检查电话号码是否正确
function checkPhoneNumber() {
	var phoneNumber = document.getElementById("textPeople").value;
	var newPhoneNumber = phoneNumber.replace(/[^\d]/g, "");
	var firstChar = phoneNumber.charAt(0);
		       
    if (firstChar == '+'){
 		document.getElementById("textPeople").value = firstChar + newPhoneNumber;
 	}else{
		document.getElementById("textPeople").value = newPhoneNumber;
	}
}
//验证发送短信数据
function isValidSms(addressee, content, action){
	if(gSmsBoxFlag == "2" && _smsAction == "2" && draftNo == addressee && draftMs == content){
		open_dialog_info(jQuery.i18n.prop("lErrorSend5"));
		return false;
	}
	if(addressee == ""){
		open_dialog_info(jQuery.i18n.prop("lErrorSend1"));
		return false;
	}
	var re = /^(\+)?\d{1,20}$/;
	if (!re.test(addressee)) {
		open_dialog_info(jQuery.i18n.prop("lErrorSend2"));
		return false;
	}
	if(isChineseChar(content)){
		if(content.length > 200){
			open_dialog_info(jQuery.i18n.prop("lErrorSend3"));
			return false;
		}
	}else{
		if(content.length > 450){
			open_dialog_info(jQuery.i18n.prop("lErrorSend4"));
			return false;
		}
	}
	if((content.length == 0) && (action == "1")){
        open_dialog_info(jQuery.i18n.prop("lErrorSend7"));
        return false;
    }
    if($.trim(content) == ""){
    	open_dialog_info(jQuery.i18n.prop("lErrorSend7"));
        return false;
    }
    return true;
}

//短信提醒函数
var _message_unread_number = -1;
function getMessageStateSuccessCallBack(xmlData) {
	//获取未读短信数量
    var unread_number = $(xmlData).find("unread_message_number").text();
    //更新未读短信数量
	$("#topunreadsmsnum").text(unread_number);
	//短信提醒是否开启
    if (newsms_remind == 1){
        if(unread_number != ""){
	        if(_message_unread_number != -1){
	            if(unread_number > _message_unread_number){
	            	//获取最新未读短信
					$.cgi.sendCmd("message");
					//右下角显示最新短信内容,延迟3秒显示
					setTimeout(function(){
						open_top_unread_sms();
					},3000);
	            }
	        }
	        _message_unread_number = unread_number;
	    }
    }
}

//最新未读短息全局变量
var top_smsIndex = "";
var	top_smsFrom = "";
var	top_smsSubject = "";
var	top_outimeformat = "";
var	top_smsStatus = "";
var	top_psmIndex = "";
var	top_smslocation = "";

function open_top_unread_sms(){
	top_smsIndex = _messageArray[0][0];
	top_smsFrom = _messageArray[0][1];
	top_smsSubject = _messageArray[0][2];
	top_outimeformat = _messageArray[0][3];
	top_smsStatus = _messageArray[0][4];
	top_psmIndex = _messageArray[0][5];
	top_smslocation = _messageArray[0][6];
	//组装未读短信内容
	loadUnreadSmsTable(top_smsFrom,top_smsSubject,top_outimeformat,top_psmIndex,top_smsStatus);
}

//查看首页未读短信
function read_top_unread_sms(smsFrom,smsSubject,outimeformat,smsIndex,smsStatus){
	$("#lBoxPeople").text(jQuery.i18n.prop("lBoxNumFrom"));
	$("#textPeople").hojyBnEnable(true);   
	$("#textPeople").val(smsFrom);
	$("#tr_send1").show();
	$("#tr_send2").show();
	$("#textDate").text(outimeformat);
	$("#SendContent").attr("readonly","readonly");
    smsAction = "view";
	document.getElementById("SendContent").value = smsSubject;
	$("#btnSmsSend").hide();
	$("#btnSmsSave").hide();
	$("#btnSmsReply").show();
	$("#btnSmsTransmit").show();
	gSmsBoxFlag = "-1";
	gSmsId = "-1";
	if (smsStatus == "0") {
        changeSMSReadStatus(smsIndex);
    }
	boxSendSmsDialog();
}

//组装未读短信内容 发件人 内容 时间 短信标记下标
function loadUnreadSmsTable(smsFrom,smsSubject,outimeformat,smsIndex,smsStatus){
	var smsTable = "<div onclick=\"read_top_unread_sms("+"'"+smsFrom+"'"+","+"'"+smsSubject+"'"+","+"'"+outimeformat+"'"+","+"'"+smsIndex+"'"+","+"'"+smsStatus+"'"+")\">";
	smsTable += "<table width='100%' style='font-size:14px;'>";
	smsTable += "<tr>";
	smsTable += "<td>";
	smsTable += smsSubject;
	smsTable += "</td>";
	smsTable += "</tr>";
	smsTable += "<tr>";
	smsTable += "<td style='text-align:right;'>";
	smsTable += outimeformat;
	smsTable += "</td>";
	smsTable += "</tr>";
	smsTable += "</table>";
	smsTable += "<div>";  
	//打开首页短信未读短信提示框
	if(CheckPage()){
		$("#smsTipBoxContent").html(smsTable);
		open_SmsTipBoxDial(smsFrom);
	}else{
		DCS.util.showTip("success",smsFrom,smsTable,true);
	}	 
}
<!-- #############################################短信公共################################################### -->