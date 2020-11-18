<template>
  <div>
    <el-row v-if="analysisArr && analysisArr.length">
      <el-col :span="12" v-for="(item, index) of analysisArr" :key="index">
        <el-row style="padding: 0 20px; height: 450px;" v-if="!item.isHide">
          <el-col>
            <h3 class="inline-block mr10">{{item.title}}</h3>
            <sys-select v-if="item.curveOptions.length" class="inline-block" v-model="item.curveNum" :options="item.curveOptions" type="radio"></sys-select>
          </el-col>
          <el-col>
            <sign-chart
              style="padding: 0 !important;"
              v-show="item.curveNum == 3"
              :chart-config="item.chartConfig"
              :patient-id="patientId"
              :sign-type="item.type"
            >
            </sign-chart>
            <standard-sign-chart
              style="margin: 0 !important;"
              v-show="item.curveNum == 1"
              v-if="item.curveType == 'ALL' || item.curveType == 'WHO'"
              :key="item.key + 'WHO'"
              :patient-id="patientId"
              :sex="analysisSex"
              :birthDay="analysisBirthday"
              :signType="item.type"
              chartType="WHO"
              :showTitle="false"
            >
            </standard-sign-chart>
            <standard-sign-chart
              style="margin: 0 !important;"
              v-show="item.curveNum == 2"
              v-if="item.curveType == 'ALL' || item.curveType == 'CDC'"
              :key="item.key + 'CDC'"
              :patient-id="patientId"
              :sex="analysisSex"
              :birthDay="analysisBirthday"
              :signType="item.type"
              chartType="CDC"
              :showTitle="false"
            >
            </standard-sign-chart>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import signChart from '@/components/signchart'
import standardSignChart from '@/components/standard.sign.chart'
import api from '@/crm/store/memberapi'
export default {
  data () {
    return {
      patientId: this.$route.params.patientId,
      analysisOptions: [],
      analysisSex: '',
      analysisBirthday: '',
      analysisArr: [],
      curveOptions1: [
        { id: '1', name: 'WHO' },
        { id: '2', name: 'CDC' },
        { id: '3', name: '非标准' },
      ],
      curveOptions2: [
        { id: '1', name: 'WHO' },
        { id: '3', name: '非标准' },
      ],
      curveOptions3: [
        { id: '2', name: 'CDC' },
        { id: '3', name: '非标准' },
      ],
      age: 0,
      graphArr: [
        {
          title: '身高',
          type: 'HEIGHT',
          axisName: '身高（cm）'
        },
        {
          title: '体重',
          type: 'WEIGHT',
          axisName: '体重（KG）'
        },
        {
          title: 'BMI',
          type: 'BMI',
          axisName: 'BMI（kg/㎡）'
        },
        {
          title: '头围',
          type: 'HEAD',
          axisName: '头围（cm）'
        },
        {
          title: '体温',
          type: 'BODY_TEMPERATURE',
          axisName: '体温（℃）'
        },
        {
          title: '脉搏',
          type: 'PULSE',
          axisName: '脉搏（bpm）'
        },
        {
          title: '血压',
          type: 'BLOOD_PRESSURE',
          axisName: '血压（mmHg）'
        },
        {
          title: '血氧',
          type: 'BLOOD_OXYGEN',
          axisName: '血氧（Sp02%）'
        },
        {
          title: '呼吸',
          type: 'BREATHE',
          axisName: '呼吸（次/分）'
        }
      ]
    }
  },
  created () {
    this.graphArr.forEach(item => {
      this.analysisOptions.push(
        {
          title: item.title,
          curveNum: '1',
          curveOptions: [],
          chartConfig: {
            'width': 636, // Number 默认值636 注:尺寸太小有可能会影响图表的查看
            'height': 380, // Number 默认值380 注:尺寸太小有可能会影响图表的查看
            // 'chartTitle': 'BMI', // String 默认显示 ‘未设置体征名称’
            'xAxisName': item.axisName, // String 默认显示 '未设置x轴名称'
            'yAxisName': item.axisName // String 默认显示 '未设置y轴名称'
          },
          key: item.type,
          type: item.type,
          curveType: 'ALL',
          isHide: false
        }
      )
    })
    api.getBaseInfoById1({patientId: this.patientId}).then(res => {
      if (res && res.data) {
        if (res.data.birthday) this.analysisBirthday = res.data.birthday
        this.analysisSex = Number(res.data.sex)
        this.analysisOptions.length && this.analysisOptions.forEach((item, i) => {
          this.filterAge(item, i)
        })
        this.analysisArr = this.analysisOptions
      }
    })
  },
  methods: {
    filterAge (row, i) {
      const birthDate = new Date(this.analysisBirthday)
      const birthYear = birthDate.getFullYear()
      const birthMonth = birthDate.getMonth() + 1
      const birthDay = birthDate.getDate()
      const nowDate = new Date()
      const nowYear = nowDate.getFullYear()
      const nowMonth = nowDate.getMonth() + 1
      const nowDay = nowDate.getDate()
      const year = nowYear - birthYear
      const month = nowMonth - birthMonth
      const day = nowDay - birthDay
      if (day > 15) {
        this.age = year * 12 + month + 0.5
      } else {
        this.age = year * 12 + month
      }
      row.curveOptions = this.curveOptions1
      row.curveType = 'ALL'
      row.curveNum = '1'
      if (this.age > 60) {
        row.curveNum = '2'
        row.curveOptions = this.curveOptions3
        row.curveType = 'CDC'
      }
      if (this.age > 240) {
        row.curveNum = '3'
        row.curveOptions = []
        row.curveType = 'NON_STANDARD'
      }
      if (row.type !== 'HEIGHT' && row.type !== 'WEIGHT' && row.type !== 'BMI' && row.type !== 'HEAD') {
        row.curveNum = '3'
        row.curveType = 'NON_STANDARD'
        row.curveOptions = []
      }
      if (row.type === 'HEAD') {
        row.curveNum = '1'
        if (this.age <= 36) {
          row.curveOptions = this.curveOptions1
          row.curveType = 'ALL'
        } else if (this.age <= 60 && this.age > 36) {
          row.curveType = 'WHO'
          row.curveOptions = this.curveOptions2
        } else if (this.age > 60) {
          row.isHide = true
        }
      }
      if (row.type === 'BMI') {
        if (this.age <= 24) {
          row.curveNum = '1'
          row.curveType = 'WHO'
          row.curveOptions = this.curveOptions2
        } else if (this.age <= 240 && this.age > 60) {
          row.curveNum = '2'
          row.curveType = 'CDC'
          row.curveOptions = this.curveOptions3
        } else if (this.age <= 60 && this.age > 24) {
          row.curveNum = '1'
          row.curveType = 'ALL'
          row.curveOptions = this.curveOptions1
        } else if (this.age > 240) {
          row.curveNum = '3'
          row.curveType = 'NON_STANDARD'
          row.curveOptions = []
        }
      }
    }
  },
  components: {
    signChart,
    standardSignChart
  }
}
</script>

<style scoped>
</style>
