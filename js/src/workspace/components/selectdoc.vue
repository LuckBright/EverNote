<template>
  <div>
    <el-dialog
      :visible.sync="flag"
      width="1000px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <div slot="title">
        <div class="title">开证明</div>
        <patient-info ref="patient" :obj="patient"></patient-info>
      </div>
      <div class="margin">
        <div class="bottom">
          <div class="label">
            <span class="star">*</span>
            <span>选择就诊记录</span>
          </div>
          <div class="clear">
            <ever-table
              :is-single-table="true"
              :columns="columns"
              :data="tableData"
              @row-click="rowClick"
              :row-class-name="rowClassName"
            ></ever-table>
            <div class="fr">
              <el-pagination
                v-show="count > pagesize"
                small
                layout="prev, pager, next"
                :page-size="pagesize"
                :total="count"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
              ></el-pagination>
            </div>
          </div>
        </div>
        <div>
          <div class="lable">
            <span class="star">*</span>
            <span>选择证明类型</span>
          </div>
          <div>
            <el-select class="select" v-model="type" :disabled="!haveOption" @change="changeType">
              <el-option v-for="item in options" :key="item.id" :label="tplTypes[item.businessType]+item.name" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="flag = false" size="small">返回</el-button>
        <el-button type="primary" @click="openDoc" v-show="haveData && haveOption" size="small">下一步</el-button>
      </div>
    </el-dialog>
    <edit-doc
      :schema-id="schemaId"
      :title="`写证明`"
      :obj="recordObj"
      ref="doc"
      @update="update"
      @handle-click="handleClick('on')"
    ></edit-doc>
  </div>
</template>
<script>
import patientInfo from './patientinfo'
import api from '@/workspace/store/proofrecord'
import { debounce1 as debounce } from '@/util/common'
import editDoc from './editor'
export default {
  data () {
    return {
      tplTypes: {
        0: '[集团模版]',
        1: '[机构模版]',
        2: '[个人模版]',
        3: '[科室模版]'
      },
      schemaId: '',
      first: true,
      defaulIndex: -1,
      defaultRowStatus: true, // 是否默认选中第一行
      recordObj: {},
      typeObj: {},
      options: [],
      count: 0,
      pagesize: 5,
      currentPage: 1,
      patient: this.obj,
      type: '',
      flag: false,
      html: '',
      columns: [
        {
          prop: 'hospitalizedTime',
          label: '就诊时间',
          formatter: this.formatTime
        },
        {
          prop: 'visitTenantSubjectName',
          label: ' 就诊科室'
        },
        {
          prop: 'visitDoctorName',
          label: ' 医生'
        },
        {
          prop: 'allDiagnosis',
          label: '诊断',
          formatter: this.formatContent,
          showOverflowTooltip: true
        }
      ],
      tableData: []
    }
  },
  methods: {
    rowClassName ({ row, rowIndex }) {
      if (this.first) {
        // 只在第一次加载数据时有默认选中
        const visitSn = this.$route.query.visitSn
        if (this.defaultRowStatus) {
          if (visitSn && this.visitSnMap[visitSn]) {
            if (row.visitSerialNumber === visitSn) {
              this.defaulIndex = rowIndex
              return 'current-row'
            }
          } else {
            this.defaulIndex = 0
            if (rowIndex === this.defaulIndex) {
              return 'current-row'
            }
          }
        }
      }
    },
    update () {
      this.$emit('update')
    },
    changeType (val) {
      for (let i = 0; i < this.options.length; i++) {
        const item = this.options[i]
        if (item.id === val) {
          Object.assign(this.recordObj, item)
          this.schemaId = item.formTemplateId
          this.recordObj.dptId = this.recordObj.visitTenantSubjectCode
          this.recordObj.code = item.code
          this.recordObj.templateScopeId = item.id
          return
        }
      }
    },
    rowClick ({ row }, flag = false) {
      this.defaultRowStatus = flag
      this.recordObj = JSON.parse(JSON.stringify(row))
      Object.assign(this.recordObj, this.obj)
      this.getType(row)
    },
    toggle () {
      this.flag = !this.flag
      this.refresh()
    },
    handleCurrentChange (val) {
      this.first = false
      this.type = ''
      this.currentPage = val
      this.options = []
      this.list()
    },
    list () {
      api
        .list({
          patientId: this.patient.id,
          pagesize: this.pagesize,
          offset: (this.currentPage - 1) * this.pagesize,
          visitOrgId: this.$store.state.currentUser.organizationId,
          visitStatusIn: [3, 4]
        })
        .then(results => {
          this.tableData = results.data.resultList
          this.visitSnMap = {}
          this.tableData.forEach(item => {
            this.visitSnMap[item.visitNumber] = true
          })
          if (this.tableData.length === 0 && this.currentPage === 1) {
            this.$emit('no-data')
          }
          this.count = results.data.totalCount
        })
    },
    openDoc () {
      this.$refs.doc.toggle()
      this.$refs.doc.dptId = this.recordObj.dptId
      this.schemaId = this.recordObj.formTemplateId
      this.$bus.$emit('send:sendTemplateScopeId', this.recordObj.templateScopeId)
      this.flag = false
      this.handleClick()
    },
    handleClick (type = 'off') {
      this.$emit('handle-click', type)
    },
    refresh () {
      this.type = ''
      this.options = []
      this.tableData = []
      this.first = true
      this.currentPage = 1
      this.defaultRowStatus = true
      this.list()
    },
    getType: debounce(function (row) {
      const dptId = row.visitTenantSubjectCode
      api.getType({ type: '9', dptId: dptId, role: '1' }).then(res => {
        if (res.data.length) {
          this.type = res.data[0].id
          this.typeObj = res.data[0]
          this.schemaId = this.typeObj.formTemplateId
          this.recordObj.dataId = `-1`
          this.recordObj.dptId = dptId
          this.recordObj.code = res.data[0].code
          this.recordObj.templateScopeId = res.data[0].id
        } else {
          if (this.flag) {
            this.$messageTips(
              this,
              'warning',
              `${
                row.visitTenantSubjectName
              }没有绑定证明记录表单，请到病历类型管理中配置`,
              '提示'
            )
          }
        }
        this.options = res.data
      })
    }, 300),
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
    formatTime ({ value }) {
      return value ? this.$moment(value).format('YYYY-MM-DD') : ''
    }
  },
  props: {
    obj: {
      type: Object
    }
  },

  computed: {
    haveData () {
      return this.tableData.length !== 0
    },
    haveOption () {
      return this.options.length !== 0
    }
  },
  watch: {
    flag (val) {
      this.defaulIndex = -1
    },
    obj (val) {
      this.patient = val
      this.tableData = []
      this.list()
    },
    defaulIndex (val) {
      if (this.first && typeof val === 'number' && val !== -1) {
        this.rowClick({ row: this.tableData[val] }, true)
      }
    }
  },
  components: {
    patientInfo,
    editDoc
  }
}
</script>
<style scoped lang="scss">
.title {
  font-size: 16px;
  color: #333333;
  line-height: 16px;
  margin-top: 6px;
}
.star {
  color: #ee4433;
  vertical-align: sub;
}
.label {
  font-size: 14px;
  color: #333333;
  line-height: 14px;
  margin: 10px 0px;
}
.select {
  width: 300px;
}
.margin {
  margin-top: -10px;
}
</style>
