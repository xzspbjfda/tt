/**
 * 系统导航工具
 */

/**
 * 将相对路径改成绝对路径的地址
 */
function getAbsoluteUrl(relativeUrl) {
    //  http://127.0.0.1:8080/html/home/win_hone.html
    //  http://127.0.0.1:8080/html/bill-list.html

    var locationUrl = window.location.href;

    var href = null;

    var debugMode = false;

    if ( typeof (isDebug) != "undefined") {
        debugMode = isDebug();
    }
    if (!debugMode) {
        var patt1 = new RegExp("/wgt/[a-zA-z0-9]+?/.+");
        var patt2 = new RegExp("/wgt/[a-zA-z0-9]+?/");

        href = patt1.exec(locationUrl);

        if (href == null) {
            patt1 = new RegExp("/widget/.+");
            patt2 = new RegExp("/widget/");

            href = patt1.exec(locationUrl);

            if (href == null) {
                //              alert(locationUrl);
                return relativeUrl;
            }
        }

        var allStr = href[0];
        var header = patt2.exec(href)[0];

        var body = allStr.substring(header.length, allStr.length);

        //将相对路径字符串前面的"/"符号去掉
        if (relativeUrl.startWith("/")) {
            relativeUrl = relativeUrl.substring(1, relativeUrl.length);
        }

        var level = body.split("/").length;

        var qianzhui = "";

        for (var i = 1; i < level; i++) {
            qianzhui += "../";
        }

        return qianzhui + relativeUrl;

    } else {
        //网页模式
        //将相对路径字符串前面的"/"符号去掉
        if (relativeUrl.startWith("/")) {
            relativeUrl = relativeUrl.substring(1, relativeUrl.length);
        }
        var url = window.location.origin + "/" + relativeUrl;

        return url;
    }
}

/**
 * 打开一个简单的容器
 * @param {Object} config
 * config的参数有：
 * name,
 * url,
 * backgroundColor
 */
function openSingleFrame(config) {

    var singlePanelUrl = getAbsoluteUrl("html/common/singlePanel.html");

    if (!config.url) {
        alert("方法openSigleFrame的config对象中缺少url参数！");
        return;
    }
    var winWidth = api.frameWidth;
    var winHeight = api.frameHeight;

    //  alert(winWidth+","+winHeight);
    api.openFrame({
        name : config.name,
        url : singlePanelUrl,
        bounces : false,
        pageParam : config,
        rect : {
            x : 0,
            y : 0,
            w : winWidth,
            h : winHeight
        }
    });
}

/**
 *打开一个简单的容器，以window窗口弹出
 * @param {Object} config
 * config的参数有：
 * name,
 * url,
 * backgroundColor
 */
function openSingleWindow(config) {

    // var singlePanelUrl = getAbsoluteUrl("html/common/singlePanel.html");
    //  if(typeof(showlog)!="undefined"){
    //      showlog("打开window页面:"+config.name+",config:"+getObj(config));
    //  }

    if ( typeof (config.url) == "undefined") {
        alert("方法openSigleFrame的config对象中缺少url参数！");
        return;
    }
    var targetUrl = getAbsoluteUrl(config.url);

    var delay = 0;

    if (config.delay) {
        delay = config.delay;
        // alert("delay:"+delay);
    }

    var bounces = false;

    if ( typeof (config.bounces) != "undefined") {
        bounces = config.bounces;
    }

    var vScrollBarEnabled = false;

    if ( typeof (config.vScrollBarEnabled) != "undefined") {
        vScrollBarEnabled = config.vScrollBarEnabled;
    }

    var hScrollBarEnabled = false;

    if ( typeof (config.hScrollBarEnabled) != "undefined") {
        hScrollBarEnabled = config.hScrollBarEnabled;
    }

    var reload = false;

    if ( typeof (config.reload) != "undefined") {
        reload = config.reload;
    }

    var slidBackEnabled = false;

    //是否支持滑动返回。iOS7.0及以上系统中，在新打开的页面中向右滑动，可以返回到上一个页面，该字段只iOS有效
    if ( typeof (config.slidBackEnabled) != "undefined") {
        slidBackEnabled = config.slidBackEnabled;
        //  alert(slidBackEnabled);
        //  consoleObj(config);
    }

    api.openWin({
        name : config.name,
        //  url : singlePanelUrl,
        url : targetUrl,
        bounces : bounces,
        slidBackEnabled : slidBackEnabled,
        delay : delay,
        vScrollBarEnabled : vScrollBarEnabled,
        hScrollBarEnabled : hScrollBarEnabled,
        reload : reload,
        pageParam : config
    });
}

/**
 * 关闭页面
 */
function closePage(pageName) {
    api.closeFrame({
        name : pageName
    });
}

function closeWinPage(pageName) {
    api.closeWin({
        name : pageName
    });
}

/**
 * 打开登录页面
 */
function openPage_login(config) {

    openSingleWindow({
        name : "login",
        url : "html/login/index.html",
        reload : true,
        backgroundColor : '#f2f2f2'
    });
}

/**
 * 关闭登录页面
 */
function closePage_login() {
    closeWinPage("login");
}

/**
 * 打开首页
 * @param autoLogin 是否自动登录
 */
function openPage_home(autoLogin) {

    openSingleWindow({
        name : "home_win",
        url : "html/home/win_home.html",
        autoLogin : autoLogin,
        delay : 300,
        reload : true,
        animation : {
            type : "push",
            subType : "from_right",
            duration : 300
        }

    });
}

/**
 * 打开首页
 * @param autoLogin 是否自动登录
 */
function openPage_modifyPwd() {
    openSingleWindow({
        name : "modifyPasswordWin",
        url : "html/system/modifyPasswordWin.html",
        delay : 300,
        reload : true,
        forceUpdate:true,
        animation : {
            type : "push",
            subType : "from_right",
            duration : 300
        }

    });
}

/**
 * 关闭首页
 */
function closePage_modifyPwd() {
    closeWinPage("modifyPasswordWin");
}

/**
 * 关闭首页
 */
function closePage_home() {
    closeWinPage("slidLayout");
}

/**
 * 打开系统设置界面
 */
function openPage_setting() {
    openSingleWindow({
        name : "systemSetting",
        url : "html/system/settingWin.html",
        bounces : false,
        vScrollBarEnabled : false,
        hScrollBarEnabled : false,
        reload : true,
        delay : 200,
        animation : {
            type : "push",
            subType : "from_right",
            duration : 300
        }
    });

}

//打开消息中心
function  openPage_messagecenter(){
	openSingleWindow({
        name : "message_list_win",
        url : "html/messagecenter/message_list_win.html",
        bounces : false,
        vScrollBarEnabled : false,
        hScrollBarEnabled : false,
        reload : true,
        delay : 200,
        animation : {
            type : "push",
            subType : "from_right",
            duration : 300
        }
    });
}

/**
 * 打开系统设置界面
 */
function openPage_person(userId) {

    if ( typeof (userId) == "undefined") {
        userId = getStorage("user").userid;
    }

    openSingleWindow({
        name : "systemPerson",
        url : "html/system/person.html",
        bounces : false,
        vScrollBarEnabled : false,
        hScrollBarEnabled : false,
        slidBackEnabled : true,
        reload : true,
        userId : userId,
        animation : {
            type : "push",
            subType : "from_right",
            duration : 300
        }
    });

}

/**
 * 打开公告详情页面
 */
function openPage_bulleDetail(url) {
    openSingleWindow({
        name : "bullDetail",
        url : "html/bulle/bulle_detail_win.html",
        bounces : false,
        vScrollBarEnabled : true,
        reload : true,
        slidBackEnabled : true,
        hScrollBarEnabled : false,
        detailUrl : url,
        animation : {
            type : "push",
            subType : "from_right",
            duration : 300
        }

    });

}

/**
 * 打开巡检监控箱-》巡检任务列表
 * @param {Object} taskId 任务ID
 * @param {Object} starttime 开始时间
 * @param {Object} fromNotifition 是否来自通知栏
 */
function openPage_MonitorTask(mainplayid,type) {
    openSingleWindow({
        name : "monitiorTaskList",
        url : "html/xunjian/monitiorTaskListWin.html",
//      url : "html/xunjian/project-listCon_win.html",
        bounces : false,
        vScrollBarEnabled : true,
        reload : true,
        slidBackEnabled : true,
        mainplayid : mainplayid,
        type:type,
        animation : {
            type : "push",
            subType : "from_right",
            duration : 300
        }
    });
}

/**
 * 打开巡检项目列表
 * @param {Object} taskId 任务ID
 * @param {Object} starttime 开始时间
 * @param {Object} fromNotifition 是否来自通知栏
 */
function openPage_taskProjectList(taskid, starttime, fromNotifition, taskstatus, readyStartTime, start_status,isMonitor,taskstate,lon,lat,stationname,stationcode,stationid,operators,county,index_id,deviceid,signtime,online,taskuser,applymajor,allusername) {
    console.log("就是这里");
    openSingleWindow({
        name : "xunjian_projectList",
        url : "html/xunjian/projectListWin.html",
//      url : "html/xunjian/project-listCon_win.html",
        signtime: signtime,
        bounces : false,
        vScrollBarEnabled :true,
        reload : true,
        slidBackEnabled : true,
        taskid : taskid,
        starttime : starttime,
        fromFlag : fromNotifition,
        taskstatus : taskstatus,
        readyStartTime : readyStartTime,
        start_status : start_status,
        isMonitor: isMonitor,
        taskstate:taskstate,
        online:online,
        taskuser:taskuser,
        applymajor:applymajor,
        allusername:allusername,
        lon:lon,
        lat:lat,
        provinceid:$api.getStorage("provinceid"),
        stationname:stationname,
        stationcode:stationcode,
        stationid:stationid,
        operators:operators,
        county:county,
        index_id:index_id,
        deviceid:deviceid,
        animation : {
            type : "push",
            subType : "from_right",
            duration : 300
        }
    });
}

/**
 * 打开巡检项目列表
 * @param {Object} taskId 任务ID
 * @param {Object} starttime 开始时间
 * @param {Object} fromNotifition 是否来自通知栏
 */
function openPage_checkProjectList() {
    openSingleWindow({
        name : "check_projectList",
        url : "html/check/checkProjectListWin.html",
//      url : "html/xunjian/project-listCon_win.html",
        bounces : false,
        vScrollBarEnabled : true,
        reload : true,
        slidBackEnabled : true,
        animation : {
            type : "push",
            subType : "from_right",
            duration : 300
        }
    });
}


function openResDetail(){

	openSingleWindow({
        name : "res_add",
        url : "html/xunjian/resAdd_frm.html",
        bounces : false,
        vScrollBarEnabled : true,
        reload : true,
        slidBackEnabled : true,
        animation : {
            type : "push",
            subType : "from_right",
            duration : 300
        }

    });


}

/**
 * 打开巡检项目详情
 * @param {Object} project
 */
function openPage_project_detail(taskid, projectid, projectname, isFinish, editEnabled, taskstatus, start_status,isMonitor,objtype,devname,taskstate,modularid,modularname) {

    openSingleWindow({
        name : "projectDetailNew_win",
        url : "html/xunjian/projectDetailNew_win.html",
        bounces : false,
        vScrollBarEnabled : true,
        reload : true,
        slidBackEnabled : true,
        taskid : taskid,
        projectid : projectid,
        projectname : projectname,
        isFinish : isFinish,
        editEnabled : editEnabled,
        taskstatus : taskstatus,
        start_status : start_status,
        isMonitor: isMonitor,
        objtype: objtype,
        devname: devname,
        taskstate:taskstate,
        modularid:modularid,
        modularname:modularname ,
        animation : {
            type : "push",
            subType : "from_right",
            duration : 300
        }

    });
}
