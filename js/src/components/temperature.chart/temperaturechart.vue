<template>
  <div class="temperatureChart">
    <!-- 图标展示 -->
    <!-- <el-popover
      placement="left"
      width="180"
      trigger="click">
      <div class="legend">
        <div class="test-icon" v-for="item in icons" :key="item">
            <p>{{item}}</p>
        </div>
      </div>
      <el-button slot="reference">图例提示(测试专用)</el-button>
    </el-popover> -->
    <!-- <everNoData tipTxt="该日期无体温表信息"></everNoData> -->
    <div class="chartBox" id="printContent">
      <div>
        <h4 class="temperatureHeader">体温单</h4>
        <ul
          v-if="patientInfo"
          class="temperatureRow"
        >
          <template v-for ="item in patientInfo.header">
            <li :key="item.nameEn">{{item.nameCn}}:{{formatVal(patientInfo,item.nameEn)}}</li>
          </template>
        </ul>
        <div class="chart_wrap">
          <div>
            <div class="temperature_wrap">
              <div class="left_title_div"></div>
              <div class="right_content">
                <div class="content_auto">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { request } from '@/util/req'
import urlMap from '@/emr/urls'
import moment from 'moment'
import storage from '@/util/storage'
import {drawchart} from '@/emr/components/temperature/drawchart.js'
import temperaturePage from './temperature.page'
import {commandLog} from '@/phr/mixin/operationLog.js'
export default {
  props: ['patientId', 'visitId', 'authority', 'patientName'], // authority权限控制，1只读，2可打印
  data () {
    return {
      icons: ['腋温', '口温', '肛温', '降温', '脉搏', '心率', '心率起搏器', '疼痛', '镇痛', '腋温脉搏重叠', '口温脉搏重叠', '肛温脉搏重叠', '心率脉搏重叠', '疼痛镇痛重叠', '向上箭头', 'H图标'],
      beginDate: storage.getLocalStorage('printTime') || moment(new Date()).format('YYYY-MM-DD 00:00:00'),
      patientInfo: null,
      obj: null
    }
  },
  computed: {
    formatVal: function (obj, name) {
      return (obj, name) => {
        if (name === 'birthday' || name === 'enterDate') {
          if (!obj.data[name]) return '--'
          return this.$moment(obj.data[name]).format('YYYY-MM-DD')
        } else {
          return obj.data[name] || '--'
        }
      }
    }
  },
  watch: {
    'patientId': function (val) {
      storage.setLocalStorage('printTime', '')
      this.getChartData()
    },
    'visitId': function (val) {
      storage.setLocalStorage('printTime', '')
      this.getChartData()
    }
  },
  mounted () {
    this.getChartData(null)
    this.$bus.$on('cheartView:update', () => {
      this.getChartData(null)
    })
  },
  methods: {
    isSaved () {
      let recordTabs = JSON.parse(storage.getLocalStorage('recordTabs'))
      let isSaved = recordTabs.every((val) => {
        return !val.isUpdate || val.isUpdate === false
      })
      return isSaved
    },
    getChartData (currentPage) {
      request(urlMap.temperature.getChartData, {
        'patientId': this.patientId,
        'visitId': this.visitId,
        'currentPage': currentPage
      }).then(res => {
        if (res.head.errCode !== 0) return
        this.patientInfo = res.data.patientInfo
        this.beginDate = res.data.dynamicTable.data.date[0].datetime
        setTimeout(() => {
          drawchart({
            beginTime: this.beginDate,
            ...res.data
          })
        }, 500)
        this.$emit('getPageInfo', {totalPage: res.data.totalCount, currentPage: res.data.currentPage})
      })
    },
    print () {
      let opModuleOne = this.$route.name === 'case_recordprint' ? '病案管理-病历打印-体温单' : `护理文书-护理文书-体温单`
      if (this.isSaved() || this.$route.name === 'case_recordprint') {
        commandLog({// 需要加备注
          content: `打印体温单`,
          opModuleOne: opModuleOne,
          opType: 'PRINT',
          patientId: this.patientId,
          patientName: this.patientName,
          visitNumber: this.visitId
        })
        var oldhtml = document.body.innerHTML
        document.body.innerHTML = document.getElementById('printContent').innerHTML
        document.body.setAttribute('class', 'printBody')
        window.print()
        document.body.innerHTML = oldhtml
        window.location.reload()
      } else {
        this.$messageTips(this, 'warning', '当前有病历未保存，请先执行保存操作')
      }
    }
  },
  components: {
    temperaturePage
  }
}
</script>
<style scoped>
@page{
  margin-left:2cm;
}
.scroll{
  max-height: calc(100vh - 230px);
  overflow-y: scroll;
  padding-right:15px;
}
.temperatureChart {
  width: 760px;
  background: #fff;
  margin:0 auto;
  padding:20px 0 70px;
}
.temperatureHeader {
  text-align: center;
  margin: 10px;
}
.temperatureRow {
  padding: 0;
  font-size: 12px;
  line-height: 16px;
  text-align: left;
  font-weight: bold;
  margin-bottom: 6px;
  display:flex;
  justify-content: space-between;
  flex-wrap:wrap;
}
.temperatureRow li {
  padding: 0 2px;
}
.temperatureRow .el-col {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.dateRow {
  line-height: 36px;
}
/* .printShowLogo {
  display: none;
  width: 300px;
  height: 50px;
}
.printBody .printShowLogo {
  display: block;
} */
.temperature_wrap{
  display:flex;
  flex-direction: row;
  width: 700px;
  overflow:hidden;
}
.left_title_div{
  border:1px solid #000;
  border-right:none;
  border-bottom:none;
  text-align: left;
  box-sizing:border-box;
}
.left_title,.left_title_div{
  width: 130px;
}
.right_content{
  width:570px;
  border-bottom:1px solid #000;
}
.content_auto{
  width:100%;
  height:100%;
  border-bottom:1px solid #000;
  box-sizing:border-box;
}
/* .el-popover__reference{
  position:absolute;
  right:0;
  top:200px;
} */
/* .legend{
  font-size:14px;
  color:#000;
  width: 180px;
  border:1px solid #000;
  background:#fff;
}
.legend .test-icon{
  display: flex;
  flex-direction: row;
}
.legend p {
  line-height:20px;
  margin:0;
} */
</style>
