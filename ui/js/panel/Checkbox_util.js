//多个checkboxs，只能选择一个，默认value=0 的被选中 
function initCheckboxs(name){
	var ckSelect = document.getElementsByName(name);
	var ckLength = ckSelect.length;
	for(var i = 0; i < ckLength; i++){
		//init value is 0
		if(parseInt(ckSelect[i].value) == 0){
			ckSelect[i].checked = true;
		}
		//init group function
		ckSelect[i].onclick = function(){	
			var ck_Select = document.getElementsByName(name);
			var ck_Select_length = ck_Select.length;
			for(var k = 0; k < ck_Select_length; k++){
				if(this.id == ck_Select[k].id && this.checked == false){								
					this.checked = true;								
				}else if(this.id == ck_Select[k].id && this.checked == true){
					ck_Select[k].checked = true;
				}else if(this.id != ck_Select[k].id && this.checked == false){
					ck_Select[k].checked = false;
				}else if(this.id != ck_Select[k].id && this.checked == true){
					ck_Select[k].checked = false;
				}
			}							
		};
	}
} 

//多个checkboxs，只能选择一个，获取选中的value值
function getCheckboxsValue(name){
	var ckSelect = document.getElementsByName(name); 
	var ckLength = ckSelect.length;
	var value = -1;
	for(var i = 0; i < ckLength; i++){				
		var checked = ckSelect[i].checked;
		if(checked == true){
			value = ckSelect[i].value;	
		}
	}
	return value;	
}

//多个checkboxs，只能选择一个，设置选中的value值
function setCheckboxsValue(name,value){
	var ckSelect = document.getElementsByName(name); 
	var ckLength = ckSelect.length;
	for(var i = 0; i < ckLength; i++){				
		if(ckSelect[i].value == value){
			ckSelect[i].checked = true;	
		}else{
			ckSelect[i].checked = false;
		}
	}
}

//单个checkboxs，获取选中的value值 1-表示选中 0-表示未选中
function getCheckboxValue(id){
	var ckSelect = document.getElementById(id); 
	if(ckSelect.checked == true){
		return 1;
	}else{
		return 0;
	}				
}

//单个checkboxs，设置选中的value值 1-表示选中 0-表示未 选中
function setCheckboxValue(id,value){
	var ckSelect = document.getElementById(id); 
	if(value == 1){
		ckSelect.checked = true;	
	}else{
		ckSelect.checked = false;
	}
}