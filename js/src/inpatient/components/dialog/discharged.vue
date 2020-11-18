<template>
  <div>
    <el-dialog
      :visible="flag"
      class="discharged"
      :title="title"
      width="1000px"
      @close="flag = false"
      :append-to-body="true"
    >
      <el-row class="row title">
        <span class="span"></span>基本信息
      </el-row>
      <el-row class="row left10" style="borderBottom:1px solid #ddd">
        <div>{{patient.patientName}}</div>
        <div>{{patient.sex | formatSex}}</div>
        <div>{{patient.birthday | formatDateByExp("YYYY-MM-DD")}}</div>
        <div>
          保险机构：
          <span class="col666">
            <!-- <sys-value
              type="CV07.10.005"
              :code="patient.admitPaymentMethod"
              v-if="patient.admitPaymentMethod"
            ></sys-value>
            <template v-else>--</template> -->
              {{patient.insuranceCompany || '--'}}
          </span>
        </div>
        <div>
          病案号：
          <span class="col666">{{patient.inpatientNumber}}</span>
        </div>
      </el-row>
      <el-row class="row left10">
        <div>
          床号：
          <span class="col666">{{patient.bedName}}</span>
        </div>
        <div>
          主治医师：
          <span class="col666">{{patient.chargeDoctorName}}</span>
        </div>
        <div>
          住院医师：
          <span class="col666">{{patient.admitDoctorName}}</span>
        </div>
        <div>
          责任护士：
          <span class="col666">{{patient.primaryNurseName}}</span>
        </div>
        <div>
          接诊护士：
          <span class="col666">{{patient.receptionNurseName}}</span>
        </div>
        <!-- <div>入院科室：<span class="col666">{{patient.providerName}}</span></div> -->
        <div>
          入科时间：
          <span class="col666">{{patient.hospitalTime | formatDateByExp("YYYY-MM-DD HH:mm")}}</span>
        </div>
      </el-row>
      <el-row class="row title" v-if="type !== 'cancel'">
        <span class="span"></span>医嘱信息
      </el-row>
      <el-table
        v-if="type !== 'cancel'"
        border
        header-row-class-name="tableheader"
        :data="advicesAndExecutes"
        @cell-click="cellClick"
        style="width: 100%"
      >
        <el-table-column prop="patientName" label="患者姓名"></el-table-column>
        <template v-if='type === "cancle_allocated"'>
          <el-table-column prop="validAdviceCount" label="有效医嘱"></el-table-column>
          <el-table-column prop="dischargeReceivable" label="费用金额">
              <template slot-scope="scope">
                {{scope.row.dischargeReceivable || '--'}}
              </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column prop="waittingChekAdviceCount" label="待审核医嘱">
            <template slot-scope="scope">
              <span
                :class="{active:scope.row.waittingChekAdviceCount > 0}"
              >{{scope.row.waittingChekAdviceCount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="executingAdviceCount" label="执行中医嘱"></el-table-column>
        </template>
        <el-table-column prop="waittingExecuteCount" label="未完成执行单">
          <template slot-scope="scope">
            {{scope.row.waittingExecuteCount}}
            <el-popover
              v-if='scope.row.waittingExecuteCount > 0'
              placement="top-start"
              width="230"
              trigger="hover"
              content="如果有需要医技执行的执行单，需要在医技系统执行完成或取消执行">
              <i class="iconfont icon-sales-zhuyi active" slot="reference" style="verticalAlign: middle;"></i>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="waittingSendDrugExecuteCount" label="未出库">
          <template slot-scope="scope">
            {{scope.row.waittingSendDrugExecuteCount}}
          </template>
        </el-table-column>
        <el-table-column prop="returnDrugExecuteCount" label="退库中">
          <template slot-scope="scope">
            {{scope.row.returnDrugExecuteCount}}
          </template>
        </el-table-column>
      </el-table>
      <el-row class="row title" v-if='type !== "cancle_allocated"'>
        <span class="span"></span>出院时间
      </el-row>
      <el-row class="date" v-if='type !== "cancle_allocated"'>
        <el-form ref="form" label-width="100px" :rules="rules" :model="query">
          <el-form-item label="出院时间" style="float:left" prop="hospitalizedOutTime">
            <el-date-picker
              :disabled="type === 'cancel'"
              v-model="query.hospitalizedOutTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              placeholder="选择日期时间"
              :pickerOptions="{
                disabledDate
              }"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="出院方式:" prop="newbed" style="float:left">
            <el-select
              filterable
              clearable
              placeholder="请选择"
              class="wb100"
              v-model="query.hospitalizedOutType"
              value-key="doctorId"
              :disabled="type === 'cancel'"
            >
              <el-option
                v-for="item in outMethod"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row class="back" v-if="type === 'cancel'">
        {{patient.operatorName || '--'}}于{{patient.hospitalizedOutTime | formatDateByExp('YYYY-MM-DD HH:mm')}}为{{patient.patientName}}办理出院
        <span @click="cancle"  v-ever-click-once="clickDisabled">取消出科</span>
      </el-row>
      <div slot="footer" v-if="type !== 'cancel'">
        <el-button @click="flag = false">取消</el-button>
        <el-button type="primary" @click="out" :disabled="count > 0 || clickDisabled"  v-ever-click-once="clickDisabled">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import storage from '@/util/storage.js'
import moment from 'moment'
import api from '@/inpatient/store/resident.js'
import component from '@/workspace/store/component.js'
import sysvalue from '@/warehouse/store/sysvalueapi'
export default {
  data () {
    return {
      api,
      moment,
      flag: false,
      totalCount: 0,
      patient: {},
      loading: false,
      query: {
        hospitalizedOutTime: '',
        hospitalizedOutType: ''
      },
      doctorIdOptions: [],
      offset: 0,
      hospitalAdvice: [],
      noHospitalAdvice: [],
      date: '',
      multipleSelection: [],
      currentPage: 1,
      rules: {
        hospitalizedOutTime: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      },
      advicesAndExecutes: [],
      outMethod: [],
      count: 100,
      clickDisabled: false,
      type: '',
      title: '出科'
    }
  },
  created () {

  },
  watch: {
  },
  methods: {
    disabledDate(time) {
      if (this.patient.hospitalTime) {
        return time.getTime() + (3600000 * 24) < this.patient.hospitalTime
      }
      return true
    },
    cellClick (row, column, cell, event) {
      let patient = JSON.parse(JSON.stringify(this.patient))
      if (patient.patientId !== row.patient) {
        patient.patientId = row.patientId
        patient.hospitalizedNumber = row.hospitalizedNumber
      }
      this.$emit('adviceTurn', row, column, patient)
    },
    getOutMethod () {
      sysvalue.listOnce(' CV06.00.226').then(res => {
        this.outMethod = res
      })
    },
    async getInpatientbyHosNumber (hospitalizedNumber) {
      let res = await api.getInpatientIconsbyHosNumber({
        hospitalizedNumber
      })
      this.patient = res.data || {}
      let iconList = this.patient.iconList || {}
      this.patient.admitPaymentMethod = iconList.admitPaymentMethod
      this.patient.insuranceCompany = iconList.insuranceCompany
      if (this.patient.hospitalizedOutTime) this.query.hospitalizedOutTime = this.$moment(this.patient.hospitalizedOutTime).format('YYYY-MM-DD HH:mm:ss')
      if (this.patient.hospitalizedOutType) this.query.hospitalizedOutType = this.patient.hospitalizedOutType
    },
    open (patient, type) {
      this.type = type
      if (this.type === 'cancle_allocated') this.title = '取消入科'
      if (this.type === 'cancel') this.title = '取消出科'
      this.query.hospitalizedOutTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      this.flag = true
      this.getOutMethod()
      this.gethospitalizedOutType(patient.hospitalizedNumber)
      this.checkAdvicesAndExecutes(patient.hospitalizedNumber)
      this.getInpatientbyHosNumber(patient.hospitalizedNumber)
    },
    async gethospitalizedOutType (hospitalizedNumber) {
      let res = await component.getHomePage({
        visitId: hospitalizedNumber
      })
      let ress = await component.jilin({
        visitId: hospitalizedNumber
      })
      if (res && res.data && res.data.HDSD00_11_057_code) {
        this.query.hospitalizedOutType = res.data.HDSD00_11_057_code
      }
      if (ress && ress.data && ress.data.HDSD00_12_064_code) {
        this.query.hospitalizedOutType = ress.data.HDSD00_12_064_code
      }
    },
    async checkAdvicesAndExecutes (hospitalizedNumber) {
      let res = await this.api.checkAdvicesAndExecutes({
        hospitalizedNumber
      })
      this.advicesAndExecutes = res.data || []

      let count = 0
      this.advicesAndExecutes.forEach(({
        waittingChekAdviceCount = 0,
        waittingExecuteCount = 0,
        executingAdviceCount = 0,
        waittingSendDrugExecuteCount = 0,
        returnDrugExecuteCount = 0,
        validAdviceCount = 0,
        dischargeReceivable = 0
       }) => {
        if (this.type === 'cancle_allocated') {
          count += validAdviceCount
          dischargeReceivable = dischargeReceivable.replace(/,/g, '')
          count += isNaN(dischargeReceivable) ? 1 : Number(dischargeReceivable)
        } else if (this.type === 'discharged') {
          count += waittingChekAdviceCount
          count += executingAdviceCount
        }
        count += waittingSendDrugExecuteCount
        count += returnDrugExecuteCount
        count += waittingExecuteCount
      })
      this.count = count
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
    async out () {
      if (this.clickDisabled) return
      if (this.type === 'cancle_allocated') {
        this.cancle_allocated()
        return
      }
      if (this.$moment(this.query.hospitalizedOutTime).valueOf() < this.patient.hospitalTime) {
        this.$notify({
          title: '提示',
          message: `出科时间不能早于入科时间！`,
          type: 'warning'
        })
        return
      }
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let result = await this.api.leaveHospital({
            patientId: this.patient.patientId,
            patientName: this.patient.patientName,
            hospitalizedNumber: this.patient.hospitalizedNumber,
            hospitalizedOutTime: this.query.hospitalizedOutTime,
            hospitalizedOutType: this.query.hospitalizedOutType
          })
          if (result.head && result.head.errCode === 0) {
            this.$notify({
              title: '成功',
              type: 'success',
              message: '出科成功'
            })
            this.flag = false
            this.$emit('success')
          } else {
            this.checkAdvicesAndExecutes(this.patient.hospitalizedNumber)
          }
        } else {
          setTimeout(() => {
            var isError = document.getElementsByClassName('is-error')
            if (isError.length) {
              if (isError[0].querySelector('input')) {
                isError[0].querySelector('input').focus()
              }
            }
          }, 1)
        }
      })
    },
    async cancle_allocated () {
      let {patientId, patientName, hospitalizedNumber} = this.patient
      let res = await this.api.cancelEntrance({patientId, patientName, hospitalizedNumber})
      .catch(_ => {
        this.refales()
      })
      if (res.head && res.head.errCode === 0) {
        this.$notify({
          type: 'success',
          message: '取消入科成功'
        })
        this.$bus.$emit('global:listwating')
        this.flag = false
        this.$emit('success')
      }
    },
    async cancle () {
      if (this.clickDisabled) return
      let result = await this.api.cancelLeaveHospital({
        patientId: this.patient.patientId,
        patientName: this.patient.patientName,
        hospitalizedNumber: this.patient.hospitalizedNumber
      })
      if (result.head && result.head.errCode === 0) {
        this.$notify({
          title: '成功',
          type: 'success',
          message: '取消出科成功'
        })
      }
      this.flag = false
      this.$emit('success')
    }
  },
  components: {

  }
}
</script>

<style lang='scss' scoped>
.discharged {
  .dark {
    th {
      background-color: #eee;
    }
  }
  .active {
    color: #1c7bef;
    cursor: pointer;
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
    display: flex;
    div {
      padding: 0 10px;
    }
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
  .back {
    padding-left: 15px;
    padding-bottom: 15px;
    span {
      color: #1c7bef;
      text-decoration: underline;
      cursor: pointer;
      padding-left: 10px;
    }
  }
}
</style>
