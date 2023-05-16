/**
 * 巡检任务（进行中）的数据库
 */
var db;

//数据库的名字
var APP_SYSTEM_DB_NAME = "inspection";

//初始化sql语句列表
var TASKINFOLIST = "CREATE TABLE if not exists taskInfoList(sign_longitude VARCHAR(255),sign_latitude VARCHAR(255),sign_cause VARCHAR(255),range_site VARCHAR(255),endtime VARCHAR(255), templatename VARCHAR(255), lon VARCHAR(255), starttime  VARCHAR(255), taskid  VARCHAR(255), stationname VARCHAR(255), projectcount VARCHAR(255),ishidden  VARCHAR(255),date VARCHAR(255), st_sitesource VARCHAR(255),deviceid  VARCHAR(255),createtime VARCHAR(255), taskuser  VARCHAR(255),username VARCHAR(255), countyname VARCHAR(255),applymajor  VARCHAR(255), taskstate   VARCHAR(255), rownum_ VARCHAR(255), istimeout VARCHAR(255), taskuserid VARCHAR(255),signtime VARCHAR(255),stationcode  VARCHAR(255),siteid VARCHAR(255),operators VARCHAR(255),finishcount  VARCHAR(255),lat VARCHAR(255))";

var INSPSTANDRELPROJINFOLIST = 'CREATE TABLE if not exists inspstandRelProjInfoList(id VARCHAR(255), modularid  VARCHAR(255), isexamine  VARCHAR(255), objtype  VARCHAR(255),province_checktime VARCHAR(255),city_checkresult VARCHAR(255),city_reason VARCHAR(255),city_checktime VARCHAR(255),province_checkresult VARCHAR(255),province_reason VARCHAR(255),group_checkresult VARCHAR(255),group_reason VARCHAR(255),group_checktime VARCHAR(255), isfinish  VARCHAR(255), imagecount  VARCHAR(255), taskid  VARCHAR(255), devname  VARCHAR(255),projectid  VARCHAR(255),modularname  varchar(255))';

var INSPSTANDRELPROJINFODETAILLIST='CREATE TABLE if not exists inspstandRelProjInfoDetailList(endtime VARCHAR(255), sitename VARCHAR(255),hiddenlist VARCHAR(255),remark VARCHAR(255), begintime VARCHAR(255),datadisplay VARCHAR(255),taskid VARCHAR(255), hiddengrade VARCHAR(255), actualfill VARCHAR(255), ishidden VARCHAR(255),city VARCHAR(255), id varchar(255),isfinish varchar(255),request varchar(255),province  VARCHAR(255),projectid VARCHAR(255),hiddenremark varchar(255),fillunit VARCHAR(255),modularid VARCHAR(255),objtype VARCHAR(255),st_sitesource_dictvalue VARCHAR(255),st_deviceid VARCHAR(255),devname VARCHAR(255),projectname VARCHAR(255),st_sitesource VARCHAR(255),total_checkstate VARCHAR(255),hiddencontent VARCHAR(255),sitecode VARCHAR(255),isstander VARCHAR(255),county VARCHAR(255),filltype VARCHAR(255),province_checktime VARCHAR(255),city_checkresult VARCHAR(255),city_reason VARCHAR(255),city_checktime VARCHAR(255),province_checkresult VARCHAR(255),province_reason VARCHAR(255),group_checkresult VARCHAR(255),group_reason VARCHAR(255),group_checktime VARCHAR(255))';
/**
 * 数据库初始化
 */
function db_initwxx(obj) {
    db = api.require('db');
    db.openDatabase({
        name: 'xunjian',
        path: 'fs://xunjian/DB/inspection'
    }, function(ret, err) {
        if (ret.status) {
          var db = api.require('db');
          db.selectSql({
              name: 'xunjian',
              sql: 'alter table  taskInfoList add sign_longitude VARCHAR(255)'
          }, function(ret, err) {
            db.selectSql({
                name: 'xunjian',
                sql: 'alter table  taskInfoList add sign_latitude VARCHAR(255)'
            }, function(ret, err) {
              db.selectSql({
                  name: 'xunjian',
                  sql: 'alter table  taskInfoList add sign_cause VARCHAR(255)'
              }, function(ret, err) {
                db.selectSql({
                    name: 'xunjian',
                    sql: 'alter table  taskInfoList add range_site VARCHAR(255)'
                }, function(ret, err) {
                     newTable(obj);
                });
              });
            });
          });
        } else {
            // alert(JSON.stringify(err));
        }
    });
}

/**
 * 创建表
 */

function newTable(obj) {
    // 创建表 TASKINFOLIST
    db.executeSql({
        name: 'xunjian',
        sql: TASKINFOLIST
    }, function(ret, err) {
        if (ret.status) {
            //  循环列表数据
            console.log(obj.taskInfoList.length);
            for (var i = 0; i < obj.taskInfoList.length; i++) {
                var index = i;
                //  验证此数据是否已存在本地数据库
                (function(index) {
                    var taskid = obj.taskInfoList[index]['taskid'];
                    db.selectSql({
                        name: 'xunjian',
                        sql: 'SELECT * FROM taskInfoList WHERE taskid = "' + taskid + '"'
                    }, function(ret, err) {
                        if (ret.status) {
                          console.log(ret.data.length);
                          // console.log(index);
                          // console.log(taskid);
                            if (ret.data.length > 0) {
                                var values = '';
                                for (var j in obj.taskInfoList[index]) {
                                    var value = obj.taskInfoList[index][j] != null ? obj.taskInfoList[index][j] : '';
                                    values += j + '= "' + value + '",';
                                };
                                values = values.substring(0, values.length - 1);
                                // 更新数据到本地数据库
                                db.executeSql({
                                    name: 'xunjian',
                                    sql: 'UPDATE taskInfoList SET ' + values + 'WHERE taskid = "' + taskid + '"'
                                }, function(ret, err) {
                                    if (ret.status) {

                                    }
                                });
                            } else {
                                var keys = '';
                                var values = '';
                                console.log(index);
                                console.log(taskid);
                                for (var j in obj.taskInfoList[index]) {
                                    var value = obj.taskInfoList[index][j] != null ? obj.taskInfoList[index][j] : '';
                                    keys += j + ',';
                                    values += '"' + value + '",';
                                };
                                keys = keys.substring(0, keys.length - 1);
                                values = values.substring(0, values.length - 1);
                                console.log(keys);
                                console.log(values);

                                // 插入数据到本地数据库
                                db.executeSql({
                                    name: 'xunjian',
                                    sql: 'INSERT INTO taskInfoList(' + keys + ') VALUES (' + values + ')'
                                }, function(ret, err) {
                                    if (ret.status) {

                                    }
                                });
                            }
                        }
                    });
                })(index);
            }
        } else {
            alert(getObj(err));
        }
    });
// console.log(getObj(obj.inspstandRelProjInfoList[0]));
    // 创建表 INSPSTANDRELPROJINFOLIST
    db.executeSql({
        name: 'xunjian',
        sql: INSPSTANDRELPROJINFOLIST
    }, function(ret, err) {
        if (ret.status) {
            //  循环列表数据
            for (var i = 0; i < obj.inspstandRelProjInfoList.length; i++) {
                var index = i;
                //  验证此数据是否已存在本地数据库
                (function(index) {
                    var id = obj.inspstandRelProjInfoList[index]['id'];
                    db.selectSql({
                        name: 'xunjian',
                        sql: 'SELECT * FROM inspstandRelProjInfoList WHERE id = "' + id + '"'
                    }, function(ret, err) {
                        if (ret.status) {
                            if (ret.data.length > 0) {
                                var values = '';
                                for (var j in obj.inspstandRelProjInfoList[index]) {
                                    var value = obj.inspstandRelProjInfoList[index][j] != null ? obj.inspstandRelProjInfoList[index][j] : '';
                                    values += j + '= "' + value + '",';
                                };
                                values = values.substring(0, values.length - 1);
                                // 更新数据到本地数据库
                                db.executeSql({
                                    name: 'xunjian',
                                    sql: 'UPDATE inspstandRelProjInfoList SET ' + values + 'WHERE id = "' + id + '"'
                                }, function(ret, err) {
                                    if (ret.status) {

                                    }
                                });
                            } else {
                                var keys = '';
                                var values = '';
                                for (var j in obj.inspstandRelProjInfoList[index]) {
                                    var value = obj.inspstandRelProjInfoList[index][j] != null ? obj.inspstandRelProjInfoList[index][j] : '';
                                    keys += j + ',';
                                    values += '"' + value + '",';
                                };
                                keys = keys.substring(0, keys.length - 1);
                                values = values.substring(0, values.length - 1);
                                console.log(keys);
                                console.log(values);

                                // 插入数据到本地数据库
                                db.executeSql({
                                    name: 'xunjian',
                                    sql: 'INSERT INTO inspstandRelProjInfoList(' + keys + ') VALUES (' + values + ')'
                                }, function(ret, err) {
                                    if (ret.status) {

                                    }
                                });
                            }
                        }
                    });
                })(index);
            }
        } else {
            alert(getObj(err));
        }
    });
    // 创建表 INSPSTANDRELPROJINFODETAILLIST
    db.executeSql({
        name: 'xunjian',
        sql: INSPSTANDRELPROJINFODETAILLIST
    }, function(ret, err) {
        if (ret.status) {
            //  循环列表数据
            // console.log(obj.inspstandRelProjInfoDetailList.length);
            for (var i = 0; i < obj.inspstandRelProjInfoDetailList.length; i++) {
                var index = i;
                //  验证此数据是否已存在本地数据库
                (function(index) {
                    var id = obj.inspstandRelProjInfoDetailList[index]['id'];
                    db.selectSql({
                        name: 'xunjian',
                        sql: 'SELECT * FROM inspstandRelProjInfoDetailList WHERE id = "' + id + '"'
                    }, function(ret, err) {
                        if (ret.status) {
                            // console.log(ret.data.length);
                            // console.log(index);
                            // console.log(id);
                            if (ret.data.length > 0) {
                                var values = '';
                                for (var j in obj.inspstandRelProjInfoDetailList[index]) {
                                    var value = obj.inspstandRelProjInfoDetailList[index][j] != null ? obj.inspstandRelProjInfoDetailList[index][j] : '';
                                    if (Array.isArray(value)) {
                                        value = JSON.stringify(value);
                                    }
                                    values += j + "= '" + value + "',";
                                };
                                values = values.substring(0, values.length - 1);
                                // console.log(values);
                                // 更新数据到本地数据库
                                db.executeSql({
                                    name: 'xunjian',
                                    sql: 'UPDATE inspstandRelProjInfoDetailList SET ' + values + 'WHERE id = "' + id + '"'
                                }, function(ret, err) {
                                    if (ret.status) {

                                    }
                                });
                            } else {
                                var keys = '';
                                var values = '';
                                for (var j in obj.inspstandRelProjInfoDetailList[index]) {
                                    var value = obj.inspstandRelProjInfoDetailList[index][j] != null ? obj.inspstandRelProjInfoDetailList[index][j] : '';
                                    if (Array.isArray(value)) {
                                        value = JSON.stringify(value);
                                    }
                                    keys += j + ',';
                                    values += "'" + value + "',";
                                };
                                keys = keys.substring(0, keys.length - 1);
                                values = values.substring(0, values.length - 1);
                                // console.log(values);
                                // 插入数据到本地数据库
                                console.log(keys);
                                console.log(values);

                                db.executeSql({
                                    name: 'xunjian',
                                    sql: 'INSERT INTO inspstandRelProjInfoDetailList(' + keys + ') VALUES (' + values + ')'
                                }, function(ret, err) {
                                    if (ret.status) {

                                    }else {
                                      //  console.log(JSON.stringify(err));
                                    }
                                });
                            }
                        }
                    });
                })(index);
            }
        } else {
            alert(getObj(err));
        }
    });
}


















/**
 * 添加数据
 */
function insertDb() {
    db.executeSql({
        name: 'xunjian',
        sql: 'INSERT INTO inspectionConduct(Id_P, LastName, FirstName, Address, City) VALUES (01, "jack", "rosr", "address", "Beijing")'
    }, function(ret, err) {
        if (ret.status) {
            alert('储存成功');
            //  selectDb();
        } else {
            alert(JSON.stringify(err));
        }
    });
}
/**
 * 查询表
 */
function selectDb() {
    db.selectSql({
        name: 'xunjian',
        sql: 'SELECT * FROM taskInfoList'
    }, function(ret, err) {
        if (ret.status) {
            alert(JSON.stringify(ret.data));
            // closeDb();
        } else {
            alert(JSON.stringify(err));
        }
    });
}
/**
 * 关闭数据库
 */

function closeDb() {
    db.closeDatabase({
        name: 'xunjian'
    }, function(ret, err) {
        if (ret.status) {
            alert('关闭成功');
        } else {
            alert(JSON.stringify(err));
        }
    });
}
