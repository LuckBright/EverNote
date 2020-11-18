<!-- 文件已废弃，删不删再说，反正是不用了 -->
<template>
  <div style="height: 97%">
    <ever-bread-crumb
      style="margin-top: -10px"
      :name="crumbName ? crumbName: '新建随访计划'"
      show-edit-fnt="false"
      :have-return="true"
    ></ever-bread-crumb>
    <div class="bg">
      <div style="padding: 4px">
        <el-tabs v-model="activeName2">
          <el-tab-pane label="住院患者" name="first">
            <hospital-list></hospital-list>
          </el-tab-pane>
          <el-tab-pane label="门诊患者" name="second">
            <div>
              <el-row class="border-b">
                <el-col :span="20" style="height: 38px;">
                  <!-- {{options4}} -->
                  <ever-form2
                    :schema="querySchema"
                    v-model="queryObj"
                    ref="form"
                    :inline="true"
                    :is-query="true"
                    v-ever-bind-enter
                    @query="list(true)"
                  >
                    <template slot="date">
                      <ever-range-picker
                        :start.sync="queryObj.startDate"
                        :end.sync="queryObj.endDate"
                      ></ever-range-picker>
                    </template>
                    <template slot="mainDiagCode">
                      <el-select
                        v-model="queryObj.mainDiagCode"
                        :multiple="false"
                        filterable
                        clearable
                        remote
                        reserve-keyword
                        placeholder="请输入"
                        :remote-method="remoteMethod"
                        :loading="loading"
                      >
                        <el-option
                          v-for="item in options4"
                          :key="item.diseaseCode"
                          :label="item.label"
                          :value="item.diseaseCode"
                        ></el-option>`
                      </el-select>
                    </template>
                    <template slot="default">
                      <el-form-item>
                        <el-button @click="list(true)">查询</el-button>
                        <el-button type="primary" @click="reset">重置</el-button>
                      </el-form-item>
                    </template>
                  </ever-form2>
                </el-col>
                <el-col :span="4" align="right">
                  <el-button
                    type="primary"
                    :disabled="selection.length > 0 ? false : true"
                    @click="addfollow"
                  >添加随访</el-button>
                </el-col>
              </el-row>
            </div>
            <div class="bg">
              <el-row>
                <el-col :span="24">
                  <el-table :data="tableData" border @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="patientName" label="患者姓名" :span="2"></el-table-column>
                    <el-table-column label="性别" :span="2">
                      <template slot-scope="scope">
                        <sys-value type="GBT.2261.1" :code="scope.row.sex"></sys-value>
                      </template>
                    </el-table-column>
                    <el-table-column label="出生日期" prop="birthday" :span="2"></el-table-column>
                    <el-table-column label="电话号码" prop="mobile" :span="2"></el-table-column>
                    <el-table-column label="看诊科室" prop="regProvName" :span="2"></el-table-column>
                    <el-table-column label="门诊诊断" prop="mainDiagResult" :span="2"></el-table-column>
                    <el-table-column label="看诊日期" prop="visitDate" :span="2"></el-table-column>
                  </el-table>
                  <ever-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :totalCount="totalCount"
                  ></ever-pagination>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <dialog-addfollowup
      :patientIds="patientIds"
      :visible="dialogVisible"
      @close="close"
      @update="update"
      ref="addFollow"
    ></dialog-addfollowup>
  </div>
</template>
<script>
import api from '@/crm/store/healthy/followapi'
import wapi from '@/arrange/store/appointapi'
import dialogAddfollowup from '@/crm/page/healthy/dialog.addfollowup'
import list from '@/util/list'
import hospitalList from '@/crm/page/healthy/hospitalpatientlist'
let querySchema = [
  {
    name: 'date',
    label: '日期',
    comp: 'custom'
  },
  {
    name: 'providerId',
    label: '看诊科室',
    comp: 'el-select',
    props: {
      options: [],
      placeholder: '请选择入院科室',
      filterable: true
    }
  },
  {
    name: 'mainDiagCode',
    label: '主要诊断',
    comp: 'custom'
  }
]
export default {
  mixins: [list],
  data () {
    let start = this.$moment().startOf('day')
    let end = this.$moment().startOf('day')
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.startDate = start.subtract(6, 'days').format('YYYY-MM-DD')
    queryObj.endDate = end.format('YYYY-MM-DD')
    return {
      api: api,
      listApiName: 'getPatientlist',
      wapi,
      queryObj,
      querySchema,
      imgId: '',
      dialogVisible: false,
      crumbName: '',
      options4: [],
      selection: [],
      patientIds: '',
      loading: false,
      activeName2: 'first'
    }
  },
  created () {
    this.getDptlist()
    this.getDisease()
  },
  methods: {
    reset () {
      this.queryObj = this.$ever.createObjFromSchema(querySchema)
      this.list(true)
    },
    getDptlist () {
      wapi
        .getWarehouseDeptList({
          codesMatchValues: [
            {
              codes: ['SXX000002'],
              value: ''
            }
          ]
        })
        .then(rs => {
          this.$ever.getFieldFromSchema(
            this.querySchema,
            'providerId'
          ).props.options = rs.data
        })
    },
    getDisease () {
      api
        .diseaseSearch({
          type: 2,
          name: this.queryObj.mainDiagCode
        })
        .then(rs => {
          if (rs.head.errCode === 0) {
            this.options4 = rs.data.resultList.map(item => {
              return {
                value: item.id,
                label: item.diseaseName,
                diseaseCode: item.diseaseCode
              }
            })
          }
        })
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        this.queryObj.mainDiagCode = query
        this.getDisease()
        setTimeout(() => {
          this.loading = false
          this.options4.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this.options4 = []
      }
    },
    handleSelectionChange (val) {
      this.selection = val
    },
    addfollow () {
      this.patientIds = this.selection
      this.$refs.addFollow.patientSource = 2
      this.dialogVisible = true
    },
    close () {
      this.dialogVisible = false
    },
    update (id) {
      this.dialogVisible = false
      this.list(true)
      this.getDptlist()
      this.getDisease()
    }
  },
  components: {
    dialogAddfollowup,
    hospitalList
  }
}
</script>
<style scoped lang="scss">
.bg {
  background-color: #fff;
  height: 100%;
  /deep/ .el-tabs__nav-scroll {
    height: 30px;
  }
}
.pd20 {
  padding: 20px;
}
</style>

