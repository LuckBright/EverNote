<template>
	<div id="mall">
		<el-row class="top">
      <el-col :span="12">
        <span class="title" @click="prevPage"><i class="el-icon-arrow-left"></i> 充值</span>
      </el-col>
      <el-col :span="12" align="right"></el-col>
    </el-row>
    <el-card>
      <div class="recharge">
        <strong>查询卡券</strong>
        <ever-query-form :schema="querySchema" v-model="queryObj" @query="submitRecharege">
          <template slot-scope="scope" slot="patientId">
            <ever-patient-select v-model="scope.obj['patientId']"></ever-patient-select>
            <span>{{scope.obj.userName}}</span>
          </template>
          <template slot-scope="scope" slot="cardBuyer">
            <ever-patient-select v-model="scope.obj['cardBuyer']"></ever-patient-select>
            <span>{{scope.obj.userName}}</span>
          </template>
        </ever-query-form>
      </div>
	  	<div>
        <div v-if="checkTableData.length > 0">
          <strong>查询结果</strong>
          <el-table
            style="width: 100%"
            :data="checkTableData"
            @current-change="setSelectData"
            :show-header=false
            ref="selectUserTable"
            row-key="id">
            <el-table-column>
              <template slot-scope="scope">
                <table width="100%" class="tb-table" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr>
                      <td width="3%" align="cneter">
                        <el-radio :label="scope.row" v-model="radioed">&nbsp;</el-radio>
                      </td>
                      <td width="27%">
                        <span>储值卡号：{{scope.row.code}}</span>
                      </td>
                      <td width="30%">
                        购买人：
                        <span>{{scope.row.cardBuyerInfo.name ? scope.row.cardBuyerInfo.name : '--'}}</span>
                        <span><sys-value type="GBT.2261.1" :code="scope.row.cardBuyerInfo.sex"></sys-value></span>
                        <span>{{scope.row.cardBuyerInfo.mobile  ? scope.row.cardBuyerInfo.mobile.substring(0, 3) + '****' + scope.row.cardBuyerInfo.mobile.substring(7) : '--'}}</span>
                        <span>{{scope.row.cardBuyerInfo.iden ? scope.row.cardBuyerInfo.iden.idNo : '--'}}</span>
                      </td>
                      <td width="30%">
                        绑定人：
                        <span>{{scope.row.patient.name ? scope.row.patient.name : '--'}}</span>
                        <span><sys-value type="GBT.2261.1" :code="scope.row.patient.sex"></sys-value></span>
                        <span>{{scope.row.patient.mobile  ? scope.row.patient.mobile.substring(0, 3) + '****' + scope.row.patient.mobile.substring(7) : '--'}}</span>
                        <span>{{scope.row.patient.iden ? scope.row.patient.iden.idNo : '--'}}</span>
                      </td>
                    </tr>
                    <tr>
                      <td width="3%"></td>
                      <td colspan="3">
                        <p class="title">{{ scope.row.memberCardBatch && scope.row.memberCardBatch.name}}</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </el-table-column>
          </el-table>
          <el-row class="choicesale">
            <strong>充值并选择销售</strong>
            <ever-form-model
              :schema="schema1"
              v-model="obj1"
              :api="api"
              :rules="rules"
              @selectuser="selectUserSeller"
              @objsaved="afterSave"
              label-position="right"
              ref="form">
            </ever-form-model>
          </el-row>
    	    <el-row :span="12" class="settlement">
    	    	<el-col :span="8" class="line38">
    	    		<el-col :span="12"><span class="total">商品总金额：<em>¥{{obj1.totalPrice | formatToFinacial}}</em></span></el-col>
    	    		<el-col :span="12"><span class="free">减免金额: <em>¥{{(this.payForm.payPrice ? (Number(obj1.totalPrice) - this.payForm.payPrice) : 0) | formatToFinacial}}</em></span></el-col>
    	    	</el-col>
    	    	<el-col :span="8">
              <el-form :inline="true" class="demo-form-inline" :model="payForm" :rules="payRules" ref="payForm">
                <el-form-item label="实付金额" class="mb0" prop="payPrice">
                  <el-input v-model="payForm.payPrice" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-form>
    	    	</el-col>
    	  	</el-row>
          <div class="payBtn">
            <el-button type="primary" @click="submitForm()" :loading="loading" class="el-button">提交订单</el-button>
          </div>
        </div>
        <div v-if="showNoData">
          <p class="noData">没有数据</p>
        </div>
      </div>
	  </el-card>
    <select-seller-pop ref="selectuserseller" @selectUserVal="setSelectSellData"></select-seller-pop>
	</div>
</template>
<script>
  import api from '../store/cartapi'
  import form from '../../util/form'
  import selectSellerPop from '../page/selectsells'
  import sobapi from '../../sob/store/serviceapi'
  let schema1 = [
    {
      name: 'totalPrice',
      label: '充值金额',
      span: 8
    },
    {
      name: 'sellerInfo',
      type: 'selectuser',
      label: '选择销售',
      style: 'label',
      shareCount: 1,
      span: 6
    },
    {
      name: 'saleReason',
      label: '销售原因',
      placeholder: '销售原因',
      span: 8
    }
  ]
  let Schema = [
    {
      name: 'code',
      label: '储值卡卡号',
      span: 4
    },
    {
      name: 'cardBuyer',
      label: '购卡人',
      type: 'custom',
      span: 3
    },
    {
      name: 'patientId',
      label: '持卡人',
      type: 'custom',
      span: 3
    }
  ]
  export default {
    mixins: [form],
    data () {
      let obj1 = this.createObjFromSchema(schema1)
      let queryObj = this.$ever.createObjFromSchema(Schema)
      obj1.sellerInfo = []
      obj1.seller = ''
      return {
        schema1,
        obj: '',
        obj1: obj1,
        querySchema: Schema,
        queryObj: queryObj,
        code: this.$route.params.id,
        i: '',
        n: '',
        api: api,
        itemDataList: [],
        checkTableData: [],
        checkObjList: [],
        radioed: '',
        payForm: {
          payPrice: ''
        },
        payPrice: '',
        comment: {},
        tableData: [{GoodsInfo: []}],
        showNoData: false,
        loading: false,
        rules: {
          sellerInfo: [
            {required: true, message: '请选择销售人', trigger: 'change', type: 'array'}
          ],
          saleReason: [
            {required: true, message: '请填写销售原因', trigger: 'blur'},
            { min: 1, max: 100, message: '最长长度为100位字符', trigger: 'blur' }
          ],
          totalPrice: [
            {required: true, message: '请填写充值金额', trigger: 'blur'}
          ]
        },
        payRules: {
          payPrice: [
            {required: true, message: '请填写实付金额', trigger: 'blur'}
          ]
        }

      }
    },
    created () {
    },
    methods: {
      setSelectData (val) {
        this.tableData = val
      },
      prevPage () {
        window.history.go(-1)
      },
      submitRecharege () {
        this.checkTableData = []
        let params = false
        for (let key in this.queryObj) {
          if (this.queryObj[key]) {
            params = true
            // delete this.queryObj[key]
          }
        }
        // for (let i = 0; i < arr.length; i++) {
        //   if (arr[i][field]) {
        //     return false
        //   }
        // }
        // return true
        if (params) {
          api.search4Charge(this.queryObj).then(result => {
            if (result.data.resultList) {
              this.checkTableData = result.data.resultList
              this.showNoData = false
            } else {
              this.showNoData = true
            }
          })
        } else {
          this.$message({
            message: '请选择查询条件',
            type: 'warning'
          })
          return false
        }
      },
      submitForm () {
        if (!this.tableData.patientId) {
          this.$message({
            message: '请选择要充值的卡',
            type: 'warning'
          })
          return false
        }
        if (Number(this.payForm.payPrice) < 0) {
          this.$message({
            message: '充值金额不能小于0',
            type: 'warning'
          })
          return false
        }
        let params = {
          userId: this.tableData.patientId,
          seller: JSON.stringify(this.obj1.seller),
          saleReason: this.obj1.saleReason,
          totalPrice: Number(this.obj1.totalPrice),
          payPrice: this.payForm.payPrice,
          orderItems: [{
            singleOrigPrice: Number(this.obj1.totalPrice),
            singleSalePrice: this.payForm.payPrice,
            amount: 1,
            productId: 5,
            productSkuId: 5,
            totalPrice: Number(this.obj1.totalPrice),
            payPrice: this.payForm.payPrice,
            goodsInfos: [{
              infoMap: {
                goodsId: this.tableData.id,
                thirdId: this.tableData.batchId,
                patientId: this.tableData.patientId,
                code: this.tableData.code,
                singleOrigPrice: Number(this.obj1.totalPrice),
                singleSalePrice: this.payForm.payPrice
              }
            }]
          }]
        }
        this.$refs.form.$refs.form.validate(valid => {
          if (valid) {
            this.$refs.payForm.validate(valid => {
              if (valid) {
                this.loading = true
                api.charge(params).then(result => {
                  if (result.data) {
                    this.loading = false
                    this.$router.push('/card/orderlist')
                  }
                })
              }
            })
          }
        })
      },
      setSelectSellData (selected) {
        let seller = []
        let sellerArr = []
        selected.data.forEach(item => {
          seller.push({id: item.id, userName: item.name, userId: item.id, status: 0})
        })
        this.obj1.sellerInfo = seller
        seller.map(item => {
          sellerArr.push({id: item.id, name: item.userName})
        })
        this.obj1.seller = sellerArr
      },
      selectUserSeller (name) {
        this.$refs.selectuserseller.onDialogOpen(name)
      }
    },
    beforeCreate () {
      this.api = api
      this.sobapi = sobapi
    },
    components: {
      selectSellerPop
    }
  }
</script>
<style scoped>
#mall .goodsitem .goodsleft h4.title{ line-height: 60px;}
.goodsList { padding-left:40px; position: relative;}
.goodsList .el-radio {position: absolute; left: 0; top:0;}
.noData {text-align: center; line-height: 32px; font-size: 14px; color:#000; margin-top: 50px;}
</style>
