<template>
  <div class="tech_list">
    <el-tabs v-model="queueType" type="card" @tab-click="tableClick" class="tab-header">
      <el-tab-pane stretch  v-for="item in tabsList" :label="item.label" :name="item.value" :key='item.value'></el-tab-pane>
    </el-tabs>
    <div class="querydiv">
      <ever-patient-select
        size="small"
        v-model.trim="searchName"
        @select="input"
        :scence="0"
        :allow-create="true"
        :dialog-show="false"
        :show-attr-type="false"
      ></ever-patient-select>
      项目名称：
      <el-input  size="small"  @input='input({id:searchId})' v-model='serviceName' style="width:200px"></el-input>
      申请时间：
      <el-date-picker
        @change='queryList("")'
        v-model="date"
        type="daterange"
        value-format='yyyy-MM-dd'
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      计划时间：
      <el-date-picker
        @change='queryList("")'
        v-model="plan"
        type="daterange"
        value-format='yyyy-MM-dd'
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </div>
    <div class="queryinfo">
      <div class="patient-list">
        <ever-table
          ref='multipleTableRef'
          table-class="flex_layout_scroll patient-queue"
          :data="list"
          :table-loading="loading"
          :columns="columns"
          :show-checkbox="true"
          :isAutoCheckRow='false'
          :isRecordUrlParams='false'
          :selectable='selectable'
          @selection-change='selectionChange'
          :notSelectCheckbox='true'
          :row-class-name="rowClassName"
          :config-option="configOption"
          @row-click="rowClick"
          >
          <template slot='patientName' slot-scope="scope">
            {{scope.row.patientName}}&nbsp;
            {{scope.row.sex | formatSex}}&nbsp;
            {{scope.row.age}}
          </template>
          <template slot="visitType" slot-scope="scope">
            <span>{{(scope.row && scope.row.visitType) | getVisitType}}</span>
            <!-- <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="scope.row.visitType" :show-en="true"></sys-value> -->
          </template>
          <template slot="content" slot-scope="scope">
            <div class="advice_items_wrap">
              <span v-if="scope.row.serviceType === '802' && scope.row.adviceJson">数量：{{scope.row.adviceJson.doctorAdviceContent || '--'}}</span>
              <span v-if="scope.row.serviceType === '802'">执行数量：1</span>  <!-- 帅华要求固定1 -->
              <ul :class="scope.row.hidden ? 'lihidden':''" class="contentul" v-else-if="(scope.row.serviceType === '801' || scope.row.serviceType === '10003') && scope.row.adviceJson">
                <li  v-if='scope.row.adviceJson.specimenTypeName'>标本类型：{{scope.row.adviceJson.specimenTypeName || '--'}}</li>
                <li v-if='Number(scope.row.emergencyFlag) === 1'>加急：是</li>
              </ul>
              <ul :class="scope.row.hidden ? 'lihidden':''" class="contentul" v-else-if="scope.row.serviceType === '800' && scope.row.adviceJson">
                <li v-if='scope.row.adviceJson.positionName'>
                  部位：{{scope.row.adviceJson.positionName || '--'}}
                </li>
                <li v-if='scope.row.adviceJson.examineTarget'>
                  检查目的：{{scope.row.adviceJson.examineTarget || '--'}}
                </li>
                <li v-if='scope.row.adviceJson.illHis'>
                  简要病史：{{scope.row.adviceJson.illHis || '--'}}
                </li>
                <li v-if='scope.row.diagnose'>
                  相关诊断：{{scope.row.diagnoseName}}
                </li>
                <li v-if='Number(scope.row.emergencyFlag) === 1'>加急：是</li>
              </ul>
              <span class="arrow_handle" @click.stop.prevent="toggle(scope)"><i class="iconfont" :class="scope.row.hidden ? 'icon-xia' : 'icon-shang'"></i></span>
            </div>
          </template>
          <template slot='executeStatusStr' slot-scope="scope">
            {{scope.row.executeStatusStr}}
            <span v-if='String(scope.row.executeStatus) === "60"'>
              <i style="color: #1c7bef;" v-if='scope.row.formTemplateId' @click="forms(scope.row)" class="icon iconfont icon-baogao"></i>
              <i style="color: #1c7bef"  v-if='scope.row.executeChannel ==  1' @click="reportcard(scope.row)" class="icon iconfont icon-baogaox"></i>
              <i style="color: #1c7bef;width:17px;height:17px;cursor:pointer;fontSize:19px" v-if='scope.row.pdfReportUrl && scope.row.pdfReportUrl.length > 10' @click="pdf(scope.row)" class="icon el-icon-link"></i>
            </span>
          </template>
        </ever-table>
      </div>
      <div class="pagination">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleSizeChange"
          :totalCount="totalCounts"
          :small='true'
          :pager-count="5"
          :pagesize="pagesize"
          :current='currentPage'
          layout="prev, pager, next"
        ></ever-pagination>
      </div>
    </div>
    <reportE ref='reportE'></reportE>
    <contextmenu className='techlistrow' @menu='menuClick' :menu='menu' @select='select'></contextmenu>
    <index ref='index' @close='close'></index>
    <el-dialog
      title="查看报告"
      :visible.sync="dialogVisible"
      width="300px">
        <el-row v-for='item in fileArr' :key='item.fileId' :span='24' class="fliespan">
          <span  @click='click(item.fileId)'>{{item.relName}}</span>
        </el-row>
    </el-dialog>
    <reportCard ref='report'></reportCard>
  </div>
</template>
<script>
import { EOP_CHECK_LIST } from '@/util/table-config'
import api from '@/infusion/store/infusion'
import moment from 'moment'
import index from './treat/index'
import contextmenu from '@/workspace/components/contextmenu.vue'
import adviceItemShow from '@/inpatient/components/medical.orders/advice.item.show.new'
import { isJsonString } from '@/util/common'
import reportE from '@/workspace/components/report.e.vue'
import reportCard from '@/infusion/components/report.card.vue'
/**
 * // 点击队列携带的query
 * appointmentId: "921b92ed-fd93-4eb3-8faf-c5679b3ae9e4"
 * patientId: "ubkUSeydUbmMJLg5K6q"
 * taskIds: "%5B"921b92ed-fd93-4eb3-8faf-c5679b3ae9e4","2ee4ea90-23ef-45c1-979e-4bfd654cc6bf"%5D"
 * timeStamp: "1574832064051"
 * triageId: "76245bbf-cc8c-4a91-9ef8-bee6b9f92cdb"
 * visitNumber: "OPOP201911270000004497
 * // 队列请求参数
 * tenantDeptId科室ID
 * resourceId为医生ID
 * resourceType类型 挂号: register、疫苗: vaccine、检验: lis、预检: pre-check、检查: pacs、输液: infusion、体检: health-checkup 治疗: cure
 */
let date = [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
export default {
  components: {
    contextmenu,
    index,
    adviceItemShow,
    reportE,
    reportCard
  },
  props: {
    tenantDeptId: String,
    resourceType: String,
    resourceId: String
  },
  data () {
    return {
      api,
      name: '模版',
      searchName: '',
      serviceName: '',
      searchId: '',
      list: [],
      activeIndex: '',
      loading: false,
      queueType: '10',
      date: date,
      plan: [],
      timer: 0,
      totalCounts: 0,
      pagesize: 20,
      currentPage: 1,
      tabsList: [],
      IS_NEED_EXCUTING: '1',
      menu: [],
      hidden: true,
      fileArr: [],
      dialogVisible: false
    }
  },
  created () {
    this.init()
  },
  methods: {
    reportcard (row) {
      this.$refs.report.openDialog(row)
    },
    click (url) {
      window.open(this.$ever.fileUrl2 + url)
    },
    forms (row) {
      this.api.getResultByExecuteId({
        executeId: row.executeId
      }).then(res => {
        this.$refs.reportE.open(res.data.formDataId, res.data.formTemplateId)
      })
    },
    pdf (row) {
      let arr = isJsonString(row.pdfReportUrl) ? JSON.parse(row.pdfReportUrl) : []
      if (arr.length === 1) {
        window.open(this.$ever.fileUrl2 + arr[0].fileId)
      } else if (arr.length > 1) {
        this.fileArr = arr
        this.dialogVisible = true
      }
    },
    toggle ({$index, row}) {
      this.$set(this.list[$index], 'hidden', !row.hidden)
    },
    handleSizeChange (currentPage) {
      this.currentPage = currentPage
      this.queryList()
    },
    tableClick () {
      this.$emit('change', [])
      this.$emit('tabChange', ['55', '20,30,55,60'].includes(this.queueType))
      this.currentPage = 1
      this.$nextTick(_ => {
        this.queryList()
      })
    },
    input ({id}) {
      this.searchId = id
      clearTimeout(this.timer)
      this.timer = setTimeout(_ => {
        this.queryList(id)
      }, 300)
    },
    async init () {
      this.columns = this.getColumns()
      this.configOption = {id: EOP_CHECK_LIST}
      this.queryList()
      let tabsList = [
              {label: '待执行', value: '10'},
              {label: '执行中', value: '20'},
              {label: '已执行', value: '30,60'},
              {label: '已拒绝', value: '55'},
              {label: '执行记录', value: '20,30,55,60'},
      ]
      let res = await this.api.getConfigInfoByApolloAgent({
        code: 'IS_NEED_EXCUTING',
        defaultValue: 1
      })
      if (res.head.errCode === 0) {
        res.data = res.data || {}
        this.IS_NEED_EXCUTING = String(res.data.value)
        if (String(res.data.value) === '0') {
          tabsList.splice(1, 1)
        }
      }
      this.tabsList = tabsList
    },
    async queryList (patientId) {
      let techValue = JSON.parse(localStorage.getItem('tech_value'))
      this.loading = true
      this.list = []
      let serviceTypes
      if (techValue.serviceType === 801) {
        serviceTypes = ['801', '10003']
      } else if (techValue.serviceType === 800) {
        serviceTypes = ['800']
      } else if (techValue.serviceType === 802) {
        serviceTypes = ['802']
      }
      let params = {
        serviceTypes: serviceTypes, // string
        serviceName: this.serviceName,
        roomId: techValue.section && techValue.section.id || null, // string
        executeStatusList: this.queueType.split(','), // 10-待执行 20-执行中 30-已完成 40-已取消
        providerId: techValue.provider.id, // 科室Id
        patientId: patientId || this.searchId,
        offset: this.pagesize * (this.currentPage - 1),
        pagesize: this.pagesize
      }
      if (this.date && this.date[0] && this.date[1]) {
        params.startTime = this.date[0] + ' 00:00:00'
        params.endTime = this.date[1] + ' 23:59:59'
      }
      if (this.plan && this.plan[0] && this.plan[1]) {
        params.planStartTime = this.plan[0] + ' 00:00:00'
        params.planEndTime = this.plan[1] + ' 23:59:59'
      }
      let res = await this.api.getTechExecuteList(params)
      let arr = res.data || []
      arr.forEach(ele => {
        ele.visitNumber = ele.visitNumber || ele.hospitalizedNumber
        ele.completeTime = ele.completeTime ? moment(ele.completeTime).format('YYYY-MM-DD HH:mm') : '--'
        ele.applyTime = ele.applyTime ? moment(ele.applyTime).format('YYYY-MM-DD HH:mm') : '--'
        ele.planTime = ele.planTime ? moment(ele.planTime).format('YYYY-MM-DD HH:mm') : '--'
        ele.executeStatusStr = this.exportStatus(ele.executeStatus)
        let diagnosis = isJsonString(ele.diagnose) ? JSON.parse(ele.diagnose) : null
        ele.diagnoseName = diagnosis ? diagnosis[0].diseaseName : ''
        ele.hidden = true
      })
      this.list = arr
      this.totalCounts = res.totalCount
      this.loading = false
    },
    exportStatus (s) {
      if (s === 10) return '待执行'
      if (s === 20) return '执行中'
      if (s === 30) return '已执行'
      // if (s === 40) return '已取消'
      // if (s === 51) return '待提交'
      // if (s === 52) return '已删除'
      // if (s === 53) return '已作废'
      if (s === 55) return '已拒绝'
      if (s === 60) return '报告已出'
    },
    rowClassName ({row}) {
      let id = this.$route.query.adviceId
      if (id === row.adviceId) {
        return 'patient-active techlistrow'
      }
      return 'techlistrow'
    },
    rowClick ({row}) {
      if (!this.selectable(row)) return
      this.$refs.multipleTableRef.$refs.everTable.toggleRowSelection(row)
      row.executeIds = row.executeId ? [row.executeId] : []
      // this.$router.push({query: {
      //   // appointmentId: row.patientId, // 检验没有
      //   // triageId: row.triageId, // 检验没有,不需要接诊
      //   adviceId: row.adviceId,
      //   patientId: row.patientId,
      //   taskId: row.executeId, // 执行单Id
      //   visitType: row.visitType,
      //   visitNumber: row.visitNumber || row.hospitalizedNumber,
      //   hospitalizedNumber: row.hospitalizedNumber,
      //   timeStamp: Date.now()
      // }})
    },
    getColumns () {
      return [{
        slot: 'visitType',
        prop: 'visitType',
        label: '就诊类型',
        required: true
      }, {
        slot: 'patientName',
        prop: 'patientName',
        label: '患者信息',
        required: true
      }, {
        prop: 'serviceName',
        label: '项目名称',
        required: true
      }, {
        slot: 'content',
        prop: 'content',
        label: '内容'
      }, {
        prop: 'entrust',
        label: '嘱托'
      }, {
        prop: 'doctorName',
        label: '申请人'
      }, {
        prop: 'applyTime',
        label: '申请时间'
      }, {
        prop: 'providerName',
        label: '申请科室',
        hidden: true,
      }, {
        prop: 'orgName',
        label: '申请机构',
        hidden: true,
      }, {
        prop: 'actualExecuteOrgName',
        label: '执行机构',
        hidden: true,
      }, {
        prop: 'actualExecuteProviderName',
        label: '执行科室',
        hidden: true,
      }, {
        prop: 'executeName',
        label: '执行人'
      }, {
        prop: 'completeTime',
        label: '执行时间'
      }, {
        prop: 'planTime',
        label: '计划执行时间'
      }, {
        prop: 'executeStatusStr',
        slot: 'executeStatusStr',
        label: '执行状态',
        hidden: true,
      }]
    },
    setMenu (s, ids, obj = {}) {
      let menu = [
        {
          name: '登记', // 0
          id: 'REGISTER',
          disabled: true
        }, {
          name: '取消登记', // 1
          id: 'CANCEL_REGISTER',
          disabled: true
        }, {
          name: '拒绝执行', // 2
          id: 'REJECT',
          disabled: true
        }, {
          name: '取消拒绝', // 3
          id: 'CANCEL_REJECT',
          disabled: true
        }, {
          name: '执行完成', // 4
          id: 'EXECUTE',
          disabled: true
        }, {
          name: '取消执行', // 5
          id: 'CANCEL_EXECUTE',
          disabled: true
        }, {
          name: '操作记录', // 6
          id: 'LOG',
          disabled: false
        }, {
          name: '报告管理', // 7
          id: '',
          disabled: true,
          child: [{
            name: '填写报告', // 7-0
            id: 'CREATE_HANDWRITE_REPORT',
            disabled: true
          }, {
            name: '上传报告', // 7-1
            id: 'UPLOAD_FILE',
            disabled: true
          }, {
            name: '发布报告', // 7-2
            id: 'RELEASE_REPORT',
            disabled: true
          }, {
            name: '取消发布', // 7-3
            id: 'CANCEL_RELEASE_REPORT',
            disabled: true
          }, ]
        }]
      if (!ids || (ids.length === 1 && obj.executeChannel === 1)) {
        this.menu = menu
        return
      }
      if (s === 0) {
        menu[6].disabled = true
      } else if (s === 10) { // '待执行'
        menu[2].disabled = false
        if (this.IS_NEED_EXCUTING === '0') menu[4].disabled = false
        else menu[0].disabled = false
      } else if (s === 20) { // 执行中
        menu[1].disabled = false
        menu[4].disabled = false
        menu[7].disabled = false
        if (String(this.$route.params.serviceType) !== '802') menu[7].child[0].disabled = false
        menu[7].child[1].disabled = false
      } else if (s === 30) { // 执行完成
        menu[5].disabled = false
        menu[7].disabled = false
        if (String(this.$route.params.serviceType) !== '802') menu[7].child[0].disabled = false
        menu[7].child[1].disabled = false
        menu[7].child[2].disabled = false
      } else if (s === 60) { // 发布报告
        menu[7].disabled = false
        menu[7].child[3].disabled = false
        // if (this.IS_NEED_EXCUTING === '0') {
        //   menu[5].disabled = false
        // }
      } else if (s === 55) {
        menu[3].disabled = false
      }
      if (ids.length > 1) {
        menu[6].disabled = true
        menu[7].disabled = true
        menu[7].child[0].disabled = true
        menu[7].child[1].disabled = true
        menu[7].child[2].disabled = true
        menu[7].child[3].disabled = true
      } else if (ids.length === 1) {
        this.api.getResultByExecuteId({
          executeId: ids[0]
        }).then(res => {
          let report = res && res.data ? res.data : {}
          if (report.formDataId) {
            menu[7].child[0].name = '查看报告'
          }
        })
      }
      this.menu = menu
    },
    menuClick (index) {
      let arr = this.$refs.multipleTableRef.multipleSelection
      let ids = []
      if (arr.length === 0) {
        ids = [this.list[index].executeId]
        this.setMenu(this.list[index].executeStatus, ids, this.list[index])
      } else {
        let selectId = this.list[index].executeId
        let flag = true
        let status = arr[0].executeStatus
        let executeChannel = null
        arr.forEach(ele => {
          ids.push(ele.executeId)
          if (ele.executeId === selectId) selectId = null // 判断选中后，再点击没有选中的时候右键全部不可点击
          if (ele.executeStatus !== status) flag = false // 判断有没有不同的状态的数据
          if (ele.executeChannel === 1) {
            executeChannel = 1
          }
        })
        if (executeChannel === 1) {
          this.setMenu()
          return
        }
        if (selectId) {
          this.setMenu(0, ids)
        } else if (flag) {
          this.setMenu(status, ids)
        } else {
          this.setMenu(0, ids)
        }
      }
    },
    close (id) {
      if (id === 'REJECT') {
        this.queueType = '55'
      } else if (id === 'EXECUTE') {
        this.queueType = '30,60'
      }
      this.tableClick()
    },
    async select (obj, index) {
      let executeIds = []
      let checkArr = this.$refs.multipleTableRef.multipleSelection || []
      if (checkArr.length === 0) {
        executeIds = [this.list[index].executeId]
      } else {
        checkArr.map(ele => {
          executeIds.push(ele.executeId)
        })
      }
      let techValue = JSON.parse(localStorage.getItem('tech_value'))
      techValue.section = techValue.section || {}
      let params = {
        executeIds: executeIds, // string []
        actualExecuteRoomId: techValue.section.id, // string
        actualExecuteRoomName: techValue.section.name, // string
        actualExecuteProviderId: techValue.provider.id, // string
        actualExecuteProviderName: techValue.provider.name, // string
        operateCode: obj.id
      }
      let res, message
      if (obj.id === 'REGISTER') {
        res = await this.api.registerBatch(params)
        .catch(e => { this.tableClick() })
        message = '登记成功'
      } else if (obj.id === 'CANCEL_REGISTER') {
        res = await this.api.cancelRegisterBatch(params)
        .catch(e => { this.tableClick() })
        message = '取消登记成功'
      } else if (obj.id === 'CANCEL_REJECT') { // 批量取消拒绝
        res = await this.api.cancelRejectBatch(params)
        .catch(e => { this.tableClick() })
        message = '取消拒绝成功'
      } else if (obj.id === 'CANCEL_EXECUTE') {
        res = await this.api.cancelExecuteBatch(params)
        .catch(e => { this.tableClick() })
        message = '取消执行成功'
      } else if (obj.id === 'RELEASE_REPORT' || obj.id === 'CANCEL_RELEASE_REPORT') {
        params.executeId = params.executeIds.join('')
        res = await this.api.releaseReport(params)
        .catch(e => { this.tableClick() })
        message = obj.id === 'RELEASE_REPORT' ? '发布报告成功' : '取消发布报告成功'
      } else {
        this.$refs.index.open(this.list[index], executeIds, obj.id)
        return
      }
      //  {label: '待执行', value: '10'},
      //         {label: '执行中', value: '20'},
      //         {label: '已执行', value: '30,60'},
      //         {label: '已拒绝', value: '55'},
      if (res && res.head && res.head.errCode === 0) {
        if (['CANCEL_REGISTER', 'CANCEL_REJECT'].indexOf(obj.id) > -1) {
        // 跳转待执行
          this.queueType = '10'
        } else if (obj.id === 'CANCEL_EXECUTE') {
        // 跳转执行中
          this.queueType = this.IS_NEED_EXCUTING === '1' ? '20' : '10'
        } else if (obj.id === 'REGISTER') {
        // 跳转执行中
          this.queueType = '20'
        }
        this.$notify({
          title: '成功',
          message: message,
          type: 'success'
        })
      }
      setTimeout(_ => {
        this.tableClick()
      }, 300)
    },
    inits () {
      // this.$refs.multipleTableRef.multipleSelection // 获取选中的数据
    },
    selectable (row) {
      let arr = this.$refs.multipleTableRef.multipleSelection
      if (arr.length === 0) {
        return true
      } else {
        let flag = true
        if (arr.length === 1 && !row.visitNumber && row.executeId === arr[0].executeId) return true
        if (!row.visitNumber) return false
        arr.forEach(ele => {
          if (row.visitNumber !== ele.visitNumber) {
            flag = false
          }
        })
        return flag
      }
    },
    selectionChange () {
      this.$emit('change', this.$refs.multipleTableRef.multipleSelection)
    }
  },
  filters: {
    getVisitType (val) {
      switch (val) {
        case 1:
          return '门诊'
        case 3:
          return '住院'
        case 5:
          return '互联网'
        default :
          return '--'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tech_list{
  height: 100%;
  background: #fff;
  padding:10px;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .advice_items_wrap{
    position: relative;
    .contentul{
      padding: 0;
      margin: 0;
      width: 100%;
      li {
        margin-right: 20px;
      }
    }
    .arrow_handle{
      padding: 5px;
      line-height: 14px;
      cursor: pointer;
      position: absolute;
      right:0;
      top:calc( 50% - 7px);
      .iconfont{
        font-size: 14px;
        color: #999;
      }
    }
  }
  .lihidden{
    li{
      display: none;
    }
  }
  .contentul{
    padding:0;
    margin: 0;
    position: relative;
    li:nth-child(1){
      display: list-item!important;
    }
  }
  .queryinfo {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
  }
  .querydiv{
    padding-bottom: 10px;
    /deep/ .patientWar{
      width: 300px;
      float: left;
      margin-right: 30px;
    }
    /deep/ .el-date-editor{
      line-height: 32px;
      height: 32px;
      padding:0;
      padding-left:10px;
    }
  }
  /deep/ thead .el-table-column--selection .cell{
    // display: none;
    visibility: hidden;
  }
  /deep/ .el-tabs__nav > div{
    padding:0 10px;
    width: 100px;
    text-align: center;
  }
  .fliespan{
    border-radius: 2px;
    cursor: pointer;
    color: #1c7bef;
    background: #F2F2F2;
    padding: 5px 15px;
    margin-bottom: 10px;
  }
}
</style>
