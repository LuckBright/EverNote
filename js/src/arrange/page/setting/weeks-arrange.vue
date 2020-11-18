<template>
  <div id="copytimetrunk">
    <el-dialog title="生成排班" :visible.sync="dialogVisible" class="ui_dialog_02 dialog_tab spe">
      <el-form :model="form" :rules="rules" ref="form" class="form">
        <el-row>
          <el-col :span="14">
            <el-form-item prop="timearrange">
              <el-date-picker
                v-model="form.timearrange"
                type="daterange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-button type="primary" @click="onSearch" icon="el-icon-search">查询</el-button>
          </el-col>
        </el-row>
        <el-row>
          <span>影响预约:</span>
          <span>{{YY}}</span>
          <span class="mgl">影响挂号:</span>
          <span>{{GH}}</span>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button @click="send" type="primary">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import api from '@/arrange/store/appointapi'
export default {
  props: ['searchinfo'],
  data () {
    return {
      api,
      YY: '',
      GH: '',
      dialogVisible: false,
      form: {
        timearrange: ''
      },
      rules: {
        timearrange: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    onSearch () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let parms = {
            deptId: this.searchinfo.deptId,
            organId: this.searchinfo.organId,
            templetId: this.searchinfo.templetId,
            resourceName: this.searchinfo.resourceName,
            startDate: moment(this.form.timearrange[0]).format('YYYY-MM-DD'),
            endDate: moment(this.form.timearrange[1]).format('YYYY-MM-DD')
          }
          this.api.coutWeekArrangeImpactAppointment(parms).then((rs) => {
            console.log(rs)
            this.YY = rs.data.YY
            this.GH = rs.data.GH
          })
        }
      })
    },
    send () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let parms = {
            deptId: this.searchinfo.deptId,
            organId: this.searchinfo.organId,
            templetId: this.searchinfo.templetId,
            resourceName: this.searchinfo.resourceName,
            startDate: moment(this.form.timearrange[0]).format('YYYY-MM-DD'),
            endDate: moment(this.form.timearrange[1]).format('YYYY-MM-DD')
          }
          this.api.publishWeekArrange(parms).then((rs) => {
            if (rs && rs.head.errCode === 0) {
              this.$notify({
                type: 'success',
                title: '成功',
                message: '排班成功'
              })
              this.close()
            }
          })
        }
      })
    },
    close () {
      this.dialogVisible = false
    }
  },
  watch: {
    dialogVisible (val) {
      if (!val) {
        this.form.timearrange = ''
        this.YY = ''
        this.GH = ''
      }
    }
  }
}
</script>
<style scoped>
.form {
  padding-left: 40px;
}
.form span {
  color: orange;
}
.mgl {
  margin-left: 40px;
}
</style>
