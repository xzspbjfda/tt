var popup = (function() {
    var u = function() {
    };

    u.prototype.opts = {
        name : api.winName,
        frameName : api.frameName,
        cancle : '取消',
        
    }

    u.prototype.popup_select = function(opts) {
        $.extend(this.opts, opts);
        var optStr =$api.jsonToStr(this.opts);
        api.pageParam.opt = optStr;
//      $api.setStorage('cbTarget', cbTarget);
        api.openFrame({
            name : 'popup_select_frm',
            url : '../../dialog/popup_select.html',
            pagePara : api.pageParam,
            bounces : false
        });
    }

    return u;
})();
