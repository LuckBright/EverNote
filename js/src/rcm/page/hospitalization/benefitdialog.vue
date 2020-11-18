<template>
  <div>
    <ever-form2 :schema="querySchema" v-model="queryObj" ref="form" :is-query="true" @query="query">
      <template slot="totalFee">
        ￥{{queryObj.totalFee | formatToFinacial}}
      </template>
      <template slot="actuallyFee">
        ￥{{queryObj.actuallyFee | formatToFinacial}}
      </template>
      <template slot="benefitFee">
        ￥{{queryObj.benefitFee | formatToFinacial}}
      </template>
      <template slot="remark">
        <el-autocomplete
          v-model="queryObj.remark"
          :fetch-suggestions="getRemarkByPerson"
          :placeholder="'请选择或输入打折备注'"
          style="width:100%;"
        >
          <template slot-scope="scope">
            <span class="option-field">
              {{ scope.item.reason }}
            </span>
          </template>
        </el-autocomplete>
      </template>
      <template slot="buttons">
        <el-button type="primary" plain @click="cancel">取消</el-button>
        <el-button type="primary" @click="handleEnsure">确定</el-button>
      </template>
      <div></div>
    </ever-form2>
  </div>
</template>
<script>
import {
  getFeeClassByIpNo,
  getChargeLevels,
  updateDetailDisount
} from '@/rcm/store/hospital/hospital'
import {getDiscountList, getRemarkByPerson} from '../../store/bizdict/bizdict'
let querySchema = [
  {
    label: '费用类别',
    name: 'itemClass',
    comp: 'ever-select',
    props: {
      placeholder: '请选择费用类别',
      options: []
    },
    span: 24
  },
  {
    label: '费用性质',
    name: 'medChargeLevel',
    comp: 'ever-select',
    props: {
      placeholder: '请选择费用性质',
      options: []
    },
    span: 24
  },
  {
    label: '应收合计',
    name: 'totalFee',
    comp: 'custom',
    span: 12
  },
  {
    label: '实收合计',
    name: 'actuallyFee',
    comp: 'custom',
    span: 12
  },
  {
    label: '优惠比例',
    name: 'discount',
    comp: 'ever-price',
    props: {
      type: 'number',
      append: '%',
      placeholder: '请填写优惠比例'
    },
    span: 12
  },
  {
    label: '优惠金额',
    name: 'benefitFee',
    comp: 'custom',
    span: 12
  },
  {
    label: '打折人',
    name: 'discountStaff',
    comp: 'ever-select',
    props: {
      placeholder: '请选择打折人',
      options: []
    },
    span: 12
  },
  {
    label: '打折备注',
    name: 'remark',
    comp: 'custom',
    props: {
      placeholder: '请填写打折备注'
    },
    span: 12
  },
  {
    label: '',
    name: 'buttons',
    comp: 'custom',
    col: {
      style: 'text-align:right;'
    },
    span: 24
  }
]
export default {
  props: ['discountObj'],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.totalFee = this.discountObj.unPageBills.reduce((sum, item) => {
      sum += item.fee
      return sum
    }, 0)
    return {
      querySchema: querySchema,
      queryObj: queryObj
    }
  },
  created () {
    // 获取费用类别列表
    let params = {
      ipNo: this.discountObj.ipNo
    }
    getFeeClassByIpNo(params).then(res => {
      if (res.head && res.head.errCode === 0) {
        let options = []
        res.data.forEach((v, i) => {
          options.push({id: v.itemClass, name: v.itemClassName})
        })
        this.$ever.getFieldFromSchema(querySchema, 'itemClass').props.options = options
      }
    })
    // 获取费用性质列表
    getChargeLevels(params).then(res => {
      if (res.head && res.head.errCode === 0) {
        let options = []
        res.data.forEach((v, i) => {
          options.push({id: v.code, name: v.name})
        })
        this.$ever.getFieldFromSchema(querySchema, 'medChargeLevel').props.options = options
      }
    })
    // 获取可用打折人列表
    getDiscountList({status: 1}).then(res => {
      let personList = []
      for (let item of res.data) {
        personList.push({id: item.id, name: item.name})
      }
      this.$ever.getFieldFromSchema(this.querySchema, 'discountStaff').props.options = personList
    })
  },
  watch: {
    'queryObj.discountStaff': {
      handler: function (val) {
        getRemarkByPerson({discountStaffId: this.queryObj.discountStaff}).then(res => {
          if (res.data && res.data.length > 0) {
            console.log('进来了吗？')
            this.queryObj.remark = res.data && res.data[0].reason
          }
        })
      }
    }
  },
  methods: {
    query () {
      let filterArr = this.discountObj.unPageBills
      // 根据费用类别过滤
      if (this.queryObj.itemClass) {
        filterArr = this.discountObj.unPageBills.filter((v) => (Number(v.itemClass) === Number(this.queryObj.itemClass)))
      }
      // 过滤收费等级
      if (this.queryObj.medChargeLevel) {
        filterArr = filterArr.filter((v) => (Number(v.medChargeLevel) === Number(this.queryObj.medChargeLevel)))
      }
      // 计算应收
      this.queryObj.totalFee = filterArr.reduce((sum, item) => {
        sum += item.fee
        return sum
      }, 0)
      // 计算实收
      this.queryObj.actuallyFee = (this.queryObj.totalFee * Number(this.queryObj.discount) / 100).toFixed(2)
      // 计算优惠
      this.queryObj.benefitFee = (this.queryObj.totalFee - this.queryObj.actuallyFee).toFixed(2)
    },
    cancel () {
      this.$emit('cancel')
    },
    handleEnsure () {
      if (!this.queryObj.discount) {
        this.queryObj.discount = 100
      }
      let params = {
        ipNo: this.discountObj.ipNo,
        discount: (this.queryObj.discount / 100).toFixed(2),
        itemClass: this.queryObj.itemClass,
        medChargeLevel: this.queryObj.medChargeLevel,
        discountStaff: this.queryObj.discountStaff,
        remark: this.queryObj.remark
      }
      updateDetailDisount(params).then(res => {
        if (res.head && res.head.errCode === 0) {
          this.$messageTips(this, 'success', '操作成功')
          this.empotyData()
          this.$emit('benefitEnsure', this.queryObj)
        }
      })
    },
    getRemarkByPerson (querystring, cb) {
      var results = []
      getRemarkByPerson({discountStaffId: this.queryObj.discountStaff}).then(res => {
        res.data.forEach((item, i) => {
          item.value = item.reason
          results.push(item)
        })
      })
      console.log(results)
      cb(results)
    },
    empotyData () {
      this.queryObj.itemClass = ''
      this.queryObj.medChargeLevel = ''
      this.queryObj.discount = ''
      this.queryObj.remark = ''
      this.queryObj.discountStaff = ''
      this.queryObj.remark = ''
      this.query()
    }
  }
}
</script>
<style scoped>
.containHeight .el-header .el-form{
  border-bottom: none;
}
</style>

