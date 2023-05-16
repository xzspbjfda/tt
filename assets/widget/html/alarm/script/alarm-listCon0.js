var listView;
//function getAlarmList() {
//  var stationId = "";
//  var fromFlag = "";
//  if (api.pageParam.stationId != null && fromFlag != "ALARMLIST") {
//      stationId = api.pageParam.stationId;
//  }
//  listView.setQueryOptions({
//      type : api.pageParam.type,
//      provinceId : api.pageParam.provinceId,
//      cityId : api.pageParam.cityId,
//      areaId : api.pageParam.areaId,
//      stationName : api.pageParam.stationName,
//      alarmlevel : api.pageParam.alarmlevel,
//      stationCode : api.pageParam.stationCode,
//      stationId : api.pageParam.stationId
//  });
//  listView.refresh();
//}

function openAlarmDetail(faultId, staCode, staName,deviceId,subObjName,alarmCause,alarmType,alarmObjType,
	alarmLevelName,alarmSou,detailInfo,firstAlarmTime,times) {
	var pageParm ={
	faultId:faultId,//故障单id,运维id
	staCode:staCode,//站址编码
	staName:staName,//站址名称
	deviceId:deviceId,//设备id
	subObjName:subObjName,//设备名称
	alarmCause:alarmCause,//指标名称
	alarmType:alarmType,//告警类别
	alarmObjType:alarmObjType,//告警对象类型
	alarmLevelName:alarmLevelName,//告警级别
	alarmSou:alarmSou,//告警来源
	detailInfo:detailInfo,//告警内容
	firstAlarmTime:firstAlarmTime,//首次告警时间
	times:times//告警次数
	};
//  api.pageParam.alarmlevel = alarmlevel;
//  api.pageParam.alarmId = alarmId;
//  api.pageParam.stationId = stationId;
    if (faultId != null && faultId != "" && faultId != "null" && faultId != "undefined") {
        pageParm.faultid = faultId;
    } else {
        pageParm.faultid = null;
    }
    api.openWin({
        name : 'mainAlarmDetail_win0',
        url : 'mainAlarmDetail_win0.html',
        opaque : true,
        bounces : false,
        reload : true,
        pageParam : pageParm,
        vScrollBarEnabled : false
    });
}

function cb_queryAlarmList(opts) {

    listView.setQueryOptions({
//      type : api.pageParam.type,
        provinceId : opts.provId,
        cityId : opts.cityId,
        areaId : opts.areaId,
        alarmlevel : opts.alarmLevel,
        begintimetype : opts.begintimetype,
        stationcode : opts.stationCode,
        alarmname : opts.alarmname
    });
    listView.refresh();
}

apiready = function() {
	console.log("这是传到页面的省份编码"+api.pageParam.provinceid);
	console.log("这是传到页面的基站编码"+api.pageParam.stationcode);
	console.log("这是传到页面的开始时间"+api.pageParam.begintime);
	console.log("这是传到页面的结束时间"+api.pageParam.endtime);
	console.log("这是传到页面的告警等级"+api.pageParam.alarmlevel);
	console.log("这是传到页面的设备类型"+api.pageParam.devicetype);
    listView = new C.ApiListView({
        fn : $client.hisAlarmList,
        listName : 'items'
    });

		//  var opts={
		//  	provinceid:api.pageParam.provinceid,
		//  	stationcode:api.pageParam.stationcode,
		//  	begintime:api.pageParam.begintime,
		//  	endtime:api.pageParam.endtime
		//  }
		//  $client.hisAlarmList(opts,function(ret,err){
		//  	alert(getObj(ret));
		// 	console.log(typeof ret);
		// 	console.log(ret.items);
		// 	console.log(JSON.stringify(ret.items));
		// 	alert(getObj(ret.items));
		 //
		//  });
    listView.setQueryOptions({
//      type : api.pageParam.type,
				provinceid:api.pageParam.provinceid,
        stationcode:api.pageParam.stationcode,
				begintime:api.pageParam.begintime,
				endtime:api.pageParam.endtime,
				devicetype:api.pageParam.devicetype,
				alarmlevel:api.pageParam.alarmlevel
    });
    listView.refresh();
//  getAlarmList();
}
