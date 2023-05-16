//校验器
var formUtil = (function() {

    var Form = function() {//formObj 表单jquery对象，btnObj 提交按钮对象,submitFn 接口函数
        var self = this;
        //设置为提示最先发现的错误信息，后续错误不提示
        this.hasError = false;

        this.submitFn = null;
        this.formObj = $('form');
        this.btnObj = $('input[type=submit]');
        this.callback = null;
        this.rules = {
            //必填选项
            required : function(value, errorMsg, el) {
                if (value == '') {
                    if (!self.hasError) {
                        self.hasError = true;
                        return errorMsg;
                    }
                }
            },
        };
    };

    Form.prototype.init = function(opt) {
        var self = this;
        if (opt.formObj) {
            this.formObj = (opt.formObj instanceof jQuery == true) ? opt.formObj : $(opt.formObj);
        }
        if (opt.btnObj) {
            this.btnObj = (opt.btnObj instanceof jQuery == true) ? opt.btnObj : $(opt.btnObj);
        }
        if (opt.callback) {
            this.callback = opt.callback;
        }
        if (opt.submitFn) {
            this.submitFn = opt.submitFn;
        }
        self.setFormValidate(opt.rules || {});

        //提交前校验事件
        self.btnObj.on('click', function(event) {
            event.preventDefault();
            if (self.validate()) {
                self.submit();
            }
        });
    }

    Form.prototype.getHasError = function() {
        return this.hasError;
    }

    Form.prototype.setHasError = function(hasError) {
        this.hasError = hasError;
    }

    //设置参数
     Form.prototype.setQueryOptions = function(parpm) {
        this.parpm = parpm;
    }

    Form.prototype.setCallback = function(callback) {
        this.callback = callback;
    }

    Form.prototype.reset = function() {
        this.hasError = false;
    }
    Form.prototype.setFormValidate = function(rules) {
        var self = this;
        $.extend(self.rules, rules);
        //配置表单校验条件
        self.formObj.validate({
            type : self.rules
        });
    }

    Form.prototype.validate = function() {
        var self = this;
        api.showProgress({
            title : '处理中'
        });
        $('form').validate('submitValidate');
        api.hideProgress();
        if (!self.hasError) {
            return true;
        }
        self.reset();
        return false;
    }

    Form.prototype.submit = function() {
        var opts = {};
         var resultData;
        var self = this;
        if (!self.submitFn) {
            showlog('未指定上传接口');
            showToast('未指定上传接口');
        }
//		$("input[type='radio']:checked").
        //获取提交参数（包括隐藏参数）
//      var input = $('form').find('[name]:visible,input[type=hidden]');
        $('form').find("[name]:visible,input[type=hidden]").each(function() {
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

        });

        if("N"==opts['resulttype']){
        	if("资源配置"==opts['parent_name']){
        	opts['weight']=opts['weight']/2;
        	}else{
       		opts['weight']='0';
       		}
        }

        if(self.parpm!=null){
        if(self.parpm.list!=null){
        opts['list']=self.parpm.list;
        }

        if(self.parpm.repair!=null){
        opts['contract']=self.parpm.contract;
        opts['confimreason']= opts['fixRemark'];
        }
//       towerpicnum，roompicnum，powerpicnum，cellpicnum，distriboxpicnum，airpicnum，monitorpicnum
		if("1"==self.parpm.billtype){
        opts['towerpicnum']=self.parpm.towerpicnum;
        opts['roompicnum']=self.parpm.roompicnum;
        opts['powerpicnum']=self.parpm.powerpicnum;
        opts['cellpicnum']=self.parpm.cellpicnum;
        opts['distriboxpicnum']=self.parpm.distriboxpicnum;
        opts['airpicnum']=self.parpm.airpicnum;
        opts['monitorpicnum']=self.parpm.monitorpicnum;
		}
        }




        if("特别严重"==opts['hiddengrade']){
       opts['hiddengrade']='A';
        }else if("严重"==opts['hiddengrade']){
        opts['hiddengrade']='B';
        }else if("一般"==opts['hiddengrade']){
        opts['hiddengrade']='C';
        }

        if("1"==opts['unitname']){
        resultData='个';
        }else if("2"==opts['unitname']){
        resultData='V';
        }else if("3"==opts['unitname']){
        resultData='A';
        }else {
	 resultData='';
	}

        if("1"==opts['filltype']){
        opts['result']= opts['actualfill']
        }else if("2"==opts['filltype']){
          opts['result']= opts['dispalyname'] +opts['actualfill']+resultData;
        }else if("3"==opts['filltype']){
        	if("Y"==opts['isStander'] ){
        	 opts['result']="符合要求"
        	}else if("N"==opts['isStander'] ){
        	 opts['result']="不符合要求"
        	}else{
        	opts['result']="";
        	}
        }
        api.showProgress({
            title : '提交中...'
        });
        self.submitFn(opts, this.callback);
    }

    Form.prototype.checkTime = function(time1, time2) {
        var t1 = new Date(time1.replace(/-/g, "/"));
        var t2 = new Date(time2.replace(/-/g, "/"));
        if (t1 < t2) {
            return true;
        } else {
            return false;
        }
    }

    return new Form();
})();
