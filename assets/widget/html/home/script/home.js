var refreshUserTaskCountTimer;
//刷新首页数据的定时器
var refreshLocationTimer;
//刷新GPS位置的定时器
//获取地位坐标
//坐标获取成功后执行的方法
var lon = 0;
var lat = 0;

var userId = "";

/**
 * 打开子菜单模块
 */
function openWinList(name, title, type) {

    var delay = 0;
	var nickName;
    if (api.systemType == "android") {
        delay = 200;
    }

	if(name=='bill/bill-list_win'){
		nickName = "bill-list_win";
	}else if(name=='standBill/standFinishBillListWin'){
		nickName = "standFinishBillListWin";
	}else if(name=='standBill/standBillListWin'){
		nickName = "standBillListWin";
	}else{
		nickName = name;
	}

    openSingleWindow({
        url : "html/" + name + ".html",
        name : nickName,
        title : title,
        type : type,
        opaque : true,
        bounces : false,
        reload : true,
        slidBackEnabled : true,
        vScrollBarEnabled : false
    });
}

/**
 * 向远程请求首页模块的任务数
 */
function getUserTaskCount(userId) {
    $client.getUserTaskCount(function(ret, err) {
        if (ret) {
            if (ret.success) {
                var monitorSpan = $api.byId('monitorTip');
                var preBillSpan = $api.byId('preBillTip');
                var taskSpan = $api.byId('taskTip');
                var standStaPreSpan = $api.byId('standStaPreBillTip');
                monitorSpan.innerHTML = ret.model.usermonitorbillcount;
                preBillSpan.innerHTML = ret.model.userfaultbillcount;
                taskSpan.innerHTML = ret.model.usertaskcount;
                standStaPreSpan.innerHTML = ret.model.outstationcount;
            }
        }
    });

    //初始化本地数据库
    db_init(function(ret1, err) {
        if (ret1) {
            setofflineUploadCount();
        }
    });
}

/**
 * 设置离线上传的头标数量
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

          //  showToast("离线图片数量："+offlineUploadCount);
            var offlineUploadSpan = $api.byId('offlineUploadTip');
            offlineUploadSpan.innerHTML = offlineUploadCount;
        });
    });
}

/**
 * 设置tip小图标的位置
 */
function setRemark() {

    var monitorDiv = $api.byId('monitorTip');
    var preBillDiv = $api.byId('preBillTip');
    var taskDiv = $api.byId('taskTip');
    var standStaPreBillDiv = $api.byId('standStaPreBillTip');
    var offlineUploadDiv = $api.byId('offlineUploadTip');
    var width = api.frameWidth / 8;
    monitorDiv.style.left = (width + 10) + "px";
    preBillDiv.style.left = (width + 10) + "px";
    taskDiv.style.left = (width + 10) + "px";
    standStaPreBillDiv.style.left = (width + 10) + "px";
    offlineUploadDiv.style.left = (width + 10) + "px";
}

/**
 * 获取经纬度信息
 */
function getLocation() {
    api.startLocation({
        accuracy : '10m',
        filter : 1,
        autoStop : true
    }, function(ret, err) {
        if (ret.status) {
            var user = $api.getStorage('user');
            var userid = user.userid;
            // ios要把  GCJ-02 to WGS-84   安卓不用转
            if (ret.latitude != null && ret.longitude != null && ret.latitude != 0.0 && ret.longitude != 0.0 && ret.latitude != 0 && ret.longitude != 0) {
                var xyJson = GPS.gcj_decrypt_exact(ret.latitude, ret.longitude);
                if (lat != xyJson.lat || lon != xyJson.lon) {
                    lat = xyJson.lat;
                    lon = xyJson.lon;
                    $client.getUserLocation(userid, lon, lat, function(ret, err) {
                    });
                }
            }
        }
    });
}

function getHeartFromGps() {

    var win_name = api.winName;
    var frm_name = null;
    //  showlog("调用GPS模块进行GPS获取,win_name:"+win_name);
    var script = "startLocation('" + win_name + "','" + frm_name + "');";

    api.execScript({
        name : 'root',
        frameName : 'gps',
        script : script
    });

    setTimeout(function() {
        gps_invoke();
    }, 3000);
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

    // showlog("上传心跳包数据,经度:" + lastLocation.lon + ",纬度:" + lastLocation.lat);

    $client.getHeart(lastLocation.lon, lastLocation.lat, function(ret, err) {
        if (ret && ret.count && ret.count > 0) {
            api.notification({
                notify : {
                    title : "未接单工单提醒",
                    content : '您有新的任务单请及时处理，谢谢！',
                    extra : 'newBill',
                    updateCurrent : true
                }
            }, function(ret, err) {
            });
        }
    });

}

function getHeart() {

    api.startLocation({
        accuracy : '100m',
        filter : 1,
        autoStop : true
    }, function(ret, err) {
        // showlog("status:"+ret.status);
        if (ret.status) {
            // ios要把  GCJ-02 to WGS-84   安卓不用转
            if (ret.latitude != null && ret.longitude != null && ret.latitude != 0.0 && ret.longitude != 0.0 && ret.latitude != 0 && ret.longitude != 0) {
                var xyJson = GPS.gcj_decrypt_exact(ret.latitude, ret.longitude);
                if (lat != xyJson.lat || lon != xyJson.lon) {
                    lat = xyJson.lat;
                    lon = xyJson.lon;
                    $client.getHeart(lon, lat, function(ret, err) {
                        if (ret && ret.count && ret.count > 0) {
                            api.notification({
                                notify : {
                                    title : "未接单工单提醒",
                                    content : '您有新的任务单请及时处理，谢谢！',
                                    extra : 'newBill',
                                    updateCurrent : true
                                }
                            }, function(ret, err) {
                            });
                        }
                    });
                }
            }
        }
    });
}

/**
 * 设置用户的信息
 */
function setUserInfo(user) {
    $("#disp_loginname").text(user.loginname);
    $("#disp_username").text(user.username);
}

/**
 * 启动定时器，定时收集坐标
 */
function startLocationTimer() {
    refreshLocationTimer = window.setInterval(function() {
        getLocation();
    }, 300 * 1000);

    getLocation();
}

/**
 * 启动定时器，定时收集坐标，发送心跳包
 */
function startHeartTimer() {
    refreshLocationTimer = window.setInterval(function() {
        //   getHeart();
        getHeartFromGps();
    }, 300 * 1000);

    getHeartFromGps();
    // getHeart();
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

    // 软件前台时执行的事件
    api.addEventListener({
        name : 'resume'
    }, function(ret, err) {
        //重新启动首页数据更新
        if (refreshUserTaskCountTimer == null) {
            window.setInterval(function() {
                getUserTaskCount(userId);
                setRemark();
            }, 60 * 1000);
        }
    });

    getUserTaskCount(userId);
    setRemark();

    //	if(api.systemType != "android"){
    //		//软件进入后台时执行的事件
    //		api.addEventListener({
    //			name:'pause'
    //		},function(ret,err){
    //		  	window.setInterval(function(){
    //		  		getHeart();
    //		  	},300*1000);
    //		});
    //	}
    //	if(api.systemType != "ios"){
    //		//软件前台时执行的事件
    //		api.addEventListener({
    //			name:'resume'
    //		},function(ret,err){
    //			window.setInterval(function(){
    //		  		getHeart();
    //		  	},300*1000);
    //
    //		});
    //
    //	}
    //IOS：点击推送触发事件
    //点击通知栏通知，如果是未接单待办通知，则跳转到“待办工作”页面 tangsj 2015-10-20
    api.addEventListener({
        name : 'noticeclicked'
    }, function(ret, err) {
        if (ret && ret.value && ret.value == "newBill") {
            openWinList('bill-list_win', '待办工作', 'GET_BILL_LIST');
        }
    });
}

/**
 * 打开个人信息
 */
function openSidePerson() {

    openPage_person();

    A.Controller.aside();
}

/**
 * 打开系统设置
 */
function openSideSetting() {

    openPage_setting();
    A.Controller.aside();

}

/**
 * 注销帐号
 */
function logout() {

    $push.stop();

    //注销时设置islogin为false，表示未登录
    $api.setStorage('AUTO_LOGIN', false);

    //注销时提醒后台，改用户已注销
    $client.userLoginOut( function(ret, err) {
    });

    openPage_login();

    A.Controller.aside();

    closePage_home();

}

//退出应用
function exitApp(){
	api.addEventListener({
		name: 'keyback'
		}, function(ret, err){
		    api.toast({
		            msg: '再按一次返回键退出'+api.appName,
		        duration:3000,
		        location: 'bottom'
		    });

		    api.addEventListener({
		        name: 'keyback'
		    }, function(ret, err){
	    		//退出前先关闭极光推送,并向后台发送退出登录消息
				$push.stop();

			    //注销时设置islogin为false，表示未登录
			    $api.setStorage('AUTO_LOGIN', false);

			    //注销时提醒后台，改用户已注销
			    $client.userLoginOut( function(ret, err) {
			    });
				//退出应用
		        api.closeWidget({
		                id: 'A6973002767421',
		                retData: {name:'closeWidget'},
		                silent:true
		            });
		    });

		    setTimeout(function(){
		            exitApp();
		    },3000)
	});
}


/**
 * 开始
 */
apiready = function() {
    //如果手机不是iPhone4，则调用此方法
   // if (api.deviceModel != "iPhone 4") {
       // initHeader();
   // }

    var user = $api.getStorage('user');

    setUserInfo(user);

    userId = user.userid;

    $push.start(userId);

    var elementList = $api.getStorage('elementList');

	//退出应用
	if(api.systemType=='android'){
	   exitApp();
    }

    if (elementList != null) {

        for (var i = 0; i < elementList.length; i++) {

            if (elementList[i] == "IDM_BULLE") {

                $api.byId('noticeLiId').style.display = "";
            } else if (elementList[i] == "IDM_BILL_MONITOR_FAULTBILL") {

                $api.byId('monitorLiId').style.display = "";

            } else if (elementList[i] == "IDM_BILL_FAULTBILL") {

                $api.byId('preBillLiId').style.display = "";

            } else if (elementList[i] == "IDM_BILL_FINISH_BILL") {

                $api.byId('workerLiId').style.display = "";

            } else if (elementList[i] == "IDM_ALARM_ACTIVE") {

                $api.byId('alarmLiId').style.display = "";

            } else if (elementList[i] == "IDM_FSU_MANAGE") {

                $api.byId('gvFsuLiId').style.display = "";

            } else if (elementList[i] == "IDM_ITOWER_MANAGER") {

                //$api.byId('itowerLiId').style.display = "";

            } else if (elementList[i] == "IDM_XUNJIAN") {

                $api.byId('taskLiId').style.display = "";
                //默认能看到巡检模块就能看到离线上传模块
                $api.byId('offlineUploadId').style.display = "";

            } else if (elementList[i] == "IDM_MAIL_LIST") {

                $api.byId('contactLiId').style.display = "";

            } else if (elementList[i] == "IDM_CREATE_FAULT_BILL") {

                $api.byId('createBillId').style.display = "";

            } else if (elementList[i] == "IDM_PHONE_STAND_CREATE") {

                $api.byId('standStaBillId').style.display = "";

            } else if (elementList[i] == "IDM_PHONE_STAND_PRE") {

                $api.byId('standStaPreBillId').style.display = "";

            }else if(elementList[i] == "IDM_PHONE_STAND_FINISH"){
            	 $api.byId('standStaFinishBillId').style.display = "";
            }
        }
    }

    startUserTaskCountTimer();

    startHeartTimer();

    api.addEventListener({
        name : 'resume'
    }, function(ret, err) {

        startHeartTimer();
    });

    api.addEventListener({
        name : 'pause'
    }, function(ret, err) {

        startHeartTimer();
    });
};
