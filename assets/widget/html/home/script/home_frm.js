var refreshUserTaskCountTimer;
//刷新首页数据的定时器
var refreshLocationTimer;
//刷新GPS位置的定时器
//获取地位坐标
//坐标获取成功后执行的方法
var lon = 0;
var lat = 0;

var userId = "";

var msg1 = "";

var timer;
/**
 * 打开子菜单模块
 */
function openWinList(name, title, type) {

	var delay = 0;
	var nickName;
	if (api.systemType == "android") {
		delay = 200;
	}
	if (name == 'bulle/bulle_list_win') {
		nickName = "bulle_list_win";
	} else if (name == 'bill/bill-list_win') {
		nickName = "bill-list_win";
	} else if (name == 'emergency/emergency-list_win') {
		nickName = "emergency-list_win";
	} else if (name == 'alarm/alarm-list_win') {
		nickName = "alarm-list_win";
	} else if (name == 'station/station-list') {
		nickName = "station-list";
	} else if (name == 'xunjian/task_list_win') {
		nickName = "task_list_win";
	} else if (name == 'xunjian/monitorListWin') {
		nickName = "monitor_list";
	} else if (name == 'contact/contact-list') {
		nickName = "contact-list";
	} else if (name == 'outStation/createBillSelStation_win') {
		nickName = "createBillSelStation_win";
	} else if (name == 'standBill/standFinishBillListWin') {
		nickName = "standFinishBillListWin";
	} else if (name == 'standBill/standBillListWin') {
		nickName = "standBillListWin";
	} else if (name == 'offlineUpload/offlineUpload_win') {
		nickName = "picOfflineUpload";
	} else if (name == 'check/check_list_win') {
		nickName = "check_list_win";
	} else if (name == 'submission/submission-list_win') {
		nickName = "submission-list_win";
		/**1556 zhangqiankun  2019-08-19 begin*/
	} else if (name == 'bill/bill-list_win1') {
		nickName = "bill-list_win1";
	} else if (name == 'generation/generationBillListWin1') {
		nickName = "generationBillListWin1";
	} else if (name == 'xunjian/task_list_win1') {
		nickName = "task_list_win1";
	} else if (name == 'xunjian/task_list_win1') {
		nickName = "task_list_win1";
	} else if (name == 'repair/repair-list_win1') {
		nickName = "repair-list_win1";
		/**1556 zhangqiankun  2019-08-19 end*/
	}else if(name == 'bill/historyHidden_win') {
		nickName = "historyHidden_win";
	} else {
		nickName = name;
	}
	$api.setStorage("modelType", type);
	openSingleWindow({
		url: "html/" + name + ".html",
		name: nickName,
		title: title,
		type: type,
		opaque: true,
		bounces: false,
		reload: true,
		slidBackEnabled: true,
		vScrollBarEnabled: false
	});
}

/**
 * 向远程请求首页模块的任务数
 */
function getUserTaskCount(userId) {
	$client.getUserTaskCount(function (ret, err) {
		if (ret) {
			if (ret.success) {
				// var monitorSpan = $api.byId('monitorTip');
				var preBillSpan = $api.byId('preBillTip');
				var taskSpan = $api.byId('taskTip');
				var taskNewSpan = $api.byId('taskNewTip');
				var standStaPreSpan = $api.byId('standStaPreBillTip');
				// monitorSpan.innerHTML = ret.model.usermonitorbillcount;
				preBillSpan.innerHTML = ret.model.userfaultbillcount;
				taskSpan.innerHTML = ret.model.usertaskcount;
				taskNewSpan.innerHTML = ret.model.newtaskcount;
				standStaPreSpan.innerHTML = ret.model.outstationcount;
			}
		}
	});

}



/**
 * 设置tip小图标的位置
 */
function setRemark() {

	// var monitorDiv = $api.byId('monitorTip');
	var preBillDiv = $api.byId('preBillTip');
	var taskDiv = $api.byId('taskTip');
	var taskNewDiv = $api.byId('taskNewTip');
	var standStaPreBillDiv = $api.byId('standStaPreBillTip');
	var offlineUploadDiv = $api.byId('offlineUploadTip');
	var width = api.frameWidth / 8;
	monitorDiv.style.left = (width + 10) + "px";
	preBillDiv.style.left = (width + 10) + "px";
	taskDiv.style.left = (width + 10) + "px";
	taskNewDiv.style.left = (width + 10) + "px";
	standStaPreBillDiv.style.left = (width + 10) + "px";
	offlineUploadDiv.style.left = (width + 10) + "px";
}



/**
 * 设置用户的信息
 */
function setUserInfo(user) {
	$("#disp_loginname").text(user.loginname);
	$("#disp_username").text(user.username);
}


//用登录接口的上标数据设置上标
function initIndex() {
	var model = $api.getStorage('indexModel');
	if (model != null && model != '') {

		// var monitorSpan = $api.byId('monitorTip');
		//	var preBillSpan = $api.byId('preBillTip');
		//	var taskSpan = $api.byId('taskTip');
		//	var taskNewSpan = $api.byId('taskNewTip');
		//	var standStaPreSpan = $api.byId('standStaPreBillTip');
		//	var offlineUploadSpan = $api.byId('offlineUploadTip');
		// monitorSpan.innerHTML = model.usermonitorbillcount;
		//	preBillSpan.innerHTML = model.userfaultbillcount;
		//	taskSpan.innerHTML = model.usertaskcount;
		//	taskNewSpan.innerHTML =model.newtaskcount;
		//	standStaPreSpan.innerHTML = model.outstationcount;

		var width = api.frameWidth / 8;
		// monitorSpan.style.left = (width + 10) + "px";
		//	preBillSpan.style.left = (width + 10) + "px";
		//	taskSpan.style.left = (width + 10) + "px";
		//	taskNewSpan.style.left = (width + 10) + "px";
		//	standStaPreSpan.style.left = (width + 10) + "px";
		//	offlineUploadSpan.style.left = (width + 10) + "px";
	}
}

/**
 * 开始
 */
apiready = function () {
	var user = $api.getStorage('user');
	setUserInfo(user);
	userId = user.userid;

	var virifycode = getStorage('nverifycode');
	if (virifycode != '' && virifycode != undefined) {
		var codeParam = { code: virifycode };
		api.openFrame({
			name: 'verifyCode_frm',
			url: '../verifycode/verifyCode_frm.html',
			bounces: false,
			reload: true,
			pageParam: codeParam
		});
	}

	//	getBanner();
	var elementList = $api.getStorage('elementList');
	if (elementList != null) {

		for (var i = 0; i < elementList.length; i++) {

			if (elementList[i] == "IDM_BILL_MONITOR_FAULTBILL") {

				$api.byId('monitorLiId').style.display = "";
				$api.byId('billCheckId').style.display = "";

			} else if (elementList[i] == "IDM_ALARM_ACTIVE") {

				$api.byId('alarmLiId').style.display = "";
				$api.byId('fsuDivId').style.display = "";

			} else if (elementList[i] == "IDM_FSU_MANAGE") {

				$api.byId('gvFsuLiId').style.display = "";
				$api.byId('fsuDivId').style.display = "";

			} else if (elementList[i] == "IDM_XUNJIAN_MONITOR") {

				$api.byId('taskMonitorNewId').style.display = "";
				$api.byId('billCheckId').style.display = "";

			} else if ($api.getStorage('user').provinceid == '0001931') {
				$api.byId('fsuMgmt').style.display = "";
			}
			// else if( elementList[i] == "IDM_FSU_PORTAL" || elementList[i] == "IDR_FSU_PORTAL" ) {
			// 	$api.byId('fsuMgmt').style.display = "";
			// }
			// $api.getStorage('user').provinceid, // 默认0001931四川省分公司
			// $api.byId('fsuMgmt').style.display = "";
		}
	}
	var islogin = $api.getStorage("isLoginOut");
	initIndex();
	initChart();
	//	startUserTaskCountTimer();
	//	startHeartTimer();
	//	initDict();

	//	startCheckCache();
	//	console.log("1111111111111");

	//初始化本地数据库
	//	db_init(function(ret1, err) {
	//		if (ret1) {
	//			//设置图片上传模块图标
	//			setofflineUploadCount();
	//		}
	//	});

	//	startWriteFile();
	//
	//	startPowerFile();

	//	api.addEventListener({
	//		name : 'batterystatus'
	//	}, function(ret, err) {
	//		 msg1 = '当前电池电量：' + ret.level;
	//	});
};

function initChart() {

	$client.FdManagerOrg({

	}, function (ret, err) {
		console.log('/////////////////////////////////////////////////////');
		console.log(JSON.stringify(ret));
		if (ret) {
			if (ret.success) {
				$('#list-view').empty();
				renderTemp('list-view', 'img-template-show', ret.resultList, true);
				if (ret.resultList.length > 0) {
					$api.byId('dzDivId').style.display = "";

				}
				//						alert('断站：'+ret.fsulist.length);
			} else {
				showToast(ret.data_info);
			}
		} else {
			showToast(err.msg);
		}
	});

}

function getBanner() {
	var content = $api.byId('banner-content');
	var tpl = $api.byId('banner-template').text;
	var tempFn = doT.template(tpl);
	content.innerHTML = tempFn("");
	initSlide();
}

function initSlide() {
	var slide = $api.byId('slide');
	var pointer = $api.domAll('#pointer a');
	window.mySlide = Swipe(slide, {
		auto: 3000,
		continuous: true,
		disableScroll: true,
		stopPropagation: true,
		callback: function (index, element) {
			var actPoint = $api.dom('#pointer a.active');
			$api.removeCls(actPoint, 'active');
			$api.addCls(pointer[index], 'active');
		},
		transitionEnd: function (index, element) {

		}
	});
}
