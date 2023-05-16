(function(window) {
    var $aui = function() {
        var $toast = null;
        var $toastTimeTask = null;
        var $loading = null;
        var $progress = null;
        var $dialog = null;
    }
    /*
     * params{
     *  msg       显示内容
     *  duration  持续时间
     *  style     样式：成功，失败，信息
     * }
     */
    $aui.toast = function(params, callback) {
        var self = this;
        if (self.$toast) {
            window.clearTimeout(self.$toastTimeTask);
            self.$toast.remove();
            if (callback)
                callback();
        }
        var $toastDiv = $('<div>', {
            'class' : 'aui-toast'
        });
        $toastDiv.css('z-index', 99);
        var $toastTitel = $('<i>', {
            'class' : 'aui-iconfont'
        });
        var $toastContent = $('<div>', {
            'class' : 'aui-toast-content',
            'style' : 'color:#ffffff'
        });

        var duration = 2000;
        var style = 'aui-icon-check';
        if (params) {
            if (params.msg) {
                $toastContent.text(params.msg);
            }
            if (params.duration) {
                duration = params.duration;
            }
            if (params.style) {
                switch (params.style) {
                    case 'success' :
                        style = 'aui-icon-check';
                        break;
                    case 'info' :
                        style = 'aui-icon-info';
                        break;
                    case 'fail' :
                        style = 'aui-icon-close';
                        break;
                }
            }
        }
        $toastTitel.addClass(style);
        $toastDiv.append($toastTitel).append($toastContent).appendTo('body').show();
        self.$toast = $toastDiv;
        self.$toastTimeTask = window.setTimeout(function() {
            self.$toast.remove();
            if (callback)
                callback();
        }, duration);
    }

    $aui.loading = function(msg) {
        var $toastDiv = $('<div>', {
            'class' : 'aui-toast',
            'style' : 'display:none'
        });
        var $toastTitel = $('<i>', {
            'class' : 'aui-toast-loading'
        });
        var $toastContent = $('<div>', {
            'class' : 'aui-toast-content',
            'style' : 'color:#ffffff'
        });
        if (msg) {
            $toastContent.text(msg);
        } else {
            $toastContent.text('加载中...');
        }
        $toastDiv.append($toastTitel).append($toastContent).appendTo('body').show();
        this.$loading = $toastDiv;
    }

    $aui.hideLoading = function() {
        if (this.$loading) {
            this.$loading.remove();
        }
    }

    $aui.showProgress = function(progressNum, callback) {
        var self = this;
        if (progressNum) {
            self.$progress.width(progressNum + '%');
            if (progressNum == 100) {
                window.setTimeout(function() {
                    self.$progress.parents('#progressWrapper').remove();
                    self.$progress = null;
                    if (callback)
                        callback();
                }, 1000);
            }
        } else {
            var $wrapper = $('<div>', {
                'id' : 'progressWrapper',
                'style' : 'position: fixed;z-index: 99;top: 50%;left: 5%;text-align:center;width:90%;'
            })
            var $progressDiv = $('<div>', {
                'class' : 'aui-progress  aui-progress aui-clearfix'
            });
            var $progressBarDiv = $('<div>', {
                'class' : 'aui-progress-bar aui-progress-success'
            });
            $progressBarDiv.width(0);
            $wrapper.append($progressDiv.append($progressBarDiv)).appendTo('body');
            self.$progress = $progressBarDiv;
        }
    }
    /*
     * 对话框组件
     * params {
     *  title 头部信息
     *  text 内容
     *  btnlist 按钮组
     * }
     */
    $aui.dialog = function(params, callback) {
        var self = this;
        var $mask = $('<div>', {
            class : 'aui-mask'
        });
        var $wrapper = $('<div>', {
            class : 'aui-dialog'
        });
        var $headerDiv = $('<div>', {
            class : 'aui-dialog-header',
            text : '弹出消息'
        });
        var $bodyDiv = $('<div>', {
            class : 'aui-dialog-body aui-text-center'
        });
        var $footDiv = $('<div>', {
            class : 'aui-dialog-footer'
        });
        var btnlist = [{
            title : '取消',
            level : 'danger'
        }, {
            title : '确认',
            level : 'info'
        }];
        $headerDiv.css({
            'color' : '#000'
        });
        if (params) {
            if (params.title) {
                $headerDiv.text(params.title);
            }
            if (params.text) {
                if ( typeof (params.text) === 'string') {
                    $bodyDiv.text(params.text);
                } else if ( typeof (params.text) === 'object') {
                    $bodyDiv.html(params.text);
                    $bodyDiv.css({
                        padding : "15px 0 0"
                    });
                }
            }
            if (params.btnlist) {
                btnlist = params.btnlist;
            }
        }

        for (var i = 0; i < btnlist.length; i++) {
            var $btnDiv = $('<div>', {
                class : 'aui-dialog-btn',
                text : btnlist[i].title
            });
            $btnDiv.addClass('aui-text-' + btnlist[i].level).appendTo($footDiv);
        }
        $wrapper.append($headerDiv).append($bodyDiv).append($footDiv).appendTo($mask);
        $mask.appendTo('body');
        self.$dialog = $mask;

        //jQuery事件绑定
        $('.aui-dialog-btn').click(function() {
            var index = $(this).index();
            if (callback) {
                callback({
                    buttonIndex : index
                });
                self.hideDialog();
            }
            return false;
        });
        $mask.click(function() {
            self.hideDialog();
        });
    }

    $aui.hideDialog = function() {
        if (this.$dialog) {
            this.$dialog.remove();
        }
    }

    window.$aui = $aui;
})(window);
