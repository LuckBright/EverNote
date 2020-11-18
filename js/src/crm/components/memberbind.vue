<template>
  <div class="flex_column_full_hidden">
    <ever-form2
      :schema="schema"
      v-model="obj"
      :span="24"
      :api="api"
      :rules="rules"
      @objsaved="afterSave()"
      class="flex_col_1_auto memform"
      label-width="80px">
      <div slot="default"></div>
      <template slot="type">
        <el-select v-model="obj.benefitId" placeholder="请选择" :clearable="true">
          <el-option
            v-for="item in benefitOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
      <template slot="pointsChange">
        <el-select v-model="obj.visitType" placeholder="请选择" :clearable="true">
          <el-option
            v-for="item in cardtype"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-input v-model="obj.visitNo" class="wid2"></el-input>
      </template>
      <template slot="print">
        <el-checkbox v-model="obj.print"></el-checkbox><span>打印标签</span>
      </template>
    </ever-form2>
    <div class="form_footer">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>
<script>
import api from '@/crm/store/integralapi'
import {everprint} from '@/util/common'
let schema = [
  {
    name: 'identity',
    label: '当前',
    comp: 'readonlyitem'
  },
  {
    name: 'type',
    label: '会员',
    comp: 'custom'
  },
  {
    name: 'pointsChange',
    label: '卡号',
    comp: 'custom'
  },
  {
    name: 'print',
    comp: 'custom'
  }
]
export default {
  props: ['patientId'],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    obj.print = true
    return {
      api,
      obj,
      schema,
      radio: '1',
      rules: {
        benefitId: [
          { required: true, message: '请选择国籍', trigger: 'change' }
        ]
      },
      benefitOptions: [],
      cardtype: [],
      baseCode: 'CUSTOMER_LABEL_MEMBER'
    }
  },
  watch: {
    'patientId' (val) {
      if (val) {
        this.getBenefit()
      } else {
        this.reset()
      }
    }
  },
  created () {
    this.getBenefit()
    this.getAvailable()
    this.getCardType()
  },
  methods: {
    getAvailable () {
      api.getAvailable().then(rs => {
        if (rs.head.errCode === 0) {
          this.benefitOptions = rs.data
        }
      })
    },
    getCardType () {
      api.getCardType().then(rs => {
        if (rs.head.errCode === 0) {
          this.cardtype = rs.data
        }
      })
    },
    getBenefit () {
      this.patientId && api.getBenefit({'patientId': this.patientId}).then(rs => {
        if (rs.head.errCode === 0) {
          this.obj.identity = rs.data && rs.data[0].benefit.name
        }
      })
    },
    save () {
      this.obj.id = this.patientId
      api.changeVisitNo(this.obj).then(rs => {
        if (rs.head.errCode === 0) {
          this.getBenefit()
          this.obj.benefitId = ''
          this.obj.visitType = ''
          this.obj.visitNo = ''
          if (this.obj.print) {
            everprint(this.baseCode, { patientId: this.patientId }, {
              preview: true,
              cb: _ => {
                console.log('打印完成')
              },
              lang: '01'
            })
          }
          this.$messageTips(this, 'success', '添加会员身份成功')
        }
      })
    },
    reset () {
      this.obj.benefitId = ''
      this.obj.visitType = ''
      this.obj.visitNo = ''
      this.obj.print = ''
    }
  }
}
</script>
<style lang="scss" scoped>
  .form_footer{
    padding-top: 10px;;
    padding-left: 80px;
    border-top: 1px solid #eee;
  }
  .wid2{width:171px;}
  .mgl60{margin-left:60px;}
  .memform /deep/ .el-form-item{margin-bottom: 10px;}
</style>
