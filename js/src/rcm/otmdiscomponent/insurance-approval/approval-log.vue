<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="80%" :close-on-click-modal="false">
    <div class="head-info">
      <div>姓名：{{headInfo.personname}}</div>
      <div>性别：{{headInfo.sex | formatSex}}</div>
      <div>出生日期：{{headInfo.birthday && $moment(String(headInfo.birthday).substring(0, 8)).format('YYYY-MM-DD')}}</div>
      <div>个人编号：{{headInfo.personno}}</div>
      <div>身份证号：{{headInfo.idno}}</div>
    </div>
    <ever-form2
        :schema="schema"
        v-model="obj"
        ref="form"
        :span="12"
        :rules="rules"
      >
      <div class="main-option">
      </div>
    </ever-form2>
    <div v-if="type !== 'check'" slot="footer">
      <el-button type="primary" size="small" @click="submit">确定</el-button>
      <el-button size="small" @click="dialogVisible=false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  reportSerious,
  reportChronic
} from '@/rcm/store/otmdiscomponent/insurance-approval-api'
import medicalDiagnose from '@/rcm/otmdiscomponent/medicaldiagnose.vue'
let schema = [
  {
    label: '审批类别',
    name: 'approveType',
    comp: 'ever-select',
    props: {
      options: [{
        id: '12',
        name: '门诊大病'
      },
      {
        id: '11',
        name: '门诊慢病'
      }]
    },
    span: 8
  },
  {
    label: '疾病名称',
    name: 'diseaseNameObj',
    comp: medicalDiagnose,
    props: {
      insuranceOrgId: '307cb17330944ff5ba1969453eb92f82'
    },
    span: 16
  },
  {
    label: '审批编号',
    name: 'approveNo',
    props: {
      disabled: true
    },
    span: 8
  },
  {
    label: '开始日期',
    name: 'startDay',
    comp: 'date-picker',
    props: {
      outformat: 'yyyy-MM-dd'
    },
    span: 8
  },
  {
    label: '结束日期',
    name: 'endDay',
    comp: 'date-picker',
    props: {
      outformat: 'yyyy-MM-dd'
    },
    span: 8
  },
  {
    label: '诊断科室意见',
    name: 'reason',
    props: {
      type: 'text'
    },
    span: 24
  },
  {
    label: '诊断医生',
    name: 'doctor',
    span: 24
  },
  {
    label: '医保科意见',
    name: 'opinion',
    comp: 'textarea',
    span: 24
  },
  {
    label: '审批医院编码',
    name: 'hospitalCode',
    props: {
      disabled: true
    },
    span: 8
  },
  {
    label: '医院等级',
    name: 'hospitalLevel',
    props: {
      disabled: true
    },
    span: 8
  },
  {
    label: '备注',
    name: 'remark',
    comp: 'textarea',
    span: 24
  },
  {
    label: '经办人',
    name: 'approvePerson',
    span: 8
  },
  {
    label: '经办日期',
    name: 'approveTime',
    comp: 'date-picker',
    props: {
      outformat: 'yyyy-MM-dd'
    },
    span: 8
  },
  {
    label: '有效标识',
    name: 'isValid',
    comp: 'ever-select',
    props: {
      disabled: true,
      options: [{
        id: '1',
        name: '有效'
      }]
    },
    span: 8
  }
]
export default {
  components: {medicalDiagnose},
  props: ['headInfo', 'type', 'data'],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    obj.hospitalLevel = '一级甲等'
    obj.isValid = '1'
    obj.diseaseNameObj = {}
    return {
      obj,
      schema,
      dialogVisible: false,
      title: '审批上报',
      rules: {
        'diseaseNameObj': [{ required: true, message: '必填项', trigger: 'blur' }]
      },
    }
  },
  methods: {
    submit () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            macId: this.macId,
            personno: this.headInfo.personno,
            insuranceOrgId: '307cb17330944ff5ba1969453eb92f82',
            ...this.obj
          }
          params.diseaseName = params.diseaseNameObj.name
          params.diseaseCode = params.diseaseNameObj.id
          delete params.diseaseNameObj
          let url = this.obj.approveType === '12' ? reportSerious : reportChronic
          url(params).then(rs => {
            if (!rs.head.errCode) {
              this.$messageTips(this, 'success', '上报成功')
              this.dialogVisible = false
              this.$emit('success')
            } else {
              this.$messageTips(this, 'error', '上报失败')
            }
          }).catch(rj => {
            this.$messageTips(this, 'error', '上报失败')
          })
        }
      })
    },
    empty () {
      this.$refs.form.$refs.form.resetFields()
    }
  },
  watch: {
    'dialogVisible': {
      handler (val) {
        if (val) {
          if (this.type !== 'add') {
            this.headInfo.personname = this.data.approvePerson
            this.headInfo.sex = this.data.sex
            this.headInfo.birthday = this.data.birthDay
            this.headInfo.personno = this.data.personno
            this.headInfo.idno = this.data.idno
            for (let key in this.obj) {
              if (key === 'diseaseNameObj') {
                this.obj.diseaseNameObj = {id: this.data.diseaseCode, name: this.data.diseaseName}
              } else {
                this.obj[key] = this.data[key]
              }
            }
          }
          this.title = this.type === 'add' ? '审批上报' : this.type === 'check' ? '查看审批上报信息' : '修改审批上报信息'
        } else {
          this.empty()
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .head-info {
    margin:20px 0 20px 50px;
    div {
      display: inline-block;
      margin-right: 20px;
    }
  }
</style>
