<template>
  <div class="flex_column_full">
    <ever-table
      ref="tableList"
      :table-loading="loading"
      :columns="columns"
      :data="tableData"
      table-class="no-margin-table flex_column_full_hidden x-hidden small-padding"
      class="flex_scroll flex_hidden"
      :is-single-table="true"
      @row-click="handlerRowClick"
      @eventChange="eventChange">
      <template v-for="column in renderColumns" :slot="column.slotName">
        <el-table-column
          :key="column.prop"
          :slot="column.prop"
          :label="column.label"
          :width="column.width"
          :prop="column.prop">
          <template slot="header" slot-scope="scope">
            {{column.label}}
          </template>
          <template slot-scope="scope">
            <coltd-functional :row="scope.row" :index="scope.$index" :pageType="pageType" :render="column.render" :td-key="column.prop"></coltd-functional>
          </template>
        </el-table-column>
      </template>
    </ever-table>
    <ever-pagination
      class="pagination"
      justify="center"
      layout="total, prev, pager, next, sizes"
      :pagesize="pagesize"
      :no-bg="true"
      :small="true"
      :pager-count="5"
      :total-count="totalCount"
      :current="current"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange">
    </ever-pagination>
  </div>
</template>

<script>
import ColtdFunctional from '@/warehouse/views/drug/mixin/coltd.functional.js'
import dispenseApi from '@/warehouse/views/drug/api/dispenseapi.js'
import getStorage from '@/warehouse/page/storages/util/getstorage.js'
import { wsConnect, debounce } from '@/util/common/'
import Parameters from '@/warehouse/views/drug/multilibrary/mixin/parameters'
import list from '@/util/list'
export default {
  props: {
    name: String, // api接口名称
    pageType: Number, // 页面标识
    queryParams: Object, // 接口查询参数
    customParams: { // 每个业务场景有不同的参数(发药记录、缺货任务等)个性化参数
      type: Object,
      default: () => ({})
    },
    statusList: { // 该页面查询什么状态的任务
      type: Array,
      default: () => ([2, 3, 9])
    },
    containObj: { // 库房配置checkbox group参数
      type: Object,
      default: () => ({})
    },
    columns: { // evertable列
      type: Array,
      default: () => []
    },
    queryObj: { // 查询条件参数数据
      type: Object,
      default: () => ({})
    },
    notifyMark: Object // 患者id 用于添加该患者的异常标识
  },
  components: {
    ColtdFunctional
  },
  computed: {
    renderColumns () {
      return this.columns.filter(column => column.render)
    },
    linkMq () {
      return this.pageType === 1 || this.pageType === 5
    },
    organizationId () { // 开单机构
      return this.$store.state.currentUser.organizationId
    }
  },
  data () {
    return {
      tableData: [],
      activeAside: false,
      loading: false,
      currentPatientObject: null,
      cacheActiveId: null,
      activeId: null
    }
  },
  mixins: [getStorage, Parameters, list],
  watch: {
    notifyMark: {
      handler (v) {
        const index = this.tableData.findIndex(list => {
          return list.patientId === v.patientId
        })
        index >= 0 && typeof v.mark === 'number' && (this.tableData[index].identification = v.mark)
        index >= 0 && typeof v.shortage === 'number' && (this.tableData[index].shortage = v.shortage)
        // 当前患者 有异常标记或者 缺货标记
        if (index >= 0 && v.del) {
          // 简单粗暴 更新缺货任务患者列表
          this.list(true)
        }
      },
      deep: true
    },
    containObj: {
      handler (v) {
        this.list(true)
      },
      deep: true
    },
    queryObj: {
      handler (v) {
        this.list()
      },
      deep: true
    }
  },
  mounted () {
    this.$bus.$on('notify-receive-sokect-message', (row, route) => {
      this.setCurrentRow(row)
    })
  },
  beforeDestroy () {
    this.$bus.$off('notify-receive-sokect-message')
  },
  methods: {
    createSocket () {
      // 任务审核
      this.pageType === 1 && wsConnect('/exchange/exchange.thc-warehouse.business.outpatient_drug_send/routingKey.thc-warehouse.business.outpatient_drug_send', (client, res) => {
        this.setCurrentRow(client, res)
      })
      // 任务列表
      this.pageType === 5 && wsConnect('/exchange/exchange.thc-warehouse.business.outpatient_drug_audit/routingKey.thc-warehouse.business.outpatient_drug_audit', (client, res) => {
        this.setCurrentRow(client, res)
      })
    },
    checkProcess (row) {
      const { scene, implementType, materialType, storageRoomId } = this.processConfig
      if (storageRoomId === row.actualStorageRoomId && JSON.parse(scene).includes(String(row.scene)) && JSON.parse(materialType).includes(String(row.taskType)) && JSON.parse(implementType).includes(String(row.implementType))) return false
      return true
    },
    setCurrentRow: debounce(function (row) {
      if (![1, 5].includes(this.pageType) || this.loading) return
      // 只有在开单机构下才接收任务
      const { orgId, visitSn, patientId } = row
      if (orgId === this.organizationId) {
        // 任务列表 非匹配当前流程或者当前库房，不进行任何操作
        // if (this.pageType === 5 && this.checkProcess(row)) return
        const index = this.tableData.findIndex(item => item.visitSn === visitSn)
        // console.log(index, '-', row.visitSn, '-', this.activeId, '-', this.cacheActiveId, '-', row)
        if (index > -1) {
          this.tableData.splice(index, 1, Object.assign(this.tableData[index], { mqMsg: 1 }))
        }
        if (index > -1 && visitSn && visitSn === this.activeId && this.cacheActiveId !== this.activeId && !this.cacheActiveId) {
          // task以任务明细的维度发送消息，多条明细会发送多次，
          this.$alert(`患者数据有更新，请刷新页面查看新数据。`, '提示', {
            type: 'warning',
            confirmButtonText: '确定'
          }).then(() => {})
          this.cacheActiveId = visitSn
          // 三秒钟内，同一个人不提示
          setTimeout(_ => {
            this.cacheActiveId = null
          }, 3000)
        } else if (index === -1) {
          this.tableData.push(Object.assign(row, { mqMsg: 1 }))
          if (this.tableData.length === 1) {
            this.$nextTick(_ => {
              this.$emit('row-click', Object.assign({
                patientId,
                visitNumber: this.activeId = visitSn
              }, row))
              this.setRefsCurrentRow(row)
            })
          }
        }
      }
    }, 600),
    setRefsCurrentRow (row) {
      this.$refs.tableList && this.$refs.tableList.$refs && this.$refs.tableList.$refs.everTable.setCurrentRow(row)
    },
    list (isUpdate) {
      // 库房配置信息读取未添加字段
      const params = {
        type: 1,
        pagesize: this.pagesize,
        offset: this.offset,
      }
      // 审核页面不需要流程id参数 和 库房id
      if (this.pageType !== 1) {
        const { storageRoomId, scene } = this.processConfig
        params.status = this.statusList
        params.examineFlag = 2
        params.unSplit = false
        params.typeList = JSON.parse(scene)
        params.actualStorageRoomId = storageRoomId // 当前库房 (配置Vuex中的数据)
      }
      if (this.pageType === 5) params.mailFlag = 0
      if (this.pageType === 4) params.mailFlag = 1
      this.loading = true
      // 列表查询查询患者维度任务列表, 拼接containObj、queryObj、customParams参数
      dispenseApi[this.name || 'getTaskList'](this.queryParams ? Object.assign({}, params, this.queryParams, this.customParams) : Object.assign({}, params, this.queryObj, this.customParams)).then(res => {
        if (!res) return
        this.tableData = (res.data || res).map(item => {
          if (!item.visitSn && item.visitNumber) item.visitSn = item.visitNumber
          return item
        })
        this.totalCount = res.totalCount
        // 用于单选表格，设定某一行为选中行
        if (this.tableData.length) {
          this.$nextTick(_ => {
            let index = 0
            if (isUpdate && this.activeId) {
              index = this.tableData.findIndex(data => data.visitSn === this.activeId)
            }
            const row = this.tableData[index >= 0 ? index : 0]
            this.$emit('row-click', Object.assign({
              patientId: row.patientId,
              visitNumber: this.activeId = row.visitSn
            }, row))
            this.setRefsCurrentRow(row)
          })
        } else {
          this.$emit('row-click')
        }
      }).finally(_ => {
        this.loading = false
      })
    },
    handlerAside () {
      this.$emit('aside-width', (this.activeAside = !this.activeAside))
    },
    handlerRowClick ({ row, column }) {
      const { visitSn: visitNumber, patientId, identification, channel, scene, visitType } = row
      const index = this.tableData.findIndex(item => item.visitSn === row.visitSn)
      this.tableData.splice(index, 1, Object.assign(row, { mqMsg: 0 }))
      // if (this.activeId === visitNumber) return
      this.activeId = visitNumber
      this.$emit('row-click', {
        patientId,
        visitNumber,
        identification,
        channel,
        visitType,
        scene
      })
      this.setRefsCurrentRow(row)
    },
    eventChange () {
      console.log('eventChange')
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination /deep/ .el-pagination .el-input__inner {
  height: 20px;
}
.flex_column_full /deep/ .el-table{
  margin-top: 0;
}
.icon {
  &.active {
    transform: rotate(180deg);
  }
  transform: rotate(0deg);
}
</style>
