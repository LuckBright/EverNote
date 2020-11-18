<template>
  <el-dialog
    title="批量编辑"
    class="mutil-edit-dialog"
    width="1200px"
    :append-to-body="true"
    :modal-append-to-body="true"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="type-wrap" v-for="item in list" :key="item.type">
      <template v-if="item.list.length">
        <div class="type-title">
          <span class="title-name">
            <template v-if="['301.302', '303.304'].includes(item.type)">{{item.type | getType}}</template>
            <sys-value v-else type="THC_WH_OBJECT_SUB_TYPE" :code="item.type" :show-en="true"></sys-value>
          </span>
        </div>
        <div class="type-orders">
          <draggable
            :list="item.list"
            :disabled="item.list.length < 2"
            class="list-group"
            ghost-class="ghost"
            v-bind="$attrs"
            @start="dragging = true"
            @end="dragging = false"
          >
            <div
              class="order-item"
              :class="{'surgery': item.type==='2125', 'tradition-medicine': ['303.304', '303', '304'].includes(item.type)}"
              v-for="(order,index) in item.list" :key="getRandom(order)">
              <issuedOrders
                ref="issuedOrders"
                :orders="order"
                :service-type="item.type"
                :share-info="shareInfo"
                :execute-provider-types="executeProviderTypes"
                v-bind="$attrs"
                @remove="removeOrder(item, index)"
              >
                <!-- 剂量需要有领量 -->
                <template slot="measure" slot-scope="{order}">
                  <sys-text
                    class="required"
                    v-model="order.measure"
                    type="number"
                    :append="order.measureUnitName"
                  ></sys-text>
                  <label :class="+order.count?'el-form-item__info':'el-form-item__error'">
                    {{$t('单次领量')}}:{{(order.count || 0) + (order.countUnitName || '')}}
                  </label>
                </template>
              </issuedOrders>
            </div>
          </draggable>
        </div>
      </template>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary"  @click="add" :loading="addFinished">
        添加
      </el-button>
      <el-button type="default"  @click="close">
        取消
      </el-button>
    </div>
    <!-- 机构无医嘱提示弹窗 -->
    <use-limit-dialog
      v-if="useValid"
      title="引用提示"
      :limit-show.sync="useValid"
      @afterOk="afterOk"
    >
      <div slot="content">
        <p>以下项目已停用，引用失败：</p>
        <span>{{this.noService.map(item => item.serviceName).join('、')}}</span>
      </div>
    </use-limit-dialog>
  </el-dialog>
</template>
<script>
import {objRemove} from '@/util/common.js'
import issuedOrders from './issued.orders.multi.vue'
import draggable from 'vuedraggable'
import useLimitDialog from '@/inpatient/components/doctor.state/use.limit.dialog.vue'

export default {
  components: { issuedOrders, draggable, useLimitDialog },
  props: {
    list: {
      type: Array,
      required: true
    },
    editDialogShow: {
      type: Boolean,
      default: false
    },
    executeProviderTypes: {     // 执行地科室类型
      type: Array,
      default: () => ['01.02', '01.03', '02.01', '02.02', '02.03', '02.04'] // 默认门急诊+医技
    },
    shareInfo: Object | String
  },
  data () {
    return {
      dragging: false,
      addFinished: false,
      noService: [],
      useValid: false
    }
  },
  computed: {
    visible: {
      get: function () {
        return this.editDialogShow
      },
      set: function (val) {
        this.$emit('update:editDialogShow', val)
      }
    }
  },
  mounted () {
    this.hasService(this.list)
  },
  methods: {
    getRandom (order) {
      if (order.keyId) {
        return order.keyId
      } else {
        return order[0].keyId
      }
    },
    close () {
      this.$emit('update:editDialogShow', false)
    },
    add () {
      let data = []
      let isValid = true
      let self = this
      this.addFinished = true
      this.$refs.issuedOrders && this.$refs.issuedOrders.forEach(item => {
        let submitList = item.submitEvent()
        if (!submitList) {
          isValid = false
          return
        }
        data.push(submitList)
      })
      if (!isValid) {
        this.addFinished = false
        return
      }
      let type = 'create'
      this.$bus.$emit('check:orderdata', {
        data,
        type,
        success () {
          self.addFinished = false
          self.$emit('update:editDialogShow', false)
        },
        fail () {
          self.addFinished = false
        }
      })
    },
    removeOrder (order, index) {
      order.list.splice(index, 1)
      if (!order.list.length) {
        delete order.list
        objRemove(this.list, order)
      }
    },
    hasService (datas) {
      this.noService = []
      datas.forEach(item => {
        let serviceList = item.list
        if (item.type === '301.302') {
          serviceList.forEach(list => {
            let removeService = objRemove(list, (order) => {
              if (order.adviceFeesDtoList && !order.serviceItem) {
                return true
              }
            })
            if (removeService.length) {
              this.noService.push(...removeService)
              list.splice(0)
            }
          })
          item.list = serviceList.filter(item => item.length) // 删除空医嘱列表
        } else if (item.type === '303.304') {
          serviceList.forEach(list => {
            let removeService = objRemove(list.adviceFeesDtoList, (order) => {
              if (!order.serviceItem) {
                return true
              }
            })
            if (removeService.length) {
              list.adviceFeesDtoList.splice(0)
              this.noService.push(...removeService)
            }
          })
          item.list = serviceList.filter(item => item.adviceFeesDtoList.length) // 删除空中药列表
        } else if (item.type === 'undefined') {
          this.noService.push(...serviceList)
        } else {
          let removeService = objRemove(serviceList, (order) => {
            if (order.adviceFeesDtoList && !order.serviceItem) {
              return true
            }
          })
          removeService.length && this.noService.push(...removeService)
        }
      })
      objRemove(datas, {type: 'undefined'})
      if (this.noService.length) {
        this.useValid = true
      }
    },
    // 跨机构引用模板，为查询到该项目，提示信息以后再关闭弹窗
    afterOk () {
      this.noService = []
      if (!this.list.reduce((len, item) => (len + item.list.length), 0)) {
        this.close()
      }
    }
  },
  filters: {
    getType (val) {
      if (val === '301.302') {
        return '西药/中成药'
      }
      if (val === '303.304') {
        return '中药饮片/中药颗粒'
      }
      return ''
    }
  },
  watch: {
    'list': {
      handler (val) {
        if (!val.length && !this.noService.length) {
          this.close()
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
  .type-title {
    text-align: center;
    .title-name {
      // display: flex;
      overflow: hidden;
      text-align: center;
      white-space: nowrap;
      width: 240px;
      margin: auto;
      &:before, &:after {
        content: '';
        display: inline-block;
        width: 30px;
        height: 1px;
        background-color: #ddd;
        vertical-align: middle;
        margin: 8px 10px;
      }
    }
  }
  .type-wrap {
    padding: 0 10px 0 20px;
  }
  
  .order-item {
    &.surgery {
      /deep/ .el-form-item__label {
        display: block;
      }
    }
    /deep/ .el-form-item__label {
      display: none;
    }
    /deep/ .issued_com_box {
      .el-form-item__label {
        display: block;
        line-height: 36px;
      }
    }
    &:first-child {
      /deep/ .issued_orders_box:first-child {
        .el-form-item__label {
          display: block;
        }
      }
    }
    &.tradition-medicine {
      border-bottom: 1px solid #eaeaea;
      margin-bottom: 10px;
      &:last-child {
        border-bottom: none;
      }
    }
  }
  .dialog-footer {
    text-align: right;
  }
</style>
