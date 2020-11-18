<template>
  <div class="layout_inner">
    <!-- 门诊人员工作量 -->
    <ever-form2
      ref="form"
      :schema="schema"
      v-model="queryObj"
      :inline="true"
      :isQuery="true"
      @query="list(true)"
    >
      <template slot="default">
        <el-button size="small" type="primary" @click="list(true)">查询</el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </template>
    </ever-form2>
    <div class="flex_col_1_hidden main-wrap">
      <el-table
        :data="tableData"
        v-loading="loading"
      >
        <el-table-column label="科室" prop="deptName" fixed="left"  width="150"></el-table-column>
        <el-table-column label="医生姓名" prop="doctorName" fixed="left" width="100">
          <template slot-scope="scope">
            <a v-if="!['小计','门诊总合计'].includes(scope.row.doctorName)" href="javascript:void(0)" @click="checkInfo(scope.row)">{{scope.row.doctorName}}</a>
            <span v-else>{{scope.row.doctorName}}</span>
          </template>
        </el-table-column>
        <el-table-column v-for="(item,index) in columnArr" :key="index" :label="item.name" :prop="item.code">
          <template slot-scope="scope">
            <span v-if="scope.row[item.code] ==0"></span>
            <span v-else>{{scope.row[item.code] | formatToFinacial}}</span>
          </template>
        </el-table-column>
        <el-table-column label="合计" prop="total" fixed="right" width="120">
          <template slot-scope="scope">{{scope.row.total | formatToFinacial}}</template>
        </el-table-column>
      </el-table>
      <div style="margin-top:20px;">
        <ever-pagination
          :pagesize="30"
          :current="current"
          :page-sizes="pageSizes"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
        ></ever-pagination>
      </div>
    </div>
    <el-dialog title="费用明细" :visible.sync="dialogInfo.visible" width="95%">
      <div>
        <el-table :data="dialogInfo.tableData" :height="500">
          <el-table-column label="结算单号" prop="settleCode" width="180"></el-table-column>
          <el-table-column label="医生编号" prop="doctor" width="300"></el-table-column>
          <el-table-column label="患者姓名" prop="patientName"></el-table-column>
          <el-table-column v-for="(item,index) in dialogInfo.logColumnArr" :key="index" :label="item.name" :prop="item.code" width="130">
            <template slot-scope="scope">
              <span v-if="scope.row[item.code] ==0"></span>
              <span v-else>{{scope.row[item.code] | formatToFinacial}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top:20px;">
        <ever-pagination
          :current="logcurrent"
          :page-sizes="pageSizes"
          @size-change="loghandleSizeChange"
          @current-change="loghandleCurrentChange"
          :totalCount="logtotalCount"
        ></ever-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/bi/store/censusboardapi.js'
import sysvalue from '@/warehouse/store/sysvalueapi'
import list from '@/util/list'
let schema = [
  {
    label: '姓名',
    name: 'doctor',
    comp: 'ever-staff-select'
  },
  {
    label: '科室',
    name: 'dept',
    comp: 'everSubjectSelect',
    props: {
      type: 'select'
    },
    span: 6
  },
  {
    label: '科室类型',
    name: 'type',
    comp: 'everSelect',
    props: {
      options: [
        {id: 1, name: '开立科室'},
        {id: 2, name: '执行科室'}
      ]
    }
  },
  {
    label: '时间',
    name: 'dailyDate',
    comp: 'everRangePicker',
    props: {
      dateType: 'datetimerange',
      defaultTime: [],
      outformat: 'YYYY-MM-DD HH:mm:ss',
      autoWidth: true
    }
  }
]
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    let dateNow = Date.now()
    let dateStart = this.$moment(dateNow - 86400000 * 7).format('YYYY-MM-DD 00:00:00')
    let dateEnd = this.$moment(dateNow).format('YYYY-MM-DD 23:59:59')
    queryObj.dailyDate = [dateStart, dateEnd]
    return {
      api,
      sysvalue,
      schema,
      queryObj,
      dialogInfo: {
        visible: false,
        tableData: [],
        doctor: '',
        dept: '',
        logColumnArr: []
      },
      columnArr: [],
      logoffset: 0,
      logpagesize: Number(this.$route.query.pagesize) || 20,
      logtotalCount: 0,
      logcurrent: 1,
    }
  },
  methods: {
    reset () {
      this.queryObj.doctor = ''
      this.queryObj.dept = ''
      this.queryObj.dailyDate = ['', '']
    },
    loghandleSizeChange (val) {
      this.logpagesize = val
      this.logcurrent = 1 // 切换size时，自动重置current
      this.logoffset = (this.logcurrent - 1) * this.logpagesize
      this.logList()
    },
    loghandleCurrentChange (val) {
      this.logcurrent = val
      this.logoffset = (val - 1) * this.logpagesize || 0
      this.logList()
    },
    logList () {
      let params = {
        detail: 1,
        doctor: this.dialogInfo.doctor,
        dept: this.dialogInfo.dept,
        type: this.queryObj.type,
        subject: 0,
        startTime: this.queryObj.dailyDate[0],
        endTime: this.queryObj.dailyDate[1],
        page: this.logcurrent,
        pageSize: this.logpagesize
      }
      api.getDeptDoctorItemClassFeeSum(params).then(rs => {
        if (rs && rs.data && rs.data.list && rs.data.list.length > 0) {
          this.dialogInfo.logColumnArr = rs.showCode
          this.$nextTick(_ => {
            this.dialogInfo.tableData = rs.data.list
            this.logtotalCount = rs.data.total
          })
        } else {
          this.dialogInfo.tableData = []
          this.logtotalCount = 0
        }
      })
    },
    checkInfo (row) {
      this.dialogInfo.doctor = row.doctor
      this.dialogInfo.dept = row.dept
      this.dialogInfo.visible = true
      this.logList()
    },
    list () {
      let params = {
        subject: 0,
        startTime: this.queryObj.dailyDate[0],
        endTime: this.queryObj.dailyDate[1],
        page: this.current,
        pageSize: this.pagesize
      }
      if (this.queryObj.doctor) {
        params.doctor = this.queryObj.doctor
      }
      if (this.queryObj.type) {
        params.type = this.queryObj.type
      }
      if (this.queryObj.dept.id) {
        params.dept = this.queryObj.dept.id
      }
      api.getDeptDoctorItemClassFeeSum(params).then(rs => {
        if (rs && rs.data && rs.data.list && rs.data.list.length > 0) {
          this.getTitle(rs)
          // this.tableData = rs.data.list
        } else {
          this.tableData = []
          this.totalCount = 0
        }
      })
    },
    initTableData (rs) {
      let json = rs.data.list
      let deptInfos = rs.deptSumList
      deptInfos.forEach((item, index) => {
        if (index === deptInfos.length - 1) {
          item['doctorName'] = '门诊总合计'
        } else {
          item['doctorName'] = '小计'
        }
      })
      deptInfos.forEach(item => {
        for (let i = json.length - 1; i > -1; i--) {
          if (json[i]['dept'] === item.dept) {
            json.splice(i + 1, 0, item)
            return
          }
        }
      })
      json.push(deptInfos.find(item => { return item.dept === 'total' }))
      this.tableData = json
    },
    async getTitle (arr) {
      let titile = api.getAllValueSetCodeNameMap({code: 'THC_RCM_FIN_TYPE'})
      let titileInfo = await titile
      let columnArr = []
      let qita = ''
      let allArr = arr.deptSumList[arr.deptSumList.length - 1] // 根据汇总数据筛选需要展示的列数
      for (let key in allArr) {
        if (allArr[key] !== 0) {
          let info = (titileInfo.data).find(item => { return item.code === key })
          if (info) {
            let obj = {
              code: key,
              name: info.name
            }
            if (info.name === '其他') {
              qita = obj
            } else {
              columnArr.push(obj)
            }
          }
        }
      }
      if (qita) {
        columnArr.push(qita)
      }
      this.columnArr = columnArr
      this.$nextTick(_ => {
        this.initTableData(arr)
          // this.tableData = rs.data.list
        this.totalCount = arr.data.total
      })
    }
  },
  async created () {
    this.queryObj.type = 1
  },
  watch: {
    'dialogInfo.visible': {
      handler: function (val, oldval) {
        if (!val) {
          this.dialogInfo.tableData = []
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .dataContainer {
    height: calc(~'100vh - 350px');
    overflow: scroll;
  }
</style>
