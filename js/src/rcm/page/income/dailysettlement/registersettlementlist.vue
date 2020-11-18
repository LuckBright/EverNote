<template>
  <slide-window :width="530" :paddingTop="90" :show="show" @getData="showPatient">
    <template slot="handler">
      <span style="width:1em; line-height:1.2em">日结历史</span>
    </template>
    <template slot="default">
      <!-- <div class="settle_body payStyle"> -->
      <div class="flex-column h100">
        <div class="main-head pl10 pr10">
          <ever-form2
            :schema="querySchema"
            v-model="queryObj"
            @query="query"
            :is-query="true"
            class="main-form patientlist-d"
          >
            <template slot="date">
              <ever-range-picker
                :start.sync="queryObj.start"
                :end.sync="queryObj.end"
                :autoWidth="true"
                @change="list()"
              ></ever-range-picker>
            </template>
            <template slot="default">
              <el-button type="primary" size="small" @click="list()">查询</el-button>
            </template>
          </ever-form2>
        </div>
        <div class="flex1box">
          <el-table
            :data="tableData"
            style="width: 100%"
            @row-click="handledetail"
            v-loading="cardloading"
            class="no-border table-hover-blue highlight-current-row ever-table-wrap"
          >
            <el-table-column prop="code" width="200" label="日结流水号"></el-table-column>
            <el-table-column prop="total" label="结算合计金额" align="right">
              <template slot-scope="scope">{{scope.row.total | formatToFinacial}}</template>
            </el-table-column>
            <el-table-column prop="closeTime" label="结账时间"></el-table-column>
          </el-table>
        </div>
        <ever-pagination
          :small="true"
          class="ptb10"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pagesize="pagesize"
          :totalCount="totalCount"
          :current="current"
          :layout="'prev, pager, next'"
        ></ever-pagination>
      </div>
    </template>
  </slide-window>
</template>
<script>
import list from '@/util/list'
import api from '@/rcm/store/income/dailysettlementapi'
// import SlideWindow from '@/demo/pageLayout/slidewindow.vue'
import SlideWindow from '@/components/slidewindow'

export default {
  components: {
    SlideWindow
  },
  mixins: [list],
  props: ['feeType', 'updateList', 'show'],
  data () {
    let schema = [
      {
        label: '日结时间',
        name: 'date',
        comp: 'custom',
        span: 20,
        labelWidth: '70px'
      },
    ]
    let obj = this.$ever.createObjFromSchema(schema)
    obj.start = this.$moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00')
    obj.end = this.$moment().format('YYYY-MM-DD 23:59:59')
    return {
      api,
      querySchema: schema,
      queryObj: obj,
      cardloading: false
    }
  },
  created () { },
  watch: {
    'feeType': {
      handler () {
        this.queryObj.start = this.$moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00')
        this.queryObj.end = this.$moment().format('YYYY-MM-DD 23:59:59')
        this.list()
      },
      immediate: true
    },
    'updateList': {
      handler () {
        this.query()
      },
      immediate: true
    }
  },
  methods: {
    clearquery () {
      this.queryObj.end = ''
      this.queryObj.start = ''
    },
    handledetail (row) {
      if (this.feeType === 7) {
        this.$router.push(`/rcm/daily/rcmSettlement?id=${row.code}&closeId=${row.id}`)
      } else {
        this.$router.push(`/rcm/daily/settlement/${row.feeType}?id=${row.id}&code=${row.code}`)
      }
    },
    showPatient () {
      this.list()
    },
    query () {
      let end = this.$moment().format('YYYY-MM-DD 23:59:59')
      this.list(end)
    },
    // 患者列表
    async list (end, start) {
      let params = {
        offset: this.offset,
        pagesize: this.pagesize,
        feeType: this.feeType || 1,
        start: this.queryObj.start ? this.$moment(this.queryObj.start).format('YYYY-MM-DD 00:00:00') : '',
        end: this.queryObj.end ? this.$moment(this.queryObj.end).format('YYYY-MM-DD 23:59:59') : ''
      }
      let url = 'getDailysettlementList'
      if (new Date(this.queryObj.start).getTime() > new Date(this.queryObj.end).getTime()) {
        this.$messageTips(this, 'error', '开始时间不能早于结束时间')
        return
      }
      if (this.feeType === 7) {
        url = 'getMallSettlementList'
      }
      this.cardloading = true
      try {
        api[url](params).then(rs => {
          this.tableData = rs.data
          this.totalCount = rs.totalCount
          this.cardloading = false
        })
      } catch (err) {
        console.log(err)
        this.cardloading = false
      }
    }
  }
}
</script>
<style lang="less" type scoped>
.patientlist-d /deep/ .el-button {
  margin-left: 10px;
}
</style>
