<!--
 * @Author: renpengfei
 * @Date: 2019-08-06 15:21:27
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-10-21 15:40:56
 -->
<template>
  <div v-loading="loading">
    <div class="layout_inner">
      <div class="main-head">
        <ever-form2
          :schema="schema"
          v-model="queryObj"
          @query="list(true)"
          :is-query="true"
          labelWidth="80px"
        >
          <template slot="daterange">
            <ever-range-picker
              :start.sync="queryObj.applyBeginDate"
              :end.sync="queryObj.applyEndDate"
              customWidth="100%"
            ></ever-range-picker>
          </template>
          <el-button type="primary" style="margin-left: 20px;" @click="list(true)" size="small">查询</el-button>
          <el-button @click="reset" size="small">重置</el-button>
        </ever-form2>
        <div class="main-option">
          <router-link :to="this.meta==1?'/financial/claimedit':'/financial/claimeditcustomer'">
            <el-button type="primary" size="small">新建理赔单</el-button>
          </router-link>
          <router-link
            :to="this.meta==1?'/financial/beginclaimedit':'/financial/beginclaimeditcustomer'"
            style="margin-left:10px;"
          >
            <el-button type="primary" size="small">新建期初理赔单</el-button>
          </router-link>
        </div>
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            prop="insurOrgName"
            :label="this.meta===1?'保险公司名称':'大客户公司名称'"
          >
          </el-table-column>
          <el-table-column
            prop="claimNumber"
            label="申请单单号"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="insurInitFee"
            label="申请金额"
            align="right"
          >
            <template slot-scope="scope">
              {{scope.row.insurInitFee | formatToFinacial}}
            </template>
          </el-table-column>
          <el-table-column
            prop="patientName"
            label="患者姓名"
          >
          </el-table-column>
          <el-table-column
            prop="settlementCode"
            label="结算单单号"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="payStatusName"
            label="收款状态"
          >
          </el-table-column>
          <el-table-column
            prop="createUser"
            label="申请人"
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="160"
          >
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                @click="detail(scope.row)"
                type="primary"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <ever-pagination
          :page-sizes="pageSizes"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
        >
        </ever-pagination>
      </div>

    </div>
  </div>
</template>
<script>
let schema = [
  {
    name: 'daterange',
    label: '申请时间',
    span: 6,
    comp: 'custom'
  },
  {
    name: 'insurOrgId',
    label: '公司名称',
    span: 6,
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
    span: 6,
    comp: 'el-select',
    props: {
      options: []
    },
    style: {
      width: '100%'
    }
  },
  // {
  //   name: 'applyStatus',
  //   label: '申请状态',
  //   span: 6,
  //   comp: 'el-select',
  //   props: {
  //     options: [
  //     ]
  //   },
  //   style: {
  //     width: '100%'
  //   }
  // },
  // {
  //   name: 'applyUser',
  //   label: '申请人',
  //   span: 6,
  //   comp: 'custom',
  //   style: {
  //     width: '100%'
  //   }
  // },
  {
    name: 'applyUser',
    label: '申请人',
    comp: 'everStaffSelect',
    props: {
      clearable: true,
      type: 'select',
      fields: 'id'
    },
    span: 6
  },
  {
    name: 'patientid',
    label: '患者姓名',
    span: 6,
    comp: 'ever-patient-select',
    props: {
      placeholder: '患者姓名'
    },
    style: {
      width: '100%'
    }
  },
  {
    name: 'settlementCode',
    label: '结算单号',
    span: 6,
    comp: 'el-input',
    props: {
      clearable: true
    }
  }
]
import list from '@/util/list'
import {
  insuranceName,
  insuranceProduct,
  search,
  getAll,
  selectByCustomer
} from '@/rcm/store/medicalinsurance'
export default {
  mixins: [list],
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.applyBeginDate = ''
    queryObj.applyEndDate = ''
    return {
      schema,
      queryObj,
      peopleoptions: [],
      loading: false,
      tableData: [],
      meta: this.$route.meta.type,
    }
  },
  created () {
    this.getCompanyByMeta() // 获取保险公司
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
    // 保险公司
    async getCompanyByMeta () {
      if (this.meta === 1) {
        try {
          let name = await insuranceName()
          name.data.forEach(v => {
            v.name = v.insuranceOrgCnName
          })
          this.$ever.getFieldFromSchema(this.schema, 'insurOrgId').props.options =
            name.data
        } catch (err) {
          console.log(err)
        }
      } else { // 否则获取所有大客户列表
        try {
          let data = await getAll()
          this.$ever.getFieldFromSchema(this.schema, 'insurOrgId').props.options = data.data
        } catch (err) {

        }
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
        ).props.options =
          data.data
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
        ).props.options =
          data.data
      } catch (err) { }
    },
    // 患者列表
    async list () {
      this.loading = true
      let params = {
        offset: this.offset,
        pagesize: this.pagesize,
        businessType: this.meta // 标志是商保还是大客户
      }
      try {
        let data = await search(Object.assign(params, this.queryObj))
        this.loading = false
        this.tableData = data.data
        this.totalCount = data.totalCount
      } catch (err) {
        console.log(err)
        this.loading = false
      }
    },
    // 重置
    reset () {
      Object.keys(this.queryObj).forEach(v => {
        this.queryObj[v] = ''
      })
    },
    // 详情
    detail (row) {
      // 判断是否为未收款状态进入详情页可增删改查
      let collectionStatus = row.payStatus !== 0 ? 'payStatus' : undefined
      // type=0表示商保，type=1表示期初
      if (row.type === 0) {
        this.$router.push({
          path: this.meta === 1 ? '/financial/claimedit' : '/financial/claimeditcustomer',
          query: {
            id: row.mid,
            collectionStatus
          }
        })
      } else {
        this.$router.push({
          path: this.meta === 1 ? '/financial/beginclaimedit' : '/financial/beginclaimeditcustomer',
          query: {
            id: row.mid,
            collectionStatus
          }
        })
      }
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
</style>
