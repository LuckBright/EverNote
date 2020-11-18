<template>
  <div id="outof">
    <el-dialog :visible.sync="flag" id="change_bed" title="患者出科" width="1000px">
      <el-row class="row title">
        <span class="span"></span>基本信息
      </el-row>
      <el-row class="row left10">
        <el-col :span="8">
          患者姓名：
          <span class="col666">{{info.patientName}}</span>
        </el-col>
        <el-col :span="8" v-if="info.patient">
          性别：
          <span class="col666">{{info.patient.sex | formatSex}}</span>
        </el-col>
        <el-col :span="8" v-if="info.patient">
          年龄：
          <span class="col666">{{info.patient.age}}</span>
        </el-col>
      </el-row>
      <el-row class="row left10">
        <el-col :span="8">
          住院号：
          <span
            class="col666"
          >{{info.patient && info.patient.patientOrg && info.patient.patientOrg.inpatientNumber}}</span>
        </el-col>
        <el-col :span="8">
          入院时间：
          <span class="col666">{{moment(info.hospitalizedTime).format('YYYY-MM-DD HH:mm')}}</span>
        </el-col>
        <el-col :span="8">
          科室：
          <span class="col666">{{info.providerName}}</span>
        </el-col>
        <el-row class="row">
          <el-col :span="8">
            主治医生：
            <span class="col666">{{info.chiefDoctorName}}</span>
          </el-col>
          <el-col :span="8">
            责任护士：
            <span class="col666">{{info.primaryNurseName}}</span>
          </el-col>
          <el-col :span="8">
            床位：
            <span class="col666">{{info.hospitalizedWardName}} - {{info.hospitalizedBedName}}</span>
          </el-col>
        </el-row>
        <el-col :span="12">
          诊断：
          <span class="col666">{{info.diagnosisName}}</span>
        </el-col>
      </el-row>
      <el-row class="row title">
        <span class="span"></span>待停止医嘱
        <el-col v-for="item in noHospitalAdvice" :key="item.patientId" class="left10">
          <b style="fontWeight:normal" :key="item.patientId">
            {{item.patientName}}患者有
            <i class="cRed" style="fontStyle:normal">{{item.totalCount}}条</i>医嘱执行中，请联系医生处理。
          </b>
        </el-col>
      </el-row>
      <el-row class="row title">
        <span class="span"></span>待审核医嘱
        <el-col v-for="item in hospitalAdvice" :key="item.patientId" class="left10">
          <b @click="turnreview(item)" class="alink" :key="item.patientId">
            {{item.patientName}}有
            <i class="cRed">{{item.totalCount}}条</i>待审核医嘱，请点击前往审核。
          </b>
        </el-col>
      </el-row>
      <el-row class="row title">
        <!-- &nbsp;<b class="cRed" style='fontWeight:normal'>提示：未选择执行的医嘱出科后将自动停止或作废。</b> -->
        <el-col :span="15">
          <span class="span"></span>未执行医嘱
        </el-col>
        <el-col :span="9" style="textAlign:right">
          <el-button
            type="primary"
            @click="executeAdvice"
            style="color#fff;"
            v-ever-click-once="disabled"
            :disabled="disabled || Number(totalCount) === 0"
          >批量执行</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        header-row-class-name="dark"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="adviceType" width="90" label="类型">
          <template slot-scope="scope">
            <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.adviceType"></sys-value>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="adviceName" label="医嘱名称"></el-table-column>
        <el-table-column align="center" prop="disposeContent" label="处置内容"></el-table-column>
        <el-table-column align="center" prop="createTime" width="160" label="开医嘱时间"></el-table-column>
        <el-table-column align="center" prop="entrust" width="400" label="嘱托"></el-table-column>
      </el-table>
      <!-- <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount" :current="current">
      </ever-pagination>-->
      <el-pagination
        background
        small
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        class="pagination"
        :page-size="10"
        :total="Number(totalCount)"
      ></el-pagination>
      <!-- <el-row class='row title'>
         <span></span>费用风险
      </el-row>-->

      <el-row class="row title">
        <span class="span"></span>出院时间
      </el-row>
      <el-row class="date">
        <el-form ref="form" label-width="100px">
          <el-form-item label="选择时间" :rules="rules">
            <el-date-picker
              v-model="date"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </el-row>
      <div slot="footer">
        <el-button @click="flag = false">取消</el-button>
        <el-button type="primary" @click="out" :disabled="computedOut">确认出科</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import storage from '@/util/storage.js'
import api from './../store/resident.js'
import moment from 'moment'
// import list from '@/util/list'
export default {
  // mixins: [list],
  data () {
    return {
      api,
      moment,
      flag: false,
      tableData: [],
      totalCount: 0,
      info: {
        patient: {}
      },
      loading: false,
      queryObj: {
        hospitalizedNumber: this.$route.query.hospitalizedNumber,
        status: 10
      },
      offset: 0,
      hospitalAdvice: [],
      noHospitalAdvice: [],
      date: '',
      multipleSelection: [],
      disabled: false,
      currentPage: 1,
      rules: { required: true, message: '必填项', trigger: ['blur', 'change'] }
    }
  },
  created () {
    this.$bus.$on('dialog:outof', val => {
      this.opens(val)
    })
  },
  watch: {
    $route (to, from) {
      this.offset = 0
      if (to.query.hospitalizedNumber) {
        this.findByExectueMessage(to.query.hospitalizedNumber)
      }
    },
    queryObj: {
      handler (val) {
        // this.findByExectueMessage()
      },
      deep: true
    }
  },
  methods: {
    async queryHospitalAdviceByHospitalNumber (hospitalizedNumber) {
      let res = await this.api.queryHospitalAdvice({
        hospitalizedNumber,
        statusList: [10]
      })
      this.noHospitalAdvice = res.data
    },
    async executeAdvice () {
      if (this.multipleSelection.length === 0) return
      let arr = []
      this.multipleSelection.forEach(val => {
        arr.push(val.id)
      })
      let res = await this.api.executeAdvice({
        adviceExecuteIds: arr
      })
      if (res.head && res.head.errCode === 0) {
        this.$notify({
          title: '执行成功',
          type: 'success',
          message: res.head.errMsg
        })
        this.offset = 0
        this.currentPage = 1
        this.findByExectueMessage(this.$route.query.hospitalizedNumber)
        this.queryHospitalAdvice(this.$route.query.hospitalizedNumber)
        this.queryHospitalAdviceByHospitalNumber(this.$route.query.hospitalizedNumber)
      }
    },
    turnreview (item) {
      this.flag = false
      this.$router.push({
        path: '/inpatient/advice/review',
        query: {
          patientId: item.patientId,
          patientName: item.patientName

        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCurrentChange (val) {
      if (val > 1) {
        this.offset = (val - 1) * 10
      } else {
        this.offset = 0
      }
      this.findByExectueMessage(this.$route.query.hospitalizedNumber)
    },
    findByExectueMessage (val) {
      if (!val) return
      this.api.findByExectueMessage({ offset: this.offset, pagesize: 10, status: 10, hospitalizedNumber: val }).then(rs => {
        this.totalCount = 0
        if (rs && rs.data && rs.data.resultList) {
          this.tableData = rs.data.resultList
          this.totalCount = rs.data.totalCount
        }
      })
    },
    async opens (val) {
      this.flag = true
      this.info = val
      if (val) {
        this.date = val.hospitalizedOutTime ? moment(val.hospitalizedOutTime).format('YYYY-MM-DD HH:mm') : this.date = moment().format('YYYY-MM-DD HH:mm')
        this.offset = 0
        this.findByExectueMessage(this.$route.query.hospitalizedNumber)
        this.queryHospitalAdvice(this.$route.query.hospitalizedNumber)
        this.queryHospitalAdviceByHospitalNumber(this.$route.query.hospitalizedNumber)
      }
    },
    async queryHospitalAdvice (hospitalizedNumber) {
      let res = await this.api.queryHospitalAdvice({
        hospitalizedNumber,
        statusList: [1, 12],
        subVisitTypeList: [301, 302]
      })
      this.hospitalAdvice = res.data
    },
    async out () {
      let result = await api.createOutEntranceMsg({
        hospitalizedNumber: this.$route.query.hospitalizedNumber,
        patientId: this.$route.query.patientId,
        hospitalizedOutTime: moment(this.date).format('YYYY-MM-DD HH:mm:ss')
      })
      if (result.head.errCode === 0) {
        this.$notify({
          title: '成功',
          type: 'success',
          message: '出科成功'
        })
        this.$bus.$emit('patient_mgt_shua')
        this.flag = false
        this.$emit('success')
      } else {
        this.$notify({
          type: 'warning',
          message: result.head.errMsg
        })
      }
      // storage.getSessionStorage('spaceId')
    }
  },
  computed: {
    computedOut () {
      if (this.hospitalAdvice.length === 0 || this.noHospitalAdvice.length === 0) {
        return true
      }
      let count = this.totalCount
      this.hospitalAdvice.forEach(val => {
        count += val.totalCount
      })
      this.noHospitalAdvice.forEach(val => {
        count += val.totalCount
      })
      return !(count === 0 && this.date)
    }
  },
  components: {

  }
}
</script>

<style lang='scss'>
#outof {
  .dark {
    th {
      background-color: #eee;
    }
  }
  .row {
    line-height: 30px;
    color: #666;
    .col666 {
      color: #000;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .left10 {
    padding-left: 8px;
  }
  .title {
    color: #000;
    font-weight: bold;
    .span {
      display: inline-block;
      width: 3px;
      height: 15px;
      background: #1c7bef;
      vertical-align: middle;
      margin-top: -2px;
      margin-right: 5px;
    }
  }
  .alink {
    color: #1c7bef;
    text-decoration: underline;
    cursor: pointer;
    font-weight: normal;
    i {
      font-style: normal;
    }
  }
  .date {
    line-height: 36px;
    padding-left: 15px;
  }
}
</style>
