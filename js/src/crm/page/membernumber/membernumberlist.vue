<template>
  <div class="layout_inner">
    <div class="main-head">
      <el-row>
        <el-col>
          <ever-form2
            :schema="querySchema"
            v-model="queryObj"
            @query="list(true)"
            :inline="true"
            :is-query="true"
          >
            <template slot="tenantId">
              <ever-org-select v-model="queryObj.tenantId" v-if="queryObj.isGlobal == 3" type="select" :isOrg="false" fields="code"></ever-org-select>
              <ever-select v-model="queryObj.tenantId" v-else :options="tenantArr"></ever-select>
            </template>
            <template slot="default">
              <el-form-item>
                <el-button type="primary" @click="list(true)">查询</el-button>
              </el-form-item>
              <el-form-item class="fr">
                <el-button type="primary" @click="add">添加</el-button>
              </el-form-item>
            </template>
          </ever-form2>
        </el-col>
      </el-row>
    </div>
    <el-table class="ever-table-wrap" v-loading.body="loading" :data="tableData" :border="false">
      <el-table-column show-overflow-tooltip label="编号名称">
        <template slot-scope="scope">
          <sys-value type="THC_SYS_RULE_CONFIG" :code="scope.row.codeName"></sys-value>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="类型">
        <template slot-scope="scope">
          <sys-value type="THC_PATIENT_NO_TYPE" :code="scope.row.isGlobal"></sys-value>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="归属">
        <template slot-scope="scope">
          <!-- <span v-if="scope.row.isGlobal == 2">{{$store.state.currentUser.organizationName}}</span> -->
          <span>{{scope.row.orgName}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="illustrate" label="编号说明"></el-table-column>
      <el-table-column show-overflow-tooltip prop="updateTime" label="修改时间"></el-table-column>
      <el-table-column show-overflow-tooltip prop="updator" label="修改人"></el-table-column>
      <el-table-column prop label="操作" align="left" width="160">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="linkedit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteId(scope.row)" v-if="scope.row.isGlobal === '3'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="end">
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </el-row>
  </div>
</template>
<script>
import list from '@/util/list'
import api from '@/crm/store/numberapi'

export default {
  data () {
    let querySchema = [
      {
        name: 'codeName',
        label: '编号名称',
        comp: 'sys-type',
        props: {
          code: 'THC_SYS_RULE_CONFIG',
          useValue: true,
          clearable: true
        }
      },
      {
        name: 'isGlobal',
        label: '类型',
        comp: 'sys-type',
        props: {
          code: 'THC_PATIENT_NO_TYPE',
          useValue: true,
          clearable: true
        }
      },
      {
        name: 'tenantId',
        label: '归属',
        comp: 'custom'
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      querySchema,
      queryObj,
      pageType: this.$route.params.type,
      tenantArr: []
    }
  },
  mixins: [list],
  created () { },
  watch: {
    'queryObj.isGlobal': {
      handler (val) {
        this.tenantArr = []
        this.queryObj.tenantId = ''
        if (val === '2') this.getBlocInfo()
      }
    }
  },
  methods: {
    getBlocInfo () {
      let tenantId = this.$store.state.currentUser.tenantId
      let name = this.$store.state.currentUser.organizationName
      let tempArr = []
      let obj = {}
      obj['id'] = tenantId
      obj['name'] = name
      tempArr.push(obj)
      this.tenantArr = tempArr
    },
    updateList () {
      this.list()
    },
    linkedit (obj) {
      this.$router.push({ name: 'membernumberedit', query: { 'numberId': obj.id } })
    },
    add () {
      this.$router.push({ name: 'membernumberedit' })
    },
    deleteId (obj) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.deleteId({ 'id': obj.id }).then(rs => {
          if (rs.head.errCode === 0) {
            this.$messageTips(this, 'success', '删除成功')
            this.list()
          }
        })
      })
    }
  }
}
</script>
