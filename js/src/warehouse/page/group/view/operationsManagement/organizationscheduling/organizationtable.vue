<template>
  <div class="tablewrap">
    <div class="inner" :class="{'flex_column_full_hidden': true}">
      <div class="header">
        <table cellpadding="0" cellspacing="0" class="wrap line">
          <div>
            <thead>
              <tr class="bg" style="height:37px;">
                <th><div class="wd80">机构</div></th>
                <th><div class="wd80">科室</div></th>
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
            class="invisible-scrollbar d-body list-item"
            v-infinite-scroll="loadMore"
            infinite-scroll-immediate="false"
            :infinite-scroll-distance="40"
            :infinite-scroll-delay="200">
            <div class="c-container" :style="{'width': tWidth + 'px'}">
              <tbody v-for="(value, index) in  tableData" :key="index">
                <template>
                  <tr
                    v-for="(data, i) in value.tenantSubjectList" :key="i"
                    :class="{
                      after:  i === 0,
                      before: i === 0
                    }"
                    style="height:35px;">
                      <td v-if="i === 0" :rowspan="value.tenantSubjectList.length" class="bg">
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
                        <td class="week" @click="clicktable(value,data,windex)" :key="week.doctorId" :style="{width: 'calc(100vh - 90px)'}">
                          <div v-for="(el, elk) in data.instances" :key="elk" class="mg">
                            <span v-if="el.arrangeTime === week.date" :key="elk">
                              <div style="width: calc(7vh - 90px);" class="mt10">
                                <div v-for="(time, ktime) in el.resources" :key="ktime" class="mr2">
                                  <div v-if="time.name" class="content" :class="{'borderb': ktime !== el.resources.length - 1}">
                                    <div class="ml5 ellip">
                                      {{time.name}}
                                    </div>
                                    <div v-for="(trunk, tidx) in time.timetrunks" :key="tidx" style="display:inline-block;margin-top: 10px;" class="mr5">
                                      <span :class="{'cgreen' : trunk.status === 1, 'cbule': trunk.status === 2}" class="wid25">{{trunk.timetrunkName && trunk.timetrunkName.substr(0, 1)}}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </span>
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
  export default {
    props: {
      'arrangeWeek': {
        type: Array,
        default: () => []
      },
      'clinicList': {
        type: Array,
        default: () => []
      },
      'checkClinic': {
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
      'checkClinic': {
        handler (val) {
          if (val) this.newDpt = val
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
        width: this.tdWidth || 160,
        newDpt: [],
        clientHeight: '',
        tWidth: window.screen.width < 1440 ? 1379 : window.screen.width - 61,
        count: 1,
      }
    },
    methods: {
      changeFixed (clientHeight) {
        this.$nextTick(_ => {
          this.$refs.bodyheight.style.height = clientHeight + 'px'
        })
      },
      clicktable (a, b, index) {
        let isBefore = null
        isBefore = this.$moment(this.arrangeWeek[index].date).isBefore(this.$moment().format('YYYY-MM-DD'), 'day')
        if (isBefore) {
          this.$messageTips(this, 'warning', '请选择正确的时间进行排班')
          return false
        }
        let temp = {
          clinicId: a.id,
          clinicName: a.name,
          dptName: b.tenantSubjectName,
          dptId: b.id, // 执业科室id
          weekDate: this.arrangeWeek[index].weekDate,
          date: this.arrangeWeek[index].date
        }
        this.getDoctor(temp)
      },
      async getDoctor (temp) {
        let params = {
          outSubjectGetTenantSubjectListByConditionReqDTO: {
            orgIdList: [temp.clinicId],
            idList: [temp.dptId]
          }
        }
        this.api.getdocByorgDpt(params).then(rs => {
          if (rs.head.errCode === 0) {
            if (rs.data.resultList.length > 0 && rs.data.resultList[0].tsStaffList.length) {
              this.$emit('update', temp)
            } else {
              this.$messageTips(this, 'warning', '请关联科室医生')
              return false
            }
          }
        })
      },
      loadMore () {
        this.count++
        this.$emit('loadmore', this.count)
      },
      resetCount () {
        this.count = 0
      }
    }
  }
</script>

<style scoped>
  .tablewrap {
    padding: 20px;
    background: #fff;
  }
  table.line {
    border: 1px solid #ddd;
    border-bottom: none;
    border-left: none;
  }
  table.wrap thead tr th{
    min-height: 30px;
    font-size: 16px;
    font-weight: normal;
    border-left: 1px solid #D0DBE4;
    border-bottom: 1px solid #D0DBE4;
    background: #F0F5FA;
    position: relative;
  }
  table.wrap tbody tr td{
    background: #fff;
    border-left: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    min-height: 30px;
    position: relative;
  }
  .tablewrap .body{overflow-y: scroll; overflow-x:hidden; border:1px solid #ddd;}
  .inner{display: table;}
  table.wrap tbody tr td {
    text-align: center;
    min-height: 50px;
  }
  table.wrap tbody tr td.week{
    text-align: left;
  }
  .cyellow{
    background: #FFCA00 !important;
  }
  .wid25{width: 20px; height: 20px;vertical-align:middle;text-align:center;display:table-cell;color:#fff;border-radius: 2px;}
  .bg{background-color: #F0F5FA !important;border-left: 1px solid #D0DBE4 !important;border-bottom: 1px solid #D0DBE4 !important;}
  .content{
    display:flex;
    width:195px;
    height:36px;
    background: #D9F1D0;
    border-radius: 2px;
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
    overflow-y:auto;
    overflow-x: hidden !important;
    background:#fff;
    position: relative;
  }
  .wd80{width:90px;font-size:14px;}
  .cgreen{background: #C2E4B6;}
  .cbule{background: #217EE3;}
  .borderb{border-bottom: 1px solid #B0D2A4;}
  .ellip{
    width:100px;
    display:inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top:10px;
  }
  .mr2{margin-right:2px;}

  .mg{margin:2px;}
</style>
