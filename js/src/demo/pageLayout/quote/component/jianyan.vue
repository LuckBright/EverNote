<template>
  <div class="jianyan">
    <el-row :gutter="10">
      <el-col :span="6" class="auto">
        <ever-table
          height="170"
          ref="left"
          @current-change="handleCurrentChange"
          :is-single-table="true"
          :columns="selectCol"
          :data="selectTable"
          border
          @select="select"
        ></ever-table>
      </el-col>
      <el-col :span="18" class="auto">
        <ever-table
          ref="table"
          height="170"
          :columns="listCol"
          :data="listTable"
          border
          show-checkbox
          @select="select"
        ></ever-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
const TEXT = '1'
const TABLE = '2'
const ALL = '3'
export default {
  props: {
    patientId: String,
    visitNum: String,
    quoteType: String
  },
  async created () {
    this.list()
  },
  components: {},
  data () {
    return {
      url: urlMap.quote.jianyan,
      typeArr: [],
      listTable: [],
      listCol: [
        {
          prop: 'inspectionReportItemName',
          label: '项目名称',
          showOverflowTooltip: true
        },
        {
          prop: 'inspectionQuantityValue',
          label: '结果',
          showOverflowTooltip: true
        },
        {
          prop: 'refValue',
          label: '参考值',
          showOverflowTooltip: true
        },
        {
          prop: 'inspectionQuantityUnit',
          label: '单位',
          showOverflowTooltip: true
        }
      ],
      selected: [],
      selectTable: [],
      selectCol: [
        {
          prop: 'inspectionExecuteDate',
          label: '日期',
          showOverflowTooltip: true
        },
        {
          prop: 'inspectionServiceName',
          label: '检验项目',
          showOverflowTooltip: true
        }
      ]
    }
  },
  methods: {
    setCurrent (row) {
      this.$refs.left.$refs.everTable.setCurrentRow(row)
    },
    handleCurrentChange (val) {
      this.listTable = val.list
    },
    quote () {
      if (this.quoteType === TEXT) {
        this.$bus.$emit('ref:append', this.textFormat(this.selected))
      } else if (this.quoteType === ALL) {
        this.$bus.$emit('ref:append', this.tableFormat(this.listTable))
      } else if (this.quoteType === TABLE) {
        this.$bus.$emit('ref:append', this.tableFormat(this.selected))
      }
    },
    textFormat (arr) {
      let str = ''
      if (arr && arr.length) {
        arr.map(item => {
          this.listCol.map(columns => {
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
      this.listCol.map(item => {
        th += `<th>${item.label}</th>`
      })
      arr.map(item => {
        let children = ''
        this.listCol.map((columns, index) => {
          children += `<td>${this.isEmpty(item[columns.prop])}</td>`
        })
        td += `<tr>${children}</tr>`
      })
      return `<table><tr>${th}</tr>${td}</table>`
    },
    isEmpty (val) {
      return val ? val + '' : '--'
    },
    async list () {
      if (!this.visitNum || !this.patientId) return
      const query = {
        hospitalizedNumber: this.visitNum,
        patientId: this.patientId,
        doctorAdviceStatusCode: '60'
      }
      const res = await request(this.url, query)
      this.selectTable = res.data ? res.data : []

      if (this.selectTable.length) {
        this.listTable = this.selectTable[0].list
      }
      if (this.listTable.length) {
        this.setCurrent(this.selectTable[0])
      }
    },
    select (val) {
      this.selected = val
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss">
.mr {
  margin-right: 10px;
}
</style>

