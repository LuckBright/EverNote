<template>
  <div class="yizhu">
    <ever-form2 :schema="schema" v-model="queryObj" :inline="true" :nosubmit="true">
      <template slot="orderDateStart">
        <ever-range-picker
          dateType="datetimerange"
          autoWidth="true"
          :start.sync="queryObj.orderDateStart"
          :end.sync="queryObj.orderDateEnd"
          :outformat="`YYYY-MM-DD HH:mm:ss`"
          :default-time="['00:00:00', '23:59:59']"
        ></ever-range-picker>
      </template>
      <template slot="vistType">
        <el-select
          v-model="queryObj.vistType"
          filterable
          :placeholder="'请选择医嘱类型'"
          :clearable="true"
        >
          <el-option v-for="item in typeArr" :key="item.id" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </template>
      <template slot="default">
        <el-button size="small" @click="list">查询</el-button>
      </template>
    </ever-form2>
    <div>
      <ever-table
        height="140"
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
const schema = [
  {
    name: 'vistType',
    label: '医嘱类型',
    comp: 'custom'
  },
  {
    name: 'orderDateStart',
    label: '日期',
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
    this.copyQuery = JSON.parse(JSON.stringify(queryObj))
    return {
      url: urlMap.quote.yizhu,
      typeArr: [],
      schema,
      queryObj,
      tableData: [],
      columns: [
        {
          prop: 'adviceOrderTime',
          label: '开始时间',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceTermName',
          label: '长/临',
          showOverflowTooltip: true
        },
        {
          prop: 'adviceTypeName',
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
          prop: 'doctorAdviceExecuteStatusName',
          label: '状态',
          showOverflowTooltip: true
        },
        {
          prop: 'doctorAdviceStopTime',
          label: '停止时间',
          showOverflowTooltip: true
        },
        {
          prop: 'adviceStopByName',
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
    quote () {
      if (this.quoteType === TEXT) {
        this.$bus.$emit('ref:append', this.textFormat(this.selected))
      } else if (this.quoteType === ALL) {
        this.$bus.$emit('ref:append', this.tableFormat(this.tableData))
      } else if (this.quoteType === TABLE) {
        this.$bus.$emit('ref:append', this.tableFormat(this.selected))
      }
    },
    textFormat (arr) {
      let str = ''
      if (arr && arr.length) {
        arr.map(item => {
          this.columns.map(columns => {
            str += `${columns.label}: ${this.isEmpty(item[columns.prop])} `
          })
        })
      }
      return str
    },
    tableFormat (arr) {
      if (!arr.length) return
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
    reset () {
      this.queryObj = JSON.parse(JSON.stringify(this.copyQuery))
    },
    async list () {
      if (!this.visitNum || !this.patientId) return
      // id 9M7i09eE5FYbZsIQEZQ visit IP20190000000266 有数据
      // this.queryObj.hospitalizedNumber = 'IP20190000000266'
      // this.queryObj.patientId = '9M7i09eE5FYbZsIQEZQ'
      const res = await request(this.url, this.queryObj)
      this.tableData = res.data ? res.data : []
    },
    select (val) {
      this.selected = val
    }
  },
  watch: {
    visitNum () {
      this.reset()
    },
    patientId () {
      this.reset()
    }
  }
}
</script>
<style scoped lang="scss">
.margin {
  margin-top: -15px;
}
</style>

