<template>
  <el-dialog
    :visible.sync="v"
    title="上传病案"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
  >
    <upload-data-log :visible.sync="visible" :uploadData="uploadData"></upload-data-log>
    <el-dialog :visible="uploadVisible" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" width="30%" append-to-body>
      <div class="u" style="height: 100px; line-height: 80px;text-align: center;">
        共上传 {{uploadLen}} 条病历信息，请稍后...
      </div>
    </el-dialog>
    <div>
      <el-table
        :data="tableData"
        border
        stripe
        ref="table"
        row-key="id"
        class="medicalTable"
        height="400"
        @selection-change="handleSelectionChange"
        >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="personName" label="患者姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="extendInfo" label="就医登记号" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.extendInfo && scope.row.extendInfo.jYDJH}}
          </template>
        </el-table-column>
        <el-table-column prop="visitNumber" label="住院号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="idno" label="身份证号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="uploadCaseStatus" label="病案状态" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.uploadCaseStatus | uploadCaseStatus}}</template>
        </el-table-column>

        <el-table-column prop="uploadCaseErrorMessage" show-overflow-tooltip label="失败原因" width="120"></el-table-column>
        <el-table-column prop="sectionName" label="科室名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="drName" label="医生姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tradeType" label="交易类型" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.tradeType | tradeType}}</template>
        </el-table-column>
        <el-table-column prop="hospitalizedEndDate" label="结算时间" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <div style="text-align:center; margin-top:20px;">
      <el-button type="primary" @click="upload">上传病案信息</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { orgList } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import { getMedicalRegisterInfo } from '@/rcm/store/hospital/hospital'
import uploadDataLog from './upload-data-log.vue'
import { tradeType } from '@/rcm/otmdiscomponent/config-js/medical-regInfo-config.js'
import { uploadMedical } from '@/rcm/store/otmdiscomponent/gd.localhost.api.js'
import list from '@/util/list'
export default {
  mixins: [list],
  components: {
    uploadDataLog
  },
  props: {
    medicalRecordVisi: {
      type: [Boolean]
    },
    paramObj: {
      type: [Object],
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      orgList,
      tableData: [],
      checkArr: [],
      visible: false,
      uploadData: [],
      uploadVisible: false,
      uploadLen: 0
    }
  },
  computed: {
    v: {
      get () {
        return this.medicalRecordVisi
      },
      set (val) {
        this.$emit('update:medicalRecordVisi', val)
      }
    }
  },
  filters: {
    tradeType (val) {
      let index = tradeType.find(item => item.id === val)
      return index && index.name
    },
    uploadCaseStatus (val) {
      return val ? '已上传' : '未上传'
    }
  },
  methods: {
    handleSelectionChange (arr) {
      this.checkArr = arr
    },
    // 取消
    cancel () {
      this.v = false
    },
    list: function (refresh) {
      var params = Object.assign({}, this.paramObj)
      for (let key in params) {
        if (params[key] === '') {
          delete params[key]
        }
      }
      params.page = 0
      params.offset = 0
      params.pagesize = 1000
      try {
        getMedicalRegisterInfo(params).then(result => {
          if (result) {
            this.tableData = result.data
            this.$nextTick(_ => {
              this.tableCheck()
            })
          }
        })
      } catch (err) {
      }
    },
    tableCheck () {
      this.tableData.forEach(item => {
        this.$refs.table.toggleRowSelection(item, true)
      })
    },
    upload () {
      if (!this.checkArr.length) {
        this.$messageTips(this, 'error', '请选择需要上传的病案')
        return
      }
      this.uploadLen = this.checkArr.length
      this.uploadVisible = true
      let snydActionParams = this.checkArr.map(item => { return { hospitalizedNumber: item.visitNumber, visitId: item.visitNumber, patientId: item.patientId, insuranceHospitalizedNumber: item.insuranceHospitalizedNumber } })
      uploadMedical({snydActionParams: snydActionParams}).then(rs => {
        if (!rs.head.errCode) {
          this.list()
          this.uploadData = rs.data
          this.uploadVisible = false
          this.visible = true
        } else {
          this.$messageTips(this, 'error', '上传病案失败')
        }
      }, rj => {
        this.$messageTips(this, 'error', '上传病案失败')
        this.uploadVisible = false
      })
    }
  }
}
</script>
