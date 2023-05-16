
	function updateRecommendStatus(sn){
        console.log('推荐工单状态更新')
        console.log(JSON.stringify(sn))
		if(sn==null || sn==""){
			return "工单是空，没有更新";
		}
		service({
			url:"/recommendBill/updateRecommendStatus.do",
			data:{
				sn: sn
			}
		}, function(res,err){
			if(res.success){   
			}else{  
				/*api.alert({
					msg : err+';推荐工单更新失败'
				});*/
			}                      
		});
	}

    /**
     * 判断是否有AI事件
     * @param sn
     * @param callback
     * @returns {string}
     */
	function hasAiEvent(sn,callback){
        console.log('判断是否有AI事件')
        console.log('sn ==== >'+JSON.stringify(sn))
		if(sn==null || sn==""){
			return "工单是空，没有消除AI事件";
		}

		service({
			url:"/enterStationBill/hasAiEvent.do",
			data:{
				sn: sn
			}
		},function(res,err){
			if(res.success){
			    console.log("res.data.has ====> "+res.data.has)
			    if(res.data.has > 0){
                    console.log("有AI事件");
                    $("#ispromptModelPanel").hide();
                    optBills("AI_EVENT");
                    //clearAiEvent_(sn,callback)
                }else{
                    console.log("没有AI事件");
                    callback(res,err);
                }

			}else{
                callback(res,err);
			}

		});

	}

    /**
     * 消除AI事件
     * @param sn
     * @param callback
     * @private
     */
	function clearAiEvent(sn,callback){

	    var detailedReason = "";
	    var clearReason = "";

	    if($("#detailedReason").length > 0){
            detailedReason = $("#detailedReason option:selected").val();
			if(detailedReason == "" || detailedReason == null){
				api.toast({
					msg : "请选择事件消除原因....",
					location : 'middle'
				});
				return;
			}
        }
        if($("#clearReason").length > 0){
            clearReason = $("#clearReason").val();
            var c = $.trim(clearReason);
			if(c == "" || c == null){
				api.toast({
					msg : "事件消除详细原因不能为空....",
					location : 'middle'
				});
				return;
			}
        }

        console.log("执行消除AI事件 ===> detailedReason :"+detailedReason + "  clearReason: "+clearReason)
        service({
            url:"/enterStationBill/clearAiEvent.do",
            data:{
                sn: sn,
                detailedReason:detailedReason,
                clearReason:clearReason
            }
        }, function(res,err){
            callback(res,err);
        });
    }