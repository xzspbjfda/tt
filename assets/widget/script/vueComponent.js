var TASK_STATUS = {
  "0":"已删除",
  "1":"待提交审核",
  "2":"待审核",
  "3":"审核通过",
  "4":"审核不通过",
  "5":"待领取",
  "6":"已领取",
  "7":"超时未领取",
  "8":"已完成(待确认)",
  "9":"待提交审核",
  "10":"未完成",
  "11":"已归档"
}
var WORDER_RUN_STATUS = {
  "5":"待领取",
  "6":"已领取",
  "14":"待审核"
}
Vue.mixin({
  methods:{
    $getTaskStatus:function(status){
      return TASK_STATUS[status] || "未知状态";
    },
    $getWorderStatus:function(status){
      return WORDER_RUN_STATUS[status] || "未知状态";
    },
    /**
     * 触发h5原生选择文件
     * @param options 仅支持以下属性
     *          accept 可选择的文件类型，默认支持所有图片
     *          multiple 是否多选 默认不支持多选
     * @param callback
     */
    $selectPhoto:function(options,callback){
      var defaultOptions = {accept: 'image/*', multiple: false};
      if(options){
        if(options.accept !== undefined){defaultOptions.accept = options.accept}
        if(options.multiple !== undefined){defaultOptions.multiple = options.multiple}
      }
      var el = document.createElement('input');
      el.type = 'file';
      el.accept = defaultOptions.accept;
      el.multiple = defaultOptions.multiple;
      el.addEventListener('change',()=>{
        if(el.files.length > 0){
          callback && callback(defaultOptions.multiple ? el.files : el.files[0])
        }
      });
      el.click();
    },
    closeSelf:function () {
      api.closeFrame();
      api.closeWin();
    },
  }
});


Vue.component('yt-table-field', {
  props:{
    label:{
      type:String,
      default:""
    },
    leftWidth:{
      type:String,
      default:"4"
    },
    rightWidth:{
      type:String,
      default:"8"
    }
  },
  template:"<li class=\"aui-list-view-cell border_b\" ><div :class=\"['aui-col-xs-' + leftWidth,'aui-pull-left','red']\">• {{label}}</div><div :class=\"['aui-col-xs-' + rightWidth,'aui-pull-right']\"><slot></slot></div></li>"
})
/**
 * 弹框组件
 * title : 标题
 * show : 控制是否显示，支持sync修饰符
 * close-on-decided : 在点击确定按钮(触发decided事件)时自动关闭弹窗
 * slot :
 *        content : 内容插槽
 *        footer : 底部插槽
 */
Vue.component('yt-confirm-dialog', {
  props:{
    title:{
      type:String,
      default:"提示"
    },
    show:{
      type:Boolean,
      default:false
    },
    closeOnDecided:Boolean,
  },
  methods:{
    decided:function (){
      if(this.closeOnDecided){
        this.close();
      }
      this.$emit("decided");
    },
    cancel:function (){
      this.$emit("cancel");
      this.close();
    },
    close:function () {
      this.$emit("update:show",false);
    }
  },
  template:"<div v-show='show'>" +
      "         <div class=\"vue-dialog-mask\"></div>" +
      "         <div class=\"vue-dialog\">" +
      "             <div id=\"acceptDiv\" class=\"vue-winDiv\">" +
      "                 <div class=\"winTitleDiv\">{{title}}</div>" +
      "                 <slot name='content'></slot>"+
      "                 <slot name='footer'>" +
      "                     <div class=\"winButtonDiv\">" +
      "                         <button class=\"winCancelBtn\" @click=\"cancel\">取消</button>" +
      "                         <button class=\"winOkBtn\" @click=\"decided\">确定</button>" +
      "                     </div>" +
      "                 </slot>"+
      "             </div>" +
      "         </div>" +
      "     </div>"
});
Vue.component('yt-mask', {
  props:{
    show:{
      type:Boolean,
      default:false
    },
    closeOnClickShadow:Boolean,
    top:{
      type:String,
      default:"0"
    }
  },
  methods:{
    clickShadow:function (){
      if(this.closeOnClickShadow){
        this.close();
      }
      this.$emit("click-shadow");
    },
    close:function () {
      this.$emit("update:show",false);
    }
  },
  template:"<div v-show='show'>" +
      "         <div class=\"vue-mask-content\" @touchmove.prevent ><div class=\"vue-dialog-mask\" :style=\"{'top':top}\" @click='clickShadow'></div><slot></slot></div>" +
      "     </div>"
})
Vue.prototype.loadBase64ImgAtFile = function (file,callback){
  var imgFile = new FileReader();
  imgFile.readAsDataURL(file);
  imgFile.onload = function () {
    var imgData = this.result;
    callback(imgData);
  }
}

let ORDER_OPTIONS_MIXIN = {
  data(){
    return {
      dataList:[
        {id:1,label:"按时间排序",value:"time"},
        {id:2,label:"按距离排序",value:"distance"},
      ],
      selectedItem:{},
      value:null,
      active:false,
    }
  },
}