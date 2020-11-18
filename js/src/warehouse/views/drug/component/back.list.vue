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
            <coltd-functional :row="scope.row" :index="scope.$index" :render="column.render" :td-key="column.prop"></coltd-functional>
          </template>
        </el-table-column>
      </template>
    </ever-table>
    <div class="line32">
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
  </div>
</template>

<script>
import ColtdFunctional from '@/warehouse/views/drug/mixin/coltd.functional.js'
import dispenseApi from '@/warehouse/views/drug/api/dispenseapi.js'
import getStorage from '@/warehouse/page/storages/util/getstorage.js'
import list from '@/util/list'
export default {
  props: {
    name: String, // api接口名称
    customParams: { // 个性化参数
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
    searchSwit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tableData: [],
      loading: false,
      processId: this.$store.state.processConfig.thisStorageroomProcessConfig.processId
    }
  },
  mixins: [getStorage, list],
  watch: {
    queryObj: {
      handler (v) {
        if (this.searchSwit) {
          this.list()
        }
      },
      deep: true
    }
  },
  computed: {
    renderColumns () {
      return this.columns.filter(column => column.render)
    },
  },
  created () {
    this.queryObj.requestSwitch = true
  },
  components: {
    ColtdFunctional
  },
  mounted () {
    this.onNotifyReceiveSokectMessage() // 接收socket消息
  },
  destroyed () {
    this.$bus.$off('notify-receive-sokect-message')
  },
  methods: {
    onNotifyReceiveSokectMessage () { // 接收socket派发消息内容
      this.$bus.$on('notify-receive-sokect-message', (data, setting) => {
        if (!data) return
        const { providerName, taskObject } = data
        const newObject = Object.assign(taskObject, { providerName })
        const index = this.tableData.findIndex(item => item.patientId === newObject.patientId && (item.visitSn === newObject.visitSn || item.hospitalizedNumber === newObject.hospitalizedNumber))
        if (index > -1) {
          this.tableData.splice(index, 1, Object.assign(this.tableData[index], { mqMsg: 1 }))
          const row = this.tableData[index]
          if (row.visitSn && row.visitSn === this.activeId && this.cacheActiveId !== this.activeId && !this.cacheActiveId) {
            this.$alert(`患者数据有更新，请刷新页面查看新数据。`, '提示', {
              type: 'warning',
              confirmButtonText: '确定'
            }).then(() => {})
            this.cacheActiveId = row.visitSn || row.hospitalizedNumber
            // 三秒钟内，同一个人不提示
            setTimeout(_ => {
              this.cacheActiveId = null
            }, 3000)
          }
        } else {
          this.tableData.push(newObject)
          if (this.tableData.length === 1) {
            // 用于单选表格，设定某一行为选中行
            const row = this.tableData[0]
            this.handlerRowClickSet(row)
          }
        }
      })
    },
    handlerRowClickSet (row) {
      this.$nextTick(_ => {
        this.$emit('row-click', Object.assign({
          patientId: row.patientId,
          visitNumber: this.activeId = row.visitSn || row.hospitalizedNumber,
          hospitalizedNumber: row.hospitalizedNumber
        }, row))
        this.$refs.tableList && this.$refs.tableList.$refs && this.$refs.tableList.$refs.everTable.setCurrentRow(row)
      })
    },
    list (isUpdate) {
      this.loading = true
      // 库房配置信息读取未添加字段
      const params = { processId: this.processId, storageRoomId: this.storageId, pagesize: this.pagesize, offset: this.offset }
      // 列表查询查询患者维度任务列表, 拼接containObj、queryObj、customParams参数
      dispenseApi[this.name](Object.assign({}, params, this.customParams, this.queryObj)).then(res => {
        if (!res) return
        if (!res.length && (this.queryObj.localMaterialId || this.queryObj.sourceCode || this.queryObj.patientId)) return this.$messageTips(this, 'warning', '没有找到匹配的结果，请重新核对后重新搜索。')
        this.tableData = res
        this.totalCount = res.totalCount
        // 用于单选表格，设定某一行为选中行
        if (this.tableData.length) {
          this.$nextTick(_ => {
            let index = 0
            if (isUpdate && this.activeId) {
              index = this.tableData.findIndex(data => data.visitSn === this.activeId)
            }
            const row = this.tableData[index >= 0 ? index : 0]
            this.handlerRowClickSet(row)
          })
        } else {
          this.$emit('row-click')
        }
      }).finally(_ => {
        this.loading = false
      })
    },
    handlerRowClick ({ row, column }) {
      // const index = this.tableData.findIndex(item => item.visitSn === row.visitSn || row.hospitalizedNumber === item.hospitalizedNumber)
      row.mqMsg = 0
      // if (this.activeId === visitNumber) return
      this.activeId = row.visitNumber || row.hospitalizedNumber
      this.handlerRowClickSet(row)
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
.line32 {
  line-height: 32px;
}
</style>
