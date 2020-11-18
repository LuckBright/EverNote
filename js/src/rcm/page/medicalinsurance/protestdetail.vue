<!--
 * @Author: renpengfei
 * @Date: 2019-08-06 15:21:27
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-08-12 14:41:16
 -->
<template>
  <div>
    <ever-bread-crumb
      name="拒付单详情"
      :path="meta==1?'/financial/protestmanagement':'/financial/protestmanagementcustomer'"
      :haveReturn="true"
    ></ever-bread-crumb>
    <div class="layout_inner">
      <div class="main-head">
        <div class="header">
          <strong class="title">拒付单基本信息</strong>
        </div>
        <ever-form2
          :schema="querySchema"
          :allDisabled="true"
          :nosubmit="true"
          v-model="queryObj"
          ref="form"
        ></ever-form2>
      </div>
      <div class="header">
        <strong class="title">拒付单明细</strong>
      </div>
      <el-table v-loading="loading" :data="tableData">
        <el-table-column label="结算方式" prop="payTypeName" width="100%">
          <template slot-scope="scope">
            {{(meta == 1 && scope.row.payTypeName === '大客户应付')? '商保应付': scope.row.payTypeName}}
          </template>
        </el-table-column>
        <el-table-column label="操作员" prop="createName"></el-table-column>
        <el-table-column label="操作时间" prop="updateTime"></el-table-column>
        <el-table-column label="操作类型" prop="operateTypeName">
          <template slot-scope="scope">
            {{(meta == 1 && scope.row.operateTypeName === '大客户应付')? '商保应付': scope.row.operateTypeName}}
          </template>
        </el-table-column>
        <el-table-column label="操作备注" prop="remark"></el-table-column>
        <el-table-column label="金额" prop="changeFee"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getProtestDetailList } from '../../store/medicalinsurance.js'
let querySchema = [{
  label: '公司名称',
  name: 'insurOrgName',
  comp: '',
  props: {
    placeholder: '请选择公司'
  },
  span: 6
},
{
  label: '患者姓名',
  name: 'patientName',
  comp: '',
  props: {
    placeholder: '请输入患者姓名'
  },
  span: 6
},
{
  label: '患者档案号',
  name: 'patientCode',
  comp: '',
  props: {
    autoWidth: true
  },
  span: 6
},
{
  label: '结算单号',
  name: 'settlementCode',
  comp: '',
  props: {
    placeholder: '请输入收款单号'
  },
  span: 6
},
{
  label: '拒付余额',
  name: 'refuseFee',
  comp: '',
  props: {
    placeholder: ''
  },
  span: 6
}]
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    return {
      querySchema: querySchema,
      queryObj: queryObj,
      tableData: [],
      addReceiptDialogShow: false,
      isNew: false,
      loading: false,
      meta: this.$route.meta.type,
    }
  },
  created () {
    // console.log(this.queryObj, this.$route.query, Object.assign(this.queryObj, this.$route.query))
    Object.assign(this.queryObj, this.$route.query)
    let params = { receivableDetailId: this.$route.query.id }
    getProtestDetailList(params).then(res => {
      this.tableData = res.data
    })
  }
}
</script>
<style scoped>
.header strong.title {
  padding-left: 6px;
  border-left: 3px solid #1c7bef;
  font-size: 18px;
  color: #000;
  line-height: 60px;
}
.buttons {
  text-align: right;
}
</style>
