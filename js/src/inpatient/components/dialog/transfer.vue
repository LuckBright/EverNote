<template>
  <div class="transfer">
    <dialogCom
      v-model="visible"
      :title="title"
      @save="saveBefore"
      :showbtn="showbtn"
      :dis="count > 0"
      :hospitalizedNumber="patient.hospitalizedNumber"
      @info="info"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-row>
          <el-col :span="12" v-if="type === 'transfer_provider'">
            <el-form-item label="目标科室:" prop="providerId">
              <el-select
                :disabled="!!echo.id"
                filterable
                clearable
                placeholder="请选择"
                class="wb100"
                @change="change"
                v-model="form.providerId"
                value-key="doctorId"
              >
                <el-option
                  v-for="item in procviderOptions"
                  :key="item.id"
                  :label="item.tenantSubjectName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标病区:" prop="areaId">
              <el-select
                :disabled="!!echo.id"
                filterable
                clearable
                placeholder="请选择"
                class="wb100"
                v-model="form.areaId"
                value-key="doctorId"
              >
                <el-option
                  v-for="item in areaOptions"
                  :key="item.id"
                  :label="item.sickAreaName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        border
        v-if="!echo.id"
        header-row-class-name="tableheader"
        :data="advicesAndExecutes"
        @cell-click="cellClick"
        style="width: 100%"
      >
        <el-table-column prop="patientName" label="患者姓名"></el-table-column>
        <el-table-column prop="waittingChekAdviceCount" label="待审核医嘱">
          <template slot-scope="scope">
            <span
              :class="{active:scope.row.waittingChekAdviceCount > 0}"
            >{{scope.row.waittingChekAdviceCount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="executingAdviceCount"
          label="执行中医嘱"
        ></el-table-column>
        <el-table-column prop="waittingExecuteCount" label="未完成执行单" width="120">
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
      <el-row class="back" v-if="type ==='transfer_provider' && echo.id">
        {{echo.applianceNurseName || '--'}}于{{echo.createTime | formatDateByExp('YYYY-MM-DD HH:mm:ss')}}为{{patient.patientName}}办理转科
        <span @click="cancle"   v-ever-click-once="disabled">取消转科</span>
      </el-row>
      <el-row class="back" v-if="type ==='transfer_area' && echo.id">
        {{echo.applianceNurseName || '--'}}于{{echo.createTime | formatDateByExp('YYYY-MM-DD HH:mm:ss')}}为{{patient.patientName}}办理转病区
        <span @click="cancle"   v-ever-click-once="disabled">取消转病区</span>
      </el-row>
      <!-- <el-row v-if="title === '转病区申请' && !echo.id">
        注：转病区后已分解未提交的执行单将自动作废，新病区可再次分解
      </el-row> -->
    </dialogCom>
  </div>
</template>
<script>
import dialogCom from './dialog.vue'
import api from '@/inpatient/store/resident.js'
export default {
  props: ['areaId', 'areaName', 'CHANGE_PROVIDER_KEY'],
  data () {
    return {
      api,
      title: '',
      visible: false,
      patient: {},
      print: false,
      showbtn: true,
      form: {
        providerId: '',
        areaId: ''
      },
      procviderOptions: [],
      areaOptions: [],
      rules: {
        providerId: [
          { required: true, message: '请选择目标科室', trigger: 'change', type: 'string' }
        ],
        areaId: [
          { required: true, message: '请选择目标病区', trigger: 'change', type: 'string' }
        ],
      },
      type: '',
      back: false,
      tableData: [],
      echo: {},
      advicesAndExecutes: [],
      infos: {},
      count: 0,
      disabled: false,
    }
  },
  components: {
    dialogCom
  },
  methods: {
    cellClick (row, column, cell, event) {
      this.$emit('adviceTurn', row, column, this.patient)
    },
    info (data) {
      this.infos = data
    },
    change (value) {
      this.form.areaId = ''
      this.getSickAreaListByCondition(value)
    },
    async getSickAreaListByCondition (tenantSubjectId) {  // 查询科室关联病区
      this.areaOption = []
      let res = await this.api.getSickAreaListByCondition({
        tenantSubjectId
      })
      this.areaOptions = res.data
    },
    async getTenantSubjectListHasStaffByCondition () {  // 查询全部住院科室
      let res = await this.api.getTenantSubjectListHasStaffByCondition({
        outSubjectGetTenantSubjectListByConditionReqDTO: {
          orgIdList: [this.$store.state.currentUser.organizationId],
          type2CodeList: ['01.01'],
          usePermissionStatus: 'Y'
        }
      })
      this.procviderOptions = []
      if (res.data && res.data.resultList) {
        this.procviderOptions = res.data.resultList || []
      }
    },
    async checkAdvicesAndExecutes () {
      let res = await this.api.checkAdvicesAndExecutes({
        hospitalizedNumber: this.patient.hospitalizedNumber
      })
      this.advicesAndExecutes = res.data || []
      let count = 0
      this.advicesAndExecutes.forEach(ele => {
        count += ele.waittingChekAdviceCount
        count += ele.waittingExecuteCount
        count += ele.executingAdviceCount
        count += ele.waittingSendDrugExecuteCount
        count += ele.returnDrugExecuteCount
        // if (this.type === 'transfer_area') {
        // }
      })
      this.count = count
    },
    open (patient, type) {
      this.visible = true
      this.type = type
      this.patient = JSON.parse(JSON.stringify(patient))
      this.getWaittingEntrance()
      this.checkAdvicesAndExecutes()
      if (type === 'transfer_provider') {
        this.title = '转科申请'
        this.getTenantSubjectListHasStaffByCondition()
      }
      if (type === 'transfer_area') {
        this.title = '转病区申请'
        this.getSickAreaListByCondition(patient.providerId)
      }
    },
    async getWaittingEntrance () {
      let res = await this.api.getWaittingEntrance({
        hospitalizedNumber: this.patient.hospitalizedNumber
      })
      this.echo = res.data || {}
      if (this.echo.id) {
        this.form.providerId = this.echo.providerId
        this.getSickAreaListByCondition(this.form.providerId)
        this.form.areaId = this.echo.areaId
        this.showbtn = false
      } else {
        this.showbtn = true
      }
    },
    getName (id) {
      let text = ''
      this.procviderOptions.forEach(ele => {
        if (id === ele.id) text = ele.tenantSubjectName
      })
      this.areaOptions.forEach(ele => {
        if (id === ele.id) text = ele.sickAreaName
      })
      return text
    },
    saveBefore () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.save()
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
    success () {
      this.$bus.$emit('global:listwating')
      this.$emit('success')
      this.visible = false
    },
    async save () {
      let obj = {
        patientId: this.patient.patientId,
        patientName: this.patient.patientName,
        hospitalizedNumber: this.patient.hospitalizedNumber,
        oldProviderName: this.patient.providerName,
        oldAreaName: this.areaName,
        areaId: this.form.areaId,
        areaName: this.form.areaId,
      }
      if (this.title === '转病区申请') {
        obj.providerId = this.patient.providerId
        obj.providerName = this.patient.providerName
        obj.source = '3'
      }
      if (this.title === '转科申请') {
        obj.providerId = this.form.providerId
        obj.providerName = this.getName(this.form.providerId)
        obj.source = '2'
      }
      let res = await this.api.change(obj).catch(_ => {
        this.success()
      })
      if (res.head && res.head.errCode === 0) {
        this.$notify({
          type: 'success',
          message: `${this.title}提交成功!`
        })
        this.success()
      } else {
        this.checkAdvicesAndExecutes()
      }
    },
    async cancle () {
      if (this.disabled) return
      let res = await this.api.cancelChange(this.patient).catch(_ => {
        this.success()
      })
      if (res.head && res.head.errCode === 0) {
        this.$notify({
          type: 'success',
          message: `取消${this.title}成功!`
        })
      }
      this.success()
    }
  }
}
</script>
<style lang='scss' scoped>
.transfer {
  /deep/ .tableheader {
    th {
      background-color: #f0f5fa;
    }
  }
  .active {
    color: #1c7bef;
    cursor: pointer;
  }
}
</style>
