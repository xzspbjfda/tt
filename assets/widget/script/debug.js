String.prototype.endWith = function(str) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length)
        return false;
    if (this.substring(this.length - str.length) == str)
        return true;
    else
        return false;
    return true;
}
String.prototype.startWith = function(str) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length)
        return false;
    if (this.substr(0, str.length) == str)
        return true;
    else
        return false;
    return true;
}
/**
 *是否是调试模式形式
 */
function isDebug() {
    var href = window.location.href;

    if (href.startWith("http://")) {
        return true;
    } else {//生产环境 ：file:///
        return false;
    }
}

var debugAPI = debugAPI || {};
//debugAPI.winWidth = $(document).width();
//debugAPI.winHeight = $(document).height();
//判断调试环境
//平台、设备和操作系统
var debug = false;
var system = {
    win : false,
    mac : false,
    xll : false
};

if (isDebug()) {
    debug = true;
    api = debugAPI;
    debugAPI.winWidth = $(document).width();
    debugAPI.winHeight = $(document).height();
    debugAPI.winName = window.location.href;

    //模拟设置gps
    //  if ( typeof ($api.getStorage("LAST_GPS_LOCATION")) == "undefined") {
    //      var lastLocation = {
    //          status : false, //操作成功状态值
    //          longitude : 21, //经度
    //          latitude : 100, //纬度
    //          timestamp : 0 //时间戳
    //      };
    //      $api.setStorage("LAST_GPS_LOCATION", lastLocation);
    //  }
}

//设备类型(默认web)
debugAPI.systemType = 'web';
//页面参数pageParam
debugAPI.pageParam = debugAPI.pageParam || {};
debugAPI.pageParam = getUrlParameter(debugAPI.pageParam);
debugAPI.winName = window.top.name;
debugAPI.frameName = window.name;
debugAPI.connectionType = 'web';
//获得pageParam
function getUrlParameter(pageParam) {
    //通过参数名得到它的值
    try {
        var paramUrl = decodeURI(window.location.search);

        //这里得到是：?id=1&name=lxy&age=23
        //处理长度
        if (paramUrl.length > 0) {
            paramUrl = paramUrl.substring(1, paramUrl.length);
            //这里得到的是：id=1&name=lxy&age=23
            var paramUrlArray = paramUrl.split("&");
            for (var i = 0; i < paramUrlArray.length; i++) {
                var temp = paramUrlArray[i].split("=");
                pageParam[temp[0]] = temp[1];
            }
        }
    } catch (e) {
    }
    return pageParam;
}

debugAPI.ajax = function(params, callback) {
    //采用jQuery的异步请求
    var url = params.url;
    url = url.replace('service', 'serviceCallback');
    if (params.data && params.data.values) {
        $.getJSON(url + "&callback=?", params.data.values, function(ret) {
            if (ret) {
                if (ret.status == "OK") {
                    ret.success = true;
                } else {
                    ret.success = false;
                }
                if ( typeof (callback) != 'undefined') {
                    callback(ret, null);
                }
            }
        });
    } else {
        $.getJSON(url, function(ret) {
            if (ret) {
                if (ret.status == "OK") {
                    ret.success = true;
                } else {
                    ret.success = false;
                }
                if ( typeof (callback) != 'undefined') {
                    callback(ret, null);
                }
            }
        });
    }
}

debugAPI.openSlidLayout = function(params) {
    document.location.href = params.slidPane.url;
}

debugAPI.openWin = function(params) {
    var url = params.url;
    var name = params.name;
    var urlParams = '';
    var pageParam = params.pageParam;
    for (var param in pageParam) {
        if (param == 'url')
            continue;
        urlParams += param + "=" + pageParam[param] + '&';
    }
    if (urlParams.length != 0) {
        url += "?" + urlParams.substr(0, urlParams.length - 1);
    }
    window.open(url, name);
    //top.window.location.href = url;
}

debugAPI.openFrame = function(params, callback) {
    if (params.reload) {
        var frame = window.frames[params.name];
        if (frame) {
            frame.eval("apiready()");
            return;
        }
    }
    //  var iframe = $('iframe[name=' + params.name + ']', parent.document.body);
    var url = params.url;
    var urlParams = '';
    var pageParam = params.pageParam;
    for (var param in params.pageParam) {
        urlParams += param + "=" + pageParam[param] + '&';
    }

    if (urlParams.length != 0) {
        url += "?" + urlParams.substr(0, urlParams.length - 1);
    }
    var iframe = $('<iframe></iframe>');
    var defaultRect = {
        x : 0,
        y : 0,
        w : $(document).width(),
        h : $(document).height()
    };
    if (isExist(params.rect)) {
        if (isExist(params.rect.w) && params.rect.w != 'auto') {
            defaultRect.w = params.rect.w;
        }
        if (isExist(params.rect.h) && params.rect.h != 'auto') {
            defaultRect.h = params.rect.h;
        } else {
            defaultRect.h = $(document).height() - params.rect.y;
        }
        if (isExist(params.rect.x)) {
            defaultRect.x = params.rect.x;
        }
        if (isExist(params.rect.y)) {
            defaultRect.y = params.rect.y;
        }
    }
    iframe.attr('src', url);
    iframe.attr('name', params.name);
    iframe.attr('scrolling', "auto");
    iframe.css({
        'position' : 'absolute',
        'top' : defaultRect.y,
        'left' : defaultRect.x,
        'width' : defaultRect.w,
        'height' : defaultRect.h,
        'z-index' : 999,
    });

    if (isExist(params.vScrollBarEnabled) && params.vScrollBarEnabled) {
        iframe.css('overflow-x', 'scroll');
    }

    if (isExist(params.hScrollBarEnabled) && params.hScrollBarEnabled) {
        iframe.css('overflow-y', 'scroll');
    }
    $('body', parent.document).append(iframe);
    //  window.open(url, params.name);
}

debugAPI.frameGroup = {};
debugAPI.frameGroupCallback = {};
debugAPI.openFrameGroup = function(params, callback) {
    var frames = params.frames;
    debugAPI.frameGroup[params.name] = frames;
    for (var i = 0, size = frames.length; i < size; i++) {
        frames[i].rect = params.rect;
        debugAPI.openFrame(frames[i]);
    }
    var index = params.index || 0;

    debugAPI.bringFrameToFront({
        from : frames[index].name
    });
    this.frameGroupCallback[params.name] = callback;
    callback({
        index : index,
        name : params.name
    });
}

debugAPI.setFrameGroupIndex = function(params) {
    var index = params.index;
    $('iframe:eq(' + index + ')', window.top.document).show().siblings('iframe').hide();
    this.frameGroupCallback[params.name]({
        index : index,
        name : params.name
    })
}

debugAPI.setFrameGroupAttr = function(params) {
    var name = params.name;
    var hidden = params.hidden;
    var frames = this.frameGroup[params.name];

    for (var index = 0; index < frames.length; index++) {
        var $iframe = $('iframe[name=' + frames[index].name + ']', window.top.document);
        if (hidden)
            $iframe.hide();
        else
            $iframe.show();
    }
}

debugAPI.bringFrameToFront = function(params) {
    $('iframe[name=' + params.from + ']', top.document.body).show().siblings('iframe').hide();

}

debugAPI.closeWin = function(params) {
    //  history.back();
    window.top.close();
}

debugAPI.closeFrame = function(params) {
    var frameName = null;
    if (isExist(params) && isExist(params.name)) {
        frameName = params.name;
    } else {
        frameName = window.name;
    }
    var iframe = $('iframe[name=' + frameName + ']', parent.document.body);
    if (isExist(iframe)) {
        iframe.remove();
    }
}

debugAPI.closeWidget = function(params) {
    //不执行操作
}

debugAPI.addEventListener = function(params, callback) {
    if (window.attachEvent) {
        window.attachEvent("onload", callback);
        //IE
    } else {
        window.addEventListener("load", callback, false);
        //FF
    }
}
//进度条展示和隐藏
debugAPI.showProgress = function(params) {
    //  alert(params.title);
}

debugAPI.hideProgress = function() {
}

debugAPI.notification = function() {
}

debugAPI.test = function() {
    alert("This is DebugMode");
}

debugAPI.toast = function(params) {
    if ( typeof $aui != 'undefined')
        $aui.toast(params);
    else
        alert(params.msg);
}

debugAPI.confirm = function(params, callback) {
    if (confirm(params.title)) {
        var ret = {
            buttonIndex : 2
        }
        callback(ret);
    }
}
debugAPI.prompt = function(params, callback) {
    var text = window.prompt(params.title, params.text);
    callback({
        buttonIndex : 1,
        text : text
    });
}

debugAPI.startLocation = function(params, callback) {
    //模拟定位
    var ret = {
        status : true, //操作成功状态值
        longitude : 116.213, //经度
        latitude : 39.213, //纬度
        timestamp : 1396068155591 //时间戳
    }
    var err = {
        msg : ""
    }
    callback(ret, err);
}

debugAPI.stopLocation = function() {
    //不执行操作
}

debugAPI.setRefreshHeaderInfo = function(params, callback) {
    //不执行操作
}

debugAPI.refreshHeaderLoadDone = function() {
    //不执行操作
}

debugAPI.parseTapmode = function() {
    //不执行操作
}

debugAPI.setStatusBarStyle = function(params) {
    //不执行操作
}

debugAPI.require = function(name) {
    //不执行操作
}

debugAPI.setFrameAttr = function(params) {
    var hidden = params.hidden;
    var iframe = $('iframe[name=' + params.name + ']', parent.document.body);
    if (isExist(iframe)) {
        var hidden = params.hidden;
        if (isExist(hidden)) {
            iframe.css('display', hidden ? 'none' : 'block');
        }
        return;
    }
}
//窗口win和帧frame
debugAPI.execScript = function(params) {
    var name = params.name;
    var frameName = params.frameName;
    var script = params.script;
    var win = window.top;
    if (isExist(name) && isExist(frameName)) {
        win = window.open('', name);
        var frame = win.frames[frameName];
        frame.eval(script);
    } else if (isExist(name) && !isExist(frameName)) {
        win = window.open('', name);
        win.eval(script);
    } else if (!isExist(name) && isExist(frameName)) {
        var frame = win.frames[frameName];
        frame.eval(script);
    } else {
        return false;
    }
    return true;
}

debugAPI.historyBack = function() {
    history.back();
}

debugAPI.getPicture = function(params, callback) {
    if (isExist(callback)) {
        callback();
    }
}

debugAPI.getPrefs = function(params, callback) {
    var ret = {
        value : $api.getStorage(params.key)
    };
    var err = {};
    callback(ret, err);
}

debugAPI.setPrefs = function(params) {
    $api.setStorage(params.key, params.value);
}
//缓存数据，提供测试环境使用
var storageData = {

    user : {
        userid : '0001133'
    }
};

if (debug) {
    window.onload = function() {

        if ( typeof (apiready) != "undefined") {
            apiready();
        }
    }
}

