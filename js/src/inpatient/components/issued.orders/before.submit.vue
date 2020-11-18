<template>
  <div class="order-check">
    <!-- 处方权验证不通过弹窗 -->
    <doctor-limit-dialog :limit-show.sync="limitValid" :limit-medicine="limitMedicine"></doctor-limit-dialog>
    <!-- 库存不足 -->
    <el-dialog
      v-if="wringStockList[0]"
      :visible.sync="noStockSubmit"
      title="警告"
      size="small"
      class="ui_dialog_02"
      @close="cancelStock"
    >
      <div class="waring-wrap">
        <span class="title">{{$t('库存不足')}}</span>
        <ul>
          <li v-for="(item, i) in wringStockList" :key="i">
            <template>{{i + 1}}、{{item.serviceItem.byname || item.serviceItem.name}}</template>
            <template v-if="item.serviceItem.spec">{{item.serviceItem.spec}}</template>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
				<template v-if="stockPermission">
					<el-button @click="cancelStock">
						<i class="icon iconfont icon-quxiao"></i>{{$t('取消')}}
					</el-button>
					<el-button type="primary" @click="conSubmitStock">
						<i class="icon iconfont icon-tijiao"></i>{{$t('继续提交')}}
					</el-button>
				</template>
				<el-button @click="cancelStock" type="primary" v-else>
					<i class="icon iconfont icon-quxiao"></i>{{$t('我知道了')}}
				</el-button>
      </div>
    </el-dialog>
    <!-- cdss建议弹窗 -->
    <el-dialog
      v-if="wringData[0]"
      :visible.sync="showCdss"
      title="用药提示"
      size="tiny"
      class="ui_dialog_02"
      ref="cdssConfirm"
      @close="closeCdssEvent"
    >
      <drugCdss :wringData="wringData"></drugCdss>
      <div slot="footer" class="dialog-footer" style="position:relative;z-index: 10">
        <el-button @click="closeCdssEvent">
          <i class="icon iconfont icon-quxiao"></i>
          {{$t('修改医嘱')}}
        </el-button>
        <el-button type="primary" @click="confirmCdssSubmit">
          <i class="icon iconfont icon-tijiao"></i>
          {{$t('确认提交')}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import medicalapi from '@/workspace/store/medicalapi'
import { objKeyBy, objFind } from '@/util/common'
import { getDoctorLimit } from '../doctor.state'
import storage from '@/util/storage'
import formphrapi from '@/form/store/phrapi'
import doctorLimitDialog from '../doctor.state/doctor.limit.dialog.vue'
import drugCdss from './drug.cdss.vue'
import api from '@/inpatient/components/issued.orders/api.js'
import sysvalue from '@/warehouse/store/sysvalueapi'

function getSysTypeByCode (code, val, type) {
  if (!window.sessionStorage.getItem(code) || !val) {
    return ''
  } else {
    let out = JSON.parse(window.sessionStorage.getItem(code), true).options.filter(v => {
      return String(v.code) === String(val) ||
        String(v.id) === String(val) ||
        String(v.value) === String(val)
    })[0]
    let name = out && out.name ? out.name : ''
    if (storage.getLocalStorage('LANG') === 'en') {
      name = out && out.nameEn ? out.nameEn : ''
    }
    return out ? !type ? name : out[type] : ''
  }
}

export default {
  components: {
    doctorLimitDialog,
    drugCdss
  },
  props: {
    baseInfo: {
      type: Object,
      required: true
    },
    checkList: { // ['diagnose', 'limit', 'number', 'sendclinic', 'cdss', 'insurance']
      type: Array,
      default: () => []
    },
    scene: Number,
    isSend: { // 库房配送 false-库房校验 true-库房不校验
      type: Boolean,
      default: false
    },
    isCheckStock: {  // 自备药是否校验库房，false 不校验 true 校验
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      wringData: [], // cdss
      showCdss: false, // cdss弹窗
      checkIndex: 0,
      limitValid: false, // 处方权弹窗
      limitMedicine: [], // 没有的处方权列表
      wringStockList: [],
      noStockSubmit: false,
      stockPermission: true // 是否允许缺库存提交
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      // main_flag:父子医嘱标识. 0-常规医嘱 1-父医嘱 2-子医嘱
      this.initData()
      this.$bus.$off('check:orderdata')
      this.$bus.$on('check:orderdata', ({data, type, success, fail}) => {
        // type: 'update'-更新, 'create'-创建
        // 第1步 先检查病历的诊断信息
        // 第2步 检查处方权
        // 第3步 检查基础信息 住院没有执行时间不让提交
        // 第4步 检查库存
        // 第5步 检查cdss
        // 第6步 检查医保
        this.type = type || 'create'
        this.checkData = data
        this.submitCallback = {
          done: success,
          fail
        }
        this.validateOrder(data)
      })
    },
    initData () {
      this.limit = {}
      this.checkIndex = 0
      this.checkData = null
      // this.limitValid = false
      // this.limitMedicine = []
      this.wringData = []
      this.showCdss = false
      this.wringStockList = []
      this.noStockSubmit = false
      this.submitCallback = ''
    },
    validateOrder (data) {
      if (this.checkList.length) {
        this.nextCheck()
      } else {
        this.submit()
      }
    },
    nextCheck () {
      let len = this.checkList.length
      if (this.checkIndex >= len) {
        this.checkIndex = 0
        this.submit()
        return
      }
      let name = this.checkList[this.checkIndex]
      this.checkIndex++
      name = name.slice(0, 1).toUpperCase() + name.slice(1)
      if (this[`check${name}`]) {
        this[`check${name}`]()
      } else {
        this.$emit('selfCheck', this.checkData, this.nextCheck.bind(this))
      }
    },
    submit () {
      this.$emit('submit', this.listFormat(), this.type, () => {
        this.submitCallback.done && this.submitCallback.done()
        this.initData()
      }, () => {
        this.submitCallback.fail && this.submitCallback.fail()
      })
    },
    // 数据
    listFormat () {
      let datas = JSON.parse(JSON.stringify(this.checkData))
      let orderData = []
      if (!datas || !datas.length) {
        return []
      }
      datas.forEach(item => {
        orderData.push(...item)
      })
      let list = orderData.map(item => {
        item.executeProviderId = item.executeProvider ? item.executeProvider.id : this.baseInfo.provideId
        // 手术
        if (item.serviceType === '2125') {
          item.surgeryTime = item.surgeryTime && this.$moment(item.surgeryTime).format('YYYY-MM-DD HH:mm:ss')
          item.chiefKnifeId = item.doctorItem.id // 主刀医生
          item.chiefKnifeName = item.doctorItem.name
          item.anesthesiologistId = item.anesthesiologist.id // 麻醉医生
          item.anesthesiologistName = item.anesthesiologist.name
        }
        // 检验
        if (item.serviceType === '801') {
          item.mergeFlag = 0
        }
        // 组套
        if (item.setFlag) {
          item.adviceFeesDtoList = item.serviceItem && item.serviceItem.servSetItemList.map(v => {
            v.count = v.quantity // 中药和组套明细都不乘数量
            v.countUnitName = v.unitName
            v.countUnitId = v.unit
            v.feesType = 1
            v.serviceType = v.serviceClassification
            v.feesJson = {
              finType: v.finType,
              chargeLevel: v.chargeLevel || null,
              localMaterialId: v.localMaterialId || null,
              outwardDeliveryFlag: v.outwardDeliveryFlag,
              dosageForm: v.dosageForm || null, // 剂型
              dosageFormText: v.dosageFormText || null // 剂型文本
            }
            v.executeProviderName = item.executeProvider ? item.executeProvider.name : null // 执行科室名称
            v.executeProviderId = item.executeProvider ? item.executeProvider.id : null // 执行科室id
            delete v.serviceClassification
            delete v.quantity
            delete v.dosageForm
            delete v.dosageFormText
            delete v.outwardDeliveryFlag
            return v
          })
        }
        // 加adviceJson
        item.adviceJson = {
          countUnitName: item.countUnitName || null,
          measureUnitName: item.measureUnitName || null,
          specimenTypeName: getSysTypeByCode('THC_SOB_SPECIMEN_TYPE', item.specimenType, 'name') || null, // 标本类型名称
          positionName: getSysTypeByCode(item.positionValueSetCode, item.position, 'name') || null, // 检查部位名称
          executeProviderName: item.executeProvider ? item.executeProvider.name : '', // 执行科室名称
          antibioticType: item.antibioticType || null, // 限制非限制抗菌药物
          highRisk: item.highRisk || null, // 高危药品
          freeReason: item.freeReason || null, // 免单原因
          applyFormId: (item.applyForm && item.applyForm.id) || null, // 输血申请单id
          examineTarget: item.examineTarget || null, // 检查目的
          illHis: item.illHis || null, // 简要病史
          diseaseName: this.diseaseName || null, // 主诊断名称
          checkGuidance: item.checkGuidance || null, // 检验指导
          // chargeLevel: item.chargeLevel || null, // 甲乙丙类型
          shopSetItemId: item.shopSetItemId || null, // 套餐标示
          shortageFlag: item.shortageFlag || null, // 缺货标示
          globalMaterialId: item.globalMaterialId || null, // 全局物资ID
          localMaterialId: item.localMaterialId || null, // 物资ID
          doctorAdviceName: item.doctorAdviceName || null, // 医嘱内容
          dropSpeed: Array.isArray(item.employ) ? item.employ[1] : null, // 滴速
          engName: item.engName || null,
          tradeName: item.name || null,
          doctorAdviceContent: item.doctorAdviceContent || null,
          outwardDeliveryFlag: item.outwardDeliveryFlag,
          cdssResult: item.cdssResult || '', // cdss校验结果
          serviceCode: item.serviceItem && item.serviceItem.code || null, // service的code
          executeOrgName: item.executeOrgName || this.$store.state.currentUser.organizationName,
          decoctName: getSysTypeByCode('THC_SYS_DECOCTION_OF_TCM', item.decoct)
        }
        // 西药 中成药
        if (['301', '302', '3002'].includes(item.serviceType)) {
          item.employ = Array.isArray(item.employ) ? item.employ[0] : item.employ
        }
        // 中药
        if (['303', '304'].includes(item.serviceType)) {
          item.list.forEach(v => {
            v.count = v.measure
            v.countUnitId = v.measureUnitId
            v.countUnitName = v.measureUnitName
            v.footnoteName = getSysTypeByCode('THC_SYS_DECOCTINGMETHOD', v.footnote)
            v.feesType = 1 // 医嘱项是1
            v.executeProviderName = item.executeProvider ? item.executeProvider.name : null // 执行科室名称
            v.executeProviderId = item.executeProvider ? item.executeProvider.id : null // 执行科室id
            v.feesJson = {
              finType: v.serviceItem.finType,
              chargeLevel: item.chargeLevel || null,
              serviceCode: v.serviceItem.code || null, // service的code
              localMaterialId: v.localMaterialId || null, // 物资id
              outwardDeliveryFlag: v.outwardDeliveryFlag,
              dosageForm: v.dosageForm || null, // 剂型
              dosageFormText: v.dosageFormText || null // 剂型文本
            }
            delete v.serviceItem
            delete v.checkBaseInfo
            delete v.checkPriceInfo
            delete v.checkStockInfo
            delete v.sendClinicList
            delete v.dosageForm
            delete v.dosageFormText
            delete v.outwardDeliveryFlag
          })
          item.adviceFeesDtoList = item.list
        }
        if (!item.adviceFeesDtoList) {
          item.adviceFeesDtoList = [{
            serviceId: item.serviceId,
            serviceName: item.serviceName,
            count: item.count || null,
            countUnitId: item.countUnitId || null,
            countUnitName: item.countUnitName || null,
            spec: item.spec,
            serviceType: item.serviceType,
            feesType: item.type || 1,
            feesJson: {
              finType: item.serviceItem.finType,
              chargeLevel: item.chargeLevel || null,
              localMaterialId: item.localMaterialId || null,
              outwardDeliveryFlag: item.outwardDeliveryFlag,
              dosageForm: item.dosageForm || null, // 剂型
              dosageFormText: item.dosageFormText || null // 剂型文本
            },
            executeProviderName: item.executeProvider ? item.executeProvider.name : null, // 执行科室名称
            executeProviderId: item.executeProvider ? item.executeProvider.id : null // 执行科室id
          }]
        }
        if (item.sendClinic) {
          // 针对跨机构发药,不同机构localMaterialId不一样
          let localMaterialId = item.sendClinic.localMaterialId || item.localMaterialId
          if (item.localMaterialId !== localMaterialId) {
            item.localMaterialId = localMaterialId
            item.adviceJson.localMaterialId = localMaterialId
          }
          item.storageRoomId = item.sendClinic.id
          item.sendOrgId = item.sendClinic.sendOrgId
          item.dispensingWay = item.sendClinic.dispensingWay
          if (+item.dispensingWay === 3) {
            item.recipelRoamSupplierCode = item.sendClinic.id
            item.adviceJson.recipelRoamSupplierName = item.sendClinic.storageRoomName
          }
          item.adviceJson.storageRoomName = item.sendClinic.storageRoomName
          item.adviceJson.sendOrgName = item.sendClinic.sendOrgName
          item.adviceFeesDtoList && item.adviceFeesDtoList.forEach(list => {
            let sendClinic = item.sendClinic
            if (['303', '304'].includes(item.serviceType)) {
              sendClinic = list.sendClinic || {}
            }
            list.feesJson.storageRoomId = sendClinic.id
            list.feesJson.sendOrgId = sendClinic.sendOrgId
            list.feesJson.storageRoomName = sendClinic.name
            list.feesJson.sendOrgName = sendClinic.sendOrgName
            if (item.setFlag) {
              return
            }
            list.feesJson.localMaterialId = sendClinic.localMaterialId || item.localMaterialId
          })
        }
        // 频次
        if (item.useFreq) {
          if (Array.isArray(item.useFreq)) {
            let useFreq = item.useFreq
            item.useFreq = useFreq[0]
            item.useFreqTime = useFreq[1]
          }
          item.loopCycle = getSysTypeByCode('CV06.00.228', item.useFreq, 'loopCycle') || null
          item.adviceJson.useFreqName = getSysTypeByCode('CV06.00.228', item.useFreq)
        }
        // 开始时间
        if (item.startTime) {
          item.startTime = this.$moment(item.startTime).valueOf()
        }
        // 结束时间
        if (item.stopTime) {
          item.stopTime = +item.termType ? this.$moment(item.stopTime).valueOf() : ''
        }
        // 用法
        if (item.employ) {
          let employ = Array.isArray(item.employ) ? item.employ[0] : item.employ
          item.adviceJson.employName = getSysTypeByCode('CV06.00.102', employ)
        }
        // 执行机构
        if (!item.executeOrgId) {
          item.executeOrgId = this.$store.state.currentUser.organizationId
        }
        // 要删除的值
        delete item.sendClinic
        delete item.sendClinicList
        delete item.doctorItem
        delete item.anesthesiologist
        delete item.list
        delete item.serviceItem
        delete item.checkBaseInfo
        delete item.checkPriceInfo
        delete item.checkStockInfo
        delete item.executeProvider
        delete item.discountUnit
        delete item.noPermission
        delete item.packageToPrepareRatio
        delete item.doctorAdviceName
        delete item.doctorAdviceContent
        delete item.outwardDeliveryFlag
        delete item.dosageForm
        delete item.dosageFormText
        return item
      })
      return list
    },
    // 诊断病历信息
    async checkDiagnose () {
      const result = await formphrapi.getZhenduan(this.baseInfo.visitSn || this.baseInfo.visitNumber).then(res => res).catch(() => false)
      if (!result || !result.length) {
        this.$messageTips(this, 'warning', '请填写病历中的诊断信息', '提示')
        this.submitCallback.fail && this.submitCallback.fail()
        this.initData()
        this.$emit('selfCheck', this.nextCheck.bind(this))
        return false
      }
      this.diseaseName = result[0].diagList && result[0].diagList[0].diseaseName
      this.nextCheck()
    },
    // 处方权校验
    async checkLimit () {
      if (!this.checkData) {
        return
      }
      let datas = []
      this.checkData.forEach(item => {
        if (['303', '304'].includes(item[0].serviceType)) {
          datas.push(...item[0].list)
          return
        }
        datas.push(...item)
      })
      let limit = await getDoctorLimit(this.$store.state.currentUser.userId)
      this.doctorLimit = limit
      if (!limit) {
        this.limitValid = true
        this.limitMedicine = []
        this.submitCallback.fail && this.submitCallback.fail()
        this.initData()
        return
      }
      let limitMedicine = []
      datas.forEach(order => {
        order.noPermission && order.noPermission.forEach(type => {
          limitMedicine.push({
            name: order.serviceName,
            type
          })
        })
      })
      if (!limitMedicine.length) {
        this.nextCheck()
        return
      }
      this.limitValid = true
      this.limitMedicine = limitMedicine
      this.$emit('selfCheck', this.nextCheck.bind(this))
      this.submitCallback.fail && this.submitCallback.fail()
      this.initData()
    },
    // 西药数量校验
    async checkNumber () {
      if (!this.checkData) {
        return
      }
      let datas = []
      this.checkData.forEach(item => {
        if (['301', '302'].includes(item[0].serviceType)) {
          datas.push(...item)
        }
      })
      let state = true
      let errorServie = []
      datas.forEach(item => {
        if ((!item.source || item.source !== '2') && (item.executeProvider && item.executeProvider.id !== 'SOB_EXTUDE_PROVIDER_OUT')) {
          let n = Number(getSysTypeByCode('CV06.00.228', item.useFreq, 'value'))
          if (Math.floor(item.count / (n * item.useDay)) !== (item.count / (n * item.useDay))) {
            state = false
            errorServie.push(item.serviceName)
          }
        }
      })
      if (state) {
        this.nextCheck()
        return
      }
      this.$emit('selfCheck', this.nextCheck.bind(this))
      this.$messageTips(this, 'warning', `${errorServie.join('、')}数量有误，请纠正`, '提示')
      this.submitCallback.fail && this.submitCallback.fail()
      this.initData()
    },
    // 库存不足校验
    async checkSendclinic () {
      if (this.isSend) {
        this.nextCheck()
        return
      }
      if (!this.checkData) {
        return
      }
      this.checkData.forEach(item => {
        let result = this.drugStockCheck(item, item[0].serviceType)
        if (result) {
          this.wringStockList.push(...result)
        }
      })
      if (this.wringStockList.length) {
        this.stockPermission = await this.getStockPermission()
        this.noStockSubmit = true
        this.$emit('selfCheck', this.nextCheck.bind(this))
      } else {
        this.nextCheck()
      }
    },
    // 无库存校验
    async checkNoSendclinic () {
      if (!this.checkData) {
        return
      }
      let noSendclinic = []
      this.checkData.forEach(datas => {
        datas.length && datas.forEach(item => {
          if (item.source !== '2') {
            if (['303', '304'].includes(item.serviceType)) {
              item.list && item.list.forEach(v => {
                if (v.sendClinic && +v.sendClinic.usableNum === -1) {
                  noSendclinic.push(v.serviceName)
                }
              })
            } else if (item.sendClinic && item.sendClinic.usableNum === -1) {
              noSendclinic.push(item.serviceName)
            }
          }
        })
      })
      if (noSendclinic.length) {
        this.$messageTips(this, 'warning', '无库存，无法添加')
        this.noStockSubmit = false
        this.submitCallback.fail && this.submitCallback.fail()
        this.initData()
        return
      }
      this.nextCheck()
    },
    // 获取缺库存是否能提交医嘱配置
    async getStockPermission () {
      let res = await api.searchCheckConfig({
        code: 'OUT_OF_STOCK_PERMIT_SEND',
        defaultValue: '1'
      })
      if (res && +res.value) {
        return true
      }
      return false
    },
    // cdss校验
    async checkCdss () {
      if (!this.checkData) {
        return
      }
      let cnMedicineList = [] // 中药
      let wsMedicineList = [] // 西药
      this.checkData.forEach(item => {
        if (['301', '302'].includes(item[0].serviceType)) {
          wsMedicineList.push(...item)
        }
        if (['303', '304'].includes(item[0].serviceType)) {
          cnMedicineList.push(...item)
        }
      })
      let p = [] // thc cdds
      let q = [] // 中药cdss
      wsMedicineList.length && p.push(this.checkDrugItem(wsMedicineList, 2))
      cnMedicineList.length && cnMedicineList.forEach(item => {
        p.push(this.checkDrugItem(item, 1))
        q.push(this.checkDrugCdss(item))
      })

      await Promise.all(p).then((res) => {
        res.forEach(item => {
          if (item.length) {
            this.wringData.push(...item)
          }
        })
        if (this.wringData.length) {
          this.showCdss = true
        }
      })
      await Promise.all(q).then(res => {
        res.forEach(item => {
          if (item.length) {
            this.wringData.push(...item)
          }
        })
        if (this.wringData.length) {
          this.showCdss = true
        }
      })
      if (!this.showCdss) {
        this.nextCheck()
      }
    },
    // 医保校验
    async checkInsurance () {
      if (!this.checkData) {
        return
      }
      let p = []
      this.checkData.forEach(item => {
        let type = item[0].serviceType
        if (['301', '302', '303', '304'].includes(type)) {
          p.push(this.batchCheckDrug(item, type))
        }
      })
      if (!p.length) {
        this.nextCheck()
        return
      }
      Promise.all(p).then(resArr => {
        let result = []
        resArr.forEach(item => {
          result.push(...item)
        })
        if (result.length) {
          this.confirmCheckAdvice(result, () => {
            this.setMedicalInsurance(result)
          })
        } else {
          this.nextCheck()
        }
      })
    },
    // 获取药的限制类型
    getMedicineLimit (datas) {
      let limitIds = {}
      if (datas) {
        datas.forEach(item => {
          let name = item.serviceName || ''
          let id = item.serviceId
          let specialClassify = item.specialClassify && item.specialClassify.split(',')
          let antibioticType = item.antibioticType && item.antibioticType.split(',')
          // 抗菌类药物
          antibioticType && antibioticType.forEach(k => {
            if (limitIds[k]) {
              limitIds[k].push({name, id, type: k})
            } else {
              limitIds[k] = [{name, id, type: k}]
            }
          })
          // 毒麻精放类药物
          specialClassify && specialClassify.forEach(k => {
            if (limitIds[k]) {
              limitIds[k].push({name, id, type: k})
            } else {
              limitIds[k] = [{name, id, type: k}]
            }
          })
        })
      }
      limitIds.types = Object.keys(limitIds)
      return limitIds
    },
    // 库房校验
    drugStockCheck (datas, type) {
      let haveStock = []
      if (['303', '304'].includes(type)) {
        haveStock = datas[0].list.filter(item => {
          if ((!this.isCheckStock && +datas[0].source === 2) || +datas[0].source === 4) {
            return false
          }
          return !item.allotNum || item.allotNum - item.measure * datas[0].count < 0
        })
      } else {
        haveStock = datas.filter(item => {
          if ((!this.isCheckStock && +item.source === 2) || +item.source === 4 || !['301', '302', '300', '10008', '3002'].includes(type)) {
            return false
          }
          return !item.allotNum || item.allotNum - item.count < 0
        })
      }
      if (haveStock.length) {
        haveStock.forEach(item => {
          item.shortageFlag = 1
        })
        return haveStock
      }
      return false
    },
    // 关闭库房不足弹窗
    cancelStock () {
      this.noStockSubmit = false
      this.submitCallback.fail && this.submitCallback.fail()
      this.initData()
    },
    // 库房不足继续提交
    conSubmitStock () {
      this.noStockSubmit = false
      this.wringStockList = []
      this.nextCheck()
    },
    async checkDrugCdss (datas) {
      let localMaterialIds = datas.list.map(item => item.localMaterialId)
      let params = {
        bizCode: this.scene === 3 ? 'THC_RULE_ZYYZKL' : 'THC_RULE_MZYZKL',
        localMaterialIds
      }
      let res = await api.checkCdssRule(params)
      if (!res) return []
      return res.map(item => {
        return {type: 1, tipTypeName: '', part: '', tipInfo: item.message}
      })
    },
    // cdss
    async checkDrugItem (datas, type) {
      if (!datas) {
        return false
      }
      let recipeItems = []
      let params = {
        patientId: this.baseInfo.patientId,
        recipeItems,
        visitSn: this.scene === 3 ? this.baseInfo.hospitalizedNumber : (this.baseInfo.visitSn || this.baseInfo.visitNumber),
        // recipeType: ['303', '304'].includes(type) ? 1 : 2
        recipeType: type, // type: 1-'中药' 2-'西药'
        useMethod: '',
        totalAmount: 1
      }
      if (type === 2) {
        datas.forEach(item => {
          // 频次
          let useFreq = Array.isArray(item.useFreq) ? item.useFreq[0] : item.useFreq
          let useFreqName = getSysTypeByCode('CV06.00.228', useFreq)

          // 用法
          let employ = Array.isArray(item.employ) ? item.employ[0] : item.employ
          let employName = getSysTypeByCode('CV06.00.102', employ)

          recipeItems.push({
            localMaterialId: item.localMaterialId,
            globalMaterialId: item.globalMaterialId,
            medicineId: item.localMaterialId,
            medicineName: item.serviceItem.byname || item.serviceItem.name,
            singleAmount: item.measure,
            singleAmountUnitTxt: item.measureUnitName,
            totalAmount: item.count,
            allergenSecond: item.allergenSecond,
            useFreq: useFreq,
            useMethod: employ,
            useFreqName: useFreqName,
            useMethodName: employName
          })
        })
      }
      if (type === 1) {
        // 频次
        let useFreq = Array.isArray(datas.useFreq) ? datas.useFreq[0] : datas.useFreq
        let useFreqName = getSysTypeByCode('CV06.00.228', useFreq)
        // 用法
        let employ = Array.isArray(datas.employ) ? datas.employ[0] : datas.employ
        let employName = getSysTypeByCode('CV06.00.102', employ)
        params.useFreq = useFreq
        params.useMethod = employ
        params.useFreqName = useFreqName
        params.useMethodName = employName
        params.totalAmount = datas.count
        datas.list.forEach(item => {
          recipeItems.push({
            localMaterialId: item.localMaterialId,
            globalMaterialId: item.globalMaterialId,
            medicineId: item.localMaterialId,
            medicineName: item.serviceItem.byname || item.serviceItem.name,
            amount: item.measure,
            amountUnitTxt: item.measureUnitName
          })
        })
      }
      let res = await medicalapi.checkDrugItem(params).then(res => res).catch(() => false)
      if (res.data && res.data.infoList && res.data.infoList.length) {
        let resObj = await this.cdssResultFormat(res.data.infoList)
        if (type === 1) {
          datas.cdssResult = Object.values(resObj).join('|')
        } else {
          datas.forEach(item => {
            item.cdssResult = resObj[item.localMaterialId] || ''
          })
        }
        return res.data.infoList.map(item => {
          return {type: 0, tipTypeName: item.allergyType, part: item.level2Category, tipInfo: item.tipInfo, drugName: item.drugName}
        })
      }
      return false
    },
    async cdssResultFormat (res) {
      let listObj = {}
      let codeList = await sysvalue.listOnce('THC_SYS_DRUG_ALLERGEN_SECONDARY')
      res.forEach(item => {
        let id = item.localMaterialId
        let part = objFind(codeList, {code: item.level2Category})
        if (!listObj[id]) {
          listObj[id] = `${item.allergyType}：患者【${part && part.name || ''}】过敏，${item.tipInfo}【${item.drugName}】`
          // listObj[id] = '【' + item.drugName + '】' + (item.errorInfo || '') + (item.advice || '')
        } else {
          listObj[id] += `\n${item.allergyType}：患者【${part && part.name || ''}】过敏，${item.tipInfo}【${item.drugName}】`
        }
      })
      return listObj
    },
    // CDSS弹窗关闭回调事件
    closeCdssEvent () {
      this.showCdss = false
      this.$emit('selfCheck', this.nextCheck.bind(this))
      this.submitCallback.fail && this.submitCallback.fail()
      this.initData()
    },
    // CDSS不通过，强制提交
    confirmCdssSubmit (service) {
      this.showCdss = false
      this.wringData = []
      this.nextCheck()
    },
    // 医保批量校验
    async batchCheckDrug (datas, type) {
      if (['303', '304'].includes(type)) {
        datas = datas[0].list
      }
      if (datas.length > 1 || !this.shareInfo || !this.appoint || this.appoint.subsequentVisit === 3 || !this.results || !this.results[0] || !this.results[0].diseaseCode) {
        return false
      }
      // 是否启用医嘱共享校验
      let postdata = {
        icno: this.shareInfo.icno,
        isEmergencyTradecuretype: this.shareInfo.isEmergencyTradecuretype,
        isBasicMedicalInsurance: this.shareInfo.isBasicMedicalInsurance,
        fundtype: this.shareInfo.fundtype,
        data: [],
        returnType: 0
      }
      datas.forEach(item => {
        // 只校验选了医保的处方
        if (item.insuranceIdentification === '1') {
          postdata.data.push({
            id: item.serviceId,
            name: item.serviceName
          })
        }
      })
      const res = await medicalapi.batchCheckShareInfo(postdata)
      if (res && res.data && res.data.length) {
        return res.data
      } else {
        let confData = []
        datas.forEach((item) => {
          confData.push({
            curetype: this.appoint.subsequentVisit === 3 ? 19 : 11,  // 必填 门诊类型：11 普通门诊 19 急诊
            diagnosecode: this.results ? this.results[0].diseaseCode : '',  // 必填 诊断编码
            hiscode: item.serviceIs,  // 必填 项目id
            serviceName: item.serviceName,
            itemtype: ['301', '302', '303', '304'].includes(type) ? 0 : 1,  // 必填 项目类别：0 药品 1 诊疗设施
            howtouse: getSysTypeByCode('CV06.00.228', item.useFreq, 'code'),  // 必填 使用频次编码    使用值集：CV06.00.228 用药频次 取编码
            days: item.useDay,  // 必填 用药天数
            dosage: item.measure,  // 必填 单次用量
            count: item.count,  // 必填 数量
            conversion: item.drugRatio,  // 必填 换算率
            stdFeeClass: (item.serviceItem.medicalInsuranceObject && item.serviceItem.medicalInsuranceObject.stdFeeClass) || ''
          })
        })
        // 医保给报销 做超量校验
        const checkRes = await medicalapi.batchCheckDrug({ data: confData, returnType: 0 })
        if (checkRes && checkRes.data && checkRes.data.length) {
          return checkRes.data
        }
      }
    },
    // 医保提交确认弹窗
    confirmCheckAdvice (res, done) {
      let tipsDom = '<ol class="decimal_ol">'
      res.forEach(item => {
        tipsDom += (item.serviceName || item.name) ? '<li>【' + (item.serviceName || item.name) + '】' + item.validateMsg + '</li>' : '<li>' + item.validateMsg + '</li>'
      })
      tipsDom += '</ol>'
      this.$confirm(tipsDom, '是否继续添加?', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '自费处方',
        cancelButtonText: '取消',
        type: 'warning',
        center: false
      }).then(() => {
        if (done) done()
      }).catch(() => {
        this.$emit('selfCheck', this.nextCheck.bind(this))
        this.initData()
        return false
      })
    },
    // 设置处方医保类型
    setMedicalInsurance (resData) {
      // 选择自费处方
      resData.forEach(item => {
        item.id = item.itemcode || item.hiscode
      })
      let idKeys = objKeyBy(resData, 'id')
      let ids = Object.keys(idKeys)
      // 遍历处方  未通过校验选自费
      this.checkData.forEach(item => {
        item.forEach(val => {
          if (['303', '304'].includes(val.serviceType)) {
            val.forEach(k => {
              if (ids.includes(item.serviceId)) {
                k.insuranceIdentification = '0'
              }
            })
          }
          if (ids.includes(item.serviceId)) {
            val.insuranceIdentification = '0'
          }
        })
      })
      this.nextCheck()
    }
  }
}
</script>
<style lang="scss" scope>
  .waring-wrap {
    border: 1px solid #ee4433;
    border-radius: 4px;
    background: rgba(238, 68, 51, 0.12);
    box-shadow: none;
    color: #ee4433;
    margin-bottom: 20px;
    line-height: 22px;
    position: relative;
  }
  .waring-wrap .title {
    position: absolute;
    width: 100px;
    font-weight: bold;
    left: 20px;
    top: 18px;
  }
  .waring-wrap ul {
    padding-left: 100px;
  }
  .waring-wrap ul li {
    line-height: 33px;
  }
</style>
