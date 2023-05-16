var userId;
var _baiduModule;

apiready = function() {
	//打开gps
	openGps();
	api.parseTapmode();
	var user = $api.getStorage('user');
	userId = user.userid;
	//启动极光推送
	$push.start(userId);

	getBanner();
	var header = $api.byId('header');
	var slide = $api.byId('slide');
	$api.fixIos7Bar(header);
	var headerPos = $api.offset(header);
	var slidePos = $api.offset(slide);
	var body_h = $api.offset($api.dom('body')).h;
	api.openFrame({
		name : 'home_frm',
		url : 'home_frm.html',
		bounces : false,
		pageParam : api.pageParam,
		reload : true,
		rect : {
			x : 0,
			y : headerPos.h + slidePos.h,
			w : headerPos.w,
			w : 'auto',
			h : body_h - headerPos.h - slidePos.h
		}
	});

	//退出应用
	if (api.systemType == 'android') {
		exitApp();
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

/**
 *打开GPS模块，提供各种环境调用
 */
function openGps() {
	console.log("打开gps");

	if (_baiduModule == null) {
		_baiduModule = api.require('bMap');
	}
	if (api.systemType == "ios") {//如果是ios，则需要执行初始化sdk
		_baiduModule.initMapSDK(function(ret) {
			if (ret.status) {
				//      alert('地图初始化成功，可以从百度地图服务器检索信息了！');
			}

		});
	}

	api.openFrame({
		name : 'gps',
		url : '../common/gps/gps_native_frm.html',
		reload : true,
		rect : {
			x : 0,
			y : 0,
			w : 0,
			h : 0
		}
	});

}

function goScan() {
	var FNScanner = api.require('FNScanner');
	FNScanner.openScanner({
		autorotation : true
	}, function(ret, err) {
		if (ret) {
			//					alert(ret.content);
			if (ret.content != 'undefined' && ret.content != undefined) {

				$client.getScanInfo({
					number : ret.content
				}, function(ret, err) {
					if (ret) {
						//          api.hideProgress();
						if (ret.success) {
//						var opt = {'erweima':ret.model}
						
						api.openWin({
                            name : 'erweimainfo_win',
                            url : '../../html/erweima/erweimainfo_win.html',
                            reload : true,
                            bounces : false,
                            vScrollBarEnabled:false,
                            pageParam :{'erweima':ret.model}
                        });
						

						} else {
							api.toast({
								msg : ret.data_info
							});
						}
					} else {
						api.toast({
							msg : '获取信息出错!'
						});
					}
					api.hideProgress();
				});
			}

		} else {
			alert(JSON.stringify(err));
		}
	});
}

//退出应用
function exitApp() {
	api.addEventListener({
		name : 'keyback'
	}, function(ret, err) {
		api.toast({
			msg : '再按一次返回键退出' + api.appName,
			duration : 3000,
			location : 'bottom'
		});

		api.addEventListener({
			name : 'keyback'
		}, function(ret, err) {
			//退出前先关闭极光推送,并向后台发送退出登录消息
			$push.stop();

			//注销时设置islogin为false，表示未登录
			$api.setStorage('AUTO_LOGIN', false);

			//注销时提醒后台，改用户已注销
			$client.userLoginOut(function(ret, err) {
			});
			//退出应用
			api.closeWidget({
				id : 'A6973002767421',
				retData : {
					name : 'closeWidget'
				},
				silent : true
			});
		});

		setTimeout(function() {
			exitApp();
		}, 3000)
	});
}
