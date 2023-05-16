var billSn = null;
var fromsource = null;
var userid = null;
var stationId = null;
var billId = null;

apiready = function() {
    initHeader();
    billSn = api.pageParam.billSn;
    billId = api.pageParam.billId;
    stationId = api.pageParam.stationId;
    fromsource = api.pageParam.fromsource;
    fsuid=api.pageParam.fsuid;
    var billStatus = api.pageParam.billStatus;
    var billDetailInfo = {};
    var bugFlowInfo = {};

    userid = $api.getStorage('user') ? $api.getStorage('user').userid : null;
    api.pageParam.mainBillDetailWin = true;
    //判断是否需要显示操作按钮图标
//  if (billStatus != 'REVERTED' && api.pageParam.type != 'GET_BILL_FINISH_LIST') {
//      $('#openMenuId').show();
//  }
	console.log(billSn);
    //远程获取新工单详情的内容，并做缓存
    var opts = {
        billSn : billSn,
        fromsource : fromsource,
        title:api.pageParam.title
    }
    api.showProgress({
        title : '加载中...'
    });
    $client.getBillDetail(opts, function(ret, err) {
        if (ret) {
//          api.hideProgress();
            if (ret.success) {
                $api.setStorage("actionList", ret.actionList);
                console.log('99999999999999999999999999999999999999');
                console.log(getObj(ret));
                $api.setStorage("billModel", ret.model);
                $api.setStorage("stationModel", ret.model);
				var roomid=ret.model.st_maintenance_roompersonid;//机房维护id
				var conpersonid=ret.model.st_con_personid;//运营商id
				var dispatchrole = ret.model.dispatch_role;//运营商工单分发规则
                //任务处理人和登录用户如果不一致，不显示工单菜单billMenu
                var user = $api.getStorage('user');
                var warning;
//              if (api.pageParam.type == 'GET_BILL_LIST' && ret.model.billstatus != 'ACCEPT' && ret.model.dealobjectid != user.userid) {
//                  showlog('该工单[' + ret.model.billsn + ']任务处理人(' + ret.model.dealobjectid + ')非当前用户(' + user.userid + ')，无法操作工单！');
//                  warning = '该工单任务处理人非当前用户，无法操作工单！';
//                  $('#openMenuId').hide();
//              }
//              $('#openMenuId').show();
                if(api.pageParam.type == 'GET_BILL_LIST'){
                	if(ret.model!=null&&ret.model.st_id==ret.model.dealobjectid ){
                		if(roomid==null){
                			api.toast({
				                msg : '该站址并未配置机房维护人员，请先配置!'
				            });
				            return ;
                		}
                		if(roomid.indexOf(api.pageParam.userId)!=-1){
                		  $('#openMenuId').show();
                		}else if(conpersonid.indexOf(api.pageParam.userId)!=-1&&(ret.model.billstatus=='CON_CONFIRM'||ret.model.billstatus=='CON_APPROVE')){
                		  $('#openMenuId').show();
                		}else if(('4'== api.pageParam.leadid&&'1'==dispatchrole)||('12'== api.pageParam.leadid&&'2'==dispatchrole)){
                			$('#openMenuId').show();
                		}else{

                		 warning = '该工单任务处理人非当前用户，无法操作工单！';
                		}
                	}else if(api.pageParam.userId==ret.model.dealobjectid){
                	$('#openMenuId').show();
                	}else{
                		 warning = '该工单任务处理人非当前用户，无法操作工单！';
                		}
                }else{
                	if(api.pageParam.userId==user.userid){
                	$('#openMenuId').show();
                	}else{
                	 warning = '该工单任务处理人非当前用户，无法操作工单！';
                	}

                }


                //如果该工单是人工受单，则第三个页面为告警页面(alarmDetail)，默认为故障信息(bugDetail)
                var type = "bugDetail_frm";
                var url = "../bill/bugDetail_frm.html";
                billDetailInfo.list = ret.model;
                bugFlowInfo.list = ret.actionList;
                console.log(billDetailInfo.list.businesstype);
                if (billDetailInfo.list.businesstype == "设备告警工单" || billDetailInfo.list.businesstype == "CRM工单") {
                    type = "billAlarmList";
                    url = "../bill/billAlarmList.html";
                }

                var pageParam = {
                    billSn : billSn,
                    billId : billId,
                    stationId : stationId,
                    billStatus : billStatus,
                    fromFlag : 'BILL',
                    fromsource : fromsource
                };

                //打开工单详情群组

                api.openFrameGroup({
                    name : 'bill_footer_tab',
                    scrollEnabled : true,
                    rect : frameRect(),
                    index : 0,
                    preload : 0,
                    frames : [{
                        name : 'billDetail',
                        url : 'billDetail_frm.html',
                        pageParam : {
                            billSn : billSn,
                            billId : billId,
                            stationId : stationId,
                            billStatus : billStatus,
                            fsuid:fsuid,
                            fromFlag : 'BILL',
                            fromsource : fromsource,
                            warning : warning ? warning : null
                        },
                        bounces : false
                    }, {
                        name : 'stationDetail_frm',
                        url : '../station/stationDetail_frm.html',
                        pageParam : pageParam,
                        bounces : false
                    }, {
                        name : type,
                        url : url,
                        pageParam : pageParam,
                        bounces : false
                    }, {
                        name : 'bugFlow_frm',
                        url : 'bugFlow_frm.html',
                        pageParam : pageParam,
                        bounces : false
                    }]
                }, function(ret, err) {
                    var $curTab = $('#footer li:eq(' + ret.index + ')');
                    $curTab.addClass('active-warning').find('img:hidden').show().siblings().hide();
                    $curTab.siblings('.active-warning').removeClass('active-warning').find('img:hidden').show().siblings().hide();
                    $('.aui-title').text($curTab.find('p').text());
                });
            } else {
             api.hideProgress();
                api.toast({
                    msg : ret.data_info
                });
            }
        } else {
            api.toast({
                msg : '获取工单详情出错!'
            });
        }
        $api.setStorage("billDetailInfo", billDetailInfo);
        console.log(getObj($api.getStorage("billDetailInfo")));
        $api.setStorage("bugFlowInfo", bugFlowInfo);
          api.hideProgress();
    });

    /*
     * jQuery事件:tab切换
     */
    $('#footer li').click(function() {
        api.setFrameGroupIndex({
            name : 'bill_footer_tab',
            index : $(this).index(),
            scroll : true
        });
    });

    api.addEventListener({
        name : 'viewappear'
    }, function(ret, err) {
        api.closeFrame({
            name : "billMenu_frm"
        });
        api.closeWin({
            name : "billRevert_win"
        });
    });

	//故障工单到站时风险提醒监听事件
    api.addEventListener({name: 'onRiskTipDone'}, function(ret) {
        switch (ret.value) {
            case "done":
                api.closeFrame({name:"riskTip"})
                openBillList("upStationSign_win");
                break;
            case "cancel":
                api.closeFrame({name:"riskTip"})
                api.closeFrame({name:"billMenu_frm"})
                break;
        }
    });
    //发电工单到站时风险提醒监听事件
    api.addEventListener({name: 'onRiskTipDoneFd'}, function(ret) {
        switch (ret.value) {
            case "done":
                api.closeFrame({name:"riskTip"})
                openBillList("billRevert_win");
                break;
            case "cancel":
                api.closeFrame({name:"riskTip"})
                api.closeFrame({name:"billMenu_frm"})
                break;
        }
    });
};
function openBillList(name) {
    var apiPageParam = $api.getStorage('apiPageParam');
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
        pageParam : apiPageParam
    });
}

// 打开菜单
function openMenu() {
    api.openFrame({
        name : 'billMenu_frm',
        url : '../bill/billMenu_frm.html',
        bounces : false,
        reload : true,
        pageParam : api.pageParam,
    });
}

function backBillList() {
    if (api.pageParam.pushFlag == "PUSH") {
        api.openWin({
            name : 'bill-list',
            url : 'bill-list.html',
            opaque : true,
            bounces : false,
            vScrollBarEnabled : false,
            pageParam : api.pageParam
        });
    } else {
        api.closeWin();
    }
}

/*回调函数－－>签到功能*/
function cb_register() {
    var location = $api.getStorage('LAST_GPS_LOCATION');
    location.status = true;
    //测试
    if (location.status) {
        var billModel = $api.getStorage('billModel');
        var lon1=$api.getStorage("lon");
        var lat1=$api.getStorage("lat");
        var opts = {
            billsn : billModel.billsn,
            billId : billModel.billid,
            taskId : billModel.taskid,
            signlon : location.lon!=null?location.lon:lon1,
            signlat : location.lat!=null?location.lat:lat1
        }
        api.confirm({
            title : '确认签到',
            msg : '是否签到？'
        }, function(ret) {
            if (ret.buttonIndex == 2) {
                api.showProgress({
                    title : '签到中...'
                });
                $client.setBillSign(opts, function(ret, err) {
                    if (ret) {
                        if (ret.status == 'OK') {
                            api.toast({
                                msg : '签到成功！',
                                location : 'bottom'
                            });
                            api.openWin({
                                name : 'main_bill_detail_win',
                                url : 'main_bill_detail_win.html',
                                reload : true,
                                bounces : false,
                                pageParam : api.pageParam
                            });
                        } else {
                            api.toast({
                                msg : '签到失败！',
                                location : 'bottom'
                            });
                        }
                    } else {
                        api.toast({
                            msg : '签到失败！',
                            location : 'botton'
                        });
                    }
                    api.hideProgress();
                });
            }
            $aui.hideDialog();
        });

    } else {
        api.toast({
            msg : '签到失败！',
            location : 'bottom'
        });
    }
}
