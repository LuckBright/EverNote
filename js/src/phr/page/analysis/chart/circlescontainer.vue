<!--  -->
<template>
  <div class="circles-container">
    <div class="tit">机构就诊人次排名</div>
    <div class="circles">
      <el-tooltip
        class="item"
        effect="dark"
        placement="right"
        v-for="(item, index) in circles"
        :key="item.diameter"
        :disabled="data[index] && data[index].none"
        popper-class="analysis-circles"
      >
        <div slot="content" v-if="data[index]" class="content">
          <span class="inline-block dot" :class="`dot${index}`"></span>
          <span class="name"> {{ data[index].orgName }}：</span>
          <div class="num">{{ data[index].totalVisit }}人次,</div>
          <div class="num">{{ data[index].totalBill }}元</div>
        </div>
        <canvascircle
          :class="`circle${index}`"
          :line-width="40"
          color="#F2F2F3"
          :width="item.diameter"
          :height="item.diameter"
          type="double"
          :data="item"
          v-show="item.show"
          :ref="`circle${index}`"
        ></canvascircle>
      </el-tooltip>
    </div>
    <div class="organizations">
      <div
        class="item ellipsis"
        v-for="(item, index) in data"
        :key="index"
        @click="toggleCircle(index)"
      >
        <span
          class="inline-block dot"
          :class="[`dot${index}`, { none: item.none }]"
        >
        </span>
        <span class="name"> {{ item.orgName }}：</span>
        <span class="num">{{ item.totalVisit }}人次</span>
      </div>
    </div>
  </div>
</template>

<script>
import canvascircle from '@/phr/page/analysis/chart/canvascircle'

export default {
  props: {
    data: Array
  },
  data () {
    return {
      circles: [
        {
          diameter: 960, // 直径
          percent: 0,
          liner: {
            diameter: 960,
            startColor: '#1C7BEF',
            endColor: '#FF8777'
          }
        },
        {
          diameter: 760, // 直径
          percent: 0,
          liner: {
            diameter: 760,
            startColor: '#FF6B88',
            endColor: '#FF8777'
          }
        },
        {
          diameter: 544, // 直径
          percent: 0,
          liner: {
            diameter: 544,
            startColor: '#3AE6C9',
            endColor: '#15D5DB'
          }
        },
        {
          diameter: 336, // 直径
          percent: 0,
          liner: {
            diameter: 336,
            startColor: '#FFCC50',
            endColor: '#FFAF50'
          }
        },
        {
          diameter: 194, // 直径
          percent: 0,
          liner: {
            diameter: 194,
            startColor: '#7184FF',
            endColor: '#6C97FE'
          }
        }
      ],
      organizations: []
    }
  },
  components: {
    canvascircle
  },

  computed: {},

  created () {
    this.formatData()
  },

  methods: {
    formatData () {
      this.data.map((item, index) => {
        const { percent, totalVisit } = item
        this.circles[index].percent = Number(percent)
        this.circles[index].totalVisit = Number(totalVisit)
        this.circles[index].show = true
        this.$set(item, 'none', false)
        this.$set(item, 'type', 'double')
      })
    },
    toggleCircle (index) {
      this.$set(this.data[index], 'none', !this.data[index].none)
      const key = `circle${index}`
      this.$refs[key][0].init(this.data[index].none)
    }
  }
}

</script>
<style lang="scss">
.analysis-circles {
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .content {
    font-size: 14px;
    line-height: 20px;
  }
  .dot0 {
    background-image: linear-gradient(180deg, #3cb2f8 0%, #1c7bef 100%);
  }

  .dot1 {
    background: #fe7e89;
  }

  .dot2 {
    background-image: linear-gradient(180deg, #43edd7 0%, #20d6ae 100%);
  }

  .dot3 {
    background-image: linear-gradient(180deg, #ffd488 0%, #ffa950 100%);
  }

  .dot4 {
    background-image: linear-gradient(180deg, #9a97fe 1%, #7477ff 100%);
  }
}
</style>
<style lang='scss' scoped>
.circles-container {
  min-width: 420px;
  width: 420px;
  height: 480px;
  box-sizing: border-box;
  padding: 31px 30px 30px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px 0 rgba(98, 115, 135, 0.1);
  margin-right: 20px;
  .tit {
    font-size: 18px;
    color: #666666;
    font-weight: 700;
    margin-bottom: 25px;
  }
  .circles {
    text-align: center;
    position: relative;
    .circle0 {
      width: 240px;
      height: 240px;
    }
    .circle1 {
      width: 190px;
      height: 190px;
      position: absolute;
      left: 86px;
      top: 25px;
    }
    .circle2 {
      width: 136px;
      height: 136px;
      position: absolute;
      left: 113px;
      top: 52px;
    }
    .circle3 {
       width: 84px;
      height: 84px;
      position: absolute;
      left: 138px;
      top: 78px;
    }
    .circle4 {
       width: 46px;
      height: 46px;
      position: absolute;
      left: 158px;
      top: 97px;
    }
  }
}
.organizations {
  font-size: 12px;
  margin-top: 18px;
  .item {
    margin: 0px 30px 11px 14px;
    cursor: pointer;
  }
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .dot0 {
    background-image: linear-gradient(180deg, #3cb2f8 0%, #1c7bef 100%);
  }
  .dot1 {
    background: #fe7e89;
  }
  .dot2 {
    background-image: linear-gradient(180deg, #43edd7 0%, #20d6ae 100%);
  }
  .dot3 {
    background-image: linear-gradient(180deg, #ffd488 0%, #ffa950 100%);
  }
  .dot4 {
    background-image: linear-gradient(180deg, #9a97fe 1%, #7477ff 100%);
  }
  .name {
    color: #999;
    margin-left: 2px;
  }
  .none {
    background-color: #bdc3ca;
    background-image: none;
  }
}
</style>
