apiready = function(){
	initHeader();
	getCache();
};

function openWin(str){
	if('loadPicture'==str){
		//var textVal = $('#loadPicId').text();
		//if(textVal == "打开"){
			// $('#loadPicId').text("关闭");
			// $('#loadPicId').removeClass("uInfoContentOpen");
			// $('#loadPicId').addClass("uInfoContentClose");
		 //}else{
		 	// $('#loadPicId').text("打开");
			// $('#loadPicId').removeClass("uInfoContentClose");
			// $('#loadPicId').addClass("uInfoContentOpen");
		 //}
		api.toast({msg: "正在开发中", location: 'middle'});
	}else if('msgNotify'==str){
		//var textVal = $('#msgNotifyId').text();
		//if(textVal == "打开"){
			// $('#msgNotifyId').text("关闭");
			// $('#msgNotifyId').removeClass("uInfoContentOpen");
			// $('#msgNotifyId').addClass("uInfoContentClose");
		 //}else{
		 	 //$('#msgNotifyId').text("打开");
			// $('#msgNotifyId').removeClass("uInfoContentClose");
			// $('#msgNotifyId').addClass("uInfoContentOpen");
		 //}
		api.toast({msg: "正在开发中", location: 'middle'});
	}else if('infonotify'==str){
		api.openWin({
	        name: 'MsgNotifyWin',
	        url: './MsgNotifyWin.html',
	        bounces: false,
	        rect: {
	            x: 0,
	            y: 0,
	            w: 'auto',
	            h: 'auto'
	        },
	        pageParam: api.pageParam,
	        reload: true
        });
	}else if('clearCache'==str){
		api.confirm({
		    msg: '即将清楚所有的工单缓存，进入工单无法显示已填写的内容！',
		    buttons:['确定', '取消']
		},function(ret,err){
		    if(ret.buttonIndex == 1){
						$api.rmStorage("draftArr");
						$api.rmStorage("pathArr");
						$api.rmStorage("draftGenerationArr");
						$api.rmStorage("cacheImgGenerationArr");
						$api.rmStorage("bulleList");
		        api.clearCache(
				    function(ret,err){
				    	getCache();
				        api.toast({
				            msg:'清除成功',
				            location:'middle'
				        });
				    }
				);
		    }
		});
	}else if('about'==str){
		api.openWin({
	        name: 'aboutItowerWin',
	        url: './aboutItowerWin.html',
	        bounces: false,
	        rect: {
	            x: 0,
	            y: 0,
	            w: 'auto',
	            h: 'auto'
	        },
	        pageParam: api.pageParam,
	        reload: true
        });
	}else if('modifyPassword'==str){
		api.pageParam.fromPage = 'setting';
		api.openWin({
	        name: 'modifyPasswordWin',
	        url: './modifyPasswordWin.html',
	        bounces: false,
	        rect: {
	            x: 0,
	            y: 0,
	            w: 'auto',
	            h: 'auto'
	        },
	        pageParam: api.pageParam,
	        reload: true
        });
	}else{
		api.toast({msg: "正在开发中", location: 'middle'});
	}
}
//获取缓存
function getCache(){
	api.getCacheSize(
	    function(ret, err) {
	    	var cacheSize = "";
	    	//如果缓存大于1024KB，则转换成MB显示
	        if(ret.size/1024<1024){
	        	cacheSize = parseFloat(ret.size/1024).toFixed(1)+"KB";
	        }else{
	        	cacheSize = parseFloat(ret.size/(1024*1024)).toFixed(1)+"MB";
	        }
	        $api.byId('cacheId').innerHTML = cacheSize;
	    }
	);
}
