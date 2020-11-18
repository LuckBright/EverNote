<template>
  <div class="jianyan page_layout_full_hidden">
    <el-row
      :gutter="10"
      class="page_layout_full_hidden">
      <el-col
        :span="6"
        class="auto">
        <ever-table
          ref="left"
          height="100%"
          :is-single-table="true"
          :columns="selectCol"
          :data="selectTable"
          border
          :row-style="styleFn"
          @current-change="handleCurrentChange"
          @select="select"></ever-table>
      </el-col>
      <el-col
        :span="18"
        class="auto">
        <!-- @select="select" -->
        <ever-table
          ref="table"
          height="100%"
          :columns="listCol"
          :data="listTable"
          border
          show-checkbox
          @selection-change="select"
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
      quoteType: String,
      curNode: Object
    },
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
            prop: 'inspectionQualityValue',
            label: '结果',
            showOverflowTooltip: true,
            formatter ({row}) {
              return row.inspectionQuantityValue + ' ' + row.inspectionQualityValue
            }
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
            prop: 'inspectionReportDate',
            label: '报告日期',
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
    async created () {
      await this.list()
    },
    methods: {
      styleFn () {
        return { cursor: 'pointer' }
      },
      setCurrent (row) {
        this.$refs.left.$refs.everTable.setCurrentRow(row)
      },
      handleCurrentChange (val) {
        if (val.resultReportSource === '2') return
        this.listTable = val.inspectionResultDetails
        if (!this.listTable && !this.listTable.length) return
        this.listTable.map((item, index) => {
          item.index = index
        })
      },
      quote () {
        if (this.quoteType === TEXT) {
          this.$bus.$emit('ref:append' + this.curNode.id, this.textFormat(this.selected))
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
            let label = ''
            this.listCol.map(columns => {
              if (columns.prop === 'inspectionQualityValue') {
                let hasVal = item.inspectionQualityValue || item.inspectionQuantityValue
                label += `${columns.label}: ${hasVal ? item.inspectionQuantityValue + ' ' + item.inspectionQualityValue : '--' } `
              } else {
                label += `${columns.label}: ${this.isEmpty(item[columns.prop])} `
              }
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
        this.listCol.map(item => {
          th += `<th>${item.label}</th>`
        })
        arr.map(item => {
          let children = ''
          this.listCol.map((columns, index) => {
            if (columns.prop === 'inspectionQualityValue') {
              let hasVal = item.inspectionQualityValue || item.inspectionQuantityValue
              children += `<td>${hasVal ? item.inspectionQuantityValue + ' ' + item.inspectionQualityValue : '--' }</td>`
            } else {
              children += `<td>${this.isEmpty(item[columns.prop])}</td>`
            }
          })
          td += `<tr>${children}</tr>`
        })
        return `<table><tr>${th}</tr>${td}</table>`
      },
      isEmpty (val) {
        return val || val != null ? val : '--'
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
          if (this.listTable && this.listTable.length) {
            this.listTable.map((item, index) => {
              item.index = index
            })
            this.setCurrent(this.selectTable[0])
          }
        }
      },
      select () {
        this.selected = this.$refs.table.multipleSelection
        this.selected = this.selected.sort((a, b) => a.index - b.index)
      }
    }
  }
</script>
<style scoped lang="scss">
  .page_layout_full_hidden {
    .el-col,
    .ever-table-wrap {
      height: 100%;
    }
    /deep/.ever-table {
      margin: 0;
    }
  }
  .mr {
    margin-right: 10px;
  }
</style>
