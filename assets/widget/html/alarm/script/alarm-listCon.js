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

function openAlarmDetail(alarmId, alarmlevel, stationId, faultId) {
	var pageParm ={
	alarmlevel:alarmlevel,
	alarmId:alarmId,
	stationId:stationId
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
        name : 'mainAlarmDetail_win',
        url : 'mainAlarmDetail_win.html',
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
    listView = new C.ApiListView({
        fn : $client.getAlarmList,
        listName : 'alarmList'
    });
    listView.setQueryOptions({
//      type : api.pageParam.type,
        stationId : api.pageParam.stationId
    });
    listView.refresh();
//  getAlarmList();
}
