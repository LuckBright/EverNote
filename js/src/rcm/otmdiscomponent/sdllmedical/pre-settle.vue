<template>
  <el-dialog
    title="医保结算返回信息"
    :visible.sync="v"
    :modal-append-to-body="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    v-loading="loading"
  >
    <ever-form2 labelWidth="150px" :span="12" :schema="schema" v-model="queryObj">
      <template slot="xm">
        <readonlyitem v-model="xmAndSex"></readonlyitem>
      </template>
      <template slot="bjxj">
        <readonlyitem v-model="bjxj"></readonlyitem>
      </template>
      <template slot="xfhzhye">
        <readonlyitem v-model="xfhzhye"></readonlyitem>
      </template>
      <span></span>
    </ever-form2>
    <div slot="footer">
      <el-button type="primary" size="small" @click="continueSettle">继续结算</el-button>
      <el-button size="small" @click="cancel">取消结算</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getMedicalResultBySettlementId } from '@/rcm/store/outpatient/outpatient.js'
const schema = [{
  label: '姓  名:',
  name: 'xm',
  comp: 'custom',
},
{
  label: '身份证号码:',
  name: 'sfzhm',
  comp: 'readonlyitem'
},
{
  label: '医保卡号:',
  name: 'ybkh',
  comp: 'readonlyitem'
},
{
  label: '单位名称:',
  name: 'dwmc',
  comp: 'readonlyitem'
},
{
  label: '经办机构:',
  name: 'jbjg',
  comp: 'readonlyitem'
},
{
  label: '卡余额:',
  name: 'zhye',
  comp: 'readonlyitem'
},
{
  label: '本年进入统筹额度:',
  name: 'bnynrtcfw',
  comp: 'readonlyitem'
},
{
  label: '本次进入统筹额度:',
  name: 'bcnrtcfw',
  comp: 'readonlyitem'
},
{
  label: '本次总费用:',
  name: 'zje',
  comp: 'readonlyitem'
},
{
  label: '本次起付线:',
  name: 'bcqfx',
  comp: 'readonlyitem'
},
{
  label: '统筹支付:',
  name: 'tczf',
  comp: 'readonlyitem'
},
{
  label: '大额支付:',
  name: 'dezf',
  comp: 'readonlyitem'
},
{
  label: '医疗补助金额:',
  name: 'ylbzje',
  comp: 'readonlyitem'
},
{
  label: '医疗减免金额:',
  name: 'fpryyljgjm',
  comp: 'readonlyitem'
},
{
  label: '其他统筹支付:',
  name: 'qttczf',
  comp: 'readonlyitem'
},
{
  label: '暂缓(灰名单)支付:',
  name: 'zhzf',
  comp: 'readonlyitem'
},
{
  label: '个人负担总额:',
  name: 'brfdje',
  comp: 'readonlyitem'
},
{
  label: '个人账户支付:',
  name: 'grzhzf',
},
{
  label: '补缴现金:',
  name: 'bjxj',
  comp: 'custom'
},
{
  label: '消费后账户余额:',
  name: 'xfhzhye',
  comp: 'custom'
}]
export default {
  props: {
    presettleVisible: {
      type: Boolean,
      default: false
    },
    settlementId: {
      type: String,
      default: ''
    }
  },
  data () {
    const queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      queryObj,
      loading: false,
    }
  },
  computed: {
    v: {
      get () {
        return this.presettleVisible
      },
      set (val) {
        this.$emit('update:presettleVisible', val)
      }
    },
    xmAndSex () {
      return this.queryObj.xm + '  ' + this.$filters.formatSex(this.queryObj.xb)
    },
    // 消费后账户余额
    xfhzhye () {
      const left = this.queryObj.zhye - this.queryObj.grzhzf
      return left > 0 ? left : 0
    },
    // 补缴现金计算公式
    bjxj () {
      const bjxj = this.queryObj.brfdje - this.queryObj.grzhzf
      return bjxj > 0 ? bjxj : 0
    }
  },
  methods: {
    continueSettle () {
      this.$emit('continueSettle', { settlementId: this.settlementId, personAccountFee: +this.queryObj.grzhzf })
      this.v = false
    },
    cancel () {
      this.v = false
    },
    getPreSettle () {
      let params = { settlementId: this.settlementId }
      getMedicalResultBySettlementId(params).then(res => {
        Object.assign(this.queryObj, res.data)
      }).catch((err) => {
        console.log('err', err)
      })
    }
  },
  mounted () {
    this.getPreSettle()
  }
}
</script>
