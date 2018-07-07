//根据名称c_name获取cookie的
function getCookie(c_name)
{
    if (document.cookie.length > 0)
    {
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1;
            c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
}

//设置cookie的值 c_name-名称 value-值 expiredays-时间
function setCookie(c_name,value,expiredays)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie=c_name+ "=" +escape(value)+
    ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}

function getRouterDate(date){
    var dateArray =  date.split(" ");
    var dateString = dateArray[1]+" "+dateArray[2]+ "," +dateArray[5]+" " + dateArray[3];
    var d = new Date(dateString);
    return d;
}

//时间转换函数1
function GetMachineTimezoneGmtOffsetStr(tzGmtOffset )
{
    var gmtOffsetStr =""+ getAbsValue(tzGmtOffset/60);
    var tempInt = tzGmtOffset;

    if(tempInt < 0)
    {
        tempInt = 0 - tempInt;
    }

    if(( tempInt % 60 ) != 0 )
    {
        gmtOffsetStr += ":" + ( tempInt % 60 );
    }
    return gmtOffsetStr;
}

//时间转换函数2
function GetMachineTimezoneGmtOffset()
{
    var rightNow = new Date();
    var JanuaryFirst= new Date(rightNow.getFullYear(), 0, 1, 0, 0, 0,0);
    var JulyFirst= new Date(rightNow.getFullYear(), 6, 1, 0, 0, 0,0);
    var JanOffset,JulyOffset;
    var tzGmtOffset;
    JanOffset = JanuaryFirst.getTimezoneOffset();
    JulyOffset = JulyFirst.getTimezoneOffset();
    if(JulyOffset > JanOffset){
        tzGmtOffset= JulyOffset;
    }
    else{
        tzGmtOffset = JanOffset;
    }
    return tzGmtOffset;
}

//时间转换函数3
function GetMachineTimezoneDstStartStr(StandardGMToffset)
{
    var rightNow = new Date();
    var JanuaryFirst = new Date(rightNow.getFullYear(), 0, 1, 0, 0, 0,0);
    var JulyFirst= new Date(rightNow.getFullYear(), 6, 1, 0, 0, 0,0);
    var HoursInSixMonths =((JulyFirst.getTime() - JanuaryFirst.getTime()) / (1000 * 60 * 60));
    var dstStartStr = "";
    var  i ;
    var JanOffset, JulyOffset;
    var hourStart, hourEnd;
    JanOffset = JanuaryFirst.getTimezoneOffset();
    JulyOffset = JulyFirst.getTimezoneOffset();

    if(JanOffset > JulyOffset){
        hourStart = 0;
        hourEnd = HoursInSixMonths;
    }else{
        hourStart = HoursInSixMonths;
        hourEnd = HoursInSixMonths * 2;
    }


    var tempDate = getDstStartTime(hourStart,hourEnd, rightNow.getYear(),StandardGMToffset);

    if(tempDate != null){
        var changeWeek = getChangeWeek(hourStart,hourEnd, tempDate.getYear(),StandardGMToffset);
        switch(changeWeek)
        {
            case -1:
                break;
            case -2: // Some regions have fixed day for start of dst setting which is expressed with J
                dstStartStr ="J" + (((tempDate.getTime()-JanuaryFirst.getTime())/(24 * 60 * 60* 1000) ) + 1);
                break;
            default:
                dstStartStr = "M" + (tempDate.getMonth() + 1) + "." + changeWeek + "." + tempDate.getDay();
                break;
        }
    }

    return dstStartStr;
}

function getDstStartTime(hourStart,hourEnd, year,StandardGMToffset)
{
    var i;
    for(i = hourStart; i < hourEnd; i++)
    {
        var dSampleDate = new Date(year,0, 1, 0, 0, 0,0);
        dSampleDate.setHours(i);

        var CurrentGMToffset  = dSampleDate.getTimezoneOffset();

        if(CurrentGMToffset < StandardGMToffset)
        {
            return dSampleDate;
        }
    }
    return null;

}
function setConnectedDeviceTimezoneStr(gmtOffset,dstStart,timezoneStringArray)
{
    var i,j;
    var startIndex = -1;
    var count = 0;
    var index = -1;

    var tempGmtString;
    var tempDstString;

    for(j = 0; j < timezoneStringArray[1].length ;j++)
    {
        var  charArr = toCharArray(timezoneStringArray[1][j]);
        count = 0;
        tempGmtString = "";
        tempDstString = "";
        startIndex = -1;

        for(i = 0; i < timezoneStringArray[1][j].split(",",3)[0].length; i++)
        {
            if(((charArr[i] >= '0') && (charArr[i] <= '9')) ||(charArr[i] == '-') || (charArr[i] == ':'))
            {
                count++;
                if(startIndex == -1){
                    startIndex = i;
                }
                tempGmtString = tempGmtString + charArr[i];
            }

        }

        if(tempGmtString == gmtOffset){

            if(timezoneStringArray[1][j].split(",",3).length > 1){
                tempDstString = timezoneStringArray[1][j].split(",",3)[1];
            }else {
                tempDstString = "";
            }

            if((dstStart.length == 0) && (tempDstString.length != 0))
            {
                continue;
            }

            if(tempDstString.substring(0,dstStart.length) == dstStart)
            {
                index = j;
                break;
            }else{
                continue;
            }

        }else{
            continue;
        }

    }

    if(index == -1)
    {
        return -1;
    }else{
        return index;
    }
}
function toCharArray(str){
    var charArray = new Array(0);
    for(var i=0;i<str.length;i++)
        charArray[i]=str.charAt(i);
    return charArray;
}

/* We know the day of month but not the week. We can find day of the month for few years and guess which week of the month it would be */
function getChangeWeek( hourStart, hourEnd, year, StandardGMToffset)
{
    var i;
    var min = 32 , max = 0, dom = 0;

    for(i = year; i < year + 20 ; i++)
    {
        dom =(getDstStartTime(hourStart,hourEnd,i,StandardGMToffset)).getDate();
        if(dom > max)
        {
            max = dom;
        }
        if(dom < min){
            min = dom;
        }
    }

    if(max == min){
        return -1;
    }

    if(max - min != 6){
        return -2;
    }

    return getAbsValue((((max + 6)/7)));

}

function getAbsValue(i){

    return i.toString().split(".")[0];
}

function isContainBatteryInfo()
{
    var ret = "true";
    if($.hojyStatus.Battery == "no")
    {
        ret = "false";
    }
    else
    {
        ret = "true";
    }
    return ret;
}




/*  Des: judge the string whether include speciel char
 *  str: judged str
 *  Return: true,the str include some speciel char;false,the str not include some spciel char
 *  meit 2012/05/05
 */
function includeSpecialchar(str)
{
	var regChars = "~`!@#$%^&*(){}[]\|:;\"'+=,<>.?/ -_";
	for(var i = 0; i < str.length; i++)
	{
		for(var j = 0; j < regChars.length; j++)
		{
			if(str.charAt(i) == regChars.charAt(j))
			{
				return true;
			}
		}
	}

	return false;
}
//生成请求验证字符串函数
function hex(d){
    var hD="0123456789ABCDEF";
    var h = hD.substr(d&15,1);
    while(d>15) {d>>=4;h=hD.substr(d&15,1)+h;}
    return h;
}
/*  Des: check what had pressed
 *  e: the key
 *  Return: characterCode,value of the key which you had presse
 *  meit 2012/05/05
 */
function checkKey(E)
{
	var characterCode;
	if(e && e.which)
	{
		E = E;
		characterCode = e.which;
	}Else
	{
		E = event;
		characterCode = e.keyCode;
	}
	return characterCode;
}

/*  Des: judge the input string whether is ASCII or not
 *  val: the input string
 *  Return: true,the string of val is not include chinese;false,the string of val include chinese
 *  meit 2012/05/05
 */
function isValidascii(val)
{
	for(var i = 0; i < val.length; i++)
	{
		var ch = val.charCodeAt(i);
		if(ch < 0 || ch > 255)
		{
			return false;
		}
	}
	return true;
}



/*  Des: judge the input digit whether is between 0 and F
 *  digit: the input string
 *  Return: true,the ditit is Hex;false,the ditit is not Hex
 *  meit 2012/05/05
 */
function isHexaDigit(digit)
{
	var hexVals = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "a", "b", "c", "d", "e", "f");
	var len = hexVals.length;
	var i = 0;
	var ret = false;

	for( i = 0; i < len; i++)
	{
		if(digit == hexVals[i])
		{
			break;
		}
	}

	if(i < len)
	{
		ret = true;
	}
	return ret;
}

/*  Des: judge the input data whether is HexData
 *  data: the input string
 *  Return: true,the data is HexData;false,the data is not HexData
 *  meit 2012/05/05
 */
function isHexaData(data)
{
	var len = data.length;
	var i = 0;
	for( i = 0; i < len; i++)
	{
		if(isHexaDigit(data.charAt(i)) == false)
		{
			return false;
		}
	}
	return true;
}

function putMapElement(controlMap,path,value,index)
{
    controlMap[index] = new Array(2);
    controlMap[index][0] = path;
    controlMap[index][1] = value;
    return controlMap;
}
/*--meit add 2012-05-18*/


function logout() {
    $.hojyStatus.isLogin = false;
	window.location = "../index.html";
}

function validateIPAddress(ip){
	var regex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
	if (!regex.test(ip)){
		return false;
    }else{
		return true;
    }
}

function validateMACAddress(mac){
    var regex=/^([0-9a-f]{2}([:-]|$)){6}$|([0-9a-f]{4}([.]|$)){3}$/i;
    if(!regex.test(mac))
        return false;
    else
		return true;
}

function validateDomainName(dns){
    var regex=/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+.?/;
    if(!regex.test(dns))
        return false;
    else
		return true;
}

function isChineseChar(value) {

	for(var i = 0; i < value.length; i++)
	{
		if(value.charCodeAt(i) >= 255)
		{
			return true;
		}
	}
	return false;
}

function deviceNameValidation(str)
{
    if(str.toString().indexOf("#")!=-1)
        return false;
    else if(str.toString().indexOf(":")!=-1)
        return false;
    else if(str.toString().indexOf(" ")!=-1)
        return false;
    else if(str.toString().indexOf("&")!=-1)
        return false;
    else if(str.toString().indexOf(";")!=-1)
        return false;
    else if(str.toString().indexOf("~")!=-1)
        return false;
    else if(str.toString().indexOf("|")!=-1)
        return false;
    else if(str.toString().indexOf("<")!=-1)
        return false;
    else if(str.toString().indexOf(">")!=-1)
        return false;
    else if(str.toString().indexOf("$")!=-1)
        return false;
    else if(str.toString().indexOf("%")!=-1)
        return false;
    else if(str.toString().indexOf("^")!=-1)
        return false;
    else if(str.toString().indexOf("!")!=-1)
        return false;
    else if(str.toString().indexOf("@")!=-1)
        return false;
    else
        return true;
}
//去除字符串中的空格
function parse_nop_enter(str) {
	if(str.indexOf(" ") >= 0)
	return '';
    for (var i = 0; (str.charAt(i)==' ') && i < str.length; i++);
	if (i == str.length) 
		 return ''; 
     var newstr = str.substr(i);
     for (var i = newstr.length-1; newstr.charAt(i) == ' ' && i >= 0; i--);
     newstr = newstr.substr(0,i+1);
	 if(newstr.indexOf(" ") > 0)
		 return '';
     return newstr;
}

//验证Waln的SSID名称和密码合法性
function isValidWlan(pageMode,pageSSID,pageModeKey,wepEncrypt,wapiKeyType,labelId,ssidLimit){
	if(parse_nop_enter(pageSSID)==""){
	    open_dialog_info(jQuery.i18n.prop("EMPTY_SSID"));
        return false;
	}
    if(pageModeKey=="" && pageMode != "None"){
        open_dialog_info(jQuery.i18n.prop("EMPTY_PASS"));
        return false;
    }
    var re1 = /.*[^\x21-\x7e]+.*$/;
    var re2 = /.*[^-_a-zA-Z0-9 ]+.*$/;
    if (re2.test(pageSSID)) {
        open_dialog_info(jQuery.i18n.prop("lInvalidCharacter"));
        return false;
    }	
    if (re1.test(pageModeKey)) {
        open_dialog_info(jQuery.i18n.prop("lInvalidCharacter3"));
        return false;
    }
    if(pageMode=='WPA2-PSK'|| pageMode=='Mixed'|| pageMode=='WPA-PSK'){      	
        if (pageModeKey.length<8){
			open_dialog_info(jQuery.i18n.prop("lminLengthError8"));
			return false;
		}
		if (pageModeKey.length>63) {
		    open_dialog_info(jQuery.i18n.prop("lmaxLengthError63"));
			return false;
		}
    }
    if(pageMode=='WEP')
	{
        if(wepEncrypt=='0') {
            var re0 = /^[0-9a-fA-F]{10}$/;
			if (!(re0.test(pageModeKey) || pageModeKey.length == 5)){
			    open_dialog_info(jQuery.i18n.prop("lInvalidPassword1"));
				return false;
			}     
    	}else{
            var re1=/^[0-9a-fA-F]{26}$/;
			if (!(re1.test(pageModeKey) || pageModeKey.length == 13)){
			    open_dialog_info(jQuery.i18n.prop("lInvalidPassword2"));
				return false;
			}
      	}
  	}
	if(pageMode=='WAPI-PSK'){
        var pass=''; 
        if(wapiKeyType=='0'){
			var re1=/^[0-9]{8,64}$/;
			if (!re1.test(pageModeKey)){
			    open_dialog_info(jQuery.i18n.prop("lLengthError8_64"));
                return false;
            }
		}else{
			var re0=/^[0-9a-fA-F]{8,64}$/;
			if (!re0.test(pageModeKey)){
			    open_dialog_info(jQuery.i18n.prop("lLengthError8_64hex"));
                return false;
            }
		}
	}	
	return true;
}

//数组
Array.prototype.indexOf = function (val) {
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

Array.prototype.clone = function () {
    var arr = [];
    for (var i = 0, len = this.length; i < len; i++) {
        arr[i] = this[i];
    }
    return arr;
};

//登录函数中处理加密字符串函数
function getValue(authstr)
{
        var arr=authstr.split("=");
        return arr[1].substring(1, arr[1].indexOf('\"',2) );
}

//流量转换函数
function getflux(lbytes)
{
    var retdata = 0;
    var dataBit = 0;//小数位
    
    if(lbytes == 0)
    {
        retdata = 0;
    }
    else if((lbytes>0) && (lbytes<1024))
    {
        retdata = lbytes.toString() + 'B';
    }
    else if( (lbytes>=1024) && (lbytes<1024*1024) )
    {
        if(lbytes%1024 == 0)
            retdata = lbytes/1024 + 'KB';
        else
        {
            dataBit = (lbytes/1024 + '0').indexOf(".")+2;
            retdata = (lbytes/1024 + '0').substring(0,dataBit) + 'KB';
        }
    }
    else if( (lbytes>=1024*1024) && (lbytes<1024*1024*1024) )
    {
        //retdata = (lbytes/1024/1024 + '0').substring(0,5) + 'MB';
        //raos
        if(lbytes%(1024*1024) == 0)
            retdata = lbytes/1024/1024 + 'MB';
        else
        {
            dataBit = (lbytes/1024/1024 + '0').indexOf(".")+2;
            retdata = (lbytes/1024/1024 + '0').substring(0,dataBit) + 'MB';
        }
    }
    else if( (lbytes>=1024*1024*1024) && (lbytes<1024*1024*1024*1024) )
    {
        if(lbytes%(1024*1024*1024) == 0)
            retdata = lbytes/1024/1024/1024 + 'GB';
        else
        {
            dataBit = (lbytes/1024/1024/1024 + '0').indexOf(".")+3;
            retdata = (lbytes/1024/1024/1024 + '0').substring(0,dataBit) + 'GB';
        }
    }
    
    return retdata;
}

//清除table数据
function clearTableRows(tableId){
    var i = document.getElementById(tableId).rows.length;
    while(i > 1){
        document.getElementById(tableId).deleteRow(i-1);
        i--;
    }
}

//设置按钮disabled属性
$.fn.hojyBnEnable = function (flag) {
    if (flag == false) {
        $(this).attr("disabled", true);
        $(this).addClass("disabled_font");
    }else{
        $(this).attr("disabled", false);
        $(this).removeClass("disabled_font");
    }
}

//流量转换函数,保留两位小数,当流量大于1024MB,并且不为1024整数倍,使用此函数进行转换
function changeTwoDecimal(x){
    var tempFloat = parseFloat(x);
    if (isNaN(tempFloat)){
        return false;
    }
    tempFloat = Math.round(tempFloat*100)/100;
    var strFloat = tempFloat.toString();
    var posDecimal = strFloat.indexOf('.');
    if (posDecimal < 0){
        posDecimal = strFloat.length;
        strFloat += '.';
    }
    while (strFloat.length <= posDecimal + 2){
        strFloat += '0';
    }
    return strFloat;
}

//流量转换函数,保留一位小数,当流量大于1024MB,并且不为1024整数倍,使用此函数进行转换
function changeOneDecimal(x){
    var tempFloat = parseFloat(x);
    if (isNaN(tempFloat)){
        return false;
    }
    tempFloat = Math.round(tempFloat*10)/10;
    
    var strFloat = tempFloat.toString();
    var posDecimal = strFloat.indexOf('.');
    if (posDecimal < 0){
        posDecimal = strFloat.length;
        strFloat += '.';
    }
    while (strFloat.length <= posDecimal + 1){
        strFloat += '0';
    }
    return strFloat;
}

