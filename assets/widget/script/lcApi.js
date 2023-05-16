if(window.service){
    let LcAPI = function() {
        this._uris = {
            // 上传回单图片
            "UPLOAD_RECEIPT_IMG": "portal/api/upload",
            // 获取回单图片列表
            "GET_RECEIPT_IMG": "portal/api/dowpic",
            // 上传转派图片
            "UPLOAD_TRANSFER_IMG": "portal/api/uploadZp",
            // 获取转派图片列表
            "GET_TRANSFER_IMG": "portal/appApiTask/dowZpPic",
            // 获取用户是否是客户经理
            "GET_USER_IS_MANAGER": "portal/TaskDefineController/getUserRoleByLoginName",
            // 回显图片的uri
            "SHOW_RECEIPT_IMG": "portal/api/picM?FILE_ABS_PATH=",
        };
    }
    LcAPI.prototype = {
        get(uri,params,callback){
            service.get({
                url: env.lcServerBaseUrl + this._uris[uri],
                abs:true,
                data:params
            },callback)
        },
        post(){},
        formDataPost(uri,params,callback,autoCloseProgress){
            let formData = new FormData();
            for(let k in params){
                formData.append(k,params[k]);
            }
            service.formDataReq({
                url: env.lcServerBaseUrl + this._uris[uri],
                abs:true,
                data:formData,
                autoCloseProgress:autoCloseProgress
            },callback)
        },
        // 回单上传图片
        uploadReceiptImg(params,callback){
            this.formDataPost("UPLOAD_RECEIPT_IMG",params,callback,false)
        },
        // 获取回单图片集合
        getReceiptImgList(p_id,appAcctId,callback){
            this.get("GET_RECEIPT_IMG",{p_id:p_id,appAcctId:appAcctId},callback)
        },
        // 转派上传图片
        uploadTransferImg(params,callback){
            this.formDataPost("UPLOAD_TRANSFER_IMG",params,callback,false)
        },
        // 获取转派图片集合
        getTransferImgList(p_id,appAcctId,callback){
            this.get("GET_TRANSFER_IMG",{p_id:p_id,appAcctId:appAcctId},callback)
        },
        // 查询某用户是否为客户经理
        getUserIsManager(loginName,callback){
            this.get("GET_USER_IS_MANAGER",{loginName:loginName},callback)
        },
        // 转换图片回显url
        getShowImgUrl(path){
            return env.lcServerBaseUrl + this._uris["SHOW_RECEIPT_IMG"] + path;
        }
    }
    service.lcApi = new LcAPI();
}