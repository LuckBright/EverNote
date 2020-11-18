<template>
  <div class="flex_column_full flex_column_full_hidden checkjiancha">
    <div class="title">
      <ever-form2
        :schema="schema"
        v-model="obj"
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
    <div class="flex_col_1_auto jianchawrap" id="pdf_outer_jiancha">
      <el-row class="tablewrap">
        <el-col :span="leftSpan" class="tableCon" :style="{width: !hideTable ? '25%' : 0, marginRight: !hideTable ? '10px' : 0}">
          <el-table
            ref="jianchaTable"
            :data="leftTableData"
            highlight-current-row
            @row-click="showDetail"
            @header-click="headerClick">
            <el-table-column
              :header-align="columnAlign"
              prop="applicationDate"
              show-overflow-tooltip
              label="报告日期">
              <template slot-scope="scope">
                {{scope.row.examineResults[0].examineReportDate}}
              </template>
            </el-table-column>
            <el-table-column
              :header-align="columnAlign"
              prop="doctorAdviceContent"
              show-overflow-tooltip
              label="检查名称">
              <template slot-scope="scope">
                <template>{{ scope.row.doctorAdviceContent }}</template>
              </template>
            </el-table-column>
            <el-table-column
              width="35"
              prop="openIcon"
              header-align="right">
              <template slot="header">
                <i class="iconfont icon-date_lefe hand"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="middleSpan">
          <div class="expand" @click="hideTable = false">
            <i class="iconfont icon-date_right hand"></i>
          </div>
        </el-col>
        <el-col :span="rightSpan" class="mainCon">
          <paper-jiancha
            :show="showComponent"
            :data="currentData.showReportData"
            :pdf-height="pdfHeight"
            :pdf-url="pdfUrl">
          </paper-jiancha>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  // import storage from '@/util/storage'
  import urlMap from '@/inpatient/urls'
  import { request } from '@/util/req'
  import { dateFormat } from '@/util/common'
  import mixins from '@/inpatient/page/medicalrecord/mixins/info.view.mixins.js'
  import pdfMixins from '@/inpatient/page/medicalrecord/mixins/pdf.mixins.js'
  import csaapi from '@/csa/store/csaapi.js'

  export default {
    name: 'check_jiancha',
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
      },
      visitType: {
        type: String,
        default: '3'
      }
    },
    data () {
      let schema = [
        {
          name: 'serviceName',
          label: '检查名称'
        },
        {
          name: 'applicationDate',
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
        csaapi,
        leftTableData: [],
        patientInfo: {},
        tableData: [],
        currentData: {},
        pageSize: 20,
        totalPage: 1,
        currentPage: 1,
        orgId: this.$store.state.currentUser.organizationId,
        pdfId: 'pdf_outer_jiancha'
      }
    },
    computed: {
      defaultQueryObj () {
        return {
          orgId: this.orgId,
          deptId: this.deptId,
          visitType: this.visitType,
          patientId: this.patientId,
          hospitalizedNumber: this.hospitalizedNumber
        }
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
      async getPatientInfo (patientId) {
        let res = await this.csaapi.getByPatientId(patientId)
        if (res.head.errCode === 0 && res.data) {
          this.patientInfo = {
            patientName: res.data.name,
            patientAge: res.data.ageShowText,
            patientSex: this.makeSex(res.data.sex)
          }
        }
      },
      query () {
        this.showComponent = ''
        let queryObj = Object.assign({}, this.defaultQueryObj, this.obj)
        if (queryObj.applicationDate && queryObj.applicationDate.length === 2) {
          queryObj.applicationDateStart = dateFormat(this.obj.applicationDate[0], false, 'startDay')
          queryObj.applicationDateEnd = dateFormat(this.obj.applicationDate[1], false, 'endDay')
        }
        delete queryObj.applicationDate
        if (!queryObj.serviceName) {
          delete queryObj.serviceName
        }
        this.queryObj = queryObj
        request(urlMap.quote.jiancha, queryObj).then(async res => {
          if (res.head.errCode === 0 && res.data && res.data.length) {
            await this.getPatientInfo(res.data[0].patientId)
            this.leftTableData = this.makeData(res.data)
            this.$refs.jianchaTable.setCurrentRow(this.leftTableData[0])
            this.showDetail(this.leftTableData[0])
          } else {
            this.leftTableData = []
            this.patientInfo = {}
            this.allTableData = []
            this.tableData = []
            this.totalPage = 1
            this.currentPage = 1
          }
        })
      },
      makeData (datas) {
        if (!datas) return []
        datas.forEach(data => {
          data.showReportData = []
          if (data.examineResults && data.examineResults.length) {
            // 第三方回传
            if (data.examineResults[0].reportSourceResult === '1') {
              data.examineResults.forEach(item => {
                let obj = {
                  ...this.patientInfo,
                  orgName: data.orgName || '',
                  name: data.doctorAdviceContent || '',
                  patientId: data.patientId || '',
                  examineApplyTenantSubjectName: data.examineApplyTenantSubjectName || '',
                  operationPositionName: data.operationPositionName || '',
                  doctorAdviceUniqueNumber: data.doctorAdviceUniqueNumber || '',
                  examineFinding: item.examineFinding || '',
                  examineImpression: item.examineImpression || '',
                  examineReportDate: item.examineReportDate || '',
                  reportDoctorSignature: item.reportDoctorSignature || '',
                  reportReviewDoctorSignature: item.reportReviewDoctorSignature || '',
                  reportSourceResult: item.reportSourceResult || '',
                  imgInfo: []
                }
                if (item.imageUrl && JSON.parse(item.imageUrl)) {
                  JSON.parse(item.imageUrl).forEach((v, k) => {
                    obj.imgInfo.push({
                      name: '检查影像' + (k + 1), url: v
                    })
                  })
                }
                data.showReportData.push(obj)
              })
            } else if (data.examineResults[0].reportSourceResult === '2') {
              data.examineResults.forEach(item => {
                if (item.pdfReportUrl) {
                  let pdfArr = JSON.parse(item.pdfReportUrl)
                  for (let i = 0; i < pdfArr.length; i++) {
                    let pdfObj = pdfArr[i]
                    data.showReportData.push({
                      id: i,
                      type: 'pdf',
                      name: pdfObj.relName,
                      url: pdfObj.fileId,
                      reportSourceResult: item.reportSourceResult
                    })
                  }
                }
                if (item.formDataId && item.formTemplateId) {
                  data.showReportData.push({
                    name: '手写检查报告',
                    id: 'editorInfo',
                    formDataId: item.formDataId,
                    formTemplateId: item.formTemplateId,
                    type: 'editInfo'
                  })
                }
              })
            }
          }
        })
        return datas
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
        this.currentData = data
        if (data.examineResults && data.examineResults[0] && data.examineResults[0].reportSourceResult === '2' && data.showReportData.length) {
          return this.showPdf(data.showReportData[0])
        }
        this.showComponent = 'info'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .checkjiancha {
    background: #f5f5f5;
  }
  .title {
    height: 32px;
    padding: 5px;
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
  .jianchawrap {
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
        background: #fff;
      }
    }
  }
</style>
