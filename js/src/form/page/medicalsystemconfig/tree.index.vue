<template>
  <div class="bg">
    <el-tree
      ref="tree"
      :highlight-current="true"
      :data="data"
      :props="defaultProps"
      node-key="key"
      @node-click="handleNodeClick">
      <span slot-scope="{ node, data }">
        <i :class="['iconfont', data.icon]"></i>
        <span class="label-font">{{ data.label }}</span>
      </span>
    </el-tree>
  </div>
</template>

<script>
  export default {
    props: {},
    data () {
      return {
        data: [
          {
            label: '病案首页配置',
            key: 'medicalIndex',
            icon: 'icon-binganshouyepeizhi'
          },
          {
            label: '体温单配置',
            key: 'temperatureList',
            icon: 'icon-tiwendanpeizhi'
          },
          {
            label: '时限质控配置',
            key: 'timeControl',
            icon: 'icon-shixianzhikongpeizhi'
          },
          {
            label: '自动归档配置',
            key: 'autoArchive',
            icon: 'icon-zidongguidang'
          },
          {
            label: '护理记录单配置',
            key: 'nursingRecord',
            icon: 'icon-huliwenshu1'
          },
          {
            label: '病历书写配置',
            key: 'medicalWrite',
            icon: 'icon-binglitianxie'
          },
          {
            label: '病历召回配置',
            key: 'medicalRecall',
            icon: 'icon-binglizhaohui'
          }
        ],
        defaultProps: {
          children: 'nodes',
          label: 'label'
        }
      }
    },
    mounted () {
      this.$refs.tree.setCurrentKey('medicalIndex')
    },
    methods: {
      handleNodeClick (data) {
        this.$emit('treeclick', data)
      }
    }
  }
</script>

<style scoped lang="scss">
  .bg {
    background: #f9f9f9;
  }
  .el-tree {
    background: #f9f9f9;
    /deep/ .el-tree-node {
      .iconfont {
        color: #666;
      }
      .label-font {
        font-size: 14px;
        padding-left: 2px;
      }
      &:hover {
        .label-font, .iconfont {
          color: #1c7bef;
        }
      }
    }
    /deep/ .is-current {
      color: #1c7bef;
      .iconfont {
        color: #1c7bef;
      }
    }
  }
</style>
