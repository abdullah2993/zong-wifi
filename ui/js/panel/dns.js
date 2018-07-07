$(function(){
	//实例化DNS获取方式，手动还是自动 0-关闭 1-开启
	initCheckboxs("auto_dns_checkbox");
	initDNSPageWords();
	//注册获取DNS数据事件
	$.cgi.onGetXml('dns', getDnsData, failPostDnsSet);
});
<!-- ####################################  公共变量  ############################### -->
var dnsMode; // dns模式
var dnsPreferIp; //首选ip地址
var dnsStandbyIp; //备用IP地址
var _dnsxmlData = ''; 
var _dnscontrolMapExisting=new Array(0);
var _dnscontrolMapCurrent=new Array(0);
<!-- ####################################  公共变量  ############################### -->
<!-- ####################################  DNS函数  ############################### -->
//初始化DNS
function initDnsSetting() {
    $.cgi.sendCmd('dns');
}
//选中自动获取DNS服务器地址
function auto_dnsserver_click(){
	$("#preferDnsText").hojyBnEnable(false);
    $("#standbyDnsText").hojyBnEnable(false); 
}
//选中手动获取DNS服务器地址
function manual_dnsserver_click(){
    $("#preferDnsText").hojyBnEnable(true);
    $("#standbyDnsText").hojyBnEnable(true);
}

//选择自动获取DNS服务器按钮
function dns_auto_click(){
    $("#manual_dns_input_table").hide();
    
}
//选择手动输入DNS服务器按钮
function manual_auto_click(){
    $("#manual_dns_input_table").show();    
}

//获取DNS数据 成功回调函数
function getDnsData(data,textStatus){
    _dnsxmlData = data;
	dnsMode =  $(_dnsxmlData).find("mode").text();
    dnsPreferIp = $(_dnsxmlData).find("preferIp").text();
    dnsStandbyIp = $(_dnsxmlData).find("standbyIp").text();
    var index=0;
    _dnscontrolMapExisting = g_objXML.putMapElement(_dnscontrolMapExisting,index++, "RGW/dns/mode", dnsMode);
    _dnscontrolMapExisting = g_objXML.putMapElement(_dnscontrolMapExisting,index++, "RGW/dns/preferIp", dnsPreferIp);      
    _dnscontrolMapExisting = g_objXML.putMapElement(_dnscontrolMapExisting,index++, "RGW/dns/standbyIp", dnsStandbyIp);
    _dnscontrolMapCurrent = g_objXML.copyArray(_dnscontrolMapExisting,_dnscontrolMapCurrent);
    displayDnsData();
}

//显示DNS页面数据
function displayDnsData() {
	$("#preferDnsText").val(dnsPreferIp);
	$("#standbyDnsText").val(dnsStandbyIp);
	
    if (dnsMode == 0) {//自动获取DNS服务器
        setCheckboxsValue("auto_dns_checkbox",0);
        $("#preferDnsText").hojyBnEnable(false);
		$("#standbyDnsText").hojyBnEnable(false);
    }else {//手动获取DNS服务器
        setCheckboxsValue("auto_dns_checkbox",1);
        $("#preferDnsText").hojyBnEnable(true);
        $("#standbyDnsText").hojyBnEnable(true);
    }
}
//验证DNS地址 格式是否合法
function isValidDns(preferIP, standbyIIP){
    if (!(isIPFULL(preferIP, true) && isIPFULL(standbyIIP, true))) {
        open_dialog_info(jQuery.i18n.prop("lIPErrorMsg"));
        return false;
    }
    var partsPageIpPrefer = preferIP.split(".");
    var partsPageIpStandby = standbyIIP.split(".");
	if(parseInt(parseFloat(partsPageIpPrefer[0])) == 0 || parseInt(parseFloat(partsPageIpPrefer[0])) == 255 || parseInt(parseFloat(partsPageIpPrefer[3])) == 255){
		open_dialog_info(jQuery.i18n.prop("lIPErrorEdit4"));
		return false;
	}
    return true;
}
//DNS应用提交函数
function PostDnsSet(){
    var pageIpPrefer = $("#preferDnsText").val();
    var pageIpStandby= $("#standbyDnsText").val();
    var pageDnsAuto = getCheckboxsValue("auto_dns_checkbox");
    var index=0;
    var mapData = new Array(0);
    //在应用的时候判断是选择 0-自动 1-手动输入
    if (pageDnsAuto == 1) {
        //判断输入地址是否符合格式要求
        if(!validateIPAddress(pageIpPrefer)){
            open_dialog_info(jQuery.i18n.prop("lIPErrorMsg"));
            return;
        }
        if(!validateIPAddress(pageIpStandby)){
            open_dialog_info(jQuery.i18n.prop("lIPErrorMsg"));
            return;
        }
        //判断输入地址是否符合范围要求
		if (isValidDns(pageIpPrefer, pageIpStandby)) {
			_dnscontrolMapCurrent[index++][1] = pageDnsAuto;
            _dnscontrolMapCurrent[index++][1] = pageIpPrefer;
            _dnscontrolMapCurrent[index++][1] = pageIpStandby;
            mapData = g_objXML.copyArray(_dnscontrolMapCurrent, mapData);
            mapData = g_objXML.getChangedArray(_dnscontrolMapExisting, mapData, true);
		}
    }else {
        if (_dnscontrolMapCurrent[0][1] != pageDnsAuto){
            _dnscontrolMapCurrent[0][1] = pageDnsAuto;
            mapData[0] = new Array(2);
            mapData[0] = _dnscontrolMapCurrent[0];
        }
    }
    if (mapData.length > 0) {
        open_dialog_loading();
        $.cgi.postCmd('dns', mapData, successPostDnsSet, failPostDnsSet);                           
    }
}

//DNS应用提交函数 成功回调函数
function successPostDnsSet(data) {
    close_dialog_loading();
    getDnsData(data);
    open_dialog_info(jQuery.i18n.prop("successApply"));
}

//获取DNS数据 失败回调函数
function failPostDnsSet(){
    close_dialog_loading();
    open_dialog_info(jQuery.i18n.prop("failApply"));
}

<!-- ####################################  DNS函数  ############################### -->
//初始化DNS显示文字
function initDNSPageWords(){
	$("#auto_dns_title").text(jQuery.i18n.prop("lDnsauto"));
	$("#manual_dns_title").text(jQuery.i18n.prop("lDnsmanual"));
	$("#manual_first_dns_title").text(jQuery.i18n.prop("lpreferDnsServer"));
	$("#manual_two_dns_title").text(jQuery.i18n.prop("lstandbyDnsServer"));
}