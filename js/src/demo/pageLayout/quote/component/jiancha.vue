<template>
  <div class="jiancha">
    <el-row :gutter="10">
      <el-col :span="6">
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
      <el-col :span="18">
        <ever-table
          show-expand
          height="170"
          ref="table"
          :columns="listCol"
          :data="listTable"
          border
        >
          <template slot="expand" slot-scope="props">
            <el-form label-position="left">
              <el-form-item label="检查所见">
                <span style="line-height: 32px">{{ isEmpty(props.row.examineFinding) }}</span>
              </el-form-item>
              <el-form-item label="检查结论">
                <span>{{ isEmpty(props.row.examineImpression) }}</span>
              </el-form-item>
              <el-form-item label="检查日期">
                <span>{{ isEmpty(props.row.examineExecuteDatetime) }}</span>
              </el-form-item>
              <el-form-item label="检查人">
                <span>{{ isEmpty(props.row.reportDoctorSignature) }}</span>
              </el-form-item>
            </el-form>
          </template>
        </ever-table>
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
      url: urlMap.quote.jiancha,
      typeArr: [],
      listTable: [],
      listCol: [
        {
          prop: 'examineExecuteDatetime',
          label: '检查日期',
          showOverflowTooltip: true,
          width: 180
        },
        {
          prop: 'reportDoctorSignature',
          label: '检查人',
          showOverflowTooltip: true
        }
      ],
      selected: [],
      selectTable: [],
      selectCol: [
        {
          prop: 'applicationDate',
          label: '日期',
          showOverflowTooltip: true
        },
        {
          prop: 'classifyName',
          label: '检查项目',
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
      this.listTable = val.examineResults
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
      return val || val !== null ? val + '' : '--'
    },
    async list () {
      if (!this.visitNum || !this.patientId) return
      const query = {
        visitNumber: this.visitNum,
        patientId: this.patientId,
        visitType: '1'
      }
      const res = await request(this.url, query)
      this.selectTable = res.data ? res.data : []
      if (this.selectTable.length) {
        this.listTable = this.selectTable[0].examineResults
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
.jiancha {
  /deep/ .el-form-item__content {
    line-height: 32px;
  }
}
.mr {
  margin-right: 10px;
}
</style>

