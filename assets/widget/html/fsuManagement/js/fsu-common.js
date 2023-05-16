/**
 * @author songjian
 * @description 公共的变量和方法
 */
/** FSU管控平台地址 */
const fsuUrl = 'http://180.153.49.213:8099'
// const fsuUrl = 'http://192.168.137.222:8080'
// const fsuUrl = 'http://192.168.74.185:8080' //本地
/** 初始化分页 */
const pagination = { pageNum: 1, pageSize: 10 }
/** 初始化登录用户信息 */
// const user = JSON.stringify($api.getStorage('FSU_USER'))
const user = {
    province: $api.getStorage('user').provinceid, // 默认0001931四川省分公司
    city: $api.getStorage('user').provinceid,
    country: $api.getStorage('user').countyid,
    vendors: [],
    menu: $api.getStorage('elementList'), // $api.getStorage('elementList')
}
/** 统一处理ajax请求 */
function request(param) {
    // console.log('user' +JSON.stringify($api.getStorage('FSU_USER'))) 
    const setting = {
        url: `${fsuUrl}${param.url}`,
        method: param.type || 'post',
        timeout: 120,
        headers: {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            // token: token
        }
    }
    if (param.type === 'post') {
        // 设置分域信息
        param.data.provinceids = user.province
        param.data.cityids = user.city
        param.data.countyids = user.country
        param.data.vendoridList = user.vendors
        setting.data = { body: param.data || {} }
    }
    console.log('setting' +JSON.stringify(setting)) 
    api.ajax(setting, (ret, err) => {
        api.hideProgress()
        if (ret) {
            if (ret.resultStat && ret.resultStat == '000') {
                param.success(ret)
            } else {
                console.log(JSON.stringify(ret))
                param.catch ? param.catch(ret) : ''
            }
        } else {
            console.log(JSON.stringify(err))
            param.catch ? param.catch(err) : ''
        }
    })
}

/** 页面跳转方法 */
function openPage(a, b, c) {
    console.log("open page:", a)
    openSingleWindow({
        url: `html/${a}.html`,
        name: b || '',
        title: b || '',
        offline: null,
        type: c || '',
        opaque: true,
        bounces: false,
        reload: false,
        allowEdit: true,
        slidBackEnabled: true,
        vScrollBarEnabled: false
    })
}

/** 设置长宽相等,返回dom */
function initMyChart(id) {
    const dom = $(`#${id}`)
    dom.height(dom.width())
    return document.getElementById(id)
}

/** 搜索区域显示/隐藏 */
function openQueryStation() {
    $('#queryStation').slideToggle()
}

/** 获取表单数据 */
function getSearchForm() {
    if (!searchFrom || searchFrom.length === 0) {
        return
    }
    const obj = {}
    searchFrom.forEach(item => {
        const dom = $(`#${item.name}`)
        if (dom && item.type === 'input') {
            obj[item.name] = dom.val()
        } else if (dom && item.type === 'select') {
            obj[item.name] = dom.val() == 'undefined' ? [] : [dom.val()]
        } else if (dom && item.type === 'select2') {
            obj[item.name] = dom.val() == 'undefined' ? '' : dom.val()
        }
    })
    console.log(JSON.stringify(obj))
    return search(obj)
}

/** 获取表单数据 */
function newGet() {
    if (!searchFrom || searchFrom.length === 0) {
        return
    }
    const obj = {}
    searchFrom.forEach(item => {
        const dom = $(`#${item.name}`)
        if (dom && item.type === 'input') {
            obj[item.name] = dom.val()
        } else if (dom && item.type === 'select') {
            obj[item.name] = dom.val() == 'undefined' ? [] : [dom.val()]
        } else if (dom && item.type === 'select2') {
            obj[item.name] = dom.val() == 'undefined' ? '' : dom.val()
        }
    })
    console.log('fsuId' + obj['fsuId'])
    if (!obj['fsuId']) {
        alert('请输入FSUID！！');
        return
    }
    return search(obj)
}

/** 重置表单 */
function reset() {
    if (!searchFrom || searchFrom.length === 0) {
        return
    }
    searchFrom.forEach(item => {
        const dom = $(`#${item.name}`)
        if (dom) {
            dom.val(undefined)
        }
    })
    if (pagination && pagination.pageNum && pagination.pageSize) {
        pagination.pageNum = 1
        pagination.pagesize = 10
    }
}

/** 加载更多 */
function handleMore() {
    pagination.pageSize += 10
    return getSearchForm()
}

/** 设置时间格式 */
function formatDate(time, format) {
    let t = new Date(time)
    let tf = function (i) {
        return (i < 10 ? '0' : '') + i
    }
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
            case 'yyyy':
                return tf(t.getFullYear())
            case 'MM':
                return tf(t.getMonth() + 1)
            case 'mm':
                return tf(t.getMinutes())
            case 'dd':
                return tf(t.getDate())
            case 'HH':
                return tf(t.getHours())
            case 'ss':
                return tf(t.getSeconds())
        }
    })
}

/** 赋值方法 根据id填充数据 */
function setDatas(data) {
    if (!data || data.length === 0) {
        return
    }
    data.forEach(item => {
        const dom = $(`#${item.id}`)
        if (dom) {
            switch (item.type) {
                case 'text':
                    dom.empty()
                    dom.append(item.value)
                    break
                case 'input':
                    dom.val(item.value)
                    break
                default:
                    dom.append(item.value)
                    break
            }
        }
    })
}

/** 获取页面上的数据 更新到data中 */
function getDatas(data) {
    if (!data || data.length === 0) {
        return
    }
    data.forEach(item => {
        const dom = $(`#${item.id}`)
        if (dom) {
            switch (item.type) {
                case 'text':
                    item.value = dom.text()
                    break
                case 'input':
                    item.value = dom.val()
                    break
            }
        }
    })
    return data
}

/** 打开输入密码界面 */
function openSharebox(html) {
    sharebox.init({
        frameBounces: true,
        cancelTitle: html ? '确定' : '取消',
        confirmTitle: html ? undefined : '确定',
        html: html || `<div style="text-align: center;margin-top:10px">为保证本次操作的安全性，请输入登陆密码！</div>
        <ul class="aui-list aui-form-list aui-sharebox-btn">
            <li class="aui-list-item">
                <div class="aui-row aui-row-padded">
                    <div class="aui-list-item-inner" style="">
                        <div class="aui-list-item-label">登录密码</div>
                        <div class="aui-list-item-input">
                            <input type="password" placeholder="请输入登录密码" id="pwd">
                        </div></div></div></li></ul>`,
    }, ret => {
        if (ret) {
            const dom1 = document.getElementById("button-index")
            const dom2 = document.getElementById("button-value")
            if (dom1) {
                dom1.textContent = ret.buttonValue
            }
            if (dom2) {
                dom2.textContent = ret.buttonValue
            }
        }
    })
}

/** 获取url参数 */
function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=")
        if (pair[0] == variable) { return pair[1] }
    }
    return (false)
}

function handleLocalStorage(method, key, value) {
    switch (method) {
        case 'get': {
            let temp = window.localStorage.getItem(key);
            if (temp) {
                return temp
            } else {
                return false
            }
        }
        case 'set': {
            window.localStorage.setItem(key, value);
            break
        }
        case 'remove': {
            window.localStorage.removeItem(key);
            break
        }
        default: {
            return false
        }
    }
}

/** 处理接口返回的数据 */
function resove(res) {
    if (typeof (res) === 'string') {
        res = JSON.parse(res)
    }
    const arr = []
    for (let key in res) {
        arr.push({ id: key, value: res[key] })
    }
    console.log(JSON.stringify(arr))
    return arr
}

/** 不为空校验 */
function isNotEmpty(obj) {
    if (!obj) {
        return false
    } else if (obj == null || obj == undefined || obj == '') {
        return false
    } else {
        return true
    }
}

/** 替换json字符串中的转义字符\ */
function myRegExp(str) {
    if (!str || str.length === 0) {
        return {}
    }
    const reg = new RegExp(/\\"/g);
    return str.replace(reg, "\"")
}

/** 记录列表缓存 */
function setCache(name, data) {
    const time = new Date()
    handleLocalStorage('set', name, JSON.stringify(data))
    handleLocalStorage('set', name + '-t', time.valueOf())
    console.log(`setcache - ${name} - ${time}`)
}

/** 统一处理页面缓存 */
function isCache(name) {
    // 查询是否有缓存
    const cache = handleLocalStorage('get', name)
    const cacheTime = handleLocalStorage('get', name + '-t')
    if (cache && cacheTime) {
        const time = new Date().valueOf()
        // 超时
        return time - cacheTime > 1000000 ? false : JSON.parse(cache)
    } else {
        return false
    }
}

/** 初始化查询form */
function initSearchForm(data, page) {
    buildFrom.init(data, page)
}

const buildFrom = {
    _default: [{ label: '查询', type: 'button', onclick: 'getSearchForm()', color: 'red' },
    { label: '重置', type: 'button', onclick: 'reset()', color: 'gray' }],
    _container: '',
    _data: [],
    _html: '',
    _color: {
        red: 'aui-btn-danger',
        green: 'aui-btn-success',
        gray: '',
        blue: 'aui-btn-primary',
    },
    init: function (data, page) {
        if (page === '阈值下发') {
            this._default =
                [{ label: '查询', type: 'button', onclick: 'getSearchForm()', color: 'red' },
                { label: '重置', type: 'button', onclick: 'reset()', color: 'gray' },
                { label: '最新阈值', type: 'button', onclick: 'newGet()', color: 'green' }];
        } else { 
            this._default =
                [{ label: '查询', type: 'button', onclick: 'getSearchForm()', color: 'red' },
                { label: '重置', type: 'button', onclick: 'reset()', color: 'gray' }];
        }
        this._data = data
        this._container = $('#my-form')
        this._container.empty()
        return !this._data || this._data.length == 0 || !this._container ? '' : this.build()
    },
    build: function () {
        this._html = `<ul class="aui-list aui-form-list">`
        this._data.forEach(item => {
            if (item.type === 'input') {
                this._html += `<li class="aui-list-item">
                        <div class="aui-list-item-inner">
                            <div class="aui-list-item-label">${item.label}</div>
                            <div class="aui-list-item-input">
                                <input type="text" placeholder="请输入${item.label}" id="${item.name}">
                            </div>
                        </div>
                    </li>`
            } else if (item.type === 'select' || item.type === 'select2') {
                let options = `<option value="undefined">全部</option>`
                item.options.forEach(i => {
                    options += `<option value="${i.value}">${i.label}</option>`
                })
                this._html += `<li class="aui-list-item">
                            <div class="aui-list-item-inner">
                                <div class="aui-list-item-label">${item.label}</div>
                                <div class="aui-list-item-input"><select id="${item.name}">${options}</select></div>
                            </div>
                        </li>`
            }
        })
        return this.addBtn()
    },
    addBtn: function () {
        // 如果没有传入btn就使用默认的
        this._data.some(i => i.type == 'button') ? '' : this._data.push(...this._default)
        this._html += `<li class="aui-list-item"><div class="aui-list-item-inner aui-list-item-center aui-list-item-btn">`
        this._data
            .filter(i => i.type == 'button')
            .forEach(item => this._html += `<div class="aui-btn ${this.color(item.color)} aui-margin-r-5" onclick="${item.onclick}">${item.label}</div>`)
        this._html += `</div></li></ul>`
        return this.appendHtml()
    },
    color: function (color) {
        return !color || color.length === 0 ? '' : this._color[color]
    },
    appendHtml: function () {
        // console.log(this._html)
        this._container.append(this._html)
    }
}

/** 查询告警颜色和等级 */
function alarmInfo(level) {
    if (!level || level.length == 0) {
        return
    }
    let obj = { _name: '', _color: '' }
    switch (level) {
        case '1':
            obj._name = '一级告警'
            obj._color = 'red'
            break
        case '2':
            obj._name = '二级告警'
            obj._color = 'orange'
            break
        case '3':
            obj._name = '三级告警'
            obj._color = 'blue'
            break
        case '4':
            obj._name = '四级告警'
            obj._color = 'gray'
            break
        default:
            obj._name = '其他告警'
            obj._color = 'gray'
            break
    }
    return obj
}

/** 厂家信息 */
const vendors = [{ "label": "艾默生", "value": "AMS" },
{ "label": "艾赛科技", "value": "ASKJ" },
{ "label": "保定天河", "value": "BDTH" },
{ "label": "广州邦讯", "value": "BONSONINFO" },
{ "label": "成都四方", "value": "CDSF" },
{ "label": "创力电子", "value": "CLDZ" },
{ "label": "重庆瑞盾", "value": "CQRD" },
{ "label": "传通科技", "value": "CTKJ" },
{ "label": "重邮汇测", "value": "CYHC" },
{ "label": "中达电通", "value": "DELTA" },
{ "label": "动力源", "value": "DLY" },
{ "label": "大唐移动", "value": "DTYD" },
{ "label": "广东海悟", "value": "GDHW" },
{ "label": "高新兴", "value": "GXX" },
{ "label": "宏光星宇", "value": "HGXY" },
{ "label": "华为", "value": "HW" },
{ "label": "吉林施泰", "value": "JLST" },
{ "label": "金名正元", "value": "JMZY" },
{ "label": "江苏亚奥", "value": "JSYAAO" },
{ "label": "康大诚泰", "value": "KDCT" },
{ "label": "美迪特", "value": "MDT" },
{ "label": "有方科技", "value": "NEOWAY" },
{ "label": "南京贝龙", "value": "NJBL" },
{ "label": "南京绿承", "value": "NJLC" },
{ "label": "西安赛尔", "value": "SAIERCOM" },
{ "label": "三重海至", "value": "SCHZ" },
{ "label": "瑞祺皓迪", "value": "SJRE" },
{ "label": "深圳海能", "value": "SZHAINENG" },
{ "label": "苏州云博", "value": "SZYB" },
{ "label": "通鼎义益", "value": "TDYY" },
{ "label": "未知", "value": "UNKNOWN" },
{ "label": "沃泰通", "value": "WTT" },
{ "label": "西安光谷防务", "value": "XAGG" },
{ "label": "易事特", "value": "YISITE" },
{ "label": "亚讯星科", "value": "YXXK" },
{ "label": "珠海安科", "value": "ZHSAK" },
{ "label": "中浩万维", "value": "ZHWW" },
{ "label": "浙江大华", "value": "ZJDH" },
{ "label": "中交信达", "value": "ZJXD" },
{ "label": "中兴力维", "value": "ZXLW" },
{ "label": "中移铁通", "value": "ZYTT" }
]

const equipType = [
    { "label": "空调", "value": "air" },
    { "label": "门禁", "value": "access" },
]