//该js主要提供相关组件的js代码

//查询弹出框组件(popup-query)

var popup_query = popup_query || {
    target : null,
    //遮罩层
    shadeWrapper : $('#shadeWrapper'),
    //查询列表
    queryListBox : $('#queryListBox'),
    //包裹层
    wrapper : $('#popupWrapper'),
    // 按钮
    button : $('#popup_btn'),
    //显示和隐藏弹框
    showWin : function(params) {
        var target = params.target;
        var optsList = params.optsList;
        if (optsList != undefined) {
            $('#opts').empty();
            for (var i in optsList) {
                var article = $('article', {
                    'data-type' : optsList[i].type
                });
                if (optsList[i].title != undefined) {
                    var dt = $('dt', {
                        text : optsList[i].title
                    }).appendTo(article);
                }
                if (optsList[i].type == 'radio') {
                    if (optsList[i].list != undefined && optsList[i].list.length != 0) {
                        //组装选项dd
                        var opts = optsList[i].list;
                        for (var index in opts) {
                            var dd = $('dd', {
                                'id' : 'item-' + index,
                                'class' : 'js_star_h'
                            });
                            if (index == 0 && (opts[index].key == '全部' || opts[index].key == '不限')) {
                                dd.addClass('js_star_all');
                            }
                            dd.text(opts[index].key).data('value', opts[index].value);
                            article.append(dd);
                        }
                        article.find('dd:first').addClass('current');
                    }
                } else {
                    var input = $('input', {
                        'id' : opts[index].id,
                        type : 'text'
                    });
                }
                $('#opts').append(article);
            }
        }
        this.wrapper.show();
        this.target = target;
    },
    showPopup : function() {
        this.wrapper.show();
    },
    hidePopup : function() {
        api.setFrameAttr({
            name : api.frameName,
            hidden : true
        });
    },
    /**
     * 初始化查询列表
     * @param {Object} params
     */
    init : function(params) {
        if ( typeof (params) != 'undefined') {
            if ( typeof (params.btnText) != 'undefined') {
                this.button.text(params.btnText);
            } else {
                this.button.text('查询');
            }
            if ( typeof (params.btnClick) != 'undefined') {
                this.button.get(0).onclick = function() {
                    $('#queryListBox').find('.current').each(function() {
                        $(this).parent().attr('data-value', $(this).data('value'));
                    });
                    params.btnClick();
                }
            }
        }

        //查询框选项点击事件
        this.queryListBox.find('dl>div').each(function() {
            var type = $(this).data('type');
            if (type == 'radio') {
                $(this).find('dd').click(function() {
                    $(this).addClass('current').siblings('.current').removeClass('current');
                    var htmlText=$(this).html();
                    if(htmlText.indexOf("自定义")!=-1){
                        $('.zdyTime').show(0);
                    }else {
                        $('.zdyTime').hide(0);
                    }
                });
            } else if (type == 'checkbox') {
                $(this).find('dd').click(function() {
                    if ($(this).text().trim() != '不限' && $(this).text().trim() != '全部') {
                        $(this).siblings('dd:first').removeClass('current');
                    } else {
                        $(this).siblings('dd.current').removeClass('current');
                    }
                    $(this).toggleClass('current');
                });
            }
        });

        //清空选项内容
        $('#options .close').click(function() {
            var $input = $(this).siblings('input');
            $input.val('');
            if ($input.attr('id') == 'unit') {
                $input.attr('data-unitId', '');
            }
            $(this).parent().removeClass('active');
            return false;
        });

        //隐藏查询框
        $('#shadeWrapper').click(function() {
            api.setFrameAttr({
                name : api.frameName,
                hidden : true
            });
			api.closeFrame({
	            name: 'popup_query_frm'
            });
        });
    },

    serializeAll : function() {
        var opts = {};
        $('dl>div[id]:visible').each(function() {
            var type = $(this).attr('data-type');
            var value = '';
            var id = null;
            switch(type) {
                case 'text':
                    var inputList = $(this).find('input');
//                          alert("inputList:"+inputList.length);
                    for (var i = 0, size = inputList.length; i < size; i++) {
                        value = $(inputList[i]).val();
                        id = $(inputList[i]).attr("id");
                        if (id != null && value != null) {
                            opts[id] = value;
                        }
                    }
                    break;
                 case 'select':
                    var inputList = $(this).find("option:selected");
//                          alert("inputList:"+inputList.length);
                    for (var i = 0, size = inputList.length; i < size; i++) {
                        value = $(inputList[i]).val();
                        id = $(inputList[i]).attr("id");
                        if (id != null && value != null) {
                            opts[id] = value;
                        }
                    }
                    break;
                case 'radio' :
                    value = $(this).find('dd.current').attr('data-value');
                    id = $(this).attr('id');
                    opts[id] = value;
                    break;
                case 'checkbox' :
                    value = "";
                    $(this).find('dd.current').each(function(index, element) {
                        value += "'" + $(this).attr('data-value') + "',";
                    });
                    if (value.trim() == "'',") {
                        value = '';
                    } else {
                        value = value.substr(0, value.length - 1);
                    }
                    id = $(this).attr('id');
                    opts[id] = value;
                    break;
            }

        });
        return opts;
    },

    serialize : function() {
        var opts = {};
        $('dl>div[id]:visible').each(function() {
            var type = $(this).attr('data-type');
            var value = '';
            var id = null;
            switch(type) {
                case 'text':
                    var input = $(this).find('input');
                    if (input.attr('id') === 'unit') {
                        value = input.attr('data-unitId');
                        $(this).find('input[type=hidden]').each(function() {
                            opts[$(this).attr('id')] = $(this).val();
                        });
                    } else {
                        value = $(this).find('input').val();
                    }
                    id = $(this).find('input').attr('id');
                    break;
				 case 'select':
                    var input = $(this).find('option:selected');
                     value = $(this).find('option:selected').val();
                    id = $(this).find('select').attr('id');
                    break;
                case 'radio' :
                    value = $(this).find('dd.current').attr('data-value');
                    id = $(this).attr('id');
                    break;
                case 'checkbox' :
                    value = "";
                    $(this).find('dd.current').each(function(index, element) {
                        value += "'" + $(this).attr('data-value') + "',";
                    });
                    if (value.trim() == "'',") {
                        value = '';
                    } else {
                        value = value.substr(0, value.length - 1);
                    }
                    id = $(this).attr('id');
                    break;
            }
            if (id != null && value != null) {
                opts[id] = value;
            }
        });
        return opts;
    },
    /**
     * 添加文本框
     * @param {Object} config
     */
    addTextInput : function(config) {
        var article = $('article', {
            'type' : config.type
        });
        $('dt', {
            text : config.title
        }).appendTo(article);
        var dd = $('dd', {
            'class' : 'js_price_h'
        }).appendTo(article);
        $('input', {
            'type' : config.type,
            'id' : config.id
        }).appendTo(dd);
        $('#options').append(article);
    },
    /**
     * 添加选项框
     * @param {Object} config
     */
    addOptions : function(config) {
        var article = $('article', {
            'type' : config.type
        });
        $('dt', {
            text : config.title
        }).appendTo(article);
        var opts = config.opts;
        for (var i in opts) {
            var dd = $('dd', {
                'class' : 'js_price_h',
                text : opts[i].key,
                'data-value' : opts[i].value
            }).appendTo(article);
        }
        article.find('dd:first').addClass('current');
        $('#options').append(article);
    },
    /**
     * 添加按钮
     * @param {Object} config
     */
    addBtn : function(config) {
        var div = $('div', {
            'class' : 'mt10'
        });
        $('button', {
            'id' : 'popup_btn',
            'class' : 'g_btn_s js_price_star_filter_ok',
            text : config.text
        }).appendTo(div);
        $('#options').append(div);
    }
};
