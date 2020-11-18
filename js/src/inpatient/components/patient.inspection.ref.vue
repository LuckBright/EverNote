<template>
  <div class="advice_result_wrap">
    <el-tree :data="treeData">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label}}</span>
        <span class='level down' v-if='data.status && (data.status ==="L" || data.status ==="LL")'>↓</span>
        <span class='level up' v-if='data.status && (data.status ==="H" || data.status ==="HH")'>↑</span>
        <span>
          <el-button
            v-if="$route.meta.handleType !== 1 && checkDataChild(data)"
            type="text"
            size="mini"
            @click="() => quote(data)">
            引用
          </el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>
<script>
  import api from '@/inpatient/store/phr'
  import storage from '@/util/storage'
  // import Vue from 'vue'
  export default {
    props: ['patientId', 'type', 'visitId', 'dptId'],
    data () {
      return {
        treeData: []
      }
    },
    created () {
      this.getAllInspection()
    },
    methods: {
      checkDataChild (data) {
        if (!data) return false
        if (!data.children && !data.label) return false
        if (Array.isArray(data.children) && !data.children.length) return false
        return true
      },
      getAllInspection () {
        let params = {
          tenantId: storage.getLocalStorage('TENANTID'),
          orgId: storage.getLocalStorage('CLINICID'),
          tenantSubjectId: this.dptId,
          patientId: this.patientId,
          doctorAdviceStatusCode: '60',
          outpatientSerialNumber: this.visitId
        }
        api.getAllInspection(params).then(result => {
          if (result === true || result === null) return false
  
          this.treeData = result.filter(item => {
            // 1 是报告 2是pdf
            return Number(item.resultReportSource) === 1
          }).map(v => {
            let nodeData = {
              label: v.inspectionServiceName + ' ' + v.applicationDate
            }
            if (v.inspectionResultDetails && v.inspectionResultDetails.length) {
              nodeData.children = v.inspectionResultDetails.filter(v2 => {
                return v2.inspectionReportItemName !== null && (v2.inspectionQuantityValue !== null || v2.inspectionQualityValue !== null)
              }).map(v1 => {
                return {label: v1.inspectionReportItemName + ': ' + v1.inspectionQuantityValue + v1.inspectionQualityValue + ' ' + v1.inspectionQuantityUnit, val: v1.inspectionQuantityValue, status: v1.inspectionResultStatus}
              })
            }
            return nodeData
          })
        })
      },
      quote (data) {
        if (data.children && data.children.length) {
          this.$bus.$emit('ref:append', '<p>' + data.children.map(v => v.label).filter(v => v).join('</p><p>') + '</p>')
        } else {
          this.$bus.$emit('ref:append', '<p>' + data.label + '</p>')
        }
        // if (data.children) {
        //   this.$bus.$emit('ref:append', data.children.map(v => v.label).filter(v => v).join(' '))
        // } else {
        //   this.$bus.$emit('ref:append', data.label)
        // }
      }
    }
  }
</script>
<style lang="scss" scoped>
.custom-tree-node {
  white-space: initial;
}
.el-tree /deep/ .el-tree-node__content {
  height: initial;
  .level{
    position: relative;
    top: -2px;
    font-size:14px;
  }
  .down{
    color:green
  }
  .up{
    color:#EE4433
  }
}
</style>

