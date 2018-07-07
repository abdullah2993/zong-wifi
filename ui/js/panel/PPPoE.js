$(function(){
	//PPPoE
	initCheckboxs("PPPoE_checkbox");
	//实例化隧道模式
	initOptions("tunnel_mode_select");
	//LNS隧道验证
	initCheckboxs("lns_tunnel_checkbox");

	initPPPoEPageWords();
});

function lns_tunnel_open_click(){
	$("#lns_tunnel_password_tr").show();
}
function lns_tunnel_close_click(){
	$("#lns_tunnel_password_tr").hide();
}

function initPPPoEPageWords(){
	$("#PPPoEserverSet").text(jQuery.i18n.prop("PPPoEserverSet"));
	$("#PPPoEtoL2TPSet").text(jQuery.i18n.prop("PPPoEtoL2TPSet"));
	$("#lPPPoEset").text(jQuery.i18n.prop("lPPPoEset"));
	$("#ltunnelmode").text(jQuery.i18n.prop("ltunnelmode"));
	$("#tunnelSingle").text(jQuery.i18n.prop("tunnelSingle"));
	$("#tunnelMulti").text(jQuery.i18n.prop("tunnelMulti"));
	$("#LNSserverIP").text(jQuery.i18n.prop("LNSserverIP"));
	$("#LNSserverName").text(jQuery.i18n.prop("LNSserverName"));
	$("#tunnelCheck").text(jQuery.i18n.prop("tunnelCheck"));
	$("#LNSTunnelPassword").text(jQuery.i18n.prop("LNSTunnelPassword"));
}