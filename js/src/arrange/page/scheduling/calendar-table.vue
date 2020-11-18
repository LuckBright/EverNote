<template>
  <div class="tablewrap" id="tablecalender">
    <div class="inner" :class="{'flex_column_full_hidden': true}">
      <div>
        <table cellpadding="0" cellspacing="0" class="wrap line">
          <div :style="{'width': tWidth + 'px'}">
            <thead>
              <tr style="height:36px;">
                <th>
                  <div class="wd80">科室</div>
                </th>
                <th>
                  <div class="wd80">{{resourceName}}</div>
                </th>
                <th>
                  <div class="wd80">周排班</div>
                </th>
                <th :style="{width: 'calc(100vh - 90px)'}" v-for="(item, i) in arrangeWeek" :key="'arrange' + i" :class="{'cyellow': item.date && item.date.substring(8) === changeDate}">
                  <div>
                    <label>{{item.weekDate}}</label>
                  </div>
                </th>
              </tr>
            </thead>
          </div>
          <div
            ref="bodyheight"
            class="invisible-scrollbar d-body list-item"
            v-infinite-scroll="loadMore"
            infinite-scroll-immediate="false"
            :infinite-scroll-distance="40"
            :infinite-scroll-delay="200">
            <div class="c-container" :style="{'width': tWidth + 'px'}">
              <tbody  v-for="(value, index) in tableData" :key="index">
                <template>
                  <tr
                    v-if="['OUTPATIENT_DOCTOR', 'INQUIRY_VIDEO', 'INQUIRY_IMAGE_TEXT', 'CONSULT_ON_LINE'].includes(categoryCode) ? value.tsStaffList : value.roomList"
                    v-for="(data, i) in ['OUTPATIENT_DOCTOR', 'INQUIRY_VIDEO', 'INQUIRY_IMAGE_TEXT', 'CONSULT_ON_LINE'].includes(categoryCode) ? value.tsStaffList : value.roomList"
                    :key="'ts' + i">
                    <td v-if="i === 0" :rowspan="['OUTPATIENT_DOCTOR', 'INQUIRY_VIDEO', 'INQUIRY_IMAGE_TEXT', 'CONSULT_ON_LINE'].includes(categoryCode) ? value.tsStaffList.length : value.roomList.length" class="bg">
                      <div class="wd80">
                        {{value.tenantSubjectName}}
                      </div>
                    </td>
                    <td class="bg">
                      <div class="wd80">
                        {{data.name}}
                      </div>
                    </td>
                    <td class="bg">
                      <div class="wd80"  @click="weekArrange(value, data)">
                        <i class="iconfont icon-bianji"></i>
                      </div>
                    </td>
                    <template v-for="(week, windex) in arrangeWeek">
                      <td class="week" :key="'right' + windex" style="width: calc(100vh - 90px);">
                        <div v-for="(el, elk) in data.instances" :key="elk">
                          <div v-if="el.arrangeTime === week.date" :key="elk" style="width: calc(7vh - 90px);">
                            <div v-for="(time, timek) in el.timetrunks" :key="timek" class="mg">
                              <div class="wid155" :class="{'cgreen' : time.status === 2, 'cbule': time.status === 1}">
                                <dpt-popover
                                  :name="time.timetrunkName"
                                  :index="timek"
                                  :instanceId="time.instanceId"
                                  :category-code="categoryCode"
                                  :title-data="{
                                    'dptName': value.tenantSubjectName,
                                    'dptId': value.id,
                                    'docName': data.name,
                                    'doctorId': data.id,
                                    'orgId': time.orgId,
                                    'orgName': orgName,
                                    'date': week.date
                                  }"
                                  :key="time.instanceId"
                                  @popover="clickPopover">
                                </dpt-popover>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="add" @click="clicktable(value, data, windex)"><i class="iconfont icon-tianjia"></i></div>
                      </td>
                    </template>
                  </tr>
                </template>
              </tbody>
            </div>
          </div>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/arrange/store/settingapi'
import dptPopover from './dpt.popover.vue'
export default {
  props: {
    'resourceName': {
      type: String,
      default: ''
    },
    'arrangeWeek': {
      type: Array,
      default: () => []
    },
    'tableData': {
      type: Array,
      default: () => []
    },
    'tdWidth': {
      type: [String, Number]
    },
    'changeDate': {
      type: String,
      default: ''
    },
    'orgName': {
      type: String,
      default: ''
    },
    'docName': {
      type: String,
      default: ''
    },
    'categoryCode': {
      type: String,
      default: ''
    }
  },
  mounted () {
    let _this = this
    this.clientHeight = `${document.documentElement.clientHeight}` - 190 - `${document.getElementById('search-head').clientHeight}`
    window.onresize = function temp () {
      this.clientHeight = `${document.documentElement.clientHeight}` - 190 - `${document.getElementById('search-head').clientHeight}`
      _this.changeFixed(this.clientHeight)
    }
    this.tWidth = window.screen.width < 1440 ? 1379 : window.screen.width - 61
  },
  destroyed () {
    window.onresize = null
  },
  watch: {
    // 'checkDpt': {
    //   handler (val) {
    //     if (val) this.newDpt = val
    //     this.tWidth = window.screen.width < 1440 ? 1379 : window.screen.width - 61
    //   },
    //   deep: true
    // },
    'docName': {
      handler (val) {
        if (val) {
          let obj = {
            'tempArr': []
          }
          if (this.newDpt.length === 1) {
            Object.assign(this.newDpt[0], obj)
          }
        } else {
          this.isDoc = false
        }
      },
      deep: true
    },
    'newDpt': {
      handler (val) {
        if (val) {
          this.newDpt[0] && this.newDpt[0].tsStaffList.map(item => {
            if (item.name.includes(val)) {
              this.newDpt[0].tempArr.push(item)
              this.isDoc = true
            }
          })
        }
      },
      deep: true
    },
    'clientHeight': {
      handler (val) {
        this.changeFixed(this.clientHeight)
      },
      deep: true
    }
  },
  data () {
    return {
      api,
      width: this.tdWidth || 90,
      popover: false,
      tempData: {},
      newDpt: [],
      isDoc: false,
      clientHeight: '',
      tWidth: window.screen.width < 1440 ? 1379 : window.screen.width - 61,
      count: 1
    }
  },
  methods: {
    changeFixed (clientHeight) {
      this.$nextTick(_ => {
        this.$refs.bodyheight.style.height = (clientHeight > 618 ? 618 : clientHeight) + 'px'
      })
    },
    clicktable (val, data, index) {
      let isBefore = null
      isBefore = this.$moment(this.arrangeWeek[index].date).isBefore(this.$moment().format('YYYY-MM-DD'), 'day')
      if (isBefore) {
        this.$messageTips(this, 'warning', '请选择正确的时间进行排班')
        return false
      }
      this.tempdata(val, data)
      this.tempData.date = this.arrangeWeek[index].date
      this.tempData.weekDate = this.arrangeWeek[index].weekDate
      this.$emit('update', this.tempData)
    },
    clickPopover (val) {
      this.popover = val
    },
    weekArrange (val, data) {
      this.tempdata(val, data)
      let isBefore = null
      isBefore = this.$moment(this.arrangeWeek[this.arrangeWeek.length - 1].date).isBefore(this.$moment().format('YYYY-MM-DD'), 'day')
      if (isBefore) {
        this.$messageTips(this, 'warning', '当前时间不可排班')
        return false
      }
      this.$emit('showweek', this.tempData)
    },
    tempdata (val, data) {
      this.tempData.doctorId = data.id // 医生id
      this.tempData.docName = data.name
      this.tempData.dptId = val.id // 科室id
      this.tempData.dptName = val.tenantSubjectName
    },
    loadMore () {
      this.count++
      this.$emit('loadmore', this.count)
    },
    resetCount () {
      this.count = 0
    }
  },
  components: {
    dptPopover
  }
}
</script>

<style scoped>
.tablewrap {
  background: #fff;
}
table.wrap {
  font-size: 14px;
}
table.line {
  border: 1px solid #ddd;
  border-bottom: none;
  border-left: none;
}
table.wrap thead tr th {
  /* padding: 0px 5px; */
  min-height: 30px;
  font-size: 16px;
  font-weight: normal;
  border-left: 1px solid #D0DBE4;
  border-bottom: 1px solid #D0DBE4;
  background: #F0F5FA;
  position: relative;
}
table.wrap tbody tr td {
  background: #fff;
  border-left: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  position: relative;
  text-align: center;
  /* padding: 0px 5px; */
  min-height: 30px;
}
.invisible-scrollbar::-webkit-scrollbar {
  display: block;
  width: 5px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 20px;
  background-color:#fff;
}
.invisible-scrollbar::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgb(116, 118, 119);
}

.invisible-scrollbar::-webkit-scrollbar-track {/*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgb(216, 218, 219);
  border-radius: 10px;
  background: #EDEDED;
}
.c-container{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.d-body{
  height:618px;
  overflow-y:auto;
  overflow-x: hidden !important;
  background:#fff;
  position: relative;
}
.inner {
  display: table;
}
table.wrap tbody tr td .add{position: absolute; right: 0; bottom: 0; top: 0; width: 30px; text-align: center; background: #eee;display: none; cursor: pointer;z-index: 999;}
table.wrap tbody tr td .add i.iconfont {position: absolute; left: 50%;margin-left: -8px; top: 50%; margin-top: -8px; color: #1c7bef;}
table.wrap tbody tr td:hover .add{display: block;}
table.wrap tbody tr td.week {
  text-align: left;
  height:31px;
}
.cyellow{
  background: #FFCA00 !important;
}
.wd80{width:90px;}
.wid155{min-width: 195px; height: 36px;vertical-align:middle;text-align:center;display:table-cell;border-radius: 2px;}
.cgreen{background: #C2E4B6;}
.cbule{background: #B6E4E4;}
.mg{margin:2px;}
.bg{background-color: #F0F5FA !important;border-left: 1px solid #D0DBE4 !important;border-bottom: 1px solid #D0DBE4 !important;}
</style>
