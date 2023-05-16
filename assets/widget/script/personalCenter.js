/* 模块简介:
 personalCenter是一个带有图片模糊效果的个人信息展示中心，
 开发者只需配置相关接口参数即可实现一个原生效果的个人展示中心;
 */

/* 示例简介:
 打开 个人中心;
 点击 "好友", "回帖", "主题", "修改", "设置"会获得对应的toast提示;
 点击 头像旁 的修改按钮可以 拍照或者从图库选择图片来修改 头像;
 */
var personalCenter = api.require('personalCenter');

var btnArray = [
    {
        "bgImg": "",
        "selectedImg": ""
    }
];

var count = 382;

var y = 44;

if("ios" == api.systemType && parseInt(api.systemVersion) >= 7){
    y = 64;
}

personalCenter.open({
    "y": y,
    "imgPath": "http://file.apicloud.com/mcm/A6965066817858/d7d1d308fe165b984c09728e7118e9f1.jpg",
    "placeholderImg": "widget://image/common/placeHolder.png",
    "userName": "APICloud",
    "count": count,
    "modButton": {
        "bgImg": "widget://image/personalCenter/mod_normal.png",
        "lightImg": "widget://image/personalCenter/mod_click.png"
    },
    "btnArray": btnArray
},function(ret,err){
    /* 头像修改按钮. */
    if(btnArray.length === ret.click){
        api.confirm({
            title: "聊天盒子",
            msg: "您想要从哪里选取图片 ?",
            buttons:["优雅自拍", "相册收藏", "取消"]
        },function(ret,err){
            var sourceType = "album";

            if(3 == ret.buttonIndex){ // 取消
                return;
            }

            if(1 == ret.buttonIndex){ // 打开相机
                sourceType = "camera";
            }

            api.getPicture({
                sourceType: sourceType,
                encodingType: 'png',
                mediaValue: 'pic'
            }, function(ret, err){
                if (ret) {
                    personalCenter.updateValue({
                        imgPath: ret.data,
                        count:count
                    });

                }
            });

        });

        return;
    }

    var msg;

    /* 修改按钮. */
    if(btnArray.length + 1 == ret.click){
        msg = "开发中!";
    }

    if(btnArray.length + 2 == ret.click){
        msg = "开发中!"
    }


    api.toast({
        msg: msg,
        duration: 1000,
        location: "top"
    });
});