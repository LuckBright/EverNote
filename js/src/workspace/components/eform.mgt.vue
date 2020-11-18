<template>
  <el-dialog id="eformmgt"
             title="评估单管理"
             append-to-body
             :visible.sync="dialogVisible"
             width="1240px">
    <div class="layout_inner" v-if="queryObj">
      <!-- 查询部分 -->
      <ever-form2 :schema="schema"
                  v-model="queryObj"
                  :is-query="true"
                  :inline="true"
                  @query="query(queryObj)">
        <template slot="patientName">
          <ever-patient-select v-model="patientName"
                               @select="selectPatient"
                               :showAttrType="false"></ever-patient-select>
        </template>
        <template slot="daterange">
          <ever-range-picker :start.sync="queryObj.startTime"
                             :end.sync="queryObj.endTime"></ever-range-picker>
        </template>
      </ever-form2>
      <!-- 表格部分 -->
      <el-table v-loading.body="loading"
                :data="tableData"
                style="width: 100%"
                :stripe="false"
                empty-text="暂无数据">
        <el-table-column prop="medicalSn"
                         label="病案号"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="patientName"
                         label="患者姓名"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="sex"
                         label="性别"
                         show-overflow-tooltip>
          <template slot-scope="scope"
                    show-overflow-tooltip>
            <span>{{scope.row.sex | formatSex}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         prop="age"
                         label="年龄">
          <template slot-scope="scope">
            <span>{{scope.row.age}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creatorName"
                         label="报告人"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime"
                         label="评估日期"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.createTime | formatDateByExp('YYYY-MM-DD')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="评估单分类"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{Fn(scope.row.type,type)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="就诊类型"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{Fn(scope.row.visitType,visitType)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text"
                       @click="check(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <ever-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :totalCount="totalCount"
                         :current="current"></ever-pagination>
      </el-row>
    </div>
    <phrform-dialog :title="phrform.title"
                    :tplCode="phrform.code"
                    :dataId="phrform.dataId"
                    :baseInfo="phrform.baseInfo"
                    ref="phrformdialog"
                    :readonly="true"
                    :nosubmit="true">
      <div slot="dialogFooter"
           class="pr20">
        <el-button type="primary"
                   @click="closephrform">关闭</el-button>
      </div>
    </phrform-dialog>
  </el-dialog>
</template>
<script>
import phrformDialog from '@/form/components/phrform.dialog.vue'
import list from '@/util/list'
import api from '../store/mainheaderapi'
export default {
  mixins: [list],
  data () {
    let type = [
      { id: 1, name: '受虐评估单' },
      { id: 2, name: '吸毒评估单' },
      { id: 3, name: '酗酒评估单' },
      { id: 4, name: '儿童评估单' },
      { id: 5, name: '成人评估单' }
    ]
    let visitType = [
      { id: 1, name: '住院' },
      { id: 2, name: '门诊' },
      { id: 3, name: '急诊' },
      { id: 4, name: '体检' }
    ]
    let schema = [
      {
        name: 'patientName',
        label: '患者姓名',
        comp: 'custom',
        props: {
          clearable: true
        }
      },
      {
        name: 'daterange',
        label: '评估日期',
        comp: 'custom'
      },
      {
        name: 'dptId',
        label: '科室',
        comp: 'ever-subject-select',
        props: {
          type: 'select',
          fields: 'orgSubjectCode'
        }
      },
      {
        name: 'visitType',
        label: '就诊类型',
        comp: 'ever-select',
        props: {
          options: visitType
        }
      },
      {
        name: 'type',
        label: '评估单分类',
        comp: 'ever-select',
        props: {
          options: type,
          filterable: true
        }
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(schema)
    queryObj.visitType = 2
    queryObj.dptId = this.$route.query.providerId
    queryObj.endTime = ''
    queryObj.startTime = ''
    return {
      api,
      type,
      visitType,
      dialogVisible: false,
      schema,
      queryObj,
      schemaId: '',
      loading: false,
      patientName: '',
      listApiName: 'search',
      phrform: {
        title: '',
        code: '',
        dataId: '',
        baseInfo: {}
      }
    }
  },
  methods: {
    selectPatient (val) {
      this.queryObj.patientId = val && val.id || ''
    },
    Fn (id, arr) {
      let str
      arr.forEach(val => {
        if (val.id === id) str = val.name
      })
      return str
    },
    check (item) {
      this.phrform.title = this.Fn(item.type, this.type)
      this.phrform.code = item.medicalRecord.code
      this.phrform.dataId = item.medicalRecord.id
      this.phrform.baseInfo = {
        visitNumber: item.medicalRecord.visitId,
        patientId: item.medicalRecord.patientId,
        providerId: item.dptId
      }
      this.$refs.phrformdialog.open()
    },
    closephrform () {
      this.$refs.phrformdialog.close()
    },
    open () {
      this.tableData = []
      this.dialogVisible = true
      this.query(this.queryObj)
    },
    close () {
      this.dialogVisible = false
    }
  },
  components: {
    phrformDialog
  }
}
</script>
<style lang="scss">
#eformmgt {
  .el-dialog__body {
    padding: 0px 20px 30px;
  }
  .el-form-item__label {
    line-height: 40px;
  }
}
</style>
