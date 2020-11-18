<template>
  <div class="pdt20">
    <div class="el-breadcrumb ever_breadcrumb"></div>
    <div id="sourcelist">
      <el-row >
        <el-col :span="24">
          <el-menu mode="horizontal" :default-active="currentPage" router>
            <el-menu-item class="sourcemenu" :index="'/crm/sourcelist/'">
              渠道管理
            </el-menu-item>
            <el-menu-item class="sourcemenu bulec" :index="'/crm/sourcekpi/'">
              渠道业绩
            </el-menu-item>
            <el-menu-item class="sourcemenu" :index="'/crm/sourcemember/'">
              渠道客户
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
      <el-row class="pd20">
        <el-col :span="24">
          <ever-form2 :schema="querySchema" v-model="queryObj" ref="form" :inline="true" :is-query="true" @query="list(true)">
            <template slot="times">
              <ever-range-picker :start.sync="queryObj.start" :end.sync="queryObj.end"></ever-range-picker>
            </template>
          </ever-form2>
          业绩总金额：<label class="porfitcolor">{{totalProfit}} </label>元
        </el-col>
      </el-row>
      <el-row class="pd20">
        <el-col :span="24">
          <el-table
            :data="tableData"
            border
            class="el-td-border">
            <el-table-column
              prop="patientName"
              label="姓名"
              width="150"
              align="center">
            </el-table-column>
            <el-table-column
              prop="patientId"
              label="患者档案号"
              align="center"
              width="120">
            </el-table-column>
            <el-table-column
              label="性别"
              align="center"
              width="120">
              <template slot-scope="scope">
                <sys-value type="GBT.2261.1" :code="scope.row.patientSex"></sys-value>
              </template>
            </el-table-column>
            <el-table-column
              prop="patientAge"
              label="年龄"
              align="center"
              width="120">
            </el-table-column>
            <el-table-column
              label="收费金额"
              align="center"
              width="120">
              <template slot-scope="scope">
                {{scope.row.payedFee || '--'}}
              </template>
            </el-table-column>
            <el-table-column
              label="是否商保"
              width="160"
              align="center">
              <template slot-scope="scope">
                <label v-if="scope.row.insuranceFlag === true">是</label>
                <label v-else>否</label>
              </template>
            </el-table-column>
            <el-table-column
              prop="settleDate"
              label="诊疗时间"
              width="160"
              align="center">
            </el-table-column>
            <el-table-column
              label="结算单号"
              align="center"
              min-width="160">
              <template slot-scope="scope">
                <a href="javascript:void(0)" @click="settlementDetail(scope.row)">{{scope.row.settleCode}}</a>
              </template>
            </el-table-column>
            <el-table-column
              prop="channelName"
              label="渠道来源"
              width="160"
              align="center">
            </el-table-column>
            <el-table-column
              prop="profit"
              label="业绩"
              width="160"
              align="center">
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              align="center"
              width="160">
              <template slot-scope="scope">
                <el-button size="small" type="info" @click="settlementDetail(scope.row)">明细</el-button>
                <el-button v-if="scope.row.hasAudit === true" size="small" type="primary" @click="linkChangedetail(scope.row)">查看</el-button>
                <el-button v-else size="small" type="primary" @click="linkChangePage(scope.row.id)">变更</el-button>
              </template>
            </el-table-column>
          </el-table>
          <ever-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :totalCount="totalCount"
            :current="current">
          </ever-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import api from '../store/sourceapi'
  import utillist from '../../util/list'
  let querySchema = [
    {
      name: 'times',
      label: '时间范围',
      comp: 'custom'
    },
    {
      name: 'name',
      comp: 'el-input',
      props: {
        placeholder: '客户姓名'
      }
    }
  ]
  export default {
    mixins: [utillist],
    data () {
      let queryObj = this.$ever.createObjFromSchema(querySchema)
      queryObj.times = []
      queryObj.start = ''
      queryObj.end = ''
      return {
        api: api,
        querySchema: querySchema,
        visible: true,
        offset: 0,
        pagesize: 20,
        totalCount: 0,
        pageSizes: [10, 20, 50, 100],
        queryObj: queryObj,
        totalProfit: ''
      }
    },
    created () {
      this.currentPage = this.$route.path
    },
    methods: {
      linkDetailPage (id) {
        this.$router.push({path: '/crm/sourcedetail', query: {id: id}})
      },
      linkChangePage (id) {
        this.$router.push({path: '/crm/changeprofit', query: {id: id}})
      },
      linkChangedetail (obj) {
        window.open(this.$ever.warehouseIndex + '/goods/approval/' + obj.precessKey + '/1')
      },
      settlementDetail (row) {
        location.href = `${this.$ever.rcmIndex}/rcm/reconstruct/settled?patientId=${this.patientId}&visitNumber=${row.visitNum}&showDetail=0&settlementid=${row.settleId}&dptId=${row.orderDept}&showlist=true`
      },
      addCreatesource () {
        this.$router.push({name: 'createsource', path: 'createsource'})
      },
      list () {
        this.queryObj.offset = this.offset
        this.queryObj.pagesize = this.pagesize
        this.api.getsettlelist(this.queryObj).then(rs => {
          if (rs.head.errCode === 0) {
            this.tableData = rs.data.resultList
            this.totalCount = rs.data.totalCount
            this.totalProfit = rs.data.totalProfit
          } else {
            this.tableData = []
            this.totalCount = 0
            this.totalProfit = 0
          }
        })
      }
    }
  }
</script>
<style scoped>
  #sourcelist{border: 1px solid #d1dbe5;border-radius: 4px;background-color: #fff;overflow: hidden;box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);}
  .pd20{padding:20px;}
  .pdt20{padding-top:20px;}
  .sourcemenu{margin:0px 20px;width:90px;text-align:center;}
  .pdl20{padding-left:20px;}
  .bulec{color:#1C7BEF;}
  .porfitcolor{color:red;}
</style>
