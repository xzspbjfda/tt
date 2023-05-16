var gradeType = "";
var idclean = "";
var billModel = null;
var isJishu = "Y";
var lon;
var lat;
apiready = function() {
	initHeader();

}
//点击菜单触发的事件
function optXunjian(type) {

	var billModel = $api.getStorage('billModel');
	api.pageParam.operateType = type;
	//	if (billModel) {
	//		billModel.operateType = type;
	//	}
	var user = $api.getStorage('user');
	var userId = user.userid;

	if (type == "ACCEPT") {
//		api.openApp({
//                  iosUrl:"ChinaTower"
//                  appParam: {
//     				userName: 'donglei',
//     				siteCode: '44010600000025',
//     				openclassname: 'CTResStationResultViewController'
//  }
//              },function(ret, err){
//                  if(ret){
//                  }else{
//                       MainClass.api_toast("QQ没有安装");
//                  }
//              });


		var snVal = "编号：" + billModel.billsn;
		var titleVal = "内容：" + billModel.billtitle;
		$api.byId('acceptSnId').innerHTML = snVal;
		$api.byId('acceptTitleId').innerHTML = titleVal;
		easyDialog.open({
			container : 'acceptDiv',
			fixed : false
		});
	}  else if (type == 'JUMPRES') {
	var deviceid = api.pageParam.index_id;;
				console.log("deviceid:"+deviceid);
				var user= $api.getStorage("user");
//				console.log("ChinaTower://userName="+user.loginname+"&siteCode="+deviceid+"&openclassname=CTResStationResultViewController");

				if(api.systemType=='ios'){
		        	api.openApp({
                    iosUrl:"ChinaTower://userName="+user.loginname+"&siteCode="+deviceid+"&openclassname=CTResStationResultViewController"
                });
                }else if(api.systemType=='android'){
                	console.log("ChinaTower://userName="+user.loginname+"&siteCode="+deviceid+"&openclassname=CTResStationResultViewController");
                	api.openApp({
					    androidPkg:'com.android.activity.CHINATOWER_ACTION',
				        appParam: {
				            userName: user.loginname,
				            siteCode: deviceid,
				            openclassname:'CTResStationResultViewController'
				        }
				});
                }
//              api.closeFrame({
//			name : 'xunjianMenu_frm'
//		});
		api.closeFrame();
	} else if (type == 'NAVTOSTATION') {
	api.openWin({
				name : 'mapHeader',
				url : '../mapHeader.html',
				reload : true
			});
	api.closeFrame();

} else if (type == 'ZHUAN') {
	api.execScript({
		frameName : 'projectListFrm',
		script : 'totransfer();'
	});
}  else {
		api.toast({
			msg : "正在开发中",
			location : 'bottom'
		});
	}
}

function selectIsNeed(el) {
	var isNeed = $(el).val();
	if ("Y" == isNeed) {
		$api.byId('opinionLabelDiv').style.display = "none";
	} else {
		$api.byId('opinionLabelDiv').style.display = "";
//		$api.byId('noNeed').innerHTML = "不需要上站原因:";

	}
}

function selectIsJishu(el) {
	isJishu = $(el).val();
	if ("Y" == isJishu) {//技术专家列表
		$api.byId('the_username').innerHTML = "技术专家:";
		$client.getTechPeople({
			billid : billModel.billid,
			billsn : billModel.billsn
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					$('#areaManagerId').empty();
					var areaManagers = ret.list;
					for (var i = 0, size = areaManagers.length; i < size; i++) {
						$('<option>').text(areaManagers[i].username + "(" + areaManagers[i].type + ")").val(areaManagers[i].userid).appendTo('#areaManagerId');
					}
					easyDialog.open({
						container : 'otherDiv',
						fixed : false
					});
				} else {
					api.toast({
						msg : ret.data_info
					});
				}
			} else {
				api.toast({
					msg : err.msg
				});
			}
		});
	} else if ("N" == isJishu) {//区域经理
		$api.byId('the_username').innerHTML = "区域经理:";
		$client.getAreaManagers({
			billid : billModel.billid,
			siteid : billModel.st_id
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					$('#areaManagerId').empty();
					var areaManagers = ret.list;
					for (var i = 0, size = areaManagers.length; i < size; i++) {
						$('<option>').text(areaManagers[i].username).val(areaManagers[i].userid).appendTo('#areaManagerId');
					}
					easyDialog.open({
						container : 'otherDiv',
						fixed : false
					});
				} else {
					api.toast({
						msg : ret.data_info
					});
				}
			} else {
				api.toast({
					msg : err.msg
				});
			}
		});
	}
}

//接单操作
function acceptFunc() {
	var billModel = $api.getStorage('billModel');
	var user = $api.getStorage('user');
	var userId = user.userid;
	var billId = billModel.billid;
	var billSn = billModel.billsn;
	var taskId = billModel.taskid;
	api.showProgress({
		title : '处理中',
		modal : true,
	});
	var data = {};
	data.userID = userId;
	data.billId = billId;
	data.billSn = billSn;
	data.taskId = taskId;
	data.billStatus = 0;
	data.faultCouse = "手机接单";
	data.handlerResult = "手机接单";
	$client.acceptBill(data, function(ret, err) {
		if (ret) {
			if (ret.success) {
				console.log('RSupdate11')
				updateRecommendStatus(data.billSn)
				//              api.toast({
				//                  msg : '接单成功',
				//                  location : 'bottom'
				//              });
				finishOptBill1(0,"接单成功", "acceptDiv");
			} else {
				api.toast({
					msg : ret.data_info,
					location : 'bottom'
				});
			}
		} else {
			api.toast({
				msg : err.msg,
				location : 'bottom'
			});
		}
		api.hideProgress();
	});
}

//关闭弹出DIV对话框
function closeDiv(divId) {
	easyDialog.close({
		container : divId
	});
}

function closeFrame(name) {
	if (name == null || name == '' || name == 'undefined') {
		api.closeFrame();
	} else {
		api.closeFrame({
			name : 'xunjianMenu_frm'
		});
	}
}

function signOptFunc() {
	billModel = $api.getStorage('billModel');
	var user = $api.getStorage('user');
	var userId = user.userid;
	var billId = billModel.billid;
	var billSn = billModel.billsn;
	var taskId = billModel.taskid;
	var linkInfo = $api.byId('contactTelTextId1').value;
	var remark = $api.byId('locationId1').value;
	var causeDealInfo = $api.byId('otherDealInfoId1').value;
	api.showProgress({
		title : '处理中',
		modal : true
	});
	//		userId, billSn, taskId, '', causeDealInfo
	$client.upStationSign({
		taskId : taskId,
		linkInfo : linkInfo,
		signLon : lon,
		signLat : lat,
		remark : remark,
		cause : causeDealInfo,
		isStand : idclean,
		billSn : billSn
	}, function(ret, err) {
		if (ret) {
			if (ret.success) {
				finishOptBill1(2,"到站签到成功", "SignDiv");
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

function restartLocationFunc() {
	easyDialog.close({
		container : "SignDiv"
	});
	getHeartFromGps("main_bill_detail_win", "billMenu_frm");
}

function getHeartFromGps(winName, frmName) {
	var script = "startLocation('" + winName + "','" + frmName + "');";
	console.log("异步加载" + script);
	api.execScript({
		name : "home_win",
		frameName : 'gps',
		script : script
	});
	//      gps_invoke();

}

//处理方法
function commonDoWith(target) {
	var val = $(target).val();
	if (val != '') {
		var text = $('#otherDealInfoId').val() + val;
		$('#otherDealInfoId').val(text);
	}
}

function gps_invoke() {

	var lastLocation = $api.getStorage('LAST_GPS_LOCATION1');

	if (!lastLocation || !lastLocation.status || lastLocation.timestamp == 0 || lastLocation.lon == 0 || lastLocation.lat == 0) {
		return;
	}
	console.log("经度：" + lastLocation.lon);
	$api.setStorage("lon1", lastLocation.lon);
	$api.setStorage("lat1", lastLocation.lat);
	api.showProgress({
		title : '定位中……',
		modal : true
	});
	window.setTimeout(function() {
		api.hideProgress();
		optBill("UPSTATIONSIGN");
	}, 1100);

}

//其它操作
function otherOptFunc() {
	billModel = $api.getStorage('billModel');
	var user = $api.getStorage('user');
	var userId = user.userid;
	var billId = billModel.billid;
	var billSn = billModel.billsn;
	var taskId = billModel.taskid;
	//  var areamanagerId = billModel.st_areamanager;
	var areaMan = $('#areaManagerId').val();
	var optType = $api.byId('optTypeId').value;
	var causeDealInfo = $api.byId('otherDealInfoId').value;

	var linkInfo = $api.byId('contactTelTextId').value;
	if (optType == "UPGRADE") {
		if (areaMan != null && areaMan != "") {
			api.showProgress({
				title : '处理中'
			});
			if ("GET_BILL_LIST" == api.pageParam.type) {
				gradeType = "ASSIST";
			} else if ("GET_BILL_UPDATE_LIST" == api.pageParam.type) {
				if ("Y" == isJishu) {
					gradeType = "TECH";
				} else if ("N" == isJishu) {
					gradeType = "AREAMAN";
				}
			}
			var opts = {
				userId : userId,
				billSn : billSn,
				taskId : taskId,
				linkInfo : linkInfo,
				dealComment : causeDealInfo,
				areaMan : areaMan,
				gradeType : gradeType
			};
			$client.upgrade(opts, function(ret, err) {
				if (ret) {
					if (ret.success) {
						finishOptBill1(1,"升级成功", "otherDiv");
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
		} else {
			api.toast({
				msg : "请选择区域经理或者站址没有配置区域经理，无法进行升级操作",
				location : 'middle'
			});
		}
	} else if (optType == "ISUPSTATION") {
		var isNeedUpstation = $api.byId('isStandId').value;
		if ("N" == isNeedUpstation && causeDealInfo == "" || causeDealInfo == null) {
			api.toast({
				msg : '不需要上站原因必填'
			});
			return;
		}
		api.showProgress({
			title : '处理中',
			modal : true
		});
		//		userId, billSn, taskId, '', causeDealInfo
		$client.isNeedUpStation({
			taskId : taskId,
			linkInfo : linkInfo,
			standCause : causeDealInfo,
			isStand : isNeedUpstation,
			billSn : billSn
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					finishOptBill1(1,"确认成功", "otherDiv");
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
	} else if (optType == "CON_CONFIRM") {
		var isNeedUpstation = $api.byId('isStandId').value;
		if ("N" == isNeedUpstation && causeDealInfo == "" || causeDealInfo == null) {
			api.toast({
				msg : '不同意发电，处理方法必填'
			});
			return;
		}
		api.showProgress({
			title : '处理中',
			modal : true
		});
		//		userId, billSn, taskId, '', causeDealInfo
		$client.isConfire({
			taskId : taskId,
			linkInfo : linkInfo,
			dealComment : causeDealInfo,
			whetherThePower : isNeedUpstation,
			billSn : billSn
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					finishOptBill1(1,"确认成功", "otherDiv");
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
	}else if (optType == "CON_APPROVE") {
		var isNeedUpstation = $api.byId('isStandId').value;
		if ("N" == isNeedUpstation && causeDealInfo == "" || causeDealInfo == null) {
			api.toast({
				msg : '运营商不认可，处理方法必填'
			});
			return;
		}
		api.showProgress({
			title : '处理中',
			modal : true
		});
		//		userId, billSn, taskId, '', causeDealInfo
		$client.isApprove({
			taskId : taskId,
			linkInfo : linkInfo,
			dealComment : causeDealInfo,
			isApprove : isNeedUpstation,
			billSn : billSn
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					finishOptBill1(1,"确认成功", "otherDiv");
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
	} else if (optType == "FEEDBACK") {
		api.showProgress({
			title : '处理中',
			modal : true
		});
		//		userId, billSn, taskId, '', causeDealInfo
		$client.feedBack({
			taskId : taskId,
			linkInfo : linkInfo,
			dealComment : causeDealInfo,
			billSn : billSn
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
				var num=$api.getStorage('num');
				if(num==2){
				finishOptBill1(2,"反馈成功", "otherDiv");
				}else{
					finishOptBill1(1,"反馈成功", "otherDiv");
				}
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
	} else if (optType == "REPLY") {//支撑回复
		api.showProgress({
			title : '处理中',
			modal : true
		});
		//		api.toast({
		//			msg : '数值：' + api.pageParam.gradetype
		//		});
		if ("TECH" == api.pageParam.gradetype) {
			$client.replyTechMan({
				taskId : taskId,
				linkInfo : linkInfo,
				dealComment : causeDealInfo,
				billSn : billSn
			}, function(ret, err) {
				if (ret) {
					if (ret.success) {
						finishOptBill("支撑回复成功", "otherDiv");
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
		} else if ("AREAMAN" == api.pageParam.gradetype) {
			$client.replyAreaMan({
				taskId : taskId,
				linkInfo : linkInfo,
				dealComment : causeDealInfo,
				billSn : billSn
			}, function(ret, err) {
				if (ret) {
					if (ret.success) {
						finishOptBill("支撑回复成功", "otherDiv");
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

	} else if (optType == "TRANSFERS") {
		var transferUserId = $api.byId('transferSelId').value;
		if (transferUserId == null || transferUserId == "") {
			api.alert({
				msg : "请选择接收人"
			});
			return false;
		}
		api.showProgress({
			title : '处理中',
			modal : true
		});
		$client.transfers({
			taskId : taskId,
			linkInfo : linkInfo,
			dealComment : causeDealInfo,
			billSn : billSn,
			notifyUserId : transferUserId
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
	} else if (optType == "REMINDER") {
		api.showProgress({
			title : '处理中',
			modal : true
		});
		$client.reminder({
			taskId : taskId,
			linkInfo : linkInfo,
			dealComment : causeDealInfo,
			billSn : billSn
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					finishOptBill("催办成功", "otherDiv");
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
	} else if (optType == "ADDDEAL") {//追加描述
		api.showProgress({
			title : '处理中',
			modal : true
		});
		$client.addDeal({
			taskId : taskId,
			linkInfo : linkInfo,
			dealComment : causeDealInfo,
			billSn : billSn
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					finishOptBill("追加描述成功", "otherDiv");
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
	} else if (optType == "SUPPORTCONFIRM") {
		api.showProgress({
			title : '处理中',
			modal : true
		});
		$client.supportConfirm({
			taskId : taskId,
			linkInfo : linkInfo,
			dealComment : causeDealInfo,
			billSn : billSn
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					finishOptBill1(1,"故障确认成功", "otherDiv");
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

function finishOptBill1(num,msg, closeDivId) {
	easyDialog.close({
		container : closeDivId
	});
	if(num==0||num==1||num==2){
	openBillList1(num,"bill-list_win");
	}else{
		openBillList("bill-list_win");
	}

	api.toast({
		msg : msg,
		duration : 1000,
		location : 'bottom'
	});
	window.setTimeout(function() {
		//openBillList("bill-list_win");
		//关闭工单详情Win
		closeWindow();

		//关闭操作选择列表
		//      closeFrame('');
	}, 1100);
}

function finishOptBill(msg, closeDivId) {
	easyDialog.close({
		container : closeDivId
	});
//	if(num==0||num==1||num==2){
//	openBillList1(num,"bill-list_win");
//	}else{
		openBillList("bill-list_win");
//	}

	api.toast({
		msg : msg,
		duration : 1000,
		location : 'bottom'
	});
	window.setTimeout(function() {
		//openBillList("bill-list_win");
		//关闭工单详情Win
		closeWindow();

		//关闭操作选择列表
		//      closeFrame('');
	}, 1100);
}

function closeWindow() {
	api.closeWin({
	});
	//  api.closeWin({
	//      name : "main_bill_detail"
	//  });
}

function openBillList1(num,name) {
console.log("num"+num);
	api.execScript({
			name : name,
			script : 'refreshBillList('+num+');'
		});
}

function openBillList(name) {

	console.log("name:" + name);
	if (name == 'bill-list_win') {
//		api.execScript({
//			name : name,
//			script : 'refreshBillList('+2+');'
//		});
				api.execScript({
					name : name,
					frameName : 'bill-listCon_frm',
					script : 'cb_refresh();'
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
//		api.closeFrame();
	}
}

//故障类型选择触发事件
function onRadioRefief(obj, refiefTypeDivId, refiefTypeId, refiefDealInfoDivId, refiefDealInfoId) {
	var objValue = obj.value;
	document.getElementById(refiefTypeId).value = "";
	document.getElementById(refiefDealInfoId).value = "";
	if (objValue == "N") {
		$('#' + refiefTypeDivId).hide();
		$('#' + refiefDealInfoDivId).hide();
	} else {
		$('#' + refiefTypeDivId).show();
		$('#' + refiefDealInfoDivId).show();
	}
}

//故障类型选择触发事件
function onSelCause(obj, stationCauseId, indoorCauseId) {
	var objValue = obj.value;
	var stationCauseObj = document.getElementById(stationCauseId);
	var indoorCauseObj = document.getElementById(indoorCauseId);
	if (objValue == "1") {
		stationCauseObj.style.display = "block";
		indoorCauseObj.style.display = "none";
	} else {
		stationCauseObj.style.display = "none";
		indoorCauseObj.style.display = "block";
	}
}

//回单操作
function revertFunc() {
	var billModel = $api.getStorage('billModel');
	var user = $api.getStorage('user');
	var userId = user.userid;
	var billId = billModel.billid;
	var billSn = billModel.billsn;
	var isRefief = document.getElementById('isRefiefHid').value;
	var refiefType = document.getElementById('refiefTypeId').value;
	var refiefDealInfo = document.getElementById('refiefDealInfoId').value;
	var faultType = document.getElementById('faultTypeId').value;
	var stationCauseVal = document.getElementById('stationCauseId').value;
	var indoorCauseVal = document.getElementById('indoorCauseId').value;
	var stationCause = $("#stationCauseId").find("option:selected").text();
	var indoorCause = $("#indoorCauseId").find("option:selected").text();
	var causeDealInfo = document.getElementById('causeDealInfoId').value;
	var faultCause = "";
	var isStandSta = document.getElementById('isStandStaHid').value;
	var recoverTime = document.getElementById('recoverTimeId').value;
	var recoverDate = document.getElementById('recoverDateId').value;
	if (isRefief == "") {
		api.toast({
			msg : "请选择是否免责",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	if (isRefief == "Y") {
		if (refiefType == "") {
			api.toast({
				msg : "请选择免责条款",
				duration : 1000,
				location : 'middle'
			});
			return;
		}
		if (refiefDealInfo == "") {
			api.toast({
				msg : "请填写免责具体原因",
				duration : 1000,
				location : 'middle'
			});
			return;
		}
	}
	if (faultType == "1") {
		if (stationCauseVal == "") {
			api.toast({
				msg : "请选择故障原因",
				duration : 1000,
				location : 'middle'
			});
			return;
		}
		faultCause = stationCause;
	} else if (faultType == "2") {
		if (indoorCauseVal == "") {
			api.toast({
				msg : "请选择故障原因",
				duration : 1000,
				location : 'middle'
			});
			return;
		}
		faultCause = indoorCause;
	} else {
		api.toast({
			msg : "请选择故障类型",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	if (recoverDate == "") {
		api.toast({
			msg : "请选择修复日期",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	if (recoverTime == "") {
		api.toast({
			msg : "请选择修复时间",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	api.showProgress({
		title : '处理中',
		modal : true
	});
	var data = {};
	data.userID = userId;
	data.billId = billId;
	data.billSn = billSn;
	data.billStatus = 1;
	data.faultCouse = faultCause;
	data.handlerResult = causeDealInfo;
	data.isRelief = isRefief;
	data.reliefType = refiefType;
	data.reliefCause = refiefDealInfo;
	data.isUpStation = isStandSta;
	data.recoveryTime = recoverDate + " " + recoverTime + ":00"
	$client.genelecRevertBill(data, function(ret, err) {
		if (ret) {
			if (ret.success) {
				api.toast({
					msg : "回单成功",
					duration : 1000,
					location : 'middle'
				});
				window.setTimeout(function() {
					api.openWin({
						name : 'bill-list',
						url : 'bill-list_win.html',
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
				}, 1100);
			} else {
				api.toast({
					msg : ret.data_info,
					location : 'middle'
				});
			}
		} else {
			api.toast({
				msg : err.msg,
				location : 'middle'
			});
		}
		api.hideProgress();

	});
}


// 门禁
function showDoorDeviceList() {
	$api.rmStorage("doorDeviceList");
	getDoorsList();
}

function getDoorsList() {
	var applyId = '';
	if ( typeof (api.pageParam.applyId) != 'undefined') {
		applyId = api.pageParam.applyId;
	}
	var opts = {
		stationid : api.pageParam.stationid,
		applyId : api.pageParam.taskid,
		type:"task" //故障
	};
	$client.getStationDoorDeviceList(opts, function(ret, err) {//点击门禁
		if (ret) {
			if (ret.success) {
				// if (ret.list.length > 0) {
					$api.setStorage("doorDeviceList", ret.list);
					api.openFrame({
						name : 'doorDeviceDialog_frm',
						url : '../dialog/doorDeviceDialog_frm.html',
						bgColor : "rgba(0,0,0,0)",
						bounces : false,
						pageParam : api.pageParam,
						rect : {
							x : 0,
							y : 0,
							w : 'auto',
							h : 'auto'
						}
					});
				// } else {
				// 	api.toast({
				// 		msg : '该工单没有相关门禁列表！',
				// 		location : 'bottom'
				// 	});
				// }
			} else {
				api.toast({
					msg : ret.data_info,
					location : 'bottom'
				});
			}
		} else {
			api.toast({
				msg : err.msg,
				location : 'bottom'
			});
		}
		closeFrame('generationBillMenu');
	});
}
