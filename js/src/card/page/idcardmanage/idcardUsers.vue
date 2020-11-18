<template>
  <el-dialog title="选择用户" :visible.sync="dialogTableVisible" class="ui_dialog_02" :close-on-click-modal="false" width="70%">
    <ever-form2 :schema="querySchema" v-model="queryObj" ref="form" :inline="true" :is-query="true" @query="list(true)">
      <template slot="default">
        <el-form-item>
          <el-button type="primary" @click="list(true)">查询</el-button>
        </el-form-item>
        <el-form-item class="fr">
          <el-button type="primary" @click="showSelectUserPop('idcardUser')">添加会员</el-button>
        </el-form-item>
      </template>
    </ever-form2>
    <el-table
      :data="tableData1"
      ref="selectUserTable"
      height="320"
      row-key="id"
      :border="false">
      <el-table-column
        width="60"
        prop=""
        label="序号"
        type=index>
      </el-table-column>
      <el-table-column
        prop="patient.name"
        label="会员姓名">
      </el-table-column>
      <el-table-column
        width="140"
        prop="patient.mobile"
        label="会员手机号">
      </el-table-column>
      <el-table-column
        width="300"
        prop="patient.company"
        label="单位">
      </el-table-column>
      <el-table-column
        width="350"
        label="有效期">
        <template slot-scope="scope">
          {{scope.row.startDate}} 至 {{scope.row.endDate}}
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="small"
            :disabled="scope.row.status != 0"
            @click="unBind(scope.$index, scope.row)">解绑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount" :current="current">
    </ever-pagination>
  </el-dialog>
</template>
<script>
  import userapi from '@/card/store/idcardUser'
  import utillist from '@/util/list'
  let schema = [
    {
      name: 'patientId',
      label: '会员姓名',
      comp: 'ever-patient-select',
      // placeholder: '请输入姓名',
      span: 8
    }
  ]
  export default {
    mixins: [utillist],
    props: ['userData', 'vipUserList'],
    data () {
      let queryObj = this.$ever.createObjFromSchema(schema)
      queryObj.benefitId = this.userData.id
      queryObj.status = 0
      return {
        querySchema: schema,
        queryObj: queryObj,
        tableData: [],
        tableData1: [],
        dialogTableVisible: false,
        benefitId: 0,
        validPeriod: '',
        offset: 0,
        pagesize: 20,
        totalCount: 0,
        pageLayout: 'total, sizes, prev, pager, next, jumper',
        isGroup: this.$route.matched[0].meta.manage ? 1 : 0,
      }
    },
    methods: {
      unBind (i, rs) {
        userapi.unBindUser(rs.id).then(result => {
          this.list()
        })
      },
      handleDel (index, rows) {
        rows.splice(index, 1)
      },
      onDialogClose () {
        this.dialogTableVisible = false
      },
      showSelectUserPop (name) {
        this.$emit('selectUser', {'tableData': this.tableData, 'name': name})
      },
      list (refresh) {
        if (this.userData.id) {
          let params = {'benefitId': this.userData.id, patientId: this.queryObj.patientId, isGroup: this.isGroup}
          if (refresh) {
            this.offset = 0
          }
          for (let key in params) {
            if (params[key] === '') {
              delete params[key]
            }
          }
          params.offset = this.offset
          params.pagesize = this.pagesize
          this.benefitId = this.userData.id
          this.validPeriod = this.userData.validPeriod
          userapi.list(params).then(result => {
            if (result && result.data && result.data.resultList) {
              result.data.resultList.forEach(item => {
                item.noDel = true
              })
              this.tableData.benefitId = this.benefitId
              result.data.resultList.forEach(item => {
                item.startDate = item.startDate.split(' ')[0]
                item.endDate = item.endDate.split(' ')[0]
              })
            }
            this.tableData.list = result.data.resultList || []
            this.totalCount = result.data.totalCount || 0
            this.tableData1 = this.tableData.list
          })
        }
      }
    },
    watch: {
      'dialogTableVisible': function () {
        this.list(true)
      },
      'vipUserList': function () {
        let patientBenefits = []
        this.vipUserList.data.forEach(item => {
          let a = {}
          let t = new Date()
          let yyyy = t.getFullYear()
          let MM = t.getMonth() + 1
          let dd = t.getDate()
          let hh = t.getHours()
          let mm = t.getMinutes()
          let ss = t.getSeconds()
          if (!item.patientId) {
            a.patientId = item.id
            a.startDate = yyyy + '-' + MM + '-' + dd + ' ' + hh + ':' + mm + ':' + ss
            let endDateYear = yyyy + Math.floor((Number(MM) + this.validPeriod) / 12)
            let endDateMon = (Number(MM) + this.validPeriod) % 12
            let endM = endDateMon > 10 ? endDateMon : '0' + endDateMon
            a.endDate = endDateYear + '-' + endM + '-' + dd + ' ' + hh + ':' + mm + ':' + ss
            patientBenefits.push(a)
          }
        })
        let params = {benefitId: this.benefitId, patientBenefits}
        userapi.addVipUsers(params).then(result => {
          this.list()
        })
      }
    }
  }
</script>
