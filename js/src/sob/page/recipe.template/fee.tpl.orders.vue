<template>
  <div class="add-order-wrap">
    <h3 class="e_til">添加</h3>
    <div
      class="fee-orders-loading"
      v-show="loading"
      v-loading="loading"
      element-loading-text="加载费用信息中">
    </div>
    <div class="add_order_handle mt5" v-if="!loading">
      <ever-form2
        v-ever-bind-enter
        ref="orderForm"
        :key="keyRandom"
        :schema="schema"
        v-model="obj"
        :nosubmit="true"
        :gutter="10"
        :rules="rules"
        labelPosition="top"
        :showMessage="formShowMessage"
        :row-flex="true"
      >
        <template slot="serviceItem">
          <div class="service-item" v-if="obj.serviceItem">
            <span class="iconfont icon-exit clear-btn-front" @click="initOrder"></span>
            <el-input :value="obj.serviceItem.byname || obj.serviceItem.name" :disabled="true"></el-input>
          </div>
          <service-select
            v-else
            class="service_select"
            v-model="obj.serviceItem"
            :search-type="searchType"
            :type="filterAdviceType"
            three-type=""
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
          >¥ {{obj.serviceItem && obj.serviceItem.price && obj.count ? (obj.serviceItem.price * obj.count).toFixed(2) : '0.00'}}</div>
        </template>
        <template slot="handlerBtn">
          <el-button
            type="primary"
            class="handle_btn"
            @click="submit"
            :loading="subLoading"
          >添加</el-button>
        </template>
      </ever-form2>
    </div>
  </div>
</template>
<script>
import api from '@/inpatient/components/fee.orders//api'
// import storage from '@/util/storage.js'
export default {
  // searchType(number): 1：医嘱项，2：收费项
  // subOrderSource
  // 1-普通订单；
  // 10-门诊普通订单；11-门诊护士补费；12-门诊手麻补费；13-门诊结算补费
  // 30-住院普通订单；31-住院护士补费；32-住院手麻补费；33-住院结算补费
  // 34-临床路径补费；35-住院手术费用；36-产房普通费用; 37-产房护士补费;
  props: ['orderSource', 'baseInfo', 'searchType', 'subOrderSource', 'filterAdviceType'],
  data () {
    let schema = this.getSchema()
    let obj = this.$ever.createObjFromSchema(schema)
    return {
      schema: this.getSchema(),
      obj,
      subLoading: false,
      loading: false,
      formShowMessage: false,
      checkPriceInfo: false,
      keyRandom: Math.random(),
      isInteger: true
    }
  },
  computed: {
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.baseInfo.visitNumber = this.baseInfo.visitSn
      this.rules = {
        serviceItem: [{ required: true, message: '必填项', trigger: ['blur', 'change'] }],
        count: [{ required: true, message: '必填项', trigger: ['blur', 'change'] }],
        serviceName: [{ required: true, message: '必填项', trigger: 'change' }]
      }
      this.$bus.$off('edit:feeorder')
      this.$bus.$on('edit:feeorder', (data, cb) => {
        let params = {
          providerId: this.baseInfo.providerId,
          scene: 1,
          services: [{id: data.serviceId, isSet: 0}],
          visitNumber: this.baseInfo.visitNumber
        }
        this.loading = true
        api.queryOrgFeeTemplate(params).then(res => {
          if (res && res.length) {
            this.initOrder(data)
            this.obj.serviceItem = res[0]
            cb && cb()
          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      })
    },
    initOrder (data, cb) {
      this.schema = this.getSchema()
      this.obj = Object.assign(this.obj, this.$ever.createObjFromSchema(this.schema))
      this.formShowMessage = false
      this.checkPriceInfo = false
      this.keyRandom = Math.random()
      if (data) {
        let keyList = Object.keys(this.obj)
        keyList.forEach(k => {
          if (data[k]) {
            this.obj[k] = data[k]
          }
        })
      }
    },
    submit () {
      let isValid = true
      let type = 'create'
      this.$refs.orderForm.$refs.form.validate(valid => {
        if (!valid) {
          isValid = false
        }
      })
      if (isValid && !this.checkPriceInfo) {
        this.subLoading = true
        let data = JSON.parse(JSON.stringify(this.obj))
        let self = this
        let obj = this.obj
        let service = obj.serviceItem
        data = {
          serviceType: service.serviceClassification, // 收费项id
          serviceName: service.byname || service.name, // 费用名称
          serviceId: service.id, // 费用项id
          price: (service.price || 0) * obj.count, // 金额
          count: obj.count, // 数量
          countUnitId: service.unit, // 数量单位id
          countUnitName: service.unitName,
          spec: service.spec, // 规格
          finType: service.finType, // 业务分类
          feesJson: {
            chargeLevel: service.chargeLevel, // 医保等级
            finType: service.finType, // 业务分类
          }
        }
        this.$emit('submit', data, type, () => {
          this.formShowMessage = false
          self.subLoading = false
          self.initOrder()
          this.$nextTick(() => {
            this.$refs.orderForm.$refs.form.$el[0].focus()
          })
        }, () => {
          self.subLoading = false
        })
      } else {
        this.formShowMessage = true
      }
    },
    getSchema () {
      return [{
        name: 'serviceItem',
        label: '收费项目',
        comp: 'custom',
        span: 8
      }, {
        name: 'count',
        label: '数量',
        comp: 'sys-number',
        span: 4,
        props: {
          type: 'number',
          append: '',
          field: {
            min: 0,
            max: 999,
            limitInteger: this.isInteger
          }
        }
      }, {
        name: 'price',
        label: '金额',
        comp: 'custom',
        span: 2
      }, {
        name: 'handlerBtn',
        label: '　',
        comp: 'custom',
        span: 2
      }]
    }
  },
  watch: {
    'obj.serviceItem' (val) {
      if (!val) {
        this.checkPriceInfo = false
        return
      }
      if (['303', '304'].includes(val.serviceClassification)) {
        this.isInteger = false
      } else {
        this.isInteger = true
      }
      this.$ever.getFieldFromSchema(this.schema, 'count').props.append = val.unitName
    }
  }
}
</script>

<style lang="scss" scoped>
.add-order-wrap {
  margin-top: 20px;
  .service-item {
    position: relative;
    .clear-btn-front {
      position: absolute;
      right: 1px;
      top: 0;
      z-index: 10;
      color: #999;
      font-size: 10px;
      background-color: #eeeeee;
      padding: 0 5px;
      height: calc(100% - 3px);
      margin-top: 1px;
    }
    .no-bg-color {
      background-color: transparent;
    }
  }
  /deep/ .el-form-item-error {
    padding-top: 2px;
    right: 0;
    line-height: 16px;
    background: rgba(0, 0, 0, 0);
    color: #f56c6c;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 400;
  }
  .fee-orders-loading {
    height: 50px;
    background-color: #fff;
    /deep/ .el-loading-spinner {
      margin-top: -36px;
    }
  }
  .e_til {
    font-size: 14px;
    padding: 5px 10px;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
  }
  .add_order_handle {
    max-width: 70%;
    min-width: 800px;
    height: 84px;
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
