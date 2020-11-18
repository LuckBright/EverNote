<template>
  <div class="settle_body payStyle">
    <div class="main-head">
      <ever-query-form :schema="querySchema" v-model="queryObj" @query="query" class="main-form">
        <template slot="direction" v-if="status === '0'">
          <el-checkbox v-model="queryObj.direction" :true-label="2" :false-label="0" @change="list">退款</el-checkbox>
        </template>
      </ever-query-form>
    </div>
    <el-row class="ever-row-01" style="min-height: 640px;" v-loading.body="cardloading">
      <el-col v-for="(item,i) in tableData" :key="i">
        <el-card class="settlement_card" style="position: relative;">
          <div class="tag_settle" v-if="item.direction===2">退款</div>
          <div class="tag_settle" v-if="item.status===3">部分退款</div>
          <div class="tag_settle" v-if="item.status===4">已退款</div>
          <div class="cardcon">
            <div class="patient_userinfo">
              <img :src="item.pic | fixImgSrc" class="patientphoto">
              <div class="settle_userinfo">
                <span class="settle_name">
                  <el-tooltip placement="right-start">
                    <div slot="content">{{item.name}}</div>
                    <span>{{item.name}}</span>
                  </el-tooltip>
                </span>
                <span>
                  <sys-value type="GBT.2261.1" :code="item.sex"></sys-value>
                </span>
                <span>{{item.patientAgeShowText}}</span><br />
                <span>{{item.orderDeptName}}</span>
              </div>
            </div>
            <div class="settle_info">
              <p class="textcon infoTitle">
                <el-tooltip placement="right-start">
                  <div slot="content">{{item.patientId}}</div>
                  <span>
                    <em>会员编号：</em>{{item.patientId}}</span>
                </el-tooltip>
              </p>
              <p class='infoTitle'>
                <el-tooltip placement="right-start">
                  <div slot="content">{{item.orderTime}}</div>
                  <span>
                    <em>订单时间：</em>{{item.orderTime}}</span>
                </el-tooltip>
              </p>
              <p class='infoTitle'>
                <el-tooltip placement="right-start">
                  <div slot="content">{{item.payPrice}}</div>
                  <span class="money_color">
                    <em>收费金额：</em>¥ {{item.payPrice | formatToFinacial}}</span>
                </el-tooltip>
              </p>
            </div>
          </div>
          <div class="bottom_btn">
            <span v-if="status=='0'&&item.direction===2">
              <router-link class="a_ui_01" :to="{path:'/rcm/receiptDetail',query:{membersNo:item.membersNo,id:item.id,status:status,patientId:item.patientId,orderNo:item.orderNo,direction:item.direction,settlementId:item.settlementId,patientId:item.patientId,bizType:item.bizType}}">明细</router-link>
            </span>
            <span v-else-if="status=='0'">
              <router-link class="a_ui_01" :to="{path:'/rcm/receiptDetail',query:{membersNo:item.membersNo,id:item.id,status:status,patientId:item.patientId,orderNo:item.orderNo,settlementId:item.settlementId,direction:item.direction,patientId:item.patientId,bizType:item.bizType}}">明细</router-link>
            </span>
            <span v-if="status=='1'">
              <router-link v-if="item.direction===2" class="a_ui_01" :to="{path:'/rcm/paymentDetail',query:{membersNo:item.membersNo,id:item.id,status:status,patientId:item.patientId,orderNo:item.orderNo,settlementId:item.settlementId,direction:item.direction,patientId:item.patientId,bizType:item.bizType}}">退款</router-link>
              <router-link v-else class="a_ui_01" :to="{path:'/rcm/paymentDetail',query:{membersNo:item.membersNo,id:item.id,status:status,patientId:item.patientId,orderNo:item.orderNo,settlementId:item.settlementId,direction:item.direction,patientId:item.patientId,bizType:item.bizType}}">收款</router-link>
            </span>
            <span v-if="status=='2'">
              <router-link class="a_ui_01" :to="{path:'/rcm/paymentDetail',query:{membersNo:item.membersNo,id:item.id,status:status,patientId:item.patientId,orderNo:item.orderNo,settlementId:item.settlementId,direction:item.direction,patientId:item.patientId,bizType:item.bizType}}">详情</router-link>
              <!-- <a href="javascript:;" class="a_ui_01" @click.prevent='print(item.settlementId)'>打印</a> -->
            </span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <ever-pagination :page-sizes="pageSizes" @size-change="handleSizeChange" @current-change="handleCurrentChange" :totalCount="totalCount">
    </ever-pagination>
  </div>
</template>
<script>
import list from '@/util/list'
import { everprint } from '@/util/common'
import { getReceiptList } from '../../../store/marketingReceiptApi'
let schema = [
  {
    name: 'patientId',
    placeholder: '输入患者姓名',
    type: 'patientselect',
    options: []
  },
  {
    name: 'patientIds',
    placeholder: '输入会员编号'
  },
  {
    name: 'orderNo',
    placeholder: '输入订单号'
  },
  {
    name: 'sort',
    placeholder: '选择排序方式',
    type: 'select',
    options: [
      {
        name: '订单升序',
        id: 'ASC'
      },
      {
        name: '订单降序',
        id: 'DESC'
      }
    ]
  },
  {
    startName: 'beginDate',
    endName: 'endDate',
    name: 'time',
    type: 'daterange',
    dateType: 'daterange',
    label: '日期范围',
    placeholder: '请选择起始生效日期',
    format: 'YYYY-MM-DD',
    editable: false
  },
  {
    name: 'direction',
    type: 'custom'
  }
]
export default {
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      querySchema: schema,
      queryObj: obj,
      cardloading: false,
      status: this.$route.params.status
    }
  },
  components: {},
  methods: {
    async print (id) {
      everprint('RCM-market', { uid: this.settlementId, age: this.age }, { preview: true })
    },
    async list () {
      if (this.$route.params.status) {
        let params = {
          offset: this.offset,
          pagesize: this.pagesize,
          status: this.$route.params.status
        }
        try {
          let data = await getReceiptList(Object.assign(params, this.queryObj))
          this.tableData = data.data.list
          this.totalCount = data.data.total
          this.cardloading = false
        } catch (err) {
          this.cardloading = false
        }
      }
    }
  },
  watch: {
    '$route.path': {
      handler (n, o) {
        this.status = this.$route.params.status
        this.tableData = []
        this.totalCount = 0
        this.list()
        this.cardloading = true
      }
    }
  }
}
</script>
<style scoped>
.settlement_card .tag_settle {
  height: 20px;
  width: 100px;
  background: #ff9c00;
  position: absolute;
  right: -30px;
  top: 10px;
  text-align: center;
  line-height: 20px;
  color: #fff;
  font-size: 12px;
  transform: rotate(-315deg);
}

.settle_body {
  padding: 20px;
}
.cardbox {
  margin-right: 20px;
  margin-bottom: 20px;
  height: 230px;
  background: #fcfcfc;
  border: 1px solid #dddddd;
  box-shadow: 0 1px 4px 0 rgba(204, 204, 204, 0.36);
  border-radius: 4px;
}
.cardcon {
  height: 160px;
  padding: 5% 5% 0;
}
.patient_userinfo {
  clear: both;
  padding-bottom: 14px;
  height: 40px;
}
.patientphoto {
  height: 40px;
  width: 40px;
  float: left;
  border-radius: 50%;
  border: 1px solid #ddd;
}
.payStyle .settle_userinfo {
  height: 40px;
  line-height: 20px;
  font-size: 14px;
  color: #999;
  text-align: left;
  padding-left: 50px;
}
.settle_userinfo span {
  height: 20px;
}
.settle_userinfo .settle_name {
  padding-right: 10px;
}
.settle_userinfo .settle_name .el-tooltip {
  font-size: 16px;
  font-weight: bold;
  color: #666;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.settle_info p {
  font-size: 14px;
  color: #666;
  line-height: 16px;
  height: 16px;
  margin: 0;
  margin-bottom: 8px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.settle_info p span {
  display: inline-block;
  max-width: 100%;
}
.settle_info p span em {
  font-style: normal;
  color: #999;
}
.settle_info .textcon .el-tooltip {
  color: #666;
}
.settle_info p b {
  font-weight: normal;
}
.settle_info p .textcon {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.settle_info p .el-checkbox__inner {
  height: 16px;
  width: 16px;
}
.settle_info .el-checkbox__label {
  color: #666;
}
.settle_info .medInv {
  margin-right: 30px;
}
.settlebutton {
  height: 49px;
  border-top: 1px solid #ddd;
  line-height: 49px;
  text-align: center;
  font-size: 16px;
  color: #666;
  font-weight: bold;
}
.settlebutton a {
  text-decoration: none;
}
.settlebutton .settle_blue a {
  color: #1c7bef;
  height: 100%;
  width: 100%;
  display: inline-block;
}
.settlebutton .settle_btn_border {
  border-right: 1px solid #ddd;
}
.settle_btn span {
  height: 100%;
  width: 100%;
  cursor: pointer;
  display: inline-block;
}
.settle_body .title {
  margin-top: 20px;
}
.settle_info .money_color {
  color: #ff9c00;
}
</style>
