import axios from '@/rcm/store/api.js'
const url = 'purPayment/'

/**
 * 1、【财务设置工作站】-> 【采购支付方式】接口集
*/

/**
 * 获取已启用的支付方式
 *
 * @returns
 */
export function getEnablePaymentMethod () {
  return axios.post(url + 'getEnablePaymentMethod/')
}

/**
 * 添加支付方式
 *
 * @param {String} payMethod  支付方式
 * @param {Number} enable     是否启用 0 未启用 1 启用
 * @returns
 */
export function addPaymentMethod ({ payMethod, enable }) {
  return axios.post(url + 'addPaymentMethod/', { payMethod, enable })
}

/**
 * 获取支付方式列表
 *
 * @returns
 */
export function getPaymentMethod () {
  return axios.post(url + 'getPaymentMethod/')
}

/**
 * 启用／禁用支付方式
 *
 * @param {Interger} id       支付方式id
 * @param {Number} enable     是否启用 0 未启用 1 启用
 * @returns
 */
export function setPaymentMethod ({ id, enable }) {
  return axios.post(url + 'setPaymentMethod/', { id, enable })
}

/**
 * 2、【财务会计工作站】-> 【采付结算管理】接口集
*/

/**
 * 发票列表
 *
 * @export
 * @param {String} invoiceNo        发票号码
 * @param {String} inCode           入库单号
 * @param {String} proNo            序号
 * @param {String} paymentNo        付款单号
 * @param {String} supplerId        供应商ID
 * @returns
 */
export function getInvoice (obj) {
  return axios.post(url + 'getInvoice/', obj)
}

/**
 * 导出付款单信息
 *
 * @param {String} paymentNo         付款单号
 * @param {String} proNo             序号
 * @param {String} code              入库单号
 * @param {Number} invoiceStatus     发票状态
 * @param {String} supplerName       供应商
 * @param {Integer} payStatus         付款状态
 * @param {Date} createStartDate   创建开始时间
 * @param {Date} createEndDate     创建结束时间
 * @param {Date} payStartDate      付款开始时间
 * @param {Date} payEndDate        付款结束时间
 * @returns
 */
export function exportPayment (obj) {
  return axios.post(url + 'exportPayment/', obj)
}

/**
 * 入库付款单列表
 *
 * @export
 * @param {String} paymentNo              付款单号
 * @param {String} proNo                  序号
 * @param {String} inCode                 入库单号
 * @param {String} invoiceStatus          发票状态
 * @param {String} supplierId             供应商ID
 * @param {String} payStatus              付款状态
 * @param {String} payType                付款类型
 * @param {String} createStartDate        创建开始时间
 * @param {String} createEndDate          创建结束时间
 * @param {String} payStartDate           付款开始时间
 * @param {String} payEndDate             付款结束时间
 * @returns
 */
export function getPayment (obj) {
  return axios.post(url + 'getPayment/', obj)
}

/**
 * 查看付款单详情
 *
 * @param {*} paymentId           收款单号
 * @returns
 */
export function getPaymentDetail (paymentId) {
  return axios.post(url + 'getPaymentDetail/', {
    paymentId
  })
}

/**
 * 上传发票
 *
 * @export
 * @param {Array} paymentId         入库单ID
 * @param {Array} invoiceInfoS      发票信息
 * @returns
 */
export function uploadInvoice ({
  paymentId,
  invoiceInfoS
}) {
  return axios.post(url + 'uploadInvoice/', {
    paymentId,
    invoiceInfoS
  })
}
/**
 * 明细（详情）上传发票
 *
 * @export
 * @param {String} invoiceNo         发票号码
 * @param {String} invoiceAmount     发票金额
 * @param {String} url               发票图片路径
 * @param {String} id                发票ID
 * @returns
 */
export function updateInvoice ({
  invoiceNo,
  invoiceAmount,
  url: file, // 局部变量会覆盖全局url变量，需要重新命名
  id
}) {
  return axios.post(url + 'updateInvoice/', {
    invoiceNo,
    invoiceAmount,
    url: file,
    id
  })
}

/**
 * 导出发票信息
 *
 * @export
 * @param {Object} obj    发票页面查询参数对象
 * @returns
 */
export function exportInvoice (obj) {
  return axios.post(url + 'exportInvoice/', obj)
}
/**
 * 导出退库收款信息
 *
 * @export
 * @param {Object} obj    查询参数对象
 * @returns
 */
export function exportRcmReceivable (obj) {
  return axios.post(url + 'exportRcmReceivable/', obj)
}

/**
 * 退库收款单列表
 *
 * @export
 * @param {*} receivableNo              收款单号
 * @param {*} proNo                     序号
 * @param {*} inCode                    入库单号
 * @param {*} outCode                   出库单号
 * @param {*} receiptStatus             收款状态
 * @param {*} supplierId                供应商ID
 * @param {*} createStartDate           创建开始时间
 * @param {*} createEndDate             创建结束时间
 * @param {*} receivableStartDate       收款开始时间
 * @param {*} receivableEndDate         收款结束时间
 * @returns
 */
export function getReceipt (obj) {
  return axios.post(url + 'getReceipt/', obj)
}
/**
 * 收款单明细(详情)
 *
 * @export
 * @param {String} paymentId
 * @returns
 */
export function getReceiptDetail (paymentId) {
  return axios.post(url + 'getReceiptDetail/', {
    paymentId
  })
}

/**
 * 获取可用冲抵金额，总冲抵金额等
 *
 * @export
 * @param {Array} paymentIds
 * @param {Integer} payType
 * @returns
 */
export function prePay ({
  paymentIds,
  payType
}) {
  return axios.post(url + 'prePay/', {
    paymentIds,
    payType
  })
}

/**
 * 撤销发票
 *
 * @export
 * @param {*} invoiceId   发票号id
 * @returns
 */
export function discardInvoice (invoiceId) {
  return axios.post(url + 'discardInvoice/', {
    invoiceId
  })
}

/**
 * 作废支付流水 (付款记录、付款记录)
 *
 * @export
 * @param {*} id         付款单id
 * @returns
 */
export function discardDetail (id) {
  return axios.post(url + 'discardDetail/', {
    id,
  })
}
/**
 * 入库付款（付款也叫支付）
 *
 * @export
 * [{
    paymentId,
    paymentNo,
    billAmount,
    unpaidAmount,
    paymentMethod,
    unreceivedAmount,
    payAmount,
    remarks
  }]
 * @param {*} paymentId             付款单id
 * @param {*} paymentNo             付款单code
 * @param {*} billAmount            账单金额
 * @param {*} unpaidAmount          未支付金额
 * @param {*} paymentMethod         支付方式
 * @param {*} unreceivedAmount      未付金额
 * @param {*} payAmount             支付金额
 * @param {*} remarks               备注
 * @returns
 */
export function pay (arr) {
  return axios.post(url + 'pay/', arr)
}

/**
 * 退库收款（收款）
 *
 * @export
 * [{
 *  id,
 *  paymentNo,
 *  mount,
 *  paymentMethod
 *  remarks
 * }]
 * @param {*} id                    收款单id
 * @param {*} paymentNo             收款单code
 * @param {*} mount                 收款金额
 * @param {*} paymentMethod         支付方式
 * @param {*} remarks               备注
 * @returns
 */
export function receivable (arr) {
  return axios.post(url + 'receivable/', arr)
}
