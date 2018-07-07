//隐藏option
function optionHide(id){
	var optionObj = document.getElementById(id);
	if($(optionObj).parent("span").length == 0){
		$(optionObj).wrap($("<span style='display:none;'></span>"));
	}
}
//显示option
function optionShow(id){
	var optionObj = document.getElementById(id);
	if($(optionObj).parent("span").length>0){
		$(optionObj).unwrap();
	}
}

//id  空字符表示未选
function GetOptionsValue(id){
	var btnSelect = document.getElementById(id);
	var aOption = btnSelect.getElementsByTagName("option"); 
	//默认返回值为空字符串
	var value = "";
	var optionLength = aOption.length;
	//循环当前下来列表
	for(var i = 0; i < optionLength; i++){
		//判断selected是否为true
		if(aOption[i].selected == true){
			value = aOption[i].value;
		}
	}
	return value;
}

//id,value
function SetOptionValue(id,value){
	var btnSelect = document.getElementById(id); 
	var curSelect = btnSelect.getElementsByTagName("span")[0]; 
	var aOption = btnSelect.getElementsByTagName("option"); 				
	var optionLength = aOption.length;
	//循环当前下拉列表
	for(var i = 0; i < optionLength; i++){
		//option value
		var aOption_value = aOption[i].value;
		// option text					
		var aOption_text = aOption[i].text;
		//判断设置的值与option的值是否相当,相等时表示为当前选定的值,是指selected属性为true,其他option的selected属性为false
		if(aOption_value == value){
			aOption[i].selected = true;
			curSelect.innerHTML = aOption_text;
		}else{
			aOption[i].selected = false;
		}
	}
}

//实例化
function initOptions(id){
	var btnSelect = document.getElementById(id); 
	var curSelect = btnSelect.getElementsByTagName("span")[0]; 
	var oSelect = btnSelect.getElementsByTagName("select")[0]; 
	var aOption = btnSelect.getElementsByTagName("option");
	oSelect.selectedIndex = -1;
	var optionLength = aOption.length;
	for(var i = 0; i < optionLength; i++){
		if($(aOption[i]).css("display")=='none'){
			$(aOption[i]).wrap($("<span style='display:none;'></span>"));
		}
	}
	oSelect.onchange = function () { 
		optionLength = aOption.length;
		var value = "";
		var text = "";
		for(var i = 0; i < optionLength; i++){
			//判断selected是否为true
			if(aOption[i].selected == true){
				value = aOption[i].value;
				text = aOption[i].text;
				curSelect.innerHTML = text; 
			}
		}
	} 
}

//首页网络模式选中函数
function initOptionsNetwork_type_select(id){
	var btnSelect = document.getElementById(id); 
	var curSelect = btnSelect.getElementsByTagName("span")[0]; 
	var oSelect = btnSelect.getElementsByTagName("select")[0]; 
	var aOption = btnSelect.getElementsByTagName("option"); 
	oSelect.selectedIndex = -1;
	var optionLength = aOption.length;
	for(var i = 0; i < optionLength; i++){
		if($(aOption[i]).css("display")=='none'){
			$(aOption[i]).wrap($("<span style='display:none;'></span>"));
		}
	}
	oSelect.onchange = function () { 
		optionLength = aOption.length;
		var value = "";
		var text = "";
		for(var i = 0; i < optionLength; i++){
			//判断selected是否为true
			if(aOption[i].selected == true){
				value = aOption[i].value;
				text = aOption[i].text;
				curSelect.innerHTML = text; 
			}
		}
		PostWanNetSettingForIndexPage();
	} 
}

//选中函数
function initOptionsChangedSecuritySetting(id){
	var btnSelect = document.getElementById(id); 
	var curSelect = btnSelect.getElementsByTagName("span")[0]; 
	var oSelect = btnSelect.getElementsByTagName("select")[0]; 
	var aOption = btnSelect.getElementsByTagName("option"); 
	oSelect.selectedIndex = -1;
	var optionLength = aOption.length;
	for(var i = 0; i < optionLength; i++){
		if($(aOption[i]).css("display")=='none'){
			$(aOption[i]).wrap($("<span style='display:none;'></span>"));
		}
	}
	oSelect.onchange = function () { 
		optionLength = aOption.length;
		var value = "";
		var text = "";
		for(var i = 0; i < optionLength; i++){
			//判断selected是否为true
			if(aOption[i].selected == true){
				value = aOption[i].value;
				text = aOption[i].text;
				curSelect.innerHTML = text; 
			}
		}
		changedSecuritySetting();
	} 
}

//选中函数
function initOptionsMultichangedSecuritySetting(id){
	var btnSelect = document.getElementById(id); 
	var curSelect = btnSelect.getElementsByTagName("span")[0]; 
	var oSelect = btnSelect.getElementsByTagName("select")[0]; 
	var aOption = btnSelect.getElementsByTagName("option"); 
	oSelect.selectedIndex = -1;
	var optionLength = aOption.length;
	for(var i = 0; i < optionLength; i++){
		if($(aOption[i]).css("display")=='none'){
			$(aOption[i]).wrap($("<span style='display:none;'></span>"));
		}
	}
	oSelect.onchange = function () { 
		optionLength = aOption.length;
		var value = "";
		var text = "";
		for(var i = 0; i < optionLength; i++){
			//判断selected是否为true
			if(aOption[i].selected == true){
				value = aOption[i].value;
				text = aOption[i].text;
				curSelect.innerHTML = text; 
			}
		} 
		multichangedSecuritySetting();
	} 
}

//选中函数
function initOptionsChangedDefaltPasswd(id){
	var btnSelect = document.getElementById(id); 
	var curSelect = btnSelect.getElementsByTagName("span")[0]; 
	var oSelect = btnSelect.getElementsByTagName("select")[0]; 
	var aOption = btnSelect.getElementsByTagName("option"); 
	oSelect.selectedIndex = -1;
	var optionLength = aOption.length;
	for(var i = 0; i < optionLength; i++){
		if($(aOption[i]).css("display")=='none'){
			$(aOption[i]).wrap($("<span style='display:none;'></span>"));
		}
	}
	oSelect.onchange = function () { 
		optionLength = aOption.length;
		var value = "";
		var text = "";
		for(var i = 0; i < optionLength; i++){
			//判断selected是否为true
			if(aOption[i].selected == true){
				value = aOption[i].value;
				text = aOption[i].text;
				curSelect.innerHTML = text; 
			}
		} 
		changedDefaltPasswd();
	} 
}

//选中函数
function initOptionsMultichangedDefaltPasswd(id){
	var btnSelect = document.getElementById(id); 
	var curSelect = btnSelect.getElementsByTagName("span")[0]; 
	var oSelect = btnSelect.getElementsByTagName("select")[0]; 
	var aOption = btnSelect.getElementsByTagName("option"); 
	oSelect.selectedIndex = -1;
	var optionLength = aOption.length;
	for(var i = 0; i < optionLength; i++){
		if($(aOption[i]).css("display")=='none'){
			$(aOption[i]).wrap($("<span style='display:none;'></span>"));
		}
	}
	oSelect.onchange = function () { 
		optionLength = aOption.length;
		var value = "";
		var text = "";
		for(var i = 0; i < optionLength; i++){
			//判断selected是否为true
			if(aOption[i].selected == true){
				value = aOption[i].value;
				text = aOption[i].text;
				curSelect.innerHTML = text; 
			}
		} 
		multichangedDefaltPasswd();
	} 
}

//选中函数
function initOptionsChangeFreq(id){
	var btnSelect = document.getElementById(id); 
	var curSelect = btnSelect.getElementsByTagName("span")[0]; 
	var oSelect = btnSelect.getElementsByTagName("select")[0]; 
	var aOption = btnSelect.getElementsByTagName("option"); 
	oSelect.selectedIndex = -1;
	var optionLength = aOption.length;
	for(var i = 0; i < optionLength; i++){
		if($(aOption[i]).css("display")=='none'){
			$(aOption[i]).wrap($("<span style='display:none;'></span>"));
		}
	}
	oSelect.onchange = function () { 
		optionLength = aOption.length;
		var value = "";
		var text = "";
		for(var i = 0; i < optionLength; i++){
			//判断selected是否为true
			if(aOption[i].selected == true){
				value = aOption[i].value;
				text = aOption[i].text;
				curSelect.innerHTML = text; 
			}
		}
		changeFreq();
	} 
}

//选中函数
function initOptionsChangeChannel(id){
	var btnSelect = document.getElementById(id); 
	var curSelect = btnSelect.getElementsByTagName("span")[0]; 
	var oSelect = btnSelect.getElementsByTagName("select")[0]; 
	var aOption = btnSelect.getElementsByTagName("option"); 
	oSelect.selectedIndex = -1;
	var optionLength = aOption.length;
	for(var i = 0; i < optionLength; i++){
		if($(aOption[i]).css("display")=='none'){
			$(aOption[i]).wrap($("<span style='display:none;'></span>"));
		}
	}
	oSelect.onchange = function () {
		optionLength = aOption.length; 
		var value = "";
		var text = "";
		for(var i = 0; i < optionLength; i++){
			//判断selected是否为true
			if(aOption[i].selected == true){
				value = aOption[i].value;
				text = aOption[i].text;
				curSelect.innerHTML = text; 
			}
		}
		changeChannel();
	} 
}

//选中函数
function initOptionsProfileList(id){
	var btnSelect = document.getElementById(id); 
	var curSelect = btnSelect.getElementsByTagName("span")[0]; 
	var oSelect = btnSelect.getElementsByTagName("select")[0]; 
	var aOption = btnSelect.getElementsByTagName("option"); 
	oSelect.selectedIndex = -1;
	var optionLength = aOption.length;
	for(var i = 0; i < optionLength; i++){
		if($(aOption[i]).css("display")=='none'){
			$(aOption[i]).wrap($("<span style='display:none;'></span>"));
		}
	}
	oSelect.onchange = function () { 
		optionLength = aOption.length;
		var value = "";
		var text = "";
		for(var i = 0; i < optionLength; i++){
			//判断selected是否为true
			if(aOption[i].selected == true){
				value = aOption[i].value;
				text = aOption[i].text;
				curSelect.innerHTML = text; 
			}
		}
		changedProfiledrpdwn();
	} 
}

//选中函数
function initOptionsprofileConnect(id){
	var btnSelect = document.getElementById(id); 
	var curSelect = btnSelect.getElementsByTagName("span")[0]; 
	var oSelect = btnSelect.getElementsByTagName("select")[0]; 
	var aOption = btnSelect.getElementsByTagName("option"); 
	oSelect.selectedIndex = -1;
	var optionLength = aOption.length;
	for(var i = 0; i < optionLength; i++){
		if($(aOption[i]).css("display")=='none'){
			$(aOption[i]).wrap($("<span style='display:none;'></span>"));
		}
	}
	oSelect.onchange = function () { 
		optionLength = aOption.length;
		var value = "";
		var text = "";
		for(var i = 0; i < optionLength; i++){
			//判断selected是否为true
			if(aOption[i].selected == true){
				value = aOption[i].value;
				text = aOption[i].text;
				curSelect.innerHTML = text; 
			}
		} 
		changedConnMode();
	} 
}

//pin码管理选中函数
function initOptionsSelectPinOpt(id){
	var btnSelect = document.getElementById(id); 
	var curSelect = btnSelect.getElementsByTagName("span")[0]; 
	var oSelect = btnSelect.getElementsByTagName("select")[0]; 
	var aOption = btnSelect.getElementsByTagName("option"); 
	oSelect.selectedIndex = -1;
	var optionLength = aOption.length;
	for(var i = 0; i < optionLength; i++){
		if($(aOption[i]).css("display")=='none'){
			$(aOption[i]).wrap($("<span style='display:none;'></span>"));
		}
	}
	oSelect.onchange = function () { 
		optionLength = aOption.length;
		var value = "";
		var text = "";
		for(var i = 0; i < optionLength; i++){
			//判断selected是否为true
			if(aOption[i].selected == true){
				value = aOption[i].value;
				text = aOption[i].text;
				curSelect.innerHTML = text; 
			}
		}
		onSelectPinOpt();
	} 
}