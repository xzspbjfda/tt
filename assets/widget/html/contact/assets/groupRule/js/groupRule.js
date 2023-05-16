(function(root,factory){
    factory(root.jQuery);
})(window,function($){
    var __DEF__ = {
        title : "中国铁塔集团",
        titleIcon : "&#x3104;",
        spreadRoot: true,
        effect:200,
        data : []
    };
    var __PROTOTYPE__ = {
        _init : function(){
            this.addClass("auth-list");
            this.code = '<li>'+
                        '<p class="authitem listClick auth1 pr" data-id="1"><span>'+this.title+'</span><i class="iconfont icon-right-down ">&#xe62b;</i></p>'+
                        '<ul class="'+(this.spreadRoot?"":"hide")+'">';
            this.code+= this._render();
            this.code+='</ul></li>';
            this.html(this.code);
        },
        _render : function(){
            var code = "";
            $.each(this.data,function(i,data){
                var _data = data;
                code+='<li class="auth-li" data-id="'+data.userid+'">'+
                    '<p class="authitem listClick auth2 pr">'+
                        '<span class="btn-toggle">'+
                            data.username+
                        '</span>'+
                        '<i class="iconfont icon-right-down icon-up">&#xe62b;</i>'+
                    '</p>'+
                    '<ul class="'+(data.spread?"":"hide")+'">';
                $.each(data.childs,function(j,data){
                    code+='<li>'+
                        '<p class="authitem  auth3 pr" data-id="'+data.userid+'" onclick="seeDetail(this)">'+
                            '<span class="btn-toggle">'+
                                '<span>'+
                                    '<i class="iconfont icon-checkbox">&#xe64d;</i>'+
                                '</span>'+
                                '<span class="username">'+
                                data.username+
                                '</span>'+
                                data.mobilephone+
                            '</span>'+
                            '<i class="iconfont right">&#xe62c;</i>'+
                        '</p></li>'
                    //     +'<ul class="'+(data.spread?"":"hide")+'">';
                    // $.each(data.childs,function(i,data){
                    //     code+='<li>'+
                    //     '<p class="authitem auth4 pr" data-id="'+data.userid+'">'+
                    //         '<span class="btn-toggle">'+
                    //             '<span>'+
                    //                 '<i class="iconfont icon-checkbox" mhref="'+data.userid+'" phref="'+_data.userid+'">&#xe64d;</i>'+
                    //             '</span>'+
                    //             data.username+
                    //         '</span>'+
                    //         '<i class="iconfont icon-right-down icon-up">&#xe62b;</i>'+
                    //     '</p>';
                    //
                    // });
                });
                code+='</ul></li>';
            });
            return code;
        },
        _handle : function(){
           var $this = this;
           var effect = this.effect;
           this.find(".listClick").on('click',function(){
                $(this).find(".icon-right-down").toggleClass("icon-close");
                $(this).next().slideToggle(effect);
           });
          //  this.find(".btn-toggle").on('click',function(){
          //       var $chbox = $(this).find(".icon-checkbox");
          //       if(!$this.bubble){
          //           var isChecked = $chbox.toggleClass("checked").hasClass("checked");
          //           $chbox.html(isChecked?"&#x3127;":"&#xe64d;");
          //           if(isChecked){
          //               $this.find("[phref='"+$chbox.attr('mhref')+"']").addClass('checked').html("&#x3127;");
          //           }else{
          //               $this.find("[phref='"+$chbox.attr('mhref')+"']").removeClass('checked').html("&#xe64d;");
          //           }
          //       }
          //       var $pch = $this.find("[mhref='"+$chbox.attr('phref')+"']");
          //       var $siblings = $this.find("[phref='"+$chbox.attr('phref')+"']");
          //       var sum = $siblings.size();
          //       var curr = $siblings.filter(".checked").size();
          //       if(sum==curr){
          //           $pch.addClass("checked");
          //       }else if(curr==0){
          //           $pch.removeClass("checked");
          //       }
          //       $pch.html(sum==curr?"&#x3127;":curr==0?"&#xe64d;":"&#x3138;");
          //       $this.bubble = true;
          //       $pch.trigger('click');
          //       window.setTimeout(function(){
          //           $this.bubble = false;
          //       },200);
          //  });
        }
    };
    $.fn.groupRule = function(options){
        this.extend(__DEF__);
        this.extend(options);
        this.extend(__PROTOTYPE__);
        this._init();
        this._handle();
    }
});
