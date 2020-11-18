<template>
  <div v-loading.body="loading">
    <div class="layout_inner">
      <ever-query-form :schema="querySchema" v-model="queryObj" @query="query">
      </ever-query-form>
      <el-row>
        <el-col :span="6">
          患者：{{patientInfo.patientName}}
        </el-col>
        <el-col :span="6">
          诊号: {{patientInfo.rootorderid}}
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        >
        <el-table-column
          prop="recipeName"
          label="处方单据"
          align="center">
        </el-table-column>
        <el-table-column
          prop="itemname"
          label="项目名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="spec"
          label="规格"
          align="center">
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="数量"
          align="center">
        </el-table-column>
        <el-table-column
          prop="unit"
          label="单位"
          align="center">
        </el-table-column>
      </el-table>
      <div style="height: 36px;">
        <el-button type="primary" style="float: right;" @click="medicalinfo" :disabled="!(queryObj.patientID && queryObj.rootorderid && tableData.length)">提交</el-button>
      </div>
      <dialogmedicalinfo :dialogmedicalinfovisible.sync="dialogmedicalinfovisible" :medicalobj="medicalobj" @getMedDetails="submit" ref="medicalinfo"></dialogmedicalinfo>
      <!-- <el-row>
        <ever-pagination
          :page-sizes="pageSizes"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount">
        </ever-pagination>
      </el-row> -->
    </div>
  </div>
</template>
<script>
import accountbillapi from '../store/accountbillapi'
import settlementapi from '../store/settlementapi'
import medicalinsuranceapi from '../store/medicalinsuranceapi'
import list from '../../util/list'
import dialogmedicalinfo from '@/rcm/otmdiscomponent/dialog-medicalinfo.vue'

let schema = [
  {
    name: 'patientID',
    label: '患者姓名',
    placeholder: '输入患者姓名',
    type: 'patientselect',
    options: []
  },
  {
    name: 'rootorderid', // "100018720180201121954"
    label: '诊号'
  }
]
export default {
  mixins: [list],
  data () {
    var obj = this.$ever.createObjFromSchema(schema)
    return {
      querySchema: schema,
      queryObj: obj,
      accountbillapi,
      settlementapi,
      tableData: [],
      totalCount: 0,
      loading: false,
      patientInfo: {},
      medicalobj: {},
      dialogmedicalinfovisible: false
    }
  },
  methods: {
    list () {
      if (this.queryObj.patientID && this.queryObj.rootorderid) {
        this.loading = true
        accountbillapi.getHelpList(Object.assign({}, this.queryObj)).then(result => {
          this.tableData = []
          this.loading = false
          if (result.head.errCode === 0) {
            this.tableData = result.data
            this.getPatientInfo()
          }
        }, errorFn => {
          this.loading = false
          this.tableData = []
        })
      }
    },
    getPatientInfo () {
      this.loading = true
      let that = this
      accountbillapi.settlelist({
        rootOrderId: this.queryObj.rootorderid,
        patientID: this.queryObj.patientID
      }).then(result => {
        this.loading = false
        that.patientInfo = Object.assign({}, that.patientInfo, {
          patientName: result.data[0].patientName,
          patientAge: result.data[0].patientAge,
          patientMobile: result.data[0].patientMobile,
          orderDeptName: result.data[0].orderDeptName,
          rootorderid: result.data[0].rootorderid,
          doctorName: result.data[0].doctorName,
          booktime: result.data[0].booktime.replace(/-/g, '/')
        })
      })
    },
    medicalinfo () {
      this.loading = true
      this.$refs.medicalinfo.showconfirmbtn = true
      medicalinsuranceapi.getPersonInfoExRx().then(result => {
        this.loading = false
        if (result.head.errCode === 0) {
          if (result.head.errMsg && result.head.errMsg !== 'Success') {
            this.$notify({
              type: 'warning',
              message: result.head.errMsg
            })
          }
          this.medicalobj = Object.assign({}, this.medicalobj, result.data)
          if (this.medicalobj.personname === this.patientInfo.patientName) {
            this.dialogmedicalinfovisible = true
          } else {
            this.$notify({
              type: 'error',
              message: '非本人医保卡'
            })
          }
        }
      }, errorFn => {
        this.loading = false
      })
    },
    submit () {
      settlementapi.getHelpMedDetails({
        patientId: this.queryObj.patientID,
        visitNum: this.queryObj.rootorderid
      }).then(result => {
        if (result.head.errCode === 0) {
          this.$notify({
            type: 'success',
            message: '上传成功'
          })
          if (result.head.errMsg && result.head.errMsg !== 'Success') {
            this.$notify({
              type: 'warning',
              message: result.head.errMsg
            })
          }
        } else {
          this.$notify({
            type: 'error',
            message: '上传失败'
          })
        }
      }, errorFn => {
        this.$notify({
          type: 'error',
          message: '上传失败'
        })
      })
    }
  },
  components: {
    dialogmedicalinfo
  }
}
</script>
