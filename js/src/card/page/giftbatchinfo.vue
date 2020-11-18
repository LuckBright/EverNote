<template>
  <div>
    <ever-bread-crumb name="优惠券管理" path="/card/giftbatchs"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body">
        <h4>基础信息</h4>
        <ever-form-model
          :schema="schema"
          v-model="obj"
          :api="api"
          :rules="rules"
          ref="form"
          label-position="right">
        </ever-form-model>
        <div class="looklikeformitem">
          <label class="label">指定项目</label>
          <div class="content">
            <el-table
              :data="tableData"
              style="width: 100%"
              border>
              <el-table-column
                prop="name"
                label="项目名称">
              </el-table-column>
              <el-table-column
                prop="serviceType"
                label="医嘱项目类型">
              </el-table-column>
              <el-table-column
                prop="serviceType"
                label="医嘱项目类型">
                <template slot-scope="scope">
                  <sys-value type="THC_SOB_SERVICE_INSURANCE_TYPE" :code="scope.row.serviceType"></sys-value>
                </template>
              </el-table-column>
              <el-table-column
                prop="price"
                label="价格">
                <template slot-scope="scope">
                  {{scope.row.price}} 元
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import api from '../store/giftbatchapi'
  import sysvalue from '@/warehouse/store/sysvalueapi'
  import sobapi from '../../sob/store/serviceapi'
  import { diction } from '@/store/common'
  var schema = [
    {
      name: 'type',
      type: 'systyperadio',
      code: 'THC_CARD_GIFTBATCH_TYPE',
      useValue: true,
      disabled: true,
      span: 24,
      label: '优惠券类型'
    },
    {
      name: 'name',
      disabled: true,
      label: '名称'
    },
    {
      name: 'money',
      type: 'number',
      append: '元',
      disabled: true,
      label: '减免金额'
    },
    {
      name: 'totalCount',
      type: 'number',
      append: '张',
      disabled: true,
      label: '发行数量'
    },
    {
      name: 'threshold',
      type: 'number',
      prepend: '订单满',
      append: '元可用',
      placeholder: ' ',
      disabled: true,
      label: '订单范围'
    },
    {
      name: 'useTimes',
      type: 'daterange',
      placeholder: '选择使用有效期',
      disabled: true,
      label: '有效期'
    },
    {
      name: 'overlay',
      label: '是否叠加',
      type: 'radio',
      disabled: true,
      options: diction.yesno,
      span: 12
    },
    {
      name: 'comment',
      disabled: true,
      label: '渠道备注'
    },
    {
      name: 'overlayMemberCard',
      label: '会员卡同时使用',
      type: 'radio',
      disabled: true,
      options: diction.yesno,
      span: 12
    },
    {
      name: 'categoryIds',
      label: '',
      hidden: false,
      type: 'checkbox',
      disabled: true,
      options: [],
      span: 24
    }
  ]

  export default {
    data () {
      var obj = this.$ever.createObjFromSchema(schema)
      obj.useTimes = ''
      obj.itemIds = []
      return {
        schema,
        obj,
        objId: this.$route.params.id > -1 ? this.$route.params.id : null,
        api,
        tableData: [],
        categoryIds: [],
        rules: {

        }
      }
    },
    methods: {
    },
    created () {
      if (this.objId) {
        api.getById(this.objId).then(result => {
          result.data.type = '' + result.data.type
          let ids = JSON.parse(result.data.serviceIds).categoryIds ? JSON.parse(result.data.serviceIds).categoryIds : []
          let categoryIds = []
          for (let i = 0; i < ids.length; i++) {
            sysvalue.getValByCode('THC_WH_OBJECT_SUB_TYPE', ids[i], true).then(result => {
              if (result) categoryIds.push(result)
            })
          }
          this.$ever.getFieldFromSchema(this.schema, 'categoryIds').options = categoryIds

          result.data.useTimes = []
          result.data.useTimes.push(result.data.useStartTime)
          result.data.useTimes.push(result.data.useEndTime)

          this.obj = Object.assign(this.obj, result.data)
          let itemIds = JSON.parse(result.data.serviceIds).itemIds ? JSON.parse(result.data.serviceIds).itemIds : []
          this.sobapi.list({
            ids: itemIds
          }).then(result => {
            result.data.forEach(item => {
              item.serviceType = '' + item.serviceType
            })
            this.tableData = result.data
          })
        })
      }
    },
    beforeCreate () {
      this.api = api
      this.sobapi = sobapi
    }
  }
</script>
