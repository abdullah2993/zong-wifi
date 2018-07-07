//自定义变量
$.hojyStatus = 
{
    isLogin: false,			//登录状态
    loginDate:new Date(),	//登录时间
    sim : -1,				//是否有插入SIM卡
    pin: 0,					//
    SwVersion:"",			//软件版本
    HwVersion:"",			//硬件版本
    Battery:"yes",			//是否有电池
    BatteryCapacity:"",		//电池类型
    ProductType: "",		//产品型号
	sysTimeSet:"",			//时间设置开关 0-关闭 1开启
	upgradeMode:"",			//升级模式
	freqFiveEnable:"",		//
	ipv6Switch:"",			//ipv6开关
    product_model:"", 		//cpe or mifi
	wifi_version:"1",		//wifi版本	
    pppoe_switch:0,         //pppoe开关 0-关闭 1-开启
    ussd_switch:0,			//ussd开关 0-国内 1-pk 2-th 
    lockNetList:"",          //网络->选网设置-> 网络模式 显示列表定制
	voice_number:"" // 本机号码
}

//g_开头的变量为全局变量
var g_webLanguage = "cn"; //当前语言环境
var g_app_download_page = 1; //APP下载横幅 0-关闭 1-显示
var g_language_switch = 0;// 0 : cn|en, 1 : en|th , 2 : en ,3 en | tw
var g_time_fomat = 0;//是否格式化时间 0-关闭 1-打开
var g_battery_percent_switch = 0;//是否开启电量百分比显示 0-关闭 1-显示
var g_zong_mbb = 0;//是否显示打开ZongWebSite菜单
var g_newsms_remind = 0;//是否开启短信提醒 0-关闭 1-开启
var g_SIMPINTitle_switch = 0;//0-显示 1-关闭

//设备模式 入库\量产\入网  CTA\OTA\MP
var g_mp_switch = "1";
var OTA_SELECT = "0";
var MP_SELECT  = "1";
var CTA_SELECT = "2";

//WEB版本 CMCC/UNICOM/TELECOM
var g_operator_version = "0";
var CMCC_SELECT = "0";	 
var UNICOM_SELECT = "1";
var TELECOM_SELECT = "2";

var IspName = "";	//运营商名称
var gArrayTableData = new Array();//全局储存table数据变量
var gCurrentDownFlux = "0"; //当前下载流量
var gCurrentUpFlux = "0";//当前上传流量
var gHistWifiDownFlux = "0";//历史Wifi下载流量
var gHistWifiUpFlux = "0";//历史Wifi上传流量
var gUpRate = "0";		//上行速度
var gDownRate = "0";	//下行速度

var gPreTime = "0";		
var gNetworkType = "0";//网络类型
var gUserNumber = "0";
var gPreDownFlux = "0"; //上传流量
var gPreUpFlux = "0";	//下载流量

var gWifiConnet = "0"; //当前wifi用户连接数
var gMaxClient = ""; //wifi最大连接数
var gWebMaxClient = ""; //web最大连接数

var gHistDownFlux = "0"; //历史下载流量
var gHistUpFlux = "0"; //历史上传流量
var gHistAllTime = "0";//流量持续运行时间

var gWifi_Td = "";
var gWifiUpRate = "0";
var gWifiDownRate = "0";
var gCurrentWifiDownFlux = "0";
var gCurrentWifiUpFlux = "0";

var gWifiIpAddressInternet = "0";
var gWificonnect_disconnect = "";
var gWifiSSID = "";
var gCurrentTime = "0";

var gWifiStatus = "0";
var gConnType = "";
var gIpAddressInternet = "";
var gIpv6AddressInternet = ""; 

var gConn_disConn = ""; //数据流量连接状态
var gIpMode = "";	//ipv4 or ipv6 or ipv4/ipv6
var newsms_remind = 0;//短信是否提醒
var g_carrieroperator_select = "0";
var g_connectedStatus = 1; //wifi连接状态
var g_product_name = ''; //名称

var xmlPaymentDay;  //月结日时间
var xmlPaymentPackage; //包月流量包大小

var _xmlFlowExcessFuncShow; //超额流量断网开关设置功能 是否显示 
var _xmlFlowExcessState;// 超额流量断网开关 状态
var _xmlFlowExcessValue;//超额流量断网 流量阈值

var g_hidden_pwd = "0";//是否隐藏WLAN密码

var PRODUCT_L360 = "L360";
var PRODUCT_L220 = "L220";

