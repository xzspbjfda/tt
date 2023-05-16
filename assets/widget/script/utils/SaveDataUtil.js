var saveDataUtil = (function(dataArray, downloadList) {
    var info = function() {
        this.dataArray = dataArray;
        this.downloadList = downloadList;
        this.uploadFn
        this.delFn
        this.saveFn

        this.getDataArray = function() {
            return this.dataArray;
        }

        this.setDataArray = function(array) {
            return this.dataArray = array;
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
            $.extend(this, opt);
        }
        
        this.setOption = function(opt){
            $.extend(this,opt);
        }

        this.add = function(method, callback) {
            showlog('执行imageUtil-add(添加图片)方法：');
            method = method || 'camera';
            api.getPicture({
                sourceType: method,
                encodingType: 'jpg',
                mediaValue: 'pic',
                quality: 50,
//              targetWidth:1280,
                saveToPhotoAlbum: false
            }, function(ret, err) {
             if (ret && ret.data && ret.data.length) {
                    var filePath = ret.data;
                    var imgPathArr = filePath.split("/");
                    var imgName = imgPathArr[imgPathArr.length - 1];
                    //删除数组最后一个元素
                    imgPathArr.pop();
                    var imgPath = imgPathArr.join("/");
                    var imageFilter = api.require("imageFilter");
                    imageFilter.compress({
                        img: ret.data,
                        quality: 0.4,
                        scale: 0.5,
                        save: {
                            //  album: false,
                            imgPath: imgPath,
                            imgName: imgName
                        }
                    });

                    if (callback) {
                        callback(ret, err);
                    }
                
                }
            });
            showlog('结束imageUtil-add(添加图片)方法：');
        }

        this.del = function(pid, callback) {
            for (var i = 0, size = this.dataArray.length; i < size; i++) {
                if (this.dataArray[i].id == pid) {
                    this.dataArray.splice(i, 1);
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
            var imageInfo = self.dataArray[index];
            self.delFn(imageInfo.id, function(ret, err) {
                if (index + 1 <= self.dataArray.length - 1) {
                    self.delRecord(index + 1, callback);
                } else {
                    if (callback) {
                        self.dataArray.length = 0;
                        callback(true);
                    }
                }
            });
        }
        
        this.delTheRecord = function(opts,callback){
            var self = this;
            var user = $api.getStorage('user');
            console.log('刪除成功！'+$api.getStorage('projectid')+'::'+opts.projectid+"   数据库id："+$api.getStorage('checksqlid'));
            
            if($api.getStorage('projectid')==opts.projectid){
            
            db_getCheckData(user.userid, opts.projectid, function(ret1, err) {
				if (ret1 && ret1 != "undefined") {
					//判断是否有未上传的图片
					if (ret1.length) {
			for(var i=0;i<ret1.length;i++){
           		 self.delFn(ret1[i].id,function(ret,err){
            	if(ret){
            	console.log('刪除成功！');
            	}else{
 				 console.error(err.msg);
				}
                if(callback){
                    callback(true);
                }
            });
            }
						
						console.log('插入数据：' + shu[0].checkstatus + ':' + ret1.length);
					} else {
						console.log('shuku数据：' + ret1);
					}
				} else {
					console.log('插入数据：' + err);
				}
			});
            
            
//          var  id=$api.getStorage('checksqlid');
//          var  statuslist=$api.getStorage('statuslist');
//          for(var i=0;i<statuslist.length;i++){
//          self.delFn(statuslist[i].id,function(ret,err){
//          	if(ret){
//          	console.log('刪除成功！');
//          	}else{
// 				 console.error(err.msg);
//				}
//              if(callback){
//                  callback(true);
//              }
//          });
//          }
            }
        }

        this.load = function() {

        }

        this.show = function(imagePath) {
            showlog('结束imageUtil-add方法：');
            showlog(' 打开图片路径:' + imagePath);
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
        }

        this.save = function(opt,callback) {
            if (this.dataArray && this.dataArray.length) {
                this.saveToLocal(opt,callback);
            } 
        }
        
        this.saveToLocal = function(opt,callback){
       		 var user = $api.getStorage('user');
            var self = this;
          
//          var arr=dataArray.toString();
//        	var arr = JSON.stringify(dataArray);
          var arr = $api.jsonToStr(this.dataArray);
            console.log('字符串：'+arr);
            var pram={
            projectid:opt.projectid,
            checkstr:arr,
            userid:user.userid
            }
         	this.delTheRecord(pram);
            console.log('状态：'+dataArray.length+'状态：'+dataArray[0].checkstatus+":"+opt.projectid);
            self.saveFn(pram,function(ret,err){
                if(ret){
//                  showlog('成功保存图片！');
                    console.log("保存数据成功");
//                  if(index + 1 <= self.dataArray.length - 1){
//                      self.saveToLocal(index+1,callback);
//                  }else{
//                      api.hideProgress();
//                      api.toast({
//	                        msg:'图片已保存本地'
//                      });
//                      if(callback){
//                          callback(index+1);
//                      }
//                  }
                }else{
                 console.log("保存数据失败"+err);
//                  api.hideProgress();
//                  api.toast({
//	                    msg:'图片保存失败，请重新保存'
//                  });
//                  if(callback)
//                  callback(index)
                }
            });
        }

        this.upload = function(callback) {
            var self = this;
            showlog('准备上传图片数量：' + self.dataArray.length);
            if (self.dataArray.length) {
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
        this.uploadServer = function(index, callback) {

            var self = this;
           var imageInfo = self.dataArray[index];
           var imgpath = imageInfo.imgpath;
           showlog('imgpath:'+imgpath);
         
            self.uploadFn(imageInfo, imgpath, function(ret, err) {
                if (ret) {
                    if (ret.status == 'OK') {
                     
          			  delete imageInfo.imgpath;
                        showlog('删除索引['+index+']');
                        if(typeof self.delFn !='undefined')
                            self.delTheRecord(index);
                        if (index + 1 <= self.dataArray.length - 1) {
                            api.showProgress({
                                title: '上传图片中...',
                                text: (index + 1) + '/' + self.dataArray.length
                            });
                            return self.uploadServer(index + 1, callback);
                        } else {
                            api.toast({
                                    msg: '上传成功!'
                                }); 
                            if (callback) {
                                api.hideProgress();
                                callback(index+1);
                            } 
                            return true;
                        }
                    } else {
                    if(api.winName!='picOfflineUpload'){
                    api.execScript({
                    name : api.winName,
                    frameName : api.frameName,
                    script : 'saveLocal();'
                });
                }
                        api.toast({
                                msg: ret.data_info
                            });
                        if (callback) {
                            api.hideProgress();
                            callback(index);
                        } 
                    }
                } else {
                    api.toast({
                            msg: '上传失败!'
                        });
                    if (callback) {
                        api.hideProgress();
                        callback(index);
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
            var self = this;
            api.imageCache({
                url: url
            }, function(ret, err) {
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
    return new info();
})([], []);
