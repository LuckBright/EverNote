<template>
  <div class="container">
      <div class="stable">
        <m-tree @treeclick="treeClick"></m-tree>
      </div>
      <div class="change">
        <m-table :type="type"></m-table>
      </div>
  </div>
</template>

<script>
import mTree from '@/form/page/anamnesistype/treeindex'
import mTable from '@/form/page/anamnesistype/tableindex'
import {commandLog} from '@/phr/mixin/operationLog.js'
export default {
  props: {},
  data () {
    return {
      type: 'bingli'
    }
  },
  computed: {},
  created () {
    commandLog({
      content: '登录病历字典管理',
      opModuleOne: '病历管理-病历字典管理',
      opType: 'LOGIN'
    })
  },
  mounted () {},
  watch: {},
  methods: {
    treeClick (node) {
      this.type = node.key
    }
  },
  components: {
    mTree,
    mTable
  }
}
</script>
<style scoped lang="scss">
.container {
  display: flex;
  flex-flow: row;
  background-color: #ffffff;
  height:100%;
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
