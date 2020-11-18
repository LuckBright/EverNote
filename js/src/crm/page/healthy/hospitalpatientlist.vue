<template>
  <div>
    <div class="bg">
      <el-row class="border-b">
        <el-col :span="20" style="height: 38px;">
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
              <ever-range-picker :start.sync="queryObj.startDate" :end.sync="queryObj.endDate"></ever-range-picker>
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
        <el-table-column label="住院科室" prop="provName" :span="2"></el-table-column>
        <el-table-column label="主要诊断" prop="mainDiagResult" :span="2">
          <template
            slot-scope="scope"
          >{{scope.row.mainDiagResult == null ? '--' : scope.row.mainDiagResult}}</template>
        </el-table-column>
        <!-- <el-table-column label="手术医嘱"  prop="surgeryAdviceName" :span="2">
               <template slot-scope="scope">
                    {{scope.row.surgeryAdviceName == null ? '--' : scope.row.surgeryAdviceName}}
               </template>
        </el-table-column>-->
        <el-table-column label="入院日期" prop="visitDate" :span="2">
          <template slot-scope="scope">{{scope.row.visitDate | formatDateByExp('YYYY/MM/DD')}}</template>
        </el-table-column>
        <!-- <el-table-column label="手术时间"  prop="surgeryTime" :span="2">
               <template slot-scope="scope">
                    {{scope.row.surgeryTime | formatDateByExp('YYYY/MM/DD')}}
               </template>
        </el-table-column>-->
        <el-table-column label="出院日期" prop="outHosDate" :span="2">
          <template slot-scope="scope">{{scope.row.outHosDate | formatDateByExp('YYYY/MM/DD')}}</template>
        </el-table-column>
      </el-table>
      <ever-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :totalCount="totalCount"
      ></ever-pagination>
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
let querySchema = [
  {
    name: 'date',
    label: '出院日期',
    comp: 'custom'
  },
  {
    name: 'providerId',
    label: '入院科室',
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
      listApiName: 'getHospitalPatient',
      wapi,
      queryObj,
      querySchema,
      imgId: '',
      dialogVisible: false,
      crumbName: '',
      options4: [],
      selection: [],
      patientIds: '',
      loading: false
    }
  },
  created () {
    this.getDptlist()
    this.getDisease()
  },
  methods: {
    reset () {
      this.queryObj = this.$ever.createObjFromSchema(querySchema)
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
        }, 100)
      } else {
        this.options4 = []
      }
    },
    handleSelectionChange (val) {
      this.selection = val
    },
    addfollow () {
      this.patientIds = this.selection
      this.$refs.addFollow.patientSource = 1
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
    dialogAddfollowup
  }
}
</script>
<style scoped>
.bg {
  background-color: #fff;
}
.pd20 {
  padding: 20px;
}
.pdb20 {
  padding: 0 20px;
}
</style>
