<template>
  <el-dialog
    :visible.sync="dialogVisible"
    class="ui_dialog_02 spe2 report_card"
    :modal-append-to-body="appendBody"
    :append-to-body='appendBody'
  >
    <el-row :key="different" class="patient_item_box" style="maxHeight:750px">
      <el-col :span="6" class="item_menu_wrap">
        <el-menu ref='menu' default-active="800" class="item_menu" @select="handleSelect" @open='open'>
          <el-submenu index="801">
            <template slot="title">检验</template>
            <el-menu-item
              v-for="item in list801"
              :index="'801,' + item.serviceId"
              class="subName"
              :key="item.serviceId"
            >
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.serviceName"
                placement="top-start"
              >
                <span>{{item.serviceName}}</span>
              </el-tooltip>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="800">
            <template slot="title">检查</template>
            <el-menu-item
              v-for="item in list800"
              :index="'800,' + item.serviceId"
              class="subName"
              :key="item.serviceId"
            >
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.serviceName"
                placement="top-start"
              >
                <span>{{item.serviceName}}</span>
              </el-tooltip>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="802">
            <template slot="title">治疗</template>
            <el-menu-item
              v-for="item in list802"
              :index="'802,' + item.serviceId"
              class="subName"
              :key="item.serviceId"
            >
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.serviceName"
                placement="top-start"
              >
                <span>{{item.serviceName}}</span>
              </el-tooltip>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="10003">
            <template slot="title">病理</template>
            <el-menu-item
              v-for="item in list10003"
              :index="'10003,' + item.serviceId"
              class="subName"
              :key="item.serviceId"
            >
              <el-tooltip
                class="item"
                effect="dark"
                :content="item.serviceName"
                placement="top-start"
              >
                <span>{{item.serviceName}}</span>
              </el-tooltip>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="18" class="item_con_wrap">
        <el-row class="con_wrap_head">
          <el-col :span="18" class="title">
            <span v-if="serviceName">{{serviceName}}</span>
            &nbsp;
          </el-col>
          <el-col :span="6" class="handle_box alg_r">
            <span class="close_btn" @click="closeDialog">
              <i class="iconfont icon-shanchu"></i>
            </span>
          </el-col>
        </el-row>
        <el-row class="con_wrap_box">
          <el-col>
            <el-tabs v-model="tabActive" @tab-click="getResultByExecuteId" style="margin-bottom:10px">
              <el-tab-pane
                v-for="item in reportArr"
                :label="item.releaseReportTime"
                :name="item.executeId"
                :key="item.executeId"
              ></el-tab-pane>
            </el-tabs>
          </el-col>
          <reportCard801
            v-if="serviceType === '801' || serviceType === '10003'"
            :report="report"
            style="minHeight:300px"
          ></reportCard801>
          <reportCard800 :key='report.id'  v-else :report="report" style="minHeight:300px"></reportCard800>
          <el-col
            style="color:red"
            v-if="report.criticalValue && report.criticalValue.id"
            v-html='`危急值：${formatEnter(report.criticalValue.criticalContent)}`'
          >
          </el-col>
        </el-row>
        <el-tabs v-model="activeName" class="tabss" v-if='!!reportArr.length'>
          <el-tab-pane
            label="危急值处置"
            name="first"
            v-if="report.criticalValue && report.criticalValue.id"
          >
            <el-row>
              <el-input
                type="textarea"
                placeholder=" "
                v-model="disposerContent"
                :autosize="{minRows: 4, maxRows: 6}"
                :maxlength="500"
              ></el-input>
            </el-row>
            <el-col class="alg_r mt10">
              <el-button type="primary" @click="wjzczClick" :disabled="subDisabled">提交</el-button>
            </el-col>
          </el-tab-pane>
          <el-tab-pane
            label="医生解读"
            name="second"
            v-if="showComment"
          >
            <el-col>
              <el-input
                type="textarea"
                placeholder=" "
                v-model="doctorReview"
                :autosize="{minRows: 4, maxRows: 6}"
                :maxlength="500"
              ></el-input>
            </el-col>
            <el-col class="alg_r mt10">
              <!-- <el-button
                v-if="isPrint && report.resultItem &&report.resultItem.length>0"
                @click="reportPrint"
              >打印报告</el-button> -->
              <el-button
                type="primary"
                @click="doctorReviewFn"
                :disabled="subDisabled"
              >提交</el-button>
            </el-col>
          </el-tab-pane>
        </el-tabs>
        <!-- <el-row>
          <el-col>
            <div class="dialog-footer">
              <el-button @click="closeDialog"><i class="iconfont icon-quxiao"></i>取消</el-button>
              <el-button type="primary" @click="closeDialog"><i class="iconfont icon-tijiao"></i>确定</el-button>
            </div>
          </el-col>
        </el-row>-->
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import calendar from '@/workspace/components/calendar'
import api from '@/infusion/store/infusion.js'
import { isJsonString } from '@/util/common'
import reportCard800 from '@/workspace/components/report.card.800.vue'
import reportCard801 from '@/workspace/components/report.card.801.vue'
import moment from 'moment'
import formatEnter from '@/infusion/page/treat/format.enter.js'
export default {
  mixins: [formatEnter],
  props: ['isPrint', 'appendBody'],
  data () {
    return {
      api,
      moment,
      dialogVisible: false,
      list800: [],
      list801: [],
      list802: [],
      list10003: [],
      serviceType: '800',
      serviceId: '',
      serviceName: '',
      first: null,
      tableData: [],
      reportArr: [],
      inspectItem: {},
      // subItems: [],
      dateFirst: '',
      date: {},
      activeIndex: 's800',
      tabActive: '',
      report: {},
      showComment: false,
      doctorReview: '',
      subDisabled: false,
      currentId: '',
      activeName: 'second',
      disposerContent: '',
      item: {},
      pdfReportUrls: null,
      createdTime: null,
      isActive: '',
      different: 0,
      patientId: ''
    }
  },
  components: {
    calendar,
    reportCard800,
    reportCard801
  },
  watch: {
    'dialogVisible' (v) {
      if (!v) {
        // 重新渲染
        this.$emit('update:reportKey', false)
      }
    }
  },
  methods: {
    async openDialog (obj, showComment) {
      this.different = this.different + 1
      this.dialogVisible = true
      this.serviceType = obj.serviceType || '801'
      this.first = obj
      this.patientId = this.first.patientId || this.$route.query.patientId
      // 清理
      this.subDisabled = false
      this.reportArr = []
      this.report = {}
      // 清理完毕
      this.showComment = !!showComment
      await this.getDistinctServiceByPatientId(this.serviceType)
      this.$nextTick(() => {
        this.$refs.menu.open(this.serviceType)
        this.handleSelect(this.serviceType + ',' + obj.serviceId)
      })
    },
    open (index) {
      this.getDistinctServiceByPatientId(index)
    },
    async getDistinctServiceByPatientId (serviceTypes) {
      let result = await this.api.getDistinctServiceByPatientId({
        patientId: this.patientId,
        serviceTypes: [serviceTypes]
      })
      this[`list${serviceTypes}`] = result.data || []
    },
    handleSelect (item) {
      item = item.split(',')
      this.reportUrl = null
      this.tableData = []
      this.serviceType = item[0]
      this.serviceId = item[1]
      this.getExecuteTimeLineByServiceId(this.serviceId)
    },
    async getExecuteTimeLineByServiceId (serviceId) {
      let res = await this.api.getExecuteTimeLineByServiceId({
        patientId: this.patientId,
        serviceId
      })
      let list = res.data || []
      if (list.length > 0) {
        list.forEach(element => {
          element.releaseReportTime = element.releaseReportTime ? this.$moment(element.releaseReportTime).format('YYYY-MM-DD') : '--'
        })
        let indexs = 0
        if (this.first && this.first.executeId) {
          list.forEach((ele, index) => {
            if (ele.executeId === this.first.executeId) {
              indexs = index
            }
          })
          this.first = null
        }
        this.serviceName = list[0].serviceName
        this.reportArr = list
        this.tabActive = list[indexs].executeId
        this.getResultByExecuteId(list[indexs].executeId)
      } else {
        this.serviceName = ''
        this.reportArr = list
        this.report = {}
      }
    },
    async getResultByExecuteId (executeId) {
      executeId = executeId.name || executeId
      let res = await this.api.getResultByExecuteId({
        executeId
      })
      let data = res.data
      this.doctorReview = data.doctorReview
      data.resultReportSource = String(data.resultReportSource)
      if (data.pdfReportUrl && String(data.resultReportSource) === '2') {
        data.pdfReportUrl = isJsonString(data.pdfReportUrl) ? JSON.parse(data.pdfReportUrl) : []
      }
      if (data.imageUrl && String(data.resultReportSource) === '1') {
        data.imageUrl = isJsonString(data.imageUrl) ? JSON.parse(data.imageUrl) : []
      }
      if (data.criticalValue && data.criticalValue.id) {
        this.activeName = 'first'
        this.disposerContent = data.criticalValue.disposerContent
      } else {
        this.activeName = 'second'
      }
      data.resultItem = data.resultItem || []
      this.report = data
    },
    async wjzczClick () {
      if (!this.disposerContent) {
        return this.$messageTips(this, 'warning', '请填写危机处理', '提示')
      }
      this.subDisabled = true
      let res = await this.api.updateDisposerContent({
        adviceId: this.report.adviceId,
        id: this.report.criticalValue.id,
        disposerContent: this.disposerContent
      }).catch(() => { this.subDisabled = false })
      this.subDisabled = false
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '提交成功', '成功')
        this.$emit('reportEvent')
      }
    },
    closeDialog () {
      this.dialogVisible = false
    },
    async doctorReviewFn () {
      if (!this.tabActive) {
        return this.$messageTips(this, 'warning', '报告数据有问题，id不存在', '提示')
      }
      if (!this.doctorReview) {
        return this.$messageTips(this, 'warning', '请填写建议', '提示')
      }
      this.subDisabled = true
      let postdata = {
        executeIds: [this.tabActive],
        doctorReview: this.doctorReview
      }
      try {
        const res = await api.commentReport(postdata)
        this.subDisabled = false
        if (res && res.head && res.head.errCode === 0) {
          this.$messageTips(this, 'success', '提交成功', '成功')
          if (typeof this.$parent.list === 'function') {
            this.$parent.list()
          }
        }
      } catch (err) {
        this.subDisabled = false
      }
      this.getResultByExecuteId(this.tabActive)
    },
  }
}
</script>
<style lang="scss">
.report_card {
  .el-dialog__body {
    max-height: 750px;
  }
  .tabss {
    padding: 0 15px 30px;
  }
  .patient_item_box {
    .er {
      line-height: 25px;
      .ec4 {
        color: #000;
        font-weight: 600;
      }
      .ec20 {
        color: #666;
        text-align: left;
      }
    }
    display: flex;
    .item_menu_wrap {
      flex: 1;
    }
    .item_menu {
      height: 100%;
      background: #f5f5f5;
      .el-submenu {
        .el-menu-item {
          height: 40px;
          line-height: 40px;
        }
        /deep/ .el-submenu__title {
          height: 45px;
          line-height: 45px;
          font-size: 14px;
          font-weight: 500;
          color: #000;
          border-bottom: 1px solid #eee;
          background: #fff;
        }
        /deep/ .el-menu {
          border-bottom: 1px solid #eee;
          background: #f5f5f5;
        }
        /deep/ .el-menu-item{
          padding: 0 5px;
          padding-left:20px!important;
          font-size: 12px;
          height: 30px;
          line-height: 30px;
        }
      }
    }
    .item_con_wrap {
      flex: 3;
      .con_wrap_head {
        height: 60px;
        line-height: 60px;
        padding: 0 20px;
        .title {
          font-size: 20px;
          color: #000;
        }
        .handle_box {
          .iconfont {
            padding: 10px;
            color: #aaa;
          }
          .iconfont.active {
            color: #1c7bef;
          }
          .close_btn {
            .iconfont {
              font-size: 20px;
            }
          }
        }
      }
      /deep/ .con_wrap_head {
        height: 20px;
        line-height: 20px;
        margin-top: 20px;
      }
      .con_wrap_box {
        padding: 0 20px 10px;
        /deep/ .el-tabs__header {
          margin: 0px;
        }
        .el-table {
          margin: 0;
          border: none;
          /deep/ th,
          /deep/ td {
            height: 40px;
            line-height: 40px;
            background: #fff;
            border-bottom: 1px solid #e6e6e6;
            font-weight: normal;
            /deep/ .cell {
              background: #fff;
            }
          }
          &:after {
            background: none;
          }
        }
      }
    }
  }
  .patient_item_box .level {
    margin-left: 10px;
    margin-top: -20px;
    color: #ee4433;
    font-size: 16px;
  }
  .patient_item_box .el-table__body-wrapper {
    overflow-y: auto;
  }
  .subName {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
