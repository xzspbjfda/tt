var menuUserId = "";
var menuApplyId = "";
var isneedperson;
var standBillModel;

//关闭弹出DIV对话框
function closeDiv(divId) {
	easyDialog.close({
		container : divId
	});
}

// api.execScript({
// 	name : 'standBillListWin',
// 	script : 'refreshFrame();'
// });
//点击菜单触发的事件
function optBill(type) {
	if (type == "add") {
		  openBillList("emergency-detail_win");
	}else if(type=="TAKEPHOTO"){
		api.execScript({
			frameName : 'standBillDetail_frm',
			script : 'cb_openBillPicDetail();'
		});
		api.closeFrame();
	}
}

function initDict(){
       var standWayList= $api.getStorage("standWayList");
       if(standWayList!=null&&standWayList.length>0){
//     alert("集合数："+standWayList.length);
      	 $('#standType').empty();
        $('<option>').text('请选择').val('').appendTo('#standType');
		renderTemp('standType', 'dict-template', standWayList, true);
		 }
        }

function initisAgree() {
	initDict1();
	var isAgreeVal = $api.byId('isAgreeSelId').value;
	if (isAgreeVal != 'Y') {
		console.log("=========================test=========================");
		$('#test1').hide();
		$('#test2').hide();
		$('#test3').hide();
	} else {
		$('#test1').show();
		$('#test2').show();
		$('#test3').show();
	}
	initRelief();
}


function phoneSign() {
	var lastLocation = $api.getStorage('LAST_GPS_LOCATION');
	lon = lastLocation.lon;
	lat = lastLocation.lat;
	var time = new Date().pattern("yyyy-MM-dd HH:mm:ss");
	var xyJson = GPS.gcj_decrypt_exact(lat, lon);
	// ios要把  GCJ-02 to WGS-84   安卓不用转
	if (xyJson != null) {
		var data = {};
		data.userID = menuUserId;
		data.applyid = menuApplyId;
		data.signdate = time;
		data.signlon = xyJson.lon;
		data.signlat = xyJson.lat;
		data.portType = "STATION_BILL_SIGN";
		dealStandBillFunc(data, "", "签到成功");
	} else {
		api.toast({
			msg : "坐标获取失败，请开启GPS或者到外面获取坐标",
			location : 'middle'
		});
	}
}

function openBillList(name) {
	api.openWin({
		name : name,
		url : name + '.html',
		bounces : false,
		rect : {
			x : 0,
			y : 0,
			w : 'auto',
			h : 'auto'
		},
		reload : true,
		pageParam : api.pageParam
	});

	setTimeout(function() {
			closeFrame('standBillMenu');
	}, 1500);
}

function closeFrame(name) {
	if (name == null || name == '' || name == 'undefined') {
		api.closeFrame();
	} else {
		api.closeFrame({
			name : name
		});
	}
}

function closeWin(name) {
	if (name == null || name == '' || name == 'undefined') {
		api.closeWin();
	} else {
		api.closeWin({
			name : name
		});
	}
}


apiready = function() {
	initHeader();
	var user = $api.getStorage('user');
	var tpl = $api.byId('standBillMenu-template').text;
	var tempFn = doT.template(tpl);
	standBillMenuMain.innerHTML = tempFn(api.pageParam);
	api.parseTapmode();
}
