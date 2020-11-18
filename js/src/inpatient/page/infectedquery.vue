<template>
  <div id="infectedquery">
    <div class="layout_inner">
      <!-- 查询部分 -->
      <el-row>
        <el-col :span="24">
          <ever-form2
            :schema="schema"
            v-model="queryObj"
            :is-query="true"
            :inline="true"
            label-position="right"
            @query="search"
          >
            <template slot="patientId">
              <ever-patient-select
                v-model="queryObj.patientId"
                :showAttrType="false"
                style="width:200px; display:block;"
              ></ever-patient-select>
            </template>
            <template slot="daterange">
              <ever-range-picker :start.sync="queryObj.startTime" :end.sync="queryObj.endTime"></ever-range-picker>
            </template>
          </ever-form2>
        </el-col>
      </el-row>
      <!-- 表格部分 -->
      <el-row>
        <el-col :span="24">
          <el-table v-loading.body="loading" :data="tableData" style="width: 100%" border>
            <el-table-column label="门诊档案号" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.medicalSn}}</span>
              </template>
            </el-table-column>
            <el-table-column label="患者姓名">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="性别">
              <template slot-scope="scope">
                <span>{{scope.row.sex==1?'男':'女'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="年龄">
              <template slot-scope="scope">
                <span>{{scope.row.age}}</span>
              </template>
            </el-table-column>
            <el-table-column label="发病日期">
              <template slot-scope="scope">
                <span>{{scope.row.morbidityTime&&$moment(scope.row.morbidityTime).format('YYYY/MM/DD')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="诊断名称">
              <template slot-scope="scope">
                <span>{{scope.row.diseaseName&&scope.row.diseaseName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="诊断日期">
              <template slot-scope="scope">
                <span>{{scope.row.diseaseTime&&$moment(scope.row.diseaseTime).format('YYYY/MM/DD')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="科室">
              <template slot-scope="scope">
                <span>{{scope.row.dptName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="报告人">
              <template slot-scope="scope">
                <span>{{scope.row.reporter}}</span>
              </template>
            </el-table-column>
            <el-table-column label="报告日期">
              <template slot-scope="scope">
                <span>{{scope.row.reportTime&&$moment(scope.row.reportTime).format('YYYY/MM/DD')}}</span>
              </template>
            </el-table-column>
            <el-table-column label="报告卡分类">
              <template slot-scope="scope">
                <span>{{reportType(scope.row.reportType)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="就诊类型">
              <template slot-scope="scope">
                <span>{{visitType(scope.row.visitType)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="check(scope.row)">查看</el-button>
                <el-button type="text" @click="print(scope.row)">打印</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-col>
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </el-col>
      <infected-dialog
        :open="dialogVisible"
        :nosubmit="true"
        ref="form"
        :data-id="dataId"
        :schema-id="schemaId"
        @close="close"
      ></infected-dialog>
    </div>
  </div>
</template>
<script>
import api from '../store/infectedqueryapi.js'
import list from '@/util/list'
import infectedDialog from './casedialog/dialoginfected'
import { VISIT_TYPE, REPORT_TYPE } from '../util/inpatientConfig.js'
import { everprint } from '@/util/print'
import storage from '@/util/storage'
let schema = [
  {
    name: 'patientId',
    label: '患者姓名',
    span: 6,
    comp: 'custom'
  },
  {
    name: 'daterange',
    label: '报告日期',
    comp: 'custom'
  },
  {
    name: 'dptId',
    comp: 'ever-subject-select',
    label: '科室',
    props: {
      type: 'select',
      fields: 'orgSubjectCode',
      params: {
        staffIdList: [storage.getLocalStorage('USERID')]
      }
    }
  },
  {
    name: 'visitType',
    label: '就诊类型',
    comp: 'ever-select',
    props: {
      options: VISIT_TYPE
    }
  },
  {
    name: 'reportType',
    label: '报告卡分类',
    comp: 'ever-select',
    props: {
      options: REPORT_TYPE
    }
  }
]

export default {
  mixins: [list],
  props: {
    noStoreQuery: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    differentSelect: Boolean
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.requestSwitch = true
    return {
      api,
      val: '',
      tableData: [],
      currentData: {},
      dialogVisible: false,
      // dptList: [],
      schema,
      queryObj,
      schemaId: '',
      dataId: '',
      patientName: ''
    }
  },
  watch: {
    dptId (val) {
      this.queryObj.dptId = val
      this.queryObj.requestSwitch = !this.queryObj.requestSwitch
    }
  },
  computed: {
    reportType: function (val) {
      return function (val) {
        let type = ''
        switch (val) {
          case 1:
            type = '传染病'
            break
          case 2:
            type = '院感'
        }
        return type
      }
    },
    visitType: function (val) {
      return function (val) {
        let type = ''
        switch (val) {
          case 1:
            type = '住院'
            break
          case 2:
            type = '门诊'
        }
        return type
      }
    }
  },
  methods: {
    selectPatient (val) {
      this.queryObj.patientId = val.id
    },
    search () {
      delete this.queryObj.daterange
      delete this.queryObj.dpt
      this.list(true)
    },
    close (val) {
      this.dialogVisible = val
    },
    // 获取科室下拉列表
    // getDptList () {
    //   api.dptList().then(res => {
    //     // console.log('科室列表', res)
    //     res.map((item, index) => {
    //       this.dptList[index] = {
    //         name: item.name,
    //         id: item.id
    //       }
    //     })
    //   })
    // },
    check (row) {
      this.dialogVisible = true
      this.dataId = row.medicalRecord.id
      this.schemaId = row.medicalRecord.formTemplateId
    },
    print (row) {
      let obj = row.medicalRecord
      let params = {
        visitId: obj.visitId,
        patientId: obj.patientId,
        id: obj.id
      }
      everprint(obj.printCode, params, {preview: true})
    }
  },
  components: {
    infectedDialog
  }
}
</script>
<style lang="scss" scoped>
#infectedquery {
  .layout_inner {
    box-shadow: none;
  }
  .el-dialog.w1200 {
    width: 1200px !important;
  }
  .el-table {
    margin-top: 0px;
  }
}

.layout_box .layout_inner {
  padding: 15px;
  padding-bottom: 40px;
  min-height: 850px;
}
</style>
