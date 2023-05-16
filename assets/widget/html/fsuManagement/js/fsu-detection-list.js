/** 设备列表(信号) */
function initEquipList(res) {
    console.log('initEquipList')
    const dom = $('#content')
    // 清空content
    dom.empty()
    const data = res.data.resultList
    // 记录缓存
    setCache('equip-list', res)
    if (!dom || !data || data.length === 0) {
        return dom.append('<div class="more">暂无数据</div>')
    }
    let html = ''
    data.forEach(item => {
        html += `<div class="box-cpn cpn">
        <h4>
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

// 是被实时性能
function initEquipPerformanceList() {

}

// 设备告警列表
function initEquipAlarmList(res) {
    console.log('initEquipAlarmList')
    const dom = $('#content')
    // 清空content
    dom.empty()
    const data = res.data.resultList
    // 不记录缓存
    // setCache('alarm-list', res)
    if (!dom || !data || data.length === 0) {
        dom.append('<div class="more">暂无活动告警</div>')
        return
    }
    let html = ''
    data.forEach(item => {
        const ai = alarmInfo(item.ALARMLEVEL)
        html += `<div class="box-cpn cpn">
        <h4>
            <div class="point point-${ai._color}"></div>
            <strong class="text-${ai._color} margin-r-10">${ai._name}</strong>
            <strong class="text margin-r-10">${item.CODE}</strong>
        </h4>
        <div class="padding-10 text">
            FSUID:${item.OBJID}</br>
            告警时间:${item.FIRSTALARMTIME}</br>
            ${item.OBJNAME}</br>
            ${item.PROVINCENAME} | ${item.CITYNAME} | ${item.COUNTRYNAME}
        </div>
    </div>`
    })
    html += '<div class="more" id="more" onclick="handleMore()">加载更多…</div>'
    dom.append(html)
}

function initAlarmList(res) {
    console.log('initAlarmList')
    const dom = $('#content')
    // 清空content
    dom.empty()
    const data = res.data.resultList
    // 记录缓存
    setCache('alarm-list', res)
    if (!dom || !data || data.length === 0) {
        dom.append('<div class="more">暂无活动告警</div>')
        return
    }
    let html = ''
    data.forEach(item => {
        const ai = alarmInfo(item.ALARMLEVEL)
        html += `<div class="box-cpn cpn">
        <h4>
            <div class="point point-${ai._color}"></div>
            <strong class="text-${ai._color} margin-r-10">${ai._name}</strong>
            <strong class="text margin-r-10">${item.CODE}</strong>
        </h4>
        <div class="padding-10 text">
            FSUID:${item.OBJID}</br>
            ${item.OBJNAME}</br>
            ${item.PROVINCENAME} | ${item.CITYNAME} | ${item.COUNTRYNAME}
            <div class="detail aui-label aui-label-danger margin-r-10" style="float: right;">
                <label>详细信息><button style="display: none" onclick='openDetail(${JSON.stringify(item)},"detail")'></button></label>
            </div>
        </div>
    </div>`
    })
    html += '<div class="more" id="more" onclick="handleMore()">加载更多…</div>'
    dom.append(html)
} 

// 不包含详情按钮 尽量显示字段
function initAlarmListByFSU(res) {
    console.log('initAlarmList')
    const dom = $('#content')
    // 清空content
    dom.empty()
    const data = res.data.resultList
    // 不记录缓存
    // setCache('alarm-list', res)
    if (!dom || !data || data.length === 0) {
        dom.append('<div class="more">暂无活动告警</div>')
        return
    }
    let html = ''
    data.forEach(item => {
        const ai = alarmInfo(item.ALARMLEVEL)
        html += `<div class="box-cpn cpn">
        <h4>
            <div class="point point-${ai._color}"></div>
            <strong class="text-${ai._color} margin-r-10">${ai._name}</strong>
            <strong class="text margin-r-10">${item.CODE}</strong>
        </h4>
        <div class="padding-10 text">
            FSUID:${item.OBJID}</br>
            告警时间:${item.FIRSTALARMTIME}</br>
            ${item.OBJNAME}</br>
            ${item.PROVINCENAME} | ${item.CITYNAME} | ${item.COUNTRYNAME}
        </div>
    </div>`
    })
    html += '<div class="more" id="more" onclick="handleMore()">加载更多…</div>'
    dom.append(html)
} 