<template>
  <div>
    <div :style="billStyle" style="background: #fff;">
      <div :style="styleObj.box">
        <div :style="styleObj.header" style="width: 100%">
          <div :style="styleObj.logo" style="width: 30%;">
            <!-- logo区域，定制打印纸质默认带有logo图 -->
            <!-- <img style="height: 100%" :src="logoImg"> -->
          </div>
          <div :style="styleObj.right" style="width: 70%">
            <div :style="styleObj.phone" v-if="storageRoom">
              <!-- 诊所电话取自库房电话 -->
              {{storageRoom.phone}}
            </div>
            <div :style="styleObj.doctor">
              <!-- 开方医生、开方时间 -->
              <span v-if="data.doctorData">{{data.doctorData.doctorName}} | </span>{{data.createTime | formatDateByExp('YYYY.MM.DD')}}
            </div>
        </div>
        </div>
        <div :style="styleObj.content">
          <!-- 主内容区域 -->
          <zz-drug-label-zn-cn :data="data" :patientMessage="patientMessage"></zz-drug-label-zn-cn>
          <!-- 右侧二维码内容 -->
          <div :style="styleObj.QRcode">
            <div :style="styleObj.qrCode" style="text-align: center">
              <billBarcode :showQrCode="true" barCode="我是完整的用药说明信息" :options="{width: 75, height: 75, margin: 3}"/>
              <div style="margin-top: -10px;font-size: 7px; font-weight: bold;webkit-transform: scale(0.4)">扫描查看完整用药说明</div>
              <!-- 展示有效期区域 -->
              <!-- <div :style="styleObj.liveTime">有效期:2019.01.25</div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mmConversionPx, TELEPHONE_CODE, patch } from '@/util/common'
import { drugbill } from '@/components/detailedList/style'
import billBarcode from '@/components/detailedList/billBarcode.vue'
import { styleObj } from './styleDrugLabel/styleDrugLabel'
import storage from '@/util/storage'
import zzDrugLabelZnCn from '@/warehouse/page/components/print.temp/zz/drug.label.cn.en'
export default {
  props: ['storageRoom', 'data', 'patientMessage', 'barCode'],
  data () {
    return {
      TELEPHONE_CODE,
      logoImg: 'https://www.lgstatic.com/thumbnail_300x300/i/image2/M00/30/C5/CgoB5lo8gZWAYDTgAAARcvniLxc322.jpg',
      width: 100, // 卓正药签宽度
      height: 40, // 卓正药签高度
      styleObj,
      lang: storage.getLocalStorage('LANG') || 'ch',
      drugbill
    }
  },
  methods: {
    ...patch
  },
  components: {
    zzDrugLabelZnCn,
    billBarcode
  },
  computed: {
    _width () {
      return mmConversionPx(this.width) - 10
    },
    _height () {
      return mmConversionPx(this.height) - 10
    },
    billStyle () {
      return Object.assign([{ width: `${this._width}px` }, { height: `${this._height}px` }], this.drugbill)
    }
  }
}
</script>

