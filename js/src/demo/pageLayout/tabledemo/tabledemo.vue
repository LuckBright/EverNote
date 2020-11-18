<template>
  <div class="layout_inner pb200">
    <el-row>
      <el-col :span="18">
        <el-row>
          <el-col :span="24">
            <h3>表格规范</h3>
            <p>1. 姓名90px、性别50px、日期105px、日期时间150px、身份证号175px、手机号115px 的列宽；</p>
            <p>2. 默认表格的规则</p>
            <ol>
              <li>行高为30px</li>
              <li>有外边框，无内部竖边框，横边框#ccc 竖边框#ddd</li>
              <li>hover只将背景颜色变为浅蓝</li>
            </ol>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <h3>默认表格</h3>
            <default-table></default-table>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <h3>有竖边框表格</h3>
            <border-table></border-table>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <h3>无边框表格（如左侧患者列表）</h3>
            <no-border-table></no-border-table>
          </el-col>
        </el-row>
        <el-row>
<!--        <el-row v-show="false">-->
          <el-col :span="24">
            <h3>可单选表格</h3>
            <single-table></single-table>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <h3>可多选表格</h3>
            <multiple-table></multiple-table>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <h3>小边距表格</h3>
            <small-padding-table></small-padding-table>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <h3>表尾合计行</h3>
            <summary-table></summary-table>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6"></el-col>
    </el-row>
  </div>
</template>
<script>
  import defaultTable from './demo/defaulttable'
  import borderTable from './demo/bordertable'
  import noBorderTable from './demo/nobordertable'
  import multipleTable from './demo/multipletable'
  import singleTable from './demo/singletable'
  import smallPaddingTable from './demo/smallpaddingtable'
  import summaryTable from './demo/summarytable'

  export default {
    components: {
      defaultTable,
      borderTable,
      noBorderTable,
      multipleTable,
      singleTable,
      smallPaddingTable,
      summaryTable,
    },
    methods: {
      handleCurrentChange (val) {
        this.currentRow = val
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
        // 根据选中的行，将数据的selected属性改为true
        this.tableData.forEach(data => {
          data._selected = this.multipleSelection.some(item => item.id === data.id)
        })
      },
      classNameFormatter ({row}) {
        return row._selected ? 'selected' : ''
      },
      amountFormatter (r, c, v) {
        if (typeof v === 'number') {
          return v.toLocaleString()
        } else {
          return ''
        }
      },
    },
    data () {
      return {
        // 单行选中表格
        currentRow: null,
        // 多行选中表格
        multipleSelection: [],
        tableData: [
          {
            id: 1,
            code: 'XHT001',
            name: '心和堂一店',
            otherName: '心和堂',
            otherName1: '心和堂心和堂心和堂心和堂心和堂心和堂心和堂',
            type: '集团',
            enableDate: '',
            amount: 7798800.00,
            status: 3,
          },
          {
            id: 2,
            code: 'XHT002',
            name: '心和堂二店',
            otherName: '心和堂',
            type: '机构',
            enableDate: '',
            amount: 7798800.00,
            status: 4,
          },
          {
            id: 3,
            code: 'XHT003',
            name: '心和堂三店',
            otherName: '心和堂',
            type: '集团',
            enableDate: '',
            amount: 7798800.00,
            status: 2,
          },
          {
            id: 4,
            code: 'XHT003',
            name: '心和堂三店',
            otherName: '心和堂',
            type: '集团',
            enableDate: '',
            amount: 7798800,
          },
          {
            id: 5,
            code: 'XHT003',
            name: '心和堂三店',
            otherName: '心和堂',
            type: '集团',
            enableDate: '',
            amount: 7798800.00,
            status: null,
          },
        ],
        loading: false,
        statusList: [
          {name: '已删除', id: 1},
          {name: '正常', id: 2},
          {name: '已停用', id: 3},
          {name: '已开业', id: 5},
          {name: '已废弃', id: 4},
        ],
      }
    },
  }
</script>
<style scoped>
  .demo-desc {
    color: #ccc;
  }

  .red {
    color: #ff0000;
  }
  .pb200 {
    padding-bottom: 200px;
  }
</style>

