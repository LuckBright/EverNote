<template>
  <div class="layout_inner">
    <el-row>
      <el-col :span="24">
        <p>多选框表格，在默认表格基础上，可以实现多选效果</p>
        <el-table
          v-loading.body="loading"
          :data="tableData"
          @selection-change="handleSelectionChange"
          :row-class-name="rowClassName"
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="id" label="id" width="200" align="center"></el-table-column>
          <el-table-column prop="code" label="集团代码" :width="isHidden ? null : '200'">
            <template slot-scope="scope">
              <img
                src="http://phr-test.cn-bj.ufileos.com/FEPortal201810021110038801.png"
                alt="特殊使用级抗菌药物"
                class="mr5 el-tooltip"
                aria-describedby="el-tooltip-6498"
                tabindex="0"
                style="width: 18px; height: 18px; vertical-align: sub;"
              >
              <a href="htt">我是链接</a>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="集团名称" width="200"></el-table-column>
          <el-table-column prop="otherName" label="集团简称" width="200" v-if="!isHidden"></el-table-column>
          <el-table-column prop="otherName1" width="200" align="right" label="可用数量" v-if="!isHidden"></el-table-column>
          <el-table-column
            prop="amount"
            label="金额"
            width="200"
            align="right"
            :formatter="amountFormatter"
            v-if="!isHidden"
          ></el-table-column>
          <el-table-column label="状态">
            <template
              slot-scope="scope"
            >{{scope.row.status | formateValueToFnt({list: statusList, defaultFnt:'无'})}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center" :fixed="isFixed ? 'right' : false">
            <template slot-scope="scope">
              <el-button type="primary">编辑</el-button>
              <el-button type="danger">删除</el-button>
              <el-dropdown class="table-button-menu">
                    <span class="el-dropdown-link">
                      更多
                      <i class="el-icon-caret-bottom"></i>
                    </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>详情</el-dropdown-item>
                  <el-dropdown-item>提醒</el-dropdown-item>
                  <el-dropdown-item disabled>分享</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row :gutter="10">
     <el-col :span="24">
       <el-button type="primary" @click="isHidden=!isHidden">切换列数</el-button>
       <el-button type="primary" @click="isFixed=!isFixed">切换固定列</el-button>
       <el-button type="primary" @click="toggleData">切换数据</el-button>
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
      amountFormatter (r, c, v) {
        if (typeof v === 'number') {
          return v.toLocaleString()
        } else {
          return ''
        }
      },
      toggleData () {
        this.noData = !this.noData
        this.tableData = this.noData ? [] : originData
      },
      handleSelectionChange (val) {
        this.selectedList = val
      },
      rowClassName ({row}) {
        // 暂时不需要选中样式
        // return this.selectedList.some(item => item === row) ? 'selected' : ''
        return ''
      }
    },
    data () {
      return {
        selectedList: [],
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

