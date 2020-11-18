<template>
  <div id="createvisit">
    <ever-bread-crumb :name="'优惠券详情'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <div class="memlayout_inner">
      <div>
        <el-card>
          <el-row slot="header">
            <el-col :span="18"><strong class="title">券信息</strong></el-col>
          </el-row>
            <ever-form2
              :schema="schema"
              v-model="obj"
              ref="form"
              :span="12"
              :nosubmit="true"
              labelWidth="140"
            >
              <template slot="type">
                <sys-value type="THC_CARD_GIFTBATCH_TYPE" :code="obj.type"></sys-value>
              </template>
              <template slot="money">
                <span>{{obj.money | formatToFinacial}}</span>
              </template>
              <template slot="range">
                <span v-if="obj.type == 1">满{{obj.threshold}}减{{obj.money}}</span>
                <span v-if="obj.type == 2">立减{{obj.money}}</span>
                <span v-if="obj.type == 3">体验价{{obj.money}}元</span>
                <span v-else>无</span>
              </template>
              <template slot="sellChannel">
                <label>{{obj.sellChannel == 1 ? '线下' : '商城'}}</label>
              </template>
              <template slot="status">
                <sys-value type="THC_CARD_GIFTBATCH_STATUS" :code="obj.status"></sys-value>
              </template>
              <template slot="overlay">
                <label v-if="obj.overlay == 0">否</label>
                <label v-if="obj.overlay == 1">是</label>
              </template>
              <template slot="overlayMemberCard">
                <label v-if="obj.overlayMemberCard == 0">否</label>
                <label v-if="obj.overlayMemberCard == 1">是</label>
              </template>
            </ever-form2>
            <h4>使用范围</h4>
            <el-table :data="useData" max-height="400">
              <!-- <el-table-column
                width="300"
                label="分类"
                prop="classification">
              </el-table-column> -->
              <el-table-column
                min-width="300"
                prop="displayName"
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
            <el-button type="primary"><a :href="$ever.cardIndex + 'card/giftbatchs'" id="acolor">进行券操作</a></el-button>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../store/giftapi'
  import sobapi from '../../sob/store/serviceapi'
  let schema = [
    {
      name: 'code',
      comp: 'readonlyitem',
      span: 8,
      label: '券号：'
    },
    {
      name: 'name',
      comp: 'readonlyitem',
      span: 8,
      label: '名称：'
    },
    {
      name: 'user',
      comp: 'readonlyitem',
      span: 8,
      label: '领取人：'
    },
    {
      name: 'type',
      comp: 'custom',
      span: 8,
      label: '类型：'
    },
    {
      name: 'orderId',
      comp: 'readonlyitem',
      label: '订单号：',
      span: 8
    },
    {
      name: 'money',
      comp: 'custom',
      label: '面额：',
      span: 8
    },
    {
      name: 'range',
      comp: 'custom',
      label: '满减范围：',
      span: 8
    },
    {
      name: 'createTime',
      comp: 'readonlyitem',
      label: '领取时间：',
      span: 8
    },
    {
      name: 'useEndTime',
      comp: 'readonlyitem',
      label: '有效期：',
      span: 8
    },
    {
      name: 'duration',
      comp: 'readonlyitem',
      label: '使用时间：',
      span: 8
    },
    {
      name: 'sellChannel',
      comp: 'custom',
      label: '售卖渠道：',
      span: 8
    },
    {
      name: 'comment',
      comp: 'readonlyitem',
      label: '渠道备注：',
      span: 8
    },
    {
      name: 'status',
      comp: 'custom',
      label: '状态：',
      span: 8
    },
    {
      name: 'overlay',
      comp: 'custom',
      label: '是否叠加：',
      span: 8
    },
    {
      name: 'overlayMemberCard',
      comp: 'custom',
      label: '会员卡同时使用：',
      span: 8
    }
  ]
  export default {
    data () {
      let obj = this.$ever.createObjFromSchema(schema)
      obj.patient = 'feed'
      obj.patientId = []
      return {
        schema,
        api,
        sobapi,
        id: this.$route.query.id,
        obj,
        useData: []
      }
    },
    created () {
      this.initData()
    },
    methods: {
      initData () {
        this.id && this.api.getById({id: this.id}).then(rs => {
          if (rs && rs.data) {
            if (rs.data.giftBatch) {
              this.obj = Object.assign({}, rs.data.giftBatch)
              this.obj.name = rs.data.giftBatch.name
              this.obj.user = rs.data.patient.name
              this.obj.code = rs.data.code
            }
            if (rs.data.itemIds && rs.data.itemIds.length) {
              this.sobapi.list({ids: rs.data.itemIds}).then(result => {
                if (result.data) {
                  this.useData = result.data
                }
              })
            }
          }
        })
      }
    }
  }
</script>
<style scoped>
  #acolor {color: #ffffff;}
</style>
