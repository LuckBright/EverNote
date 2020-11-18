<template>
  <div>
    <ever-form2 :schema="schema" v-model="queryObj" :inline="true">
      <template slot="applydate">
        <ever-range-picker :start.sync="queryObj.startDate" :end.sync="queryObj.endDate"></ever-range-picker>
      </template>
      <template slot="default">
        <el-button size="small" @click="reset">重置</el-button>
      </template>
    </ever-form2>
    <div>
      <ever-table
        border
        :columns="columns"
        :data="tableData"
        :el-table-attr="{
                    'span-method':objectSpanMethod
                  }"
      >
        <template slot="diseaseName">
          <el-table-column label="诊断名称" prop="diseaseName" show-overflow-tooltip>
            <template slot-scope="scope">
                {{ scope.row | formatLang('diseaseName', true)}}
            </template>
          </el-table-column>
        </template>
      </ever-table>
      <el-row v-show="count > queryObj.pagesize">
        <el-col :span="24" align="right">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20, 50, 100]"
            :page-size="queryObj.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count"
          ></el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import api from '@/workspace/store/component'
import moment from 'moment'
import deptapi from '@/manages/page/person/personapi'

const schema = [
  {
    name: 'applydate',
    label: '就诊/入院日期',
    comp: 'custom'
  },
  {
    name: 'tenantSubjectId',
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
    label: '机构',
    props: {
      type: 'select',
      fields: 'id'
    }
  },
  {
    name: 'typeCode',
    label: '诊断类型',
    comp: 'select',
    props: {
      options: []
    }
  }
]
const obj = {
  '1': '门诊诊断',
  '2': '初步诊断',
  '3': '中医主病',
  '4': '中医主症',
  '5': '主要诊断',
  '6': '并发症诊断',
  '7': '入院诊断',
  '9': '术前(产前)诊断',
  '10': '术后(产后)诊断',
  '11': '病理诊断',
  '12': '损伤中毒外部原因',
  '13': '感染诊断',
  '14': '死亡诊断'
}
export default {
  props: {
    patientId: String
  },
  data () {
    for (let key in obj) {
      schema[3].props.options.push({ id: key, name: obj[key] })
    }
    const queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.pagesize = 20
    queryObj.offset = 0
    queryObj.startDate = moment(new Date())
      .subtract(1, 'months')
      .format('YYYY-MM-DD')
    queryObj.endDate = moment(new Date()).format('YYYY-MM-DD')
    this.copyQuery = JSON.parse(JSON.stringify(queryObj))
    return {
      schema,
      columns: [
        {
          prop: 'visitTime',
          label: '就诊/入院日期',
          formatter ({ row }) {
            return row.visitTime
              ? moment(row.visitTime).format('YYYY-MM-DD')
              : ''
          },
          width: '120'
        },
        {
          prop: 'tenantSubjectName',
          label: '科室'
        },
        {
          prop: 'orgName',
          label: '机构'
        },
        {
          prop: 'typeName',
          label: '诊断类型'
        },
        {
          prop: 'diseaseName',
          slotName: 'diseaseName',
        },
        {
          prop: 'diagnosisCode',
          label: '诊断编码'
        },
        {
          prop: 'diseaseCodeCategory',
          label: '编码类型'
        },
        {
          prop: 'doctorName',
          label: '医生'
        }
      ],
      queryObj,
      deptArr: [],
      tableData: [],
      currentPage: 1,
      pagesize: 20,
      count: 0
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    queryObj: {
      handler (val) {
        this.currentPage = 1
        this.list()
      },
      deep: true
    },
    patientId (val) {
      this.reset()
    }
  },
  methods: {
    formatContent ({ value }) {
      const key = value + ''
      return obj[key]
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 && this.cellData) {
        return this.cellData[rowIndex] ? this.cellData[rowIndex] : [1, 1]
      }
    },
    mergeData () {
      this.tableData.forEach((item, index) => {
        if (this.totalCount[item.visitNumber]) {
          this.totalCount[item.visitNumber].push(index)
        } else {
          this.totalCount[item.visitNumber] = []
          this.totalCount[item.visitNumber].push(index)
        }
      })
      for (let key in this.totalCount) {
        let item = this.totalCount[key]
        let len = this.totalCount[key].length
        if (len > 1) {
          for (let i = 0; i < len; i++) {
            if (i === 0) {
              this.cellData[item[i]] = [len, 1]
            } else {
              this.cellData[item[i]] = [0, 0]
            }
          }
        }
      }
    },
    init () {
      this.getDpt()
      this.list()
    },
    async getData (query) {
      if (!query.patientId) return
      this.totalCount = {}
      this.cellData = {}
      const data = await api.diagonoseSearch(query)
      this.tableData = data.data.resultList
      this.mergeData(this.tableData)
      this.count = data.data.totalCount
    },
    async getDpt () {
      const dpts = await deptapi.getSections()
      if (dpts.length) {
        this.deptArr = dpts
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.list()
    },
    list () {
      const query = Object.assign(JSON.parse(JSON.stringify(this.queryObj)), {
        pagesize: this.pagesize,
        offset: (this.currentPage - 1) * this.pagesize,
        patientId: this.patientId
      })
      this.getData(query)
    },
    reset () {
      this.queryObj = JSON.parse(JSON.stringify(this.copyQuery))
      this.pagesize = 20
      this.count = 0
      this.currentPage = 1
    }
  },
  components: {}
}
</script>
<style scoped lang="scss">
</style>
