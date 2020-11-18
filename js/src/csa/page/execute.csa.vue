<template>
  <div class="execute-csa">
    <ever-form2 :schema="schema" v-model="queryobj" :is-query="true" :inline="true">
      <template slot="adviceStage">
        <el-radio-group v-model="queryobj.adviceStage">
          <el-radio label="1">术前</el-radio>
          <el-radio label="2">麻醉</el-radio>
          <el-radio label="3">术中</el-radio>
          <el-radio label="4">术后</el-radio>
          <el-radio label="">全部</el-radio>
        </el-radio-group>
      </template>
      <template slot="default">
        <el-button type="primary" @click="search" class="search-btn" size="small">查询</el-button>
      </template>
    </ever-form2>
    <advice-show-table
      class="execute-list"
      ref="adviceShow"
      :visit-type="3"
      :show-data="showTableData"
      :columns="columns"
      :config-option="configOption"
      :context-list="contextList"
      :array-span="arraySpan"
      :no-border-span="noBorderSpan"
      :show-checkbox="true"
      :status-relation="statusRelation"
      @menu="getMenuList"
      @contextSelect="contextSelect"
      @selectionChange="selectionChange"
    >
    </advice-show-table>
    <!-- 执行操作弹窗 -->
    <execute-dialog ref="executeDialog" :title="executeDialogTitle" @close="close"></execute-dialog>
    <!-- 坚持发药 -->
    <resend-dialog ref="resendDialog"  @close="close"></resend-dialog>
  </div>
</template>
<script>
import adviceShowTable from '@/inpatient/components/medical.orders/advice.show.table'
import { CSA_EXECUTE_LIST } from '@/util/table-config'
import api from '@/csa/store/advice'
import executeDialog from '@/csa/components/execute.dialog.vue'
import resendDialog from '@/csa/components/resend.dialog.vue'
import csaapi from '@/csa/store/csaapi.js'

export default {
  components: { adviceShowTable, executeDialog, resendDialog },
  props: {
    provider: { // 当前科室
      type: Object,
      required: true
    }
  },
  data () {
    const schema = [{
      name: 'adviceStage',
      label: '',
      comp: 'custom'
    }, {
      name: 'executeStatusList',
      label: '',
      span: 12,
      comp: 'sys-select',
      props: {
        placeholder: '执行状态',
        field: {
          multiple: true,
          collapsetags: true
        },
        options: [
          {id: '10', name: '待执行'},
          {id: '20', name: '执行中'},
          {id: '30', name: '已完成'}
        ]
      }
    }]
    let obj = this.$ever.createObjFromSchema(schema)
    obj.adviceStage = ''
    return {
      schema,
      queryobj: this.$ever.createObjFromSchema(schema),
      showTableData: [],
      columns: this.getColumns(),
      configOption: {id: CSA_EXECUTE_LIST},
      contextList: [
        // { id: '1', name: '退库申请', disabled: false, methodName: 'refound' },
        // { id: '2', name: '坚持发药', disabled: false, methodName: 'resend' },
        { id: '3', name: '执行登记', disabled: false, methodName: 'register' },
        { id: '4', name: '取消登记', disabled: false, methodName: 'cancel' },
        { id: '5', name: '执行完成', disabled: false, methodName: 'execute' },
        { id: '6', name: '取消完成', disabled: false, methodName: 'cancelFinished' },
      ],
      selectData: [],
      executeDialogTitle: '',
      operatorList: []
    }
  },
  created () {
    this.init()
  },
  computed: {
    fuziData () {
      let obj = {}
      this.showTableData.forEach(v => {
        if (obj[v.mainGroupIdFlag]) {
          obj[v.mainGroupIdFlag].push(v)
        } else {
          obj[v.mainGroupIdFlag] = [v]
        }
      })
      return obj
    }
  },
  methods: {
    init () {
      // 本次手术的执行单id
      this.operationExecuteId = this.$route.query.executeId
      // 对应状态
      this.statusRelation = {
        '10': { col: '', txt: '待执行' },
        '20': { col: '', txt: '执行中' },
        '30': { col: '', txt: '已完成' },
        '40': { col: '', txt: '已取消' }
      }
      this.configOption = { id: CSA_EXECUTE_LIST }
      this.arraySpan = ['startTime', 'executeProviderName', 'completeTime', 'executeName', 'status']
      this.noBorderSpan = ['serviceType', 'doctorAdviceName', 'doctorAdviceContent', 'entrust']
      this.search()
    },
    // 右键操作按钮列表触发事件回调
    getMenuList ({index, row}) {
      this.curClickRow = row
      if (this.selectData.length) {
        return this.contextList.forEach(item => { item.disabled = false })
      } else {
        this.contextList.forEach((v) => {
          v.disabled = !this.getStatusShow(this.fuziData[row.mainGroupIdFlag], index, v.id)
        })
      }
    },
    getStatusShow (list, index, id) {
      if (!list) {
        return false
      }
      if (id === '1') {
        // 退库申请 条件（已出库）
        return list.reduce((res, item) => {
          return item.dispenseStatus === 190 || res
        }, false)
      }
      if (id === '2') {
        // 坚持发药 条件（出库驳回才）
        return list.reduce((res, item) => {
          return item.dispenseStatus === 70 || res
        }, false)
      }
      if (id === '3') {
        // 执行登记 条件（带执行）
        return list.reduce((res, item) => {
          return item.status === 10 && res
        }, true)
      }
      if (id === '4') {
        // 取消登记 条件（执行中）
        return list.reduce((res, item) => {
          return item.status === 20 && res
        }, true)
      }
      if (id === '5') {
        // 执行完成 条件（执行中）
        return list.reduce((res, item) => {
          return [10, 20].includes(item.status) && res
        }, true)
      }
      if (id === '6') {
        // 取消完成 条件（执行完成）
        return list.reduce((res, item) => {
          return item.status === 30 && res
        }, true)
      }
    },
    // 右键操作按钮列表点击回调
    contextSelect ({ item, index }) {
      let data = []
      if (this.selectData.length) {
        data = this.selectData
      } else {
        data = this.fuziData[this.curClickRow.mainGroupIdFlag]
      }
      this[item.methodName](data, index)
    },
    // table checkbox 回调事件
    selectionChange (val) {
      this.selectIds = []
      this.selectData = val
      if (val && val.length) {
        val.map(item => {
          this.selectIds.push(item.id)
        })
      }
    },
    async search () {
      /**
       * operationExecuteId
       * executeStatusList
       * adviceStage
       * pagesize
       * offset
       */
      let params = {
        operationExecuteId: this.operationExecuteId
      }
      params.adviceStage = +this.queryobj.adviceStage || null
      params.executeStatusList = this.queryobj.executeStatusList || []
      let res = await api.getOperationExecuteList(params)
      this.showTableData = res.map(item => {
        item.mainGroupIdFlag = item.mainGroupId + '_' + item.planTime
        item.mainGroupId = item.mainGroupId + '_' + item.planTime
        return item
      })
    },
    // 退库申请
    refound (data) {
      let ids = []
      data.forEach(item => {
        if (item.dispenseStatus === 190) {
          ids.push(item.id)
        }
      })
      if (!ids.length) {
        this.$messageTips(this, 'warning', '所选数据不能进行此操作')
        return
      }
      api.operationExecuteReturnMaterials({ids}).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '成功申请退库')
        }
        this.search()
      })
    },
    // 坚持发药
    resend (data) {
      let adviceExecuteIdList = []
      data.forEach(item => {
        if (item.dispenseStatus === 70) {
          adviceExecuteIdList.push(item.id)
        }
      })
      if (!adviceExecuteIdList.length) {
        this.$messageTips(this, 'warning', '所选数据不能进行此操作')
        return
      }
      this.$refs.resendDialog && this.$refs.resendDialog.open(adviceExecuteIdList)
    },
    // 执行登记
    register (data) {
      let adviceExecuteIdList = []
      data.forEach(item => {
        if (item.status === 10) {
          adviceExecuteIdList.push(item)
        }
      })
      if (!adviceExecuteIdList.length) {
        this.$messageTips(this, 'warning', '所选数据不能进行此操作')
        return
      }
      this.executeDialogTitle = '执行登记'
      if (this.$refs.executeDialog) {
        this.$refs.executeDialog.open(adviceExecuteIdList, this.getExecuteSchema('startTime', '开始时间'))
      }
    },
    // 取消登记
    cancel (data) {
      let adviceExecuteIdList = []
      data.forEach(item => {
        if (item.status === 20) {
          adviceExecuteIdList.push(item)
        }
      })
      if (!adviceExecuteIdList.length) {
        this.$messageTips(this, 'warning', '所选数据不能进行此操作')
        return
      }
      let params = adviceExecuteIdList.map(item => {
        return {
          executeId: item.id,
          executeBy: '',
          executeName: '',
          startTime: '',
          oldStatus: item.status
        }
      })
      api.updateOperationExecute(params).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '操作成功')
        }
        this.search()
      })
    },
    // 执行完成
    execute (data) {
      let adviceExecuteIdList = []
      data.forEach(item => {
        if ([10, 20].includes(item.status)) {
          adviceExecuteIdList.push(item)
        }
      })
      if (!adviceExecuteIdList.length) {
        this.$messageTips(this, 'warning', '所选数据不能进行此操作')
        return
      }
      this.executeDialogTitle = '执行完成'
      if (this.$refs.executeDialog) {
        this.$refs.executeDialog.open(adviceExecuteIdList, this.getExecuteSchema('completeTime', '结束时间'))
      }
    },
    // 取消完成
    cancelFinished (data) {
      let adviceExecuteIdList = []
      data.forEach(item => {
        if (item.status === 30) {
          adviceExecuteIdList.push(item)
        }
      })
      if (!adviceExecuteIdList.length) {
        this.$messageTips(this, 'warning', '所选数据不能进行此操作')
        return
      }
      let params = adviceExecuteIdList.map(item => {
        return {
          executeId: item.id,
          executeBy: item.executeBy,
          executeName: item.executeName,
          startTime: item.startTime,
          completeTime: null,
          oldStatus: item.status
        }
      })
      api.updateOperationExecute(params).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '操作成功')
        }
        this.search()
      })
    },
    close (isRefresh) {
      if (isRefresh) {
        this.search()
      }
    },
    // 获取操作人员列表
    getnurseOptions () {
      csaapi.getStaffListByCondition({
        tenantSubjectIdList: [this.provider.id], // 再加上患者科室就行了
        orgIdList: [this.$store.state.currentUser.organizationId + ''],
        typeCodeList: ['NURSE', 'DOCTOR']
      }).then(res => {
        if (res.data && res.data.resultList && res.data.resultList.length) {
          this.operatorList = res.data.resultList.map(item => {
            return {id: item.id, name: item.name}
          })
        }
      })
    },
    getExecuteSchema (key, name) {
      // useObject
      let schema = [{
        name: 'executeBy',
        label: '操作员',
        span: 24,
        comp: 'ever-select',
        props: {
          placeholder: '请选择',
          options: this.operatorList,
          filterable: true,
          clearable: true,
          needObjFlag: true
        }
      }, {
        name: key,
        label: name,
        comp: 'el-date-picker',
        span: 24,
        class: 'execute-time',
        style: 'width: 100%;',
        props: {
          placeholder: name,
          type: 'datetime',
          valueFormat: 'yyyy-MM-dd HH:mm',
          format: 'yyyy-MM-dd HH:mm'
        }
      }]
      let obj = this.$ever.createObjFromSchema(schema)
      let currentUser = this.$store.state.currentUser
      obj.executeBy = {id: currentUser.userId, name: currentUser.displayName}
      obj[key] = this.$moment().format('YYYY-MM-DD HH:mm')
      let rules = {}
      Object.keys(obj).forEach(item => {
        rules[item] = [{ required: true, message: '必填项', trigger: 'blur' }]
      })
      function getParams (data, list) {
        return list.map(item => {
          let param = {
            executeId: item.id,
            executeBy: data.executeBy.id,
            executeName: data.executeBy.name,
            oldStatus: item.status
          }
          param[key] = data[key]
          return param
        })
      }
      return {schema, obj, rules, getParams}
    },
    getColumns () {
      return [
        {
          slot: 'serviceType',
          prop: 'serviceType',
          label: '类型',
          minWidth: '6%',
          undraggable: true,
          required: true
        },
        {
          slot: 'doctorAdviceName',
          prop: 'doctorAdviceName',
          label: '名称',
          minWidth: '15%',
          undraggable: true,
          required: true
        },
        {
          slot: 'doctorAdviceContent',
          prop: 'doctorAdviceContent',
          label: '内容',
          minWidth: '20%',
          undraggable: true,
          required: true
        },
        {
          prop: 'entrust',
          label: '嘱托',
          showOverflowTooltip: true,
          minWidth: '10%'
        },
        {
          prop: 'executeProviderName',
          label: '执行科室',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          slot: 'status',
          prop: 'status',
          label: '执行状态',
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'startTime',
          label: '发生时间',
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({value}) => {
            if (value) {
              return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
            } else {
              return '--'
            }
          }
        },
        {
          prop: 'completeTime',
          label: '结束时间',
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({value}) => {
            if (value) {
              return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
            } else {
              return '--'
            }
          }
        },
        {
          prop: 'executeName',
          label: '执行人',
          showOverflowTooltip: true,
          minWidth: '8%'
        }
      ]
    }
  },
  watch: {
    queryobj: {
      handler () {
        this.search()
      },
      deep: true
    },
    '$store.state.currentUser': {
      handler (val) {
        if (val) {
          this.getnurseOptions()
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
<style lang="scss" scoped>
  .execute-csa {
    overflow: hidden;
    overflow-y: auto;
    .execute-list {
      height: auto;
    }
  }
</style>
