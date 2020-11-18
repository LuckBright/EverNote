<template>
  <div class="bg">
    <el-row class="pd">
      <el-col>
        <ever-form2
          :schema="querySchema"
          v-model="queryObj"
          :inline="true"
          :is-query="true"
          v-ever-bind-enter
          @query="list(true)"
        >
          <template slot="times">
            <ever-range-picker :start.sync="queryObj.startTime" :end.sync="queryObj.endTime"></ever-range-picker>
          </template>
          <template slot="default">
            <el-form-item>
              <el-button type="primary" @click="list(true)">查询</el-button>
            </el-form-item>
            <el-form-item class="fr">
              <el-button @click="addRecord">添加记录</el-button>
            </el-form-item>
          </template>
        </ever-form2>
      </el-col>
    </el-row>
    <el-row class="pd">
      <el-col>
        <el-table
          v-loading.body="loading"
          :data="tableData"
          border
          class="el-td-border"
          highlight-current-row>
          <el-table-column prop="id" label="ID" align="center" width="300"></el-table-column>
          <el-table-column prop="type" label="类型" align="center" width="140">
            <template slot-scope="scope">
              <span
                v-for="(item, index) in typeData"
                :key="index"
                v-if="scope.row.type == item.id"
              >{{item.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="行为记录" align="center" width="200"></el-table-column>
          <el-table-column prop="creatorName" label="创建人" align="center" width="120"></el-table-column>
          <el-table-column align="center" label="创建时间" min-width="140">
            <template slot-scope="scope">{{ scope.row.createTime }}</template>
          </el-table-column>
          <el-table-column label="审核人" align="center" width="120">
            <template slot-scope="scope">{{scope.row.operatorName || '--'}}</template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="140">
            <template slot-scope="scope">
              <span>{{AUDIT_STATUS[scope.row.status]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="140">
            <template slot-scope="scope">
              <el-popover
                placement="right"
                width="200px"
                v-model="scope.row.showAuditing"
                trigger="click"
              >
                <el-radio-group
                  v-model="auditingStatus"
                  @change="auditingChange(scope.row)"
                  size="mini"
                >
                  <el-radio
                    v-for="(option, index) in radioOption"
                    :key="index"
                    :label="option.key"
                    border
                  >{{option.text}}</el-radio>
                </el-radio-group>
                <el-button
                  slot="reference"
                  size="small"
                  @click="auditing(scope.row)"
                  :disabled="scope.row.status != 1"
                >审核</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </el-col>
    </el-row>
    <add-cust-record
      :visible="addCustPop"
      :title="'添加行为记录'"
      :type-data="typeData"
      @update-type="updateType"
      @add-behav-record="addBehavRecord"
      @close="closeAddCust"
      @update="updateAddCust"
    ></add-cust-record>
  </div>
</template>
<script>
import api from '../store/recordapi'
import list from '@/util/list'
import addCustRecord from '../components/addcustrecord'
import { AUDIT_STATUS } from '@/util/common'

let querySchema = [
  {
    name: 'times',
    comp: 'custom',
    label: '',
    span: 4
  },
  {
    name: 'content',
    props: {
      placeholder: '请输入行为记录'
    }
  }
]

export default {
  props: ['visiable'],
  mixins: [list],
  data () {
    let obj = this.$ever.createObjFromSchema(querySchema)
    return {
      api,
      queryObj: Object.assign(obj, { patientId: this.$route.params.patientId ? this.$route.params.patientId : null }),
      querySchema,
      AUDIT_STATUS,
      addCustPop: false,
      loading: true,
      tableData: [],
      typeData: [],
      radioOption: [
        { key: 1, text: '通过' },
        { key: 0, text: '不通过' }
      ],
      auditingStatus: ''
    }
  },
  watch: {
    'visiable': {
      handler: function (val) {
        if (val === 'second') {
          this.list(true)
          this.getType()
        }
      },
      immediate: true
    }
  },
  methods: {
    getType () {
      api.custBehavType({'systemFlag': 0}).then(rs => {
        if (rs && rs.length) {
          this.typeData = rs
        }
      })
    },
    auditing (data) {
      this.auditingStatus = ''
      // data.showAuditing = true
    },
    auditingChange (val) {
      let msg = this.auditingStatus ? '通过' : '不通过'
      this.$confirm(`您将审核该条记录的状态为：${msg}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.auditingStatus) {     // 审核通过
          api.recordAuditingPass({ id: val.id }).then(rs => {
            this.list(true)
            this.$messageTips(this, 'success', '审核保存成功', '提示')
          })
        } else {                       // 审核不通过
          api.recordAuditingNoPass({ id: val.id }).then(rs => {
            this.list(true)
            this.$messageTips(this, 'success', '审核保存成功', '提示')
          })
        }
      }).catch((e) => {
        val.showAuditing = true
        this.$messageTips(this, 'warning', '已取消保存', '提示')
      })
    },
    addRecord () {
      this.addCustPop = true
    },
    closeAddCust () {
      this.addCustPop = false
    },
    updateAddCust (val) {
      this.addCustPop = val
    },
    updateType (data) {
      this.typeData = data
    },
    addBehavRecord (data) {
      this.list(true)
      this.getType()
    }
  },
  components: {
    addCustRecord
  }
}
</script>
