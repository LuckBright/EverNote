import Search from '@/warehouse/views/drug/component/search'
import List from '@/warehouse/views/drug/component/list'
import CheckGroup from '@/warehouse/views/drug/component/check.group'
import Parameters from '@/warehouse/views/drug/mixin/parameters'
import PatientHeader from '@/inpatient/components/common.head.js'
import MedicineList from '@/warehouse/views/drug/component/medicine.list'
import Stateful from '@/warehouse/views/drug/component/stateful'
import listColumns from '@/warehouse/views/drug/columnpool/patient.column.js'
import medicineColumns from '@/warehouse/views/drug/columnpool/prescription.column'
import dispenseApi from '@/warehouse/views/drug/api/dispenseapi.js'
import { SCREEN_TASK_CONDITIONS, PRINT_TEMPLATE } from '@/warehouse/views/util/constant'
import mailDialog from '@/warehouse/views/drug/component/maiildailog.vue' // 邮寄弹窗
import getStorage from '@/warehouse/page/storages/util/getstorage.js'
import PrintMixinNew from '@/warehouse/views/drug/mixin/print.mixin.new.js'
import { debounce } from '@/util/common'
import { get } from 'lodash'
import storage from '@/util/storage'
export default {
  mixins: [Parameters, getStorage, PrintMixinNew],
  data () {
    return {
      listColumns,
      medicineColumns: medicineColumns(),
      loading: false,
      refreshThePage: true, // 修改分列配置项 销毁右侧列表组件再重新加载
      processConfigurationId: this.$store.state.processConfig.thisStorageroomProcessConfig.id, // 流程id
      tapSaveHandler: null, // 模式固定，每次只会走其中一个方法
      dispenseObj: null, // 发药数据 0：自取，1：邮寄，2：自备res
      processConfig: null, // 库房配置
      queryObj: null, // 查询条件参数
      reportData: null, // 当前患者数据
      prescriptionPrams: {}, // 打印处方需要的数据
      obj: {},
      mailIds: [],
      notifyMark: null, // 患者id 用于通知list.vue 组件找到改患者添加异常标识
      containObj: {}, // 查询条件(显示缺货、显示异常、显示已取消、显示其他药房)
      cancel: null, // 1：pc端，2：手机端
      funcMap: {
        print: this.printHandler,
        post: this.postHandler, // 邮寄完成
        complete: this.completeHandler, // 发药完成
      },
      deliverPrintParmas: {},
      selectMainFlag: []
    }
  },
  components: {
    Search,
    List,
    CheckGroup,
    MedicineList,
    Stateful,
    PatientHeader,
    mailDialog
  },
  computed: {
    getisPrint () {
      return get(this.$store.state, 'processConfig.thisStorageroomProcessConfig.processItemObject.isPrint', 0)
    },
    // 配置项 发货单样式选择
    hasPrintDispatchPrint () {
      return get(this.$store.state, 'processConfig.thisStorageroomProcessConfig.processItemObject.processItemPatientObject.value', '1') || '1'
    },
    // 配置项 是否开启打印发货单
    hasPrintDispatchListPrint () {
      return get(this.$store.state, 'processConfig.thisStorageroomProcessConfig.processItemObject.dispatchListPrint', 0)
    }
  },
  mounted () {
    this.$bus.$on('outpatient:delete-exception-cause', row => {
      this.abnormallyDeleteHandler(row, null, null, 0)
    })
  },
  beforeDestroy () {
    this.$bus.$off('outpatient:delete-exception-cause')
  },
  created () {
    // init fn
    this.getProcessConfig()
    // 任务列表页面才需要添加默认配置参数条件
    this.pageType === 5 && this.setContainObjDefault()
    medicineColumns.isInvented = this.isInvented
  },
  methods: {
    // medicineList 为多个的时候，更新其他组件的 列的配置
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
    fullPreFunc (key, index) {
      // 处方整单函数
      // 选择勾选上就行
      return [...new Set(this.dispenseObj[1].filter(meta => (
        meta.checked && meta.addressId === this.dispenseObj[key][index].addressId
      )).map(meta => meta.taskDtoList.map(task => task.taskId)).flat())]
    },
    presctionFunc (key, index) {
      let _arr = []
      // 明细处方函数,只取邮寄的明细
      this.selectMainFlag && this.selectMainFlag.forEach(select => {
        if (select.mailAddressObject) {
          select.addressId = select.mailAddressObject.address + select.mailAddressObject.mobile + select.mailAddressObject.name
        }
        if (typeof index !== 'undefined' && this.dispenseObj[key][index].scene === 5 && this.dispenseObj[key][index].addressId !== select.addressId) return false
        // 父子医嘱
        const { mainFlag, mainGroupId } = select
        if (mainFlag > 0) {
          // dto.id === select.id
          const index = this.dispenseObj[1].findIndex(task => task.taskDtoList.some(dto => dto.taskId === select.taskId))
          const compose = mainGroupId + select.createTime
          // 明细处方， metaDataList元数据， 始终只会有一条，medicine.list.vue组件传入需要从所有元数据中删选出当前父子医嘱所有明细
          ~index && this.dispenseObj[1][index].taskDtoList.filter(task => (task.mainGroupId + task.createTime === compose)).forEach(task => {
            _arr.push(task.taskId)
          })
        } else {
          _arr.push(select.taskId)
        }
      })
      return [...new Set(_arr)]
    },
    mailDataSave (key, index) {
      this.mailIds = this.operateMode === 2 ? this.fullPreFunc(key, index) : this.presctionFunc(key, index)
      if (this.mailIds && !this.mailIds.length) return this.everWarning('请先选择需要修改邮寄信息的单据')
      this.$refs.mailDialog.open()
    },
    getProcessConfig () {
      // 获取库房配置信息数据
      this.processConfig = this.$store.state.processConfig.thisStorageroomProcessConfig || {}
    },
    setContainObjDefault () {
      // 设置checkbox-group默认值
      SCREEN_TASK_CONDITIONS.forEach(item => {
        const field = item.field
        this.containObj[field] = this.processConfig.processItemObject[field]
      })
    },
    async printHandler (ids, delivery) {
      // 打印操作
      // 2019-12-13 @于鹏飞 添加 区分 分库房和多库房（dispenseSetting）
      const res = await dispenseApi.printTask({
        dispenseSetting: get(this.$store.state || {}, 'processConfig.storageroomSystemConfig.dispenseSetting', ''),
        actualStorageRoomId: this.processConfig.storageRoomId,
        ids
      })
      // 拼接发货单打印参数
      this.deliverPrintParmas = {
        ids: ids,
        value: this.hasPrintDispatchPrint,
        actualStorageRoomId: this.processConfig.storageRoomId,
        dispenseSetting: get(this.$store.state || {}, 'processConfig.storageroomSystemConfig.dispenseSetting', '')
      }
      if (Array.isArray(res) && res.length) {
        // 调取封装的打印方法
        this.getPrintData(res)
        if (this.pageType === 2) return true
      }
      // 打印不需要重新查询数据
      return false
    },
    // 发货单打印
    deliverPrint () {
      // 取缓存的当前库房的类型，来检索需要打印的模板
      let MATERIAL_TYPE = storage.getStorageByClinic('MATERIAL_TYPE') || []
      if (MATERIAL_TYPE.length && this.getisPrint && this.hasPrintDispatchListPrint && this.pageType !== 4) {
        let printType = ['303', '304'].find(key => { return MATERIAL_TYPE.includes(key) })
        this.printData.push({
          code: PRINT_TEMPLATE[printType ? 'chinese' : 'drug'][this.hasPrintDispatchPrint],
          params: this.deliverPrintParmas,
          preview: true
        })
      }
    },
    async postHandler () {
      // 需要先填写邮寄信息，然后调用dispenseApi.updateOutpatientDispenseType({ids, status: 9})接口
      return (this.$messageTips(this, 'success', '邮寄发药成功'), true)
    },
    async completeHandler(taskIds, delivery, status = 3) {
      // 发药完成操作(status = 3) | 无法到货操作(status = 4)
      let oldStatusObj = null
      this.dispenseObj[delivery].forEach(item => {
        let findObj = item.taskDtoList.find(child => taskIds.includes(child.taskId))
        if (findObj && !oldStatusObj) oldStatusObj = findObj
      })
      const res = await dispenseApi.updateOutpatientDispenseType({
        taskIds,
        actualStorageRoomId: this.storageId,
        status,
        scene: this.reportData.scene || oldStatusObj.scene || 1,
        oldStatus: oldStatusObj ? oldStatusObj.status : status - 1
      })
      if (res && res.finally) {
        return (this.$messageTips(this, 'success', status === 3 ? '发药成功' : '无法到货操作成功'), true)
      }
      return false
    },
    async operatorBtnFunc (ids, delivery, type, status) {
      // 检测type：因为所有操作通过一个方法emit出来，所以通过检测type类型来确定调用那类型的接口
      // 发药完成<3> 和 邮寄完成<9>、打印
      this.funcMap[type](ids, delivery, status).then(flag => {
        if (!flag) return
        // notifyMark 通知list.vue 组件 修改患者异常标记信息 del: 删除患者
        this.notifyMark = {
          patientId: this.patientId,
          del: true
        }
        // 操作完成后， 需要重置所有已选择状态
        // 之前的selection会进入下一次新数据的操作项，数据被污染，每次查询接口前， 先claer所有selection
        if (this.operateMode === 2) {
          this.dispenseObj[delivery].forEach(task => {
            task.checked = false
          })
        } else {
          this.$refs.medicineList.forEach(medicine => {
            medicine.$refs.table.$refs.everTable.clearSelection()
          })
        }
        [2, 3].includes(this.pageType) && this.fetchList() // 收方发药和缺货页面， 需要重新查询接口 更新数据
      })
    },
    queryHandler (queryObj) {
      // 接收search组件传递过来参数
      this.queryObj = Object.assign({}, queryObj)
    },
    fetchList (clear, rowIdentification) {
      // clear: 当左侧列表没有查到数据时，默认清空右侧所有数据
      if (clear) {
        return (this.dispenseObj = null)
      }
      this.loading = true
      // get data 根据条件查询发药列表-区分自备/邮寄/自取
      const params = {
        processConfigurationId: this.processConfigurationId,
        visitSn: this.visitNumber,
        type: 1,
        scene: this.reportData.scene,
        unSplit: true,
        examineFlag: 2,
        status: this.statusList
      }
      // 任务列表 和 缺货任务 需要库房id
      ~(this.pageType === 5 || this.pageType === 3) && (params.actualStorageRoomId = this.storageId) // 当前操作库房
      if (this.pageType === 5) params.mailFlag = 0
      if (this.pageType === 4) params.mailFlag = 1
      this.prescriptionPrams = Object.assign(params, this.queryObj, this.containObj, this.customParams)
      dispenseApi[this.name || 'getGroupSearch'](Object.assign(params, this.queryObj, this.containObj, this.customParams)).then(res => {
        if (res.finally) {
          this.dispenseObj = null
        } else {
          this.dispenseObj = this.wrapper(res)
          let has = null
          const keys = Object.keys(this.dispenseObj)
          if (this.operateMode === 2) {
            // 处方整单
            for (let i = 0; i < keys.length; i++) {
              const data = this.dispenseObj[keys[i]]
              if ((has = data.some(task => (task.status <= 3 && (task.shortage === 23 || task.identification))))) break
            }
          } else {
            // 处方明细
            for (let i = 0; i < keys.length; i++) {
              const data = this.dispenseObj[keys[i]]
              if ((has = data.some(task => (task.taskDtoList.some(dto => (dto.status <= 3 && (dto.shortage === 23 || dto.identification))))))) break
            }
          }
          // rowIdentification:点击左侧患者数据，是否是异常，查询右侧患者发药明细数据， 检查是否有异常，如有没有异常，代表需要删除左侧患者列表中该患者异常标识
          // has 为真代表数据中存在异常数据
          this.notifyMark = {
            patientId: this.patientId
          }
          // 传递异常标识或者缺货标识
          if (!has) {
            this.notifyMark.shortage = 0
            if (rowIdentification) this.notifyMark.mark = 0
          }
        }
      }).finally(_ => {
        this.loading = false
      })
    },
    updateChangeHandler (params) {
      // 提交编辑信息(更改发货方式、发货库房或者标记异常)
      // 提交数据的ids去重
      if (params.ids) params.ids = [...new Set(params.ids)]
      dispenseApi.updateChange(params).then(res => {
        if (res.finally) {
          const lists = params.recipeCommentDetailList
          if (Array.isArray(lists) && lists.length) {
            // notifyMark 通知list.vue 组件 修改患者异常标记信息
            this.notifyMark = {
              patientId: this.patientId,
              del: true,
              mark: 1 // 1、标记异常  0、取消异常
            }
          } else {
            // notifyMark 通知list.vue 组件 修改患者异常标记信息 del: 删除患者
            this.notifyMark = {
              patientId: this.patientId,
              del: true
            }
          }
          // 收方发药界面， 需要保留重新查询数据方法
          this.pageType === 2 && this.fetchList()
          this.$messageTips(this, 'success', '修改成功')
        }
      })
    },
    fullSaveHandler (obj, parentIndex, singleAdd, fullAdd, fullDelete, currentData, currentIndex, isMany) {
      // 按处方（整单）操作
      // 记录需要提交的异常数据
      const lists = []
      // 新添加的所有数据推进lists中
      lists.push(...fullAdd)
      // 删除了的异常，在新添加的异常信息中不存在，那就推进lists中
      fullDelete.forEach(del => {
        const hasAdd = fullAdd.find(add => add.taskId === del.taskId)
        if (!hasAdd) lists.push(del)
      })
      // theParamsUpdateChange => parameters.js
      // lists 中如果没有abnormalList对象， 则为删除异常，否则为添加异常
      const params = this.theParamsUpdateChange(obj, lists, currentData, currentIndex, isMany)
      this.updateChangeHandler(params)
    },
    singleSaveHandler (obj, parentIndex, singleAdd, fullAdd, fullDelete, currentData, currentIndex) {
      // 按处方（明细）操作
      const { delivery, actualStorageRoomId } = obj
      // 此处是处理父子医嘱一同标记
      // const { mainGroupId } = currentData.taskDtoList[currentIndex]
      // const filterTask = currentData.taskDtoList.filter(task => task.mainGroupId === mainGroupId)
      // const params = {
      //   ids: filterTask.map(task => task.id),
      //   delivery,
      //   actualStorageRoomId,
      //   recipeCommentDetailList: []
      // }
      // if (singleAdd.length) {
      //   params.recipeCommentDetailList.push(...filterTask.map(task => (
      //     {
      //       id: task.id,
      //       classifyList: singleAdd.filter(single => single.id).map(single => ({
      //         id: single.id,
      //         contentText: single.contentText
      //       })),
      //       actualStorageRoomId: this.storageId, // 操作库房
      //       content: singleAdd.filter(single => !single.id).join('') || '',
      //       dataType: 0 // 异常
      //     }
      //   )))
      // }
      // 此处是标记选中项
      const params = {
        ids: [currentData.taskDtoList[currentIndex].taskId],
        delivery,
        actualStorageRoomId,
        recipeCommentDetailList: []
      }
      if (singleAdd.length) {
        params.recipeCommentDetailList.push({
          id: currentData.taskDtoList[currentIndex].taskId,
          classifyList: singleAdd.filter(single => single.id).map(single => ({
            id: single.id,
            contentText: single.contentText
          })),
          actualStorageRoomId: this.storageId, // 操作库房
          content: singleAdd.filter(single => !single.id).join('') || '',
          dataType: 0 // 异常
        })
      }
      this.updateChangeHandler(params)
    },
    saveAfterHandler (obj, singleAdd, fullAdd, fullDelete, parentIndex, currentData, currentIndex, isMany) {
      // isMany:true, 父子医嘱或者处方整单操作， false 明细单条操作
      const arg = [obj, parentIndex, singleAdd, fullAdd, fullDelete, currentData, currentIndex, isMany]
      !isMany ? this.singleSaveHandler(...arg) : this.fullSaveHandler(...arg)
    },
    selectionChangeHandler (selectable, arr) {
      selectable.forEach(item => {
        if (!this.selectMainFlag.some(child => child.id === item.id)) this.selectMainFlag.push(item)
      })
      if (!selectable.length) {
        this.selectMainFlag = this.selectMainFlag.filter(item => !arr.some(child => child.id === item.id))
      } else {
        const noSelectArr = arr.filter(item => !selectable.some(child => child.id === item.id))
        this.selectMainFlag = this.selectMainFlag.filter(item => !noSelectArr.some(child => child.id === item.id))
      }
      // 通过table选择项，处理不同数据类型是否可以被选择
      this.selectableList = selectable
    },
    medicineSelectable (row) {
      // 发货方式(delivery: 1：自取、2：邮寄、3：自备)、邮寄标记(mailFlag)、异常标记(identification)、单据状态(status)、缺货标记：shortage
      const { delivery, mailFlag, identification, status, shortage } = row
      if (this.pageType === 4) return true
      const currentData = this.dispenseObj[delivery] || [] // 当前发货方式数据
      let data = null // row 在 currentData 中的第几条数据
      for (let i = 0; i < currentData.length; i++) {
        const task = currentData[i]
        // 现在没有 id 了 取 taskId
        if (task.taskDtoList.find(item => item.taskId === row.taskId)) {
          data = task
          break
        }
      }
      // 库房、本机构、审核：examineFlag
      const { actualStorageRoomId, isOwnerOrg } = data || {}
      const len = this.selectableList && this.selectableList.length || -1
      // 自取或者邮寄下非本机构不可操作
      if ([0, 1].includes(delivery) && !isOwnerOrg) return false
      // selectableList 当前选中的数据列表，列表数量 大于 1时表示全选，当全选时，不操作
      // 列表数量 等于 1 时表示只选中了一种状态 ，列表状态不等于当前选中项时m通过给当前表单添加_selectable = true 为不可选状态
      // 对比列表状态和当前选择项状态不一致时(status)，添加自定义字段_selectable为不可选择项
      if (data) {
        if (len === 1) {
          const selectData = this.selectableList[0]
          data.taskDtoList.forEach(item => {
            if (item.id !== selectData.id && item.status !== selectData.status) item._selectable = true
          })
        } else if (len === -1 && this.selectableList) {
          // 没有选择项时，删除列表所有明细中被添加的_selectable字段
          data.taskDtoList.forEach(item => {
            delete item._selectable
          })
        }
        // 父子医嘱id + 创建时间  保持一次提交父子医嘱的唯一性
        const mainGroupId = row.mainGroupId + row.createTime
        const _mainGroup = data.taskDtoList.filter(task => task.mainGroupId + task.createTime === mainGroupId)
        // 父子医嘱数量大于1
        if (
          _mainGroup.length > 1 && row.mainFlag
        ) {
          // 包含异常 ： identification 自定义异常字段， 不展示修改icon
          // 包含无法到货 ： status === 4 自定义异常字段， 不展示修改icon
          if (
            _mainGroup.some(task => (
              (task.identification || task.status === 4) &&
              task.mainFlag > 0
            ))
          ) {
            data.taskDtoList.forEach(task => {
              // 父子医嘱， 自定义字段标识该父子医嘱为异常数据
              const taskMainGroupId = task.mainGroupId + task.createTime
              const selectMainGroupId = _mainGroup[0].mainGroupId + _mainGroup[0].createTime
              if (taskMainGroupId === selectMainGroupId) {
                task.customIdentification = 1
              }
            })
            return false
          }
          // 缺货shortage === 23 不可选择
          if (
            _mainGroup.some(task => (
              task.shortage === 23 &&
              task.mainFlag > 0
            ))
          ) return false
          // 父子医嘱，自取中，包含一个带出库的就可操作，邮寄中，包含一个带出库或者已完成并且是待邮寄的可操作
          return ((delivery === 0 && _mainGroup.some(task => task.status === 2)) || (delivery === 1 && _mainGroup.some(task => ([2, 3].includes(task.status) && !task.mailFlag))))
        }
      }
      if (row._selectable || this.pageType === 4) return false
      if (delivery === 0) {
        // 前置条件: 非异常、非缺货(!= 23)
        // 同库房、状态为待出库 => 可勾选，其他一律不可勾选
        // pageType = 2 ：收方发药页面操作时，未指定库房时，可以操作
        return ((
          !identification &&
          shortage !== 23) &&
          (
            actualStorageRoomId === this.storageId &&
            [2].includes(status)
          ) ||
          (
            this.pageType === 2 &&
            [2].includes(status) &&
            !actualStorageRoomId
          )
        )
      } else if (delivery === 1) {
        // 邮寄、非异常、邮寄未完成 本库房 并且状态为未完成或已完成=> 可操作
        return (shortage !== 23 && !mailFlag && !identification && actualStorageRoomId === this.storageId && [2, 3].includes(status))
      } else if (delivery === 2) {
        // 自备 都不能操作
        return false
      }
    },
    handlerRowClick (row) {
      if (row) {
        this.cancel = row.scene || ''
        this.reportData = Object.assign({}, row)
        this.patientId = row.patientId
        // 发药记录页面还原路由patientId
        if (this.$route.query && this.$route.query.patientId) this.$route.query.patientId = ''
        this.visitNumber = row.visitNumber
      }
      // this.auditData 是收方发药界面，传递给审核页面数据， 如果有， 审核页面不查询数据
      !this.auditData && this.fetchList(!row ? true : null, row && row.identification) // 当左侧患者列表为空时， 清空右侧数据明细列表
    },
    handlerChange (obj) {
      // 操作显示缺货、显示异常、显示已取消、显示其他库房checkbox方法 (右上角四大checkbox变化同步更新库房数据)
      // if (this.containObj.containOtherStorageroom !== obj.containOtherStorageroom) {
      //   // getAllStorageRoomAndClinic => parameters.js 重新获取发货库房数据
      //   // this.getAllStorageRoomAndClinic()
      // }
      this.containObj = obj
    },
    abnormallyDeleteHandler: debounce(function (row, index, subIndex, dataType) {
      if (row.dialogFlag) return
      // 删除异常原因 或 删除驳回原因
      const { taskId } = row
      // cancelFunc => parameters.js
      this.cancelFunc(taskId, dataType, _ => {
        // 只有异常操作才需要通知list.vue 组件 并且当前患者下所有异常都已经删除后 删除异常标识
        this.fetchList()
        this.$messageTips(this, 'success', `${dataType ? '驳回' : '异常'}原因删除成功`)
        for (let key in this.dispenseObj) {
          const lists = this.dispenseObj[key]
          for (let i = 0; i < lists.length; i++) {
            // 所有明细中， 任何一个发货方式中存在异常数据， 即停止执行
            if (lists[i].taskDtoList.some(task => (task.identification && task.taskId !== taskId))) return
          }
        }
        // 所有明细中， 不存在任何异常数据
        this.notifyMark = {
          patientId: this.patientId,
          mark: 0
        }
      })
    })
  }
}
