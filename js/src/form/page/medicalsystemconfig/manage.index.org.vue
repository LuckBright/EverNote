<template>
  <div class="container">
    <div class="stable">
      <m-tree @treeclick="treeClick"></m-tree>
    </div>
    <div class="change">
      <m-table :type="type" :org="true"></m-table>
    </div>
  </div>
</template>

<script>
  import mTree from '@/form/page/medicalsystemconfig/tree.index'
  import mTable from '@/form/page/medicalsystemconfig/table.index'

  export default {
    components: {
      mTree,
      mTable
    },
    data () {
      return {
        type: 'medicalIndex'
      }
    },
    methods: {
      treeClick (node) {
        this.type = node.key
      }
    }
  }
</script>

<style scoped lang="scss">
  .container {
    display: flex;
    flex-flow: row;
    background-color: #ffffff;
  }
  .stable {
    width: 200px;
    padding: 10px 0px 10px 10px;
    border-right:1px solid #ccc;
    background: #f9f9f9;
  }
  .change {
    flex: 1;
    padding: 10px;
    flex-flow: column;
    height: 100%;
    overflow:  hidden;
  }
</style>
