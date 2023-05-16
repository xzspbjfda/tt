var gradeType = "";
var idclean = "";
var billModel = null;
var isJishu = "Y";
var lon;
var lat;
var listView;
apiready = function() {
	initHeader();
	billModel = $api.getStorage('billModel');
	var user= $api.getStorage("user");
	var leadid=user.leaderid;

	if (billModel) {
		// wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
		if(api.pageParam.type=='GET_BILL_FD'){
			billModel.billFromType ='GET_BILL_LIST'
		}else {
			billModel.billFromType = api.pageParam.type;
		}
		// wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

		//alert("billFromType:"+api.pageParam.type);
//		billModel.gradetype = api.pageParam.gradetype;
		billModel.leadid=leadid;

		console.log(getObj(billModel));

		renderTemp('billMenuMain', 'billMenu-template', billModel);
		// consoleObj(billModel);
	}
}

/*
*   dev:dingxb
*   date:2019/2/14
*   description:社交平台分享功能，通过index标识，决定需要分享的社交平台，各个社交平台的导入，需要在config.xml中配置相关平台信息，并且
*   要求社交平台已经开放相关功能才能分享
*/
function shareDetail(index){//分享功能，index值从0到4依次代表QQ好友、QQ空间、微信好友、朋友圈、微博
	billDetailInfo = $api.getStorage('billDetailInfo');
	var text="---------工单信息---------"+"\n"+
"工单编号："+(billDetailInfo.list.billsn==null||billDetailInfo.list.billsn=="undefined"?"":billDetailInfo.list.billsn)+"\n"+
"工单状态："+(billDetailInfo.list.billstatusname==null||billDetailInfo.list.billstatusname=="undefined"?"":billDetailInfo.list.billstatusname)+"\n"+
"工单类型："+(billDetailInfo.list.businesstype==null||billDetailInfo.list.businesstype=="undefined"?"":billDetailInfo.list.businesstype)+"\n"+
"故障来源："+(billDetailInfo.list.faultsrc==null||billDetailInfo.list.faultsrc=="undefined"?"":billDetailInfo.list.faultsrc)+"\n"+
"工单内容："+(billDetailInfo.list.billtitle==null||billDetailInfo.list.billtitle=="undefined"?"":billDetailInfo.list.billtitle)+"\n"+
"派单时间："+(billDetailInfo.list.dispatchtime==null||billDetailInfo.list.dispatchtime=="undefined"?"":billDetailInfo.list.dispatchtime)+"\n"+
"所属省："+(billDetailInfo.list.nativenetid==null||billDetailInfo.list.nativenetid=="undefined"?"":billDetailInfo.list.nativenetid)+"\n"+
"所属地市："+(billDetailInfo.list.bureauid==null||billDetailInfo.list.bureauid=="undefined"?"":billDetailInfo.list.bureauid)+"\n"+
"所属区县："+(billDetailInfo.list.regionid==null||billDetailInfo.list.regionid=="undefined"?"":billDetailInfo.list.regionid)+"\n"+
"站址名："+(billDetailInfo.list.st_name==null||billDetailInfo.list.st_name=="undefined"?"":billDetailInfo.list.st_name)+"\n"+
"---------发电信息---------"+"\n"+
"电池组数："+(billDetailInfo.list.backuppowernum==null||billDetailInfo.list.backuppowernum=="undefined"?"":billDetailInfo.list.backuppowernum)+"\n"+
"从驻点上站时长："+(billDetailInfo.list.onstation_time==null||billDetailInfo.list.onstation_time=="undefined"?"":billDetailInfo.list.onstation_time)+"\n"+
"发电接口位置："+(billDetailInfo.list.powerinterface==null||billDetailInfo.list.powerinterface=="undefined"?"":billDetailInfo.list.powerinterface)+"\n"+
"业主姓名："+(billDetailInfo.list.contact==null||billDetailInfo.list.contact=="undefined"?"":billDetailInfo.list.contact)+"\n"+
"联系方式："+(billDetailInfo.list.contact_tele==null||billDetailInfo.list.contact_tele=="undefined"?"":billDetailInfo.list.contact_tele)+"\n"+
"直流总负载："+(billDetailInfo.list.dcload==null||billDetailInfo.list.dcload=="undefined"?"":billDetailInfo.list.dcload)+"\n"+
"是否有固定油机："+(billDetailInfo.list.configoilmachine==null||billDetailInfo.list.configoilmachine=="undefined"?"":billDetailInfo.list.configoilmachine)+"\n"+
"蓄电池续航时间："+(billDetailInfo.list.capacity_battery==null||billDetailInfo.list.capacity_battery=="undefined"?"":billDetailInfo.list.capacity_battery)+"\n"+
"站点所在电力线路："+(billDetailInfo.list.linename==null||billDetailInfo.list.linename=="undefined"?"":billDetailInfo.list.linename)+"\n"+
"告警是否恢复："+(billDetailInfo.list.alarm_isrecovery==null||billDetailInfo.list.alarm_isrecovery=="undefined"?"":(billDetailInfo.list.alarm_isrecovery=='Y'?'已恢复':'未恢复'))+"\n"+
"恢复时间："+(billDetailInfo.list.fault_recover_time==null||billDetailInfo.list.fault_recover_time=="undefined"?"":billDetailInfo.list.fault_recover_time)+"\n"+
"告警恢复时间："+(billDetailInfo.list.recovery_time==null||billDetailInfo.list.recovery_time=="undefined"?"":billDetailInfo.list.recovery_time)+"\n"+
"运营商异常是否已恢复："+(billDetailInfo.list.isrecovery==null||billDetailInfo.list.isrecovery=="undefined"?"":billDetailInfo.list.isrecovery)+"\n"+
"异常恢复时间："+(billDetailInfo.list.recovery_time==null||billDetailInfo.list.recovery_time=="undefined"?"":billDetailInfo.list.recovery_time)+"\n"+
"运营商判定是否可以归档："+(billDetailInfo.list.canfiled==null||billDetailInfo.list.canfiled=="undefined"?"":billDetailInfo.list.canfiled)+"\n"+
"申请延时的时间（小时）："+(billDetailInfo.list.delay_hour==null||billDetailInfo.list.delay_hour=="undefined"?"":billDetailInfo.list.delay_hour)+"\n"+
"申请延时原因分类："+(billDetailInfo.list.delay_type==null||billDetailInfo.list.delay_type=="undefined"?"":billDetailInfo.list.delay_type)+"\n"+
"延时成功或失败："+(billDetailInfo.list.delay_success==null||billDetailInfo.list.delay_success=="undefined"?"":billDetailInfo.list.delay_success)+"\n"+
"延时失败原因："+(billDetailInfo.list.delay_fail_reason==null||billDetailInfo.list.delay_fail_reason=="undefined"?"":billDetailInfo.list.delay_fail_reason)+"\n"+
"是否抑制工单："+(billDetailInfo.list.is_restrain_bill==null||billDetailInfo.list.is_restrain_bill=="undefined"?"":(billDetailInfo.list.is_restrain_bill=='Y' ? '是':'否'))+"\n"+
"抑制原因："+(billDetailInfo.list.restrain_reason==null||billDetailInfo.list.restrain_reason=="undefined"?"":billDetailInfo.list.restrain_reason)+"\n"+
"重保等级："+(billDetailInfo.list.ms_sitelevel==null||billDetailInfo.list.ms_sitelevel=="undefined"?"":(billDetailInfo.list.ms_sitelevel=='GD'? "高等级":"低等级"))+"\n"+
"重保开始时间："+(billDetailInfo.list.ms_starttime==null||billDetailInfo.list.ms_starttime=="undefined"?"":billDetailInfo.list.ms_starttime)+"\n"+
"重保内容："+(billDetailInfo.list.ms_remark==null||billDetailInfo.list.ms_remark=="undefined"?"":billDetailInfo.list.ms_remark)+"\n"+
"---------站址运营商信息---------"+"\n"+
"运营商类型："+(billDetailInfo.list.yys==null||billDetailInfo.list.yys=="undefined"?"":billDetailInfo.list.yys)+"\n"+
"站址维护服务等级："+(billDetailInfo.list.st_operators_level_dictvalue==null||billDetailInfo.list.st_operators_level_dictvalue=="undefined"?"":(billDetailInfo.list.st_operators_level_dictvalue=='BZ'?"标准":"高级"))+"\n"+
"---------受理信息---------"+"\n"+
"申告人："+(billDetailInfo.list.declare_person==null||billDetailInfo.list.declare_person=="undefined"?"":billDetailInfo.list.declare_person)+"\n"+
"申告电话："+(billDetailInfo.list.declare_telepho==null||billDetailInfo.list.declare_telepho=="undefined"?"":billDetailInfo.list.declare_telepho)+"\n"+
"申告时间："+(billDetailInfo.list.dispatchtime==null||billDetailInfo.list.dispatchtime=="undefined"?"":billDetailInfo.list.dispatchtime)+"\n"+
"联系人："+(billDetailInfo.list.contact==null||billDetailInfo.list.contact=="undefined"?"":billDetailInfo.list.contact)+"\n"+
"联系人电话："+(billDetailInfo.list.contactmode==null||billDetailInfo.list.contactmode=="undefined"?"":billDetailInfo.list.contactmode)+"\n"+
"受理人："+(billDetailInfo.list.createopen==null||billDetailInfo.list.createopen=="undefined"?"":billDetailInfo.list.createopen)+"\n"+
"受理人电话："+(billDetailInfo.list.createlinkinfo==null||billDetailInfo.list.createlinkinfo=="undefined"?"":billDetailInfo.list.createlinkinfo)+"\n"+
"受理时间："+(billDetailInfo.list.createtime==null||billDetailInfo.list.createtime=="undefined"?"":billDetailInfo.list.createtime)+"\n"+
"---------室分故障定位信息---------"+"\n"+
"确认时间："+(billDetailInfo.list.define_confirm_time==null||billDetailInfo.list.define_confirm_time=="undefined"?"":billDetailInfo.list.define_confirm_time)+"\n"+
"铁塔确认人："+(billDetailInfo.list.define_itower_confirm_people==null||billDetailInfo.list.define_itower_confirm_people=="undefined"?"":billDetailInfo.list.define_itower_confirm_people)+"\n"+
"运营商确认人："+(billDetailInfo.list.define_carrier_confirm_people==null||billDetailInfo.list.define_carrier_confirm_people=="undefined"?"":billDetailInfo.list.define_carrier_confirm_people)+"\n"+
"故障责任方："+(billDetailInfo.list.define_fault_duty==null||billDetailInfo.list.define_fault_duty=="undefined"?"":billDetailInfo.list.define_fault_duty)+"\n"+
"故障级别："+(billDetailInfo.list.define_fault_level==null||billDetailInfo.list.define_fault_level=="undefined"?"":billDetailInfo.list.define_fault_level)+"\n"+
"备注："+(billDetailInfo.list.define_deal_result==null||billDetailInfo.list.define_deal_result=="undefined"?"":billDetailInfo.list.define_deal_result)+"\n"+
"---------回单信息---------"+"\n"+
"回单人："+(billDetailInfo.list.last_deal_object_name==null||billDetailInfo.list.last_deal_object_name=="undefined"?"":billDetailInfo.list.last_deal_object_name)+"\n"+
"回单时间："+(billDetailInfo.list.reverttime==null||billDetailInfo.list.reverttime=="undefined"?"":billDetailInfo.list.reverttime)+"\n"+
"故障类型："+(billDetailInfo.list.faulttype==null||billDetailInfo.list.faulttype=="undefined"?"":billDetailInfo.list.faulttype)+"\n"+
"故障修复时间："+(billDetailInfo.list.fault_recover_time==null||billDetailInfo.list.fault_recover_time=="undefined"?"":billDetailInfo.list.fault_recover_time)+"\n"+
"故障发生省："+(billDetailInfo.list.nativenetid==null||billDetailInfo.list.nativenetid=="undefined"?"":billDetailInfo.list.nativenetid)+"\n"+
"故障原因："+(billDetailInfo.list.fault_case==null||billDetailInfo.list.fault_case=="undefined"?"":billDetailInfo.list.fault_case)+"\n"+
"处理措施："+(billDetailInfo.list.deal_result==null||billDetailInfo.list.deal_result=="undefined"?"":billDetailInfo.list.deal_result)+"\n"+
"处理结果："+(billDetailInfo.list.alarm_isrecovery==null||billDetailInfo.list.alarm_isrecovery=="undefined"?"":(billDetailInfo.list.alarm_isrecovery== 'Y'?'已恢复':'处理中'))+"\n"+
"是否验证："+(billDetailInfo.list.billstatus==null||billDetailInfo.list.billstatus=="undefined"?"":(billDetailInfo.list.billstatus == 'REVERTED'?'是':'否'))+"\n"+
"验证方式："+"人工"+"\n"+
"是否上站："+(billDetailInfo.list.rev_isup_station==null||billDetailInfo.list.rev_isup_station=="undefined"?"":(billDetailInfo.list.rev_isup_station == 'Y'?'是':'否'))+"\n"+
"故障免责类型："+(billDetailInfo.list.rev_disclaimer_itmes==null||billDetailInfo.list.rev_disclaimer_itmes=="undefined"?"":billDetailInfo.list.rev_disclaimer_itmes)+"\n"+
"免责原因说明："+(billDetailInfo.list.rev_disclaimer_reson==null||billDetailInfo.list.rev_disclaimer_reson=="undefined"?"":billDetailInfo.list.rev_disclaimer_reson)+"\n"





	if (index == 2) {
				var wx = api.require('wx');//引入微信模块
				wx.isInstalled(function(ret, err) {//判断当前设备是否安装微信客户端
								wx.shareText({//分享网页
										apiKey: 'wxa351d767f6c459af',//可选项）从微信开放平台获取的 appid，若不传则从当前 widget 的 config.xml 中读取。
										scene: 'session', //（不能为空）字符串类型，有三个可选项，分别是朋友圈（timeline）,会话(session),收藏（favorite）
										text:text
								}, function(ret, err) {//根据返回的结果显示提示信息
										if (ret.status) {
												api.toast({
														msg: '分享成功',//提示信息
														duration: 2000,//显示时长
														location: 'bottom'//显示位置
												});
										} else {
												api.toast({
														msg: '分享失败',
														duration: 2000,
														location: 'bottom'
												});
										}
								});
				});

		}else if (index == 3) {
				var wx = api.require('wx');
				wx.isInstalled(function(ret, err) {
								wx.shareText({//分享盆友圈
										apiKey: 'wxa351d767f6c459af',//可选项）从微信开放平台获取的 appid，若不传则从当前 widget 的 config.xml 中读取。
										scene: 'timeline', //（不能为空）字符串类型，有三个可选项，分别是朋友圈（timeline）,会话(session),收藏（favorite）
										text:text
								}, function(ret, err) {//根据返回的结果显示提示信息
											if (ret.status) {
													api.toast({
															msg: '分享成功',
															duration: 2000,
															location: 'bottom'
													});
											} else {
													api.toast({
															msg: '分享失败',
															duration: 2000,
															location: 'bottom'
													});
											}
									});
					});

			}else if(index==0){//分享到qq好友
							api.toast({
									msg: 'QQ好友功能暂未开放',
									duration: 2000,
									location: 'bottom'
							});
			  // var qq = api.require('qq');///获取QQ模块
				// qq.installed(function(ret, err) {///判断当前设备是否安装微信客户端
				// 		if (ret.status) {
				// 			qq.shareText({
				// 					url: 'http://m.xyan.cn/share',
				// 					title: '校言，大学生都在用的APP',
				// 					description: '记录点滴校园生活，让你的大学style与众不同。',
				// 					imgUrl: 'widget://image/icon-20.png',
				// 					type: 'QFriend'
				// 			});
				// 		} else {
				// 			api.toast({
				// 					msg: '当前设备未安装QQ',
				// 					duration: 2000,
				// 					location: 'bottom'
				// 			});
				// 		}
				// });
		}else if(index==1){
			api.toast({
					msg: 'QQ空间功能暂未开放',
					duration: 2000,
					location: 'bottom'
			});
			  // var qq = api.require('qq');
				// qq.installed(function(ret, err) {
				// 		if (ret.status) {
				// 			qq.shareNews({
				// 					url: 'http://m.xyan.cn/share',
				// 					title: '校言，大学生都在用的APP',
				// 					description: '记录点滴校园生活，让你的大学style与众不同。',
				// 					imgUrl: 'widget://image/icon-20.png',
				// 					type: 'QZone'
				// 			});
				// 		} else {
				// 			api.toast({
				// 					msg: '当前设备未安装QQ',
				// 					duration: 2000,
				// 					location: 'bottom'
				// 			});
				// 		}
				// });
		}else if(index==4){
			api.toast({
					msg: '微博功能暂未开放',
					duration: 2000,
					location: 'bottom'
			});

		}
}
//点击菜单触发的事件
function optBill(type) {

	var billModel = $api.getStorage('billModel');
	api.pageParam.operateType = type;
	//	if (billModel) {
	//		billModel.operateType = type;
	//	}
	var user = $api.getStorage('user');
	var userId = user.userid;
	document.getElementById('transferLabelDivId').style.display = "none";
	document.getElementById('transferSelDivId').style.display = "none";
	document.getElementById('shadowId').style.display = "none";
	document.getElementById('billMenuMain').style.display = "none";

	if (type == "ACCEPT") {
		var snVal = "编号：" + billModel.billsn;
		var titleVal = "内容：" + billModel.billtitle;
		$api.byId('acceptSnId').innerHTML = snVal;
		$api.byId('acceptTitleId').innerHTML = titleVal;
		easyDialog.open({
			container : 'acceptDiv',
			fixed : false
		});
	} else if (type == "SHARE") {//dingxb 2019/2/14 工单分享功能，点击右上角分享，从下部弹出分享框，可以分享到微信QQ等社交平台
		var MNActionButton = api.require('MNActionButton');
			MNActionButton.open({
				layout : {
					row : 2, //（可选项）数字类型；每屏显示菜单按钮的行数；默认：2
					col : 3, //（可选项）数字类型；每屏显示菜单按钮的列数；默认：3
					rowSpacing : 10, //（可选项）数字类型；行与行之间的距离；默认：10
					colSpacing :55, //（可选项）数字类型；列与列之间的距离；默认：10
					offset : 0 //（可选项）数字类型；整个菜单底部距离所属 window 底部的距离，只能为正整数；默认：0
				},
				animation : true, //（可选项）布尔类型；弹出和隐藏菜单时是否带弹出动画效果，true|false；默认：true
				autoHide : true, //（可选项）布尔类型；点击菜单按钮后是否自动隐藏菜单，true|false；默认：true
				styles : {
					maskBg : 'rgba(0,0,0,0.2)', //（可选项）字符串类型；遮罩层背景，支持 rgb，rgba，#，img；默认：rgba(0,0,0,0.2)
					bg : '#fff', //（可选项）字符串类型；菜单有效区域背景，支持 rgb，rgba，#，img；默认：#fff
					cancelButton : {//（可选项）JSON 对象类型，取消按钮设置
						size : 30, //（可选项）数字类型；底部取消按钮的高和宽；默认：44
						bg : '#fff', //（可选项）字符串类型；取消按钮的 100% 宽度的背景，支持rgb，rgba，#，img；默认：'#fff'
						icon : '../../image/share/iconfont-cancel.png', //（可选项）字符串类型：取消按钮的图标，要求本地路径（widget://、fs://）；默认：默认X型图标
					},
					item : {//（可选项）JSON 对象类型，菜单按钮设置
						titleColor : '#848484', //（可选项）字符串类型；菜单按钮文字颜色，支持 rgb，rgba，#；默认：#848484
						titleHighlight : 'dd2727', //（可选项）字符串类型；菜单按钮文字高亮颜色，支持 rgb，rgba，#；默认：同 titleColor
						titleSize : 12,                 //（可选项）数字类型；菜单按钮文字大小，同时也是文字栏所占高度，值为 0 时不显示文字栏；默认：12
					},
					indicator : {//（可选项）JSON 对象类型；页标指示器样式，若不传则不显示该指示器
						color : '#c4c4c4', //（可选项）字符串类型；其它页指示器颜色；支持rgb、rgba、#；默认：'#c4c4c4'
						highlight : '#9e9e9e' //（可选项）字符串类型；当前页指示器颜色；支持rgb、rgba、#；默认：'#9e9e9e'
					}
				},
				items : [{//JSON 对象类型；一个菜单项的设置信息
					icon : '../../image/share/iconfont-qq.png', //（可选项）字符串类型；一个菜单按钮的图标，支持 rgb，rgba，#，img；默认：#fff
					title : 'QQ好友' //字符串类型；菜单按钮的文字；默认：未设置时不显示，但文字栏仍按 titleSize 设置显示高度
				}, {
					icon : '../../image/share/iconfont-kongjian.png',
					title : 'QQ空间'
				}, {
					icon : '../../image/share/iconfont-weixin.png',
					title : '微信好友'
				}, {
					icon : '../../image/share/iconfont-pengyouquan.png',
					title : '朋友圈'
				}, {
					icon : '../../image/share/iconfont-weibo.png',
					title : '微博'
				}]
			}, function(ret, err) {
				if (ret) {
              if (ret.eventType == 'click') {
								shareDetail(ret.index);
              }
          } else {
							return;
				}
			});
	}else if (type == "UPGRADE") {
		$api.byId('spanTitleId').innerHTML = "工单升级";
		$api.byId('transferLabelDivId').style.display = "";
		$api.byId('contactTelSpanId').style.display = "";
		$api.byId('user_name').innerHTML = "操作人：" + user.username;
//		$('#user_name')
//		document.get
		$api.byId('contactTelTextId').value = user.mobilephone;
		$('#areaManagerLabelDivId').show();
		easyDialog.open({
			container : 'otherDiv',
			fixed : false
		});
		$api.byId('optTypeId').value = "UPGRADE";
		if ("GET_BILL_LIST" == api.pageParam.type) {
			$api.byId('the_username').innerHTML = "区域经理助理:";
			$client.getAreaManagersNext({
				billid : billModel.billid,
				siteid : billModel.st_id
			}, function(ret, err) {
				if (ret) {
					if (ret.success) {

						var areaManagers = ret.list;
						for (var i = 0, size = areaManagers.length; i < size; i++) {
							$('<option>').text(areaManagers[i].username).val(areaManagers[i].userid).appendTo('#areaManagerId');
						}
						easyDialog.open({
							container : 'otherDiv',
							fixed : false
						});
					} else {
						api.toast({
							msg : ret.data_info
						});
					}
				} else {
					api.toast({
						msg : err.msg
					});
				}
			});
		} else if ("GET_BILL_UPDATE_LIST" == api.pageParam.type) {

			$api.byId('isjishuSpanId').style.display = "";
			$api.byId('the_username').innerHTML = "技术专家:";
			$client.getTechPeople({
				billid : billModel.billid,
				billSn : billModel.billsn
			}, function(ret, err) {
				if (ret) {
					if (ret.success) {
						var areaManagers = ret.list;
						for (var i = 0, size = areaManagers.length; i < size; i++) {
							$('<option>').text(areaManagers[i].username + "(" + areaManagers[i].type + ")").val(areaManagers[i].userid).appendTo('#areaManagerId');
						}

						easyDialog.open({
							container : 'otherDiv',
							fixed : false
						});
					} else {
						api.toast({
							msg : ret.data_info
						});
					}
				} else {
					api.toast({
						msg : err.msg
					});
				}
			});

		}
	} else if (type == "FEEDBACK") {
		$api.byId('spanTitleId').innerHTML = "工单反馈";
		$api.byId('transferLabelDivId').style.display = "";
		$api.byId('contactTelSpanId').style.display = "";
		$api.byId('isshowSel').style.display = "";
		$api.byId('opinionLabelDiv').style.marginBottom="0px";
		$api.byId('user_name').innerHTML = "操作人：" + user.username;
		$api.byId('contactTelTextId').value = user.mobilephone;
		$api.byId('optTypeId').value = "FEEDBACK";
		easyDialog.open({
			container : 'otherDiv',
			fixed : false
		});
	} else if (type == "UPSTATIONSIGN") {
		//故障工单到站时风险提醒
		$api.setStorage('apiPageParam',api.pageParam);
		api.openFrame({
			name : 'riskTip',
			url : env.getRiskTipUrl() + "?time=10&event=onRiskTipDone&v=" + new Date().getTime(),
			bounces : false,
			rect : {x : 0, y : 0, w : 'auto', h : 'auto'},
			pageParam : api.pageParam,
			reload : true
		});
		//openBillList("upStationSign_win");
	}
	else if (type == "ISUPSTATION") {//是否需要上站
		$api.byId('spanTitleId').innerHTML = "是否需要上站";

		$api.byId('opinionLabelDiv').style.display = "none";
		$api.byId('transferLabelDivId').style.display = "";
		$api.byId('contactTelSpanId').style.display = "";
		$api.byId('isUpstationSpanId').style.display = "";
		$api.byId('user_name').innerHTML = "操作人：" + user.username;
		$api.byId('contactTelTextId').value = user.mobilephone;
		$api.byId('optTypeId').value = "ISUPSTATION";
		easyDialog.open({
			container : 'otherDiv',
			fixed : false
		});
	}else if (type == "CON_CONFIRM") {//运营商确认
		$api.byId('spanTitleId').innerHTML = "运营商是否同意发电";
		$api.byId('is_tipsid').innerHTML = "是否同意:";
		$api.byId('transferLabelDivId').style.display = "";
		$api.byId('contactTelSpanId').style.display = "";
		$api.byId('isUpstationSpanId').style.display = "";
		$api.byId('user_name').innerHTML = "操作人：" + user.username;
		$api.byId('contactTelTextId').value = user.mobilephone;
		$api.byId('optTypeId').value = "CON_CONFIRM";
		easyDialog.open({
			container : 'otherDiv',
			fixed : false
		});
	} else if (type == "CON_APPROVE") {//运营商确认
		$api.byId('spanTitleId').innerHTML = "运营商认可";
		$api.byId('is_tipsid').innerHTML = "是否认可:";
		$api.byId('transferLabelDivId').style.display = "";
		$api.byId('contactTelSpanId').style.display = "";
		$api.byId('isUpstationSpanId').style.display = "";
		$api.byId('user_name').innerHTML = "操作人：" + user.username;
		$api.byId('contactTelTextId').value = user.mobilephone;
		$api.byId('optTypeId').value = "CON_APPROVE";
		easyDialog.open({
			container : 'otherDiv',
			fixed : false
		});
	} else if (type == "REPLY") {
		$api.byId('spanTitleId').innerHTML = "支撑回复";
		$api.byId('transferLabelDivId').style.display = "";
		$api.byId('contactTelSpanId').style.display = "";
		$api.byId('user_name').innerHTML = "操作人：" + user.username;
		$api.byId('contactTelTextId').value = user.mobilephone;
		$api.byId('optTypeId').value = "REPLY";
		easyDialog.open({
			container : 'otherDiv',
			fixed : false
		});
	} else if (type == "TRANSFERS") {
		$api.byId('spanTitleId').innerHTML = "工单转派";
		$api.byId('optTypeId').value = "TRANSFERS";
		$api.byId('transferLabelDivId').style.display = "";
		$api.byId('contactTelSpanId').style.display = "";
		$api.byId('user_name').innerHTML = "操作人：" + user.username;
		$api.byId('contactTelTextId').value = user.mobilephone;
		$api.byId('transferSelDivId').style.display = "";
		var stationId = api.pageParam.stationId;

		var opt = {
			siteId : stationId,
			countyid : billModel.countyid
		};
		$client.getStationUsers(opt, function(ret, err) {
			if (ret) {
				//var strs = $api.jsonToStr(ret);
				//alert(strs);
				if (ret.success) {
					var areaManagers = ret.users;
					for (var i = 0, size = areaManagers.length; i < size; i++) {
						$('<option>').text(areaManagers[i].username).val(areaManagers[i].userid).appendTo('#transferSelId');
					}

				}
				easyDialog.open({
					container : 'otherDiv',
					fixed : false
				});
			}
		});
	} else if (type == "SUPPORTCONFIRM") {
		var user = $api.getStorage('user');
		$api.byId('spanTitleId').innerHTML = "故障确认";
		$api.byId('optTypeId').value = "SUPPORTCONFIRM";
		//		$api.byId('contactTelTrId').style.display = "";
		$api.byId('transferLabelDivId').style.display = "";
		$api.byId('user_name').innerHTML = "操作人：" + user.username;
		$api.byId('contactTelSpanId').style.display = "";
		$api.byId('contactTelTextId').value = user.mobilephone;
		easyDialog.open({
			container : 'otherDiv',
			fixed : false
		});
	} else if (type == "ADDDEAL") {
		var user = $api.getStorage('user');
		$api.byId('spanTitleId').innerHTML = "故障追加描述";
		$api.byId('optTypeId').value = "ADDDEAL";
		$api.byId('contactTelSpanId').style.display = "";
		$api.byId('transferLabelDivId').style.display = "";
		$api.byId('user_name').innerHTML = "操作人：" + user.username;
		$api.byId('contactTelTextId').value = user.mobilephone;
		easyDialog.open({
			container : 'otherDiv',
			fixed : false
		});
	} else if (type == "DEFINE") {
		openBillList("supportDefine_win");
//		closeFrame('');
	} else if (type == "REMINDER") {
		$api.byId('spanTitleId').innerHTML = "工单催办";
		$api.byId('contactTelSpanId').style.display = "";
		$api.byId('transferLabelDivId').style.display = "";
		$api.byId('user_name').innerHTML = "操作人：" + user.username;
		$api.byId('contactTelTextId').value = user.mobilephone;
		$api.byId('optTypeId').value = "REMINDER";
		easyDialog.open({
			container : 'otherDiv',
			fixed : false
		});
	} else if (type == "REVERT") {
		var billDetailInfo = $api.getStorage('billDetailInfo');
		  var alarm_ = billDetailInfo.list.alarm_isrecovery;
		  // if(alarm_ != undefined && alarm_ == "N"){
		  //  api.alert({
		  //   msg : "告警未恢复"
		  //     });
		  //  return false;
		  // }

		// alert(api.pageParam.warning);
		// wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
		// var billDetailInfo = $api.getStorage('billDetailInfo');
		// var opt={
		// 		billsn : billDetailInfo.list.billsn,
		// 		history_lasttime : '',
		// 		listName : 'list'
		// };
		// var warningList=[];
		// $client.getBillAlarmList(opt,
		// 	function(ret,arr){
		// 		for (var i = 0; i < ret.list.length; i++) {
		// 			warningList.push(ret.list[i].alarmname);
		// 		}
		// 		if (warningList.indexOf('0417005001')>-1||
		// 	warningList.indexOf('0417006001')>-1||warningList.indexOf('0499005001')>-1
		// ||warningList.indexOf('0499006001')>-1) {
		// 			api.alert({
		// 					title: '提示',
		// 					msg: '门磁或门锁开关告警未消除，请重新确认！',
		// 			}, function(ret, err) {
		// 					api.closeFrame({
		// 							name: 'billMenu_frm'
		// 					});
		// 			});
		// 		}else {
		// 			openBillList("billRevert_win");
		// 		}
		// });

		openBillList("billRevert_win");
		// wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


//		api.closeFrame();
	}  else if (type == "ELECTRIC_END") {
		openBillList("billRevert_win");
//		api.closeFrame();
	}  else if (type == "ELECTRIC_BEGIN") {
		//发电工单到站时风险提醒
		$api.setStorage('apiPageParam',api.pageParam);
		api.openFrame({
			name : 'riskTip',
			url : env.getRiskTipUrl() + "?time=10&event=onRiskTipDoneFd&v=" + new Date().getTime(),
			bounces : false,
			rect : {x : 0, y : 0, w : 'auto', h : 'auto'},
			pageParam : api.pageParam,
			reload : true
		});
		//openBillList("billRevert_win");
	} else if (type == "ELECTRIC_JUDGE") {
		openBillList("billElectric_win");
//		closeFrame('');
	} else if (type == 'TAKEPHOTO') {

		api.execScript({
			frameName : 'billDetail',
			script : 'cb_openBillPicDetail();'
		});
		api.closeFrame();
	}  else if (type == 'ENCLOSURE') {

		api.execScript({
			frameName : 'billDetail',
			script : 'cb_openBillFJDetail();'
		});
		api.closeFrame();
	} else if (type == 'PERFORMANCEQUERY') {
		api.execScript({
			frameName : 'billDetail',
			script : 'performanceQuery();'
		});
		closeFrame('');
	} else if (type == 'REGISTER') {
		openBillList("upStationSign_win");
//		api.closeFrame();
	}  else if (type == 'NAVTOSTATION') {
		api.openWin({
				name : 'mapHeader',
				url : '../mapHeader.html',
				reload : true
			});
			//延时关闭
		window.setTimeout("api.closeFrame()", 1000);
	} else if (type == 'OPENDOOR_1') {//zhangzhitao wxx
		// GENERELEC停电
		// 2001开关电源设备故障
		// 2002蓄电池设备故障
		// 2003机房环境设备故障
		// 2004空调设备故障
		// NOSIGNAL无信号(已停用)
		// OTHER其它
		// 2005断站退服
		// 4001室分故障
		// var t_faulttype = billModel.faulttype;
		// if(t_faulttype=="GENERELEC"){//停电工单
		//
		// }else if(t_faulttype==""){
		//
		// }
		//alert("1");
		var pageParam = {
				// fsuid : $(el).attr("data-fsuid"),
				// devicecode : $(el).attr("data-devicecode"),
				// signal : $(el).attr("data-signal"),
				// devicename : $(el).attr("data-name"),
				// stationName : api.pageParam.stationName,
				t_workKind:"1",
				t_cause:"故障处理"
		};
		api.openWin({
				name : 'autoOpenDoor_win',
				url : '../autoOpenDoor_win.html',
				bounces : false,
				pageParam : pageParam
		});
		//延时关闭
		window.setTimeout("api.closeFrame()", 1000);
	}else if (type == 'OPENDOOR_2') {//zhangzhitao wxx
		//alert("2");
		var pageParam = {
				// fsuid : $(el).attr("data-fsuid"),
				// devicecode : $(el).attr("data-devicecode"),
				// signal : $(el).attr("data-signal"),
				// devicename : $(el).attr("data-name"),
				// stationName : api.pageParam.stationName,
				t_cause:"应急发电"
		};
		api.openWin({
				name : 'autoOpenDoor_win',
				url : '../autoOpenDoor_win.html',
				bounces : false,
				pageParam : pageParam
		});
		//延时关闭
		window.setTimeout("api.closeFrame()", 1000);
	} else {
		api.toast({
			msg : "正在开发中",
			location : 'bottom'
		});
	}
}

function selectIsNeed(el) {
	var isNeed = $(el).val();
	if ("Y" == isNeed) {
		$api.byId('opinionLabelDiv').style.display = "none";
	} else {
		$api.byId('opinionLabelDiv').style.display = "";
//		$api.byId('noNeed').innerHTML = "不需要上站原因:";

	}
}

function selectIsJishu(el) {
	isJishu = $(el).val();
	if ("Y" == isJishu) {//技术专家列表
		$api.byId('the_username').innerHTML = "技术专家:";
		$client.getTechPeople({
			billid : billModel.billid,
			billsn : billModel.billsn
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					$('#areaManagerId').empty();
					var areaManagers = ret.list;
					for (var i = 0, size = areaManagers.length; i < size; i++) {
						$('<option>').text(areaManagers[i].username + "(" + areaManagers[i].type + ")").val(areaManagers[i].userid).appendTo('#areaManagerId');
					}
					easyDialog.open({
						container : 'otherDiv',
						fixed : false
					});
				} else {
					api.toast({
						msg : ret.data_info
					});
				}
			} else {
				api.toast({
					msg : err.msg
				});
			}
		});
	} else if ("N" == isJishu) {//区域经理
		$api.byId('the_username').innerHTML = "区域经理:";
		$client.getAreaManagers({
			billid : billModel.billid,
			siteid : billModel.st_id
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					$('#areaManagerId').empty();
					var areaManagers = ret.list;
					for (var i = 0, size = areaManagers.length; i < size; i++) {
						$('<option>').text(areaManagers[i].username).val(areaManagers[i].userid).appendTo('#areaManagerId');
					}
					easyDialog.open({
						container : 'otherDiv',
						fixed : false
					});
				} else {
					api.toast({
						msg : ret.data_info
					});
				}
			} else {
				api.toast({
					msg : err.msg
				});
			}
		});
	}
}

//接单操作
function acceptFunc() {
	var billModel = $api.getStorage('billModel');
	var user = $api.getStorage('user');
	var userId = user.userid;
	var billId = billModel.billid;
	var billSn = billModel.billsn;
	var taskId = billModel.taskid;
	api.showProgress({
		title : '处理中',
		modal : true,
	});
	var data = {};
	data.userID = userId;
	data.billId = billId;
	data.billSn = billSn;
	data.taskId = taskId;
	data.billStatus = 0;
	data.faultCouse = "手机接单";
	data.handlerResult = "手机接单";
	$client.acceptBill(data, function(ret, err) {
		if (ret) {
			if (ret.success) {
				console.log('RSupdate4')
				updateRecommendStatus(data.billSn)
				console.log("==接单完成，检查是否还有待办工单【故障】===")
				var opts = {
					pagename: 'gz',
					pageaction: 'ACCEPT',
					stationName: billModel.st_name,
					stationcode: billModel.st_code
				}
				console.log("调用是否有待办-传入参数："+JSON.stringify(opts));
				$client.sixBillRemind(opts, function(ret, err) {
					console.log("调用是否有待办-返回结果："+JSON.stringify(ret));
					easyDialog.close({
						container : "acceptDiv"
					});
					openBillList1(0,"bill-list_win");
					if (ret.billCntInfo.length>0){
						var billCntInfo = JSON.parse(ret.billCntInfo);
						if(billCntInfo.page=="gz" && billCntInfo.status=="ACCEPT" && billCntInfo.count>0){
							api.toast({
								msg: "接单成功。本站还有工单未处理！",
								location: "middle",
								duration : 3000,
							});
						}else{
							api.toast({
								msg: "接单成功。",
								location: "middle",
								duration : 1000,
							});
						}
					}else{
						api.toast({
							msg: "接单成功。",
							location: "middle",
							duration : 1000,
						});
					}
					window.setTimeout(function() {
						closeWindow();
						api.execScript({
							name: 'allBillListWin',
							frameName: 'waitTaskList1',
							script: 'fiveList()'
						});
						/*api.execScript({
							name: 'allBillListWin',
							frameName: 'waitTaskList2',
							script: 'fiveList()'
						});
						api.execScript({
							name: 'allBillListWin',
							frameName: 'waitTaskList3',
							script: 'fiveList()'
						});*/
					}, 3000);
				});
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
		api.hideProgress();
	});
}

//关闭弹出DIV对话框
function closeDiv(divId) {
	easyDialog.close({
		container : divId
	});
}

function closeFrame(name) {
	if (name == null || name == '' || name == 'undefined') {
		api.closeFrame();
	} else {
		api.closeFrame({
			name : 'billMenu_frm'
		});
	}
}

function signOptFunc() {
	billModel = $api.getStorage('billModel');
	var user = $api.getStorage('user');
	var userId = user.userid;
	var billId = billModel.billid;
	var billSn = billModel.billsn;
	var taskId = billModel.taskid;
	var linkInfo = $api.byId('contactTelTextId1').value;
	var remark = $api.byId('locationId1').value;
	var causeDealInfo = $api.byId('otherDealInfoId1').value;
	api.showProgress({
		title : '处理中',
		modal : true
	});
	//		userId, billSn, taskId, '', causeDealInfo
	$client.upStationSign({
		taskId : taskId,
		linkInfo : linkInfo,
		signLon : lon,
		signLat : lat,
		remark : remark,
		cause : causeDealInfo,
		isStand : idclean,
		billSn : billSn
	}, function(ret, err) {
		if (ret) {
			if (ret.success) {
				finishOptBill1(2,"到站签到成功", "SignDiv");
			} else {
				api.toast({
					msg : ret.data_info,
					location : 'middle'
				});
			}
		} else {
			api.toast({
				msg : '接口访问失败',
				location : 'middle'
			});
		}
		api.hideProgress();
	});
}

function restartLocationFunc() {
	easyDialog.close({
		container : "SignDiv"
	});
	getHeartFromGps("main_bill_detail_win", "billMenu_frm");
}

function getHeartFromGps(winName, frmName) {
	var script = "startLocation('" + winName + "','" + frmName + "');";
	console.log("异步加载" + script);
	api.execScript({
		name : "home_win",
		frameName : 'gps',
		script : script
	});
	//      gps_invoke();

}

//处理方法
function commonDoWith(target) {
	var val = $(target).val();
	if (val != '') {
		var text = $('#otherDealInfoId').val() + val;
		$('#otherDealInfoId').val(text);
	}
}

function gps_invoke() {

	var lastLocation = $api.getStorage('LAST_GPS_LOCATION1');

	if (!lastLocation || !lastLocation.status || lastLocation.timestamp == 0 || lastLocation.lon == 0 || lastLocation.lat == 0) {
		return;
	}
	console.log("经度：" + lastLocation.lon);
	$api.setStorage("lon1", lastLocation.lon);
	$api.setStorage("lat1", lastLocation.lat);
	api.showProgress({
		title : '定位中……',
		modal : true
	});
	window.setTimeout(function() {
		api.hideProgress();
		optBill("UPSTATIONSIGN");
	}, 1100);

}

//其它操作
function otherOptFunc() {
	billModel = $api.getStorage('billModel');
	var user = $api.getStorage('user');
	var userId = user.userid;
	var billId = billModel.billid;
	var billSn = billModel.billsn;
	var taskId = billModel.taskid;
	//  var areamanagerId = billModel.st_areamanager;
	var areaMan = $('#areaManagerId').val();
	var optType = $api.byId('optTypeId').value;
	var causeDealInfo = $api.byId('otherDealInfoId').value;

	var linkInfo = $api.byId('contactTelTextId').value;
	if (optType == "UPGRADE") {
		if (areaMan != null && areaMan != "") {
			api.showProgress({
				title : '处理中'
			});
			if ("GET_BILL_LIST" == api.pageParam.type) {
				gradeType = "ASSIST";
			} else if ("GET_BILL_UPDATE_LIST" == api.pageParam.type) {
				if ("Y" == isJishu) {
					gradeType = "TECH";
				} else if ("N" == isJishu) {
					gradeType = "AREAMAN";
				}
			}
			var opts = {
				userId : userId,
				billSn : billSn,
				taskId : taskId,
				linkInfo : linkInfo,
				dealComment : causeDealInfo,
				areaMan : areaMan,
				gradeType : gradeType
			};
			$client.upgrade(opts, function(ret, err) {
				if (ret) {
					if (ret.success) {
						finishOptBill1(1,"升级成功", "otherDiv");
					} else {
						api.toast({
							msg : ret.data_info,
							location : 'middle'
						});
					}
				} else {
					api.toast({
						msg : '接口访问失败',
						location : 'middle'
					});
				}
				api.hideProgress();
			});
		} else {
			api.toast({
				msg : "请选择区域经理或者站址没有配置区域经理，无法进行升级操作",
				location : 'middle'
			});
		}
	} else if (optType == "ISUPSTATION") {
		var isNeedUpstation = $api.byId('isStandId').value;
		if ("N" == isNeedUpstation && causeDealInfo == "" || causeDealInfo == null) {
			api.toast({
				msg : '不需要上站原因必填'
			});
			return;
		}
		api.showProgress({
			title : '处理中',
			modal : true
		});
		//		userId, billSn, taskId, '', causeDealInfo
		$client.isNeedUpStation({
			taskId : taskId,
			linkInfo : linkInfo,
			standCause : causeDealInfo,
			isStand : isNeedUpstation,
			billSn : billSn
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					finishOptBill1(1,"确认成功", "otherDiv");
				} else {
					api.toast({
						msg : ret.data_info,
						location : 'middle'
					});
				}
			} else {
				api.toast({
					msg : '接口访问失败',
					location : 'middle'
				});
			}
			api.hideProgress();
		});
	} else if (optType == "CON_CONFIRM") {
		var isNeedUpstation = $api.byId('isStandId').value;
		if ("N" == isNeedUpstation && causeDealInfo == "" || causeDealInfo == null) {
			api.toast({
				msg : '不同意发电，处理方法必填'
			});
			return;
		}
		api.showProgress({
			title : '处理中',
			modal : true
		});
		//		userId, billSn, taskId, '', causeDealInfo
		$client.isConfire({
			taskId : taskId,
			linkInfo : linkInfo,
			dealComment : causeDealInfo,
			whetherThePower : isNeedUpstation,
			billSn : billSn
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					finishOptBill1(1,"确认成功", "otherDiv");
				} else {
					api.toast({
						msg : ret.data_info,
						location : 'middle'
					});
				}
			} else {
				api.toast({
					msg : '接口访问失败',
					location : 'middle'
				});
			}
			api.hideProgress();
		});
	}else if (optType == "CON_APPROVE") {
		var isNeedUpstation = $api.byId('isStandId').value;
		if ("N" == isNeedUpstation && causeDealInfo == "" || causeDealInfo == null) {
			api.toast({
				msg : '运营商不认可，处理方法必填'
			});
			return;
		}
		api.showProgress({
			title : '处理中',
			modal : true
		});
		//		userId, billSn, taskId, '', causeDealInfo
		$client.isApprove({
			taskId : taskId,
			linkInfo : linkInfo,
			dealComment : causeDealInfo,
			isApprove : isNeedUpstation,
			billSn : billSn
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					finishOptBill1(1,"确认成功", "otherDiv");
				} else {
					api.toast({
						msg : ret.data_info,
						location : 'middle'
					});
				}
			} else {
				api.toast({
					msg : '接口访问失败',
					location : 'middle'
				});
			}
			api.hideProgress();
		});
	} else if (optType == "FEEDBACK") {
		api.showProgress({
			title : '处理中',
			modal : true
		});
		//		userId, billSn, taskId, '', causeDealInfo
		$client.feedBack({
			taskId : taskId,
			linkInfo : linkInfo,
			dealComment : causeDealInfo,
			billSn : billSn
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
				var num=$api.getStorage('num');
				if(num==2){
				finishOptBill1(2,"反馈成功", "otherDiv");
				}else{
					finishOptBill1(1,"反馈成功", "otherDiv");
				}
				} else {
					api.toast({
						msg : ret.data_info,
						location : 'middle'
					});
				}
			} else {
				api.toast({
					msg : '接口访问失败',
					location : 'middle'
				});
			}
			api.hideProgress();
		});
	} else if (optType == "REPLY") {//支撑回复
		api.showProgress({
			title : '处理中',
			modal : true
		});
		//		api.toast({
		//			msg : '数值：' + api.pageParam.gradetype
		//		});
		if ("TECH" == api.pageParam.gradetype) {
			$client.replyTechMan({
				taskId : taskId,
				linkInfo : linkInfo,
				dealComment : causeDealInfo,
				billSn : billSn
			}, function(ret, err) {
				if (ret) {
					if (ret.success) {
						finishOptBill("支撑回复成功", "otherDiv");
					} else {
						api.toast({
							msg : ret.data_info,
							location : 'middle'
						});
					}
				} else {
					api.toast({
						msg : '接口访问失败',
						location : 'middle'
					});
				}
				api.hideProgress();
			});
		} else if ("AREAMAN" == api.pageParam.gradetype) {
			$client.replyAreaMan({
				taskId : taskId,
				linkInfo : linkInfo,
				dealComment : causeDealInfo,
				billSn : billSn
			}, function(ret, err) {
				if (ret) {
					if (ret.success) {
						finishOptBill("支撑回复成功", "otherDiv");
					} else {
						api.toast({
							msg : ret.data_info,
							location : 'middle'
						});
					}
				} else {
					api.toast({
						msg : '接口访问失败',
						location : 'middle'
					});
				}
				api.hideProgress();
			});
		}

	} else if (optType == "TRANSFERS") {
		var transferUserId = $api.byId('transferSelId').value;
		if (transferUserId == null || transferUserId == "") {
			api.alert({
				msg : "请选择接收人"
			});
			return false;
		}
		api.showProgress({
			title : '处理中',
			modal : true
		});
		$client.transfers({
			taskId : taskId,
			linkInfo : linkInfo,
			dealComment : causeDealInfo,
			billSn : billSn,
			notifyUserId : transferUserId
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					finishOptBill("转派成功", "otherDiv");
				} else {
					api.toast({
						msg : ret.data_info,
						location : 'middle'
					});
				}
			} else {
				api.toast({
					msg : '接口访问失败',
					location : 'middle'
				});
			}
			api.hideProgress();
		});
	} else if (optType == "REMINDER") {
		api.showProgress({
			title : '处理中',
			modal : true
		});
		$client.reminder({
			taskId : taskId,
			linkInfo : linkInfo,
			dealComment : causeDealInfo,
			billSn : billSn
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					finishOptBill("催办成功", "otherDiv");
				} else {
					api.toast({
						msg : ret.data_info,
						location : 'middle'
					});
				}
			} else {
				api.toast({
					msg : '接口访问失败',
					location : 'middle'
				});
			}
			api.hideProgress();
		});
	} else if (optType == "ADDDEAL") {//追加描述
		api.showProgress({
			title : '处理中',
			modal : true
		});
		$client.addDeal({
			taskId : taskId,
			linkInfo : linkInfo,
			dealComment : causeDealInfo,
			billSn : billSn
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					finishOptBill("追加描述成功", "otherDiv");
				} else {
					api.toast({
						msg : ret.data_info,
						location : 'middle'
					});
				}
			} else {
				api.toast({
					msg : '接口访问失败',
					location : 'middle'
				});
			}
			api.hideProgress();
		});
	} else if (optType == "SUPPORTCONFIRM") {
		api.showProgress({
			title : '处理中',
			modal : true
		});
		$client.supportConfirm({
			taskId : taskId,
			linkInfo : linkInfo,
			dealComment : causeDealInfo,
			billSn : billSn
		}, function(ret, err) {
			if (ret) {
				if (ret.success) {
					finishOptBill1(1,"故障确认成功", "otherDiv");
				} else {
					api.toast({
						msg : ret.data_info,
						location : 'middle'
					});
				}
			} else {
				api.toast({
					msg : '接口访问失败',
					location : 'middle'
				});
			}
			api.hideProgress();
		});
	}
}

function finishOptBill1(num,msg, closeDivId) {
	easyDialog.close({
		container : closeDivId
	});
	if(num==0||num==1||num==2){
	openBillList1(num,"bill-list_win");
	}else{
		openBillList("bill-list_win");
	}

	api.toast({
		msg : msg,
		duration : 1000,
		location : 'bottom'
	});
	window.setTimeout(function() {
		//openBillList("bill-list_win");
		//关闭工单详情Win
		closeWindow();
		// wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
		api.execScript({
		    name: 'allBillListWin',
		    frameName: 'waitTaskList1',
		    script: 'fiveList()'
		});
		api.execScript({
		    name: 'allBillListWin',
		    frameName: 'waitTaskList2',
		    script: 'fiveList()'
		});
		api.execScript({
		    name: 'allBillListWin',
		    frameName: 'waitTaskList3',
		    script: 'fiveList()'
		});
		//关闭操作选择列表
		//      closeFrame('');
	}, 1100);
}

function finishOptBill(msg, closeDivId) {
	easyDialog.close({
		container : closeDivId
	});
//	if(num==0||num==1||num==2){
//	openBillList1(num,"bill-list_win");
//	}else{
		openBillList("bill-list_win");
//	}

	api.toast({
		msg : msg,
		duration : 1000,
		location : 'bottom'
	});
	window.setTimeout(function() {
		//openBillList("bill-list_win");
		//关闭工单详情Win
		closeWindow();

		//关闭操作选择列表
		//      closeFrame('');
	}, 1100);
}

function closeWindow() {
	api.closeWin({
	});
	//  api.closeWin({
	//      name : "main_bill_detail"
	//  });
}

function openBillList1(num,name) {
console.log("num"+num);
	api.execScript({
			name : name,
			script : 'refreshBillList('+num+');'
		});
}

function openBillList(name) {

	console.log("name:" + name);
	if (name == 'bill-list_win') {
//		api.execScript({
//			name : name,
//			script : 'refreshBillList('+2+');'
//		});
				api.execScript({
					name : name,
					frameName : 'bill-listCon_frm',
					script : 'cb_refresh();'
				});
	} else {
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
//		api.closeFrame();
	}
}

//故障类型选择触发事件
function onRadioRefief(obj, refiefTypeDivId, refiefTypeId, refiefDealInfoDivId, refiefDealInfoId) {
	var objValue = obj.value;
	document.getElementById(refiefTypeId).value = "";
	document.getElementById(refiefDealInfoId).value = "";
	if (objValue == "N") {
		$('#' + refiefTypeDivId).hide();
		$('#' + refiefDealInfoDivId).hide();
	} else {
		$('#' + refiefTypeDivId).show();
		$('#' + refiefDealInfoDivId).show();
	}
}

//故障类型选择触发事件
function onSelCause(obj, stationCauseId, indoorCauseId) {
	var objValue = obj.value;
	var stationCauseObj = document.getElementById(stationCauseId);
	var indoorCauseObj = document.getElementById(indoorCauseId);
	if (objValue == "1") {
		stationCauseObj.style.display = "block";
		indoorCauseObj.style.display = "none";
	} else {
		stationCauseObj.style.display = "none";
		indoorCauseObj.style.display = "block";
	}
}

//回单操作
function revertFunc() {
	var billModel = $api.getStorage('billModel');
	var user = $api.getStorage('user');
	var userId = user.userid;
	var billId = billModel.billid;
	var billSn = billModel.billsn;
	var isRefief = document.getElementById('isRefiefHid').value;
	var refiefType = document.getElementById('refiefTypeId').value;
	var refiefDealInfo = document.getElementById('refiefDealInfoId').value;
	var faultType = document.getElementById('faultTypeId').value;
	var stationCauseVal = document.getElementById('stationCauseId').value;
	var indoorCauseVal = document.getElementById('indoorCauseId').value;
	var stationCause = $("#stationCauseId").find("option:selected").text();
	var indoorCause = $("#indoorCauseId").find("option:selected").text();
	var causeDealInfo = document.getElementById('causeDealInfoId').value;
	var faultCause = "";
	var isStandSta = document.getElementById('isStandStaHid').value;
	var recoverTime = document.getElementById('recoverTimeId').value;
	var recoverDate = document.getElementById('recoverDateId').value;
	if (isRefief == "") {
		api.toast({
			msg : "请选择是否免责",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	if (isRefief == "Y") {
		if (refiefType == "") {
			api.toast({
				msg : "请选择免责条款",
				duration : 1000,
				location : 'middle'
			});
			return;
		}
		if (refiefDealInfo == "") {
			api.toast({
				msg : "请填写免责具体原因",
				duration : 1000,
				location : 'middle'
			});
			return;
		}
	}
	if (faultType == "1") {
		if (stationCauseVal == "") {
			api.toast({
				msg : "请选择故障原因",
				duration : 1000,
				location : 'middle'
			});
			return;
		}
		faultCause = stationCause;
	} else if (faultType == "2") {
		if (indoorCauseVal == "") {
			api.toast({
				msg : "请选择故障原因",
				duration : 1000,
				location : 'middle'
			});
			return;
		}
		faultCause = indoorCause;
	} else {
		api.toast({
			msg : "请选择故障类型",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	if (recoverDate == "") {
		api.toast({
			msg : "请选择修复日期",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	if (recoverTime == "") {
		api.toast({
			msg : "请选择修复时间",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	api.showProgress({
		title : '处理中',
		modal : true
	});
	var data = {};
	data.userID = userId;
	data.billId = billId;
	data.billSn = billSn;
	data.billStatus = 1;
	data.faultCouse = faultCause;
	data.handlerResult = causeDealInfo;
	data.isRelief = isRefief;
	data.reliefType = refiefType;
	data.reliefCause = refiefDealInfo;
	data.isUpStation = isStandSta;
	data.recoveryTime = recoverDate + " " + recoverTime + ":00"
	$client.genelecRevertBill(data, function(ret, err) {
		if (ret) {
			if (ret.success) {
				api.toast({
					msg : "回单成功",
					duration : 1000,
					location : 'middle'
				});
				window.setTimeout(function() {
					api.openWin({
						name : 'bill-list',
						url : 'bill-list_win.html',
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
				}, 1100);
			} else {
				api.toast({
					msg : ret.data_info,
					location : 'middle'
				});
			}
		} else {
			api.toast({
				msg : err.msg,
				location : 'middle'
			});
		}
		api.hideProgress();

	});
}

//发电流程回单
function electricRevertFunc() {
	var billModel = $api.getStorage('billModel');
	var user = $api.getStorage('user');
	var userId = user.userid;
	var billSn = billModel.billsn;

	var boardType = document.getElementById('boardTypeId').value;
	var workRate = document.getElementById('workRateId').value;
	var elecBeginDate = document.getElementById('elecBeginDateId').value;
	var elecBeginTime = document.getElementById('elecBeginTimeId').value;
	var elecEndDate = document.getElementById('elecEndDateId').value;
	var elecEndTime = document.getElementById('elecEndTimeId').value;
	var arriveDate = document.getElementById('arriveDateId').value;
	var arriveTime = document.getElementById('arriveTimeId').value;
	var elecRecoverDate = document.getElementById('elecRecoverDateId').value;
	var elecRecoverTime = document.getElementById('elecRecoverTimeId').value;
	var outerRecoverDate = document.getElementById('outerRecoverDateId').value;
	var outerRecoverTime = document.getElementById('outerRecoverTimeId').value;
	var outerRecoverDateTime = "";
	var vehicleMileage = document.getElementById('vehicleMileageId').value;
	var electricityCauses = document.getElementById('electricityCausesId').value;
	//$("#electricityCausesId").find("option:selected").text();

	var faultType = document.getElementById('faultTypeElecId').value;
	var stationCauseVal = document.getElementById('stationCauseElecId').value;
	var indoorCauseVal = document.getElementById('indoorCauseElecId').value;
	var stationCause = $("#stationCauseElecId").find("option:selected").text();
	var indoorCause = $("#indoorCauseElecId").find("option:selected").text();
	var causeDealInfo = document.getElementById('causeDealInfoElecId').value;
	var faultCause = "";

	var isStandSta = document.getElementById('isStandStaElec').value;
	var isRefief = document.getElementById('isRefiefElec').value;
	var refiefType = document.getElementById('refiefTypeElecId').value;
	var refiefDealInfo = document.getElementById('refiefDealInfoElecId').value;
	if (boardType == "") {
		api.toast({
			msg : "油机型号必填",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	if (workRate == "") {
		api.toast({
			msg : "功率必填",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	if (elecBeginDate == "") {
		api.toast({
			msg : "请选择发电开始日期",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	if (elecBeginTime == "") {
		api.toast({
			msg : "请选择发电开始时间",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	if (elecEndDate == "") {
		api.toast({
			msg : "请选择发电结束日期",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	if (elecEndTime == "") {
		api.toast({
			msg : "请选择发电结束时间",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	if (arriveDate == "") {
		api.toast({
			msg : "请选择发电人员到达日期",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	if (arriveTime == "") {
		api.toast({
			msg : "请选择发电人员到达时间",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	if (outerRecoverDate != "" && outerRecoverTime != "") {
		outerRecoverDateTime = outerRecoverDate + " " + outerRecoverTime + ":00";
	} else if (outerRecoverDate != "" && outerRecoverTime == "") {
		outerRecoverDateTime = outerRecoverDate + " 00:00:00";
	}
	if (arriveTime == "") {
		api.toast({
			msg : "请选择发电人员到达时间",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	if (isRefief == "") {
		api.toast({
			msg : "请选择是否免责",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	if (isRefief == "Y") {
		if (refiefType == "") {
			api.toast({
				msg : "请选择免责条款",
				duration : 1000,
				location : 'middle'
			});
			return;
		}
		if (refiefDealInfo == "") {
			api.toast({
				msg : "请填写免责具体原因",
				duration : 1000,
				location : 'middle'
			});
			return;
		}
	}
	if (elecRecoverTime == "") {
		api.toast({
			msg : "修复时间必填",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	if (faultType == "1") {
		if (stationCauseVal == "") {
			api.toast({
				msg : "请选择故障原因",
				duration : 1000,
				location : 'middle'
			});
			return;
		}
		faultCause = stationCause;
	} else if (faultType == "2") {
		if (indoorCauseVal == "") {
			api.toast({
				msg : "请选择故障原因",
				duration : 1000,
				location : 'middle'
			});
			return;
		}
		faultCause = indoorCause;
	} else {
		api.toast({
			msg : "请选择故障类型",
			duration : 1000,
			location : 'middle'
		});
		return;
	}
	var data = {};
	data.userID = userId;
	data.billId = billModel.billid;
	data.billSn = billSn;
	data.faultCouse = faultCause;
	data.handlerResult = causeDealInfo;
	data.isRelief = isRefief;
	data.reliefType = refiefType;
	data.reliefCause = refiefDealInfo;
	data.isUpStation = isStandSta;
	data.boardType = boardType;
	data.workRate = workRate;
	data.recoveryTime = elecRecoverDate + " " + elecRecoverTime + ":00";
	data.elecBeginTime = elecBeginDate + " " + elecBeginTime + ":00";
	data.elecEndTime = elecEndDate + " " + elecEndTime + ":00";
	data.arriveTime = arriveDate + " " + arriveTime + ":00";
	data.outerRecoverTime = outerRecoverDateTime;
	data.mileage = vehicleMileage;
	data.outageCause = electricityCauses;

	$client.genelecRevertBill(data, function(ret, err) {
		if (ret) {
			if (ret.success) {
				api.toast({
					msg : "回单成功",
					duration : 1000,
					location : 'middle'
				});
				window.setTimeout(function() {
					api.openWin({
						name : 'bill-list',
						url : 'bill-list.html',
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
				}, 1100);
			} else {
				api.toast({
					msg : ret.data_info,
					location : 'middle'
				});
			}
		} else {
			api.toast({
				msg : '接口访问失败',
				location : 'middle'
			});
		}
		api.hideProgress();
	});
}

// 门禁
function showDoorDeviceList() {
	$api.rmStorage("doorDeviceList");
	getDoorsList();
}

function getDoorsList() {
	var applyId = '';
	if ( typeof (api.pageParam.applyId) != 'undefined') {
		applyId = api.pageParam.applyId;
	}
	var opts = {
		stationid : api.pageParam.stationId,
		applyId : api.pageParam.billId,
		type:"bill" //故障
	};
	$client.getStationDoorDeviceList(opts, function(ret, err) {//点击门禁
		if (ret) {
			if (ret.success) {
				// if (ret.list.length > 0) {
					$api.setStorage("doorDeviceList", ret.list);
					api.openFrame({
						name : 'doorDeviceDialog_frm',
						url : '../dialog/doorDeviceDialog_frm.html',
						bgColor : "rgba(0,0,0,0)",
						bounces : false,
						pageParam : api.pageParam,
						rect : {
							x : 0,
							y : 0,
							w : 'auto',
							h : 'auto'
						}
					});
				// } else {
				// 	api.toast({
				// 		msg : '该工单没有相关门禁列表！',
				// 		location : 'bottom'
				// 	});
				// }
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
		closeFrame('generationBillMenu');
	});
}
