<template>
  <div id="setting">
    <search-header
      :init-dept="dept"
      :init-orgin="organ"
      :init-template="template"
      :disabled="!!value"
      :show-first-dept="!dept"
      @query="setParams"
      @selectTemplate="setTemplate"
      @getOrgan="setOrgan"
      @getDept="setDept"
    >
      <el-date-picker :disabled="!!value" v-model="currentMonth" type="month" placeholder="切换月份"></el-date-picker>
      <el-button
        type="primary"
        class="ml20"
        slot="afther"
        :disabled="isSubmitAudit"
        @click="submitArrange"
        v-if="$hasPermission('Auth_menu_crm_arrange_submit') && !value"
      >提交审核</el-button>
      <el-button
        type="primary"
        class="ml20"
        slot="afther"
        @click="examineArrange"
        v-if="$hasPermission('Auth_menu_crm_arrange_release') && value && value.status === 1"
      >审核发布</el-button>
    </search-header>
    <el-row type="flex">
      <el-col class="left">
        <div class="left_header">
          <table cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <th class="firsttd">{{dept.deptName}}</th>
              </tr>
              <tr>
                <th class="firsttd">医生</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="left_body" ref="left">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr v-for="(row, i) in list" :key="i + '-' + 1">
                <td
                  class="firsttd"
                  align="center"
                  :style="{height: (itemsHeight[i] - 1) + 'px', lineHeight: (itemsHeight[i] - 1) + 'px'}"
                >
                  <span>{{row.resourceName}}</span>
                  <!-- {{itemsHeight[i]}} -->
                </td>
              </tr>
              <tr v-for="i of aftherRow" :key="i + '-' + 2">
                <td class="weektd"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-col>
      <el-col class="right">
        <div class="right_header" ref="header">
          <table cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <th class="weektd" v-for="(item, i) in calendar.list" :key="i">{{item.week}}</th>
              </tr>
              <tr>
                <th class="weektd" v-for="(item, i) in calendar.list" :key="i">{{item.showdate}}</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="right_body" @scroll="handleScroll">
          <table cellpadding="0" cellspacing="0">
            <tbody ref="maintable">
              <tr v-for="(row, i) in list" :key="i + '-' + 1">
                <td class="weektd" v-for="(item, j) in calendar.list" :key="j">
                  <div class="wrap" v-if="row.timeTrunks">
                    <template v-for="(res, k) in row.timeTrunks[item.date]">
                      <time-trunk
                        v-if="row.timeTrunks[item.date]"
                        :is-month="true"
                        :resource="row"
                        :dept="dept"
                        :templet-id="template.id"
                        :timetrunk="res"
                        :closable="value ? true : false"
                        :key="k"
                        @del="getArrangeList"
                      ></time-trunk>
                    </template>
                  </div>
                  <add-arrange
                    class="add"
                    :date="item.date"
                    :organ="organ"
                    :dept="dept"
                    :resource="row"
                    :template="template"
                    :filters="row.timeTrunks ? row.timeTrunks[item.date] : ''"
                    @success="getArrangeList"
                    v-if="$moment(item.date) >= $moment(item.currentDate).subtract(1, 'days') && !value"
                  ></add-arrange>
                  <div
                    class="mask"
                    v-if="$moment(item.date) < $moment(item.currentDate).subtract(1, 'days')"
                  ></div>
                </td>
              </tr>
              <tr v-for="i of aftherRow" :key="i + '-' + 2">
                <td class="weektd" v-for="(item, j) in calendar.list" :key="j">
                  <div
                    class="mask"
                    v-if="$moment(item.date) < $moment(item.currentDate).subtract(1, 'days')"
                  ></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-col>
    </el-row>
    <download
      :show.sync="showDownLoad"
      :params="params"
      :template="template"
      :organ="organ"
      :dept="dept"
      :month="currentMonth"
    ></download>
  </div>
</template>

<script>
import api from '@/arrange/store/settingapi'
import arrangeapi from '@/arrange/store/schedulingapi'
import addArrange from '@/arrange/page/setting/addmontharrange.vue'
import searchHeader from '@/arrange/page/scheduling/search.vue'
import addDoctor from '@/arrange/page/setting/adddoctor.vue'
import timeTrunk from '@/arrange/page/setting/timetrunk.vue'
import download from '@/arrange/page/setting/dialog-download.vue'
export default {
  props: ['value'],
  data () {
    return {
      api,
      arrangeapi,
      initRow: 14,
      showDownLoad: false,
      isSubmitAudit: false,
      currentMonth: this.$moment(),
      calendar: '',
      template: '',
      organ: '',
      dept: '',
      list: [],
      itemsHeight: [],
      params: {
        deptId: '',
        organId: '',
        templetId: '',
        resourceName: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  watch: {
    params: {
      handler (val) {
        if (val.organId && val.templetId && val.startDate && val.endDate && val.deptId) {
          this.getArrangeList()
        }
      },
      deep: true
    },
    currentMonth (val) {
      if (val) {
        this.calendar = this.getCalendar()
      }
    },
    calendar (val) {
      this.params.startDate = val.startDate
      this.params.endDate = val.endDate
    }
  },
  created () {
    if (this.value && Object.keys(this.value).length > 0) {
      this.template = { id: this.value.arrangeTempletId, name: this.value.arrangeTempletName }
      this.organ = { organId: this.value.orgId, organName: this.value.orgName }
      this.dept = { deptId: this.value.depId, deptName: this.value.depName, id: this.value.depId, name: this.value.depName }
      this.currentMonth = this.value.arrangeMonth + '-01'
    }
    this.calendar = this.getCalendar()
  },
  methods: {
    setParams (val) {
      Object.assign(this.params, val)
    },
    setTemplate (val) {
      this.template = val
      this.params.templetId = val.id
    },
    setOrgan (val) {
      this.organ = val
      this.params.organId = val.organId
    },
    setDept (val) {
      if (val) {
        this.dept = val
        this.params.deptId = val.deptId
      }
    },
    getArrangeList () {
      let request = !this.value ? this.arrangeapi.list(this.params) : this.api.getCheckLogArrangeList({ checkLogId: this.value.id, status: this.value.status })
      request.then(rs => {
        if (rs.head.errCode || !rs.data[0]) {
          this.list = []
          return false
        }
        this.list = rs.data[0].resourceArrangeResultList
        this.$nextTick(() => {
          this.itemsHeight = this.getItemsHeight()
        })
      })
    },
    getCalendar () {
      const weeksName = ['一', '二', '三', '四', '五', '六', '日']
      let calendar = []
      let begin = this.$moment(this.currentMonth).startOf('month').dates()
      let end = this.$moment(this.currentMonth).endOf('month').dates()
      for (let i = begin; i <= end; i++) {
        calendar.push({
          date: this.$moment(this.currentMonth).dates(i).format('YYYY-MM-DD'),
          showdate: this.$moment(this.currentMonth).dates(i).format('MM/DD'),
          week: '星期' + weeksName[this.$moment(this.currentMonth).dates(i).weekday()]
        })
      }
      return {
        startDate: this.$moment(this.currentMonth).startOf('month').format('YYYY-MM-DD'),
        endDate: this.$moment(this.currentMonth).endOf('month').format('YYYY-MM-DD'),
        currentDate: this.$moment().format('YYYY-MM-DD'),
        list: calendar
      }
    },
    getTimeTrunksIds (status) {
      let ids = []
      this.list.map(item => {
        for (let key in item.timeTrunks) {
          if (this.$moment(key) >= this.$moment().subtract(1, 'days')) {
            let filter = item.timeTrunks[key].filter(timetrunk => {
              return timetrunk.status === status
            })
            let arr = filter.map(timetrunk => {
              return timetrunk.resourceArrangeId
            })
            ids = ids.concat(arr)
          }
        }
      })
      return ids
    },
    examineArrange () {
      this.$confirm('审核通过，将修改排班，并对外发布，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        this.api.approveArrange({
          checkLogId: this.value.id
        }).then(rs => {
          if (rs.head.errCode) {
            return false
          }
          this.$notify({
            title: '提示',
            type: 'success',
            message: '排班记录已发布',
            duration: 2000
          })
          this.$emit('success', rs.data)
          console.log(1)
        })
      })
    },
    submitArrange () {
      let addResourceArrangeIds = this.getTimeTrunksIds(1)
      let deleteResourceArrangeIds = this.getTimeTrunksIds(-1)
      if (!addResourceArrangeIds[0] && !deleteResourceArrangeIds[0]) {
        this.$notify({
          title: '提示',
          type: 'warning',
          message: '没有变更的排班计划',
          duration: 2000
        })
        return false
      }
      this.showDownLoad = true
    },
    getItemsHeight () {
      let items = Array.from(this.$refs.maintable.querySelectorAll('tr'))
      let arr = []
      items.map(item => {
        arr.push(item.clientHeight)
      })
      return arr
    },
    handleScroll (e) {
      let X = e.target.scrollLeft
      let Y = e.target.scrollTop
      this.$refs.header.scrollLeft = X
      this.$refs.left.scrollTop = Y
    }
  },
  computed: {
    aftherRow () {
      return this.list.length < this.initRow ? this.initRow - this.list.length : 0
    }
  },
  components: {
    addArrange,
    searchHeader,
    addDoctor,
    timeTrunk,
    download
  }
}
</script>
<style scoped>
#setting {
  padding: 10px;
  background: #fff;
}
#setting table tr td,
#setting table tr th {
  border-left: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  height: 40px;
  font-size: 14px;
  position: relative;
}
#setting table {
  border-right: 1px solid #ddd;
}
#setting table tr th {
  border-top: 1px solid #ddd;
  background: #ccc;
  font-size: 14px;
}
#setting table tr:last-child th {
  border-top: none;
}
#setting table tr td {
  cursor: pointer;
  vertical-align: top;
}
#setting table tr td.back {
  background: rgba(100, 100, 100, 0.1);
}
#setting .left {
  width: 161px;
}
#setting .right {
  width: calc(100% - 144px);
}
#setting .right_header {
  width: calc(100% - 18px);
  overflow: hidden;
}
#setting .left_body {
  height: 620px;
  overflow: hidden;
}
#setting .right_body {
  height: 640px;
  width: calc(100% - 18px);
  overflow: auto;
}
#setting .weektd {
  min-width: 160px;
  position: relative;
}
#setting .firsttd {
  min-width: 160px;
  position: relative;
  vertical-align: middle;
}
#setting .weektd .wrap {
  padding: 5px 35px 5px 5px;
}
#setting .weektd .add {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  z-index: 1000;
  text-align: center;
  display: none;
}
#setting .weektd:hover .add {
  display: block;
}
#setting .mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(100, 100, 100, 0.1);
  z-index: 999;
}
</style>
