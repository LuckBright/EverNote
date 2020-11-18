<template>
  <div id="workToday" class="home home-default">
    <div class="home-heading">
      <p class="opt">{{dateFormat(dataObj.nowDate, 'YYYY-MM-DD')}}</p>
      <h4>今日工作统计</h4>
    </div>
    <div class="home-body taskWar">
      <div class="datas">
        <el-row>
          <el-col :span="4">
            <div class="dataCell">
              <p class="tit">采购入库</p>
              <p class="num">{{dataObj.purchaseOderCount || 0}}</p>
            </div>
          </el-col>
          <el-col :span="4" v-if="permissionObj.drugallotbounds">
            <div class="dataCell">
              <p class="tit">申领入库</p>
              <p class="num">{{dataObj.inPurchaseRequistionCount || 0}}</p>
            </div>
          </el-col>
          <el-col :span="4" v-if="permissionObj.allocationadd">
            <div class="dataCell">
              <p class="tit">调拨入库</p>
              <p class="num">{{dataObj.inAllotBoundCount || 0}}</p>
            </div>
          </el-col>
          <el-col :span="4" v-if="permissionObj.storagebacks">
            <div class="dataCell">
              <p class="tit">退库入库</p>
              <p class="num">{{dataObj.inRefund || 0}}</p>
            </div>
          </el-col>
          <el-col :span="4" v-if="!isInvented">
            <div class="dataCell">
              <p class="tit">退返入库</p>
              <p class="num">{{dataObj.returnInCount || 0}}</p>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="dataCell">
              <p class="tit">采购退货</p>
              <p class="num">{{dataObj.purchaseBackCount || 0}}</p>
            </div>
          </el-col>
          <el-col :span="4" v-if="permissionObj.drugallotbounds">
            <div class="dataCell">
              <p class="tit">申领出库</p>
              <p class="num">{{dataObj.purchaseRequistionCount || 0}}</p>
            </div>
          </el-col>
          <el-col :span="4" v-if="permissionObj.allocationadd">
            <div class="dataCell">
              <p class="tit">调拨出库</p>
              <p class="num">{{dataObj.outAllotBoundCount || 0}}</p>
            </div>
          </el-col>
          <el-col :span="4" v-if="permissionObj.storagebacks">
            <div class="dataCell">
              <p class="tit">退库出库</p>
              <p class="num">{{dataObj.refundCount || 0}}</p>
            </div>
          </el-col>
          <el-col :span="4" v-if="!isInvented">
            <div class="dataCell">
              <p class="tit">领用出库</p>
              <p class="num">{{dataObj.applyCount || 0}}</p>
            </div>
          </el-col>
          <el-col :span="4" v-if="permissionObj.drugbacks">
            <div class="dataCell">
              <p class="tit">销毁出库</p>
              <p class="num">{{dataObj.destroyCount || 0}}</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="fastenter">
        <el-row>
          <el-col 
            v-for="(item, index) in btnsList" :key="index"
            v-if="item.top && item.show"
            :span="4">
            <el-button 
              size="small"
              class="btn-small w_80"
              @click="$router.push(`/storages${item.url}`)">{{item.name}}</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col 
            v-for="(item, index) in btnsList" :key="index"
            v-if="item.bottom && item.show"
            :span="4">
            <el-button 
              size="small"
              class="btn-small w_80"
              @click="$router.push(`/storages${item.url}`)">{{item.name}}</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../store/storagesapi'
import { dateFormat } from '@/util/common'
import homeBtnsMixins from '@/warehouse/page/storages/home/home.btns.mixins.js'
export default {
  mixins: [homeBtnsMixins],
  data () {
    return {
      dataObj: {},
    }
  },
  methods: {
    getDetail () {
      api.getInfo(this.listParams).then(res => {
        this.dataObj = res
      })
    },
    dateFormat
  },
  created () {
    this.getDetail()
  }
}
</script>

<style lang="scss" scoped>
  .taskWar {
    height: 260px;
    overflow-y: auto;
    overflow-x: hidden;
    background: #FFF url('../../../../assets/img/001.png') right bottom no-repeat;
  }

  .w_80 {
    width: 80px;
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
