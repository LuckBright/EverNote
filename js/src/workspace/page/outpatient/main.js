import patientList from './patient_list'
import reportDialog from '@/infusion/components/report.card.vue'
import patientHeader from '@/inpatient/components/common.head.js'
import patienthistory from './patienthistory'
import quoteLayout from '@/workspace/components/bingliref'
import recipeTemplate from '@/sob/components/template/recipe.layout'
import menzhenbingli from './menzhenbingli'
import openRecipe from '../prescription/treat.vue'
import diagnosticAid from '../diagnostic-aid'
import setMealQuote from '@/workspace/components/set.meal.quote'
import filtrate from '@/inpatient/components/medical.orders/filtrate'
import api from '../../store/diagnosisapi'

import ExamMain from '../examination/examlist'
import setMealApi from '@/workspace/store/set.meal.api'
import storage from '@/util/storage'
import proofapi from '@/workspace/store/proofrecord'
import phrformDialog from '@/form/components/phrform.dialog.vue'

import medicalBackground from '@/workspace/page/outpatient/medical.background'
import printbtn from '@/print/components/printbtn'

// import {domClickHandle} from '@/util/common'
export default {
  provide () {
    return {
      recordInfo: this.recordInfo
    }
  },
  props: ['space'],
  data () {
    return {
      recordInfo: {},
      printLang: '',
      phrDataId: '-1',
      config: false,
      checkprint: '',
      currentComp: '',
      appoint: '',
      shareInfo: '',
      results: '',
      shareTime: '',
      schemaId: '',
      hasNew: false,
      setMealStatus: false,
      activeName: 'xbl',
      style: {
        left: '-350px'
      },
      key: false,
      queryData: this.$route.query,
      timer: '',
      clientId: '',
      hasNewObj: {
        jc: false,
        jy: false
      }
    }
  },
  watch: {
    '$route.query': {
      handler (val) {
        // 复诊患者展示历史就诊记录
        if (
          val.patientId &&
          val.patientId !== this.queryData.patientId &&
          val.subsequentVisit !== '4' &&
          this.$hasPermission('Auth_menu_outdoctor_bljl')
        ) {
          this.openhistory(val)
        }
        this.queryData = val || {}
        this.queryData.dptId = this.queryData.dptId || this.queryData.providerId || ''
        this.queryData.disabled = !!val.disabled
        this.queryData.fromQuick = !!val.fromQuick
        this.currentComp = ''
        this.activeName = 'xbl'
        this.queryData.status = this.queryData.status || ''
        if (val.patientId) {
          this.key = val.patientId + val.timeStamp
          // 注掉病历首页功能
          // this.checkProof()
        } else {
          this.key = false
        }
        this.selectOrderByPatient()
      },
      immediate: true,
      deep: true
    },
    currentComp (val) {
      this.$nextTick(_ => {
        this.$bus.$emit('noticeMsg', this.hasNewObj)
      })
    },
    activeName (val) {
      this.currentComp = ''
      if (val === 'kcf' && Number(this.queryData.subsequentVisit) !== 4) {
        this.$bus.$emit('isGetAdvice')
        if (this.$refs.recipe && this.$refs.recipe.$refs.wait) {
          this.$refs.recipe.$refs.wait.getWaitData()
          this.$refs.recipe.$refs.wait.getRecipeData()
        }
      }
    }
  },
  created () {
    if (this.queryData.patientId) {
      this.noticeMsg()
    }
    this.$bus.$on('saveEntry:obj', val => {
      this.currentComp = ''
    })
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  },
  methods: {
    // 检验检查消息轮询通知
    async noticeMsg () {
      let _this = this
      await this.noticeMsgReq('jc', 'noticeMsgGet')
      await this.noticeMsgReq('jy', 'noticeMsgGet')
      this.$bus.$emit('noticeMsg', this.hasNewObj)
      this.timer = setTimeout(() => {
        _this.noticeMsg()
      }, 10000)
    },
    async noticeMsgReq (diff, name) {
      let params = {
        clientId: this.clientId,
        patientId: this.queryData.patientId,
        visitId: this.queryData.visitSn,
        scenesType: 3,
        msgType: diff === 'jy' ? 1 : 2,
        timeOut: 10000
      }
      let res = await api[name](params)
      if (res.head.errCode === 0) {
        this.clientId = res.data.clientId
        if (name === 'noticeMsgGet') {
          if (diff === 'jc') this.hasNewObj.jc = res.data.hasNew
          else this.hasNewObj.jy = res.data.hasNew
          if (this.hasNewObj.jc || this.hasNewObj.jy) this.hasNew = true
        } else {
          if (diff === 'jc') this.hasNewObj.jc = false
          else this.hasNewObj.jy = false
        }
      }
    },
    medicalSaveSuccess () {
      if (!this.$refs.medicalBackground) return
      this.$refs.medicalBackground.save()
    },
    success (val) {
      this.phrDataId = val.id
    },
    save () {
      this.$refs.phrformdialog.$refs.form.save()
    },
    checkProof () {
      const params = {
        dptId: this.queryData.dptId, // 科室id
        patientId: this.queryData.patientId, // 病人id
        code: `MEN_ZHEN_BING_LI_SHOU_YE` // 病历code编号
      }
      proofapi.check(params).then(res => {
        this.config = res.data.config
        this.isEject = res.data.record == null
        this.printCode = res.data.template ? res.data.template.printCode : ''
        if (this.config) {
          this.clinicId = res.data.template.origId
          if (this.isEject) {
            this.phrDataId = '-1'
            // this.openPhrDialog()
          } else {
            this.phrDataId = res.data.record.id
          }
        }
      })
    },
    // 4.11.1 空方法注释掉 by lvjiangtao@everjiankang.com
    // openPhrDialog () {
    //   // 715注掉了，目前没有机构在用病历首页功能，815会做优化
    //   // if (this.$refs.phrformdialog) this.$refs.phrformdialog.open()
    // },
    setSchemaId (val) {
      this.schemaId = val
    },
    openhistory (patient) {
      if (!patient.patientId) return
      api
        .getOutHosiptalHistoryByPatientId({
          patientId: patient.patientId, // string 是 患者ID
          // dptId: this.queryData.dptId, //  string 是 科室ID
          // visitId: this.queryData.visitSn, //  string 是 就诊ID
          // metaNameList: ['诊疗计划', '症状', '观察结果'] //  list 否 数据元名称列表
        })
        .then(res => {
          if (res && res.data && res.data.length) {
            if (sessionStorage.getItem('yihuchangType') !== '1') {
              this.toggle('patienthistory', 'right')
            }
          }
          sessionStorage.removeItem('yihuchangType')
        })
    },
    openReport (value) {
      // this.$emit('openReport', value)
      this.$refs.reportDialog.openDialog(value)
    },
    refresh_page (item) {
      this.$router.push({
        path: '/workspace/outpatient',
        query: item
      })
      this.$router.go(0)
    },
    diagnostic_aid_cancle () {
      this.toggle('diagnosticAid', 'right')
    },
    toggleFromParent () {
      this.currentComp = ''
      this.direction = ''
    },
    toggle (comp, direction) {
      if (comp !== 'patienthistory' && comp !== 'medicalBackground' && comp !== '' && this.queryData.disabled) return
      if (!this.currentComp) {
        this.direction = ''
      }
      if (comp === this.currentComp) {
        // 要操作的也当前组件相同则隐藏组件
        this.currentComp = ''
        this.direction = ''
        if (comp === 'setMeal') {
          this.selectOrderByPatient()
        }
      } else {
        if (!this.direction || direction === this.direction) {
          // 如果前后方向相同，或者原来不存在方向则立即设置组件显示
          this.currentComp = comp
        } else {
          this.currentComp = ''
          setTimeout(_ => {
            this.currentComp = comp
          }, 300)
        }
      }
      this.direction = direction
    },
    toggle_new (comp) {
      if (this.changeStyle) this.changeStyle(true)
      // 增加点击图标，展示弹窗时，隐藏已经打开的popover，延时，增加视觉效果
      setTimeout(() => {
        let els = document.querySelectorAll('.el-popover')
        els.forEach(el => {
          el.style.cssText = 'display:none;'
        })
      }, 150)
      if (this.disabled && comp !== 'patienthistory' && comp !== 'medicalBackground' && comp !== '') {
        return
      }
      if (comp === this.currentComp) {
        // 要操作的也当前组件相同则隐藏组件
        this.currentComp = ''
        if (comp === 'setMeal') {
          this.selectOrderByPatient()
        }
      } else {
        this.currentComp = comp
      }
    },
    quoteHandle (data) {
      let obj = JSON.parse(JSON.stringify(data))
      delete obj.dptId
      delete obj.doctorId
      delete obj.doctorName
      delete obj.id
      delete obj.orderId
      delete obj.orderItemId
      delete obj.providerId
      delete obj.taskId
      delete obj.visitId
      delete obj.visitSn
      if (obj.allergicHis && obj.allergicHis.length) {
        obj.hasAllergicHis = true
      }
      if (obj.furTryHis && obj.furTryHis.length) {
        obj.hasFurTryHis = 1
      }
      if (typeof obj.bodyCheck === 'string') {
        obj.bodyCheck = {}
      } else {
        obj.bodyCheck && delete obj.bodyCheck.id
      }
      if (obj.results) {
        obj.results = obj.results.map(v => {
          delete v.id
          v.visitSn = this.queryData.visitSn
          v.dptId = this.queryData.dptId
          return v
        })
      }
      this.$refs.patientcase.setTpl(obj)
    },
    quoteRecommend (val) {
      let data = []
      val.map((v, i) => {
        data.push({
          isMain: 0,
          adviceType: v.serviceClassification,
          visitType: 1,
          status: '',
          termType: 0,
          isEntrust: v.isEntrust,
          adviceId: new Date().getTime() + i,
          itemId: v.id,
          serviceItem: v,
          serviceId: v.id,
          adviceName: v.name + v.spec,
          serviceName: v.name,
          count: 1,
          countUnitId: v.unit,
          countUnit: v.unitName,
          startTime: '',
          endTime: '',
          price: v.price,
          disposeContent: 1 + v.unitName,
          adviceContent: v.serviceClassification === 801 ? 1 + v.unitName : '',
          results: '',
          appoint: ''
        })
      })
      this.$refs.recipe.setInitData(data)
    },
    quoteRecipe (data, type) {
      this.activeName = 'kcf'
      this.currentComp = ''
      this.$refs.recipe.setInitData(data, type)
    },
    getDesignerId (val) {
      this.recordInfo.designerId = val
    },
    setAppoint (val) {
      this.appoint = val
    },
    setResults (val) {
      this.results = val
    },
    setBaseMedicalInfo (val) {
      this.shareInfo = val
    },
    async selectOrderByPatient () {
      if (this.queryData.patientId) {
        let params = {
          patientId: this.queryData.patientId,
        }
        if (this.$route.query.dptId) {
          params.deptCode = this.$route.query.dptId
        }
        const res = await setMealApi.selectOrderByPatient(params)
        if (res && res.data && res.data.length) {
          res.data.forEach(item => {
            if (!this.setMealStatus) {
              this.getOrderBySetMealId(item)
            }
          })
        } else {
          this.setMealStatus = false
        }
      }
    },
    async getOrderBySetMealId (item) {
      let params = {
        containService: parseInt(this.$ever.getClinicConfig().mealContainService),
        itemName: '',
        setMeal: item.setMealId,
        orderMealId: item.orderId
      }
      const res = await setMealApi.getOrderBySetMealId(params)
      if (res && res.data && res.data.length) {
        res.data.forEach(sitem => {
          if (sitem && sitem.serviceInfos && sitem.serviceInfos.length > 0) {
            sitem.serviceInfos.forEach(mitem => {
              let localSessionCount = storage.getSessionStorage(
                `SET_MEAL_${mitem.orderDetailId}`
              )
              if (localSessionCount && localSessionCount.itemNumFinished) {
                mitem.itemNumFinished = localSessionCount.itemNumFinished
              }
              mitem.count = mitem.count || 0
              mitem.itemNumFinished = mitem.itemNumFinished || 0
              if (mitem.count - mitem.itemNumFinished > 0) {
                this.setMealStatus = true
              }
            })
            return sitem
          }
        })
      }
    }
  },
  components: {
    phrformDialog,
    patientHeader,
    patienthistory,
    quoteLayout,
    recipeTemplate,
    menzhenbingli,
    openRecipe,
    diagnosticAid,
    reportDialog,
    setMealQuote,
    filtrate,
    ExamMain,
    patientList,
    medicalBackground,
    printbtn
  },
  mounted () {
    this.sesstionKey = `${this.space}Key`
    // domClickHandle('patient_list', _ => {
    //   this.toggleFromParent()
    // })
    this.$bus.$off('yihu:recipeTemplate')
    this.$bus.$on('yihu:recipeTemplate', () => {
      this.toggle('recipeTemplate', 'left')
    })
    this.$bus.$off('toggle_off')
    this.$bus.$on('toggle_off', () => {
      this.toggle_new()
    })
    this.$bus.$off('menzhanshuaxin')
    this.$bus.$on('menzhanshuaxin', () => {
      this.setChuzhi()
    })
    this.$bus.$off('yihu:setRecipeTemplateToWaitarea')
    this.$bus.$on('yihu:setRecipeTemplateToWaitarea', val => {
      this.quoteRecipe(val)
    })
    this.$bus.$off('update:setMeal')
    this.$bus.$on('update:setMeal', val => {
      this.selectOrderByPatient()
    })
    this.$bus.$off('closeNoticeMsg')
    this.$bus.$on('closeNoticeMsg', val => {
      if (val === 'jiancha') {
        this.noticeMsgReq('jc', 'noticeMsgReset')
      } else if (val === 'jianyan') {
        this.noticeMsgReq('jy', 'noticeMsgReset')
      } else {
        this.hasNew = val
      }
    })
    this.selectOrderByPatient()
  },
  computed: {
    headerInfo () {
      return {
        patientId: this.queryData.patientId,
        visitNumber: this.queryData.visitSn || this.queryData.visitNumber,
        code: this.queryData.subsequentVisit === 4 ? '006' : '001'
      }
    },
    backbg: function () {
      return this.currentComp !== ''
    },
    medicalBackgroundShow () {
      return (
        this.currentComp === 'medicalBackground' && this.activeName === 'xbl'
      )
    },
    showTabText: function () {
      if (this.queryData.subsequentVisit !== '4') {
        return '写病历'
      } else {
        if (Number(this.queryData.examType) === 1) {
          return '总检报告'
        }
        if (Number(this.queryData.examType) === 2) {
          return '分检报告'
        }
      }
    },
    disabled () {
      /**
       * status 一逗号分割的字符串'ma,history,other'
       * ma - 医疗主管
       * history - 历史患者
       * others - 非本人患者
       */
      let statusStr = this.$route.query.status || ''
      let status = statusStr ? statusStr.split(',') : []

      // 非本医生患者
      let disabled = status.includes('others') || false
      if (status.includes('ma')) {
        disabled = false
      }
      if (status.includes('history')) {
        disabled = true
      }
      return disabled
    }
  }
}
