<template>
  <div>
    <el-row>
      <el-col :span="24" align="right">
        <el-button @click="handleAddMechanism()">添加机构</el-button>
      </el-col>
      <el-col :span="24">
        <ever-table
          :columns="columns"
          :data="tableData"
          @eventChange="eventChange"
          table-default-cell-value="-"
          :is-record-url-params="false"
        >
          <template slot="customerCreateTime">
            <el-table-column label="有效期" width="260">
              <template slot-scope="scope">
                <span v-if="scope.row.customerCreateTime || scope.row.customerExpirationDate">{{`${scope.row.customerCreateTime || ''} 至 ${scope.row.customerExpirationDate || ''}`}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
          </template>
          <template slot="opCol">
            <el-table-column label="操作" width="100px">
              <template slot-scope="scope">
                <el-button type="danger" @click="handleDisassociate(scope.row)">解除关联</el-button>
              </template>
            </el-table-column>
          </template>
        </ever-table>
        <ever-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :totalCount="totalCount" :current="current"></ever-pagination>
      </el-col>
    </el-row>
    <member-mechanism ref="mechanismDialog" :title="title" :titleBtn="titleBtn" :api="api" :patientId="$route.params.patientId" @seachList="list"></member-mechanism>
  </div>
</template>

<script>
import api from '@/crm/store/reimburseapi'
import list from '@/util/list'
import { tableColWidth } from '@/util/table-config'
import MemberMechanism from '@/crm/page/member/customerinfo/membermechanism'
export default {
  mixins: [list],
  data () {
    return {
      api,
      queryObj: {
        patientId: this.$route.params.patientId
      },
      columns: [
        {
          prop: 'customerName',
          showOverflowTooltip: true,
          label: '公司名称'
        },
        {
          prop: 'productName',
          showOverflowTooltip: true,
          label: '报销方案'
        },
        {
          prop: 'benefitRate',
          width: tableColWidth.name5W90,
          label: '优惠比例',
          formatter: ({ value }) => value || value === 0 ? (value === 0 ? 0 : `${value}%`) : ''
        },
        {
          prop: 'reimburseRate',
          width: tableColWidth.name5W90,
          label: '报销比例',
          formatter: ({ value }) => value || value === 0 ? (value === 0 ? 0 : `${value}%`) : ''
        },
        {
          prop: 'customerCreateTime',
          slotName: 'customerCreateTime'
        },
        {
          prop: 'remark',
          showOverflowTooltip: true,
          label: '备注'
        },
        {
          slotName: 'opCol'
        }
      ],
      title: '',
      titleBtn: ''
    }
  },
  created () { },
  methods: {
    handleAddMechanism (data) {
      data && data.id ? this.title = '编辑机构' : this.title = '添加机构'
      this.titleBtn = '保存'
      this.$refs.mechanismDialog.open(data)
    },
    handleDisassociate (row) {
      this.title = ''
      this.titleBtn = ''
      this.$refs.mechanismDialog.open(row)
    },
    eventChange ({ btnType, col, row }) {
      console.log(btnType, col, row)
    }
  },
  components: {
    MemberMechanism
  }
}
</script>
