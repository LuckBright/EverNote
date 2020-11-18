import backList from '@/warehouse/views/drug/component/back.list'
import backListColumns from '@/warehouse/views/drug/columnpool/back.patient.column.js'
import dispenseApi from '@/warehouse/views/drug/api/dispenseapi.js'
import PatientHeader from '@/inpatient/components/common.head.js'
import BackMedicineList from '@/warehouse/views/drug/component/back.medicine.list'
import Stateful from '@/warehouse/views/drug/component/stateful'
import BackRightColumn from '@/warehouse/views/drug/columnpool/back.right.column'
import BackActionBtn from '@/warehouse/views/drug/component/back.action.btn.vue'
import getStorage from '@/warehouse/page/storages/util/getstorage.js'
import storageroomapi from '@/warehouse/store/storageroomapi.js'
import { request } from '@/util/req'

export default {
  mixins: [getStorage],
  data () {
    return {
      BackRightColumn: BackRightColumn(),
      patientCode: '009', // 库房患者头code
      noDataTip: '暂无任务',
      operateMode: 1,
      backListColumns,
      dispenseObj: null,
      selectableList: { 8: [], 9: [] },
      actionSummaryList: [],
      backErrorTextarea: '',
      backErrorTitle: '',
      backErrorType: 1,
      toExamine: 1,
      onLineToExamine: 1,
      loading: false,
      refreshThePage: true,
      centerDialogVisible: false,
      showSummaryBtn: false,
      processId: this.$store.state.processConfig.thisStorageroomProcessConfig.processId,
      sysTemConfig: this.$store.state.processConfig.storageroomSystemConfig
    }
  },
  components: {
    Stateful,
    backList,
    BackActionBtn,
    PatientHeader,
    BackMedicineList,
    backActionSummary: () => import('@/warehouse/views/drug/component/back.action.summary.vue')
  },
  mounted () {
    this.onDeleteExceptionCause() // 接收 退药 删除驳回原因操作
  },
  beforeDestroy () {
    this.$bus.$off('back:delete-exception-cause')
  },
  async created () {
    await storageroomapi.getStorageRoomInfo(this.storageId).then(res => {
      if (res) {
        let storageObj = res[0]
        this.toExamine = storageObj.toExamine === null ? 1 : storageObj.toExamine
        this.onLineToExamine = storageObj.onLineToExamine === null ? 1 : storageObj.onLineToExamine
      }
    })
    this.selectableList = { 8: [], 9: [] }
    BackRightColumn.scene = this.scene
  },
  methods: {
    updateAllColumn () {
      // 一种类型的表格改变列的配置了，相同类型的表格都要同步配置
      this.refreshThePage = false
      this.loading = true
      setTimeout(() => {
        this.$nextTick(() => {
          this.refreshThePage = true
        })
        setTimeout(() => {
          this.loading = false
        }, 500)
      }, 300)
    },
    hanlderShowSummary () {
      this.$refs.backActionSummary && this.$refs.backActionSummary.open()
    },
    // 删除驳回原因
    onDeleteExceptionCause () {
      this.$bus.$on('back:delete-exception-cause', (row, e, index) => {
        this.$confirm('删除驳回原因后，驳回状态将变成待审核状态', '取消异常', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          if (this.scene === 3) {
            request(`/adt/doctor/admit/admitByHospitalizedNumber`, { hospitalizedNumber: this.visitNumber }).then(res => {
              if (res && res.data && res.data.status) {
                if ([8, 9, 10, 11].includes(res.data.status)) {
                  return this.everWarning('当前患者已经办理出院，不能再操作')
                } else {
                  this.updateBackStocks(row)
                }
              }
            })
          } else {
            this.updateBackStocks(row)
          }
        }).catch(_ => { })
      })
    },
    backActionBtn (type) {
      // type: 1: 审核 2：驳回 3：入库 4：拒收
      this.backErrorType = type
      if ([1, 3].includes(type)) {
        this.$confirm(type === 1 ? '审核通过后，请注意回收物资' : '入库完成后，对应物资的库存会增加', type === 1 ? '审核通过' : '入库完成', {
          distinguishCancelAndClose: true,
          confirmButtonText: type === 1 ? '通过' : '入库',
          cancelButtonText: '取消'
        }).then(() => {
          this.updateBackStocks()
        }).catch(_ => {
          this.$nextTick(() => {
            if (this.$refs.backBtnbox) {
              this.$refs.backBtnbox.forEach(item => {
                item.btnloading = false
              })
            }
          })
        })
      } else {
        this.backErrorTitle = type === 2 ? '审核驳回' : '入库拒收'
        this.centerDialogVisible = true
      }
    },
    backErrorFn () {
      if (!this.backErrorTextarea.length) return this.$messageTips(this, 'warning', `${this.backErrorTitle}原因不能为空`)
      this.centerDialogVisible = false
      this.updateBackStocks()
    },
    handlerDataArr (item) {
      const { id, taskItemId, localMaterialId, unitId, num, relationItemId, classifyId } = item
      let newObj = { id, taskItemId, classifyId }
      if (this.backErrorType === 1) {
        // 审核通过
        newObj.examineFlag = 2
      } else if (this.backErrorType === 2) {
        // 审核驳回
        newObj.examineFlag = 1
        newObj.examineMsg = this.backErrorTextarea
      } else if (this.backErrorType === 3) {
        // 同意入库
        newObj.status = 21
        newObj.unitId = unitId
        newObj.num = num
        newObj.localMaterialId = localMaterialId
      } else {
        // 拒绝入库
        newObj.status = 22
        newObj.num = num
        newObj.relationItemId = relationItemId
        newObj.examineMsg = this.backErrorTextarea
      }
      return newObj
    },
    // 退药  审核/驳回/入库/拒收
    updateBackStocks (data) {
      let params = []
      // let handlerIds = this.handlerParamsIds()
      // 审核/驳回/入库/拒收  提交操作数据处理
      this.selectableList[this.backErrorType > 2 ? 9 : 8].forEach(item => {
        if (item.checkBoxId && !item.countArr) return
        if (item.countArr) {
          item.countArr.forEach(child => {
            params.push(this.handlerDataArr(child))
          })
        } else {
          params.push(this.handlerDataArr(item))
        }
      })
      // 删除驳回原因
      if (data) {
        params = []
        if (data.countArr) {
          data.countArr.forEach(child => {
            const { id, taskItemId } = child
            params.push({ id, taskItemId, examineFlag: 0, auditRejectedReson: '' })
          })
        } else {
          const { id, taskItemId } = data
          params.push({ id, taskItemId, examineFlag: 0, auditRejectedReson: '' })
        }
      }
      dispenseApi.updateBackStocks(params).then(res => {
        if (res) {
          this.fetchList(null, true)
          this.$messageTips(this, 'success', '操作成功')
        }
        this.$nextTick(() => {
          if (!data && this.$refs.backBtnbox) {
            this.$refs.backBtnbox.forEach(item => {
              item.btnloading = false
            })
          }
        })
      })
    },
    selectionChangeHandler (selectable, type) {
      // 通过table选择项，处理不同数据类型是否可以被选择
      this.selectableList[type] = selectable
    },
    handlerRowClick (row) {
      if (row) {
        this.reportData = Object.assign({}, row)
        this.dispenseObj = null
        this.patientId = row.patientId
        this.visitNumber = row.visitNumber || row.hospitalizedNumber
        this.fetchList(null)
      } else {
        this.fetchList(true)
      }
    },
    async fetchList (clear, reload) {
      // // 查出当前库房退药 是否审核
      // this.storageItem = JSON.parse(storage.getLocalStorage('STORAGE_ITEM')) || []
      // const storageObj = this.storageItem.find(item => item.id === this.storageId)
      // if (storageObj) {
      //   this.toExamine = storageObj.toExamine === null ? 1 : storageObj.toExamine
      //   this.onLineToExamine = storageObj.onLineToExamine === null ? 1 : storageObj.onLineToExamine
      // }
      // clear: 当左侧列表没有查到数据时，默认清空右侧所有数据
      if (clear) {
        return (this.dispenseObj = null)
      }
      this.loading = true
      let outHospitalizedStatus
      const params = Object.assign({ type: this.scene, processId: this.processId }, this.queryObj)
      if (this.scene === 3) {
        outHospitalizedStatus = await request(`/adt/doctor/admit/admitByHospitalizedNumber`, { hospitalizedNumber: this.visitNumber })
        params.hospitalizedNumber = this.visitNumber
      } else {
        params.visitSn = this.visitNumber
      }
      // 分库房需要传入当前库房的ID  多库房需要去掉当前库房的id
      params.storageRoomId = this.storageId
      if (this.sysTemConfig.dispenseSetting && this.sysTemConfig.dispenseSetting === '1') delete params.storageRoomId
      delete params.patientId
      dispenseApi[this.name](params).then(res => {
        if (!res || (Array.isArray(res) && !res.length)) {
          this.dispenseObj = null
          if (reload && this.queryObj.status === 1 && [3, 4].includes(this.backErrorType)) {
            this.$nextTick(_ => {
              this.$refs.backlist.list()
            })
          }
        } else {
          //  退药数据单独处理
          let dispenseObj = { 8: [{ taskDtoList: [] }], 9: [{ taskDtoList: [] }] }
          res.forEach((item, index) => {
            // 映射成通用 的taskItemList 数据
            // item.taskItemList = item.backStocksItemDtoList
            if (this.scene === 3 && outHospitalizedStatus && outHospitalizedStatus.data) item.outHospitalizedStatus = outHospitalizedStatus.data.status
            // 给每条数据加上 是否审核配置
            if (item && item.scene) item.toExamine = item.scene === 5 ? this.onLineToExamine : this.toExamine
            item.scene = this.scene
            if (item.toExamine) {
              // 审核配置 为否 数据直接进入  入库区域
              dispenseObj[9][0].taskDtoList.push(item)
            } else {
              if (item.status !== 20 || (item.examineFlag === 2 || item.examineFlag === null) && item.status === 20) {
                dispenseObj[9][0].taskDtoList.push(item)
              } else {
                dispenseObj[8][0].taskDtoList.push(item)
              }
            }
          })
          Object.keys(dispenseObj).forEach(item => {
            if (!dispenseObj[item][0].taskDtoList.length) {
              delete dispenseObj[item]
              return
            }
            // let indexs = []
            dispenseObj[item][0].taskDtoList.forEach((child, index) => {
              // 给住院 中药退药增加 合并表格标记
              // 注释住院 中药退药 合并表格标记 411 版本 住院退药中药需跟门诊退药中药统一操作
              // if (this.scene === 3 && ['303', '304'].includes(`${child.taskType}`)) {
              //   const findObj = indexs.find(bbs => child.otherCode === bbs.checkBoxId)
              //   if (!findObj) {
              //     let count = res.filter(cr => child.otherCode === cr.otherCode)
              //     child.thisCont = count.length
              //     child.countArr = count
              //     child.thisIndex = index
              //     indexs.push({
              //       checkBoxId: child.otherCode,
              //       index: child.thisIndex,
              //       count: child.thisCont
              //     })
              //   } else {
              //     child.thisCont = findObj.count
              //     child.thisIndex = findObj.index
              //   }
              //   child.checkBoxId = child.otherCode
              // }
            })
          })
          this.dispenseObj = dispenseObj
          this.getBackActionData()
        }
      }).finally(_ => {
        this.loading = false
      })
      this.selectableList = { 8: [], 9: [] }
    },
    // 组装退药汇总需要的数据
    getBackActionData () {
      this.actionSummaryList = []
      Object.keys(this.dispenseObj).forEach(key => this.actionSummaryList.push(...this.dispenseObj[key][0].taskDtoList))
    },
    // 当前行checkbox是否可以勾选
    medicineSelectable (row) {
      return row.toExamine ? (row.status === 20 && row.examineFlag !== 1) : ([null, 0, 2].includes(row.examineFlag) && row.status === 20)
    },
  },
  watch: {
    'centerDialogVisible' (v) {
      if (!v) {
        this.backErrorTextarea = ''
        this.$nextTick(() => {
          if (this.$refs.backBtnbox) {
            this.$refs.backBtnbox.forEach(item => {
              item.btnloading = false
            })
          }
        })
      }
    }
  },
}
