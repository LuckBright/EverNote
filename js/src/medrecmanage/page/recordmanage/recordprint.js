// import phrapi from '@/form/store/phrapi'
import urlMap from '@/emr/urls'
import inpatientUrlMap from '@/inpatient/urls'
import { request } from '@/util/req'
import {findIndex, findLastIndex} from 'lodash'
import { jcpPrintEditor } from '@/util/common'
import { MEDICAL_FONT_INFO } from '@/form/util/anamnesistype'
import {commandLog} from '@/phr/mixin/operationLog.js'
export default{
  data () {
    return {
      progressCodes: [
        'BING_CHENG_JI_LU',
        'SHOU_CI_BING_CHENG_JI_LU_XIN',
        'SHOU_CI_BING_CHENG_JI_LU',
        'QT_CHA_FANG_JI_LU',
        'JIAO_JIE_BAN_JI_LU',
        'ZHUAN_KE_JI_LU',
        'HUI_ZHEN_JI_LU'
      ],
      progressData: [],
      printData: [],
      index: 0,
      // patientId: '',
      // patientName: '',
      // visitNumber: 'this.visitId'
    }
  },
  methods: {
    // 合并病例书写和护理文书选中的节点，返回病例实例
    mergeCheckedNodes () {
      let checkedDoctorsNodes = this.$refs.doctortree.getCheckedNodes()
      let checkedNurseNodes = this.$refs.nursingtree.getCheckedNodes()
      let checkedNodes = checkedDoctorsNodes.concat(checkedNurseNodes)
      return this.filterInstance(checkedNodes)
    },
    // 批量打印
    batchPrint () {
      if (this.index > this.printData.length - 1) return
      commandLog({// 需要加备注
        content: `进行了病历批量打印操作`,
        opModuleOne: `病案管理-病历打印`,
        opType: 'PRINT',
        patientId: this.$route.query.patientId,
        patientName: this.$route.query.patientName,
        visitNumber: this.$route.query.visitId
      })
      this.printMedicalProcess(this.printData[this.index]).then(res => {
        this.index++
        if (!this.printData[this.index]) {
          this.printedNum = this.printData.length
          this.printData = []
          return console.log('打印完毕')
        } else {
          this.printedNum = this.index
          setTimeout(() => {
            this.batchPrint()
          }, 300)
        }
      }, err => {
        console.log('失败', err)
      })
    },
    // globalFontSettings (schema) {
    //   let fontInfo = this.$ever.getClinicConfig().MEDICAL_FONT_INFO
    //   if (fontInfo && isJsonString(fontInfo)) {
    //     fontInfo = JSON.parse(fontInfo)
    //     MEDICAL_FONT_INFO.forEach(item => {
    //       if (!schema.pageSettings[item] && fontInfo[item]) {
    //         schema.pageSettings[item] = fontInfo[item]
    //       }
    //     })
    //   }
    //   return schema
    // },
    async globalFontSettings (schema) {
      // let fontInfo = this.$ever.getClinicConfig().MEDICAL_FONT_INFO
      let params = {
        scope: 1,   // 0  集团  1  机构
        type: 5
      }
      let res = await request(inpatientUrlMap.getConfig.getAll, params, 'post')
      if (res.head.errCode === 0) {
        let fontInfo = res.data || []
        let obj = {}
        fontInfo.forEach(item => {
          switch (item.code) {
            case 'FONTSIZE':
              obj['font-size'] = Number(item.value)
              break
            case 'TYPEFACE':
              obj['font-family'] = item.value
              break
          }
        })
        MEDICAL_FONT_INFO.forEach(item => {
          if (schema && !schema.pageSettings[item] && obj[item]) {
            schema.pageSettings[item] = obj[item]
          }
        })
      }
      return schema
    },
    // 单次打印
    printMedicalProcess (data) {
      let domArr = []
      let schema = data[0].structure.schema
      schema = this.globalFontSettings(schema)
      let pageSettings = Object.assign({}, schema.pageSettings)
      let printConfig = Object.assign({}, {preview: this.preview, autoPrint: !this.preview, printFrom: true})
      data.forEach((item, index) => {
        if (item.data && item.data.data && item.data.data.text) {
          let data = item.data.data
          domArr.push({
            dom: data.text,
            header: data.header || '',
            footer: data.footer || '',
            track: data.track || false,
            anotherRecord: item.anotherRecord || 0,
            anotherPage: item.anotherPage || 0
          })
        }
      })

      let p = new Promise((resolve, reject) => {
        jcpPrintEditor(this, printConfig, pageSettings, domArr, res => {
          resolve('success')
        })
      })

      return p
    },
    // 重组打印数据添加到打印队列
    resetArrByCode (data) {
      if (!data.length) {
        return []
      }
      let originData = JSON.parse(JSON.stringify(data))
      let resetData = []
      // 获取病程记录的起止索引
      let progressInfo = this.findProgressIndex(data)
      // 病程记录之前的数据
      let firstArr = []
      // 病程记录的数据
      let progressArr = []
      // 病程记录之后的数据
      let lastArr = []
      let resetArr = (arr) => {
        if (!arr.length) return []
        let newArr = []
        arr.forEach((item, index) => {
          newArr[index] = []
          newArr[index].push(item)
        })
        return newArr
      }
      if (progressInfo.num > 0) {
        firstArr = originData.slice(0, progressInfo.startIndex)
        progressArr = this.progressData
        lastArr = originData.slice(progressInfo.endIndex + 1)
        resetData = resetData.concat(resetArr(firstArr))
        resetData.push(progressArr)
        resetData = resetData.concat(resetArr(lastArr))
      } else {
        resetData = resetArr(originData)
      }
      return resetData
    },
    // 查找病程记录相关的所以
    findProgressIndex (data) { // 病程记录在数据中的出现的起止索引和出现次数
      let num = 0
      data.forEach(item => {
        if (this.progressCodes.includes(item.code)) {
          num++
        }
      })
      let findCodeIndex = (item) => {
        return this.progressCodes.includes(item.code)
      }
      let startIndex = findIndex(data, findCodeIndex)
      let endIndex = findLastIndex(data, findCodeIndex)
      return {
        startIndex: startIndex,
        endIndex: endIndex,
        num: num
      }
    },
    // 病程记录的数据
    async getPrintContinueRecords () {
      const postdata = {
        code: 'BING_CHENG_JI_LU',
        visitId: this.visitId || this.$route.query.visitId
      }
      const res = await request(urlMap.recordManage.getPrintContinueRecords, postdata)
      if (res.head.errCode !== 0) {
        this.progressData = []
      } else {
        this.progressData = res.data
      }
      // const res = await phrapi.getPrintContinueRecords(postdata)
      // this.progressData = res
    },
    // 过滤实例
    filterInstance (checkedNodes) {
      // 过滤出来除体温单和病案首页的实例
      let specialCodes = ['TI_WEN_JI_LU_DAN', 'ZHU_YUAN_BING_AN_SHOU_YE']
      if (!checkedNodes.length) return []
      let filterNodes = checkedNodes.filter(item => {
        return !specialCodes.includes(item.code) && item.isInstance
      })
      return filterNodes
    },
    // 获取实例id的集合
    getInstanceIds (nodes) {
      if (!nodes.length) return []
      let ids = []
      nodes.forEach(item => {
        ids.push(item.id)
      })
      return ids
    },
    // 病程记录一个不选中就全不选中
    removeProgressData () {
      let newData = []
      let progressKeys = this.getInstanceIds(this.progressData)
      let doctorCheckedNodes = this.$refs.doctortree.getCheckedNodes()
      doctorCheckedNodes.forEach(item => {
        if (item.isInstance) {
          if (!progressKeys.includes(item.id)) {
            newData.push(item)
          }
        }
      })
      return newData
    },
    checkChange (data, checked) {
      this.emptyPrintData()
      this.printedNum = 0
      this.printTotal = 0
      if (!data.isInstance) return
      // 点的不是病程记录相关的节点不需要下面的操作
      if (!this.progressCodes.includes(data.code)) return
      let checkedNodes = this.filterInstance(this.$refs.doctortree.getCheckedNodes())
      if (checked) {
        if (!this.progressData.length) return
        this.$refs.doctortree.setCheckedNodes(checkedNodes.concat(this.progressData))
      } else {
        this.$refs.doctortree.setCheckedNodes(this.removeProgressData())
      }
    }
  }
}
