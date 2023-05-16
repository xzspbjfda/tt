// 打开查询工单页面
var type="";
var index;
var time=0;
var  isshow=true;
 function refreshBillList(index) {
 console.log("index"+index);
            if (!index) {
                index = $('#tabBox li.active').index();
            }
            if(index==0){
	            api.setFrameGroupIndex({
	                name : 'bill_header_tab',
	                index : 1,
	                scroll : false,
	                reload : true
	            });
	            api.setFrameGroupIndex({
	                name : 'bill_header_tab',
	                index : index,
	                scroll : true,
	                reload : true
	            });
            }else  if(index==1){
                api.setFrameGroupIndex({
	                name : 'bill_header_tab',
	                index : 2,
	                scroll : false,
	                reload : true
                });
                api.setFrameGroupIndex({
	                name : 'bill_header_tab',
	                index : index,
	                scroll : true,
	                reload : true
                });
            }else if(index==2){
            	api.setFrameGroupIndex({
	                name : 'bill_header_tab',
	                index : index,
	                scroll : true,
	                reload : true
            	});
            }else{
	            api.setFrameGroupIndex({
	                name : 'bill_header_tab',
	                index : index,
	                scroll : true,
	                reload : true
	            });
            }

        }

function showPopup() {
//	var num=api.pageParam.num;
 var query_setting =null;
 console.log("我来了");
 console.log("type:"+type);
	var num=$api.getStorage("num");
  var frameName1=$('#tabBox li.active').attr('tabName');
	var frameName2=$('#tabBox2 li.active').attr('tabName');
	console.log("frameName1:"+frameName1);
	console.log("当前状态："+frameName1);
	if(type=="GET_BILL_LIST_0"||type=="GET_BILL_LIST_1"||type=="GET_BILL_LIST_2"){
		if(frameName1=='waitTaskList2'||frameName1=='waitTaskList1'){
			query_setting = {
		        stationNameOpt : true,
		        stationCodeOpt : true,
		        begintimetype : true,
		        winName : api.winName,
		        frameName : $('#tabBox li.active').attr('tabName'),
		        callback : 'cb_queryBillList'
			};
	    console.log("我来了2");
		}else{
		    query_setting = {
		        stationNameOpt : true,
		        stationCodeOpt : true,
		        begintimetype : true,
		        billStatus :true,
		        winName : api.winName,
		        frameName : $('#tabBox li.active').attr('tabName'),
		        callback : 'cb_queryBillList'
		    };
		    console.log("我来了3");
		}
	}else{
		if(frameName2=='waitTaskList3'||frameName2=='waitTaskList4'||frameName2=='waitTaskList5'){
			query_setting = {
	            stationNameOpt : true,
	            stationCodeOpt : true,
	            begintimetype : true,
	            alarmType:true,
	            billStatus :true,
	            winName : api.winName,
	            frameName :  $('#tabBox2 li.active').attr('tabName'),
	            callback : 'cb_queryBillList'
			};
			console.log("我来了5");
		}else {
			query_setting = {
	            stationNameOpt : true,
	            stationCodeOpt : true,
	            begintimetype : true,
	            billStatus :true,
	            winName : api.winName,
	            frameName : 'bill-listCon_frm',
	            callback : 'cb_queryBillList'
	        };
        console.log("我来了4");
		}
	}

    api.openFrame({
        name : 'popup_query_frm',
        url : '../dialog/popup_query.html',
        rect : {
            x : 0,
            y : 0,
            w : 'auto',
            h : 'auto'
        },
        bounces : false,
        reload : false,
        pageParam : query_setting
    });
}

apiready = function() {
    api.addEventListener({
        name : 'viewappear'
    }, function(ret, err) {
        if (api.pageParam.queryBill) {
            api.pageParam.queryBill = false;
            api.closeWin({
                name : "queryBill"
            });
        }
        if (api.pageParam.billElectric) {
            api.pageParam.billElectric = false;
            api.closeWin({
                name : "billElectric_win"
            });
        }
        if (api.pageParam.billRevert) {
            api.pageParam.billRevert = false;
            api.closeWin({
                name : "billRevert_win"
            });
        }
        if (api.pageParam.restaurant) {
            api.pageParam.restaurant = false;
            api.closeWin({
                name : "restaurant"
            });
        }
        if (api.pageParam.supportDefine) {
            api.pageParam.supportDefine = false;
            api.closeWin({
                name : "supportDefine_win"
            });
        }

        if (api.pageParam.mainBillDetailWin) {
            api.pageParam.mainBillDetailWin = false;
            api.closeWin({
                name : "main_bill_detail"
            });
        }
    });
    //由于Android不支持viewappear监听事件，所以在此处关闭页面
   if(api.systemType=='android'){
       if(api.pageParam.mainBillDetailWin){
		    //关闭工单详情窗口
		    api.closeWin({
		        name : 'main_bill_detail_win'
		    });
	    }

	    if(api.pageParam.billRevert){
	    	//关闭工单详情窗口
		    api.closeWin({
		        name : 'billRevert_win'
		    });
    	}

	    if(api.pageParam.billElectric){
	    	//关闭发电页面
		    api.closeWin({
		        name : 'billElectric_win'
		    });
    	}

    	if(api.pageParam.supportDefine){
	    	//关闭故障定位页面
		    api.closeWin({
		        name : 'supportDefine_win'
		    });
    	}
    }

    initHeader();
    $('#header .aui-title').text(api.pageParam.title);
    api.pageParam.frameName = 'bill-listCon_frm';
     type = api.pageParam.type;
     console.log("[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]");
     console.log(type);
     var position=type.substring(type.lastIndexOf('_')+1);


    if (type.indexOf('GET_BILL_LIST')!=-1) {
    $api.byId('isshow').style.display = "";

          api.openFrameGroup({
                name : 'bill_header_tab',
                rect : frameRect(),
                preload : 0,
                frames : [{
                    name : 'waitTaskList1',
                    url : 'bill-listCon_frm.html',
                    pageParam : {
                        num : 'ACCEPT',
                        type:"GET_BILL_LIST",
                        title:api.pageParam.title
                    },
                    bounces : false
                }, {
                    name : 'finishTaskList',
                    url : 'bill-listCon_frm.html',
                    pageParam : {
                        num : 'OTHER',
                        type:"GET_BILL_LIST",
                        title:api.pageParam.title
                    },
                    bounces : false
                } ,{
                    name : 'waitTaskList2',
                    url : 'bill-listCon_frm.html',
                    pageParam : {
                        num : 'REVERT',
                        type:"GET_BILL_LIST",
                        title:api.pageParam.title
                    },
                    bounces : false
                }]
            }, function(ret, err) {
                if (ret) {
//            		alert(ret.index);
					if(new Date().getTime()-time>1000){
					$('#tabBox li:eq(' + ret.index+ ')').addClass('active').siblings().removeClass('active');
                    $api.setStorage("num",ret.index);
					}else{
                    $('#tabBox li:eq(' + position+ ')').addClass('active').siblings().removeClass('active');
                    $api.setStorage("num",position);
                    console.log('时间'+new Date().getTime());
                    }
//                  return;
                }
            });

             api.setFrameGroupIndex({
                name : 'bill_header_tab',
                index : position,
                scroll : false,
                reload : true
            });
            time=new Date().getTime();
               console.log('时间时间：'+new Date().getTime());
//           $('#tabBox li:eq(' + position+ ')').addClass('active').siblings().removeClass('active');
//           $api.setStorage("num",position);
            /*jquery事件:tab切换*/
            $('#tabBox li').click(function() {
                $(this).addClass('active').siblings().removeClass('active');
                api.setFrameGroupIndex({
                    name : 'bill_header_tab',
                    index : $(this).index(),
                    scroll : true
                });
            });

    }else if (type=='GET_BILL_FD') {
      // 停发电工单页面tab设置 wxxx
      $api.byId('isshow').style.display = "";
            $('#menuBtn').hide();
            api.openFrameGroup({
                  name : 'bill_header_tab',
                  rect : frameRect2(),
                  preload : 0,
                  frames : [{
                      name : 'waitTaskList1',
                      url : 'bill-listCon_frm.html',
                      pageParam : {
                          num : '',
                          type:type,
                          title:api.pageParam.title
                      },
                      bounces : false
                  }
                ]
              }, function(ret, err) {
                  if (ret) {
                  if(new Date().getTime()-time>1000){
                  $('#tabBox li:eq(' + ret.index+ ')').addClass('active').siblings().removeClass('active');
                            $api.setStorage("num",ret.index);
                  }else{
                            $('#tabBox li:eq(' + position+ ')').addClass('active').siblings().removeClass('active');
                            $api.setStorage("num",position);
                            console.log('时间'+new Date().getTime());
                            }
                  }
              });

               api.setFrameGroupIndex({
                  name : 'bill_header_tab',
                  index : position,
                  scroll : false,
                  reload : true
              });
              time=new Date().getTime();
              console.log('时间时间：'+new Date().getTime());

              $('#tabBox li').click(function() {
                  $(this).addClass('active').siblings().removeClass('active');
                  api.setFrameGroupIndex({
                      name : 'bill_header_tab',
                      index : $(this).index(),
                      scroll : true
                  });
              });
    }else{
      $api.byId('isshow2').style.display = "";

            api.openFrameGroup({
                  name : 'bill_header_tab',
                  rect : frameRect(),
                  preload : 0,
                  frames : [{
                      name : 'waitTaskList3',
                      url : 'bill-listCon_frm.html',
                      pageParam : {
                          title: api.pageParam.title,
                          type:api.pageParam.type
                      },
                      bounces : false
                  }, {
                      name : 'waitTaskList4',
                      url : 'bill-listCon_frm.html',
                      pageParam : {
                        title: api.pageParam.title,
                        type:api.pageParam.type,
                        alarmStatus:0
                      },
                      bounces : false
                  } ,{
                      name : 'waitTaskList5',
                      url : 'bill-listCon_frm.html',
                      pageParam : {
                        title: api.pageParam.title,
                        type:api.pageParam.type,
                        alarmStatus:1
                      },
                      bounces : false
                  }]
              }, function(ret, err) {
                  if (ret) {
                        $('#tabBox2 li:eq(' + ret.index+ ')').addClass('active').siblings().removeClass('active');
                  }
              });

               api.setFrameGroupIndex({
                  name : 'bill_header_tab',
                  index : position,
                  scroll : false,
                  reload : true
              });

              $('#tabBox2 li').click(function() {
                  $(this).addClass('active').siblings().removeClass('active');
                  api.setFrameGroupIndex({
                      name : 'bill_header_tab',
                      index : $(this).index(),
                      scroll : true
                  });
              });

    // api.openFrame({
    //     name : 'bill-listCon_frm',
    //     url : 'bill-listCon_frm.html',
    //     rect : frameRect1(),
    //     bounces : true,
    //     opaque : true,
    //     vScrollBarEnabled : false,
    //     reload : true,
    //     pageParam : api.pageParam
    // });
    }
};
