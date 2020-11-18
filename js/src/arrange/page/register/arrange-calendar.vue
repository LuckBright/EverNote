<template>
  <div id="arrange">
    <el-form class="query_form_wrap" :model="params">
      <el-row class="header" type="flex" :gutter="10">
        <el-col align="left" :span="4">
          <el-form-item>
            <dept-cascader v-model="selectDept" :template-type="1" style="width:100%"></dept-cascader>
          </el-form-item>
        </el-col>
        <el-col align="left" :span="4">
          <el-form-item>
            <el-select v-model="params.resourceId" placeholder="医生" filterable clearable style="width: 100%" size="small">
              <el-option
                v-for="(item, i) in arrangeList"
                :key="i"
                :value="item.resourceId"
                :label="item.resourceName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col align="left" :span="4">
          <el-form-item>
            <el-date-picker
              size="small"
              style="width: 100%"
              v-model="changeDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col align="left" :span="4">
          <el-form-item>
            <el-button type="primary" @click="onSearch()" size="small">查询</el-button>
            <el-button type @click="resetSearch()" size="small">重置</el-button>
          </el-form-item>
        </el-col>
        <el-col align="right" :span="8">
          <el-form-item>
            <el-button size="small" class="ml10" @click="getWeeks('prev')">前七天</el-button>
            <el-button size="small" @click="getNowWeeks()">最近七天</el-button>
            <el-button size="small" @click="getWeeks('next')">后七天</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="flex_col_1_auto body">
      <calendartable
        class="page_layout_full"
        :arrange-week="weeks"
        :arrange-list="arrangeList"
        :popover="popover"
        :trunkType="1"
        :appoint-type="appointType"
        :operate="operate"
        :td-width="134"
        :body-height="initHeight"
        :is-flex="true"
        @open="getArrangeAppoint"
        @select="selectTrunk"
      ></calendartable>
    </div>
  </div>
</template>
<script>
import api from '@/arrange/store/appointapi'
import schedulingapi from '@/arrange/store/schedulingapi'
import calendartable from '@/arrange/page/scheduling/calendar-table.vue'
import deptCascader from '@/arrange/page/scheduling/deptcascader'
import { getSevenDates } from '@/util/common'

export default {
  props: ['value', 'operate', 'popover', 'bodyHeight', 'appointType'],
  data () {
    return {
      api,
      schedulingapi,
      currentWeek: '',
      selectDate: '',
      selectDept: '',
      currentDay: '',
      changeDate: '',
      currentArrange: '',
      initHeight: this.bodyHeight || 258,
      weeks: [],
      appointmentResoureCntDtoList: [],
      arrangeList: [],
      params: {
        organId: '',
        deptId: '',
        resourceId: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  watch: {
    'value' (val) {
      this.params = Object.assign({}, this.params, val)
      this.selectDept = { id: val.deptId, name: val.deptName, deptId: val.deptId, deptName: val.deptName }
      if (!this.params.organId) {
        this.params.organId = undefined
      }
      if (this.params.deptId) {
        this.onSearch()
      }
    },
    'params.date' (val, old) {
      if (val && !this.filterDate(val)) {
        this.getNowWeeks(val)
      }
    },
    'changeDate' (val) {
      this.getNowWeeks(val)
    },
    'selectDept' (val) {
      if (val) {
        this.params.deptId = val.deptId
        this.params.resourceId = ''
      } else {
        this.params.deptId = ''
      }
    },
    'params': {
      handler () {
        this.onSearch()
      },
      deep: true
    }
  },
  created () {
    this.params = Object.assign({}, this.params, this.value)
    this.getNowWeeks()
    this.onSearch()
  },
  methods: {
    onSearch (val) {
      if (val && val.sendMessage && !val.isSceneAppoint) {
        this.currentPatient = val.patient
        this.$refs.sendmessage.sendVisible = true
      }
      this.getArrangeList()
    },
    getCurrentWeek (date) {
      let changedate = date || this.$moment().format('YYYY-MM-DD')
      let current = this.$moment(changedate).format('YYYY-MM-DD')
      let first = current
      let last = this.$moment(changedate).subtract(-6, 'days').format('YYYY-MM-DD')
      return { first, current, last }
    },
    getWeeks (flag) {
      let num = flag === 'prev' ? 7 : -7
      let changedate = this.$moment(this.currentDay).subtract(num, 'days')
      this.getNowWeeks(changedate)
    },
    getNowWeeks (date) {
      let changedate = date || this.$moment().format('YYYY-MM-DD')
      this.weeks = getSevenDates(changedate)
      this.currentWeek = this.getCurrentWeek(changedate)
      this.selectDate = [this.currentWeek.first, this.currentWeek.last]
      this.currentDay = this.weeks[0].date
      this.currentArrange = ''
      this.getWeekCount()
      this.getArrangeList()
    },
    getWeekCount () {
      if (!this.params.deptId) {
        return false
      }
      let params = Object.assign(this.params, {
        timeTrunkType: 1,
        startDate: this.currentWeek.first,
        endDate: this.currentWeek.last
      })
      this.api.getWeeksCount(params).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        this.weeksCount = rs.data
      })
    },
    getArrangeList () {
      this.params.startDate = this.selectDate[0]
      this.params.endDate = this.selectDate[1]
      this.params.timeTrunkType = 1
      this.params.status = 10
      this.params.queryScene = 2
      this.schedulingapi.list(this.params).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        let resourceArrangeResultList = []
        rs.data.map(item => {
          resourceArrangeResultList.push(...item.resourceArrangeResultList)
        })
        this.arrangeList = resourceArrangeResultList
      })
    },
    getArrangeAppoint (val) {
      this.currentDay = val.date
      this.currentArrange = val
      this.$emit('open', val)
    },
    selectTrunk (val) {
      this.currentDay = val.date
      this.$emit('select', val)
    },
    filterDate (date) {
      return this.weeks.filter(item => {
        return item.date === date
      })[0]
    },
    resetSearch () {
      this.selectDept = ''
      this.changeDate = ''
      this.params.resourceId = ''
    }
  },
  components: {
    calendartable,
    deptCascader
  }
}
</script>

<style scoped>
.header strong.title {
  padding-left: 6px;
  border-left: 3px solid #1c7bef;
  font-size: 16px;
  color: #000;
}
#arrange .el-form-item{margin-bottom: 10px;}
#arrange /deep/ .el-form-item__content {line-height: 32px;}
</style>
