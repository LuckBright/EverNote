<template>
  <div>
    <ever-form2
      :schema="querySchema"
      v-model="queryObj"
      :inline="true"
      :is-query="true"
      v-ever-bind-enter
      @query="list(true)"
    >
      <template slot="type">
        <ever-range-picker :start.sync="queryObj.startTime" :end.sync="queryObj.endTime"></ever-range-picker>
      </template>
    </ever-form2>
    <el-table :data="tableData" border class="el-td-border" highlight-current-row>
      <el-table-column label="类型" align="center" width="120">
        <template
        slot-scope="scope"
        >{{ scope.row.adviceType | formateValueToFnt({ list:SERVICE_TYPE, defaultFnt: '未知类型'}) }}</template>
      </el-table-column>
      <el-table-column prop="adviceName" label="名称" align="center" width="140"></el-table-column>
      <el-table-column prop="price" label="价格" align="center" width="120"></el-table-column>

      <el-table-column align="center" label="创建时间" min-width="120">
        <template slot-scope="scope">{{ scope.row.createTime | formatDateByExp('YYYY-MM-DD') }}</template>
      </el-table-column>
      <el-table-column align="center" label="完成时间" min-width="120">
        <template slot-scope="scope">{{ scope.row.updateTime | formatDateByExp('YYYY-MM-DD') }}</template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.status | formateValueToFnt({ list:REPORT_STATUS, defaultFnt: '--'}) }}</template>
      </el-table-column>
      <el-table-column prop label="客户端可见" align="center" width="160">
        <template slot-scope="scope">
          <el-radio-group
            v-model="scope.row.isClient"
            @change="changeAppShowType(scope.row.id, scope.row.isClient)"
          >
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" props="comment" min-width="120"></el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <el-button
            @click="showReport(scope.row)"
            size="small"
            v-if="scope.row.adviceType === '801'"
          >查看</el-button>
          <el-button size="small" v-if="scope.row.adviceType === '800'">
            <a :href="scope.row.adviceHref" target="_blank" style="color:inherit">查看报告</a>
          </el-button>
          <el-button size="small" v-if="scope.row.adviceType === '800'">
            <a :href="scope.row.imageUrl" target="_blank" style="color:inherit">查看影像</a>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="current"
    ></ever-pagination>
    <dialog-exam-detail
      :examTableDetail="examTable"
      :title="'查看检验报告'"
      :visible.sync="dialogVisible"
      :append-to-body="false"
      @close="closeReport"
      @update="updateReport"
    ></dialog-exam-detail>
  </div>
</template>
<script>
import api from '../store/recordapi'
import list from '../../util/list'
import { SERVICE_TYPE, REPORT_STATUS } from '@/util/common'
import dialogExamDetail from '@/patientinfo/page/phrinfo/dialog-exam-detail'

let querySchema = [
  {
    name: 'type',
    comp: 'custom',
    label: '创建时间',
    span: 3
  },
  {
    name: 'status',
    comp: 'ever-select',
    props: {
      options: [
        { id: 8, name: '报告已出' },
        { id: 9, name: '报告未出' }
      ]
    },
    label: '状态',
    span: 3
  }
]
export default {
  props: ['visiable'],
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.type = []
    queryObj.startTime = ''
    queryObj.endTime = ''
    queryObj.pagesize = '10'
    return {
      api,
      querySchema: querySchema,
      queryObj: queryObj,
      tableData: [],
      patientId: this.$route.params.patientId ? this.$route.params.patientId : null,
      examTable: [],
      SERVICE_TYPE,
      REPORT_STATUS,
      dialogVisible: false
    }
  },
  watch: {
    'visiable': {
      handler: function (val) {
        if (val === 'first') {
          this.list()
        }
      },
      immediate: true
    }
  },
  methods: {
    changeMessageType (id, val) {
      let params = {
        id: id,
        isSms: val
      }
      api.changeSendMessageFlag(params).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '更新成功', '提示')
          this.list(true)
        }
      })
    },
    changeAppShowType (id, val) {
      let params = {
        id: id,
        isClient: val
      }
      api.changeAppShowFlag(params).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '更新成功', '提示')
          this.list()
        }
      })
    },
    list (refresh) {
      if (refresh) {
        this.offset = 0
      }
      this.queryObj.patientId = this.patientId
      // this.queryObj.patientId = 'tdhzBuZvkjks7TMGykV'    // dev下这个参数有数据
      let params = Object.assign({}, this.queryObj)
      params.page = this.current // 兼容需要page作为分页参数的接口
      params.offset = this.offset
      params.pagesize = this.pagesize
      api.getInspectPage(params).then(rs => {
        if (rs.list && rs.list.length > 0) {
          this.tableData = rs.list
          this.totalCount = rs.list.length
        } else {
          this.tableData = []
          this.totalCount = 0
        }

        this.tableData.filter(item => {
          if (item.isSms === null || item.isSms === false) {
            item.isSms = 0
          } else {
            item.isSms = 1
          }
          if (item.isClient === null || item.isClient === false) {
            item.isClient = 0
          } else {
            item.isClient = 1
          }
          if (item.executeResultList && item.executeResultList.length && item.executeResultList[0].attachmentUrl) {
            item.adviceHref = item.executeResultList[0].attachmentUrl
          } else {
            item.adviceHref = 'javascript:;'
          }
          if (item.executeResultList && item.executeResultList.length && item.executeResultList[0].imageUrl) {
            item.imageUrl = item.executeResultList[0].imageUrl
          } else {
            item.imageUrl = 'javascript:;'
          }
          return item
        })
      })
    },
    linkDetailPage (val) {
      window.location.href = val.reportFile
    },
    showReport (data) {
      if (!data.executeResultItemList || !Array.isArray(data.executeResultItemList)) {
        data.executeResultItemList = [{}]
      } else if (data.executeResultItemList.length) {
        this.dialogVisible = true
        this.examTable = data.executeResultItemList.filter((item) => {
          item.adviceName = item.inspectUnitName ? item.inspectUnitName : ''
          return item
        })
      }
    },
    closeReport () {
      this.dialogVisible = false
    },
    updateReport (val) {
      this.dialogVisible = val
    }
  },
  components: {
    dialogExamDetail
  }
}
</script>
