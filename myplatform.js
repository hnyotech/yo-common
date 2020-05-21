import Vue from 'vue'
import store from '@/store'

(function (factory) {
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        var target = module['exports'] || exports
        factory(target)
    } else {
        factory(window['astec'] = {})
    }
}(function (utExports) {
    'use strict'

    var astec = typeof utExports !== 'undefined' ? utExports : {}

    var odataRequestUrl = '/api/crmdata/'

    astec.getLable = function (vm, label, value) {
        if (!astec.isNullOrWhiteSpace(value)) {
        }
        return '123'
    }
    var dateT = Date
    dateT.prototype.getZoneTime = function (isDateTime) {
        var a
        var defaultTimeZone = a || -8
        var date = new Date(this)
        var d = new Date()
        var realTimeZoneOffset = defaultTimeZone - d.getTimezoneOffset() / 60
        var timeWithTimezone = new Date(date.getTime() + realTimeZoneOffset * 3600000)
        if (isDateTime) {
            return astec.formatDateTime(timeWithTimezone, 'yyyy-mm-dd HH:MM:ss')
        }
        return astec.formatDateTime(timeWithTimezone, 'yyyy-mm-dd')
    }

    dateT.prototype.getSystemTime = function (isDateTime) {
        var a
        var defaultTimeZone = a || -8
        var date = new Date(this)
        var d = new Date().getTimezoneOffset()
        var realTimeZoneOffset = d / 60 - defaultTimeZone
        var timeWithTimezone = null
        if (isDateTime) {
            timeWithTimezone = new Date(date.getTime() + realTimeZoneOffset * 3600000)
            return astec.formatDateTime(timeWithTimezone, 'yyyy-mm-dd HH:MM:ss')
        }
        timeWithTimezone = (d > 0) ? new Date(date.getTime() + 24 * 3600000) : new Date(date.getTime())
        return astec.formatDateTime(timeWithTimezone, 'yyyy-mm-dd')
    }

    /**
     * 异步创建实体记录
     * @param  {String} entitySetName 实体的逻辑名称(复数)
     * @param  {[type]} entity        要创建的记录对象，属性是要创建的记录的字段名称，属性值是字段的值
     * @return {Promise}               [description]
     */
    astec.createAsync = function (entitySetName, entity) {
        return new Promise(function (resolve, reject) {
            if (!astec.isString(entitySetName)) {
                throw new Error('astec.createAsyn entitySetName parameter must be a string.')
            }
            if (astec.isNull(entity)) {
                throw new Error('astec.createAsyn entity parameter must not be null or undefined.')
            }

            astec.post(odataRequestUrl + 'create/' + entitySetName, entity)
                .then(function (res) {
                    resolve(res.headers['odata-entityid'].split('(')[1].replace(')', ''))
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }
    /**
     * 数据深拷贝
     */
    astec.deepCopy = function (arr) {
        // var obj=arr.constructor==Array?[]:{};
        // 第二种方法 var obj=arr instanceof Array?[]:{}
        var obj = Array.isArray(arr) ? [] : {}// 第三种方法
        for (var item in arr) {
            if (typeof arr[item] === 'object' && arr[item] !== null) {
                obj[item] = astec.deepCopy(arr[item])
            } else {
                obj[item] = arr[item]
            }
        }
        return obj
    }
    // 表单验证手机号
    var regMobile = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
    astec.checkMoble = (rule, value, callback) => {
        if (!value) {
            return callback(new Error('手机号不能为空，请输入'))
        }
        setTimeout(() => {
            if (value.toString().length !== 11) {
                callback(new Error('手机号长度为11位，请重新输入'))
            } else {
                let flag = regMobile.test(value)
                if (flag === false) {
                    callback(new Error('手机号格式不正确，请重新输入'))
                    return
                }
                callback()
            }
        }, 500)
    }
    astec.checkMobleNotR = (rule, value, callback) => {
        if (!value) {
            return callback()
        }
        setTimeout(() => {
            if (value.toString().length !== 11) {
                callback(new Error('手机号长度为11位，请重新输入'))
            } else {
                let flag = regMobile.test(value)
                if (flag === false) {
                    callback(new Error('手机号格式不正确，请重新输入'))
                    return
                }
                callback()
            }
        }, 500)
    }
    // var regEmail = /^([a-zA-Z]|[0-9])(\w|\.-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
    var regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    astec.checkEmail = (rule, value, callback) => {
        let flag = regEmail.test(value)
        if (!flag) {
            callback(new Error('无效邮箱格式，请重新输入'))
        } else {
            callback()
        }
    }
    astec.checkEmail2 = (rule, value, callback) => {
        if (!value) {
            return callback()
        }
        let flag = regEmail.test(value)
        if (!flag) {
            callback(new Error('无效邮箱格式，请重新输入'))
        } else {
            callback()
        }
    }
    // 长度验证 数字或字母
    var regLegth = /^[0-9a-zA-Z]{18}$/
    astec.checkLength = (rule, value, callback) => {
        let flag = regLegth.test(value)
        if (!flag) {
            callback(new Error('限制18位数字或字母，请重新输入'))
        } else {
            callback()
        }
    }
    astec.notRequired18 = (rule, value, callback) => {
        if (!value) {
            return callback()
        }
        let flag = regLegth.test(value)
        if (!flag) {
            callback(new Error('限制18位数字或字母，请重新输入'))
        } else {
            callback()
        }
    }

    // 验证 数字或字母
    var regContentLegth = /^[0-9a-zA-Z]{1,18}$/
    astec.checkContent = (rule, value, callback) => {
        let flag = regContentLegth.test(value)
        if (!flag) {
            callback(new Error('必须是数字或字母，请重新输入'))
        } else {
            callback()
        }
    }

    // 长度验证 数字
    var regNumLegth = /^[0-9]{8,30}$/
    astec.checkBangAccount = (rule, value, callback) => {
        let flag = regNumLegth.test(value)
        if (!flag) {
            callback(new Error('限制8到30位数字，请重新输入'))
        } else {
            callback()
        }
    }

    // 验证数字，两位小数
    var regNumber = /^\d+(\.\d{0,2})?$/
    astec.checkNumber = (rule, value, callback) => {
        let flag = regNumber.test(value)
        if (!flag) {
            callback(new Error('限制非零数字且最多为两位小数'))
        } else {
            let valueTemp = value - 0
            if (valueTemp <= 0) {
                callback(new Error('限制非零数字且最多为两位小数'))
            } else {
                callback()
            }
        }
    }
    // 验证数字小数长度为4位
    var regNumber6 = /^\d+(\.\d{0,6})?$/
    astec.checkNumber6 = (rule, value, callback) => {
        let flag = regNumber6.test(value)
        if (!flag) {
            callback(new Error('限制非零数字且最多为六位小数'))
        } else {
            let valueTemp = value - 0
            if (valueTemp <= 0) {
                callback(new Error('限制非零数字且最多为六位小数'))
            } else {
                callback()
            }
        }
    }
    // 验证数字，两位小数 非必填
    astec.checkNumber2 = (rule, value, callback) => {
        if (!value) {
            return callback()
        }
        let flag = regNumber.test(value)
        if (!flag) {
            callback(new Error('限制非零数字且最多为两位小数'))
        } else {
            let valueTemp = value - 0
            if (valueTemp <= 0) {
                callback(new Error('限制非零数字且最多为两位小数'))
            } else {
                callback()
            }
        }
    }
    // 验证正整数
    // /^(0+)|[^\d]+/g 正整数以外的符号
    // var regNumberNonNegative=/^\d+$/ 非负整数
    var regNumberNonNegative = /^[1-9]\d*$/
    astec.checkNumberD = (rule, value, callback) => {
        if (!value) {
            return callback()
        }
        let flag = regNumberNonNegative.test(value)
        if (!flag) {
            callback(new Error('限制正整数，请重新输入'))
        } else {
            callback()
        }
    }
    // 验证是否数字
    var regIsNumber = /^[0-9]*$/
    astec.checkIsNumber = (rule, value, callback) => {
        if (!value) {
            return callback()
        }
        let flag = regIsNumber.test(value)
        if (!flag) {
            callback(new Error('请输入数字'))
        } else {
            callback()
        }
    }

    // 验证 数字可以是正数,负数和0, 且最多为两位小数
    astec.twoDecimal = (rule, value, callback) => {
        if (!value) {
            return callback()
        }
        let reg = /^(-)?(0|[1-9][0-9]*)(\.\d{1,2})?$/
        let flag = reg.test(value)
        if (!flag) {
            callback(new Error('请输入数字且最多保留两位小数'))
        } else {
            callback()
        }
    }
    // 验证 数字可以是正数,0, 且最多为两位小数
    astec.positiveNum = (rule, value, callback) => {
        if (!value) {
            return callback()
        }
        let reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
        let flag = reg.test(value)
        if (!flag) {
            callback(new Error('请输入大于或等于零的数字且最多保留两位小数'))
        } else {
            callback()
        }
    }

    // 邮箱验证
    /**
     * 异步删除一条记录
     * @param  {string} entitySetName 实体的逻辑名称(复数)
     * @param  {string} entityId      实体记录的主键，GUID
     * @return {Promise}               [description]
     */
    astec.deleteAsync = function (entitySetName, entityId) {
        return new Promise(function (resolve, reject) {
            if (!astec.isString(entitySetName)) {
                throw new Error('astec.deleteAsyn entitySetName parameter must be a string.')
            }
            if (!astec.isString(entityId)) {
                throw new Error('astec.deleteAsyn entityId parameter must be a string.')
            }

            astec.post(odataRequestUrl + 'delete/' + entitySetName + '(' + entityId.replace('{', '').replace('}', '') + ')')
                .then(function (res) {
                    resolve(res.status)
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }

    /**
     * 根据ID异步查询单条数据
     * @param  {string} entitySetName 要查询的实体复数名称(ID)
     * @param  {boolean} formatted 是否格式化
     * @return {Promise}           [description]
     */
    astec.retrieveAsync = function (queryString, useFormattedValue) {
        return new Promise(function (resolve, reject) {
            if (!astec.isString(queryString)) {
                throw new Error('astec.retrieve queryString parameter must be a string.')
            }
            if (!astec.isBoolean(useFormattedValue)) {
                throw new Error('astec.retrieveMultiple useFormattedValue parameter must be a boolean.')
            }
            var url = odataRequestUrl + 'Retrieve/' + queryString

            // 添加头部
            let config = {}
            if (useFormattedValue) {
                config = {
                    headers: {
                        Prefer: 'odata.include-annotations="OData.Community.Display.V1.FormattedValue"'
                    }
                }
            }
            astec.get(url, config)
                .then(function (res) {
                    resolve(res.data)
                })
                .catch(function (err) {
                    resolve(err)
                })
        })
    }

    /**
     * 异步查询多条数据
     * @param  {string} queryString 查询字符串，包括实体的逻辑名称(复数)
     * @param  {boolean} formatted 返回的结果是否格式化
     * @return {Promise}           [description]
     */
    astec.retrieveMultipleAsync = function (queryString, useFormattedValue) {
        return new Promise(function (resolve, reject) {
            if (!astec.isString(queryString)) {
                throw new Error('astec.retrieveMultiple queryString parameter must be a string.')
            }
            if (!astec.isBoolean(useFormattedValue)) {
                throw new Error('astec.retrieveMultiple useFormattedValue parameter must be a boolean.')
            }
            var url = odataRequestUrl + 'Retrieve/' + queryString

            // 添加头部
            let config = {}
            if (useFormattedValue) {
                config = {
                    headers: {
                        Prefer: 'odata.include-annotations="OData.Community.Display.V1.FormattedValue"'
                    }
                }
            }

            astec.get(url, config)
                .then(function (res) {
                    resolve(res.data)
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }

    /**
     * 异步查询数据fetch
     * @param  {string} entityName
     * @param  {string} fetchXml          传入的查询fetchXml,注意此处用+拼接fetch,不能使用"\"进行转义，否则会无法找到api资源
     * @param  {boolean} useFormattedValue 返回的结果是否格式化
     * @return {Promise}                   [description]
     */
    astec.fetchAsync = function (entityName, fetchXml, useFormattedValue) {
        return new Promise(function (resolve, reject) {
            if (!astec.isBoolean(useFormattedValue)) {
                throw new Error('astec.fetchAsync useFormattedValue parameter must be a boolean.')
            }
            if (astec.isNullOrWhiteSpace(entityName)) {
                throw new Error('astec.fetchAsync entityName parameter must be string.')
            }
            if (astec.isNullOrWhiteSpace(fetchXml)) {
                throw new Error('astec.fetchAsync fetchXml parameter must be valuable.')
            }
            var fetchStr = odataRequestUrl + 'Retrieve/' + entityName + '?fetchXml=' + fetchXml
            if (useFormattedValue) {

            }
            astec.get(fetchStr)
                .then(function (res) {
                    reject(res.data)
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }

    /**
     * 异步更新一条记录
     * @param  {string} entitySetName 实体的逻辑名称
     * @param  {string} entityId      实体记录的主键，GUID
     * @param  {string} entity        要更新的记录对象，属性是要更新的记录的字段名称，属性值是字段的值
     * @return {Promise}               [description]
     */
    astec.updateAsync = function (entitySetName, entityId, entity) {
        return new Promise(function (resolve, reject) {
            if (!astec.isString(entitySetName)) {
                throw new Error('astec.updateAsync entitySetName parameter must be a string.')
            }
            if (!astec.isString(entityId)) {
                throw new Error('astec.updateAsync entityId parameter must be a string.')
            }
            if (astec.isNull(entity)) {
                throw new Error('astec.updateAsync entity parameter must not be null or undefined.')
            }

            var url = odataRequestUrl + 'Update/' + entitySetName + '(' + entityId.replace('{', '').replace('}', '') + ')'
            astec.post(url, entity)
                .then(function (res) {
                    resolve(res.headers['odata-entityid'].split('(')[1].replace(')', ''))
                })
                .catch(function (err) {
                    resolve(err)
                })
        })
    }

    /**
     * 异步更新实体一条记录
     * @param  {string} entitySetName 实体的逻辑名称(复数)
     * @param  {string} entityId      实体记录的主键，GUID
     * @param  {string} fieldName     要更新的字段的逻辑名称
     * @param  {string} fieldValue    要更新的字段的值
     * @return {Promise}               [description]
     */
    astec.updateSingleFieldAsync = function (entitySetName, entityId, fieldName, fieldValue) {
        return new Promise(function (resolve, reject) {
            if (!astec.isString(entitySetName)) {
                throw new Error('astec.updateSingleFieldAsync entitySetName parameter must be a string.')
            }
            if (!astec.isString(entityId)) {
                throw new Error('astec.updateSingleFieldAsync entityId parameter must be a string.')
            }

            astec.post(odataRequestUrl + 'Update/' + entitySetName + '(' + entityId.replace('{', '').replace('}', '') + ')/' + fieldName, {'value': fieldValue}).then(function (res) {
                resolve(res.headers['odata-entityid'].split('(')[1].replace(')', ''))
            }).catch(function (err) {
                reject(err)
            })
        })
    }

    /**
     * 获取指定实体的字段的值(异步)
     * @param  {string} id                实体的guid
     * @param  {string} typeName          实体类型名称(复数)
     * @param  {string} returnField       如果要返回所有的字段，保持为空或者是 * ，多字段用，连接
     * @param  {Boolean} useFormattedValue 返回的结果是否格式化
     * @return {Promise}                   [description]
     */
    astec.getFieldValueAsync = function (id, typeName, returnField, useFormattedValue) {
        return new Promise(function (resolve, reject) {
            if (!astec.isBoolean(useFormattedValue)) {
                throw new Error('astec.getFieldValueAsync useFormattedValue parameter must be a boolean.')
            }
            if (astec.isNullOrWhiteSpace(id)) {
                throw new Error('astec.getFieldValueAsync id parameter must be string.')
            }
            if (astec.isNullOrWhiteSpace(typeName)) {
                throw new Error('astec.getFieldValueAsync typeName parameter must be string.')
            }

            var queryString = odataRequestUrl + 'Retrieve/' + typeName + '(' + id.replace('{', '').replace('{', '') + ')'
            if (!astec.isNullOrWhiteSpace(returnField) && returnField !== '*') {
                queryString += '?$select=' + returnField
            }

            astec.get(queryString)
                .then(function (res) {
                    resolve(res.data)
                })
                .catch(function (err) {
                    reject(err)
                })
        })
    }

    /**
     * 获取系统参数的值
     * @param  {string} paramName 系统参数的名称
     * @return {string}           系统参数的值
     */
    astec.getParameterValue = function (paramName) {
        var fetchXml = "<fetch mapping='logical' version='1.0'>" +
            "<entity name='systemparameter'>" +
            "<attribute name='value' />" +
            '<filter>' +
            "<condition attribute='name' operator='eq' value='" + paramName + "' />" +
            '</filter>' +
            '</entity>' +
            '</fetch>'

        return Promise.resolve(astec.fetchAsync('systemparameters', fetchXml, false).then((res) => {
            return res.value[0].value
        }))
    }
    /**
     * 导出到excel
     * @param {string} filename 文件名称
     * @param {object} val 导出的数据
     * @param {string} excelTitle 导出的列头集合
     * @param {string} exclude 排除的字段集合
     */
    astec.export2Excel = function (filename, val, excelTitle, exclude) {
        var excludelist = []

        if (exclude) {
            excludelist = exclude.split(',')
        }
        var explorer = '' // 浏览器类型
        if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            explorer = 'ie'
        }
        // IE浏览器导出
        if (explorer === 'ie') {
            var arrData = typeof val !== 'object' ? JSON.parse(val) : val
            try {
                var oXL = new ActiveXObject('Excel.Application')// 创建AX对象excel
            } catch (e) {
                alert('无法启动Excel，请确保电脑中已经安装了Excel!\n\n如果已经安装了Excel，" + "请调整IE的安全级别。\n\n具体操作：\n\n" + "工具 → Internet选项 → 安全 → 自定义级别 → ActiveX 控件和插件 → 对未标记为可安全执行脚本的ActiveX 控件初始化并执行脚本 → 启用 → 确定')
            }
            var oWB = oXL.Workbooks.Add() // 获取workbook对象
            var oSheet = oWB.ActiveSheet // 激活当前sheet
            var Lenr = arrData.length // 取得表格行数
            for (var i = 0; i < excelTitle.length; i++) {
                oSheet.Cells(1, i + 1).value = excelTitle[i] // 赋值
            }
            for (let i = 0; i < Lenr; i++) {
                var td = 0
                for (var j in arrData[i]) {
                    if (excludelist.length > 0 && excludelist.indexOf(j) >= 0) continue
                    oSheet.Cells(i + 2, td + 1).value = arrData[i][j] // 赋值
                    td++
                }
            }
            oXL.Visible = true

            var fname = oXL.Application.GetSaveAsFilename(filename + '.xls', 'Excel Spreadsheets (*.xls), *.xls')
            oWB.SaveAs(fname)
            oWB.Close()
            oXL.Quit()
        } else {
            // 非IE浏览器导出
            arrData = typeof val !== 'object' ? JSON.parse(val) : val
            var excel = '<table>'
            var row = '<tr>'
            for (let i = 0; i < excelTitle.length; i++) {
                row += '<td>' + excelTitle[i] + '</td>'
            }
            excel += row + '</tr>'
            for (let i = 0; i < arrData.length; i++) {
                row = '<tr>'
                for (let j in arrData[i]) {
                    if (excludelist.length > 0 && excludelist.indexOf(j) >= 0) continue
                    td = arrData[i][j]
                    row += '<td>' + td + '</td>'
                }
                excel += row + '</tr>'
            }
            excel += '</table>'
            var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
                "xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>"
            excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">'
            excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel'
            excelFile += '; charset=UTF-8">'
            excelFile += '<head>'
            excelFile += '<!--[if gte mso 9]>'
            excelFile += '<xml>'
            excelFile += '<x:ExcelWorkbook>'
            excelFile += '<x:ExcelWorksheets>'
            excelFile += '<x:ExcelWorksheet>'
            excelFile += '<x:Name>'
            excelFile += 'sheet'
            excelFile += '</x:Name>'
            excelFile += '<x:WorksheetOptions>'
            excelFile += '<x:DisplayGridlines/>'
            excelFile += '</x:WorksheetOptions>'
            excelFile += '</x:ExcelWorksheet>'
            excelFile += '</x:ExcelWorksheets>'
            excelFile += '</x:ExcelWorkbook>'
            excelFile += '</xml>'
            excelFile += '<![endif]-->'
            excelFile += '</head>'
            excelFile += '<body>'
            excelFile += excel
            excelFile += '</body>'
            excelFile += '</html>'
            var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile)
            var link = document.createElement('a')
            link.href = uri
            link.style = 'visibility:hidden'
            // 导出文件名
            link.download = filename + '.xls'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    /**
     * @param {string} 实体名称
     * @param {string} 实体id
     */
    astec.revoke = function (entityname, entityid) {
        var data = {
            EntityId: entityid,
            EntityTypeName: entityname
        }
        return astec.post('/api/CrmFlow/revoke', data)
            .then(function (res) {
                astec.showSuccessToast(res)
                return Promise.resolve()
            }).catch((error) => {
                astec.showErrorToast(error)
                return Promise.reject(error)
            })
    }

    /**
     * 获取网站的根地址
     */
    astec.getBaseUrl = function () {
        if (process.env.NODE_ENV === 'production') {
            return ''
        }

        var baseUrl = localStorage.serverAddress
        if (!baseUrl.endWith('/')) {
            baseUrl += '/'
        }

        return baseUrl
    }

    var loadingInstance // loading实例
    /**
     * 打开lookup
     * @param {string} url lookuppage url
     */

    astec.sLookup = function (url) {
        var l = (screen.availWidth - 560) / 2
        var t = (screen.availHeight - 614) / 2

        window.open(url, '_blank', 'width=560,height=614,top=' + t + ',left=' + l + ',toolbar=no,menubar=no, scrollbars=no, resizable=no, location=no, status=no')
    }

    /**
     * 打开portal单据编辑界面
     * @param {string} url lookuppage url
     */

    astec.editWindow = function (url) {
        var l = (screen.availWidth - 1440) / 2
        var t = (screen.availHeight - 900) / 2

        window.open(url, '_blank', 'width=1440,height=900,top=' + t + ',left=' + l + ',toolbar=no,menubar=no, scrollbars=no, resizable=no, location=no, status=no')
    }

    /**
     * showAlertDialog的简化写法，按钮的显示文字固定为“确定”。
     * @param {String} content 消息提示的正文
     */
    astec.alert = function (content, callback) {
        astec.showAlertDialog('提示', content, {
            callback: callback
        })
    }

    /**
     * 弹出提示对话框，可以自定义按钮的显示文字；返回Promise对象。
     * @param  {string} title                提示标题
     * @param  {string} content              提示正文
     * @param  {string} options
     */
    astec.showAlertDialog = function (title, content, options) {
        return Vue.prototype.$alert(content, title, options)
    }

    /**
     * showConfirmDialog简化写法，按钮的显示文字固定为“确定”和“取消”。
     * @param  {string} content 消息提示正文
     * @return {Promise}         在then和catch中执行确定和取消的操作
     */
    astec.confirm = function (content) {
        return astec.showConfirmDialog('', content, '确定', '取消', 'info')
    }

    /**
     * 弹出confirm
     * @param  {string} title                消息提示标题
     * @param  {string} content              消息提示正文
     * @param  {sting} confirmButtonContent  确定按钮文字
     * @param  {string} CancelButtonContent  取消按钮文字
     * @param  {sting} confirmType           提示类型
     * @return {Promise}
     */
    astec.showConfirmDialog = function (title, content, confirmButtonContent, cancelButtonContent, confirmType) {
        if (!astec.isString(title)) {
            throw new Error('astec.showConfirmDialog title parameter must be string.')
        }
        if (!astec.isString(content)) {
            throw new Error('astec.showConfirmDialog content parameter must be string.')
        }
        if (!astec.isString(confirmButtonContent)) {
            throw new Error('astec.showConfirmDialog confirmButtonContent parameter must be string.')
        }
        if (!astec.isString(cancelButtonContent)) {
            throw new Error('astec.showConfirmDialog cancelButtonContent parameter must be string.')
        }
        return Vue.prototype.$confirm(content, title, {
            confirmButtonText: confirmButtonContent,
            cancelButtonText: cancelButtonContent,
            type: confirmType
        })
    }

    /**
     * 打开loading提示
     * @param  {string} content 等待提示内容
     * @param  {obje} dom       加载dom对象，不传对象则全屏
     */
    astec.showLoadingToast = function (content, dom) {
        if (!astec.isNull(loadingInstance)) {
            return
        }
        let options = {}
        if (!astec.isNull(content)) {
            options.text = content
        }
        if (!astec.isNull(dom)) {
            options.target = dom
        }
        store.state.Loading = true
        loadingInstance = Vue.prototype.$loading(options)

    }

    /**
     * 关闭loading
     */
    astec.hideLoadingToast = function () {
        if (astec.isNull(loadingInstance)) {
            return
        }
        loadingInstance.close()
        store.state.Loading = false
        loadingInstance = null
    }

    /**
     * 弹出错误文字提示
     * @param  {string}  content 提示内容
     * @param  {Boolean} isClose 是否可手动关闭
     */
    astec.showErrorToast = function (content, isClose) {
        Vue.prototype.$message({
            showClose: isClose,
            message: content,
            type: 'error'
        })
    }

    /**
     * 弹出成功的文字提示
     * @param  {string}  content 提示内容
     * @param  {Boolean} isClose 是否可手动关闭
     */
    astec.showSuccessToast = function (content, isClose) {
        Vue.prototype.$message({
            showClose: isClose,
            message: content,
            type: 'success'
        })
    }

    /**
     * 弹出警告的文字提示
     * @param  {string}  content 提示内容
     * @param  {Boolean} isClose 是否可手动关闭
     */
    astec.showWarningToast = function (content, isClose) {
        Vue.prototype.$message({
            showClose: isClose,
            message: content,
            type: 'warning'
        })
    }

    /**
     * 弹出普通的文字提示
     * @param  {string}  content 提示内容
     * @param  {Boolean} isClose 是否可手动关闭
     */
    astec.showToast = function (content, isClose) {
        Vue.prototype.$message({
            showClose: isClose,
            message: content
        })
    }

    /**
     * 返回上一级
     */
    astec.goBack = function () {
        Vue.router.go(-1)
    }

    // 把 null 转换成 空 ""
    astec.transNull = function (val) {
        if (val === null || val === undefined) {
            return ''
        } else {
            return val
        }
    }

    /**
     * 注销
     */
    astec.logout = function () {
        astec.showConfirmDialog('', '确认注销？', '确定', '取消', 'warning')
            .then(function () {
                Vue.prototype.$auth.logout()
            })
    }

    /**
     * 获取用户Id
     * @return {string}
     */
    astec.getUserId = function () {
        return Vue.prototype.$auth.getUserInfo().systemUserId
    }

    /**
     * 获取用户账号
     * @return {string}
     */
    astec.getUserName = function () {
        return Vue.prototype.$auth.getUserInfo().userCode
    }
    /**
     * 分页查询时，获取每页显示的记录数。
     */
    astec.getPaginationSize = function () {
        return 10
    }

    astec.refreshParentPage = function () {
        // <summary>刷新当前页面的父页面(将其打开的页面)</summary>
        if (window.top != null && window.top.opener != null) {
            window.top.opener.location.reload()
        }
    }

    astec.showFullWindow = function (url) {
        // <summary>打开新窗口，窗口大小为全屏</summary>
        // <param name="url" type="String">页面URL地址</param>
        var width = screen.width
        var height = screen.height
        return this.showWindow(url, {
            width: width,
            height: height
        })
    }

    astec.showLargeWindow = function (url) {
        // <summary>打开新窗口，窗口大小为 1024 * 768 </summary>
        // <param name="url" type="String">页面URL地址</param>
        return this.showWindow(url, {
            width: 1024,
            height: 768
        })
    }

    astec.showSmallWindow = function (url) {
        // <summary>打开新窗口，窗口大小为 400 * 300 </summary>
        // <param name="url" type="String">页面URL地址</param>
        return this.showWindow(url, {
            width: 400,
            height: 300
        })
    }

    astec.showWindow = function (url, config) {
        // <summary>打开新页面，默认800*600</summary>
        // <param name="url" type="String">页面URL地址</param>
        // <param name="config" type="Object">窗体的配置参数，包含width、height</param>
        if (this.isNull(config)) {
            config = {}
        }

        if (this.isNull(config.width) || config.width === 0) {
            config.width = 800
        }

        if (this.isNull(config.height) || config.height === 0) {
            config.height = 600
        }

        var WINDOWS_TASK_BAR_HEIGHT = 40 // 任务栏的高度
        var winTop = Math.round((screen.height - config.height - WINDOWS_TASK_BAR_HEIGHT) * 0.5)
        var winLeft = Math.round((screen.width - config.width) * 0.5)

        var strFeatures = 'help=no,maximize=no,minimize=no,menubar=no,toolbar=no,status=no,location=no,resizable=no' + ',width=' + config.width + ',height=' + config.height + ',top=' + winTop + ',left=' + winLeft

        window.open(url, '_blank', strFeatures)
    }

    /**
     * 刷新页面
     */
    astec.refresh = function () {
        Vue.router.go(0)
    }

    /**
     * 判断一个字符串是否包含某字符串
     * @param substr 包含的字符串
     * @param ignoreCase 是否忽略大小写
     * @returns {boolean} 如果包含，则返回true，否则返回 false
     */
    var stringT = String
    stringT.prototype.contains = function (substr, ignoreCase) {
        if (ignoreCase === null || ignoreCase === undefined) {
            ignoreCase = false
        }

        if (ignoreCase) {
            return this.search(new RegExp(substr, 'i')) > -1
        } else {
            return this.search(substr) > -1
        }
    }

    /**
     * 判断一个字符串是不是以某字符串结尾
     * @param s
     * @returns {boolean} 如果是，则返回true，否则返回 false
     */
    stringT.prototype.endWith = function (s, ignoreCase) {
        if (s === null || s === '' || this.length === 0 || s.length > this.length) {
            return false
        }
        var ns = this.substring(this.length - s.length)
        if (ignoreCase) {
            return ns.toLowerCase() === s.toLowerCase()
        } else {
            return ns === s
        }
    }

    /**
     * 字符格式化，同C# String.Format方法
     */
    stringT.prototype.format = function () {
        var content = this
        for (var i = 0; i < arguments.length; i++) {
            var replacement = '{' + i + '}'
            content = content.replace(replacement, arguments[i])
        }
        return content
    }

    /**
     * 判断一个字符串是不是以某字符串开头
     * @param s
     * @returns {boolean} 如果是，则返回true，否则返回 false
     */
    stringT.prototype.startWith = function (s, ignoreCase) {
        if (s === null || s === '' || this.length === 0 || s.length > this.length) {
            return false
        }
        var ns = this.substr(0, s.length)
        if (ignoreCase) {
            return ns.toLowerCase() === s.toLowerCase()
        } else {
            return ns === s
        }
    }

    /**
     * 移除字符串前后的空格或其它特殊字符，同C#中的Trim方法。
     */
    stringT.prototype.trim = function (trimChars) {
        var result = this

        if (typeof trimChars !== 'string' || trimChars.length <= 0) {
            trimChars = ' '
        }

        var count = result.length

        while (count > 0) { // trim the head position
            if (trimChars.indexOf(result[0]) >= 0) {
                result = result.substring(1)
                count--
            } else {
                break
            }
        }
        while (count > 0) { // trim the tail position
            if (trimChars.indexOf(result[count - 1]) >= 0) {
                result = result.substring(0, count - 1)
                count--
            } else {
                break
            }
        }
        return result
    }

    /**
     * 将标准的经纬度转换成百度的火星坐标
     * @param  {number} longitude 转换的经度
     * @param  {number} latitude  转换的纬度
     * @return {[type]}           [description]
     */
    astec.convertGPS2BaiduLocation = function (longitude, latitude, success) {
        var url = 'http://api.map.baidu.com/geoconv/v1/?coords=' + longitude + ',' + latitude + '&from=1&to=5&ak=ROninBdEIu93CBGDHc3fSPHE&callback=MYCALLBACK'

        this.jsonp(url, function (data) {
            success(data.result[0])
        })
    }

    /**
     * 延迟执行
     * @param {string} action 执行动作
     * @param {int} delayMilliseconds 延迟的时间，单位：毫秒
     */
    astec.delay = function (action, delayMilliseconds) {
        if (!this.isFunction(action)) {
            throw new Error('第一个参数必须是function对象.')
        }

        if (this.isNull(delayMilliseconds)) {
            delayMilliseconds = 2 * 1000
        }

        setTimeout(action, delayMilliseconds)
    }

    /**
     * 根据传入的Url，获取返回值JSON,并生成对应的JS对象 (同步)
     * @param  {String} serverUrl 服务器地址
     * @return {object}           [description]
     */
    astec.getObject = function (serverUrl) {
        var json = this.getJSON(serverUrl)
        try {
            return JSON.parse(json)
        } catch (e) {
            return null
        }
    }

    /**
     * 获取屏幕高度
     * @return {[type]}               [description]
     */
    astec.getScreenHeight = function () {
        return document.documentElement.clientHeight || document.body.clientHeight
    }

    /**
     * 获取屏幕宽度
     * @return {[type]} [description]
     */
    astec.getScreenWidth = function () {
        return document.documentElement.clientWidth || document.body.clientWidth
    }

    /**
     * 判断js变量是否为boolean类型
     * @param  {object}  obj 要判断的Js对象
     * @return {Boolean}
     */
    astec.isBoolean = function (obj) {
        return typeof obj === 'boolean'
    }

    /**
     * 判断字符是否有效的手机号码
     * @returns {boolean}
     */
    astec.isCellphone = function (str) {
        var regex = /^0*(13|15|18)\d{9}$/
        return regex.test(str)
    }

    /**
     * 判断是否是日期类型
     * @param d
     * @returns {boolean}
     */
    astec.isDate = function (d) {
        if (astec.isNull(d)) {
            return false
        }

        return d instanceof Date && !isNaN(d.valueOf())
    }

    /**
     * 检查是否是邮件地址
     */
    astec.isEmailAddress = function (str) {
        var regex = /^\w+((-\w+)|(\.\w+))*\.@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/

        return regex.test(str)
    }

    /**
     * 判断变量f是否是一个函数
     * @param f 变量f
     * @returns {boolean} 如果是函数则返回true，否则返回false
     */
    astec.isFunction = function (f) {
        if (astec.isNull(f)) {
            return false
        }

        return typeof f === 'function'
    }

    /**
     * 判断字符是否有效的身份证号码
     * @returns {boolean}
     */
    astec.isIDCard = function (str) {
        var regex = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/
        return regex.test(str)
    }

    /**
     * 检查是否为整数
     * @param  {string}  str 数字
     * @return {Boolean}            若为整数，返回TRUE；否则，返回false
     */
    astec.isInteger = function (str) {
        var regex = /^[-]{0,1}[0-9]{1,}$/
        return regex.test(str)
    }

    /**
     * 判断一个变量是否是undefined或者null
     * @param o 需要进行判断的变量
     * @returns {boolean} 如果是undified或者null，则返回true，否则返回 false
     */
    astec.isNull = function (o) {
        return o === undefined || o === null
    }

    /**
     * 判断一个字符串是否是undified、null、“”
     * @param s 字符串变量
     * @returns {boolean} 如果是，则返回true，否则返回false
     */
    astec.isNullOrWhiteSpace = function (s) {
        return this.isNull(s) || (typeof (s) === 'string' && s.trim() === '')
    }

    /**
     * 检查是否为数字(实数)
     * @param  {string}  str 待检查的数字
     * @return {Boolean}           若为数字，返回true；否则返回false
     */
    astec.isNumeric = function (str) {
        var regex = /^(-|\+)?\d+(\.\d+)?$/

        return regex.test(str)
    }

    /**
     * 检查是否是手机号码或者电话号码
     */
    astec.isPhone = function (str) {
        return this.isCellphone(str) || this.isTelephone(str)
    }

    /**
     * 不区分大小写、{}，比较两个guid
     * @param  {String}  guid1 参与比较的第一个Guid
     * @param  {String}  guid2 参与比较的第二个Guid
     * @return {Boolean}
     */
    astec.isSameGuid = function (guid1, guid2) {
        var isEqual
        if (guid1 === null || guid2 === null) {
            isEqual = false
        } else {
            isEqual = guid1
                .replace(/[{}]/g, '')
                .toLowerCase() === guid2
                .replace(/[{}]/g, '')
                .toLowerCase()
        }

        return isEqual
    }

    /**
     * 判断js变量是否为string类型
     * @param  {object}  obj 要判断的Js对象
     * @return {Boolean}
     */
    astec.isString = function (obj) {
        return typeof obj === 'string'
    }

    /**
     * 判断字符是否有效的电话号码
     * @returns {boolean}
     */
    astec.isTelephone = function (str) {
        var reg = /^\d{3,4}-\d{7,8}(-\d{3,4})?$/
        return reg.test(str)
    }

    /**
     * 检查是否为正整数
     * @param  {string}  str 数字字符串
     * @return {Boolean}            若为正整数，返回TRUE；否则，返回false
     */
    astec.isUnsignedInteger = function (str) {
        var regex = /^[1]{0,1}[0-9]{1,}$/

        return regex.test(str)
    }
    /**
     * 解决四维运算,js计算失去精度的问题
     * 检查是否为正整数
     * @param  {Number}  arg 数字字符串
     * @param  {Number}  count 需要精确到的小数位数
     * @param  {String}  integer 取整数的方法
     */
    var numberT = Number
    // 加法
    numberT.prototype.add = function (arg, count, integer) {
        var r1, r2, m
        try {
            r1 = this.toString().split('.')[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg.toString().split('.')[1].length
        } catch (e) {
            r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2))
        var finValue = (this * m + arg * m) / m
        if (count) {
            return finValue.toFixed(count)
        } else {
            return finValue
        }
        // if (integer) {
        //   if (integer == 'floor') {
        //     return Math.floor(finValue)
        //   } else if (integer == 'ceil') {
        //     return Math.ceil(finValue)
        //   } else if (integer == 'round') {
        //     return Math.round(finValue)
        //   }
        // }
    }
    // 减法
    numberT.prototype.sub = function (arg, count, integer) {
        return this.add(-arg, count, integer)
    }
    // 乘法
    numberT.prototype.mul = function (arg, count, integer) {
        var m = 0
        var s1 = this.toString()
        var s2 = arg.toString()
        try {
            m += s1.split('.')[1].length
        } catch (e) {
        }
        try {
            m += s2.split('.')[1].length
        } catch (e) {
        }
        var finValue = Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
        if (count) {
            return finValue.toFixed(count)
        } else {
            return finValue
        }
        // if (integer) {
        //   if (integer == 'floor') {
        //     return Math.floor(finValue)
        //   } else if (integer == 'ceil') {
        //     return Math.ceil(finValue)
        //   } else if (integer == 'round') {
        //     return Math.round(finValue)
        //   }
        // }
    }
    // 除法
    numberT.prototype.div = function (arg, count, integer) {
        var t1 = 0
        var t2 = 0
        var r1, r2
        try {
            t1 = this.toString().split('.')[1].length
        } catch (e) {
        }
        try {
            t2 = arg.toString().split('.')[1].length
        } catch (e) {
        }
        r1 = Number(this.toString().replace('.', ''))
        r2 = Number(arg.toString().replace('.', ''))
        // var finValue = (r1 / r2) * Math.pow(10, t2 - t1)
        if (count) {
            return ((r1 / r2) * Math.pow(10, t2 - t1)).toFixed(count)
        } else {
            return (r1 / r2) * Math.pow(10, t2 - t1)
        }
        // if (integer) {
        //   if (integer == 'floor') {
        //     return Math.floor(finValue)
        //   } else if (integer == 'ceil') {
        //     return Math.ceil(finValue)
        //   } else if (integer == 'round') {
        //     return Math.round(finValue)
        //   }
        // }
    }
    /**
     * 检查是否为正数
     * @param  {string}  str 数字
     * @return {Boolean}           若为正数，返回TRUE；否则返回false
     */
    astec.isUnsignedNumeric = function (str) {
        var regex = /^\d+(\.\d+)?$/

        return regex.test(str)
    }

    astec.isUrl = function (str) {
        return !this.isNullOrWhiteSpace(str) && (str.startWith('http://') || str.startWith('https://'))
    }

    /**
     * 使用jsonp处理跨域请求
     * @param  {string}   url      请求的地址
     * @param  {Function} callback 回调方法
     * @return {object}            返回的对象
     */
    astec.jsonp = function (url, callback) {
        var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random())
        window[callbackName] = function (data) {
            delete window[callbackName]
            document
                .body
                .removeChild(script)
            callback(data)
        }

        var script = document.createElement('script')
        script.src = url + (url.indexOf('?') >= 0
            ? '&'
            : '?') + 'callback=' + callbackName
        document
            .body
            .appendChild(script)
    }

    /**
     * 生成一个新的GUID
     * @returns {string} GUID
     */
    astec.newGuid = function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1)
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
    }

    /**
     * 定义一个空方法
     * @return {[type]} [description]
     */
    astec.noop = function () {
    }

    /**
     * 同步POST执行后台方法
     * @param  {String} url URL地址
     * @param  {String} data   传递参数
     * @return {[type]}           [description]
     */
    astec.postResponse = function (url, data) {
        var xmlhttp = this.getXHR()
        xmlhttp.open('post', url, false)
        xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
        xmlhttp.send(data)

        return xmlhttp.responseText
    }
    // js打印页面内容
    /**
     * @param  {String} ele 需要打印的内容id
     */
    astec.printHTML = function (ele, zoom) {
        // 获取当前页的html代码
        var bdhtml = window.document.body.innerHTML
        var printHtml = document.getElementById(ele).innerHTML
        // 页面打印缩放比例设置
        var zoomIn = 0.47
        if (zoom) {
            zoomIn = zoom
        }
        document.getElementsByTagName('body')[0].style.zoom = zoomIn
        // 需要打印的页面
        window.document.body.innerHTML = printHtml
        removeIeHeaderAndFooter()
        // if (!!window.ActiveXObject || 'ActiveXObject' in window) { // 是否ie
        //   removeIeHeaderAndFooter()
        // }
        window.print()
        // 还原界面
        window.document.body.innerHTML = bdhtml
        window.location.reload()
    }

    // 去掉页眉、页脚
    function removeIeHeaderAndFooter() {
        var hkeyPath
        hkeyPath = 'HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\PageSetup\\'
        try {
            var RegWsh = new ActiveXObject('WScript.Shell')
            RegWsh.RegWrite(hkeyPath + 'header', '')
            RegWsh.RegWrite(hkeyPath + 'footer', '')
        } catch (e) {
        }
    };
    /*
     * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
     * Digest Algorithm, as defined in RFC 1321.
     * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * Distributed under the BSD License
     * See http://pajhome.org.uk/crypt/md5 for more info.
     */

    /*
     * Configurable variables. You may need to tweak these to be compatible with
     * the server-side, but the defaults work in most cases.
     */
    var hexcase = 0
    /* hex output format. 0 - lowercase; 1 - uppercase        */
    var chrsz = 8
    /* bits per input character. 8 - ASCII; 16 - Unicode      */

    /*
     * These are the functions you'll usually want to call
     * They take string arguments and return either hex or base-64 encoded strings
     */
    astec.md5 = function (s) {
        return hexMd5(s)
    }

    astec.hmacmd5 = function (s) {
        return hexHmacMd5()
    }

    function hexMd5(s) {
        return binl2hex(coreMd5(str2binl(s), s.length * chrsz))
    }

    function hexHmacMd5(key, data) {
        return binl2hex(coreHmacMd5(key, data))
    }

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length
     */
    function coreMd5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << ((len) % 32)
        x[(((len + 64) >>> 9) << 4) + 14] = len

        var a = 1732584193
        var b = -271733879
        var c = -1732584194
        var d = 271733878

        for (var i = 0; i < x.length; i += 16) {
            var olda = a
            var oldb = b
            var oldc = c
            var oldd = d

            a = md5Ff(a, b, c, d, x[i + 0], 7, -680876936)
            d = md5Ff(d, a, b, c, x[i + 1], 12, -389564586)
            c = md5Ff(c, d, a, b, x[i + 2], 17, 606105819)
            b = md5Ff(b, c, d, a, x[i + 3], 22, -1044525330)
            a = md5Ff(a, b, c, d, x[i + 4], 7, -176418897)
            d = md5Ff(d, a, b, c, x[i + 5], 12, 1200080426)
            c = md5Ff(c, d, a, b, x[i + 6], 17, -1473231341)
            b = md5Ff(b, c, d, a, x[i + 7], 22, -45705983)
            a = md5Ff(a, b, c, d, x[i + 8], 7, 1770035416)
            d = md5Ff(d, a, b, c, x[i + 9], 12, -1958414417)
            c = md5Ff(c, d, a, b, x[i + 10], 17, -42063)
            b = md5Ff(b, c, d, a, x[i + 11], 22, -1990404162)
            a = md5Ff(a, b, c, d, x[i + 12], 7, 1804603682)
            d = md5Ff(d, a, b, c, x[i + 13], 12, -40341101)
            c = md5Ff(c, d, a, b, x[i + 14], 17, -1502002290)
            b = md5Ff(b, c, d, a, x[i + 15], 22, 1236535329)

            a = md5Gg(a, b, c, d, x[i + 1], 5, -165796510)
            d = md5Gg(d, a, b, c, x[i + 6], 9, -1069501632)
            c = md5Gg(c, d, a, b, x[i + 11], 14, 643717713)
            b = md5Gg(b, c, d, a, x[i + 0], 20, -373897302)
            a = md5Gg(a, b, c, d, x[i + 5], 5, -701558691)
            d = md5Gg(d, a, b, c, x[i + 10], 9, 38016083)
            c = md5Gg(c, d, a, b, x[i + 15], 14, -660478335)
            b = md5Gg(b, c, d, a, x[i + 4], 20, -405537848)
            a = md5Gg(a, b, c, d, x[i + 9], 5, 568446438)
            d = md5Gg(d, a, b, c, x[i + 14], 9, -1019803690)
            c = md5Gg(c, d, a, b, x[i + 3], 14, -187363961)
            b = md5Gg(b, c, d, a, x[i + 8], 20, 1163531501)
            a = md5Gg(a, b, c, d, x[i + 13], 5, -1444681467)
            d = md5Gg(d, a, b, c, x[i + 2], 9, -51403784)
            c = md5Gg(c, d, a, b, x[i + 7], 14, 1735328473)
            b = md5Gg(b, c, d, a, x[i + 12], 20, -1926607734)

            a = md5Hh(a, b, c, d, x[i + 5], 4, -378558)
            d = md5Hh(d, a, b, c, x[i + 8], 11, -2022574463)
            c = md5Hh(c, d, a, b, x[i + 11], 16, 1839030562)
            b = md5Hh(b, c, d, a, x[i + 14], 23, -35309556)
            a = md5Hh(a, b, c, d, x[i + 1], 4, -1530992060)
            d = md5Hh(d, a, b, c, x[i + 4], 11, 1272893353)
            c = md5Hh(c, d, a, b, x[i + 7], 16, -155497632)
            b = md5Hh(b, c, d, a, x[i + 10], 23, -1094730640)
            a = md5Hh(a, b, c, d, x[i + 13], 4, 681279174)
            d = md5Hh(d, a, b, c, x[i + 0], 11, -358537222)
            c = md5Hh(c, d, a, b, x[i + 3], 16, -722521979)
            b = md5Hh(b, c, d, a, x[i + 6], 23, 76029189)
            a = md5Hh(a, b, c, d, x[i + 9], 4, -640364487)
            d = md5Hh(d, a, b, c, x[i + 12], 11, -421815835)
            c = md5Hh(c, d, a, b, x[i + 15], 16, 530742520)
            b = md5Hh(b, c, d, a, x[i + 2], 23, -995338651)

            a = md5Ii(a, b, c, d, x[i + 0], 6, -198630844)
            d = md5Ii(d, a, b, c, x[i + 7], 10, 1126891415)
            c = md5Ii(c, d, a, b, x[i + 14], 15, -1416354905)
            b = md5Ii(b, c, d, a, x[i + 5], 21, -57434055)
            a = md5Ii(a, b, c, d, x[i + 12], 6, 1700485571)
            d = md5Ii(d, a, b, c, x[i + 3], 10, -1894986606)
            c = md5Ii(c, d, a, b, x[i + 10], 15, -1051523)
            b = md5Ii(b, c, d, a, x[i + 1], 21, -2054922799)
            a = md5Ii(a, b, c, d, x[i + 8], 6, 1873313359)
            d = md5Ii(d, a, b, c, x[i + 15], 10, -30611744)
            c = md5Ii(c, d, a, b, x[i + 6], 15, -1560198380)
            b = md5Ii(b, c, d, a, x[i + 13], 21, 1309151649)
            a = md5Ii(a, b, c, d, x[i + 4], 6, -145523070)
            d = md5Ii(d, a, b, c, x[i + 11], 10, -1120210379)
            c = md5Ii(c, d, a, b, x[i + 2], 15, 718787259)
            b = md5Ii(b, c, d, a, x[i + 9], 21, -343485551)

            a = safeAdd(a, olda)
            b = safeAdd(b, oldb)
            c = safeAdd(c, oldc)
            d = safeAdd(d, oldd)
        }
        return [a, b, c, d]
    }

    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    function md5Cmn(q, a, b, x, s, t) {
        return safeAdd(bitRol(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
    }

    function md5Ff(a, b, c, d, x, s, t) {
        return md5Cmn((b & c) | ((~b) & d), a, b, x, s, t)
    }

    function md5Gg(a, b, c, d, x, s, t) {
        return md5Cmn((b & d) | (c & (~d)), a, b, x, s, t)
    }

    function md5Hh(a, b, c, d, x, s, t) {
        return md5Cmn(b ^ c ^ d, a, b, x, s, t)
    }

    function md5Ii(a, b, c, d, x, s, t) {
        return md5Cmn(c ^ (b | (~d)), a, b, x, s, t)
    }

    /*
     * Calculate the HMAC-MD5, of a key and some data
     */
    function coreHmacMd5(key, data) {
        var bkey = str2binl(key)
        if (bkey.length > 16) bkey = coreMd5(bkey, key.length * chrsz)

        var ipad = Array(16)
        var opad = Array(16)
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636
            opad[i] = bkey[i] ^ 0x5C5C5C5C
        }

        var hash = coreMd5(ipad.concat(str2binl(data)), 512 + data.length * chrsz)
        return coreMd5(opad.concat(hash), 512 + 128)
    }

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    function safeAdd(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF)
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
        return (msw << 16) | (lsw & 0xFFFF)
    }

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function bitRol(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt))
    }

    /*
     * Convert a string to an array of little-endian words
     * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
     */
    function str2binl(str) {
        var bin = []
        var mask = (1 << chrsz) - 1
        for (var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32)
        }
        return bin
    }

    /*
     * Convert an array of little-endian words to a hex string.
     */
    function binl2hex(binarray) {
        var hexTab = hexcase ? '0123456789ABCDEF' : '0123456789abcdef'
        var str = ''
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                hexTab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF)
        }
        return str
    }

    // 浮点型计算

    /*
     * 判断obj是否为一个整数
     */
    function isInteger(obj) {
        return Math.floor(obj) === obj
    }

    /*
     * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
     * @param floatNum {number} 小数
     * @return {object}
     *   {times:100, num: 314}
     */
    function toInteger(floatNum) {
        var ret = {times: 1, num: 0};
        if (isInteger(floatNum)) {
            ret.num = floatNum;
            return ret
        }
        var strfi = floatNum + '';
        var dotPos = strfi.indexOf('.');
        var len = strfi.substr(dotPos + 1).length;
        var times = Math.pow(10, len);
        var intNum = parseInt(floatNum * times + 0.5, 10);
        ret.times = times;
        ret.num = intNum;
        return ret
    }

    /*
     * 核心方法，实现加减乘除运算，确保不丢失精度
     * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
     *
     * @param a {number} 运算数1
     * @param b {number} 运算数2
     * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
     *
     */
    function operation(a, b, op) {
        var o1 = toInteger(a);
        var o2 = toInteger(b);
        var n1 = o1.num;
        var n2 = o2.num;
        var t1 = o1.times;
        var t2 = o2.times;
        var max = t1 > t2 ? t1 : t2;
        var result = null;
        switch (op) {
            case 'add':
                if (t1 === t2) { // 两个小数位数相同
                    result = n1 + n2
                } else if (t1 > t2) { // o1 小数位 大于 o2
                    result = n1 + n2 * (t1 / t2)
                } else { // o1 小数位 小于 o2
                    result = n1 * (t2 / t1) + n2
                }
                return result / max;
            case 'subtract':
                if (t1 === t2) {
                    result = n1 - n2
                } else if (t1 > t2) {
                    result = n1 - n2 * (t1 / t2)
                } else {
                    result = n1 * (t2 / t1) - n2
                }
                return result / max;
            case 'multiply':
                result = (n1 * n2) / (t1 * t2);
                return result;
            case 'divide':
                result = (n1 / n2) * (t2 / t1);
                return result
        }
    }

    // 加减乘除的四个接口
    astec.add = function add(a, b) {
        return operation(a, b, 'add')
    }

    astec.sub = function subtract(a, b) {
        return operation(a, b, 'subtract')
    }

    astec.mul = function multiply(a, b) {
        return operation(a, b, 'multiply')
    }

    astec.div = function divide(a, b) {
        return operation(a, b, 'divide')
    }

    /**
     * 数字金额转换金额显示格式
     * dealNumber    --- 10000 转 10，000.00
     * undoNumber    --- 10，000.00 转 10000
     * */
    function dealNumber(money) {
        if (money && money != null) {
            money = String(money)
            let left = money.split('.')[0], right = money.split('.')[1]
            right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00'
            let temp = left.split('').reverse().join('').match(/(\d{1,3})/g)
            return (Number(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right
        } else if (money === 0) {   //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
            return '0.00'
        } else {
            return '0.00'
        }
    }

    function undoNumber(money) {
        if (money && money != null) {
            money = String(money)
            let group = money.split('.')
            let left = group[0].split(',').join('')
            return Number(left + "." + group[1])
        } else {
            return '0.00'
        }
    }

    astec.dealNumber = (money) => {
        return dealNumber(money)
    }

    astec.undoNumber = (money) => {
        return undoNumber(money)
    }

    astec.bankNumber = (num) => {
        if(num === undefined || num === null || typeof num !== 'string' || typeof num !== 'number'){
            return ''
        }else {
            return num.replace(/(.{4})/g, "$1 ")
        }
    }

}))
