<template>
  <div class="flex_column_full flex_column_full_hidden checkjianyan">
    <div class="title">
      <ever-form2
        v-model="obj"
        :schema="schema"
        :gutter="20"
        :is-query="true"
        :inline="true"
        label-position="right"
        @query="query">
        <template slot="default">
          <el-form-item>
            <el-button
              type="primary"
              @click="query">
              查询
            </el-button>
          </el-form-item>
          <el-form-item class="fenye">
            <el-divider direction="vertical"></el-divider>
            当前第 {{ currentPage }} 页/共 {{ totalPage }} 页
            <span @click="prev" :class="{'disabled': hidePrev}"><i class="iconfont icon-PathCopy"></i></span>
            <span v-for="v in totalPage" :key="v"
                  @click="getCurrent(v)" 
                  :class="{'pageBlue': currentPage === v, 'disabled': currentPage === v}">
                  {{v}}</span>
            <span @click="next" :class="{'disabled': hideNext}"><i class="iconfont icon-next"></i></span>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <div
      id="pdf_outer_jianyan"
      class="flex_col_1_auto jianyanwrap">
      <el-row class="tablewrap">
        <el-col :span="leftSpan" class="tableCon" :style="{width: !hideTable ? '25%' : 0, marginRight: !hideTable ? '10px' : 0}">
          <el-table
            ref="jyTable"
            highlight-current-row
            :data="leftTableData"
            @row-click="showDetail"
            @header-click="headerClick">
            <el-table-column
              :header-align="columnAlign"
              prop="inspectionReportDate"
              show-overflow-tooltip
              label="报告日期">
              <template slot-scope="scope">
                {{ scope.row.inspectionReportDate}}
              </template>
            </el-table-column>
            <el-table-column
              :header-align="columnAlign"
              prop="inspectionServiceName"
              show-overflow-tooltip
              label="检验名称">
              <template slot-scope="scope">
                <template >{{ scope.row.inspectionServiceName }}</template>
              </template> 
            </el-table-column>
            <el-table-column
              width="35"
              prop="openIcon"
              header-align="right">
              <template
                slot="header">
                <i class="iconfont icon-date_lefe hand"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="middleSpan">
          <div
            class="expand"
            @click="hideTable = false">
            <i class="iconfont icon-date_right hand"></i>
          </div>
        </el-col>
        <el-col :span="rightSpan" class="mainCon">
          <paper-jianyan
            ref="paperjianyan"
            :select-option='selectOption'
            :start-index="startIndex"
            :header-data="patientInfo"
            :table-data="tableData"
            :show="showComponent"
            :pdf-height="pdfHeight"
            :pdf-url="pdfUrl">
          </paper-jianyan>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import storage from '@/util/storage'
  import urlMap from '@/inpatient/urls'
  import { request } from '@/util/req'
  import mixins from '@/inpatient/page/medicalrecord/mixins/info.view.mixins.js'
import pdfMixins from '@/inpatient/page/medicalrecord/mixins/pdf.mixins.js'
  import { dateFormat } from '@/util/common'

  export default {
    name: 'check_jianyan',
    mixins: [mixins, pdfMixins],
    props: {
      patientId: {
        type: String
      },
      hospitalizedNumber: {
        type: String
      },
      deptId: {
        type: String
      }
    },
    data () {
      let schema = [
        {
          name: 'inspectionServiceName',
          label: '检验名称'
        },
        {
          name: 'inspectionReportDate',
          label: '报告日期',
          comp: 'date-picker',
          props: {
            type: 'daterange',
            outformat: 'yyyy-MM-dd',
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间'
          }
        }
      ]
      let obj = this.$ever.createObjFromSchema(schema)
      return {
        schema,
        obj,
        leftTableData: [],
        patientInfo: {},
        tableData: [],
        pageSize: 20,
        totalPage: 1,
        currentPage: 1,
        tenantId: storage.getLocalStorage('TENANTID'),
        visitOrgId: storage.getLocalStorage('CLINICID'),
        pdfId: 'pdf_outer_jianyan',
        selectOption: []
      }
    },
    computed: {
      defaultQueryObj () {
        return {
          tenantId: this.tenantId,
          orgId: this.visitOrgId,
          tenantSubjectId: this.deptId,
          patientId: this.patientId,
          hospitalizedNumber: this.hospitalizedNumber,
          doctorAdviceStatusCode: '60' }
      },
      hidePrev () {
        return this.currentPage === 1
      },
      hideNext () {
        return this.currentPage === this.totalPage
      },
      startIndex () {
        return (this.currentPage - 1) * this.pageSize
      }
    },
    methods: {
      query () {
        this.showComponent = ''
        let queryObj = Object.assign({}, this.defaultQueryObj, this.obj)
        if (queryObj.inspectionReportDate && queryObj.inspectionReportDate.length === 2) {
          queryObj.reportStartTime = dateFormat(this.obj.inspectionReportDate[0], false, 'startDay')
          queryObj.reportEndTime = dateFormat(this.obj.inspectionReportDate[1], false, 'endDay')
        }
        delete queryObj.inspectionReportDate
        if (!queryObj.inspectionServiceName) {
          delete queryObj.inspectionServiceName
        }
        request(urlMap.quote.jianyan, queryObj).then(res => {
          if (res.head.errCode === 0) {
            if (res.data.length > 0) {
              this.leftTableData = this.makeLeftTableData(res.data)
              // 第一条数据非pdf时,渲染检验报告单
              if (res.data[0].resultReportSource !== '2') {
                this.setPatientInfo(res.data[0])
              } else {
                this.showDetail(this.leftTableData[0])
              }
            } else {
              this.leftTableData = []
              this.patientInfo = {}
              this.allTableData = []
              this.tableData = []
              this.totalPage = 1
              this.currentPage = 1
            }
          }
        })
      },
      makeLeftTableData (datas) {
        // 410需要加医技手写的检验报告
        datas.forEach(data => {
          data.pdfInfo = []
          data.reportResult = []
          if (data.resultReportSource === '2' && data.pdfReportUrl) {
            let pdfArr = JSON.parse(data.pdfReportUrl)
            for (let i = 0; i < pdfArr.length; i++) {
              let pdfObj = pdfArr[i]
              data.pdfInfo.push({ name: pdfObj.relName, url: pdfObj.fileId })
              data.reportResult.push({
                id: i,
                label: pdfObj.relName,
                value: JSON.stringify({name: pdfObj.relName, url: pdfObj.fileId, type: 'pdf'})
              })
            }
          }
          // data.reportResult.push({
          //   label: '手写报告',
          //   id: 'editorInfo',
          //   value: JSON.stringify({formDataId: 'bdad3dcb-7bbf-4881-822a-b812f9b787bc', formTemplateId: '9a95e5a2-2e04-46c2-844c-1a1dedc1fa90', type: 'editInfo'})
          // })
          if (data.formDataId && data.formTemplateId) {
            data.reportResult.push({
              label: '手写检验报告',
              id: 'editorInfo',
              value: JSON.stringify({formDataId: data.formDataId, formTemplateId: data.formTemplateId, type: 'editInfo'})
            })
          }
        })
        return datas
      },
      setPatientInfo (data) {
        this.showComponent = 'info'
        this.$refs.jyTable.setCurrentRow(data)
        if (data.visit) {
          this.$set(this.patientInfo, 'kebie', data.visit.visitTenantSubjectName)
          this.$set(this.patientInfo, 'bed', data.visit.visitBedName)
          if (data.visit.mainDiagnosis) {
            this.$set(this.patientInfo, 'linchuangzhenduan', data.visit.mainDiagnosis)
          } else {
            // 主诊断没有时拼接次诊断
            if (data.visit.admissionDiagnosis) {
              let result = []
              let admissionDiagnosis = JSON.parse(data.visit.admissionDiagnosisJson)
              admissionDiagnosis.forEach(item => {
                result.push(item.diseaseName)
              })
              this.$set(this.patientInfo, 'linchuangzhenduan', result.join())
            }
          }
          if (data.visit.patientInfo) {
            this.$set(this.patientInfo, 'name', data.visit.patientInfo.patientName)
            this.$set(this.patientInfo, 'age', this.$filters.birthdayComputed(data.visit.patientInfo.birthday))
            this.$set(this.patientInfo, 'sex', this.makeSex(data.visit.patientInfo.genderCode))
          }
        }

        this.$set(this.patientInfo, 'zhuyuanhao', data.hospitalizedNumber)
        this.$set(this.patientInfo, 'biaobenzhonglei', data.specimenTypeName)
        this.$set(this.patientInfo, 'yangbenbianhao', data.specimenNumber)
        this.$set(this.patientInfo, 'caiyangshijian', dateFormat(data.specimenSamplingDateTime, 'YYYY-MM-DD HH:mm'))
        this.$set(this.patientInfo, 'songjianyisheng', data.specimenDistributorName)
        this.$set(this.patientInfo, 'beizhu', data.applicationRemark)
        this.$set(this.patientInfo, 'jieshoushijian', dateFormat(data.specimenReceivedDate, 'YYYY-MM-DD HH:mm'))
        this.$set(this.patientInfo, 'baogaoshijian', dateFormat(data.inspectionReportDate, 'YYYY-MM-DD HH:mm'))
        this.$set(this.patientInfo, 'jianyanzhe', data.reportDoctorName)
        this.$set(this.patientInfo, 'shenhezhe', data.reportReviewDoctorName)

        if (data.inspectionResultDetails && data.inspectionResultDetails.length > 0) {
          this.allTableData = data.inspectionResultDetails
        } else {
          this.allTableData = []
        }
        this.totalPage = Math.ceil(this.allTableData.length / this.pageSize) || 1
        this.setPagination()
      },
      prev () {
        if (this.hidePrev) return
        this.currentPage--
        this.setPagination(this.currentPage)
      },
      getCurrent (num) {
        if (this.currentPage === num) return
        this.currentPage = num
        this.setPagination(this.currentPage)
      },
      next () {
        if (this.hideNext) return
        this.currentPage++
        this.setPagination(this.currentPage)
      },
      setPagination (current) {
        if (!current) current = 1
        let start = (current - 1) * this.pageSize
        this.tableData = this.allTableData.slice(start, start + this.pageSize)
      },
      showDetail (data) {
        this.showComponent = data.resultReportSource !== '2' ? 'info' : 'pdf'
        if (this.showComponent === 'pdf') {
          this.selectOption = data.reportResult
          // if (data.pdfInfo.length === 1) this.showPdf(data.pdfInfo[0])
          if (this.selectOption.length) {
            this.$nextTick(() => {
              this.$refs.paperjianyan.init()
            })
          }
          return
        }
        this.currentPage = 1
        this.setPatientInfo(data)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .checkjianyan {
    background: #f5f5f5;
  }
  .title {
    height: 32px;
    padding: 5px 5px;
    border-bottom: 1px solid #dadce0;
    background: #fff;
    .fenye {
      float: right;
      margin-right: 10px;
      font-size: 12px;
      span {
        display: inline-block;
        width: 16px;
        height: 16px;
        line-height: 16px;
        margin: 0 1px;
        text-align: center;
        cursor: pointer;
        .iconfont {
          font-size: 12px;
          color: #999;
          cursor: pointer;
        }
      }
      .disabled {
        cursor: not-allowed;
        .iconfont {
          cursor: not-allowed;
        }
      }
      .pageBlue {
        color: #1c7bef;
      }
    }
  }
  .expand {
    margin-top: 10px;
    width: 29px;
    height: 30px;
    line-height: 30px;
    background: #F0F5FA;
    box-shadow: 3px 0 10px 0 #D9DBE0, inset -1px 0 0 0 #D9DBE0;
    text-align: center;
    border-radius: 2px;
  }
  .hand {
    margin: auto;
    cursor: pointer;
    color: rgba(85,107,133,0.60);
    font-size: 12px;
  }
  .ellipsis_box {
    display: flex;
    .col_1 {
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .jianyanwrap {
    margin-top: 10px;
    /deep/ .el-table {
      margin: 0;
      border: none;
      min-width: 300px;
      background-color: transparent;
      &:before {
        height: 0;
      }
      tr {
        background-color: transparent;
      }
    }
    .tablewrap {
      display: flex;
      height: 100%;
      overflow: hidden;
      .tableCon {
        background: #F5F8FB;
        box-shadow: 3px 0 10px 0 #D9DBE0;
        overflow: hidden;
        transition: all .3s;
        display: inline-block;
      }
      .mainCon {
        overflow: auto;
      }
    }
  }
</style>
