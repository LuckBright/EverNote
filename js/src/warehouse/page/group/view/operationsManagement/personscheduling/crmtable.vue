<template>
  <div class="tablewrap">
    <div class="inner" :class="{'flex_column_full_hidden': true}">
      <div>
        <table cellpadding="0" cellspacing="0" class="wrap line">
          <div>
            <thead>
              <tr style="height:36px;">
                <th>
                  <div class="wd80">人员</div>
                </th>
                <th>
                  <div class="wd80">科室</div>
                </th>
                <th :style="{width: 'calc(100vh - 90px)'}" v-for="(item, i) in arrangeWeek" :key="i" :class="{'cyellow': item.date && item.date.substring(8) === changeDate}">
                  <div>
                    <label>{{item.weekDate}}</label>
                  </div>
                </th>
              </tr>
            </thead>
          </div>
          <div 
            ref="bodyheight"
            class="invisible-scrollbar d-body"
            v-infinite-scroll="loadMore"
            infinite-scroll-immediate="false"
            :infinite-scroll-distance="40"
            :infinite-scroll-delay="200"
            >
            <div class="c-container" :style="{'width': tWidth + 'px'}">
              <tbody v-for="(value, index) in tableData" :key="index">
                <template>
                  <tr 
                    v-if="value.tsStaffSubjectList.length"
                    :class="{after: index === arrangeList.length - 1 && index === 0, before: index === 0}"
                    v-for="(data, tsindex) in value.tsStaffSubjectList"
                    :key="tsindex">
                    <td v-if="tsindex === 0" :rowspan="value.tsStaffSubjectList.length" class="bg">
                      <div class="wd80">
                        {{value.name}}
                      </div>
                    </td>
                    <td class="bg">
                      <div class="wd80">
                        {{data.tenantSubjectName}}
                      </div>
                    </td>
                    <template v-for="(week, windex) in arrangeWeek">
                      <td class="week" @click="clicktable(value,data,windex)" :key="'arrange'+windex" style="width: calc(100vh - 180px);">
                        <div v-for="(el, elk) in data.instances" :key="'i'+elk" class="mg">
                          <div v-if="el.arrangeTime === week.date"
                            class="ht36"
                          >
                            <div style="width: calc(7vh - 90px);min-height:40px;">
                              <div class="content bggreen"  v-for="(oval, oindex) in el.orgs" :key="'org'+oindex"  :class="{'borderb': oindex !== el.orgs.length - 1}">
                                <div>
                                  <span class="ellip ml10">
                                    {{oval.name}}
                                  </span>
                                  <div v-for="(time, ktime) in oval.timetrunks" :key="'time'+ktime" class="wid25" style="display:inline-block;">
                                    <div>
                                      <span class="wd25" :class="{'cgreen' : time.status === 1, 'cbule': time.status === 2}">{{time.timetrunkName && time.timetrunkName.substr(0, 1)}}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
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
import wapi from '@/arrange/store/workapi'
export default {
  props: {
    'arrangeWeek': {
      type: Array,
      default: () => []
    },
    'arrangeList': {
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
    'tempArr': {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      api,
      wapi,
      width: this.tdWidth || 90,
      totalRow: 10,
      clientHeight: '',
      tWidth: window.screen.width < 1440 ? 1379 : window.screen.width - 61,
      count: 1,
    }
  },
  mounted () {
    let _this = this
    this.clientHeight = `${document.documentElement.clientHeight}` - 240
    window.onresize = function temp () {
      this.clientHeight = `${document.documentElement.clientHeight}` - 240
      _this.changeFixed(this.clientHeight)
    }
  },
  destroyed () {
    window.onresize = null
  },
  watch: {
    arrangeList (val) {
      this.totalRow = val ? val.length : 10
    },
    'clientHeight': {
      handler (val) {
        this.changeFixed(this.clientHeight)
      },
      deep: true
    }
  },
  methods: {
    changeFixed (clientHeight) {
      this.$nextTick(_ => {
        this.$refs.bodyheight.style.height = clientHeight + 'px'
      })
    },
    getclinicList (tempData) {
      let params = {
        outSubjectGetTenantSubjectListByConditionReqDTO: {
          staffIdList: [tempData.doctorId],
          tenantSubjectIdList: [tempData.dptId]
        }
      }
      this.wapi.getAllcliniclist(params).then(rs => {
        if (rs.head.errCode === 0) {
          if (rs.data.resultList.length > 0) {
            this.$emit('update', tempData)
          } else {
            this.$messageTips(this, 'warning', '请关联执业机构')
          }
        }
      })
    },
    clicktable (val, data, index) {
      let isBefore = null
      isBefore = this.$moment(this.arrangeWeek[index].date).isBefore(this.$moment().format('YYYY-MM-DD'), 'day')
      if (isBefore) {
        this.$messageTips(this, 'warning', '请选择正确的时间进行排班')
        return false
      }
      const tempData = {}
      tempData.doctorId = val.id // 医生id
      tempData.dptId = data.id // 科室id
      tempData.dptName = data.tenantSubjectName
      tempData.name = val.name
      tempData.date = this.arrangeWeek[index].date
      tempData.weekDate = this.arrangeWeek[index].weekDate
      this.getclinicList(tempData)
    },
    loadMore () {
      this.count++
      this.$emit('loadmore', this.count)
    },
    resetCount () {
      this.count = 1
    }
  },
}
</script>

<style scoped>
.tablewrap {
  padding: 20px;
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
  min-height: 30px;
  position: relative;
}
.inner {
  display: table;
}

table.wrap tbody tr td {
  text-align: center;
  min-height: 30px;
}

table.wrap tbody tr td.week {
  text-align: left;
  height: 30px;
}
.ellip{
  width:100px;
  display:inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top:10px;
}
.cyellow{
  background: #FFCA00 !important;
}
.wid25{
  width: 20px;
  height: 20px;
  vertical-align:middle;
  text-align:center;
  display:table-cell;
  background-color: #217EE3;
  color:#fff;
  border-radius: 2px;
  margin-right:1px;
  margin-top:-8px;
}
.wd80{width:90px;}
.ht36{
  min-height:36px;
  vertical-align:middle;
  text-align:left;
  }
.content{
  display:flex;
  width:195px;
  height:36px;
  background: #D9F1D0;
  border-radius: 2px;
}
.bg{background-color: #F0F5FA !important;border-left: 1px solid #D0DBE4 !important;border-bottom: 1px solid #D0DBE4 !important;}
.bggreen{background: #D9F1D0;}
.cgreen{background: #C2E4B6;}
.cbule{background: #217EE3;}
.wd25{
  width:20px;
  height:18px;
  display: block;
  margin-right:1px;
  border-radius: 2px;
  padding-top:2px;}
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
  overflow-y:auto;
  overflow-x: hidden !important;
  background:#fff;
  position: relative;
}
.mg{margin:2px;}
.borderb{border-bottom: 1px solid #B0D2A4;}
</style>
