var TOKEN_KEY = "Authorization";
function resolvePath(path,abs){
    if(abs === true){
        return path;//.replace(/[^:](\/\/)/g,"/");
    }
    return (env.newServerBaseUrl + path).replace(/\/\//g,"/");
}
function getHeaders(ex,abs){
    if(abs === true){
        return headers;
    }
    var headers = {};
    headers[TOKEN_KEY] = $api.getStorage("Authorization");
    if(ex){
        $.extend(headers,ex);
    }
    return headers;
}

function service(options,callback){
    var url = resolvePath(options.url,options.abs);
    console.log("【n请求地址】:",url);
    console.log("【n请求数据】:",JSON.stringify(options.data));
    var time1 = new Date().getTime();
    var autoCloseProgress = options.autoCloseProgress === undefined ? true : options.autoCloseProgress;
    var showProgress = options.showProgress === undefined ? true : options.showProgress;
    if(showProgress){
        api.showProgress();
    }
    $.ajax({
        url: url,
        method: options.method || "post",
        headers:getHeaders(options.headers,options.abs),
        timeout: 300000,
        dataType: 'json',
        contentType:options.contentType === undefined ? undefined : options.contentType,
        traditional:options.traditional === undefined ? false : options.traditional,
        processData:options.processData === undefined ? true : options.processData,
        data:options.data,
        success:function(ret){
            let time2 = new Date().getTime();
            let time = time2 - time1;
            console.log(`【n请求结束】${url},耗时:${time}ms`);
            console.log(`【n请求响应】`,JSON.stringify(ret));
            if (callback != null) {
                callback(ret);
                if(autoCloseProgress){api.hideProgress();}
            }
        },
        error:function(err,status){
            let time2 = new Date().getTime();
            let time = time2 - time1;
            console.log(`【n请求出错】${url},耗时:${time}ms`,JSON.stringify(err));
            api.hideProgress();
        },
        complete : function(XMLHttpRequest,status){
            if(status==='timeout'){
                api.toast({msg:"请求超时！"});
            }
        }
    });
}
function service2(options,callback){
    var url = resolvePath(options.url);
    console.log("【n请求地址2】:",url);
    console.log("【n请求数据2】:",JSON.stringify(options.data));
    var time1 = new Date().getTime();
    var autoCloseProgress = options.autoCloseProgress === undefined ? true : options.autoCloseProgress;
    var showProgress = options.showProgress === undefined ? true : options.showProgress;
    if(showProgress){
        // api.showProgress();
    }
    $.ajax({
        url: url,
        method: options.method || "post",
        headers:getHeaders(options.headers),
        timeout: 30000,
        dataType: 'json',
        traditional:options.traditional || false,
        data:options.data,
        success:function(ret){
            let time2 = new Date().getTime();
            let time = time2 - time1;
            console.log(`【n请求结束2】${url},耗时:${time}ms`);
            console.log(`【n请求响应2】`,JSON.stringify(ret));
            if (callback != null) {
                callback(ret);
                if(autoCloseProgress){
                    // api.hideProgress();
                }
            }
        },
        error:function(err){
            let time2 = new Date().getTime();
            let time = time2 - time1;
            console.log(`【n请求出错2】${url},耗时:${time}ms`,JSON.stringify(err));
            // api.hideProgress();
        }
    });
}
service.post = function(options,callback){
    options.headers = options.headers || {};
    options.headers['Content-Type'] = "application/json";
    options.data = JSON.stringify(options.data || {});
    service(options,callback);
}
service.get = function(options,callback){
    options.method = "get";
    options.headers = options.headers || {};
    options.headers['Content-Type'] = "application/x-www-form-urlencoded";
    service(options,callback);
}
service.formDataReq = function(options,callback){
    options.headers = options.headers || {};
    options.traditional = false;
    options.processData = false;
    options.contentType = false;
    service(options,callback);
}
service.serialization = function(el){
    var list = $(el).find("[form-param]");
    var ret = {};
    for(var i = 0;i < list.length;i++){
        var e = $(list[i]);
        if(e.attr("form-param") !== ""){
            ret[e.attr("form-param")] = e.val();
        }else if(e.attr("name")){
            ret[e.attr("name")] = e.val();
        }else{
            ret[e.attr("id")] = e.val();
        }
    }
    return ret;
}
service.fillForm = function(selector,data){
    var el = $(selector);
    // for(var key in data){
    var keys = Object.keys(data);
    for(var i = 0;i < keys.length;i++){
        var key = keys[i];
        var e = $(el).find("[form-field='" + key + "']");
        if(e.length > 0){
            e.val(data[key]);
            continue;
        }
        e = $(el).find("#" + key + "[form-field]");
        if(e.length > 0){
            e.val(data[key]);
        }

    }
}
// 将指定dom容器下带有form-data属性的标签序列化为json
service.serializationStr = function(el){
    return JSON.stringify(service.serialization(el))
}
// 获取字典值
service.getDict = function(code,callback){
    service({url:"/dict/getByDictCode.do",method:"get",data:{dictCode:code}},function(res){callback(res)})
}
/**
 * 批量获取字典值
 * @param codes 要查询的字典code数组
 * @param callback
 */
service.getDictList = function(codes,callback){
    service({url:"/dict/getByDictCodes.do",method:"post",traditional:true,data:{codes:codes}},function(res){callback(res)})
}
function closeWin(){api.closeWin()}
window.request = service;
String.prototype.toDate = function(style) {
     if (style == null) style = 'yyyy-MM-dd hh:mm:ss';
     var o = {
         'y+' : 'y',
         'M+' : 'M',
         'd+' : 'd',
         'h+' : 'h',
         'm+' : 'm',
         's+' : 's'
     };
     var result = {
         'y' : '',
         'M' : '',
         'd' : '',
         'h' : '00',
         'm' : '00',
         's' : '00'
     }
     var tmp = style;
     for (var k in o) {
         if (new RegExp('(' + k + ')').test(style)) {
             result[o[k]] = this.substring(tmp.indexOf(RegExp.$1), tmp.indexOf(RegExp.$1) + RegExp.$1.length);
         }
     }
     return new Date(result['y'], result['M'] - 1, result['d'], result['h'], result['m'], result['s']);
};
