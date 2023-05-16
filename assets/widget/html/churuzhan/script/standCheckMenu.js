var standCheckModel;
var user;
apiready = function() {
//初始化上站核实信息
	initHeader();
	var standCheckMenuMain = $api.byId('standCheckMenuMain');
	user = $api.getStorage('user');
	standCheckModel = $api.getStorage('standCheckDetail');
	$api.byId('user_name').innerHTML = "操作人：" + user.username;  //反馈操作人
	$api.byId('user_name1').innerHTML = "操作人：" + user.username; //上站操作人
	$api.byId('contactTelTextId').value = user.mobilephone;        //反馈人电话
	var tpl = $api.byId('standcheckMenu-template').text;
	var tempFn = doT.template(tpl);
	standCheckMenuMain.innerHTML = tempFn(standCheckModel);
	api.parseTapmode();
}

//根据状态类型判断
function optBills(type){
	if(type == "acceptDiv"){ //接单
		document.getElementById("shadowId").style.display = "none";
		document.getElementById("standCheckMenuMain").style.display = "none";
		$("#acceptDiv").show();
	}else if(type == "ispromptModelPanel"){  //上站
		document.getElementById("shadowId").style.display = "none";
		document.getElementById("standCheckMenuMain").style.display = "none";
		$("#ispromptModelPanel").show();
	}else if(type == "confireDivs"){ //签到
		openBillList("checkStationSign_win");
	}else if(type == "REVERT"){ //回单
		openBillList("checkBillRevert");
	}else if(type == "FEEDBACK"){ //反馈
		document.getElementById("shadowId").style.display = "none";
		document.getElementById("standCheckMenuMain").style.display = "none";
		$("#FEEDBACK").show();
	}
}

//接单接口
function acceptConfirm(){
		var time = new Date().pattern("yyyy-MM-dd HH:mm:ss");
		var status = standCheckModel.status;
		var wosn = standCheckModel.wo_sn;
		var woId = standCheckModel.wo_id;
		var opts ={
			status : status,
			wosn : wosn,
			woId : woId,
			time : time
		};
		checkSubmit(opts,$client.acceptConfirm);
}

//是否上站接口 否直接归档，是展示另一个页面
function ensure(){
	var onstandReason = $api.byId('onstandReason').value; //上站原因
	var isneedonStation = $api.byId('isneedonStation').value; //是否上站
	var wosn = standCheckModel.wo_sn;
	var woId = standCheckModel.wo_id;
		var opts = {
			onstandReason :onstandReason,
			isneedonStation :isneedonStation,
			wosn :wosn,
			woId :woId
		};
		checkSubmit(opts,$client.noUpStation);
}

//反馈接口
	function coupleSubmit(){
			var fromPage = api.pageParam.fromPage;
			var wosn = standCheckModel.wo_sn;
			var woId = standCheckModel.wo_id;
			var operatorphone  = $api.byId('contactTelTextId').value; //联系电话
			var info = $api.byId('Info').value; //反馈内容
			if(info == "" || info == null){
				api.toast({
					msg : "反馈内容不能为空....",
					location : 'middle'
				});
				return;
			}
			var opts = {
					wosn : wosn,
					woId : woId,
					operatorphone : operatorphone,
					info : info
			};
			$client.contentFeedback(opts,function(ret, err) {
				if (ret) {
					if (ret.success) {
						api.toast({
							msg : "反馈成功",
							duration : 1000,
							location : 'middle'
						});
						window.setTimeout(function() {
								//刷新页面的list
								if (fromPage == 'standOnCheckWin') {
										api.sendEvent({
												 name: 'standOnCheckFrm',
												 extra: {
														 state: 'no'
												 }
										 });
								}
								api.closeWin({
										name : 'mainStandcheckDetail'
								});
								api.closeWin();
						}, 1500);
				} else {
						api.toast({
							msg : ret.errorMsg,
							location : 'middle'
						});
					}
				} else {
					api.toast({
						msg : '接口访问失败',
						location : 'middle'
					});
				}
				api.hideProgress();
			 });
			// checkSubmit(opts,$client.contentFeedback);  可以换成这个
	}


//统一调用接口
function checkSubmit(opts, callFn, callback){
	var fromPage = api.pageParam.fromPage;
	callFn(opts, function(ret, err) {
		if (ret) {
			if (ret.success) {
				api.toast({
					msg : "操作成功",
					duration : 1000,
					location : 'middle'
				});
				window.setTimeout(function() {
						//刷新页面的list
						if (fromPage == 'standOnCheckWin') {
								api.sendEvent({
										 name: 'standOnCheckFrm',
										 extra: {
												 state: 'no'
										 }
								 });
						}
						api.closeWin({
								name : 'mainStandcheckDetail'
						});
						api.closeWin();
						//此时最顶层win为工单详情
				}, 1500);
		} else {
				api.toast({
					msg : ret.errorMsg,
					duration : 1000,
					location : 'middle'
				});
			}
		} else {
			api.toast({
				msg : '接口访问失败',
				location : 'middle'
			});
		}
	})
}

//取消按钮
function closeFrame(name) {
	if (name == null || name == '' || name == 'undefined') {
		api.closeFrame();
	} else {
		api.closeFrame({
			name : name
		});
	}
}

//关闭弹出DIV对话框
function closeDiv(divId) {
	easyDialog.close({
		container : divId
	});
}



//调用页面
function openBillList(name) {
	api.openWin({
		name : name,
		url : name + '.html',
		bounces : false,
		rect : {
			x : 0,
			y : 0,
			w : 'auto',
			h : 'auto'
		},
		reload : true,
		pageParam : api.pageParam
	});

	setTimeout(function() {
				closeFrame('standCheckMenu');
				}, 1500);
}
