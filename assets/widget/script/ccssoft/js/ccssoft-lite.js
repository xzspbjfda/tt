/*
 *   中通服 移动前端框架 基于Agile-lite框架
 *   Version :   1.1.0。beta
 *   Author  :
 *
 */
 // json排序方法
 var colId;
 //对json进行降序排序函数
 var desc = function(x,y){
     return (x[colId] < y[colId]) ? 1 : -1
 }
 //对json进行升序排序函数
 var asc = function(x,y){
     return (x[colId] > y[colId]) ? 1 : -1
 }
 //以下函数排序属性并未写死，可直接拿去用自定义属性
function SortByProps(item1, item2, obj) {
    var props = [];
    if(obj){
        props.push(obj)
    }
    var cps = []; // 存储排序属性比较结果。
    // 如果未指定排序属性(即obj不存在)，则按照全属性升序排序。
    // 记录下两个排序项按照各个排序属性进行比较得到的结果
    var asc = true;
    if (props.length < 1) {
        for (var p in item1) {
            if (item1[p] > item2[p]) {
                cps.push(1);
                break; // 大于时跳出循环。
            } else if (item1[p] === item2[p]) {
                cps.push(0);
            } else {
                cps.push(-1);
                break; // 小于时跳出循环。
            }
        }
    }
    else {
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            for (var o in prop) {
                asc = prop[o] === "ascending";
                if (item1[o] > item2[o]) {
                    cps.push(asc ? 1 : -1);
                    break; // 大于时跳出循环。
                } else if (item1[o] === item2[o]) {
                    cps.push(0);
                } else {
                    cps.push(asc ? -1 : 1);
                    break; // 小于时跳出循环。
                }
            }
        }
    }

    // 根据各排序属性比较结果综合判断得出两个比较项的最终大小关系
    for (var j = 0; j < cps.length; j++) {
        if (cps[j] === 1 || cps[j] === -1) {
            return cps[j];
        }
    }
    return false;
}


var C = (function($) {
    var Ccssoft = function() {
        this.$ = $;
        this.options = {
            version : '1.1.0',
            showPageLoading : false,
            //ajax默认是否有loading界面
            readyEvent : 'ready',
            //宿主容器的准备事件，默认是document的ready事件
        };
    };

    /**
     * 注册Agile框架的各个部分，可扩充
     * @param {String} 控制器的唯一标识
     * @param {Object} 任意可操作的对象，建议面向对象方式返回的对象
     */
    Ccssoft.prototype.register = function(key, obj) {
        //if(this[key]) return false;
        this[key] = obj;
        if (obj.launch) {
            _launchMap[key] = obj.launch;
        }
    };
    var _doLaunch = function() {
        for (var k in _launchMap) {
            try {
                _launchMap[k]();
            } catch(e) {
                console.log(e);
            }
        }
        C.options.complete = true;
    };

    /**
     * 启动Agile
     * @param {Object} 要初始化的一些参数
     */
    Ccssoft.prototype.launch = function(opts) {
        if (A.options.complete == true)
            return;

        $.extend(this.options, opts);

        var _this = this;

        if (!this.options.readyEvent) {
            _doLaunch();
        } else if ($(document)[this.options.readyEvent]) {
            $(document)[this.options.readyEvent](_doLaunch);
        } else {
            $(document).on(this.options.readyEvent, _doLaunch);
        }
    };
    return new Ccssoft();
})(window.Zepto || jQuery);

(function($) {
    var _ext = {};

    /**
     * alert组件
     * @param title 标题
     * @param content 内容
     * @param callback 点击确定按钮后的回调
     */
    _ext.alert = function(title, content, callback) {
        if ( typeof (A) != "undefined") {
            A.alert(title, content, callback);
        } else {
            api.alert({
                title : title,
                msg : content
            }, function(ret, err) {
                callback(ret, err);
            });
        }
    };

    /**
     * confirm 组件
     * @param title 标题
     * @param content 内容
     * @param okCallback 确定按钮handler
     * @param cancelCallback 取消按钮handler
     */
    _ext.confirm = function(title, content, okCallback, cancelCallback) {
        //      if ( typeof (A) != "undefined") {
        //          A.confirm(title, content, okCallback, cancelCallback);
        //      } else {
        api.confirm({
            title : title,
            msg : content,
            buttons : ['取消', '确定']
        }, function(ret, err) {
            if (ret.buttonIndex == 1 && typeof (cancelCallback) != "undefined") {

                cancelCallback(ret, err);
            } else if (ret.buttonIndex == 2 && typeof (okCallback) != "undefined") {
                okCallback(ret, err);
            }
        });

        //    }

    };

    /**
     * loading组件
     * @param text 文本，默认为“加载中...”
     * @param callback 函数，当loading被人为关闭的时候的触发事件
     */
    _ext.showMask = function(text, callback) {
        if ( typeof (A) != "undefined") {
            A.showMask(text, callback);
        } else {
            api.showProgress({
                style : 'default',
                animationType : 'fade',
                title : '提示',
                text : text,
                modal : true
            });
        }
    };

    /**
     * 隐藏loading组件
     */
    _ext.hideMask = function(callback) {
        if ( typeof (A) != "undefined") {
            A.hideMask(callback);
        } else {
            api.hideProgress();
        }
    };

    for (var k in _ext) {
        C.register(k, _ext[k]);
    }

})(C.$);

//基础下拉列表
(function($) {

    var _start = 1;
    var _limit = 20;

    /**
     * 基础列表
     * @param {Object} opt
     */
    var ListView = function(opts) {
        var me = this;
        //基础参数
        var options = {
            showProgress : true,
            showErrorToast : true,
            id : '#main_article', //标签ID
            listDivId : "#listView",
            templateId : '#listView-template', //模板脚本的ID
            listName : 'list',
            fn : null,
            callback : null,
            pullup_label_release : '正在加载中...',
            pullup_label_finish : '已经全部加载完成',
            limit : _limit
        };

        me.isLoading = false;
        //是否正在加载数据中

        var loadDone = false;
        //是否加载完数据了
        //是否全部加载完了

        $.extend(options, opts);

        me.options = options;

        me.queryOptions = {
            start : _start,
            limit : options.limit
        };

        me.refreshComp = null;
        var refreshStep = 0;
        //当refresh初始化会进入此监听

        me.refreshComp = A.Refresh($(options.id));
        //监听下拉刷新事件，可以做一些逻辑操作，当data-scroll="pullup"时无效
        me.refreshComp.on('pulldown', function() {

            me._loadData(true);
            me.refreshComp.refresh();
            //当scroll区域有dom结构变化需刷新
        });

        var $scroller = $(options.id).children().first();
        me.$pullUpEl = $('<div id="ccssoft-pullup"><div class="ccssoft-pullup-label">' + options.pullup_label_release + '</div></div>').appendTo($scroller);
        me.$pullUpL = me.$pullUpEl.find('.ccssoft - pullup - label ');
        pullUpHeight = me.$pullUpEl.height();
        me.$pullUpEl.attr('class', '').hide();

        me.refreshComp.on("scroll", function() {
            if (refreshStep == 1 || me.loadDone) {
                return;
            }
            if (this.y < 0 && -this.y > -(this.maxScrollY - pullUpHeight)) {
                me.$pullUpL.html(me.options.pullup_label_release);
                me.$pullUpEl.attr('class', '').show();
                refreshStep = 1;
            }

        });

        me.refreshComp.on("scrollBottom", function() {

            if (me.loadDone) {
                return;
                //无数据了，则不需要加载
            }
            refreshStep = 0;
            me.$pullUpL.html(me.options.pullup_label_release);
            me.$pullUpEl.attr('class', '').show();

            me._loadData(false);

        });

    };

    /**
     * 设置查询参数的值
     * @param {Object} opts
     */
    ListView.prototype.setQueryOptions = function(opts) {
        $.extend(this.queryOptions, opts);
    }

    /**
     * 重新刷新列表
     */
    ListView.prototype.refresh = function() {
        var me = this;
        if (me.refreshComp == null) {
            window.setTimeout(function() {
                me.refresh();
            }, 200);
        } else {
            me._loadData(true);
        }

    }
    /**
     * 加载数据
     */
    ListView.prototype._loadData = function(restart) {

        var me = this;

        //正在加载中，不进行下去
        if (me.isLoading) {
            return;
        }

        if (restart) {
            me.queryOptions.start = 1;
            me.loadedCount = 0;
            me.loadDone = false;

        } else if (me.loadDone) {
            return;
        }

        me.isLoading = true;

        if (restart && me.options.showProgress) {
            C.showMask("加载中...");
        }
        me.options.fn(this.queryOptions, function(ret, status) {
            me.isLoading = false;
//			console.log('先加载：');
            if (restart && me.options.showProgress) {
                C.hideMask();
            }
            if (ret) {
                if (ret.success) {
                    var list = ret[me.options.listName];

                    if (list == null || list.length == 0 || list.length < me.queryOptions.limit) {
                        me.loadDone = true;
                        //  me.$pullUpEl.attr('class ','').hide();
                        me.$pullUpL.html(me.options.pullup_label_finish);
                        me.$pullUpEl.attr('class', '').hide();

                    } else {
                        me.queryOptions.start += me.queryOptions.limit;
                        me.$pullUpEl.attr('class', '').hide();
                    }

                    var content = $(me.options.listDivId);

                    if (list == null || list.length == 0) {
                        if (restart) {
                            content.innerHTML = "";
                        }
                        return;
                    } else {

                        var tpl = $(me.options.templateId).html();
                        var tempFn = doT.template(tpl);
                        if (restart) {
                            content.html(tempFn(list));
                        } else {
                            content.html(content.html() + tempFn(list));
                        }
                    }
                } else {

                    me.$pullUpEl.attr('class', '').hide();
                    me.$pullUpL.html(me.options.pullup_label_release);

                    if (restart && me.options.showErrorToast) {
                        showToast(ret.data_info);
                    }
                }
            } else {
                me.$pullUpEl.attr('class', '').hide();
                me.$pullUpL.html(me.options.pullup_label_release);

                if (restart && me.options.showErrorToast) {
                    showToast("服务异常，请重试");
                }
            }

            if (me.options.callback != null) {
                me.options.callback(ret, status);
            }
        });

    }

    C.register('ListView', ListView);

})(C.$);

//基于APICLOUD的下拉列表
(function($) {

    var _start = 1;
    var _limit = 20;

    /**
     * 基础列表
     * @param {Object} opt
     */
    var ApiListView = function(opts) {
        var me = this;
        //基础参数
        var options = {
            showProgress : true,
            showErrorToast : true,

            listDivId : "#listView",
            templateId : '#listView-template', //模板脚本的ID
            listName : 'list',
            fn : null,
            callback : null,
            pullup_label_release : '正在加载中...',
            checkList:null,
            pullup_label_finish : '已经全部加载完成',
            limit : _limit,
            isRefresh : true
        };

        me.loadCount = 0;

        me.isLoading = false;
        //是否正在加载数据中

        var loadDone = false;
        //是否加载完数据了
        //是否全部加载完了

        $.extend(options, opts);

        me.options = options;

        me.queryOptions = {
            start : _start,
            limit : options.limit
        };

        //      me._setRefreshHeaderInfo(true);
        me._setRefreshHeaderInfo(me.options.isRefresh);
        if (me.options.isRefresh) {
            $(window).scroll(function() {
              api.execScript({
                  name:'stationSearch_win',
                  frameName : 'stationSearch_frm',
                  script : 'searchHide();'
              });
                // 允许5像素的容差
                if ($(document).scrollTop() >= $(document).height() - $(window).height() - 5) {
                    me._loadData(false);
                }
            });
        }

    };

    /**
     * 设置头部是否显示
     */
    ApiListView.prototype._setRefreshHeaderInfo = function(visible) {
        var me = this;
        if (visible) {
            api.setRefreshHeaderInfo({
                visible : true,
                bgColor : '#f2f2f2',
                textColor : '#4d4d4d',
                textDown : '下拉刷新...',
                textUp : '松开刷新...',
                showTime : true
            }, function(ret, err) {
                if(me.options.beforeRefresh){
                    me.options.beforeRefresh(me,function(ret){
                        if(ret === undefined || ret === true){
                            me._loadData(true);
                        }
                    })
                }else{
                    me._loadData(true);
                }
            });
        } else {
            api.setRefreshHeaderInfo({
                visible : false,
            }, function(ret, err) {
            });
        }
    };

    /**
     * 设置查询参数的值
     * @param {Object} opts
     */
    ApiListView.prototype.setQueryOptions = function(opts) {
        $.extend(this.queryOptions, opts);
    }
    /**
     * 重新刷新列表
     */
    ApiListView.prototype.refresh = function() {
        var me = this;
        me._loadData(true);
    }
    /**
     * 加载数据
     */
    ApiListView.prototype._loadData = function(restart) {

        var me = this;
        var shu=null;


        //正在加载中，不进行下去
        if (me.isLoading) {
            return;
        }

        if (restart) {
         	console.log("到這");
            me.loadedCount = 0;
            me.queryOptions.start = 1;
            $('#listView .showBox').remove();
            me.loadDone = false;
        } else if (me.loadDone) {
            if (!$('#listView .showBox').size()&&(!window.$client || me.options.fn!=$client.getProjectNewList)) {
                $('#listView').append($('<li>已显示全部内容</li>').addClass('showBox'));
            }
            return;
        }

        me.isLoading = true;


        if (restart&&me.options.showProgress) {
            C.showMask("加载中...");

        }
        // wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        console.log('-----------------------------------------------------');
        console.log(getObj(me.queryOptions));
        // wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        me.options.fn(this.queryOptions, function(ret, status) {
            console.log('fsdfsdfawefcD');
            console.log(getObj(ret));
            console.log('areaIdArrayList:'+$api.getStorage('areaIdArrayList'))
            if(ret.areaIdArrayList3527){
                $api.setStorage('areaIdArrayList',ret.areaIdArrayList3527);
            }           
            console.log('areaIdArrayList:'+$api.getStorage('areaIdArrayList'))
			var finishList = new Array();
			var checkList = new Array();
			var nocheckList = new Array();
			var checkStr =	$api.getStorage('checkStr');
			var	statusList = eval('(' + checkStr + ')');
			console.log("保存數據：");
            me.isLoading = false;

			 if (me.options.showProgress) {
                C.hideMask();
            }

            if (restart) {
//          	me.isLoading = true;
                api.refreshHeaderLoadDone();
            }



            if (!ret) {

                if (me.options.showErrorToast) {
                    showToast("服务异常，请重试");
                }
                return;
            }

            if (!ret.success || ret.success === false) {
                if (me.options.showErrorToast) {
                    if(me.options.newSystem){
                        showToast(ret.msg);
                    }else{
                        showToast(ret.data_info);
                    }
                }
                return;
            }

            if(me.options.newSystem && me.options.vueProxy){
                var list = ret.data[me.options.listName || "list"];
                me.loadedCount = me.loadedCount || 0;
                me.loadedCount += list.length;
                if(me.loadedCount >= ret.data.totalCount){
                    me.loadDone = true;
                }
                me.queryOptions.start = (me.queryOptions.start || 0) + 1;
                me.queryOptions.limit = me.options.pageSize || 20;

                // console.log("【拦截了属于是】",me.queryOptions.start,me.queryOptions.limit,list.length,me.loadedCount)
                window.setTimeout(function() {
                    api.parseTapmode();
                    api.hideProgress();
                }, 300);
                if (me.options.callback != null) {
                    me.options.callback(ret, restart);
                }
                return;
            }

//			var arr={};
//			arr.checkarr=shu
            var list;
            if(me.options.newSystem){
                list = ret.data[me.options.listName || "list"];
            }else{
                list = ret[me.options.listName];
            }
            // console.log("响应",JSON.stringify(ret))
            // 代维调度顶部按钮统计数量start
/*            if(me.options.fn==$client.getGenerationList) {
              console.log(JSON.stringify(ret));
              var claimedToal=JSON.parse(ret.claimedToal);
              api.execScript({
                  name: 'generationBillListWin',
                  script: 'changetipnum('+ret.listUnclaimedZndw.length +',1)'
              });
              api.execScript({
                  name: 'generationBillListWin',
                  script: 'changetipnum('+ret.listClaimedList.length +',2)'
              });
              api.execScript({
                  name: 'generationBillListWin',
                  script: 'changetipnum('+claimedToal.listFinsh +',3)'
              });
              api.execScript({
                  name: 'generationBillListWin',
                  script: 'changetipnum('+claimedToal.listFile +',4)'
              });

            }*/
            // 代维调度顶部按钮统计数量end

            // wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            if(list&&list.length>0){
              console.log("【这里在打印结果集的第一条数据】",JSON.stringify(list[0]));
            }
            // wxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            var content = $(me.options.listDivId);


            if (list == null || list.length == 0 || list.length < me.queryOptions.limit) {
                me.loadDone = true;
            }

            if ((list == null || list.length == 0) && restart) {
                content.html("");
                $('body').addClass('active');
                return;
            } else {
                $('body').removeClass('active');
            }

            if (list == null || list.length == 0) {
                $('body').addClass('active');
            } else {
                $('body').removeClass('active');
            }

            if(me.options.fn==$client.getCheckProjectList&&list!=null&&list!=''){
            	for(var i=0;i<list.length;i++){
//          	console.log("zzzzzzzzzz:"+list[i].result_type);
            	if(list[i].result_type!="null"&&list[i].result_type!=null){
            		finishList.unshift(list[i]);
//          		console.log("么了");
            	}else{

            		if(statusList&&statusList.length>0){
            			for(var j=0;j<statusList.length;j++){
//          				console.log("列表数据id"+list[i].detail_id+"数据库id"+statusList[j].detailid);
            				if(list[i].detail_id==statusList[j].detailid){
            					if(statusList[j].checkstatus!=""&&statusList[j].checkstatus!=null){
//          					console.log("怎么了");
            					checkList.push(list[i]);
            					}else{
//
            					nocheckList.push(list[i]);
            					}
            				}
            			}

            		}else{
		            	nocheckList.push(list[i]);
            		}


            	}

            	}
           var data= nocheckList.concat(checkList).concat(finishList);

           	me.queryOptions.start += data.length;
			      console.log("状态："+list[0].result_type)
            var tpl = $(me.options.templateId).html();
            var tempFn = doT.template(tpl);

              var tempContent = tempFn(data);
            //   showlog("tempContent:" + tempContent);
              if (restart) {
                  content.html(tempContent);
              } else {
                  content.html(content.html() + tempContent);
              }

            }else if (me.options.fn==$client.getGenerationNum&&list!=null&&list!='') {
              var wgs;
      				var bdlat;
      				var bdlon;
      				var win_name = "mapHeader";
      				var frm_name = "mapDetail_frm";
      				var script = "startLocation('" + win_name + "','" + frm_name + "');";
      				api.execScript({
      					frameName : 'gps',
      					script : script
      				});

      				var lastLocation = $api.getStorage('LAST_GPS_LOCATION');

      				if (!lastLocation || !lastLocation.status || lastLocation.timestamp == 0 || lastLocation.lon == 0 || lastLocation.lat == 0) {
      					api.toast({
      				      msg:'获取当前位置失败'
      			    });
      				}else{
      				  wgs=GPS.wgs_tobd(lastLocation.lat,lastLocation.lon);
      				  bdlat= Number(wgs.lat).toFixed(6);
      				  bdlon= Number(wgs.lon).toFixed(6);
      				}

      				for(var i=0, len=list.length; i < len; i++) {
      					var bMap = api.require('bMap');
                (function(i) {

                  bMap.getDistance({
                    start: {
                        lon: bdlon,
                        lat: bdlat
                    },
                    end: {
                        lon: list[i].lon,
                        lat: list[i].lat
                    }
                  }, function(ret) {
                      if (ret.status) {
                        var km=ret.distance/1000;
                        var distance=km.toFixed(2);
                        list[i].Kmtance=distance;
                      }
                  });
                })(i);
              }

              setTimeout(function(){

                me.queryOptions.start += list.length;

                var tpl = $(me.options.templateId).html();
                var tempFn = doT.template(tpl);
                var tempContent = tempFn(list);

                if (restart) {
                    content.html(tempContent);
                } else {
                    content.html(content.html() + tempContent);
                }
              },400)

            }else if (me.options.fn==$client.getAllWorkList&&list!=null&&list!='') {
              var wgs;
      				var bdlat;
      				var bdlon;
      				var win_name = "mapHeader";
      				var frm_name = "mapDetail_frm";
      				var script = "startLocation('" + win_name + "','" + frm_name + "');";
      				api.execScript({
      					frameName : 'gps',
      					script : script
      				});

      				var lastLocation = $api.getStorage('LAST_GPS_LOCATION');

      				if (!lastLocation || !lastLocation.status || lastLocation.timestamp == 0 || lastLocation.lon == 0 || lastLocation.lat == 0) {
      					api.toast({
      				      msg:'获取当前位置失败'
      			    });
      				}else{
      				  wgs=GPS.wgs_tobd(lastLocation.lat,lastLocation.lon);
      				  bdlat= Number(wgs.lat).toFixed(6);
      				  bdlon= Number(wgs.lon).toFixed(6);
      				}

      				for(var i=0, len=list.length; i < len; i++) {
      					var bMap = api.require('bMap');
                (function(i) {
                  var stationMessageVal=JSON.parse(list[i].stationMessage);
                  bMap.getDistance({
                    start: {
                        lon: bdlon,
                        lat: bdlat
                    },
                    end: {
                        lon: stationMessageVal.st_lon,
                        lat: stationMessageVal.st_lat
                    }
                  }, function(ret) {
                      if (ret.status) {
                        var distance;
                        console.log("[[[[[[[[[[[[[]]]]]]]]]]]]]");
                        console.log(stationMessageVal.st_lon);
                        if(stationMessageVal.st_lon&&stationMessageVal.st_lat){
                          var km=ret.distance/1000;
                          distance=km.toFixed(2);
                          console.log("88888888888888888888888888888888888888888888888888888888888888");
                          console.log(distance);
                        }else {
                          distance=9999999;
                        }
                        list[i].Kmtance=Number(distance);
                      }
                  });
                })(i);
              }

              setTimeout(function(){
                colId="Kmtance";
        				list.sort(asc);
                // console.log(JSON.stringify(list));
                me.queryOptions.start += list.length;
                console.log(JSON.stringify(list[0]));

                var tpl = $(me.options.templateId).html();
                var tempFn = doT.template(tpl);
                var tempContent = tempFn(list);

                if (restart) {
                    content.html(tempContent);
                } else {
                    content.html(content.html() + tempContent);
                }
              },400)

            }else if (me.options.fn==$client.getStationSimpleList&&list!=null&&list!='') {
              var wgs;
      				var bdlat;
      				var bdlon;
      				var win_name = "mapHeader";
      				var frm_name = "mapDetail_frm";
      				var script = "startLocation('" + win_name + "','" + frm_name + "');";
      				api.execScript({
      					frameName : 'gps',
      					script : script
      				});

      				var lastLocation = $api.getStorage('LAST_GPS_LOCATION');

      				if (!lastLocation || !lastLocation.status || lastLocation.timestamp == 0 || lastLocation.lon == 0 || lastLocation.lat == 0) {
      					api.toast({
      				      msg:'获取当前位置失败'
      			    });
      				}else{
      				  wgs=GPS.wgs_tobd(lastLocation.lat,lastLocation.lon);
      				  bdlat= Number(wgs.lat).toFixed(6);
      				  bdlon= Number(wgs.lon).toFixed(6);
      				}

      				for(var i=0, len=list.length; i < len; i++) {
      					var bMap = api.require('bMap');
                (function(i) {

                  bMap.getDistance({
                    start: {
                        lon: bdlon,
                        lat: bdlat
                    },
                    end: {
                        lon: list[i].st_lon,
                        lat: list[i].st_lat
                    }
                  }, function(ret) {
                      if (ret.status) {
                        var distance;
                        console.log("[[[[[[[[[[[[[]]]]]]]]]]]]]");
                        console.log(list[i].st_lon);
                        if(list[i].st_lon&&list[i].st_lat){
                          var km=ret.distance/1000;
                          distance=km.toFixed(2);
                        }else {
                          distance=9999999;
                        }
                        list[i].Kmtance=Number(distance);
                      }
                  });
                })(i);
              }

              setTimeout(function(){
                // console.log(JSON.stringify(list));
                // colId="Kmtance";
                colId="distance";
        				list.sort(asc);
                // console.log(JSON.stringify(list));
                me.queryOptions.start += list.length;

                var tpl = $(me.options.templateId).html();
                var tempFn = doT.template(tpl);
                var tempContent = tempFn(list);

                if (restart) {
                    content.html(tempContent);
                } else {
                    content.html(content.html() + tempContent);
                }
              },400)

            }else if (me.options.fn==$client.getUnfinishTaskList&&list!=null&&list!='') {
              me.queryOptions.start += list.length;
              var tpl = $(me.options.templateId).html();
              var tempFn = doT.template(tpl);
              colId="orderby";
              if(me.options.noSort !== false){
                  list.sort(asc);
              }


              var db = api.require('db');
              var LXdata=[];
              db.selectSql({
                  name: 'xunjian',
                  sql: 'SELECT * FROM taskInfoList  WHERE  taskstate = 1 OR taskstate = 2'
              }, function(ret, err) {
                  if (ret.status) {
                      LXdata=ret.data;
                      console.log("aaaaaaaaaaaaaaaaaa");
                      console.log(JSON.stringify(LXdata));
                  }
              });


              setTimeout(function(){
                if(LXdata.length>0){
                  for (var i = 0; i < LXdata.length; i++) {
                    for (var j = 0; j < list.length; j++) {
                      if(list[j].taskid==LXdata[i].taskid){
                          list[j].online='true';
                      }
                    }
                  }

                }

                var tempContent = tempFn(list);
                console.log("bbbbbbbbbbbbbbbbbbbbbb");
                console.log(JSON.stringify(list));

                if (restart) {
                    content.html(tempContent);
                } else {
                    content.html(content.html() + tempContent);
                }
              },1000);
            }else if (me.options.fn==$client.getUnstartNewTaskList&&list!=null&&list!='') {
              me.queryOptions.start += list.length;
              var tpl = $(me.options.templateId).html();
              var tempFn = doT.template(tpl);
              colId="orderby";
              list.sort(asc);
              var tempContent = tempFn(list);
              console.log("cccccccccccccccccccccccc");
              console.log(JSON.stringify(list));

              if (restart) {
                  content.html(tempContent);
              } else {
                  content.html(content.html() + tempContent);
              }
            }else if (me.options.fn==$client.getFinishNewTaskList&&list!=null&&list!='') {
              me.queryOptions.start += list.length;
              var tpl = $(me.options.templateId).html();
              var tempFn = doT.template(tpl);
              colId="orderby";
              //list.sort(asc);
              var tempContent = tempFn(list);
              console.log("dddddddddddddddddd");
              console.log(JSON.stringify(list));

              if (restart) {
                  content.html(tempContent);
              } else {
                  content.html(content.html() + tempContent);
              }
            }else if ((me.options.fn==$client.getGenerationSite&&list!=null&&list!='')||
          (me.options.fn==$client.getGenerationList&&list!=null&&list!='')||
        (me.options.fn==$client.getGenerationFinshList&&list!=null&&list!='')||
      (me.options.fn==$client.getGenerationListFinished&&list!=null&&list!='')) {
              me.queryOptions.start += list.length;
              var tpl = $(me.options.templateId).html();
              var tempFn = doT.template(tpl);

              if(me.options.noSort !== false){
                  list.sort(function (a, b) {
                      return SortByProps(a, b, { "prioritylevel": "ascending", "work_time_limit": "ascending" });
                  });
              }


              var tempContent = tempFn(list);
              console.log("eeeeeeeeeeeeeeee");
              console.log(JSON.stringify(list));
              /*
              if(me.options.fn==$client.getGenerationList) {

              }else if (me.options.fn==$client.getGenerationFinshList) {

              }else if (me.options.fn==$client.getGenerationListFinished) {

              }
              */
              if (restart) {
                  content.html(tempContent);
              } else {
                  content.html(content.html() + tempContent);
              }
            }else{

              me.queryOptions.start += list.length;
  			      console.log("状态~~~：")
              var tpl = $(me.options.templateId).html();
              var tempFn = doT.template(tpl);
              var tempContent = tempFn(list);
              //   showlog("tempContent:" + tempContent);
              if (restart) {
                  content.html(tempContent);
              } else {
                  content.html(content.html() + tempContent);
              }
            }




            window.setTimeout(function() {
                api.parseTapmode();
                api.hideProgress();
            }, 300);

            if (me.options.callback != null) {
                me.options.callback(ret, status);
            }
        });

    }

    C.register('ApiListView', ApiListView);
})(C.$);
