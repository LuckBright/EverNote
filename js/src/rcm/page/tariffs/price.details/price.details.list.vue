<template>
  <div class="priceEngine">
    <ever-bread-crumb v-if="!noHead" name="调价历史"></ever-bread-crumb>
    <div class="layout_inner oa">
      <div class="main-head">
        <ever-form2 :schema="schema" v-model="queryObj" :inline="true" :isQuery="true">
          <template slot="default">
            <el-form-item>
              <el-button type="" @click="query(true)">查询</el-button>
            </el-form-item>
          </template>
        </ever-form2>
      </div>
      <el-table
        border
        v-loading.body="loading"
        :data="tableData">
        <el-table-column
          prop="createTime"
          :formatter="formatDate"
          label="提交时间">
          <!-- <template slot-scope="scope">
            {{scope.row.createTime | time}}
          </template> -->
        </el-table-column>
        <el-table-column
          prop="desc"
          label="调价说明">
        </el-table-column>
        <el-table-column
          prop="modifyExeTime"
          :formatter="formatDate"
          label="发布时间">
        </el-table-column>
        <el-table-column
          prop="creatorName"
          label="提交人">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <template slot-scope="scope">
            {{scope.row.statusName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="executionDatetime"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="checkDetails(scope.row)">详情</el-button>
            <template v-if="scope.row.processInstanceId">
              <el-button v-if="scope.row.status === -1" @click="check(scope.row.processInstanceId)">审批流</el-button>
              <el-button v-if="scope.row.status === 0" @click="reverse(scope.row.batchNo)">撤回</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current">
        </ever-pagination>
      </el-row>
    </div>
  </div>
</template>
<script>
import list from '@/util/list'
import api from '@/rcm/store/tariffs/modify.price.api'
import storage from '@/util/storage'
import { REMOTE_METHODS_WIDTH } from '@/warehouse/views/util/constant.js'
// import appi from '@/inpatient/components/issued.orders/api.js'
const schema = [
  {
    name: 'date',
    comp: 'elDatePicker',
    props: {
      type: 'daterange',
      valueFormat: 'yyyy-MM-dd',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期'
    }
  },
  {
    name: 'status',
    comp: 'el-select',
    props: {
      placeholder: '状态',
      options: []
    }
  }
]

const materialSchema = {
  name: 'material',
  label: '物资名称',
  comp: 'material-select',
  props: {
    needObjFlag: true,
    params: { ifService: [2, 3] },
  },
  style: REMOTE_METHODS_WIDTH,
}

export default {
  mixins: [list, storage],
  data () {
    let schema = this.concatSchema().schema
    let obj = this.concatSchema().obj
    return {
      schema: schema,
      queryObj: obj,
      api,
      isTenant: true,
      noHead: false,
      loading: false,
      isApproval: false
    }
  },
  created () {
    this.noHead = this.$route.meta.noHead
    this.isTenant = this.$route.meta.isTenant
    this.getOptions()
    // this.getIsApproval()
  },
  computed: {
    isBatch () {
      return this.$route.query && this.$route.query.isBatch
    }
  },
  methods: {
    concatSchema () {
      let newSchema = JSON.parse(JSON.stringify(schema))
      const concatSchema = this.isBatch ? [materialSchema, ...newSchema] : newSchema
      return {
        schema: concatSchema,
        obj: this.$ever.createObjFromSchema(concatSchema)
      }
    },
    getOptions () {
      api.getStatus().then(rs => {
        if (!rs.head.errCode) {
          let arr = rs.data.map(item => { return { value: String(item.type), label: item.name } })
          this.$ever.getFieldFromSchema(this.schema, 'status').props.options = arr
        }
      })
    },
    formatDate (row, column) {
      const value = row[column.property]
      if (value) {
        return this.$moment(value).format('YYYY-MM-DD HH:mm:ss')
      }
      return ''
    },
    // getIsApproval () {
    //   appi.searchCheckConfig({ code: 'PROCESS_ENGINE_ADJUST_PRICE', 'defaultValue': '1' }).then(rs => {
    //     if (rs && rs.value === '1') {
    //       this.isApproval = true
    //     }
    //   })
    // },
    check (id) {
      window.open(`${this.$ever.systemsetIndex}/approval/${id}`)
    },
    reverse (id) {
      this.$confirm('您确定要撤回审批吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        api.reverse({ batchNo: id }).then(rs => {
          if (!rs.head.errCode) {
            this.$messageTips(this, 'success', '撤回成功')
            this.list()
          }
          this.loading = false
        }).catch(rj => {
          this.loading = false
        })
      })
    },
    query () {
      this.handleCurrentChange(1)
    },
    list () {
      let params = {
        current: this.current,
        size: this.pagesize,
        source: this.isTenant ? 'tenant' : 'org'
      }
      if (this.isBatch) {
        params.batchFlag = Number(Boolean(this.isBatch))
      }
      if (this.queryObj.status) {
        params.status = Number(this.queryObj.status)
      }
      if (this.queryObj.material) {
        params.itemId = this.queryObj.material.serviceId
      }
      if (this.queryObj.date && this.queryObj.date[0]) {
        params.start = this.queryObj.date[0] + ' 00:00:00'
        params.end = this.queryObj.date[1] + ' 23:59:59'
      }
      this.loading = true
      api.historyList(params).then(result => {
        if (!result.head.errCode) {
          this.tableData = result.data && result.data.records
          this.totalCount = result.data.total
          this.loading = false
        }
      }).catch
    },
    checkDetails ({ batchNo, processInstanceId, modifyOrgId }) {
      let query = {
        isTenant: this.isTenant,
        id: batchNo,
        processInstanceId
      }
      if (!this.isTenant) { // 如果是机构下查询集团调价的机构数据，详情接口返回的是集团id，需要传机构id
        query['modifyOrgId'] = modifyOrgId
      }
      if (this.isBatch) {
        query['isBatch'] = true
      }
      this.$router.push({
        path: '/' + this.$route.meta.pathVal + '/pricedetails',
        query: query
      })
    }
  },
  filters: {
    time (val) {
      return val ? val.replace('T', ' ') : ''
    }
  }
}
</script>

