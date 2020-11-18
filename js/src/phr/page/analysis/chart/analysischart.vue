<!-- 数据分析报表 -->
<template>
  <div class="analysischart" v-loading="loading">
    <div class="btns">
      <el-button class="fr info" @click="goInfo">详情</el-button>
      <el-date-picker
        v-model="dateValue"
        type="daterange"
        align="right"
        class="btn-border fr"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        ref="date"
      >
      </el-date-picker>
      <div class="el-button-group fr">
        <el-button type="" @click="confirmWeek">近一周</el-button>
        <el-button type="" @click="confirmMonth">近一月</el-button>
        <seasonbox @confirm="confirmSeason"></seasonbox>
      </div>
    </div>
    <div>
      <cardscontainer
        :data="cards"
        v-if="cards.length"
        :show-more.sync="showMore"
      ></cardscontainer>
      <chartbox :data="chart" v-if="chart.length"></chartbox>
    </div>
  </div>
</template>

<script>
import cardscontainer from '@/phr/page/analysis/chart/cardscontainer'
import seasonbox from '@/phr/page/analysis/chart/seasonbox'
import chartbox from '@/phr/page/analysis/chart/chartbox'
import urls from '@/phr/api/urls'
import orgUrlMap from '@/manages/page/organization/utils/urls'
import { request } from '@/util/req'
const chart = urls.chart
export default {
  props: {},
  data () {
    return {
      dateValue: [],
      cards: [],
      chart: [],
      loading: false,
      showMore: false
    }
  },

  components: {
    cardscontainer,
    chartbox,
    seasonbox
  },

  computed: {},

  async created () {
    await this.getOrgId()
    this.confirmMonth()
  },
  watch: {
    dateValue (val) {
      const [startDate, endDate] = val
      this.getData([this.formatDate(startDate), this.formatDate(endDate)])
    }
  },
  mounted () { },
  methods: {
    async getOrgId () {
      const res = await request(orgUrlMap.org.loadByStaffId, {
        staffId: localStorage.getItem('USERID'),
        staffLoginOrgPermission: '1',
      })
      if (res && Array.isArray(res.data.pageList)) {
        this.orgIds = res.data.pageList.map(item => item.id)
      }
    },
    formatDate (val) {
      return this.$moment(val).format('YYYY-MM-DD')
    },
    async getData (date) {
      const [startDate, endDate] = date
      const startYear = new Date(startDate).getFullYear()
      const endYear = new Date(endDate).getFullYear()
      if (startYear !== endYear) {
        this.$message({
          message: '所选择的日期范围不支持，请重新选择！',
          type: 'warning'
        })
        return
      }
      this.loading = true
      this.cards = []
      this.chart = []
      const res = await request(chart, { startDate, endDate, orgIds: this.orgIds })
      if (res && res.data) {
        const { bill, visit, range, daily } = res.data
        this.cards = [visit, bill]
        this.chart = [range, daily]
      }
      this.loading = false
    },
    confirmMonth () {
      this.dateValue = this.computedDays(29)
    },
    confirmWeek () {
      this.dateValue = this.computedDays(6)
    },
    computedDays (day) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * day)
      return [start, end]
    },
    goInfo () {
      this.$router.push({ name: 'bicatalog' })
    },
    confirmSeason (val) {
      this.dateValue = val
    }
  }
}

</script>

<style lang='scss' scoped>
.analysischart {
  padding: 0px 15px;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  .btns {
    float: right;
    border-bottom: 1px solid #e0e4e8;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  .btn-border {
    border: 1px solid #e0e4e8;
    margin-left: 10px;
    border-radius: 4px;
  }
  /deep/ .btn-border {
    .el-range-separator,
    .el-icon-date {
      line-height: 30px;
    }
  }
  .btn-season {
    border: 1px solid #e0e4e8;
    border-radius: 0px 4px 4px 0px;
  }

  /deep/ .el-button-group > .el-button:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 5px;
  }
  /deep/ .el-button-group > .el-button:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 5px;
  }
  /deep/ .el-button-group > .el-button {
    border: 1px solid #e0e4e8;
  }
  .info {
    width: 72px;
    border-radius: 4px;
    background-color: #4484c9;
    color: white;
    margin-left: 10px;
    border: none;
  }
}
</style>
