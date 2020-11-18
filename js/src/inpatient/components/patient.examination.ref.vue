<template>
  <div>
    <el-tree
      :data="treeData"
      :expand-on-click-node="false"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span :class="{cRed: data.status === 2}">{{node.label}}</span>
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
  function resetData (obj) {
    let result = [
      {
        name: '检查所见',
        value: obj.examineFinding.replace(/\\r\\n/g, '')
      },
      {
        name: '检查提示',
        value: obj.examineImpression.replace(/\\r\\n/g, '')
      }
    ]

    return result
}
  export default {
    props: ['patientId', 'type', 'visitId', 'dptId'],
    data () {
      return {
        treeData: []
      }
    },
    created () {
      this.getAllExamine()
    },
    methods: {
      checkDataChild (data) {
        if (!data) return false
        if (!data.children && !data.label) return false
        if (Array.isArray(data.children) && !data.children.length) return false
        return true
      },
      getAllExamine () {
        let params = {
          orgId: storage.getLocalStorage('CLINICID'),
          visitType: this.$route.matched && this.$route.matched[0] && this.$route.matched[0].meta.type, // 1 门诊 2 急诊 3 住院
          deptId: this.dptId,
          patientId: this.patientId,
          visitNumber: this.visitId
        }
        api.getAllExamine(params).then(result => {
          if (result === true || result === null) {
            this.treeData = []
            return
          }
          this.treeData = result.filter(item => { // 过滤出来第三方的数据展示出来，医技工作台的pdf不展示
            return item.examineResults && item.examineResults[0].reportSourceResult === '1'
          }).map(v => {
            let nodeData = {
              label: v.applicationDate ? v.doctorAdviceContent + ' ' + v.applicationDate : v.doctorAdviceContent
            }
            if (v.examineResults && v.examineResults.length) {
              nodeData.children = v.examineResults.map(item => {
                item.label = item.examineReportDate
                item.status = item.examineResultCode
                item.children = resetData(item).filter(v1 => {
                  return v1.value
                }).map(v2 => {
                  return {label: v2.name + ': ' + v2.value, val: v2.value}
                })
                return item
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
<style scoped>
.el-tree-node .custom-tree-node{
  white-space:normal;
}
.el-tree /deep/.el-tree-node__content{
  height:auto !important;
}
</style>
