/* eslint-disable */
import api from '../store/hospitalapi'
import dispenseApi from '../store/dispenseapi'
import hospitalPrintMixins from '@/warehouse/page/storages/util/hospitalprintmixins'
// num = 1 住院发药页面 num = 2 摆药单页面
export default {
  mixins: [hospitalPrintMixins],
  data () {
    return {
      centerLoading: false,
      fullscreenLoading: false
    }
  },
  methods: {
    // 批量发药和单个发药
    handleBatchDrug (flag, num) {
      if (!flag && !this.checkMultipleLength(this.multipleSelection, num === 1 ? '请选择处方单' : '请选择药包')) return
      this.fullscreenLoading = true
      api.updateEndUddList(this._mergeParams(flag)).then(res => {
        // 更改药包状态为发药完成 num = 1 住院发药页面 num = 2 摆药单页面
        if (res.flag) {
          this.$messageTips(this, 'success', '发药完成')
          num === 1 ? this.getRightList() : this.getDispenseList()
          // !flag ? this.getRightList() : num === 1 ? this.getRightList() : this.getDispenseList()
        }
        this.fullscreenLoading = false
      })
    },
    // 检测是否选择处方数据
    checkMultipleLength (data = this.multipleSelection, title = '请选择处方单') {
      if (!data.length) {
        this.$messageTips(this, 'warning', title)
        return false
      }
      return true
    },
    // 传递参数
    _mergeParams (flag) {
      let params = []
      if (flag) {
        params.push({
          id: this.drugPackInfo.id || this.obj.id,
          status: this.drugStatus,
          code: this.drugPackInfo.code || this.obj.code,
          storageRoomId: this.drugPackInfo.storageRoomId || this.obj.storageRoomId,
          spaceId: this.drugPackInfo.spaceId || this.obj.spaceId
        })
      } else {
        this.multipleSelection.forEach(item => {
          params.push({
            id: item.id,
            status: this.drugStatus,
            storageRoomId: item.storageRoomId,
            code: item.code,
            spaceId: this.drugPackInfo.spaceId
          })
        })
      }
      return params
    },
    // 备药完成
    handleFinish (flag, num) {
      if (!flag && !this.checkMultipleLength(this.multipleSelection, num === 1 ? '请选择处方单' : '请选择药包')) return
      this.fullscreenLoading = true
      api.updateUddList(this._mergeParams(flag)).then(res => {
        // 更改药包状态为待发药
        if (res.flag) {
          this.$messageTips(this, 'success', '备药完成')
          // !flag ? this.getRightList() : this.getUddDispenseList()
          this.getRightList()
        }
        this.fullscreenLoading = false
      })
    },
    // 批量打印/打印
    handleBatchPrint (flag, num) {
      // let res = {"information":{"codes":"G1A002190103000001","flag":true,"uddDispenseList":[{"adviceId":"io446cqebv058ja21546486987086","adviceType":"301","bedNum":"3","clinicId":1,"code":"Q1A002190103000008","createBy":"1","createTime":"2019-01-03 14:12:19","dataSource":"3","doctorName":"医生z","dropSpeed":"fcfc4853-2fbf-48ce-a4f9-892818d0ac01","employ":"1964","employTxt":"静脉注射","hospitalBedRelationId":"4604606e-5993-45ba-88b4-347fa43f2c48","hospitalizedNumber":"ip21qW3jap20181219160714","id":"7fb7b09c-2328-4d91-914e-4e94ccd5ba4e","identification":0,"isDelete":0,"isMain":0,"patientId":"W7VFWrqd2gIMUqW3jap","patientName":"公孙淑","patientObject":{"age":"0","birthday":1519574400000,"id":"W7VFWrqd2gIMUqW3jap","name":"公孙淑","sex":1},"source":"1","spaceId":"2c1b58a8-b7d6-11e8-a947-525400ccdcb2","status":4,"storageRoomId":"79c29223-4ac4-42f5-a7df-3425cf699ba5","termType":0,"uddDispenseItemList":[{"code":"W1A002190103000009","containerId":"0000","countUnit":"支","countUnitId":"81","createBy":"1","createTime":"2019-01-03 14:12:19","doctorAdvice":"qhi9u2JkAdokUSdxnh9","doctorId":"884665ff-0c1f-45eb-9150-27998170e90d","id":"0da93810-ff0f-47ed-84fc-8540b60b9e4f","identification":0,"implementId":"2c9180aa680355d90168125750e008a6","isDelete":0,"isMain":0,"localMaterialId":"818bbc74-15eb-4dcd-8561-8d73c3ec1104","localSettingObject":{"classifyId":"301","clinicId":1,"id":"818bbc74-15eb-4dcd-8561-8d73c3ec1104","isExpiryDate":1,"isManageAlone":0,"isNum":1,"materialSkuObject":{"id":"d2c292c85076466e969be358fb10acac","materialPropertys":[{"name":"剂量","propertyCode":"SXX000010","propertyType":10005,"propertyValue":"2"},{"name":"生产厂商","propertyCode":"SXX000009","propertyType":10006,"propertyValue":"江苏万邦生化医药股份有限公司","specialName":"江苏万邦生化医药股份有限公司"},{"name":"商品名","propertyCode":"SXX000005","propertyType":10001,"propertyValue":"肝素钠注射液"},{"name":"商品名拼音码","propertyCode":"SXX000006","propertyType":10001,"propertyValue":"GSNZSY"},{"name":"默认用量","propertyCode":"SXX000018","propertyType":10001,"propertyValue":"1"},{"name":"批准文号","propertyCode":"SXX000001","propertyType":10001,"propertyValue":"国药准字H32020612"},{"name":"通用名","propertyCode":"SXX000003","propertyType":10001,"propertyValue":"肝素钠注射液"},{"name":"通用名拼音码","propertyCode":"SXX000004","propertyType":10001,"propertyValue":"GSNZSY"},{"name":"规格","propertyCode":"SXX000008","propertyType":10001,"propertyValue":"2ml:12500单位"},{"name":"成药成分转换比","propertyCode":"SXX000125","propertyType":10005,"propertyValue":"2"},{"name":"包装制剂转换比","propertyCode":"SXX000049","propertyType":10005,"propertyValue":"1.0"},{"materialPropertyValues":[{"name":"静脉注射","propertyValueId":"1964"}],"name":"给药途径","propertyCode":"SXX000016","propertyType":10004,"propertyValue":"1964"},{"materialPropertyValues":[{"name":"ml","propertyValueId":"779"}],"name":"成分单位","propertyCode":"SXX000053","propertyType":10003,"propertyValue":"779"},{"materialPropertyValues":[{"name":"支","propertyValueId":"81"}],"name":"成药单位","propertyCode":"SXX000054","propertyType":10003,"propertyValue":"81"},{"materialPropertyValues":[{"name":"注射液","propertyValueId":"1402"}],"name":"剂型","propertyCode":"SXX000007","propertyType":10003,"propertyValue":"1402"},{"materialPropertyValues":[{"name":"每日2次","propertyValueId":"555"}],"name":"用药频次","propertyCode":"SXX000017","propertyType":10003,"propertyValue":"555"},{"materialPropertyValues":[{"name":"制剂单位","propertyValueId":"11f9f8cb-53e7-4ce0-9fc5-338e94cb0e6a"}],"name":"剂量单位","propertyCode":"SXX000011","propertyType":10003,"propertyValue":"11f9f8cb-53e7-4ce0-9fc5-338e94cb0e6a"},{"materialPropertyValues":[{"name":"支","propertyValueId":"81"}],"name":"制剂单位","propertyCode":"SXX000047","propertyType":10003,"propertyValue":"81"},{"materialPropertyValues":[{"name":"支","propertyValueId":"81"}],"name":"包装单位","propertyCode":"SXX000048","propertyType":10003,"propertyValue":"81"}],"materialSpuId":"7075f5f5-d4ba-461a-8d81-40931462d6bf"},"materialVoObject":{"amount":"1","byName":"肝素钠注射液","content":2,"contentUnit":"81","contentUnitText":"支","dosageForm":"1402","dosageFormText":"注射液","frequency":"555","id":"d2c292c85076466e969be358fb10acac","name":"肝素钠注射液","packagUnitId":"81","packagUnitText":"支","packageInfo":"2ml:12500单位","packageToPrepareRatio":1.0,"patentMedicineTopreparationSpecRatio":2,"patentMedicineUnit":"81","patentMedicineUnitText":"支","preparationSpecUnit":"779","preparationSpecUnitText":"ml","prepareUnitId":"81","prepareUnitText":"支","produceName":"江苏万邦生化医药股份有限公司","ratifyCode":"国药准字H32020612","useWay":"1964"}},"materialType":"296","measure":1.0000,"measureUnit":"779","measureUnitName":"ml","num":1.0000,"providerId":"1","providerName":"中医科","source":"1","uddDispenseId":"7fb7b09c-2328-4d91-914e-4e94ccd5ba4e","updateBy":"1","updateTime":"2019-01-03 14:12:19","useFreq":"1571","useFreqTxt":"立即"},{"code":"W1A002190103000010","containerId":"0000","countUnit":"支","countUnitId":"81","createBy":"1","createTime":"2019-01-03 14:12:27","doctorAdvice":"NTvGhkW3q66i42vOqOx","doctorId":"0492b551-2757-4039-9677-23e095fbe3ab","id":"3aaf5b41-b743-4414-af54-f3ac905e02de","identification":0,"implementId":"2c9180aa680355d9016812576f4508a9","isDelete":0,"isMain":0,"localMaterialId":"818bbc74-15eb-4dcd-8561-8d73c3ec1104","localSettingObject":{"classifyId":"301","clinicId":1,"id":"818bbc74-15eb-4dcd-8561-8d73c3ec1104","isExpiryDate":1,"isManageAlone":0,"isNum":1,"materialSkuObject":{"id":"d2c292c85076466e969be358fb10acac","materialPropertys":[{"name":"剂量","propertyCode":"SXX000010","propertyType":10005,"propertyValue":"2"},{"name":"生产厂商","propertyCode":"SXX000009","propertyType":10006,"propertyValue":"江苏万邦生化医药股份有限公司","specialName":"江苏万邦生化医药股份有限公司"},{"name":"商品名","propertyCode":"SXX000005","propertyType":10001,"propertyValue":"肝素钠注射液"},{"name":"商品名拼音码","propertyCode":"SXX000006","propertyType":10001,"propertyValue":"GSNZSY"},{"name":"默认用量","propertyCode":"SXX000018","propertyType":10001,"propertyValue":"1"},{"name":"批准文号","propertyCode":"SXX000001","propertyType":10001,"propertyValue":"国药准字H32020612"},{"name":"通用名","propertyCode":"SXX000003","propertyType":10001,"propertyValue":"肝素钠注射液"},{"name":"通用名拼音码","propertyCode":"SXX000004","propertyType":10001,"propertyValue":"GSNZSY"},{"name":"规格","propertyCode":"SXX000008","propertyType":10001,"propertyValue":"2ml:12500单位"},{"name":"成药成分转换比","propertyCode":"SXX000125","propertyType":10005,"propertyValue":"2"},{"name":"包装制剂转换比","propertyCode":"SXX000049","propertyType":10005,"propertyValue":"1.0"},{"materialPropertyValues":[{"name":"静脉注射","propertyValueId":"1964"}],"name":"给药途径","propertyCode":"SXX000016","propertyType":10004,"propertyValue":"1964"},{"materialPropertyValues":[{"name":"ml","propertyValueId":"779"}],"name":"成分单位","propertyCode":"SXX000053","propertyType":10003,"propertyValue":"779"},{"materialPropertyValues":[{"name":"支","propertyValueId":"81"}],"name":"成药单位","propertyCode":"SXX000054","propertyType":10003,"propertyValue":"81"},{"materialPropertyValues":[{"name":"注射液","propertyValueId":"1402"}],"name":"剂型","propertyCode":"SXX000007","propertyType":10003,"propertyValue":"1402"},{"materialPropertyValues":[{"name":"每日2次","propertyValueId":"555"}],"name":"用药频次","propertyCode":"SXX000017","propertyType":10003,"propertyValue":"555"},{"materialPropertyValues":[{"name":"制剂单位","propertyValueId":"11f9f8cb-53e7-4ce0-9fc5-338e94cb0e6a"}],"name":"剂量单位","propertyCode":"SXX000011","propertyType":10003,"propertyValue":"11f9f8cb-53e7-4ce0-9fc5-338e94cb0e6a"},{"materialPropertyValues":[{"name":"支","propertyValueId":"81"}],"name":"制剂单位","propertyCode":"SXX000047","propertyType":10003,"propertyValue":"81"},{"materialPropertyValues":[{"name":"支","propertyValueId":"81"}],"name":"包装单位","propertyCode":"SXX000048","propertyType":10003,"propertyValue":"81"}],"materialSpuId":"7075f5f5-d4ba-461a-8d81-40931462d6bf"},"materialVoObject":{"amount":"1","byName":"肝素钠注射液","content":2,"contentUnit":"81","contentUnitText":"支","dosageForm":"1402","dosageFormText":"注射液","frequency":"555","id":"d2c292c85076466e969be358fb10acac","name":"肝素钠注射液","packagUnitId":"81","packagUnitText":"支","packageInfo":"2ml:12500单位","packageToPrepareRatio":1.0,"patentMedicineTopreparationSpecRatio":2,"patentMedicineUnit":"81","patentMedicineUnitText":"支","preparationSpecUnit":"779","preparationSpecUnitText":"ml","prepareUnitId":"81","prepareUnitText":"支","produceName":"江苏万邦生化医药股份有限公司","ratifyCode":"国药准字H32020612","useWay":"1964"}},"materialType":"296","measure":1.0000,"measureUnit":"779","measureUnitName":"ml","num":1.0000,"providerId":"1","providerName":"中医科","source":"1","uddDispenseId":"7fb7b09c-2328-4d91-914e-4e94ccd5ba4e","updateBy":"1","updateTime":"2019-01-03 14:12:27","useFreq":"1571","useFreqTxt":"立即"}],"updateBy":"1","updateTime":"2019-01-03 14:12:27"}]},"localMaterialIds":["818bbc74-15eb-4dcd-8561-8d73c3ec1104"]}
      // res.information.uddDispenseList.forEach(item => {
      //   item = Object.assign(item, this.inpatientArea)
      //   this.resetGatherPrintData(item)
      // })
      // this.liveTableData = {
      //   tableData: res.information.uddDispenseList,
      //   barCode: res.information.codes
      // }
      if (!flag && !this.checkMultipleLength(this.multipleSelection, num === 1 ? '请选择处方单' : '请选择药包')) return
      this.fullscreenLoading = true
      dispenseApi.createUddPrint(this._mergeParams(flag)).then(res => {
        // 更改药包状态为待摆药
        if (res && res.information) {
          this.getRightList()
          this.jcpKey = this.jcpCount++
          this._initPrint()
          res.information.uddDispenseList.forEach(item => {
            item = Object.assign(item, this.inpatientArea)
            this.resetGatherPrintData(item)
          })
          this.liveTableData = {
            tableData: res.information.uddDispenseList,
            barCode: res.information.codes
          }
          this.$nextTick(_ => {
            this.handlerPrint()
            this.$messageTips(this, 'success', '批量打印成功')
          })
        }
        this.fullscreenLoading = false
      })
    }
  }
}
