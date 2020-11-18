<template>
  <div class="yizhu">
    <ever-form2 :schema="schema" v-model="queryObj" :inline="true">
      <template slot="orderDateStart">
        <ever-range-picker
          date-type="datetimerange"
          auto-width="true"
          :start.sync="queryObj.orderDateStart"
          :end.sync="queryObj.orderDateEnd"
          :outformat="`YYYY-MM-DD HH:mm:ss`"
          :default-time="['00:00:00', '23:59:59']"
        ></ever-range-picker>
      </template>
      <template slot="adviceType">
        <el-select
          v-model="queryObj.adviceType"
          filterable
          :placeholder="'请选择医嘱类型'"
          :clearable="true"
        >
          <el-option
            v-for="item in typeArr"
            :key="item.id"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
      </template>
      <template slot="default">
        <el-button size="small" @click="list">查询</el-button>
      </template>
    </ever-form2>
    <div>
      <ever-table
        height="200"
        class="margin"
        ref="table"
        :columns="columns"
        :data="tableData"
        border
        show-checkbox
        @select="select"
        @select-all="select"
      ></ever-table>
    </div>
  </div>
</template>
<script>
import sysvalue from '@/warehouse/store/sysvalueapi'
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
import { OUTPATIENT_ADVICE_STATUS } from '@/util/otherconfig.js'

const schema = [
  {
    name: 'adviceType',
    label: '医嘱类型',
    comp: 'custom'
  },
  {
    name: 'orderDateStart',
    label: '日期',
    comp: 'custom'
  },
  {
    name: 'orderDateEnd',
    label: '',
    comp: 'custom'
  }
]
const TEXT = '1'
const TABLE = '2'
const ALL = '3'

export default {
  props: {
    patientId: String,
    visitNum: String,
    quoteType: String
  },
  created () {
    this.getTypes()
    this.list()
  },
  components: {},
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.orderDateStart = ''
    queryObj.orderDateEnd = ''
    queryObj.hospitalizedNumber = this.visitNum
    queryObj.patientId = this.patientId
    return {
      OUTPATIENT_ADVICE_STATUS,
      url: urlMap.quote.yizhu,
      typeArr: [],
      schema,
      queryObj,
      tableData: [],
      columns: [
        {
          prop: 'doctorAdviceStartTime',
          label: '开始时间',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceTermName',
          label: '长/临',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceTypeName',
          label: '类型',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceName',
          label: '名称',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceContent',
          label: '内容',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceRemark',
          label: '嘱托',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceExecuteTenantSubjectName',
          label: '执行科室',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceStatusCode',
          label: '状态',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceStopTime',
          label: '停止时间',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceStopUserName',
          label: '停止医生',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceChannelName',
          label: '渠道',
          showOverflowTooltip: true
        },
        {
          prop: 'storageRoomName',
          label: '库房',
          showOverflowTooltip: true
        }
      ],
      selected: []
    }
  },
  methods: {
    formatText (value) {
      return this.OUTPATIENT_ADVICE_STATUS[value].txt
    },
    quote (id) {
      if (this.quoteType === TEXT) {
        this.$bus.$emit('ref:append' + id, this.textFormat(this.selected))
      } else if (this.quoteType === ALL) {
        this.$bus.$emit('ref:append' + id, this.tableFormat(this.tableData))
      } else if (this.quoteType === TABLE) {
        this.$bus.$emit('ref:append' + id, this.tableFormat(this.selected))
      }
    },
    textFormat (arr) {
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
    isEmpty (val) {
      return val ? val + '' : '--'
    },
    getTypes () {
      sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(res => {
        res.forEach(item => {
          // 去除检验 检查子项
          if (item.parentId !== '801' && item.parentId !== '800') {
            this.typeArr.push(item)
          }
        })
      })
    },
    async list () {
      this.selected = []
      if (!this.visitNum || !this.patientId) return
      const res = await request(this.url, this.queryObj)
      this.tableData = res.data ? res.data : []
      this.tableData.map((item, index) => {
        item.doctorAdviceStatusCode = this.formatText(item.doctorAdviceStatusCode)
        item.adviceName = item.adviceName + this.isNull(item.specification)
        item.index = index
      })
    },
    isNull (val) {
      return val === null ? '' : val
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
  margin-top: -15px;
}
</style>

