<!-- 客服工作站 补卡换卡功能弹窗 by @liuyi@everjiankang.com.cn -->
<template>
  <div class="flex_column_full_hidden">
    <el-form class="flex_col_1_auto" size="small" :model="form" ref="form" label-width="92px" style="width:620px;">
      <el-form-item label="类型" class="checkbox-item" prop="cardType" :rules="rules.required">
        <el-radio-group v-model="form.cardType">
          <el-radio label="jiuzhenka">就诊卡</el-radio>
          <el-radio label="bingliben">病历本</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="就诊卡卡号" prop="visitType" :rules="rules.required">
          <el-select
            v-model="form.visitType"
            placeholder="请选择"
            style="width:100%;"
            :disabled="!form.cardType.includes('jiuzhenka')">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item, i) in visitCardTypeList"
              :key="i"
            ></el-option>
          </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="" label-width="5px" prop="visitNo" :rules="form.cardType === 'jiuzhenka' ? rules.required : rules.requiredNo">
            <el-input
              ref="cardNo"
              v-model="form.visitNo"
              placeholder="请输入新的就诊卡号"
              :maxlength="20"
              style="width:100%;"
              :disabled="!form.cardType.includes('jiuzhenka')"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注">
        <el-input
          v-model="form.comment"
          type="textarea"
          :rows="5"
          :maxlength="100"
          :disabled="!form.cardType.includes('jiuzhenka')"
        ></el-input>
      </el-form-item>
      <!--
      <el-form-item class="checkbox-item">
        <el-checkbox v-model="print">打印标签</el-checkbox>
      </el-form-item>
      -->
    </el-form>
    <div class="form_footer">
      <el-button type="primary" @click="bindCard(false)" :disabled="!form.id" v-if="form.cardType === 'jiuzhenka'">绑卡</el-button>
      <el-button type="primary" @click="bindCard(true)" :disabled="!form.id">{{form.cardType === 'jiuzhenka' ? '绑卡并缴费' : '收费'}}</el-button>
    </div>
  </div>
</template>
<script>
import api from '@/arrange/store/appointapi'
export default {
  props: ['patient', 'activeName'],
  data () {
    return {
      api,
      print: true,
      cardbookCode: 'thc_uo.patient_LNN_20180522',
      visitFirstType: '',
      visitCardTypeList: [],
      form: {
        id: '',
        cardType: 'jiuzhenka',
        visitNo: '',
        visitType: '',
        comment: ''
      },
      rules: {
        requiredNo: [
          {required: false}
        ],
        required: [
          { required: true, message: '必填项', trigger: ['change'] }
        ],
        requiredObject: [
          { required: true, message: '必填项', trigger: ['change'], type: 'object' }
        ],
        requiredArray: [
          { required: true, message: '必填项', trigger: ['change'], type: 'array' }
        ]
      }
    }
  },
  watch: {
    'patient' (val) {
      this.form.id = val.id
      // this.form.visitNo = val.visitNos ? val.visitNos[val.visitNos.length - 1] : ''
    },
    'form.visitType' (val) {
      if (this.form.cardType === 'jiuzhenka') {
        this.$nextTick(() => {
          this.$refs.cardNo.$el.querySelector('input').focus()
        })
      }
    },
    'form.cardType' (val) {
      if (val === 'jiuzhenka') {
        this.$nextTick(() => {
          this.$refs.cardNo.$el.querySelector('input').focus()
        })
      }
    },
    'activeName' (val) {
      if (this.form.cardType.includes('jiuzhenka')) {
        this.$nextTick(() => {
          this.$refs.cardNo.$el.querySelector('input').focus()
        })
      }
    }
  },
  created () {
    this.getVisitCardType()
    this.$bus.$on('cardbook:success', val => {
      this.reset()
    })
  },
  methods: {
    reset () {
      this.form = {
        id: this.patient.id,
        cardType: 'jiuzhenka',
        visitNo: '',
        visitType: this.visitFirstType,
        comment: ''
      }
      this.$nextTick(_ => {
        return this.$refs.form && this.$refs.form.clearValidate()
      })
    },
    bindCard (isPay) {
      if (this.form.cardType === 'jiuzhenka') {
        this.$refs.form.validate(valid => {
          if (!valid) {
            return false
          }
          if (isPay) {
            this.api.bindVisitCardNoPay(this.form).then(rs => {
              if (rs.head.errCode) {
                return false
              }
              rs.data.action = 'bindcard'
              this.$bus.$emit('appoint:pay', rs.data)
            })
            return false
          }
          this.api.bindVisitCardNo(this.form).then(rs => {
            if (rs.head.errCode) {
              return false
            }
            this.reset()
            this.$messageTips(this, 'success', '就诊卡已绑定', '绑定成功')
          })
        })
      }
      if (this.form.cardType === 'bingliben') {
        this.api.createRecordBookRcm({ patientId: this.patient.id, serviceCode: this.form.cardType }).then(rs => {
          if (rs.data) {
            rs.data.action = 'buybook'
            this.$bus.$emit('appoint:pay', rs.data)
          }
        })
      }
    },
    getVisitCardType () {
      this.api.getVisitCardType().then(rs => {
        if (rs.data[0]) {
          this.visitCardTypeList = rs.data
          this.form.visitType = rs.data[0].id
          this.visitFirstType = rs.data[0].id
        }
      })
    },
    cannelBind () {
      this.$emit('success', false)
    }
  }
}
</script>
<style scoped>
.form_footer{
  padding-top: 10px;;
  padding-left: 50px;
  border-top: 1px solid #eee;
}
.appoint /deep/ .el-dialog__body {
  padding-top: 0;
}
</style>
