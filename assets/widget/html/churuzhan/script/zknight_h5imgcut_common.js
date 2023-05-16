/**
 * 打开图片裁剪页面
 *
 * 本地图片路径 : imgPath
 * return 接受 zknight_h5imgcut 页面发送的 event"zknight_img_cut_event"，
 * 		      返回 裁剪后的图片ret.value.cutOutImg，
 */
var zknightH5ImgcutOpenCut = function(imgPath) {
	api.openFrame({
		name : 'billStationFaceCheck_cut',
		url : 'billStationFaceCheck_cut.html',
		reload : true,
		bgColor : '#000000',
		rect : {
			x : 0,
			y : 0,
			w : 'auto',
			h : api.winHeight
		},
		pageParam : {
			imgPath : imgPath
		},
		slidBackEnabled : false,
		bounces:false
	});
}

/**
 * 从本地选择图片或拍照图片进行裁剪
 *
 * sourceType:
 * 1 : 摄像头
 * 2 : 相册
 */
function zknightH5ImgcutGetPicture(sourceType) { 
	switch(sourceType) {
		case 1:
			zknightH5imgcutAuthorizePhone("camera", "请授权访问摄像头", function(ret) {
				if (ret) {
					zknightH5imgcutOpenSource("camera");
				}
			});
			break;

		case 2:
			zknightH5imgcutAuthorizePhone("photos", "请授权访问相册", function(ret) {
				if (ret) {
					zknightH5imgcutOpenSource("library");
				}
			});
			break;
	}
}

/**
 * 授权
 * quthorizeSource : 授权源（相册，摄像头）
 * confirmMsg : 授权弹出框提示信息
 *
 * 参考官方文档：api.hasPermission（URL：https://docs.apicloud.com/Client-API/api#hasPermission）
 *
 * return boolean类型，是否成功授权
 */
function zknightH5imgcutAuthorizePhone(quthorizeSource, confirmMsg, callback) {

	//授权源
	var zknightResult = api.hasPermission({
		list : [quthorizeSource]
	});
	
	//是否授权，默认没授权
	var zknightIsAuthorize = false;

	if (zknightResult[0].granted) {
		zknightIsAuthorize = true;
	} else {
		api.confirm({
			title : '提示',
			msg : confirmMsg,
			buttons : ['去设置','取消']
		}, function(ret) {
			if (ret.buttonIndex == 1) {
				api.requestPermission({
					list: [quthorizeSource],
				}, function(res) {
					if (res.list[0].granted) {
						// 已授权，可以继续下一步操作
					}
				});
			}
		});
	}

	return callback(zknightIsAuthorize);
}

/**
 * 打开选择图片的源, 并进行裁剪
 * sourceType： 相机或相册
 * 参考官方文档：api.getPicture (URL: https://docs.apicloud.com/Client-API/api#20)
 */
function zknightH5imgcutOpenSource(sourceType) {
	console.log("------------面部识别-打开摄像头开始拍照----------------");
	console.log("拍照类型："+sourceType);
	api.getPicture({
		sourceType : sourceType,
		encodingType : 'jpg',
		mediaValue : 'pic',
		destinationType : 'base64',
		direction:'front',
		quality : 100,
		targetWidth : 1000,
		targetHeight : 1000,
	}, function(ret, err) {
		console.log("------------面部识别-打开摄像头拍照完成----------------");
		console.log("拍照结果："+ret.data);
		if (ret.data) {
			zknightH5ImgcutOpenCut(ret.data);
		}
	});
}

