/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2019-11-13 11:26:34
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-02 10:25:00
 */
import Search from '@/warehouse/views/drug/component/search'
import HospitalSearch from '@/warehouse/views/drug/component/hospital.search'
import HospitalPatientList from '@/warehouse/views/drug/component/hospital.patient.list'
import leftColumns from '@/warehouse/views/drug/columnpool/hospital.patient.column.js'
import HospitalColumns from '@/warehouse/views/drug/columnpool/hospital.column'
import HospitalPatientHeader from '@/warehouse/views/drug/component/hospital.patient.header'
import HospitalUddList from '@/warehouse/views/drug/component/hospital.udd.list'
import HospitalActionBtn from '@/warehouse/views/drug/component/hospital.action.btn'
import StateFul from '@/warehouse/views/drug/component/stateful.vue'
import HospitalParameters from '@/warehouse/views/drug/mixin/hospital.parameters.js'
import checkCdssApi from '@/warehouse/views/drug/api/processapi.js'
import { UDD_OPTIONS, PLACE_OPTIONS, FATHER_SON_OPTIONS, CHINESE_DRUG_OPTIONS, WEST_MEDICINE_TYPE, FATHER_MEDICINE_TYPE, ZH_MEDICINE_TYPE, CHINESE_MEDICINE_TYPE } from '@/warehouse/views/util/constant.js'
import { pick, omit, size, get } from 'lodash'
import { everprint } from '@/util/print'

const STATUS_MSG = { 2: '摆药', 3: '发药', 4: '无法到货' }
const STATUS_OBJ = { 2: '12', 3: '2' } // /* 2: '12' 待摆药*/  /* 3: '2'待发药 */
export default {
  mixins: [HospitalParameters],
  data () {
    return {
      visitNumber: 'OP20190000003007', // 住院号
      patientId: 'YzWmfYHJywZn22ueoLm', // 患者id
      termType: '', // 医嘱类型 0: 临时医嘱 1: 长期医嘱
      implementTime: '', // 执行时间
      loading: false,
      refreshThePage: true, // 修改分列配置项 销毁右侧列表组件再重新加载
      leftColumns,
      HospitalColumns,
      sourceData: {}, // 药包数据或者药明细
      recordUddData: {}, // 发药记录数据（udd药包）
      queryObj: null, // 查询条件参数
      reportData: null, // 当前患者数据
      obj: {},
      selectableList: [], // 发药任务选中项
      patientSelectableList: [], // 患者选中项
      taskParams: null,
      currentPatientObj: null, // 当前患者对象
      udd12SelectableList: [], // 12 待摆药选择数据
      udd2SelectableList: [], // 2 待发药选择数据
      queryParams: null
    }
  },
  mounted () {
    this.onSubmitExceptionCause() // 接收提交异常原因事件
    this.onPatientRowClick() // 接收患者列表当前患者事件
    this.onUddCheckChange() // 接收 table udd药包 选择列数据
    this.onDeleteExceptionCause() // 接收 udd list 明细中 删除异常操作
    this.onNotifyConfirmUnreachable() // 接收无法到货通知事件
    this.onReprintUdd() // 接收给执行打印udd包
    this.$bus.$on('hospital:get-patient-task-list', (params) => { // 接收查询组件变化数据
      this.queryParams = params
    })
  },
  beforeDestroy () {
    this.$bus.$off('hospital:checkbox-change')
    this.$bus.$off('hospital:submit-exception-cause')
    this.$bus.$off('hospital:paitent-row-click')
    this.$bus.$off('hospital:get-patient-task-list')
    this.$bus.$off('hospital:delete-exception-cause')
    this.$bus.$off('hospital:notify-confirm-unreachable')
    this.$bus.$off('hospital:notify-recreate-reprintUdd')
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
    initSelectedUddPackageList () { // 初始化需要全选所有药包数据
      this.selectableList = []
      this.udd2SelectableList = []
      this.udd12SelectableList = []
      const { medicine, preparation } = this.sourceData
      Object.keys(medicine).forEach((key) => {
        if (this.canSelected(medicine[key])) {
          const newMedicine = JSON.parse(JSON.stringify(medicine[key]))
          this.udd2SelectableList.push(Object.assign({}, newMedicine[0], { _sourceData: newMedicine })) // 选中的发药数据
        }
      })
      Object.keys(preparation).forEach((key) => {
        if (this.canSelected(preparation[key])) {
          const newPreparation = JSON.parse(JSON.stringify(preparation[key]))
          this.udd12SelectableList.push(Object.assign({}, newPreparation[0], { _sourceData: newPreparation })) // 选中的摆药数据
        }
      })
    },
    pushValue (arr, value) {
      if (value !== undefined && value !== null && value !== '' && !arr.find(val => val === value)) arr.push(value)
    },
    batchPrintHandler () { // 批量打印
      // const { areaIdList, employList, implementTimeLists } = this.queryParams // serach 条件参数
      let areaIdList = []
      let employList = []
      let implementTimeLists = []
      let hospitalizedNumberList = []
      let termTypeList = []
      this.patientSelectableList.forEach(row => {
        const { areaId, employ, implementTime, hospitalizedNumber, termType } = row
        this.pushValue(areaIdList, areaId)
        this.pushValue(employList, employ)
        this.pushValue(implementTimeLists, implementTime)
        this.pushValue(hospitalizedNumberList, hospitalizedNumber)
        this.pushValue(termTypeList, termType)
      })
      const params = {
        areaIdList,
        employList,
        implementTimeLists,
        hospitalizedNumberList,
        storageRoomId: this.currentStorageRoomId,
        isPrint: 0,  // 批量打印
        termTypeList: [...new Set(termTypeList)],
        processConfigurationId: this.processConfigurationId
      }
      this.uddApi.createUdd(params).then(res => {
        if (res.finally) return this.$messageTips(this, 'success', '没有待打印数据')
        if (size(res)) {
          this.$messageTips(this, 'success', '批量打印完成')
          // 任务打印页面批量打印后，通知患者列表组件重新get患者列表数据 1: 更新患者列表、0：不更新患者列表，但清空所有选择列表
          this.$bus.$emit('hospital:batch-print-after-get-patient-task-list', this.pageType === 1 ? 1 : 0, hospitalizedNumberList.length)
          this.runBatchPrint(res, true)
          if (this.pageType === 2) {
            return this.getTask() // 重新查询当前患者的发药详情
          }
        }
      })
    },
    /**
     * runBatchPrint 运行批量打印方法
     *
     * @param {Object} params // 打印code参数
     * @param {Boolean} isBatch // 是否打印批量摆药单
     */
    runBatchPrint (params, isBatch) { // 批量执行打印任务(udd药包任务)
      const self = this
      const batchDispenseCodes = params.batchDispenseCode
      const keys = Object.keys(omit(params, ['batchDispenseCode']))
      const keySize = size(keys)
      const configObj = this.currentProcessConfig.processItemObject
      function runMedicinePrint () { // 摆药单打印 -> 只有批量打印时才有
        const batchDispenseCode = batchDispenseCodes.shift()
        if (batchDispenseCode) {
          const printCode = PLACE_OPTIONS.find(row => +configObj.processItemPreparePrintObject.value === row.id)
          console.log(printCode && printCode.code && { batchDispenseCode }, '摆药单打印')
          printCode && everprint(printCode.code, { batchDispenseCode }, {
            cb: runMedicinePrint
          })
        }
      }

      /**
       * run 递归执行打印任务 udd打印
       *
       * @param {Number} i 物资类型种类数量
       */
      function run (i) {
        const type = keys[i]
        const list = params[type]
        /**
         * runPrint 执行打印操作
         *
         * @param {String} type (西药类型、中药类型) WEST_MEDICINE_TYPE
         * @param {Array} list 西药类型、中药类型 组生成的udd包code
         */
        function runPrint () {
          if (size(list)) {
            const code = list.shift()
            // udd药签配置数据，包含打印code（西药）code_zh（中药）
            // WEST_MEDICINE_TYPE： 西药非父子医嘱
            // FATHER_MEDICINE_TYPE：西药父子医嘱
            // ZH_MEDICINE_TYPE：中药类型
            let _OPTIONS = []
            if (FATHER_MEDICINE_TYPE.includes(type)) { // 属于西药父子医嘱
              _OPTIONS = FATHER_SON_OPTIONS
            } else if (WEST_MEDICINE_TYPE.includes(type)) { // 属于西药非父子医嘱 | 中药
              _OPTIONS = UDD_OPTIONS
            } else if (ZH_MEDICINE_TYPE.includes(type)) { // 属于中药
              _OPTIONS = CHINESE_DRUG_OPTIONS
            }
            const printCode = _OPTIONS.find(row => configObj.processItemPasteObject && +configObj.processItemPasteObject.value === row.id)
            // TODO：父子医嘱code  打印父子医嘱时 （FATHER_SON_OPTIONS.code）
            console.log(printCode && printCode.code, { sourceCodeList: [code] }, '打印 + 批量打印 + 重新生成udd并打印')
            printCode && everprint(printCode.code, { sourceCodeList: [code] }, {
              cb: runPrint
            })
          } else {
            run(++i)
          }
        }
        // keys是物资类型(西药类型、中药类型) WEST_MEDICINE_TYPE
        // 当i小于物资类型种类数量时，执行打印操作
        if (i < keySize) {
          runPrint()
        } else if (i >= keySize) {
          // dispensePreparePrint：是否开启批量摆药单打印
          // 打印完udd包后在进行 摆药单打印 （不同同时派发多个打印任务）
          !!self.dispensePreparePrint && isBatch && runMedicinePrint()
        }
      }
      run(0)
    },
    hospitalActionBtnHandler (type) { // 点击操作按钮
      // 操作按钮 type: 1: 打印 2：摆药 3：发药
      type === 1 ? this.createUddHandler() : this.updateUddHandler(type)
    },
    createUddHandler () { // 单条打印
      this.uddApi.createUdd({ ids: this.getIdsFunc(), processConfigurationId: this.processConfigurationId, storageRoomId: this.currentStorageRoomId }).then(res => {
        if (res) {
          this.$messageTips(this, 'success', `打印成功`)
          this.getTask()
          this.runBatchPrint(res)
        }
      })
    },
    /**
     * updateUddHandler 操作发药任务
     *
     * @param {Number} status 2：摆药 3：发药 4：无法到货
     * @param {Object} unreachableParams status === 4 时的缺货参数
     */
    updateUddHandler (status, unreachableParams) {
      // 操作摆药完成：2，操作发药完成3，操作无法到货4，取消5
      // _sourceData:udd药包所有数据明细
      let params
      if (status === 4) {
        params = unreachableParams // 无法到货参数
      } else {
        params = {
          ids: [...new Set(this[`udd${STATUS_OBJ[status]}SelectableList`].map(list => list._sourceData.map(source => source.id)).flat())],
          status
        }
      }
      // 增加十八反、十九畏 用药提醒
      if ([2, 3].includes(status)) {
        const localMaterialIds = this[`udd${STATUS_OBJ[status]}SelectableList`].map(list => list._sourceData.map(source => source.localMaterialId)).flat()
        if (localMaterialIds.length) {
          checkCdssApi.checkCdssRule({bizCode: 'THC_RULE_MZCFSH', localMaterialIds}).then(res => {
            if (res && res.length) {
              let message = res.map(item => item.message).join('<br>')
              return this.$confirm(message + '<br>"确认执行"将为您继续执行，"取消"则可返回修改。', '用药提示', {
                confirmButtonText: '确认执行',
                customClass: 'w_500',
                dangerouslyUseHTMLString: true,
              }).then(() => {
                this.updateUddApi(params, status)
              }).catch(() => {})
            } else {
              this.updateUddApi(params, status)
            }
          })
        }
      } else {
        this.updateUddApi(params, status)
      }
    },
    updateUddApi (params, status) {
      this.uddApi.updateUdd(params).then(res => {
        if (get(res, 'finally', false) || res.msg) {
          if (res.msg) {
            return this.$confirm('该患者已欠费，不能发药。', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {}).catch(() => {})
          }
          this.$messageTips(this, 'success', `${STATUS_MSG[status]}成功`)
          this.getTask()
        }
      })
    },
    getIdsFunc () { // 返回选择任务task 明细id
      let _arr = []
      // 明细处方函数
      this.selectableList.forEach(select => {
        // 父子医嘱
        const { mainFlag, mainGroupId, createTime, taskType, adviceExecuteId } = select
        if (CHINESE_MEDICINE_TYPE.includes(String(taskType))) {
          this.sourceData.noPrintCode.filter(task => task.adviceExecuteId === adviceExecuteId).forEach(task => {
            _arr.push(task.id)
          })
        } else if (mainFlag > 0) {
          const compose = mainGroupId + createTime
          this.sourceData.noPrintCode.filter(task => task.mainGroupId + task.createTime === compose).forEach(task => {
            _arr.push(task.id)
          })
        } else {
          _arr.push(select.id)
        }
      })
      return [...new Set(_arr)]
    },
    selectionChangeHandler (selection, type) { // 接收患者列表 selecte 或者  未打印task 任务选中值
      // 1:患者列表选择项 2:发药明细选择项noPrintCode
      // 接收自：this.$emit('selection-change', selection, 2)
      // 通过table选择项，处理不同数据类型是否可以被选择
      // 1:患者列表选择项 2:发药明细选择项noPrintCode
      this[type === 1 ? 'patientSelectableList' : 'selectableList'] = selection
      type === 2 && selection && this.patientSelected()
    },
    onSubmitExceptionCause () { // 接收提交异常原因事件
      this.$bus.$on('hospital:submit-exception-cause', (obj, list, row) => {
        const { taskId, id } = row
        const params = {
          ids: [taskId || id],
          // actualStorageRoomId: row.storageRoomId || this.currentStorageRoomId, // 统一摆药 多个不同库房
          recipeCommentDetailList: [{
            id: taskId || id,
            classifyList: list.filter(single => single.id).map(single => ({
              id: single.id,
              contentText: single.contentText
            })),
            // actualStorageRoomId: row.storageRoomId || this.currentStorageRoomId, // 操作库房 统一摆药 多个不同库房
            content: list.filter(single => !single.id).join('') || '',
            dataType: 0 // 异常
          }]
        }
        this.uddApi.dispenseUpdateChange(params).then(res => {
          if (get(res, 'finally', false)) {
            // 调用异常组件关闭方法：src/warehouse/views/drug/component/modify.table.dialog.vue
            const uddlist = this.$refs.uddlist
            const nouddlist = this.$refs.nouddlist
            if (Array.isArray(uddlist)) {
              uddlist.forEach(ref => {
                const modifyDialog = ref.$refs.modifyDialog
                modifyDialog && modifyDialog.handlerCloseDialog()
              })
            }

            if (nouddlist) {
              const modifyDialog = nouddlist.$refs.modifyDialog
              modifyDialog && modifyDialog.handlerCloseDialog()
            }
            // 关闭集中摆药修改弹窗
            this.$bus.$emit('focus-dispensing-close-modify-dialog')
            // 通知患者列表添加异常标记
            this.$bus.$emit('hospital:notify-patient-list-mark', { identification: 1 })
            this.getTask()
          }
        })
      })
    },
    onPatientRowClick () { // 接收点击患者行事件 => 获取当前点击患者数据
      this.$bus.$on('hospital:paitent-row-click', (row, params) => {
        if (row) {
          this.currentPatientObj = row // 当前患者对象数据
          const { hospitalizedNumber, patientId, termType, implementTime } = row
          this.visitNumber = hospitalizedNumber // 住院visitNumber 取住院号 统一字段传参
          this.patientId = patientId
          this.termType = termType
          this.implementTime = implementTime
          this.$nextTick(() => {
            this.getTask(row, params)
          })
        } else {
          // 清空 页面右侧所有udd 和task
          if (params.searchCode || params.localMaterialId) this.$messageTips(this, 'warning', '没有找到匹配的结果，请重新核对后重新搜索。')
          this.sourceData = { noPrintCode: [], preparation: {}, medicine: {} }
          this.recordUddData = {}
          this.$bus.$emit('notify-update-search-params', null, false)
        }
      })
    },
    onDeleteExceptionCause () { // 接收删除异常事件
      this.$bus.$on('hospital:delete-exception-cause', (row, e, index) => {
        // 需要查询整个sourceData中三大模块数据中是否还存在异常数据
        // 当不存在异常数据时， 通知患者列表组件删除该患者异常标识
        this.$confirm('删除原因后，异常状态将取消', '取消异常', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          const params = {
            taskId: row.taskId || row.id
          }
          this.uddApi.dispenseCancel(params).then(res => {
            if (get(res, 'finally', false)) this.getTask(null, null, true)
          })
        }).catch(_ => { })
      })
    },
    onNotifyConfirmUnreachable () { // 接收无法到货通知事件
      this.$bus.$on('hospital:notify-confirm-unreachable', (row, cancelAll) => {
        const params = {
          cancelAll,
          status: 4,
          storageRoomId: this.currentStorageRoomId
        }
        if (cancelAll) { // 统一无法到货时， 传递物资id + this.processId  当前页面route.meta.mark
          params.localMaterialId = row.localMaterialId
          params.processId = this.processId
        } else {
          params.ids = [row.taskId || row.id]
        }
        this.updateUddHandler(4, params)
      })
    },
    onReprintUdd () { // 接收给公共methods.mixin执行打印udd包
      this.$bus.$on('hospital:notify-recreate-reprintUdd', (params) => {
        this.runBatchPrint(params)
        this.getTask()
      })
    },
    onUddCheckChange () { // 接收udd药包选择（自定义表格table 选择列）
      this.$bus.$on('hospital:checkbox-change', (row, isCheck) => {
        const { id, status } = row
        const index = this[`udd${status}SelectableList`].findIndex(item => item.id === id)
        if (!isCheck && ~index) {
          this[`udd${status}SelectableList`].splice(index, 1)
          return
        }
        this[`udd${status}SelectableList`].push(row)
      })
    },
    /**
     * getTask 获取udd数据
     *
     * @param {obj} row 当前患者列数据
     * @param {obj} params 当前查询条件
     * @param {boolean} notify 是否需要检测当前udd数据是否包含异常 -> 通知患者组件修改异常标识
     */
    getTask (row, params, notify) { // 查询住院发药任务
      if (row) {
        this.taskParams = Object.assign(
          {},
          omit(params, ['areaIdList', 'employList', 'implementTimeList', 'endDate', 'startDate']),
          pick(row, ['areaId', 'employ', 'implementTime', 'patientId', 'hospitalizedNumber', 'termType', 'providerId'])
        )
      }
      this.loading = true
      this.uddApi[this.apiName || 'getTaskList'](this.taskParams).then(res => {
        const hasContent = (!!size(res) && !res.finally) // 确定返回值 res 中包含有用的数据
        if (this.pageType === 4) { // 发药记录页面
          this.recordUddData = {}
          hasContent && (this.recordUddData = res)
        } else if (hasContent) {
          const preparation = '12' // 摆药
          const medicine = '2' // 发药
          const noPrintCode = 'noPrintCode' // 未生成药包的医嘱任务
          const data = res[res[preparation] ? preparation : medicine]
          this.sourceData = {
            noPrintCode: data && data[noPrintCode] || [], // 未生成药包的医嘱任务
            preparation: omit(res[preparation], [noPrintCode]) || {},  // 待备药数据
            medicine: omit(res[medicine], [noPrintCode]) || {}, // 待发药数据
          }
          const recording = this.totalIdentificationSize()

          // 获取所有明细中是否存在异常数据（通知患者列表更新异常标识）
          if (size(this.sourceData) === recording) notify = true
          // 三种类型数据 都没有值时，通知患者列表删除左侧列表当前患者
          // 任务打印页， noPrintCode 数据为空时删除左侧列表当前患者
          // 任务列表页， listMode 多人协同操作 preparation & medicine 数据为空时删除左侧列表当前患者
          // 任务列表页， listMode 单人操作 noPrintCode & preparation & medicine 数据为空时删除左侧列表当前患者
          // 缺货页面
          if (
            (
              this.pageType === 1 &&
              !this.sourceData.noPrintCode.length
            ) ||
            (
              this.pageType === 2 &&
              this.listMode &&
              !size(this.sourceData.preparation) &&
              !size(this.sourceData.medicine)
            ) ||
            (
              this.pageType === 2 &&
              !this.listMode &&
              !this.sourceDataAllBoolean()
            ) ||
            (
              this.pageType === 3 &&
              !this.sourceDataAllBoolean()
            )
          ) {
            this.notifyPatientMark(null, true)
          }
        } else {
          this.sourceData = {
            noPrintCode: [], // 未生成药包的医嘱任务
            preparation: {},  // 待备药数据
            medicine: {}, // 待发药数据
          }
          this.notifyPatientMark(null, true)
        }
        notify && this.notifyPatientMark({ identification: 0 })
      }).finally(_ => {
        this.loading = false
        if (this.pageType !== 4) this.initSelectedUddPackageList() // 非发药记录页面重置udd包选择（默认全选）
      })
    },
    /**
     * 获取所有sourceData明细中是否存在标记异常数据
     * 一个明细中不包含异常 recording + 1
     * 当 recording === sourceData.size 表明sourceData中不存在异常标识数据
     * @returns number
     */
    totalIdentificationSize () {
      let recording = 0
      const keys = Object.keys(this.sourceData)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const data = this.sourceData[key]
        if (Array.isArray(data) && !data.some(item => item.identification)) {
          recording++
        } else {
          const keys1 = Object.keys(data)
          if (!size(data)) {
            recording++
            continue
          }
          for (let j = 0; j < keys1.length; j++) {
            const key1 = keys1[j]
            if (Array.isArray(data[key1]) && !data[key1].some(item => item.identification)) {
              recording++
            }
          }
        }
      }
      return recording
    },
    /**
     * notifyPatientMark 通知患者列表数据 更改 或者 删除
     *
     * @param {obj} change // 变更数据对象
     * @param {boolean} del // 是否删除
     */
    notifyPatientMark (change, del) {
      if (this.hasSome(this.sourceData.noPrintCode)) return // 待打印的医嘱任务中包含异常
      if (Object.keys(this.sourceData.preparation).some(item => this.hasSome(this.sourceData.preparation[item]))) return // 待摆药的udd药包中包含异常
      if (Object.keys(this.sourceData.medicine).some(item => this.hasSome(this.sourceData.medicine[item]))) return // 待发药的udd药包中包含异常
      this.$bus.$emit('hospital:notify-patient-list-mark', change, del)
    },
    hasSome (list, name = 'identification') {
      return list.some(row => row[name])
    },
    sourceDataAllBoolean () { // 三种类型数据，有一个为真， 当前页面还有可展示数据
      return this.sourceData.noPrintCode.length || size(this.sourceData.preparation) || size(this.sourceData.medicine)
    },
    patientSelected () { // 获取右侧数据详情  noPrint：未打印数据 medicine：待发药udd preparation： 待摆药udd ->  是否全部选中
      // 单独取消选中患者名下的一条任务，则联动取消左侧患者的选中状态 1 选中 0 取消
      // const selected = this.selectableListLength === this.noPrintCodeLength && this.medicineLength === this.udd2SelectableLength && this.preparationLength === this.udd12SelectableLength
      const selected = this.selectableListLength === this.noPrintCodeAndNoGroupIdLength
      this.$bus.$emit('hospital:notify-patient-list-mark', this.currentPatientObj, null, selected)
    },
    getDataLen (data) { // 过滤父子医嘱(一个父子医嘱算一条数据)
      return data.filter(row => {
        const { mainFlag } = row
        return mainFlag === 0 || mainFlag === 1
      }).length
    }
  },
  computed: {
    uddCode12Size () { // 待摆药数量
      return !!size(this.sourceData.preparation)
    },
    uddCode2Size () { // 待发药数量
      return !!size(this.sourceData.medicine)
    },
    recordUddDataSize () { // 发药记录数量（udd数）
      if (this.recordUddData.finally) return false
      return !!size(this.recordUddData)
    },
    noPrintCodeLength () { // task 明细所有数量
      return this.sourceData.noPrintCode ? this.sourceData.noPrintCode.length : 0
    },
    noPrintCodeAndNoGroupIdLength () { // 未打印数据中，父子医嘱只算一条数据的总数量
      // return uniqBy(this.sourceData.noPrintCode, 'mainGroupId').length
      return this.getDataLen(this.sourceData.noPrintCode)
    },
    medicineLength () { // 全部待发药udd数量
      return size(this.sourceData.medicine)
    },
    preparationLength () { // 全部待摆药udd数量
      return size(this.sourceData.preparation)
    },
    selectableListLength () { // task 明细选中数量
      return this.getDataLen(this.selectableList)
    },
    udd12SelectableLength () { // 待摆药udd选中数量
      return this.udd12SelectableList.length
    },
    udd2SelectableLength () { // 待发药udd选中数量
      return this.udd2SelectableList.length
    },
    noPrintCodeBoolean () { // 没有打印任务task -> 用于打印按钮是否展示
      return !!this.noPrintCodeLength
    },
    printBtnDisabled () { // 打印btn
      return !this.selectableListLength
    },
    batchPrintBtnDisabled () { // 批量打印btn
      return !this.patientSelectableList.length
    },
    selectUddCode12Disabled () { // 已选中待摆药数量操作按钮是否可以操作
      return !this.udd12SelectableLength
    },
    selectUddCode2Disabled () { // 已选中待发药数量操作按钮是否可以操作
      return !this.udd2SelectableLength
    }
  },
  components: {
    HospitalPatientHeader,
    HospitalActionBtn,
    HospitalPatientList,
    HospitalUddList,
    HospitalSearch,
    StateFul,
    Search
  }
}
