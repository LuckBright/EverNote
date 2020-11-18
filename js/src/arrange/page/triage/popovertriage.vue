<template>
    <div>
    <el-popover
    placement="right"
    width="260"
    trigger="click"
    v-model="visible">
    <el-row class="lh40">
        <el-col :span="8">
           <div>手工分诊</div>
        </el-col>
    </el-row>
    <el-row class="lh40" :gutter="10">
        <el-col :span="6">
            <el-tooltip class="item" effect="dark" :content="data.row.patientName?data.row.patientName:''" placement="top">
                <div class="ellipsis">{{data.row.patientName}}</div>
            </el-tooltip>
        </el-col>
        <el-col :span="8">
          <el-tooltip class="item" effect="dark" :content="data.row.medicalRecordNumber?data.row.medicalRecordNumber:''" placement="top">
                <div class="ellipsis">{{data.row.medicalRecordNumber}}</div>
          </el-tooltip>
        </el-col>
        <el-col :span="8">当前序号{{(data.$index+1)}}</el-col>
    </el-row>
    <el-row class="lh40" :gutter="10">
        <el-col :span="8">排队人数{{num}}</el-col>
    </el-row>
    <el-form :model="obj" :rules="rules" ref="triageForm" label-width="0px" label-position="center">
        <el-row class="lh40">
        <el-col :span="20">
            <el-form-item label="" prop="sortNum">
                <el-input v-model="obj.sortNum" 
                onkeypress="return ((event.keyCode>=48 && event.keyCode<=57) || (event.keyCode>=96 && event.keyCode<=105))"
                placeholder="将患者分诊到第几位?"
                type="number">
                </el-input>
            </el-form-item>
        </el-col>
        </el-row>
        <el-row class="lh40">
            <el-col :span="20">
            <el-form-item>
                <div style="text-align:right;">
                    <el-button type="primary" @click="submitSort">确定</el-button>
                    <el-button @click="cancel">取消</el-button>
                </div>
            </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <el-button type="text" slot="reference" @click="visible = !visible">
      <i style='color:#1d7bf0;' class="iconfont icon-zhuyuan-yizhu-baogao"></i>
    </el-button>
    </el-popover>
    </div>
</template>
<script>
import api from '@/arrange/store/triageapi'
export default {
  props: ['data', 'num'],
  data () {
    let validateSortNum = function (rule, value, callback) {
      if (!value) {
        callback(new Error('必填'))
      } else if (value <= 1 || value > 999) {
        callback(new Error('区间为2-999'))
      } else {
        callback()
      }
    }
    return {
      api,
      visible: false,
      validateSortNum: validateSortNum,
      rules: {
        sortNum: [
            {required: true, trigger: 'blur', validator: validateSortNum}
        ]
      },
      obj: {
        sortNum: ''
      }
    }
  },
  methods: {
    submitSort () {
      this.$refs.triageForm.validate((valid) => {
        let params = {
          doctorId: this.data.row.doctorId,
          appointmentId: this.data.row.appointmentId,
          num: this.obj.sortNum
        }
        if (valid) {
          this.api.getTriage(params).then(rs => {
            if (!rs.head.errCode) {
              this.$notify({
                title: '提示',
                type: 'success',
                message: '分诊成功',
                duration: 2000
              })
              this.$emit('getData')
              this.visible = false
              this.obj.sortNum = ''
            }
          })
        }
      })
    },
    cancel () {
      this.visible = false
    }
  }
}
</script>
<style scoped>
.ellipsis {
   overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
}
.lh40{min-height:30px;}
</style>
