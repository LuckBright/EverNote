<template>
  <div class="layout_inner">
    <p>小边距表格，边距可以设置为10px / 5px / 0px，一般小边距表格都是无边框的</p>
    <el-row>
      <el-col :span="8">
        <el-table
          v-loading.body="loading"
          :data="tableData"
          :class="getTableClass"
          :border="border"
        >
          <el-table-column prop="id" label="id" align="center"></el-table-column>
          <el-table-column prop="code" label="集团代码">
          </el-table-column>
          <el-table-column prop="name" label="集团名称"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <el-button type="primary" @click="toggleData(1)">
          切换表格边距(当前：左右边距为{{classType ? (classType === 1 ? '5' : '0') : '10'}}px)
        </el-button>
        <el-button type="primary" @click="toggleData(2)">
          切换表格边框
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  const originData = [
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
  ]
  export default {
    methods: {
      toggleData (type) {
        if (type === 1) {
          this.classType = (this.classType + 1) % 3
        } else if (type === 2) {
          this.border = !this.border
          this.baseClass = this.border ? '' : 'no-border'
        }
      },
    },
    computed: {
      getTableClass () {
        if (this.classType === 0) {
          return this.baseClass + ' '
        } else if (this.classType === 1) {
          return this.baseClass + ' small-padding'
        } else if (this.classType === 2) {
          return this.baseClass + ' none-padding'
        }
      },
    },
    data () {
      return {
        baseClass: 'no-border',
        border: false,
        classType: 2,
        noData: false,
        isHidden: true,
        isFixed: false,
        tableData: originData,
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
</style>

