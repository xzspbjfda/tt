//var avatar = $api.dom('#avatar img');
//var url = avatar.src;
//var cover = $api.dom('#cover');
//var pos = $api.offset(cover);
//var coverImg = $api.dom('#cover .cover');
//coverImg.src = url;
//var css = 'width:'+ pos.w +'px; height:'+ pos.h +'px;';
//$api.css(coverImg,css);

//function openActDetail(){
//api.openWin({
//  name: 'actDetail',
//  url: 'actDetail.html',
//  delay: 400
//});
//}
function openNewDetail(type, did) {
	var name = ''
	switch (type) {
		case 't':
			name = 'news-text';
			break;
		case 'v':
			name = 'news-video';
			break;
	}
	api.openWin({
		name : name,
		url : name + '.html',
		bounces: false,
		pageParam : {
			newsId : did
		}
	});
}

function openActDetail(did) {
	api.openWin({
		name : 'actDetail',
		url : 'actDetail.html',
		//		delay: 200,
		pageParam : {
			dataId : did
		}
	});
}

function openMer(did) {
	api.openWin({
		name : 'restaurant',
		url : 'restaurant.html',
		opaque : true,
		bounces: false,
		pageParam : {
			dataId : did
		},
		vScrollBarEnabled : false
	});
}

//init personal center
//function initPersonalCenter() {

	//var btnArray = [{
		//"bgImg" : "",
		//"selectedImg" : ""
	//}];
	//var user = $api.getStorage('user');
	//$api.byId('uName').innerHTML = user.username;
	//var strs = $api.jsonToStr(user);
	//alert(strs);
	//user.imgurl = "http://file.apicloud.com/mcm/A6965066817858/d7d1d308fe165b984c09728e7118e9f1.jpg";
	//var pc = api.require('personalCenter');
	//var headerH = api.pageParam.headerHeight;
	//var photo = 'http://file.apicloud.com/mcm/A6965066817858/d7d1d308fe165b984c09728e7118e9f1.jpg';
	//pc.open({
	//	y : headerH,
	//	height : 180,
	//	fixed : true,
	//	imgPath : photo,
	//	placeHoldImg : photo,
	//	showLeftBtn : false,
	///	showRightBtn : false,
	//	username : user.username,
	//	count : 0,
	//	modButton : {
	//		"bgImg" : "widget://image/personalCenter/mod_normal.png",
	//		"lightImg" : "widget://image/personalCenter/mod_click.png"
	//	},
	//	btnArray : btnArray
	//}, function(ret, err) {
		/* 头像修改按钮. */
	//	if (btnArray.length === ret.click) {
	//		api.confirm({
	//			title : "个人头像",
	//			msg : "您想要从哪里选取图片 ?",
	//			buttons : ["拍摄", "从相册选择", "取消"]
	//		}, function(ret, err) {
	//			var sourceType = "album";

	//			if (3 == ret.buttonIndex) {// 取消
	//				return;
	//			}
	//
	//			if (1 == ret.buttonIndex) {// 打开相机
	//				sourceType = "camera";
	//			}

	//			api.getPicture({
	//				sourceType : sourceType,
	//				encodingType : 'png',
	//				mediaValue : 'pic'
	//			}, function(ret, err) {
	//				if (ret) {
	//					pc.updateValue({
	//						imgPath : ret.data,
	//						count : 0
	//					});
	//				}
	//			});

	//		});

	//		return;
	//	}

	//	$api.byId('activity').innerHTML = '';
	//	getFavData('activity', user);
	//});
	//api.hideProgress();
	//getFavData('userInfo', user);
//}

//function getFavData(type, ret) {
	//var data = {};
	//data.favType = 'act';
	//data.ret = ret;
	//var content = $api.byId('userInfo');
	//var tpl = $api.byId('template').text;
	//var tempFn = doT.template(tpl);
	//$api.byId('userInfo').innerHTML = tempFn(ret);
//}

function init() {
	initPersonalCenter();
}

function updateInfo() {
	var pc = api.require('personalCenter');
	pc.close();
	init();
}

function exitApp(){
	api.closeWidget({
	    id: 'A6973002767421',
	    retData: {name:'closeWidget'},
	    animation: {
	        type: 'flip',
	        subType: 'from_bottom',
	        duration: 500
	    }
    });
}

function stopPush() {
	var userJpush = api.require('jpushVip');
    var tagArr = new Array();
    //安卓需要进行初始化
    //initJPush();
    if(userJpush != null){
    	api.showProgress({
			title : '加载中',
			modal : false
		});
    	userJpush.bindAliasAndTags({
			alias:"",
			tags:tagArr
		}, function(ret, err){
			api.hideProgress();
		});
    }
}

//apiready = function() {
	//init();
//};

