
	var repairDetail;
	var userList;
	var manageridArr;
	var managerNameArr;
apiready = function() {
			initHeader();
			renderTemp('repairBillMenuMain', 'repairBillMenu-template', api.pageParam);
			repairDetail= $api.getStorage("repairDetail");
			api.parseTapmode();
			//维修工单签到时风险提醒监听事件
			api.addEventListener({name: 'onRiskTipDone'}, function(ret) {
                switch (ret.value) {
                    case "done":
                        api.closeFrame({name:"riskTip"})
						openBillList("billStationSign_win");
                        break;
                    case "cancel":
                        api.closeFrame({name:"riskTip"})
                        api.closeFrame({name:"repairBillMenu"})
                        break;
                }
            });
		}
		//点击菜单触发的事件
		function optBill(type) {

		var dwPerson= $api.getStorage("dwPerson");
		var contractList= $api.getStorage("contractList");
		var manPerson= $api.getStorage("manPerson");

		var user= $api.getStorage("user");
			if (type == 'problemCheck') {
				openBillList("repairCheck_win");
			} else if (type == 'doPlan') {
				openBillList("repairDoPlan_win");
			} else if (type == 'doOperate') {
				var opts={
					billsn:repairDetail.billsn
				}
				$client.repairSignCheck(opts,function(ret,err){
					console.log(JSON.stringify(ret));
					if (ret) {
						if (ret.errorMsg=='请先签到') {
							api.toast({
								msg : '请先签到!',
								location : 'middle'
							});
						} else {
							openBillList("repairDoOperate_win");
						}
					}
				})
			} else if (type == "PHONESIGN") {
				var opts={
					billsn:repairDetail.billsn
				}
				$client.repairSignCheck(opts,function(ret,err){
					console.log(JSON.stringify(ret));
					if (ret) {
						if (ret.errorMsg=='请先签到') {
							//维修工单签到时风险提醒
							api.openFrame({
								name : 'riskTip',
								url : env.getRiskTipUrl() + "?time=10&event=onRiskTipDone&v=" + new Date().getTime(),
								bounces : false,
								rect : {x : 0, y : 0, w : 'auto', h : 'auto'},
								pageParam : api.pageParam,
								reload : true
							});
						} else {
							api.toast({
								msg : "已签到！",
								location : 'middle'
							});
						}
					}
				}) 
	 	}else if (type == 'MAKEHIDDEN') {
			openBillList("makeHidden_win");
		}else if (type == 'checkAccept') {
				openBillList("repairCheckAccept_win");
			}else if (type == "TRANSFERS") {
		var userJsonArr = new Array();
		var useridArr = new Array();
		$api.byId('spanTitleId').innerHTML = "工单转派";
		$api.byId('optTypeId').value = "TRANSFERS";
		$api.byId('transferLabelDivId').style.display = "";
		$api.byId('contactTelSpanId').style.display = "";
		$api.byId('user_name').innerHTML = "操作人：" + user.username;
		$api.byId('contactTelTextId').value = user.mobilephone;
		$api.byId('transferSelDivId').style.display = "";
		var stationId = api.pageParam.stationId;

		if(repairDetail.fixobject=='1'){
//			userList=dwPerson;
		for (var i = 0, size = dwPerson.length ;i < size; i++) {
			$('<option>').text(dwPerson[i].username).val(dwPerson[i].userid).appendTo('#transferSelId');
		}
		}else if(repairDetail.fixobject=='2'){
			for(var i = 0, size = contractList.length ;i < size; i++){
				var managerid=contractList[i].managerid;
				var managername=contractList[i].managername;
				if (managerid.indexOf(',') > 0) {
						manageridArr = managerid.split(",");
						managerNameArr = managername.split(",");

						for (var j = 0; j < manageridArr.length; j++) {
						var per = {};
						per.userid = manageridArr[j];
						per.username = managerNameArr[j];
						if(useridArr.indexOf(manageridArr[j])==-1){
							useridArr.push(manageridArr[j]);
							userJsonArr.push(per);
						}

					}
					} else {
						if(useridArr.indexOf(managerid)==-1){
						var per = {};
						per.userid = managerid;
						per.username = managername;
							useridArr.push(managerid);
							userJsonArr.push(per);
						}
					}
			}
			for(var i = 0, size = userJsonArr.length ;i < size; i++){
			$('<option>').text(userJsonArr[i].username).val(userJsonArr[i].userid).appendTo('#transferSelId');
			}
		}







//
				easyDialog.open({
					container : 'otherDiv',
					fixed : false
				});
//			}

	}else if (type == "backUp") {
		$api.byId('spanTitleId').innerHTML = "工单回退";
		$api.byId('contactTelSpanId').style.display = "";
		$api.byId('transferLabelDivId').style.display = "";
		$api.byId('user_name').innerHTML = "操作人：" + user.username;
		$api.byId('contactTelTextId').value = user.mobilephone;
		$api.byId('optTypeId').value = "backUp";
		easyDialog.open({
			container : 'otherDiv',
			fixed : false
		});
	}else if (type == "FASH") {
		$api.byId('spanTitleId2').innerHTML = "方案审核";
		$api.byId('user_name2').innerHTML = user.username;
		$api.byId('optTypeId2').value = "FASH";
		easyDialog.open({
			container : 'otherDivSh',
			fixed : false
		});
	}  else if (type == "hangUp") {
		$api.byId('spanTitleId').innerHTML = "工单解挂";
		$api.byId('contactTelSpanId').style.display = "";
		$api.byId('transferLabelDivId').style.display = "";
		$api.byId('user_name').innerHTML = "操作人：" + user.username;
		$api.byId('contactTelTextId').value = user.mobilephone;
		$api.byId('optTypeId').value = "hangUp";
		easyDialog.open({
			container : 'otherDiv',
			fixed : false
		});
	}else if (type == "mandatoryMaintenance") {
 	 	var deviceId = api.pageParam.deviceId;
 	 	var stationId = api.pageParam.stationId;
 	 	var opts = {
 	 		deviceId : deviceId,
		  	stationId : stationId,
 	 	};

		$client.checkMandatory(opts, function(ret, err) {
			if (ret) {
				if (ret.success) {
					//判断是否强制维修
					//如果没有当前标志位，则继续方案制定
					if (ret.flag == "") {
						openBillList("repairDoPlan_win");
					}

					if (ret.flag == 'Y') {
						$api.byId('spanTitleId').innerHTML = "强制维修项目";
						$api.byId('user_name').innerHTML = "同站址同设备一年维修次数超过2次，是否继续？";
						$api.byId('user_name').style = "color:#FF0000;";
						$api.byId('opinionLabelDiv').style = "height: 110px; margin-top:40px";
						$api.byId('optTypeId').value = "mandatoryMaintenance";
						easyDialog.open({
							container : 'otherDiv',
							fixed : false
						});
					}else {
						openBillList("repairDoPlan_win");
					}
				}else {
					api.toast({
				 		msg : ret.data_info,
				 		location : 'middle'
				});
				}
		}
		})
 	 }
 }

function otherOptFunc2() {
	var projectid = repairDetail.projectid;
	var billsn = repairDetail.billsn;
	var userPhone;
	var areaMan = $('#areaManagerId').val();
	var optType = $api.byId('optTypeId2').value;
	var causeDealInfo2 = $api.byId('otherDealInfoId2').value;
	var audit= $api.byId('audit').value
	if(causeDealInfo2 == null || causeDealInfo2 == ""){
	api.toast({
						msg:'请填写审核描述！'
					});
		return false;
	}
	api.showProgress({
		title : '处理中',
		modal : true
	});
	var opts={
		audit : audit,
		dealComment : causeDealInfo2,
		billsn : billsn,
		projectid : projectid
	}
	console.log("审核中----repairDetail ==>> "+JSON.stringify(repairDetail));
	console.log("审批中-->>"+JSON.stringify(opts));
	if(repairDetail.fixtype == 3) {  //【审核】 维修方式 为“更新改造”，调用新接口
		console.log("审批，，，，");
		$client.repairRemouldAuditPlan(opts,function(ret, err) {
			if (ret) {
				if (ret.success) {
					finishOptBill("提交审核成功", "otherDivSh");
				} else {
					api.toast({
						msg : ret.data_info,
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
		})
	} else {
		$client.repairAuditPlan(opts, function(ret, err) {
			console.log(getObj(ret));
			if (ret) {
				if (ret.success) {
					finishOptBill("提交审核成功", "otherDivSh");
				} else {
					api.toast({
						msg : ret.data_info,
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
	}
	
}


//其它操作
function otherOptFunc() {
	var projectid = repairDetail.projectid;
	var billsn = repairDetail.billsn;
	var billId = repairDetail.billId;
	var userPhone;
	//  var areamanagerId = billModel.st_areamanager;
	var areaMan = $('#areaManagerId').val();
	var optType = $api.byId('optTypeId').value;
	var causeDealInfo = $api.byId('otherDealInfoId').value;
	var linkInfo = $api.byId('contactTelTextId').value;
	 if (optType == "TRANSFERS") {
		var transferUserId = $api.byId('transferSelId').value;
//		var userName = $api.byId('transferSelId').text;
		var userName = $("#transferSelId").find("option:selected").text();
		if (transferUserId == null || transferUserId == "") {
//			api.alert({
//				msg : "请选择接收人"
//			});
			api.toast({
	            msg:'请选择接收人'
            });
			return false;
		}else if(causeDealInfo == null || causeDealInfo == ""){
		api.toast({
	            msg:'请填写原因说明！'
            });
			return false;
		}
//		if(userList!=null&&userList.length>0){
//		for(var i=0;i<userList.length;i++){
//			if(transferUserId==userList[i].userid){
//			userPhone=userList[i].mobilephone;
//			}
//		}
//
//		}
//		alert(userName);
		api.showProgress({
			title : '处理中',
			modal : true
		});
		$client.transfornPerson({
			billsn : billsn,
			projectid : projectid,
			linkInfo : linkInfo,
			dealComment : causeDealInfo,
			dispatchUser : transferUserId,
			dispatchName : userName,
			dispatchPhone : userPhone

		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					finishOptBill("转派成功", "otherDiv");
				} else {
					api.toast({
						msg : ret.data_info,
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
	} else if (optType == "backUp") {
		if(causeDealInfo == null || causeDealInfo == ""){
		api.toast({
	            msg:'请填写原因说明！'
            });
			return false;
		}
		api.showProgress({
			title : '处理中',
			modal : true
		});
		$client.repairBackUpBill({
			linkInfo : linkInfo,
			dealComment : causeDealInfo,
			billsn : billsn,
			projectid : projectid
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					finishOptBill("回退成功", "otherDiv");
				} else {
					api.toast({
						msg : ret.data_info,
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
	}  else if (optType == "hangUp") {//追加描述

		if(causeDealInfo == null || causeDealInfo == ""){
		api.toast({
	            msg:'请填写原因说明！'
            });
			return false;
		}
		api.showProgress({
			title : '处理中',
			modal : true
		});
		$client.repairHangUpBill({
			linkInfo : linkInfo,
			dealComment : causeDealInfo,
			billsn : billsn,
			projectid : projectid
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					finishOptBill("工单解挂成功", "otherDiv");
				} else {
					api.toast({
						msg : ret.data_info,
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
	} else if (optType == "mandatoryMaintenance"){ //强制维修
		if(causeDealInfo == null || causeDealInfo == ""){
		api.toast({
	            msg:'请填写原因说明！'
            });
			return false;
		}
		api.showProgress({
			title : '处理中',
			modal : true
		});

		var opts={
			dealComment : causeDealInfo,
			billsn : billsn
		}
		$client.saveMaintenances(opts, function(ret, err){
			if (ret) {
				if (ret.success) {
					openBillList("repairDoPlan_win");
				} else {
					api.toast({
						msg : ret.data_info,
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
		}
}


function openBillList(name) {

	console.log("name:" + name);
	if (name == 'repair-list_win') {
				api.execScript({
					name : name,
					frameName : 'repair-listCon_frm',
					script : 'refreshList();'
				});
	} else {
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
										closeFrame('repairBillMenu');
									}, 1500);

	}
}

function closeFrame(name) {
	if (name == null || name == '' || name == 'undefined') {
		api.closeFrame();
	} else {
		api.closeFrame({
			name : 'repairBillMenu'
		});
	}
}

function finishOptBill(msg, closeDivId) {
	easyDialog.close({
		container : closeDivId
	});
		openBillList("repair-list_win");

	api.toast({
		msg : msg,
		duration : 1000,
		location : 'bottom'
	});
	window.setTimeout(function() {
		
		api.execScript({
			name : "repair/repair-list_win",
			frameName : 'repair-listCon_frm',
			script : 'refreshList();'
		});
	api.closeWin({
	});
	}, 1100);
}
