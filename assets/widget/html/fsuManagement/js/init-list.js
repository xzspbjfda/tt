/**
 * @author songjian
 * @description 拼接HTML 渲染页面
 */
/** 初始化fsu远程重启列表 */
function initFsuList(res) {
    console.log('initFsuList')
    const dom = $('#content')
    // 清空content
    dom.empty()
    const data = res.data.list
    // 记录缓存
    setCache('restart-list', res)
    if (!dom || !data || data.length === 0) {
        dom.append('<div class="more">暂无数据</div>')
        return
    }
    let html = ''
    data.forEach(item => {
        const _color = item.registstatusName === '在线' ? 'green' : 'red'
        html += `<div class="box-cpn cpn">
        <h4>
            <div class="point point-${_color}"></div>
            <strong class="text-${_color} margin-r-10">${item.registstatusName}</strong>
            <strong class="text">${item.name}</strong>
        </h4>
        <div class="padding-10 text">
            ${item.roomname} | ${item.vendorName}
            <div class="detail aui-label aui-label-danger margin-r-10" style="float: right;">
                <label>详细信息><button style="display: none" onclick='openDetail(${JSON.stringify(item)},"operate")'></button></label>
            </div>
        </div>
    </div>`
    })
    html += '<div class="more" id="more" onclick="handleMore()">加载更多…</div>'
    dom.append(html)
}

/** fsu远程重启结果列表 */
function initRestartRecordList(res) {
    console.log('initRestartRecordList')
    const dom = $('#content')
    // 清空content
    dom.empty()
    const data = res.data.resultList
    // 记录缓存
    setCache('restart-list', res)
    if (!dom || !data || data.length === 0) {
        dom.append('<div class="more">暂无数据</div>')
        return
    }
    let html = ''
    data.forEach(item => {
        let statusName = ''
        let _color
        if (item.status === '0') {
            statusName = '重启中'
            _color = 'orange'
        } else if (item.status === '1') {
            statusName = '成功'
            _color = 'green'
        } else {
            statusName = '失败'
            _color = 'red'
        }
        item.targetInfo = JSON.parse(myRegExp(item.targetInfo))
        for (let key in item.targetInfo) {
            item[key] = item.targetInfo[key]
        }
        html += `<div class="box-cpn cpn">
        <h4>
            <div class="point point-${_color}"></div>
            <strong class="text-${_color} margin-r-10">${statusName}</strong>
            <span class="text-gray">${item.createTime} | ${item.operator}</span>
        </h4>
        <div class="padding-10 text">
            <strong class="text">${item.name}</strong></br>
            ${item.stationname}</br>
            ${item.vendorName} | ${item.fsuid}
            <div class="detail aui-label aui-label-danger margin-r-10" style="float: right;">
                <label>详细信息><button style="display: none" onclick='openDetail(${JSON.stringify(item)},"record")'></button></label>
            </div>
        </div>
    </div>`
    })
    html += '<div class="more" id="more" onclick="handleMore()">加载更多…</div>'
    dom.append(html)
}

/** 初始化设备远程控制列表 */
function initEquipControlList(res) {
    console.log('initEquipControlList')
    const dom = $('#content')
    // 清空content
    dom.empty()
    const data = res.data.resultList
    // 记录缓存
    setCache('equip-control', res)
    if (!dom || !data || data.length === 0) {
        dom.append('<div class="more">暂无数据</div>')
        return
    }
    let html = ''
    data.forEach(item => {
        item.status = item.thValue == '1' ? '开启' : '关闭'
        html += `<div class="box-cpn cpn">
        <h4 style="padding: 0 0 10px 10px;">
            <input type="checkbox" style="float:right;margin-right:15px;" disabled class="aui-switch" ${item.status === 'true' ? `checked=""` : ''}>
            <strong class="text margin-r-10">${item.devType}</strong>
            <strong class="text">${item.midName}</strong>
        </h4>
        <div class="padding-10 text">
            ${item.stationName} | ${item.stationId}</br>
            ${item.deviceName || null}</br>
            ${item.provinceName || null} | ${item.cityName || null} | ${item.countryName || null}
            <div class="detail aui-label aui-label-danger margin-r-10" style="float: right;">
                <label>详细信息><button style="display: none" onclick='openDetail(${JSON.stringify(item)},"operate")'></button></label>
            </div>
        </div>
    </div>`
    })
    html += '<div class="more" id="more" onclick="handleMore()">加载更多…</div>'
    dom.append(html)
}

/** 设备远程控制结果列表 */
function initEquipControlRecordList(res) {
    console.log('initRestartRecordList')
    const dom = $('#content')
    // 清空content
    dom.empty()
    const data = res.data.resultList
    // 记录缓存
    setCache('equip-control', res)
    if (!dom || !data || data.length === 0) {
        dom.append('<div class="more">暂无数据</div>')
        return
    }
    let html = ''
    data.forEach(item => {
        let statusName = ''
        let _color
        if (item.status === '0') {
            statusName = '执行中'
            _color = 'orange'
        } else if (item.status === '1') {
            statusName = '成功'
            _color = 'green'
        } else {
            statusName = '失败'
            _color = 'red'
        }
        let tinfo = JSON.parse(myRegExp(item.targetInfo))
        tinfo.rstatus = tinfo.status
        tinfo.status = item.status
        item.targetInfo = tinfo
        item.statusName = statusName
        for (let key in item.targetInfo) {
            item[key] = item.targetInfo[key]
        }
        html += `<div class="box-cpn cpn">
        <h4>
            <div class="point point-${_color}"></div>
            <strong class="text-${_color} margin-r-10">${statusName}</strong>
            <span class="text-gray">${item.createTime} | ${item.operator}</span>
        </h4>
        <div class="padding-10 text">
            <strong class="text">${item.devType}</strong></br>
            ${item.midName}</br>
            ${item.provinceName} | ${item.cityName} | ${item.countryName}
            <div class="detail aui-label aui-label-danger margin-r-10" style="float: right;">
                <label>详细信息><button style="display: none" onclick='openDetail(${JSON.stringify(item)},"record")'></button></label>
            </div>
        </div>
    </div>`
    })
    html += '<div class="more" id="more" onclick="handleMore()">加载更多…</div>'
    dom.append(html)
}

/** 初始化阈值下发列表 */
function initEquipIssuList(res,cacheName) {
    console.log('initEquipIssuList')
    const dom = $('#content')
    // 清空content
    dom.empty()
    const data = res.data.resultList
    // 记录缓存
    setCache(cacheName, res)
    if (!dom || !data || data.length === 0) {
        console.log(!dom, !data, data.length === 0)
        dom.append('<div class="more">暂无数据</div>')
        return
    }
    let html = ''
    data.forEach(item => {
        html += `<div class="box-cpn cpn">
        <h4>
            <strong class="text-red margin-r-10">${item.thValue}</strong>
            <strong class="text margin-r-10">${item.devType}</strong>
            <strong class="text">${item.midName}</strong>
        </h4>
        <div class="padding-10 text">
            ${item.stationName} | ${item.stationId}</br>
            ${item.deviceName || null}</br>
            ${item.provinceName || null} | ${item.cityName || null} | ${item.countryName || null}
            <div class="detail aui-label aui-label-danger margin-r-10" style="float: right;">
                <label>详细信息><button style="display: none" onclick='openDetail(${JSON.stringify(item)},"operate")'></button></label>
            </div>
        </div>
    </div>`
    })
    html += '<div class="more" id="more" onclick="handleMore()">加载更多…</div>'
    dom.append(html)
}

/** 阈值下发结果列表 */
function initEquipIssuRecordList(res,cacheName) {
    console.log('initRestartRecordList')
    const dom = $('#content')
    // 清空content
    dom.empty()
    const data = res.data.resultList
    // 记录缓存
    setCache(cacheName, res)
    if (!dom || !data || data.length === 0) {
        dom.append('<div class="more">暂无数据</div>')
        return
    }
    let html = ''
    data.forEach(item => {
        let statusName = ''
        let _color
        if (item.status === '0') {
            statusName = '下发中'
            _color = 'orange'
        } else if (item.status === '1') {
            statusName = '成功'
            _color = 'green'
        } else {
            statusName = '失败'
            _color = 'red'
        }
        item.statusName = statusName
        item.targetInfo = JSON.parse(myRegExp(item.targetInfo))
        for (let key in item.targetInfo) {
            item[key] = item.targetInfo[key]
        }
        html += `<div class="box-cpn cpn">
        <h4>
            <div class="point point-${_color}"></div>
            <strong class="text-${_color} margin-r-10">${statusName}</strong>
            <span class="text-gray">${item.createTime} | ${item.operator}</span>
        </h4>
        <div class="padding-10 text">
            <strong class="text">${item.devType}</strong></br>
            ${item.midName}</br>
            ${item.provinceName} | ${item.cityName} | ${item.countryName}
            <div class="detail aui-label aui-label-danger margin-r-10" style="float: right;">
                <label>详细信息><button style="display: none" onclick='openDetail(${JSON.stringify(item)},"record")'></button></label>
            </div>
        </div>
    </div>`
    })
    html += '<div class="more" id="more" onclick="handleMore()">加载更多…</div>'
    dom.append(html)
}

/** 初始化远程调整列表 */
function initRemoteList(res) {
    console.log('initRemoteList')
    const dom = $('#content')
    // 清空content
    dom.empty()
    const data = res.data.resultList
    // 记录缓存
    setCache('remote-adjustment', res)
    if (!dom || !data || data.length === 0) {
        console.log(!dom, !data, data.length === 0)
        dom.append('<div class="more">暂无数据</div>')
        return
    }
    let html = ''
    data.forEach(item => {
        console.log('initRemoteList'+JSON.stringify(item))
        html += `<div class="box-cpn cpn">
        <h4>
            <strong class="text-red margin-r-10">${item.thValue}</strong>
            <strong class="text margin-r-10">${item.devType}</strong>
            <strong class="text">${item.midName}</strong>
        </h4>
        <div class="padding-10 text">
            ${item.stationName} | ${item.stationId}</br>
            ${item.deviceName || null}</br>
            ${item.provinceName || null} | ${item.cityName || null} | ${item.countryName || null}
            <div class="detail aui-label aui-label-danger margin-r-10" style="float: right;">
                <label>详细信息><button style="display: none" onclick='openDetail(${JSON.stringify(item)},"operate")'></button></label>
            </div>
        </div>
    </div>`
    })
    html += '<div class="more" id="more" onclick="handleMore()">加载更多…</div>'
    dom.append(html)
}



/** 初始化任务配置列表 */
function initTaskList(res) {
    console.log('initTaskList')
    const dom = $('#content')
    // 清空content
    dom.empty()
    const data = res.data.list
    // 记录缓存
    setCache('configuration-query', res)
    if (!dom || !data || data.length === 0) {
        console.log(!dom, !data, data.length === 0)
        dom.append('<div class="more">暂无数据</div>')
        return
    }
    let html = ''
    data.forEach(item => {
        // <strong class="text margin-r-10">${item.devType}2</strong>
        // <strong class="text">${item.midName}3</strong>
        let name = item.name.split('/')[1]
        console.log('初始化任务配置列表initTaskList'+JSON.stringify(item))
        html += `<div class="box-cpn cpn">
        <h4>
            <strong class="text-red margin-r-10">${item.FSUNAME}</strong>
        </h4>
        <div class="padding-10 text">
            ${item.CITYNAME}  ${item.COUNTRYNAME} | ${item.FSUID}</br>
            下挂设备名称   ${name}
            <div class="detail aui-label aui-label-danger margin-r-10" style="float: right;">
                <label>详细信息><button style="display: none" onclick='openDetail(${JSON.stringify(item)},"operate")'></button></label>
            </div>
        </div>
    </div>`
    })
    html += '<div class="more" id="more" onclick="handleMore()">加载更多…</div>'
    dom.append(html)
}