<template>
  <div id="consultlist">
    <el-card>
      <el-row>
        <el-col :span="24" align="right">
          <el-button type="primary" @click="addConsult">添加咨询</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table v-if="visible" :data="tableData" border>
            <el-table-column label="咨询ID" align="center" width="120">
              <template slot-scope="scope">{{scope.row.sn || '--'}}</template>
            </el-table-column>
            <el-table-column prop="dptName" label="咨询部门" width="120" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip label="为谁咨询" min-width="120">
              <template slot-scope="scope">
                <sys-value type="THC_CONSULT_CONFOR" :code="scope.row.forWhom"></sys-value>
              </template>
            </el-table-column>
            <el-table-column label="咨询内容" align="center" min-width="240">
              <template slot-scope="scope">{{scope.row.content}}</template>
            </el-table-column>
            <el-table-column label="来源" align="center" width="120">
              <template slot-scope="scope">
                <sys-value type="THC_CONSULT_RESOURCE" :code="scope.row.source"></sys-value>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="咨询时间" align="center" width="180"></el-table-column>
            <el-table-column label="通过时长" width="160" align="center">
              <template
                slot-scope="scope"
              >{{scope.row.callRecord ? scope.row.callRecord.duration + '秒' : '无'}}</template>
            </el-table-column>
            <el-table-column label="录音地址" align="center" min-width="120">
              <template slot-scope="scope">
                <a
                  v-if="scope.row.callRecord"
                  :href="scope.row.callRecord.url"
                  class="col-blue"
                  target="_blank"
                >有录音</a>
                <span v-else>无录音</span>
              </template>
            </el-table-column>
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
  },
  methods: {
    linkDetailPage (id) {
      window.location.href = this.$ever.crmIndex + '/crm/viewconsult?id=' + id
    },
    addConsult () {
      window.location.href = this.$ever.crmIndex + '/crm/createconsult'
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
