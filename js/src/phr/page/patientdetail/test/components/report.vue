<template>
  <div class="report-container">
    <div class="report-title">{{ reportData.inspectionServiceName }}报告单</div>
    <div class="report-base-info">
      <el-row>
        <el-col :span="4"
          ><div class="base-info-label">姓名：</div>
          <div class="base-info-text" :title="'张三'">
            {{ patientData.patientName }}
          </div></el-col
        >
        <el-col :span="5"
          ><div class="base-info-label">性别：</div>
          <div class="base-info-text">{{ patientData.genderName }}</div></el-col
        >
        <el-col :span="4"
          ><div class="base-info-label">年龄：</div>
          <div class="base-info-text">
            {{ patientData.birthday | birthdayComputed }}
          </div></el-col
        >
        <el-col :span="6"
          ><div class="base-info-label">病人ID：</div>
          <div class="base-info-text">{{ $route.query.patientId }}</div></el-col
        >
        <el-col :span="4"
          ><div class="base-info-label">检验ID：</div>
          <div class="base-info-text">
            {{ reportData.patientInspectionId }}
          </div></el-col
        >

        <el-col :span="4"
          ><div class="base-info-label">申请科室：</div>
          <div class="base-info-text">
            {{ reportData.tenantSubjectName }}
          </div></el-col
        >
        <el-col :span="5"
          ><div class="base-info-label">样本种类：</div>
          <div class="base-info-text">
            {{ reportData.specimenTypeName }}
          </div></el-col
        >
        <el-col :span="4"
          ><div class="base-info-label">采集人：</div>
          <div class="base-info-text">
            {{ reportData.execute.specimenCollectorName }}
          </div></el-col
        >
        <el-col :span="10"
          ><div class="base-info-label">采集时间：</div>
          <div class="base-info-text">
            {{
              reportData.specimenGatherTime
                ? $moment(reportData.specimenGatherTime).format('YYYY-MM-DD')
                : ''
            }}
          </div></el-col
        >
      </el-row>
    </div>
    <div class="report-main-info">
      <div class="report-list report-list-title">
        <div class="report-list-name report-list-item">项目名称</div>
        <div class="report-list-res report-list-item">结果</div>
        <div class="report-list-mark report-list-item">备注</div>
        <div class="report-list-unit report-list-item">单位</div>
        <div class="report-list-scope report-list-item">参考范围</div>
      </div>
      <div
        class="report-list"
        v-for="(item, index) in reportData.result.details"
        :key="item.inspectionItemId + index"
        :class="{
          cRed: computedClassName(item),
        }"
      >
        <div class="report-list-name report-list-item">
          {{ item.inspectionReportItemName }}
          <!--          ({{item.inspectionItemNameAbbr}})-->
        </div>
        <div class="report-list-res report-list-item">
          {{
            item.inspectionQuantityValue === null
              ? ''
              : item.inspectionQuantityValue
          }}
          {{
            item.inspectionQualityValue === null
              ? ''
              : item.inspectionQualityValue
          }}
        </div>
        <div class="report-list-mark report-list-item">
          <i
            v-show="item.inspectionResultStatus === 'H'"
            class="icon iconfont icon-jiantoufangxiang-shang"
          ></i>
          <i
            v-show="item.inspectionResultStatus === 'L'"
            class="icon iconfont icon-jiantoufangxiang-xia"
          ></i>
          {{ item.inspectionSubItemRemark }}
        </div>
        <div class="report-list-unit report-list-item">
          {{ item.inspectionQuantityUnit }}
        </div>
        <div class="report-list-scope report-list-item">
          {{ item.refValue }}
        </div>
      </div>
    </div>
    <div class="report-bottom-info">
      <el-row>
        <el-col :span="7"
          ><div class="base-info-label">接收时间：</div>
          <div class="base-info-text" :title="'张三'">
            {{
              reportData.executeResult.specimenReceivedDate
                ? $moment(reportData.executeResult.specimenReceivedDate).format(
                    'YYYY-MM-DD'
                  )
                : ''
            }}
          </div></el-col
        >
        <el-col :span="7"
          ><div class="base-info-label">报告时间：</div>
          <div class="base-info-text" :title="'张三'">
            {{
              reportData.executeResult.inspectionReportDate
                ? $moment(reportData.executeResult.inspectionReportDate).format(
                    'YYYY-MM-DD'
                  )
                : ''
            }}
          </div></el-col
        >
        <el-col :span="5"
          ><div class="base-info-label">检验者：</div>
          <div class="base-info-text" :title="'张三'">
            {{ reportData.executeResult.inspectionExecutorName }}
          </div></el-col
        >
        <el-col :span="5"
          ><div class="base-info-label">审核者：</div>
          <div class="base-info-text" :title="'张三'">
            {{ reportData.executeResult.reportReviewDoctorName }}
          </div></el-col
        >
      </el-row>
    </div>
  </div>
</template>

<script>
import { request } from '@/util/req'
import urls from '@/phr/api/urls'

export default {
  props: {
    reportData: {
      type: [Object, String],
      default: () => { }
    }
  },
  data () {
    return {
      patientData: {}
    }
  },
  created () {
    this.getPatientData()
  },
  methods: {
    getPatientData () {
      request(urls.archives, {
        patientId: this.$route.query.patientId
      }).then((res) => {
        if (res.head.errCode === 0) {
          this.patientData = res.data
        }
      })
    },
    computedClassName (item) {
      if (item.inspectionQualityValue) {
        return item.inspectionQualityValue.includes('阳性')
      }
      if (item.inspectionQuantityValue) {
        return item.inspectionQuantityValue.includes('阳性')
      }
      return false
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../../assets/less/report-common.less';
.report-main-info {
  margin-top: 10px !important;
  .report-list {
    display: flex;
    margin-bottom: 5px;
    &.report-list-title {
      border-bottom: 1px solid #4F565E;
      padding-bottom: 8px;
      margin-bottom: 8px;
    }
    .report-list-item {
      padding-left: 10px;
      line-height: 25px;
    }
    .report-list-name {
      flex: 1;
    }
    .report-list-res {
      width: 60px;
      flex-shrink: 0;
    }
    .report-list-mark {
      width: 50px;
      flex-shrink: 0;
      i {
        font-size: 14px;
        margin-left: 10px;
      }
      .icon-jiantoufangxiang-shang {
        color: #EE4433;
      }
      .icon-jiantoufangxiang-xia {
        color: #1C7BEF;
      }
    }
    .report-list-unit {
      width: 100px;
      flex-shrink: 0;
    }
    .report-list-scope {
      width: 150px;
      flex-shrink: 0;
    }
  }
}
</style>
