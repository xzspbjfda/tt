var listView;

var app = new Vue({
	el:'#app',
	mixins:[ORDER_OPTIONS_MIXIN],
	mounted(){
		this.init();
	},
	methods:{
		init(){
			this.active = false;
			this.change(this.dataList[0]);
		},
		change(item,refresh = false) {
			this.selectedItem = item;
			this.value = item.value;
			this.active = false;
			if(refresh){
				listView.setQueryOptions({
					sortCond:this.value
				});
				// alert(JSON.stringify(listView.queryOptions))
				listView.refresh();
			}
		}
	}
});

var beforeRefresh = function(obj,call){
	if(app){
		app.init();
		obj.setQueryOptions({
			sortCond:app.value
		});
	}
	call(true);
}

apiready = function() {
	// alert(getObj(api.pageParam))wxx
	if(api.pageParam.title=="监控箱"){
		$('.wxx_btn').hide();
	}
	var type = api.pageParam.type;
	var num=api.pageParam.num;
	var frameName= api.frameName;
	console.log("当前的frame"+frameName);
	var opts={
	billst:num,
	sortCond:app.value
	};
	console.log(type);
	if (type == 'GET_BILL_LIST') {
		// 故障工单
		listView = new C.ApiListView({
			fn : $client.getFaultBillList,
			listName : 'billList',
			limit:5,
			beforeRefresh:beforeRefresh
		});
		 listView.setQueryOptions(opts);
	}else if (type=="GET_BILL_FD") {
		console.log("wxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

		// 停发电工单
		listView = new C.ApiListView({
			fn : $client.getElectricityList,
			listName : 'billList',
			limit:5,
			beforeRefresh:beforeRefresh
		});
		 listView.setQueryOptions(opts);

	} else if (type == 'GET_BILL_MONITOR_LIST') {
		var optss={
			alarmStatus:api.pageParam.alarmStatus
		}
		console.log(JSON.stringify(optss));
		listView = new C.ApiListView({
			fn : $client.getBillMonitorList,
			listName : 'billList',
			limit:5
		});
		listView.setQueryOptions(optss);

	} else if (type == 'GET_BILL_FINISH_LIST') {
		var optss={
				alarmStatus:api.pageParam.alarmStatus
			}
		listView = new C.ApiListView({
			fn : $client.getBillFinishList,
			listName : 'billList',
			limit:5
		});
		listView.setQueryOptions(optss);
	} else if (type == 'GET_BILL_UPDATE_LIST') {
		listView = new C.ApiListView({
			fn : $client.getBillUpgradeList,
			listName : 'billList',
			limit:5
		});
	}else if (type == 'RL_BILL') {
		var Newtime=$api.getStorage('Newtime');
		// 日历查询
		listView = new C.ApiListView({
			fn : $client.getBillCalendar,
			listName : 'billList',
			limit:10
		});
		listView.setQueryOptions({
			date:Newtime
		})
	}else if (type == 'RL_FD') {
			var Newtime=$api.getStorage('Newtime');
		// 日历查询
		listView = new C.ApiListView({
			fn : $client.getElectricityCalendar,
			listName : 'billList',
			limit:10
		});
		listView.setQueryOptions({
			date:Newtime
		})
	} else {
		api.toast({
			msg : '工单类型错误',
			location : 'bottom'
		})
	}

	listView.refresh();

	/*
	 * jQuery事件:list－item点击事件
	 */
//	$('#listView').on('click', 'li', function() {
//		var billsn = $(this).attr('billsn');
//		var billid = $(this).attr('billid');
//		var stationid = $(this).attr('stationId');
//		var billstatus = $(this).attr('billStatus');
//		openRest(billsn, billid, stationid, billstatus);
//	});
	/*
	 * jQuery事件:list－btn点击事件
	 */
	$('#listView').on('click', '.ccssoft-btn', function() {
		billAction();
		return false;
	});
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
}

String.prototype.replaceAll = function(s1,s2) {
    return this.replace(new RegExp(s1,"gm"),s2);
}

function getDateLong(date1){
//  var date1= '2016/10/25 08:00:00';  //开始时间
	date1=date1.replaceAll("-", "/");
    var date2 = new Date();    //结束时间
    var date3 = date2.getTime() - new Date(date1).getTime();   //时间差的毫秒数

//	console.log("date1"+date1+"  date3:"+date3);
    //------------------------------

    //计算出相差天数
    var days=Math.floor(date3/(24*3600*1000));
//	console.log('天数：'+days+"原数值："+date3/(24*3600*1000));
    //计算出小时数

    var leave1=date3%(24*3600*1000) ;   //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000))  ;
    //计算相差分钟数
    var leave2=leave1%(3600*1000)  ;      //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000))  ;
    //计算相差秒数
    var leave3=leave2%(60*1000) ;     //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000)  ;
//  alert(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")
	var allTime=(hours+days*24)+"小时 "+minutes+" 分钟"+seconds+" 秒";
	return allTime;
}

function getRestData(type) {

	api.showProgress({
		title : '加载中...',
		modal : true
	});
	var getMerchantUrl = '/merchant?filter=';
	var urlParam = {
		include : ["pics", "cityPointer", "typePointer"],
		where : {
			category : type
		}
	};
	ajaxRequest(getMerchantUrl + JSON.stringify(urlParam), 'GET', '', function(ret, err) {
		if (ret) {
			renderTemp('billList', 'list-template', ret);
			api.refreshHeaderLoadDone();
			api.parseTapmode();
		} else {
			api.toast({
				msg : err.msg,
				location : 'bottom'
			})
		}
		api.hideProgress();
	})
}


function openRest(billsn, billid, stationid, billstatus, gradetype,type,fsuid) {

	if(type&&type!=""){
		api.pageParam.title=type;
	}

	var user = $api.getStorage('user');
	if(api.pageParam.type){
		var ttpe=api.pageParam.type;
	}else {
		var ttpe='GET_BILL_LIST';
	}
	var opt = {
		billId : billid,
		billSn : billsn,
		stationId : stationid,
		billStatus : billstatus,
		gradetype : gradetype,
		fromsource : 'list',
		userId : user.userid,
		leadid : user.leaderid,
		type : ttpe,
		title : api.pageParam.title,
		fsuid:fsuid
	};
	api.openWin({
		name : 'main_bill_detail_win',
		url : '../bill/main_bill_detail_win.html',
		opaque : true,
		bounces : false,
		reload : true,
		pageParam : opt,
		vScrollBarEnabled : false
	});
}

function cb_queryBillList(opts) {
	opts.stationcode = opts.stationCode;
	delete opts.stationCode;
	listView.setQueryOptions(opts);
	listView.refresh();
}

/**
 *提供对外调用
 * 刷新列表
 */
function cb_refresh() {
	listView.refresh();
}

function billAction(e) {
	var evt = e ? e : window.event;
	window.event ? window.event.cancelBubble = true : evt.stopPropagation();
	var $billItem = $(event.target).parents('li');
	var type = $(event.target).text();
	var billsn = $billItem.attr('billsn');
	var billid = $billItem.attr('billId');
	var taskid = $billItem.attr('taskid');
	var billStatus = $billItem.attr('billStatus');
	var stationid = $billItem.attr('stationId');
	var faulttype = $billItem.attr('faulttype');
	var istemperature = $billItem.attr('istemperature');
	var st_areamanager = $billItem.attr('st_areamanager');
	var st_waittime = $billItem.attr('waittime');
	var st_ifbuyeletric = $billItem.attr('ifbuyeletric');
	var isstand=$billItem.attr('isstand');
	$('#actionForm [name=billsn]').val(billsn);
	switch(type) {
		case '接单':
			$aui.dialog({
				title : '是否接单?',
				text : '工单编号:' + billsn
			}, function(ret) {
				if (ret.buttonIndex) {
					var opts = {
						billId : billid,
						billSn : billsn,
						taskId : taskid,
						billStatus : 0,
						faultCouse : '手机接单',
						handlerResult : '手机接单'
					};
					actionSubmit(opts, $client.acceptBill,function(ret){
						if(ret.success){
							console.log('RSupdate3')
							updateRecommendStatus(billsn)
						}
					});
				} else {
					$aui.hideDialog();
				}
			});
			break;
		case '回单':
			var pageParam = {
				billId : billid,
				billSn : billsn,
				stationId : stationid,
				billStatus : billStatus,
				fromsource : 'list',
				type : api.pageParam.type,
				title : api.pageParam.title
			};
			var billModel = {
				billid : billid,
				billsn : billsn,
				taskid : taskid,
				faulttype : faulttype,
				istemperature : istemperature,
				isstand:isstand
			};
			$api.setStorage('billModel', billModel);
			api.openWin({
				name : 'billRevert_win',
				url : 'billRevert_win.html',
				bounces : false,
				rect : {
					x : 0,
					y : 0,
					w : 'auto',
					h : 'auto'
				},
				reload : true,
				pageParam : pageParam
			});
			break;
		case '签到':
			var location = $api.getStorage('LAST_GPS_LOCATION');
			if (location && location.status) {
				var opts = {
					billsn : billsn,
					billId : billid,
					taskId : taskid,
					signlon : location.longitude,
					signlat : location.latitude
				}
				actionSubmit(opts, $client.setBillSign);
			} else {
				$aui.toast({
					msg : '暂未定位,无法签到',
					style : 'fail'
				});
			}
			break;
		case '升级':
			$aui.dialog({
				title : '工单升级',
				text : $('#actionForm').clone()
			}, function(ret) {
				if (ret.buttonIndex) {
					var dealComment = $('.aui-dialog [name=dealComment]').val();
					if (!dealComment || !dealComment.length) {
						$aui.toast({
							msg : '请填写处理意见!',
							duratioin : '1000',
							style : 'fail'
						});
						return;
					}
					if (st_areamanager && st_areamanager != "" && st_areamanager != 'null') {
						api.showProgress({
							title : '处理中',
							modal : true
						});
						var opts = {
							billSn : billsn,
							taskId : taskid,
							linkInfo : '',
							dealComment : dealComment,
							notifyUserId : st_areamanager
						};
						actionSubmit(opts, $client.upgrade);
					} else {
						api.toast({
							msg : "站址没有配置区域经理，无法进行升级操作",
							location : 'middle'
						});
					}
				} else {
					$aui.hideDialog();
				}
			});
			break;
		case '反馈':
			$aui.dialog({
				title : '工单反馈',
				text : $('#actionForm').clone()
			}, function(ret) {
				if (ret.buttonIndex) {
					if (st_areamanager && st_areamanager != "" && st_areamanager != 'null') {
						api.showProgress({
							title : '处理中',
							modal : true
						});
						var dealComment = $('.aui-dialog [name=dealComment]').val();
						if (!dealComment || !dealComment.length) {
							$aui.toast({
								msg : '请填写处理意见!',
								duratioin : '1000',
								style : 'fail'
							});
							return;
						}
						var opts = {
							billSn : billsn,
							taskId : taskid,
							linkINfo : '',
							dealComment : dealComment,
							limitTime : '',
							notifyUserId : ''
						};
						actionSubmit(opts, $client.feedBack);
					} else {
						$aui.toast({
							msg : '站址没有配置区域经理，无法进行升级操作',
							style : 'fail'
						});
					}
				} else {
					$aui.hideDialog();
				}
			});
			break;
		case '故障确认':
			$('#actionForm [name=linkInfo]').parent().removeClass('aui-hidden');
			$('[name=linkInfo]').val($api.getStorage('user').mobilephone);
			$aui.dialog({
				title : '故障确认',
				text : $('#actionForm').clone()
			}, function(ret) {
				if (ret.buttonIndex) {
					var linkInfo = $('.aui-dialog [name=linkInfo]').val();
					var $deal = $('.aui-dialog [name=dealComment]');
					var dealComment = $('.aui-dialog [name=dealComment]').val();
					if (!dealComment || !dealComment.length) {
						$aui.toast({
							msg : '请填写处理意见!',
							duratioin : '1000',
							style : 'fail'
						});
						return;
					}
					var opts = {
						billSn : billsn,
						taskId : taskid,
						linkInfo : linkInfo,
						dealComment : dealComment
					};
					actionSubmit(opts, $client.supportConfirm);
				} else {
					$aui.hideDialog();
				}
			});
			break;
		case '故障定位':
			var pageParam = {
				billId : billid,
				billSn : billsn,
				stationId : stationid,
				billStatus : billStatus,
				fromsource : 'list',
				type : api.pageParam.type,
				title : api.pageParam.title
			};
			api.openWin({
				name : 'supportDefine_win',
				url : 'supportDefine_win.html',
				bounces : false,
				rect : {
					x : 0,
					y : 0,
					w : 'auto',
					h : 'auto'
				},
				reload : true,
				pageParam : pageParam
			});
			break;
		case '发电':
			var billModel = {
				billid : billid,
				billsn : billsn,
				taskid : taskid,
				st_waittime : st_waittime,
				st_ifbuyeletric : st_ifbuyeletric
			};
			$api.setStorage('billModel', billModel);
			api.openWin({
				name : 'billElectric_win',
				url : 'billElectric_win.html'
			});
			break;
		case '转派':
			var opt = {
				siteId : stationid
			}
			$client.getStationUsers(opt, function(ret, err) {
				if (ret) {
					if (ret.success) {
						if (ret.users && ret.users.length) {
							var $transferUseridDiv = $('#actionForm [name=transferUserid]');
							for (var i = 0; i < ret.users.length; i++) {
								var user = ret.users[i];
								var $option = $('<option>', {
									value : user.userid,
									text : user.username
								});
								$option.appendTo($transferUseridDiv);
							}
							$transferUseridDiv.parent().removeClass('aui-hidden');
						}
						$aui.dialog({
							title : '工单转派',
							text : $('#actionForm').clone()
						}, function(ret) {
							if (ret.buttonIndex) {
								var dealComment = $('.aui-dialog [name=dealComment]').val();
								var transferUserid = $('.aui-dialog [name=transferUserid]').val();
								if (!dealComment || !dealComment.length) {
									$aui.toast({
										msg : '请填写处理意见!',
										duratioin : '1000',
										style : 'fail'
									});
									return;
								}
								var opts = {
									billSn : billsn,
									taskId : taskid,
									linkInfo : '',
									dealComment : dealComment,
									transferUserId : transferUserid
								}
								actionSubmit(opts, $client.transfers);
							} else {
								$aui.hideDialog();
							}
						});
					} else {
						$aui.toast({
							msg : data_info,
							style : ' info'
						});
					}
				} else {
					$aui.toast({
						msg : err.msg,
						style : ' fail'
					});
				}

			});
			break;
		case '催办':
			$aui.dialog({
				title : '工单催办',
				text : $('#actionForm').clone()
			}, function(ret) {
				if (ret.buttonIndex) {
					var dealComment = $('.aui-dialog [name=dealComment]').val();
					if (!dealComment || !dealComment.length) {
						$aui.toast({
							msg : '请填写处理意见!',
							duratioin : '1000',
							style : 'fail'
						});
						return;
					}
					var opts = {
						billSn : billsn,
						taskId : taskid,
						linkINfo : '',
						dealComment : dealComment,
						limitTime : '',
						notifyUserId : $api.getStorage('user').userid
					};
					actionSubmit(opts, $client.reminder);
				} else {
					$aui.hideDialog();
				}
			});
			break;
	}

}
//统一访问接口
function actionSubmit(opts, callFn, callback) {
	$aui.hideDialog();
	api.showProgress({
		title : '处理中...'
	});
	callFn(opts, function(ret, err) {
		if (ret) {
			if (ret.success) {
				$aui.toast({
					msg : '操作成功'
				}, function() {
					cb_refresh();
				});
				if (callback) {
					callback(ret);
				}
			} else {
				$aui.toast({
					msg : ret.data_info,
					styel : 'info'
				});
			}
		} else {
			$aui.toast({
				msg : '接口访问失败',
				styel : 'fail'
			});
		}
		api.hideProgress();
	})
}
