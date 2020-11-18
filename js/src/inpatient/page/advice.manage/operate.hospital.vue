<template>
	<el-dialog
		:title="title"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    :modal-append-to-body="true"
    :visible.sync="visible"
    v-if="visible"
    @close="close"
	>
    <el-table
      v-if="visible"
      ref="operateTable"
      :data="tableData"
      @selection-change="selectChange"
      style="width: 100%">
      <el-table-column type="selection" :selectable="selectable" width="55"></el-table-column>
      <el-table-column prop="serviceName" label="项目名称" width="200px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="operateAble" label="数量">
        <span slot-scope="scope">{{scope.row.count + scope.row.countUnitName}}</span>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <!-- 退库执行单上没价格，先不展示退库金额 -->
      <el-button type="primary"  @click="operate" :loading="loading">确定</el-button>
    </div>
	</el-dialog>
</template>
<script>

export default {
  props: {
    'ableState': {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      visible: false,
      tableData: [],
      loading: false,
      selectAdvice: [],
      title: '',
      type: ''
    }
  },
  computed: {
    operateMoney () {
      if (!this.selectAdvice.length) {
        return '0.00'
      }
      let money = this.selectAdvice.reduce((total, item) => {
        return total + (item.count * item.price || 2)
      }, 0)
      return money.toFixed(2)
    }
  },
  methods: {
    async show (list, title, method) {
      if (list && list.length) {
        let data = list.map(item => {
          return {
            serviceName: item.serviceName,
            status: item.dispenseStatus,
            id: item.id,
            count: item.count,
            countUnitName: item.adviceJson.countUnitName
          }
        })
        this.title = title
        this.type = method
        this.tableData = data
      }
      this.visible = true
      this.$nextTick(() => {
        this.tableData.forEach(item => {
          +item.status === this.ableState && this.$refs.operateTable.toggleRowSelection(item)
        })
      })
    },
    close () {
      this.tableData = []
      this.visible = false
      this.loading = false
    },
    operate () {
      this.loading = true
      this.$emit('operate', this.selectAdvice, this.type, this.close)
    },
    selectChange (list) {
      this.selectAdvice = list
    },
    selectable (row) {
      if (+row.status === this.ableState) {
        return true
      }
      return false
    }
  }
}
</script>
<style lang="scss" scoped>
  .dialog-footer {
    text-align: right;
  }
  .operate-count {
    width: 80px;
  }
  .operate-money {
    display: inline-block;
    font-size: 14px;
    margin-right: 10px;
    label {
      font-weight: 700;
      font-size: 18px;
      color: red;
    }
  }
</style>
