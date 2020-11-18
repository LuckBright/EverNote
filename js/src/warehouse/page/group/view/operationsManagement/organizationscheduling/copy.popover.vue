<template>
  <el-popover
    placement="bottom"
    width="400"
    trigger="click"
    v-model="visible">
    <div>
      <el-col>
        将当前排班复制到:
      </el-col>
      <el-col>
        <el-radio-group v-model="cycle">
          <div v-for="val in 4" :key="val" class="radio-container mt5" :class="{'mb10': val === 4}">
            <el-radio :label="val">后{{val}}周
              <span>{{$moment(weeks[0].date).add(7, 'days').format('YYYY-MM-DD')}}
              -{{$moment(weeks[weeks.length - 1].date).add(val * 7, 'days').format('YYYY-MM-DD')}}</span></el-radio>
          </div>
        </el-radio-group>
      </el-col>
      <el-button type="primary" @click="copy">复制</el-button>
      <el-button  @click="visible = !visible">取消</el-button>
    </div>
    <el-button slot="reference" type="primary">复制到</el-button>
  </el-popover>
</template>
<script>
import api from '@/arrange/store/settingapi'
import { getWeekDates } from '@/util/common'
export default {
  props: {
    'calltype': {
      type: String,
      default: ''
    },
    'paramsData': {
      type: Object,
      default: () => {}
    },
    'categoryCode': {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      api,
      getWeekDates,
      cycle: null,
      weeks: [],
      beforeWeeks: [],
      visible: false
    }
  },
  mounted () {
    this.$nextTick(_ => {
      this.$bus.$on('weeks', val => {
        this.weeks = this.$moment(val[val.length - 1].date).isBefore(this.$moment().format('YYYY-MM-DD'), 'day') ? this.getWeekDates(this.$moment().format('YYYY-MM-DD')) : val
        this.beforeWeeks = this.$moment(val[val.length - 1].date).isBefore(this.$moment().format('YYYY-MM-DD'), 'day') ? val : []
      })
    })
  },
  created () {
    this.weeks = this.getWeekDates(this.$moment().format('YYYY-MM-DD'))
    this.cycle = null
  },
  methods: {
    copy () {
      let params = {
        startDate: this.beforeWeeks.length ? this.beforeWeeks[0].date : this.weeks[0].date,
        endDate: this.beforeWeeks.length ? this.beforeWeeks[this.weeks.length - 1].date : this.weeks[this.weeks.length - 1].date,
        timeUnit: 4,
        num: this.cycle,
        categoryCode: this.categoryCode
      }
      this.calltype === 'dpt' && Object.assign(params, this.paramsData)
      let reqs = this.calltype === 'dpt' ? this.api.copyBydpt : this.api.copyByclinic
      this.$confirm('复制的数据会覆盖原排班记录，请检查确认后再复制', '您是否确认要复制此排班?', {
        confirmButtonText: '确认复制',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reqs(params).then(rs => {
          if (rs.head.errCode === 0) {
            this.visible = false
            this.$messageTips(this, 'success', '复制排班成功')
            this.$emit('update')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

