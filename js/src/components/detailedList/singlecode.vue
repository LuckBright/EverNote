<template>
  <div :style="{
    background: '#fff',
    width: `${_width}px`,
    padding: '20px',
    fontFamily: 'Microsoft YaHei',
    height: `${_height}px`
  }">
    <billBarcode :barCode="printData.barCode" :options="{
      height: 30,
      width: 1
    }"/>
    <div style="padding-top: 10px">
      <p v-if="inpatientArea.spaceRecordObject" style="font-size: 16px; padding-bottom: 5px">{{findBasesourceCode({arr: inpatientArea.spaceRecordObject.spaceRecordProperties, code: SPACE_CODE[0]})}}</p>
      <p style="font-size: 14px;">{{$moment(new Date()) | formatDateByExp('YYYY-MM-DD HH:mm:ss')}}</p>
    </div>
  </div>
</template>

<script>
import billBarcode from './billBarcode.vue'
import { mmConversionPx, SEARCH_CODE, SPU_SPEC_CODE, SPEC, SPACE_CODE, patch } from '@/util/common'
export default {
  props: ['printData', 'inpatientArea'],
  data () {
    return {
      SEARCH_CODE,
      SPU_SPEC_CODE,
      SPACE_CODE,
      SPEC,
      width: 70,
      height: 60
    }
  },
  computed: {
    _width () {
      return mmConversionPx(this.width) - 40
    },
    _height () {
      return mmConversionPx(this.height) - 40
    }
  },
  methods: {
    ...patch
  },
  components: {
    billBarcode
  }
}
</script>
