$(document).ready(function(){ 
	getLanguage();
});

//获取语言
function getLanguage() {
	//请求cgi获取设备设置的语言
	var xml = callProductXML("locale");
	g_webLanguage = $(xml).find("language").text();	
	//如果获取失败，模式为英文语言
	if(g_webLanguage == "")
	{
		cache_language = getCookie("locale");
		g_webLanguage = (cache_language == "") ? "en" : cache_language;
	}
	//加载系统语言
	initLanguage(g_webLanguage,"properties/");
	setCookie("locale", g_webLanguage, 365);
}
//设置语言
function setLanguage(language){
	var mapData = new Array(0);
	mapData = putMapElement(mapData,"RGW/locale/language",language,0);
	$.cgi.postCmd("locale", mapData, setLanguageSuccessCallBack, setLanguageFailCallBack);
}
//设置语言成功回调函数
function setLanguageSuccessCallBack(data,textStatus){
	//刷新页面
	window.location.reload();
}
//设置语言失败回调函数
function setLanguageFailCallBack(){
	
}
/*
 *	初始化语言文件函数
 *	language 语言类型 cn 中文 en 英文 tw 繁体 th 泰文
 */
function initLanguage(language,path){
    jQuery.i18n.properties(
    {
        name : 'Messages',
        path : path,
        mode : 'map',
        language : language
    });
}