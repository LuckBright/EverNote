<template>
  <div id="orderlist">
    <ever-form2 :schema="querySchema" v-model="queryObj" ref="form" :inline="true" :is-query="true" @query="list(true)">
      <template slot="times">
        <ever-range-picker :start.sync="queryObj.startTime" :end.sync="queryObj.endTime"></ever-range-picker>
      </template>
    </ever-form2>
    <el-row width="100%" class="tb-header">
      <el-col :span="2" align="center">商品图片</el-col>
      <el-col :span="6" align="left">名称</el-col>
      <el-col :span="2" align="center">商品类型</el-col>
      <el-col :span="2" align="center">单价</el-col>
      <el-col :span="2" align="center">数量</el-col>
      <el-col :span="2" align="center">小计</el-col>
      <el-col :span="2" align="center"></el-col>
      <el-col :span="2" align="center">状态</el-col>
      <el-col :span="4" align="center">操作</el-col>
    </el-row>
    <template v-if="tableData && tableData.length">
      <div v-for="(item, i) in tableData" :key="i">
        <el-row class="tb-title">
          <el-col :span="12"><a :href="$ever.cardIndex + '/card/orderdetails/' + item.id"><span>{{item.createTime}}</span> <span><label>订单号：</label> <em>{{item.sn}}</em></span></a></el-col>
          <el-col :span="12" align="right"><span>订单金额：<em>¥{{item.totalPrice | formatToFinacial}}</em></span><span v-if="item.status !== 8">实际支付金额：<em>¥{{item.payPrice | formatToFinacial}}</em></span><span v-if="item.status === 8">实际支付金额：<em>¥{{item.paidPrice | formatToFinacial}}</em></span></el-col>
        </el-row>
        <table width="100%" class="tb-table" cellspacing="0" cellpadding="0">
          <tbody>
            <tr v-for="(item1, j) in item.orderItems" :key="j">
              <td width="8.33333%" align="center">
                <div class="cell">
                  <el-image style="width: 80px; height: 60px;" v-if="item1.product.images" :src="`${$ever.fileUrl2}${item1.product.images.split('#')[0]}`" :preview-src-list="item1.product.images.split('#')"></el-image>
                  <el-image style="width: 80px; height: 60px;" v-else src=""></el-image>
                </div>
              </td>
              <td width="25%">
                <div class="cell">{{item1.product.name}}</div>
              </td>
              <td width="8.33333%" align="center">
                <div class="cell"><span class="cRed"><sys-value type="THC_MALL_PRODUCT_TYPE" :code="item1.product.type"></sys-value></span></div>
              </td>
              <td width="8.33333%" align="center">
                <div class="cell">¥{{(item1.singleOrigPrice) | formatToFinacial}}</div>
              </td>
              <td width="8.33333%" align="center">
                <div class="cell">{{item1.amount}}</div>
              </td>
              <td width="8.33333%" align="center">
                <div class="cell">¥{{(item1.amount * item1.singleOrigPrice) | formatToFinacial}}</div>
              </td>
              <td width="8.33333%" align="center">
              </td>
              <td width="8.33333%" :rowspan="item.orderItems.length" align="center" class="line" v-if="j === 0">
                <div class="cell"><span class="cRed"><sys-value type="THC_MALL_ORDER_STATUS" :code="item.status"></sys-value></span></div>
              </td>
              <td width="16.6667%" align="center" class="line">
                <a :href="$ever.cardIndex + '/card/orderdetails/' + item1.orderId">查看详情</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="current">
    </ever-pagination>
    <dialog-return ref="dialogreturn" :curOrderObj="orderObj" @aftersave="list"></dialog-return>
  </div>
</template>
<script>
  import api from '../../mall/store/orderapi'
  import utillist from '../../util/list'
  import dialogReturn from '../../mall/page/dialog-return'
  let querySchema = [
    {
      name: 'status',
      label: '订单状态',
      comp: 'sys-type',
      props: {
        code: 'THC_MALL_ORDER_STATUS',
        useValue: true,
        clearable: true
      }
    },
    {
      name: 'times',
      label: '时间范围',
      comp: 'custom'
    },
    {
      name: 'sn',
      label: '订单编号',
      placeholder: '请输入订单编号'
    }
  ]
  export default {
    mixins: [utillist],
    data () {
      let queryObj = this.$ever.createObjFromSchema(querySchema)
      queryObj.times = []
      queryObj.startTime = ''
      queryObj.endTime = ''
      queryObj.status = ''
      queryObj.userId = this.$route.params.patientId
      return {
        api,
        querySchema: querySchema,
        queryObj: queryObj,
        listApiName: 'searchMember',
        tableData: [],
        orderObj: {}
      }
    },
    created () {
      api.searchMember(this.queryObj).then(result => {
        this.tableData = result.data.resultList
        this.totalCount = result.totalCount
        this.$forceUpdate()
      })
    },
    methods: {
      // orderReturn (orderId, orderItemId, orderObj) {
      //   this.orderObj = orderObj
      //   this.$refs.dialogreturn.open(orderId, orderItemId)
      // },
      // handleSelect (key, keyPath) {
      //   let param
      //   if (key === '') {
      //     param = {
      //       offset: 0,
      //       pagesize: 20
      //     }
      //   } else {
      //     param = {
      //       status: key,
      //       offset: 0,
      //       pagesize: 20
      //     }
      //     this.queryObj.status = key
      //   }
      //   api.searchMember(param).then(result => {
      //     this.tableData = result.data.resultList
      //     this.totalCount = result.data.totalCount
      //   })
      // }
    },
    watch: {
      'queryObj.startTime' (val) {
        val ? this.queryObj.queryTimeType = 0 : this.queryObj.queryTimeType && delete this.queryObj.queryTimeType
      }
    },
    components: {
      dialogReturn
    }
  }
</script>
<style scoped>
#orderlist .tb-header{background: #F8F8F8;border: 1px solid #EEEEEE;margin-bottom: 10px; font-size: 14px}
#orderlist .tb-header .el-col{height: 50px;line-height: 50px;padding: 0 10px;}
#orderlist .tb-title .el-col{padding: 10px 0;font-size: 12px;}
#orderlist .tb-title .el-col:first-child span{margin-right: 20px;color: #999;}
#orderlist .tb-title .el-col:first-child span em{font-style: normal; color: #151515;}
#orderlist .tb-title .el-col:last-child span{margin-left: 20px;vertical-align: bottom;color: #000;display:inline-block;height: 18px;line-height: 18px;}
#orderlist .tb-title .el-col:last-child span em{font-style: normal;color: #f7ba2a;font-size: 16px;}
#orderlist .tb-table{border:1px solid #EEEEEE;border-collapse: separate;border-bottom: none;font-size: 14px;margin-bottom: 10px;}
#orderlist .tb-table tr td{border-bottom: 1px solid #EEEEEE;}
#orderlist .tb-table tr td.line{border-left: 1px solid #EEEEEE;}
#orderlist .tb-table tr:first-child td:last-child{border-right: 0;}
#orderlist .tb-table tr td > .cell{padding: 10px;vertical-align: bottom;}
#orderlist .tb-table .el-button--danger{color: #fa5555; background: #fee; border-color: #fdbbbb;}
</style>
