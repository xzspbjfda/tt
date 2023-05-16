/**
 * 巡检相片的数据库
 */
var db;

//数据库的名字
var APP_SYSTEM_DB_NAME = "itower";

//初始化sql语句列表
var INIT_SQL_LIST = [
//"drop table if exists tb_xunjian_pic",
"create table if not exists tb_xunjian_pic(id INTEGER PRIMARY KEY AUTOINCREMENT, projectid varchar(32) NOT NULL,projectname varchar(255) NOT NULL,userid varchar(32) NOT NULL,phototime varchar(50) ,lat varchar(50),lon varchar(50),photoaddress varchar(50),modeltype varchar(50),imgpath varchar(255))"];

var INIT_REPAIR_LIST = [
//"drop table if exists tb_xunjian_pic",
"create table if not exists tb_repair_pic(id INTEGER PRIMARY KEY AUTOINCREMENT, projectid varchar(32) NOT NULL,projectname varchar(255) NOT NULL,userid varchar(32) NOT NULL,phototime varchar(50) ,lat varchar(50),lon varchar(50),photoaddress varchar(50),billsn varchar(50),spare varchar(50),imgpath varchar(255))"];

// 初始化代维调度图片列表
var INIT_GENERA_LIST = [
//"drop table if exists tb_xunjian_pic",           id,titleName,userid,applyid,stationname,imgcode
"create table if not exists tb_genera_pic3(id INTEGER PRIMARY KEY AUTOINCREMENT, projectid varchar(32) NOT NULL,titleName varchar(255) NOT NULL,userid varchar(32) NOT NULL,applyid varchar(32) NOT NULL,stationname varchar(32) NOT NULL,imgcode varchar(32) NOT NULL,phototime varchar(50) ,lat varchar(50),lon varchar(50),photoaddress varchar(50),billsn varchar(50),spare varchar(50),imgpath varchar(255))"];

//初始化現場檢查數據语句列表
var INIT_CHECK_STATUS = [
//"drop table if exists tb_xunjian_pic",
"create table if not exists tb_check_status(id INTEGER PRIMARY KEY AUTOINCREMENT, projectid varchar(32) NOT NULL,checkstr varchar(255) NOT NULL,userid varchar(32) NOT NULL)"];
//初始化资源核准图片sql语句列表
var INIT_RES_SQL_LIST = [
//"drop table if exists tb_xunjian_pic",
"create table if not exists tb_resadd_pic(id INTEGER PRIMARY KEY AUTOINCREMENT, taskid varchar(32) NOT NULL,stationname varchar(255) NOT NULL,userid varchar(32) NOT NULL,phototime varchar(50) ,lat varchar(50),lon varchar(50),photoaddress varchar(50),imgpath varchar(255),restype varchar(50))"];

var INIT_SQL_LIST_CHECK = [
"create table if not exists tb_check_pic(id INTEGER PRIMARY KEY AUTOINCREMENT, detailid varchar(32) NOT NULL,itemname varchar(255) NOT NULL,userid varchar(32) NOT NULL,phototime varchar(50) ,lat varchar(50),lon varchar(50),photoaddress varchar(50),test varchar(50),imgpath varchar(255))"];

var INIT_SQL_LIST_BILL = ["CREATE TABLE IF NOT EXISTS tb_bill_pic(id INTEGER PRIMARY KEY AUTOINCREMENT, billid varchar(32) NOT NULL,stationname VARCHAR(32) NOT NULL,userid VARCHAR(32) NOT NULL,billsn VARCHAR(32) NOT NULL,phototime VARCHAR(50),lat varchar(50),lon varchar(50),photoaddress varchar(50),imgpath VARCHAR(255),businessid varchar(50),beiyong varchar(50))"];

var INIT_SQL_LIST_STANDBILL = ["CREATE TABLE IF NOT EXISTS tb_standbill_pic(id INTEGER PRIMARY KEY AUTOINCREMENT, applyid varchar(32) NOT NULL,stationname VARCHAR(32) NOT NULL,userid VARCHAR(32) NOT NULL,test VARCHAR(32) NOT NULL,phototime VARCHAR(50),lat varchar(50),lon varchar(50),photoaddress varchar(50),imgpath VARCHAR(255))"];

var INIT_SQL_LIST_CONTACT = ["CREATE TABLE IF NOT EXISTS tb_contact_list(id INTEGER PRIMARY KEY AUTOINCREMENT, userid VARCHAR(32) NOT NULL, username VARCHAR(32) NOT NULL,mobilephone VARCHAR(32) ,orgid VARCHAR(32) NOT NULL,orgname VARCHAR(32) NOT NULL,email VARCHAR(32))"];
var DROP_TABLE = ['drop table if exists tb_contact_list '];
//var DELETE_TABLE = ['drop table tb_xunjian_pic','drop table tb_bill_pic'];

var INIT_SQL_MESSAGECENTER = [
//"drop table if exists MESSAGECENTER",
"CREATE TABLE IF NOT EXISTS MESSAGECENTER( mcId INTEGER,userid VARCHAR(32) NOT NULL, type VARCHAR(32) NOT NULL,title VARCHAR(64) ,content VARCHAR(255) NOT NULL,time VARCHAR(50))"];

/**
 * 数据库初始化
 */
function db_init(callback) {
    console.log("=============================")

    db = api.require('db');

    db.openDatabase({
        name : APP_SYSTEM_DB_NAME
    }, function(ret, err) {
        if (ret.status) {
            _init_db_sql();
            checkUpdate();
            if (callback) {
                callback(true);
            }
            return;
        } else {
            console.error(err.msg);
            callback(false);
            return;
        }
    });

}

/**
 * 初始化sql语句
 */
function _init_db_sql() {
    if (INIT_REPAIR_LIST == null || INIT_REPAIR_LIST.length == 0) {
        return;
    }

    if (INIT_GENERA_LIST == null || INIT_GENERA_LIST.length == 0) {
        return;
    }

    if (INIT_SQL_LIST == null || INIT_SQL_LIST.length == 0) {
        return;
    }

     if (INIT_CHECK_STATUS == null || INIT_CHECK_STATUS.length == 0) {
        return;
    }

    if (INIT_RES_SQL_LIST == null || INIT_RES_SQL_LIST.length == 0) {
        return;
    }

    if (INIT_SQL_LIST_BILL == null || INIT_SQL_LIST_BILL.length == 0) {
        return;
    }

    if (INIT_SQL_LIST_STANDBILL == null || INIT_SQL_LIST_STANDBILL.length == 0) {
        return;
    }

    if (INIT_SQL_MESSAGECENTER == null || INIT_SQL_MESSAGECENTER.length == 0) {
        return;
    }

     if (INIT_SQL_LIST_CHECK == null || INIT_SQL_LIST_CHECK.length == 0) {
        return;
    }


    //  if(DELETE_TABLE == null ||  DELETE_TABLE.length == 0){
    //      return;
    //  }
    for (var i = 0, size = INIT_SQL_LIST.length; i < size; i++) {
        var sql = INIT_SQL_LIST[i];
        db.executeSql({
            name : APP_SYSTEM_DB_NAME,
            sql : sql
        }, function(ret, err) {
            if (!ret) {
                console.error("executesql:" + sql);
                console.error(err.msg);
            }
        });
    }

    for (var i = 0, size = INIT_REPAIR_LIST.length; i < size; i++) {
        var sql = INIT_REPAIR_LIST[i];
        db.executeSql({
            name : APP_SYSTEM_DB_NAME,
            sql : sql
        }, function(ret, err) {
            if (!ret) {
                console.error("executesql:" + sql);
                console.error(err.msg);
            }
        });
    }

    for (var i = 0, size = INIT_GENERA_LIST.length; i < size; i++) {
        var sql = INIT_GENERA_LIST[i];
        db.executeSql({
            name : APP_SYSTEM_DB_NAME,
            sql : sql
        }, function(ret, err) {
            if (!ret) {
                console.error("executesql:" + sql);
                console.error(err.msg);
            }
        });
    }

      for (var i = 0, size = INIT_CHECK_STATUS.length; i < size; i++) {
        var sql = INIT_CHECK_STATUS[i];
        db.executeSql({
            name : APP_SYSTEM_DB_NAME,
            sql : sql
        }, function(ret, err) {
            if (!ret) {
                console.error("executesql:" + sql);
                console.error(err.msg);
            }
        });
    }

    for (var i = 0, size = INIT_RES_SQL_LIST.length; i < size; i++) {
        var sql = INIT_RES_SQL_LIST[i];
        db.executeSql({
            name : APP_SYSTEM_DB_NAME,
            sql : sql
        }, function(ret, err) {
            if (!ret) {
                console.error("executesql:" + sql);
                console.error(err.msg);
            }
        });
    }

    for (var i = 0, size = INIT_SQL_LIST_BILL.length; i < size; i++) {
        var sql = INIT_SQL_LIST_BILL[i];
        db.executeSql({
            name : APP_SYSTEM_DB_NAME,
            sql : sql
        }, function(ret, err) {
            if (!ret) {
                console.error("executesql:" + sql);
                console.error(err.msg);
            }
        });
    }

     for (var i = 0, size = INIT_SQL_LIST_STANDBILL.length; i < size; i++) {
        var sql = INIT_SQL_LIST_STANDBILL[i];
        db.executeSql({
            name : APP_SYSTEM_DB_NAME,
            sql : sql
        }, function(ret, err) {
            if (!ret) {
                console.error("executesql:" + sql);
                console.error(err.msg);
            }
        });
    }

    for (var i = 0, size = INIT_SQL_MESSAGECENTER.length; i < size; i++) {
        var sql = INIT_SQL_MESSAGECENTER[i];
        db.executeSql({
            name : APP_SYSTEM_DB_NAME,
            sql : sql
        }, function(ret, err) {
            if (!ret) {
                console.error("executesql:" + sql);
                console.error(err.msg);
            }
        });
    }

    for (var i = 0, size = INIT_SQL_LIST_CHECK.length; i < size; i++) {
        var sql = INIT_SQL_LIST_CHECK[i];
        db.executeSql({
            name : APP_SYSTEM_DB_NAME,
            sql : sql
        }, function(ret, err) {
            if (!ret) {
                console.error("executesql:" + sql);
                console.error(err.msg);
            }
        });
    }

    //  for (var i = 0, size = DELETE_TABLE.length; i < size; i++) {
    //      var sql = DELETE_TABLE[i];
    //      db.executeSql({
    //          name : APP_SYSTEM_DB_NAME,
    //          sql : sql
    //      }, function(ret, err) {
    //          if (!ret) {
    //              console.error("executesql:" + sql);
    //              console.error(err.msg);
    //          }
    //      });
    //  }
}

/**
 * 关闭数据库
 */
function db_close() {

    if (db != null) {

        db.closeDatabase({
            name : APP_SYSTEM_DB_NAME
        }, function(ret, err) {
            if (ret.status) {
                return true;
            } else {
                console.error(err.msg);
                return false;
            }

        });
    }
    return true;
}

/**
 * 保存巡检图片
 */
function db_saveXunjianPic(data, callback) {
    if (db == null) {
        return;
    }

    var sql = "insert into tb_xunjian_pic(projectid,projectname,userid,phototime,lon,lat,imgpath,photoaddress,modeltype) " + "values('" + data.projectid + "','" + data.projectname + "','" + data.userid + "','" + data.phototime + "','" + data.lon + "','" + data.lat + "','" + data.imgpath + "','" + data.photoaddress + "','" + data.modeltype + "')";

    db.executeSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        console.log(ret.status);
        if (ret.status) {
            callback(true);
            return;
        } else {
            console.error("executesql:" + sql);
            console.error(err.msg);
            callback(false);
            return;
        }
    });
}



/**
 * 保存推送过来的消息
 */
function db_saveMessageEnter(data, callback) {
    if (db == null) {
        return;
    }
    var sql = "insert into MESSAGECENTER(mcId,userid,type,title,content,time) "
    + "values('" + data.mcid + "','" + data.userid + "','" + data.type + "','" + data.title + "','" + data.content +"','" + data.time + "')";

    db.executeSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        console.log(ret.status);
        if (ret.status) {
            callback(true);
            return;
        } else {
            console.error("executesql:" + sql);
            console.error(err.msg);
            callback(false);
            return;
        }
    });
}

/**
 * 保存日常维修图片
 */
function db_saveRepairPic(data, callback) {
    if (db == null) {
        return;
    }

    var sql = "insert into tb_repair_pic(projectid,projectname,userid,phototime,lon,lat,imgpath,photoaddress,billsn,spare) " + "values('" + data.projectid + "','" + data.projectname + "','" + data.userid + "','" + data.phototime + "','" + data.lon + "','" + data.lat + "','" + data.imgpath + "','" + data.photoaddress + "','" + data.billsn + "','" + data.spare + "')";

    db.executeSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        console.log(ret.status);
        if (ret.status) {
            callback(true);
            return;
        } else {
            console.error("executesql:" + sql);
            console.error(err.msg);
            callback(false);
            return;
        }
    });
}

/**
 * 保存现场检查数据
 */
function db_saveCheckData(data, callback) {

    if (db == null) {
	console.log('测试：'+data);
        return;
    }

    var sql = "insert into tb_check_status(projectid,checkstr,userid) " + "values('" + data.projectid + "','" + data.checkstr + "','" + data.userid + "')";

    db.executeSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        console.log(ret.status);
        if (ret.status) {
            callback(true);
            return;
        } else {
            console.error("executesql:" + sql);
            console.error(err.msg);
            callback(false);
            return;
        }
    });
}

/**
 * 保存资源核准图片
 */
function db_saveResPic(data, callback) {
    if (db == null) {
        return;
    }

    var sql = "insert into tb_resadd_pic(taskid,stationname,userid,phototime,lon,lat,imgpath,photoaddress,restype) " + "values('" + data.taskid + "','" + data.stationname + "','" + data.userid + "','" + data.phototime + "','" + data.lon + "','" + data.lat + "','" + data.imgpath + "','" + data.photoaddress + "','"+ data.restype + "')";

    db.executeSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        console.log(ret.status);
        if (ret.status) {
            callback(true);
            return;
        } else {
            console.error("executesql:" + sql);
            console.error(err.msg);
            callback(false);
            return;
        }
    });
}


/**
 * 保存巡检图片
 */
function db_saveCheckPic(data, callback) {
    if (db == null) {
        return;
    }

    var sql = "insert into tb_check_pic(detailid,itemname,userid,phototime,lon,lat,imgpath,photoaddress,test) " + "values('" + data.detailid + "','" + data.itemname + "','" + data.userid + "','" + data.phototime + "','" + data.lon + "','" + data.lat + "','" + data.imgpath + "','" + data.photoaddress + "','" + data.test + "')";

    db.executeSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        console.log(ret.status);
        if (ret.status) {
            callback(true);
            return;
        } else {
            console.error("executesql:" + sql);
            console.error(err.msg);
            callback(false);
            return;
        }
    });
}

/**
 * 获取资源核准图片列表
 * @param {Object} projectid
 */
function db_getResCheckPic(userid, taskid, callback) {

    if (db == null) {
        callback([]);
        return;
    }

    var sql = "select * from tb_resadd_pic where 1=1";

    if ( typeof (userid) != "undefined" && userid != null && userid != "") {
        sql += " and userid ='" + userid + "'";
    }

    if ( typeof (taskid) != "undefined" && taskid != null && taskid != "") {
        sql += " and taskid ='" + taskid + "'";
    }

    db.selectSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(ret.data);
            return;
        } else {
            console.error("selectSql:" + sql);
            console.error(err.msg);
            callback([]);
            return;
        }
    });

}



/**
 * 获取推送消息列表
 * @param {Object} projectid
 */
function db_getMessageCenter(userid, callback) {

    if (db == null) {
        callback([]);
        return;
    }

    var sql = "select * from MESSAGECENTER where 1=1 ";

    if ( typeof (userid) != "undefined" && userid != null && userid != "") {
        sql += " and userid ='" + userid + "'";
    }

	sql += " order by time desc";

    db.selectSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(ret.data);
            return;
        } else {
            console.error("selectSql:" + sql);
            console.error(err.msg);
            callback([]);
            return;
        }
    });

}

/**
 * 获取巡检图片列表
 * @param {Object} projectid
 */
function db_getXunjianPic(userid, projectid, callback) {

    if (db == null) {
        callback([]);
        return;
    }

    var sql = "select * from tb_xunjian_pic where 1=1";

    if ( typeof (userid) != "undefined" && userid != null && userid != "") {
        sql += " and userid ='" + userid + "'";
    }

    if ( typeof (projectid) != "undefined" && projectid != null && projectid != "") {
        sql += " and projectid ='" + projectid + "'";
    }

    db.selectSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(ret.data);
            return;
        } else {
            console.error("selectSql:" + sql);
            console.error(err.msg);
            callback([]);
            return;
        }
    });

}

/**
 * 获取日常维修图片列表
 * @param {Object} projectid
 */
function db_getRepairPic(userid, billsn, callback) {

    if (db == null) {
        callback([]);
        return;
    }

    var sql = "select * from tb_repair_pic where 1=1";

    if ( typeof (userid) != "undefined" && userid != null && userid != "") {
        sql += " and userid ='" + userid + "'";
    }

    if ( typeof (billsn) != "undefined" && billsn != null && billsn != "") {
        sql += " and billsn ='" + billsn + "'";
    }

    db.selectSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(ret.data);
            return;
        } else {
            console.error("selectSql:" + sql);
            console.error(err.msg);
            callback([]);
            return;
        }
    });

}

/**
 * 获取代维调度图片列表
 * @param {Object} projectid
 */
function db_getGeneraPic(userid, billsn, callback) {

    if (db == null) {
        callback([]);
        return;
    }

    var sql = "select * from tb_genera_pic3 where 1=1";

    if ( typeof (userid) != "undefined" && userid != null && userid != "") {
        sql += " and userid ='" + userid + "'";
    }

    if ( typeof (billsn) != "undefined" && billsn != null && billsn != "") {
        sql += " and billsn ='" + billsn + "'";
    }

    db.selectSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(ret.data);
            return;
        } else {
            console.error("selectSql:" + sql);
            console.error(err.msg);
            callback([]);
            return;
        }
    });

}


/**
 * 获取巡检图片列表
 * @param {Object} projectid
 */
function db_getCheckData(userid, projectid, callback) {

    if (db == null) {
        callback([]);
        return;
    }

    var sql = "select * from tb_check_status where 1=1";

    if ( typeof (userid) != "undefined" && userid != null && userid != "") {
        sql += " and userid ='" + userid + "'";
    }

    if ( typeof (projectid) != "undefined" && projectid != null && projectid != "") {
        sql += " and projectid ='" + projectid + "'";
    }

    db.selectSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(ret.data);
            return;
        } else {
            console.error("selectSql:" + sql);
            console.error(err.msg);
            callback([]);
            return;
        }
    });

}

/**
 * 删除资源核准图片
 * @param {Object} id
 */
function db_removeResCheckPic(id, callback) {
    if (db == null) {
        return true;
    }

    var sql = "delete  from tb_resadd_pic where id=" + id;

    db.executeSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(true);
            return;
        } else {
            console.error("executesql:" + sql);
            console.error(err.msg);
            callback(false);
            return;
        }
    });
}


/**
 * 删除巡检图片
 * @param {Object} id
 */
function db_removeXunjianPic(id, callback) {
    if (db == null) {
        return true;
    }

    var sql = "delete  from tb_xunjian_pic where id=" + id;

    db.executeSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(true);
            return;
        } else {
            console.error("executesql:" + sql);
            console.error(err.msg);
            callback(false);
            return;
        }
    });
}


/**
 * 删除日常维修图片
 * @param {Object} id
 */
function db_removeRepairPic(id, callback) {
    if (db == null) {
        return true;
    }

    var sql = "delete  from tb_repair_pic where id=" + id;

    db.executeSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(true);
            return;
        } else {
            console.error("executesql:" + sql);
            console.error(err.msg);
            callback(false);
            return;
        }
    });
}

/**
 * 删除巡检图片
 * @param {Object} id
 */
function db_removeCheckData(id, callback) {
    if (db == null) {
        return true;
    }

    var sql = "delete  from tb_check_status where id=" + id;

    db.executeSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(true);
            return;
        } else {
            console.error("executesql:" + sql);
            console.error(err.msg);
            callback(false);
            return;
        }
    });
}

/**
 * 获取离线巡检图片的数量
 * @param {Object} projectid
 */
function db_getXunjianPicCount(userid, callback) {
    if (db == null) {
        callback();
        return;
    }
    var sql = "select count(*) as c from tb_xunjian_pic where 1=1";
    if ( typeof (userid) != "undefined" && userid != null && userid != "") {
        sql += " and userid ='" + userid + "'";
    }

    db.selectSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            showlog($api.jsonToStr(ret));
            callback(ret.data[0].c);
            return;
        } else {
            console.error("selectSql:" + sql);
            console.error(err.msg);
            callback();
            return;
        }
    });
}

/**
 * 获取离线日常维修图片的数量
 * @param {Object} projectid
 */
function db_getRepairPicCount(userid, callback) {
    if (db == null) {
        callback();
        return;
    }
    var sql = "select count(*) as c from tb_repair_pic where 1=1";
    if ( typeof (userid) != "undefined" && userid != null && userid != "") {
        sql += " and userid ='" + userid + "'";
    }

    db.selectSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            showlog($api.jsonToStr(ret));
            callback(ret.data[0].c);
            return;
        } else {
            console.error("selectSql:" + sql);
            console.error(err.msg);
            callback();
            return;
        }
    });
}

/**
 * 获取离线资源核准图片的数量
 * @param {Object} projectid
 */
function db_getResCheckPicCount(userid, callback) {
    if (db == null) {
        callback();
        return;
    }
    var sql = "select count(*) as c from tb_resadd_pic where 1=1";
    if ( typeof (userid) != "undefined" && userid != null && userid != "") {
        sql += " and userid ='" + userid + "'";
    }

    db.selectSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            showlog($api.jsonToStr(ret));
            callback(ret.data[0].c);
            return;
        } else {
            console.error("selectSql:" + sql);
            console.error(err.msg);
            callback();
            return;
        }
    });
}

/**
 * 保存工单图片
 */
function db_saveBillPic(data, callback) {
    if (db == null) {
        return;
    }
    var sql = "insert into tb_bill_pic(billid,stationname,userid,billsn,phototime,imgpath,lat,lon,photoaddress,businessid,beiyong) " + "values('" + data.billid + "','" + data.stationname + "','" + data.userid + "','" + data.billsn + "','" + data.phototime + "','" + data.imgpath + "','" + data.lat + "','" + data.lon + "','" + data.photoaddress + "','" + data.businessid + "','" + data.beiyong + "')";
    db.executeSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(true);
            return;
        } else {
            console.error("executesql:" + sql);
            console.error(err.msg);
            callback(false);
            return;
        }
    });
}

function db_saveStandBillPic(data, callback) {
    if (db == null) {
        return;
    }
    var sql = "insert into tb_standbill_pic(applyid,stationname,userid,test,phototime,imgpath,lat,lon,photoaddress) " + "values('" + data.applyid + "','" + data.stationname + "','" + data.userid + "','" + data.test + "','" + data.phototime + "','" + data.imgpath + "','" + data.lat + "','" + data.lon + "','" + data.photoaddress + "')";
    db.executeSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(true);
            return;
        } else {
            console.error("executesql:" + sql);
            console.error(err.msg);
            callback(false);
            return;
        }
    });
}

function db_saveGeneraPic(data, callback) {
    if (db == null) {
        return;
    }
    var sql = "insert into tb_genera_pic3(projectid,titleName,userid,applyid,stationname,imgcode,phototime,lon,lat,imgpath,photoaddress,billsn,spare) " + "values('" + data.projectid + "','" + data.titleName + "','" + data.userid + "','"+ data.applyid + "','"+ data.stationname + "','"+ data.imgcode + "','" + data.phototime + "','" + data.lon + "','" + data.lat + "','" + data.imgpath + "','" + data.photoaddress + "','" + data.billsn + "','" + data.spare + "')";
    db.executeSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(true);
            return;
        } else {
            console.error("executesql:" + sql);
            console.error(err.msg);
            callback(false);
            return;
        }
    });
}

/**
 * 删除工单图片
 * @param {Object} id
 */
function db_removeBillPic(id, callback) {
    if (db == null) {
        return true;
    }

    var sql = "delete  from tb_bill_pic where id=" + id;

    db.executeSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(true);
            return;
        } else {
            console.error("executesql:" + sql);
            console.error(err.msg);
            callback(false);
            return;
        }
    });
}

/**
 * 删除出入站工单图片
 * @param {Object} id
 */
function db_removeStandBillPic(id, callback) {
    if (db == null) {
        return true;
    }

    var sql = "delete  from tb_standbill_pic where id=" + id;

    db.executeSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(true);
            return;
        } else {
            console.error("executesql:" + sql);
            console.error(err.msg);
            callback(false);
            return;
        }
    });
}

/**
 * 删除出入站工单图片
 * @param {Object} id
 */
function db_removeGeneraPic(id, callback) {
    if (db == null) {
        return true;
    }

    var sql = "delete  from tb_genera_pic3 where id=" + id;

    db.executeSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(true);
            return;
        } else {
            console.error("executesql:" + sql);
            console.error(err.msg);
            callback(false);
            return;
        }
    });
}

/**
 * 删除现场检查图片
 * @param {Object} id
 */
function db_removeCheckPic(id, callback) {
    if (db == null) {
        return true;
    }

    var sql = "delete  from tb_check_pic where id=" + id;

    db.executeSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(true);
            return;
        } else {
            console.error("executesql:" + sql);
            console.error(err.msg);
            callback(false);
            return;
        }
    });
}

/**
 * 获取工单图片列表
 * @param {Object} projectid
 */
function db_getBillPic(userid, billid, callback) {

    if (db == null) {
        callback([]);
        return;
    }
    var sql = "select * from tb_bill_pic where 1=1";

    if ( typeof (userid) != "undefined" && userid != null && userid != "") {
        sql += " and userid ='" + userid + "'";
    }

    if ( typeof (billid) != "undefined" && billid != null && billid != "") {
        sql += " and billid ='" + billid + "'";
    }
    db.selectSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(ret.data);
            return;
        } else {
            console.error("selectSql:" + sql);
            console.error(err.msg);
            callback([]);
            return;
        }
    });
}

/**
 * 获取出入站工单图片列表
 * @param {Object} projectid
 */
function db_getStandBillPic(userid, billid, callback) {

    if (db == null) {
        callback([]);
        return;
    }
    var sql = "select * from tb_standbill_pic where 1=1";

    if ( typeof (userid) != "undefined" && userid != null && userid != "") {
        sql += " and userid ='" + userid + "'";
    }

    if ( typeof (billid) != "undefined" && billid != null && billid != "") {
        sql += " and billid ='" + billid + "'";
    }
    db.selectSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(ret.data);
            return;
        } else {
            console.error("selectSql:" + sql);
            console.error(err.msg);
            callback([]);
            return;
        }
    });
}

/**
 * 获取现场检查图片列表
 * @param {Object} projectid
 */
function db_getCheckPic(userid,  callback) {

    if (db == null) {
        callback([]);
        return;
    }
    var sql = "select * from tb_check_pic where 1=1";

    if ( typeof (userid) != "undefined" && userid != null && userid != "") {
        sql += " and userid ='" + userid + "'";
    }


    db.selectSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            callback(ret.data);
            return;
        } else {
            console.error("selectSql:" + sql);
            console.error(err.msg);
            callback([]);
            return;
        }
    });
}
/**
 * 获取离线工单图片的数量
 * @param {Object} projectid
 */
function db_getBillPicCount(userid, callback) {
    if (db == null) {
        callback();
        return;
    }
    var sql = "select count(*) as c from tb_bill_pic where 1=1";
    if ( typeof (userid) != "undefined" && userid != null && userid != "") {
        sql += " and userid ='" + userid + "'";
    }
    db.selectSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            showlog($api.jsonToStr(ret));
            callback(ret.data[0].c);
            return;
        } else {
            console.error("selectSql:" + sql);
            console.error(err.msg);
            callback();
            return;
        }
    });
}

/**
 * 获取离线出入站工单图片的数量
 * @param {Object} projectid
 */
function db_getStandBillPicCount(userid, callback) {
    if (db == null) {
        callback();
        return;
    }
    var sql = "select count(*) as c from tb_standbill_pic where 1=1";
    if ( typeof (userid) != "undefined" && userid != null && userid != "") {
        sql += " and userid ='" + userid + "'";
    }
    db.selectSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            showlog($api.jsonToStr(ret));
            callback(ret.data[0].c);
            return;
        } else {
            console.error("selectSql:" + sql);
            console.error(err.msg);
            callback();
            return;
        }
    });
}

/**
 * 获取离线 现场检查图片的数量
 * @param {Object} projectid
 */
function db_getCheckCount(userid, callback) {
    if (db == null) {
        callback();
        return;
    }
    var sql = "select count(*) as c from tb_check_pic where 1=1";
    if ( typeof (userid) != "undefined" && userid != null && userid != "") {
        sql += " and userid ='" + userid + "'";
    }
    db.selectSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            showlog($api.jsonToStr(ret));
            callback(ret.data[0].c);
            return;
        } else {
            console.error("selectSql:" + sql);
            console.error(err.msg);
            callback();
            return;
        }
    });
}

function db_dropTableContact(callback) {
    if (DROP_TABLE == null || DROP_TABLE.length == 0) {
        return;
    }
    //先删表再重建
    for (var i = 0, size = DROP_TABLE.length; i < size; i++) {
        var sql = DROP_TABLE[i];
        db.executeSql({
            name : APP_SYSTEM_DB_NAME,
            sql : sql
        }, function(ret, err) {
            if (!ret) {
                console.error("executesql:" + sql);
                console.error(err.msg);
            } else {
                if (INIT_SQL_LIST_CONTACT == null || INIT_SQL_LIST_CONTACT == 0) {
                    return;
                }
                for (var i = 0, size = INIT_SQL_LIST_CONTACT.length; i < size; i++) {
                    var sql = INIT_SQL_LIST_CONTACT[i];
                    db.executeSql({
                        name : APP_SYSTEM_DB_NAME,
                        sql : sql
                    }, function(ret, err) {
                        if (!ret) {
                            console.error("executesql:" + sql);
                            console.error(err.msg);
                        } else {
                            callback();
                        }

                    });
                }
            }

        });
    }
}

function db_saveContactList(arr, callback) {
    if (db == null || arr == null || arr.length == 0) {//
        return;
    }

    var sql = "insert into tb_contact_list(userid,username,mobilephone,email,orgid,orgname ) values";
    for (var i = 0; i < arr.length; i++) {
        var data = arr[i];
        sql += "('" + data.userid + "','" + data.username + "','" + data.mobilephone + "','" + data.email + "','" + data.orgid + "','" + data.orgname + "')";
        if (i < arr.length - 1) {
            sql += ",";
        } else {
            sql += ";";
        }
    }
    db.executeSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        console.log(ret.status);
        if (ret.status) {
            callback(true);
            return;
        } else {
            console.error("executesql:" + sql);
            console.error(err.msg);
            callback(false);
            return;
        }
    });

}

function db_getContactByCondiction(opts, callback) {
    if (db == null) {
        callback([]);
        return;
    }
    var sql = "select * from tb_contact_list where 1=1";
    var username = opts.username;
    var mobilephone = opts.mobilephone;
    var email = opts.email;
    var orgid = opts.unit;
    if ( typeof (username) != "undefined" && username != null && username != "") {
        sql += " and username ='" + username + "'";
    }
    if ( typeof (mobilephone) != "undefined" && mobilephone != null && mobilephone != "") {
        sql += " and mobilephone ='" + mobilephone + "'";
    }
    if ( typeof (email) != "undefined" && email != null && email != "") {
        sql += " and email ='" + email + "'";
    }
    if ( typeof (orgid) != "undefined" && orgid != null && orgid != "") {
        sql += " and orgid ='" + orgid + "'";
    }
    db.selectSql({
        name : APP_SYSTEM_DB_NAME,
        sql : sql
    }, function(ret, err) {
        if (ret.status) {
            showlog($api.jsonToStr(ret));
            callback(ret.data);
            return;
        } else {
            console.error("selectSql:" + sql);
            console.error(err.msg);
            callback();
            return;
        }
    });
}

function checkUpdate() {
    var dbUpdate = $api.getStorage('dbUpdate');
    if (dbUpdate || typeof dbUpdate == 'undefined') {
        db.executeSql({
            name : APP_SYSTEM_DB_NAME,
            sql : "ALTER TABLE tb_bill_pic ADD  businessid varchar(50),beiyong varchar(50)"
        }, function(ret, err) {
            if (ret.status) {
                showlog('TABLE tb_bill_pic表结构修改成功');
                $api.setStorage('dbUpdate', false);
            }else{
                showlog(err.msg);
            }
        });
        db.executeSql({
            name : APP_SYSTEM_DB_NAME,
            sql : "ALTER TABLE tb_resadd_pic ADD COLUMN restype varchar(50)"
        }, function(ret, err) {
            if (ret.status) {
                showlog('TABLE tb_resadd_pic表结构修改成功');
                $api.setStorage('dbUpdate', false);
            }else{
                showlog(err.msg);
            }
        });//457 2017-05-02
    }
}
