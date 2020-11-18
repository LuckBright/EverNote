<template>
  <div>
    <ever-table
      ref="tableRef"
      :columns="columns"
      :data="tableData"
      :show-checkbox="true"
      :border="true"
      row-key="id"
      :el-table-attr="tableProps"
      @eventChange="eventChange"
      :is-record-url-params="false"
    >
    </ever-table>
    <el-button @click="testSelected">打印选中的数据</el-button>
    <el-button @click="testToggle">toggle第1条数据</el-button>
  </div>
</template>

<script>

export default {
  data: function () {
    return {
      tableProps: {
        treeProps: { children: 'children', hasChildren: 'hasChildren' },
        defaultExpandAll: true,
      },
      columns: [
        {
          prop: 'id',
          label: '编号',
        },
        {
          prop: 'name',
          label: '姓名',
        },
        {
          prop: 'date',
          label: '日期',
        },
        {
          prop: 'address',
          label: '地址',
        },
      ],
      tableData: [{
        id: 1,
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        id: 2,
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄',
      }, {
        id: 3,
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄',
        children: [{
          id: 31,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
        }, {
          id: 32,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
        }],
      }, {
        id: 4,
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄',
      }],
    }
  },
  methods: {
    eventChange ({ prop, row, col }) {
      // 这里只是例子，实际开发时可以使用
      // this[prop] && this[prop](row)
      console.log(prop, row, col)
    },
    testSelected () {
      console.log(this.$refs.tableRef.multipleSelection)
    },
    testToggle () {
      this.$refs.tableRef.$refs.everTable.toggleRowSelection(this.tableData[0])
    },
  },
}
</script>

<style scoped>
</style>
