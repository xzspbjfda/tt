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
function openWinList(name, title, type,offline) {
    var delay = 0;
    var nickName;
    if (api.systemType == "android") {
        delay = 200;
    }
    if (name == 'bulle/bulle_list_win') {
        nickName = "bulle_list_win";
    } else if (name == 'bill/bill-list_win') {
        nickName = "bill-list_win";
    } else if (name == 'alarm/alarm-list_win') {
        nickName = "alarm-list_win";
    } else if (name == 'station/station-list') {
        nickName = "station-list";
    } else if (name == 'xunjian/task_list_win') {
        nickName = "task_list_win";
    } else if (name == 'xunjian/task_list_win0') {
        nickName = "task_list_win0";
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
    } else if(name == "churuzhan/newStandBillListWin") {
        nickName = "newStandBillListWin";

    }else if (name == 'offlineUpload/offlineUpload_win') {
        nickName = "picOfflineUpload";
    } else if (name == 'check/check_list_win') {
        nickName = "check_list_win";
    } else if (name == 'generation/generationBillListWin') {
        nickName = "generationBillListWin";
    }else if (name == 'bill/all_bill_list_win') {
        nickName = "allBillListWin";
    }else if (name=='xunjian/historyXunjian_win') {
        nickName = "historyXunjian_win";
    } else {
        nickName = name;
    }
    $api.setStorage("modelType", type);
    openSingleWindow({
        url : "html/" + name + ".html",
        name : nickName,
        title : title,
        offline:offline,
        type : type,
        opaque : true,
        bounces : false,
        reload : true,
        slidBackEnabled : true,
        vScrollBarEnabled : false
    });
}

function openWinBillList(tabpage, stationcode, billType) {
	
	if (tabpage=='ACCEPT' || tabpage=='UNSTART') {
		tabpage='0';
	} else if (tabpage=='DOING' || tabpage=='UNFINISHED') {
		tabpage = '1'
	} else {
		tabpage = '2'
	}
	var delay = 0;
	var nickName;
	if (api.systemType == "android") {
		delay = 200;
	}
    	// 1: 上站工单	2:日常维修工单	3:巡检工单	4:故障工单	5:发电工单	6:代维调度工单
    	var name = 'bill/all_bill_list_win';
    	var nickName = "allBillListWin";
    	$api.setStorage("modelType", tabpage);
    	openSingleWindow({
		url : "html/" + name + ".html",
		name : nickName,
		title : '',
		offline:null,
		type : tabpage,
		opaque : true,
		bounces : false,
		reload : true,
		slidBackEnabled : true,
		vScrollBarEnabled : false,
		stationcode: stationcode,
		feature:'remind',
		billType:billType
	});
}

/**
 * 向远程请求首页模块的任务数
 */
function getUserTaskCount(userId) {
    $client.getUserTaskCount(function(ret, err) {
        if (ret) {
            if (ret.success) {
              console.log('9999999999999999999999999999999999999999999999999999999');
              console.log(getObj(ret.model));
                var monitorSpan = $api.byId('monitorTip');
                var preBillSpan = $api.byId('preBillTip');
                var preBillDealSpan = $api.byId('preBillDealTip');
                var preBillRevertSpan = $api.byId('preBillRevertTip');
                var taskSpan = $api.byId('taskTip');
                var taskNewSpan = $api.byId('taskNewTip');
                var standStaPreSpan = $api.byId('standStaPreBillTip');
                var repairBillIdTip =$api.byId('repairBillIdTip');
//				monitorSpan.innerHTML = ret.model.usermonitorbillcount;
                // alert("ret.model.strothercount=="+ret.model.strothercount);
                preBillSpan.innerHTML = ret.model.strothercount?ret.model.strothercount:0;
                if(ret.model.userfaultbillcountaccept!=undefined){
                    preBillDealSpan.innerHTML = ret.model.userfaultbillcountother;
                    preBillRevertSpan.innerHTML = ret.model.userfaultbillcountrevert;
                }

//				taskSpan.innerHTML = ret.model.usertaskcount;
                taskNewSpan.innerHTML = ret.model.newtaskcount;
                standStaPreSpan.innerHTML = ret.model.outstationcount;
                repairBillIdTip.innerHTML = ret.model.dayrepaircount;
                $('#preBillDealTip').html(ret.model.strothercount);
                $('#preBillRevertTip').html(ret.model.strbillcount);
                $('#allElectBillCount').html(ret.model.allelectbillcount);
                $('#userListClaimedCount').html(ret.model.userlistclaimedcount);
            }
        }
    });
    if(request){
        console.log("获取数量开始")
        request.getUserTaskCount = function (callback) {
            service2({
                url: "/enterStationBill/stationBillWaitCount.do"
            },callback)
        };
        request.getUserTaskCount( function(ret, err) {
            if (ret.success) {
                var date = ret.data;
                var repairBillIdTip = $api.byId('standStaPreBillTipNew');
                repairBillIdTip.innerHTML = date[0].BILLWATICOUNT;
                console.log("获取数量成功")
            }
        })
        request.getSelfTaskTodoCount = function (callback) {
            service2({
                url: "/worderAssetRun/getSelfTaskTodoCount.do"
            },callback)
        };
        request.getSelfTaskTodoCount( function(ret, err) {
            if (ret.success) {
                var repairBillIdTip = $api.byId('zcyygdNum');
                repairBillIdTip.innerHTML = ret.data;
            }
        })
        console.log("获取数量结束")
    }
}

/**
 * 设置图片上传模块的头标数量
 */
function setofflineUploadCount() {
    var offlineUploadCount = 0;
    //获取需要离线上传图片的数量
    db_getXunjianPicCount($api.getStorage('user').userid, function(ret2, err) {
        if (ret2 != null && ret2 != "") {
            offlineUploadCount += parseInt(ret2);
        }
        db_getBillPicCount($api.getStorage('user').userid, function(ret3, err) {
            if (ret3 != null && ret3 != "") {
                offlineUploadCount += parseInt(ret3);
            }

            db_getStandBillPicCount($api.getStorage('user').userid, function(ret4, err) {
                if (ret4 != null && ret4 != "") {
                    offlineUploadCount += parseInt(ret4);
                }
                //			var offlineUploadSpan = $api.byId('offlineUploadTip');
                //			offlineUploadSpan.innerHTML = offlineUploadCount;
                db_getCheckCount($api.getStorage('user').userid, function(ret5, err) {
                    if (ret5 != null && ret5 != "") {
                        offlineUploadCount += parseInt(ret5);
                    }
                    db_getResCheckPicCount($api.getStorage('user').userid, function(ret6, err) {
                        if (ret6 != null && ret6 != "") {
                            offlineUploadCount += parseInt(ret6);
                        }

                        //  showToast("离线图片数量："+offlineUploadCount);
                        var offlineUploadSpan = $api.byId('offlineUploadTip');
                        // offlineUploadSpan.innerHTML = offlineUploadCount;
                    });
                    //  showToast("离线图片数量："+offlineUploadCount);
                    //			var offlineUploadSpan = $api.byId('offlineUploadTip');
                    //			offlineUploadSpan.innerHTML = offlineUploadCount;
                });
            });
        });
    });
}

/**
 * 设置tip小图标的位置
 */
function setRemark() {

//	var monitorDiv = $api.byId('monitorTip');
    // var preBillDiv = $api.byId('preBillTip');
    var preBillDealDiv = $api.byId('preBillDealTip');
    var preBillRevertDiv = $api.byId('preBillRevertTip');
//	var taskDiv = $api.byId('taskTip');
    var taskNewDiv = $api.byId('taskNewTip');
    var standStaPreBillDiv = $api.byId('standStaPreBillTip');
    var offlineUploadDiv = $api.byId('offlineUploadTip');
    var width = api.frameWidth / 8;
//	monitorDiv.style.left = (width + 10) + "px";
    // preBillDiv.style.left = (width + 10) + "px";
    // preBillDealDiv.style.left = (width + 10) + "px";
    // preBillRevertDiv.style.left = (width + 10) + "px";
//	taskDiv.style.left = (width + 10) + "px";
    // taskNewDiv.style.left = (width + 10) + "px";
    // standStaPreBillDiv.style.left = (width + 10) + "px";
    // offlineUploadDiv.style.left = (width + 10) + "px";
}

function getHeartFromGps() {
    var win_name = "home_win";
    var frm_name = "footer_tab_1";
    console.log("调用GPS模块进行GPS获取,win_name:"+win_name);
    var script = "startLocation('" + win_name + "','" + frm_name + "');";

    api.execScript({
        frameName : 'gps',
        script : script
    });


    gps_invoke();

}

/**
 * GPS回调信息
 */
function gps_invoke() {

    //  showlog("回调回首页");

    var lastLocation = $api.getStorage(xx.cache.LAST_GPS_LOCATION);

    if (!lastLocation || !lastLocation.status || lastLocation.timestamp == 0 || lastLocation.lon == 0 || lastLocation.lat == 0) {
        return;
    }

    $api.setStorage("lon", lastLocation.lon);
    $api.setStorage("lat", lastLocation.lat);
    var now = new Date();
    if ((now.getMinutes() % 5 == 0 && now.getSeconds() < 10)||api.systemType == "ios") {
        console.log("上传心跳包数据,经度:" + lastLocation.lon + ",纬度:" + lastLocation.lat+",当前时间:"+now.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " "));
        $client.getHeart(lastLocation.lon, lastLocation.lat, function (ret, err) {
          // alert(JSON.stringify(ret))
            if (ret && ret.count && ret.count > 0) {
                api.notification({
                    notify: {
                        title: "未接单工单提醒",
                        content: '您有新的任务单请及时处理，谢谢！',
                        extra: 'newBill',
                        updateCurrent: true
                    }
                }, function (ret, err) {
                });
            }

        });
    }

}

/**
 * 设置用户的信息
 */
function setUserInfo(user) {
    $("#disp_loginname").text(user.loginname);
    $("#disp_username").text(user.username);
}

/**
 * 启动定时器，定时收集坐标，发送心跳包
 */
function startHeartTimer() {
  console.log('启动定时器,启动定时器,启动定时器,启动定时器,启动定时器,启动定时器,启动定时器,启动定时器');
  console.log(api.systemType);
  window.setInterval(function() {
      getHeartFromGps();
  }, 300* 1000);
}

function startWriteFile() {
    var refreshWriteTimer = window.setInterval(function() {
        //   getHeart();
        toWriteFile();
    }, 10 * 1000);
    toWriteFile();
}

function toWriteFile() {
    var currentDate = new Date();
    var time = currentDate.toLocaleString();
    api.writeFile({
        path : 'fs://time.txt',
        data : '当前时间：' + time + '\r\n',
        append : true
    }, function(ret, err) {
        //coding...

    });
}

//测试电量
function startPowerFile() {
    var refreshWritePowerTimer = window.setInterval(function() {
        //   getHeart();
        toPowerFile();
    }, 60 * 5 * 1000);
    toPowerFile();
}

function toPowerFile() {
    var currentDate = new Date();
    var time1 = currentDate.toLocaleString();
    api.writeFile({
        path : 'fs://power.txt',
        data : time1 + '  ' + msg1 + '\r\n',
        append : true
    }, function(ret, err) {
        //coding...

    });

}

/**
 * 启动定时器，自动刷新首页数据
 */
function startUserTaskCountTimer() {

    refreshUserTaskCountTimer = window.setInterval(function() {
        getUserTaskCount(userId);
        setRemark();
    }, 60 * 1000);

    //进入后台的时候，停止页面刷新
    api.addEventListener({
        name : 'pause'
    }, function(ret, err) {
        if (refreshUserTaskCountTimer != null) {
            window.clearInterval(refreshUserTaskCountTimer);
            refreshUserTaskCountTimer = null;
        }
    });

    // 页面前台时执行的事件
    api.addEventListener({
        name : 'resume'
    }, function(ret, err) {
        //重新启动首页数据更新
        if (refreshUserTaskCountTimer == null) {
            getUserTaskCount(userId);
            refreshUserTaskCountTimer = window.setInterval(function() {
                getUserTaskCount(userId);
                setRemark();
            }, 60 * 1000);
        }
    });

    getUserTaskCount(userId);
    setRemark();

    //IOS：点击推送触发事件
    //点击通知栏通知，如果是未接单待办通知，则跳转到“待办工作”页面 tangsj 2015-10-20
    api.addEventListener({
        name : 'noticeclicked'
    }, function(ret, err) {
        if (ret && ret.value && ret.value == "newBill") {
            openWinList('bill/bill-list_win', '待办工作', 'GET_BILL_LIST');
        }
    });
}

/*
 * 开始缓存检查器
 */
function startCheckCache() {
    window.setInterval(checkCache(), 1000 * 60 * 60 * 24);
}

function initDict() {
    setTimeout(getDict(), 6000);

}

function initDict() {
    //alert("获取字典");
    $client.getDictList({
        dictkey : "IDD_STAND_COMPANY,IDD_STAND_CAUSE,IDD_STAND_TYPE,IDD_STATION_DISCLAIMER,"
        + "IDD_STAND_STATION_CAUSE,IDD_FAULT_TYPE,IDD_INDOOR_BUG_CAUSE,IDD_FAULT_CASUE_ALL,IDD_SATION_CAUSE_ONE,"
        + "IDD_SATION_CAUSE_ONE_ONE,IDD_SATION_CAUSE_ONE_TWO,IDD_SATION_CAUSE_ONE_THREE,IDD_SATION_CAUSE_ONE_FOUR,"
        + "IDD_SATION_CAUSE_ONE_FIVE,IDD_MON_ELEC_FAULT_CAUSE,IDD_BILL_OIL_TYPE,IDD_TOWER_OILL,IDD_INSPECT_HIDDENGRADE,"
        +"IDD_INSPECT_HIDDENTYPE,IDD_FIXBILL_QUALITY,IDD_TOWER_REASON,IDD_NO_TOWER_REASON,IDD_YYS_DOUBLE_REASON,"
        +"IDD_BILL_DELAY_TYPE"
        +",IDD_STAND_TYPE_STATION,IDD_WORK_TYPE_0,IDD_WORK_TYPE_1,IDD_WORK_TYPE_2,IDD_OPEN_WAY,IDD_ARRIVALS_TYPE,IDD_WORK_TYPE_1"
        +",IDD_FIXBILL_CONTENT"
    }, function(ret, err) {
        if (ret) {
            if (ret.success) {
            	window.setTimeout(function() {
                          
		   console.log(JSON.stringify(ret));
                //运营商-铁塔原因
                var towerList = ret.IDD_TOWER_REASON;
                towerList.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });
                //运营商-非铁塔原因
                var noTowerList = ret.IDD_NO_TOWER_REASON;
                noTowerList.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });
                //运营商-铁塔双方原因
                var yysTowerList = ret.IDD_YYS_DOUBLE_REASON;
                yysTowerList.sort(function(a,b) {
                    return a.itemcode - b.itemcode
                });
                //申请延时原因分类
                var delayTypeList = ret.IDD_BILL_DELAY_TYPE;
                delayTypeList.sort(function(a,b) {
                    return a.itemcode - b.itemcode
                });
                //质保期
                var saveTimeList = ret.IDD_FIXBILL_QUALITY;
                saveTimeList.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });

                //隐患种类
                var hiddentypeList = ret.IDD_INSPECT_HIDDENTYPE;
                hiddentypeList.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });

                var disclaimerList = ret.IDD_STATION_DISCLAIMER;
                disclaimerList.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });
                //免责条款进行排序
                var hiddenGradeList = ret.IDD_INSPECT_HIDDENGRADE;
                hiddenGradeList.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });
                //隐患等级进行排序
                var upstationCauseList = ret.IDD_STAND_STATION_CAUSE;
                upstationCauseList.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });
                //隐患等级进行排序
                var standCompanyList = ret.IDD_STAND_COMPANY;
                standCompanyList.sort(function(a, b) {
                    return (a.itemvalue + '').localeCompare(b.itemvalue + '')
                });
                //隐患等级进行排序
                var stationCaseList = ret.IDD_SATION_CAUSE_ONE;
                stationCaseList.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });
                //回单故障类型

                var oneList = ret.IDD_SATION_CAUSE_ONE_ONE;
                oneList.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });
                //回单故障类型
                var twoCaseList = ret.IDD_SATION_CAUSE_ONE_TWO;
                twoCaseList.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });
                //回单故障类型
                var threeList = ret.IDD_SATION_CAUSE_ONE_THREE;
                threeList.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });
                //回单故障类型
                var fourList = ret.IDD_SATION_CAUSE_ONE_FOUR;
                fourList.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });
                //回单故障类型
                var fiveList = ret.IDD_SATION_CAUSE_ONE_FIVE;
                fiveList.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });
                //上站类型
                var standTypeList = ret.IDD_STAND_TYPE_STATION;
                standTypeList.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });
                //作业内容0
                var workTypeList0 = ret.IDD_WORK_TYPE_0;
                workTypeList0.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });
                //作业内容1
                var workTypeList1 = ret.IDD_WORK_TYPE_1;
                workTypeList1.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });
                //作业内容2
                var workTypeList2 = ret.IDD_WORK_TYPE_2;
                workTypeList2.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });
                //上站开门方式
                var openWayList = ret.IDD_OPEN_WAY;
                openWayList.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });
                //进站人身份
                var arrivalsTypeList = ret.IDD_ARRIVALS_TYPE;
                arrivalsTypeList.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });
                //施工内容
                var operationContentList = ret.IDD_WORK_TYPE_1;
                operationContentList.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });
                //维修类别
                var fixcontentList = ret.IDD_FIXBILL_CONTENT;
                fixcontentList.sort(function(a, b) {
                    return a.itemcode - b.itemcode
                });
                //回单故障类型
                $api.setStorage("disclaimerList", disclaimerList);
                //免责条款
                $api.setStorage("standCompanyList", standCompanyList);
                //上站人单位
                $api.setStorage("standCauseList", ret.IDD_STAND_CAUSE);
                //上站原因（回单）
                $api.setStorage("standWayList", ret.IDD_STAND_TYPE);
                //上站方式
                $api.setStorage("upstationList", upstationCauseList);
                //上站原因（派单）
                $api.setStorage("faultTypeList", ret.IDD_FAULT_TYPE);
                //故障类型（派单）
                $api.setStorage("roomFaultList", ret.IDD_INDOOR_BUG_CAUSE);
                //室分故障
                $api.setStorage("dealList", ret.IDD_FAULT_CASUE_ALL);
                //处理措施（回单）

                $api.setStorage("mainCauseList", stationCaseList);
                //故障原因（主）
                $api.setStorage("oneCauseList", oneList);
                //处理措施（回单）
                $api.setStorage("towCauseList", twoCaseList);
                //处理措施（回单）
                $api.setStorage("threeCauseList", threeList);
                //处理措施（回单）
                $api.setStorage("fourCauseList", fourList);
                //处理措施（回单）
                $api.setStorage("fiveCauseList", fiveList);
                //处理措施（回单）
                $api.setStorage("elecCauseList", ret.IDD_MON_ELEC_FAULT_CAUSE);
                //故障原因（停电回单）
                $api.setStorage("oilTypeList", ret.IDD_BILL_OIL_TYPE);
                //油机类型（停电回单）
                $api.setStorage("towerOilList", ret.IDD_TOWER_OILL);
                //巡检隐患等级
                $api.setStorage("hiddenGradeList", hiddenGradeList);
                //巡检隐患种类
                $api.setStorage("hiddenTypeList", hiddentypeList);
                //日常维修-质保期
                $api.setStorage("saveTimeList", saveTimeList);
                //回单-运营商-铁塔原因
                $api.setStorage("towerList", towerList);
                //回单-运营商-非铁塔原因
                $api.setStorage("noTowerList", noTowerList);
                //回单-运营商-铁塔双方原因
                $api.setStorage("yysTowerList", yysTowerList);
                //申请延时原因分类
                $api.setStorage("delayTypeList", delayTypeList);
                //上站类型
                $api.setStorage("standTypeList", standTypeList);
                //上站类型0
                $api.setStorage("workTypeList0", workTypeList0);
                //上站类型1
                $api.setStorage("workTypeList1", workTypeList1);
                //上站类型2
                $api.setStorage("workTypeList2", workTypeList2);
                //上站开门方式
                $api.setStorage("openWayList", openWayList);
                //进站人身份
                $api.setStorage("arrivalsTypeList", arrivalsTypeList);
                //施工内容
                $api.setStorage("operationContentList", operationContentList);
                //维修类别
                $api.setStorage("fixcontentList", fixcontentList);

}, 1000);
            }
        }
    });

}

/*
 * 缓存检查器
 */
function checkCache() {
    api.getFreeDiskSpace(function(ret, err) {
        if (ret) {
            if (ret.size > 0) {
                if (ret.size < 50 * 1024) {
                    api.alert({
                        title : '缓存空间不足',
                        msg : '缓存空间不足50KB，请及时清理！'
                    }, function(ret, err) {
                        if (ret) {
                            if (ret.buttonIndex == 1) {

                            }
                        } else {
                            showlog(err.msg);
                        }
                    });
                }
            } else {
                var errMsg;
                switch(ret.size) {
                    case -1:
                        errMsg = "无存储设备";
                        break;
                    case -2:
                        errMsg = "正在准备USB存储设备";
                        break;
                    case -3:
                        errMsg = "无法访问存储设备";
                        break;
                    default:
                        errMsg = "未知错误";
                        break;
                }
                showlog(errMsg);
            }
        } else {
            showlog(err.msg);
        }
    });
}

//用登录接口的上标数据设置上标
function initIndex() {
    var model = $api.getStorage('indexModel');
    if(model!=null&&model!=''){

        var monitorSpan = $api.byId('monitorTip');
        var preBillSpan = $api.byId('preBillTip');
        var preBillDealSpan = $api.byId('preBillDealTip');
        var preBillRevertSpan = $api.byId('preBillRevertTip');
//	var taskSpan = $api.byId('taskTip');
        var taskNewSpan = $api.byId('taskNewTip');//
        var standStaPreSpan = $api.byId('standStaPreBillTip');
        var offlineUploadSpan = $api.byId('offlineUploadTip');
//	monitorSpan.innerHTML = model.usermonitorbillcount;
//	preBillSpan.innerHTML = model.userfaultbillcount;
preBillSpan.innerHTML = model.strothercount?model.strothercount:0 ;

        if(model.userfaultbillcountaccept!=undefined){
            preBillDealSpan.innerHTML = model.userfaultbillcountother;
            preBillRevertSpan.innerHTML = model.userfaultbillcountrevert;
        }
//	taskSpan.innerHTML = model.usertaskcount;
        taskNewSpan.innerHTML =model.newtaskcount;
        standStaPreSpan.innerHTML = model.outstationcount;

        var width = api.frameWidth / 8;
//	monitorSpan.style.left = (width + 10) + "px";
        preBillSpan.style.left = (width + 10) + "px";
//	taskSpan.style.left = (width + 10) + "px";
        taskNewSpan.style.left = (width + 10) + "px";
        standStaPreSpan.style.left = (width + 10) + "px";
        // offlineUploadSpan.style.left = (width + 10) + "px";
    }
}

/**
 * 开始
 */
apiready = function() {

    var user = $api.getStorage('user');
    $api.rmStorage('stationList1');
    $api.rmStorage('stationList2');
    $api.rmStorage('stationList3');
    var energyUserInfo = $api.getStorage('energyUserInfo');
	var energyWorkOrder = document.getElementById('energyWorkOrder')
    if(energyUserInfo != null) {
        energyUserInfo.energyLoginSuccess == "true" ? energyWorkOrder.style.display = 'block' : "none"
    }

    setUserInfo(user);

    userId = user.userid;
//	getBanner();
//初始化本地数据库
    db_init(function(ret1, err) {
        if (ret1) {
            //设置图片上传模块图标
            setofflineUploadCount();
        }
    });

    //新上站待办权限
    console.log("=========新上站待办权限=========================="+user.loginname)
    console.log(JSON.stringify(user));
    var elementList = $api.getStorage('elementList');
    if (elementList != null) {

        for (var i = 0; i < elementList.length; i++) {

            if (elementList[i] == "IDM_BULLE") {

//				$api.byId('noticeLiId').style.display = "";
            } else if (elementList[i] == "IDM_BILL_MONITOR_FAULTBILL") {

//				$api.byId('monitorLiId').style.display = "";

            } else if (elementList[i] == "IDM_BILL_UPGRADE") {

                $api.byId('upgradeBillId').style.display = "";
                $api.byId('faultDiv').style.display = "";
                $api.byId('faultDiv2').style.display = "";

            } else if (elementList[i] == "IDM_BILL_FAULTBILL") {

                // $api.byId('preBillLiId').style.display = "";
                if($api.byId('preBillLiId2') != null) {
                    $api.byId('preBillLiId2').style.display = "";
                }

                // $api.byId('preBillDealId').style.display = "";
                // $api.byId('preBillDealId2').style.display = "";
                // $api.byId('preBillRevertId').style.display = "";
                // $api.byId('preBillRevertId2').style.display = "";
                if($api.byId('faultDiv') != null) {
                    $api.byId('faultDiv').style.display = "";
                }
                if($api.byId('faultDiv2') != null) {
                    $api.byId('faultDiv2').style.display = "";
                }


                if( $api.byId('offlineUploadId') != null) {
                    $api.byId('offlineUploadId').style.display = "";
                }

            } else if (elementList[i] == "IDM_BILL_FINISH_BILL") {
                if($api.byId('workerLiId') != null ) {
                    $api.byId('workerLiId').style.display = "";
                }
                if($api.byId('historyDiv') != null) {
                    $api.byId('historyDiv').style.display = "";
                }



            } else if (elementList[i] == "IDM_ALARM_ACTIVE") {

//				$api.byId('alarmLiId').style.display = "";

            } else if (elementList[i] == "IDM_FSU_MANAGE") {

//				$api.byId('gvFsuLiId').style.display = "";

            } else if (elementList[i] == "IDM_ITOWER_MANAGER") {

                //$api.byId('itowerLiId').style.display = "";

            } else if (elementList[i] == "IDM_XUNJIAN") {

                // $api.byId('taskNewLiId').style.display = "";
                // $api.byId('otherDiv').style.display = "";
                //默认能看到巡检模块就能看到离线上传模块

                $api.byId('offlineUploadId').style.display = "";

            } else if (elementList[i] == "IDM_XUNJIAN_OLD") {

//				$api.byId('taskLiId').style.display = "";
                //默认能看到巡检模块就能看到离线上传模块
                $api.byId('offlineUploadId').style.display = "";

            } else if (elementList[i] == "IDM_XUNJIAN_MONITOR") {

//				$api.byId('taskMonitorNewId').style.display = "";

            } else if (elementList[i] == "IDM_XUNJIAN_MONITOR_OLD") {

//				$api.byId('taskMonitorId').style.display = "";

            } else if (elementList[i] == "IDM_MAIL_LIST") {

//				$api.byId('contactLiId').style.display = "";

            } else if (elementList[i] == "IDM_CREATE_FAULT_BILL") {

//				$api.byId('createBillId').style.display = "";

            } else if (elementList[i] == "IDM_PHONE_STAND_CREATE") {

//				$api.byId('standStaBillId').style.display = "";

            } else if (elementList[i] == "IDM_PHONE_STAND_PRE") {

                if($api.byId('standStaPreBillId') != null) {
                    $api.byId('standStaPreBillId').style.display = "";
                }

                // $api.byId('otherDiv').style.display = "";
                if( $api.byId('offlineUploadId') != null) {
                    $api.byId('offlineUploadId').style.display = "";
                }


            } else if (elementList[i] == "IDM_PHONE_STAND_FINISH") {
                $api.byId('standStaFinishBillId').style.display = "";
                $api.byId('historyDiv').style.display = "";

            } else if (elementList[i] == "IDM_SCENC_CHECK") {
                $api.byId('checkId').style.display = "";
                // $api.byId('otherDiv').style.display = "";
                $api.byId('offlineUploadId').style.display = "";
            }else if (elementList[i] == "IDM_REPAIR_BILL") {
                if($api.byId('repairBillId') != null) {
                    $api.byId('repairBillId').style.display = "";
                }

                // $api.byId('otherDiv').style.display = "";
                if( $api.byId('offlineUploadId') != null) {
                    $api.byId('offlineUploadId').style.display = "";
                }

            }else if (elementList[i] == "IDM_PHONE_NEWSTAND_CREATE") {
                //$("#newStation").show();
            }else if (elementList[i] == "IDM_PHONE_NEWSTAND_PRE") {
                if($api.byId('newStandStaPreBillId') != null) {
                    $("#newStandStaPreBillId").show();
                }
            }else if (elementList[i] == "IDM_PHONE_ASSETRUN_CREATE") {
                if($api.byId('zcyygdId') != null) {
                    $("#zcyygdId").show();
                }
            }
        }
    }

    var user = $api.getStorage('user');

    var opts={
      userName:user.loginname
    }
    // $client.rightEmergency(opts,function(ret,err){
    //   console.log(JSON.stringify(ret));
    //   if(ret.status=='1'){
    //     api.execScript({
    //       name : 'home_win',
    //       frameName : 'footer_tab_2',
    //       script : 'showHIde(true);'
    //     });
    //   }
    // })

//	//天气页面（小屏手机显示2天的天气，大屏手机显示3天）
//	var winHeight = api.winHeight;
//	var winWidth = api.winWidth;
//	if(winWidth>330){
//		$api.byId('weather_incId').style.display = "";
//		$api.byId('weathercId').style.display = "";
//		$api.byId('weathercId2').style.display = "";
//	}else{
//		$api.byId('weather_incId2').style.display = "";
//		$api.byId('weathercId').style.display = "";
//		$api.byId('weathercId2').style.display = "";
//	}

    var islogin = $api.getStorage("isLoginOut");
    initIndex();
    startUserTaskCountTimer();
    startHeartTimer();
    initDict();

    startCheckCache();
    console.log("1111111111111");


// 隐私政策弹窗
    var zhengc=$api.getStorage('zhengc');
    if(!zhengc){
      api.openFrame({
              name: 'dialog',
              url: '../../html/dialog.html',
              rect: {
                      x:0,
                      y:0,
                      w:api.winWidth,
                      h:api.winHeight
              },
              bgColor: 'rgba(0,0,0,0.6)',
                      bounces: false
      });
    }
};


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
        auto : 3000,
        continuous : true,
        disableScroll : true,
        stopPropagation : true,
        callback : function(index, element) {
            var actPoint = $api.dom('#pointer a.active');
            $api.removeCls(actPoint, 'active');
            $api.addCls(pointer[index], 'active');
        },
        transitionEnd : function(index, element) {

        }
    });
}
