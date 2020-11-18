<template>
  <div>
    <ever-form2 :schema="schema" v-model="queryObj" :inline="true">
      <template slot="applydate">
        <ever-range-picker
          dateType="datetimerange"
          :start.sync="queryObj.applicationDateStart"
          :end.sync="queryObj.applicationDateEnd"
          start-placeholder="开始日期"
          autoWidth="true"
          :outformat="`YYYY-MM-DD HH:mm:ss`"
          :defaultTime="['00:00:00', '23:59:59']"
        ></ever-range-picker>
      </template>
      <template slot="reportdate">
        <ever-range-picker
          dateType="datetimerange"
          :start.sync="queryObj.reportDateStart"
          :end.sync="queryObj.reportDateEnd"
          :outformat="`YYYY-MM-DD HH:mm:ss`"
          :defaultTime="['00:00:00', '23:59:59']"
          autoWidth="true"
        ></ever-range-picker>
      </template>
      <template slot="type">
        <el-select v-model="queryObj.type" filterable :placeholder="'请选择检查类型'" :clearable="true">
          <el-option v-for="item in typeArr" :key="item.id" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </template>
      <template slot="default">
        <el-button size="small" @click="reset">重置</el-button>
      </template>
    </ever-form2>
    <div>
      <ever-table ref="table" :columns="columns" :data="tableData" border>
        <template slot="doctorAdviceContent">
          <el-table-column label="检查项目" prop="doctorAdviceContent" width="200">
            <template slot-scope="scope">
              <div style="width:180px" v-if="scope.row.doctorAdviceContent != null">
                <a @click="rowClick(scope.row)" v-if="haveData(scope.row)">{{scope.row.doctorAdviceContent}}</a>
                <span v-else>{{scope.row.doctorAdviceContent}}</span>
              </div>
              <div style="width:180px" v-else>
                <span>--</span>
              </div>
            </template>
          </el-table-column>
        </template>
        <template slot="statusName">
          <el-table-column label="状态" prop="statusName">
            <template slot-scope="scope">
              <div style="width:150px" v-if="scope.row.statusName != null">
                <span class="red" v-if="scope.row.status === 1">{{scope.row.statusName}}</span>
                <span v-else>{{scope.row.statusName}}</span>
              </div>
              <div style="width:150px" v-else>
                <span>--</span>
              </div>
            </template>
          </el-table-column>
        </template>
      </ever-table>
      <el-row v-show="count > pagesize">
        <el-col :span="24" align="right">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20, 50, 100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count"
          ></el-pagination>
        </el-col>
      </el-row>
    </div>
    <jiancha-dialog v-model="reportItem"></jiancha-dialog>
  </div>
</template>
<script>
import phrapi from '@/workspace/store/component'
import '@/medrecmanage/assets/table.less'
// import { frPrint } from '@/util/common'
import sysvalue from '@/warehouse/store/sysvalueapi'
import jianchaDialog from '@/components/phr/jianchadialog'
const schema = [
  {
    name: 'applydate',
    label: '申请日期',
    comp: 'custom'
  },
  {
    name: 'reportdate',
    label: '报告日期',
    comp: 'custom'
  },
  {
    name: 'deptId',
    comp: 'ever-subject-select',
    label: '申请科室',
    props: {
      type: 'select',
      fields: 'orgSubjectCode'
    }
  },
  {
    name: 'orgId',
    comp: 'ever-org-select',
    label: '申请机构',
    props: {
      type: 'select',
      fields: 'id'
    }
  },
  {
    name: 'type',
    label: '检查类型',
    comp: 'custom'
  },
  {
    name: 'statusCode',
    label: '检查状态',
    comp: 'select',
    props: {
      options: [
        {
          id: '1',
          name: '已提交'
        },
        {
          id: '2',
          name: '执行中'
        },
        {
          id: '3',
          name: '报告已完成'
        }
      ]
    }
  }
]
export default {
  props: {
    patientId: String
  },
  mounted () {
    this.list()
  },
  async created () {
    const res = await sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE')
    res.forEach(item => {
      if (
        item.parentId === 'THC_WH_OBJECT_SUB_TYPE.800' ||
        item.parentId === '800'
      ) {
        this.typeArr.push(item)
      }
    })
  },
  components: {
    jianchaDialog
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.applicationDateStart = this.$moment()
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss')
    queryObj.applicationDateEnd = this.$moment()
      .endOf('day')
      .format('YYYY-MM-DD HH:mm:ss')
    queryObj.offset = 0
    queryObj.pagesize = 20
    this.copyQuery = JSON.parse(JSON.stringify(queryObj))
    return {
      reportItem: {},
      typeArr: [],
      reportArr: [],
      adviceId: '',
      pagesize: 20,
      dialogVisible: false,
      count: 0,
      currentPage: 1,
      schema,
      queryObj,
      tableData: [],
      columns: [
        {
          prop: 'visitDate',
          label: '就诊时间',
          width: '159'
        },
        {
          prop: 'examineResultCategoryName',
          label: '检查类型'
        },
        {
          prop: 'doctorAdviceContent',
          slotName: 'doctorAdviceContent'
        },
        {
          prop: 'operationPositionName',
          label: '部位'
        },
        {
          prop: 'statusName',
          slotName: 'statusName'
        },
        {
          prop: 'examineApplyTenantSubjectName',
          label: '申请科室'
        },
        {
          prop: 'examineApplyOrgName',
          label: '申请机构'
        },
        {
          prop: 'applicationDate',
          label: '申请时间',
          width: '159'
        },
        {
          prop: 'examineResults',
          label: '报告时间',
          formatter ({ row }) {
            const str =
              row.examineResults &&
              row.examineResults[0] &&
              row.examineResults[0].examineReportDate
            return str
          },
          width: '159'
        }
      ]
    }
  },
  methods: {
    haveData (val) {
      return Array.isArray(val.examineResults) && val.examineResults.length > 0
    },
    openWin (type) {
      if (type === 0) {
        // 影像
        window.open(this.reportItem.imageUrl)
      } else {
        // 预览报告
        const url = JSON.parse(this.reportItem.pdfReportUrl)[0].url
        window.open(url)
      }
    },
    formatContent (res) {
      if (res) {
        return res
      } else {
        return '暂无'
      }
    },
    changeReport (key) {
      this.reportItem = this.reportMap[key]
    },
    rowClick (row) {
      this.reportItem = row
    },
    reset () {
      this.queryObj = JSON.parse(JSON.stringify(this.copyQuery))
      this.pagesize = 20
      this.count = 0
      this.currentPage = 1
    },
    // print () {
    //   frPrint('thc_phr.check_examine_report', {
    //     adviceId: this.reportItem.doctorAdviceUniqueNumber,
    //     clinicId: this.$store.state.currentUser.organizationId.toString()
    //   })
    // },
    handleSizeChange (val) {
      this.pagesize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.list()
    },
    list () {
      if (!this.patientId) return
      const query = Object.assign(JSON.parse(JSON.stringify(this.queryObj)), {
        pagesize: this.pagesize,
        offset: (this.currentPage - 1) * this.pagesize,
        patientId: this.patientId
      })
      phrapi.examineView(query).then(res => {
        this.tableData = res.data.resultList ? res.data.resultList : []
        this.count = res.data.totalCount
      })
    }
  },
  watch: {
    queryObj: {
      handler (val) {
        this.currentPage = 1
        this.list()
      },
      deep: true
    },
    patientId () {
      this.reset()
    }
  }
}
</script>
<style scoped lang="scss">
.pointer {
  cursor: pointer;
}
.sele {
  width: 260px;
  height: 36px;
  margin-right: 10px;
}
.border {
  border: 1px solid #dadce0;
  margin: 20px 0px;
  padding: 10px;
  color: #666666;
}
.color {
  font-size: 14px;
  color: #666666;
}
.margin {
  margin: 0 auto;
}
.box {
  padding: 0px 10px;
}
.red {
  color: #ee4433;
}
</style>

