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
	var generationBillMenu = $api.getStorage('generationBillMenu');
	var user = $api.getStorage('user');

	api.showProgress({
		title : '处理中',
		modal : true,
	});
	var opts = {
		 username : user.loginname,
		 id : generationBillMenu.id
	};
	console.log(getObj(opts));
	// 领取代维调度任务
	$client.getGeneration(opts, function(ret, err) {
		if (ret) {
			if (ret.success) {
					console.log('RSupdate1')
					updateRecommendStatus(generationBillMenu.id)
					api.toast({
					    msg: '领取成功',
					    duration: 2000,
					    location: 'bottom'
					});
					api.hideProgress();
					closeDiv('allWorkMenuAll');
					window.setTimeout(function() {
						api.closeWin();
							api.execScript({
									name: 'generationBillListWin',
							    frameName: 'generationBillListFrm',
							    script: 'refreshFrame();'
							});
							api.execScript({
									name: 'generationBillListWin',
							    frameName: 'generationBillListFinshFrm',
							    script: 'refreshFrame();'
							});
						//直接返回上一层
					}, 1000);
				} else {
						api.hideProgress();
						showToast(ret.data_info);
				}
		} else {
				api.hideProgress();
				showToast(err.msg);
		}
	})
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
				finishOptBill(msg, divId);
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
	api.toast({
		msg : msg,
		duration : 1000,
		location : 'middle'
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
		//              closeFrame('generationBillMenu');
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
function optTransfer(type,e) {
	if(e){
		var detailDiv=$(e).siblings('.detailDiv');//获取该层信息
		var el=detailDiv[0];
		var update_time = $api.attr(el, 'update_time');//修改时间
		var c_org_name = $api.attr(el, 'c_org_name');//地市组织名称
		var remark = $api.attr(el, 'remark');        //额外信息
		var id = $api.attr(el, 'id');									//工单id
		var user_name = $api.attr(el, 'user_name');  //代维人员姓名
		var work_info = $api.attr(el, 'work_info');  //工作信息
		var work_time = $api.attr(el, 'work_time');  //每天工作时长
		var update_user = $api.attr(el, 'update_user'); //修改人
		var a_org_id = $api.attr(el, 'a_org_id');       //区域组织id
		var a_org_name = $api.attr(el, 'a_org_name');   //区域组织名称
		var tel_number = $api.attr(el, 'tel_number');   //代维人员电话
		var col1 = $api.attr(el, 'col1');               //备用字段1
		var dw_org_name = $api.attr(el, 'dw_org_name');  //所属代理或修改组织机构名称
		var create_time = $api.attr(el, 'create_time');  //创建时间
		var entrytime = $api.attr(el, 'entrytime');      //入职时间
		var tower_org_name = $api.attr(el, 'tower_org_name');//所属铁塔组织名称
		var col2 = $api.attr(el, 'p_org_id');						//备用字段2
		var p_org_id = $api.attr(el, 'col2');						//省组织id
		var user_login_code = $api.attr(el, 'user_login_code');//代维人员登陆账号
		var status = $api.attr(el, 'status');          //是否在岗，枚举值：0 否  1是
		var nativeplace = $api.attr(el, 'nativeplace');//籍贯
		var dw_years = $api.attr(el, 'dw_years');       //劳动合同期限
		var id_number = $api.attr(el, 'id_number');
		var homeaddress = $api.attr(el, 'homeaddress'); //家庭住址
		var culture = $api.attr(el, 'culture');        //文化程度
		var gender = $api.attr(el, 'gender');         //
		var c_org_id = $api.attr(el, 'c_org_id');    //地市id
		var col3 = $api.attr(el, 'col3');           //备用字段3
		var nation = $api.attr(el, 'nation');       //名族
		var worker_type = $api.attr(el, 'worker_type');//所属代维专业
		var p_org_name = $api.attr(el, 'p_org_name');//省份名称
		var tower_org_id = $api.attr(el, 'tower_org_id');//铁塔组织id
		var buying_insurance = $api.attr(el, 'buying_insurance');//是否参保
		var dw_org_code = $api.attr(el, 'dw_org_code');//代维人员所属机构编码
		var pageParam = {};
		pageParam.update_time = update_time;
		pageParam.c_org_name = c_org_name;
		pageParam.remark = remark;
		pageParam.id = id;
		pageParam.username = user_name;
		pageParam.work_info = work_info;
		pageParam.work_time = work_time;
		pageParam.update_user = update_user;
		pageParam.a_org_id = a_org_id;
		pageParam.a_org_name = a_org_name;
		pageParam.tel_number = tel_number;
		pageParam.col1 = col1;
		pageParam.dw_org_name = dw_org_name;
		pageParam.create_time = create_time;
		pageParam.entrytime = entrytime;
		pageParam.tower_org_name  = tower_org_name;
		pageParam.col2  = col2;
		pageParam.p_org_id  = p_org_id;
		pageParam.loginname  = user_login_code;
		pageParam.status  = status;
		pageParam.nativeplace  = nativeplace;
		pageParam.dw_years  = dw_years;
		pageParam.id_number  = id_number;
		pageParam.homeaddress  = homeaddress;
		pageParam.culture  = culture;
		pageParam.gender  = gender;
		pageParam.c_org_id  = c_org_id;
		pageParam.col3  = col3;
		pageParam.nation = nation;
		pageParam.worker_type = worker_type;
		pageParam.tower_org_id = tower_org_id;
		pageParam.buying_insurance = buying_insurance;
		pageParam.dw_org_code = dw_org_code;
		$api.setStorage('transferData',pageParam);
	}
	if (type == "REVERT") {
		openBillList("generationWriteWin");
	}	else if(type=="TRANSFER"){//dingxb 转派
		openBillList("generationTransferWin");
	}else if(type=="GPSMAP"){
		var opts={
			start:1,
			limit:20
		}
		$client.getGenerationList(opts,function(ret,err){
			if(ret.success){
				if(ret.listClaimedList.length>0){
					api.openWin({
						name : 'generationGpsWin',
						url :  '../generation/generationGpsWin.html',
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
														closeFrame('allWorkMenuAll');
													}, 1500);
				}else {
					api.toast({
						msg: '请领取工单后尝试',
						location: 'bottom'
					});
				}
			}
		})
	}else if(type=="TAKEPHOTO"){
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
		openBillList("billStationSign_win");
//		api.closeFrame();
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
//点击菜单触发的事件
function optBill(type,e) {
	if(e){
		var detailDiv=$(e).siblings('.detailDiv');
		var el=detailDiv[0];
		var status = $api.attr(el, 'status');
		var id = $api.attr(el, 'id');
		var task_name = $api.attr(el, 'task_name');
		var site_id = $api.attr(el, 'site_id');
		var site_name = $api.attr(el, 'site_name');
		var work_time_limit = $api.attr(el, 'work_time_limit');
		var task_score = $api.attr(el, 'task_score');
		var do_man_name = $api.attr(el, 'do_man_name');
		var tl_ce_cola = $api.attr(el, 'tl_ce_cola');
		var tangleicol = $api.attr(el, 'tangleicol');
		var col_cc = $api.attr(el, 'col_cc');
		var col_dd = $api.attr(el, 'col_dd');
		var ceshi_new_b = $api.attr(el, 'ceshi_new_b');
		var utf = $api.attr(el, 'utf');
		var ceshi_new_a = $api.attr(el, 'ceshi_new_a');
		var ceshi_new  = $api.attr(el, 'ceshi_new');
		var p_org_name = $api.attr(el, 'p_org_name');
		var c_org_name = $api.attr(el, 'c_org_name');
		var a_org_name = $api.attr(el, 'a_org_name');
		var self_task_name = $api.attr(el, 'self_task_name');
		var task_type_name = $api.attr(el, 'task_type_name');
		var add_man_code  = $api.attr(el, 'add_man_code');
		var update_user   = $api.attr(el, 'update_user');
		var create_time   = $api.attr(el, 'create_time');
		var update_time   = $api.attr(el, 'update_time');
		var version_id   = $api.attr(el, 'version_id');
		var create_user   = $api.attr(el, 'create_user');
		var do_man_code   = $api.attr(el, 'do_man_code');
		var get_task_time = $api.attr(el, 'get_task_time');
		var do_end_time = $api.attr(el, 'do_end_time');
		var pageParam = {};
		pageParam.status = status;
		pageParam.id = id;
		pageParam.task_name = task_name;
		pageParam.site_id = site_id;
		pageParam.site_name = site_name;
		pageParam.work_time_limit = work_time_limit;
		pageParam.task_score = task_score;
		pageParam.do_man_name = do_man_name;
		pageParam.tl_ce_cola = tl_ce_cola;
		pageParam.tangleicol = tangleicol;
		pageParam.col_cc = col_cc;
		pageParam.col_dd = col_dd;
		pageParam.ceshi_new_b = ceshi_new_b;
		pageParam.utf = utf;
		pageParam.ceshi_new_a = ceshi_new_a;
		pageParam.ceshi_new  = ceshi_new;
		pageParam.p_org_name  = p_org_name;
		pageParam.c_org_name  = c_org_name;
		pageParam.a_org_name  = a_org_name;
		pageParam.self_task_name  = self_task_name;
		pageParam.task_type_name  = task_type_name;
		pageParam.add_man_code  = add_man_code;
		pageParam.update_user  = update_user;
		pageParam.create_time  = create_time;
		pageParam.update_time  = update_time;
		pageParam.version_id  = version_id;
		pageParam.create_user  = create_user;
		pageParam.do_man_code  = do_man_code;
		pageParam.type = api.pageParam.type;
		pageParam.get_task_time = get_task_time;
		pageParam.do_end_time = do_end_time;
		pageParam.fromPage = "generationBillListWin";
		$api.setStorage('allWorkMenuAll',pageParam);
		$api.setStorage('parolData',pageParam);
	}

	if (type == "REVERT") {
		openBillList("generationWriteWin");
	}	else if(type=="TRANSFER"){//dingxb 转派
		openBillList("generationTransferWin");
	}else if(type=="GPSMAP"){
		var opts={
			start:1,
			limit:20
		}
		$client.getGenerationList(opts,function(ret,err){
			if(ret.success){
				if(ret.listClaimedList.length>0){
					api.openWin({
						name : 'generationGpsWin',
						url :  '../generation/generationGpsWin.html',
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
														closeFrame('allWorkMenuAll');
													}, 1500);
				}else {
					api.toast({
						msg: '请领取工单后尝试',
						location: 'bottom'
					});
				}
			}
		})
	}else if(type=="TAKEPHOTO"){
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
		openBillList("billStationSign_win");
//		api.closeFrame();
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
										closeFrame('allWorkMenuAll');
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

function getDoorsList() {
	var applyId = '';
	if ( typeof (api.pageParam.applyId) != 'undefined') {
		applyId = api.pageParam.applyId;
	}
	var opts = {
		stationid : api.pageParam.stationId,
		applyId : applyId,
		type:"station" //出入站
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
		closeFrame('allWorkMenuAll');
	});
}

apiready = function() {
	initHeader();
	var standBillMenuMain = $api.byId('standBillMenuMain');
	var user = $api.getStorage('user');
	generationBillMenu = $api.getStorage('generationBillMenu')||"";
	var user = $api.getStorage('user');
	//			console.log("+++++++++++++++++++++=test=+++++++++++++++++++++++");
	if (generationBillMenu != null && standBillMenuMain != null) {
		menuUserId = user.userid;
		menuApplyId = generationBillMenu.applyid;
		isneedperson = generationBillMenu.isneedperson;
		// wxx
		// console.log(getObj(generationBillMenu));
		standCause= generationBillMenu.standCause;
		if (isneedperson == 'Y') {
			$('#isNeedSelId').val('Y');
		} else {
			$('#isNeedSelId').val('N');
			$('#fsuStatusLabel,#fsuStatusDiv').show();
		}
		var cause = "";
		if (generationBillMenu.cause != "" && generationBillMenu.cause != null) {
			cause = generationBillMenu.cause;
		} else {
			cause = "未知";
		}
		$api.byId('user_name1').innerHTML = "操作人:" + user.username;
//		document.getElementById('acceptSnId').innerHTML = standBillModel.applyid;
		// document.getElementById('acceptTitleId').innerHTML = cause;
		document.getElementById('applyStandDateId').value = generationBillMenu.applystanddate;
		var tpl = $api.byId('standBillMenu-template').text;
		var tempFn = doT.template(tpl);
		standBillMenuMain.innerHTML = tempFn(generationBillMenu);
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
