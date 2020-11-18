<template>
  <div class="leave">
    <dialogCom v-model='visible' title='外出管理' :hospitalizedNumber='patient.hospitalizedNumber' @save='save'>
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
          <el-form-item label="离院时间:" prop="outTime">
            <el-date-picker
              :disabled="back"
              class="wb100"
              v-model="form.outTime"
              type="datetime"
              format='yyyy-MM-dd HH:mm'
              value-format='yyyy-MM-dd HH:mm:ss'
              placeholder="请选择离院时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="外出原因:" prop="outReason">
            <el-select filterable clearable placeholder="请选择" class="wb100" v-model="form.outReason" value-key="doctorId"  :disabled="back">
              <el-option
                v-for="item in reasonArr"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注:" prop="description">
            <el-input
            :disabled="back"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            maxlength="200"
            placeholder="请输入内容"
            v-model="form.description">
            </el-input>
          </el-form-item>
          <el-form-item label="返院时间:" prop="backTime" v-if='back'>
            <el-date-picker
              class="wb100"
              v-model="form.backTime"
              type="datetime"
              format='yyyy-MM-dd HH:mm'
              value-format='yyyy-MM-dd HH:mm:ss'
              placeholder="请选择离院时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <el-table
          border
          header-row-class-name='tableheader'
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="outTime"
            label="离院时间">
            <template slot-scope="scope">
              <span>{{scope.row.outTime | formatDateByExp('MM-DD HH:mm')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="outReason"
            label="外出原因">
            <template slot-scope="scope">
              <sys-value  type="THC_CPOE_WCYY" :code="scope.row.outReason"></sys-value>
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            show-overflow-tooltip
            label="备注">
          </el-table-column>
          <el-table-column
            prop="backTime"
            label="返院时间">
            <template slot-scope="scope">
              <span>{{scope.row.backTime | formatDateByExp('MM-DD HH:mm')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="recorderName"
            label="操作人">
          </el-table-column>
        </el-table>
    </dialogCom>
  </div>
</template>
<script>
import dialogCom from './dialog.vue'
import sysvalue from '@/warehouse/store/sysvalueapi'
import api from '@/inpatient/store/resident.js'
export default {
  data () {
    return {
      api,
      visible: false,
      patient: {},
      form: {
        outTime: '',
        backTime: '',
        outReason: '',
      },
      reasonArr: [],
      rules: {
        outTime: [
          { required: true, message: '请选择离院时间', trigger: 'change', type: 'string' }
        ],
        outReason: [
          { required: true, message: '请选择外出原因', trigger: 'change', type: 'string' }
        ],
        backTime: [
          { required: true, message: '请选择返院时间', trigger: 'change', type: 'string' }
        ],
      },
      back: false,
      tableData: [],
      obj: {},
    }
  },
  watch: {

  },
  components: {
    dialogCom
  },
  created () {

  },
  methods: {
    open (patient) {
      this.visible = true
      this.getReason()
      this.patient = JSON.parse(JSON.stringify(patient))
      this.getList()
    },
    async getList () {
      let res = await this.api.getLatelyLeaveAndList({
        hospitalizedNumber: this.patient.hospitalizedNumber
      })
      if (res.data) {
        this.obj = res.data
        if (res.data.id) {
          this.back = true
          this.form.backTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
          this.form.outTime = this.$moment(res.data.outTime).format('YYYY-MM-DD HH:mm:ss')
          this.form.outReason = res.data.outReason
          this.form.description = res.data.description
        } else {
          this.form.outTime = this.$moment().format('YYYY-MM-DD HH:mm:ss')
          this.rules.backTime = null
        }
        this.tableData = res.data.listLeave || []
      }
    },
    async save () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          let res = {}
          let str = ''
          if (this.obj.id) {
            res = await this.api.updateLeave({
              id: this.obj.id,
              hospitalizedNumber: this.patient.hospitalizedNumber, // string 非必须住院号
              backTime: this.form.backTime, // string 非必须离院时间
              bedId: this.patient.bedId,
            })
              .catch(() => {
                this.$emit('success')
                this.visible = false
              })
            str = '返院提交成功!'
          } else {
            res = await this.api.createLeave({
              patientId: this.patient.patientId, // string 非必须患者id
              patientName: this.patient.patientName, // string 非必须患者姓名
              bedId: this.patient.bedId,
              hospitalizedNumber: this.patient.hospitalizedNumber, // string 非必须住院号
              opType: '1', // string 非必须操作类型 1 外出 2 返回
              outTime: this.form.outTime, // string 非必须离院时间
              outReason: this.form.outReason, // string 非必须外出原因
              description: this.form.description, // string 非必须备注/描述
            })
              .catch(() => {
                this.$emit('success')
                this.visible = false
              })
            str = '外出申请提交成功!'
          }
          if (res.head && res.head.errCode === 0) {
            this.$notify({
              type: 'success',
              message: str
            })
            this.$bus.$emit('global:listwating')
            this.$emit('success')
            this.visible = false
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
    getReason () {
      sysvalue.listOnce('THC_CPOE_WCYY').then(res => {
        this.reasonArr = res
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.leave {
  .wb100 {
    width: 100%;
  }
}
</style>
