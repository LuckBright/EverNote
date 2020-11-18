<template>
  <div id="consultlist" class="layout_inner">
    <el-card>
      <el-row>
        <el-col :span="20" align="right">
          <el-button type="primary" @click="addConsult">开证明</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-table v-if="visible" :data="tableData" :stripe="false">
            <el-table-column label="证明ID" align="center" width="120">
              <template slot-scope="scope">{{scope.row.dptName || '--'}}</template>
            </el-table-column>
            <el-table-column prop="sn" label="证明名称" width="120" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip label="创建时间" prop="content" min-width="240"></el-table-column>
            <el-table-column prop="createTime" label="创建人" align="center" width="180"></el-table-column>
            <el-table-column label="操作" align="center" width="100">
              <template slot-scope="scope">
                <el-button size="small" @click="linkDetailPage(scope.row.id)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount"
            :current="current"
          ></ever-pagination>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import api from '../store/consultapi'
import depart from '../../warehouse/store/departmentapi'
import utillist from '../../util/list'
let querySchema = [
  {
    name: 'dptId',
    type: 'select',
    label: '咨询部门',
    clearable: false,
    placeholder: '选择部门',
    options: [{ name: '全部部门', id: -1 }],
    span: 3
  },
  {
    name: 'way',
    type: 'systype',
    label: '咨询方式',
    code: 'THC_CC_FOLLOWUP',
    clearable: false,
    useValue: true,
    span: 3
  },
  {
    name: 'source',
    type: 'systype',
    code: 'THC_CONSULT_RESOURCE',
    label: '来源',
    clearable: false,
    useValue: true,
    span: 3
  }
]
export default {
  mixins: [utillist],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.origId = 1
    queryObj.type = 0
    queryObj.patientId = this.$route.params.patientId
    return {
      api: api,
      depart: depart,
      querySchema: querySchema,
      visible: true,
      queryObj: queryObj,
      selected: []
    }
  },
  created () {
    this.getDptList(querySchema, 'dptId')
  },
  methods: {
    getDptList (schema, name) {
      let dpt = this.$ever.getFieldFromSchema(schema, name)
      this.depart.list().then(rs => {
        dpt.options = rs
      })
    },
    linkDetailPage (id) {
      this.$router.push({ name: 'viewconsult', path: 'viewconsult', query: { id: id } })
    },
    addConsult () {
      this.$router.push({ name: 'createconsult', path: 'createconsult' })
    }
  }
}
</script>
<style scoped>
#consultlist .title .el-col {
  height: 36px;
  line-height: 36px;
}
#consultlist .title .el-col strong {
  font-size: 18px;
}
#consultlist .title .el-col span {
  font-size: 12px;
}
#consultlist .tab {
  vertical-align: top;
}
#consultlist .tab .el-button {
  margin: 0;
  border-radius: 0;
  width: 25%;
}
</style>
