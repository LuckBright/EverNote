<template>
  <div :style="customerStyle" style="background: #fff;border-radius: 10px">
    <div :style="styleObj.box1" style="width: 85%">
      <ul :style="styleObj.ul">
        <li v-for="(item, index) in customerLabel" :key="index" :style="styleObj.li">
          <span>{{item.name}}</span>
          <span>{{item.text}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {mmConversionPx} from '@/util/common'
  import {customer} from '@/components/detailedList/style'
  import {styleObj} from './styleDrugLabel/styleDrugLabel'
  export default {
    props: {
      customerLabel: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        width1: 50, // 卓正客户标签宽度
        height1: 30, // 卓正客户标签高度
        styleObj,
        customer
      }
    },
    computed: {
      _width1 () {
        return mmConversionPx(this.width1) - 10
      },
      _height1 () {
        return mmConversionPx(this.height1) - 10
      },
      customerStyle () {
        return Object.assign([{width: `${this._width1}px`}, {height: `${this._height1}px`}], this.customer)
      }
    }
  }
</script>
<style>

</style>
