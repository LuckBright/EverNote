<template>
  <div>
    <el-tree :data="data">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label}}</span>
        <span>
          <el-button
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

  // import Vue from 'vue'
  export default {
    props: ['visitId', 'type'],
    data () {
      return {
        data: []
      }
    },
    created () {
      api.getByExec({
        'visitSn': this.visitId, // '18X61fp20181002003801', // this.visitId, // '1JzZUZs20181018203726',
        'patientId': this.$route.query.patientId, // 'C542m8kbZW0Rc8X61fp ', // this.$route.query.patientId, // 'xTia13LiJO4oSJzZUZs',
        'adviceType': this.type // 800检查 801检验
      }).then(result => {
        if (!result) return false
        this.data = result.filter(v => {
          return v.executeResult
        }).map(v => {
          if (!v.executeResult.resultItem) {
            return {
              label: v.adviceName,
              children: null
            }
          } else {
            return {
              label: v.adviceName,
              children: v.executeResult.resultItem.filter(v2 => {
                return v2.inspectUnitName != null && v2.qualityValue != null
              }).map(v1 => {
                return {label: v1.inspectUnitName + ': ' + v1.quantityValue + v1.unit, val: v1.quantityValue}
              })
            }
          }
        })
      })
    },
    methods: {
      quote (data) {
        if (data.children) {
          this.$bus.$emit('ref:append', data.children.map(v => v.label).filter(v => v).join(' '))
        } else {
          this.$bus.$emit('ref:append', data.label)
        }
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
  }
</style>
