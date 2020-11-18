<template>
  <div class="jiancha page_layout_full_hidden">
    <el-row :gutter="10"
            class="page_layout_full_hidden">
      <el-col :span="6">
        <ever-table height="100%"
                    ref="left"
                    @current-change="handleCurrentChange"
                    :is-single-table="true"
                    :columns="selectCol"
                    :data="selectTable"
                    border
                    @select="select"
                    :row-style="styleFn"></ever-table>
      </el-col>
      <el-col :span="18">
        <ever-table show-expand
                    default-expand-all
                    height="100%"
                    ref="table"
                    :columns="listCol"
                    :data="listTable"
                    @expand-change="expandChange"
                    border>
          <template slot="expand"
                    slot-scope="props">
            <el-form label-position="left" class="examineContent">
              <el-form-item label="检查所见：" labelWidth="80px">
                <span style="line-height: 32px">{{ isEmpty(props.row.examineFinding) }}</span>
              </el-form-item>
              <el-form-item label="检查结论：" labelWidth="80px">
                <span>{{ isEmpty(props.row.examineImpression) }}</span>
              </el-form-item>
              <el-form-item label="检查日期：" labelWidth="80px">
                <span>{{ isEmpty(props.row.examineReportDate) }}</span>
              </el-form-item>
              <el-form-item label="检查人：" labelWidth="80px">
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
    quoteType: String,
    curNode: Object
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
          prop: 'examineReportDate',
          label: '报告日期',
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
      selectStr: '',
      selectCol: [
        {
          prop: 'examineReportDate',
          label: '报告日期',
          showOverflowTooltip: true,
          formatter ({ value, row }) {
            if (!value) {
              return row.examineResults[0].examineReportDate || ''
            } else {
              return value
            }
          }
        },
        {
          prop: 'doctorAdviceContent',
          label: '检查项目',
          showOverflowTooltip: true
        }
      ]
    }
  },
  methods: {
    styleFn () {
      return { cursor: 'pointer' }
    },
    setCurrent (row) {
      this.$refs.left.$refs.everTable.setCurrentRow(row)
    },
    handleCurrentChange (val) {
      this.listTable = val.examineResults
      this.listenSelect()
    },
    listenSelect () {
      this.$nextTick(() => {
        let ele = document.querySelectorAll('.examineContent')
        if (ele && ele.length) {
          ele.forEach(e => {
            e.addEventListener('mouseup', () => {
              let str = window.getSelection ? window.getSelection() : document.selection.createRange().text
              this.selectStr = str.toString()
            })
          })
        }
      })
    },
    expandChange ({row, expend}) {
      if (expend && expend.length) {
        this.listenSelect()
      }
    },
    quote () {
      if (this.quoteType === TEXT) {
        if (!this.selectStr) return
        this.$bus.$emit('ref:append' + this.curNode.id, this.textselect(this.selected))
        this.selectStr = ''
      } else if (this.quoteType === ALL) {
        this.$bus.$emit('ref:append' + this.curNode.id, this.tableFormat(this.listTable))
      } else if (this.quoteType === TABLE) {
        this.$bus.$emit('ref:append' + this.curNode.id, this.tableFormat(this.selected))
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
    textselect () {
      return `<p>${this.selectStr}</p>`
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
        hospitalizedNumber: this.visitNum,
        patientId: this.patientId,
        visitType: '3' // 住院类型
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
  .page_layout_full_hidden {
    .el-col, .ever-table-wrap {
      height: 100%;
    }
    /deep/.ever-table {
      margin: 0;
    }
  }
}
.mr {
  margin-right: 10px;
}
</style>

