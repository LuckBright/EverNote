<template>
  <div>
    <div class="add_order_wrap">
      <slot></slot>
      <h3 class="e_til" v-if="!isAdd">补费</h3>
      <h3 class="e_til" v-else>添加</h3>
      <div class="add_order_handle mt5">
        <ever-form2
          v-ever-bind-enter
          ref="orderForm"
          :schema="schema"
          v-model="obj"
          :nosubmit="true"
          :gutter="10"
          :rules="rules"
          labelPosition="top"
          :row-flex="true"
        >
          <template slot="serviceItem">
            <service-select
              class="service_select"
              v-model="obj.serviceItem"
              :search-type="searchType"
              :type="obj.serviceItem && obj.serviceItem.serviceClassification ? obj.serviceItem.serviceClassification : adviceType"
              :three-type="obj.serviceItem && obj.serviceItem.threeServiceClassify ? obj.serviceItem.threeServiceClassify : ''"
              value-key="id"
              placeholder
              :scene="3"
              :providerId="baseInfo.dptId"
              :isFee="true"
              ref="select"
            ></service-select>
          </template>
          <template slot="price">
            <div
              class="no_wrap"
            >¥ {{obj.serviceItem && obj.serviceItem.price && obj.quantity ? (obj.serviceItem.price * obj.quantity).toFixed(2) : '0.00'}}</div>
          </template>
          <template slot="handlerBtn">
            <el-button
              v-if="!isAdd"
              type="primary"
              class="handle_btn"
              @click="supplyOrder"
              :disabled="supplyDisabled"
            >补费</el-button>
            <el-button
              v-else
              type="primary"
              class="handle_btn"
              @click="supplyOrder"
              :disabled="supplyDisabled"
            >添加</el-button>
          </template>
        </ever-form2>
      </div>
    </div>
  </div>
</template>
<script>
import orderApi from '@/inpatient/store/advice/order'
import inhospitalApi from '@/workspace/store/inhospital'
// import storage from '@/util/storage.js'
export default {
  // searchType(number): 1：医嘱项，2：收费项
  props: ['orderSource', 'baseInfo', 'searchType', 'subOrderSource', 'filterAdviceType', 'initData', 'isAdd'],
  data () {
    let schema = [
      {
        name: 'serviceItem',
        label: '收费项目',
        comp: 'custom'
      },
      {
        name: 'quantity',
        label: '数量',
        comp: 'sys-text',
        span: 6,
        props: {
          type: 'number',
          append: '',
          field: {
            min: 1,
            max: 999,
            limitInteger: true
          }
        }
      },
      {
        name: 'openProviderId',
        label: '开单科室',
        comp: 'sys-select',
        span: 6,
        props: {
          options: []
        }
      },
      {
        name: 'executeProviderId',
        label: '执行科室',
        comp: 'sys-select',
        span: 6,
        props: {
          options: []
        }
      },
      {
        name: 'price',
        label: '金额',
        comp: 'custom',
        span: 6
      },
      {
        name: 'handlerBtn',
        label: '　',
        comp: 'custom',
        span: 6
      }
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      schema,
      obj,
      supplyDisabled: false,
      providerArr: [],
      adviceType: this.filterAdviceType || '802,867,2125,2126,2466,300,553',
      rules: {
        serviceItem: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] }
        ],
        quantity: [
          { required: true, message: '必填项', trigger: ['blur', 'change'] }
        ],
        openProviderId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        executeProviderId: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        finType: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        serviceName: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      },
      tableStatus: [
        {
          id: 0,
          name: '未开始'
        },
        {
          id: 1,
          name: '进行中'
        },
        {
          id: 2,
          name: '已完成'
        },
        {
          id: 3,
          name: '待审核（药品）'
        },
        {
          id: -1,
          name: '已取消'
        },
        {
          id: -2,
          name: '已删除'
        },
        {
          id: -3,
          name: '已退费'
        }
      ]
    }
  },
  computed: {
  },
  created () {
    this.queryServiceProvider()
    this.queryexecuteProvider()
    this.obj.openProviderId = this.baseInfo.providerId || this.baseInfo.dptId
  },
  methods: {
    async queryServiceProvider () {
      let params = {
        categoryIds: ['1972'],
        clinicalTypeIds: []
      }
      // 住院传841，门诊传819， 急诊传840
      if ([30, 31, 32, 33, 34, 35, 36, 37].includes(this.subOrderSource)) {
        params.clinicalTypeIds.push('841')
      } else {
        params.clinicalTypeIds = ['819', '840']
      }
      this.providerArr = []
      const res = await inhospitalApi.getLocalSectionVoListForService(params)
      if (res && res.data && res.data.length) {
        res.data.map(item => {
          item.id = item.sectionRecordId
          return item
        })
        this.providerArr = res.data
        this.providerMap = {}
        this.providerArr.map(item => {
          this.providerMap[item.id] = item.name
        })
        this.$emit('map', this.providerMap)
        this.$nextTick(_ => {
          this.$ever.getFieldFromSchema(
            this.schema,
            'openProviderId'
          ).props.options = this.providerArr
        })
      }
    },
    async queryexecuteProvider () {
      let params = {
        categoryIds: ['1972'],
        clinicalTypeIds: []
      }
      // 住院传841，门诊传819， 急诊传840
      if ([30, 31, 32, 33, 34, 35, 36, 37].includes(this.subOrderSource)) {
        params.clinicalTypeIds.push('841')
      } else {
        params.clinicalTypeIds = ['819', '840']
      }
      this.providerArr = []
      const res = await inhospitalApi.getLocalSectionVoListForService(params)
      if (res && res.data && res.data.length) {
        res.data.map(item => {
          item.id = item.sectionRecordId
          return item
        })
        this.providerArr = res.data
        this.$nextTick(_ => {
          this.$ever.getFieldFromSchema(
            this.schema,
            'executeProviderId'
          ).props.options = this.providerArr
        })
      }
    },
    async supplyOrder () {
      let isValid = true
      this.supplyDisabled = true
      this.$refs.orderForm.$refs.form.validate(valid => {
        if (!valid) {
          isValid = false
        }
      })
      if (isValid) {
        if (
          this.baseInfo &&
          this.baseInfo.patientId &&
          (this.baseInfo.hospitalizedNumber || this.baseInfo.visitNumber)
        ) {
          let postdata = Object.assign({}, this.baseInfo, this.obj)
          postdata.adviceId = this.obj.serviceItem.id
          postdata.adviceType = this.obj.serviceItem.isSet ? 2 : 1
          postdata.orderSource = this.orderSource
          // 1-普通订单；
          // 10-门诊普通订单；11-门诊护士补费；12-门诊手麻补费；13-门诊结算补费
          // 30-住院普通订单；31-住院护士补费；32-住院手麻补费；33-住院结算补费
          // 34-临床路径补费；35-住院手术费用；36-产房普通费用; 37-产房护士补费;
          if (this.subOrderSource) {
            postdata.subOrderSource = this.subOrderSource
          }
          if (this.orderSource === 1) {
            if (postdata.hospitalizedNumber) delete postdata.hospitalizedNumber
          } else if (this.orderSource === 3) {
            if (postdata.visitNumber) delete postdata.visitNumber
          }
          if (this.recipeId && this.$route.path.split('/')[1] !== 'csa') postdata.recipeId = this.recipeId
          if (this.isAdd) {
            this.supplyDisabled = false
            this.addItem(postdata, this.obj)
            return
          }
          delete postdata.serviceItem
          delete postdata.price
          const res = await orderApi.supplyOrder(postdata)
          if (res && res.head && res.head.errCode === 0) {
            this.obj = this.$ever.createObjFromSchema(this.schema)
            this.$refs.orderForm.$refs.form.resetFields()
            this.$messageTips(this, 'success', '操作成功', '提示')
            this.$emit('update')
          }
          this.supplyDisabled = false
        } else {
          this.supplyDisabled = false
          this.$messageTips(this, 'warning', '患者信息缺失', '提示')
        }
      } else {
        this.supplyDisabled = false
      }
    },
    addItem (postdata, res) {
      const obj = {}
      obj.res = JSON.parse(JSON.stringify(res))
      obj.serviceItem = postdata.serviceItem // 原始数据
      obj.providerName = this.providerMap[postdata.providerId]
      obj.excuteProvider = this.providerMap[postdata.executeProviderId]
      if (['301', '302', '303', '304'].includes(postdata.serviceItem.serviceClassification)) {
        obj.name = postdata.serviceItem.byname + (postdata.serviceItem.name ? '（' + postdata.serviceItem.name + '）  ' : '  ') + (postdata.serviceItem.spec ? ' ' + postdata.serviceItem.spec : '')
      } else {
        obj.name = postdata.serviceItem.name || ''
      }
      obj.count = this.obj.quantity + postdata.serviceItem.unitName
      obj.price = '￥' + postdata.serviceItem.price
      obj.totalPrice = obj.serviceItem && obj.serviceItem.price && this.obj.quantity ? (obj.serviceItem.price * this.obj.quantity).toFixed(2) : '0.00'
      delete postdata.serviceItem
      delete postdata.price
      obj.postdata = postdata // 需要发送的数据
      this.$emit('add', obj)
      this.$refs.orderForm.$refs.form.resetFields()
    }
  },
  watch: {
    'obj.serviceItem' (val) {
      if (['800', '801'].includes(val.serviceClassification) && this.subOrderSource === 32) {
        if (this.schema[4].name !== 'isEmergency') {
          let obj = {
            name: 'isEmergency',
            label: '加急',
            comp: 'sys-select',
            span: 2,
            props: {
              type: 'singleCheckbox',
              labelNumber: true
            }
          }
          this.schema.splice(4, 0, obj)
        }
      } else {
        if (this.schema[4].name === 'isEmergency') {
          this.schema.splice(4, 1)
        }
      }
      this.$ever.getFieldFromSchema(this.schema, 'quantity').props.append = val.unitName
    },
    'initData': {
      handler (val) {
        if (this.isAdd) {
          this.obj = JSON.parse(JSON.stringify(val))
          this.obj.serviceItem.echo = undefined
        } else {
          this.obj.serviceItem = JSON.parse(JSON.stringify(val))
          this.obj.serviceItem.echo = undefined
          this.obj.quantity = val.quantity
          this.obj.price = val.price
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.add_order_wrap {
  .e_til {
    font-size: 14px;
    margin: -8px -20px 0;
    padding: 5px 20px;
    border-bottom: 1px solid #ccc;
  }
  .add_order_handle {
    max-width: 70%;
    min-width: 800px;
    .no_wrap {
      white-space: nowrap;
    }
    .handle_btn {
      display: inline-block;
      vertical-align: top;
    }
  }
  /deep/ .el-form-item__label {
    justify-content: flex-start;
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
    .el-form-item__label,
    .el-form-item__content {
      height: 30px;
      line-height: 30px;
      /deep/.el-button {
        padding: 5px 10px;
        font-size: 12px;
      }
    }
    .el-input__inner,
    .el-input__prefix,
    .el-input__suffix {
      height: 30px;
      line-height: 30px;
    }
    .el-input__icon {
      line-height: 24px;
    }
  }
}
</style>
