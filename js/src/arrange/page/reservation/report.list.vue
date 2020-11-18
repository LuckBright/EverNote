<template>
  <div class="report">
    <header>
      <reportlistquery :serviceType='serviceType' :doctorOptions='doctorOptions' :orgOptions='orgOptions' @list='query' :key='serviceType'></reportlistquery>
    </header>
    <section class="inspection_section">
      <el-table :data="tableData" @selection-change="changeFun" border style="width: 100%" stripe ref="reportTable">
        <el-table-column
          class="selestyle"
          type="selection"
          :selectable="checkboxInit"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column prop="patientName" label="患者姓名" align="center"></el-table-column>
        <el-table-column prop="createTime" label="申请时间" width="170" align="center"></el-table-column>
        <el-table-column prop="doctorName" label="申请医生" width="170" align="center"></el-table-column>
        <el-table-column prop="reportTime" label="报告时间" width="170" align="center"></el-table-column>
        <el-table-column prop="serviceName" label="检验内容" align="center" v-if='serviceType == "801"'></el-table-column>
        <el-table-column prop="serviceName" label="检查项目" align="center"  v-if='serviceType == "800"'></el-table-column>
        <el-table-column :key='serviceType' prop="positionName" label="部位" align="center"  v-if='serviceType == "800"'></el-table-column>
        <!-- <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">{{REPORT_EXAMINE_STATUS[scope.row.status]}}</template>
        </el-table-column> -->
        <el-table-column prop="resultItem" label="异常情况" width="300"  v-if='serviceType == "801"'>
          <template slot-scope="scope">
            <span v-for="item in scope.row.resultItem" :key="item.id">
              <span v-if="item.resultStatus !== ''">{{item.inspectUnitName}}</span>
              <span v-if="item.resultStatus !== ''">{{item.quantityValue}}</span>
              <i v-if="item.resultStatus == 'L' || item.resultStatus == 'LL'" class="icon iconfont icon-xiajiang"></i>
              <i v-if="item.resultStatus == 'H' || item.resultStatus == 'HH'" class="icon iconfont icon-shangsheng"></i>
            </span>
          </template>
        </el-table-column>
        <el-table-column width="300" prop="doctorReview" label="医生解读">
          <template slot-scope="scope">
            <span :title="scope.row.doctorReview">{{scope.row.doctorReview | filterText}}</span>
          </template>
        </el-table-column>
        <el-table-column width="170" fixed="right" label="操作" align="center">
          <template slot-scope="scope">
            <!-- <el-button
               v-if='serviceType == "801"'
              :disabled="!(scope.row.resultItem && scope.row.resultItem.length > 0)"
              type="primary"
              size="small"
              @click="inspectionPrint(scope.row)"
            >打印报告</el-button> -->
            <el-button
              v-if="scope.row.status == 60"
              @click="viewReport(scope.row)"
              type="primary"
              size="small"
            >查看报告</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
        :current="current"
      ></ever-pagination>
    </section>
    <footer>
      <div>
        <div class="unscramble_tile">医生解读：</div>
        <el-input style="margin:5px 0 20px;" type="textarea" v-model="updataparams.doctorReview"></el-input>
        <div class="save-button">
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </div>
    </footer>
    <reportcard
      ref="reportcard"
      @reportEvent="reportCards"
      :isPrint="true"
    ></reportcard>
  </div>
</template>
<script>
import api from '@/arrange/store/inspectionreport'
import reportcard from '@/infusion/components/report.card.vue'
import reportlistquery from '@/arrange/page/reservation/report.list.query.vue'
import list from '@/util/list'
export default {
  mixins: [list],
  props: ['serviceType'],
  data () {
    return {
      queryObj: {},
      api,
      listApiName: '',
      tableData: [],
      currentPage: 1,
      totalNum: 0,
      ruleDetail: '',
      params: {
        pagesize: 20,
        offset: 0
      },
      updataparams: {
        executeIds: [],
        doctorReview: ''
      },
      reportcardData: {},
      options: [],
      selectValue: '',
      doctorOptions: [],
      orgOptions: [],
      lists: [],
      patientName: [],
      screenWidth: '',
      isReportInfo: false,
      disAutoSearch: false,
      noStoreQuery: true
    }
  },
  watch: {
    'serviceType' () {
      this.tableData = []
    }
  },
  mounted () {
    // const that = this
    // if (document.body.clientWidth <= 1650) {
    //   window.document.getElementsByClassName('inspection_section')[0].style.height = '350px'
    // }
    // window.onresize = () => {
    //   return (() => {
    //     window.screenWidth = document.body.clientWidth
    //     that.screenWidth = window.screenWidth
    //     if (window.screenWidth <= 1650) {
    //       window.document.getElementsByClassName('inspection_section')[0].style.height = '350px'
    //     } else {
    //       window.document.getElementsByClassName('inspection_section')[0].style.height = '550px'
    //     }
    //   })()
    // }
  },
  methods: {
    reportCards () {
      this.query()
    },
    viewReport (data) { // 查看检验报告
      var obj = {
        patientId: data.patientId,
        serviceType: this.serviceType,
        executeId: data.executeId,
        serviceId: data.serviceId
      }
      this.$refs.reportcard.openDialog(obj, true)
      // if (isReportInfo === '报告已出' || isReportInfo === '已解读') {
      //   this.isReportInfo = true
      // } else {
      //   this.isReportInfo = false
      // }
    },
    query (queryObj) {
      this.queryObj = queryObj
      // this.list(Object.assign(this.params, this.queryObj))
      this.handleCurrentChange(1)
    },
    changeFun (val) {
      let arr = []
      this.updataparams.executeIds = []
      this.patientName = []
      for (let i in val) {
        this.updataparams.executeIds.push(val[i].executeId)
        this.patientName.push(val[i].patientName + val[i].isClient)
        arr.push(val[i].doctorReview)
      }
      if (!this.isAllEqual(this.patientName)) {
        this.$refs.reportTable.toggleRowSelection(val.pop(), false)
        return false
      }
      if (this.isAllEqual(arr) || arr.length === 1) {
        this.updataparams.doctorReview = arr[0]
      } else {
        this.updataparams.doctorReview = ''
      }
    },
    palindrome (str) {
      var arr = str.split('')
      arr = arr.filter(function (val) {
        return (val !== ' ' && val !== ',' && val !== '.' && val !== '?' && val !== ':' && val !== ';' && val !== '`' && val !== "'" && val !== '_' && val !== '/' && val !== '-' && val !== '\\' && val !== '')
      })
      return arr.join('')
    },
    isAllEqual (array) {
      if (array.length > 0) {
        return !array.some(function (value, index) {
          return value !== array[0]
        })
      } else {
        return true
      }
    },
    save () {
      if (this.updataparams.executeIds.length === 0) {
        return this.$messageTips(this, 'warning', '请勾选需要解读的记录', '提示')
      }
      api.updata(this.updataparams).then(result => {
        if (!result.head.errCode) {
          this.$messageTips(this, 'success', '保存成功')
          this.list()
        }
      })
    },
    checkboxInit (row, index) {
      if (parseInt(row.status) === 60) {
        return true
      } else {
        return false
      }
    },
  },
  components: {
    reportlistquery,
    reportcard // 查看检验报告
  },
  filters: {
    filterText (val) {
      if (typeof val === 'string' && val.length > 200) {
        return val.substring(0, 200) + '...'
      }
      return val
    }
  }
}
</script>
<style lang="scss" scoped>
.bg {
  background-color: #fff;
}
.icon-xiajiang {
  color: green;
}
.icon-shangsheng {
  color: red;
}
.inspect {
  margin-right: 5px;
}
.save-button {
  width: 100%;
}
.report {
  display: flex;
  width: 100%;
  height: 100%;
  flex-flow: column nowrap;
}
section {
  height: auto;
  flex-grow: 1;
  overflow-x: hidden;
  height: 550px;
}
footer {
  background-color: #efefef;
  padding: 10px;
}
</style>
