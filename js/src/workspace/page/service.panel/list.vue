<template>
  <div class="layout_box spe">
    <div class="layout_inner spe">
      <el-container>
        <el-aside width="340px">
          <div class="main-wrap">
            <ever-form2 :schema="querySchema" v-model="queryObj" @query="list(true)" :inline="true">
              <div slot="default"></div>
              <template slot="daterange">
                <el-row>
                  <date-range
                    :showday="true"
                    v-model="queryObj.date"
                    :unedit="editFlag"
                    :disabled="editFlag"
                  ></date-range>
                </el-row>
              </template>
            </ever-form2>
            <el-row>
              <div class="mb10 mt5 f14">
                <span>今日看板</span>
              </div>
              <todo-editor
                :listDate="queryObj.date"
                :clinic="{'id': $store.state.currentUser.organizationId, 'name':  $store.state.currentUser.organizationName}"
                :pageType="1"
                @updateEditor="updateEditor"
              ></todo-editor>
            </el-row>
            <el-row class="query-form">
              <div class="mb10 mt15 colae">
                <span>选择科室和医生</span>
              </div>
              <el-row class="bor4 cur">
                <el-col :span="12">
                  <ul :class="{'border-right': providers.length >= providerDoctors.length}">
                    <li
                      v-for="(item, index) in providers"
                      :key="item.id"
                      :class="{'is_checked': item.isChecked}"
                      @click="checkDpt(index)"
                    >
                      <el-row class="h36">
                        <p class="dpt_text">{{item.deptName}}</p>
                      </el-row>
                    </li>
                  </ul>
                </el-col>
                <el-col :span="12">
                  <ul :class="{'border-left': providers.length < providerDoctors.length}">
                    <li
                      v-for="(item, index) in providerDoctors"
                      :key="item.resourceId"
                      :class="{'is_checked': item.isChecked}"
                      @click="checkDoctor(index)"
                    >
                      <el-row class="h36" v-if="item.resourceName">
                        <p class="dpt_text">{{item.resourceName}}</p>
                      </el-row>
                    </li>
                  </ul>
                </el-col>
              </el-row>
            </el-row>
          </div>
        </el-aside>
        <el-container>
          <el-col class="pl30 pt20 pr30">
            <el-row>
              <el-col>
                <span>共{{totalCount}}人</span>
                <el-select v-model="queryStatus" placeholder="请选择" class="ml10">
                  <el-option
                    v-for="item in queryStatusArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-button plain @click="linkMemberadd" class="ml50 borradiu">新患者</el-button>
                <el-button plain @click="linkAppointment" class="borradiu">新预约</el-button>
                <el-button
                  plain
                  :disabled="sendPatient.length==0"
                  @click="sendMessage"
                  class="borradiu"
                >发短信</el-button>
                <el-button plain @click="showReception">快速接诊</el-button>
              </el-col>
            </el-row>
            <service-icon-popover></service-icon-popover>
            <div class="mt20">
              <ever-table
                :columns="columns"
                ref="taskTable"
                :data="tableData"
                :show-checkbox="true"
                :is-pagination="false"
                :config-option="configOption"
                :selectionWidth="30"
                @selection-change="handleSelectionChange"
                :selectable="(row) => {return row.patientMobile}"
                @cell-click="cellClick"
                border
              >
                <template slot="opCol">
                  <el-table-column prop width="405" label="操作">
                    <template slot-scope="scope">
                      <service-icon-handler
                        :listData="scope.row"
                        @diagnosis="diagnosis"
                        @fillmember="fillmember"
                        @update="list()"
                        @done="done()"
                        @showDetail="showDetailFun"
                        @print="print"
                        @editPrecheck="editPrecheck"
                        @tuihao="appointCancel"
                        @senddrug="senddrug"
                        @question="questionDialog"
                      ></service-icon-handler>
                    </template>
                  </el-table-column>
                </template>
              </ever-table>
            </div>
          </el-col>
        </el-container>
      </el-container>
    </div>
    <send-message2 ref="sendmessage" :data="msgParams"></send-message2>

    <rcm :visible.sync="dialogVisible" :settlement-id="regiserId"></rcm>
    <paymethodstwo
      :dialogVisible.sync="paydialogVisible"
      :obj="yzsobj"
      @payStatus="payStatus"
      @closedialog="closePayDialog"
    ></paymethodstwo>
    <dialog-appoint-detail
      ref="appointDetail"
      :med-data="medicareObj"
      :appoint-data="appointObj"
      :order-id="orderId"
      :is-show="showFlag"
    ></dialog-appoint-detail>
    <medical-insurance
      :settlement-id="settlementId"
      :appoint-id="appointId"
      :key="settlementId"
      :visible.sync="insuranceVisible"
      :refund="true"
      @confirmFun="appointCancel"
    ></medical-insurance>
    <!-- <printregistrationform :printinfo="settlementData" v-show="false" ref="registrationForm"></printregistrationform> -->
    <dialog-senddrug ref="senddrug"></dialog-senddrug>
    <dialog-diagnosis
      ref="diagnosis"
      :diagType="diagType"
      :patientData="diagData"
      @update="() => this.getList()"
    ></dialog-diagnosis>
    <dialog-print-list ref="printList"></dialog-print-list>
    <dialog-precheck
      ref="tirggeryujian"
      :title="nosubmit ? '查看预检信息': '修改预检信息'"
      :precheckData="precheckData"
      :task="precheckData"
      :nosubmit="nosubmit ? true: false"
      @update="() => this.getList()"
    ></dialog-precheck>
    <dialog-temppatient ref="temppatient" :patientData="tempPatient" @update="() => this.getList()"></dialog-temppatient>
    <dialog-cancel-appoint
      ref="cancelappoint"
      :patientData="tempPatient"
      @update="() => this.getList()"
    ></dialog-cancel-appoint>
    <dialog-rapid-accepts ref="rapidaccepts" @update="() => this.getList()"></dialog-rapid-accepts>
    <dialog-remark ref="remark" :patientData="tempPatient" @update="() => this.getList()"></dialog-remark>
    <dialog-questionnaire ref="questionnaireDialog"></dialog-questionnaire>
  </div>
</template>

<script>
import api from '@/sob/store/service.panel'
import numberapi from '@/arrange/store/appointapi'
import appointapi from '@/workspace/store/appointapi'
import { APPOINT_STATUS, wsConnect } from '@/util/common'
import serviceIconHandler from './common/service.icon.handler'
import serviceIconPopover from './common/service.icon.popover'
import dialogAppointDetail from './common/dialog.appointdetail'
import dialogSenddrug from './common/dialog.senddrug'
import sendMessage2 from '@/crm/page/sendmessage2'
import rcm from '@/workspace/page/reservation/rcm'
import medicalInsurance from '@/workspace/page/reservation/paymentinfo'
// import printregistrationform from '@/workspace/page/print-registrationform'
// import settlementapi from '@/rcm/store/settlementapi'
import { CRM_SERVICE_PANEL_LIST, tableColWidth } from '@/util/table-config'
import todoEditor from '@/components/todoeditor/todoeditor'
import dialogDiagnosis from './common/dialog.diagnosis'
import dialogPrintList from './common/dialog.print.list'
import dialogPrecheck from '@/workspace/page/dialog-precheck'
import dialogTemppatient from './common/dialog.temppatient'
import dialogCancelAppoint from './common/dialog.cancel.appoint'
import dialogRapidAccepts from './common/dialog.rapid.accepts'
import dialogRemark from './common/dialog.remark.vue'
import dialogQuestionnaire from './common/dialog.questionnaire'
// import phrformDialog from '@/form/components/phrform.dialog'

export default {
  data () {
    let querySchema = [
      {
        name: 'daterange',
        label: '选择时间',
        comp: 'custom'
      }
    ]
    let start = this.$moment().startOf('day')
    let queryObj = this.$ever.createObjFromSchema(querySchema)

    queryObj.deptId = ''
    queryObj.resourceId = ''
    queryObj.date = start && start.format('YYYY-MM-DD')

    return {
      api,
      numberapi,
      querySchema,
      queryObj,
      msgParams: {},
      providers: [],
      providerDoctors: [],
      APPOINT_STATUS,
      sendPatient: '',
      editFlag: null,
      dialogVisible: false,
      paydialogVisible: false,
      regiserId: '',
      medicareObj: {},
      appointObj: {},
      appointId: '',
      showFlag: false,
      insuranceVisible: false,
      loading: false,
      nosubmit: true,
      wsClient: '',
      settlementId: '',
      orderId: '',
      totalCount: 0,
      queryStatus: 1,
      diagType: 0,
      tableData: [],
      precheckData: {},
      diagData: {},
      tempPatient: {},
      queryStatusArr: [
        {
          value: 1,
          label: '按状态排列'
        },
        {
          value: 2,
          label: '按医生排列'
        },
        {
          value: 3,
          label: '按预约时间排列'
        }
      ],
      yzsobj: {
        // 外层loading
        iscallback: true,
        loading: false,
        // 患者id
        patientid: '',
        // 结算单id
        id: '',
        // 结算单号
        settleCode: '',
        // 还需支付
        unexefee: 0,
        // 已收金额
        exefee: 0,
        // 总额
        totalFee: 0,
        // 0一站式挂号 1门诊 2住院(押金) 3商城(营销)5无处方结算写死的
        payType: '4',
        // 支付方式
        paymethodArr: [],
        // 押金是false,费用为true
        isValited: false,
        // 是否押金(押金传1)
        isDeposit: 0,
        // 是否退费(退费传true)
        isRefund: false,
        isChange: false
      },
      settlementData: {
        id: '',
        patientAge: 0,
        patientName: '',
        patientid: '',
        settlecode: '',
        doctorName: '',
        visitSn: '',
        payStatus: '',
        details: {
          settlementDetail: []
        }
      },
      drugObj: {},
      columns: [
        {
          slotName: 'opCol',
          isOperate: true,
        },
        {
          prop: 'appointmentStateDesc',
          label: '状态',
          showOverflowTooltip: true,
          width: tableColWidth.name4W80
        },
        {
          prop: 'patientNumber',
          label: '患者档案号',
          hidden: true,
          minWidth: tableColWidth.name7W120,
          formatter: ({ row }) => row.patient ? row.patient.patientNumber !== 'temporary' ? row.patient.patientNumber : '' : ''
        },
        {
          prop: 'engName',
          label: '英文名',
          hidden: true,
          minWidth: tableColWidth.name7W120,
          formatter: ({ row }) => row.patient ? row.patient.engName : ''
        },
        {
          prop: 'patientInfo',
          label: '患者信息',
          minWidth: tableColWidth.name8W180,
          showOverflowTooltip: true,
          notSelectCheckbox: true, // 点击该列时不会勾选到该行
          beforeHtmlFormatter: ({ row }) => {
            let html = ''
            if (row.member && row.member.objLabelList && row.member.objLabelList.length > 0) {
              html += `<span class="s1" style="color: ${row.member.objLabelList[0].color}">•</span>`
            }
            html += `<span class="inline-block info"><a class="a-ellipsis" href="${this.$ever.crmIndex}/crm/memberinfo/userinfo/memberbaseinfo/${row.patientId}" target="_blank">${row.patientName}</a></span>`
            if (row.patientSex) {
              html += `<span class="inline-block ml10 mr10 cGray">${this.$filters.formatSex(row.patientSex)}</span>`
            }
            if (row.patientAgeText && row.patientAgeText) {
              html += `<span class="inline-block cGray">${row.patientAgeText ? row.patientAgeText : '--'}</span>`
            }
            return html
          },
          beforeHtmlEvent: '_link',
          formatter: ({ row }) => ' '
        },
        {
          prop: 'patientLabel',
          label: '客户信息标识',
          width: tableColWidth.w150,
          afterHtmlFormatter: ({ row }) => {
            // busiInsurNotExpire 未过期商保 1
            // busiInsurExpire 商保即将过期 2
            // busiInsurAllExpire 商保全部过期 3
            let html = ''
            if (row.patient && row.patient.busiInsur && row.patient.busiInsur.busiInsurFlag) {
              if (row.patient.busiInsur.busiInsurNotExpire && !row.patient.busiInsur.busiInsurExpire) {
                html += `<i class="icon iconfont icon-shangbao2 cGreen mr5 f20"></i>`
              }
              if (row.patient.busiInsur.busiInsurExpire) {
                html += `<i class="icon iconfont icon-shangbao2 cRed mr5 f20"></i>`
              }
              if (row.patient.busiInsur.busiInsurAllExpire) {
                html += `<i class="icon iconfont icon-shangbao2 cGray mr5 f20"></i>`
              }
            }
            if (row.patient.busiInsur && row.patient.busiInsur.busiSupplInsurFlag) {
              if (row.patient.busiInsur.busiSupplInsurNotExpire && !row.patient.busiInsur.busiSupplInsurExpire) {
                html += `<i class="icon iconfont icon-shangbu1 cGreen mr5 f20"></i>`
              }
              if (row.patient.busiInsur.busiSupplInsurExpire) {
                html += `<i class="icon iconfont icon-shangbu1 cRed mr5 f20"></i>`
              }
              if (row.patient.busiInsur.busiSupplInsurAllExpire) {
                html += `<i class="icon iconfont icon-shangbu1 cGray mr5 f20"></i>`
              }
            }
            if (row.patient && row.patient.member && row.patient.member.labelNames.indexOf('欠费') !== -1) {
              html += `<i class="icon iconfont icon-qianfei cRed mr5 f20"></i>`
            }
            if (row.patientHasSetMeal) {
              html += `<i class="icon iconfont icon-taocan1 cGreen mr5 f20"></i>`
            }
            return html
          },
          formatter: ({ row }) => ' '
        },
        {
          prop: 'appointDate',
          label: '预约  时长',
          width: tableColWidth.name6W105,
          showOverflowTooltip: true,
          afterHtmlFormatter: ({ row }) => {
            let html = ''
            if (row.startTimeStr) {
              html += `${row.startTimeStr}`
            }
            if (row.timeLength) {
              html += `<span class="cGray ml10">${row.timeLength} min</span>`
            }
            return html
          },
          formatter: ({ row }) => row.appointDate ? row.appointDate : ' '
        },
        {
          prop: 'arrivalTime',
          label: '签到  迟到',
          showOverflowTooltip: true,
          width: tableColWidth.name6W105,
          afterHtmlFormatter: ({ row }) => {
            let html = ''
            if (row.arrivalTime && row.lateTimeLength) {
              html += `<span class="cRed ml10">  ${row.lateTimeLength} min</span>`
            }
            return html
          },
          formatter: ({ row }) => row.arrivalTime ? this.$moment(row.arrivalTime).format('HH:mm') : ' '
        },
        {
          prop: 'deptName',
          label: '科室',
          showOverflowTooltip: true,
          width: tableColWidth.name7W120,
        },
        {
          prop: 'doctorName',
          label: '预约医生',
          showOverflowTooltip: true,
          width: tableColWidth.name4W80,
        },
        {
          prop: 'triagedResourceName',
          label: '看诊医生',
          showOverflowTooltip: true,
          width: tableColWidth.name4W80,
        },
        {
          prop: 'symptom',
          label: '备注',
          showOverflowTooltip: true,
        }
      ],
      params: {},
      configOption: { id: CRM_SERVICE_PANEL_LIST }
    }
  },
  mounted () {
    this.$bus.$on('yihu:kanzhen', params => {
      this.regiserId = params.rcmId
      this.dialogVisible = this.regiserId !== '-1'
    })
    // mounted 时使用 地址栏中的查询条件为 表单数据赋值
    if (this.$route.query.q) {
      Object.assign(this.queryObj, JSON.parse(this.$route.query.q))
    }
  },
  destroyed () {
    if (this.wsClient) {
      this.wsClient.disconnect(rs => {
        console.log('socket 连接断开啦QAQ')
      })
    }
  },
  async created () {
    if (this.$route.query && this.$route.query.q) {
      let squery = JSON.parse(this.$route.query.q)
      if (squery.patientId) {
        squery.patientId = ''
      }
      this.$route.query.q = JSON.stringify(squery)
    }
    this.$bus.$on('form:handMessage', v => {
      this.allparams = v
      this.allparams.msgType = 108
      if (this.$refs.sendmessage && this.$refs.sendmessage.sendVisible !== undefined) {
        this.$refs.sendmessage.sendVisible = true
      }
    })
    this.$bus.$on('appoint:rcm2Visible', val => {
      this.yzsobj.id = val.rcmResult.id
      this.yzsobj.appointId = val.appointId
      this.yzsobj.settleCode = val.rcmResult.settleCode
      this.yzsobj.totalFee = val.rcmResult.totalFee
      this.yzsobj.unexefee = val.rcmResult.unexefee
      this.yzsobj.exefee = val.rcmResult.exefee
      this.yzsobj.patientid = val.rcmResult.patientid
      this.yzsobj.visitNumber = val.rcmResult.visitNumber
      this.yzsobj.isRefund = val.isRefund || val.rcmResult.returnFlag
      this.yzsobj.isChange = val.rcmResult.isChange
      this.printPatient = val.printPatient
      this.printType = val.printType
      this.printPatientCount = val.printPatientCount
      this.paydialogVisible = this.yzsobj.unexefee !== 0 || (val.rcmResult.parameters && val.rcmResult.parameters.zeroPayPage === '0' && !val.rcmResult.isChange)
    })
    this.receiveSocket()
  },
  methods: {
    list (searchFirstPage = false) {
      this.$refs.taskTable.list(searchFirstPage)
    },
    // 发送短信
    sendMessage () {
      // 如果是多人的话 需要重新组装数据 （单人和多人开始设计为一个数组就好了） by lvjiangtao
      if (this.sendPatient.length === 0) {
        this.$messageTips(this, 'warning', '请选择接收短信客户', '警告')
        return false
      } else {
        let params = {
          msgType: 108, // 想要发的短信所属的大分类 必传
          receivers: [],
        }
        this.sendPatient.forEach(item => {
          params.receivers.push({
            id: item.patientId,
            name: item.patientName,
            mobile: item.patientMobile ? item.patientMobile : ((item.patient && item.patient.mobile) ? item.patient.mobile : ''),
            payload: {
              docName: item.doctorName ? item.doctorName : '科室号', // 医生姓名
              hosName: item.organName, // 医院姓名
              patientName: item.patientName,
              clinicName: item.providerName, // 诊室名称
              appointTime: `${this.$moment(item.date).format('MM-DD')} ${item.startTimeStr}`, // 预约时间
              visitTime: item.arrivalTime ? this.$moment(item.arrivalTime).format('MM-DD HH:mm') : this.$moment().format('MM-DD'), // 就诊时间
              appointDate: this.$moment(item.date).format('MM-DD'), // 预约日期
              appointStartTime: item.startTimeStr, // 预约开始时间
              appointEndTime: item.endTimeStr // 预约结束时间
            }
          })
        })
        if (this.sendPatient.length === 1) {
          params.deptId = this.sendPatient[0].deptId
        } else {
          delete params.deptId
        }
        this.msgParams = params
        this.$refs.sendmessage.sendVisible = true
      }
    },
    handleSelectionChange (val) {
      this.sendPatient = val.filter(item => {
        return item.patientId !== null && item.patientMobile !== null
      })
    },
    cellClick (row, column, cell, event) {
      if (row.column.property === 'symptom') {
        this.tempPatient = row.row
        this.$refs.remark.open()
      }
    },
    printFee () {
      let fee = 0
      for (let v in this.settlementData.payDetails) {
        if (v !== '会员卡支付') {
          fee += this.settlementData.payDetails[v]
        }
      }
      return fee.toFixed(2)
    },
    // 最早的挂号条打印方法，1年多之前就去掉了，但是方法和组件没有注释掉，大爷的（4.11.1）
    // 获取打印组件需要的参数
    // async getPrintData (value) {
    //   let printStatus = false
    //   let that = this
    //   var params = {
    //     returnFlag: 0,
    //     orderid: value.orderid
    //   }
    //   let res = await api.getSettlementByOrderId(params)
    //   if (res.data.length > 0) {
    //     settlementapi.getById(res.data[0].id).then(result => {
    //       that.settlementData = Object.assign(that.settlementData, result)
    //       that.settlementData.printfee = that.printFee()
    //       that.settlementData.visitSn =
    //         result.details.settlementDetail[0].rootorderid
    //       if (that.settlementData.payStatus === 2 && !printStatus) {
    //         that.createPrint()
    //       }
    //       if (printStatus) {
    //         that.createPrint()
    //       }
    //     })
    //   } else {
    //     this.$messageTips(this, 'warning', '没有结算单数据，dyd', '提示')
    //   }
    // },
    // 打印挂号条
    // createPrint () {
    //   // todo 打印相关的需要整理
    //   if (this.$ever.getClinicConfig().printModel === 1) {
    //     frPrint('RCM-outpatient_info', { id: this.settlementId })
    //   } else {
    //     this.$refs.registrationForm.print()
    //   }
    // },
    // 打印
    print (value) {
      this.$refs.printList.open(value)
    },
    questionDialog (value) {
      this.$refs.questionnaireDialog.open(value)
    },
    async showDetailFun (val) {
      this.tempPatient = val
      this.$refs.cancelappoint.open()
    },
    done () {
      this.list()
    },
    async getDptlist () { // 获取科室
      await api.getDptList({ 'date': this.queryObj.date }).then(rs => {
        if (rs.head.errCode === 0) {
          this.providers = [{ id: '', deptName: '全部科室', isChecked: true }, ...rs.data.map(v => {
            return {
              id: v.deptId,
              deptName: v.deptName,
              isChecked: false
            }
          })]
        }
      })
    },
    checkDpt (index) {
      this.providers.map((item, kindex) => {
        item.isChecked = kindex === index
        return item
      })
      this.queryObj.deptId = this.providers[index].id
      this.queryObj.resourceId = ''
      this.getDoctors()
      this.getList(this.queryStatus)
    },
    checkDoctor (index) {
      this.providerDoctors.map((item, kindex) => {
        item.isChecked = kindex === index
        return item
      })
      this.queryObj.resourceId = this.providerDoctors[index].resourceId
      this.getList(this.queryStatus)
    },
    async getDoctors () {
      await api.getResourceList(
        {
          'date': this.queryObj.date,
          'deptId': this.queryObj.deptId || ''
        }
      ).then(rs => {
        if (rs.head.errCode === 0) {
          this.providerDoctors = [
            { resourceId: '', resourceName: '全部出诊医生', isChecked: true },
            ...rs.data.map(v => {
              return {
                resourceId: v.resourceId,
                resourceName: v.resourceName,
                isChecked: false
              }
            })
          ]
        }
      })
    },
    appointSuccess (val) {
      if (val.sendMessage) {
        this.sendPatient = val.patient
      }
    },
    // 直接发请求退号
    async appointCancel (val) {
      const res = await appointapi.cancel(val.id)
      if (res && res.head && res.head.errCode === 0) {
        if (res.data.rcmResult && res.data.rcmResult !== '-1') {
          res.data.rcmResult.visitNumber = val.visitNumber
          this.$bus.$emit('appoint:rcm2Visible', {
            flag: 'ajax_success',
            printType: 'register',
            rcmResult: res.data.rcmResult,
            appointId: val.id,
            isRefund: true,
            xianchang: 1,
            isMedicalInsurance: val.isMedicalInsurance
          })
        } else {
          this.$messageTips(this, 'success', '退号成功', '提示')
          this.list()
        }
      }
    },
    payStatus () {
      this.$messageTips(this, 'success', this.yzsobj.isRefund ? '退费成功' : '缴费成功', '提示')
      if (this.printType === 'register') {
        this.paydialogVisible = false
        this.list()
        this.$bus.$emit('appoint:pay', true)
      }
    },
    closePayDialog () {
      let request = !this.yzsobj.isRefund ? this.numberapi.registerNotPay : this.numberapi.refundRegisterNotPay
      request({ id: this.yzsobj.appointId }).then(rs => {
        this.$bus.$emit('appoint:pay', true)
      })
      this.paydialogVisible = false
    },
    editPrecheck (val, isEdit) { // 修改预检
      if (isEdit) {
        this.precheckData = val
        this.nosubmit = val.iconStatesMap.yu_jian.iconState === 30
        this.$refs.tirggeryujian.open()
      } else {
        this.precheckData = val
        this.nosubmit = false
        this.$refs.tirggeryujian.open()
      }
    },
    showReception () { // 快速接诊
      this.$refs.rapidaccepts.open()
    },
    senddrug (val) {
      if (val) {
        // this.datekey = new Date()
        // this.drugObj = val
        this.$refs.senddrug.open(val)
      }
    },
    linkMemberadd () {
      window.open(this.$ever.crmIndex + '/crm/memberadd', '_blank')
    },
    linkAppointment () {
      this.$router.push({
        name: 'appointpanel',
      })
    },
    queryBystatus (flag) {
      api.queryBystatus(this.queryObj).then(rs => {
        if (rs && rs.head.errCode === 0) {
          this.tableData = []
          let tempnoArrival = []
          tempnoArrival = rs.data.nonArrivalAppointmentList && [...rs.data.nonArrivalAppointmentList] // 未签到数据
          let tempArrival = []
          tempArrival = rs.data.arrivalAppointmentList && [...rs.data.arrivalAppointmentList] // 已签到
          let leaveArr = []
          leaveArr = rs.data.leaveAppointmentList && [...rs.data.leaveAppointmentList] // 已离开
          this.tableData = [...tempnoArrival, ...tempArrival, ...leaveArr]
          this.totalCount = this.tableData.length
          if (flag) {
            this.getDptlist()
            this.getDoctors()
          }
        }
      })
    },
    queryBydoctor () {
      api.queryBydoctor(this.queryObj).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = []
          this.tableData = rs.data
          this.totalCount = rs.data.length
        }
      })
    },
    queryBystarttime () {
      api.queryBystarttime(this.queryObj).then(rs => {
        if (rs.head.errCode === 0) {
          this.tableData = []
          this.tableData = rs.data
          this.totalCount = rs.data.length
        }
      })
    },
    diagnosis (value, key) {
      this.diagData = { ...value }
      this.diagType = key === 'arrival' ? 1 : 0
      this.$refs.diagnosis.open()
    },
    fillmember (value) {
      // 临时档补充弹框
      this.tempPatient = value
      this.$refs.temppatient.open()
    },
    getList (val = 1, flag) {
      this.tableData = []
      switch (val) {
        case 1: {
          this.queryBystatus(flag)
          break
        }
        case 2: {
          this.queryBydoctor()
          break
        }
        case 3: {
          this.queryBystarttime()
          break
        }
      }
    },
    updateEditor (val) {
      this.editFlag = val
    },
    receiveSocket () {
      wsConnect('/exchange/exchange.thc-arrange.business.kanban_refresh/routingKey.thc-arrange.business.kanban_refresh', (client, d) => {
        this.wsClient = client
        if (client) {
          this.getList(this.queryStatus)
        }
      })
      this.getList(this.queryStatus, true)
    }
  },
  watch: {
    'queryObj.date': {
      async handler (val) {
        if (val) {
          this.queryObj.deptId = ''
          this.queryObj.resourceId = ''
          this.getList(this.queryStatus)
          await this.getDoctors()
          await this.getDptlist()
          this.providerDoctors[0].isChecked = true
          this.providers[0].isChecked = true
        }
      },
      deep: true
    },
    'queryStatus': {
      handler (val) {
        this.getList(val)
      },
      deep: true
    }
  },
  components: {
    serviceIconHandler,
    serviceIconPopover,
    dialogAppointDetail,
    dialogSenddrug,
    sendMessage2,
    rcm,
    medicalInsurance,
    // printregistrationform,
    todoEditor,
    dialogDiagnosis,
    dialogPrintList,
    dialogPrecheck,
    dialogTemppatient,
    dialogCancelAppoint,
    dialogRapidAccepts,
    dialogRemark,
    // phrformDialog,
    dialogQuestionnaire
  }
}
</script>
<style lang="scss" scoped>
.layout_box {
  .layout_inner.spe {
    .main-wrap {
      background-color: #f8f9fa;
      border-right: 1px solid #d8d8d8;
      &.spe {
        padding-top: 0;
      }
      .query-form {
        color: #3a414a;
        .el-col {
          display: flex;
          align-items: center;
          font-size: 14px;
          label {
            font-weight: 500;
            margin-right: 12px;
          }
        }
      }
      /deep/ .el-form-item__content {
        width: 100%;
      }
      /deep/ .el-form--inline .el-form-item {
        margin-right: 0px;
      }
    }
    /deep/ .el-button + .el-button {
      margin-left: 5px;
    }
    /deep/ .info {
      width: 100px;
      height: 16px;
      text-overflow: clip;
    }
    /deep/ .a-ellipsis {
      display: inline-block;
      width: 100px;
      height: 19px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
    }
    /deep/ .el-button + .el-button {
      margin-left: 5px;
    }
    /deep/ .info {
      width: 100px;
      height: 16px;
      text-overflow: clip;
    }
    /deep/ .a-ellipsis {
      display: inline-block;
      width: 100px;
      height: 19px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
    }
    /deep/ .f20 {
      font-size: 20px !important;
    }
  }
}
.s1 {
  vertical-align: top;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 34px;
}
.h36 {
  height: 36px;
  text-align: center;
}
.bor4 {
  // border: 1px solid #98aec3;
  // border-radius: 4px;
}
.borradiu {
  border-radius: 4px;
}
.li_border {
  border-top: 1px solid #d9dee5;
}
ul {
  padding-inline-start: 0px;
  margin-block-start: 0px;
  margin-block-end: 0px;
  width: 100%;
}
.is_checked {
  background: #2980e0;
  color: #ffffff;
}
.ml50 {
  margin-left: 50px;
}
.pl30 /deep/ .el-input__inner {
  border-radius: 4px;
  height: 36px;
}
.min340 {
  width: 340px;
}
.border-right {
  border-right: 1px solid #D4DAE0;
}
.border-left {
  border-left: 1px solid #98aec3;
}
.dpt_text {
  margin: 0 auto;
  line-height: 36px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.colae{
  color:#AEAEAE;
}
</style>
