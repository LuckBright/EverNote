<template>
  <div class="right-tree-container">
    <div class="right-tree-box">
      <el-tree :default-expand-all="true" ref="" node-key="id" :data="treedata" :props="defaultProps" @node-click="handleNodeClick">
        <div v-if="treedata.length > 0" :class="{'custom-tree-node': true, 'tree-checked': data.id === nowCheckNode}" slot-scope="{ node, data }">
          {{data.label}}
        </div>
      </el-tree>
    </div>
    <div class="tree-detail">
      <div class="tree-detail-inner">
        <template v-if="nowPdfUrl">
          <template v-for="(item, index) in JSON.parse(nowPdfUrl)">
            <pdfShow :url="$ever.host + '/api/thc-platform-core/unify/download/' + item.fileId"></pdfShow>
          </template>
        </template>
        <div class="no-pdf" v-if="!nowPdfUrl">
          暂无该治疗记录的相关PDF
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pdfShow from '@/phr/component/pdf-show'
import {request} from '@/util/req'
import urls from '@/phr/api/urls'
export default {
  components: {
    pdfShow
  },
  data () {
    return {
      noPdf: false,
      nowPdfUrl: null,
      showPdf: true,
      nowCheckNode: '',
      treedata: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created () {
    this.getTree()
  },
  methods: {
    getTree () {
      request(urls.treatmentList, {
        visitSerialTypeCode: this.$route.query.visitSerialTypeCode,
        visitSerialNumber: this.$route.query.visitSerialNumber,
        patientId: this.$route.query.patientId,
        outpatientSerialNumber: this.$route.query.outpatientSerialNumber,
        hospitalizedNumber: this.$route.query.hospitalizedNumber,
      }).then((res) => {
        console.log(res)
        if (res.head.errCode === 0) {
          let resdata = res.data.resultList || res.data
          let templateTree = []

          resdata.forEach((item, index) => {
            let tempparent = {
              label: item.operationName,
              id: item.patientTreatmentId,
              children: []
            }
            item.results.forEach((ritem, rindex) => {
              tempparent.children.push({
                pdfUrl: ritem.pdfUrl,
                id: item.patientTreatmentId + ritem.name,
                label: ritem.name,
              })
            })
            templateTree.push(tempparent)
          })
          this.treedata = templateTree
          if (templateTree[0] && templateTree[0].children.length > 0) {
            this.handleNodeClick(templateTree[0].children[0], {isLeaf: true})
          }
        }
      })
    },
    handleNodeClick (data, node) {
      if (node.isLeaf) {
        this.nowCheckNode = data.id
        this.nowPdfUrl = data.pdfUrl
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .tree-detail{
    padding: 36px 26px 0 36px;
    height: 100%;
    flex: 1;
    box-sizing: border-box;
    overflow: auto;
    .tree-detail-inner{
      min-width: 836px;
      max-width: 1400px;
      background: #fff;
      min-height: 100%;
      margin: 0 auto;
    }
  }
  .no-pdf{
    padding: 30px;
    text-align: center;
    color: #999;

  }
</style>
