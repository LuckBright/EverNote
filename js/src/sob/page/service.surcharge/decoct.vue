<template>
  <div class="layout_inner" :class="className">
    <el-row lass="main-head">
      <el-col :span="22">
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          ref="form"
          :inline="true"
          :is-query="true"
          @query="list()"
        ></ever-form2>
      </el-col>
      <el-col :span="2" class="main-option" align="right">
        <el-button type="primary" @click="importDecoct">导入</el-button>
      </el-col>
    </el-row>
    <el-table class="ever-table-wrap" v-loading.body="loading" :data="tableData" style="width: 100%" :border="false">
      <el-table-column width="200" prop="decoctName" label="煎法">
        <template slot-scope="scope">
          <sys-value type="THC_SYS_DECOCTION_OF_TCM" :code="scope.row.code"></sys-value>
        </template>
      </el-table-column>
      <el-table-column prop="serviceName" label="收费项目">
      </el-table-column>
      <el-table-column prop label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="edit(scope.row)"
          >编辑</el-button>
          <ever-confirm :msg="'确定删除该项？'" action="删除" @confirm="del(scope.row.id, scope.row)"></ever-confirm>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
        :pagesize="pagesize"
      ></ever-pagination>
    </el-row>
    <import-decoct-dialog ref="importDecoctDialog" title="导入用法" @update="list()"></import-decoct-dialog>
    <edit-decoct ref="editDecoct" @update="list"></edit-decoct>
  </div>
</template>
<script>
import importDecoctDialog from './import.decoct.dialog.vue'
import api from '@/sob/store/surcharge'
import editDecoct from './edit.decoct.vue'

export default {
  components: { importDecoctDialog, editDecoct },
  props: {
    className: String
  },
  data () {
    let schema = [
      {
        name: 'decoct',
        label: '煎法',
        comp: 'sys-type',
        props: {
          code: 'THC_SYS_DECOCTION_OF_TCM',
          clearable: true
        },
        delLoading: false
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(schema)
    this.querySchema = schema
    return {
      queryObj,
      loading: false,
      tableData: [],
      totalCount: 0,
      current: 1,
      pagesize: 20,
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      let query = this.$route.query
      if (!query.pagesize || !query.page) {
        this.$router.push({
          query: Object.assign({}, this.$route.query, {page: 1, pagesize: 20})
        })
      } else {
        this.$router.push({
          query: query
        })
      }
      this.current = +this.$route.query.page
      this.pagesize = +this.$route.query.pagesize
      this.list()
    },
    async list () {
      let query = this.$route.query
      let params = {
        offset: (query.page - 1) * query.pagesize,
        pagesize: query.pagesize || 20
      }
      if (this.queryObj.decoct) {
        params.code = this.queryObj.decoct
      }
      let res = await api.getDecoctsList(params)
      this.tableData = res.data
      this.totalCount = res.totalCount
    },
    importDecoct () {
      this.$refs.importDecoctDialog.open()
    },
    del (id) {
      if (this.delLoading) return
      this.delLoading = true
      api.deleteDecocts({id}).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '删除成功')
          this.list()
        }
        window.setTimeout(() => {
          this.delLoading = false
        }, 500)
      }).catch(() => {
        window.setTimeout(() => {
          this.delLoading = false
        }, 500)
      })
    },
    edit (row) {
      this.$refs.editDecoct.open(row)
    },
    handleSizeChange (size) {
      this.$router.push({
        query: Object.assign({}, this.$route.query, {pagesize: size})
      })
      this.list()
    },
    handleCurrentChange (page) {
      this.$router.push({
        query: Object.assign({}, this.$route.query, {page})
      })
      this.current = page
      this.list()
    }
  }
}
</script>
