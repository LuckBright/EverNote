<!-- 图标卡片 -->
<template>
  <div class="inline-block chartcard">
    <div :class="{ 'image-background': showImage }" class="padd">
      <div class="total line">
        <singlecircle
          :line-width="8"
          color="white"
          :global-alpha="0.3"
          class="opacity"
          width="72px"
          height="72px"
        ></singlecircle>
        <div class="inline-block tit">{{ text }}</div>
        <div class="inline-block num">{{ total }}</div>
      </div>
      <div class="line">
        <singlecircle
          :line-width="8"
          color="white"
          width="72px"
          height="72px"
          class="circle"
        ></singlecircle>
        <div class="inline-block tit">同比</div>
        <div class="inline-block ml">
          <i
            class="caret inline-block"
            :class="{
              'el-icon-caret-top': yearOnYear > 0,
              top: yearOnYear > 0,
              bottom: yearOnYear < 0,
              'el-icon-caret-bottom': yearOnYear < 0,
            }"
          ></i
          >{{ formatData(yearOnYear) }}
        </div>
      </div>
      <div class="line">
        <div class="inline-block tit">环比</div>
        <div class="inline-block ml">
          <i
            class="caret inline-block"
            :class="{
              'el-icon-caret-top': monthOnMonth > 0,
              top: monthOnMonth > 0,
              bottom: monthOnMonth < 0,
              'el-icon-caret-bottom': monthOnMonth < 0,
            }"
          ></i
          >{{ formatData(monthOnMonth) }}
        </div>
      </div>
      <div class="double-circle">
        <span
          class="percent"
          v-show="showPercent"
          :class="{
            'double-percent': percent >= 10 && percent < 100,
            'three-percent': percent >= 100,
            'single-percent': percent < 10,
          }"
          >{{ percent }}%</span
        >
        <singlecircle
          :line-width="40"
          color="rgba(255,255,255,0.3)"
          topcolor="white"
          width="332px"
          height="332px"
          type="double"
          :percent="percent"
          :data="data"
          style="width: 88px;height: 88px"
        ></singlecircle>
      </div>
    </div>
  </div>
</template> 

<script>
import singlecircle from '@/phr/page/analysis/chart/canvascircle'
export default {
  props: {
    showImage: {
      type: Boolean,
      default: true
    },
    showPercent: {
      type: Boolean,
      default: true
    },
    data: Object
  },
  data () {
    return {
      ...this.data
    }
  },

  components: {
    singlecircle
  },

  computed: {},

  created () {
  },
  mounted () {
  },

  methods: {
    formatData (num) {
      if (num < 0) {
        num = (num + '').replace('-', '')
      }
      if (num === 0) {
        return '--'
      }
      return num + '%'
    }
  }
}

</script>
<style lang='scss' scoped>
.chartcard {
  border-radius: 4px;
  min-width: 330px;
  width: 24%;
  height: 126px;
  color: white;
  font-size: 14px;
  position: relative;
  box-sizing: border-box;
  margin-bottom: 30px;
  box-shadow: 0 2px 10px 0 rgba(95, 132, 177, 0.1);
  margin-right: 20px;
  .caret {
    width: 14px;
    height: 14px;
  }
  .image-background {
    background-image: url(./backimage.png);
    background-repeat: no-repeat;
    background-size: 101% 50%;
    background-position-x: -1px;
    background-position-y: 70px;
  }
  .padd {
    width: 100%;
    height: 100%;
    padding-top: 30px;
    padding-left: 20px;
    box-sizing: border-box;
    position: relative;
  }
  .ml {
    margin-left: 40px;
  }
  .top {
    color: #f00d44;
    margin-right: 3px;
  }
  .bottom {
    color: #15eb8d;
    margin-right: 3px;
  }
  .line {
    height: 24px;
    line-height: 15px;
    position: relative;
    .tit {
      color: white;
      vertical-align: middle;
      margin-left: 26px;
    }
  }

  .circle {
    margin-right: 5px;
    position: absolute;
    top: -1px;
    width: 18px;
    height: 18px;
  }
  .total {
    margin-bottom: 10px;
    .num {
      font-size: 20px;
      color: #ffffff;
      vertical-align: middle;
      margin-left: 13px;
      font-weight: bold;
    }
  }
}
.chartcard:last-child {
  margin-right: 0px;
}
.opacity {
  margin-right: 5px;
  position: absolute;
  top: -1px;
  width: 18px;
  height: 18px;
}
.double-circle {
  position: absolute;
  top: 18px;
  right: 13px;
  .percent {
    position: absolute;
    top: 34px;
    font-size: 18px;
  }
  .double-percent {
    right: 24px;
  }
  .three-percent {
    right: 21px;
  }
  .single-percent {
    right: 28px;
  }
}
</style>
