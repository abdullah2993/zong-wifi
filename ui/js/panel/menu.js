$(document).ready(function(){ 
	initMenuPageWords();
})

//初始化菜单显示的文字
function initMenuPageWords(){
	$("#nav-link-1").text(jQuery.i18n.prop("home"));
	$("#nav-link-2").text(jQuery.i18n.prop("statistics"));
	$("#nav-link-3").text(jQuery.i18n.prop("inbox"));
	$("#nav-link-4").text(jQuery.i18n.prop("software_update"));
	$("#nav-link-5").text(jQuery.i18n.prop("settings"));
	$("#nav-link-6").text(jQuery.i18n.prop("mbb_website"));
	$("#nav-link-7").text(jQuery.i18n.prop("MBBFAQ"));
	$("#nav-link-8").text(jQuery.i18n.prop("Feedback"));
}

//菜单点击函数
function openMenu(index,num){
	for(var i = 1; i <= num; i++){
		var selected_Link = "#nav-link-" + String(i);
		//获取选中的td
		var select_td = $(selected_Link).parent("td");
		//选中元素ID
		if( parseInt(i) == parseInt(index)){				
			$(select_td).attr("class","nav-selected");
		}else{//未选中元素ID
			$(select_td).attr("class","nav");
		}
	}
	//首页
	if(index == 1)
	{
		$("#index").show();
		$("#statistics").hide();
		$("#inbox").hide();
		$("#upgrade").hide();
		$("#setting").hide();
	}
	//流量统计
	else if(index == 2)
	{
		$("#index").hide();
		$("#statistics").show();
		$("#inbox").hide();
		$("#upgrade").hide();
		$("#setting").hide();
		//初始化流量统计页面信息
		initStatisticsPage();
	}
	//收件箱
	else if(index == 3)
	{
		$("#index").hide();
		$("#statistics").hide();
		$("#inbox").show();
		$("#upgrade").hide();
		$("#setting").hide();
		//初始化收件箱的数据
		initSMS();
	}
	//软件更新
	else if(index == 4)
	{
		$("#index").hide();
		$("#statistics").hide();
		$("#inbox").hide();
		$("#upgrade").show();
		$("#setting").hide();
		loadUpgradePage();
	}
	//设置
	else if(index == 5)
	{
		$("#index").hide();
		$("#statistics").hide();
		$("#inbox").hide();
		$("#upgrade").hide();
		$("#setting").show();
		//初始化设置向导
		initQuickSetting();
	}
}


