<template>
  <div>
    <ever-bread-crumb name="保险核销" path="/income/insurancercvs"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>
          <el-button
            style="float:right; margin-right: 10px"
            size="small"
            type="danger"
            @click.native.prevent="deleteRcv()"
          >删除</el-button>保险收款核销清单
        </h4>
        <hr>
        <ever-form-model
          :schema="schema"
          v-model="obj"
          :api="api"
          ref="form"
          labelWidth="140px"
          label-position="right"
        ></ever-form-model>
        <hr>
        <el-table :data="listTableData" style="width: 100%">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="code" label="收款单号" width="100" align="center">
            <template slot-scope="scope">
              <router-link
                :to="'/financial/receiptcodelist/' + scope.row.code + '/' + scope.row.id + '/' + rcvID"
              >{{scope.row.code}}</router-link>
            </template>
          </el-table-column>
          <el-table-column prop="receiptdate" label="提交日期" align="center">
            <template
              slot-scope="scope"
              v-if="scope.row.birth"
            >{{ scope.row.receiptdate | formatDateByExp('YYYY-MM-DD') }}</template>
          </el-table-column>
          <el-table-column prop="receiptfee" label="收款单金额" align="center"></el-table-column>
          <el-table-column prop="verifysumfee" label="已核销金额" align="center"></el-table-column>
          <el-table-column prop="paytype" label="支付状态" align="center">
            <template
              slot-scope="scope"
            >{{payStatusStr[scope.row.payStatus] && payStatusStr[scope.row.payStatus].name}}</template>
          </el-table-column>
          <el-table-column prop="verifyType" label="核销方式" align="center"></el-table-column>
          <el-table-column prop="verifyFee" label="本次核销金额" align="center"></el-table-column>
          <el-table-column prop="verifyDate" label="核销日期" align="center"></el-table-column>
          <el-table-column prop="createUser" label="创建人" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../store/receiptdetaillistapi'

var schema = [
  {
    name: 'insureOrgCode',
    label: '保险公司编码',
    disabled: true
  },
  {
    name: 'insuranceOrgCnName',
    label: '保险公司名称',
    disabled: true
  },
  {
    name: 'code',
    label: '理赔单号',
    disabled: true
  },
  {
    name: 'status',
    label: '理赔单状态',
    type: 'systype',
    useValue: true,
    code: 'THC_RCM_CLAIM_DOC_STATUS',
    disabled: true
  },
  {
    name: 'refuseFee',
    label: '拒付金额',
    disabled: true
  },
  {
    name: 'verifysumfee',
    label: '已核销金额',
    disabled: true
  },
  {
    name: 'notVerifySumFee',
    label: '未核销金额',
    disabled: true
  }
]
export default {
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj: obj,
      listTableData: [],
      api,
      rcvID: this.$route.params.id,
      listParams: { rcvID: this.$route.params.id },
      payStatusStr: api.payStatusStr
    }
  },
  methods: {
    deleteRcv () {
      let id = this.$route.params.id
      api.del(id)
        .then(result => {
          this.$router.push('/financial/insurancercvs')
        })
    }
  },
  created () {
    api.list(this.listParams)
      .then(result => {
        this.listTableData = result.data
      })
    api.getById(this.$route.params.id)
      .then(result => {
        result.status = String(result.status)
        Object.assign(this.obj, result)
      })
  }
}
</script>
