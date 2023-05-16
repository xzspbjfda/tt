var menuUserId = "";
var menuApplyId = "";
var isneedperson;
var standBillModel;
//
//		最终审核
function lastConfireFunc() {
	var agreeDealComment = $api.byId('isArgeeConfire').value;
	if (!agreeDealComment) {
		api.toast({
			msg : "请选择是否同意",
			duration : 1000,
			location : 'middle'
		});
		return;
	}

	var data = {};
	data.userID = menuUserId;
	data.applyid = menuApplyId;
	data.isstand = agreeDealComment;
	data.portType = "STATION_BILL_IS_PROMPT";
	dealStandBillFunc(data, "lastConfireData", "操作成功");
}

//是否同意
function isAgreeFunc() {
	var agreeDealComment = $api.byId('agreeDealCommentId').value;
	var isAgreeSel = $api.byId('isAgreeSelId').value;
	var isreief = $api.byId('isreiefId').value;
	var isreieftype = $api.byId('isreieftypeId').value;
	var reliefDealcomment = $api.byId('reliefDealcommentId').value;

	if (!isAgreeSel) {
		api.toast({
			msg : "请选择是否同意",
			duration : 1000,
			location : 'middle'
		});
		return;
	}

	if ("Y" == isAgreeSel && !isreief) {
		api.toast({
			msg : "请选择是否免责",
			duration : 1000,
			location : 'middle'
		});
		return;
	} else if ("N" == isAgreeSel && !agreeDealComment) {
		api.toast({
			msg : "处理意见必填",
			duration : 1000,
			location : 'middle'
		});
		return;
	}

	if ("Y" == isAgreeSel && "Y" == isreief) {
		if (!isreieftype) {
			api.toast({
				msg : "免责条款必选",
				duration : 1000,
				location : 'middle'
			});
			return;
		} else if (!reliefDealcomment) {
			api.toast({
				msg : "免责具体原因必填",
				duration : 1000,
				location : 'middle'
			});
			return;
		}

	}

	var data = {};
	data.userID = menuUserId;
	data.applyid = menuApplyId;
	data.dealcomment = agreeDealComment;
	data.isagree = isAgreeSel;
	data.isreief = isreief;
	data.isreieftype = isreieftype;
	data.cause = reliefDealcomment;
	data.portType = "STATION_BILL_IS_AGREE";
	dealStandBillFunc(data, "isAgreeModelPanel", "操作成功");
}

function isrelief() {
	var isreliefy = $api.byId('isreiefId').value;
	if (isreliefy == 'N') {
		$("#isreieftypeId").val("");
		$api.byId("isreieftypeId").disabled = true;
		$api.byId("reliefDealcommentId").disabled = true;
		$api.byId("reliefDealcommentId").value = '';
	} else {
		$api.byId("isreieftypeId").disabled = false;
		$api.byId("reliefDealcommentId").disabled = false;
	}
}

function isAgree() {
	var isAgreeChange = $api.byId('isAgreeSelId').value;
	if (isAgreeChange == 'N') {
		$('#test1').hide();
		$('#test2').hide();
		$('#test3').hide();
	} else {
		$('#test1').show();
		$('#test2').show();
		$('#test3').show();
	}
}

//初始化免责信息
function initRelief() {
	var st_ifrelief = standBillModel.st_ifrelief;
	var st_ifnight_mz = standBillModel.st_ifnight_mz;
	var $refiefType = $('#isreieftypeId');
	var $isRefief = $('#isreiefId');
	if (st_ifrelief == "是" || st_ifnight_mz == "是") {
		$isRefief.val('Y');
		if (st_ifrelief == "是") {
			$refiefType.val('4');
		} else if (st_ifnight_mz == "是") {
			$refiefType.val('2');
		}
	}
}

//协调上站
function coordinateFunc() {
	var isNeedSel = $api.byId('isNeedSelId').value;
	var isBookSel = $api.byId('isBookSelId').value;
	var coorStandDateId = $api.byId('coorStandDateId').value;
	var outStandDateId = $api.byId('outStandDateId').value;

	var coorDealComment = $api.byId('coorDealCommentId').value;
	var fsuStatus = $api.byId('fsuStatus').value;
	//var coorStandDateDivId  = $api.byId('coorStandDateDivId');
	//var applyStandDateDivId  = $api.byId('applyStandDateDivId');
	//var applyStandDateId  = $api.byId('applyStandDateId');
	if (!isNeedSel) {
		api.toast({
			msg : "请选择是否需要随工",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	if (isNeedSel == 'N') {
		if (!fsuStatus) {
			api.toast({
				msg : "请选择FSU状态",
				duration : 1000,
				location : 'middle'
			});
			return;
		}
	}
	if (!isBookSel) {
		api.toast({
			msg : "请选择是否如约上站",
			duration : 1000,
			location : 'middle'
		});
		return;
	} else if (isBookSel == "Y") {
		coorStandDateId = $api.byId('applyStandDateId').value;
	}
	if (!coorStandDateId && isBookSel == "N") {
		api.toast({
			msg : "请填写协调上站时间",
			duration : 1000,
			location : 'middle'
		});
		return;
	}

	if (!outStandDateId) {
		api.toast({
			msg : "请填写协调离站时间",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	var data = {};
	data.userID = menuUserId;
	data.applyid = menuApplyId;
	data.isneedperson = isNeedSel;
	data.isbooking = isBookSel;
	data.coorstanddate = coorStandDateId.replace(/T/, " ") + ":00";
	data.cooroffsitedate = outStandDateId.replace(/T/, " ") + ":00";
	data.dealcomment = coorDealComment;
	data.fsuStatus = fsuStatus;
	data.portType = "STATION_BILL_COORDINATE";
	dealStandBillFunc(data, "coordinateModelPanel", "操作成功");
}

//是否及时上站
function isStandFunc() {
	var standTime = $api.byId('standTimeId').value;
	var dealComment = $api.byId('dealCommentId').value;
	var isStandSel = $api.byId('isStandSelId').value;
	var msg = "";
	if (!isStandSel) {
		msg += "请选择是否及时上站\n";
	}
	if (!standTime) {
		msg += "请填写实际上站时间\n";
	}
	if (msg) {
		api.toast({
			msg : msg,
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	var data = {};
	data.userID = menuUserId;
	data.applyid = menuApplyId;
	data.standdate = format(standTime);
	data.dealcomment = dealComment;
	data.isstand = isStandSel;
	data.portType = "STATION_BILL_IS_PROMPT";
	dealStandBillFunc(data, "ispromptModelPanel", "操作成功");
}

//接单操作
function acceptFunc() {
	var acceptDealComment = document.getElementById('acceptDealCommentId').value;
	var data = {};
	data.userID = menuUserId;
	data.applyid = menuApplyId;
	data.dealcomment = acceptDealComment;
	data.portType = "STATION_BILL_ACCEPT";
	dealStandBillFunc(data, "acceptDiv", "接单成功");
}

//审批操作
function auditFunc() {
	var $contain = $('#auditModelPanel');
	var isAuditFlag = $api.byId('auditFlagId').value;
	if (!isAuditFlag) {
		api.toast({
			msg : "是否审批必选",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	var data = {};
	data.userID = menuUserId;
	data.applyid = menuApplyId;
	data.dealComment = $contain.find('[name=dealCommentId]').val();
	data.auditFlag = isAuditFlag;
	data.portType = "STATION_BILL_AUDIT";
	dealStandBillFunc(data, "auditModelPanel", "审批成功");
}

//上站确认
function confireFunc() {
	var $contain = $('#confireDiv');
	var data = {};
	data.userID = menuUserId;
	data.applyid = menuApplyId;
	data.standType = $contain.find('#standType').val();
	data.portType = "STATION_BILL_CONFIRM";
	dealStandBillFunc(data, "confireDiv", "上站确认成功");
}

function dealStandBillFunc(data, divId, msg) {
	api.showProgress({
		title : '处理中',
		modal : false
	});
	$client.standDeal(data, function(ret, err) {
		if (ret) {
			if (ret.success) {
				if(msg=="接单成功"){
					finishOptBill(msg, divId);
				}else{
					finishOptBill(msg, divId);
				}
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

//关闭弹出DIV对话框
function closeDiv(divId) {
	easyDialog.close({
		container : divId
	});
}

function finishOptBill(msg, closeDivId) {
	var fromPage = api.pageParam.fromPage;
	//用来表示来之上站待办还是上站已办
	//如果字段为空或未定义，这默认赋值为上站待办
	if (fromPage == null || fromPage == '' || fromPage == 'undefined') {
		fromPage = "standBillListWin";
	}
	if (closeDivId) {
		easyDialog.close({
			container : closeDivId
		});
	}
	console.log("==接单完成，检查是否还有待办工单【上站】===")
	var  parolData = $api.getStorage('parolData');
	console.log( parolData.stationname)
	console.log( parolData.stationcode)
	var opts = {
		pagename: 'sz',
		pageaction: 'ACCEPT',
		stationName: parolData.stationname,
		stationcode: parolData.stationcode
	}
	console.log("调用是否有待办-传入参数："+JSON.stringify(opts));
	$client.sixBillRemind(opts, function(ret, err) {
		console.log("调用是否有待办-返回结果："+JSON.stringify(ret));
		console.log(ret.billCntInfo.length)
		if (ret.billCntInfo.length>0){
			if (ret.billCntInfo.length>0){
				var billCntInfo = JSON.parse(ret.billCntInfo);
				if(billCntInfo.page=="sz" && billCntInfo.status=="ACCEPT" && billCntInfo.count>0){
					api.toast({
						msg : msg+"，本站还有工单未处理！",
						duration : 3000,
						location : 'middle'
					});
				}else{
					api.toast({
						msg : msg,
						duration : 1000,
						location : 'middle'
					});
				}
			}
		}else{
			api.toast({
				msg : msg,
				duration : 1000,
				location : 'middle'
			});
		}
	});
	window.setTimeout(function() {
		//              openBillList(fromPage);
		//              //如果是从上站已办页面过来，则操作完后退回到上站已办时，要刷新framegroup中的第一个frame
		if (fromPage == 'standFinishBillListWin') {
			api.execScript({
				name : 'standFinishBillListWin',
				script : 'refreshFrame();'
			});
		}
		if (fromPage == "standBillListWin") {
			api.execScript({
				name : 'standBillListWin',
				script : 'refreshFrame();'
			});
		}
		api.closeWin();
		//直接返回上一层
		//              api.closeToWin({
		//              name:fromPage,
		//              animation: {
		//			        type: 'none',
		//			        subType: 'from_rights',
		//			        duration: 300
		//			    }
		//              });
		//              //关闭出入站工单详情页面
		//              closeWin('mainStandBillDetail');
		//              //关闭操作列表界面
		//              closeFrame('standBillMenu');
	}, 1000);
}

//是否如约选择触发事件
function onSelIsBook(obj) {
	var objValue = obj.value;
	var applyStandDateId = $api.byId('applyStandDateId');
	var coorStandDateDivId = $api.byId('coorStandDateDivId');
	if (objValue == "Y") {
		applyStandDateId.style.display = "";
		coorStandDateDivId.style.display = "none";
	} else {
		applyStandDateId.style.display = "none";
		coorStandDateDivId.style.display = "";
	}
}

//点击菜单触发的事件
function optBill(type) {
	if (type == "REVERT") {
		              openBillList("standBillRevert");
//		var name = "standBillRevert";
//		api.openWin({
//			name : name,
//			url : name + '.html',
//			bounces : false,
//			rect : {
//				x : 0,
//				y : 0,
//				w : 'auto',
//				h : 'auto'
//			},
//			reload : true,
//			pageParam : api.pageParam
//		});
//		closeFrame('standBillMenu');
		//				api.closeWin();
	}
	else if(type=="TAKEPHOTO"){
	api.execScript({
			frameName : 'standBillDetail_frm',
			script : 'cb_openBillPicDetail();'
		});
		api.closeFrame();

	}

//	else if (type == "coordinateModelPanel") {
//		openBillList("coordateUpstationWin");
//		api.closeFrame();
//	}
	 else if (type == "PHONESIGN") {
		//上站工单签到时风险提醒
		api.openFrame({
			name : 'riskTip',
			url : env.getRiskTipUrl() + "?time=10&event=onRiskTipDone&v=" + new Date().getTime(),
			bounces : false,
			rect : {x : 0, y : 0, w : 'auto', h : 'auto'},
			pageParam : api.pageParam,
			reload : true
		});
		//openBillList("billStationSign_win");
	} else if (type == "confireDiv") {
		document.getElementById("shadowId").style.display = "none";
		document.getElementById("standBillMenuMain").style.display = "none";
		var standBillModel = $api.getStorage('standBillModel');
		var fsustatus = standBillModel.fsustatus;
		var fsustatus_text = '';
		if (fsustatus) {
			switch(fsustatus) {
				case 'Y':
					fsustatus_text = '正常';
					break;
				case 'N':
					fsustatus_text = '不正常';
					break;
			}
			$('<option>').text(fsustatus_text).val(fsustatus).appendTo('#confireDiv [name=fsuStatus]');
		}
		initDict();
		easyDialog.open({
			container : type,
			fixed : false
		});
	} else if (type == "lastConfireData") {
		var standBillModel = $api.getStorage('standBillModel');
		if ("Y" == standBillModel.isagree && "Y" == standBillModel.isreief) {
			$("#info").text("区域经理认为本次上站不及时可免责");
			$("#reliefLeft").text("免责条款：");
			$("#reliefRight").text(standBillModel.isreieftype);
			$("#reliefCause").text(standBillModel.isreiefcause);
			$("#isreliefCause").show();
		} else {
			$("#info").text("区域经理不同意本次上站不及时");
			$("#isreliefCause").hide();
			$("#reliefLeft").text("处理描述：");
			$("#reliefRight").text(standBillModel.AgreeMero ? standBillModel.AgreeMero : "无");
		}
		easyDialog.open({
			container : type,
			fixed : false
		});
	}else if(type == "openDoor_electric"){//zhangzhitao
		var t_standBillModel = $api.getStorage('standBillModel');
		//consoleObj(t_standBillModel);
		var pageParam = {
				// fsuid : $(el).attr("data-fsuid"),
				// devicecode : $(el).attr("data-devicecode"),
				// signal : $(el).attr("data-signal"),
				// devicename : $(el).attr("data-name"),
				// stationName : api.pageParam.stationName
				t_workKind:"2",
				t_cause:t_standBillModel.cause
		};
		api.openWin({
				name : 'autoOpenDoor_win',
				url : '../autoOpenDoor_win.html',
				bounces : false,
				pageParam : pageParam
		});
	}else if(type == "openDoor_inspect"){//zhangzhitao wxx
		var cause = $api.getStorage('cause');
		console.log('66666666666666666666666666666666666');
		console.log(getObj(api.pageParam));
		var stationId = api.pageParam.stationId;
		var pageParam = {
				// fsuid : $(el).attr("data-fsuid"),
				// devicecode : $(el).attr("data-devicecode"),
				// signal : $(el).attr("data-signal"),
				// devicename : $(el).attr("data-name"),
				// stationName : api.pageParam.stationName,
				t_workKind:"3",
				t_cause: cause
		};
		api.openWin({
				name : 'autoOpenDoor_win',
				url : '../autoOpenDoor_win.html',
				bounces : false,
				pageParam : pageParam
		});
	}else  if(type == "leaveStation") {
		var standBillModel =  $api.getStorage('standBillModel');
		easyDialog.open({
			container : type,
			fixed : false
		});
	}else {

		if (type == "isAgreeModelPanel") {
			initisAgree();
		}
		document.getElementById("shadowId").style.display = "none";
		document.getElementById("standBillMenuMain").style.display = "none";
		easyDialog.open({
			container : type,
			fixed : false
		});
	}
}

function initDict(){
       var standWayList= $api.getStorage("standWayList");
       if(standWayList!=null&&standWayList.length>0){
//     alert("集合数："+standWayList.length);
      	 $('#standType').empty();
        $('<option>').text('请选择').val('').appendTo('#standType');
		renderTemp('standType', 'dict-template', standWayList, true);
		 }
        }

function initisAgree() {
	initDict1();
	var isAgreeVal = $api.byId('isAgreeSelId').value;
	if (isAgreeVal != 'Y') {
		console.log("=========================test=========================");
		//				$api.byId('test1').style.dispaly="none";
		//				$api.byId('test2').style.dispaly="none";
		//				$api.byId('test3').style.dispaly="none";
		$('#test1').hide();
		$('#test2').hide();
		$('#test3').hide();
		//				$('#isreieftypeId').parent().hide();
		//				$('#reliefDealcommentId').parent().hide();
		//				$('#relief1').parent().hide();
		//				$('#relief2').parent().hide();
		//				$('#relief3').parent().hide();
	} else {
		$('#test1').show();
		$('#test2').show();
		$('#test3').show();
	}
	initRelief();
}

function initDict1(){
       var disclaimerList= $api.getStorage("disclaimerList");//进站人单位
       if(disclaimerList!=null&&disclaimerList.length>0){
//     alert("集合数："+disclaimerList.length);
      	 $('#isreieftypeId').empty();
        $('<option>').text('请选择').val('').appendTo('#isreieftypeId');
		renderTemp('isreieftypeId', 'dict-template', disclaimerList, true);
		 }

        }

function phoneSign() {
	var lastLocation = $api.getStorage('LAST_GPS_LOCATION');
	lon = lastLocation.lon;
	lat = lastLocation.lat;
	var time = new Date().pattern("yyyy-MM-dd HH:mm:ss");
	var xyJson = GPS.gcj_decrypt_exact(lat, lon);
	// ios要把  GCJ-02 to WGS-84   安卓不用转
	if (xyJson != null) {
		var data = {};
		data.userID = menuUserId;
		data.applyid = menuApplyId;
		data.signdate = time;
		data.signlon = xyJson.lon;
		data.signlat = xyJson.lat;
		data.portType = "STATION_BILL_SIGN";
		dealStandBillFunc(data, "", "签到成功");
	} else {
		api.toast({
			msg : "坐标获取失败，请开启GPS或者到外面获取坐标",
			location : 'middle'
		});
	}
}

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
										closeFrame('standBillMenu');
									}, 1500);
}

function closeFrame(name) {
	if (name == null || name == '' || name == 'undefined') {
		api.closeFrame();
	} else {
		api.closeFrame({
			name : name
		});
	}
}

function closeWin(name) {
	if (name == null || name == '' || name == 'undefined') {
		api.closeWin();
	} else {
		api.closeWin({
			name : name
		});
	}
}

function showDoorDeviceList() {
	$api.rmStorage("doorDeviceList");
	getDoorsList();
}
//门禁
function getDoorsList() {
	var applyId = '';
	if ( typeof (api.pageParam.applyId) != 'undefined') {
		applyId = api.pageParam.applyId;
	}
	var opts = {
		stationid : api.pageParam.stationId,
		applyId : applyId
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
		closeFrame('standBillMenu');
	});
}

//	远程开门zhangning
	function openTheDoor(){
		document.getElementById("shadowId").style.display = "none";
		document.getElementById("standBillMenuMain").style.display = "none";
		$('#openoor').show();
	}

	function getDoorsLists() {
			var opts = {
			StationId : $api.getStorage('st_code'),
			UserName : $api.getStorage('UserName'),
			UserUnit : $api.getStorage('UserUnit'),
			UserMobile : $api.getStorage('UserMobile'),
			OpenReason : $api.getStorage('OpenReason'),
			UserId :  $api.getStorage('user').userid
			};
		console.log("传入远程开门的数据1---》"+JSON.stringify(opts));
			let l1 = new Date().getTime();
			console.log(`准备开始请求,当前时间戳${l1}`)
			$client.getStationOpenDoor(opts, function(ret, err) {
				let l2 = new Date().getTime()
				console.log(`请求结束,当前时间戳${l2}`)
				console.log("开门结果",JSON.stringify(ret))
				alert(`请求结束,耗时:${l2 - l1}ms`)
			//远程开门
			if (ret) {
				var value = ret.value;
				if(value == null || value == ""){
					api.toast({
						msg : "开门成功",
						location : 'middle'
					});
				}else{
					api.toast({
						msg : ret.value,
						location : 'middle'
					});
				}

			} else {
				api.toast({
					msg : err.msg,
					location : 'bottom'
				});
			}
			// closeFrame('standBillMenu');
			});
		}


apiready = function() {
	initHeader();
	var standBillMenuMain = $api.byId('standBillMenuMain');
	var user = $api.getStorage('user');
	standBillModel = $api.getStorage('standBillModel');
	var user = $api.getStorage('user');
	//			console.log("+++++++++++++++++++++=test=+++++++++++++++++++++++");
	if (standBillModel != null && standBillMenuMain != null) {
		menuUserId = user.userid;
		menuApplyId = standBillModel.applyid;
		isneedperson = standBillModel.isneedperson;
		// wxx
		console.log(JSON.stringify(standBillModel));
		standCause= standBillModel.standCause;
		if (isneedperson == 'Y') {
			$('#isNeedSelId').val('Y');
		} else {
			$('#isNeedSelId').val('N');
			$('#fsuStatusLabel,#fsuStatusDiv').show();
		}
		var cause = "";
		if (standBillModel.cause != "" && standBillModel.cause != null) {
			cause = standBillModel.cause;
		} else {
			cause = "未知";
		}
		$api.byId('user_name1').innerHTML = "操作人：" + user.username;
//		document.getElementById('acceptSnId').innerHTML = standBillModel.applyid;
		document.getElementById('acceptTitleId').innerHTML = cause;
		document.getElementById('applyStandDateId').value = standBillModel.applystanddate;
		var tpl = $api.byId('standBillMenu-template').text;
		var tempFn = doT.template(tpl);
		standBillMenuMain.innerHTML = tempFn(standBillModel);
		api.parseTapmode();
	}
	//在ios和Android下调用不同的样式
	if (api.systemType == "android") {
		$("#standTimeId").addClass("transferSel");
		$("#applyStandDateId").addClass("transferSel");
		$("#coorStandDateId").addClass("transferSel");
	} else {
		$("#standTimeId").addClass("transferTime");
		$("#applyStandDateId").addClass("transferTime");
		$("#coorStandDateId").addClass("transferTime");
	}
	//上站工单签到时风险提醒监听事件
	api.addEventListener({name: 'onRiskTipDone'}, function(ret) {
		switch (ret.value) {
			case "done":
				api.closeFrame({name:"riskTip"})
				openBillList("billStationSign_win");
				break;
			case "cancel":
				api.closeFrame({name:"riskTip"})
				api.closeFrame({name:"standBillMenu"})
				break;
		}
	});
}
function isOnTime() {
	var isOnTime = $api.byId('isBookSelId').value;
	if (isOnTime == 'Y') {
		$("#applyStandDateDivId").show();
		$("#coorStandDateDivId").hide();
	} else {
		$("#coorStandDateDivId").show();
		$("#applyStandDateDivId").hide();
	}
}

function toggleFsuStatus(target) {
	var val = $(target).val();
	if (val == 'N') {
		$('#fsuStatusLabel,#fsuStatusDiv').show();
	} else {
		$('#fsuStatusLabel,#fsuStatusDiv').hide();
	}
}
