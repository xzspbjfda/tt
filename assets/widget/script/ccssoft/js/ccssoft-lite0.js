/*
 *   中通服 移动前端框架 基于Agile-lite框架
 *   Version :   1.1.0。beta
 *   Author  :
 *
 */
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


//基于APICLOUD的下拉列表
(function($) {

    var _page = 1;
    var _rows = 20;

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
            rows : _rows,
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
            page : _page,
            rows : options.rows,
            userName:options.userName
        };

        //      me._setRefreshHeaderInfo(true);
        me._setRefreshHeaderInfo(me.options.isRefresh);
        if (me.options.isRefresh) {
            $(window).scroll(function() {
                if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
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
                me._loadData(true);
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
            me.queryOptions.page = 1;
            me.loadDone = false;

        } else if (me.loadDone) {
            if (!$('#listView .showBox').size()&&me.options.fn!=$client.getProjectNewList) {
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
          console.log(getObj(ret));
    			console.log("保存數據：");
            me.isLoading = false;

			    if (me.options.showProgress) {
              C.hideMask();
          }

          if (restart) {
              api.refreshHeaderLoadDone();
          }

          if (!ret) {
              if (me.options.showErrorToast) {
                  showToast("服务异常，请重试");
              }
              return;
          }

          // if (!ret.success || ret.success === false) {
          //     if (me.options.showErrorToast) {
          //         showToast(ret.data_info);
          //     }
          //
          //     return;
          // }

            var list = ret[me.options.listName];
            console.log(me.options.listName);
            console.log("集合："+list);
            var content = $(me.options.listDivId);
            if (list == null || list.length == 0 || list.length < me.queryOptions.rows) {
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

            me.queryOptions.page += list.length;
            console.log("状态~~~：")
            var tpl = $(me.options.templateId).html();
            var tempFn = doT.template(tpl);
            var tempContent = tempFn(list);
            console.log(JSON.stringify(list));
            //   showlog("tempContent:" + tempContent);
            if (restart) {
                content.html(tempContent);
            } else {
                content.html(content.html() + tempContent);
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
