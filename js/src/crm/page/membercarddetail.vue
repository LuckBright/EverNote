<template>
  <div id="createvisit">
    <ever-bread-crumb :name="'储蓄卡详情'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div class="memlayout_inner">
      <div>
        <el-card>
        <el-row slot="header">
          <el-col :span="18"><strong class="title">卡信息</strong></el-col>
        </el-row>
          <ever-form-model
            :schema="schema"
            v-model="obj"
            :api="api"
            ref="form"
            label-position="right">
            <template slot="batchType" slot-scope="scope">
              <sys-value type="THC_CARD_MEMBERCARD_STATUS" :code="scope.obj.batchType"></sys-value>
            </template>
            <template slot="name" slot-scope="scope">
              <label>{{scope.obj.memberCardBatch.name}}</label>
            </template>
            <template slot="patientName" slot-scope="scope">
              <label>{{scope.obj.patient.name}}</label>
            </template>
             <template slot="moneyThreshold" slot-scope="scope">
              <label>{{scope.obj.memberCardBatch.moneyThreshold}}</label>
            </template>
            <template slot="storedMoney" slot-scope="scope">
              <label>{{scope.obj.storedMoney}}</label>
            </template>
            <template slot="validPeriod" slot-scope="scope">
              <label>{{scope.obj.memberCardBatch.validPeriod}}</label>
            </template>
            <template slot="discount" slot-scope="scope">
              <label>{{scope.obj.memberCardBatch.discount}}</label>
            </template>
            <template slot="givedMoney" slot-scope="scope">
              <label>{{scope.obj.memberCardBatch.givedMoney}}</label>
            </template>
            <template slot="shareCount" slot-scope="scope">
              <label>{{scope.obj.memberCardBatch.shareCount}}</label>
            </template>
            <template slot="createTime" slot-scope="scope">
              <label>{{scope.obj.memberCardBatch.createTime}}</label>
            </template>
            <template slot="moneyThreshold" slot-scope="scope">
              <label>{{scope.obj.memberCardBatch.moneyThreshold}}</label>
            </template>
            <template slot="status" slot-scope="scope">
               <sys-value type="THC_CARD_MEMBERCARD_STATUS" :code="scope.obj.status"></sys-value>
            </template>
            <template slot="batchstatus" slot-scope="scope">
              <sys-value type="THC_CARD_MEMBERCARD_STATUS" :code="scope.obj.memberCardBatch.status"></sys-value>
            </template>
            <template slot="batchsname" slot-scope="scope">
               <label>{{scope.obj.memberCardBatch.name}}</label>
            </template>
          </ever-form-model>
          <ever-form-model
            :schema="schema2"
            v-model="obj2"
            :api="api"
            label-position="right">
            <template slot="useTable">
              <el-table :data="useData" max-height="400">
                <!-- <el-table-column
                  width="300"
                  prop="code"
                  label="分类">
                </el-table-column> -->
                <el-table-column
                  min-width="300"
                  prop="name"
                  label="名称">
                </el-table-column>
                <el-table-column
                  width="300"
                  align="center"
                  prop="serviceType"
                  label="类型">
                  <template slot-scope="scope">
                    <sys-value type="THC_SOB_SERVICE_TYPE" :code="scope.row.serviceType"></sys-value>
                  </template>
                </el-table-column>
                <el-table-column
                  width="300"
                  align="center"
                  prop="price"
                  label="价格">
                </el-table-column>
              </el-table>
            </template>
            <template slot="recordTable">
              <el-table :data="statementsData" max-height="400">
                <el-table-column
                  width="120"
                  prop=""
                  type="index"
                  label="序号">
                </el-table-column>
                <el-table-column
                  min-width="120"
                  prop="createTime"
                  label="时间">
                </el-table-column>
                <el-table-column
                  width="120"
                  align="center"
                  prop="changeType"
                  label="交易类型">
                  <template slot-scope="scope">
                    <sys-value type="THC_CARD_MEMBERCARD_TYPE" :code="scope.row.changeType"></sys-value>
                  </template>
                </el-table-column>
                <el-table-column
                  width="120"
                  align="center"
                  prop="chargeStatement"
                  label="支付流水">
                </el-table-column>
                <el-table-column
                  width="120"
                  align="center"
                  prop="chargeMethod"
                  label="支付方式">
                  <template slot-scope="scope">
                    <sys-value type="THC_RCM_PAYMENT_TYPE" :code="scope.row.chargeMethod"></sys-value>
                  </template>
                </el-table-column>
                <el-table-column
                  width="120"
                  align="center"
                  prop="changeStoredMoney"
                  label="变动金额">
                </el-table-column>
                <el-table-column
                  width="120"
                  align="center"
                  prop="newStoredMoney"
                  label="现金余额">
                </el-table-column>
                <el-table-column
                  width="120"
                  align="center"
                  prop="newGivedMoney"
                  label="赠送金额">
                </el-table-column>
                <el-table-column
                  width="140"
                  align="center"
                  prop="operatorName"
                  label="操作人">
                </el-table-column>
              </el-table>
              <ever-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :totalCount="totalCount"
                :current="current">
              </ever-pagination>
            </template>
          </ever-form-model>
          <el-button type="primary"><a :href="$ever.cardIndex + 'card/carditem'" id="acolor">进行券操作</a></el-button>
      </el-card>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../store/giftapi'
  import sobapi from '../../sob/store/serviceapi'
  import form from '../../util/form'
  let schema = [
    {
      name: 'code',
      type: 'label',
      span: 8,
      label: '卡号：'
    },
    {
      name: 'cardBuyerName',
      type: 'label',
      span: 8,
      label: '购买人：'
    },
    {
      name: 'patientName',
      type: 'custom',
      span: 8,
      label: '持卡人：'
    },
    {
      name: 'batchType',
      type: 'custom',
      span: 8,
      label: '类型：'
    },
    {
      name: 'name',
      type: 'custom',
      label: '名称：',
      span: 8
    },
    {
      name: 'moneyThreshold',
      type: 'custom',
      label: '开/售卡金额：',
      span: 8
    },
    {
      name: 'storedMoney',
      type: 'custom',
      label: '现金余额：',
      span: 8
    },
    {
      name: 'givedMoney',
      type: 'custom',
      label: '赠送金额：',
      span: 8
    },
    {
      name: 'discount',
      type: 'custom',
      label: '折扣：',
      span: 8
    },
    {
      name: 'validPeriod',
      type: 'custom',
      label: '有效期(月)：',
      span: 8
    },
    {
      name: 'createTime',
      type: 'custom',
      label: '售卡时间：',
      span: 8
    },
    {
      name: 'createTime',
      type: 'custom',
      label: '开卡时间：',
      span: 8
    },
    {
      name: 'overlay',
      type: 'custom',
      label: '共享人：',
      span: 8
    },
    {
      name: 'status',
      type: 'custom',
      label: '卡状态：',
      span: 8
    },
    {
      type: 'slice',
      label: '卡批次信息',
      className: 'panel-hr'
    },
    {
      name: 'batchsname',
      type: 'custom',
      label: '批次名称：',
      span: 8
    },
    {
      name: 'moneyThreshold',
      type: 'custom',
      label: '储值门槛：',
      span: 8
    },
    // {
    //   name: 'shareDiscount',
    //   type: 'custom',
    //   label: '是否共享：',
    //   span: 8
    // },
    {
      name: 'sharePatientNames',
      type: 'label',
      label: '最大共享人数：',
      span: 8
    },
    {
      name: 'validPeriod',
      type: 'custom',
      label: '有效期(月)：',
      span: 8
    },
    {
      name: 'batchstatus',
      type: 'custom',
      label: '批次状态：',
      span: 8
    }
  ]
  let schema2 = [
    {
      type: 'slice',
      label: '使用范围',
      className: 'panel-hr'
    },
    {
      name: 'useTable',
      type: 'custom',
      span: 24
    },
    {
      type: 'slice',
      label: '交易记录',
      className: 'panel-hr'
    },
    {
      name: 'recordTable',
      type: 'custom',
      span: 24
    }
  ]
  export default {
    mixins: [form],
    data () {
      let obj = this.$ever.createObjFromSchema(schema)
      let obj2 = this.$ever.createObjFromSchema(schema2)
      obj.patient = 'feed'
      obj.patientId = []
      return {
        schema,
        schema2,
        api: api,
        sobapi,
        id: this.$route.query.id,
        obj: obj,
        obj2: obj2,
        statementsData: [],
        useData: []
      }
    },
    created () {
      this.initData()
    },
    methods: {
      initData () {
        let id = this.id.split('?')[0]
        let patientId = this.id.split('=')[1]
        this.id && this.api.getRcmUserCard({id: id, patientId: patientId}).then(rs => {
          this.obj = Object.assign(this.obj, rs.data)
          if (rs.data.id) {
            this.getStatement(rs.data.id)
          }
          this.sobapi.list({ids: rs.data.itemIds}).then(result => {
            if (result.data) {
              this.useData = result.data
            }
          })
        })
      },
      getStatement (id) {
        this.api.getcardStatement({cardId: id, offset: 0, pagesize: 20}).then(rs => {
          this.statementsData = rs.data.resultList ? rs.data.resultList : []
        })
      }
    }
  }
</script>
<style scoped>
  #createvisit .el-input-group__append .el-button{background: #1C7BEF;border-radius: 0;color: #fff;}
  #createvisit .el-input-group__append .is-disabled{background: rgb(238, 240, 246) !important;color: #bbb !important;}
  #createvisit .el-dialog__header .el-dialog__title{padding-left: 10px;font-size: 16px;}
  #createvisit .el-card__header strong.title{border-left: 3px solid #1C7BEF;padding-left: 12px;}
  #acolor {color: #ffffff;}
</style>
