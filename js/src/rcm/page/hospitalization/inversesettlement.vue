<template>
  <div>
    <ever-form2
      ref="form"
      :schema="schema"
      v-model="queryObj"
      label-position="left"
      :is-query="true"
      @query="list()"
      class="chargedetailform"
    >
      <template slot="itemId">
        <el-select v-model="queryObj.itemId" style="width:100%" clearable @change="list()">
          <el-option
            v-for="item in itemNameList"
            :key="item.itemId"
            :label="item.itemName"
            :value="item.itemId"
          ></el-option>
        </el-select>
      </template>
      <template slot="discount">
        <ever-price
          v-model="queryObj.discount"
          :placeholder="'折扣汇总金额'"
          :append="'元'"
          :type="'number'"
        ></ever-price>
      </template>
      <template slot="btninverse">
        <el-button @click="handleInverse">单价反算</el-button>
      </template>
      <template slot="btnback">
        <el-button @click="list()">查询</el-button>
      </template>
      <!--消除默认的按钮-->
      <div></div>
    </ever-form2>
    <el-table :data="tableData"  style="width: 100%">
      <el-table-column label="项目名称" prop="itemName"></el-table-column>
      <el-table-column label="业务分类" prop="itemClassName"></el-table-column>
      <el-table-column label="单位" prop="unit"></el-table-column>
      <el-table-column label="数量" prop="quantity"></el-table-column>
      <el-table-column label="单价" prop="unitPrice"></el-table-column>
      <el-table-column label="金额" prop="fee"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import api from '../../store/hospitalization/inversesettlement.js'
let schema = [
  {
    label: '项目名称',
    name: 'itemId',
    comp: 'custom',
    props: {
      placeholder: '请输入项目名称'
    },
    span: 8,
    labelWidth: '80px'
  },
  {
    label: '',
    name: 'totalFee',
    comp: 'ever-price',
    props: {
      placeholder: '汇总金额',
      type: 'number',
      append: '元',
      disabled: true
    },
    span: 5,
    labelWidth: '20px'
  },
  {
    name: 'discount',
    comp: 'custom',
    props: {
      placeholder: '折扣汇总金额',
      append: '元',
      type: 'number'
    },
    span: 5,
    labelWidth: '20px'
  },
  {
    name: 'btninverse',
    comp: 'custom',
    span: 2,
    labelWidth: '20px'
  },
  {
    name: 'btnback',
    comp: 'custom',
    span: 2,
    labelWidth: '40px'
  }
]
export default {
  props: ['obj'],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schema: schema,
      queryObj: queryObj,
      tableData: [],
      itemNameList: []
    }
  },
  created () {
    let params = {
      settlementId: this.obj.settlementId,
      itemId: ''
    }
    api.getInverseInfo(params).then(result => {
      this.itemNameList = result.data
      this.tableData = result.data
    })
  },
  methods: {
    list () {
      this.queryObj.totalFee = ''
      let params = {
        settlementId: this.obj.settlementId,
        itemId: this.queryObj.itemId
      }
      api.getInverseInfo(params).then(result => {
        if (result.head && result.head.errCode === 0) {
          this.tableData = result.data
          // 将选中项目名称原总额显示在框里
          if ((result.data.length === 1) && (this.queryObj.itemId)) {
            this.queryObj.totalFee = result.data[0].fee
          }
        }
      })
    },
    handleInverse () {
      if (!this.queryObj.itemId || this.queryObj.itemId === '') {
        this.$messageTips(this, 'error', '请选择所要反算的项目', ' ')
        return false
      }
      if (!this.queryObj.discount || this.queryObj.discount < 0) {
        this.$messageTips(this, 'error', '折扣后总金必须为正值', ' ')
        return false
      }
      let params = {
        settlementId: this.obj.settlementId,
        itemId: this.queryObj.itemId,
        inverseFee: this.queryObj.discount
      }
      api.InverseIpSettlement(params).then(result => {
        // 反算成功
        this.$messageTips(this, 'success', '反算成功', ' ')
        this.queryObj.itemId = ''
        this.queryObj.totalFee = 0
        this.queryObj.discount = ''
        this.list()
      })
    }
  }
}
</script>
