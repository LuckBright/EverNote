<template>
  <div>
    <ever-table
      :columns="columns"
      :data="tableData"
      @eventChange="eventChange"
      :is-record-url-params="false"
    >
<!--      只写el-table-column中的内容-->
      <template slot="codeHeader" slot-scope="scope">
        <span>迟到</span><span class="ml5">早退{{getContent(scope, 'header')}}</span>
      </template>
      <template slot="codeDefault" slot-scope="scope">
        <span>{{scope.row.code}}</span>
      </template>
      <template slot="nameDefault" slot-scope="scope">
        <span>{{scope.row.name + 'slot'}}</span>
      </template>
    </ever-table>
  </div>
</template>

<script>

  export default {
    created () {
    },
    data: function () {
      return {
        columns: [
          {
            // 插槽内容 需要配合prop label等，相比slotName的优势是：可以支持拖拽，自定义表头样式等
            slot: 'codeDefault',
            slotHeader: 'codeHeader',
            // 基本属性
            prop: 'code',
            label: 'labelTest',
            width: 250,
          },
          {
            prop: 'name',
            label: '品牌',
            slot: 'nameDefault',
          },
          {
            prop: 'version',
            label: '版本',
          },
          {
            prop: 'price',
            label: '价格',
          },
          {
            prop: 'op-btn',
            label: '操作',
            type: 'btns',
            btns: [
              'edit',
              'del'
            ]
          },
        ],
        tableData: [
          {
            code: '1',
            name: '苹果',
            version: 'iphonex max plus',
            price: '14,400.00',
          },
          {
            code: '2',
            name: '华为',
            version: 'ry max plus',
            price: '14,400.00',
          },
          {
            code: '3',
            name: '三星',
            version: '1.0 max plus',
            price: '4,400.00',
          },
        ],
      }
    },
    methods: {
      eventChange ({prop, row}) {
        this[prop] && this[prop](row)
      },
      codeFormatter (r, c, v) { // element 原生的formatter方法与everTable定义的formatter方法的参数顺序不一致，需要注意！
        return v + 'formatter'
      },
      getContent (scope, type) {
        console.log(scope, type)
        return '方法'
      },
    },
  }
</script>

