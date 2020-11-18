import templateManageUrl from '@/emr/urls'
import urlsfortech from '@/infusion/urlsfortech.js'
import { request } from '@/util/req'
import storage from '@/util/storage'
import checkName from '@/emr/components/check.tpl.name'
import {BING_CHENG_JI_LU_CODE} from '@/emr/config/template.config.js'
import {commandLog} from '@/phr/mixin/operationLog.js'
export default{
  components: {
    checkName
  },
  props: {
    editorInfo: {
      type: Object,
      default () {
        return {
          element: '', // 表单是样式,文档是数据+样式
          pageSettings: '', // 文档要用
          content: '', // 表单数据
          formTemplateId: '',
          designerId: '',
          code: '',
          name: ''
        }
      }
    },
    visitId: {
      type: String
    },
    patientId: {
      type: String
    },
    patientName: {
      type: String
    },
    pageType: {
      type: String
    },
    dptId: {
      type: String
    },
    visible: {
      type: Boolean,
      default: false
    },
    tplType: {// hospital_normal住院普通模版 hospital_entry住院词条模版 clinic_normal门诊普通模版
      type: String,
      default: 'hospital_normal'
    },
    space: {
      type: String,
      default: ''
    },
    levelOneName: {
      type: String
    }
  },
  data () {
    return {
      templateManageUrl,
      tplName: '模版名称',
      tplCategory: '模版类型',
      formLabelWidth: '120px',
      form: {
        name: '',
        businessType: '2',
        businessId: '',
        categoryId: '',
        categoryName: '',
        anotherRecord: 0,
        anotherPage: 0
      }
    }
  },
  computed: {
    modelAttrrDisabled () {
      return !BING_CHENG_JI_LU_CODE.includes(this.editorInfo.code)
    },
    isHospitalNormal () {
      return this.tplType === 'hospital_normal'
    }
  },
  watch: {
    'form.businessType' (val) {
      this.changeBusinessId()
      this.$refs.checkName.$refs.tplName.validateField('name')
    }
  },
  created () {
    if (this.space === 'tech') this.templateManageUrl = urlsfortech
    this.changeBusinessId()
    this.getCategoryIdByCode()
    this.initForm()
  },
  methods: {
    initForm () {
      if (this.tplType === 'hospital_entry') {
        this.tplName = '词条名称'
        this.tplCategory = '词条类型'
      }
      if (this.tplType !== 'hospital_normal') {
        delete this.form.anotherRecord
        delete this.form.anotherPage
      }
    },
    getCategoryIdByCode () { // 通过这个接口获取到分类的id和nanme
      // 如果是词条模版，用固定的code
      let code = this.tplType === 'hospital_entry' ? 'CT_NEI_RONG_CI_TIAO' : this.editorInfo.code
      request(this.templateManageUrl.templateManage.getCategoryId, {
        code: code
      }).then(res => {
        if (res.head.errCode === 0) {
          this.form.categoryId = res.data.id
          this.form.categoryName = res.data.name
        }
      })
    },
    submit () {
      this.$refs.checkName.$refs.tplName.validate((valid) => {
        if (valid) {
          this.saveTpl()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeBusinessId () {
      if (this.space === 'tech') { // businessType 2 个人  0 集团
        if (this.form.businessType === '0') {
          this.form.businessId = storage.getLocalStorage('TENANTID') // 集团Id
        } else if (this.form.businessType === '2') {
          this.form.businessId = storage.getLocalStorage('USERID')
        }
      } else {
        if (this.form.businessType === '2') {
          this.form.businessId = storage.getLocalStorage('USERID')
        } else if (this.form.businessType === '1') {
          this.form.businessId = storage.getLocalStorage('CLINICID')
        } else if (this.form.businessType === '3') {
          this.form.businessId = this.dptId
        }
      }
    },
    saveTpl () {
      let params = Object.assign({
        designerId: this.editorInfo.designerId
      }, this.form)
      if (this.editorInfo.designerId === '1') {
        // 保存表单编辑器需要的参数
        params.formTemplateReq = {
          designerId: '1',
          templateId: null,
          schema: {
            designerId: '1',
            templateId: this.editorInfo.formTemplateId,
            templateName: this.form.name,
            element: this.editorInfo.element,
            props: this.editorInfo.props
          }
        }
        params.formDataReq = {
          formTemplateId: this.editorInfo.formTemplateId,
          data: this.editorInfo.content
        }
        if (params.formDataReq.data && params.formDataReq.data.hasOwnProperty('undefined')) {
          delete params.formDataReq.data['undefined']
        }
      } else {
        // 文档编辑器需要的参数
        params.formTemplateReq = {
          designerId: '2',
          templateId: null,
          schema: {
            templateName: this.form.name,
            element: this.editorInfo.element,
            editable: true,
            formTemplateId: this.editorInfo.formTemplateId,
            pageSettings: this.editorInfo.pageSettings,
            templateId: null
          }
        }
      }

      request(this.templateManageUrl.templateManage.saveTpl, params).then(res => {
        if (res.head.errCode === 0) {
          // 将${this.editorInfo.name}另存为${this.form.name}
          commandLog({
            content: `将${this.editorInfo.name}另存为${this.form.name}`,
            opModuleOne: `${this.levelOneName}-${this.pageType}-${this.editorInfo.categoryName}`,
            opType: 'SAVE_AS_TEMPLATE',
            patientId: this.patientId,
            visitNumber: this.visitId,
            patientName: this.patientName
          })
          this.$emit('submit')
          this.$messageTips(this, 'success', '保存成功', '提示')
        }
      })
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
