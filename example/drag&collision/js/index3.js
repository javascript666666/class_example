(function(){
	
	function createNewFile(){
		var li = document.createElement('li')
		li.innerHTML = `
						<div class="icon">
							<input type="checkbox"  class="checkInput" />
						</div>
						<strong style="display:none;">新建文件夹</strong>
						<div class="clearFix edtor"  style="display:block;">
							<input type="text" value="新建文件夹" class="createInputBtn"  />
							<input type="button" value="√" />
							<input type="button" value="×" />
						</div>
					`;
		return li;
	}
	var createFile = tools.$(".createFile")[0];
	var filesSet = tools.$(".filesSet")[0];
	var currentLi = null,edtor,edtorInput;
	
	var allLi = filesSet.getElementsByTagName("li");
	var allStrong = filesSet.getElementsByTagName("strong");
	var alIcon = tools.$(".icon",filesSet);
	var allSelected = tools.$(".allSelected")[0];
	
	var selectNum = tools.$("span",tools.$(".selectNum")[0])[0];
	
	var delectItem = tools.$(".delectItem")[0];
	
	var rename = tools.$(".rename")[0];
	
	var info = tools.$(".info")[0];
	
	var checkedNum = 0;
	
	
	tools.addEvent(createFile,"click",function(){
		//新建文件夹
		if( currentLi && edtor &&  edtor.style.display === "block"){
			edtorInput[0].select();
			return;
		}
		info.style.display = "none";
		allSelected.checked = false;
		for( var i = 0; i < alIcon.length; i++ ){
			alIcon[i].style.borderColor = "#fff";
			tools.$("input",alIcon[i])[0].style.display = "none";
			tools.$("input",alIcon[i])[0].checked = false;
		}
		
		currentLi = createNewFile();
		filesSet.appendChild(currentLi);
		edtor = tools.$(".edtor",currentLi)[0];
		var strong = tools.$("strong",currentLi)[0];
		var icon = tools.$(".icon",currentLi)[0];
		edtorInput = tools.$("input",edtor);
		edtorInput[0].select();  //选中新建文件的文字
		//点击确认名字
		tools.addEvent(edtorInput[1],"click",function(){
			
			//判断名字是否重复
			for( var i = 0; i < allStrong.length; i++ ){
				if( strong !== allStrong[i] && (allStrong[i].innerHTML.trim() === edtorInput[0].value.trim()) ){
					edtorInput[0].select();
					return;
				}
			};
			
			tools.$(".checkInput",tools.parents(this,"LI"))[0].checked = false;
			strong.innerHTML = edtorInput[0].value.trim();
			strong.style.display = "block";
			edtor.style.display = "none";
			
			//currentLi = null;
			edtor = null;
			enterHandle(currentLi);  //立马执行,为了加入后就立马有框框
			
		});
		//点击不添加li
		tools.addEvent(edtorInput[2],"click",function(){
			filesSet.removeChild(currentLi);
			currentLi = null;
			edtor = null;
			
		});
		liHandle(currentLi);
		//选中每一个input
		inputCheckboxClick(icon);
		
	});
	function enterHandle(_this){
		
		if( !_this ) return;
		var currentEdtor = tools.$(".edtor",_this)[0];
		if( currentEdtor.style.display !== "block" && !edtor ){
			tools.$(".icon",_this)[0].style.borderColor = "#2e80dc";
			tools.$("input",tools.$(".icon",_this)[0])[0].style.display = "block";
		}
	}
	function liHandle(currentLi){
		tools.addEvent(currentLi,"mouseenter",function(){
			enterHandle(this)
		});
		tools.addEvent(currentLi,"mouseleave",function(ev){
			var inputs = tools.$("input",tools.$(".icon",this)[0])[0];
			if(!inputs.checked){
				tools.$(".icon",this)[0].style.borderColor = "#fff";
				tools.$("input",tools.$(".icon",this)[0])[0].style.display = "none";
			}
			
		});
	};
	
	//给每一个li添加事件处理
	tools.each(allLi,function(liItem){
		liHandle(liItem);
	});
	
	//每一个按钮的事件
	
	function inputCheckboxClick(icon){
		tools.addEvent(icon,"click",function(ev){
			if( ev.target.nodeName === "INPUT" ){
				if(ev.target.checked){
					allSelected.checked = true;
					checkedNum = 0;
					for( var i = 0; i < alIcon.length; i++ ){
						if(!tools.$("input",alIcon[i])[0].checked){
							allSelected.checked = false;
						}else{
							checkedNum++;
						}
					}
					
					info.style.display = "block";
					
				}else{
					checkedNum--;
					allSelected.checked = false;
				}
				
				selectNum.innerHTML = checkedNum;
			}
		})
	}
	
	//给初始的每一个input添加事件处理
	tools.each(alIcon,function(liItem){
		inputCheckboxClick(tools.$("input",liItem)[0]);
	});
	
	//全选按钮的操作
	tools.addEvent(allSelected,"click",function(ev){
		
		if( !allLi.length ||  edtor &&　edtor.style.display === "block"){
			this.checked = false;
		}else if(this.checked ){
			for( var i = 0; i < alIcon.length; i++ ){
				alIcon[i].style.borderColor = "#2e80dc";
				tools.$("input",alIcon[i])[0].style.display = "block";
				tools.$("input",alIcon[i])[0].checked = true;
			}
			info.style.display = "block";
			selectNum.innerHTML = alIcon.length;
			checkedNum = alIcon.length;
		}else{
			for( var i = 0; i < alIcon.length; i++ ){
				alIcon[i].style.borderColor = "#fff";
				tools.$("input",alIcon[i])[0].style.display = "none";
				tools.$("input",alIcon[i])[0].checked = false;
			}
			info.style.display = "none";
			selectNum.innerHTML = 0;
			checkedNum = 0;
		}
	});
	//删除选中项目
	tools.addEvent(delectItem,"click",function(){
		var items = whoSelect();
		tools.each(items,function(item){
			filesSet.removeChild(tools.parents(item,"LI"));
		});
		//改变全选的状态,隐藏掉info
		allSelected.checked = !!whoSelect().length;
		selectNum.innerHTML = 0;
		info.style.display = "none";
		
	});
	
	//重命名,那必须直选中一项才能重命名,否则为灰色,不能点击
	
	tools.addEvent(rename,"click",function(){
		var selectArr = whoSelect();
		if( selectArr.length === 1 ){
			
			tools.$("strong",tools.parents(selectArr[0],"LI"))[0].style.display = "none";
			tools.$(".edtor",tools.parents(selectArr[0],"LI"))[0].style.display = "block";
			tools.$(".createInputBtn",tools.parents(selectArr[0],"LI"))[0].select();
						
			edtor = tools.$(".edtor",tools.parents(selectArr[0],"LI"))[0];
		}
	})
	
	//判断有多少个被选中了
	function whoSelect(){
		var arr = [];
		for( var i = 0; i < alIcon.length; i++ ){
			if(tools.$("input",alIcon[i])[0].checked){
				arr.push(alIcon[i]);
			};
		}
		return arr;
	}
})()
