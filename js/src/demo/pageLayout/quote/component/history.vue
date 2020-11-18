<template>
  <div class="history">
    <el-row :gutter="10">
      <el-col :span="6">
        <ever-form2 :schema="schema" v-model="queryObj" :inline="true" :nosubmit="true">
          <template slot="vistType">
            <el-select v-model="queryObj.recordId" filterable placeholder="请选择" :clearable="true">
              <el-option
                v-for="item in record"
                :key="item.id"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </template>
        </ever-form2>
        <el-table
          height="140"
          class="margin"
          ref="singleTable"
          :data="tableData"
          highlight-current-row
          @current-change="handleCurrentChange"
          style="width: 100%"
        >
          <el-table-column property="date" label></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="18"></el-col>
    </el-row>
  </div>
</template>
<script>
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
import medicalIndex from '@/components/medicalindex/index'

const schema = [
  {
    name: 'vistType',
    label: '住院记录',
    comp: 'custom'
  }
]
const TEXT = '1'
export default {
  props: {
    patientId: String,
    visitNum: String,
    quoteType: String
  },
  created () {
    this.list()
  },
  components: {
    medicalIndex
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.orderDateStart = ''
    queryObj.orderDateEnd = ''
    this.copyQuery = JSON.parse(JSON.stringify(queryObj))
    return {
      record: [],
      recordId: '',
      url: urlMap.quote.history,
      schema,
      queryObj,
      tableData: [],
      columns: [
        {
          prop: 'adviceOrderDatetime',
          label: '病案号',
          showOverflowTooltip: true
        },
        {
          prop: 'adviceTermTypeName',
          label: '入院时间',
          showOverflowTooltip: true
        },
        {
          prop: 'adviceTypeName',
          label: '入院科室',
          showOverflowTooltip: true
        }
      ]
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.currentRow = val
    },
    quote () {
      if (this.quoteType === TEXT) {
        this.$bus.$emit('ref:append', this.textFormat())
      }
    },
    textFormat () {
      let str = ''
      if (this.selected && this.select.length) {
        this.selected.map(item => {
          this.columns.map(columns => {
            str += `${columns.label}: ${this.isEmpty(item[columns.prop])} `
          })
        })
      }
      return str
    },
    isEmpty (val) {
      return val && val !== null ? val : '--'
    },
    reset () {
      this.queryObj = JSON.parse(JSON.stringify(this.copyQuery))
    },
    async list () {
      const res = await request(this.url.all, { patientId: this.patientId, visitStatus: 9 })
      if (Array.isArray(res.data)) {
        this.record = res.data
      }
    },
    select (val) {
      this.selected = val
    }
  },
  watch: {
    queryObj: {
      handler () {
        this.list()
      },
      deep: true
    },
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
  margin-top: -5px;
}
</style>

