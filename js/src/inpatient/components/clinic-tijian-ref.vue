<template>
  <div>
    <el-tree :data="data">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
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
  import phrapi from '@/form/store/phrapi'
  // import pinyin from 'pinyin'
  import { convertCharToPinyin } from '@/components/pinyin.js'
  import {blood1, blood2} from '@/emr/config/temperaturedata.js'
  export default {
    props: ['visitId', 'dptId', 'clinic'],
    data () {
      return {
        data: []
      }
    },
    created () {
      console.log()
      this.getClinicTijian()
    },
    methods: {
      getClinicTijian () {
        phrapi.getClinic(this.visitId, this.$route.query.dptId).then(result => {
          if (!result) return false
          this.data = result.map(v => {
            if (!v.result) {
              return {
                label: v.name,
                children: null
              }
            } else {
              return {
                label: v.name,
                children: v.result.map(v1 => {
                  let pinyinObj = convertCharToPinyin(v1.label)
                  if (pinyinObj.quanpin.indexOf('xueya(mmHg)') !== -1) {
                    return {label: v1.label + ': ' + v1.value[blood1] + '/' + v1.value[blood2], val: v1.value[blood1] + '/' + v1.value[blood2]}
                  } else {
                    return {label: v1.label + ': ' + (v1.value || '--'), val: v1.value}
                  }
                })
              }
            }
          })
        })
      },
      quote (data) {
        // if (data.children) {
        //   this.$bus.$emit('ref:append', '<p>' + data.children.map(v => v.label).join('</p><p>') + '</p>')
        // } else {
        //   this.$bus.$emit('ref:append', '<p>' + data.label + '</p>')
        // }
        if (data.children) {
          this.$bus.$emit('ref:append', data.children.filter(v => v.val).map(v => (v.label)).join(' '))
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
