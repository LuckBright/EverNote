<template>
  <div id="workToday" class="home home-default">
    <div class="home-heading">
      <p class="opt">{{dateFormat(dataObj.time, 'YYYY-MM-DD')}}</p>
      <h4>今日工作统计</h4>
    </div>
    <div class="home-body taskWar">
      <div class="datas">
        <el-row>
          <el-col :span="6" v-if="showApply">
            <div class="dataCell">
              <p class="tit">机构采购申请</p>
              <p class="num">{{dataObj.clinicPurchaseApply || 0}}</p>
            </div>
          </el-col>
          <el-col :span="6" v-if="showOrder">
            <div class="dataCell">
              <p class="tit">机构采购单</p>
              <p class="num">{{dataObj.clinicPurchase || 0}}</p>
            </div>
          </el-col>
          <el-col :span="6" v-if="showTenant">
            <div class="dataCell">
              <p class="tit">集中采购申请</p>
              <p class="num">{{dataObj.orgPurchaseApply || 0}}</p>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" v-if="showConsumptivereceives">
            <div class="dataCell">
              <p class="tit">领用</p>
              <p class="num">{{dataObj.apply || 0}}</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="fastenter">
        <el-button size="small" class="btn-small mr10 w_100" @click="$router.push(`/goods/${isBatch ? 'consumptivereceiveaddbatch' : 'consumptivereceiveadd'}`)" v-if="showConsumptivereceives">领用</el-button>
        <el-button size="small" class="btn-small mr10 w_100" @click="$router.push('/goods/procurementdetail')" v-if="showApply">机构采购申请</el-button>
        <el-button size="small" class="btn-small mr10 w_100" @click="$router.push('/goods/drugpurcheaseadd?drug=true')" v-if="showOrder">机构采购</el-button>
        <el-button size="small" class="btn-small w_100" @click="$router.push('/goods/focusprocurementdetail')" v-if="showTenant">集中采购申请</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/warehouse/page/Integrated/api/integratedapi.js'
import { dateFormat } from '@/util/common'
import storage from '@/util/storage'

export default {
  mixins: [storage],
  data () {
    return {
      dataObj: {},
      isBatch: Number(storage.getStorageByClinic('IS_BATCHPRICE') || ''), // 定价模式
    }
  },
  created () {
    this.getData()
  },
  computed: {
    showApply () { // 机采申请
      return this.$hasPermission('Auth_menu_goods_purchase_apply')
    },
    showOrder () { // 机构采购单
      return this.$hasPermission('Auth_menu_goods_purchase_order')
    },
    showConsumptivereceives () { // 领用
      return this.$hasPermission('Auth_menu_purchase_business_consumptivereceives')
    },
    showTenant () { // 集中采购申请
      return this.$hasPermission('Auth_menu_goods_purchase_focuspurchase')
    },

  },
  methods: {
    getData () {
      api.getWorkStatistics().then(res => {
        if (res) {
          this.dataObj = res
        }
      })
    },
    dateFormat
  },
}
</script>

<style lang="scss" scoped>
  .taskWar {
    height: 260px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .datas {
    padding: 10px 10px 30px;
    height: 130px
  }

  .fastenter {
    padding: 0 30px;
  }

  .fastenter button {
    margin-bottom: 10px;
    margin-left: 10px;
  }

  .dataCell {
    text-align: center;
  }

  .dataCell .tit {
    color: #000;
    line-height: 20px;
    padding-bottom: 10px;
    font-size: 14px
  }

  .dataCell .num {
    font-size: 25px;
    color: #1C7BEF;
    line-height: 30px;
    font-weight: 500;
    height: 45px
  }

  @media screen and (max-width: 1600px) {
    #workToday /deep/ .el-button.btn-small {
      padding: 7px !important;
    }
  }
</style>
