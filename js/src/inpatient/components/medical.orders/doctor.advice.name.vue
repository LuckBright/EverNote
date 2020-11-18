<template>
  <span class="namesWrap">
    <!-- 父子医嘱标识 -->
    <span v-if="Number(row.mainFlag)" class="leftIcons">
      <span class="top" v-if="Number(row.mainFlag) === 1"></span>
      <span class="middle" v-else-if="fuziData[row[setMainGroupId]] && fuziData[row[setMainGroupId]].length > fuziData[row[setMainGroupId]].findIndex(item => {return item.id === row.id}) + 1"></span>
      <span class="bottom" v-else></span>
    </span>
    <span class="cellMain">
      <!-- 组套 -->
      <template v-if="row.setFlag">
        <service-set-items :item="row"></service-set-items>
      </template>
      <!-- 药品逻辑 -->
      <template v-else-if="['301', '302', '303', '304'].includes(row.serviceType)">
        <!-- 西药、中成药 -->
        <template v-if="['301', '302'].includes(row.serviceType)">
          <drug-info class="bold" :drug-obj="row"></drug-info>
        </template>
        <!-- 中药饮片、中药颗粒 -->
        <template v-if="['303', '304'].includes(row.serviceType)">
          <span v-for="(drug, d) in row.adviceFeesDtoList" :key="d" class="labWrap">
            <template v-if="String(drug.feesType) === '1'">
              <label class="bold">{{drug.serviceName}}</label>
              <label style="top:-5px;" class="lab" v-if="drug.footnoteName">({{drug.footnoteName}})</label>
              <label style="bottom:-5px;" class="lab">{{drug.count}}{{drug.countUnitName}}</label>
            </template>
          </span>
        </template>
        <!-- 毒麻精放等标识 -->
        <template v-if="row.specialClassifyDrug">
          <el-tooltip v-for="code in row.specialClassifyDrug.split(',')" :key="code">
            <span slot="content">{{specialClassify[code] && specialClassify[code].name || ''}}</span>
            <svg class="icon fontMargin" aria-hidden="true" v-if="specialClassify[code]">
              <use :xlink:href="'#' + specialClassify[code].icon"></use>
            </svg>
          </el-tooltip>
        </template>
      </template>
      <!-- 非药品逻辑 -->
      <template v-else>
        <span class="bold">{{row.doctorAdviceName || row.serviceName}}</span>
      </template>
      <!-- 甲乙丙类标识 -->
      <i class="iconfont icon-charge"
        :class="{'icon-jia': String(row.chargeLevel) === '1',
        'icon-CombinedShape': String(row.chargeLevel) === '2',
        'icon-bing': String(row.chargeLevel) === '3',
        'icon-menzhen-lixiu': String(row.chargeLevel) === '4'}"></i>
      <!-- 套餐标识 -->
      <i class="iconfont icon-taocan" v-if="row.shopSetItemId"></i>
      <!-- 缺货标识 -->
      <svg class="icon fontMargin" aria-hidden="true" v-if="String(row.shortageFlag) === '1'">
        <use xlink:href="#icon-que"></use>
      </svg>
    </span>
  </span>
</template>
<script>
import serviceSetItems from '@/inpatient/components/medical.orders/service.set.items'
import { specialClassify } from '@/inpatient/components/doctor.state/index.js'
import drugInfo from '@/inpatient/components/drug.info'

export default {
  components: { serviceSetItems, drugInfo },
  props: {
    row: {
      type: Object,
      required: true
    },
    fuziData: Object,
    setMainGroupId: {
      type: String,
      default: 'mainGroupId'
    }
  },
  created () {
    this.specialClassify = specialClassify
  }
}
</script>
<style lang="scss" scoped>
.namesWrap {
  display: flex;
  .leftIcons {
    width: 6px;
    margin-right: 8px;
    position: relative;
    .top {
      border-top: 3px solid;
      border-left: 3px solid;
      width: 100%;
      position: absolute;
      top: 8px;
      bottom: 0;
    }
    .middle {
      border-left: 3px solid;
      width: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
    }
    .bottom {
      border-bottom: 3px solid;
      border-left: 3px solid;
      width: 100%;
      height: 10px;
      position: absolute;
      top: 0;
    }
  }
  .cellMain {
    flex: 1;
    .labWrap {
      position: relative;
      margin: 5px 40px 5px 0;
      line-height: 1.5;
      word-wrap: break-word;
      display: inline-block;
      .lab {
        font-size: 12px;
        position: absolute;
        right: -48px;
        width: 48px;
        transform: scale(0.9, 0.9);
      }
    }
  }
  .iconfont {
    color: #999;
  }
  .icon-charge {
    color: #009944;
  }
  .iconYouji {
    color: #FF4F00;
    position: absolute;
    top: 1px;
    right: 0;
    font-size: 24px;
  }
  .icon-yichang {
    font-size: 14px;
  }
  .fontMargin {
    margin: 0 2px;
    font-size: 16px;
  }
}
</style>
