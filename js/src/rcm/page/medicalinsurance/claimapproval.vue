<!--
 * @Author: renpengfei
 * @Date: 2019-08-12 11:21:51
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-11-08 14:46:50
 -->
<template>
  <div v-loading="loading">
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="schema"
          v-model="queryObj"
          @query="list()"
          :is-query="true"
          labelWidth="80px"
        >
          <template slot="buttons">
            <el-button
              type="primary"
              plain
              @click="list()"
              v-if="roleLevel === 0 || this.meta===2"
            >全部</el-button>
            <el-button
              type="primary"
              plain
              @click="list(1)"
              v-if="roleLevel === 0 || this.meta===2"
            >审批中</el-button>
            <el-button
              type="primary"
              plain
              @click="list(2)"
              v-if="roleLevel === 0 || this.meta===2"
            >已驳回</el-button>
            <el-button
              type="primary"
              plain
              @click="list(3)"
              v-if="roleLevel === 0 || this.meta===2"
            >已通过</el-button>
            <el-button type="primary" @click="list()">查询</el-button>
          </template>
          <div></div>
        </ever-form2>
        <div class="main-option">
          <div v-if="meta === 1">
            <template v-if="roleLevel > 0">
              <el-button type="primary" @click="batchApproval" size="small">批量通过</el-button>
              <el-button type="primary" @click="batchReject" size="small">批量驳回</el-button>
            </template>
            <template v-else>
              <router-link
                :to="
                  this.meta == 1
                    ? '/financial/newclaimapproval'
                    : '/financial/newclaimapprovalcustomer'
                "
                style="margin-left:10px;"
              >
                <el-button type="primary" size="small">新建审批</el-button>
              </router-link>
            </template>
          </div>
          <div v-if="meta === 2">
            <el-button
              type="primary"
              @click="batchApproval"
              size="small"
              v-if="$hasPermission('Auth_menu_financial_income_batchapproval')"
            >批量通过</el-button>
            <el-button
              type="primary"
              @click="batchReject"
              size="small"
              v-if="$hasPermission('Auth_menu_financial_income_rejectionapproval')"
            >批量驳回</el-button>
            <router-link
              :to="
                this.meta == 1
                  ? '/financial/newclaimapproval'
                  : '/financial/newclaimapprovalcustomer'
              "
              style="margin-left:10px;"
            >
              <el-button
                type="primary"
                v-if="$hasPermission('Auth_menu_financial_income_newapproval')"
              >新建审批</el-button>
              <!-- <el-button type="primary" size="small">新建审批</el-button> -->
            </router-link>
          </div>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" :selectable="selectable"></el-table-column>
          <el-table-column prop="insurOrgName" :label="this.meta === 1 ? '保险公司名称' : '大客户公司名称'"></el-table-column>
          <el-table-column prop="insurProductName" :label="this.meta === 1 ? '保险产品' : '大客户产品'"></el-table-column>
          <el-table-column prop="settlementCode" show-overflow-tooltip label="结算单号"></el-table-column>
          <el-table-column prop="fastMailCode" label="快递单号"></el-table-column>
          <el-table-column prop="patientName" label="患者姓名"></el-table-column>
          <el-table-column prop="checkCode" show-overflow-tooltip label="账单审批批号"></el-table-column>
          <el-table-column prop="payInsur" label="应收金额" header-align="center" align="right">
            <template slot-scope="scope">
              {{
              scope.row.payInsur | formatToFinacial
              }}
            </template>
          </el-table-column>
          <el-table-column prop="clinicName" label="就诊机构"></el-table-column>
          <el-table-column prop="statusName" label="审批状态"></el-table-column>
          <el-table-column prop="createUser" label="提交人"></el-table-column>
          <el-table-column prop="createTime" label="创建日期" width="160"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="detail(scope.row)" type="primary">审批详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <ever-pagination
          :page-sizes="pageSizes"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
        ></ever-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {
  insuranceName,
  insuranceProduct,
  getClaimApprovalList,
  passClaimApproval,
  rejectClaimApproval,
  getAll,
  selectByCustomer
} from '@/rcm/store/medicalinsurance'
let schema = [
  {
    name: 'clinicid',
    label: '就诊机构',
    comp: 'ever-org-select',
    props: {
      clearable: true,
      type: 'select',
      fields: 'id'
    },
    span: 5
  },
  {
    name: 'insurOrgId',
    label: '公司名称',
    span: 5,
    comp: 'el-select',
    style: {
      width: '100%'
    },
    props: {
      options: []
    }
  },
  {
    name: 'insurProductId',
    label: '产品名称',
    span: 5,
    comp: 'el-select',
    props: {
      options: []
    },
    style: {
      width: '100%'
    }
  },
  {
    name: 'daterange',
    label: '创建时间',
    props: {
      autoWidth: true
    },
    comp: 'everRangePicker',
    span: 5
  },
  {
    name: 'patientId',
    label: '患者姓名',
    span: 5,
    comp: 'ever-patient-select',
    props: {
      placeholder: '患者姓名'
    },
    style: {
      width: '100%'
    },
    newRow: true
  },
  {
    name: 'fastMailCode',
    label: '快递单号',
    span: 5,
    comp: 'el-input',
    props: {
      placeholder: '请输入快递单号'
    }
  },
  {
    name: 'settlementCode',
    label: '结算单号',
    span: 5,
    comp: 'el-input',
    props: {
      placeholder: '请输入结算单号'
    }
  },
  {
    name: 'buttons',
    label: '',
    comp: 'custom',
    labelWidth: '10px',
    span: 7
  }
]
export default {
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.applyBeginDate = ''
    queryObj.applyEndDate = ''
    return {
      schema,
      queryObj,
      loading: false,
      tableData: [],
      pageSizes: [10, 20, 30, 40, 50],
      pagesize: 20,
      pageIndex: 1,
      totalCount: 0,
      multipleSelection: [],
      roleLevel: 0,
      meta: this.$route.meta.type
    }
  },
  created () {
    var _that = this
    this.list()
    // 商保账单审批，审批流通过或者驳回之后，页面重新获取窗口，将数据刷新
    window.onmessage = function (e) {
      if (e.data === 'commercialInsuranceApproval') {
        _that.list()
      }
    }
  },
  watch: {
    'queryObj.insurOrgId': {
      handler: function (val, oldval) {
        if (this.meta === 1) {
          this.getInsuranceProduct(val)
        } else {
          this.getSelectByCustomer(val)
        }
      }
    }
  },
  methods: {
    selectable (row, index) {
      return row.status === 1
      // .tatusconsole.log(row, index)
    },
    async getCompanyByMeta () {
      if (this.meta === 1) {
        let data = await insuranceName()
        data.data.forEach(v => {
          v['name'] = v.insuranceOrgCnName
        })
        this.$ever.getFieldFromSchema(
          this.schema,
          'insurOrgId'
        ).props.options = data.data
      } else {
        try {
          let data = await getAll()
          this.$ever.getFieldFromSchema(
            this.schema,
            'insurOrgId'
          ).props.options = data.data
        } catch (err) { }
      }
    },
    // 保险名称，集团下人员
    async getPeopleAndInsuranceName () {
      try {
        this.getCompanyByMeta()
      } catch (err) {
        console.log(err)
      }
    },
    // 大客户产品
    async getSelectByCustomer (customerId) {
      this.queryObj.insurProductId = ''
      if (!customerId) {
        return
      }
      try {
        let params = { customerId }
        let data = await selectByCustomer(params)
        data.data.forEach(v => {
          v.name = v.productName
        })
        this.$ever.getFieldFromSchema(
          this.schema,
          'insurProductId'
        ).props.options = data.data
      } catch (err) { }
    },
    // 保险产品
    async getInsuranceProduct (id) {
      this.queryObj.insurProductId = ''
      try {
        let params = { id }
        let data = await insuranceProduct(params)
        data.data.forEach(v => {
          v.name = v.productName
        })
        this.$ever.getFieldFromSchema(
          this.schema,
          'insurProductId'
        ).props.options = data.data
      } catch (err) { }
    },
    // 患者列表
    async list (status) {
      this.loading = true
      let params = Object.assign({}, this.queryObj)
      if (this.queryObj.daterange) {
        params.applyBeginDate = this.queryObj.daterange[0]
        params.applyEndDate = this.queryObj.daterange[1]
      }
      params.offset = (this.pageIndex - 1) * this.pagesize
      params.pagesize = this.pagesize
      params.checkType = this.meta === 1 ? 0 : 1
      if (status) {
        params.status = status
      }
      try {
        let data = await getClaimApprovalList(params)
        this.loading = false
        this.tableData = data.data
        this.totalCount = data.totalCount
        this.roleLevel = data.roleLevel
        // 如果用户角色是2，则拿到角色拥有权限的保险公司，然后自动筛选
        if (data.secondRoles) {
          this.$ever.getFieldFromSchema(
            this.schema,
            'insurOrgId'
          ).props.options = data.secondRoles.reduce((insurorgList, item) => {
            insurorgList.push({ id: item.id, name: item.insuranceOrgCnName })
            return insurorgList
          }, [])
        } else {
          // 如果角色不是2，则获取所有的保险公司
          this.getPeopleAndInsuranceName()
        }
      } catch (err) {
        console.log(err)
        this.loading = false
      }
    },
    // status3通过status2驳回status1审批中
    batchApproval () {
      if (this.multipleSelection.length > 0) {
        let filterArr = this.multipleSelection.filter(v => (v.status === 3 || v.status === 2))
        if (filterArr.length > 0) {
          this.$messageTips(this, 'warning', '只有审批中的单子才可以通过')
        } else {
          this.$confirm('您确定要批量审核通过吗？', '提示', {
            cancelButtonText: '取消',
            confirmButtonText: '确定'
          }).then(({ value }) => {
            // 调用批量审批通过接口
            let idList = []
            this.multipleSelection.forEach((v, i) => {
              idList.push(v.id)
            })
            passClaimApproval({ ids: idList }).then(res => {
              if (res.head && res.head.errCode === 0) {
                this.$messageTips(this, 'success', '操作成功')
                this.list()
              }
            })
          })
        }
      } else {
        this.$messageTips(this, 'warning', '请至少选择一个审批账单')
      }
    },
    batchReject () {
      if (this.multipleSelection.length > 0) {
        let filterArr = this.multipleSelection.filter(v => (v.status === 3 || v.status === 2))
        if (filterArr.length > 0) {
          this.$messageTips(this, 'warning', '只有审批中的单子才可以驳回')
        } else {
          this.$confirm('您确定要批量驳回吗？', '提示', {
            cancelButtonText: '取消',
            confirmButtonText: '确定'
          }).then(({ value }) => {
            // 调用驳回接口
            let idList = this.multipleSelection.reduce((idList, item) => {
              idList.push(item.id)
              return idList
            }, [])
            rejectClaimApproval({ ids: idList }).then(res => {
              if (res.head && res.head.errCode === 0) {
                this.$messageTips(this, 'success', '操作成功')
                this.list()
              }
            })
          })
        }
      } else {
        this.$messageTips(this, 'warning', '请至少选择一个审批账单')
      }
    },
    // 详情
    detail (row) {
      this.$router.push({
        path:
          this.meta === 1
            ? '/financial/claimapprovaldetail'
            : '/financial/claimapprovaldetailcustomer',
        query: {
          id: row.id,
          status: row.status
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSizeChange (pagesize) {
      this.pagesize = pagesize
      this.list()
    },
    handleCurrentChange (pageIndex) {
      this.pageIndex = pageIndex
      this.list()
    }
  }
}
</script>
<style scoped>
.layout_box .main-head .el-form {
  margin-top: 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
}
.el-button + .el-button {
  margin-left: 5px;
}
</style>
