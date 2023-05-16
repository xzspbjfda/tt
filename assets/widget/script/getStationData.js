//信息采集
var getStationData = function(stationId,callback){
    //1)根据当前站址id获取设备列表
    var opts = {
        areaId : stationId,        
        tableName:"TW_PW_SWITCH_POWER"
    }
    /*console.log("============总直流负载电流采集-直接返回演示数据================")
    var resultData = {};
    resultData["deviceCnt"]="1";
    resultData["success"]=true;
    resultData["msg"]="获取直流负载电流成功";
    resultData["measuredValCount"]="10";
    callback(resultData);
    return;*/
    console.log("============总直流负载电流采集-获取设备列表开始================")
    console.log("上传参数：",JSON.stringify(opts));
    $client.getDevList(opts, function(ret, err) {
        var resultData = {};
        console.log("============总直流负载电流采集-获取设备列表完成================")
        console.log("返回结果：",JSON.stringify(ret));
        if (ret) {
            if (ret.success) {
                //2)遍历列表获取各设备的直流负载电流，计算站址总直流负载
                var measuredValCount=0;//直流负载电流
                var deviceCnt =0;
                if (ret.deviceList){
                	console.log("============总直流负载电流采集-获取设备数="+ret.deviceList.length+"================");
                	
                	//alert(JSON.stringify(ret));
	                for(i=0;i<ret.deviceList.length;i++){
	                	deviceCnt++;
	                    var itemData=ret.deviceList[i]
	                    var fsuId=itemData.fsuId;
	                    var deviceId=itemData.id;
	                    var opts = {
	                        fsuId : fsuId,
	                        deviceId : deviceId,
	                        semaphoreId : '0406112001'//直流负载电流
	                    };
	                    //2.1）获取设备信号量列表
	                    console.log("============总直流负载电流采集-【"+i+"】-获取设备信号量列表开始================")
	                    console.log("上传参数：",JSON.stringify(opts));
	                    $client.getMidRealData(opts, function(ret, err) {
	                        console.log("============总直流负载电流采集-【"+i+"】-获取设备信号量列表完成================")
	                        console.log("返回结果：",JSON.stringify(ret));
	                        if (ret) {
	                            if (ret.success) {
	                                //2.2）从信号量列表中获取直流负载电流
	                                var measuredval = parseFloat(ret.model.measuredval);
	                                measuredValCount+=measuredval;
	                            } else {
	                                api.toast({
	                                    msg : ret.data_info,
	                                    location : 'middle'
	                                });
	                            }
	                        } else {
	                            api.toast({
	                                msg : err.msg,
	                                location : 'middle'
	                            });
	                        }
	                    });
	                }
                } 
                
                resultData["deviceCnt"]=deviceCnt;
                resultData["success"]=true;
                resultData["msg"]="获取直流负载电流成功";
                resultData["measuredValCount"]=measuredValCount;
                callback(resultData);
                return;
            } else {
                resultData["success"]=false;
                resultData["msg"]="获取直流负载电流失败";
                resultData["measuredValCount"]=-1;
                callback(resultData);
                return;
            }
        } else {
            resultData["success"]=false;
            resultData["msg"]="获取站址设备列表失败";
            resultData["measuredValCount"]=-1;
            callback(resultData);
            return;
        }
    });
}