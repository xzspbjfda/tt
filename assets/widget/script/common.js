/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern = function(fmt) {
	var o = {
		"M+" : this.getMonth() + 1, //月份
		"d+" : this.getDate(), //日
		"h+" : this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
		"H+" : this.getHours(), //小时
		"m+" : this.getMinutes(), //分
		"s+" : this.getSeconds(), //秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), //季度
		"S" : this.getMilliseconds() //毫秒
	};
	var week = {
		"0" : "/u65e5",
		"1" : "/u4e00",
		"2" : "/u4e8c",
		"3" : "/u4e09",
		"4" : "/u56db",
		"5" : "/u4e94",
		"6" : "/u516d"
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}
function format(time) {
	time = time.replace(/T/, " ").replace(/\.\d+/, "");
	//如果出现不带有秒数的时间字符串，补充
	if (!(/\d{2}:\d{2}:\d{2}/.test(time))) {
		return time += ':00';
	}
	return time;
}

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

String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
	if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
		return this.replace(new RegExp(reallyDo, ( ignoreCase ? "gi" : "g")), replaceWith);
	} else {
		return this.replace(reallyDo, replaceWith);
	}
}
/*
 *  方法:Array.remove(dx) 通过遍历,重构数组
 *  功能:删除数组元素.
 *  参数:dx删除元素的下标.
 */
Array.prototype.remove = function(dx) {
	if (isNaN(dx) || dx > this.length) {
		return false;
	}
	for (var i = 0, n = 0; i < this.length; i++) {
		if (this[i] != this[dx]) {
			this[n++] = this[i]
		}
	}
	this.length -= 1
}
function getType(o) {
	var _t;
	return (( _t = typeof (o)) == "object" ? o == null && "null" || Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
}

/**
 *数组深度复制
 */
function extend(destination, source) {
	for (var p in source) {
		if (getType(source[p]) == "array" || getType(source[p]) == "object") {
			destination[p] = getType(source[p]) == "array" ? [] : {};
			arguments.callee(destination[p], source[p]);
		} else {
			destination[p] = source[p];
		}
	}
}

var systemMode = 2;

var systemLocalPath = "";
//系统的根目录

/**
 *获取系统系统运行模式
 * 0：web
 * 1：手机测试环境
 * 2：手机正式环境
 */

var locationUrl = window.location.href;

if (locationUrl.startWith("http://")) {
	systemMode = 0;
} else {
	var patt1 = new RegExp("/wgt/[a-zA-z0-9]+?/.+");

	href = patt1.exec(locationUrl);

	if (href == null) {
		systemMode = 2;
	} else {
		systemMode = 1;
	}

}

//使用手机进行运行，获取根目录的地址
if (systemMode > 0) {
	var patt1 = new RegExp(".+/html/");
	var href = patt1.exec(locationUrl);

	if (href != null) {
		href = href[0];
		//      systemLocalPath = href.substring(7, href.length - 6);
		//      systemLocalPath = href.substring(href.indexOf(':///'),href.length - 6);
		systemLocalPath = href.substring(0, href.length - 6);
		systemLocalPath = systemLocalPath.replace("/wgt/", "/");
		systemLocalPath = systemLocalPath.replace("/widget/", "/");

		///storage/emulated/0/UZMap/A6973002767421
		//alert(systemLocalPath);
	}
}

//alert(locationUrl+",systemModel:"+systemMode);

//判断是否是数字
function checkRate(data) {
	var re = /^[0-9]+.?[0-9]*$/;
	if (data != null) {
		return re.test(data);
	} else {
		return false;
	}

}

//是否存在指定变量
function isExist(variable) {
	try {
		if ( typeof (variable) == "undefined") {
			return false;
		} else {
			return true;
		}
	} catch(e) {
	}
	return false;
}

function isEmpty(obj) {
	try {
		if ( typeof (obj) == 'string' || typeof (obj) == 'list') {
			if (obj != null && obj.length > 0)
				return true;
			else
				return false;
		}
	} catch(e) {
		alert('funtion isEmpty has error!!');
	}
	return false;
}

function openWin(name, url) {
	var urlStr = '';
	if (isExist(url)) {
		urlStr += url;
	} else {
		urlStr += name + '.html'
	}
	api.openWin({
		name : name,
		url : urlStr,
		opaque : true,
		bounces : false,
		vScrollBarEnabled : false,
		pageParam : api.pageParam
	});
}

function openFrame(name, url, rect) {
	var urlStr = '';
	if (isExist(url)) {
		urlStr += url;
	} else {
		urlStr += name + '.html';
	}
	api.openFrame({
		name : name,
		url : urlStr,
		bounces : false,
		scrollToTop : true,
		rect : rect,
		pageParam : api.pageParam
	});
}

function tranMainHome() {
	//根据觉得路径获取相对路径
	var targetFixedUrl = getAbsoluteUrl('html/home/home_fixed.html');
	var targetSlidUrl = getAbsoluteUrl('html/home/home_win.html');
	api.openSlidLayout({
		type : 'left',
		leftEdge : api.winWidth / 4,
		bounces : false,
		vScrollBarEnabled : true,
		fixedPane : {
			name : 'home_fixed',
			url : targetFixedUrl,
			bounces : false,
			bgColor : '#fff'
		},
		slidPane : {
			name : 'home_win',
			url : targetSlidUrl,
			bounces : false,
			scaleEnabled : false,
			bgColor : '#fff'
		}
	}, function(ret) {

	});
}

function backHome() {
	if (api.pageParam.pushFlag == "PUSH") {
		tranMainHome();
	} else {
		api.closeWin();
	}
}

//user
function delWord(el) {
	var input = $api.prev(el, '.txt');
	input.value = '';
}

function edit(el) {
	var del = $api.next(el, '.del');
	if (el.value) {
		$api.addCls(del, 'show');
	}
	$api.addCls(el, 'light');
}

function cancel(el) {
	var del = $api.next(el, '.del');
	$api.removeCls(del, 'show');
	$api.removeCls(el, 'light');
}

function addData(data, str) {
	if (!data) {
		data = str;
	} else {
		if (data.indexOf(str) > -1) {
			return;
		} else {
			data = data + ',' + str;
		}
	}

	return data;
}

//favorite
function collect(el, type) {
	var uid = $api.getStorage('uid');
	//login
	if (!uid) {
		api.openWin({
			name : 'userLogin',
			url : './userLogin.html',
			opaque : true,
			vScrollBarEnabled : false
		});
		return;
	}

	//news id, activity id, merchant id
	var thisId = $api.attr(el, 'news-id') || $api.attr(el, 'act-id') || $api.attr(el, 'mer-id');

	var userFavUrl = '/user/' + uid + '/' + type;
	var bodyParam = {};
	switch (type) {
		case 'act_fav':
			bodyParam['activity'] = thisId;
			break;
		case 'news_fav':
			bodyParam['news'] = thisId;
			break;
		case 'mer_fav':
			bodyParam['merchant'] = thisId;
			break;
	}
	ajaxRequest(userFavUrl, 'post', JSON.stringify(bodyParam), function(ret, err) {
		if (ret) {
			$api.html(el, "已收藏");
			$(el).off('click').on('click', function() {
				uncollect(type, ret.id, this);
			})
		} else {
			api.toast({
				msg : '收藏失败'
			})
		}
	})
}

function uncollect(_class, id, el) {
	try {
		var deleteAct_favById = '/' + _class + '/' + id;
		ajaxRequest(deleteAct_favById, 'delete', '', function(ret, err) {
			if (ret) {
				$api.html(el, "收藏");
				$(el).off('click').on('click', function() {
					collect(this, _class);
				})
			} else {
				api.toast({
					msg : '操作失败'
				})
			}
		})
	} catch (e) {
		alert(e)
	}

}

/**
 * Created by Administrator on 2014/12/17.
 */
/**
 *
 *  Secure Hash Algorithm (SHA1)
 *  http://www.webtoolkit.info/
 *
 **/

function SHA1(msg) {

	function rotate_left(n, s) {
		var t4 = (n << s ) | (n >>> (32 - s));
		return t4;
	};

	function lsb_hex(val) {
		var str = "";
		var i;
		var vh;
		var vl;

		for ( i = 0; i <= 6; i += 2) {
			vh = (val >>> (i * 4 + 4)) & 0x0f;
			vl = (val >>> (i * 4)) & 0x0f;
			str += vh.toString(16) + vl.toString(16);
		}
		return str;
	};

	function cvt_hex(val) {
		var str = "";
		var i;
		var v;

		for ( i = 7; i >= 0; i--) {
			v = (val >>> (i * 4)) & 0x0f;
			str += v.toString(16);
		}
		return str;
	};

	function Utf8Encode(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	};

	var blockstart;
	var i, j;
	var W = new Array(80);
	var H0 = 0x67452301;
	var H1 = 0xEFCDAB89;
	var H2 = 0x98BADCFE;
	var H3 = 0x10325476;
	var H4 = 0xC3D2E1F0;
	var A, B, C, D, E;
	var temp;

	msg = Utf8Encode(msg);

	var msg_len = msg.length;

	var word_array = new Array();
	for ( i = 0; i < msg_len - 3; i += 4) {
		j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 | msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
		word_array.push(j);
	}

	switch (msg_len % 4) {
		case 0:
			i = 0x080000000;
			break;
		case 1:
			i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
			break;

		case 2:
			i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
			break;

		case 3:
			i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
			break;
	}

	word_array.push(i);

	while ((word_array.length % 16) != 14)
	word_array.push(0);

	word_array.push(msg_len >>> 29);
	word_array.push((msg_len << 3) & 0x0ffffffff);

	for ( blockstart = 0; blockstart < word_array.length; blockstart += 16) {

		for ( i = 0; i < 16; i++)
			W[i] = word_array[blockstart + i];
		for ( i = 16; i <= 79; i++)
			W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

		A = H0;
		B = H1;
		C = H2;
		D = H3;
		E = H4;

		for ( i = 0; i <= 19; i++) {
			temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for ( i = 20; i <= 39; i++) {
			temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for ( i = 40; i <= 59; i++) {
			temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for ( i = 60; i <= 79; i++) {
			temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		H0 = (H0 + A) & 0x0ffffffff;
		H1 = (H1 + B) & 0x0ffffffff;
		H2 = (H2 + C) & 0x0ffffffff;
		H3 = (H3 + D) & 0x0ffffffff;
		H4 = (H4 + E) & 0x0ffffffff;

	}

	var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

	return temp.toLowerCase();

}

function ajaxRequest(url, method, bodyParam, callBack) {

	var common_url = 'https://d.apicloud.com/mcm/api';
	var appId = 'A6963429484030';
	var key = '7F836F04-CAAC-52C8-2332-CF337134FA6F';
	var now = Date.now();
	var appKey = SHA1(appId + "UZ" + key + "UZ" + now) + "." + now;
	api.ajax({
		url : common_url + url,
		method : method,
		cache : false,
		timeout : 20,
		headers : {
			"Content-type" : "application/json;charset=UTF-8",
			"X-APICloud-AppId" : appId,
			"X-APICloud-AppKey" : appKey
		},
		data : {
			body : bodyParam
		}
	}, function(ret, err) {
		callBack(ret, err);
	});
}

//是否是Debug模式，0表示未检查，1表示DEBUG模式，2表示手机模式
var common_isDebug_value = 0;
/**
 *是否是调试模式形式
 */
function isDebug() {

	if (systemMode == 0) {
		return true;
	}
	return false;
}

/**
 *根据key值获取缓存数据
 */
function getStorage(key) {
	if (isDebug()) {
		return $api.getStorage(key);
		//    return storageData[key];
	} else {
		return $api.getStorage(key);
	}
}

/**
 *提示信息
 * @param {Object} msg 消息内容
 */
function showToast(msg) {
	api.toast({
		msg : msg,
		location : 'bottom'
	});
}

/**
 *显示加载框
 */
function showMask(title) {
	api.showProgress({
		text : title,
		modal: true
	});
}

/**
 *显示提示信息
 */
function showAlert(title, msg) {
	api.alert({
		title : "提示",
		msg : msg
	});
}

/**
 *隐藏加载框
 */
function hideMask() {
	api.hideProgress();
}

/**
 *获取当前窗口或者frame的名字
 */
function getFrameName() {

	var frameName = api.frameName;

	if (frameName == "") {
		return api.winName;
	}
	return frameName;
}

/**
 *返回到上一层
 */
function back() {

	if (isDebug()) {
		history.go(-1);
		return;
	}

	var winName = api.winName;

	if (winName != null && winName != "") {
		//  alert("from win:"+winName);//
		api.closeWin();
		return;
	}

}

/**
 *打印对象出来
 * @param {Object} obj
 */
function consoleObj(obj) {

	var description = "";
	for (var i in obj) {
		var property = obj[i];
		description += i + " = " + property + "\n";
	}
	alert(description);
}

/**
 *将obj以字符串形式写出
 */
function getObj(obj) {
	var description = "";

	if ( typeof (obj) == "undefined") {
		return "undefined";
	}

	for (var i in obj) {
		var property = obj[i];
		description += i + " = " + property + "\n";
	}
	return description;
}

/**
 *API准备后的事件
 */
function initHeader() {

	var header = $api.byId("header");
	var footer = $api.byId("footer");
	console.log("111");
	api.setStatusBarStyle({
		style : 'light'
	});
	if(footer) {
		console.log("222");
		$api.fixTabBar(footer);
	}

	if (header) {

		$api.fixIos7Bar(header);

		if (api.systemType == "ios") {

			var main_articles = $("#main_article");

			if (main_articles != null && main_articles.length > 0) {
				//  alert(main_articles[0].css('top'));
				var top = main_articles.css("top");

				if (top != null && top.endWith("px")) {
					top = top.substring(0, top.length - 2);
					top = parseInt(top) + 20;
					main_articles.css("top", top + "px");
				}
			}
		}
		return header;
	}
}

var clicking = false;
//判断是否在点击中，需要间隔N毫秒才能使点击再生效

/**
 *等待N秒才能对事件进行响应
 * @param {Object} loading
 */
function waitDuck(callback) {
	if (clicking) {
		return;
	}
	clicking = true;

	window.setTimeout(function() {
		clicking = false;
	}, 200);

	if ( typeof (callback) != "undefined" && callback != null) {
		callback();
	}
}

/**
 *显示log信息
 * @param {Object} msg
 */
function showlog(msg, level) {

	if ( typeof (level) == "undefined") {
		level = "debug";
	}

	if (systemMode == 0 || systemMode == 1) {
		// console.log(msg);
	} else if (systemMode == 1) {
		var data = {
			msg : msg,
			level : level
		};

		// showToast(msg);

		return;
		api.ajax({
			url : logDebugServerUrl,
			method : 'post',
			timeout : 30,
			dataType : 'json',
			data : {
				values : data
			}

		}, function(ret, err) {

		});
	}

}

/**
 *字符串替换
 */
function replaceStr(str, bereplace, newreplace) {
	var re = new RegExp(bereplace, "g");
	var newstr = str.replace(re, newreplace);
	return newstr;
}

/**
 *字符串转化
 */
function transform(field) {

	var value = replaceStr(field, "amp;", "&");
	value = replaceStr(value, "lt;", "<");
	value = replaceStr(value, "gt;", ">");
	value = replaceStr(value, "quot;", "\\");
	value = replaceStr(value, "apos;", "'");
	return value;
}

/**
 * doT的渲染接口
 * @param {Object} contain 容器id
 * @param {Object} template 模版script id
 * @param {Object} dataModel 填充的数据
 */
function renderTemp(contain, template, dataModel, isAdd) {
	var content = $api.byId(contain);
	var tpl = $api.byId(template).text;
	var tempFn = doT.template(tpl);
	if (isAdd) {
		$(content).append(tempFn(dataModel));
		api.parseTapmode();
		return;
	}
	$(content).empty().append(tempFn(dataModel));
	api.parseTapmode();
}

/**
 *
 * @param {Object} obj 传输对象
 * @param {Object} to  传输目标
 *  to {
 *      winName 窗口名称,选填项
 *      frameName 帧名称,必填项
 * }
 */
function transferObj(obj, to, callback) {
	var script = "receiveObj('queryOpt'," + callback + ")";

	$api.setStorage('queryOpt', obj);
console.log("1");
	if ( typeof (to.frameName) != "undefined" && to.frameName != null && to.frameName.length > 0) {
		api.execScript({
			name : to.winName,
			frameName : to.frameName,
			script : script
		});
		console.log(to.winName);
		console.log(to.frameName);
		console.log("2");
	} else {
		api.execScript({
			name : winName,
			//  frameName : frameName,
			script : script
		});
	}
}

function receiveObj(objName, callback) {
	var opts = $api.getStorage(objName);
console.log("3");
	if (isExist(callback)) {
		callback(opts);
		console.log("4");
	} else {
		// alert("没有回调函数");
		showToast("没有处理方法");
	}
	$api.rmStorage(objName);
}

/**
 * 判断当前网络环境是否为Wi-Fi环境
 */
function curNetEnvironment() {
	var connType = api.connectionType;
	if (connType != "wifi" && connType != "ethernet") {
		return false;
	} else {
		return true;
	}
}

//保留小数点后几位（X）
function displaynum(x) {
	var num = new Number(x);
	return num.toFixed(6);
}

//进行经纬度转换为距离的计算

function Rad(d) {
	return d * Math.PI / 180.0;
	//经纬度转换成三角函数中度分表形式。
}

//计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
function GetDistance(lat1, lng1, lat2, lng2) {

	var radLat1 = Rad(lat1);
	var radLat2 = Rad(lat2);
	var a = radLat1 - radLat2;
	var b = Rad(lng1) - Rad(lng2);
	var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
	s = s * 6378137.0;
	// EARTH_RADIUS;
	s = Math.round(s * 10000) / 10000;
	//输出为公里
	//s=s.toFixed(4);
	return s;
}

//定位
function getHeartFromGps(win_name,frm_name) {
    //  showlog("调用GPS模块进行GPS获取,win_name:"+win_name);
    api.toast({
	    msg:'主窗口：'+win_name
    });
    var script = "startLocation('" + win_name + "','" + frm_name + "');";

    api.execScript({
    	name:"home_win",
        frameName : 'gps',
        script : script
    });

//  timer = setTimeout(function() {
//      gps_invoke();
//  }, 3000);
}

// 顶部标题留空

function frameRect() {
	var rect = {
		x : 0,
		y : 0,
		w : 'auto',
		h : 0
	};
	var $header = $('header.aui-bar-nav');
	if ($header.length) {
		rect.y += parseInt($header.outerHeight());
	}
	var $tab = $('.aui-tab');
//	$tab.sh
	if ($tab.length) {
		rect.y += parseInt($tab.outerHeight());
	}
	var $footer = $('footer.aui-nav');
	if ($footer.length) {
		rect.h -= parseInt($footer.outerHeight());
	}
	rect.h += parseInt($('body').height()) - rect.y;
	return rect;
}

function frameRect1() {
	var rect = {
		x : 0,
		y : 0,
		w : 'auto',
		h : 0
	};
	var $header = $('header.aui-bar-nav');
	if ($header.length) {
		rect.y += parseInt($header.outerHeight());
	}
//	var $tab = $('.aui-tab');
////	$tab.sh
//	if ($tab.length) {
//		rect.y += parseInt($tab.outerHeight());
//	}
	var $footer = $('footer.aui-nav');
	if ($footer.length) {
		rect.h -= parseInt($footer.outerHeight());
	}
	rect.h += parseInt($('body').height()) - rect.y;
	return rect;
}

function frameRect2() {
	var rect = {
		x : 0,
		y : 0,
		w : 'auto',
		h : 0
	};
	var $header = $('header.aui-bar-nav');
	if ($header.length) {
		rect.y += parseInt($header.outerHeight());
	}
//	var $tab = $('.aui-tab');
////	$tab.sh
//	if ($tab.length) {
//		rect.y += parseInt($tab.outerHeight());
//	}
	var $footer = $('footer.aui-nav');
	if ($footer.length) {
		rect.h -= parseInt($footer.outerHeight());
	}
	rect.h += parseInt($('body').height()) - rect.y;
	return rect;
}
//判断字符含有汉字的个数
function isChineseCount(str)
{
    re=/[\u4E00-\u9FA5]/g;  //测试中文字符的正则
    if(re.test(str))        //使用正则判断是否存在中文
    return str.match(re).length //返回中文的个数
    else
    return 0
}
