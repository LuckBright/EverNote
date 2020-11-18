<!--  -->
<template>
  <el-popover
    placement="bottom"
    width="240"
    popper-class="analysischart-season-wrapper"
    v-model="visible"
  >
    <div class="season-container oa">
      <div class="pannels">
        <div class="pannel">
          <div class="year">年份</div>
          <div class="year-pannel">
            <i
              class="el-time-spinner__arrow el-icon-arrow-up arrow-up"
              @click="preYear"
            ></i>
            <i
              class="el-time-spinner__arrow el-icon-arrow-down arrow-down"
              @click="nextYear"
            ></i>
            <ul class="list">
              <li
                class="item"
                :class="{
                  active: index === 1,
                }"
                v-for="(item, index) in yearsArr"
                :key="item"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
        <div class="pannel">
          <div class="year">季度</div>
          <div class="year-pannel">
            <i
              class="el-time-spinner__arrow el-icon-arrow-up arrow-up"
              @click="preSeason"
            ></i>
            <i
              class="el-time-spinner__arrow el-icon-arrow-down arrow-down"
              @click="nextSeason"
            ></i>
            <ul class="list">
              <li
                class="item"
                :class="{ active: index === 1 }"
                v-for="(item, index) in seasonsArr"
                :key="item.text"
              >
                {{ item.text }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="btns fr clearfix mt5">
        <el-button
          type="text"
          size="mini"
          class="cancel"
          @click="visible = !visible"
          >取消</el-button
        >
        <el-button type="text" size="mini" class="confirm" @click="confirm"
          >确定</el-button
        >
      </div>
    </div>
    <el-button slot="reference" class="btn-season">季度选择</el-button>
  </el-popover>
</template>

<script>
export default {
  props: {},
  data () {
    return {
      nowYear: (new Date()).getFullYear(),
      minYear: 2000,
      yearsArr: [],
      seasonsArr: [
        {
          text: '第一季度',
          arr: ['-01-01', '-03-31'],
        },
        {
          text: '第二季度',
          arr: ['-04-01', '-06-30'],
        },
        {
          text: '第三季度',
          arr: ['-07-01', '-09-30'],

        },
        {
          text: '第四季度',
          arr: ['-10-01', '-12-31'],
        }
      ],
      visible: false
    }
  },

  components: {},

  computed: {},

  created () {
    this.yearsArr = [this.minYear, this.nowYear, this.nowYear - 1, this.nowYear - 2]
  },

  methods: {
    nextSeason () {
      const [item0, item1, item2, item3] = this.seasonsArr
      this.seasonsArr = [item1, item2, item3, item0]
    },
    preSeason () {
      const [item0, item1, item2, item3] = this.seasonsArr
      this.seasonsArr = [item3, item0, item1, item2]
    },
    nextYear () {
      const [item0, item1, item2] = this.yearsArr
      if (item0 === this.nowYear) {
        this.yearsArr = [this.minYear, item0, item1, item2]
      } else {
        this.yearsArr = [item0 + 1, item0, item1, item2]
      }
    },
    preYear () {
      const [, item1, item2, item3] = this.yearsArr
      if (item3 === this.minYear) {
        this.yearsArr = [item1, item2, item3, this.nowYear]
      } else {
        this.yearsArr = [item1, item2, item3, item3 - 1]
      }
    },
    confirm () {
      const year = this.yearsArr[1]
      const [pre, after] = this.seasonsArr[1].arr
      this.$emit('confirm', [new Date(year + pre), new Date(year + after)])
      this.visible = false
    }
  }
}

</script>
<style lang="scss">
.analysischart-season-wrapper {
  padding: 0px;
  box-sizing: border-box;
  border: none;
  .season-container {
    margin: 5px 16px;
    .wrap {
      overflow: hidden;
    }
    .pannel::after,
    .pannel::before {
      content: '';
      top: 46%;
      position: absolute;
      margin-top: -15px;
      height: 32px;
      z-index: -1;
      left: 13px;
      right: 0;
      box-sizing: border-box;
      padding-top: 6px;
      text-align: left;
      border-top: 1px solid #e0e4e8;
      border-bottom: 1px solid #e0e4e8;
      width: 68px;
    }
    .pannels {
      padding: 25px 0px 22px;
      border-bottom: 1px solid #e0e4e8;
      height: 240px;
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
      user-select: none;
      .pannel {
        display: inline-block;
        width: 50%;
        box-sizing: border-box;
        position: relative;
        .arrow-up {
          top: 33px;
          color: #e0e4e8;
        }
        .arrow-down {
          bottom: 13px;
          color: #e0e4e8;
        }
        .arrow-down:hover,
        .arrow-up:hover {
          color: #4484c9;
        }
        .disabled:hover {
          color: #e0e4e8;
        }
        .year {
          font-size: 16px;
          color: #666666;
          width: 33px;
          margin: 0 auto;
          margin-bottom: 5px;
        }
        .list {
          font-size: 12px;
          width: 98px;
          height: 167px;
          border: 1px solid #e0e4e8;
          border-radius: 4px;
          box-sizing: border-box;
          padding: 20px;
          text-align: center;
          .active {
            color: #4484c9;
          }
          .item {
            height: 31px;
            padding-top: 6px;
            box-sizing: border-box;
          }
        }
      }
    }
    .btns {
      .cancel {
        &:hover {
          font-weight: bold;
        }
        color: #000;
      }
      .confirm {
        &:hover {
          font-weight: bold;
        }
        color: #4484c9;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.btn-season {
  border: 1px solid #e0e4e8;
  border-radius: 0px 4px 4px 0px;
}
</style>
