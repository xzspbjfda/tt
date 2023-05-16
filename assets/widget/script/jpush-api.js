/**
 * j极光推送的API
 * 20150925
 */

(function(window) {
	var u = {};

	jpush = null;
	var sh=null;
	var sm=null;
	var eh=null;
	var em=null;

	/**
	 * 初始化JPUSH
	 */
	u.start = function(userId) {

		jpush = api.require('jpushVip');

		//极光推送绑定不成功，不再继续进行
		if ( typeof (jpush) == "undefined" || jpush == null) {
			console.log("jpush require不成功");
			//  showToast("极光绑定不成功");
//			alert("推送失败！！！");
			return;
		}
		//安卓需要进行初始化
		if (api.systemType == "android") {
			u.androidInit();
			api.addEventListener({
				name : 'resume'
			}, function(ret, err) {
				console.log("jpush 重启");
				jpush.onResume();
			});

			api.addEventListener({
				name : 'pause'
			}, function(ret, err) {
				console.log("jpush 停止");
				jpush.onPause();
			});
		}

		//安卓：点击推送触发事件
		//        api.addEventListener({name:'appintent'}, function(ret,err) {
		//        alert('通知被点击，收到数据：\n' + JSON.stringify(ret));//监听通知被点击后收到的数据
		//        })

//alert("cccccc");
//		jpush.setListener(function(ret) {
//			var content = ret.content;
//			var extra = ret.extra;
//			var id = extra.id;
//			var uId = extra.userId;
//			alert("content:"+content);
//			alert("extra:"+extra);
//			alert("id:"+id);
//			alert("uId:"+uId);
//			console.log("content:" + content);
//			if (id != null && id != "" && uId != null && uId != "") {
//				//获取当前账号登录状态
//				var isLogin = $api.getStorage(constant.ISLOGIN);
//				//   向后台发送极光推送信息日志
//				$client.ajpushLog(id, uId, isLogin, function(ret, err) {
//				});
//			}
//			api.toast({
//				msg : content,
//				duration : 900,
//				location : 'middle'
//			});
//		});
		//如果停止则恢复
        jpush.isPushStopped(function(ret) {
            if(ret && ret.isStopped){
//              alert('jpush isPushStopped');
                jpush.resumePush(function(ret) {
                    if(ret && ret.status){
//                      alert('jpush resumePush');
                    }
                });
            }

        });
//      alert("type1:");
		jpush.setListener(
            function(ret) {
                var id = ret.id;
                var userid = ret.extra.userId;
                var title = ret.extra.title;
                var content = ret.content;
                var extra = ret.extra;
                var type = ret.extra.type;
                var taskid = ret.extra.taskid;
//              alert("type1:"+type);
                
//              alert("mid:"+ret.extras.msgId);
				
//              alert("mid2:"+ret.extra.msgId);
//              alert("type:"+type);
//              alert("content:"+content);
//              alert("type:"+type);
//              alert("content:"+ret.extra.subtype);
//              alert("id:"+id);
//              alert("id:"+ret.id);
//              alert("msgid:"+ret.msgId);
//              alert("msgid:"+ret.MsgId);
//              alert("messegeId"+ret.extra.msgId);
//              alert("messegeid"+ret.extra.messageid);
//              alert("messegeId"+ret.message);
//              alert("options:"+ret.options);
//              alert("sendno:"+ret.options.sendno);
//              alert("sendno:"+ret.options.apns_production);
                if(type=='PREBILL'||type=='MONITOR '||type=='PRESTANDBILL'||taskid!='undefined'){
                	//震动
                	api.notification({
                		vibrate :[500,500]
					}, function(ret, err) {
					    var id = ret.id;
					});
                	
                	var subtype = ret.extra.subtype;
                	var musicpath = '';
                	
                	if("1"==subtype||"2"==subtype){
                		musicpath = 'widget://res/mp3/chaoshi.mp3';
                	}else if("3"==subtype){
                		musicpath = 'widget://res/mp3/shengji.mp3';
                	}else if("7"==subtype){
                		musicpath = 'widget://res/mp3/zhuanpai.mp3';
                	}else if("9"==subtype){
                		musicpath = 'widget://res/mp3/accept.wav';
                	}else{
                		musicpath = 'widget://res/mp3/newbill.mp3';
                	}
                	
                	api.startPlay({
					    path: musicpath
					}, function(ret, err) {
					    if (ret) {
					//      alert('播放完成');
					    } else {
//					        alert(JSON.stringify(err));
					    }
					});


                	db_init();
                	
                	var data = {};
                	
                	data.mcId = id;
                	data.userid = userid; 
                	data.type = type;
                	data.title = title;
                	data.content = content;
                	data.time = (new Date()).pattern("yyyy-MM-dd HH:mm:ss");
                	db_saveMessageEnter(data,function(ret,err){});
                	
//              	db_getMessageCenter(userid, function(ret1, err) {
//              		if (ret1 && ret1 != "undefined") {
//                          //判断是否有未上传的图片
//                          if (ret1.length) {
////                              alert(ret1);
////                              alert(ret1[0].userid);
////                              alert(ret1[0].type);
////                              alert(ret1[0].title);
////                              alert(ret1[0].content);
////                              alert(ret1[0].time);
//                          } else {
//
//                          }
//                      } else {
//
//                      }
//              	});
                }

            if('4' == type){
//					alert("msgid:"+ret.extra.msgId);
//	                alert("type:"+type);
//	                alert("content:"+content);
	                msgid = ret.extra.msgId.toUpperCase();
	                //弹出验证码
//	                alert("type2:"+type);
//alert("000000");
        			$api.setStorage("nverifycode", msgid);

				}
            }
        );
		var isOpen=$api.getStorage("isOpen");
		if("Y"==isOpen){
//		alert("开关为"+("Y"==isOpen));
		var startTime = $api.getStorage("startTime");
		var endTime = $api.getStorage("endTime");
		if (startTime != null && startTime != "") {
			var strb = startTime.split(":");
			 sh = strb[0];
			sm = strb[1];

		}else{
		sh=00;
		sm=00;
//			alert("开始时间：" + sh);
		}
		if (endTime != null && endTime != "") {
			var stre = endTime.split(":");
			 eh = stre[0];
			 em = stre[1];

//			alert("结束时间：" + em);
		}else{
		eh=06;
		em=00;
//		alert("结束时间：" + em);
		}
		

		//设置免干扰时间
		var params = {};
		params.startHour = sh;
		params.startMinute = sm;
		params.endHour = eh;
		params.endMinute = em;
		jpush.setSilenceTime(params, function(ret) {
			if (ret && ret.status) {
				//success
				console.log("setPushTime:" + ret.status);
			}
		});
}
		//android点击推送
		api.addEventListener({
			name : 'appintent'
		}, function(ret, err) {
			if (ret && ret.appParam.ajpush) {
				var ajpush = ret.appParam.ajpush;
				var id = ajpush.id;
				var title = ajpush.title;
				var content = ajpush.content;
				var extra = ajpush.extra;
				pushSkip(extra);
			}
		})
		//IOS：点击推送触发事件
		api.addEventListener({
			name : 'noticeclicked'
		}, function(ret, err) {
			if (ret && ret.value && ret.value != "newBill") {
				var ajpush = ret.value;
				var content = ajpush.content;
				console.log(content);
				var extra = ajpush.extra;
				pushSkip(extra);
			}
		});
	};

	u.androidInit = function() {
		jpush.init(function(ret, err) {
			if (ret && ret.status) {
//				alert('操作成功!');
				console.log("jpush android绑定成功");
//				alert("jpush android绑定成功");
			} else {
				console.log("jpush android绑定失败");
				alert('jpush android绑定失败!');
//				alert(err);
//				alert(err.code);
				u.androidInit();
				//alert('操作失败!');
			}
		});
	};
	
		
	u.stop = function() {
		if (jpush == null) {
			return;
		}
		jpush.removeListener();
		jpush.stopPush();
	}
	//统计-app恢复
	function onResume() {
		jpush.onResume();
		// console.log('JPush onResume');
	}

	//统计-app暂停
	function onPause() {
		jpush.onPause();
		// console.log('JPush onPause');
	}

	function openPushDetail(jsonParam) {
		if (jsonParam) {
		}
	}

//打印日志到本地
	function toWriteFile(extra) {
    api.writeFile({
        path : 'fs://time.txt',
        data : '当前信息：' + extra + '\r\n',
        append : true
    }, function(ret, err) {
        //coding...

    });
}

	/**
	 * 推送判断
	 * @param {Object} extra
	 */
	function pushSkip(extra1) {
		var extra =null;
		if (extra1 != null && extra1 != "") {
//						alert('通知被点击，收到数据：\n' + extra);
			console.log(JSON.stringify(extra1));
			if (api.systemType == "android") {
//			 extra = eval("(" + extra1 + ")");
			 extra = extra1;
			}else{//ios中extra1是对象，所以先转为字符串再转为json对象
			//把对象extra转为json字符串
			var jsonStr=JSON.stringify(extra1);
			//转换为json对象
//			 extra = eval("(" + jsonStr + ")");
			 extra = jsonStr;
			}
			console.log(extra.billSn);
			var openType = extra.type;
			var subtype = extra.subtype;
			var taskid = extra.taskid;
			var winName = "";
			var winUrl = "";
			var pageParam = {};
			if (openType == "PREBILL" || openType == "MONITOR") {
				
				if (openType == "PREBILL") {
					//					alert('通知被点击，收到数据：\n' + extra);
					if("3"==subtype){
					pageParam.type = "GET_BILL_UPDATE_LIST";
					pageParam.title = "升级箱";
					}else{
					pageParam.type = "GET_BILL_LIST";
					pageParam.title = "待办工作";
					}
				} else {
					pageParam.type = "GET_BILL_MONITOR_LIST";
					pageParam.title = "监控箱";
				}
				pageParam.billSn = extra.billSn;
				pageParam.userId = extra.userId;
//				api.pageParam.billId = extra.billId;
				pageParam.fromsource = "notify";
				winName = "main_bill_detail";
				winUrl = "../bill/main_bill_detail_win.html";
			} else if (openType == "PRESTANDBILL") {
				//			alert('通知被点击，收到数据：\n' +extra);
				pageParam.applyId = extra.appid;
				//				alert('通知被点击，收到数据：\n' +extra.applyid);
				pageParam.title = "待办工作";
				winName = "mainStandBillDetail";
				winUrl = "../standBill/mainStandBillDetail.html";
			} else if (taskid) {
				pageParam.taskid = extra.taskid;
				pageParam.title = "巡检任务";
				winName = "xunjian_projectList";
				winUrl = "../xunjian/projectListWin.html";
			}
			pageParam.pushFlag = "PUSH";
			api.openWin({
				name : winName,
				url : winUrl,
				opaque : true,
				bounces : false,
				pageParam : pageParam,
				vScrollBarEnabled : false
			});
		}
	}


	window.$push = u;

})(window);

