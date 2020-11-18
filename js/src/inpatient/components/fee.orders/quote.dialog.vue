<template>
  <el-dialog
    title="批量编辑"
    :visible.sync="visible"
    width="1100px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    :modal-append-to-body="true">
    <div class="fee-quote-content" v-if="feeList.length">
      <feeOrder
        ref="feeOrder"
        v-for="item in feeList"
        :key="item.id"
        v-bind="$attrs"
        :editor-data="item"
        :is-add="false"
        :fee-to-stock-tpl="feeToStock"
        :workspace="workspace"
        :scene="scene"
        :base-info="baseInfo"
        :has-header="false"
        @clear="deleteFee(item)"
        @countchange='countchange'
      ></feeOrder>
      
    </div>
    <div v-else class="no-data"></div>
    <div slot="footer" class="dialog-footer">
     合计:￥{{totalProce.toFixed(2)}}
     &nbsp; &nbsp;
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
        <span>{{this.noServiceFee.map(item => item.serviceName).join('、')}}</span>
      </div>
    </use-limit-dialog>
    <!-- 库存不足 -->
    <el-dialog
      v-if="wringStockList.length"
      :visible.sync="noStockSubmit"
      title="警告"
      size="small"
      class="ui_dialog_02"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
      :modal-append-to-body="true"
      @close="cancelStock"
    >
      <div class="waring-wrap">
        <span class="title">{{$t('库存不足')}}</span>
        <ul>
          <li v-for="(item, i) in wringStockList" :key="i">
            <template>{{i + 1}}、{{item.serviceItem.byname || item.serviceItem.name}}</template>
            <template v-if="item.serviceItem.spec">{{item.serviceItem.spec}}</template>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <template v-if="stockPermission">
          <el-button @click="cancelStock">
            <i class="icon iconfont icon-quxiao"></i>{{$t('取消')}}
          </el-button>
          <el-button type="primary" @click="conSubmitStock">
            <i class="icon iconfont icon-tijiao"></i>{{$t('继续提交')}}
          </el-button>
        </template>
        <el-button type="primary" @click="cancelStock" v-else>
          <i class="icon iconfont icon-quxiao"></i>{{$t('我知道了')}}
        </el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script>
import feeOrder from './fee.orders.vue'
import feeOrderApi from './api'
import useLimitDialog from '@/inpatient/components/doctor.state/use.limit.dialog.vue'
import orderApi from '@/inpatient/components/issued.orders/api.js'

export default {
  components: {feeOrder, useLimitDialog},
  props: {
    workspace: String, // 工作站类型，有这个字段就不用filterAdviceType
    scene: {
      type: Number,
      default: 1
    },
    baseInfo: Object
  },
  data () {
    return {
      visible: false,
      addFinished: false,
      feeList: [],
      feeToStock: '2',
      noStockSubmit: false,
      wringStockList: [],
      noServiceFee: [], // 当前机构停用的费用项
      useValid: false,
      stockPermission: true, // 是否允许缺库存提交
      totalProce: 0
    }
  },
  created () {
    this.init()
  },
  watch: {
    'feeList' () {
      this.$nextTick(_ => {
        this.countchange()
      })
    }
  },
  computed: {

  },
  methods: {
    countchange() {
      let sum = 0
      this.$refs.feeOrder.forEach(ele => {
        sum += ele.obj.serviceItem.price * (ele.obj.count || 0)
      })
      this.totalProce = sum
    },
    init () {
      this.getFeeToStock()
    },
    open (data) {
      if (data) {
        this.noServiceFee = data.filter(item => {
          return !item.serviceItem
        })
        this.feeList = JSON.parse(JSON.stringify(data)).filter(item => {
          return item.serviceItem
        })
        if (this.noServiceFee.length) {
          this.$nextTick(() => {
            this.useValid = true
          })
        }
      } else {
        this.noServiceFee = []
        this.feeList = []
      }
      this.visible = true
    },
    close () {
      this.visible = false
      this.noServiceFee = []
      this.feeList = []
      this.$emit('close')
    },
    async add () {
      this.addFinished = true
      let p = this.$refs.feeOrder.map(item => {
        return item.getSubmitStatus()
      })
      let results = await Promise.all(p)
      if (results.includes(false)) {
        this.addFinished = false
        return
      }
      let isNotCharge = await this.isNotCharge(results)
      if (isNotCharge) {
        this.$refs.feeOrder.forEach(item => {
          item.checkCharge(isNotCharge)
        })
        this.addFinished = false
        return
      }
      this.wringStockList = []
      results.forEach(item => {
        if (item.isShort) {
          this.wringStockList.push(item)
        }
      })
      if (this.wringStockList.length) {
        this.stockPermission = await this.getStockPermission()
        this.noStockSubmit = true
        this.waitSubmitData = results
        return
      }
      let datas = this.$refs.feeOrder && this.$refs.feeOrder.map(item => {
        return item.getSubmitData()
      })
      this.$emit('submit', datas)
      this.addFinished = false
      this.visible = false
    },
    deleteFee (data) {
      this.feeList = this.feeList.filter(item => item.id !== data.id)
      if (!this.feeList.length) {
        this.close()
      }
    },
    // 获取缺库存是否能提交医嘱配置
    async getStockPermission () {
      let res = await orderApi.searchCheckConfig({
        code: 'OUT_OF_STOCK_PERMIT_SEND',
        defaultValue: '1'
      })
      if (res && +res.value) {
        return true
      }
      return false
    },
    // 获取联动库存的配置
    async getFeeToStock () {
      let res = await feeOrderApi.getIsOutStock()
      if (res) {
        this.feeToStock = String(res) || '2'
        return
      }
      this.feeToStock = '2'
    },
    getData (obj) {
      let data = JSON.parse(JSON.stringify(obj))
      let service = obj.serviceItem
      data = {
        executeProviderId: obj.executeProvider.id, // 执行科室id
        executeProviderName: obj.executeProvider.name, // 执行科室name
        providerId: obj.provider.id, // 开单科室id
        providerName: obj.provider.name, // 开单科室名称
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
          chargeLevel: service.chargeLevel,
          finType: service.finType,
          feesDoctorId: obj.feesDoctor.id, // 开单医生id
          feesDoctorName: obj.feesDoctor.name, // 开单医生名称
          outwardDeliveryFlag: service.outwardDeliveryFlag // 外送
        }
      }
      if (+this.feeToStock === 1 && obj.storageRoom) {
        data.feesJson.materialType = obj.storageRoom.materialType
        data.feesJson.sendOrgId = obj.storageRoom.sendOrgId
        data.feesJson.storageRoomId = obj.storageRoom.id
        data.feesJson.storageRoomName = obj.storageRoom.name
        data.feesJson.localMaterialId = service.localMaterialId
        data.feesJson.globalMaterialId = service.globalMaterialId
      }
      return data
    },
    // 欠费补费
    async isNotCharge (datas) {
      if (this.scene !== 3) {
        return false
      }
      let price = datas.reduce((total, item) => {
        return total + (+item.count * item.serviceItem.price || 0)
      }, 0)
      let params = {
        sceneCode: this.workspace,
        hospitalizedNumber: this.baseInfo.hospitalizedNumber,
        price
      }
      let res = await feeOrderApi.isCharge(params)
      if (!res) {
        return []
      }
      let chargeType = res.arrearageRule.split(',') // 欠费可补费类型
      let status = res.arrearageStatus // 是否欠费 0-否 1-是
      if (+status === 0) {
        return false
      }
      let hasType = true
      for (let i = 0, l = datas.length; i < l; i++) {
        if (!chargeType.includes(datas[i].serviceItem.serviceClassification)) {
          hasType = false
          break
        }
      }
      if (hasType) {
        return false
      }
      return chargeType
    },
    cancelStock () {
      this.wringStockList = []
      this.noStockSubmit = false
      this.addFinished = false
    },
    conSubmitStock () {
      // let datas = this.waitSubmitData && this.waitSubmitData.map(item => this.getData(item))
      let datas = this.$refs.feeOrder && this.$refs.feeOrder.map(item => {
        return item.getSubmitData()
      })
      this.noStockSubmit = false
      this.$emit('submit', datas)
      this.addFinished = false
      this.visible = false
    },
    // 引用模板，为查询到该项目，提示信息以后再关闭弹窗
    afterOk () {
      this.noServiceFee = []
      if (!this.feeList.length) {
        this.close()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}
.fee-quote-content {
  padding-left: 40px;
}
.waring-wrap {
  border: 1px solid #ee4433;
  border-radius: 4px;
  background: rgba(238, 68, 51, 0.12);
  box-shadow: none;
  color: #ee4433;
  margin-bottom: 20px;
  line-height: 22px;
  position: relative;
}
.waring-wrap .title {
  position: absolute;
  width: 100px;
  font-weight: bold;
  left: 20px;
  top: 18px;
}
.waring-wrap ul {
  padding-left: 100px;
}
.waring-wrap ul li {
  line-height: 33px;
}
.no-data {
  height: 100px;
}
.totalProce{
  text-align:right;
}
</style>
