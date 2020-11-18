<template>
  <div>
    <div>
      <p>切换表格样式</p>
      <el-button @click="init">恢复默认</el-button>
      <div class="mt10">
        <el-checkbox @change="changeCheckbox('border')" v-model="tableConfig.border">显示中间的竖边框</el-checkbox>
        <el-checkbox @change="changeCheckbox('noVerticalBorder')" v-model="tableConfig.noVerticalBorder">不显示中间的横边框
        </el-checkbox>
        <el-checkbox @change="changeCheckbox('noBorder')" v-model="tableConfig.noBorder">去掉所有边框</el-checkbox>
        <el-checkbox @change="changeCheckbox('noTableBorder')" v-model="tableConfig.noTableBorder">只去掉外边的边框（用的较少）</el-checkbox>
        <el-checkbox @change="changeCheckbox('udPadding10')" v-model="tableConfig.udPadding10">上下padding为10px
        </el-checkbox>
        <el-checkbox @change="changeCheckbox('lrPadding0')" v-model="tableConfig.lrPadding0">左右padding为0px</el-checkbox>
        <el-checkbox @change="changeCheckbox('lrPadding5')" v-model="tableConfig.lrPadding5">左右padding为5px</el-checkbox>
        <el-checkbox @change="changeCheckbox('firstColumnPadding10')" v-model="tableConfig.firstColumnPadding10">第一列padding为10px</el-checkbox>
        <el-checkbox @change="changeCheckbox('firstColumnPadding15')" v-model="tableConfig.firstColumnPadding15">第一列padding为15px</el-checkbox>
        <el-checkbox @change="changeCheckbox('noData')" v-model="tableConfig.noData">改为无数据</el-checkbox>
        <el-checkbox @change="changeCheckbox('fixed')" v-model="tableConfig.fixed">改为fixed列</el-checkbox>
        <el-checkbox @change="changeCheckbox('tableHoverBlue')" v-model="tableConfig.tableHoverBlue">反色hover效果（慎用）</el-checkbox>
        <el-checkbox @change="changeCheckbox('noHover')" v-model="tableConfig.noHover">无hover效果</el-checkbox>
        <el-checkbox @change="changeCheckbox('showSingle')" v-model="tableConfig.showSingle">增加单选效果</el-checkbox>
        <el-checkbox @change="changeCheckbox('showCheckbox')" v-model="tableConfig.showCheckbox">增加多选效果</el-checkbox>
      </div>
    </div>
    <ever-table
      ref="exampleTable"
      :table-class="tableClz"
      :columns="columns"
      :data="tableData"
      :border="tableConfig.border"
      :is-single-table="tableConfig.showSingle"
      :show-checkbox="tableConfig.showCheckbox"
      :checkbox-width="checkboxWidth"
      @eventChange="eventChange"
      :is-record-url-params="false"
    >
    </ever-table>
    <el-button @click="getCurrentData">打印单选的数据</el-button>
  </div>
</template>

<script>

const originData = [
  {
    code: '1',
    name: '周小童',
    gender: 1,
    price: '4,400.00',
  },
  {
    code: '2',
    name: '周大童',
    gender: 1,
    price: '4,400.00',
  },
  {
    code: '3',
    name: '周二童',
    gender: 2,
    price: '4,400.00',
  },
]
const defaultConfig = {
  border: false,
  noVerticalBorder: false,
  udPadding10: false,
  noBorder: false,
  noTableBorder: false,
  lrPadding0: false,
  lrPadding5: false,
  firstColumnPadding10: false,
  firstColumnPadding15: false,
  noData: false,
  fixed: false,
  tableHoverBlue: false,
  noHover: false,
  showSingle: false,
  showCheckbox: false,
}
export default {
  data: function () {
    return {
      tableConfig: { ...defaultConfig },
      tableStyle: '1',
      tableClass: '', // 控制表格样式 使用空格分隔多种样式的合并
      border: false,
      fixedTable: false,
      checkboxWidth: null,
      columns: [
        {
          prop: 'code',
          label: '编号',
        },
        {
          prop: 'name',
          label: '姓名',
        },
        {
          prop: 'gender',
          label: '性别',
          formatter ({ value }) { // 使用formatter进行格式化内容 接收3个参数 (v, r, i, c) v当前单元格的值 r当前行的对象 i当前行的索引（行数） c当前列的配置
            if (value === 1) {
              return '男'
            } else if (value === 2) {
              return '女'
            } else {
              return ''
            }
          },
        },
        {
          prop: 'price',
          label: '出价',
        },
        {
          prop: 'ever-op', // 该列的唯一标示，没有prop时应该加上该属性
          type: 'btns',
          label: '操作',
          btns: [ // 当btns的有效长度超过3时，会出现更多按钮
            'edit', // 简写形式 evertable内置了edit，del（以后可能会新增）的内置样式和文本，
            'del', // edit对应primary的编辑 del对应danger的删除
            {
              prop: 'share',
              label: '分享',
            },
            {
              prop: 'collect',
              label: '收藏',
            },
          ],
        },
      ],
      tableData: originData,
    }
  },
  computed: {
    tableClz () {
      let tableClass = ''
      if (this.tableConfig.noVerticalBorder) {
        tableClass += ' no-horizontal-border'
      }
      if (this.tableConfig.udPadding10) {
        tableClass += ' tr-height-40'
      }
      if (this.tableConfig.noBorder) {
        tableClass += ' no-border'
      }
      if (this.tableConfig.noTableBorder) {
        tableClass += ' no-table-border'
      }
      if (this.tableConfig.lrPadding0) {
        tableClass += ' none-padding'
        this.checkboxWidth = 30
      } else {
        this.checkboxWidth = null
      }
      if (this.tableConfig.lrPadding5) {
        tableClass += ' small-padding'
      }
      if (this.tableConfig.firstColumnPadding10) {
        tableClass += ' first-column-10'
      }
      if (this.tableConfig.firstColumnPadding15) {
        tableClass += ' first-column-15'
      }
      if (this.tableConfig.tableHoverBlue) {
        tableClass += ' table-hover-blue'
      }
      if (this.tableConfig.noHover) {
        tableClass += ' no-hover'
      }
      return tableClass
    },
  },
  methods: {
    // 在此处处理事件，删除事件是在点击了确认删除之后触发的
    eventChange ({ prop, row, col }) {
      // 这里只是例子，实际开发时可以使用
      // this[prop] && this[prop](row)
      if (prop === 'edit') {
        console.log('执行编辑操作', col, row)
      } else if (prop === 'del') {
        console.log('执行删除操作', col, row)
      } else if (prop === 'share') {
        console.log('执行分享操作', col, row)
      } else if (prop === 'collect') {
        console.log('执行收藏操作', col, row)
      }
    },
    getCurrentData () {
      console.log(this.$refs.exampleTable.currentRow)
    },
    init () {
      this.tableConfig = { ...defaultConfig }
    },
    changeCheckbox (prop) {
      if (prop === 'noData') {
        this.tableData = this.tableConfig.noData ? [] : originData
      }
      if (prop === 'fixed') {
        this.columns = this.tableConfig.fixed ? [...this.columns.map((item, i) => {
          return {
            ...item,
            width: i === this.columns.length - 1 ? 200 : 550,
            fixed: i === this.columns.length - 1 ? 'right' : false,
          }
        })] : [...this.columns.map((item) => {
          return {
            ...item,
            width: null,
            fixed: null,
          }
        })]
      }
    },
  },
}
</script>

