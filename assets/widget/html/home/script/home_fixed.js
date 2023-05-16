var userId;
apiready = function() {
    var user = $api.getStorage('user');
    userId = user.userid;
    setUserInfo(user);
    initHeader();
    getCache();
}
/**
 * 设置用户的信息
 */
function setUserInfo(user) {
    $("#disp_loginname").text(user.loginname);
    $("#disp_username").text(user.username);
}

/**
 * 打开个人信息
 */
function openSidePerson() {
    api.closeSlidPane();
    openPage_person();
}

/**
 * 打开系统设置
 */
function openSideSetting() {
    api.closeSlidPane();
    openPage_setting();
}

//消息中心
function openMessageCenter(){
	openPage_messagecenter();

}

/**
 * 注销帐号
 */
function logout() {
    $push.stop();
    //注销时设置islogin为false，表示未登录
    api.setPrefs({
        key : constant.AUTO_LOGIN,
        value : false
    });

//  api.clearCache(function() {
//  api.toast({
//      msg: '清除完成'
//  });
//});
    //注销时提醒后台，改用户已注销
    $client.userLoginOut( function(ret, err) {
    });
    api.execScript({
        name : 'login',
	    script: 'refreshVerify();'
    });
    //打开登录页
    api.closeToWin({
	    name: 'login'
    });
    openPage_login();
}
