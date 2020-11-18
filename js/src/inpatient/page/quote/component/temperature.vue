<template>
  <div class="yizhu">
    <ever-form2 :schema="schema" v-model="queryObj" :inline="true">
      <template slot="start">
        <ever-range-picker
          date-type="datetimerange"
          auto-width="true"
          :start.sync="queryObj.start"
          :end.sync="queryObj.end"
          :outformat="`YYYY-MM-DD HH:mm:ss`"
          :default-time="['00:00:00', '23:59:59']"
        ></ever-range-picker>
      </template>
      <template slot="default">
        <el-button size="small" @click="list">查询</el-button>
      </template>
    </ever-form2>
    <ever-table
      v-if="columns.length"
      height="200"
      class="margin"
      ref="table"
      :columns="columns"
      :data="tableData"
      border
      not-select-checkbox
      show-checkbox
      @select="select"
      @select-all="select"
    ></ever-table>
    <ever-no-data v-else tipTxt="暂无数据"></ever-no-data>
  </div>
</template>
<script>
import api from '@/inpatient/store/phr'
import {blood1, blood2} from '@/emr/config/temperaturedata.js'
const TEXT = '1'
const TABLE = '2'
const schema = [
  {
    name: 'start',
    label: '日期',
    comp: 'custom'
  },
  {
    name: 'end',
    comp: 'custom'
  }
]
export default {
  props: {
    patientId: String,
    visitNum: String,
    quoteType: String,
    curNode: Object
  },
  created () {
    this.list()
  },
  components: {},
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.start = this.$moment()
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss')
    queryObj.end = this.$moment()
      .endOf('day')
      .format('YYYY-MM-DD HH:mm:ss')
    return {
      queryObj,
      schema,
      tableData: [],
      columns: [
        {
          label: '日期',
          prop: 'recordTime'
        },
        {
          label: '体温(℃)',
          prop: 'TZ_TI_WEN'
        },
        {
          label: '心率(次/min)',
          prop: 'TZ_XIN_LU'
        },
        {
          label: '呼吸(次/min) ',
          prop: 'TZ_HU_XI'
        },
        {
          label: '脉搏(次/min) ',
          prop: 'TZ_MAI_BO'
        },
        {
          label: '血压(mmHg)',
          prop: 'DL_XUE_YA'
        }
      ],
      selected: []
    }
  },
  methods: {
    quote () {
      if (this.quoteType === TEXT) {
        this.$bus.$emit('ref:append' + this.curNode.id, this.textFormat(this.selected))
      } else if (this.quoteType === TABLE) {
        this.$bus.$emit('ref:append' + this.curNode.id, this.tableFormat(this.selected))
      }
    },
    isEmpty (val) {
      return val || val != null ? val : ''
    },
    tableFormat (arr) {
      if (!arr.length) return ''
      let th = ''
      let td = ''
      this.columns.map(item => {
        th += `<th>${item.label}</th>`
      })
      arr.map(item => {
        let children = ''
        this.columns.map((columns, index) => {
          children += `<td>${this.isEmpty(item[columns.prop])}</td>`
        })
        td += `<tr>${children}</tr>`
      })
      return `<table><tr>${th}</tr>${td}</table>`
    },
    textFormat (arr) {
      if (this.curNode.code === 'YI_BAN_HU_LI_JI_LU_DAN') {
        const data = []
        if (arr && arr.length) {
          arr.map(item => {
            const obj = {}
            if (item['DL_XUE_YA']) obj['blood_pressure'] = String(item['DL_XUE_YA'])
            if (item['TZ_HU_XI']) obj['breathing'] = String(item['TZ_HU_XI'])
            if (item['TZ_TI_WEN']) obj['body_temperature'] = String(item['TZ_TI_WEN'])
            if (item['TZ_MAI_BO']) obj['pulse'] = String(item['TZ_MAI_BO'])
            if (item['TZ_XIN_LU']) obj['heart_rate'] = String(item['TZ_XIN_LU'])
            obj.time = item.recordTime && item.recordTime !== null
              ? item.recordTime.substr(11, 5)
              : ''
            data.push(obj)
          })
        }
        return data
      } else {
        let str = ''
        if (arr && arr.length) {
          arr.map(item => {
            let label = ''
            this.columns.map(columns => {
              label += `${columns.label}: ${this.isEmpty(item[columns.prop])} `
            })
            str += `<p>${label}</p>`
          })
        }
        return str
      }
    },
    async list () {
      this.selected = []
      if (!this.visitNum || !this.patientId) return
      const { start, end } = this.queryObj
      let res = await api.getByVisitId({
        start: start,
        end: end,
        patientId: this.patientId,
        visitId: this.visitNum
      })
      if (res.formDatas && Array.isArray(res.formDatas)) {
        this.tableData = []
        const data = res.formDatas
        data.map((item, index) => {
          const obj = item.data
          obj.index = index
          if (obj.DL_XUE_YA && obj.DL_XUE_YA[blood1] && obj.DL_XUE_YA[blood2]) {
            obj.DL_XUE_YA = obj.DL_XUE_YA[blood1] + '/' + obj.DL_XUE_YA[blood2]
          } else {
            obj.DL_XUE_YA = ''
          }
          this.tableData.push(obj)
        })
      }
    },
    select (val) {
      this.selected = val
      this.selected = this.selected.sort((a, b) => a.index - b.index)
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss">
.margin {
  margin-top: -10px;
}
</style>

