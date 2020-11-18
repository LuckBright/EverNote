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
            label: '病历类型',
            key: 'bingli',
            icon: 'icon-bingli-leixing'
          },
          {
            label: '基本信息',
            key: 'info',
            icon: 'icon-jibenxin-xi'
          },
          {
            label: '诊断信息',
            key: 'diagnosis',
            icon: 'icon-zhenduanxinxi'
          },
          {
            label: '段落信息',
            key: 'paragraph',
            icon: 'icon-duanluoxinxi'
          },
          {
            label: '体征信息',
            key: 'sign',
            icon: 'icon-tizhengxinxi'
          },
          {
            label: '眼科信息',
            key: 'eye',
            icon: 'icon-yankexinxi'
          },
          {
            label: '评估信息',
            key: 'assess',
            icon: 'icon-pingguxinxi'
          },
          {
            label: '手术信息',
            key: 'operation',
            icon: 'icon-shoushuxinxi'
          },
          {
            label: '其他信息',
            key: 'other',
            icon: 'icon-jiankangdangan'
          }
        ],
        defaultProps: {
          children: 'nodes',
          label: 'label'
        }
      }
    },
    mounted () {
      this.$refs.tree.setCurrentKey('bingli')
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
