<template>
  <div class="container">
    <ever-form2 :schema="schema" v-model="queryObj" :inline="true" :nosubmit="true">
      <template slot="name">
        <ever-patient-select
          width="300px"
          v-model="patientName"
          @select="selectPatient"
          :grey-denies-dialog-show="true"
        ></ever-patient-select>
        <el-button type="primary" @click="list" style="margin-left:8px" size="small">查询</el-button>
      </template>
    </ever-form2>
    <patient-info v-show="havePatient" v-if="patient" :obj="patient" ref="patient"></patient-info>
    <el-button
      type="primary"
      @click="openDoc('doc')"
      size="small"
      v-show="havePatient && !nodata"
    >开证明</el-button>
    <div class="title" v-show="havePatient">
      <span class="border"></span>
      <span class="text">患者证明记录</span>
      <span class="border"></span>
    </div>
    <div>
      <ever-table v-show="haveData" :columns="columns" :data="tableData" @eventChange="eventChange"></ever-table>
      <div class="fr">
        <el-pagination
          v-show="(count > pagesize) && haveData"
          small
          layout="total ,prev, pager, next"
          :page-size="pagesize"
          :total="count"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
        ></el-pagination>
      </div>
      <div v-show="!haveData">
        <ever-NoData></ever-NoData>
      </div>
    </div>
    <select-doc
      ref="doc"
      :obj="patient"
      v-if="patient.id"
      @no-data="noRecord"
      @update="handleCurrentChange(1)"
      @handle-click="handleClick"
    ></select-doc>
    <detail-doc :title-info="detailObj.certificationName" ref="detail" :obj="detailObj"></detail-doc>
    <edit-doc
      :title-info="`编辑证明`"
      ref="edit"
      :schema-id="detailObj.formTemplateId"
      :obj="detailObj"
      @update="handleCurrentChange(1)"
      @handle-click="handleClick('on')"
    ></edit-doc>
  </div>
</template>
<script>
import { tableColWidth } from '@/util/table-config'

import api from '@/workspace/store/proofrecord'
import patientInfo from './patientinfo'
import selectDoc from './selectdoc'
import { passport } from '@/card/store/passportapi'
import detailDoc from './detaildoc'
import editDoc from './editor'
import phrapi from '@/form/store/phrapi'
import docapi from '@/form/store/api'
import { jcpPrintEditor } from '@/util/common'
import {commandLog} from '@/phr/mixin/operationLog.js'
const schema = [
  {
    name: 'name',
    comp: 'custom'
  }
]
export default {
  name: 'proofRecord',
  components: {
    selectDoc,
    patientInfo,
    detailDoc,
    editDoc
  },
  data () {
    let queryObj = this.$ever.createObjFromSchema(schema)
    return {
      schemaId: '',
      nodata: false,
      detailObj: {},
      pagesize: 5,
      count: 0,
      currentPage: 1,
      schema,
      queryObj,
      flag: false,
      title: '开证明',
      tableData: [],
      columns: [
        {
          prop: 'certificationName',
          label: '证明名称',
          type: 'eventText',
          width: tableColWidth.name5W90,
          event: 'detail',
          showOverflowTooltip: true
        },
        {
          prop: 'createTime',
          label: ' 创建时间',
          formatter: this.formatTime,
          width: 140
        },
        {
          prop: 'createName',
          label: ' 创建人'
        },
        {
          prop: 'updateTime',
          label: '最后一次修改时间',
          formatter: this.formatTime,
          width: `140`
        },
        {
          prop: 'updateName',
          label: '修改人'
        },
        {
          prop: 'treatmentTime',
          label: '就诊时间',
          formatter: this.formatTime,
          width: '140'
        },
        {
          prop: 'deptName',
          label: '就诊科室'
        },
        {
          prop: 'allDiagResult',
          label: '诊断',
          formatter: this.formatContent,
          showOverflowTooltip: true
        },
        {
          key: 'ever-op', // 该列的唯一标示，没有prop时应该加上该属性
          type: 'btns',
          label: '操作',
          btns ({ row }) {
            let baseBtns = [
              {
                prop: 'print',
                label: '打印'
              }
            ]
            if (row.isCurrentDay) {
              baseBtns = [...baseBtns, 'del', 'edit']
            }
            return baseBtns
          },
          width: 160
        }
      ],
      patient: {},
      html: '',
      patientName: '',
      patientId: this.$route.query.patientId
    }
  },
  computed: {
    haveData () {
      return this.tableData.length !== 0
    },
    havePatient () {
      return this.patientName !== ''
    }
  },
  methods: {
    handleClick (type, templateScopeId) {
      // bug15991
      this.$emit('handle-click', type)
    },
    noRecord () {
      this.nodata = true
      this.$messageTips(this, 'warning', `此患者没有就诊记录`, '提示')
    },
    formatContent ({ value }) {
      const arr = []
      if (Array.isArray(value)) {
        value.forEach(item => {
          item.notify = ''
          item.checked = ''
          if (item.comment) {
            item.notify = `(${item.comment})`
          }
          if (item.diagnoseType === 2) {
            item.checked = '?'
          }
          if (item.diseaseName) {
            arr.push(
              `${item.diseaseNameEn || ''} ${item.diseaseName}${item.notify}${
                item.checked
              }`
            )
          } else if (item.diagName) {
            arr.push(
              `${item.diagNameEn || ''} ${item.diagName}${item.notify}${
                item.checked
              }`
            )
          }
        })
      }
      return arr.join(',')
    },
    async print (row) {
      const htmlObj = await phrapi.getByRecordId4FormData(row.medicalRecordId)
      const config = await docapi.getTpl(row.formTemplateId)
      let pageSettings = config.pageSettings || {}
      let printConfig = {}
      commandLog({
        content: `打印证明记录`,
        opModuleOne: `电子病历-门诊病历-证明记录`,
        opType: 'PRINT',
        visitNumber: this.$route.query.visitSn,
        patientId: this.$route.query.patientId,
        patientName: this.$route.query.patientName
      })
      jcpPrintEditor(this, printConfig, pageSettings, [{ dom: htmlObj.data.text }])
    },
    formatTime ({ value }) {
      return value ? String(value).substr(0, 16) : ''
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.list()
    },
    remoteMethod (id) {
      if (!id) {
        this.patient = {}
        this.patientId = ''
        return
      }
      return passport
        .get('patient/searchFuzzy', {
          params: {
            keyword: id
          }
        })
        .then(results => {
          this.patient = results.data.resultList.length
            ? results.data.resultList[0]
            : {}
          this.patientId = this.patient.id ? this.patient.id : ''
          this.patientName = this.patient.name
          this.list()
        })
    },
    openDoc (type) {
      commandLog({
        content: `${type === 'doc' ? '新建证明记录' : '编辑证明记录'}`,
        opModuleOne: `电子病历-门诊病历-证明记录`,
        opType: type === 'doc' ? 'CLICK_CREATE' : 'CLICK_EDIT',
        visitNumber: this.$route.query.visitSn,
        patientId: this.$route.query.patientId,
        patientName: this.$route.query.patientName
      })

      this.$refs[type].toggle()
    },
    eventChange ({ prop, row }) {
      if (prop === 'edit') {
        this.$nextTick(() => {
          this.openDoc('edit')
          this.handleClick('off')
        })
      } else if (prop === 'del') {
        this.del(row.medicalRecordId)
      } else if (prop === 'print') {
        this.print(row)
      } else if (prop === 'detail') {
        this.$nextTick(() => {
          this.openDoc('detail')
        })
      }
      Object.assign(this.detailObj, this.patient, row)
    },
    list () {
      if (!this.patientId) {
        return
      }
      api
        .getProof({
          patientId: this.patientId,
          pagesize: this.pagesize,
          offset: (this.currentPage - 1) * this.pagesize
        })
        .then(res => {
          this.tableData = res.data.resultList ? res.data.resultList : []
          this.count = res.data.totalCount
        })
    },
    refresh () {
      this.patientId = this.$route.query.patientId
        ? this.$route.query.patientId
        : ''
      this.remoteMethod(this.patientId)
      this.patientName = ''
      this.tableData = []
      this.nodata = false
    },
    del (id) {
      phrapi.del(id).then(_ => {
        commandLog({
          content: `删除证明记录`,
          opModuleOne: `电子病历-门诊病历-证明记录`,
          opType: 'DELETE',
          visitNumber: this.$route.query.visitSn,
          patientId: this.$route.query.patientId,
          patientName: this.$route.query.patientName
        })
        this.$messageTips(this, 'success', '删除成功', '提示')
        this.handleCurrentChange(1)
      })
    },
    closeDoc () {
      this.title = '证明记录'
    },
    selectPatient (val) {
      if (val) {
        this.patient = val
        this.patientId = this.patient.id ? this.patient.id : ''
        this.list()
      } else {
        this.clear()
      }
    },
    clear () {
      this.patientId = ''
      this.tableData = []
    }
  },
  watch: {}
}
</script>
<style scoped lang="scss">
.container {
  min-height: 200px;
  width: 1000px;
}
.name {
  cursor: pointer;
  color: blue;
  user-select: none;
}
/deep/ .el-form .el-form-item {
  margin-bottom: 0px;
}
/deep/ .el-table {
  margin: 0px;
  margin-top: -10px;
}
.back {
  position: absolute;
  left: 0px;
  top: -10px;
}
.save {
  position: absolute;
  bottom: 0px;
  left: 0px;
  background-color: white;
  width: 100%;
}
.ui_dialog_02 {
  /deep/ .el-dialog .el-dialog__body {
    max-height: 600px;
  }
}
.border {
  display: inline-block;
  border: 1px solid #dddddd;
  width: 74px;
  margin: 0px 15px;
}
.title {
  text-align: center;
}
.text {
  font-size: 12px;
  color: #999999;
  line-height: 12px;
  vertical-align: sub;
}
</style>

