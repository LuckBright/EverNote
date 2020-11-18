<template>
  <ever-table
    :columns="columns"
    :data="tableData"
    :is-drag-table="true"
    @eventChange="eventChange"
    :is-record-url-params="false"
  >
    <template slot="codeCol">
      <el-table-column prop="code" label="编号" :formatter="codeFormatter"></el-table-column>
    </template>
    <template slot="opCol">
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary">编辑</el-button>
          <el-button type="danger">删除</el-button>
        </template>
      </el-table-column>
    </template>
  </ever-table>
</template>

<script>

  export default {
    data: function () {
      return {
        columns: [
          {
            slotName: 'codeCol'
          },
          {
            prop: 'name',
            label: '品牌'
          },
          {
            prop: 'version',
            label: '版本'
          },
          {
            prop: 'price',
            label: '价格'
          },
          {
            slotName: 'opCol'
          }
        ],
        tableData: [
          {
            code: '1',
            name: '苹果',
            version: 'iphonex max plus',
            price: '14,400.00'
          },
          {
            code: '2',
            name: '华为',
            version: 'ry max plus',
            price: '14,400.00'
          },
          {
            code: '3',
            name: '三星',
            version: '1.0 max plus',
            price: '4,400.00'
          }
        ]
      }
    },
    methods: {
      eventChange ({btnType, row, col}) {
        // 这里只是例子，实际开发时可以使用
        // this[prop] && this[prop](row)
        console.log(btnType, row, col)
      },
      codeFormatter (r, c, v) {
        return v + 'formatter'
      }
    }
  }
</script>

