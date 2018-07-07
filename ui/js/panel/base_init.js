window.onload = function () { 
	//初始化所有的开启 关闭checkbox 显示文字
	$(".Open").text(jQuery.i18n.prop("Open"));
	$(".Close").text(jQuery.i18n.prop("Close"));
	$(".Apply").val(jQuery.i18n.prop("Apply"));
	$(".PasswordPass").text(jQuery.i18n.prop("PasswordPass"));	
	$(".btnAdd").val(jQuery.i18n.prop("btnAdd"));
	$(".btnDelete").val(jQuery.i18n.prop("btnDelete"));
	$(".btnRefresh").val(jQuery.i18n.prop("btnRefresh"));
	$(".btnModify").val(jQuery.i18n.prop("btnModify"));
	$(".btnQuery").val(jQuery.i18n.prop("btnQuery"));
	$(".btnSearch").val(jQuery.i18n.prop("btnSearch"));

	//初始化短信的所有选择框
	$('#chklistDraft').hcheckbox();
	$('#chklistOut').hcheckbox();
	$('#chklist').hcheckbox();
}


var BrowserWidth = 0;//浏览器宽度
var BrowserHeight = 0;//浏览器高度
  
function init_page_zoom(){
	if(CheckPage()){
		$("#index_float_left").width("150px");
		$("#index_float_right").width("150px");
		$("#index_float_left").height("650px");
		$("#index_float_right").height("650px");
		$("#index_float_left_img").height("650px");
		$("#index_float_right_img").height("650px");
		$("#index_float_left_img").width("150px");
		$("#index_float_right_img").width("150px");
		$("#content").width("660px");
		$("#marquee_bottom").width("960");
	}else{
		BrowserWidth = $(window).width(); 
	    BrowserHeight = $(window).height(); 
		//计算广告宽度
		var BannerWidth = parseInt((256 * BrowserHeight) / 890);
		var BannerHeight = BrowserHeight - 25;
		//计算广告宽度 高度
		$("#index_float_left").width(BannerWidth+"px");
		$("#index_float_right").width(BannerWidth+"px");
		$("#index_float_left").height(BannerHeight+"px");
		$("#index_float_right").height(BannerHeight+"px");
		$("#index_float_left_img").height(BannerHeight+"px");
		$("#index_float_right_img").height(BannerHeight+"px");
		$("#index_float_left_img").width(BannerWidth+"px");
		$("#index_float_right_img").width(BannerWidth+"px");
		//计算内容宽度
		var ContentWidth = BrowserWidth - (BannerWidth * 2) - 8;
		$("#content").width(ContentWidth+"px");
	}
}

function CheckIeBrowser(){
	if( navigator.appName == "Microsoft Internet Explorer" || navigator.userAgent.indexOf("MSIE") >= 0 || $.browser.msie){ 
		return true;
	}else{
		return false;
	}
}

//判断客户端是PC还是手机
function CheckPage(){
	if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
		return true;
	}else{
		return false;
	}
}