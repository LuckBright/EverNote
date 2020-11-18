<template>
  <el-dialog
    title="票据打印模版"
    :visible.sync="v"
    width="70%"
    class="stock-dialog"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <ever-form2
      ref="form"
      :schema="schema"
      v-model="queryObj"
      :inline="true"
      :isQuery="true"
    >
      <template slot="default">
        <el-form-item>
          <el-button size="small" type="primary" @click="query">查询</el-button>
          <el-button size="small" @click="resetForm">重置</el-button>
        </el-form-item>
      </template>
    </ever-form2>
    <el-table :data="tableData" @row-click="businessChanged" height="400px" v-loading="loading">
      <el-table-column label="选择">
        <template slot-scope="scope">
          <el-radio :disabled="scope.row.disabled" v-model="scope.row.isRelated" :label="true">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="业务名称"></el-table-column>
      <el-table-column prop="used" label="是否被关联">
        <template slot-scope="scope">
          {{scope.row.used ? '已关联': '未关联'}}
        </template>
      </el-table-column>
      <el-table-column prop="code" label="code"></el-table-column>
      <el-table-column prop="ver" label="版本"></el-table-column>
      <el-table-column prop="orgId" label="机构"></el-table-column>
      <el-table-column prop="lang" label="语言"></el-table-column>
    </el-table>
    <div style="margin-top: 20px;">
      <ever-pagination
        :current="current"
        :page-sizes="pageSizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
      ></ever-pagination>
    </div>
    <div slot="footer">
      <el-button size="small" @click="empty">重置</el-button>
      <el-button type="primary" size="small" @click="handleSure">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/rcm/store/bill.manage/bill.stock.api'
import list from '@/util/list'
let schema = [
  {
    name: 'name',
    label: '模版名称'
  },
  {
    name: 'code',
    label: '模版code'
  }
]
export default {
  mixins: [list],
  props: ['visible', 'selectItem', 'index'],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      api,
      schema,
      queryObj,
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
        this.selectItem[this.index]['templateId'] = this.businessRow.id
        this.selectItem[this.index]['templateCode'] = this.businessRow.code
        this.selectItem[this.index]['templateName'] = this.businessRow.name
        this.selectItem[this.index]['templateLang'] = this.businessRow.lang
        this.selectItem[this.index]['templateVer'] = this.businessRow.ver
        this.selectItem[this.index]['templateOrgId'] = this.businessRow.orgId
      } else {
        this.selectItem[this.index]['templateId'] = ''
        this.selectItem[this.index]['templateCode'] = ''
        this.selectItem[this.index]['templateName'] = ''
        this.selectItem[this.index]['templateLang'] = ''
        this.selectItem[this.index]['templateVer'] = ''
        this.selectItem[this.index]['templateOrgId'] = ''
      }
      this.v = false
    },
    resetForm () {
      this.queryObj.name = ''
      this.queryObj.code = ''
    },
    query () {
      this.handleCurrentChange(1)
    },
    list () {
      console.log(this.queryObj)
      this.tableData = []
      this.loading = true
      let params = {
        offset: this.offset,
        pagesize: this.pagesize
      }
      if (this.queryObj.name) {
        params['name'] = this.queryObj.name
      }
      if (this.queryObj.code) {
        params['code'] = this.queryObj.code
      }
      api.getTemplatePage(params).then(rs => {
        if (rs.head && rs.head.errCode === 0) {
          this.initData(rs.data.templates)
          this.totalCount = rs.data.count
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
          if (lab.templateCode === item.code && lab.templateVer === item.ver) {
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
