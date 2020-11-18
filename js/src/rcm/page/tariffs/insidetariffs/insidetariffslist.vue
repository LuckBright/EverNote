<template>
  <div>
    <div class="layout_inner">
      <div class="main-head">
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
        <div class="main-option">
          <el-button
            type="primary"
            @click="$router.push('/financeistall/insidetariffsadd')"
          >新建</el-button>
        </div>
      </div>
      <el-table v-loading.body="loading" :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="priceTableName" label="价目表名称"></el-table-column>
        <el-table-column prop="baseType" label="价目表类型">
          <template slot-scope="scope">
            {{scope.row.baseType == 1 ? '跨机构发药': '跨机构调拨'}}
          </template>
        </el-table-column>
        <el-table-column prop="validDateStart" label="有效期自"></el-table-column>
        <el-table-column prop="validDateEnd" label="有效期至"></el-table-column>
        <!-- <el-table-column prop="valid_date_end" label="导入状态">
          <template slot-scope="scope">
            <div v-if="scope.row.dst">
              {{scope.row.dst.status === '4.2'?'完成': Number(scope.row.dst.status) < 0 ? '失败': '导入中'}}
            </div>
            <div v-else>完成</div>
          </template>
        </el-table-column> -->
        <el-table-column prop label="操作" width="260">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
            <el-button type="primary" size="small" @click="jump(scope.row)">维护</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import api from '@/rcm/store/tariffs/insidetariffsapi'
import list from '@/util/list'

let schema = [
  {
    name: 'priceTableName',
    label: '价目表名称'
  }
]
export default {
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      querySchema: schema,
      queryObj: obj,
      api,
      tiem: null,
      ids: []
    }
  },
  async created () {
  },
  methods: {
    jump (row) {
      let url = '/financeistall/insidetariffsedit/'
      this.$router.push({ path: url + row.id })
    },
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return this.api.del({ id: row.id })
      }).then(() => {
        this.$messageTips(this, 'success', '删除成功！', '提示')
        this.list()
      }).catch((e) => {
        return false
      })
    },
    list () {
      let params = {
        offset: this.offset,
        pagesize: this.pagesize
      }
      if (this.queryObj.priceTableName) {
        params.priceTableName = this.queryObj.priceTableName
      }
      api.list(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = rs.data
          this.totalCount = rs.totalCount
          this.getDataTypes()
        }
      })
    },
    initDataStatus (data) {
      data.forEach(item => {
        if (item.status === '4.2' || Number(item.status) < 0) {
          if (this.ids.indexOf(item.priceTableId) > -1) {
            this.ids.splice(this.ids.indexOf(item.priceTableId), 1)
            this.tableData.forEach(lab => {
              if (lab.id === item.priceTableId) {
                lab.dst.status = item.status
              }
            })
          }
        }
      })
    },
    getDataTypes () {
      this.ids = []
      this.tableData.forEach(item => {
        if (item.dst && item.dst.status !== '4.2' && Number(item.dst.status) > 0) {
          this.ids.push(item.id)
        }
      })
      if (this.ids.length > 0) {
        this.time = window.setInterval(_ => {
          api.getListByPriceTableIds({ priceTableIds: this.ids.join(',') }).then(rs => {
            if (rs.head.errCode === 0) {
              this.initDataStatus(rs.data)
              console.log(this.ids, 11111)
              if (this.ids.length === 0) {
                window.clearInterval(this.time)
                this.time = null
              }
            }
          })
        }, 2000)
      }
    }
  },
  beforeDestroy () {
    window.clearInterval(this.time)
    this.time = null
  }
}
</script>
