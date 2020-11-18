<!--  -->
<template>
  <div class="cards-container">
    <div class="cards">
      <chartcard
        v-for="(item, index) in card1"
        :key="item.class"
        :class="item.class"
        :text="item.text"
        :show-image="index % 2 === 0"
        :percent="item.percent"
        :show-percent="index !== 0"
        :data="item"
      ></chartcard>
    </div>
    <div class="cards" v-show="showMore">
      <chartcard
        v-for="(item, index) in card2"
        :key="item.class"
        :class="item.class"
        :text="item.text"
        :show-image="index % 2 !== 0"
        :percent="item.percent"
        :show-percent="index !== 0"
        :data="item"
      ></chartcard>
    </div>
    <div
      class="inline-block arrow"
      :class="{ 'arrow-top': showMore, 'arrow-bottom': !showMore }"
      @click="toggleMore"
    >
      <i class="el-icon-d-arrow-left"></i>
    </div>
  </div>
</template>

<script>
import chartcard from '@/phr/page/analysis/chart/chartcard'
import { ALL, CLINIC, HOSPITAL, INTERNET } from '@/phr/page/analysis/chart/constkey'

export default {
  props: {
    data: Array,
    showMore: Boolean
  },
  data () {
    return {
      card1: [
        {
          class: 'image1',
          text: '就诊总人数',
          percent: 0,
          yearOnYear: 0,
          monthOnMonth: 0
        },
        {
          class: 'image2',
          text: '门诊总人数',
          percent: 10,
          yearOnYear: 0,
          monthOnMonth: 0
        },
        {
          class: 'image3',
          text: '住院总人数',
          percent: 20,
          yearOnYear: 0,
          monthOnMonth: 0
        },
        {
          class: 'image4',
          text: '互联网总人数',
          percent: 40,
          yearOnYear: 0,
          monthOnMonth: 0
        }
      ],
      card2: [
        {
          class: 'image5',
          text: '总账单',
          percent: 0,
          yearOnYear: 0,
          monthOnMonth: 0
        },
        {
          class: 'image6',
          text: '门诊账单',
          percent: 100,
          yearOnYear: 0,
          monthOnMonth: 0
        },
        {
          class: 'image7',
          text: '住院账单',
          percent: 9,
          yearOnYear: 0,
          monthOnMonth: 0
        },
        {
          class: 'image8',
          text: '互联网账单',
          percent: 0,
          yearOnYear: 0,
          monthOnMonth: 0
        }
      ],
    }
  },

  components: {
    chartcard
  },

  computed: {},

  created () {
    this.init()
  },

  methods: {
    toggleMore () {
      this.$emit('update:show-more', !this.showMore)
    },
    init () {
      this.formatArr(this.data[0], this.card1)
      this.formatArr(this.data[1], this.card2)
    },
    formatArr (arr1, arr2) {
      arr1.map(item => {
        const { visitType } = item
        switch (visitType) {
          case ALL:
            this.formatItem(item, arr2[0])
            break
          case CLINIC:
            this.formatItem(item, arr2[1])
            break
          case HOSPITAL:
            this.formatItem(item, arr2[2])
            break
          case INTERNET:
            this.formatItem(item, arr2[3])
            break
          default:
            console.error('未知类型：', item)
        }
      })
    },
    formatItem (item1, item2) {
      const { percent, yearOnYear, monthOnMonth, total } = item1
      function toThousands (num) {
        const numArr = num.toString().split('.')
        const reg = /(\d)(?=(?:\d{3})+$)/g
        if (numArr.length === 1) {
          return (numArr[0] || '0').replace(reg, '$1,')
        } else {
          return ((numArr[0] || '0').replace(reg, '$1,')) + '.' + numArr[1]
        }
      }
      item2.percent = Number(percent)
      item2.yearOnYear = Number(yearOnYear) // 同比
      item2.monthOnMonth = Number(monthOnMonth) // 环比
      item2.total = toThousands(total)
    }
  }
}

</script>
<style lang='scss' scoped>
.cards-container {
  margin: 0 auto;
  position: relative;
  .image1 {
    background-image: linear-gradient(270deg, #23a9f9 0%, #2767fe 100%);
  }
  .image2 {
    background-image: linear-gradient(90deg, #ff6b88 0%, #ff8777 100%);
  }
  .image3 {
    background-image: linear-gradient(45deg, #05afe9 0%, #19d3ec 100%);
  }
  .image4 {
    background-image: linear-gradient(45deg, #ff8551 0%, #ffba50 100%);
  }
  .image5 {
    background-image: linear-gradient(270deg, #bb62d9 0%, #784df1 99%);
  }
  .image6 {
    background-image: linear-gradient(90deg, #6d77f4 2%, #69a9ff 100%);
  }
  .image7 {
    background-image: linear-gradient(45deg, #ff514e 0%, #ff9a81 100%);
  }
  .image8 {
    background-image: linear-gradient(45deg, #0bb6a2 0%, #35e0a3 100%);
  }
}
.cards {
  display: flex;
  justify-content: space-between;
}
.arrow {
  position: relative;
  top: -15px;
  width: 16px;
  height: 16px;
  left: 50%;
  opacity: 0.9;
  color: #bdc3ca;
  cursor: pointer;
}
.arrow-top {
  transform: rotate(90deg);
}
.arrow-bottom {
  transform: rotate(-90deg);
}
</style>
