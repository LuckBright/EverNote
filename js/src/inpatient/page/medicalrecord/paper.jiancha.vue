<template>
  <div class="paper_jiancha">
    <div v-if="data && data.length">
      <div class="fixedarea">
        <el-dropdown trigger="click" 
          v-show="currentReport.reportSourceResult && currentReport.reportSourceResult === '1'"
          @visible-change="change"
          >
          <div class="el-dropdown-link cp ellipsis_box">
            <i class="iconfont icon-yingxiangtiaoyue" :class="{'pageBlue': isShow}"></i>
          </div>
          <el-dropdown-menu
            slot="dropdown"
            class="table-button-menu">
            <el-dropdown-item
              v-for="(item, index) of currentReport.imgInfo"
              :key="index"
              @click.native="showImage(item.url)">
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-select v-model="currentReport" placeholder="请选择" value-key="name" @change="selectChange">
          <el-option
            v-for="item in data"
            :key="item.id"
            :label="item.name"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <exam-report ref="examReport" v-if="currentReport.type === 'editInfo'"></exam-report>
      <div v-show="showPdf" class="mainInfo">
        <embed
          type="application/pdf"
          width="100%"
          :src="pdf"
          :height="pdfHeight" />
      </div>
      <div v-show="showInfo" class="mainInfo">
        <div class="titlearea">
          <h2 class="title">
            {{currentReport.orgName}}
          </h2>
          <p class="nexttitle">{{currentReport.name}} 诊断报告</p>
        </div>
        <el-row class="header">
          <template v-for="item in header">
            <el-col
              :key="item.key"
              :span="item.span || 6">
              <span class="label">{{ item.label }}: </span>
              <span class="desc">{{ currentReport[item.key] }}</span>
            </el-col>
          </template>
        </el-row>
        <div class="content">
          <h2 class="contentTitle">检查所见：</h2>
          <p class="contentDesc minHeight">{{currentReport.examineFinding}}</p>
          <h2 class="contentTitle">检查印象：</h2>
          <p class="contentDesc">{{currentReport.examineImpression}}</p>
        </div>
        <el-row class="footer">
          <template v-for="item in footer">
            <el-col
              :key="item.key"
              :span="item.span || 6">
              <span class="label">{{ item.label }}: </span>
              <span class="desc">{{ currentReport[item.key] }}</span>
            </el-col>
          </template>
        </el-row>
      </div>
    </div>
    <ever-no-data tipTxt="暂无记录" v-else></ever-no-data>
  </div>
</template>

<script>
  import examReport from './exam.report'
  export default {
    components: {
      examReport
    },
    props: {
      data: {
        type: Array
      },
      show: {
        type: String,
        default: ''
      },
      pdfHeight: {
        type: Number
      },
      pdfUrl: {
        type: String
      }
    },
    data () {
      return {
        header: [
          {
            label: '姓名',
            key: 'patientName',
            span: 5
          },
          {
            label: '性别',
            key: 'patientSex',
            span: 7
          },
          {
            label: '年龄',
            key: 'patientAge',
            span: 5
          },
          {
            label: '病人ID',
            key: 'patientId',
            span: 7
          },
          {
            label: '申请科室',
            key: 'examineApplyTenantSubjectName',
            span: 5
          },
          {
            label: '检查项目',
            key: 'name',
            span: 7
          },
          {
            label: '检查部位',
            key: 'operationPositionName',
            span: 5
          },
          {
            label: '检查ID',
            key: '',
            span: 7
          },
        ],
        footer: [
          {
            label: '报告时间',
            key: 'examineReportDate',
            span: 12
          },
          {
            label: '报告医生',
            key: 'reportDoctorSignature',
          },
          {
            label: '审核医生',
            key: 'reportReviewDoctorSignature',
          }
        ],
        currentReport: {},
        pdf: '',
        isShow: false
      }
    },
    computed: {
      showPdf () {
        return this.currentReport.type === 'pdf'
      },
      showInfo () {
        return this.show === 'info'
      }
    },
    watch: {
      data: {
        handler (val) {
          this.currentReport = val[0]
        },
        deep: true
      },
      pdfUrl: {
        handler (val) {
          this.pdf = val
        },
        deep: true
      }
    },
    methods: {
      change (val) {
        this.isShow = val
      },
      selectChange (val) {
        this.currentReport = val
        if (val.reportSourceResult === '2' && val.url) {
          this.pdf = this.$ever.fileUrl2 + val.url
          this.$emit('update:pdfUrl', this.pdf)
        } else {
          this.$nextTick(() => {
            this.$refs.examReport.open(this.currentReport.formDataId, this.currentReport.formTemplateId)
          })
        }
      },
      showImage (url) {
        window.open(url, '_blank')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .paper_jiancha{
    background: #fff;
    padding: 20px;
    font-size: 14px;
    position: relative;
    height: 100%;
    p, h2 {
      margin: 0;
    }
    .mainInfo {
      margin-top: 40px;
    }
    .fixedarea {
      position: absolute;
      right: 20px;
      top: 10px;
      z-index: 1;
      /deep/ .el-dropdown {
        margin-right: 10px;
        float: left;
        .iconfont {
          font-size: 26px;
        }
        .pageBlue {
          color: #1c7bef;
        }
      }
      /deep/ .el-select {
        /deep/ .el-input__inner {
          height: 28px;
          line-height: 28px;
        }
      }
    }
    .titlearea {
      text-align: center;
      font-family: 'STSongti-SC-Black';
      margin-bottom: 15px;
      .title {
        font-size: 24px;
        color: #000000;
        letter-spacing: 2.22px;
        line-height: 50px;
      }
      .nexttitle {
        font-family: 'STSongti-SC-Black';
        font-size: 16px;
        color: #333333;
        letter-spacing: 1.78px;
        line-height: 30px;
      }
    }
    .header, .footer {
      border-top: 1px solid #ddd;
      font-family: 'STSongti-SC-Black';
      font-size: 14px;
      letter-spacing: 1px;
      line-height: 30px;
      padding: 15px 0;
      .label {
        color: #666666;
      }
      .desc {
        color: #000000;
      }
    }
    .content {
      border-top: 1px solid #ddd;
      line-height: 18px;
      color: #000000;
      min-height: 420px;
      padding: 15px 0;
      .contentTitle {
        font-size: 16px;
        font-family: 'STSongti-SC-Black';
        line-height: 40px;
      }
      .contentDesc {
        font-family: 'STSongti-SC-Regular';
        font-size: 14px;
        line-height: 30px;
      }
      .minHeight {
        min-height: 180px;
      }
    }
  }
</style>
