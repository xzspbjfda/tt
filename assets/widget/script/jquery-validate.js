( function(factory) {
        if ( typeof define === 'function' && define.amd) {
            // AMD
            define(['jquery'], factory);
        } else if ( typeof exports === 'object') {
            // CommonJS
            factory(require('jquery'));
        } else {
            // Browser globals
            factory(jQuery, window, document);
        }
    }(function($, window, document, undefined) {

        /*************************策略对象*****************************/

        var RULES = {
            required : function(value, errorMsg) {
                //不能为空
                if (!value.length) {
                    return errorMsg;
                }
            },
            minLength : function(value, length, errorMsg) {
                //大于
                if (value.length < length) {
                    return errorMsg;
                }
            },
            maxLength : function(value, length, errorMsg) {
                //小于
                if (value.length < length) {
                    return errorMsg;
                }
            },
            isMobile : function(value, errorMsg) {
                //是否为手机号码
                if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
                    return errorMsg;
                }
            },

            isEmail : function(value, errorMsg) {
                //是否为邮箱
                if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(value)) {
                    return errorMsg;
                }
            },
            between : function(value, range, errorMsg) {

                //大于小于
                var min = parseInt(range.split('-')[0]);
                var max = parseInt(range.split('-')[1]);
                if (value.length < min || value.length > max) {
                    return errorMsg;
                }
            },
            onlyEn : function(value, errorMsg) {
                //纯英文
                if (!/^[A-Za-z]+$/.test(value)) {

                }
            },
            onlyCh : function(value, errorMsg) {
                //纯中文
                if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
                    return errorMsg;
                }
            },
            onlyInt : function(value, errorMsg) {
                //纯整数
                if (/^[0-9]*$/.test(value)) {
                    return errorMsg;
                }
            },
            onlyNum : function(value, errorMsg) {
                //数字包含小数
                if (!/^[0-9]+([.][0-9]+){0,1}$/.test(value)) {
                    return errorMsg;
                }
            },
            notInt : function(value, errorMsg) {
                //非整数
                if (!/^[0-9]*$/.test(value)) {
                    return errorMsg;
                }
            },
            isChecked : function(value, errorMsg, el) {
                var i = 0;
                var $collection = $(el).find('input:checked');
                if (!$collection.length) {
                    return errorMsg;
                }
            },
            isNickname : function(value, errorMsg, el) {
                if (!/^[A-Za-z0-9_\-\u4e00-\u9fa5]{2,20}$/i.test(value)) {
                    return errorMsg;
                }
            }
        };

        /*************************Validator类*****************************/

        var setting = {
            type : null,
            onBlur : null,
            onFocus : null,
            onChange : null,
            onKeyup : null,
            successTip : true
        };

        var Validator = function() {
            this.cache = [];
            //          this.hasError = false;
        };

        Validator.prototype.add = function(dom, rules) {
            var self = this;
            for (var i = 0, rule; rule = rules[i++]; ) {( function(rule) {
                        var strategyAry = rule.strategy.split(':');
                        var errorMsg = rule.errorMsg;
                        self.cache.push(function() {
                            var strategy = strategyAry.shift();
                            // 前删匹配方式并赋值
                            strategyAry.unshift(dom.value);
                            // 前插value值
                            strategyAry.push(errorMsg);
                            // 后插出错提示
                            strategyAry.push(dom);
                            // 后插dom
                            if (!RULES[strategy]) {
                                $.error('没有' + strategy + '规则，请检查命名或自行定义');
                            }
                            return {
                                errorMsg : RULES[strategy].apply(dom, strategyAry),
                                el : dom
                            };
                        });
                    }(rule));
            }
        };

        Validator.prototype.start = function() {
            var result;
            var self = this;
            for (var i = 0, validatorFunc; validatorFunc = this.cache[i++]; ) {
                result = validatorFunc();
                if (setting.successTip && $(result.el).attr('data-status') === '1') {
                    new Validator().showMsg($(result.el), '', 1);
                }
                if (result.errorMsg) {
                    return result;
                }

            }
            return true;
        };

        Validator.prototype.showMsg = function(target, msg, status, callback) {
            //status
            // 0 : tip
            // 1 : success
            // 2 : error
            //      var _current = status ? (status > 1 ? 'error' : 'success') : 'tip';
            //      var $context = target.parent();
            //      var $msg = $context.find('.valid_message');
            //      var _other = target.attr('data-type') || '';
            //      $msg.remove();
            //      $context.removeClass('success tip error').addClass(_current+' '+_other).append('<span class="valid_message">' + msg + '</span>');
            if (msg != null && msg.length > 0) {
                api.toast({
                    msg : msg,
                    location : 'bottom'
                });
                //              this.hasError = false;
            }
        };

        var plugin = {
            init : function(options) {
                var $form = this;
                var $body = $('body');
                var $required = $form.find('.required');
                setting = $.extend(setting, options);

                if (setting.type) {
                    $.extend(RULES, setting.type);
                }

                var validator = new Validator();

//              $form.on({
//                  focus : function(event) {
//                      var $this = $(this);
//                      var _tipMsg = $this.attr('data-tip') || '';
//                      var _status = $this.attr('data-status');
//                      if (_status === undefined || !parseInt(_status)) {
//                          validator.showMsg($this, _tipMsg);
//                      }
//                      setting.onFocus ? setting.onFocus.call($this, arguments) : '';
//                  },
//                  blur : function(event) {
//                      var $this = $(this);
//                      var dataValid = $this.attr('data-valid');
//                      var validLen = dataValid.split('||');
//                      var errCollection = $this.attr('data-error');
//                      var errMsgAry = errCollection.split("||");
//                      var strategyAry, strategy, errMsg;
//                      for (var i = 0; i < validLen.length; i++) {
//                          strategyAry = validLen[i].split(':');
//                          strategy = strategyAry.shift();
//                          strategyAry.unshift(this.value);
//                          strategyAry.push(errMsgAry[i]);
//                          strategyAry.push(this);
//                          errMsg = RULES[strategy].apply(this, strategyAry);
//                          if (errMsg) {
//                              $this.attr('data-status', 0);
//                              validator.showMsg($this, errMsg, 2);
//                              break;
//                          }
//                      }
//
//                      if (!errMsg) {
//                          $this.attr('data-status', 1);
//                          setting.successTip ? validator.showMsg($this, '', 1) : $this.parent().find('.valid_message').remove();
//                      }
//
//                      $this.attr('data-preValue', this.value);
//
//                      setting.onBlur ? setting.onBlur.call($this, arguments, validator.showMsg) : '';
//                  },
//                  change : function(event) {
//                      var $this = $(this);
//                      setting.onChange ? setting.onChange.call($this, arguments) : '';
//                  },
//                  keyup : function(event) {
//                      var $this = $(this);
//                      setting.onKeyup ? setting.onKeyup.call($this, arguments) : '';
//                  }
//              }, '.required');

            },
            submitValidate : function(options) {
                var $form = options || this;
                var $body = $('body');
                var $required = $form.find('.required');
                var validator = new Validator();
                var $target;

                $.each($required, function(index, el) {
                    var $el = $(el);
                    var dataValid = $el.attr('data-valid');
                    var validLen = dataValid.split('||');
                    var errCollection = $el.attr('data-error');
                    var errMsgAry = errCollection.split("||");
                    var ruleAry = [];

                    for (var i = 0; i < validLen.length; i++) {
                        ruleAry.push({
                            strategy : validLen[i],
                            errorMsg : errMsgAry[i]
                        });
                    }

                    validator.add(el, ruleAry);

                });

                var result = validator.start();

                if (result.errorMsg) {
                    $target = $(result.el);
//                  $target.attr('data-status', 0)[0].focus();
                    //                  validator.hasError = true;
                    validator.showMsg($target, result.errorMsg, 2);
                    return false;
                }

                return true;
            }
        };

        $.fn.validate = function() {
            var method = arguments[0];
            var args;
            if (plugin[method]) {
                method = plugin[method];
                args = Array.prototype.slice.call(arguments, 1);
            } else if ( typeof (method) == 'object' || !method) {
                method = plugin.init;
            } else {
                $.error('Method ' + method + ' does not exist on jQuery.validate Plugin');
                return this;
            }
            return method.apply(this, args || arguments);
        };

    }));
