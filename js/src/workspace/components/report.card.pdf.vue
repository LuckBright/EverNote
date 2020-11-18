<template>
  <div>
    <el-row class="report_card_pdf">
      <el-col v-for='item in list' :key='item.fileId' :span='24' class="fliespan">
        <span @click='click(item.fileId)'>{{item.name}}</span>
      </el-col>
      <el-button v-if='report.formDataId' @click='ereport(report.formDataId,report.formTemplateId)'>报告预览</el-button>
    </el-row>
    <reporte ref='reporte'></reporte>
  </div>
</template>
<script>
// import {isJsonStr} from '@/util/common'
import reporte from '@/workspace/components/report.e.vue'
export default {
  data () {
    return {
      item: {},
      li: {},
      list: [],
      report: {}
    }
  },
  created () {

  },
  components: {
    reporte
  },
  methods: {
    ereport (formDataId, formTemplateId) {
      this.$refs.reporte.open(formDataId, formTemplateId)
    },
    click (url) {
      window.open(this.$ever.fileUrl2 + url)
    },
    open (item, li) {
      this.item = item
      this.li = li
      this.report = li.executeResult || {}
      if (this.li.fileLists) {
        this.list = []
        this.li.fileLists.forEach(element => {
          this.list.push({
            name: element.relName,
            url: element.url,
            fileId: element.fileId
          })
        })
      } else {
        this.list = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.report_card_pdf {
  cursor: pointer;
  color: #1C7BEF;
  .fliespan{
    float: left;
    border-radius: 2px;
    background: #F2F2F2;
    padding: 5px 15px;
    margin-bottom: 10px;
  }
}
</style>

