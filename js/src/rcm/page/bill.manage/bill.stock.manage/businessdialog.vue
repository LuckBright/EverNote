<template>
  <el-dialog
    title="票据业务选择"
    :visible.sync="v"
    width="70%"
    class="stock-dialog"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-table :data="tableData" @row-click="businessChanged" v-loading="loading">
      <el-table-column label="选择">
        <template slot-scope="scope">
          <el-radio :disabled="scope.row.disabled" v-model="scope.row.isRelated" :label="true">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="业务ID"></el-table-column>
      <el-table-column prop="name" label="业务名称"></el-table-column>
      <el-table-column prop="used" label="是否被关联">
        <template slot-scope="scope">
          {{scope.row.used ? '已关联': '未关联'}}
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button size="small" @click="empty">重置</el-button>
      <el-button type="primary" size="small" @click="handleSure">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/rcm/store/bill.manage/bill.stock.api'
export default {
  props: ['visible', 'selectItem', 'index'],
  data () {
    return {
      api,
      tableData: [],
      loading: false,
      businessRow: null
    }
  },
  computed: {
    v: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    },
  },
  methods: {
    handleClose (done) {
      done()
    },
    handleSure () {
      if (this.businessRow) {
        this.selectItem[this.index]['businessId'] = this.businessRow.id
        this.selectItem[this.index]['businessName'] = this.businessRow.name
      } else {
        this.selectItem[this.index]['businessId'] = ''
        this.selectItem[this.index]['businessName'] = ''
      }
      this.v = false
    },
    list () {
      this.tableData = []
      this.loading = true
      api.getBusinessList().then(rs => {
        if (rs.head.errCode === 0) {
          this.initData(rs.data)
        }
      })
    },
    initData (data) {
      data.map(item => {
        if (item.used) {
          item.disabled = true
        }
        item.isRelated = false
        this.selectItem.forEach((lab, index) => {
          if (lab.businessId === item.id) {
            if (index === this.index) {
              item.isRelated = true
              item.disabled = false
            } else {
              item.isRelated = false
              item.disabled = true
            }
          }
        })
      })
      this.loading = false
      this.tableData = data
    },
    businessChanged (row) {
      if (row.disabled) {
        return
      }
      this.tableData.forEach(item => {
        item.isRelated = false
      })
      row.isRelated = true
      this.businessRow = row
    },
    empty () {
      this.tableData.forEach(item => {
        item.isRelated = false
      })
      this.businessRow = null
    }
  },
  watch: {
    'visible': {
      handler: function (val) {
        if (val) {
          this.list()
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
  .stock-dialog /deep/ .el-dialog{
    .el-dialog__footer {
      border-top: none;
    }
    .el-dialog__body {
      padding: 15px;
    }
  }
</style>
