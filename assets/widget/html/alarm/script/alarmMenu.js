apiready = function() {
    initHeader();
}
function optMenu() {
    var alarmModel = $api.getStorage('alarmModel');
    if (alarmModel != null) {
        document.getElementById('shadowId').style.display = "none";
        document.getElementById('alarmMenuMain').style.display = "none";
        var titleVal = "告警内容：" + alarmModel.code;
        $api.byId('sendTitleId').innerHTML = titleVal;
        easyDialog.open({
            container : 'sendDiv',
            fixed : false
        });
    } else {
        api.toast({
            msg : "获取不到工单信息",
            location : 'bottom'
        });
    }
}

function openAlarmList() {
    api.openWin({
        name : 'alarm-list',
        url : 'alarm-list.html',
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
    window.setTimeout("closeWinDow()", 1000);
}

function closeWindow() {
    api.closeWin({
        name : "mainAlarmDetail"
    });
}

function acceptFunc() {
    var alarmModel = $api.getStorage('alarmModel');
    var user = $api.getStorage('user');
    if (alarmModel != null && user != null) {
        var userId = user.userid;
        var alarmId = alarmModel.id;
        api.showProgress({
            title : '处理中',
            modal : true
        });
        $client.alarmCreateBill(userId, alarmId, "", function(ret, err) {
            if (ret) {
                if (ret.success) {
                    finishOptBill("派单成功", "sendDiv");
                } else {
                    api.toast({
                        msg : ret.data_info,
                        location : 'bottom'
                    });
                }
            } else {
                api.toast({
                    msg : err.msg,
                    location : 'bottom'
                });
            }
            api.parseTapmode();
            api.hideProgress();
        });
    } else {
        api.toast({
            msg : "获取不到工单信息",
            location : 'bottom'
        });
    }
}

function finishOptBill(msg, closeDivId) {
//  easyDialog.close();
    api.toast({
        msg : msg,
        duration : 1000,
        location : 'bottom'
    });
    window.setTimeout(function() {
        // openBillList("alarm-list_win");
        api.hideProgress();
        closeWindow();
        cancelDiv();
    }, 1100);
}

function openBillList(name) {

    //  api.execScript({
    //      name:name,
    //      frameName:'bill-listCon_frm',
    //	    script: 'cb_refresh();'
    //  });

    api.pageParam.stationId = "";
    api.pageParam.alarmlevel = "";
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
}

function cancelDiv() {
    easyDialog.close();
    api.closeFrame();
}
