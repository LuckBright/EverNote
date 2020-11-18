<!--  -->
<template>
  <div class="card-container inline-block" @click="goPatientDetail">
    <div class="name-box">
      <div class="box">
        <span class="inline-block name ellipsis f14 bold">{{
          formatData(patientName)
        }}</span>
        <el-tooltip v-if="formatData(genderName).length > 2" effect="dark" :content="formatData(genderName)" placement="bottom">
           <span class="inline-block sex ellipsis f12"
            >{{ formatData(genderName) }} </span
           >
        </el-tooltip>
         <span v-else class="inline-block sex ellipsis f12"
            >{{ formatData(genderName) }} </span
           >
        <span class="inline-block age ellipsis f12">

          {{ formatData(ageShowText) }}
        </span>
        <el-tooltip
          class="item"
          effect="dark"
          content="取消关注"
          placement="bottom"
        >
          <span
            class="star iconfont icon-shoucang-xing fr"
            :class="{ grey: starStatus === -1 }"
            @click.stop="handleStarChange"
          ></span>
        </el-tooltip>
      </div>
    </div>
    <div class="content f12">
      <div class="item">{{ formatData(patientNumber) }}</div>
      <div class="info">
        <div class="item">
          出生日期：{{ birthday | formatDateByExp('YYYY-MM-DD') }}
        </div>
        <div class="item">手机号：{{ formatData(mobile) }}</div>
        <div class="item">
          就诊次数：
          <el-tooltip popper-class="date-year-tip" placement="bottom">
            <div slot="content">
              <p v-for="item in visitNumList" :key="item.visitTypeCode">
                {{ item.visitTypeName }}：{{ item.visitNumber }}次
              </p>
            </div>
            <span class="number">
              {{ getVisitTotal(visitNumList) }}次
            </span>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object
  },
  data () {
    return {
      ...this.data,
      starStatus: 1
    }
  },

  components: {},

  computed: {},

  mounted () { },

  methods: {
    formatData (val) {
      if (!val) {
        return '--'
      } else {
        return val
      }
    },
    getVisitTotal (list) {
      let temptotal = 0
      if (list) {
        list.forEach((item, index) => {
          temptotal += item.visitNumber
        })
      }
      return temptotal
    },
    async handleStarChange () {
      this.starStatus = -1
      this.$emit('delete', this.patientId)
    },
    goPatientDetail () {
      if (this.getVisitTotal(this.visitNumList) === 0) {
        this.$messageTips(this, 'warning', '无就诊记录', '提示')
        return
      }
      this.$router.push({
        path: '/phr/patientdetail',
        query: {
          patientId: this.patientId,
          pagequery: { ...this.$route.query }
        }
      })
    },
  }
}

</script>
<style lang='scss' scoped>
.card-container {
  width: 210px;
  height: 150px;
  box-shadow: 0px 3px 6px 0 #D3D9E2;
  border-radius: 4px;
  border-radius: 4px;
  background-color: white;
  user-select: none;
  margin-right: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  .content {
    padding: 10px;
    .info {
      color: #666666;
      .number {
        color: #4484C9;
      }
    }
    .item {
      margin-bottom: 13px;
    }
  }
  .name-box {
    box-sizing: border-box;
    height: 36px;
    opacity: 0.8;
    background: #e8f3ff;
    line-height: 36px;
    .box {
      width: 90%;
      height: 100%;
      margin: 0 auto;
    }
    .name {
      width: 66px;
      color: #333;
    }
    .sex {
      position: relative;
      z-index: 10;
      width: 30px
    }
    .age {
      width: 66px;
    }
    .star {
      height: 20px;
      color: #FAAD14;
    }
    .grey {
      color: #c5c5c5;
    }
    /deep/ .mumber {
      color: #4484C9;
    }
  }
}
.card-container:hover {
  background: #4484c9;
  background-image: url('../../assets/img/card.png');
  color: white;
  box-shadow: 0px 3px 6px 0 #92bdff;
  .name-box {
    border-bottom: 1px solid #E8ECEF;
    background: none;
    .name {
      color: white;
    }
  }
  .content {
    .info {
      color: white;
    }
    .number {
      color: white;
    }
  }
}
</style>
