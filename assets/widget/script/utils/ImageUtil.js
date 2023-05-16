/**
 *获取当前时间
 */
function CurentTime(){
    var now = new Date();

    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日

    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();           //秒

    var clock = year + "-";

    if(month < 10)
        clock += "0";

    clock += month + "-";

    if(day < 10)
        clock += "0";

    clock += day + " ";

    if(hh < 10)
        clock += "0";

    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm + ":";

    if (ss < 10) clock += '0';
    clock += ss;
    return(clock);
}


function CurentTime2(){
    return (new Date()).pattern("yyyyMMddHHmmss");
}



var imageUtil = (function(imageArray, downloadList) {
    var image = function() {
        this.imageArray = imageArray;
        this.downloadList = downloadList;
        this.uploadFn
        this.delFn
        this.saveFn

        this.getImageArray = function() {
            return this.imageArray;
        }

        this.setImageArray = function(array) {
            return this.imageArray = array;
        }

        this.getDownloadList = function() {
            return this.downloadList;
        }

        this.setUploadFn = function(fn) {
            this.uploadFn = fn;
        }

        this.setDelFn = function(fn) {
            this.delFn = fn;
        }

        this.setSaveFn = function(fn) {
            this.saveFn = fn;
        }

        this.init = function(opt) {
            $.extend(this.imageArray, opt.imageArray);
            $.extend(this.downloadList, opt.downloadList);
            $.extend(this, opt);
        }

        this.setOption = function(opt){
            $.extend(this,opt);
        }
// wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx添加图片 压缩图片 添加水印
        this.add = function(method,callback,e,iswatermark,path,imgcode) {//e,
            console.log("====上传图片添加水印开始=====method:"+method+",api.frameName:"+api.frameName)
            //刷新地理位置 经纬度
            api.execScript({
            	  name:"home_win",
                frameName : 'footer_tab_1',
                script : 'getHeartFromGps()'
            });
            //console.log("执行apdd");
            //console.log(method)
            //showlog('执行imageUtil-add(添加图片)方法：');
            method = method || 'camera';
            console.log("====开始拍照=====")
            api.getPicture({
                sourceType: method,
                encodingType: 'jpg',
                mediaValue: 'pic',
                quality: 60,
                targetWidth: 1440,
                targetHeight: 1440,
                saveToPhotoAlbum: false
            }, function(ret, err) {
              if (ret) {
                console.log("====上传图片获取手机图片====ret:"+JSON.stringify(ret))
              } else {
                console.log("====上传图片获取手机图片====err:"+JSON.stringify(err))
              }
              if (ret && ret.data && ret.data.length) {
               if(iswatermark){
                 //  wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                 var filePath = ret.data;
                 console.log("api.getPicture="+filePath)
                 var $canvas = $(e).next();
                 var imgCanvas = $(e).siblings('.imgPath');
                 var w, h, finalResult;
                 imgCanvas.attr({
                     src: filePath
                 })
                 imgCanvas[0].onload = function() {
                         console.log(JSON.stringify(this));
                         w = $(this).width();
                         h = $(this).height();
                         $canvas.attr({
                             width: w,
                             height: h
                         })
                     }
                     //新建img对象
                 var img = new Image();
                 var imgicon = new Image();

                 //为新建的img赋值src
                 img.src = filePath;
                 if(path){
                   imgicon.src='../../../image/icons/press_itower.png';
                 }else {
                   imgicon.src='../../image/icons/press_itower.png';
                 }
                 if(api.frameName=='createRepairDetail'){
                	 imgicon.src='../image/icons/press_itower.png';
                 } else if(api.frameName=='createBillDetail'){
                	 imgicon.src='../image/icons/press_itower.png';
                 } else if(api.frameName=='stationPicDetail_frm'){
                	 imgicon.src='../../image/icons/press_itower.png';
                 }
                 // img加载完成
                 img.onload = function() {
                    console.log("====img加载完成====")
                     //准备canvas
                     canvas = $canvas[0];
                     var parolData = $api.getStorage('parolData');
                     var context = canvas.getContext("2d");
                     var lastLocation = $api.getStorage('LAST_GPS_LOCATION');
                     var curentTime = CurentTime();
                     // 绘制图片
                     setTimeout(function() {
                       context.drawImage(img, 0, 0);
                       context.rect(0,h-200,380,240);
                       context.fillStyle = 'rgba(0, 0, 0, 0.3)';
                       context.fill();
                      // 绘制水印
                      context.font = "20px microsoft yahei";
                      context.fillStyle = "rgba(255,255,255,0.5)";
                      if(api.frameName=='generationWriteFrm'){
                        context.fillText("经度："+lastLocation.lon, 10, h-146);
                        context.fillText("纬度："+lastLocation.lat, 10, h-120);
                        context.fillText("地址："+lastLocation.photoaddress, 10, h-94);
                        context.fillText("站址："+parolData.site_name, 10, h-68);
                        context.fillText("运维ID："+parolData.site_id, 10, h-42);
                       //  context.fillText("站址编码："+parolData.deviceid, 10, h-42);
                        context.fillText("时间："+curentTime, 10, h-16);
                      }else {
                        if(api.frameName=='projectDetailNew_frm'){
                          context.fillText("经度："+lastLocation.lon, 10, h-172);
                          context.fillText("纬度："+lastLocation.lat, 10, h-146);
                          context.fillText("地址："+lastLocation.photoaddress, 10, h-120);
                          context.fillText("站址："+parolData.stationname, 10, h-94);
                          context.fillText("运维ID："+parolData.stationcode, 10, h-68);
                          context.fillText("站址编码："+parolData.deviceid, 10, h-42);
                          context.fillText("时间："+curentTime, 10, h-16);
                        }else if(api.frameName=='createRepairDetail'){
                          context.fillText("经度："+lastLocation.lon, 10, h-172);
                          context.fillText("纬度："+lastLocation.lat, 10, h-146);
                          context.fillText("地址："+lastLocation.photoaddress, 10, h-120);
                          context.fillText("时间："+curentTime, 10, h-16);
                          context.fillText("站址名称："+api.pageParam.stationName, 10, h-94);
                          context.fillText("站址编码："+api.pageParam.stationInfo.st_deviceid, 10, h-42);
                          context.fillText("运维ID："+api.pageParam.st_code, 10, h-68);
                        }else if(api.frameName=='ammeter-jiaowei_frm'){
                          context.fillText("经度："+lastLocation.lon, 10, h-172);
                          context.fillText("纬度："+lastLocation.lat, 10, h-146);
                          context.fillText("地址："+lastLocation.photoaddress, 10, h-120);
                          context.fillText("时间："+curentTime, 10, h-16);
                        }else if(api.frameName=='checkBillRevertDetail'){
                          context.fillText("经度："+lastLocation.lon, 10, h-172);
                          context.fillText("纬度："+lastLocation.lat, 10, h-146);
                          context.fillText("地址："+lastLocation.photoaddress, 10, h-120);
                          context.fillText("时间："+curentTime, 10, h-16);
                        }else if(api.frameName=='createBillDetail'  || api.frameName=='stationPicDetail_frm'){
                          context.fillText("经度："+lastLocation.lon, 10, h-172);
                          context.fillText("纬度："+lastLocation.lat, 10, h-146);
                          context.fillText("地址："+lastLocation.photoaddress, 10, h-120);
                          context.fillText("时间："+curentTime, 10, h-16);
                        }else {
                          context.fillText("经度："+lastLocation.lon, 10, h-146);
                          context.fillText("纬度："+lastLocation.lat, 10, h-120);
                          context.fillText("地址："+lastLocation.photoaddress, 10, h-94);
                          context.fillText("站址："+parolData.stationname, 10, h-68);
                          context.fillText("运维ID："+parolData.stationcode, 10, h-42);
                          context.fillText("时间："+curentTime, 10, h-16);
                         }
                      }
                      console.log('canvas:'+JSON.stringify(canvas))
                      console.log('e:' + JSON.stringify(e))
                      console.log('$canvas:' + JSON.stringify($canvas))
                      console.log('eimgCanvas:' + JSON.stringify(imgCanvas))
                      console.log('iswatermark:' + JSON.stringify(iswatermark))
                      console.log('path:' + JSON.stringify(path))
                      console.log('imgcode:' + JSON.stringify(imgcode))
                      console.log('ret:' + JSON.stringify(ret))
                      console.log("图片水印：")
                      console.log("经度："+lastLocation.lon)
                      console.log("纬度："+lastLocation.lat)
                      console.log("地址："+lastLocation.photoaddress)
                      // console.log("站址："+parolData.stationname)
                      // console.log("运维ID："+parolData.stationcode)
                      console.log("时间："+curentTime)
                      //  context.lineWidth = 0.5;
                      //  context.strokeStyle = 'black';
                      //  context.strokeText("经度："+lastLocation.lon+"  纬度："+lastLocation.lat, 10, 100);
                       context.drawImage(imgicon,10,h-316);
                       // 此时canvas.toDataURL('image/png')的结果就是最终合成的base64图片信息

                      //////////////////////////////////////
                       var user=$api.getStorage('user');
                       var projectid=$(e).parent().parent('.formtest').find('input[name="id"]').val();
                       var lon1 = $api.getStorage('lon1');
                 			 var lat1 = $api.getStorage('lat1');
                       var newtime = $api.getStorage('newtime');
                       //////////////////////////////////////

                       var finalResult = canvas.toDataURL('image/png');//转换成base64
                       console.log('api.frameName:' + api.frameName)
                      //  console.log("finalResult:"+finalResult)
                       console.log("canvas:"+JSON.stringify(canvas))

                       // 压缩 wxx
                       var imgPathArr = filePath.split("/");
                       var imgName = imgPathArr[imgPathArr.length - 1];
                       // 重命名
                       var oldNameArr = filePath.split(".");
                       oldNameArr[0]=filePath.replace("."+oldNameArr[oldNameArr.length-1],'')
                       oldNameArr[1]=oldNameArr[oldNameArr.length - 1];
                       if(api.frameName=='billPicDetail_frm'||api.frameName=='billRevertCommonDetail_frm'||api.frameName=="billRevertYysElectric_frm"||api.frameName=="billRevertElectricDetail_frm"||api.frameName=="billRevertElectricNew_frm"||api.frameName=="billElectricDetail_frm"){
                         var stationname=api.pageParam.stationname;
                         var billId=api.pageParam.billId;
                         var billSn=api.pageParam.billSn;
                         var billModel = $api.getStorage('billModel');
                         var businessid = billModel.businesstype;
                         var newName = oldNameArr[0]+"_shuiyin;"+user.userid+";"+user.userid+";"+billId+';'+businessid+';'+billSn+';'+lon1+";"+lat1+";"+lastLocation.photoaddress+";"+newtime+";."+oldNameArr[1];
                        console.log(newName);
                       }else if (api.frameName=='standPicDetail_frm') {
                         var applyid = api.pageParam.applyid;
                         var stationname=api.pageParam.stationname;

                         var newName = oldNameArr[0]+"_shuiyin;"+user.userid+";"+user.userid+";"+applyid+';'+lon1+";"+lat1+";"+lastLocation.photoaddress+";"+newtime+";."+oldNameArr[1];

                       }else if (api.frameName=='repairCheckDetail_frm') {
                         var repairDetail = $api.getStorage('repairDetail');
                     		 var projectid = repairDetail.projectid;
                     		 var billsn = repairDetail.billsn;

                         var newName = oldNameArr[0]+"_shuiyin;2;"+user.userid+";"+projectid+";"+billsn+';'+lon1+";"+lat1+";"+lastLocation.photoaddress+";"+newtime+";."+oldNameArr[1];
                       }else if (api.frameName=='repairDoPlanDetail_frm') {
                        var repairDetail = $api.getStorage('repairDetail');
                         var projectid = repairDetail.projectid;
                         var billsn = repairDetail.billsn;

                        var newName = oldNameArr[0]+"_shuiyin;3;"+user.userid+";"+projectid+";"+billsn+';'+lon1+";"+lat1+";"+lastLocation.photoaddress+";"+newtime+";."+oldNameArr[1];
                       }else if (api.frameName=='repairDoOperateDetail_frm') {
                         var repairDetail = $api.getStorage('repairDetail');
                     		 var projectid = repairDetail.projectid;
                     		 var billsn = repairDetail.billsn;

                         var newName = oldNameArr[0]+"_shuiyin;4;"+user.userid+";"+projectid+";"+billsn+';'+lon1+";"+lat1+";"+lastLocation.photoaddress+";"+newtime+";."+oldNameArr[1];

                       }else if (api.frameName=='generationWriteFrm') {
                         var generationBillMenu = $api.getStorage('generationBillMenu');

                         var newName = oldNameArr[0]+"_shuiyin;"+generationBillMenu.id+';'+imgcode+';.'+oldNameArr[1];

                       }else if (api.frameName=='createRepairDetail') {

                         var newName = oldNameArr[0]+"_shuiyin;"+user.userid+";"+lon1+";"+lat1+";"+lastLocation.photoaddress+";"+newtime+";."+oldNameArr[1];

                       }else if (api.frameName=='checkBillRevertDetail') {

                         var newName = oldNameArr[0]+"_shuiyin;"+user.userid+";"+lon1+";"+lat1+";"+lastLocation.photoaddress+";"+newtime+";."+oldNameArr[1];

                       }else if (api.frameName=='createBillDetail'  || api.frameName=='stationPicDetail_frm') {
                         var newName = oldNameArr[0]+"_shuiyin;"+user.userid+";"+lon1+";"+lat1+";"+lastLocation.photoaddress+";"+newtime+";."+oldNameArr[1];
                       }else {
                         var newName = oldNameArr[0]+"_shuiyin;"+user.userid+";"+projectid+";"+lon1+";"+lat1+";"+lastLocation.photoaddress+";"+newtime+";."+oldNameArr[1];
                       }
                       console.log("oldNameArr:"+oldNameArr)
                       console.log('imgPathArr:' + JSON.stringify(imgPathArr))
                       console.log('newName:' +newName);

                       //删除数组最后一个元素
                       imgPathArr.pop();
//                       alert("api.frameName///"+api.frameName);

                      var imgPath = imgPathArr.join("/");
                      var data64 = finalResult.split(",")[1];
                      var trans = api.require('trans');
                       console.log('trans:' + JSON.stringify(trans))
                      //  console.log('data64:' + data64)
                       console.log('imgPath:' + JSON.stringify(imgPath))
                       trans.saveImage({
                         base64Str: data64,
                         imgPath:imgPath,
                         imgName:imgName
                      }, function(ret, err) {
                      	  
                         if (ret.status) {
                          //  alert(filePath)
                          //  alert(newName)
                           var fs = api.require('fs');
                           fs.rename({
                               oldPath: filePath,
                               newPath: newName
                           }, function(ret, err) {
                               if (ret.status) {
                                 if(api.frameName=='repairDoPlanDetail_frm' || api.frameName=='projectDetailNew_frm'|| api.frameName=='ammeter-jiaowei_frm' || api.frameName=='checkBillRevertDetail' || api.frameName=='createRepairDetail'|| api.frameName=='createBillDetail' || api.frameName=='stationPicDetail_frm' || api.frameName=="billRevertElectricNew_frm"||api.frameName=='billRevertCommonDetail_frm'||api.frameName=="billElectricDetail_frm"){
                                   callback(newName, err);
                                 }
                               } else {

                               }
                           });
                         } else {

                         }
                      });
                     }, 200);
                  }
                  if(api.frameName!='repairDoPlanDetail_frm' && api.frameName!='projectDetailNew_frm'&&api.frameName!="ammeter-jiaowei_frm"&&api.frameName!="checkBillRevertDetail"&&api.frameName!="createRepairDetail"&&api.frameName!="billRevertElectricNew_frm"&&api.frameName!='billRevertCommonDetail_frm'&&api.frameName!="billElectricDetail_frm"&&api.frameName!="createBillDetail" && api.frameName!='stationPicDetail_frm'){
                    if (callback) {
                        if(api.frameName=='generationWriteFrm'){
                          callback(ret, err,imgcode,e);
                        }else {
                          callback(ret, err);
                        }
                    }
                  }
                    // wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

               }else {
                 // wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                 var filePath = ret.data;
                 var imgPathArr = filePath.split("/");
                 var imgName = imgPathArr[imgPathArr.length - 1];
                 //////////////////////////////////////
                  var user=$api.getStorage('user');
                  var lon1 = $api.getStorage('lon1');
                  var lat1 = $api.getStorage('lat1');
                  var newtime = $api.getStorage('newtime');
                  //////////////////////////////////////
                 //删除数组最后一个元素
                 imgPathArr.pop();
                 if(api.frameName=='checkProjectDetail_frm'){
                   var imgPath = imgPathArr.join("/");
                   var oldNameArr = filePath.split(".");
                   oldNameArr[0]=filePath.replace("."+oldNameArr[oldNameArr.length-1],'')
                   oldNameArr[1]=oldNameArr[oldNameArr.length - 1];
                   var projectid = api.pageParam.detailid;
             		   var projectname = api.pageParam.itemname || '';

                   var newName = oldNameArr[0]+"_shuiyin;"+user.userid+";"+projectid+";"+projectname+';'+lon1+";"+lat1+";"+lastLocation.photoaddress+";"+newtime+";."+oldNameArr[1];

                  console.log(newName);
                   var fs = api.require('fs');
                   fs.rename({
                       oldPath: filePath,
                       newPath: newName
                   }, function(ret, err) {
                       if (ret.status) {

                       } else {

                       }
                   });
                 }

                 if (callback) {
                 	 
                     callback(ret, err);
                 }

                 // wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
               }

                }
            });
            console.log("====上传图片添加水印结束=====method:"+method+",api.frameName:"+api.frameName)
        }

        this.del = function(pid, callback) {
            for (var i = 0, size = this.imageArray.length; i < size; i++) {
                if (this.imageArray[i].id == pid) {
                    this.imageArray.splice(i, 1);
                    this.delFn(pid, callback);
                    break;
                }
            }
        }

        this.delAll = function(callback) {
            this.delRecord(0, callback);
        }

        this.delRecord = function(index, callback) {
            var self = this;
            var imageInfo = self.imageArray[index];
            self.delFn(imageInfo.id, function(ret, err) {
                if (index + 1 <= self.imageArray.length - 1) {
                    self.delRecord(index + 1, callback);
                } else {
                    if (callback) {
                        self.imageArray.length = 0;
                        callback(true);
                    }
                }
            });
        }

        this.delTheRecord = function(index,callback){
            var self = this;
            var imageInfo = self.imageArray[index];
            self.delFn(imageInfo.id,function(ret,err){
                if(callback){
                    callback(true);
                }
            });
        }

        this.load = function() {

        }

        this.show = function(imagePath) {
            console.log('结束imageUtil-add方法：');
            console.log(' 打开图片路径:' + imagePath);
            // var imageBrowser = api.require('imageBrowser');
            // imageBrowser.openImages({
            //     imageUrls: [imagePath],
            //     showList: false
            // });
            var pageParam = {
              images: [imagePath]
            };
            api.openWin({
              name: 'imageViewer',
              url: '../../html/photoViewer/mainFrame.html',
              pageParam : pageParam
            })
            console.log(`pageParam=${pageParam}`)
        }

        this.save = function(callback) {
            if (this.imageArray && this.imageArray.length) {
                api.showProgress({
                    title : '保存图片中...'
                });
                this.saveToLocal(0,callback);
            } else {
                showlog('上传数组不存在或者为空!');
                api.toast({
                    msg: '无可上传图片'
                });
            }
        }
        // wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        this.saveToLocal = function(index,callback){
            var self = this;
            self.saveFn(imageArray[index],function(ret,err){
                if(ret){
                    showlog('成功保存图片！');
                    if(index + 1 <= self.imageArray.length - 1){
                        self.saveToLocal(index+1,callback);
                    }else{
                        api.hideProgress();
                        api.toast({
	                        msg:'图片已保存本地'
                        });
                        if(callback){
                            callback(index+1);
                        }
                    }
                }else{
                    api.hideProgress();
                    api.toast({
	                    msg:'图片保存失败，请重新保存'
                    });
                    if(callback)
                    callback(index)
                }
            });
        }

        this.upload = function(callback) {
            var self = this;
            showlog('准备上传图片数量：' + self.imageArray.length);
            if (self.imageArray.length) {
                if (!curNetEnvironment()) {
                    api.confirm({
                        title: '网络提醒',
                        msg: '当前网络不是WiFi，是否继续上传？',
                        buttons: ['确定', '取消']
                    }, function(ret, err) {
                        if (ret.buttonIndex == 1) {
                            api.showProgress({
                                title: '上传图片中...'
                            });
                            return self.uploadServer(0, callback);
                        } else {
                            api.hideProgress();
                            return false;
                        }
                    });

                } else {
                    api.showProgress({
                        title: '上传图片中...'
                    });
                    return self.uploadServer(0, callback);
                }
            } else {
                api.toast({
                    msg: '无可上传图片！'
                });
                return false;
            }
        }
        // wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        this.uploadServer = function(index, callback) {

            var self = this;
           var imageInfo = self.imageArray;
          //  if(imageInfo.restype!=null&&imageInfo.restype!='null'&&imageInfo.restype!=''){
          //  imageInfo.phototime=imageInfo.phototime+'('+imageInfo.restype+')';
          //  }
           var imgpath = '';
          //  alert("imageInfo:"+imageInfo)
            self.uploadFn(imageInfo, imgpath, function(ret, err) {
              console.log("999999999999999999999999999999999999999");

                //console.log(JSON.stringify(ret));
                //console.log(JSON.stringify(err));
                api.showProgress({
                    title: '上传图片中...',
                    text: ret.progress + '/' + 100
                });
                var ret=ret.body;
                // alert("ret"+ret)
                if(ret){
                  if(api.winName=='emergency-detail_win'){
                    // 再改动王晓星
                    if (ret.success) {
                      // delete imageInfo.imgpath;
                      showlog('删除索引['+index+']');
                      if(typeof self.delFn !='undefined')
                          self.delTheRecord(index);
                      if (index + 1 <= self.imageArray.length - 1) {
                          api.showProgress({
                              title: '上传图片中...',
                              text: (index + 1) + '/' + self.imageArray.length
                          });
                          return self.uploadServer(index + 1, callback);
                      } else {
                          api.toast({
                                  msg: '上传成功!',
                                  duration: 3000,
                                  location: 'bottom'
                          }); 
                          api.hideProgress();
                          if (callback) {
                              callback(index+1);
                          }
                          return true;
                      }
                    } else {
                      if(err&&err.code==1){
                        api.toast({
                            msg: '图片上传超时,请重试！',
                            duration: 3000,
                            location: 'bottom'
                        });
                      }else {
                        api.toast({
                            msg: ret.data_info,
                            duration: 3000,
                            location: 'bottom'
                        });
                      }
                      api.hideProgress();
                        if (callback) {
                            callback(index);
                        }
                    }
                  }else {
                    if (ret&&ret.success) {
                        if (ret.status == 'OK') {
                            //  delete imageInfo.imgpath;
                            if(typeof self.delFn !='undefined'){
                              self.delRecord(0);
                            }
                                // self.delTheRecord(index);
                                api.toast({
                                    msg: '上传成功!',
                                    duration: 3000,
                                    location: 'bottom'
                                }); 
                                //console.log(callback);

                            if(api.frameName=='generationWriteFrm'){
                              api.hideProgress();
                              window.setTimeout(function() {
                                //刷新页面的list

                                api.closeWin({
                                  name: 'mainGenerationBillDetail'
                                });

                                api.closeWin();
                                api.execScript({
                                    name: 'generationBillListWin',
                                    frameName: 'generationBillListFrm',
                                    script: 'refreshData();'
                                });
                                api.execScript({
                                    name: 'generationBillListWin',
                                    frameName: 'generationBillListFinshFrm',
                                    script: 'refreshFrame();'
                                });
                                //此时最顶层win为工单详情
                              }, 1000);
                            }else if(api.frameName=='createRepairDetail'){
                              api.hideProgress();

                              if (callback) {
                                self.imageArray.splice(0,self.imageArray.length);
                                  callback(ret.img);
                              }
                            }else if(api.frameName=='createBillDetail'  || api.frameName=='stationPicDetail_frm'){
                              api.hideProgress();

                              if (callback) {
                                self.imageArray.splice(0,self.imageArray.length);
                                  callback(ret);
                              }
                            }else if(api.frameName=='checkBillRevertDetail'){
                              api.hideProgress();

                              if (callback) {
                                self.imageArray.splice(0,self.imageArray.length);
                                  callback(ret.img);
                              }
                            }else if(api.frameName=='ammeter-jiaowei_frm'){
                              api.hideProgress();
                              // alert("ret.img"+ret.img)
                              if (callback) {
                                self.imageArray.splice(0,self.imageArray.length);
                                  callback(ret.img);
                              }
                            }else {
                              api.hideProgress();
                              if (callback) {
                                  callback(true);
                              }
                            }
                            return true;
                        } else {
                        if(api.winName!='picOfflineUpload'){
                          api.execScript({
                          name : api.winName,
                          frameName : api.frameName,
                          script : 'saveLocal();'
                          });
                        }
                        if(err&&err.code==1){
                          api.toast({
                              msg: '图片上传超时,请重试！',
                              duration: 3000,
                              location: 'bottom'
                          });
                        }else {
                          api.toast({
                              msg: ret.data_info,
                              duration: 3000,
                              location: 'bottom'
                          });
                        }
                        api.hideProgress();
                            if (callback) {
                                callback(index);
                            }
                        }
                    } else {
                      console.log("ppppppppppppppppppppppppppppppppppppppppppppppppp******");
                      console.log(getObj(err));
                            if(err&&err.code==1){
                              api.toast({
                                  msg: '图片上传超时,请重试！',
                                  duration: 3000,
                                  location: 'bottom'
                              });
                            }else {
                              if(ret.data_info){
                                api.toast({
                                    msg: ret.data_info,
                                    duration: 3000,
                                    location: 'bottom'
                                });
                              }else if(ret.failedReason) {
                                api.toast({
                                    msg: ret.failedReason,
                                    duration: 3000,
                                    location: 'bottom'
                                });
                              }else {
                                api.toast({
                                    msg: ret,
                                    duration: 3000,
                                    location: 'bottom'
                                });
                              }
                            }

                            api.hideProgress();
                        if (callback) {
                            callback(index);
                        }
                    }
                  }
                }


            });
        }
         /*
          * 从服务器下载图片
          */
        this.download = function(callback) {
            if (this.downloadList.length) {
                api.showProgress({
                    title: '图片加载中...'
                });
                this.cacheImage(0, callback);
            } else {
                api.toast({
                    msg: '无相关图片资源'
                });
            }
        }

        /*
         * 从服务器缓存图片
         */
        this.cacheImage = function(index, callback) {
            var imageData = this.downloadList[index];
            var url = transform(imageData.url);
            console.log(url);
            var self = this;
            api.imageCache({
                url: url,
                thumbnail:false
            }, function(ret, err) {
              console.log(getObj(ret));
                callback(imageData, ret, err);
                if (index < downloadList.length - 1) {
                    self.cacheImage(index + 1, callback);
                } else {
                    api.hideProgress();
                    $('#downloadBtn').hide();
                }
            });
        }
    };
    return new image();
})([], []);
