(function ($) {
    $.fn.XML_Operations = function () {
    	var text='<?xml version="1.0" encoding="UTF-8"?>';
    	if(window.opera){
            text='';
        }	
        this.getXMLDOC = function () {
            var xmlDoc;
            if (window.DOMParser){
                parser = new DOMParser();
                xmlDoc = parser.parseFromString("<RGW></RGW>","text/xml");
            }else {
                xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = "false";
                xmlDoc.loadXML("<RGW></RGW>");
            }
            return xmlDoc;
        }
        this.getXMLDOCVersion = function(text){
            var xmlDoc;
            if (window.DOMParser){
                parser=new DOMParser();
                xmlDoc=parser.parseFromString(text,"text/xml");
            }else {
                xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = "false";
                xmlDoc.loadXML(text);
            }
            return xmlDoc;
        }
        this.getInternetExplorerVersion = function(){
    		var rv = -1; 
    		if (navigator.appName == 'Microsoft Internet Explorer'){
    			var ua = navigator.userAgent;
    			var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    			if (re.exec(ua) != null)
    				rv = parseFloat( RegExp.$1 );
    		}
    		return rv;
    	}
        this.getXMLDocToString = function (oXML){
            var xmlString="";
            if (window.ActiveXObject) {
	        var ver = g_objXML.getInternetExplorerVersion();
        		if ( ver > -1 ){
        			if (ver <= 8.0){
        				xmlString = oXML.xml;
                    }else{
        				xmlString = (new XMLSerializer()).serializeToString(oXML);
                    }
        		}
            } else {
		      xmlString = (new XMLSerializer()).serializeToString(oXML);
	        }
            return text + " " + xmlString;
        }
        this.createNode = function (xmlDoc,parent,element,value){
            var newel = xmlDoc.createElement(element);
            if(value!=null){
                var _value = xmlDoc.createTextNode(value);
                newel.appendChild(_value);
            }
            var _element=xmlDoc.getElementsByTagName(parent);
            _element[0].appendChild(newel);
            return xmlDoc;
        }

        this.createItemNode = function (xmlDoc,parent,element,value,index){
            var newel=xmlDoc.createElement(element);
            if(value!=null){
            
                newel.setAttribute("index", index);
            }
            var _element = xmlDoc.getElementsByTagName(parent);

            _element[0].appendChild(newel);
            return xmlDoc;
        }
        this.createDeleteNode = function (xmlDoc,parent,element,value,index){
            var newel=xmlDoc.createElement(element);
            if(value!=null){
                var _value = xmlDoc.createTextNode(value);
                newel.appendChild(_value);
                newel.setAttribute("Delete", 1);
            }
            var _element=xmlDoc.getElementsByTagName(parent);

            _element[0].appendChild(newel);
            return xmlDoc;
        }

        this.childExist = function (xmlDoc,child){
            var _element=xmlDoc.getElementsByTagName(child);
            if(_element[0]!=null)
                return true;
            else
                return false;
        }
        this.createXML = function(controlMap){
            var xmlDoc = this.getXMLDOC(text);
            for(var i=0;i<controlMap.length;i++){
                var j;
                if(controlMap[i]!=null){
                    var token = controlMap[i][0].split("/");
                    for(j=0;j<token.length-1;j++){
                        if(!g_objXML.childExist(xmlDoc,token[j])){
                            xmlDoc =  g_objXML.createNode(xmlDoc,token[j-1],token[j],null);
                        }
                    }
                    if(token[j].indexOf("#index")!=-1){
                        var cNode=token[j].substring(0,token[j].indexOf("#index"));
                        xmlDoc = g_objXML.createItemNode(xmlDoc,token[j-1],cNode,controlMap[i][1],i);
                    }
                    else if(token[j].indexOf("#delete")!=-1){
                        var deleteNode=token[j].substring(0,token[j].indexOf("#delete"));
                        xmlDoc = g_objXML.createDeleteNode(xmlDoc,token[j-1],deleteNode,controlMap[i][1],i);
                    }
                    else{
                        xmlDoc = g_objXML.createNode(xmlDoc,token[j-1],token[j],controlMap[i][1]);
                    }

                }
            }
            return xmlDoc;
        }
        this.putMapElement = function(controlMap,index,path,value){
            controlMap[index] = new Array(2);
            controlMap[index][0] = path;
            controlMap[index][1] = value;
            return controlMap;
        }
        this.copyArray = function(controlMapExisting,controlMapCurrent){
            for(var i=0;i<controlMapExisting.length;i++){
                controlMapCurrent[i] = new Array(2);
                controlMapCurrent[i][0]= controlMapExisting[i][0];
                controlMapCurrent[i][1]= controlMapExisting[i][1];
            }
            return controlMapCurrent;
        }
        this.getChangedArray = function(controlMapExisting,_controlMap,flagDoChanges){
            var tempArray = new Array(0);
            var index = 0;
            for(var i=0;i<controlMapExisting.length;i++){
                if(controlMapExisting[i][1] != _controlMap[i][1]){
                    tempArray[index]= new Array(2);
                    tempArray[index] = _controlMap[i];
                    if(flagDoChanges){
                        controlMapExisting[i] = _controlMap[i];
                    }
                    index++;
                }
            }
            return tempArray;
        }
        return this.each(function () {
        });
    }
})(jQuery);

