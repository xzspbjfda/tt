var verifyHost;
apiready = function() {
    var leftClickCount = 0,rightClickCount = 0;
    $("#left-button").click(function () {
        if(leftClickCount < 3){
            leftClickCount++;
        }else{
            leftClickCount = 0;
        }
    })
    $("#right-button").click(function () {
        if(leftClickCount == 3){
            rightClickCount++;
            if(rightClickCount == 3){
                $("#env-switch").hide();
                $("#env-select").show();
                leftClickCount = 0;
                rightClickCount = 0;
            }
        }else{
            leftClickCount = 0;
        }
    })
    $("#env-select").change(function () {
        var envValue = $("#env-select option:checked").val();
        if(env){
            $api.rmStorage(ENV_LOCAL_STORAGE_KEY);
            $api.rmStorage(INIT_ENV_LOCAL_STORAGE_KEY);
            console.log("【万能环境切换器】",envValue);
            if(envValue == ""){
                env.begin();
            }else{
                env = new EnvManager(envValue);
            }
            verifyHost = sysConfig.testHost;
            refreshVerify();
        }

    })

    $("#versionId").text("版本：" + api.appVersion);

    verifyHost = $api.getStorage('ip');
    console.log("ip："+verifyHost);
    if (verifyHost == undefined || verifyHost == 'undefined') {
        verifyHost = sysConfig.host;
        console.log("=====================")
    }
    if (verifyHost == $api.getStorage('testHost')) {
        $api.byId('isTestEnv').checked = true;
        console.log("是测试环境");
        //	$('#isTestEnv').css('checked', true);
    }
    console.log('服务器ip： ' + verifyHost);
    //初始化验证码
    refreshVerify();

    //初始化登录框
    var loginName = $api.getStorage(constant.LOGIN_USERNAME);
    var loginPassword = $api.getStorage(constant.LOGIN_PASSWORD);

    if (loginName && loginPassword) {
        $('#username').val(loginName);
        $('#password').val(loginPassword);
        $('#remember').css('checked', true);
    }

    //初始化登录历史
    var userStorages = $api.getStorage('userStorages') || {};
    for (var user in userStorages) {
        $('<div class="del_select"></div>').text(user).appendTo('#u_selBox');
    }

    // 初始化服务器列表 wxx
    var hostStorages = {
        "集团": "180.153.49.251:58090",
        // "河南(电信一线)": "222.85.25.139:58090",
        // "河南(电信二线)": "222.85.25.143:58090",
        // "河南(移动)": "117.158.221.16:58090",
        // "河南(联通)": "218.29.121.210:58090",
        "广东(电信)": "113.108.164.235:58090",
        "广东(移动)": "211.136.211.88:58090",
        "广东(联通)": "221.4.39.10:58090"
        // "四川(电信一线)": "118.122.127.55:58090",
        // "四川(电信二线)": "118.122.127.44:58090",
        // ">四川(移动)": "111.9.5.19:58090",
        // "四川(联通)": "119.6.207.202:58090",
        // "四川(全网)": "101.227.248.254:59080",
        // "江苏(电信)": "58.213.164.27:58090",
        // "江苏(移动)": "221.181.144.91:58090",
        // "江苏(联通)": "122.96.154.91:58090"
    };
    if (hostStorages)
        $api.setStorage('hostStorages', hostStorages);
    var hostUnit = $api.getStorage('hostUnit');
    if (typeof hostUnit == 'undefined') {
        hostUnit = '集团';
    }
    var hostList = new Array();
    for (var host in hostStorages) {
        hostList.push(host);
    }
    hostList.sort().reverse();
    for (var i = 0, size = hostList.length; i < size; i++) {
        var $option = $('<option></option>').text(hostList[i]).val(hostStorages[hostList[i]]).appendTo('#unit_selBox');
        //              console.log('初始ip：'+hostStorages[hostList[i]]);
        if (hostUnit == hostList[i]) {
            $option.attr('selected', true);
        }
    }

    //初始化服务器列表（由于链接地址不稳定经常造成服务器选项不显示，导致app无法登录）
    // var hostStorages = $api.getStorage('hostStorages') || {};
    // api.ajax({
    // 	url : 'http://180.153.49.253:58090/iplist.json'
    // }, function(ret, err) {
    // 	if (ret) {
    // 		var hostStorages = ret;
    // 		if (hostStorages)
    // 			$api.setStorage('hostStorages', hostStorages);
    // 		var hostUnit = $api.getStorage('hostUnit');
    // 		if ( typeof hostUnit == 'undefined') {
    // 			hostUnit = '集团';
    // 		}
    // 		var hostList = new Array();
    // 		for (var host in hostStorages) {
    // 			hostList.push(host);
    // 		}
    // 		hostList.sort().reverse();
    // 		for (var i = 0, size = hostList.length; i < size; i++) {
    // 			var $option = $('<option></option>').text(hostList[i]).val(hostStorages[hostList[i]]).appendTo('#unit_selBox');
    // 			//              console.log('初始ip：'+hostStorages[hostList[i]]);
    // 			if (hostUnit == hostList[i]) {
    // 				$option.attr('selected', true);
    // 			}
    // 		}
    // 	}
    // });

    /* jquery事件:用户名切换*/
    $('.del_select').click(function() {
        var userStorages = $api.getStorage('userStorages') || {};
        var username = $(this).text();
        var password = userStorages[username];
        $('#username').val(username);
        $('#password').val(password);
        toggleOtherUsers();
    });
    /*
     * jQuery事件:常用用户选框toggle
     */
    $('#username').click(function() {
        if ($('#u_selBox').is(':visible')) {
            toggleOtherUsers();
        }
    });

    /*
     * jquery事件:根据省份服务器地址点击切换
     */
    $('#unit_selBox').change(function() {
        var host = $(this).val();
        var hostUnit = $(this).find(':selected').text();
        $api.setStorage('host', host);
        $api.setStorage('hostUnit', hostUnit);
        console.log('选择的服务器是：' + host);
        changeHost(host);
        toggleVerifyHost();
        refreshVerify();
    });
    /*
     * jquery事件: 当测试环境切换时,对应的验证码需要修改服务器地址
     */
    $('input[name=testEnviroment]').click(function() {
        //切换验证码服务器地址
        toggleVerifyHost();
        //刷新验证码
        refreshVerify();
    });

    $('#verifyImg').load(function() {
        $(this).show().siblings('#loading').hide();
    });

    //*这是临时版本的定时设置
    //  if (new Date() > new Date('2016/01/25 00:00:00')) {
    //      api.alert({
    //          title : '提示',
    //          msg : '该版本已过期，请重新下载最新版本！',
    //          buttons : ['确定']
    //      }, function(ret, err) {
    //          if (ret.buttonIndex == 1) {
    //              api.closeWidget({
    //                  id : api.appId,
    //                  retData : {
    //                      name : 'closeWidget'
    //                  },
    //                  animation : {
    //                      type : 'flip',
    //                      subType : 'from_bottom',
    //                      duration : 500
    //                  }
    //              });
    //          }
    //      });
    //  }

    handlerBackBtn();
    //当打开登录页时，关闭首页
    api.addEventListener({
        name: 'viewappear'
    }, function(ret, err) {
        closePage_home();
        refreshVerify();
    });
};

request.newLogin = function(userId,password,callback){
    service(
        {
            url:"/user/login.do",
            data:{
                userId:userId,
                password:password
            }
        },callback
    )
}
request.getUserInfo = function(callback){
    service({url:"/user/getUserInfo.do",},callback)
}

/**
 * 登录
 */
function login(pushJson) {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    $api.setStorage('password', password);

    var verifyCode = document.getElementById('verifyCode').value;
    var clientType = 0;
    var osversion = api.systemType + ":" + api.systemVersion;
    var phoneinfo = api.deviceModel;
    var softversion = api.version;
    //alert("username=="+username+"//password=="+password+"//verifyCode=="+verifyCode+"//osversion=="+osversion+"//phoneinfo=="+phoneinfo+"//softversion=="+softversion);
    //系统默认类型默认值为安卓
    if (typeof(username) == undefined || username == null || $api.trimAll(username) == "") {
        showToast("请输入用户名！");
        return;
    }
    if (typeof(password) == undefined || password == null || $api.trimAll(password) == "") {
        showToast("请输入密码！");
        return;
    }
    if (username == 'test' && password == 'test') {
        //弹出对话框，修改服务器地址
    	//alert("alert11="+sysConfig.testHost);
        api.prompt({
            title: '设置服务器地址',
            text: sysConfig.testHost,
            buttons: ['确定', '取消']
        }, function(ret, err) {
            if (ret.buttonIndex == 1) {
                if (ret.text && ret.text != '') {
                    api.setPrefs({
                        key: 'testHost',
                        value: ret.text
                    });
                    changeTestHost(ret.text);
                    toggleVerifyHost();
                    api.toast({
                        msg: '设置成功'
                    });
                }
            }
        });
        return;
    }

    //判断系统类型是否为ios tangsj 2015-09-15
    if (api.systemType == "ios") {
        clientType = 1;
    }
    api.showProgress({
        title: '登录中...'
    });
    //	changeHost(verifyHost);
    // wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx 写死版本号，曾全局修改
    // $api.setStorage('appVersion', '0.5.38');
    $api.setStorage('appVersion', api.appVersion);
    // wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

    setCurServerUrl();
    var smsCode = document.getElementById('login_sms_input').value;
    var queryOpts = {
            loginName: username,
            password: AES.encryptPassword(password),
            // loginVersion:"202109",
            loginVersion:"202206",
            verifyCode: verifyCode,
            clientType: clientType,
            osversion: osversion,
            softversion: api.appVersion,
            phoneinfo: phoneinfo,
            pin: smsCode,
        }
        // ios设置加密后的设备id
        //===垂直越权开始-需注释以下代码===
        /*if (api.systemType == "ios") {
            $api.setStorage('equiptoken', sha1(api.deviceId));
        } else {
            //Android设置加密后的设备id
            var demo = api.require('moduleSo');

            var param = {
                msg: api.deviceId
            };
            demo.showAlert(param, function(ret, err) {
                $api.setStorage('equiptoken', ret.result);
            });
        }*/
        //===垂直越权结束===
        //===垂直越权开始-需添加以下代码===
        $api.setStorage('equiptoken',"");
        //===垂直越权结束==
    setTimeout(function() {
        if($('#four_a_login').css("display") === 'none') { 
            $client.login(queryOpts, function(ret, err) {
                api.hideProgress();
                console.log("登录返回值："+ JSON.stringify(ret));
                if (ret) {
                    if(ret.secondAuth === "true"){ // 新增返回参数: "secondAuth": "true" 前端判断若为true，则需要进行短信二次验证；若不需要短信二次验证，同原逻辑
                        // 进行短信二次验证
                        secondVerify();
                        return;
                    }
                    // 能源工单信息存储
                    $api.setStorage('energyUserInfo',ret);
                    if (ret.success) {
                        // 能源工单
                        // if(ret.energyLoginSuccess === "true" && ret.localLoginSuccess === "false" ? openEnergyOrder('energyWorkOrder/mainWin', '../energyWorkOrder/mainWin') : '') {
                        if (ret.energyLoginSuccess === "true" && ret.localLoginSuccess === "false") {
                            // alert("直接进入能源工单");
                            // openEnergyOrder('energyWorkOrder/mainWin', '../energyWorkOrder/mainWin.html')
                            openWinList('energyWorkOrder/mainWin', '能源工单', '')
                            return
                        }
                    //alert("json==+"+JSON.stringify(ret))
                        var userId = ret.user.userid;
                        var userName = ret.user.username;
                        //alert("userId==+"+userId+"//userName=="+userName)
                        $api.setStorage("user", ret.user);
                        $api.setStorage("indexModel", ret.model);
                        $api.setStorage("elementList", ret.elementList);
                        console.log("【Authorization】",ret.token)
                        $api.setStorage("Authorization", ret.token);
                        //===垂直越权开始-需添加以下代码===
                        $api.setStorage('equiptoken', ret.equiptoken);
                        console.log("==equiptoken=="+ ret.equiptoken)
                        //===垂直越权结束===
                        console.log(ret.elementList);
                        $api.setStorage(constant.LOGIN_USERNAME, username);
                        $api.setStorage(constant.LOGIN_LOGINNAME, ret.user.loginname);
                        $api.setStorage(constant.LOGIN_PASSWORD, password);
                        $api.setStorage(constant.ISLOGIN, "true");
                        $api.setStorage('provinceid', ret.user.provinceid);
                        $api.setStorage("isLoginOut", "false");
                        api.setPrefs({
                            key: constant.AUTO_LOGIN,
                            value: true
                        });
                        var jpushVip = api.require('jpushVip');
                        jpushVip.setAlias({
                                alias : userId,
                                sequence : new Date().getTime()
                            }, function(ret, err) {
                                console.log("bindAlias:" + ret.statusCode);
                            });
                        // 极光推送
                        // var user = $api.getStorage('user');
                        //alert("api.systemType="+api.systemType)
                        // if(api.systemType=='ios'){
                        //   var uzmoduledemo = api.require('modulePush');
                        //   var param = {
                        //       userName: user.userid
                        //   };
                        //   uzmoduledemo.startActivity(param);
                        // }else{
                        //   var uzmoduledemo = api.require('modulePushNew');
                        //   var param = {
                        //       userName: user.userid
                        //   };
                        //   uzmoduledemo.startActivity(param);
                        // }
                        //alert("uzmoduledemo="+uzmoduledemo);alert("user="+user);
                        // 梆梆安全
    //                     if (api.systemType == 'ios') {
    //                       var moduleSafe = api.require('bbModuleSafe');
    //                       var user = $api.getStorage('user');
    //                       var paramIOS = {
    //                           msg: user.loginname
    //                       };
    // //                        moduleSafe.bindUser(paramIOS,function(ret, err) {
    // //                        });
    //                     } else {
    //                       var moduleSafe = api.require('moduleSafe');
    //                       var user = $api.getStorage('user');
    //                       var param = {
    //                           msg: user.loginname
    //                       };
    //                       moduleSafe.showAlert(param, function(ret, err) {
    //                       });
    //                     }
                        var moduleSafe = api.require('moduleSafe');
                        var user = $api.getStorage('user');
                        var param = {
                            msg: user.loginname
                        };
                        console.log("param == >>"+param);
                        //   moduleSafe.showAlert(param, function(ret, err) {
                        //   });

                        //保存登录历史（只保存最近两位）
                        var userStorages = $api.getStorage('userStorages') || {};
                        var isSavePassword = document.getElementById('remember').checked;
                        if (isSavePassword) {
                            userStorages[username] = password;
                        } else {
                            userStorages[username] = "";
                        }
                        $api.setStorage('userStorages', userStorages);

                        //加载用户的区域数据
                        loadUnitList();

                        //可视省市区列表设置
                        setVisualizationUnit();
                        //  closePage_login();

                        //判断是否为强密码
                        if (!checkPwd(password)) {
                            //跳转至密码修改页
                            window.setTimeout(function() {
                                openPage_modifyPwd();
                            }, 400);
                        } else {
                            //登录转的页面
                            console.log('登录转的页面');
                            $client.versionUpdate(function(ret, err) {
                                console.log(JSON.stringify(ret));
                                console.log(getObj(ret));
    //                            alert(getObj(ret));
                                if (ret) {
                                    if (ret.success) {
                                        var v = api.appVersion;
                                        var version = v.substring(v.lastIndexOf('.') - 1, v.length).replace('.', '');
                                        console.log("版本：" + ret.model.versionid + '測試：' + Number(version));
                                        if (ret.model.versionid > Number(version)) {
                                            api.confirm({
                                                title: '升级提示',
                                                msg: ret.model.versiondesc,
                                                buttons: ['确定', '取消']
                                            }, function(ret) {
                                                if (ret.buttonIndex == 1) {
                                                $api.setStorage("isLoginOut", "true");

                                                //关闭极光推送

                                                //注销时提醒后台，改用户已注销
                                                $client.userLoginOut(function(ret, err) {
                                                });
                                                api.execScript({
                                                    name : 'login',
                                                    script : 'refreshVerify();'
                                                });

                                                    if (api.systemType == 'ios') {
                                                        api.openApp({
                                                            iosUrl: 'http://' + verifyHost + '/itower/mobile/clientapi' //打开微信的，其中weixin为微信的URL Scheme
                                                        });
                                                    } else {
                                                        api.openApp({
                                                            androidPkg: 'android.intent.action.VIEW',
                                                            uri: 'http://' + verifyHost + '/itower/mobile/clientapi'
                                                        }, function(ret, err) {

                                                        });
                                                    }

                                                } else {
                                                    window.setTimeout(function() {
                                                        tranMainHome();
                                                    }, 400);
                                                }
                                            });


                                        } else {

                                            window.setTimeout(function() {
                                                tranMainHome();
                                            }, 400);
                                        }
                                    }else if (ret.errorMsg == '该账号已在其它设备登录') {
                                    window.setTimeout(function() {
                                        tranMainHome();
                                    }, 400);
                                    }
                                } else {
                                    api.toast({
                                        msg: '服务异常，请重试',
                                        location: 'bottom'
                                    });
                                }
                            });

                            //					window.setTimeout(function() {
                            //						tranMainHome();
                            //					}, 400);
                        }

                    } else  { // 登录返回
                        api.toast({
                            msg: ret.data_info,
                            location: 'bottom'
                        });

                        //非法操作时
                        if (ret.data_info.indexOf("非法") != -1) {
                            api.confirm({
                                title: '升级提示',
                                msg: '该版本过旧，请更新到最新版本'
                            }, function(ret) {
                                if (ret.buttonIndex == 2) {
                                    if (api.systemType == 'ios') {
                                        api.openApp({
                                            iosUrl: 'http://' + verifyHost + '/itower/mobile/clientapi' //打开微信的，其中weixin为微信的URL Scheme
                                        });
                                    } else {
                                        api.openApp({
                                            androidPkg: 'android.intent.action.VIEW',
                                            uri: 'http://' + verifyHost + '/itower/mobile/clientapi'
                                        }, function(ret, err) {

                                        });
                                    }

                                    //																				window.open('http://' + verifyHost + '/itower/mobile/clientapi');
                                }
                            });

                        }
                        refreshVerify();
                    }
                } else {
                    api.toast({
                        msg: '服务异常，请重试',
                        location: 'bottom'
                    });

                }
            });
        }else{
            api.showProgress({
                title: '校验验证码中...'
            });
            $client.checkPin(queryOpts, function(ret, err) {
                api.hideProgress();
                console.log("登录返回值："+ JSON.stringify(ret));
                if (ret) {
                    setTimeout(function(){
                        showSms(false);
                    }, 500)
                    // 能源工单信息存储
                    $api.setStorage('energyUserInfo',ret);
                    if (ret.success) {
                        // 能源工单
                        // if(ret.energyLoginSuccess === "true" && ret.localLoginSuccess === "false" ? openEnergyOrder('energyWorkOrder/mainWin', '../energyWorkOrder/mainWin') : '') {
                        if (ret.energyLoginSuccess === "true" && ret.localLoginSuccess === "false") {
                            // alert("直接进入能源工单");
                            // openEnergyOrder('energyWorkOrder/mainWin', '../energyWorkOrder/mainWin.html')
                            openWinList('energyWorkOrder/mainWin', '能源工单', '')
                            return
                        }
                    //alert("json==+"+JSON.stringify(ret))
                        var userId = ret.user.userid;
                        var userName = ret.user.username;
                        //alert("userId==+"+userId+"//userName=="+userName)
                        $api.setStorage("user", ret.user);
                        $api.setStorage("indexModel", ret.model);
                        $api.setStorage("elementList", ret.elementList);
                        console.log("【Authorization】",ret.token)
                        $api.setStorage("Authorization", ret.token);
                        //===垂直越权开始-需添加以下代码===
                        $api.setStorage('equiptoken', ret.equiptoken);
                        console.log("==equiptoken=="+ ret.equiptoken)
                        //===垂直越权结束===
                        console.log(ret.elementList);
                        $api.setStorage(constant.LOGIN_USERNAME, username);
                        $api.setStorage(constant.LOGIN_LOGINNAME, ret.user.loginname);
                        $api.setStorage(constant.LOGIN_PASSWORD, password);
                        $api.setStorage(constant.ISLOGIN, "true");
                        $api.setStorage('provinceid', ret.user.provinceid);
                        $api.setStorage("isLoginOut", "false");
                        api.setPrefs({
                            key: constant.AUTO_LOGIN,
                            value: true
                        });
                        var jpushVip = api.require('jpushVip');
                        jpushVip.setAlias({
                                alias : userId,
                                sequence : new Date().getTime()
                            }, function(ret, err) {
                                console.log("bindAlias:" + ret.statusCode);
                            });
                        // 极光推送
                        // var user = $api.getStorage('user');
                        //alert("api.systemType="+api.systemType)
                        // if(api.systemType=='ios'){
                        //   var uzmoduledemo = api.require('modulePush');
                        //   var param = {
                        //       userName: user.userid
                        //   };
                        //   uzmoduledemo.startActivity(param);
                        // }else{
                        //   var uzmoduledemo = api.require('modulePushNew');
                        //   var param = {
                        //       userName: user.userid
                        //   };
                        //   uzmoduledemo.startActivity(param);
                        // }
                        //alert("uzmoduledemo="+uzmoduledemo);alert("user="+user);
                        // 梆梆安全
    //                     if (api.systemType == 'ios') {
    //                       var moduleSafe = api.require('bbModuleSafe');
    //                       var user = $api.getStorage('user');
    //                       var paramIOS = {
    //                           msg: user.loginname
    //                       };
    // //                        moduleSafe.bindUser(paramIOS,function(ret, err) {
    // //                        });
    //                     } else {
    //                       var moduleSafe = api.require('moduleSafe');
    //                       var user = $api.getStorage('user');
    //                       var param = {
    //                           msg: user.loginname
    //                       };
    //                       moduleSafe.showAlert(param, function(ret, err) {
    //                       });
    //                     }
                        var moduleSafe = api.require('moduleSafe');
                        var user = $api.getStorage('user');
                        var param = {
                            msg: user.loginname
                        };
                        console.log("param == >>"+param);
                        //   moduleSafe.showAlert(param, function(ret, err) {
                        //   });

                        //保存登录历史（只保存最近两位）
                        var userStorages = $api.getStorage('userStorages') || {};
                        var isSavePassword = document.getElementById('remember').checked;
                        if (isSavePassword) {
                            userStorages[username] = password;
                        } else {
                            userStorages[username] = "";
                        }
                        $api.setStorage('userStorages', userStorages);

                        //加载用户的区域数据
                        loadUnitList();

                        //可视省市区列表设置
                        setVisualizationUnit();
                        //  closePage_login();

                        //判断是否为强密码
                        if (!checkPwd(password)) {
                            //跳转至密码修改页
                            window.setTimeout(function() {
                                openPage_modifyPwd();
                            }, 400);
                        } else {
                            //登录转的页面
                            console.log('登录转的页面');
                            $client.versionUpdate(function(ret, err) {
                                console.log(JSON.stringify(ret));
                                console.log(getObj(ret));
    //                            alert(getObj(ret));
                                if (ret) {
                                    if (ret.success) {
                                        var v = api.appVersion;
                                        var version = v.substring(v.lastIndexOf('.') - 1, v.length).replace('.', '');
                                        console.log("版本：" + ret.model.versionid + '測試：' + Number(version));
                                        if (ret.model.versionid > Number(version)) {
                                            api.confirm({
                                                title: '升级提示',
                                                msg: ret.model.versiondesc,
                                                buttons: ['确定', '取消']
                                            }, function(ret) {
                                                if (ret.buttonIndex == 1) {
                                                $api.setStorage("isLoginOut", "true");

                                                //关闭极光推送

                                                //注销时提醒后台，改用户已注销
                                                $client.userLoginOut(function(ret, err) {
                                                });
                                                api.execScript({
                                                    name : 'login',
                                                    script : 'refreshVerify();'
                                                });

                                                    if (api.systemType == 'ios') {
                                                        api.openApp({
                                                            iosUrl: 'http://' + verifyHost + '/itower/mobile/clientapi' //打开微信的，其中weixin为微信的URL Scheme
                                                        });
                                                    } else {
                                                        api.openApp({
                                                            androidPkg: 'android.intent.action.VIEW',
                                                            uri: 'http://' + verifyHost + '/itower/mobile/clientapi'
                                                        }, function(ret, err) {

                                                        });
                                                    }

                                                } else {
                                                    window.setTimeout(function() {
                                                        tranMainHome();
                                                    }, 400);
                                                }
                                            });


                                        } else {

                                            window.setTimeout(function() {
                                                tranMainHome();
                                            }, 400);
                                        }
                                    }else if (ret.errorMsg == '该账号已在其它设备登录') {
                                    window.setTimeout(function() {
                                        tranMainHome();
                                    }, 400);
                                    }
                                } else {
                                    api.toast({
                                        msg: '服务异常，请重试',
                                        location: 'bottom'
                                    });
                                }
                            });

                            //					window.setTimeout(function() {
                            //						tranMainHome();
                            //					}, 400);
                        }

                    } else  { // 登录返回
                        api.toast({
                            msg: ret.data_info,
                            location: 'bottom'
                        });

                        //非法操作时
                        if (ret.data_info.indexOf("非法") != -1) {
                            api.confirm({
                                title: '升级提示',
                                msg: '该版本过旧，请更新到最新版本'
                            }, function(ret) {
                                if (ret.buttonIndex == 2) {
                                    if (api.systemType == 'ios') {
                                        api.openApp({
                                            iosUrl: 'http://' + verifyHost + '/itower/mobile/clientapi' //打开微信的，其中weixin为微信的URL Scheme
                                        });
                                    } else {
                                        api.openApp({
                                            androidPkg: 'android.intent.action.VIEW',
                                            uri: 'http://' + verifyHost + '/itower/mobile/clientapi'
                                        }, function(ret, err) {

                                        });
                                    }

                                    //																				window.open('http://' + verifyHost + '/itower/mobile/clientapi');
                                }
                            });

                        }
                        refreshVerify();
                    }
                } else {
                    api.toast({
                        msg: '服务异常，请重试',
                        location: 'bottom'
                    });

                }
            })
        }
    }, 500);

    //  handlerBackBtn();
}

/**
 * 加载省市区数据
 */
function loadUnitList() {

    //判断缓存中是否有部门数据
    var data = getStorage("unitData");

    if (!data) {
        //没有部门数据，则进行加载
        //$client.get
        $api.setStorage("unitData", unitData);
    }
}

/**
 * 可视省市区列表设置
 */
function setVisualizationUnit() {
    var user = getStorage("user");
    var unitid = '';
    var all = false;
    if (typeof(user) != "undefined") {
        unitid = user.unitid;
    }
    //var unitid = '0289713,0108517,0099972,0108447';测试数据
    if (unitid == null || unitid == "") {
        unitid = "0000017";
    }
    var unitData = getStorage("unitData");
    showlog('unitData:\n' + getObj(unitData[0]));
    var unitTree = null;

    var unitidList = unitid.split(',');

    for (var i = 0, size = unitidList.length; i < size; i++) {
        if (unitidList[i] == '0000017') {
            all = true;
            break;
        }
    }
    if (!all) {
        for (var i = 0, size = unitidList.length; i < size; i++) {
            var unit = unitidList[i];
            var result = findUnitList(unitData, unit);
            if (result != null && unitTree != null) {
                mergeTree([unitTree], result);
            } else if (result != null && unitTree == null) {
                unitTree = result;
            } else {
                unitTree = unitData[0];
            }
        }
    } else {
        unitTree = unitData[0];
    }

    $api.setStorage("userUnitData", unitTree);
}

/*
 * 查找局向
 */
function findUnitList(unitData, unitid) {
    for (var i = 0, size = unitData.length; i < size; i++) {
        var unit = unitData[i];
        if (unit == null) {
            continue;
        }
        if (unit.i === unitid) {
            return unit;
        } else if (typeof(unit.c) != "undefined" && unit.c.length > 0) {
            var subResult = findUnitList(unit.c, unitid);
            if (subResult != null) {
                var result = {
                    i: unit.i,
                    l: unit.l,
                    n: unit.n,
                    c: [subResult]
                };
                return result;
            }
        }
    }
    return null;
}

/*
 * 合并
 */
function mergeTree(array, obj) {

    for (var i = 0, size = array.length; i < size; i++) {
        var arr = array[i];
        if (typeof(arr.i) != "undefined" && arr.i == obj.i) {
            var result = mergeTree(arr.c, obj.c[0]);
            return;
        }
    }
    array.push(obj);
}

/**
 * 延时掩藏进度框
 */
function hideProgress() {
    window.setTimeout(function() {
        api.hideProgress();
    }, 400);
}

/**
 * 处理返回事件
 */
function handlerBackBtn() {
    api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {
        //operation
        var currentWinName = getFrameName();
        //当前窗口的名字

        if (currentWinName == "login") {
            logout();
        } else if (currentWinName == "home_win") {

        } else {
            api.historyBack();
        }
    });
}

/**
 *退出系统操作  只限于android
 */
function logout() {

    api.confirm({
        title: '提示',
        msg: '确定退出系统？',
        buttons: ['取消', '确定']
    }, function(ret, err) {
        if (ret.buttonIndex == 2) {
            api.closeWidget({
                id: api.appId,
                retData: {
                    name: 'closeWidget'
                },
                animation: {
                    type: 'flip',
                    subType: 'from_bottom',
                    duration: 500
                }
            });
        }
    });

}

//获取用户所管理的省
function getUnitList(userId) {
    var opts = {
        objectType: 1,
        provinceId: '',
        cityId: ''
    }
    $client.getUnitList(opts, function(ret, err) {
        if (ret) {
            if (ret.success) {
                var key = constant.PROVINCE_LIST + "_" + userId;
                $api.setStorage(key, ret.unitList);
            } else {
                showToast(ret.data_info);
            }
        } else {
            showToast("服务异常，请重试");
        }
        api.hideProgress();
    });
}

//获取用户所管理的省市区
function getAllUnitList() {
    $client.getAllUnitList(function(ret, err) {
        if (ret) {
            if (ret.success) {
                var key = constant.ALLUNIT_LIST + "_" + userId;
                $api.setStorage(key, ret.orglist);
                var orglist = ret.orglist;
                var cityArr = new Array();
                var countryArr = new Array();
                if (orglist != null) {
                    for (var i = 0; i < orglist.length; i++) {
                        if (orglist[i].objecttypeid == "4") {
                            cityArr.push(orglist[i]);
                        } else if (orglist[i].objecttypeid == "5") {
                            countryArr.push(orglist[i]);
                        }
                    }
                    var cityKey = constant.CITY_LIST + "_" + userId;
                    $api.setStorage(cityKey, cityArr);
                    var countryKey = constant.COUNTRY_LIST + "_" + userId;
                    $api.setStorage(countryKey, countryArr);
                }
            } else {
                showToast(ret.data_info);
            }
        } else {
            showToast("服务异常，请重试");
        }
        api.hideProgress();
    });
}

function setCurServerUrl() {
    /*formal为生产库，test为测试库*/
    $api.setStorage("curServer", 'test');

    if (document.getElementById("isTestEnv").checked || $("#env-select option:checked").val() !== "") {
        $api.setStorage("curServer", 'test');

    } else {
        $api.setStorage("curServer", 'formal');
    }
    $client.changeServerUrl();
}

function checkPwd(password) {
    if (/^\d+$/.test(password) || /^[a-zA-Z]+$/.test(password)) {
        return false;
    } else {
        return true;
    }
}

//IOS代码调用测试
function moduleDemo() {
    var param = {
        msg: "Hello App!",
        filename: "login_logo.png",
        newname: ""
    };
    var demo = api.require('moduleDemo');
    api.toast({
        msg: getObj(demo)
    });
    demo.createSmallImage(param, moduleCallBack);
}

//IOS代码调用测试callback
function moduleCallBack(ret, err) {
    var msg;
    if (ret.dir) {
        msg = ret.dir;
        api.toast({
            msg: msg
        });
    }
}

//点触事件：下拉切换用户列表
function toggleOtherUsers() {
    var $toggleName = $('#toggleName');
    $('#u_selBox').slideToggle('fast');
    var src = $toggleName.attr('src');
    var src2 = $toggleName.attr('src2');
    $toggleName.attr('src', src2);
    $toggleName.attr('src2', src);
}

//显示或隐藏密码
function showPassword() {
    var password = $('#password');
    if (password.attr('type') == 'password') {
        password.attr('type', 'text');
    } else {
        password.attr('type', 'password');
    }
}

//点触事件：刷新验证码
function refreshVerify() {
	console.log("verifyHost=="+verifyHost);
    console.log("imgSrc : "+ 'http://' + verifyHost +'/itower/mobile/app/verifyImg?' + Math.random());
    $('#verifyImg').attr('src', 'http://' + verifyHost +'/itower/mobile/app/verifyImg?' + Math.random());
}

//切换验证码服务器地址
function toggleVerifyHost() {
    if ($('[name=testEnviroment]').is(':checked')){
        env && env.begin();
        verifyHost = sysConfig.testHost;
    } else{
        env && env.load(ENV_ENUM.PROD);
        verifyHost = sysConfig.host;
    }

}

function goScan() {
    var FNScanner = api.require('FNScanner');
    FNScanner.openScanner({
        autorotation: true
    }, function(ret, err) {
        if (ret) {
            //					alert(ret.content);
            if (ret.content != 'undefined' && ret.content != undefined) {
                //				showMask("加载中...");
                $client.getScanInfo({
                    number: ret.content
                }, function(ret, err) {
                    if (ret) {
                        //					hideMask();
                        //          api.hideProgress();
                        if (ret.success) {
                            //						var opt = {'erweima':ret.model}

                            api.openWin({
                                name: 'erweimainfo_win',
                                url: '../../html/erweima/erweimainfo_win.html',
                                reload: true,
                                bounces: false,
                                vScrollBarEnabled: false,
                                pageParam: {
                                    'erweima': ret.model
                                }
                            });


                        } else {
                            api.toast({
                                msg: ret.data_info
                            });
                        }
                    } else {
                        api.toast({
                            msg: '获取信息出错!'
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

// 字符串加密成 hex 字符串
function sha1(s) {
    var data = new Uint8Array(encodeUTF8(s))
    var i, j, t;
    var l = ((data.length + 8) >>> 6 << 4) + 16,
        s = new Uint8Array(l << 2);
    s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
    for (t = new DataView(s.buffer), i = 0; i < l; i++) s[i] = t.getUint32(i << 2);
    s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
    s[l - 1] = data.length << 3;
    var w = [],
        f = [
            function() {
                return m[1] & m[2] | ~m[1] & m[3];
            },
            function() {
                return m[1] ^ m[2] ^ m[3];
            },
            function() {
                return m[1] & m[2] | m[1] & m[3] | m[2] & m[3];
            },
            function() {
                return m[1] ^ m[2] ^ m[3];
            }
        ],
        rol = function(n, c) {
            return n << c | n >>> (32 - c);
        },
        k = [1518500249, 1859775393, -1894007588, -899497514],
        m = [1732584193, -271733879, null, null, -1009589776];
    m[2] = ~m[0], m[3] = ~m[1];
    for (i = 0; i < s.length; i += 16) {
        var o = m.slice(0);
        for (j = 0; j < 80; j++)
            w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
            t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
            m[1] = rol(m[1], 30), m.pop(), m.unshift(t);
        for (j = 0; j < 5; j++) m[j] = m[j] + o[j] | 0;
    };
    t = new DataView(new Uint32Array(m).buffer);
    for (var i = 0; i < 5; i++) m[i] = t.getUint32(i << 2);

    var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function(e) {
        return (e < 16 ? "0" : "") + e.toString(16);
    }).join("");
    return hex;
}

function encodeUTF8(s) {
    var i, r = [],
        c, x;
    for (i = 0; i < s.length; i++)
        if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
        else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
    else {
        if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
            c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
            r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
        else r.push(0xE0 + (c >> 12 & 0xF));
        r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
    };
    return r;
}
function openEnergyOrder(name, url){
    api.openWin({
        name: name,
        url: url,
    })

}

function secondVerify(){
    showSms(true);

    // 发送短信验证码
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var clientType = 0;
    var osversion = api.systemType + ":" + api.systemVersion;
    var phoneinfo = api.deviceModel;
    var softversion = api.version;
    var queryOpts = {
        loginName: username,
        password: AES.encryptPassword(password),
        // loginVersion:"202109",
        loginVersion:"202206",
        clientType: clientType,
        osversion: osversion,
        softversion: api.appVersion,
        phoneinfo: phoneinfo,
    }
    api.showProgress({
        title: '发送验证码中...'
    });
    $client.sendSms(queryOpts, function(ret, err){
        api.hideProgress();
        if(ret){
            if(ret.success){
                if(ret.status === 'FAILED'){
                    api.toast({
                        msg: ret.data_info,
                        location: 'bottom'
                    });
                    return;
                }
                // 倒计时
                startCountDown()
            }else{
                api.toast({
                    msg: ret.data_info,
                    location: 'bottom'
                });     
            }
        }else{
            api.toast({
                msg: '服务异常，请重试',
                location: 'bottom'
            });
        }
    });
}

const COUNT_DOWN_TIME = 60; // 60秒
var total = COUNT_DOWN_TIME;
var time = null;
function startCountDown() {
    if(time == null){ // 防止2次点击
       total = COUNT_DOWN_TIME;
        time = setInterval("countDown()", 1000);//倒计时
    }
}

function countDown() {
    if (total <= 0) {
        // alert("time out");
        pause(); // 一般情况下这个if条件是用来提交数据用的
        var resend = document.getElementById("resend");
        resend.innerHTML = "重新获取";
        resend.className = "resend flex_center";
        resend.removeAttribute("disabled");
        time = null;
    } else {
        // $("#time p").html(Math.floor(total / 60) + ":" + total % 60);
        var resend = document.getElementById("resend");
        resend.className = "resend_count_down flex_center";
        resend.innerHTML = `${total}秒后重新获取`;
        resend.disabled = "true";
        total--;
        // console.info(time);
    }
}
function pause() {
    clearInterval(time);
}

function isEmpty(v){
    return typeof(v) == undefined || v == null || $api.trimAll(v) == ""
}

function showSms(isSms){
    if(isSms){
        // 隐藏账号密码登录方式
        $("#old_login").css("display", "none")
        // 显示输入短信登录方式
        $("#four_a_login").css("display", "block")
    }else{
        // 隐藏账号密码登录方式
        $("#old_login").css("display", "block")
        // 显示输入短信登录方式
        $("#four_a_login").css("display", "none")
    }
}