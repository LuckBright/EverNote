import supplierapi from '@/warehouse/store/supplierapi.js'
import { formCheckPositiveInt } from '@/util/validate'

let schema = [
  {
    name: 'base',
    label: '供应商基本信息',
    comp: 'readonlyitem',
    parentClass: 'title',
    style: 'display: none;'
  },
  {
    name: 'name',
    label: '供应商名称',
    props: {
      disabled: false
    },
    mix: 1,
    span: 9
  },
  {
    name: 'legalPerson',
    label: '法人代表',
    span: 9
  },
  {
    name: 'registeredCapital',
    label: '注册资金',
    comp: 'custom',
    span: 9
  },
  {
    name: 'postalCode',
    label: '邮政编码',
    span: 9
  },
  {
    name: 'address',
    label: '企业地址',
    span: 18,
    comp: 'ever-address'
  },
  {
    name: 'linkman',
    label: '联系人姓名',
    span: 9
  },
  {
    name: 'phone',
    label: '电话',
    comp: 'custom',
    span: 9
  },
  {
    name: 'email',
    label: '邮箱',
    span: 9
  },
  {
    name: 'fax',
    label: '传真',
    comp: 'custom',
    span: 9
  },
  {
    name: 'card',
    label: '证照信息',
    comp: 'readonlyitem',
    parentClass: 'title',
    style: 'display: none;'
  },
  {
    name: 'licenceCode',
    label: '药品经营（生产）许可证号',
    span: 9
  },
  {
    name: 'licenceDisableDate',
    label: '有效期至',
    comp: 'el-date-picker',
    style: 'width: 100%',
    props: {
      valueFormat: 'yyyy-MM-dd',
      pickerOptions: {},
      disabled: true
    },
    span: 9
  },
  {
    name: 'licenceDisableRemindDate',
    label: '提醒时间',
    comp: 'custom',
    span: 6
  },
  {
    name: 'unifiedCode',
    label: '社会统一信用代码',
    props: {
      disabled: false
    },
    span: 9
  },
  {
    name: 'operatingDate',
    label: '营业期至',
    comp: 'el-date-picker',
    style: 'width: 100%',
    props: {
      valueFormat: 'yyyy-MM-dd',
      pickerOptions: {},
      disabled: true
    },
    span: 9
  },
  {
    name: 'operatingRemindDate',
    label: '提醒时间',
    span: 6,
    comp: 'custom'
  },
  {
    name: 'depositBank',
    label: '开户银行',
    span: 9
  },
  {
    name: 'bankAccount',
    label: '银行账号',
    span: 9
  },
  {
    name: 'gspCode',
    label: 'GSP证书编号',
    props: {
      clearable: true
    },
    span: 9
  },
  {
    name: 'gspDisableDate',
    label: '有效期至',
    comp: 'el-date-picker',
    style: 'width: 100%',
    props: {
      valueFormat: 'yyyy-MM-dd',
      pickerOptions: {},
      disabled: true
    },
    span: 9,
  },
  {
    name: 'gmpCode',
    label: 'GMP证书编号',
    span: 9
  },
  {
    name: 'gmpDisableDate',
    label: '有效期至',
    comp: 'el-date-picker',
    style: 'width: 100%',
    props: {
      valueFormat: 'yyyy-MM-dd',
      pickerOptions: {},
      disabled: true
    },
    span: 9,
  },
  {
    name: 'qualityPrestiges',
    label: '质量信誉',
    comp: 'custom',
    span: 22
  },
  {
    name: 'description',
    label: '备注',
    span: 18,
    comp: 'textarea'
  },
  {
    name: 'fileUrl',
    label: '资质附件',
    comp: 'custom',
    span: 18
  }
]

let checkOptions = [
  { id: 1, name: '药品生产许可证' },
  { id: 2, name: '药品经营许可证' },
  { id: 3, name: 'GMP认证证书' },
  { id: 4, name: 'GSP认证证书' },
  { id: 5, name: '社会统一信用代码' },
  { id: 6, name: '企业商标注册证' },
  { id: 7, name: '购销员身份证复印件' },
  { id: 8, name: '购销员上岗证' },
  { id: 9, name: '法人委托书' },
  { id: 10, name: '质量保证协议' },
  { id: 11, name: '企业印制样式' }
]

export default {
  data () {
    let validateNameAndUnifiedCode = (rule, value, callback) => {
      let operatingDate = this.$ever.getFieldFromSchema(this.schema, 'operatingDate').props
      if (!value) {
        if (rule.field === 'unifiedCode') {
          operatingDate.disabled = true
          this.obj.operatingDate = ''
        }
        return callback(new Error('必填项'))
      }
      if ((this.objDetail.unifiedCode === value || this.objDetail.name === value) && this.objId) {
        if (rule.field === 'unifiedCode') {
          operatingDate.disabled = false
        }
        return callback()
      }
      let params = {
        name: '',
        id: this.objId,
        unifiedCode: ''
      }
      const UNIFIED_SOCIAL_CREDIT_CODE = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/
      if (rule.field === 'unifiedCode' && !UNIFIED_SOCIAL_CREDIT_CODE.test(value)) return callback(new Error('请输入正确的统一社会信用代码'))
      params[rule.field] = value
      supplierapi.queryContainNameCode(params).then(res => {
        if (res.flag) {
          let codeMsg = ''
          if (rule.field === 'unifiedCode') {
            codeMsg = this.isClinic ? `社会统一信用代码与${res.name}重复，请核实供应商信息或联系集团授权。` : `社会统一信用代码与${res.name}重复，请核实供应商信息`
          } else {
            codeMsg = this.isClinic ? '当前供应商名称集团中已存在,请核实供应商信息或联系集团授权。' : '当前供应商名称集团中已存在,请核实供应商信息'
          }
          return callback(new Error(codeMsg))
        } else {
          if (rule.field === 'unifiedCode') {
            operatingDate.disabled = false
          }
          return callback()
        }
      })
    }
    let newValidteEmail = (rule, value, callback) => {
      let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z-]+)*\.[a-zA-Z]{2,6}$/
      if (!value) return callback()
      if (reg.test(value)) {
        callback()
      } else {
        return callback(new Error('请输入正确的邮箱格式'))
      }
    }
    let validatePostalCode = (rule, value, callback) => {
      callback()
    }
    let validateCode = (rule, value, callback) => {
      let schema = this.$ever.getFieldFromSchema(this.schema, rule.schema).props
      if (!value) {
        schema.disabled = true
        this.obj[rule.schema] = ''
        if (rule.date) {
          this.obj.licenceDisableRemindDate = undefined
        }
        callback()
        return
      }
      if (value.length > rule.max || value.length < rule.min) {
        return callback(new Error(rule.message))
      } else {
        schema.disabled = false
        return callback()
      }
    }
    return {
      schema,
      api: supplierapi,
      checkOptions,
      rules: {
        licenceDisableRemindDate: [
          { validator: formCheckPositiveInt, triggerL: 'blur' }
        ],
        operatingRemindDate: [
          { validator: formCheckPositiveInt, triggerL: 'blur' }
        ],
        gmpCode: [
          { min: 6, max: 20, message: '请输入正确的GMP证书编号', trigger: 'blur', validator: validateCode, schema: 'gmpDisableDate', }
        ],
        gspCode: [
          { min: 6, max: 20, message: '请输入正确的GSP证书编号', trigger: 'blur', validator: validateCode, schema: 'gspDisableDate', }
        ],
        licenceCode: [
          { min: 6, max: 20, message: '请输入正确的药品经营（生产）许可证号', trigger: 'blur', validator: validateCode, schema: 'licenceDisableDate', date: true }
        ],
        legalPerson: [
          { min: 2, max: 20, message: '请输入正确的姓名', trigger: 'blur' }
        ],
        postalCode: [
          { validator: validatePostalCode, message: '请输入正确的邮政编码' }
        ],
        name: [
          { required: true, trigger: 'blur', validator: validateNameAndUnifiedCode },
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
        ],
        phone: [
          { min: 5, max: 30, trigger: 'blur', message: '请输入正确的电话号码' }
        ],
        type: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        supplierName: [
          { required: true, message: '必填项', trigger: 'blur' },
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
        ],
        unifiedCode: [
          { required: true, validator: validateNameAndUnifiedCode, trigger: 'blur' },
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
        ],
        linkman: [
          { min: 2, max: 40, message: '长度在 2 到 40 个字符', trigger: 'blur' }
        ],
        email: [
          { validator: newValidteEmail, trigger: 'blur', message: '请输入正确格式的邮箱' }
        ],
        fax: [
          { min: 5, max: 30, trigger: 'blur', message: '请输入正确的传真号码' }
        ],
        description: [
          { max: 100, message: '最多100个字符' }
        ]
      }
    }
  },
}
