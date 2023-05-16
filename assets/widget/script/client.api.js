//端api，与远程进行交互
var biaoshi=0;

(function(window) {

    var u = {};

    var user = null;
    var userid = null;
    var serverUrl = null;
    //用户ID

    var curServerUrl = null;
    //请求的地址

    /**
     *初始化操作
     */
    function init(data) {

        if (curServerUrl == null) {
            var curServer = null;
            if (typeof(getStorage) != "undefined") {
                curServer = getStorage('curServer');
            } else {
                curServer = $api.getStorage("curServer");
            }
            if (curServer == 'formal') {
                curServerUrl = sysConfig.serverUrl;
            } else {
                curServerUrl = sysConfig.serverUrl_test;
            }
        }
        if (userid == null) {
            if (typeof(getStorage) != "undefined") {
                user = getStorage('user');
            } else {
                user = $api.getStorage('user');
            }

            if (typeof(user) != "undefined" && typeof(user.userid) != "undefined") {
                if (typeof(data.userid) == "undefined" || typeof(data.userID) == "undefined") {
                    userid = user.userid;
                }
            }
        }

    }

    /**
     *切换正式/测试时，强制修改curServerUrl
     */
    u.changeServerUrl = function() {
            var curServer = null;
            if (typeof(getStorage) != "undefined") {
                curServer = getStorage('curServer');
            } else {
                curServer = $api.getStorage("curServer");
            }
            if (curServer == 'formal') {
                curServerUrl = sysConfig.serverUrl;
                $api.setStorage("ip", sysConfig.host);
            } else {
                curServerUrl = sysConfig.serverUrl_test;
                $api.setStorage("ip", sysConfig.testHost);
            }
            //      conole.log("");
        }

    u.getGpsUploadLocation = function(){
    		init({});
		//添加版本号
		//$api.setStorage("port", data.portType);
		var islogin = $api.getStorage("isLoginOut");
		var clienttype = 1;
		var debugFlag = '';
		if (api.systemType == 'ios') {
			clienttype = 1;
		} else if (api.systemType == 'android') {
			clienttype = 0;
		} else {
			debugFlag = '&debug=ttJw6Oc4NEtwPf8CbmwLNQ';
		}
		var serverUrl="";
		var equiptoken=$api.getStorage('equiptoken');
		serverUrl = curServerUrl + "?porttype=USER_HEART" + '&equiptoken=' + equiptoken+  '&v=' + api.appVersion +'&userid=' + userid + '&c=' + clienttype + (debugFlag.length > 0 ? debugFlag : '') + 'c_account='+userid;
        console.log("equiptoken:"+equiptoken)
		return serverUrl;
    };
        //远程加载数据
        //value是json对象
    function remoteLoad(data, callback) {
        api.showProgress({
            title : '处理中'
        });
        init(data);
        //添加版本号
        $api.setStorage("port", data.portType);
        var islogin = $api.getStorage("isLoginOut");
        var clienttype = 1;
        var debugFlag = '';
        if (api.systemType == 'ios') {
            clienttype = 1;
        } else if (api.systemType == 'android') {
            clienttype = 0;
        } else {
            debugFlag = '&debug=ttJw6Oc4NEtwPf8CbmwLNQ';
        }
        //		console.log("当前窗口："+api.winName);
        var winName = api.winName;
        var equiptoken=$api.getStorage('equiptoken');
        console.log("equiptoken:"+equiptoken)
        
        if (data.portType == 'GET_QRMESSAGE_DETAIL') {
          //===垂直越权修改===
          //serverUrl = "http://180.153.49.251:58090/itower/mobile/app/service?porttype=" + data.portType + '&equiptoken=' + equiptoken+ '&v=' + api.appVersion + (data.portType == 'USER_LOGIN' ? '' : ('&userid=' + userid)) + '&c=' + clienttype + (debugFlag.length > 0 ? debugFlag : '');
          serverUrl = "http://180.153.49.251:58090/itower/mobile/app/service?porttype=" + data.portType + '&v=' + api.appVersion + (data.portType == 'USER_LOGIN' ? '' : ('&userid=' + userid)) + '&c=' + clienttype + (debugFlag.length > 0 ? debugFlag : '');
        } else {
          //===垂直越权修改===
          //serverUrl = curServerUrl + "?porttype=" + data.portType + '&equiptoken=' + equiptoken+  '&v=' + api.appVersion + (data.portType == 'USER_LOGIN' ? '' : ('&userid=' + userid)) + '&c=' + clienttype + (debugFlag.length > 0 ? debugFlag : '');
          serverUrl = curServerUrl + "?porttype=" + data.portType + '&v=' + api.appVersion + (data.portType == 'USER_LOGIN' ? '' : ('&userid=' + userid)) + '&c=' + clienttype + (debugFlag.length > 0 ? debugFlag : '');
        }
// wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        // api.appVersion
        // $api.getStorage('appVersion');
// wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

        /*var c_timestamp = new Date().getTime();
        var c_account = userid;
//      var syskey = "dzbcpatnhy11fr4jja6fu3ap0i4aqq17ib7axhty6akh9q1qfeho3w8xev5ivaoo5gsata8b57jhp1mlwmn27gzpioiwguktordvq3dzebk23pggc06fpimjkniswiik";
        var ab = "bx1acuimpzf3k2eluw4ffh7sklmdshhtq0cifotpap2wm8qvd1k6psuokdcfjl04mi7th4q2t7kffmod9qj3huznncbbk4p9w46z6tp7lb282om4q5me7uigi7fl0nbt";

        var c_sign = "";
        var upvs = "2018-03-06-ccssoft";
        console.log("loginname:" + data.loginname);
*/
        //var module = api.require('moduleEncryptCcssoft');

        var arrJson; //返回的Json
        var c_account = userid;
        var loginname = data.loginName;
        if (api.systemType == "ios") {
        	var module= api.require('zyEncryptCcssoft');
        	console.log("ios-sign:" + module);
            if (data.portType == 'USER_LOGIN') {
                arrJson = module.encryptCcssoft({
                    msg: loginname
                });
            } else {
                arrJson = module.encryptCcssoft({
                    msg: c_account
                });
            }
        } else { //android
            var modu= api.require('zyEncryptCcssoft');
            console.log("android-sign:" + modu);
            if (data.portType == 'USER_LOGIN') {
               var loginname = data.loginName;
                //arrJson = modu.ccssoftCs({
                arrJson = modu.encryptCcssoft({
                    msg: loginname
                    //,a:ab
                });
            } else {
              arrJson = modu.encryptCcssoft({
                    msg: c_account
                    //,a:ab
                });
            }
        }

        console.log("signsignsignsign:" + JSON.stringify(arrJson));
        data.c_timestamp = arrJson.c_timestamp;
        data.c_account = arrJson.c_account;
        data.c_sign = arrJson.c_sign;
        data.upvs = arrJson.upvs;


// wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        delete data.portType;
        console.log(`请求地址:${JSON.stringify(serverUrl)}`);
        console.log("请求数据:", JSON.stringify(data));
        let time1 = new Date().getTime();
        
        // console.log(JSON.stringify(data));
        api.ajax({
            url: serverUrl,
            method: 'post',
            timeout: 300,
            dataType: 'json',
            headers:{
                "Authorization":$api.getStorage("Authorization"),
                "equiptoken":$api.getStorage('equiptoken'),
                "appVer":202112,
            },
            data: {
                values: data
            }
        }, function(ret, err) {
            let time2 = new Date().getTime();
            let time = time2 - time1;
            console.log(`请求结束${serverUrl},耗时:${time}ms`,JSON.stringify(ret));
            console.log(JSON.stringify(err))
            if(err && err!='' && err.msg !="" && err.msg.indexOf('当前用户未登录系统')>-1){
                let srr = err.msg
                console.log(srr)
                showToast(srr);
                return
            }
            if (callback != null) {
                if (ret) {
                  if(ret.data_info=="该账号已在其它设备登录"&&api.winName!="login"&&biaoshi==0){
                    //注销时设置islogin为false，表示未登录
                    biaoshi++;
                    api.alert({
                        title: '提示',
                        msg: ret.data_info,
                    }, function(ret, err) {
                      if(ret.buttonIndex==1){
                        biaoshi==0;
                        $api.setStorage("isLoginOut", "true");

                        //关闭极光推送

                        //注销时提醒后台，改用户已注销
                        $client.userLoginOut(function(ret, err) {
                        });
                        api.execScript({
                          name : 'login',
                          script : 'refreshVerify();'
                        });

                        window.setTimeout(function(){
                          //打开登录页
                        api.closeToWin({
                          name : 'login'
                        });
                          openPage_login();
                        },200);
                      }
                    });

                  }else {
                    if (ret.status == "OK") {
                        ret.success = true;
                    } else if ((ret.status == 'reset' && "false" == islogin) || (ret.status == 'FAILED' && '该版本已经过旧或禁止使用，请及时更新！' == ret.data_info &&
                            "USER_LOGIN" != $api.getStorage("port") && "false" == islogin) && "USER_CHECK_LOGIN" != $api.getStorage("port") &&
                        "USER_LOGOUT" != $api.getStorage("port")) {
                        ret.success = false;
                        api.alert({
                            title: "提示信息",
                            msg: ret.data_info

                        }, function(ret, err) {
                            if (ret) {
                                if (ret.buttonIndex == 1) {
                                    $api.setStorage("isLoginOut", "true");
                                    api.closeToWin({
                                        name: 'login'
                                    });
                                }
                            }

                        });


                    } else {
                        ret.success = false;
                    }
                  }

                } else {}
                callback(ret, err);
            } else {}
        });
        api.hideProgress();
  }

    //图片上传
    function remoteInspectLoad(value, files,page, callback) {

        var user = $api.getStorage('user');
        // value.userid = user.userid;
        var count=Object.keys(value).length;
        console.log(count);

        var imgArr=[];

        for (var j = 0; j < count-2; j++) {
          console.log(JSON.stringify(value[j]));
          imgArr.push(value[j].imgpath)
        }
        var state;
        if(value[0].state){
          state = value[0].state
        }else {
          state ='';
        }
        console.log(JSON.stringify(value));
        var filesObj={};
        for (var i = 0; i < imgArr.length; i++) {
          filesObj["file"+i] = imgArr[i];
        }


        var data = {
          values : {
            "portType":value.portType,
            'picNum': count-2,
            'state':state
          },
          files : filesObj
        };
        var curServer = $api.getStorage("curServer");
        console.log(getObj(data.files));
        console.log(getObj(data.values));
        console.log(curServer);
        var curServerUrl = null;
        if (curServer == 'formal') {
            curServerUrl = sysConfig.serverUploadUrl;
        } else {
            curServerUrl = sysConfig.serverUploadUrl_test;
        }
        var equiptoken=$api.getStorage('equiptoken');
        console.log("equiptoken:"+equiptoken)
        //===垂直越权修改===
        //curServerUrl += '?porttype=&userid=' + user.userid + '&equiptoken=' + equiptoken+ '&c=' + (api.systemType == 'ios' ? 1 : 0) + '&v=' + api.appVersion+'&page='+page+'&uploadtime='+CurentTime();
        curServerUrl += '?porttype=&userid=' + user.userid + '&c=' + (api.systemType == 'ios' ? 1 : 0) + '&v=' + api.appVersion+'&page='+page+'&uploadtime='+CurentTime();
        console.log(curServerUrl);
        try {
            api.ajax({
                url: curServerUrl,
                method: 'post',
                timeout: 40,
                dataType: 'json',
                headers:{
                    "equiptoken":$api.getStorage('equiptoken')
                },
                returnAll: true,
                report:true,
                data: data
                // ,
                // headers: {"Content-Type": "multipart/form-data"}
            }, function(ret, err) {
              console.log(JSON.stringify(ret));
              console.log(JSON.stringify(err));
                if (callback != null) {

                    if (ret.body) {

                      if(ret.body.data_info=="该账号已在其它设备登录"&&api.winName!="login"&&biaoshi==0){
                        //注销时设置islogin为false，表示未登录
                        biaoshi++;
                        api.alert({
                            title: '提示',
                            msg: ret.body.data_info,
                        }, function(ret, err) {
                          if(ret.buttonIndex==1){
                            biaoshi==0;
                            $api.setStorage("isLoginOut", "true");

                            //关闭极光推送

                            //注销时提醒后台，改用户已注销
                            $client.userLoginOut(function(ret, err) {
                            });
                            api.execScript({
                              name : 'login',
                              script : 'refreshVerify();'
                            });

                            window.setTimeout(function(){
                              //打开登录页
                            api.closeToWin({
                              name : 'login'
                            });
                              openPage_login();
                            },200);
                          }
                        });

                      }else {
                        if (ret.body.status == "OK") {
                            ret.body.success = true;
                        } else {
                            ret.body.success = false;
                        }
                      }

                    }
                    callback(ret, err);
                } else {}

            });
        }
        catch(err) {
          console.log(err);
          api.toast({
              msg: '异常错误,请联系管理员！'
          });
        }

    }

    //极光推送日志信息
    function remotePushLog(value, callback) {
        var data = {};
        var curServer = $api.getStorage("curServer");
        var curServerUrl = null;
        if (curServer == 'formal') {
            curServerUrl = sysConfig.pushLogUrl + value;
        } else {
            curServerUrl = sysConfig.pushLogUrl_test + value;
        }
        api.ajax({
            url: curServerUrl,
            method: 'post',
            timeout: 60,
            dataType: 'json',
            returnAll: false,
            data: data
        }, function(ret, err) {

        });
    }

    function remoteHostList(callback) {
        var url = 'http://180.153.49.251:58090/iplist.json';
        if (debug) {
            var json = {
                "集团": "180.153.49.251:58090",
                "河南": "101.227.240.166:58090"
            }
            callback(json);
        } else {
            $.getJSON(url, function(json) {
                callback(json);
            });
        }
    }

    /**
     * 向json对象中添加当前位置信息
     * @param data
     */
    function appendPosParam(opts){
        let lastLocation = $api.getStorage('LAST_GPS_LOCATION');
        if(lastLocation){
            opts.lon = lastLocation.lon;
            opts.lat = lastLocation.lat;
        }else{
            opts.lon = 0;
            opts.lat = 0;
        }
    }

    /*
     * 以下方法为接口方法，提供接口访问服务器
     */

    //出入站建单
    u.createStandBill = function(data, callback) {
        data.portType = "STATION_BILL_CREATE";
        remoteLoad(data, callback);
    };

    //出入站待办列表
    u.getStandBillList = function(opts, callback) {
        opts.portType = 'STATION_BILL_WAITLIST';
        appendPosParam(opts);
        remoteLoad(opts, callback);
    };

    //出入站在途工单列表
    u.getStandWorkingBillList = function(opts, callback) {
        opts.portType = 'STATION_BILL_WORKING_LIST';
        remoteLoad(opts, callback);
    };

    //出入站已办列表
    u.getStandFinishBillList = function(opts, callback) {
        opts.portType = 'STATION_BILL_FINISH_LIST';
        if (opts.daytype == '' || opts.daytype == null || opts.daytype == 'undefined') {
            opts.daytype = 1;
        }
        remoteLoad(opts, callback);
    };

    //出入站处理
    u.standDeal = function(data, callback) {
        remoteLoad(data, callback);
    };

    u.getStandBillDetail = function(opts, callback) {
        opts.portType = "STATION_BILL_DETAIL";
        remoteLoad(opts, callback);
    };

    u.getRepairBillDetail = function(opts, callback) {
        opts.portType = "FIX_BILL_DETAIL";
        remoteLoad(opts, callback);
    };
    //生成维修工单
    u.insterRepairBill = function(opts, callback) {
        opts.portType = "FIX_BILL_INSTER";
        remoteLoad(opts, callback);
    };

    //获取代维人员列表
    u.getDwPerson = function(opts, callback) {
        opts.portType = "FIX_DWPERSON_LIST";
        remoteLoad(opts, callback);
    };

    //日常维修-退单
    u.repairBackUpBill = function(opts, callback) {
        opts.portType = "FIX_BILL_ROLLBACK";
        remoteLoad(opts, callback);
    };

    //校验是否强制维修
    u.checkMandatory = function(opts,callback) {
        opts.portType = 'FIX_BILL_MANDATORY_MAINTENANCE';
        remoteLoad(opts,callback);
    }

    //如果为强制维修，根据单号保存原因
    u.saveMaintenances = function(opts, callback){
        opts.portType = 'FIX_BILL_SAVE_MAINTENANCE';
        remoteLoad(opts, callback);
    }

    //日常维修-解挂
    u.repairHangUpBill = function(opts, callback) {
        opts.portType = "FIX_BILL_SOLUTION";
        remoteLoad(opts, callback);
    };


    /**
    *站址与经纬度查询
    */
    //zhangning
    // u.stationDetail=function(data, callback){
    // data.portType = "ELECTRIC_STATION_INFO";
    // remoteLoad(data, callback);
    // }

    //电表绑定提交
    u.submitAmmeter=function(data, callback){
    data.portType = "ELECTRIC_AMMETER_INFO";
    remoteLoad(data, callback);
    }

    //电表绑定页面图片上传
    u.uploadammeterImage = function(opts, file, callback) {
            var data = {};
            for (var i in opts) {
                data[i] = opts[i];
            }
            delete data.stationname;
            delete data.id;
            data.portType = "ELECTRIC_AMMETER_UPLOAD";

            if (data.savedate) {
                data.phototime = data.savedate
                delete data.savedate;
            }
            var files = {
                file: file
            };
            // showlog(file);
            remoteInspectLoad(data, files,'xunjian', callback);
        }


    //查询机房名称与机房编码
    u.roomcodeBegin = function(opts, callback) {
        opts.portType = "ELECTRIC_AMMETER_ROOMCODE";
        remoteLoad(opts, callback);
    };


    //获取区域经理列表
    u.getManPerson = function(opts, callback) {
        opts.portType = "FIX_MANAGER_LIST";
        remoteLoad(opts, callback);
    };


    //获取区域经理列表
    u.transfornPerson = function(opts, callback) {
        opts.portType = "FIX_BILL_DISPATCH";
        remoteLoad(opts, callback);
    };

    //获取用户信息
    u.getUserInfo = function(userID, notifyUserId, callback) {
        var data = {};
        data.portType = "USER_DETAIL_INFO";
        //   data.userID = userID;
        data.id = notifyUserId;
        remoteLoad(data, callback);
    };

    //登录
    /*
     * 登录接口
     * opts{
     *      loginName  用户名
     *      password  密码
     *      clientType  客户端类型
     *      osversion   操作系统类型
     *      softversion 版本号
     *      phoneinfo   手机信息
     * }
     */
    u.login = function(opts, callback) {
        // opts.portType = "4A_USER_LOGIN";
        opts.portType = "USER_LOGIN";
        //alert("opts.portType=="+opts.portType);
        opts.imsi = "";
        opts.phoneNum = "";
        opts.appacctid = "";
        opts.token = "";
        opts.pushtype = "1";
        //默认从html的app登录的都是极光推送，即用1表示，0表示Android的app
        remoteLoad(opts, callback);
    };
    /* 
     新增返回参数: "secondAuth": "true" 
     前端判断若为true，
     则需要进行短信二次验证；
     若不需要短信二次验证，同原逻辑 
    */
    u.fourALogin = function(opts, callback) {
        // opts.portType = "4A_USER_LOGIN";
        opts.portType = "USER_LOGIN";
        //alert("opts.portType=="+opts.portType);
        opts.imsi = "";
        opts.phoneNum = "";
        opts.appacctid = "";
        opts.token = "";
        opts.pushtype = "1";
        //默认从html的app登录的都是极光推送，即用1表示，0表示Android的app
        remoteLoad(opts, callback);
    };
    /*
        短信发送接口
        -- 请求参数
        loginName ：登录名称
        -- 响应参数
        pin : 验证码
    */
    u.sendSms = function(opts, callback) {
        opts.portType = "4A_LOGIN_SMS_SEND";
        // opts.portType = "LOGIN_SMS_SEND";
        remoteLoad(opts, callback);
    };
    /*
    新增验证码校验接口： 4A_LOGIN_CHECK_PIN
    -- 请求参数
    loginName ：登录名称
    password ：密码(AES加密)
    pin ：    验证码
    */
    u.checkPin = function(opts, callback){
        opts.portType = "4A_LOGIN_CHECK_PIN";
        opts.pushtype = "1";
        remoteLoad(opts, callback);
    }

    //版本更新查询
    u.getVersion = function(callback) {
        var data = {};
        data.portType = "APP_ANDROID_VERSION";
        remoteLoad(data, callback);
    };

    /*
     *实时刷新信号性能数据
     * opts = {
     *      fsuId   FSUid
     *      deviceId 设备id
     *      semaphoreId 信号量id
     *      portType 接口名称
     * }
     */
    u.getMidRealData = function(opts, callback) {
        opts.portType = "GET_MID_REAL_DATA";
        remoteLoad(opts, callback);
    };

    u.getUserLocation = function(userID, lon, lat, callback) {
        var data = {};
        data.portType = "GET_USER_LOCATION";
        //   data.userID = userID;
        data.lon = lon;
        data.lat = lat;
        remoteLoad(data, callback);
    };

    u.getHeart = function(lon, lat, callback) {
        var data = {};
        data.portType = "USER_HEART";
        data.lon = lon;
        data.lat = lat;
        remoteLoad(data, callback);
    }

    u.upLoadImg = function(userID, projectId, uploadImgPathArr, callback) {
        var data = {};
        data.portType = "XUNJIAN_PROJECT_IMAGE_UPLOAD";
        data.ID = projectId;
        //   data.userID = userID;
        if (uploadImgPathArr != null) {
            //将图片一张张存储 tangsj 2015-09-23
            for (var i = 0; i < uploadImgPathArr.length; i++) {
                var files = {};
                files[0] = uploadImgPathArr[i];
                remoteInspectLoad(data, files,'', callback);
            }
        }
        //files.file = uploadImgPathArr;
    };

    u.ajpushLog = function(id, userId, isLogin, callback) {
        var paramStr = "?id=" + id + "&userId=" + userId + "&isLogin=" + isLogin;
        remotePushLog(paramStr, callback);
    }

    u.createNoAlarmBill = function(userID, paramJson, callback) {
        var data = paramJson;
        data.portType = "SET_CREATE_BILL";
        //  data.userID = userID;
        remoteLoad(data, callback);
    };

    u.saveInspectReport = function(userID, projectId, isFinish, isShidden, isStander, remark, shiddenSource, callback) {
        var data = {};
        data.portType = "XUNJIAN_PROJECT_SAVE";
        data.ID = projectId;
        //   data.userID = userID;
        data.isFinish = isFinish;
        data.isShidden = isShidden;
        data.isStander = isStander;
        data.remark = remark;
        data.shiddenSource = shiddenSource;
        remoteLoad(data, callback);
    };
    //获取站址的维护人员
    u.getStationUsers = function(data, callback) {
        data.portType = "GET_STATION_USER";
        remoteLoad(data, callback);
    };

    //获取用户任务数
    u.getUserTaskCount = function(callback) {
        var data = {};
        data.portType = "GET_USER_PROCESS_NUM";

        remoteLoad(data, callback);
    };

    //获取用户即将超时的工单数和已超时的工单数
    u.getWillOverTimeCount = function(userId, callback) {
        var data = {};
        data.portType = "GET_USER_PROCESS_NUM";
        //  data.userID = userId;
        remoteLoad(data, callback);
    };

    //门禁操作接口
    u.getDoorStatus = function(userId, FSUID, DeviceID, callback) {
        var data = {};
        data.portType = "GET_DOORSTATUS";
        //    data.userID = userId;
        data.FSUID = FSUID;
        data.DeviceID = DeviceID;
        data.SemaphoreId = "0417201001";
        remoteLoad(data, callback);
    };

    //门禁操作接口
    // causeDealInfo
    u.setPoint = function(userId, FSUID, DeviceID, SemaphoreId,callback) {
        var data = {};
        data.portType = "SETPOINT";
        data.userID = userId;
        data.FSUID = FSUID;
        data.DeviceID = DeviceID;
        data.SemaphoreId = "0417201001";
        // data.opencause = causeDealInfo;
        remoteLoad(data, callback);
    };

    /*
     * 获取省市区列表接口
     * opts{
     *      objectType : 对象类型
     *      provinceId : 省份编号
     *      cityId     : 城市编号
     * }
     */
    u.getUnitList = function(opts, callback) {
        opts.portType = "FSU_REL_UNIT";
        remoteLoad(opts, callback);
    };
    //验证登录
    u.getCheckLogin = function(opts, callback) {
        opts.portType = "USER_CHECK_LOGIN";
        remoteLoad(opts, callback);
    };

    //获取用户权限区域列表
    u.getAllUnitList = function(callback) {
        var opts = {
            portType: 'GET_PRIVINCE_LIST'
        }
        remoteLoad(opts, callback);
    };

    //刷新任务列表
    u.getRefresh = function(userId, taskId, callback) {
        var data = {};
        data.portType = "XUNJIAN_REFRESH";
        //  data.userID = userId;
        data.taskId = taskId;
        remoteLoad(data, callback);
    };

    //获取任务列表
    u.getTaskList = function(userId, start, portType, stationName, stationCode, callback) {
        var data = {};
        data.portType = portType;
        // data.userID = userId;
        data.start = start * 20 + 1;
        data.limit = 20;
        data.stationName = stationName;
        data.stationCode = stationCode;
        remoteLoad(data, callback);
    };

    //获取任务项目列表
    u.getTaskProjectList = function(userId, start, taskId, callback) {
        var data = {};
        data.portType = "ProjectDownload";
        //   data.userID = userId;
        data.start = start * 20 + 1;
        data.limit = 20;
        data.taskId = taskId;
        remoteLoad(data, callback);
    };

    //巡检任务列表回滚
    u.getTaskRollback = function(opts, callback) {
            if (opts.type == 'XUNJIAN_TASK') {
                opts.portType = 'XUNJIAN_ROLLBACK';
            } else if (opts.type == 'NEW_XUNJIAN_TASK' || opts.type =='NEW_XUNJIAN_HISTORY_TASK') {
                opts.portType = 'NEW_TASK_ROLLBACK';
            }
            remoteLoad(opts, callback);
        }
        //巡检详情回滚（大重置，右上角）
    u.getProjectRollback = function(opts, callback) {
        //		opts.portType = 'NEW_TASK_PROJECT_ROLLBACK';
        opts.portType = 'NEW_TASK_MODULE_ROLLBACK';
        remoteLoad(opts, callback);
    }

    //巡检详情回滚(小重置)
    u.getProjectItemRollback = function(opts, callback) {
        opts.portType = 'NEW_TASK_PROJECT_ROLLBACK';
        //		opts.portType = 'NEW_TASK_MODULE_ROLLBACK';
        remoteLoad(opts, callback);
    }

    //资产核查获取token  zhangning
    u.getpropertyTokens = function(data,callback){
        // data.portType = 'OBTAIN_TOKEN';
        data.portType = 'OBTAIN_TOKEN_NEW';
        remoteLoad(data, callback);
    }


    //现场项目重置
    u.checkProjectRollback = function(opts, callback) {
        opts.portType = 'CHECK_DETAIL_ROLLBACK';
        remoteLoad(opts, callback);
    }

    //获取通讯录列表
    u.getContactList = function(userId, start, callback) {
        var data = {};
        data.portType = "GET_MAIL_LIST";
        //   data.userID = userId;
        data.start = start * 20 + 1;
        data.limit = 20;
        remoteLoad(data, callback);
    };

    u.getNewContactList = function(opts, callback) {
            opts.portType = "GET_CONTACT_LIST";
            remoteLoad(opts, callback);
        }

    u.getMyPoints = function(opts, callback) {//dingxb  开发时间：2019/1/19  功能：调用查看我的积分，通过登陆名查询我的积分，积分由各个工单查询，
                                                                //  每个工单有标准得分和实际得分，需求描述人：孙曦彤

                opts.portType = "GET_MY_POINTS";
                remoteLoad(opts, callback);
            }

    u.getWorkCurrent = function(opts, callback) {//dingxb  开发时间：2019/1/22  功能：调用接口查询电压电流信息
                                                                        //  通过查询hbase显示电压电流曲线图，需求描述人：孙曦彤
                  opts.portType = "GET_DATA_EXAMPLE";
                        remoteLoad(opts, callback);
                    }

      u.getTransferPerson = function(opts, callback) {//dingxb  开发时间：2019/1/28  功能：工单转派，通过省市区和站址id先查询可以转派的人员
                                                                                        //  提出时间：2019/1/25 提出人：张超  需求描述人：孙曦彤
              opts.portType = "GET_ZNDW_REDEPLOY_USERS";
              remoteLoad(opts, callback);
      }
      u.todoTransfer = function(opts, callback) {//dingxb  开发时间：2019/1/29  功能：通过传入的转派人员信息和被转派工单进行转派
                                                                                        //  提出时间：2019/1/25 提出人：张超  需求描述人：孙曦彤
              opts.portType = "ZNDW_REDEPLOY_TO_USER";
              remoteLoad(opts, callback);
      }
      u.getPacketPerson = function(opts, callback) {//dingxb  开发时间：2019/3/6  功能：巡检模块中增加协助人信息，该方法用于获取协助人信息
                                                                                      //  提出时间：2019/2/26 提出人：郭哲  需求描述人：孙曦彤
              opts.portType = "GET_XJ_USER_LIST";
              remoteLoad(opts, callback);
      }
      u.addtodoman = function(opts, callback) {//dingxb  开发时间：2019/3/7  功能：巡检模块中增加协助人信息，该方法用于添加协助人信息
                                                                                      //  提出时间：2019/2/26 提出人：郭哲  需求描述人：孙曦彤
              opts.portType = "TASK_ADD_ASSISTANTS";
              remoteLoad(opts, callback);
      }
      u.ifmodhasexist = function(opts, callback) {//dingxb  开发时间：2019/3/8  功能：巡检模块中增加协助人信息，判断模块是否已经有人提交
                                                                                      //  提出时间：2019/2/26 提出人：郭哲  需求描述人：孙曦彤
              opts.portType = "ASSISTANT_HANDLE_MODULES";
              remoteLoad(opts, callback);
      }
      u.transtodoman = function(opts, callback) {//dingxb  开发时间：2019/3/8  功能：巡检模块中实现转派功能
                                                                                      //  提出时间：2019/2/26 提出人：郭哲  需求描述人：孙曦彤
              opts.portType = "TASK_REDEPLOY";
              remoteLoad(opts, callback);
      }
      u.getHisXJtask = function(opts, callback) {   //dingxb 开发时间：2019/3/19 功能：在巡检任务已完成列表中，当点击右上角历史时，查询当前执行人执行过的巡检任务
                                                                                    ////  提出时间：2019/2/26 提出人：郭哲  需求描述人：孙曦彤
              opts.portType = "GET_MY_HIS_TASK";
              remoteLoad(opts, callback);
          }


        //获取公告列表
    u.getNoticeList = function(start, callback) {
        var data = {};
        data.portType = "GET_BULLE_LIST";
        data.start = 20 * start + 1;
        data.limit = 20;
        remoteLoad(data, callback);
    };

    //获取站址列表(作废）
    u.getStationList = function(userId, limit, start, provinceId, cityId, areaId, stationName, stationCode, registstatus, callback) {
        var data = {};
        var lastLocation = $api.getStorage(xx.cache.LAST_GPS_LOCATION);
        data.portType = "GET_BASE_STATION_LIST";
        //   data.userID = userId;
        data.start = start * 20 + 1;
        data.limit = limit;
        data.provinceId = provinceId;
        data.cityId = cityId;
        data.areaId = areaId;
        data.stationName = stationName;
        data.stationCode = stationCode;
        data.registstatus = registstatus;
        data.lon = lastLocation.lon;
        data.lat = lastLocation.lat;
        remoteLoad(data, callback);
    };

    /**
     * 获取简单站址列表
     *
     * params{
     * limit:'', start:'', provinceId:'', cityId:'', areaId:'', stationName:'', stationCode:'', status:''
     * }
     */
    u.getBaseStationSimpleList = function(params, callback) {
            var data = {};
            data.portType = "GET_BASE_STATION_SIMPLE_LIST";
            data.start = params.start * 20 + 1;
            data.limit = params.limit;
            data.provinceid = params.provinceId;
            data.cityid = params.cityId;
            data.areaid = params.areaId;
            data.stationname = params.stationName;
            data.stationcode = params.stationCode;
            data.isroomfault = params.isroomfault;
            data.status = params.status;
            remoteLoad(data, callback);
        }
        //获取站址详情
        /*
         * 获取站址详情接口
         * opts{
         *      id 站址编码
         *  }
         *
         */
    u.getStationDetail = function(opts, callback) {
        opts.portType = "GET_BASE_STATION_DETAIL";
        remoteLoad(opts, callback);
    };

    /*
     * 获取日常维修流程列表
     * opts{
     *      id 站址编码
     *  }
     *
     */
    u.getRepairStep = function(opts, callback) {
        opts.portType = "FIX_TASK_LIST";
        remoteLoad(opts, callback);
    };
    //获取设备列表
    /*
     * opts = {
     * areaId
     * }
     */
    u.getDevList = function(opts, callback) {
        opts.portType = "GET_STATION_DEVICE_LIST";
        remoteLoad(opts, callback);
    };
    //获取设备列表,增加字段
    /*
     * opts = {
     * areaId
     * }
     */
    u.getDevListPlus = function(opts, callback) {
        opts.portType = "GET_STATION_DEVICE_LIST_PLUS";
        remoteLoad(opts, callback);
    };


    //获取设备详情
    u.getDevDetail = function(userId, deviceId, fsuId, callback) {
        var data = {};
        data.portType = "FSU_DEVICE_DETAIL";
        //  data.userID = userId;
        data.deviceId = deviceId;
        data.fsuId = fsuId;
        remoteLoad(data, callback);
    };

    //获取信号列表
    u.getSignalList = function(userId, start, deviceId, isDetail, callback) {
        var data = {};
        data.portType = "GET_FSU_DEVICE_SEMAPHORE";
        //   data.userID = userId;
        data.id = deviceId;
        data.start = start * 20 + 1;
        data.limit = 20;
        remoteLoad(data, callback);
    };

    //获取信号列表
    u.getSimpleOrAllSignalList = function(opts, callback) {
        var data = {};
        data.portType = "GET_FSU_DEVICE_SEMAPHORE_LIST";
        if (opts.showflag == "1") {
            data.showflag = opts.showflag;
        }
        data.areaid = opts.areaid;
        data.deviceid = opts.deviceCode;
        data.start = opts.start * 20 + 1;
        data.limit = 20;
        remoteLoad(data, callback);
    };

    //获取信号列表
    u.getSimpleOrAllSignalListByType = function(opts, callback) {
        var data = {};
        if (opts.signalType == "yc") {
            data.portType = "GET_FSU_DEVICE_SEMAPHORE_YC";
        } else {
            data.portType = "GET_FSU_DEVICE_SEMAPHORE_YX";
        }

        if (opts.showflag == "1") {
            data.showflag = opts.showflag;
        }
        data.areaid = opts.areaid;
        data.deviceid = opts.deviceCode;
        data.start = opts.start * 20 + 1;
        data.limit = 20;
        remoteLoad(data, callback);
    };

    u.getSimpleOrAllSignalListByType = function(opts, callback) {
        var data = {};

        data.portType = "GET_FSU_DEVICE_SEMAPHORE_LIST_MONGO";
        if (opts.signalType == "yc") {
            data.type = "0";
        } else {
            data.type = "1";
        }

        if (opts.showflag == "1") {
            data.showflag = opts.showflag;
        } else {
            data.showflag = "0";
        }
        data.fsuId = opts.fsuId;
        data.areaid = opts.areaid;
        data.deviceid = opts.deviceCode;
        showlog("2 devFsuId " + data.fsuId + " deviceCode " + data.deviceid);
        data.start = opts.start * 20 + 1;
        data.limit = 20;
        remoteLoad(data, callback);
    };

    //获取告警列表
    /*
     * 获取告警列表
     * opts{
     *  start 页数
     *  alarmlevel
     *  provinecId
     *  cityId
     *  areaId
     *  stationName
     *  stationCode
     *  stationId
     * }
     */
    u.getAlarmList = function(opts, callback) {
        opts.portType = "FSU_ALARM_LIST";
        remoteLoad(opts, callback);

    };

    //获取告警详情
    u.getAlarmDetail = function(userId, alarmId, callback) {
        var data = {};
        data.portType = "FSU_ALARM_DETAIL";
        // data.userID = userId;
        data.id = alarmId;
        remoteLoad(data, callback);
    };

    //获取代维工单告警详情
    u.getZndwAlarmDetail = function(userId, alarmId, callback) {
        var data = {};
        data.portType = "ZNDW_ALARM_LIST";
        // data.userID = userId;
        data.id = alarmId;
        remoteLoad(data, callback);
    };

    //3,4级告警派单
    u.alarmCreateBill = function(userId, alarmId, notifyUserId, callback) {
        var data = {};
        data.portType = "ALARM_CREATE_BILL";
        //  data.userID = userId;
        data.id = alarmId;
        data.notifyUserId = notifyUserId;
        remoteLoad(data, callback);
    };

    /**
     * 获取待办工单列表
     * opts {
     *   stationName  站址名
     *   stationCode  站址编码
     *   beginTimeType 日期类型
     *   billstatus    工单状态
     *   alarmstatus   告警状态
     * }
     */

    //待办工单列表（旧）
    u.getBillList = function(opts, callback) {
        opts.portType = "GET_BILL_LIST";
        remoteLoad(opts, callback);
    };

    //工单列表（新）
    u.getFaultBillList = function(opts, callback) {
        // trace();
        opts.portType = "GET_BILL_WAIT_LIST";
        appendPosParam(opts);
        remoteLoad(opts, callback);
    };

    //工单列表（新）
    u.getRepairBillList = function(opts, callback) {
        opts.portType = "FIX_BILL_LIST";
        appendPosParam(opts);
        remoteLoad(opts, callback);
    };


    //合同列表
    u.getRepairContractList = function(opts, callback) {
        opts.portType = "FIX_CONTRACT_LIST";
        remoteLoad(opts, callback);
    };
    /**
     * 获取监控工单列表
     * opts {
     *   stationName  站址名
     *   stationCode  站址编码
     *   beginTimeType 日期类型
     *   billstatus    工单状态
     *   alarmstatus   告警状态
     * }
     */
    u.getBillMonitorList = function(opts, callback) {
        opts.portType = "GET_BILL_MONITOR_LIST";
        remoteLoad(opts, callback);
    };

    /**
     * 获取已办工单列表
     * opts {
     *   stationName  站址名
     *   stationCode  站址编码
     *   beginTimeType 日期类型
     *   billstatus    工单状态
     *   alarmstatus   告警状态
     * }
     */
    u.getBillFinishList = function(opts, callback) {
        opts.portType = "GET_BILL_FINISH_LIST";
        remoteLoad(opts, callback);
    };

    /**
     * 获取升级箱
     * opts {
     *   stationName  站址名
     *   stationCode  站址编码
     *   beginTimeType 日期类型
     *   billstatus    工单状态
     *   alarmstatus   告警状态
     * }
     */
    u.getBillUpgradeList = function(opts, callback) {
        opts.portType = "GET_BILL_UPDATE_LIST";
        remoteLoad(opts, callback);
    };
    /*
     * 获取工单详情
     * opts{
     *  billSn 工单编号
     *  frmosource
     * }
     */
     u.getBillDetail = function(opts, callback) {
       var tit=opts.title;
       if(tit.indexOf('发电')>=0){
         opts.portType = "GET_ELECTRI_BILL_DETAIL";
       }else {
         opts.portType = "GET_BILL_DETAIL";
       }
         //  data.userID = userid;
         remoteLoad(opts, callback);
     };

    /*获取工单操作记录
     * opt {
     *      billId 工单编号
     * }
     */
    u.getBillActionList = function(opts, callback) {
        opts.portType = "GET_BILL_ACTION";
        opts.billId = billId;
        remoteLoad(opts, callback);
    };

    //接单回单接口
    u.acceptOrRevertBill = function(data, callback) {
        data.portType = "SET_BILL_STATUS";
        remoteLoad(data, callback);
    };

    //接单接口
    u.acceptBill = function(opts, callback) {
        opts.portType = "SET_BILL_ACCEPT";
        remoteLoad(opts, callback);
    };

    //发电回单接口
    u.genelecRevertBill = function(data, callback) {
        data.portType = "BILL_GENELEC_REVERT";
        remoteLoad(data, callback);
    };


    //日常维修-方案制定
    u.repairDoPlan = function(data, callback) {
        data.portType = "FIX_BILL_FOMULATE";
        remoteLoad(data, callback);
    };
    //日常维修-方案制定-更新改造接口
    u.repairDoPlanRemould = function(data, callback) {
        data.portType = "FIX_BILL_FOMULATE_REMOULD";
        remoteLoad(data, callback);
    };
     //日常维修-方案制定-更新改造-是否需要逐级审批接口
     u.repairDoPlanRemouldIfExamine = function(data, callback) {
        data.portType = "FIX_BILL_FOMULATE_IF_EXAMINE";
        remoteLoad(data, callback);
    };

    //日常维修-组织实施接口
    u.repairOperateBill = function(data, callback) {
        data.portType = "FIX_BILL_IMPLEMENT";
        remoteLoad(data, callback);
    };


    //日常维修-结论验收接口
    u.repairCheckAcceptBill = function(data, callback) {
        data.portType = "FIX_BILL_ACCEPT";
        remoteLoad(data, callback);
    };


    //開始發電接口
    u.genelecBegin = function(data, callback) {
        data.portType = "SET_BILL_ELECTRICT_BEGIN";
        remoteLoad(data, callback);
    };

    //发电回单接口
    u.genelecEnd = function(data, callback) {
        data.portType = "SET_BILL_ELECTRICT_END";
        remoteLoad(data, callback);
    };

    //发电回单接口
    u.versionUpdate = function(callback) {
        var data = {};
        data.portType = "APP_ANDROID_VERSION";
        remoteLoad(data, callback);
    };




    //发电
    u.electrictJudge = function(data, callback) {
        data.portType = "SET_BILL_ELECTRICT_JUDGE";
        remoteLoad(data, callback);
    };

    //待确认
    u.supportConfirm = function(data, callback) {

        data.portType = "SET_BILL_SUPPORTCONFIRM";
        remoteLoad(data, callback);
    };

    /*
     * 升级
     * opts {
     *  userid 用户编码
     *  billSn 工单编码
     *  taskId 任务编号
     *  linkInfo 联系人
     *  dealComment 处理意见
     *  areaMan   区域经理
     * }
     */
    u.upgrade = function(opts, callback) {
        opts.portType = "SET_BILL_UPDATE";
        remoteLoad(opts, callback);
    };

    //反馈
    u.feedBack = function(data, callback) {
        data.portType = "SET_BILL_FEEDBACK";
        remoteLoad(data, callback);
    };

    //申请延时
    u.yysbilldelay = function(data, callback) {
        data.portType = "SET_BILL_DELAY";
        remoteLoad(data, callback);
    };

    //到站签到
    u.upStationSign = function(data, type, callback) {
        console.log("处理类：" + type);
        if ("UPSTATIONSIGN" == type) {
            data.portType = "BILL_STATION_ARRIVE";
        } else if ("REGISTER" == type) {
            data.portType = "SET_BILL_SIGN";
        } else if ("XUNJIAN" == type) {
            data.portType = "NEW_TASK_SIGN";
        }
        remoteLoad(data, callback);
    };

    //出入站签到
    u.billStationSign = function(data, callback) {
        data.portType = "STATION_BILL_SIGN";
        remoteLoad(data, callback);
    };

    // 巡检签到
    u.xunjianSign = function(data, callback) {
        data.portType = "NEW_TASK_SIGN";
        remoteLoad(data, callback);
    };



    //
    //是否需要上站
    u.isNeedUpStation = function(data, callback) {
        data.portType = "BILL_STATION_STATUS";
        remoteLoad(data, callback);
    };

    //运营商确认
    u.isConfire = function(data, callback) {
        data.portType = "BILL_CON_CONFIRM";
        remoteLoad(data, callback);
    };

    //运营商确认
    u.isApprove = function(data, callback) {
        data.portType = "BILL_CON_APPROVE";
        remoteLoad(data, callback);
    };


    //区域经理支撑回复
    u.replyAreaMan = function(data, callback) {
        data.portType = "SET_BILL_SUPPORTREQUEST";
        remoteLoad(data, callback);
    };

    //技术专家支撑回复
    u.replyTechMan = function(data, callback) {
        data.portType = "SET_BILL_SUPPORTREFUSE";
        remoteLoad(data, callback);
    };

    //追加描述
    u.addDeal = function(data, callback) {
        data.portType = "SET_BILL_ADDRREMARK";
        remoteLoad(data, callback);
    };

    //转派
    u.transfers = function(data, callback) {
        data.portType = "SET_BILL_TRANSFORM";
        remoteLoad(data, callback);
    };
    //催单
    u.reminder = function(data, callback) {
        data.portType = "SET_BILL_REMINDER";
        remoteLoad(data, callback);
    };
    //故障定位
    u.supportDefine = function(data, callback) {
        data.portType = "SET_BILL_ROOM_DEFINE";
        remoteLoad(data, callback);
    };

    //搜索关键字
    u.getBaseStationSearch = function(userId, key, callback) {
        var data = {};
        //   data.userID = userId;
        data.portType = "GET_BASE_STATION_SEARCH";
        data.name = key;
        data.start = 1;
        data.limit = 20;
        remoteLoad(data, callback);
    };

    function trace (count) {
        var caller = arguments.callee.caller;
        var i = 0;
        count = count || 10;
        console.log("***----------------------------------------  ** " + (i + 1));
        while (caller && i < count) {
            console.log(caller.toString());
            caller = caller.caller;
            i++;
            console.log("***---------------------------------------- ** " + (i + 1));
        }
    }

    //用户注销提示
    u.userLoginOut = function(callback) {
        // alert("有人调用logout，准备打印堆栈");
        // trace(20);
        var data = {};
        data.portType = "USER_LOGOUT";
        data.description = "用户-注销账号";
        //  data.userID = userId;
        remoteLoad(data, function(){
            $api.rmStorage("Authorization")
            callback.apply(this,arguments);
        });
    };

    /**
     *获取巡检项目的详情
     */
    u.getProjectDetail = function(opts, callback) {
        //	NEW_TASK_PROJECT_DETAIL
        opts.portType = "NEW_TASK_MODULAR_DETAIL";
        remoteLoad(opts, callback);
    }

    //获取隐患内容
    u.getHiddenContentList = function(queryOpts, callback) {
        queryOpts.portType = "NEW_TASK_HIDDEN_LIST";
        remoteLoad(queryOpts, callback);
    };

    //获取隐患内容
    u.getResCheckList = function(queryOpts, callback) {
        queryOpts.portType = "NEW_TASK_EXAMINE_RESOURCE_NUMBER";
        remoteLoad(queryOpts, callback);
    };

    //開啓現場檢查
    u.startCheck = function(queryOpts, callback) {
        queryOpts.portType = "CHECK_PROJECT_START";
        remoteLoad(queryOpts, callback);
    };

    //现场检查签到
    u.checkSign = function(queryOpts, callback) {
        queryOpts.portType = "CHECK_SIGN_FUN";
        remoteLoad(queryOpts, callback);
    };



    //获取检查图片
    u.getCheckImgList = function(data, callback) {
        data.portType = "CHECK_RESULT_IMAGE_LIST";
        remoteLoad(data, callback);
    };


    //获取公告列表
    u.getBulleList = function(queryOpts, callback) {
        queryOpts.portType = "GET_BULLE_LIST";

        remoteLoad(queryOpts, callback);
    };

    /**
     *巡检 - 获取待办工单列表
     * @param {Object} opts
     * @param {Object} callback
     */
    u.getWaitTaskList = function(opts, callback) {
        opts.portType = "TaskDownload";
        remoteLoad(opts, callback);
    };
    /**
     *巡检监控箱
     */
    u.getXunJianMonitorList = function(opts, callback) {
        opts.portType = 'GET_XUNJIAN_PLAN_MONITOR_LIST';
        remoteLoad(opts, callback);
    };

    /**
     *巡检监控箱(新)
     */
    u.getXunJianMonitorNewList = function(opts, callback) {
        opts.portType = 'NEW_TASK_PLAN_LIST';
        remoteLoad(opts, callback);
    };

    /**
     *巡检 - 巡检已办巡检任务列表
     */
    u.getFinishTaskList = function(opts, callback) {
        opts.portType = "XUNJIAN_FINISH_TASK";
        remoteLoad(opts, callback);
    }

    /**
     *巡检 - 巡检已办巡检任务列表(新)
     */
    u.getFinishNewTaskList = function(opts, callback) {
            opts.portType = "NEW_XUNJIAN_FINISH_TASK";
            appendPosParam(opts);
            remoteLoad(opts, callback);
        }
        /**
         *巡检- 巡检项目列表
         * @param {Object} opts
         * @param {Object} callback
         */
    u.getXunjianProjectList = function(opts, callback) {
            opts.portType = "XUNJIAN_PROJECT_LIST";
            remoteLoad(opts, callback);
        }
        /**
         *现场检查项目列表
         * @param {Object} opts
         * @param {Object} callback
         */
    u.getCheckProjectList = function(opts, callback) {
        opts.portType = "CHECK_ITEM_LIST";
        remoteLoad(opts, callback);
    }

    /**
     *巡检- 巡检项目列表(新)
     * @param {Object} opts
     * @param {Object} callback
     */
    u.getProjectNewList = function(opts, callback) {
            //	NEW_TASK_PROJECT_LIST
            opts.portType = "NEW_TASK_MODULAR_LIST";
            remoteLoad(opts, callback);
        }
        /**
         *巡检监控- 巡检任务列表
         * @param {Object} opts
         * @param {Object} callback
         */
    u.getXunjianMonitirTaskList = function(opts, callback) {
            opts.portType = "GET_XUNJIAN_MONITOR_LIST";
            remoteLoad(opts, callback);
        }
        /**
         *巡检监控- 巡检任务列表(新)
         * @param {Object} opts
         * @param {Object} callback
         */
    u.getMonitirTaskNewList = function(opts, callback) {
            opts.portType = "NEW_TASK_MONITOR_LIST";
            remoteLoad(opts, callback);
        }
        /**
         *记录开始巡检的时间
         * @param {Object} opts
         * @param {Object} callback
         */
    u.startXunjianTask = function(opts, callback) {
        if (opts.type == 'XUNJIAN_TASK') {
            opts.portType = "XUNJIAN_TRACK_RECORD";
        } else if (opts.type == 'NEW_XUNJIAN_TASK') {
            opts.portType = "NEW_TASK_TRACK_RECORD";
        }else {
          opts.portType = "NEW_TASK_TRACK_RECORD";
        }
        remoteLoad(opts, callback);
    }

    /**
     *记录开始巡检的时间(新)
     * @param {Object} opts
     * @param {Object} callback
     */
    u.startXunjianTaskNew = function(opts, callback) {
            opts.portType = "NEW_TASK_TRACK_RECORD";
            remoteLoad(opts, callback);
        }
        /**
         *结束巡检任务
         * @param {Object} opts
         * @param {Object} callback
         */
    u.stopXunjianTask = function(opts, callback) {
            if (opts.type == 'XUNJIAN_TASK') {
                opts.portType = "XUNJIAN_REFRESH";
            } else if (opts.type == 'NEW_XUNJIAN_TASK') {
                opts.portType = "NEW_TASK_REFRESH";
            }else {
              opts.portType = "NEW_TASK_REFRESH";
            }
            remoteLoad(opts, callback);
        }
        /**
         *巡检 - 获取待办巡检任务列表（已开始）
         */
    u.getProcessingTaskList = function(opts, callback) {
        opts.portType = "TASK_PROCESSING_LIST";
        opts.start_status = 'Y';
        remoteLoad(opts, callback);
    };

    /**
     *巡检 - 获取待办巡检任务列表（已开始）新
     */
    u.getUnfinishTaskList = function(opts, callback) {
        opts.portType = "NEW_TASK_PROCESSING_LIST";
        opts.start_status = 'Y';
        appendPosParam(opts);
        remoteLoad(opts, callback);
    };

    /**
     *巡检 - 获取待办巡检任务列表（未开始）
     */
    u.getUnstartTaskList = function(opts, callback) {
        opts.portType = "TASK_UNSTART_LIST";
        opts.start_status = 'N';
        remoteLoad(opts, callback);
    };

    /**
     *现场检查（未开始）
     */
    u.getCheckUnstartList = function(opts, callback) {
        opts.portType = "CHECK_UNSTART_LIST";
        remoteLoad(opts, callback);
    };

    /**
     *现场检查（未开始签到zhangning）
     */
    u.checkSignSubmit = function(opts, callback) {
        opts.portType = "CHECK_SIGNIN_SUBMIT";
        remoteLoad(opts, callback);
    };
    /**
     *调度工单（已领取签到）
     */
    u.zndwTaskdrawSignInSubmit = function(opts, callback) {
        opts.portType = "ZNDW_TASKDRAW_SIGN_IN";
        remoteLoad(opts, callback);
    };

    /**
     *现场检查确认已完成
     */
    u.confirmResult = function(opts, callback) {
        opts.portType = "CHECK_RESULT_CONFRIM";
        remoteLoad(opts, callback);
    };

    /**
     *现场检查（进行中）
     */
    u.getCheckUnfinishList = function(opts, callback) {
        opts.portType = "CHECK_PROCESS_LIST";
        remoteLoad(opts, callback);
    };

    /**
     *现场检查（已完成）
     */
    u.getCheckfinishList = function(opts, callback) {
        opts.portType = "CHECK_FINISH_LIST";
        remoteLoad(opts, callback);
    };

    /**
     *巡检 - 获取待办巡检任务列表（未开始）新
     */
    u.getUnstartNewTaskList = function(opts, callback) {
        opts.portType = "NEW_TASK_UNSTART_LIST";
        opts.start_status = 'N';
        appendPosParam(opts);
        remoteLoad(opts, callback);
    };
    /**
     *保存巡检项目的结果
     * @param {Object} opts
     * @param {Object} callback
     */
    u.saveXunjinProjectResult = function(opts, callback) {
        var type = $api.getStorage('modelType');
        if ("XUNJIAN_TASK" == type) {
            opts.portType = "XUNJIAN_PROJECT_SAVE";
        } else if ("NEW_XUNJIAN_TASK" == type) {
            opts.portType = "NEW_TASK_PROJECT_SAVE";
        }
        remoteLoad(opts, callback);
    }


    /**
     *提交资源信息接口
     * @param {Object} opts
     * @param {Object} callback
     */
    u.saveProjectList = function(opts, callback) {
        opts.portType = "NEW_TASK_PROJECT_SAVE_LIST";
        remoteLoad(opts, callback);
    }

    /**
     *日常维修问题核实接口
     * @param {Object} opts
     * @param {Object} callback
     */
    u.saveRepairProblem = function(opts, callback) {
        opts.portType = "FIX_BILL_QUEST_CONFIRM";
        remoteLoad(opts, callback);
    }

    /**
     *提交资源信息接口
     * @param {Object} opts
     * @param {Object} callback
     */
    u.saveResResult = function(opts, callback) {
        opts.portType = "NEW_TASK_EXAMINE";
        remoteLoad(opts, callback);
    }

    /**
     *保存現場檢查的结果
     * @param {Object} opts
     * @param {Object} callback
     */
    u.saveCheckProjectResult = function(opts, callback) {
            opts.portType = "CHECK_RESULT_SAVE_DETAIL";
            remoteLoad(opts, callback);
        }
        /**
         *上传巡检项目的图片到服务器上进行保存
         * @param {Object} opts
         * @param {Object} callback
         */
    u.uploadProjectImage = function(opts, file, callback) {
        var type = opts.modeltype;
        var data = {};
        for (var i in opts) {
            data[i] = opts[i];
        }
        console.log("什么类型：" + type);

        if ("XUNJIAN_TASK" == type) {
            data.portType = "XUNJIAN_PROJECT_IMAGE_UPLOAD";
        } else {
            data.portType = "NEW_TASK_PROJECT_IMAGE_UPLOAD";//这个
        }
        if (data.projectid) {
            data.id = data.projectid;
            delete data.projectid;
        }
        if (data.savedate) {
            data.phototime = data.savedate
            delete data.savedate;
        }
        var files = {
            file: file
        };
        // showlog(file);
        remoteInspectLoad(data, files, 'xunjian',callback);
    }

    /**
     *上传日常维修项目的图片到服务器上进行保存
     * @param {Object} opts
     * @param {Object} callback
     */
    u.uploadRepairImage = function(opts, file, callback) {
        var data = {};
        for (var i in opts) {
            data[i] = opts[i];
        }
        data.portType = "FIX_BILL_IMAGE_UPLOAD";

        if (data.detailid) {
            data.id = data.detailid;
            delete data.detailid;
        }
        if (data.savedate) {
            data.phototime = data.savedate
            delete data.savedate;
        }
        var files = {
            file: file
        };
        // showlog(file);
        remoteInspectLoad(data, files,'check', callback);
    }

    /**
     *上传日常维修项目的方案定制图片到服务器上进行保存
     * @param {Object} opts
     * @param {Object} callback
     */
     u.uploadRepairPlanImage = function(opts, file, callback) {
        var data = {};
        for (var i in opts) {
            data[i] = opts[i];
        }
        data.portType = "FIX_BILL_PLAN_IMAGE_UPLOAD";

        if (data.detailid) {
            data.id = data.detailid;
            delete data.detailid;
        }
        if (data.savedate) {
            data.phototime = data.savedate
            delete data.savedate;
        }
        var files = {
            file: file
        };
        // showlog(file);
        remoteInspectLoad(data, files,'check', callback);
    }

    /**
     *上传现场检查项目的图片到服务器上进行保存
     * @param {Object} opts
     * @param {Object} callback
     */
    u.uploadCheckImage = function(opts, file, callback) {
        var data = {};
        for (var i in opts) {
            data[i] = opts[i];
        }
        data.portType = "CHECK_PROJECT_IMAGE_UPLOAD";

        if (data.detailid) {
            data.id = data.detailid;
            delete data.detailid;
        }
        if (data.savedate) {
            data.phototime = data.savedate
            delete data.savedate;
        }
        var files = {
            file: file
        };
        // showlog(file);
        remoteInspectLoad(data, files, 'check',callback);
    }

    /**
     *上传資源核准图片到服务器上进行保存
     * @param {Object} opts
     * @param {Object} callback
     */
    u.uploadResCheckImage = function(opts, file, callback) {
        var data = {};
        for (var i in opts) {
            data[i] = opts[i];
        }
        data.portType = "NEW_TASK_EXAMINE_IMAGE_UPLOAD";

        if (data.detailid) {
            data.id = data.detailid;
            delete data.detailid;
        }
        if (data.savedate) {
            data.phototime = data.savedate
            delete data.savedate;
        }
        var files = {
            file: file
        };
        // showlog(file);
        remoteInspectLoad(data, files, 'check',callback);
    }

    /**
     *上传上站单的图片到服务器上进行保存
     * @param {Object} opts
     * @param {Object} callback
     */
    u.uploadStandBillImage = function(opts, file, callback) {
        var data = {};
        for (var i in opts) {
            data[i] = opts[i];
        }
        delete data.stationname;
        delete data.id;

        data.portType = "STATION_BILL_ATTACH_UPLOAD";

        if (data.savedate) {
            data.phototime = data.savedate
            delete data.savedate;
        }
        var files = {
            file: file
        };
        // showlog(file);
        remoteInspectLoad(data, files,'station', callback);
    }

    /**
     *上传新出入站单的图片到服务器上进行保存
     * @param {Object} opts
     * @param {Object} callback
     */
    u.uploadNewStationImage = function(opts, callback) {
        var data = {};
        for (var i in opts) {
            data[i] = opts[i];
        }
        data.portType = "NEW_STATION_ATTACH_UPLOAD";

        // showlog(file);
        remoteInspectLoad(data, files,'newstation', callback);
    }


    /**
     *上传面部照片
     * @param {Object} opts
     * @param {Object} callback
     */
     u.uploadFaceImage = function(opts, file, callback) {
        var data = {};
        for (var i in opts) {
            data[i] = opts[i];
        }
        data.portType = "STATION_BILL_CHECK_FACE";
        var files = {
            file: file
        };
        remoteInspectLoadFaceImage(data, files, callback);
    }
    //文件上传
  function remoteInspectLoadFaceImage(value, files, callback) {

    var user = $api.getStorage('user');
    value.userid = user.userid;

    var data = {};
    data.values = value;
    data.files = files;
    var curServer = $api.getStorage("curServer");
    var curServerUrl = null;
    if (curServer == 'formal') {
        curServerUrl = sysConfig.serverUploadUrl;
    } else {
        curServerUrl = sysConfig.serverUploadUrl_test;
    }
    var equiptoken=$api.getStorage('equiptoken');
    console.log("equiptoken:"+equiptoken)
    //===垂直越权修改===
    //curServerUrl += '?porttype=&userid=' + user.userid + '&equiptoken=' + equiptoken+ '&c=' + (api.systemType == 'ios' ? 1 : 0) + '&v=' + api.appVersion;
    curServerUrl += '?porttype=&userid=' + user.userid + '&c=' + (api.systemType == 'ios' ? 1 : 0) + '&v=' + api.appVersion;
    console.log("======================上传开始===================")
    console.log(curServerUrl);
    api.ajax({
        url: curServerUrl,
        method: 'post',
        timeout: 60,
        dataType: 'json',
        headers:{
            "equiptoken":$api.getStorage('equiptoken')
        },
        returnAll: false,
        data: data
    }, function(ret, err) {
        console.log("======================上传返回===================")
        console.log(JSON.stringify(ret));
        if (callback != null) {
            if (ret) {
                if (ret.status == "OK") {
                    ret.success = true;
                } else {
                    ret.success = false;
                }
            }
            callback(ret, err);
        } else {}

    });
}

    /**
     *上传故障工单的图片到服务器上进行保存
     * @param {Object} opts
     * @param {Object} callback
     */
    u.uploadBillImage = function(opts, file, callback) {
            var data = {};
            for (var i in opts) {
                data[i] = opts[i];
            }
            delete data.stationname;
            delete data.id;

            data.portType = "BILL_REVERT_ATTACH_UPLOAD";

            if (data.savedate) {
                data.phototime = data.savedate
                delete data.savedate;
            }
            var files = {
                file: file
            };
            // showlog(file);
            remoteInspectLoad(data, files,'bill', callback);
        }

            /**
     *上传故障工单派发的图片到服务器上进行保存
     * @param {Object} opts
     * @param {Object} callback
     */
    u.uploadCreateBillImage = function(opts, file, callback) {
            var data = {};
            for (var i in opts) {
                data[i] = opts[i];
            }
            delete data.stationname;
            delete data.id;

            data.portType = "BILL_CREATE_ATTACH_UPLOAD";

            if (data.savedate) {
                data.phototime = data.savedate
                delete data.savedate;
            }
            var files = {
                file: file
            };
            // showlog(file);
            remoteInspectLoad(data, files,'bill', callback);
        }


    /**
     *上传隐患录入的图片到服务器上进行保存
     * @param {Object} opts
     * @param {Object} callback
     */
    u.uploadHiddenImage = function(opts, file, callback) {
            var data = {};
            for (var i in opts) {
                data[i] = opts[i];
            }
            delete data.stationname;
            delete data.id;

            data.portType = "HIDDEN_DANGERT_UPLOAD";
            if (data.savedate) {
                data.phototime = data.savedate
                delete data.savedate;
            }
            var files = {
                file: file
            };
            // showlog(file);
            remoteInspectLoad(data, files,'hidden', callback);
        }
        /**
         *根据站址名搜索站址信息
         * @param {Object} opts
         * @param {Object} callback
         */
    u.searchBaseStation = function(opts, callback) {
        opts.portType = "GET_BASE_STATION_SEARCH";
        remoteLoad(opts, callback);
    };



    //首页或qufsu数据
    u.getOutStandTime = function(data, callback) {
        data.portType = "INDEX_ALARM_LIST";
        remoteLoad(data, callback);
    };

    /**
     *获取回单告警回单原因细分
     * @param {Object} opts
     * @param {Object} callback
     */
    u.getRevertCauseDetail = function(opts, callback) {
        opts.portType = "BIGDATA_REASON_LIST";
        remoteLoad(opts, callback);
    };

    /**
     *扫描获取信息
     * @param {Object} opts
     * @param {Object} callback
     */
    u.getScanInfo = function(opts, callback) {
        opts.portType = "GET_QRMESSAGE_DETAIL";
        remoteLoad(opts, callback);
    };

    /**
     *获取日常維修設備列表
     * @param {Object} opts
     * @param {Object} callback
     */
    u.getRepairDeviceList = function(opts, callback) {
        opts.portType = "FIX_DEVICE_LIST";
        remoteLoad(opts, callback);
    };

    /**
     *获取回单告警回单具体措施
     * @param {Object} opts
     * @param {Object} callback
     */
    u.getRevertDeailWay = function(opts, callback) {
        opts.portType = "BIGDATA_DEAL_LIST";
        remoteLoad(opts, callback);
    };

    /**
     * 获取简单站址列表
     *
     * opts{
     * limit:'', start:'', provinceId:'', cityId:'', areaId:'', stationName:'', stationCode:'', status:''
     * }
     */
    u.getStationSimpleList = function(opts, callback) {
            opts.portType = "GET_BASE_STATION_SIMPLE_LIST";
            appendPosParam(opts);
            // api.hideProgress()
            remoteLoad(opts, callback);
        }
        /**
         * 获取门禁的站址和设备列表
         */
    u.getStationDoorDeviceList = function(opts, callback) {
            opts.portType = "GET_STATION_DOOR_DEVICE_LIST";
            remoteLoad(opts, callback);
        }
        /**
         *获取用户详情
         * @param {Object} opts
         * @param {Object} callback
         */
    u.getUserDetailInfo = function(opts, callback) {

        opts.portType = "USER_DETAIL_INFO";
        remoteLoad(opts, callback);
    };

/**
     *提交验证码
     */
    u.userValidate = function(opts, callback) {
        opts.portType = "USER_VALIDATE";
        remoteLoad(opts, callback);
    };

    /**
     *工单告警列表
     * tangsj 2015-11-24
     * @param {Object} opts
     * @param {Object} callback
     */
    u.getBillAlarmList = function(opts, callback) {
        opts.portType = "GET_BILL_ALARM_LIST";
        //  opts.description = "工单-告警列表";
        remoteLoad(opts, callback);
    };

    /**
     *获取站址列表
     * @param {Object} opts
     * @param {Object} callback
     */
    u.getBaseStationList = function(opts, callback) {
            opts.portType = "GET_BASE_STATION_LIST";
            remoteLoad(opts, callback);
        }
        /**
         * 获取工单的fsu信息
         * @param {Object} opts
         * @param {Object} callback
         */
    u.getBillFsuInfo = function(opts, callback) {
        opts.portType = "GET_BILL_FSU_INFO";
        remoteLoad(opts, callback);
    }

    u.getMidRealMultData = function(opts, callback) {
            opts.portType = "GET_MID_REAL_MULT_DATA";
            remoteLoad(opts, callback);
        }
        /**
         *修改密码
         * @param {Object} opts
         * @param {Object} callback
         */
    u.modifyPassword = function(opts, callback) {
            opts.portType = "USER_CHANGE_PASSWORD";
            //description = "用户-修改密码";
            remoteLoad(opts, callback);
        }
        /*
         * 故障单签到
         * @param {Object} opts
         * opts{
         *  billsn
         *  billId
         *  taskId
         *  signlon
         *  signlat
         * }
         */
    u.setBillSign = function(opts, callback) {
            opts.portType = "SET_BILL_SIGN";
            remoteLoad(opts, callback);
        }
        /*
         * 获得服务器列表地址
         */
    u.getHostList = function(callback) {
            remoteHostList(callback)
        }
        /*
         * 获取区域经理列表
         */
    u.getAreaManagers = function(opts, callback) {
            opts.portType = "GET_AREA_MANAGER_LIST";
            remoteLoad(opts, callback);
        }
        /*
         * 获取区域经理助理列表
         */
    u.getAreaManagersNext = function(opts, callback) {
            opts.portType = "GET_ASSIST_LIST";
            remoteLoad(opts, callback);
        }
        /*
         * 获取技术专家列表
         */
    u.getTechPeople = function(opts, callback) {
            opts.portType = "GET_TECH_LIST";
            remoteLoad(opts, callback);
        }
        /*
         * 协调上站
         */
    u.getCoordateUpstation = function(opts, callback) {
        opts.portType = "STATION_BILL_COORDINATE";
        remoteLoad(opts, callback);
    }

    /**
    * 上站核实工单接口
    *  zhangning
    */
    u.getstandCheckList = function(opts, callback) {
        opts.portType = "STATION_CHECK_WORKORDER";
        remoteLoad(opts, callback);
    }
    /**
    * 查询上站核实工单详情
    *  zhangning
    */
    u.getStandCheckListDetail = function(opts, callback) {
        opts.portType = "STATION_CHECKLIST_WORKORDER";
        remoteLoad(opts, callback);
    }
    /**
    * 上站核实接单接口
    *  zhangning
    */
    u.acceptConfirm = function(opts,callback){
      opts.portType = "STATION_CHECKACCEPT_WORKORDER";
      remoteLoad(opts, callback);
    }
    /**
    * 上站选择否时接口
    *  zhangning
    */
    u.noUpStation = function(opts,callback){

      console.log("===========u.noUpStation=============")
      if(opts.isneedonStation=="1"){//是否上站=是
        console.log("===========是否上站 ---> 是=============")
        opts.portType = "STATION_UPSTATION_WORKORDER";
        remoteLoad(opts, callback);
      }else{//是否上站=否
        console.log("===========是否上站 ---> 否=============")
        console.log("===========noUpStation开始=============")
        console.log(JSON.stringify(opts));
        hasAiEvent(opts.wosn,function(ret,err){//消除AI事件
            console.log("===========noUpStation完成=============")
            console.log(JSON.stringify(ret))
            if(ret.success){   
                opts.portType = "STATION_UPSTATION_WORKORDER";
                remoteLoad(opts, callback);
            }else{  
                ret.errorMsg=ret.data;
                callback(ret,err);
            }     
        });
      }

    }


    u.toClearAiEvent = function(opts,callback){

        console.log("===========u.noUpStation=============")
        if(opts.isneedonStation=="1"){//是否上站=是
            console.log("===========是否上站 ---> 是=============")
            opts.portType = "STATION_UPSTATION_WORKORDER";
            remoteLoad(opts, callback);
        }else{//是否上站=否
            console.log("===========是否上站 ---> 否=============")
            console.log("===========noUpStation开始=============")
            console.log(JSON.stringify(opts))
            clearAiEvent(opts.wosn,function(ret,err){//消除AI事件
                console.log("===========noUpStation完成=============")
                console.log(JSON.stringify(ret))
                if(ret.success){
                    opts.portType = "STATION_UPSTATION_WORKORDER";
                    remoteLoad(opts, callback);
                }else{
                    ret.errorMsg=ret.data;
                    callback(ret,err);
                }
            });
        }

    }

    /**
    * 签到调用接口
    *  zhangning
    */
    u.checkStationSign = function(opts,callback){
      opts.portType = "STATION_UPSTATION_AFFIRM";
      remoteLoad(opts, callback);
    }

    /**
    * 反馈调用接口
    *  zhangning
    */
    u.contentFeedback = function(opts,callback){
      opts.portType = "STATION_FEEDBACK_CONTENT";
      remoteLoad(opts, callback);
    }

    /**
    * 回单调用接口
    *  zhangning
    */
    u.revertStand = function(data,callback){
      console.log("===========revertStand开始=============")
      console.log(JSON.stringify(data))
      clearAiEvent(data.wosn,function(ret,err){//消除AI事件
      console.log("===========revertStand完成=============")
          console.log(JSON.stringify(ret))
          if(ret.success){   
                data.portType = "STATION_REVERTSTATION_AFFIRM";
                remoteLoad(data, callback);
          }else{  
                ret.errorMsg=ret.data;
                callback(ret,err);
          }     
      });
    }

    /**
     *上传上站核实图片到服务器上进行保存
     * @param {Object} opts
     * @param {Object} callback   zhangning
     */
    u.uploadCheckListImage = function(opts, file, callback) {
            var data = {};
            for (var i in opts) {
                data[i] = opts[i];
            }
            delete data.stationname;
            delete data.id;

            data.portType = "CHECK_DANGERT_UPLOAD";

            if (data.savedate) {
                data.phototime = data.savedate
                delete data.savedate;
            }
            var files = {
                file: file
            };
            // showlog(file);
            remoteInspectLoad(data, files,'check', callback);
        }

    //出入站离站确认
    u.leaveStation = function(opts, callback) {
        opts.portType = "STATION_BILL_LEAVE_CONFIRM";
        remoteLoad(opts, callback);
    };

    /**
     *出入站远程开门 zhangning
     */
	  u.getStationOpenDoor = function(opts, callback) {
	      opts.portType = "STATION_BILL_OPENDOOR_CONFIRM";
	      remoteLoad(opts, callback);
	  };

    /*
     * 获取字典表的值
     */
    u.getDictList = function(opts, callback) {
        opts.portType = "GET_DICT_VALUE_FUN";
        remoteLoad(opts, callback);
    }

    /*
     * 现场检查提交集合数据
     */
    u.saveScencCheckList = function(opts, callback) {
        opts.portType = "CHECK_RESULT_SAVE_LIST";
        remoteLoad(opts, callback);
    }

    // 王晓星修改*****************************************************************************
    /**
	 *上传日常维修附件到服务器上进行保存
	 * @param {Object} opts
	 * @param {Object} callback
	 */
	u.uploadRepairAttach = function(opts, files, callback) {
		// wxx
		// alert(getObj(opts));
		// alert(getObj(file));
		// wxx
		var data = {};
		for (var i in opts) {
			data[i] = opts[i];
		}
		data.portType = "FIX_BILL_ATTACH_UPLOAD";

		if (data.detailid) {
			data.id = data.detailid;
			delete data.detailid;
		}
		if (data.savedate) {
			data.phototime = data.savedate
			delete data.savedate;
		}
		// showlog(file);
		remoteInspectLoadFile(data, files, callback);
	}

  //文件上传
  function remoteInspectLoadFile(value, files, callback) {

      var user = $api.getStorage('user');
      value.userid = user.userid;

      var data = {};
      data.values = value;
      data.files = files;
      //      value.porttype = value.portType ? value.portType : value.porttype;
      var curServer = $api.getStorage("curServer");
      console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
      console.log(getObj(data.files));
      console.log(getObj(data.values));
      console.log(curServer);
      var curServerUrl = null;
      if (curServer == 'formal') {
          curServerUrl = sysConfig.serverUploadUrl;
      } else {
          curServerUrl = sysConfig.serverUploadUrl_test;
      }
      var equiptoken=$api.getStorage('equiptoken');
      console.log("equiptoken:"+equiptoken)
      //===垂直越权修改===
      //curServerUrl += '?porttype=&userid=' + user.userid + '&equiptoken=' + equiptoken+ '&c=' + (api.systemType == 'ios' ? 1 : 0) + '&v=' + api.appVersion;
      curServerUrl += '?porttype=&userid=' + user.userid + '&c=' + (api.systemType == 'ios' ? 1 : 0) + '&v=' + api.appVersion;
      console.log(curServerUrl);

      api.ajax({
          url: curServerUrl,
          method: 'post',
          timeout: 60,
          dataType: 'json',
          headers:{
              "equiptoken":$api.getStorage('equiptoken')
          },
          returnAll: false,
          data: data
      }, function(ret, err) {
          if (callback != null) {

              //               var strs = $api.jsonToStr(ret);
              //              alert(strs);

              if (ret) {

                  if (ret.status == "OK") {
                      ret.success = true;
                  } else {
                      ret.success = false;
                  }
              }
              callback(ret, err);
          } else {}

      });
  }
  /**
   * 开门记录
   */
  u.getWxx = function(opts, callback) {
    opts.portType = "ACCESS_TO_THE_DOOR";
    remoteLoad(opts, callback);
  }
  //合同维修人
	u.getRepairPerson = function(opts, callback) {
		opts.portType = "FIX_REPAIRMAN_LIST";
		remoteLoad(opts, callback);
	};

    //整治类型专业评估明细
	u.getRegulationTypeDetail = function(opts, callback) {
		opts.portType = "FIX_REGULATION_TYPE_DETAIL";
		remoteLoad(opts, callback);
	};

	//合同单价项目列表
	u.getRepairItemList = function(opts, callback) {
		opts.portType = "FIX_ITEM_LIST";
		remoteLoad(opts, callback);
	};

  /**
	 * 同步数据库到本地接口
	 */
	 u.synchronization=function(opts, callback) {
		 opts.portType = "SYNCINSPECTIONTASK";
		 remoteLoad(opts, callback);
	 }
   /**
 	 * 同步本地到服务接口
 	 */
 	 u.synchronizationService=function(opts, callback) {
 		 opts.portType = "SYNCHRONIZATIONSERVICE";
 		 remoteLoad(opts, callback);
 	 }

   /**
 	 * 同步本地到服务接口
 	 */
 	 u.wxxxxx=function(opts, callback) {
 		 opts.portType = "EMERGENCY_IMPORTANTASK_LIST";
 		 remoteLoad(opts, callback);
 	 }
   /**
    * 代维调度模板查询接口   zhangning
    */
   u.accessOrderTemplate = function(opts,callback){
       opts.portType = "ZNDW_SEND_ORDERS";
       remoteLoad(opts, callback);
   }
   /**
    * 代维调度派单接口   zhangning
    */
   u.creatZndwSendOrders = function(opts,callback){
       opts.portType = "ZNDW_CREATSEND_ORDERS";
       remoteLoad(opts, callback);
   }
   /**
    * 代维调度根据业务分类查询对应的工单类型   zhangning
    */
   u.findBusinessType = function(opts,callback){
       opts.portType = "ZNDW_TASK_TYPE_NAME";
       remoteLoad(opts, callback);
   }

   /**
 	 * 代维调度获取进行中任务列表
 	 */
 	 u.getGenerationList=function(opts, callback) {
 		 opts.portType = "ZNDW_TASK_LIST";
 		 appendPosParam(opts);
 		 remoteLoad(opts, callback);
 	 }
   /**
    * 代维调度已领取接口列表  zhangning
    */
    u.getDrawGenerationList=function(opts, callback) {
      opts.portType = "ZNDW_TASKDRAW_LIST";
      appendPosParam(opts);
      remoteLoad(opts, callback);
    }
    /**
     * 代维调度处理流程接口  zhangning
     */
     u.zndwFeedBackProcess=function(opts, callback) {
       opts.portType = "ZNDW_FEEDBACK_PROCESS";
       remoteLoad(opts, callback);
     }
     /**
     *调度提交反馈内容调用接口
     *  zhangning
     */
     u.zndwInfoSubmit = function(opts,callback){
       opts.portType = "ZNDW_INFOSUBMIT";
       remoteLoad(opts, callback);
     }

     /**
     *调度回单提醒查询对应的数据
     *  zhangning
     */
     u.zndwReceiptRemind = function(opts,callback){
       opts.portType = "ZNDW_RECEIPT_LIST";
       remoteLoad(opts, callback);
     }

     /**
     *6类工单提醒查询对应的数据
     *  zhangning
     */
     u.sixBillRemind = function(opts,callback){
       opts.portType = "UNFINISHED_WORK_ORDE_FUN";
       remoteLoad(opts, callback);
     }

   /**
 	 * 代维调度获取已归档任务列表
 	 */
 	 u.getGenerationListFinished=function(opts, callback) {
 		 opts.portType = "ZNDW_TASK_LIST_FILE";
 		 remoteLoad(opts, callback);
 	 }
   /**
 	 * 代维调度获取已完成任务列表
 	 */
   u.getGenerationFinshList=function(opts, callback) {
 		 opts.portType = "ZNDW_TASK_GET_FINSH";
 		 appendPosParam(opts);
 		 remoteLoad(opts, callback);
 	 }
   /**
 	 *  领取代维调度任务
 	 */
   u.getGeneration=function(opts, callback) {
 		 opts.portType = "ZNDW_TASK_GET";
 		 remoteLoad(opts, callback);
 	 }
   /**
 	 * 代维调度获取需填写字段
 	 */
   u.getWriteGeneration=function(opts, callback) {
 		 opts.portType = "ZNDW_TASK_FILL_COL";
 		 remoteLoad(opts, callback);
 	 }
   /**
 	 * 代维调度回单
 	 */
   u.referWriteGeneration=function(opts, callback) {
 		 opts.portType = "ZNDW_TASK_FILL_ORDER_INSERT";
 		 remoteLoad(opts, callback);
 	 }
   /**
 	 * 询问告警是否解除
 	 */
   u.askCancelAlarm=function(opts, callback){
     opts.portType = "ASK_CANCEL_ALARM";
     remoteLoad(opts, callback);
   }
   /**
 	 * 根据main表id获取关联告警
 	 */
     u.getAlarmByMainId=function(opts, callback){
        opts.portType = "GET_ALARM_BY_MAINID";
        remoteLoad(opts, callback);
      }
   /**
 	 * 获取代维调度回单填写字段
 	 */
   u.getGenerationFinshDetail=function(opts, callback) {
 		 opts.portType = "ZNDW_TASK_GET_FINSH_DETAILS";
 		 remoteLoad(opts, callback);
 	 }

   /**
 	 * 获取代维调度回单图片上传
 	 */
   u.uploadGetGenerationImage=function(opts, file, callback) {
     var data = {};
     for (var i in opts) {
         data[i] = opts[i];
     }

     data.portType = "ZNDW_ATTACH_UPLOAD";

     if (data.savedate) {
         data.phototime = data.savedate
         delete data.savedate;
     }
     var files = {
         file: file
     };
     // showlog(file);
     remoteInspectLoad(data, files,'zndw', callback);
 	 }
   /**
 	 * 获取代维调度站址模式
 	 */
   u.getGenerationNum=function(opts, callback) {
 		 opts.portType = "ZNDW_SITENAME_LIST";
 		 remoteLoad(opts, callback);
 	 }
   /**
 	 * 获取代维调度站址模式下分类
 	 */
   u.getGenerationSite=function(opts, callback) {
 		 opts.portType = "ZNDW_TASK_LIST_SITE";
 		 remoteLoad(opts, callback);
 	 }
   /**
  * 获取代维调度回单填写字段
  */
  u.getGenerationTools=function(opts, callback) {
    opts.portType = "ZNDW_TASK_GET_TOOLS";
    remoteLoad(opts, callback);
  }

   /**
 	 * 代维调度问题确认环节
 	 */
   u.getGenerationConfirm=function(opts, callback) {
 		 opts.portType = "ZNDW_TASK_CONFIRM";
 		 remoteLoad(opts, callback);
 	 }
   /**
    * 代维调度资源核查跳转微信小程序环节 zhangning
    */
   	u.resourcesForVerification = function(data,callback){
   		data.portType = "ZNDW_OBTAINURL";
   		remoteLoad(data,callback);
   	}

     /**
 	 * 日常维修-更新改造 审核环节(新接口)
 	 */
   u.repairRemouldAuditPlan=function(opts, callback) {
    opts.portType = "FIX_BILL_FOMULATE_REMOULD_CHECK";
    remoteLoad(opts, callback);
}
   /**
 	 * 日常维修方案审核环节
 	 */
   u.repairAuditPlan=function(opts, callback) {
 		 opts.portType = "FIX_BILL_FOMULATE_CHECK";
 		 remoteLoad(opts, callback);
 	 }

   /**
    * 设置极光推送消息提醒
    */
   u.setMessageFun=function(opts, callback) {
      opts.portType = "SET_MESSAGE_FUN";
      remoteLoad(opts, callback);
    }
    /**
     * 获取极光推送消息提醒设置
     */
    u.getMessageFun=function(opts, callback) {
       opts.portType = "GET_MESSAGE_FUN";
       remoteLoad(opts, callback);
     }

  //  var emergencyHttp='http://101.227.247.207:8989'; //测试环境
   var emergencyHttp='http://180.153.49.95:58080';//正式环境
   /**
 	 * 应急物资列表
 	 */
   u.getEmergencyList=function(opts, callback) {
     serverUrl = emergencyHttp+'/em/common/entity/get?prefix=materialInfo&order=createTime&authority=areaPath=userAreaPath&authorityShowOnly=true&userName='+opts.userName;
     api.ajax({
         url: serverUrl,
         method: 'get',
         timeout: 30,
         dataType: 'json',
         data: {
             values: opts
         }
     }, function(ret, err) {
       callback(ret, err);
     })
 	 }

   /**
    * 应急物资添加
    */
   u.addEmergency=function(opts, callback) {
     serverUrl = emergencyHttp+'/em/materialInfo/save';
     api.ajax({
         url: serverUrl,
         method: 'post',
         timeout: 30,
         dataType: 'json',
         data: {
             values: opts
         }
     }, function(ret, err) {
       callback(ret, err);
     })
    }
    /**
     * 应急物资获取物资编号
     */
    u.getEmergencyNum=function(opts, callback) {
      serverUrl = emergencyHttp+'/em/materialInfo/getSn';
      api.ajax({
          url: serverUrl,
          method: 'get',
          timeout: 30,
          dataType: 'json',
          data: {
              values: opts
          }
      }, function(ret, err) {
        callback(ret, err);
      })
     }
     /**
      * 应急物资图片上传
      */
     u.uploadEmergencyImage = function(opts, file, callback) {
         var data = {};
         for (var i in opts) {
             data[i] = opts[i];
         }

         var files = {
             file: file
         };
         // showlog(file);
         remoteInspectLoadEmerg(data, files, callback);
     }

     //图片上传
     function remoteInspectLoadEmerg(value, files, callback) {
         var data = {};
         data.values= value;
         data.files = files;
         console.log(getObj(data));
         var curServerUrl =emergencyHttp+'/em/file/upload/store';
         api.ajax({
             url: curServerUrl,
             method: 'post',
             timeout: 0,
             dataType: 'json',
             returnAll: false,
             data: data,
             contentType : false
         }, function(ret, err) {
             if (callback != null) {
                 if (ret) {
                     if (ret.status == "OK") {
                         ret.success = true;
                     } else {
                         ret.success = false;
                     }
                 }
                 callback(ret, err);
             } else {}
         });
     }

     /**
      * 应急物资图片详情获取
      */
      u.getEmergencyImg=function(opts, callback) {
        serverUrl = emergencyHttp+'/em/file/load';
        api.ajax({
            url: serverUrl,
            method: 'post',
            timeout: 30,
            dataType: 'json',
            data: {
                values: opts
            }
        }, function(ret, err) {
          callback(ret, err);
        })
       }

       /**
        * 应急物资删除接口
        */
        u.removeEmergency=function(opts, callback) {
          serverUrl = emergencyHttp+'/em/common/entity/delete';
          api.ajax({
              url: serverUrl,
              method: 'post',
              timeout: 30,
              dataType: 'json',
              data: {
                  values: opts
              }
          }, function(ret, err) {
            callback(ret, err);
          })
         }

         /**
          * 应急物资权限接口
          */
          u.rightEmergency=function(opts, callback) {
            serverUrl = emergencyHttp+'/em/user/loadMenu';
            api.ajax({
                url: serverUrl,
                method: 'post',
                timeout: 30,
                dataType: 'json',
                data: {
                    values: opts
                }
            }, function(ret, err) {
              callback(ret, err);
            })
           }

           /**
            * 历史告警工单接口
            http://localhost:8085/itower/mobile/hisAlarm/getHis?provinceId=123&id=23&beginTime=
            */


            hisAlarmListUrl='http://172.16.175.203:8085'; //测试数据库服务器
            //hisAlarmListUrl='http://101.227.240.166:58090';
            u.hisAlarmList=function(opts, callback) {

              var host = $api.getStorage('host');   //在缓存里拿到ip地址和端口号
              console.log("这是获取的参数："+getObj(opts));  //opts为调用接口时传进来的参数
              //设置访问接口地址
              serverUrl = "http://"+host+'/itower/mobile/historyalarm/getHis?staCode='+opts.stationcode+"&provinceId="+opts.provinceid+"&beginTime="+opts.begintime+"&endTime="+opts.endtime+"&offset="+(opts.start-1)+"&limit="+opts.limit;
              console.log("------------dddd---------------"+serverUrl);
              api.ajax({
                  url: serverUrl,
                  method: 'get',
                  timeout: 500,
                  dataType: 'json'
              }, function(ret, err) {  //如果调用成功，返回ret，如果调用失败，返回
                console.log(getObj(ret));//ding
                console.log(JSON.stringify(ret));
                callback(ret, err);
              })
             }
           /**
         	 * 停发电工单获取
         	 */
           u.getElectricityList=function(opts, callback) {
         		 opts.portType = "ELECTRICITY_BILL_LIST";
                 appendPosParam(opts);
         		 remoteLoad(opts, callback);
         	 }
           /**
         	 * 各工单统一接口
         	 */
           u.getAllWorkList=function(opts, callback) {
         		 opts.portType = "UNIFIED_WORK_ORDE_FUN";
         		 remoteLoad(opts, callback);
         	 }
           /**
            * 各工单统一接口
            */
           u.getGenerationJF=function(opts, callback) {
              opts.portType = "ZNDW_STATISTICS";
              remoteLoad(opts, callback);
            }
            /**
             * 扫描油机二维码
             */
            u.setBillOil=function(opts, callback) {
               opts.portType = "SET_BILL_OIL";
               remoteLoad(opts, callback);
             }
             /**
              * 代维调度签到
              */
             u.upStationSignGeneration=function(opts, callback) {
                opts.portType = "ZNDW_SIGN";
                remoteLoad(opts, callback);
              }
              /**
               * 是否代维调度签到
               */
              u.upStationIsSignGeneration=function(opts, callback) {
                 opts.portType = "ZNDW_IS_SIGN";
                 remoteLoad(opts, callback);
               }

               /**
                * 巡检已办
                */
               u.getHistoryXunjian=function(opts, callback) {
                  opts.portType = "NEW_XUNJIAN_HISTORY_TASK";
                  remoteLoad(opts, callback);
                }
                 /**
                * 隐患上报历史
                */
               u.getHistoryHidden=function(opts, callback) {
                opts.portType = "FIX_HIDDEN_LIST";
                remoteLoad(opts, callback);
              }
                /**
                * 隐患上报现场图片历史
                */
              u.getHiddenImage=function(opts, callback) {
                opts.portType = "FIX_HIDDENIMAGE_LIST";
                remoteLoad(opts, callback);
              }
             /**
              * 扫描车辆二维码
              */
             u.setBillCar=function(opts, callback) {
               //设置访问接口地址
               serverUrl = "http://180.153.49.95:58080/em/materialInfo/orbitReport?code="+opts.code+"&lng="+opts.lon+"&lat="+opts.lat;
               console.log("------------dddd---------------"+serverUrl);
               api.ajax({
                   url: serverUrl,
                   method: 'get',
                   timeout: 500,
                   dataType: 'json'
               }, function(ret, err) {  //如果调用成功，返回ret，如果调用失败，返回
                 callback(ret, err);
               })
              }

              /**
               * 解密油机码
               */
              u.getBillOilm=function(opts, callback) {
                //设置访问接口地址
                serverUrl = "http://180.153.49.95:58080/em/materialInfo/decrypt?code="+opts.code;
                console.log("------------dddd---------------"+serverUrl);
                api.ajax({
                    url: serverUrl,
                    method: 'get',
                    timeout: 500,
                    dataType: 'json'
                }, function(ret, err) {  //如果调用成功，返回ret，如果调用失败，返回
                  callback(ret, err);
                })
               }

              //  var submissionHttp='http://192.168.111.128:8080';//郭洋环境
              // var submissionHttp='http://101.227.247.207:58080';//测试环境
                var submissionHttp='http://180.153.49.95:58080';//正式环境

               /**
                * 信息报送列表
                */
               u.getsubmissionList=function(opts, callback) {

                 //设置访问接口地址
                 serverUrl = submissionHttp+"/em/common/entity/get?order=createTime&authority=areaPath=userAreaPath&prefix=eventReport&authorityShowOnly=true&userName="+opts.userName+"&statusText="+opts.statusText;
                 api.ajax({
                     url: serverUrl,
                     method: 'get',
                     timeout: 500,
                     dataType: 'json',
                     data: {
                         values: opts
                     }
                 }, function(ret, err) {  //如果调用成功，返回ret，如果调用失败，返回
                   callback(ret, err);
                 })
                }

                /**
                 * 信息报送详情
                 */
                u.getsubmissionDetail=function(opts, callback) {
                  //设置访问接口地址
                  serverUrl = submissionHttp+"/em/eventReport/details";
                  api.ajax({
                      url: serverUrl,
                      method: 'post',
                      timeout: 500,
                      dataType: 'json',
                      data: {
                          values: {
                            id:opts.id
                          }
                      }
                  }, function(ret, err) {  //如果调用成功，返回ret，如果调用失败，返回
                    callback(ret, err);
                  })
                 }

                 /**
                  * 信息报送详情补充
                  */
                 u.getsubmissionDetailSupplement=function(opts, callback) {
                   //设置访问接口地址
                   serverUrl = submissionHttp+"/em/eventPageReport/pageReportDetails";
                   api.ajax({
                       url: serverUrl,
                       method: 'post',
                       timeout: 500,
                       dataType: 'json',
                       data: {
                           values: opts
                       }
                   }, function(ret, err) {  //如果调用成功，返回ret，如果调用失败，返回
                     callback(ret, err);
                   })
                  }

                  /**
                   * 信息报送详情补充
                   */
                  u.getsubmissionDetailStatistics=function(opts, callback) {
                    //设置访问接口地址
                    serverUrl = submissionHttp+"/em/eventReport/alarmEventAffectAuto";
                    api.ajax({
                        url: serverUrl,
                        method: 'post',
                        timeout: 500,
                        dataType: 'json',
                        data: {
                            values: opts
                        }
                    }, function(ret, err) {  //如果调用成功，返回ret，如果调用失败，返回
                      callback(ret, err);
                    })
                   }

                  /**
                   * 信息报送地市下拉
                   */
                  u.getCity=function(opts, callback) {
                    //设置访问接口地址
                    serverUrl = submissionHttp+"/em/org/city/by/"+opts.province;
                    api.ajax({
                        url: serverUrl,
                        method: 'get',
                        timeout: 500,
                        dataType: 'json'
                    }, function(ret, err) {  //如果调用成功，返回ret，如果调用失败，返回
                      callback(ret, err);
                    })
                   }

                   /**
                    * 信息报送区县下拉
                    */
                   u.getCounty=function(opts, callback) {
                     //设置访问接口地址
                     serverUrl = submissionHttp+"/em/org/countys/by/"+opts.city;
                     api.ajax({
                         url: serverUrl,
                         method: 'get',
                         timeout: 500,
                         dataType: 'json'
                     }, function(ret, err) {  //如果调用成功，返回ret，如果调用失败，返回
                       callback(ret, err);
                     })
                    }

                    /**
                     * 信息报送乡镇下拉
                     */
                    u.getvillages=function(opts, callback) {
                      //设置访问接口地址
                      serverUrl = submissionHttp+"/em/org/villages/by/"+opts.citys+"/"+opts.countys;
                      api.ajax({
                          url: serverUrl,
                          method: 'get',
                          timeout: 500,
                          dataType: 'json'
                      }, function(ret, err) {  //如果调用成功，返回ret，如果调用失败，返回
                        callback(ret, err);
                      })
                     }

                   /**
                    * SN获取接口
                    */
                   u.getSn=function(opts, callback) {
                     //设置访问接口地址
                     serverUrl = submissionHttp+"/em/eventReport/geteventsn";
                     api.ajax({
                         url: serverUrl,
                         method: 'post',
                         timeout: 500,
                         dataType: 'json',
                         data: {
                             values: opts
                         }
                     }, function(ret, err) {  //如果调用成功，返回ret，如果调用失败，返回
                       callback(ret, err);
                     })
                    }

                 /**
                  * 信息报送添加
                  */
                 u.addSubmission=function(opts, callback) {
                   //设置访问接口地址
                   serverUrl = submissionHttp+"/em/app/interface/eventReport/save";
                   api.ajax({
                       url: serverUrl,
                       method: 'post',
                       timeout: 500,
                       dataType: 'json',
                       data: {
                           values: opts
                       }
                   }, function(ret, err) {  //如果调用成功，返回ret，如果调用失败，返回
                     callback(ret, err);
                   })
                  }

                  /**
                   * 信息报送审核
                   */
                  u.examineSubmission=function(opts, callback) {
                    //设置访问接口地址
                    serverUrl = submissionHttp+"/em/app/interface/eventReport/audit";
                    api.ajax({
                        url: serverUrl,
                        method: 'post',
                        timeout: 500,
                        dataType: 'json',
                        data: {
                            values: opts
                        }
                    }, function(ret, err) {  //如果调用成功，返回ret，如果调用失败，返回
                      callback(ret, err);
                    })
                   }

                   /**
                    * 信息报送退回
                    */
                   u.returnSubmission=function(opts, callback) {
                     //设置访问接口地址
                     serverUrl = submissionHttp+"/em/eventReport/recall";
                     api.ajax({
                         url: serverUrl,
                         method: 'post',
                         timeout: 500,
                         dataType: 'json',
                         data: {
                             values: opts
                         }
                     }, function(ret, err) {  //如果调用成功，返回ret，如果调用失败，返回
                       callback(ret, err);
                     })
                    }

                    /**
                     * 信息报送日耗
                     */
                    u.getSubmissionRH=function(opts, callback) {
                      //设置访问接口地址
                      serverUrl = submissionHttp+"/gc/eventReport/dailyConsum/groupby/eventName";
                      api.ajax({
                          url: serverUrl,
                          method: 'post',
                          timeout: 500,
                          dataType: 'json',
                          data: {
                              values: opts
                          }
                      }, function(ret, err) {  //如果调用成功，返回ret，如果调用失败，返回
                        callback(ret, err);
                      })
                     }

                     /**
                      * 信息报送获取人员信息
                      */
                     u.getSubmissionUserinfo=function(opts, callback) {
                       //设置访问接口地址
                       serverUrl = submissionHttp+"/em/app/interface/common/userinfo";
                       api.ajax({
                           url: serverUrl,
                           method: 'post',
                           timeout: 500,
                           dataType: 'json',
                           data: {
                               values: opts
                           }
                       }, function(ret, err) {  //如果调用成功，返回ret，如果调用失败，返回
                         callback(ret, err);
                       })
                      }

                      /**
                       * 信息报送升级
                       */
                      u.SubmissionUpgrade=function(opts, callback) {
                        //设置访问接口地址
                        serverUrl = submissionHttp+"/em/app/interface/eventReport/upgrade";
                        api.ajax({
                            url: serverUrl,
                            method: 'post',
                            timeout: 500,
                            dataType: 'json',
                            data: {
                                values: opts
                            }
                        }, function(ret, err) {  //如果调用成功，返回ret，如果调用失败，返回
                          callback(ret, err);
                        })
                       }

                       /**
                        * 信息报送关闭
                        */
                       u.SubmissionClose=function(opts, callback) {
                         //设置访问接口地址
                         serverUrl = submissionHttp+"/em/app/interface/eventReport/close";
                         api.ajax({
                             url: serverUrl,
                             method: 'post',
                             timeout: 500,
                             dataType: 'json',
                             data: {
                                 values: opts
                             }
                         }, function(ret, err) {  //如果调用成功，返回ret，如果调用失败，返回
                           callback(ret, err);
                         })
                        }

                        /**
                         * 信息报送上报
                         */
                        u.SubmissionReport=function(opts, callback) {
                          //设置访问接口地址
                          serverUrl = submissionHttp+"/em/app/interface/eventReport/submit";
                          api.ajax({
                              url: serverUrl,
                              method: 'post',
                              timeout: 500,
                              dataType: 'json',
                              data: {
                                  values: opts
                              }
                          }, function(ret, err) {  //如果调用成功，返回ret，如果调用失败，返回
                            callback(ret, err);
                          })
                         }
                       /**
                        * 我的积分
                        */
                       u.getzndwCount=function(opts, callback) {
                          opts.portType = "ZNDW_SCORE_COUNT";
                          remoteLoad(opts, callback);
                        }

                        /**
                         * 附近的人
                         */
                        u.getUserLocationArea=function(opts, callback) {
                           opts.portType = "GET_USER_LOCATION_AREA";
                           remoteLoad(opts, callback);
                         }

                         /**
                          * 获取异常设备清单
                          */
                        u.getBillPwDevCheck=function(opts, callback) {
                          opts.portType = "BILL_PW_DEV_CHECK_FUN";
                          remoteLoad(opts, callback);
                        }

                          /**
                           * 发电管理
                           */
                        u.FdManagerOrg=function(opts, callback) {
                            opts.portType = "FD_MANAGER_ORG_FUN";
                            remoteLoad(opts, callback);
                        }
                           /**
                            * 发电管理组织接口
                            */
                        u.FdManagerOrgSelect=function(opts, callback) {
                          opts.portType = "FD_MANAGER_ORG_LIST_FUN";
                          remoteLoad(opts, callback);
                        }
                        //日常维修工单签到
                        u.repairSign = function(data, callback) {
                            data.portType = "FIX_BILL_INSPECTION";
                            remoteLoad(data, callback);
                        };
                        //判断日常维修工单是否签到
                        u.repairSignCheck = function(data, callback) {
                            data.portType = "FIX_BILL_INSPECTIONCHECK";
                            remoteLoad(data, callback);
                        };

                        //日常维修-预算告警接口
                        u.repairCheckProcedure = function(data, callback) {
                            data.portType = "FIX_BILL_CHECKPROCEDURE";
                            remoteLoad(data, callback);
                        };
                        //日历查询--故障工单
                        u.getBillCalendar = function(data, callback) {
                            data.portType = "GET_BILL_RCMONITOR_LIST";
                            remoteLoad(data, callback);
                        };
                        //日历查询--出入站
                        u.getStationCalendar = function(data, callback) {
                            data.portType = "STATION_BILL_RCWORKING_LIST";
                            remoteLoad(data, callback);
                        };
                        //日历查询--智能代维
                        u.getZndwCalendar = function(data, callback) {
                            data.portType = "RCZNDW_TASK_LIST_SITE";
                            remoteLoad(data, callback);
                        };
                        //日历查询--停发电
                        u.getElectricityCalendar = function(data, callback) {
                            data.portType = "RCELECTRICITY_BILL_LIST";
                            remoteLoad(data, callback);
                        };
                        //日历查询--日常维修
                        u.getReparirCalendar = function(data, callback) {
                            data.portType = "FIX_RCBILL_LIST";
                            remoteLoad(data, callback);
                        };
                        //日历查询--巡检
                        u.getTaskCalendar = function(data, callback) {
                            data.portType = "NEW_TASK_RCPROCESSING_LIST";
                            remoteLoad(data, callback);
                        };
                        //日历查询--日程
                        u.getDayCalendar = function(data, callback) {
                            data.portType = "FIX_BILL_RCREVENT_LIST";
                            remoteLoad(data, callback);
                        };
                        //日历查询--添加日程
                        u.addDayCalendar = function(data, callback) {
                            data.portType = "RC_USER_SCHEDULE_MSG";
                            remoteLoad(data, callback);
                        };
                        //日历查询--删除日程
                        u.deleteDayCalendar = function(data, callback) {
                            data.portType = "RC_USER_SCHEDULE_MSG_DELETE";
                            remoteLoad(data, callback);
                        };
                        //日历查询--日程数量
                        u.getDayNumCalendar = function(data, callback) {
                            data.portType = "RC_BILL_COUNT_ALL";
                            remoteLoad(data, callback);
                        };
                        //日历查询--日程数量
                        u.getBulleDetail = function(data, callback) {
                            data.portType = "GET_BULLE_DETAIL";
                            remoteLoad(data, callback);
                        };
                        //日历查询--备注日期集合
                        u.getRemarksList = function(data, callback) {
                            data.portType = "FIX_BILL_RCREVENT_ABOUT";
                            remoteLoad(data, callback);
                        };
                        /**
                         * 代维调度工单转派查询人员信息
                         */
                        u.getTaskUsers=function(data, callback) {
                            data.portType = "ZNDW_GET_TASK_USER";
                            remoteLoad(data, callback);
                         }
                         /**
                          * 代维调度工单转派
                          */
                         u.sendTaskTo=function(data, callback) {
                             data.portType = "ZNDW_TASK_TO";
                             remoteLoad(data, callback);
                          }
                          /**
                           * 通讯录搜索
                           */
                          u.searchUser=function(data, callback) {
                              data.portType = "GET_CONTACT_LIST_SEARCH";
                              remoteLoad(data, callback);
                           }

                           /**
                            * 停发电地图
                            */
                           u.FdManagerMap=function(data, callback) {
                               data.portType = "FD_MANAGER_MAP_FUN";
                               remoteLoad(data, callback);
                          }

                            /**
                             * 停发电地图根据有站址查工单
                             */
                            u.FdManagerMapCode=function(data, callback) {
                                data.portType = "FD_MANAGER_MAP_CODE_FUN";
                                remoteLoad(data, callback);
                            }

                             /**
                              * 地图根据站址code查工单数量
                              */
                            u.getLocationBill=function(data, callback) {
                                 data.portType = "GET_LOCATION_AREA_BILL";
                                 remoteLoad(data, callback);
                            }


                            /**
                             * 电表装维站址列表
                             */
                           u.getammeterStation=function(data, callback) {
                                data.portType = "ELECTRIC_DIMENSION_LIST";
                                remoteLoad(data, callback);
                           }
                           /**
                            * 电表装维获取表厂商名称
                            */
                          u.getammeterElectric=function(data, callback) {
                               data.portType = "ELECTRIC_FIRM_INFO";
                               remoteLoad(data, callback);
                          }


                             /**
                             * 设备信息查询
                             */
                             u.querybypage=function(data, callback) {
                               data.portType = "ELECTRIC_DIMENSION_INFO";
                               remoteLoad(data, callback);
                              }

                              // 电表URl
                              var ammeterIP='http://180.153.49.94:8084';//测试
                              // var ammeterIP='http://180.153.49.88:8082';//正式
                               /**
                               * 设备属性完善
                               */
                               u.updatePerfect=function(data, callback) {
                                 data.portType = "ELECTRIC_DIMENSION_UPDATE";
                                 remoteLoad(data, callback);
                                }

                                /**
                                * 维修单查询隐患设备
                                */
                                u.repairDissystem=function(data, callback) {
                                  data.portType = "FIX_HIDDEN_DISSYSTEM_LIST";
                                  remoteLoad(data, callback);
                                 }
                                 /**
                                 * 维修单查询设备名称
                                 */
                                 u.repairFSUdevice=function(data, callback) {
                                   data.portType = "FIX_HIDDEN_FSUDEVICE_LIST";
                                   remoteLoad(data, callback);
                                  }
                                  /**
                                  * 维修单查询隐患内容和等级
                                  */
                                  u.repairInspstand=function(data, callback) {
                                    data.portType = "FIX_HIDDEN_INSPSTAND_LIST";
                                    remoteLoad(data, callback);
                                   }
                                   /**
                                   * 维修单提交
                                   */
                                   u.repairBillDisplay=function(data, callback) {
                                     data.portType = "FIX_BILL_DISPLAY";
                                     remoteLoad(data, callback);
                                    }
                                    /**
                                    * 调度工单可编辑备注
                                    */
                                    u.zndwTaskRemark=function(data, callback) {
                                      data.portType = "ZNDW_TASK_FILL_REMARK";
                                      remoteLoad(data, callback);
                                     }
                         // 王晓星修改********************************************************************
    window.$client = u;
})(window);

                    /**
                     *获取当前时间
                     */
                    function CurentTime(){
                        var now = new Date();

                        var year = now.getFullYear();       //年
                        var month = now.getMonth() + 1;     //月
                        var day = now.getDate();            //日

                        var hh = now.getHours();            //时
                        var mm = now.getMinutes();          //分
                        var ss = now.getSeconds();           //秒

                        var clock = year + "-";

                        if(month < 10)
                            clock += "0";

                        clock += month + "-";

                        if(day < 10)
                            clock += "0";

                        clock += day + " ";

                        if(hh < 10)
                            clock += "0";

                        clock += hh + ":";
                        if (mm < 10) clock += '0';
                        clock += mm + ":";

                        if (ss < 10) clock += '0';
                        clock += ss;
                        return(clock);
                    }
