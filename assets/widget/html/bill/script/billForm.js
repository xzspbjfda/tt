//校验器
var BillForm = function(formObj, btnObj, submitFn,imgY) {//formObj 表单jquery对象，btnObj 提交按钮对象,submitFn 接口函数
	//设置为提示最先发现的错误信息，后续错误不提示
	this.hasError = false;
	this.imgY = imgY;

	this.submitFn = submitFn;
	this.formObj = ( formObj instanceof jQuery == true) ? formObj : $(formObj);
	this.btnObj = ( btnObj instanceof jQuery == true) ? btnObj : $(btnObj);
};

BillForm.prototype.reset = function() {
	this.hasError = false;
}

BillForm.prototype.setFormValidate = function() {
	var self = this;
	//配置表单校验条件
	self.formObj.validate({
		type : {
			//必填验证
			required : function(value, errorMsg, el) {
				if (value == '') {
					if (!self.hasError) {
						self.hasError = true;
						return errorMsg;
					}
				}
			},
			hasImage : function(value, errorMsg, el) {

					if (!imageUtil.getImageArray().length) {
						if (!self.hasError) {
							self.hasError = true;
							return errorMsg;
						}
					}

			},
			//是否免责（回单表单）
			isRelief : function(val, errorMsg, el) {
				if ($('[name=isRelief]').val() == 'Y' && val == '') {
					if (!self.hasError) {
						self.hasError = true;
						return errorMsg;
					}
				}
			},
			isEmptyRun : function(value, errorMsg, el) {
				if ($(el).css('display') != 'none') {
					if (value == '') {
						if (!self.hasError) {
							api.toast({
								msg : errorMsg,
								duration : 1000,
								location : 'bottom'
							});
							self.hasError = true;
						}
					}
				}
			},
			checkEleBeginTime : function(val, errorMsg, el) {
				var isEmptyRun = $('[name=isEmptyRun]').val();
				var elecBeginTime = $('[name=elecBeginTime]').val().replace(/T/, " ").replace(/\.\d+/, "");
				if (isEmptyRun == 0) {
					if ((new Date() - new Date(format(elecBeginTime).replace(/-/g, "/"))) / (60 * 60 * 1000) > 100) {
						if (!self.hasError) {
							api.toast({
								msg : '发电开始时间必须不小于当前时间100小时！',
								duration : 1000,
								location : 'bottom'
							});
							self.hasError = true;
						}
					}
				}
			},

			checkArriveime : function(val, errorMsg, el) {

				var arriveTime = $('[name=arriveTime]').val().replace(/T/, " ").replace(/\.\d+/, "");
				var isUpstation = $('[name=isUpStation]').val();
				var isEmptyRun = $('[name=isEmptyRun]').val();
//				&&'Y' == isUpstation
				if (arriveTime == null || arriveTime == '') {
				if("ELECTRIC_BEGIN"==api.pageParam.billStatus&&'Y' == isUpstation){
						if (!self.hasError) {
							api.toast({
								msg : '发电人员到达时间必填！',
								duration : 1000,
								location : 'bottom'
							});
							self.hasError = true;
						}
				}
				}
//					if (isEmptyRun == 2 && 'N' == isUpstation) {
//
//					} else {
//						if (!self.hasError) {
//							api.toast({
//								msg : '发电人员到达时间必填！',
//								duration : 1000,
//								location : 'bottom'
//							});
//							self.hasError = true;
//						}
//					}
//				}

			},

			checkElecEndTime : function(val, errorMsg, el) {
				var isEmptyRun = $('[name=isEmptyRun]').val();
				var elecBeginTime = $('[name=elecBeginTime]').val().replace(/T/, " ").replace(/\.\d+/, "");
				var elecEndTime = $('[name=elecEndTime]').val().replace(/T/, " ").replace(/\.\d+/, "");
				var arriveTime = $('[name=arriveTime]').val().replace(/T/, " ").replace(/\.\d+/, "");

				if (new Date(format(arriveTime).replace(/-/g, "/")) >= new Date()) {
					if (!self.hasError) {
						api.toast({
							msg : '人员到达时间必须小于当前时间！',
							duration : 1000,
							location : 'bottom'
						});
						self.hasError = true;
					}
				}

				//              if (isEmptyRun == 0) {
				//                  var flag = self.checkTime(format(elecBeginTime), format(elecEndTime));
				//                  if (new Date(format(elecBeginTime).replace(/-/g, "/")) >= new Date(format(elecEndTime).replace(/-/g, "/"))) {
				//                      if (!self.hasError) {
				//                          api.toast({
				//                              msg : '发电结束时间必须大于开始时间！',
				//                              duration : 1000,
				//                              location : 'bottom'
				//                          });
				//                          self.hasError = true;
				//                      }
				//                  }
				//                  if (new Date(format(elecEndTime).replace(/-/g, "/")) >= new Date()) {
				//                      if (!self.hasError) {
				//                          api.toast({
				//                              msg : '发电结束时间必须小于当前时间！',
				//                              duration : 1000,
				//                              location : 'bottom'
				//                          });
				//                          self.hasError = true;
				//                      }
				//                  }

				//                  if (new Date(format(arriveTime).replace(/-/g, "/")) >= new Date()) {
				//                      if (!self.hasError) {
				//                          api.toast({
				//                              msg : '人员到达时间必须小于当前时间！',
				//                              duration : 1000,
				//                              location : 'bottom'
				//                          });
				//                          self.hasError = true;
				//                      }
				//                  }
				//              }
				//              var curTime = new Date().Format("yyyy-MM-dd HH:mm:ss");
				//              alert('curTime:'+curTime);
				//              var curTime = new Date().replace(/T/, " ").replace(/\.\d+/,"");
				//              flag = self.checkTime(elecEndTime, curTime);
			},
			checkCommomsTime : function(val, errorMsg, el) {
				var commTime = $('[name=recoveryTime]').val();
				if (new Date(format(commTime).replace(/-/g, "/")) > new Date()) {
					if (!self.hasError) {
						self.hasError = true;
						return errorMsg;
					}
				}
			},

			checkRecoveryTime : function(val, errorMsg, el) {
				var isEmptyRun = $('[name=isEmptyRun]').val();
				var recoveryTime = $('[name=recoveryTime]').val();
				var outerRecoverTime = $('[name=outerRecoverTime]').val();
				var elecEndTime = $('[name=elecEndTime]').val();
				//是否空跑为0，则修复时间和外市电修复时间必须小于发电结束时间，否则小于当前时间
				if(isEmptyRun=='0'){
					if (new Date(format(outerRecoverTime).replace(/-/g, "/")) > new Date(format(elecEndTime).replace(/-/g, "/"))) {
					if (!self.hasError) {
						api.toast({
							msg : '外市电恢复时间必须小于发电结束时间！',
							duration : 1500,
							location : 'bottom'
						});
						self.hasError = true;
					}
				}

					if (new Date(format(recoveryTime).replace(/-/g, "/")) > new Date(format(elecEndTime).replace(/-/g, "/")) ) {
					if (!self.hasError) {
						api.toast({
							msg : '修复时间必须小于发电结束时间！',
							duration : 1500,
							location : 'bottom'
						});
						self.hasError = true;
					}
				}




				}else{
					if (new Date(format(outerRecoverTime).replace(/-/g, "/")) > new Date()) {
					if (!self.hasError) {
						api.toast({
							msg : '外市电恢复时间必须小于当前时间！',
							duration : 1500,
							location : 'bottom'
						});
						self.hasError = true;
					}
				}

					if (new Date(format(recoveryTime).replace(/-/g, "/")) > new Date()) {
					if (!self.hasError) {
					api.toast({
							msg : '修复时间必须小于当前时间！',
							duration : 1500,
							location : 'bottom'
						});
						self.hasError = true;
//						return errorMsg;
					}
				}


				}

			},

			checkChineseCount : function(val, errorMsg, el) {
				var recoveryTime = $('[name=handlerResult]').val();
				if (isChineseCount(recoveryTime) < 4) {
					if (!self.hasError) {
						self.hasError = true;
						return errorMsg;
					}
				}
			},

			minValue: function(val, errorMsg, el) {
				var isReliefValue = $('[name=isRelief]').val();
				if (val==''&&isReliefValue=='Y') {
					if (!self.hasError) {
						self.hasError = true;
						return errorMsg;
					}
				}
			}
		},
		onclick : {
		},
		onSelect : {
		}
	});

	//提交前校验事件
	self.btnObj.on('click', function(event) {
		event.preventDefault();
		api.showProgress({
			title : '处理中'
		});
		$('form').validate('submitValidate');
		if (!self.hasError) {
			api.hideProgress();
			$aui.dialog({
				title : '确认提交数据？',
				msg : '是否确认回单？'
			}, function(ret) {
				if (ret.buttonIndex) {
					api.showProgress({
						title : '处理中'
					});
					self.submit();
				}
			});
			return true;
		}
		self.reset();
		api.hideProgress();
		return false;
	});
}

BillForm.prototype.submit = function() {
	var opts = {};
	var self = this;
	var billModel = $api.getStorage('billModel');
	//获取提交参数（包括隐藏参数）
	self.formObj.find('[name]:visible,input[type=hidden]').each(function() {
		var name = $(this).attr('name');
		var val = typeof ($(this).val()) == 'undefined' ? $(this).text() : $(this).val();
		if ($(this).attr('type') == 'datetime-local') {
			//          val = new Date(val.replace(/T/, " ")).pattern("yyyy-MM-dd HH:mm:ss");
			val = val.replace(/T/, " ").replace(/\.\d+/, "");
			//如果出现不带有秒数的时间字符串，补充
			if (!(/\d{2}:\d{2}:\d{2}/.test(val))) {
				val += ':00';
			}
		}
		opts[name] = val;
//		if(billModel.billstatus=='ELECTRIC_END'){
//			opts['recoveryTime'] = (new Date()).pattern("yyyy-MM-dd HH:mm:ss");
//			opts['outerRecoverTime'] = (new Date()).pattern("yyyy-MM-dd HH:mm:ss");
//		}
//		if (billModel.rev_is_empty_run == '1' || billModel.rev_is_empty_run == '2') {
//			opts['outerRecoverTime'] = '';
//			opts['recoveryTime'] = '';
//			opts['elecEndTime'] = '';
//		}
	});
	/*//====================测试用 ZZJ BEGIN
	var billModel = $api.getStorage('billModel');
	var param={
		pagename: 'fd',
		pageaction: 'REVERT',	//"ACCEPT", "DOING", "REVERT"
		stationcode:billModel.st_code,
		stationListType:2
	}
	$client.sixBillRemind(param, function(ret, err) {
		if (ret.billCntInfo.length>0){
			var billCntInfo = JSON.parse(ret.billCntInfo);
			if (billCntInfo.status=='REVERT'){
				// 已领取
				api.confirm({
					title: '提示',
					msg: '本站还有工单未处理！',
				}, function(ret, err) {
					if (ret.buttonIndex == 2) {
						//saveLocal();   //需要将图片保存到本地
						setTimeout(function() {
							api.hideProgress();
							api.execScript({
								name:'home_win',
								frameName: 'footer_tab_1',
								script: 'openDaibaiList("REVERT")'
							});
							api.closeToWin({
								name: 'home_win'
							});
						}, 500);
					}else{
						api.closeWin({
							name: 'mainGenerationBillDetail'
						});
					}
				});
			} else if (billCntInfo.status=='DOING'){
				// 处理中
				api.confirm({
					title: '提示',
					msg: '本站还有工单未处理！',
				}, function(ret, err) {
					if (ret.buttonIndex == 2) {
						saveLocal();   //需要将图片保存到本地
						setTimeout(function() {
							api.hideProgress();
							api.execScript({
								name:'home_win',
								frameName: 'footer_tab_1',
								script: 'openDaibaiList("DOING")'
							});
							api.closeToWin({
								name: 'home_win'
							});
						}, 500);
					}else {
						api.closeWin();
					}
				});
			} else {
				// 待领取
				api.confirm({
					title: '提示',
					msg: '本站还有待领取工单未处理！',
				}, function(ret, err) {
					if (ret.buttonIndex == 2) {
						saveLocal();   //需要将图片保存到本地
						setTimeout(function() {
							api.hideProgress();
							api.execScript({
								name:'home_win',
								frameName: 'footer_tab_1',
								script: 'openDaibaiList("ACCEPT")'
							});
							api.closeToWin({
								name: 'home_win'
							});
						}, 500);
					}else {
						api.closeWin();
					}
				});
			}
		} else {
			setTimeout(function() {
				api.closeWin({
					name: 'mainGenerationBillDetail'
				});
				api.closeWin();
				api.sendEvent({   //回单
						name: 'receipt',
						extra: {
						}
				});
			}, 500);
		}
	});
	return;
	//====================测试用 ZZJ END*/
	self.submitFn(opts, function(ret, err) {
		var billcntFrom = $api.getStorage('billcntFrom');	// 获取标识的入口页面
		if (ret) {
			if (ret.success) {
				if(self.imgY){
					if (imageUtil.getImageArray().length) {
						imageUtil.upload(function(count) {
							/*api.execScript({
								name : 'bill-list_win',
								script : 'refreshBillList(' + 1 + ');'
							});
							// 验证该站址下是否还有未完成工单
							var billModel = $api.getStorage('billModel');
							var param={
								stationcode:billModel.st_code,
								start:1,
								limit:20,
								stationListType:2
							}
							$client.getAllWorkList(param,function(ret,err){
								var listOrder=ret.listOrder[0];
								if(listOrder.taskList.length>2||listOrder.zndwTaskList.length>2||listOrder.billList.length>2||listOrder.hidderList.length>2||listOrder.standStationList.length>2||listOrder.fadianlist.length>2){
									api.alert({
										title: '提示',
										msg: '本站还有工单未处理！',
									}, function(ret, err) {
										window.setTimeout(function() {
											// 删除本地缓存
											if(api.frameName!='billRevertYysElectric_frm'){
												deleteBill(opts.billSn);
											}
											api.closeToWin({
												name : 'bill-list_win'
											});
										}, 1100);
									});
								}else {
									window.setTimeout(function() {
										// 删除本地缓存
										if(api.frameName!='billRevertYysElectric_frm'){
											deleteBill(opts.billSn);
										}
										api.closeToWin({
											name : 'bill-list_win'
										});
									}, 1100);
								}
							});*/
							//====================修改 工单提醒 BEGIN
							var billModel = $api.getStorage('billModel');
							var param={
								pagename: api.pageParam.type=='GET_BILL_FD'?'fd':'gz',
								pageaction: 'REVERT',	//停发电："ACCEPT", "DOING", "REVERT"， 故障："ACCEPT", "REVERT"
								stationcode:billModel.st_code,
								stationListType:2,
								stationname: billModel.st_name
							}
							$client.sixBillRemind(param, function(ret, err) {
								if (ret.billCntInfo.length>0){
									var billCntInfo = JSON.parse(ret.billCntInfo);
									var targetAction ="";
									if (billCntInfo.status=='REVERT'){
										targetAction="REVERT";
									} else if (billCntInfo.status=='DOING'){
										targetAction="DOING";
									} else {
										targetAction="ACCEPT";
									} 
									
									var featureStr = (api.pageParam.type=='GET_BILL_FD'?'5':'4');
									api.alert({
										title: '提示',
										msg: '本站还有工单未处理！',
									}, function(ret, err) {
										if(api.frameName!='billRevertYysElectric_frm'){
											try{
												deleteBill(opts.billSn);
											} catch(e){}
										}
										if (billcntFrom!='all_bill_list_frm'){
											setTimeout(function() {
												api.hideProgress();
												api.execScript({
													name:'home_win',
													frameName: 'footer_tab_1',
													script: 'openDaibaiList("'+targetAction+'", "'+billModel.st_code+'", "'+featureStr+'")'
												});
												api.closeToWin({
													name: 'home_win'
												});
											}, 500);
										} else {
											window.setTimeout(function() {
												api.closeToWin({
													name : 'all_bill_list_win'
												});
												api.closeWin({});
											}, 1100);
										}
									});
								} else {
									if (billcntFrom!='all_bill_list_frm'){
										api.execScript({
											name : 'bill-list_win',
											script : 'refreshBillList(' + 1 + ');'
										});
									}
									if (billcntFrom!='all_bill_list_frm'){
										window.setTimeout(function() {
											// 删除本地缓存
											if(api.frameName!='billRevertYysElectric_frm'){
												try{
													deleteBill(opts.billSn);
												} catch(e){}
											}
											api.closeToWin({
												name : 'bill-list_win'
											});
										}, 100);
									} else {
										window.setTimeout(function() {
											api.closeToWin({
												name : 'all_bill_list_win'
											});
											api.closeWin({});
										}, 1100);
									}
								}
							});
							//====================修改 工单提醒 END
						});
					}else {
						api.toast({
							msg : "提交成功",
							duration : 1000,
							location : 'middle'
						});
						// 验证该站址下是否还有未完成工单
						/*var billModel = $api.getStorage('billModel');
						var param={
							stationcode:billModel.st_code,
							start:1,
							limit:20,
							stationListType:2
						}
						$client.getAllWorkList(param,function(ret,err){
							if(ret.listOrder){
								var listOrder=ret.listOrder[0];
								if(listOrder.taskList.length>2||listOrder.zndwTaskList.length>2||listOrder.billList.length>2||listOrder.hidderList.length>2||listOrder.standStationList.length>2||listOrder.fadianlist.length>2){
									api.alert({
										title: '提示',
										msg: '本站还有工单未处理！',
									}, function(ret, err) {
										api.execScript({
											name : 'bill-list_win',
											script : 'refreshBillList(' + 1 + ');'
										});
										window.setTimeout(function() {
											api.closeToWin({
												name : 'bill-list_win'
											});
										}, 1100);
									});
								}else {
									api.execScript({
										name : 'bill-list_win',
										script : 'refreshBillList(' + 1 + ');'
									});
									window.setTimeout(function() {
										api.closeToWin({
											name : 'bill-list_win'
										});
									}, 1100);
								}
							}
						});*/
						//====================修改 工单提醒 BEGIN
						var billModel = $api.getStorage('billModel');
						var param={
							pagename: api.pageParam.type=='GET_BILL_FD'?'fd':'gz',
							pageaction: 'REVERT',	//"ACCEPT", "DOING", "REVERT"
							stationcode:billModel.st_code,
							stationListType:2,
							stationname: billModel.st_name
						}
						$client.sixBillRemind(param, function(ret, err) {
							if (ret.billCntInfo.length>0){
								var billCntInfo = JSON.parse(ret.billCntInfo);
								var targetAction ="";
								if (billCntInfo.status=='REVERT'){
									targetAction="REVERT";
								} else if (billCntInfo.status=='DOING'){
									targetAction="DOING";
								} else {
									targetAction="ACCEPT";
								} 
								var featureStr = (api.pageParam.type=='GET_BILL_FD'?'5':'4');
								// 已领取
								api.alert({
									title: '提示',
									msg: '本站还有工单未处理！',
								}, function(ret, err) {
									if (billcntFrom!='all_bill_list_frm'){
										setTimeout(function() {
											api.hideProgress();
											api.execScript({
												name:'home_win',
												frameName: 'footer_tab_1',
												script: 'openDaibaiList("'+targetAction+'", "'+billModel.st_code+'", "'+featureStr+'")'
											});
											api.closeToWin({
												name: 'home_win'
											});
										}, 500);
									} else {
										/*api.execScript({
											name : 'bill-list_win',
											script : 'refreshBillList(' + 1 + ');'
										});
										window.setTimeout(function() {
											api.closeToWin({
												name : 'bill-list_win'
											});
										}, 1100);*/
										window.setTimeout(function() {
											api.closeToWin({
												name : 'all_bill_list_win'
											});
											api.closeWin({});
										}, 1100);
									}
								});
							} else {
								if (billcntFrom!='all_bill_list_frm'){
									api.execScript({
										name : 'bill-list_win',
										script : 'refreshBillList(' + 1 + ');'
									});
									window.setTimeout(function() {
										api.closeToWin({
											name : 'bill-list_win'
										});
									}, 1100);
								} else {
									window.setTimeout(function() {
										api.closeToWin({
											name : 'all_bill_list_win'
										});
										api.closeWin({});
									}, 1100);
								}
							}
						});
						//====================修改 工单提醒 END
					}
				}else {
					api.toast({
						msg : "提交成功",
						duration : 1000,
						location : 'middle'
					});
					// 删除本地缓存
					if(api.frameName!='billRevertYysElectric_frm'){
						deleteBill(opts.billSn);
					}

					/*// 验证该站址下是否还有未完成工单
					var billModel = $api.getStorage('billModel');
					var param={
						stationcode:billModel.st_code,
						start:1,
						limit:20,
						stationListType:2
					}
					$client.getAllWorkList(param,function(ret,err){
						if(listOrder.taskList.length>2||listOrder.zndwTaskList.length>2||listOrder.billList.length>2||listOrder.hidderList.length>2||listOrder.standStationList.length>2||listOrder.fadianlist.length>2){
							api.alert({
								title: '提示',
								msg: '本站还有工单未处理！',
							}, function(ret, err) {
								api.execScript({
									name : 'bill-list_win',
									script : 'refreshBillList(' + 1 + ');'
								});
								window.setTimeout(function() {
									api.closeToWin({
										name : 'bill-list_win'
									});
								}, 1100);
							});
						}else {
							api.execScript({
								name : 'bill-list_win',
								script : 'refreshBillList(' + 1 + ');'
							});
							window.setTimeout(function() {
								api.closeToWin({
									name : 'bill-list_win'
								});
							}, 1100);
						}
					});*/
					
					//====================修改 工单提醒 BEGIN
					var billModel = $api.getStorage('billModel');
					var param={
						pagename: api.pageParam.type=='GET_BILL_FD'?'fd':'gz',
						pageaction: 'REVERT',	//"ACCEPT", "DOING", "REVERT"
						stationcode:billModel.st_code,
						stationListType:2,
						stationname: billModel.st_name
					}
					$client.sixBillRemind(param, function(ret, err) {
						if (ret.billCntInfo.length>0){
							var billCntInfo = JSON.parse(ret.billCntInfo);
							var targetAction ="";
							if (billCntInfo.status=='REVERT'){
								targetAction="REVERT";
							} else if (billCntInfo.status=='DOING'){
								targetAction="DOING";
							} else {
								targetAction="ACCEPT";
							} 
							var featureStr = (api.pageParam.type=='GET_BILL_FD'?'5':'4');
							// 已领取
							api.alert({
								title: '提示',
								msg: '本站还有工单未处理！',
							}, function(ret, err) {
								if (billcntFrom!='all_bill_list_frm'){
									setTimeout(function() {
										api.hideProgress();
										api.execScript({
											name:'home_win',
											frameName: 'footer_tab_1',
											script: 'openDaibaiList("'+targetAction+'", "'+billModel.st_code+'", "'+featureStr+'")'
										});
										api.closeToWin({
											name: 'home_win'
										});
									}, 500);
								} else {
									api.execScript({
										name : 'bill-list_win',
										script : 'refreshBillList(' + 1 + ');'
									});
									window.setTimeout(function() {
										api.closeToWin({
											name : 'all_bill_list_win'
										});
										api.closeWin({});
									}, 1100);
								}
							});
						} else {
							if (billcntFrom!='all_bill_list_frm'){
								api.execScript({
									name : 'bill-list_win',
									script : 'refreshBillList(' + 1 + ');'
								});
								window.setTimeout(function() {
									api.closeToWin({
										name : 'bill-list_win'
									});
								}, 1100);
							} else {
								window.setTimeout(function() {
									api.closeToWin({
										name : 'all_bill_list_win'
									});
									api.closeWin({});
								}, 1100);
							}
						}
					});
					//====================修改 工单提醒 END
				}
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

BillForm.prototype.checkTime = function(time1, time2) {
	var t1 = new Date(time1.replace(/-/g, "/"));
	var t2 = new Date(time2.replace(/-/g, "/"));
	if (t2 <= t1) {
		return false;
	}
	return true;
}

BillForm.prototype.init = function() {
	var self = this;
	self.setFormValidate();
}
