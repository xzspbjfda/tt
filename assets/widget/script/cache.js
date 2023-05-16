// wxxxxxxxxxxxxxxx缓存数据到本地  故障工单
// 缓存数据到本地
function doJluBill(id){
  var billModel = $api.getStorage('billModel');
  var billsn = billModel.billsn;
  var billstatusname = billModel.billstatusname;
  if($api.getStorage('draftArr')){
    var draft=$api.getStorage('draftArr');
  }else {
    var draft=[];
  }
  var opts={};
  $(id).find("input:visible,select:visible,textarea:visible").each(function() {
    var name = $(this).attr('name');
    var val = typeof ($(this).val()) == 'undefined' ? $(this).text() : $(this).val();
    if ($(this).attr('type') == 'radio') {
      val = $("input[type='radio']:checked").eq(i).val();
      opts[name] = val;
    }else{
      opts[name] = val;
    }
  });
  opts['billstatusname']=billstatusname;
  opts['billsn']=billsn;
  // 更新已有数据
  for (var i = 0; i < draft.length; i++) {
    if(draft[i].billsn==opts.billsn){
      draft.splice(i,1);
    }
  }
  draft.push(opts);
  //

  $api.setStorage('draftArr', draft);
  console.log(JSON.stringify(draft));

}
//填充数据
function doJluSetBill(){
  var billModel = $api.getStorage('billModel');
  var draftArr=$api.getStorage('draftArr');
  console.log(JSON.stringify(draftArr));
  if(draftArr){
    // 更新已有数据
    for (var i = 0; i < draftArr.length; i++) {
      if(draftArr[i].billsn==billModel.billsn&&draftArr[i].billstatusname==billModel.billstatusname){

        // 故障类型和故障原因联动
        var faultCouseindex=draftArr[i].faultCouse;
        if(faultCouseindex){
          var $selFaultCouse = $('option[value='+faultCouseindex+']').parent();
          $selFaultCouse.show().addClass('required').val('').siblings().hide().removeClass('required');
        }
        // 故障类型和故障原因联动
        for (var variable in draftArr[i]) {
          $('[name='+variable+']:visible').val(draftArr[i][variable]);
        }

        // 免责
        if(draftArr[i].isRelief){
          var wrapper = $('form [name=reliefType],form [name=reliefCause]').parents('[id^=relief]');
          draftArr[i].isRelief == 'Y' ? wrapper.show() : wrapper.hide();
        }

        if(draftArr[i].isEmptyRun){

           var val = draftArr[i].isEmptyRun;
           var hideList = ['#elecEndTimeId','#outerRecoverTimeId','#elecRecoverTimeId','#oilTypeId','#boardTypeId', '#workRateId',   '#vehicleMileageId', '#electricityCausesId', '#realElecOperatorId','#oillNumId', '#towerOillId', '#autoOillId', '#oillHourId', '#oillPayId','#isRefiefElec','#refiefTypeId','#reliefCauseId','#stationCauseElecId','#causeDealInfoElecId'];
           for (var i = 0, size = hideList.length; i < size; i++) {
                    $(hideList[i]).removeClass('required');
                   }
           switch(val) {
               case 0 :
                   $('#isStandStaElec').val('Y').attr('disabled', true);
                   document.getElementById("arriveTimeId").type="datetime-local";
                    $('#arriveTimeId').attr('disabled',false);
                    $('#elecBeginTimeId').val((new Date()).pattern("yyyy-MM-dd HH:mm:ss"));

                   break;
               case 1 :
                 $('#isStandStaElec').val('Y').attr('disabled', false);

                   document.getElementById("arriveTimeId").type="text";
                   $('#elecBeginTimeId').val('');
                   $('#arriveTimeId').val('');
                   $('#arriveTimeId').attr('disabled',true);

                break;
               case 2 :

        $('#isStandStaElec').val('N').attr('disabled', true);

                   document.getElementById("arriveTimeId").type="text";
                   $('#elecBeginTimeId').val('');
                   $('#arriveTimeId').val('');
                   $('#arriveTimeId').attr('disabled',true);

                break;
               default :
                   break;
           }
        }

        if (api.frameName=='billRevertCommonDetail_frm') {
          onSelCause("#mainCause")
        }


      }
    }
  }

}


// 缓存图片信息到本地
function cacheImgArr(imgModel){
  if($api.getStorage('pathArr')){
    var pathArr=$api.getStorage('pathArr');
  }else {
    var pathArr=[];
  }
  pathArr.push(imgModel)
  $api.setStorage('pathArr', pathArr);
  console.log(JSON.stringify(pathArr));
}
// 填充图片信息到页面
function setImgArr(){
  var billModel = $api.getStorage('billModel');
  var pathArr=$api.getStorage('pathArr');
  console.log(";[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]");
  if(pathArr){
    for (var i = 0; i < pathArr.length; i++) {
      if(pathArr[i].billsn==billModel.billsn&&pathArr[i].billstatusname==billModel.billstatusname){
        console.log(JSON.stringify(pathArr[i]));
        imageUtil.getImageArray().push(pathArr[i]);
        var tpl = $api.byId('img-template').text;
        var tempFn = doT.template(tpl);
        $('#addPic').before(tempFn(pathArr[i]));
        $new = $('#addPic').prev();
        $new.css('height', $new.css('width'));
      }
    }
  }
}
// 删除缓存图片
function deleteImgArr(imgpath){
  var pathArr=$api.getStorage('pathArr');
  for (var i = 0; i < pathArr.length; i++) {
    var data = pathArr[i];
    if (data.imgpath == imgpath) {
      pathArr.remove(i);
      $api.setStorage('pathArr', pathArr);
      break;
    }
  }
}

// 删除该工单缓存数据
function deleteBill(billsn){
  // 图片

    var pathArr=$api.getStorage('pathArr');
    for (var i = 0; i < pathArr.length; i++) {
      var data = pathArr[i];
      if (data.billsn == billsn) {
        pathArr.remove(i);
        $api.setStorage('pathArr', pathArr);
        break;
      }
    }


// 表单数据
  var draftArr=$api.getStorage('draftArr');
  for (var i = 0; i < draftArr.length; i++) {
    var data = draftArr[i];
    if (data.billsn == billsn) {
      draftArr.remove(i);
      $api.setStorage('draftArr', draftArr);
      break;
    }
  }
}

// wxxxxxxxxxxxxxxx缓存数据到本地  代维调度

//代维调度保存数据
function doJluGeneration(id){
    if($api.getStorage('draftGenerationArr')){
      var draftGeneration=$api.getStorage('draftGenerationArr');
    }else {
      var draftGeneration=[];
    }
    var opts={};
    $(id).find("input,select,textarea").each(function() {
      var name = $(this).attr('name');
      var val = typeof ($(this).val()) == 'undefined' ? $(this).text() : $(this).val();
      if ($(this).attr('type') == 'radio') {
        val = $("input[type='radio']:checked").eq(i).val();
        opts[name] = val;
      }else{
        opts[name] = val;
      }
    });

    // 代维调度更新已有数据
    for (var i = 0; i < draftGeneration.length; i++) {
      if(draftGeneration[i].id==opts.id){
        draftGeneration.splice(i,1);
      }
    }
    draftGeneration.push(opts);
    //

    $api.setStorage('draftGenerationArr', draftGeneration);
};

// 代维调度填充数据
function doJluSetGeneration(){
  var generationBillMenu = $api.getStorage('generationBillMenu');
    var draftGenerationArr=$api.getStorage('draftGenerationArr');
    // 代维调度更新已有数据
    if(draftGenerationArr){
      for (var i = 0; i < draftGenerationArr.length; i++) {
        if(draftGenerationArr[i].id==generationBillMenu.id){
          for (var variable in draftGenerationArr[i]) {
            $('[name='+variable+']').val(draftGenerationArr[i][variable]);
          }
        }
      }
    }
}

// 代维调度图片缓存
function cacheImgGenerationArr(imgModel){
  if($api.getStorage('cacheImgGenerationArr')){
    var cacheImgGenerationArr=$api.getStorage('cacheImgGenerationArr');
  }else {
    var cacheImgGenerationArr=[];
  }
  cacheImgGenerationArr.push(imgModel)
  $api.setStorage('cacheImgGenerationArr', cacheImgGenerationArr);
}
// 代维调度填充图片
function setImgArrGeneration(){
  var generationBillMenu = $api.getStorage('generationBillMenu');
  var cacheImgGenerationArr=$api.getStorage('cacheImgGenerationArr');
  if(cacheImgGenerationArr){
    for (var i = 0; i < cacheImgGenerationArr.length; i++) {
      if(cacheImgGenerationArr[i].projectid==generationBillMenu.id){
        imageUtil.getImageArray().push(cacheImgGenerationArr[i]);
        var tpl = $api.byId('img-template').text;
        var tempFn = doT.template(tpl);
        $('#addPic').before(tempFn(cacheImgGenerationArr[i]));
        $new = $('#addPic').prev();
        $new.css('height', $new.css('width'));
      }
    }
  }
};
// 代维调度删除缓存图片
function deleteImgArrGeneration(imgpath){
  var cacheImgGenerationArr=$api.getStorage('cacheImgGenerationArr');
  for (var i = 0; i < cacheImgGenerationArr.length; i++) {
    var data = cacheImgGenerationArr[i];
    if (data.imgpath == imgpath) {
      cacheImgGenerationArr.remove(i);
      $api.setStorage('cacheImgGenerationArr', cacheImgGenerationArr);
      break;
    }
  }
}

// 代维调度删除该工单缓存数据
function deleteGeneration(id){
  // 图片
    var cacheImgGenerationArr=$api.getStorage('cacheImgGenerationArr');
    for (var i = 0; i < cacheImgGenerationArr.length; i++) {
      var data = cacheImgGenerationArr[i];
      if (data.projectid == id) {
        cacheImgGenerationArr.remove(i);
        $api.setStorage('cacheImgGenerationArr', cacheImgGenerationArr);
        break;
      }
    }


// 表单数据
  var draftGenerationArr=$api.getStorage('draftGenerationArr');
  for (var i = 0; i < draftGenerationArr.length; i++) {
    var data = draftGenerationArr[i];
    if (data.id == id) {
      draftGenerationArr.remove(i);
      $api.setStorage('draftGenerationArr', draftGenerationArr);
      break;
    }
  }
}
