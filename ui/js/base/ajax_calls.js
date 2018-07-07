/*cgi请求封装工具*/
$.cgi = new (function () {
    var sendCmdQueue = new Array();
    this.sendCmd = function (cmdName, completeFn) {
        if (sendCmdQueue.indexOf(cmdName) >= 0) {
            return;
        }
        sendCmdQueue.push(cmdName);
        var url = "";
        var host = window.location.protocol + "//" + window.location.host + "/";
        url = host + 'xml_action.cgi?method=get&module=duster&file=' + cmdName;
        //这里的 时间不可以太长，mifi连接已经断开
        this.getDevice(url, onSucessComplete(cmdName), onFaildComplete(cmdName), 8000, function () {
            sendCmdQueue.remove(cmdName);
            if (completeFn) completeFn();
        });
    }

    this.postCmd = function (cmdName, mapData, successPostWlanSetting, failPostWlanSetting, timeout) {
        var host = window.location.protocol + "//" + window.location.host + "/";
        var url = host + 'xml_action.cgi?method=set&module=duster&file=' + cmdName;
        var inputData = null;
        if (mapData) {
            inputData = g_objXML.getXMLDocToString(g_objXML.createXML(mapData));
        }
		
		inputData = $.trim(inputData);
		
		if (!timeout || timeout < 0) {
            timeout = 10000;
        }
		setDevice(url, inputData, 'xml', successPostWlanSetting, failPostWlanSetting, timeout);
    }

    /* Des: 触发设置xml值事件
    * @cmdName:  xml文件名称
    * @mapData: 
    */
    this.postCmdSynch = function (cmdName, mapData, successFunction, failFunction, timeout) {
        var inputData = g_objXML.getXMLDocToString(g_objXML.createXML(mapData));
		inputData = $.trim(inputData);
		
        if (!timeout || timeout < 0) {
            timeout = 10000;
        }
        var host = window.location.protocol + "//" + window.location.host + "/";
        var url = host + 'xml_action.cgi?method=set&module=duster&file=' + cmdName;
        $.ajax({
            type: 'post',
            url: url,
            'beforeSend': function (xhr) {
                xhr.setRequestHeader("Authorization", getAuthHeader("POST"))
            },
            processData: false,
            cache: false,
            data: inputData,
            async: false,
            dataType: 'xml', 
            timeout: timeout,
            complete: successFunction,
            error: failFunction
        });
    }
    var getXmlEventList = new Array();
    /* Des: 为了最大化地利用已经取得的数据
    * @cmdName:  xml文件名称
    * @success:  响应函数
    */
    this.onGetXml = function (cmdName, success, faild) {
        var exists = false;
        $.each(getXmlEventList, function (key, value) {
            if (value && value.name && value.success && value.faild && value.name == cmdName && value.success.toString() == success.toString() && value.faild.toString() == faild.toString()) 
            { 
                exists = true; 
            }
        });
        if (exists == false){
            getXmlEventList.push({ "name": cmdName, "success": success, "faild": faild });
        }
    }

    /*
    * 异步设置
    */
    var setDevice = function (url, inputData, dataType, successFunction, failFunction, timeout) {
        $.ajax({
            type: 'post',
            url: url,
            'beforeSend': function (xhr) {
                xhr.setRequestHeader("Authorization", getAuthHeader("POST"))
            },
            processData: false,
            cache: false,
            data: inputData,
            async: true,
            dataType: dataType, //返回数据的格式
            timeout: timeout,
            success: successFunction,
            error: failFunction
        });
    }
    /*Des: get information from Device
    * url:Request url
    * inputData:send data to Server
    * successFunction:when Communication success,run this function
    * failFunction:when Communication fail,run this function
    * timeout:timout
    * Return: Device information
    *zhurw 2012/05/10
    */
    this.getDevice = function (url, successFunction, failFunction, timeout, completeFunction) {
        var content = $.ajax({
            type: "GET",
            url: url,
            'beforeSend': function (xhr) {
                //lza_temp
                xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
                //lza_temp
            },
            //processData: false,
            cache: false,
            async: true,
            dataType: 'xml', //返回数据的格式
            timeout: timeout,
            success: successFunction,
            error: failFunction,
            contentType: "text/xml;charset=UTF-8",
            complete: completeFunction
        }).responseXML;
        return content;
    }


    // 系统内部调用
    var onSucessComplete = function (cmdName) {
        return function (data) {
            failTemp = 0; //
            $.each(getXmlEventList, function (key, value) {
                if (value && value.name && value.success && value.name == cmdName) {
                    try {
                        if (data && $(data).find("RGW").length > 0)
                            value.success(data);
                    }
                    catch (e) {
                    }
                }
            });
        };
    }
    // 系统内部调用
    var onFaildComplete = function (cmdName) {
        return function (data) {
            $.each(getXmlEventList, function (key, value) {
                if (value && value.name && value.faild && value.name == cmdName) {
                    try {
                        value.faild(data);
                    }
                    catch (e) {
                    }
                }
            });
        };
    }
})();


function authentication(url) {
    var content = $.ajax({
        url: url,
        dataType: "text/html",
        async: false,
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
            xhr.setRequestHeader("Expires", "-1");
            xhr.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate");
            xhr.setRequestHeader("Pragma", "no-cache");
        }
    }).responseText;
    return content;
}

/*Des: API used for get Auth Type, Marvell's Auth
* url:url authentication digest
* Return: content,auth type
* zhurw 2012/05/10
*/
function getAuthType(url) {
    var content = $.ajax({
        url: url,
        type: "GET",
        dataType: "text/html",
        async: false,
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Expires", "-1");
            xhr.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate");
            xhr.setRequestHeader("Pragma", "no-cache");
        }
    }).getResponseHeader('WWW-Authenticate');
    return content;
}

function callProductXML(xmlName)
{
    var url = "";
    var content;
    var host = window.location.protocol + "//" + window.location.host + "/";
    url = host+'xml_action.cgi?method=get&module=duster&file='+xmlName;
   
	content = $.ajax({
		type: "GET",
		'beforeSend': function(xhr) {
			xhr.setRequestHeader("Authorization",getAuthHeader("GET"))
			},
		url: url,
        cache: false,
		dataType: "xml",
		async:false
	}).responseXML;
    return content;
}