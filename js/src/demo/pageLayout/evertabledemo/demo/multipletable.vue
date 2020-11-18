<template>
  <div>
    <ever-table
      ref="multipleTableRef"
      :columns="columns"
      :data="tableData"
      :show-checkbox="true"
      :border="true"
      :primary-key="'code'"
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
        columns: [
          {
            prop: 'code',
            label: '编号',
            width: 600
          },
          {
            prop: 'name',
            label: '姓名',
            width: 600
          },
          {
            prop: 'gender',
            label: '性别',
            width: 600,
            formatter ({value}) {
              if (value === 1) {
                return '男'
              } else if (value === 2) {
                return '女'
              } else {
                return ''
              }
            }
          },
          {
            prop: 'price',
            label: '出价',
            width: 600
          },
          {
            prop: 'ever-op', // 该列的唯一标示
            type: 'btns',
            fixed: 'right',
            width: 300,
            label: '操作',
            btns: [
              {
                prop: 'edit',
                label: '编辑'
              },
              'del'
            ]
          }
        ],
        tableData: [
          {
            code: '1',
            name: '周小童',
            gender: 1,
            price: '4,400.00'
          },
          {
            code: '2',
            name: '周大童',
            gender: 1,
            price: '4,400.00'
          },
          {
            code: '3',
            name: '周二童',
            gender: 2,
            price: '4,400.00'
          }
        ]
      }
    },
    methods: {
      eventChange ({prop, row, col, scope}) {
        // 这里只是例子，实际开发时可以使用
        // this[prop] && this[prop](row)
        console.log(prop, row, col, scope)
      },
      testSelected () {
        console.log(this.$refs.multipleTableRef.multipleSelection)
      },
      testToggle () {
        this.$refs.multipleTableRef.$refs.everTable.toggleRowSelection(this.tableData[0])
      }
    }
  }
</script>

