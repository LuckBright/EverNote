<template>
  <el-tree ref="" :data="data" :props="defaultProps" @node-click="handleNodeClick" :accordion="true">
    <div :class="{'custom-tree-node': true, 'tree-checked': data.medicalRecordContentId === nowCheckNode || data.docName === nowCheckNode}" slot-scope="{ node, data }">
      {{data.emedicalRecordCategoryName || data.docName}}
    </div>
  </el-tree>
</template>
<script>
  import {request} from '@/util/req'
  export default {
    props: ['shoushu'],
    data () {
      return {
        nowCheckNode: '',
        defaultProps: {
          children: 'nodes',
          label: 'label'
        },
        data: []
      }
    },
    created () {
      if (this.shoushu) {
        this.initShoushu()
      } else {
        this.initBingli()
      }
    },
    methods: {
      initShoushu () {
        if (!this.$route.query.visitSerialNumber) {
          return
        }
        request('thc-phr/cpoe/phrOperationInfo/getOperationInfoBySerialNumber', {
          'visitSerialNumber': this.$route.query.visitSerialNumber,
          'visitSerialTypeCode': this.$route.query.visitSerialTypeCode,
          'patientId': this.$route.query.patientId
        }).then(result => {
          let shoushuMap = {
            'safetyCheck': '安全检查',
            'materialsCheck': '手术用物使用清点',
            'operationNote': '手术记录',
            'risk_assessment': '手术风险评估'
          }
          this.data = result.data.map(v => {
            let nodes = []
            Object.keys(shoushuMap).forEach(shoushu => {
              if (v[shoushu]) {
                nodes.push({
                  docName: shoushuMap[shoushu],
                  content: v[shoushu]
                })
              }
            })
            return {
              docName: v.surgeryApplySubjectName,
              nodes: nodes
            }
          })
        })
      },
      initBingli () {
        let params = {}
        params.visitSerialNumber = this.$route.query.visitSerialNumber
        params.patientId = this.$route.query.patientId
        params.visitSerialTypeCode = this.$route.query.visitSerialTypeCode
        if (params.visitSerialTypeCode === '3') {
          let rootNode = [{docName: '住院', nodes: []}]
          let bingli = request('thc-phr/cpoe/phrMedicalRecordCategory/getMedicalTree', Object.assign({}, params, {medicalRecordCategory: 1}))
          let huli = request('thc-phr/cpoe/phrMedicalRecordCategory/getMedicalTree', Object.assign({}, params, {medicalRecordCategory: 3}))
          Promise.all([bingli, huli]).then(([bingliresult, huliresult]) => {
            if (bingliresult.data.length) {
              rootNode[0].nodes.push({
                docName: '病历书写',
                nodes: bingliresult.data
              })
            }
            if (huliresult.data.length) {
              rootNode[0].nodes.push({
                docName: '护理文书',
                nodes: huliresult.data
              })
            }
            if (rootNode[0].nodes.length) {
              this.data = rootNode
            }
          })
        } else {
          request('thc-phr/cpoe/phrMedicalRecordCategory/getMedicalTree', params)
            .then(result => {
              if (result.data && result.data.length) {
                let rootNode = [{docName: '门诊'}]
                rootNode[0].nodes = result.data
                this.data = rootNode
              }
            })
        }
      },
      initZhuYuan () {

      },
      handleNodeClick (data, node) {
        if (data.medicalRecordContentId) {
          this.nowCheckNode = data.medicalRecordContentId || data.docName
          this.$emit('nodeclick', {
            dataId: data.medicalRecordContentId,
            designerId: data.fileDesignerId,
            code: data.docCategoryCode,
            templateId: data.medicalRecordTemplateId,
            name: data.docName,
            item: data
          }, node)
        } else if (data.content) {
          this.$emit('nodeclick', {
            content: data.content,
            name: data.docName,
          }, node)
        } else if (data.docCategoryCode === 'ZHU_YUAN_BING_AN_SHOU_YE') {
          this.$emit('nodeclick', {
            dataId: data.md5,
            designerId: data.fileDesignerId,
            code: data.docCategoryCode,
            templateId: data.medicalRecordTemplateId,
            name: data.docName,
            item: data
          }, node)
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
</style>
