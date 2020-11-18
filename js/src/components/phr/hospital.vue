<template>
  <div>
    <ever-form2 :schema="schema" v-model="queryObj" :inline="true" :is-query="true" @query="list">
      <template slot="reportdate">
        <ever-range-picker :start.sync="queryObj.startTime" :end.sync="queryObj.endTime"></ever-range-picker>
      </template>
    </ever-form2>
    <div>
      <ever-table
        ref="table"
        :columns="columns"
        :data="tableData"
        @eventChange="eventChange"
        :row-class-name="rowClassName"
      ></ever-table>
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
  </div>
</template>
<script>
import phrapi from '@/workspace/store/component'

const schema = [
  {
    name: 'applydate',
    label: '长/临',
    comp: 'select',
    props: {
      options: [
        {
          name: '长期',
          id: '0'
        },
        {
          name: '临时',
          id: '1'
        }
      ]
    }
  },
  {
    name: 'status',
    label: '状态',
    comp: 'select'
  },
  {
    name: 'type',
    label: '医嘱类型',
    comp: 'select'
  },
  {
    name: 'reportdate',
    label: '开始时间',
    comp: 'custom'
  }
]
export default {
  async mounted () {
    await this.list()
  },
  components: {},
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      chartRow: {},
      deptArr: [],
      doctorArr: [],
      pagesize: 20,
      count: 0,
      currentPage: 1,
      schema,
      queryObj,
      flag: false,
      tableData: [],
      columns: [
        {
          prop: 'type',
          label: '开始时间'
        },
        {
          prop: 'name',
          label: '长/临'
        },
        {
          prop: 'deptName',
          label: '医嘱类型'
        },
        {
          prop: 'createName',
          label: '医嘱'
        },
        {
          prop: 'applyTime',
          label: '频次用法'
        },
        {
          prop: 'applyTime',
          label: '嘱托'
        },
        {
          prop: 'applyComment',
          label: '停止时间'
        },
        {
          prop: 'applyTime',
          label: '停止医生'
        },
        {
          prop: 'reportTiem',
          label: '状态'
        }
      ]
    }
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.list()
    },
    list () {
      const query = Object.assign(this.queryObj, {
        patientId: this.patientId,
        pagesize: this.pagesize,
        offset: (this.currentPage - 1) * this.pagesize
      })
      phrapi.opAdviceView(query).then(res => {
        this.tableData = res.data.resultList
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
    }
  }
}
</script>
<style scoped lang="scss">
.pointer {
  cursor: pointer;
}
.margin {
  margin: 0 auto;
}
</style>

