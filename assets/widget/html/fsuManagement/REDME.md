@auther: songjian  @date: 2020/12/11 
# 关于铁塔APP
## 1.入口按钮
	FSU管理的按钮在 综合管理-动环监控 下
	首先登录用户必须要有查看 综合管理-动环监控 的权限
	APP的权限由运监平台配置，如果当前人员的权限项编号包含FSU管理(权限项编号:F_PORTAL)则能够显示FSU管理按钮
	按钮默认隐藏，控制按钮显示的代码如下
``` javascript
// html/home/script/home_frm.js
else if( elementList[i] == 'F_PORTAL') {
	$api.byId('fsuMgmt').style.display = ''
}
```
## 2.FSU管理的功能
	FSU管理共有四部分功能：运维概览，FUS监测，FSU远程控制，配置变更(分别对应代码中的overview,fsuDetection,remoteControl,configurationChanges四个文件夹)
	除此之外还有一个测试页面(test.html)，用于测试数据和样式
	fsuCommon.js初始化时声明了一个user，用于存放当前用户的数据
	user初始化时menu为当前用户的权限清单，其他为空(引入index.html页面时额外查询)
``` javascript
// fsuCommon.js 
const user = {
    province: ['0001931'], // 可查询数据的省分，为空是则为全部
    city: [],
    country: [],
    vendors: [], // 暂定为可查询的厂家 未使用
    menu: $api.getStorage('elementList'), // 权限清单
}
```
``` javascript
// 根据权限列表展示菜单
const menus = {
	ids: {
		overview: ['FSU_OVERVIEW', 'ALARM_OVERVIEW', 'ALARM_LIST'],
		fsuDetection: ['FSU_LIST', 'EQUIP_LIST'],
		remoteControl: ['FSU_RESTART_LIST', 'FSU_UPGRADE_LIST', 'EQUIP_ISSU_LIST', 'EQUIP_CONTROL_LIST'],
		configurationChanges: ['SETTING_LIST', 'SETTING_APPLY', 'SETTING_APPROVE']
	},
	isShow: function () {
		if (user.menu.length > 0) {
			if (user.menu.some(i => i === 'all')) {
				for (let i in this.ids) {
					this.ids[i].forEach(o => {
						$(`#${o}`).show()
					})
					$(`#${i}`).show()
				}
			} else {
				for (let item in this.ids) {
					let flag = false
					this.ids[item].forEach(i => {
						if (user.menu.some(o => o == i)) {
							$(`#${i}`).show()
							flag = true
						}
					})
					flag ? $(`#${item}`).show() : ''
				}
			}
		}
		$('.wrapper').show()
		return api.hideProgress()
	}
}
```
## 3.分域
	分域需要使用user中的其他参数(province,city,country)
	获取分域数据的流程为:用户进入FSU管理页面 -> 调用FSU管控平台查询当前用户的地域信息 -> 返回数据放入user中
	后续每当调用POST请求时，都会在请求参数中添加地域信息，FSU管控平台根据参数控制查询的信息
> FSU管控平台查询分域信息的逻辑规则
> 
> 1.前端传入参登录用户名(例: {loginName: 'sa' })
> 
> 2.管控平台查询运检平台数据库，只返回当前角色最高的权限
> 
> 3.比如 sa 查询权限为全国，则返回province中包含所有省分编号(包含所有省分和返回空的作用相同，都是无限制)
> 
> 4.再比如 sc 权限为济南，则province返回空，city返回济南的编号，country返回空
``` javascript
// fsuCommon.js中统一封装的ajax配置
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
```
## 4.附 权限编码
``` javascript
overview: ['FSU_OVERVIEW', 'ALARM_OVERVIEW', 'ALARM_LIST'],
fsuDetection: ['FSU_LIST', 'EQUIP_LIST'],
remoteControl: ['FSU_RESTART_LIST', 'FSU_UPGRADE_LIST', 'EQUIP_ISSU_LIST', 'EQUIP_CONTROL_LIST'],
configurationChanges: ['SETTING_LIST', 'SETTING_APPLY', 'SETTING_APPROVE']	
```