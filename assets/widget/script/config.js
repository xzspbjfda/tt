//配置文件
var sysConfig = {};
var localIp = "192.168.1.9";
var host = {
    // 本地
    local: {
        ip: localIp,
        port: 8082,
    },
    // 测试
    test: {
        ip: "111.205.145.243",
        port: 58092,
    },
    // 验收
    check: {
        ip: "120.52.136.2",
        port: 10269,
    },
    // 专项验收
    maincheck: {
        ip: "120.52.136.2",
        port: 10272
    },
    // 准生产
    staging: {
        ip: "49.4.2.125",
        port: 58090
    },
    prod: {
        ip: "180.153.49.251",
        port: 58090
    },
    // 不指定环境时的默认值(生产)
    default: {
        ip: "180.153.49.251",
        port: 58090
    },
};

var IP_PORT = host.prod.ip + ":" + host.prod.port
// 环境配置
var envConfig = {
    // 勾选验收环境时的请求地址前缀
    reqTestHost:{
        // 本地
        local:localIp + ":8082",
        // 测试
        test:"111.205.145.243:58092",
        // 验收
        check:"120.52.136.2:10269",
        // 专项验收
        maincheck:"120.52.136.2:10272",
        // 准生产
        staging:"49.4.2.125:58090",
        // 不指定环境时的默认值(生产)
        default: IP_PORT,
    },
    // 勾选验收环境时的新服务根目录
    newServerBaseUrl:{
        // 本地
        local:"http://" + localIp + "/newItower/",
        // 测试
        test:"http://111.205.145.243:58092/newItower/",
        // 准生产
        staging:"http://49.4.2.125:58090/newItower/",
        // 不指定环境时的默认值(生产)
        default:"http://" + IP_PORT + "/newItower/",
        // 生产
        prod:"http://" + IP_PORT + "/newItower/",
    },
    // 浪潮接口请求根目录
    riskTipUri:{
        default:"views/riskTip/index.html",
    },
    // 浪潮接口请求根目录
    lcServerBaseUrl:{
        // 不指定环境时的默认值(生产)
        // default:"http://117.78.18.215:65240/",
        check:"http://" + host.check.ip + ":58081/",
        prod:"http://180.153.49.172:50080/",
        default:"http://chntoms.tower0788.cn:8989/",
    },
    /**
     * 密码是否需要使用AES算法加密
     * 2021-10-26 增加了修改密码请求时也联动此项
     */
    passwordAes:{
        // 不指定环境时的默认值
        staging: true,
        check: true,
        prod: true,
        default:true,
    },
    // 能源工单地址
    energyOrderHref:{
        // 测试
        test:"http://180.153.49.157:8090/app/A6179887290058/html/daiban/daiban_frm.html",
        // 准生产
        staging:"http://49.4.50.96:8090/app/A6179887290058/html/daiban/daiban_frm.html",
        // 生产
        prod:"http://180.153.49.85:58090/app/A6179887290058/html/daiban/daiban_frm.html",
        // 默认(验收地址)
        default:"http://" + host.check.ip + ":8090/app/A6179887290058/html/daiban/daiban_frm.html"
    }

}
var ENV_LOCAL_STORAGE_KEY = "env";
var INIT_ENV_LOCAL_STORAGE_KEY = "init_env";
var EnvManager = function(env,options = {}){
    console.log("【初始环境】",env)
    if(!$api.getStorage(INIT_ENV_LOCAL_STORAGE_KEY)){
        $api.setStorage(INIT_ENV_LOCAL_STORAGE_KEY,env);
    }
    var cache = $api.getStorage(ENV_LOCAL_STORAGE_KEY);
    if(cache !== null && cache !== undefined){
        env = cache;
    }else{
        if(env === undefined){
            env = ENV_ENUM.DEFAULT;
        }
    }
    this._env = env;
    this._options = options;
    this.load(env,options);
}
if(window.name === "login" && $api.getStorage(ENV_LOCAL_STORAGE_KEY)){
    $api.rmStorage(ENV_LOCAL_STORAGE_KEY);
    $api.rmStorage(INIT_ENV_LOCAL_STORAGE_KEY);
}

//配置生存库服务器
var host = $api.getStorage('host');
if ( typeof host == 'undefined'||typeof host == '') {
    $api.setStorage('hostUnit', '集团');
    $api.setStorage('host', IP_PORT);
    sysConfig.host = IP_PORT;
} else {
    sysConfig.host = IP_PORT;
}

EnvManager.prototype.isPasswordEncrypt = function(){
    return this.passwordAes;
}
EnvManager.prototype.getRiskTipUrl = function(){
    console.log("获取到地址")
    var a=this.newServerBaseUrl + "views/riskTip/index.html";
    console.log(a)
    return a;
}
EnvManager.prototype.getRiskTipUrlTest = function(){
    return "http://" + localIp + "/newItower/" + this.riskTipUri;
}
EnvManager.prototype.load = function(e,options = {}){
    console.log("【更改环境变量】",e);
    if(window.name !== "login" && $api.getStorage(ENV_LOCAL_STORAGE_KEY)){
        e = $api.getStorage(ENV_LOCAL_STORAGE_KEY);
    }
    $api.setStorage(ENV_LOCAL_STORAGE_KEY,e);
    var _this = this;
    _this._env = e;
    _this._options = options;
    var _c = envConfig;
    var ENV_ENUMSTR="";
    for (var val in ENV_ENUM) {
        ENV_ENUMSTR+=ENV_ENUM[val]+","
    }
    if(!ENV_ENUMSTR.indexOf(env) === -1){
        let info = `严重错误！未知环境${env}`;
        alert(info);
        throw new Error(info);
    }
    Object.keys(_c).forEach((k,index)=>{
        let v = _c[k][_this._env];
        if(v === undefined && _this._options.useDefault !== false){
            v = _c[k]["default"] || undefined;
        }
        _this[k] = v;
    });
    _this.onload && _this.onload();
    refreshAddresses(_this);
}
EnvManager.prototype.begin = function(){
    this.load($api.getStorage(INIT_ENV_LOCAL_STORAGE_KEY));
}
// alert("【会话缓存中的环境变量】"+ $api.getStorage(ENV_LOCAL_STORAGE_KEY));
// 环境枚举
var ENV_ENUM = {
    // 本地环境
    LOCAL:"local",
    // 测试环境(好像不需要)
    TEST:"test",
    // 验收环境
    CHECK:"check",
    // 专项验收环境
    MAINCHECK:"maincheck",
    // 准生产环境
    STAGING:"staging",
    // 生产环境
    PROD:"prod",
    // 默认(生产)
    DEFAULT:"prod",
}

// 环境管理器实例生成，修改环境只需修改构造器中的枚举即可
var env = new EnvManager(ENV_ENUM.CHECK);
// env.onload = function (){
//     alert(env.energyOrderHref);
// }
// 构造方法上的环境是指"验收环境"被勾选时的环境，所以固定在此先切换成生产环境
if(window.name === "login"){
    env.load(ENV_ENUM.PROD);
}
$api.setStorage("ip", IP_PORT); // 本地缓存覆盖，固定 ip 

//配置测试库服务器
//sysConfig.testHost = '114.116.254.193:42130';//新开发测试环 境
//sysConfig.testHost = '101.227.240.166:58090';//生产环 境
// sysConfig.testHost = '49.4.2.125:58090';//准生产环 境
// sysConfig.testHost = '120.52.136.2:10269';//验收环 境
//验收环 境
 // sysConfig.testHost = '192.168.1.113:8082';//本地环境

function refreshAddresses(e){
    var env = e || window.env;
    sysConfig.testHost = env.reqTestHost;
    //web的服务器端IP
    sysConfig.serverUrl = "http://" + sysConfig.host + "/itower/mobile/app/service";
//web的测试端服务器Ip
    sysConfig.serverUrl_test = "http://" + sysConfig.testHost + "/itower/mobile/app/service";

//web端的正式服务器IP
    sysConfig.serverUrl_main = "http://" + sysConfig.host + "/itower/mobile/app/service";
    
    if('180.153.49.251:58090' == sysConfig.host){
        sysConfig.serverUploadUrl = "http://180.153.49.251:59015/itower/mobile/app/projectUnpressImgUpload";
    }else{
        sysConfig.serverUploadUrl = "http://" + sysConfig.host + "/itower/mobile/app/projectUnpressImgUpload";
    }
//if("101.227.240.166:58090"==sysConfig.testHost){
//sysConfig.serverUploadUrl_test = "http://180.153.49.251:59015/itower/mobile/app/projectUnpressImgUpload";
//}else{
    sysConfig.serverUploadUrl_test = "http://" + sysConfig.testHost + "/itower/mobile/app/projectUnpressImgUpload";
//}

    sysConfig.serverDownUrl = "http://" + sysConfig.host + "/itower/mobile/app/projectImgDownload";

    sysConfig.serverDownUrl_test = "http://" + sysConfig.testHost + "/itower/mobile/app/projectImgDownload";

    sysConfig.pushLogUrl = "http://" + sysConfig.host + "/itower/jf/push/pushReceive";
    sysConfig.pushLogUrl_test = "http://" + sysConfig.testHost + "/itower/jf/push/pushReceive";

    sysConfig.appDownUrl = "http://" + sysConfig.host + "/itower/mobile/clientapi";
    sysConfig.appDownUrl_test = "http://" + sysConfig.testHost + "/itower/mobile/clientapi";
}

// refreshAddresses();

/**
 *log测试地址
 */
logDebugServerUrl = "http://192.168.31.169:8080/itower/jf/sysLog/console";

function changeHost(host) {
    sysConfig.host = host;
    sysConfig.serverUrl = "http://" + host + "/itower/mobile/app/service";
    if("180.153.49.251:58090" == host){
    sysConfig.serverUploadUrl = "http://180.153.49.251:59015/itower/mobile/app/projectUnpressImgUpload";
    }else{
     sysConfig.serverUploadUrl = "http://" + host + "/itower/mobile/app/projectUnpressImgUpload";
    }
    sysConfig.serverDownUrl = "http://" + host + "/itower/mobile/app/projectImgDownload";
    sysConfig.pushLogUrl = "http://" + host + "/itower/jf/push/pushReceive";
    sysConfig.appDownUrl = "http://" + host + "/itower/mobile/clientapi";
}

function changeTestHost(testHost) {
    sysConfig.testHost = testHost;
    sysConfig.serverUrl_test = "http://" + testHost + "/itower/mobile/app/service";
    sysConfig.serverUploadUrl_test = "http://" + testHost + "/itower/mobile/app/projectUnpressImgUpload";
    sysConfig.serverDownUrl_test = "http://" + testHost + "/itower/mobile/app/projectImgDownload";
    sysConfig.pushLogUrl_test = "http://" + testHost + "/itower/jf/push/pushReceive";
    sysConfig.appDownUrl_test = "http://" + testHost + "/itower/mobile/clientapi";
}

var refreshHostTimer = window.setTimeout(function() {
    var hostStorages = $api.getStorage('hostStorages') || {};
//  $.getJSON('http://180.153.49.253:58090/iplist.json', function(hostStorages) {
//      if ( typeof hostStorages != 'undefined') {
//          $api.setStorage('hostStorages', hostStorages);
//      }
//      var hostUnit = $api.getStorage('hostUnit');
//      changeHost(hostStorages[hostUnit]);
//  });
    api.ajax({
        url : 'http://' + IP_PORT + '/iplist.json'
    }, function(ret, err) {
        if (ret) {
            if (ret.body) {
                hostStorages = ret;
                if ( typeof hostStorages != 'undefined') {
                    $api.setStorage('hostStorages', hostStorages);
                }
                var hostUnit = $api.getStorage('hostUnit');
                changeHost(hostStorages[hostUnit]);
            }
        } else {
            api.toast({
                msg : err.msg
            });
        }
    });
}, 60 * 60 * 1000);
