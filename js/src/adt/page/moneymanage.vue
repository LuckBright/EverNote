
<template>
  <div class='inhospital'>
    <top-search @change='getInfoList' ref='searchRef' :flag="'inhospaital'"></top-search>
    <p class='btns'>
      <el-button class="btn ml20" @click='promptsBtn'>催款</el-button>
    </p>
    <div class='table-box  flex_col_1_hidden main-wrap'>
      <el-table
        :data="tableData"
        :border=true
        tooltip-effect='dark'
        @selection-change='selectionChange'
        style="width: 100%">
        <el-table-column
          type="selection"
          width="40">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click='promptBtn(scope.row)'>催款</el-button>
            <span class='tipStyle' v-if="Boolean(scope.row.promptDays) != ''">{{scope.row.promptDays}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="patientName"
          label="姓名"
          width='100'>
        </el-table-column>
        <el-table-column
          label="年龄"
          width='100'>
          <template slot-scope="scope">
            {{scope.row.ageShowText}}
          </template>
        </el-table-column>
        <el-table-column
          label="性别"
          width='50'>
          <template slot-scope="scope">
            <sys-value type="GBT.2261.1" :code="scope.row.sex"></sys-value>
          </template>
        </el-table-column>
        <el-table-column
          prop="admitDepositStatus"
          width='89'
          label="押金状态">
          <template slot-scope="scope">
            <div slot="reference">
              <el-tag size="medium" :class="className[scope.row.admitDepositStatus]">{{ depositStatus[scope.row.admitDepositStatus] }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="inpatientNumber"
          label="病案号"
          width='150px'>
        </el-table-column>
        <el-table-column
          prop="status"
          label="患者状态"
          width='80px'
          :formatter='status'>
        </el-table-column>
        <el-table-column
          prop="inDeptName"
          label="科室"
          width='100px'>
        </el-table-column>
        <el-table-column
          prop="inWardName"
          label="病区"
          width='100px'>
        </el-table-column>
        <el-table-column
          prop="admitTime"
          label="入院时间"
          width='160px'>
        </el-table-column>
        <el-table-column
          prop="promptThreshold"
          label="欠费警戒线">
        </el-table-column>
        <el-table-column
          prop="depositBalance"
          label="在院余额"
          width='100px'>
        </el-table-column>
        <el-table-column
          label="催款金额"
          width='140px'>
          <template slot-scope='scope'>
            <ever-number v-model="scope.row.promptAmount" number-type="number" :to-fixed-len="2" placeholder="请输入催款金额"></ever-number>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="offset"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        style='float:right'
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import api from '@/adt/store/register'
import topSearch from '@/adt/page/topsearch'

export default {
  data () {
    return {
      tableData: [],
      total: 0,
      offset: 1,
      pagesize: 20,
      statusInfo: {
        3: '待入科',
        4: '已入科',
        5: '待转科',
        6: '待出科',
        7: '已出科',
        12: '退科'
      },
      depositStatus: {
        1: '未交押金',
        2: '已缴押金',
        3: '押金警告',
        4: '押金透支'
      },
      className: {
        1: 'originBg',
        2: 'greenBg',
        3: 'originBg',
        4: 'redBg'
      },
      isShowDialog: false,
      rowValue: '',
      prompts: []
    }
  },
  components: {
    topSearch
  },
  mounted () {
    this.$refs.searchRef.searchBtn()
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.$refs.searchRef.searchBtn()
    },
    handleCurrentChange (val) {
      this.offset = val
      this.$refs.searchRef.searchBtn()
    },
    getInfoList (filterModel) {
      filterModel.inHosDate = filterModel.inHosDate === null ? '' : filterModel.inHosDate
      let params = {
        offset: (this.offset - 1) * this.pagesize,
        pagesize: this.pagesize,
        startDate: filterModel.inHosDate[0],
        endDate: filterModel.inHosDate[1]
      }
      params = Object.assign({}, params, filterModel)
      api.getSearchInhos(params).then(res => {
        if (res && res.head.errCode === 0) {
          this.total = res.data.totalCount
          this.tableData = res.data.resultList
        }
      })
    },
    status (row) {
      return this.statusInfo[row.status]
    },
    depositInfo (row) {
      return this.depositStatus[row.admitDepositStatus]
    },
    // 单个催款
    promptBtn (row) {
      if (row.promptAmount) {
        let params = {
          id: row.id,
          promptAmount: row.promptAmount
        }
        api.getPrompt(params).then(res => {
          if (res && res.head.errCode === 0) {
            this.$notify({
              title: '成功',
              message: '催款成功',
              type: 'success'
            })
            this.$refs.searchRef.searchBtn()
          }
        })
      } else {
        this.$notify({
          title: '警告',
          message: '请输入催款金额',
          type: 'error'
        })
      }
    },
    // 多个催款
    promptsBtn () {
      if (this.prompts.length) {
        let isTrue = true
        this.prompts.forEach(item => {
          if (!item.promptAmount) isTrue = false
        })
        if (isTrue) {
          let params = this.prompts
          api.getPromptList(params).then(res => {
            if (res && res.head.errCode === 0) {
              this.$notify({
                title: '成功',
                message: '催款成功',
                type: 'success'
              })
              this.$refs.searchRef.searchBtn()
            }
          })
        } else {
          this.$notify({
            title: '警告',
            message: '请输入催款金额',
            type: 'error'
          })
        }
      } else {
        this.$notify({
          title: '警告',
          message: '请选择要催款患者',
          type: 'error'
        })
      }
    },
    // 复选框勾选
    selectionChange (row) {
      this.prompts = row
    }
  }
}
</script>
<style scoped>
.inhospital {
  height: calc(100% - 20px);
  background: white;
  padding: 10px 5px;
}
.inhospital .table-box {
  margin: 20px;
  overflow: scroll;
}
.inhospital .table-box .tipStyle {
  padding: 1px 3px;
  background: #c5c5c5;
  border-radius: 2px;
  color: #fff;
}
.inhospital .dialog {
  display: flex;
  flex-direction: column;
  background: #ccc;
  position: fixed;
  top: 40px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  padding: 5px;
  overflow: hidden;
}
.inhospital .btns .btn{
  width: 90px;
  height: 32px;
  background: #fff;
  border: 1px solid #000000;
  border-radius: 2px;
  color: #000000;
  font-size: 14px;
}
.originBg {
  background: #fd9800;
  color: #fff;
}
.greenBg {
  background: #bfebaa;
  color: #fff;
}
.redBg {
  background: #FF192E;
  color: #fff;
}
</style>
