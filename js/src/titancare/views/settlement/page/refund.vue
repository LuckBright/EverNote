<template>
  <div class="layout_inner">
    <el-row class="common_head">
      <el-col>
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item>
            <el-select
              v-model="form.clinicId"
              placeholder="全部机构"
              @change="tenantSubjectChange"
              filterable
            >
              <el-option :label="item.name" :value="item.id" v-for="item in orglist" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.deptId" placeholder="全部科室" filterable>
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in deptlist"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.hasRefund" placeholder="全部退款状态">
              <el-option
                :label="item.val"
                :value="item.id"
                v-for="item in hasRefundList"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.customerStatus" placeholder="全部客服处理">
              <el-option
                :label="item.val"
                :value="item.id"
                v-for="item in customerStatuslist"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.refundFail" placeholder="全部订单">
              <el-option
                :label="item.val"
                :value="item.id"
                v-for="item in refundFaillist"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算单创建时间">
            <el-date-picker
              class="datewidth"
              v-model="form.date"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:250px"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.settleCode" placeholder="姓名／手机号／结算单号" style="width:250px"></el-input>
          </el-form-item>
          <!--          <el-form-item>-->
          <!--            <el-select v-model="form.serviceType" placeholder="全部服务类型">-->
          <!--              <el-option-->
          <!--                :label="item.val"-->
          <!--                :value="item.id"-->
          <!--                v-for="item in serviceTypeList"-->
          <!--                :key="item.id"-->
          <!--              ></el-option>-->
          <!--            </el-select>-->
          <!--          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="list">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row class="p20_30_20_40">
      <el-col>
        <el-table v-loading.body="loading" :data="tableData" style="width: 100%" border stripe>
          <el-table-column label="姓名" prop="patientName" show-overflow-tooltip></el-table-column>
          <el-table-column label="性别" prop="sexName" show-overflow-tooltip width="50px"></el-table-column>
          <el-table-column label="手机号" prop="mobile" show-overflow-tooltip></el-table-column>
          <el-table-column label="所在机构/科室" show-overflow-tooltip>
            <template slot-scope="scoped">{{scoped.row.clinicName+'/'+scoped.row.deptName}}</template>
          </el-table-column>
          <el-table-column label="开单医生" prop="doctorName" show-overflow-tooltip></el-table-column>
          <el-table-column label="服务类型" prop="settlementType" show-overflow-tooltip>
            <template slot-scope="scoped">
              <!-- 1门诊 2挂号 等不需要处理，产品逻辑只把图文、视频、在线咨询名字显示即可 -->
              <!-- 产品李爽修改逻辑，1，2 的显示为院内挂号 -->
              <template v-if="scoped.row.settlementType == 1">院内挂号</template>
              <template v-else-if="scoped.row.settlementType == 2">院内挂号</template>
              <template v-else-if="scoped.row.settlementType == 3">图文问诊</template>
              <template v-else-if="scoped.row.settlementType == 4">在线处方</template>
              <template v-else-if="scoped.row.settlementType == 5">视频问诊</template>
              <template v-else-if="scoped.row.settlementType == 6">在线咨询</template>
            </template>
          </el-table-column>
          <el-table-column label="结算单号" prop="settleCode" show-overflow-tooltip width="200px"></el-table-column>
          <el-table-column label="结算单金额" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.totalFee | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column label="结算单时间" prop="createTime" show-overflow-tooltip width="170px"></el-table-column>
          <el-table-column label="退费状态" prop="hasRefundName" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="客户申请处理" prop="customerStatusName" show-overflow-tooltip></el-table-column>
          <el-table-column label="退款异常订单" prop="refundFailName" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scoped">
              <el-link
                v-if="scoped.row.visitIhType === 51 && scoped.row.settlementType === 4"
                type="primary"
                @click="goto(scoped.row,'order')"
                style="margin-left:10px;"
              >订单详情</el-link>
              <el-link type="primary" @click="goto(scoped.row,'fee')" style="margin-left:10px;">退费</el-link>
            </template>
          </el-table-column>
        </el-table>
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :pagesize="pagesize"
          :pageSizes="pageSizes"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" width="500px">
      <fee></fee>
    </el-dialog>
  </div>
</template>

<script>
import otherapi from '@/titancare/api/homemanage/homemanageapi'
import api from '@/titancare/api/settlement'
import list from '@/titancare/mixins/list'
import fee from './fee.vue'

export default {
  components: { fee },
  mixins: [list],
  data () {
    return {
      api,
      otherapi,
      form: {
        clinicId: null,
        deptId: null,
        hasRefund: -1,
        customerStatus: 0,
        startTime: '',
        endTime: '',
        settleCode: '',
        refundFail: 0
      },
      dialogVisible: false,
      choosepup: '',
      orglist: [],
      deptlist: [],
      loading: false,
      hasRefundList: [{ id: -1, val: '全部退款状态' }, { id: 0, val: '无退款' }, { id: 1, val: '有退款' }],
      customerStatuslist: [{ id: 0, val: '全部客服状态' }, { id: 1, val: '用户申请待处理' }],
      refundFaillist: [{ id: 0, val: '全部订单' }, { id: 1, val: '退款异常订单' }],
      pagesize: 20,
      pageSizes: [10, 20, 30, 50, 100, 200],
      serviceTypeList: [{ id: '', val: '全部服务类型' }, { id: 1, val: '视频问诊' }, { id: 2, val: '图文问诊' }],
    }
  },
  created () {
    this.getOrgList()
  },
  mounted () {
    if (this.$route.query.queryobj) {
      this.form = Object.assign({}, JSON.parse(this.$route.query.queryobj))
      this.list()
    }
    this.list()
  },
  methods: {
    // 全部机构
    getOrgList () {
      this.otherapi.getOrgListByCondition().then(res => {
        if (res.errCode === 0 && res.data && res.data.resultList[0]) {
          res.data.resultList.forEach(item => {
            let obj = {}
            obj.id = item.code
            obj.name = item.name
            this.orglist.push(obj)
          })
        }
      })
    },
    // 全部科室
    tenantSubjectChange (id) {
      this.deptlist = []
      let params = {
        orgIdList: [id],
        type2CodeList: ['01.02'],
        offset: 0,
        pagesize: 1000
      }
      this.otherapi.getTenant(params).then(res => {
        if (res.errCode === 0) {
          res.data.resultList.forEach(item => {
            let obj = {}
            obj.id = item.id
            obj.name = item.tenantSubjectName
            this.deptlist.push(obj)
          })
        }
      })
    },
    list (refresh) {
      if (refresh) {
        this.current = 1
        this.offset = 0
      }
      if (this.form.date) {
        this.form.startTime = this.$moment(this.form.date[0]).format('YYYY-MM-DD')
        this.form.endTime = this.$moment(this.form.date[1]).format('YYYY-MM-DD')
      } else {
        this.form.startTime = ''
        this.form.endTime = ''
      }
      this.form.offset = this.offset
      this.form.pagesize = this.pagesize
      try {
        this.api.getList(this.form).then(rs => {
          if (rs && rs.data && rs.data.resultList) {
            this.tableData = rs.data.resultList
            this.totalCount = rs.data.totalCount
            this.loading = false
          } else {
            this.tableData = []
            this.loading = false
          }
        })
      } catch (err) {
        this.tableData = []
        this.loading = false
      }
    },
    exportExcel () {
    },
    goto (v, type) {
      if (type === 'order') {
        console.log('v', v)
        this.api.ordersearch({ visitNumber: v.visitNumber }).then(rs => {
          if (rs.errCode === 0) {
            let row = rs.data.resultList[0]
            let param = Object.assign({}, this.form)
            let pages = { offset: this.offset, pagesize: this.pagesize }
            row.localhost = this.$ever.host
            row.settlementId = v.settlementId
            row.orgId = v.clinicId
            let obj = { row, params: { param, pages } }
            this.$router.push({
              name: 'refundOrderdetail',
              query: {
                '0': JSON.stringify(obj)
              }
            })
          }
        })
      } else {
        this.$router.push({ name: 'refundFee', query: { id: v.settlementId, settlementType: v.settlementType, queryobj: JSON.stringify(this.form) } })
      }
    }
  }
}
</script>

<style scoped lang="less">
.layout_inner {
  height: auto;
}
.pagination {
  float: right;
}
</style>
