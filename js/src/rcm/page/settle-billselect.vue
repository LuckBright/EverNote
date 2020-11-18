<template>
  <div>
    <ever-query-form :schema="querySchema" v-model="queryObj" @query="query"></ever-query-form>
    <div v-for="(v, k, index) in tableData" style="margin-bottom: 30px" class="settle-item">
      <hr v-if="v[0].isNewRoot">
      <div v-if="v[0].isNewRoot">
        <h5>
          <span style="margin-right: 20px">患者档案号: {{tableData[k][0].patientid}}</span>
          <span style="margin-right: 20px">患者姓名: {{tableData[k][0].patientName}}</span>
          <span style="margin-right: 20px">流水号: {{tableData[k][0].rootorderid}}</span>
          <span v-for="field in schema" style="margin-right: 20px">
            <label>{{field.label}}:</label>
            <span>{{tableData[k][0][field.name] || '无'}}</span>
          </span>
        </h5>
      </div>
      <div>
        <el-checkbox
          v-model="selected[k]"
          :disabled="obj.id ? true : false"
          @change="checkSelect(k, selected[k])"
        >
          <span style="margin-right: 20px">订单: {{tableData[k][0].accountbillId}}</span>
        </el-checkbox>
        <span style="margin-right: 20px">单据类型: {{orderType[tableData[k][0].ordertype.toString()]}}</span>
      </div>
      <settlementitem :items="tableData[k]" style="margin-bottom: 30px"></settlementitem>
    </div>
    <p v-if="!Object.keys(tableData).length">无</p>
    <el-button @click="goSettle()" :disabled="!selectedItems.length">结算</el-button>
  </div>
</template>
<script>
import accountbill from '../store/accountbillapi'
import api from '../store/settlementapi'
import settlementitem from './settlementitem'
import list from '../../util/list'

let emptyDetail = {
  settlementCouponDet: [],
  settlementMemberDet: [],
  settlementComInsurDet: [],
  settlementDetail: []
}
let querySchema = [
  {
    name: 'patientID',
    label: '患者',
    type: 'patientselect'
  },
  {
    name: 'rangeDate',
    type: 'date',
    dateType: 'daterange',
    label: '就诊日期',
    outformat: 'YYYY-MM-DD'
  },
  {
    name: 'orderStatus',
    label: '订单状态',
    options: [
      {
        id: 0,
        name: '已下单'
      },
      {
        id: 1,
        name: '执行中'
      },
      {
        id: 2,
        name: '已完成'
      }
    ],
    type: 'select'
  }
]
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    // queryObj.rangeDate = []
    return {
      api: accountbill,
      querySchema,
      queryObj,
      orderType: {
        '0': '普通单据',
        '1': '预付类订单',
        '2': '退单',
        '3': '挂号'
      },
      obj: {
        tableData: {},
        patientid: '',
        paymentPlan: '默认方案',
        feeType: [],
        details: JSON.parse(JSON.stringify(emptyDetail))
      },
      schema: [
        {
          name: 'billdate',
          label: '就诊时间'
        },
        {
          name: 'name',
          label: '科室'
        },
        {
          name: 'doctorName',
          label: '医生'
        }
      ],
      selected: {},
      preobj: { details: JSON.parse(JSON.stringify(emptyDetail)) },
      pagesize: 100
    }
  },
  methods: {
    afterList () {
      Object.keys(this.tableData).forEach(v => {
        this.$set(this.selected, v, false)
      })
    },
    checkSelect (billid, selected) {
      console.log(billid, selected)
      let items = []
      for (let k in this.tableData) {
        if (this.selected['' + k]) {
          items = items.concat(this.tableData['' + k])
        }
      }
      let ids = items.map(v => v.patientid)
      if (ids.length) {
        for (let i = 1; i < ids.length; i++) {
          if (ids[i] !== ids[i - 1]) {
            this.$messageTips(this, 'warning', '不能同时对多个用户进行结算')
            this.selected[billid] = false
            return
          }
        }
      }
    },
    goSettle () {
      this.obj.patientid = this.selectedItems[0].patientid
      api.createOrUpdate(this.obj, this.selectedItems, this.preobj).then(result => {
        let id = result.data.split(',')[1]
        api.calculate(id).then(_ => {
          this.$router.push('/rcm/settlements/' + id)
        })
      })
    }
  },
  components: {
    settlementitem
  },
  computed: {
    selectedItems: function () {
      let arr = []
      Object.keys(this.selected).forEach(v => {
        if (this.selected[v]) {
          arr = arr.concat(this.tableData[v])
        }
      })
      return arr
    }
  },
  mixins: [list]
}
</script>
