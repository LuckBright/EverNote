<template>
  <div class="bg">
    <el-row class="pd">
      <el-col :span="20">
        <ever-form2 :schema="querySchema" v-model="queryObj" :inline="true" :is-query="true" @query="list(true)">
          <template slot="type">
            <ever-range-picker :start.sync="queryObj.startTime" :end.sync="queryObj.endTime"></ever-range-picker>
          </template>
        </ever-form2>
      </el-col>
      <el-col :span="4" align="right">
        <el-button @click="showReport">上传报告</el-button>
      </el-col>
    </el-row>
    <el-row class="pd">
      <el-col :span="24">
        <el-table
          :data="tableData"
          border
          class="el-td-border"
          highlight-current-row>
          <el-table-column
            label="类型"
            width="120">
            <template slot-scope="scope">
              <span>{{handleTypeName(scope.row.type)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            width="300">
          </el-table-column>
          <el-table-column
            prop="executor"
            label="执行人"
            width="120">
          </el-table-column>
          <el-table-column
            label="创建时间"
            width="180">
            <template slot-scope="scope">
              {{ scope.row.createTime | formatDateByExp('YYYY-MM-DD') }}
            </template>
          </el-table-column>
          <el-table-column
            label="完成时间"
            width="180">
            <template slot-scope="scope">
              {{scope.row.finishTime | formatDateByExp}}
            </template>
          </el-table-column>
          <el-table-column
            prop="reportOpinion"
            label="报告意见"
            width="120">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button v-for="(url, index) of scope.row.reportFile.split(',')" :key="index" size="small" type="primary">
                <a class="btna" :href="$ever.fileUrl2 + url" target="_blank">查看</a>
              </el-button>
              <el-button size="small" type="danger" @click="deleteReprot(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
        >
        </ever-pagination>
      </el-col>
    </el-row>
    <member-report :visible="reportPop" @update="updateReport"></member-report>
  </div>
</template>
<script>
import api from '../store/recordapi'
import utillist from '../../util/list'
import memberReport from '../components/memberreport'
import { SERVICE_TYPE } from '@/util/common'
import { _findIndex } from '@/util/formcustom'

let querySchema = [
  {
    name: 'type',
    comp: 'custom',
    label: '创建时间',
    span: 3
  }
]
export default {
  props: ['visiable'],
  mixins: [utillist],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.type = []
    queryObj.startTime = ''
    queryObj.endTime = ''
    queryObj.patientId = this.$route.params.patientId
    return {
      api,
      listApiName: 'getByCreateTime',
      querySchema,
      queryObj,
      reportPop: false,
      tableData: []
    }
  },
  watch: {
    'visiable': {
      handler: function (val) {
        if (val === 'second') {
          this.list(true)
        }
      },
      immediate: true
    }
  },
  methods: {
    handleTypeName (type) { // 处理类型name
      if (type) {
        let index = _findIndex(SERVICE_TYPE, type + '')
        return index > -1 ? SERVICE_TYPE[index].name : '--'
      }
      return '--'
    },
    showReport () {
      this.reportPop = true
    },
    closeReportPop () {
      this.reportPop = false
    },
    updateReport (val) {
      this.reportPop = val
    },
    deleteReprot (id) {
      this.$confirm('是否删除此条报告?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.api.deletes({ 'id': id }).then(rs => {
          if (rs) {
            this.list(true)
          }
        })
      })
    }
  },
  components: {
    memberReport
  }
}
</script>
<style scoped>
.btna {
  color: #1c78ef;
  text-decoration-style: none;
}
.btna:hover {
  color: #ffffff;
}
</style>
