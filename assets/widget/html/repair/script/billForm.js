//校验器
var BillForm = function(formObj, btnObj, submitFn) {//formObj 表单jquery对象，btnObj 提交按钮对象,submitFn 接口函数
	//设置为提示最先发现的错误信息，后续错误不提示
	this.hasError = false;

	this.submitFn = submitFn;
	this.formObj = ( formObj instanceof jQuery == true) ? formObj : $(formObj);
	this.btnObj = ( btnObj instanceof jQuery == true) ? btnObj : $(btnObj);
};

BillForm.prototype.reset = function() {
	this.hasError = false;
}
//设置参数
BillForm.prototype.setQueryOptions = function(parpm) {
	this.parpm = parpm;
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
//			programCodeCheck : function(val, errorMsg, el) {
//
//				var isUpstation = $('[name=fixType]').val();
//				if (isUpstation == '3') {
//					if (val.length != 15) {
//						if (!self.hasError) {
//							api.toast({
//								msg : '项目编码长度不等于15位，请重新填写！',
//								duration : 1000,
//								location : 'bottom'
//							});
//							self.hasError = true;
//						}
//					}
//					if (isNaN(val.substring(0, 2))) {
//						if (!self.hasError) {
//							api.toast({
//								msg : '项目编码第1-2位代表年份（数字），请重新填写！',
//								duration : 1000,
//								location : 'bottom'
//							});
//							self.hasError = true;
//						}
//					}
//					if ('A' != val.charAt(2)) {
//						if (!self.hasError) {
//							api.toast({
//								msg : '项目编码第3位代表项目类别（字母A），请重新填写！',
//								duration : 1000,
//								location : 'bottom'
//							});
//							self.hasError = true;
//						}
//					}
//					if (isNaN(val.substring(3, 5))) {
//						if (!self.hasError) {
//							api.toast({
//								msg : '项目编码第4-5位代表项目批次（数字），请重新填写！',
//								duration : 1000,
//								location : 'bottom'
//							});
//							self.hasError = true;
//						}
//					}
//
//					if (isNaN(val.substring(5, 9))) {
//						if (!self.hasError) {
//							api.toast({
//								msg : '项目编码第6-9位代表项目管理和实施单位（数字），请重新填写！',
//								duration : 1000,
//								location : 'bottom'
//							});
//							self.hasError = true;
//						}
//					}
//
//					if ('3' != val.substring(9, 10)) {
//						if (!self.hasError) {
//							api.toast({
//								msg : '项目编码第10位代表建设方式（数字3），请重新填写！',
//								duration : 1000,
//								location : 'bottom'
//							});
//							self.hasError = true;
//						}
//					}
//					if (isNaN(val.substring(10, 15))) {
//						if (!self.hasError) {
//							api.toast({
//								msg : '项目编码第11-15位代表项目流水号（数字），请重新填写！',
//								duration : 1000,
//								location : 'bottom'
//							});
//							self.hasError = true;
//						}
//					}
//				}
//			},
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
					if ("ELECTRIC_BEGIN" == api.pageParam.billStatus && 'Y' == isUpstation) {
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
				if (isEmptyRun == '0') {
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

					if (new Date(format(recoveryTime).replace(/-/g, "/")) > new Date(format(elecEndTime).replace(/-/g, "/"))) {
						if (!self.hasError) {
							api.toast({
								msg : '修复时间必须小于发电结束时间！',
								duration : 1500,
								location : 'bottom'
							});
							self.hasError = true;
						}
					}

				} else {
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
		$('form').validate('submitValidate');
		if (!self.hasError) {
			// api.hideProgress();
			$aui.dialog({
				title : '确认提交数据？',
				msg : '是否确认回单？'
			}, function(ret) {
				if (ret.buttonIndex) {
					self.submit();
				}
			});
			return true;
		}
		self.reset();
		return false;
	});
}

BillForm.prototype.submit = function() {
	var opts = {};
	var self = this;
	var billModel = $api.getStorage('billModel');
	console.log("=============" + JSON.stringify(billModel));
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
		if($(this).attr('type')=='radio'){
		val=$("input[type='radio']:checked").val();

		}

		opts[name] = val;
		//		if(billModel.billstatus=='ELECTRIC_END'){
		//			opts['recoveryTime'] = (new Date()).pattern("yyyy-MM-d0d HH:mm:ss");
		//			opts['outerRecoverTime'] = (new Date()).pattern("yyyy-MM-dd HH:mm:ss");
		//		}
		//		if (billModel.rev_is_empty_run == '1' || billModel.rev_is_empty_run == '2') {
		//			opts['outerRecoverTime'] = '';
		//			opts['recoveryTime'] = '';
		//			opts['elecEndTime'] = '';
		//		}
	});
	// wxx
	console.log("=============================================");
	console.log(getObj(opts));
	var opts={
		billsn:opts.billsn,
		isNeedFee:opts.isNeedFee,
		fixType:opts.fixType,
		contract:opts.contract,
		fixUserid:opts.fixUserid,
		fixUser:opts.fixUser,
		fixCom:opts.companyname,
		fixRemark:opts.fixRemark,
		completeLimitDate:opts.completeLimitDate,
		aintenanceLogo:opts.aintenanceLogo,
		discountprice:opts.discountprice,
		health:opts.health,
		//验收携带参数
		projectId :opts.projectid,
		acceptUser :opts.acceptUser,
		acceptPhone :opts.acceptPhone,
		acceptResult : opts.acceptResult,
		quality :opts.quality,
		acceptanceReportUrl :opts.acceptanceReportUrl,
		acceptRemark : opts.acceptRemark,
		budget:$('#budgetId').val()
	}
	console.log("opts == >>" + JSON.stringify(opts))
	console.log(JSON.stringify(opts));
	if(opts.fixType=='1'){
		$client.repairCheckProcedure(opts,function(ret,err){
			// console.log("pppppppppppppppppppppppppp000000000000000000000000000000000");
			// console.log(JSON.stringify(ret));
			// console.log("pppppppppppppppppppppppppp000000000000000000000000000000000");
			if(ret.success){
				self.submitFn(opts, function(ret, err) {
					if (ret) {
						if (ret.success) {
							api.showProgress({
								title : '处理中'
							});
							api.toast({
								msg : "提交成功",
								duration : 1000,
								location : 'middle'
							});
							api.execScript({
								name : "repair/repair-list_win",
								frameName : 'repair-listCon_frm',
								script : 'refreshList();'
							});
							window.setTimeout(function() {
								api.closeToWin({
									name : 'repair/repair-list_win'
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
			}else {
				$aui.dialog({
					title : '超出预算,是否继续？'
				}, function(ret) {
					if (ret.buttonIndex) {
						api.showProgress({
							title : '处理中'
						});
						self.submitFn(opts, function(ret, err) {
							if (ret) {
								if (ret.success) {
									api.toast({
										msg : "提交成功",
										duration : 1000,
										location : 'middle'
									});

									api.execScript({
										name : "repair/repair-list_win",
										frameName : 'repair-listCon_frm',
										script : 'refreshList();'
									});
									window.setTimeout(function() {
										api.closeToWin({
											name : 'repair/repair-list_win'
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
				});
			}
		});
	}else {
		//====================测试用 ZZJ BEGIN
		/*var billModel = $api.getStorage('billModel');
		var param={
			pagename: 'gz',
			pageaction: 'DOING',	//"ACCEPT", "DOING", "REVERT"
			stationcode:billModel.st_code,
			stationListType:2
		};
		$client.sixBillRemind(param, function(ret, err) {
			//ret.billCntInfo = '{"status": "REVERT"}';
			if (ret.billCntInfo.length>0){
				var billCntInfo = JSON.parse(ret.billCntInfo);
				var targetAction ="";
				if (billCntInfo.status=='ACCEPT'){
					targetAction="ACCEPT";
				} else {
					targetAction="DOING";
				} 
				api.confirm({
					title: '提示',
					msg: '本站还有工单未处理！',
				}, function(ret, err) {
					if (ret.buttonIndex == 2) {
						setTimeout(function() {
							api.hideProgress();
							api.execScript({
								name:'home_win',
								frameName: 'footer_tab_1',
								script: 'openDaibaiList("'+targetAction+'", "'+billModel.st_code+'", "4")'
							});
							api.closeToWin({
								name: 'home_win'
							});
						}, 500);
					}else{
						api.execScript({
							name : "repair-list_win",
							frameName : 'repair-listCon_frm',
							script : 'refreshList();'
						});
						window.setTimeout(function() {
							api.closeToWin({
								name : 'repair/repair-list_win'
							});
						}, 1100);
					}
				});
			} else {
				api.execScript({
					name : "repair-list_win",
					frameName : 'repair-listCon_frm',
					script : 'refreshList();'
				});
				window.setTimeout(function() {
					api.closeToWin({
						name : 'repair/repair-list_win'
					});
				}, 1100);
			}
		});
		return;*/
		//====================测试用 ZZJ END
		api.showProgress({
			title : '处理中'
		});
		self.submitFn(opts, function(ret, err) {
			console.log("billform js ==>"+JSON.stringify(ret));
			if (ret) {
				if (ret.success) {
					api.toast({
						msg : "提交成功",
						duration : 1000,
						location : 'middle'
					});

					/*api.execScript({
						name : "repair-list_win",
						frameName : 'repair-listCon_frm',
						script : 'refreshList();'
					});
					window.setTimeout(function() {
						api.closeToWin({
							name : 'repair/repair-list_win'
						});
					}, 1100);*/
					//====================修改 工单提醒 BEGIN
					//var billModel = $api.getStorage('billModel');
					if (null!=billModel){
						var param={
							pagename: 'gz',
							pageaction: 'DOING',	//"ACCEPT", "DOING", "REVERT"
							stationcode:billModel.stationcode,
							stationListType:2
						};
						$client.sixBillRemind(param, function(ret, err) {
							//ret.billCntInfo = '{"status": "REVERT"}';
							if (ret.billCntInfo.length>0){
								var billCntInfo = JSON.parse(ret.billCntInfo);
								var targetAction ="";
								if (billCntInfo.status=='ACCEPT'){
									targetAction="ACCEPT";
								} else {
									targetAction="DOING";
								} 
								api.confirm({
									title: '提示',
									msg: '本站还有工单未处理！',
								}, function(ret, err) {
									if (ret.buttonIndex == 2) {
										setTimeout(function() {
											api.hideProgress();
											api.execScript({
												name:'home_win',
												frameName: 'footer_tab_1',
												script: 'openDaibaiList("'+targetAction+'", "'+billModel.stationcode+'", "4")'
											});
											api.closeToWin({
												name: 'home_win'
											});
										}, 500);
									}else{
										
										window.setTimeout(function() {
											api.execScript({
												name : "repair/repair-list_win",
												frameName : 'repair-listCon_frm',
												script : 'refreshList();'
											});
											api.closeToWin({
												name : 'repair/repair-list_win'
											});
										}, 1100);
									}
								});
							} else {
								window.setTimeout(function() {
									api.execScript({
										name : "repair/repair-list_win",
										frameName : 'repair-listCon_frm',
										script : 'refreshList()'
									});
									api.closeToWin({
										name : 'repair/repair-list_win'
									});
								}, 1100);
							}
						});
					} else {
					
						window.setTimeout(function() {
							api.execScript({
								name : "repair/repair-list_win",
								frameName : 'repair-listCon_frm',
								script : 'refreshList();'
							});
							api.closeToWin({
								name : 'repair/repair-list_win'
							});
						}, 1100);	
					}
					
					//====================修改 工单提醒 END
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
