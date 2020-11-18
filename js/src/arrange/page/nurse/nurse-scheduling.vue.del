<template>
  <div id="calender">
    <div class="flex_column_1_hidden layout_inner">
      <el-row class="head">
        <el-form
          :inline="true"
          label-width="10"
          label-position="right"
          class="demo-form-inline"
          :model="form"
        >
          <el-form-item class="changeweek">
            <el-select v-model="form.clinicId" placeholder="请选择机构">
              <el-option
                v-for="item in clinicIdList"
                :key="item.clinicId"
                :value="item.clinicId"
                :label="item.clinicName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="changeweek">
            <el-button type plain @click="getWeeks('prev')">
              <i class="el-icon-arrow-left"></i> 前七天
            </el-button>
            <el-button type plain @click="getNowWeeks()">本周</el-button>
            <el-button type plain @click="getWeeks('next')">
              后七天
              <i class="el-icon-arrow-right"></i>
            </el-button>
          </el-form-item>
          <el-form-item class="changeweek">
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <nursetable
        class="flex_column_1_hidden"
        :tabledata="tabledata"
        :arrangeweek="weeks"
        @showpup="showpup"
        :is-flex="true"
        :clinicName="clinicName"
      ></nursetable>
    </div>
    <nursepup
      ref="nursepup"
      :clinicId="form.clinicId"
      :objval="objval"
      :clinicName="clinicName"
      @refresh="refresh"
    ></nursepup>
  </div>
</template>
<script>
import { getSevenDates } from '@/util/common'
import schedulingapi from '@/arrange/store/schedulingapi'
import nursetable from '@/arrange/page/nurse/nursetable'
import nursepup from '@/arrange/page/nurse/nursepup'
import nurseapi from '@/arrange/store/nurseapi'
import storage from '@/util/storage'
export default {
  data () {
    return {
      storage,
      schedulingapi,
      nurseapi,
      weeks: [],
      currentWeek: '',
      selectDate: [],
      clinicIdList: [],
      changeDate: '',
      clinicName: '',
      form: {
        clinicId: '',
        startDate: '', // 开始日期
        endDate: '' // 结束日期
      },
      templateList: [],
      width: this.tdWidth || 160,
      tabledata: '',
      objval: {}
    }
  },
  watch: {
    'form.clinicId' (v) {
      this.clinicIdList.map(item => {
        if (item.clinicId === this.form.clinicId) {
          this.clinicName = item.clinicName
        }
      })
    }
  },
  async created () {
    if (this.storage.getLocalStorage('CLINICID')) {
      this.form.clinicId = Number(this.storage.getLocalStorage('CLINICID'))
    }
    await this.getOrgList()
    this.getNowWeeks()
  },
  methods: {
    refresh () {
      this.getTableList()
    },
    showpup (v) {
      this.objval = v
      this.$refs.nursepup.dialogFormVisible = true
    },
    search () {
      this.getTableList(this.form)
    },
    getTableList () {
      let p = {
        clinicId: this.form.clinicId,
        startDate: this.selectDate[0],
        endDate: this.selectDate[1]
      }
      this.nurseapi.list(p)
        .then(rs => {
          if (rs.head.errCode || !rs.data || !rs.data.searchByAssistantAssistantResponseList || rs.data.searchByAssistantAssistantResponseList.length === 0) {
            this.tabledata = []
            return false
          }
          this.tabledata = rs.data
          this.tabledata.searchByAssistantAssistantResponseList.map(item => {
            const searchByAssistantDateResponseList = item.searchByAssistantDateResponseList
            item.searchByAssistantDateResponseList = {}
            searchByAssistantDateResponseList.map(td => {
              item.searchByAssistantDateResponseList[td.date] = td
            })
            return item
          })
        })
    },
    getCurrentWeek (date) {
      let changedate = date || this.$moment().format('YYYY-MM-DD')
      let current = this.$moment(changedate).format('YYYY-MM-DD')
      let first = current
      let last = this.$moment(changedate).subtract(-6, 'days').format('YYYY-MM-DD')
      return { first, current, last }
    },
    getWeeks (flag) { // 通过获取时间
      let num = flag === 'prev' ? 7 : -7
      let changedate = this.$moment(this.currentDay).subtract(num, 'days') // 当前时间的前num天
      this.getNowWeeks(changedate) // 传入今天时间加减7天后的数值
    },
    getNowWeeks (date) { // 本周
      let changedate = date || this.$moment().format('YYYY-MM-DD')
      this.weeks = getSevenDates(changedate) // 渲染时间列表用
      this.currentWeek = this.getCurrentWeek(changedate)
      this.selectDate = [this.currentWeek.first, this.currentWeek.last]  // 选择的时间段
      this.currentDay = this.weeks[0].date
      this.getTableList() // 调接口渲染
    },
    getOrgList () {
      this.schedulingapi.getOrgList().then(rs => {
        this.clinicIdList = rs.data
        if (rs.data) {
          this.clinicIdList.map(item => {
            if (item.clinicId === this.form.clinicId) {
              this.clinicName = item.clinicName
            }
          })
        }
      })
    }
  },
  components: {
    nursetable,
    nursepup
  }
}
</script>

<style scoped>
#calender {
  background: #fff;
}
#calender .changeweek {
  vertical-align: top;
}
#calender .changeweek /deep/ .el-button {
  border-radius: 0;
  width: 100px;
  float: left;
}
#calender .changeweek /deep/ .el-button:hover {
  border-color: #dcdfe6;
}
#calender .changeweek /deep/ .el-button + .el-button {
  margin-left: -1px;
}
</style>
