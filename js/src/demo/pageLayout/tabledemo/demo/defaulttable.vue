<template>
  <div class="layout_inner">
    <el-row>
      <el-col :span="24">
        <p>默认表格，不加border不加class，与element的默认table不同的是有外边框，行高不同等</p>
        <el-table v-loading.body="loading" :data="tableData">
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="id" label="id" align="center"></el-table-column>
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
          <el-table-column
            prop="otherName1"
            width="200"
            align="right"
            label="可用数量"
            v-if="!isHidden"
          ></el-table-column>
          <el-table-column
            prop="amount"
            label="金额"
            width="200"
            align="right"
            :formatter="amountFormatter"
            v-if="!isHidden"
          ></el-table-column>
          <el-table-column prop="address" label="地址" width="400" align="right">
            <template slot-scope="scope">
              <ever-address v-model="scope.row.address" :convertToFnt="true"></ever-address>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template
              slot-scope="scope"
            >{{scope.row.status | formateValueToFnt({list: statusList, defaultFnt:'无'})}}</template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center" :fixed="isFixed ? 'right' : false">
            <template slot-scope="scope">
              <el-button type="primary">编辑</el-button>
              <ever-confirm
                :msg="'确定删除 '+scope.row.name+' ？'"
                action="删除"
                @confirm="del(scope.row.id, scope.row)"
              ></ever-confirm>
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
import citys from '@/util/citys'

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
    address: '{ "addressDetail": "分公司地方", "province": "130000", "city": "130200", "county": "130203" }',
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
    address: '{ "province": "150000", "city": "150400", "county": "150421", "addressDetail": "宏碁大姐" }',
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
    address: '{ "province": "440000", "city": "440200", "county": "440205", "addressDetail": "正大路" }',
    status: 2,
  },
  {
    id: 4,
    code: 'XHT003',
    name: '心和堂三店',
    otherName: '心和堂',
    type: '集团',
    enableDate: '',
    address: '{ "addressDetail": "分公司地方", "province": "130000", "city": "130200", "county": "130203" }',
    amount: 7798800,
  },
  {
    id: 5,
    code: 'XHT003',
    name: '心和堂三店',
    otherName: '心和堂',
    type: '集团',
    enableDate: '',
    address: '{ "addressDetail": "分公司地方", "province": "130000", "city": "130200", "county": "130203" }',
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
    }
  },
  data () {
    return {
      noData: false,
      isHidden: true,
      isFixed: false,
      tableData: originData,
      loading: false,
      statusList: [
        { name: '已删除', id: 1 },
        { name: '正常', id: 2 },
        { name: '已停用', id: 3 },
        { name: '已开业', id: 5 },
        { name: '已废弃', id: 4 },
      ],
    }
  },
  components: {
    citys
  }
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

