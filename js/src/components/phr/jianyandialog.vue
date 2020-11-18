<template>
  <el-dialog :visible.sync="visible" width="50%" :close-on-click-modal="false">
    <div v-show="pdf.length > 0">
      <p>请选择报告预览:</p>
      <el-select v-model="index" class="mr" @change="change">
        <el-option
          v-for="(item,index) in pdf"
          :key="index"
          :label="`报告${index + 1} ${item.relName ? item.relName : ''}`"
          :value="index"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="openWin" title="在预览报告页可打印">预览报告</el-button>
    </div>
    <p>详细信息:</p>
    <div id="print-content">
      <ever-table :columns="columns" :data="data"></ever-table>
    </div>
    <div>
      <p>医生解读:</p>
      <p class="color">{{formatContent(review)}}</p>
    </div>
    <iframe class="iframe" :key="iframeId" id="iframe"></iframe>
  </el-dialog>
</template>

<script>
import phrapi from '@/workspace/store/component'
import { isJsonString } from '@/util/common'

export default {
  props: {
    id: String,
    review: String
  },
  watch: {
    id (val) {
      if (!val) return
      this.init(val)
    },
    visible (val) {
      if (!val) {
        this.index = 0
        this.data = []
        this.report = {}
        this.url = ''
        this.$emit('update:id', '')
      }
    }
  },
  data () {
    return {
      iframeId: 0,
      data: [],
      report: {},
      pdf: [],
      index: 0,
      columns: [
        {
          prop: 'inspectionReportItemName',
          label: '项目名称'
        },
        {
          prop: 'inspectionQualityValue',
          label: '测试结果',
          formatter ({ row }) {
            return row.inspectionQualityValue
              ? row.inspectionQualityValue
              : row.inspectionQuantityValue
              ? row.inspectionQuantityValue
              : ''
          }
        },
        {
          prop: 'inspectionQuantityUnit',
          label: '单位'
        },
        {
          prop: 'inspectionResultStatus',
          label: '异常情况',
          formatter ({ value }) {
            if (value === '') {
              return '正常'
            }
            const obj = { H: '↑', L: '↓' }
            return obj[value]
          },
          customCellSpanClassFormatter ({ value }) {
            if (value === '') {
              return ''
            }
            const obj = { H: 'demo-female', L: 'diff-after' }
            return obj[value]
          }
        },
        {
          prop: 'refValue',
          label: '参考值'
        }
      ],
      visible: false
    }
  },
  methods: {
    change (index) {
      this.url = this.pdf[index].url
    },
    async init (id) {
      const pdf = await phrapi.getPdfByInspectionId({ inspectionId: id })
      this.pdf =
        Array.isArray(pdf.data) && pdf.data.length && pdf.data[0] != null
          ? pdf.data[0].pdfReportUrl && isJsonString(pdf.data[0].pdfReportUrl)
            ? JSON.parse(pdf.data[0].pdfReportUrl)
            : Array.isArray(pdf.data[0].pdfReportUrl)
            ? pdf.data[0].pdfReportUrl
            : []
          : []
      this.url = this.pdf.length ? this.pdf[0].url : ''
      const res = await phrapi.getByInspectionId({ inspectionId: id })
      this.visible = true
      this.data = Array.isArray(res.data) ? res.data : []
      this.report = this.data[0] ? this.data[0] : {}
    },
    formatContent (res) {
      if (res) {
        return res
      } else {
        return '暂无'
      }
    },
    openWin (type) {
      window.open(this.$ever.fileUrl + this.url)
    },
    print () {
      this.$nextTick(() => {
        const links = Array.from(document.getElementsByTagName('link'))
        const printContent = document.getElementById('print-content')
        const iframe = document.getElementById('iframe')
        const doc = iframe.contentWindow.document
        links.map(item => {
          const href = item.getAttribute('href')
          doc.write(`<link type='text/css' rel="stylesheet" href="${href}" />`)
        })
        doc.write(
          `<style type='text/css'>.el-table th {text-align: left}</style>`
        )
        doc.write('<div>' + printContent.innerHTML + '</div>')
        iframe.contentWindow.focus()
        iframe.contentWindow.print()
        this.iframeId++
      })
    }
  },
  components: {}
}
</script>
<style scoped lang="scss">
.mr {
  margin-right: 10px;
  width: 200px;
}
.color {
  font-size: 14px;
  color: #666666;
}
.box {
  padding: 0px 10px;
}
.iframe {
  position: absolute;
  width: 0px;
  height: 0px;
  left: -500px;
  top: -500px;
}
/deep/ .el-table__row {
  .red {
    color: rgb(7, 3, 3);
  }
  .green {
    color: green;
  }
}
</style>
