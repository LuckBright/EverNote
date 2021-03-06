export const regs = {
  mobile: /^((\+\d{1,2})?)1\d{10}$/,
  email: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
  number: /^\d*$/, // 不严格的整数
  digit: /(^[1-9]\d*$)|(^0\.\d+$)|(^[1-9]\d*\.\d+$)/, // 只能输入数字
  longitude: /^[-]?(0?\d{1,2}\.\d{1,6}|1[0-7]?\d\.\d{1,6}|180\.0{1,6})$/, // -180.0～180.0，必须输入1到6位小数
  latitude: /^[-]?([0-8]?\d\.\d{1,6}|90\.0{1,6})$/, // -90.0～90.0，必须输入1到6位小数
  orgCode: /^\d{3}$/,
  commonCode: /^[a-zA-Z_0-9.]*$/,
  password: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,}$/,
  idCard: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
  jobNumber: /^[a-zA-Z0-9]{1,8}$/,
}
