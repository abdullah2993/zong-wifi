$(function() {
    //初始化页面文字
   initUploadPageWords();
   //查看下载升级包进度
   $.cgi.onGetXml('download_local_upgrade', downloadStateSuccess, downloadStateFail);
   //获取升级信息
   $.cgi.onGetXml('upgrade_info', onGetInfoSuccess);
});

//初始化当前升级页面显示的文字
function initUploadPageWords(){
    $("#loadversiontitle").text(jQuery.i18n.prop("loadversiontitle"));
    $("#applicationversiontitle").text(jQuery.i18n.prop("applicationversiontitle"));
    $("#showFileName").text(jQuery.i18n.prop("showFileName"));
    $("#upgradefiletitle").text(jQuery.i18n.prop("upgradefiletitle"));
}

<!-- #####################################软件升级公共变量######################################## -->
var _upgradetimer;
var _localUpgradeDownloadTimer;
var _gUpgradeMode = "2";
var downloadProgress;
var size;
var firstGetcheck = 0;
var isSendDownload = 0;
var repeattime = 0;
var isSetCheckCmd = 0; //是否下发查询命令，0未下发，1已下发
var isQueried = "no";//是否已经查询过
var internetConn;
var percent = 0;//raos for bug 7393 on 2013-03-13
var descInfo = "";
var _upgradeOptTime = new Date();//升级时间
var _localUpgradeCheckCount = 0;
var remindUpgradeVersion = "no";//当前登录中，如果有升级包，是否已经提醒过。

//升级包提醒框每次打开web，只提醒一次
function checkNewVersionRemind(){
    if(remindUpgradeVersion == "no"){
        boxMBConfirmFactory(jQuery.i18n.prop("ldialMessage"), jQuery.i18n.prop("loadvertiontip2"), function () {
            //打开升级页面
            $("#nav-link-4").click();
        });
        //重置是否已经提示过标记
        remindUpgradeVersion = "yes";
    }
}

//初始化升级页面数据
function loadUpgradePage(){
    initLanguageRes();
    if($.hojyStatus.upgradeMode == "1")//量产
    {
        if(isQueried == "yes"){
            checkNewVersion();
        }else{
            postCheckNewVersion();
            isQueried = "yes";
        }
        firstGetcheck = 0;
        isSetCheckCmd = 0; 
        repeattime = 0;
    }
}

//加载页面文字
function initLanguageRes() {
    $("#divLoadNewVersion").val(jQuery.i18n.prop("download"));
    $("#upFileSel").val(jQuery.i18n.prop("upFileSel"));
    $("#btUpgrade").val(jQuery.i18n.prop("btUpgrade"));
    $("#btUpgradeMP").val(jQuery.i18n.prop("btUpgrade"));
    $("#divUpgradeCancel").val(jQuery.i18n.prop("btnCancel"));
    $("#divUpgradeApply").val(jQuery.i18n.prop("btnApply"));
    $("#pathVersion").html("");
    
    if($.hojyStatus.upgradeMode == "1"){//量产
        $("#tipVersion").text(jQuery.i18n.prop("tiploadingvertion"));
    }else{
        $("#tipVersion").text(jQuery.i18n.prop("loadvertiontip1"));
    }
    $("#tipUpgradeInfo").hide();
    $("#tipUpgradeInfo").html("");
}

//发upgrade_info消息,查询版本信息
function checkNewVersion() {
    if ($.hojyStatus.sim == 0) {
        $.cgi.sendCmd('upgrade_info');
    }else {
        $("#tipVersion").text(jQuery.i18n.prop("noconnection"));
    }
}

//触发查询服务查询
function postCheckNewVersion() {
    var mapData = new Array(0);
    g_objXML.putMapElement(mapData, 0, "RGW/upgrade_info/Action", "1");
    $.cgi.postCmd("upgrade_info", mapData, function () {
        clearTimeout(_upgradetimer);
        _upgradetimer = setTimeout(checkNewVersion, 3000);
    }, function () {
        clearTimeout(_upgradetimer);
        _upgradetimer = setTimeout(checkNewVersion, 3000);
    });
}

//查询下载状态 成功回调函数
function downloadStateSuccess(xmlData){
    var downloadState = $(xmlData).find("download_state").text();
    if(downloadState == "deliver"){
        clearTimeout(_localUpgradeDownloadTimer);
        _localUpgradeDownloadTimer = setTimeout(localUpgradeDownloadState, 2000);
    }else if(downloadState == "finish"){
        clearTimeout(_localUpgradeDownloadTimer);
        localUpgradeCouterInit();
        localUpgradeApplyResult();
    }else{
        clearTimeout(_localUpgradeDownloadTimer);
        $("#upgradlg").dialog("destroy");
        open_dialog_info(jQuery.i18n.prop("upgradeFailed"));
    }
}

//查询下载状态 失败回调函数
function downloadStateFail(){
    clearTimeout(_localUpgradeDownloadTimer);
    $("#upgradlg").dialog("destroy");
    open_dialog_info(jQuery.i18n.prop("upgradeFailed"));
}

//取得upgrade_info值之后的响应函数
function onGetInfoSuccess(data, textStatus) {
    var xmlData = data;
    var upgradeInfo = $(xmlData).find("upgrade_info").find("Upgradeinfo");
    _gUpgradeMode = upgradeInfo.find("UpgradeModel").text();
    var forceToUpgrade = upgradeInfo.find("ForceUpgrade").text();
    var upgradeState = upgradeInfo.find("UpgradeState").text();
    /*query info*/
    var queryInfo = $(xmlData).find("upgrade_info").find("Upgradeinfo").find("Query");
    var bNewVersion = queryInfo.find("NewPackage").text();
    var urlVersion = queryInfo.find("URL").text();
    var queryErrno = queryInfo.find("QueryErrno").text();
    var size = queryInfo.find("Size").text();
    /*download info*/
    var downloadInfo = $(xmlData).find("upgrade_info").find("Upgradeinfo").find("Download");
    var downloadErrno = downloadInfo.find("DownloadErrno").text();
    var downloadProgress = downloadInfo.find("DownloadProgress").text();
    //showing information of upgrade
    var lan = getCookie("locale");
    lan = (lan == "cn") ? "cn" : "en";
    descInfo = queryInfo.find("Desc_"+lan).text();
    descInfo = descInfo.replace(/\n/g,"<br />");
    $("#tipUpgradeInfo").hide();
    $("#tipUpgradeInfo").html("");
    $("#divUpgradeBtn").hide();
    //检查当前是否连接网络
    if (!(gConn_disConn == "cellular" && (gIpAddressInternet != "" || gIpv6AddressInternet != ""))){
        $("#tipVersion").text(jQuery.i18n.prop("networkNotOk"));
        $("#divUpgradeBtn").hide();
        $("#divUpgradeCancel").hide();
        $("#divUpgradeApply").hide();
        $('#progressbar').hide();
        return;
    } 
    if (forceToUpgrade != 1) {
        if (firstGetcheck == 0) {
            if (bNewVersion == 1){
                isSetCheckCmd = 1;
                setUpdateModel(bNewVersion, urlVersion);
            }else {
                $("#tipVersion").text(jQuery.i18n.prop("tiploadingvertion"));
            }
            firstGetcheck = 1;
        }
        //queryErrno的状态有五种：0，默认状态；1.查询状态；2.查询成功；3.查询失败；4.未知情况
        if (isSetCheckCmd == 0){
            if (queryErrno == 0) {
                if (firstGetcheck != 1){
                    postCheckNewVersion();
                }
            } else if (queryErrno == 1) {
                $("#tipVersion").text(jQuery.i18n.prop("tiploadingvertion"));
                $("#divUpgradeBtn").hide();
                $("#divUpgradeCancel").hide();
                $("#divUpgradeApply").hide();
            } else if (queryErrno == 2) {
                if (bNewVersion == 0) {
                    $("#divUpgradeBtn").hide();
                    $("#divUpgradeCancel").hide();
                    $("#divUpgradeApply").hide();
                }else{
                    isSetCheckCmd = 1;
                    setUpdateModel(bNewVersion, urlVersion);
                }
            } else if (queryErrno == 3) {
                $("#divUpgradeBtn").hide();
                $("#divUpgradeCancel").hide();
                $("#divUpgradeApply").hide();
            } else {
                $("#tipVersion").text(jQuery.i18n.prop("loadvertiontip1"));
                $("#divUpgradeBtn").hide();
                $("#divUpgradeCancel").hide();
                $("#divUpgradeApply").hide();
            }

            //查询三次之后依然无结果，判定为最新版本
            if (repeattime >= 3) {
                isSetCheckCmd = 1;
                $("#tipVersion").text(jQuery.i18n.prop("loadvertiontip1"));
            }
            
            clearTimeout(_upgradetimer);
            _upgradetimer = setTimeout(checkNewVersion, 4000);
            repeattime++;
        }
        // 触发服务器查询 设定初始状态
        setUpdateModel(bNewVersion, urlVersion);

        // UpgradeState 1 :正在下载 2:下载完成等待应用
        if (upgradeState == 1) {
	    //显示升级包信息
	    $("#tipVersion").text(jQuery.i18n.prop("downloadingInfo"));
	    $("#tipUpgradeInfo").html("<div>"+descInfo+"</div>");
	    $("#tipUpgradeInfo").show();
	    //隐藏应用升级按钮
            $("#divUpgradeBtn").hide();
            $("#divUpgradeCancel").show(); 
            percent = parseInt(downloadProgress);
            if (percent > 100){
               percent = 100;
            }
           
            $('#progressbar').progressbar({ value: percent }).show().children('.ui-progressbar-value').html(Math.round(percent) + '%').css("display", "block");
            //继续查询
            clearTimeout(_upgradetimer);
            _upgradetimer = setTimeout(checkNewVersion, 1000);
        }else if (upgradeState == 2) {
			//下载完成，电量低于40%，不允许应用
            if (_batteryCapacity < 40) {
                $("#tipVersion").text(jQuery.i18n.prop("notEnoughBattery"));                
                open_dialog_info(jQuery.i18n.prop("notEnoughBattery"));              
                $("#divUpgradeBtn").hide();
                $("#divUpgradeCancel").hide();
                $("#divUpgradeApply").hide();
                $('#progressbar').hide();
            }else{
                onUpgradeApply();
            }
        }else if(upgradeState == "") {
            //获取节点信息失败，继续查
            clearTimeout(_upgradetimer);
            _upgradetimer = setTimeout(checkNewVersion, 5000);
        }else {
            $("#divUpgradeCancel").hide();
            $("#divUpgradeApply").hide();
            $('#progressbar').hide();
        }
    }else{
        $("#tipVersion").text(jQuery.i18n.prop("loadvertiontip1"));
        $("#divUpgradeBtn").hide();
        $("#divUpgradeCancel").hide();
        $("#divUpgradeApply").hide();
        $('#progressbar').hide();
    }
}

//升级模式：0，升级禁用；1，离线升级；2，在线升级 如果发现当前正处于在线升级过程中，直接进入在线升级进度条状态
function setUpdateModel(bNewVersion, urlVersion) {
   if("1" == bNewVersion){ 
        //发现最新版本弹框提醒
        checkNewVersionRemind();
        //发现最新版本建议您升级
        $("#tipVersion").text(jQuery.i18n.prop("loadvertiontip2"));
        $("#tipUpgradeInfo").html("<div>"+descInfo+"</div>");
        $("#tipUpgradeInfo").show();
        $("#divUpgradeBtn").show();
        setVersionPath(urlVersion);
    }
}

//设置升级包下载地址
function setVersionPath(verPath) {
    $("#pathVersion").attr("href", verPath);
    $("#pathVersion").html(verPath);
}

//分在线取版本与离线取版本两种
function onLoadNewVersion() {
    var loadVersion = document.getElementById("pathVersion");
    loadVersion.click();
}

//应用本地升级按钮点击函数
function upgradeOffLine() {
    //判断当前电量是否充足
    if (_batteryCapacity < 40) {            
        open_dialog_info(jQuery.i18n.prop("notEnoughBattery"));
        return;
    }

    //判断本地升级包是否为zip压缩包，以及是否为空文件
    if (document.getElementById("uptextfield").value != "") {
        if (-1 == document.getElementById("uptextfield").value.toString().lastIndexOf(".zip")) {
            open_dialog_info(jQuery.i18n.prop("lErrorUpgrade"));
        }else {
            var url;
            var host = window.location.protocol + "//" + window.location.host;
            url = host + getHeader("GET", "upgrade");
            document.getElementById("uploadFileForm").action = url;
            document.getElementById("btnSoftSubmit").click();
            //弹出升级框
            initDlg();
            _localUpgradeDownloadTimer = setTimeout(localUpgradeDownloadState, 2000);
        }
    }else{
        open_dialog_info(jQuery.i18n.prop("lErrorInputNull"));
    }
}

//升级进度框
function initDlg() {
    $("#dlgupgradewarn").html(jQuery.i18n.prop("dlgupgradewarn1"));
    $("#upgradlg").dialog({
        modal: true,
        height: 177,
        width: 526,
        resizable: false,
        title: jQuery.i18n.prop("upgradingtitle")
    });
}

//触发升级
function divOnlineUpgradeAction() {
    //本地升级字段为0,1为离线，2为在线
    if($.hojyStatus.upgradeMode == "1")//量产，在线升级
    {
        if("2" == _gUpgradeMode){
            upgradeOnLine();
        }else{
            open_dialog_info("Unknow Upgrade Mode:" + _gUpgradeMode);
        }
    }
}

//本地升级DIV
function divLocalUpgradeAction(){
    upgradeOffLine();
}

//取消在线升级
function onUpgradeCancel() {
    _upgradeOptTime = new Date();
    clearTimeout(_upgradetimer);
    $("#divUpgradeBtn").show();
    $("#divUpgradeCancel").hide();
    $("#divUpgradeApply").hide(); 
    $('#progressbar').hide();
    var mapData = new Array(0);
    g_objXML.putMapElement(mapData, 0, "RGW/upgrade_info/Action", "11");
    $.cgi.postCmd("upgrade_info", mapData, null, null);
}

//应用新版本
function onUpgradeApply() {
    _upgradeOptTime = new Date();
    clearTimeout(_upgradetimer);
    $("#divUpgradeCancel").hide();
    $("#divUpgradeBtn").hide();
    $("#divUpgradeApply").show();
    $('#progressbar').hide();
    $("#tipVersion").text(jQuery.i18n.prop("tipPackageDownloadComplete"));
    var sMsg = jQuery.i18n.prop("lConfirmApply");

    //确认升级提示框
    boxMBConfirmFactory(jQuery.i18n.prop("titleApply"), sMsg, function () {
        var mapData = new Array(0);
        g_objXML.putMapElement(mapData, 0, "RGW/upgrade_info/Action", "20");
        $.cgi.postCmdSynch("upgrade_info", mapData, function (){
            //退出到登录页面
            $.hojyStatus.isLogin = false;
             //清除定制刷新事件
            clearTimeout(timer);
            $("#login").show();
            $("#content").hide();
            $("body").attr("class", "login_body");
            //隐藏左右两边广告窗口
            $("#index_float_left").hide();
            $("#index_float_right").hide();
            $("#index_float_bottom").hide();
        }, null);
    });
}

//在线升级
function upgradeOnLine() {
    $("#divUpgradeBtn").hide();
    $("#divUpgradeCancel").show();
    $('#progressbar').progressbar({ value: 0 }).show().children('.ui-progressbar-value').html(Math.round(0) + '%').css("display", "block");
    //下载
    var mapData = new Array(0);
    g_objXML.putMapElement(mapData, 0, "RGW/upgrade_info/Action", "10");

    $.cgi.postCmd("upgrade_info", mapData, function () {
        clearTimeout(_upgradetimer);
        _upgradetimer = setTimeout(checkNewVersion, 2000);
        isSendDownload = 1;
    }, null);
}

//获取下载本地升级包进度
function localUpgradeDownloadState(){
    $.cgi.sendCmd("download_local_upgrade");
}

//实例化检查本地升级次数
function localUpgradeCouterInit(){
    _localUpgradeCheckCount = 0;
}

//应用本地升级，查询次数累计
function localUpgradeCouterIncrease(){
    _localUpgradeCheckCount++;
}

//应用本地升级，查询最大次数
function localUpgradeCouterReachMax(){
    if(_localUpgradeCheckCount >= 60){
        return true;
    }else{
        return false;
    }
}

//获取本地升级返回结果数据
function localUpgradeApplyResult(){
    var mapData = new Array(0);
    g_objXML.putMapElement(mapData, 0, "RGW/upgrade_apply_info/result", "get");
    $.cgi.postCmd("upgrade_info", mapData, localUpgradeResultRecvSuccess,localUpgradeResultRecvFail, 3000);
}

/*
 *应用升级时 返回的编码对应的作用
 *errno                           =-1,//此值返回出错
 *APPLY_IDLE                      = 0,//正在上传文件
 *APPLY_BUSY                      = 1,//正在应用升级
 *APPLY_SUCC                      = 2,//应用完成
 *APPLY_REBOOT_WAIT               = 3,//准备工作已经做好，等待重启
 *APPLY_REBOOT_FAIL               = 4,//设备重启失败
 *APPLY_NOT_APPLY_STATE           = 5,//应用状态错误
 *APPLY_NOTIFY_TO_TASK_FAIL       = 6,//未发现应用任务进程
 *APPLY_LOCAL_DLOAD_BUSY          = 7,//下载本地升级包错误
 *APPLY_LOCAL_SAVE_PARAM_ERR      = 8,//本地升级参数错误
 *APPLY_LOW_POWER                 = 9,//电量过低
 *APPLY_SET_FOTA_COOKIE_ERR       = 10,//设置升级标记错误
 *APPLY_MD5_CHECK_FAIL            = 11,//MD5检验失败
*/
function localUpgradeResultRecvSuccess(xmlData){
    var upgradeInfo = $(xmlData).find("upgrade_info").find("Upgradeinfo");
    var applyResultText = upgradeInfo.find("Apply").find("ApplyErrno").text();
    var applyResult = parseInt(applyResultText);
    if((applyResult == 0) || (applyResult == 1)){
        //继续查询应用状态
        clearTimeout(_upgradetimer);
        localUpgradeCouterIncrease();
        if(localUpgradeCouterReachMax() == true){
            localUpgradeApplyFail();
            return;
        }
        _upgradetimer = setTimeout(localUpgradeApplyResult, 1000);
    }else if((applyResult == 2) || (applyResult == 3)){
        clearTimeout(_upgradetimer);//应用成功
        upgradeExit();
    }else{
        localUpgradeApplyFail();//应用失败
    }
}

function localUpgradeApplyFail(){
    clearTimeout(_upgradetimer);
    $("#upgradlg").dialog("destroy");
    open_dialog_info(jQuery.i18n.prop("upgradeFailed"));
}

function localUpgradeResultRecvFail(){
    //应用成功（设备已经重启，导致获取数据失败）
    upgradeExit();
}

function upgradeExit() {
    $("#upgradlg").dialog("destroy");
    $.hojyStatus.isLogin = false;
    clearTimeout(timer);
    $("#login").show();
    $("#content").hide();
    $("body").attr("class", "login_body");
    //隐藏左右两边广告窗口
    $("#index_float_left").hide();
    $("#index_float_right").hide();
    $("#index_float_bottom").hide();
    return;
}