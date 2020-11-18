<template>
  <div class="advice_list">
    <div class="advice_list_wrap">
      <el-row class="header">
        <el-col :span="18" class="clearfix">
          <el-radio-group class="checklist" v-model="trimfilters">
            <el-radio :label="-1">全部</el-radio>
            <el-radio :label="1">长期</el-radio>
            <el-radio :label="0">临时</el-radio>
          </el-radio-group>
          <sys-select
            class="checklist"
            v-model="statusFilter"
            type="checkbox"
            :options="[{id: 10, name: '执行中'}]"
          ></sys-select>
          <el-select
            v-model="filters"
            multiple
            placeholder="请选择医嘱类型"
            class="checklist"
            style="width: 400px;"
          >
            <el-option
              v-for="item in selectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <!-- <sys-type class="checklist" style="width: 400px;" code="THC_WH_OBJECT_SUB_TYPE" v-model="filters" placeholder="请选择医嘱类型" :multiple="true"></sys-type> -->
        </el-col>
        <el-col :span="6" align="right">
          <el-button type="primary" @click="print" class="printAdvice" v-if="!noOperate">打印医嘱</el-button>
        </el-col>
      </el-row>
      <div class="all-body" :class="{hide: !showAll}">
        <table
          style="width:100%"
          cellpadding="0"
          cellspacing="0"
          class="table-wrap"
          v-if="allAdviceList[0]"
        >
          <thead>
            <tr>
              <th align="left" width="7%">开始时间</th>
              <th align="left" :width="type==='path' ? '5%' : '5%'">长/临</th>
              <th align="left" :width="type==='path' ? '5%' : '6%'">类型</th>
              <th align="left" width="18%">医嘱</th>
              <th align="left" width="20%"></th>
              <th align="left" width="8%">嘱托</th>
              <th align="left" width="5%" v-if="type==='path'">是否必选</th>
              <th align="left" width="7%">停止时间</th>
              <th align="left" width="7%">停止医生</th>
              <th align="right" width="6%">金额</th>
              <th align="left" width="5%">状态</th>
              <th align="left" width="180px" v-if="!noOperate">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(obj, key, i) in dataList" :key="i">
              <td :colspan="type==='path' ? 12 : 11">
                <table style="width:100%" cellpadding="0" cellspacing="0" class="table-item">
                  <tbody>
                    <tr v-for="(item, j) in obj" :key="j">
                      <td align="left" width="7%" :class="{line: j===obj.length-1}">
                        <div
                          :class="{lineThrough:String(item.status) === '11', pathColor: type === 'path'&&!item.pathwayAdviceId}"
                        >
                          <span
                            v-if="item.startTime"
                          >{{$moment(item.startTime).format('MM/DD HH:mm')}}</span>
                          <span
                            v-else-if="item.sendTime"
                          >{{$moment(item.sendTime).format('MM/DD HH:mm')}}</span>
                          <span v-else>--</span>
                        </div>
                      </td>
                      <td
                        align="left"
                        :width="type==='path' ? '5%' : '5%'"
                        class="leftline"
                        :class="{line: j===obj.length-1, lineThrough:String(item.status) === '11', pathColor: type === 'path'&&!item.pathwayAdviceId}"
                      >{{item.termType === 0 ? '临时' : '长期'}}</td>
                      <td
                        align="left"
                        :width="type==='path' ? '5%' : '6%'"
                        class="leftline"
                        :class="{line: j===obj.length-1, lineThrough:String(item.status) === '11', pathColor: type === 'path'&&!item.pathwayAdviceId}"
                      >
                        <span v-if="j === 0">
                          <sys-value type="THC_WH_OBJECT_SUB_TYPE" :code="item.adviceType"></sys-value>
                        </span>
                      </td>
                      <td
                        align="left"
                        width="18%"
                        class="leftline"
                        :class="{line: j===obj.length-1, lineThrough: String(item.status) === '11', pathColor: type === 'path'&&!item.pathwayAdviceId}"
                      >
                        <template v-if="item.adviceType === '303' || item.adviceType === '304'">
                          <span
                            v-for="(drag, k) in JSON.parse(item.adviceContent, true)"
                            :key="k"
                            class="eline"
                          >
                            <label
                              :class="['bold', {'cRed': item.status === 2 || item.status === 70}]"
                            >{{drag.serviceItem.name}}</label>
                            <label style="top:-5px;" class="lab" v-if="drag.footnote">
                              (
                              <sys-value type="THC_SYS_DECOCTINGMETHOD" :code="drag.footnote"></sys-value>)
                            </label>
                            <label
                              style="bottom:-5px;"
                              class="lab"
                            >{{drag.amount}}{{drag.amountUnitTxt}}</label>
                          </span>
                        </template>
                        <el-row :gutter="10" v-else>
                          <el-col :span="24">
                            <template
                              v-if="obj.length > 1 && ['301', '302'].includes(item.adviceType)"
                            >
                              <span v-if="j===0">┏</span>
                              <span v-if="j===obj.length-1">┗</span>
                              <span v-if="j > 0 && j < obj.length-1">┣</span>
                            </template>
                            <template v-if="item.doctorAdviceType === '2'">
                              <service-set-items :item="item" :type="type"></service-set-items>
                            </template>
                            <template v-else>
                              <drug-info
                                class="bold"
                                v-if="['301', '302'].includes(item.adviceType)"
                                :drug-obj="item"
                                :recipe="item"
                              ></drug-info>
                              <span
                                v-else
                                :class="['bold', {'cRed': item.status === 2 || item.status === 70}, {lineThrough: String(item.status) === '11', pathColor: type === 'path'&&!item.pathwayAdviceId}]"
                              >{{item.adviceName && item.adviceName != 'undefined' ? item.adviceName : '--'}}</span>
                              <template
                                v-if="item.adviceType === '10001' && !noOperate&&item.status!== 2&&item.status!== 70&&String(item.status) !== '11'"
                              >
                                <el-button
                                  size="small"
                                  class="ml20"
                                  plain
                                  @click="matchingBlood(item)"
                                >通知配血</el-button>
                              </template>
                              <template
                                v-if="item.adviceType === '10009' && !noOperate&&item.status!== 2&&item.status!== 70&&String(item.status) !== '11'"
                              >
                                <el-button
                                  size="small"
                                  class="ml20"
                                  plain
                                  @click="addBloodService(item)"
                                >添加取血</el-button>
                              </template>
                            </template>
                          </el-col>
                        </el-row>
                      </td>
                      <td align="left" width="20%" :class="{line: j===obj.length-1}">
                        <advice-item-show :item="item" :visit-type="3"></advice-item-show>
                      </td>
                      <td
                        align="left"
                        width="8%"
                        :class="{line: j===obj.length-1, lineThrough: String(item.status) === '11', pathColor: type === 'path'&&!item.pathwayAdviceId}"
                      >{{item.entrust || '--'}}</td>
                      <td
                        align="left"
                        width="5%"
                        :class="{line: j===obj.length-1, lineThrough: String(item.status) === '11', pathColor: type === 'path'&&!item.pathwayAdviceId}"
                        v-if="type==='path'"
                      >{{item.mustselectFlag ? '是' : '否'}}</td>
                      <td
                        align="left"
                        width="7%"
                        class="leftline"
                        :class="{line: j===obj.length-1, lineThrough: String(item.status) === '11', pathColor: type === 'path'&&!item.pathwayAdviceId}"
                      >
                        <template
                          v-if="item.status === 6"
                        >{{item.stopTime ? $moment(item.stopTime).format('MM/DD HH:mm') : '--'}}</template>
                        <template v-else>--</template>
                      </td>
                      <td
                        align="left"
                        width="7%"
                        class="leftline"
                        :class="{line: j===obj.length-1, lineThrough: String(item.status) === '11', pathColor: type === 'path'&&!item.pathwayAdviceId}"
                      >
                        <template v-if="item.status === 6">{{item.stopDoctorName || '--'}}</template>
                        <template v-else>--</template>
                      </td>
                      <td
                        align="right"
                        width="6%"
                        class="leftline"
                        :class="{line: j===obj.length-1, lineThrough: String(item.status) === '11', pathColor: type === 'path'&&!item.pathwayAdviceId}"
                      >{{itemPriceCount(item)}}</td>
                      <td
                        align="left"
                        width="5%"
                        class="leftline"
                        :class="{line: j===obj.length-1}"
                      >
                        <template v-if="item.status === 2 || item.status === 70">
                          <el-tooltip placement="left" effect="light">
                            <template slot="content">
                              驳回原因：
                              <template
                                v-if="item.checkPrescriptionObject && item.checkPrescriptionObject.description"
                              >{{item.checkPrescriptionObject.description}}</template>
                              <template v-else>——</template>
                            </template>
                            <span
                              v-if="item.status && ADVICE_STATUS[String(item.status)]"
                              :style="{color: ADVICE_STATUS[String(item.status)].col}"
                              :class="{lineThrough: String(item.status) === '11', pathColor: type === 'path'&&!item.pathwayAdviceId}"
                            >{{$t(ADVICE_STATUS[String(item.status)].txt)}}</span>
                          </el-tooltip>
                        </template>
                        <template v-else-if="item.status === 5 || item.status === 60">
                          <template
                            v-if="['800', '801', '2125', '10001', '10003'].includes(item.adviceType)"
                          >
                            <span
                              v-if="item.status && ADVICE_STATUS[String(item.status)]"
                              :style="{color: ADVICE_STATUS[String(item.status)].col}"
                              @click="viewReport(item)"
                              :class="{lineThrough: String(item.status) === '11', pathColor: type === 'path'&&!item.pathwayAdviceId}"
                            >{{$t(ADVICE_STATUS[String(item.status)].txt)}}</span>
                          </template>
                          <template v-else>
                            <span
                              v-if="item.status && ADVICE_STATUS[String(item.status)]"
                              :style="{color: ADVICE_STATUS[String(item.status)].col}"
                              :class="{lineThrough: String(item.status) === '11', pathColor: type === 'path'&&!item.pathwayAdviceId}"
                            >{{$t(ADVICE_STATUS[String(item.status)].txt)}}</span>
                          </template>
                        </template>
                        <template v-else>
                          <span
                            v-if="(item.status || item.status === 0) && ADVICE_STATUS[String(item.status)]"
                            :style="{color: ADVICE_STATUS[String(item.status)].col}"
                            :class="{lineThrough: String(item.status) === '11', pathColor: type === 'path'&&!item.pathwayAdviceId}"
                          >{{$t(ADVICE_STATUS[String(item.status)].txt)}}</span>
                        </template>
                        <template
                          v-if="['800', '801'].includes(item.adviceType) && item.isException"
                        >
                          <i class="iconfont icon-yichang cRed"></i>
                        </template>
                      </td>
                      <td
                        align="left"
                        width="180px"
                        class="leftline"
                        :class="{line: j===obj.length-1}"
                        v-if="!noOperate"
                      >
                        <template v-if="j===0 && handlesDis(item)">
                          <template v-if="item.status===1">
                            <ever-confirm
                              :msg="'您确定要撤回此医嘱吗？'"
                              action="撤回医嘱"
                              @confirm="cancelAdvice(key)"
                              :disabled="historyStage"
                            >
                              <template slot="reference">
                                <el-button
                                  type="primary"
                                  size="small"
                                  :disabled="historyStage"
                                >{{$t('撤回')}}</el-button>
                              </template>
                            </ever-confirm>
                          </template>
                          <template v-if="item.termType ===1 && item.status===10">
                            <ever-confirm
                              :msg="'您确定要停止此医嘱吗？'"
                              action="停止医嘱"
                              @confirm="stopAdvice(key)"
                              :disabled="historyStage"
                            >
                              <template slot="reference">
                                <el-button
                                  type="primary"
                                  size="small"
                                  :disabled="historyStage"
                                >{{$t('停止')}}</el-button>
                              </template>
                            </ever-confirm>
                          </template>
                          <template
                            v-if="item.status===4 || (item.termType ===0 && item.status===10) || item.status===6 || item.status===60"
                          >
                            <ever-confirm
                              :msg="'您确定要作废此医嘱吗？'"
                              action="作废医嘱"
                              @confirm="invalidAdvice(key)"
                              :disabled="historyStage"
                            >
                              <template slot="reference">
                                <el-button
                                  type="primary"
                                  size="small"
                                  :disabled="historyStage"
                                >{{$t('作废')}}</el-button>
                              </template>
                            </ever-confirm>
                          </template>
                          <template v-if="item.status===2">
                            <ever-confirm
                              :msg="'已驳回医嘱编辑前需先撤回，确认撤回？'"
                              action="编辑医嘱"
                              @confirm="cancelAdvice(key)"
                              :disabled="historyStage"
                            >
                              <template slot="reference">
                                <el-button
                                  type="primary"
                                  size="small"
                                  :disabled="historyStage"
                                >{{$t('编辑')}}</el-button>
                              </template>
                            </ever-confirm>
                          </template>
                          <template v-if="item.status===2">
                            <ever-confirm
                              :msg="'您确定要删除此项目吗？'"
                              action="删除医嘱"
                              @confirm="deleteAdvice(key)"
                              :disabled="historyStage"
                            >
                              <template slot="reference">
                                <el-button
                                  type="primary"
                                  size="small"
                                  :disabled="historyStage"
                                >{{$t('删除')}}</el-button>
                              </template>
                            </ever-confirm>
                          </template>
                          <el-button
                            size="small"
                            @click="viewReport(item)"
                            v-if="['2125'].includes(item.adviceType)"
                          >{{$t('通知单')}}</el-button>
                          <el-button
                            size="small"
                            @click="printAdvice(item)"
                            v-if="['303','304','800','801','802','10003'].includes(item.adviceType)"
                          >{{$t('打印')}}</el-button>
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <ever-no-data
          style="position: absolute; margin: 0; width: 130px; height: 130px; left: 50%; margin-left: -65px; top: 50%;margin-top: -65px;"
          v-else
        ></ever-no-data>
      </div>
    </div>
    <advice-print :visible.sync="printvisible"></advice-print>
    <reportcard ref="reportcard"></reportcard>
    <el-dialog :visible.sync="showMachBlood" title="交叉配血" class="ui_dialog_02 spe dialog_machBlood">
      <div class="dialog_content">
        <div class="conWrap">
          <span class="con">请填写配血量：</span>
          <el-input v-model="machBloodNum">
            <template slot="append">
              <sys-value type="THC_CPOE_BLOOD_UNIT" :code="currentAdvice.bloodUnit"></sys-value>
            </template>
          </el-input>
          <span class="con">
            申请血量：{{currentAdvice.applyBloodNum}}
            <sys-value type="THC_CPOE_BLOOD_UNIT" :code="currentAdvice.bloodUnit"></sys-value>
          </span>
        </div>
      </div>
      <div class="dialog_footer">
        <el-checkbox v-model="ifBloodAdvice">同时添加取血医嘱</el-checkbox>
        <el-button type="primary" @click="submitMachBlood">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import adviceapi from '@/inpatient/store/adviceapi'
import residentApi from '@/inpatient/store/resident'
import sysvalue from '@/warehouse/store/sysvalueapi'
import phrapi from '@/inpatient/store/phr'
// import pathapi from '@/form/store/pathmanage'
import drugInfo from '@/inpatient/components/drug.info'
import adviceItemShow from '@/inpatient/components/medical.orders/advice.item.show'
import serviceSetItems from '@/inpatient/components/medical.orders/service.set.items'
import advicePrint from './dialog-print.vue'
import reportcard from '@/infusion/components/report.card.vue'
// import storage from '@/util/storage'
import { frPrint, floatTool, ADVICE_STATUS, objSortBy } from '@/util/common'
export default {
  data () {
    return {
      adviceapi,
      residentApi,
      phrapi,
      // pathapi,
      // storage,
      ADVICE_STATUS,
      trimfilters: -1,
      filters: [],
      filterList: [],
      toDay: '',
      dataList: [],
      allAdviceList: [],
      statusFilter: '',
      printvisible: false,
      printParams: [],
      currentStageIds: [],
      selectOptions: [],
      showMachBlood: false,
      machBloodNum: '',
      currentAdvice: {},
      ifBloodAdvice: false
    }
  },
  /*
    baseInfo(object): 患者基本信息，主要用到：doctorType，hospitalizedNumber，patientId
    noOperate(boolean)：是否需要最右侧操作列，false:需要，true:不需要（用于展示）
    handleDisabled(boolean)：有操作时，对操作按钮是否展示的判断
    showAdd(boolean)：住院医生开医嘱时，用于交互的判断，初始值：false
    showAll(boolean)：住院医生开医嘱时，用于交互的判断，初始值：true
    loading(boolean): 是否显示表格加载loading
    stageId(string): 临床路径阶段id
    type(string): 引用的类型, path: 临床路径
    historyStage(boolean): 临床路径，是否是历史阶段
   */
  props: ['baseInfo', 'noOperate', 'handleDisabled', 'showAdd', 'showAll', 'stageId', 'type', 'historyStage'],
  components: {
    drugInfo,  // 药品信息组件
    adviceItemShow,
    serviceSetItems,
    advicePrint,
    reportcard
  },
  created () {
    this.setAllAdviceList()
    // 判断某一个打印机打印完成，启动下一个打印任务
    // var _this = this
    // window.addEventListener('message', function (e) {
    //   if (e.data === 'printdone' && _this.printParams.length) {
    //     _this.printRecipe()
    //   }
    // }, false)
    // 过滤值集中三级分类
    sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(options => {
      options.forEach(item => {
        if (item.sysTypeObject && item.sysTypeObject.code === 'THC_WH_OBJECT_TYPE') {
          this.selectOptions.push(item)
        }
      })
    })
  },
  methods: {
    handlesDis (item) {
      if (this.type !== 'path') {
        if (this.currentStageIds.includes(item.stageInstanceId)) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    itemPriceCount (item) {
      if (item && !item.price) {
        return '￥0.00'
      } else {
        if (!Number(item.isEmergency)) {
          return '￥' + parseFloat(item.price).toFixed(2)
        } else {
          let urgentFee = 0
          if (typeof item.serviceItem === 'string' && JSON.parse(item.serviceItem).urgentFee) {
            urgentFee = JSON.parse(item.serviceItem).urgentFee
          }
          if (typeof item.serviceItem === 'object' && item.serviceItem.urgentFee) {
            urgentFee = item.serviceItem.urgentFee
          }
          let count = floatTool.add(item.price, urgentFee)
          return '￥' + parseFloat(count).toFixed(2)
        }
      }
    },
    viewReport (data) { // 查看检验报告 手术通知单
      if (data.adviceType === '2125') {
        window.location.href = window.origin + window.location.pathname + '#/csmessage?applicationFormId=' + data.id
      } else {
        this.$refs.reportcard.openDialog(data, true)
      }
    },
    printAdvice (data) {
      this.$messageTips(this, 'warning', '调用帆软打印，方法废弃，请尽快切换', '提示')
      // if (data && data.id && this.baseInfo.patientId) {
      //   let obj = {
      //     code: '',
      //     params: {
      //       // doctor_advice_id: data.id,
      //       patientId: this.baseInfo.patientId
      //     },
      //     printParams: {
      //       preview: false,
      //       settings: {
      //         portrait: false,
      //         marginTop: 0,
      //         marginRight: 0,
      //         marginBottom: 0,
      //         marginLeft: 0
      //       }
      //     }
      //   }
      //   if (data.adviceType === '800') {
      //     obj.params.id = data.id
      //     // obj.code = 'thc_phr.jianchashenqing_20180910.cpt'
      //     this.printParams.push(obj)
      //   } else if (data.adviceType === '801') {
      //     obj.params.id = data.id
      //     // obj.code = 'thc_phr.jianyanshenqing_20180910.cpt'
      //     this.printParams.push(obj)
      //   } else if (data.adviceType === '802') {
      //     obj.params.doctor_advice_id = data.id
      //     // obj.code = 'thc_phr.zhiliaoshenqing_20180910.cpt'
      //     this.printParams.push(obj)
      //   } else if (data.adviceType === '10003') {
      //     obj.params.recipeId = data.id
      //     obj.params.hospitalized_number = this.$route.query.hospitalizedNumber
      //     // obj.code = 'BING_LI_SHEN_QING_DAN_ZHUYUAN'
      //     this.printParams.push(obj)
      //   } else if (['303', '304'].includes(data.adviceType)) {
      //     obj.params.id = data.id
      //     // 如果是代煎的中药，需要打印中药处方和代煎费的处方单
      //     // obj.code = 'ZHU_YUAN_ZHONG_YAO_CHU_FANG_DAN'
      //     this.printParams.push(obj)
      //     if (data.decoct) {
      //       delete obj.params.id
      //       obj.params.recipeId = data.id
      //       obj.params.visitSn = this.$route.query.visitNumber
      //       this.printParams.push({
      //         params: obj.params,
      //         // code: 'ZHU_YUAN_ZHONG_YAO_CHU_FANG_DAI_JIAN'
      //       })
      //     }
      //   }
      //   this.printRecipe()
      // } else {
      //   this.$messageTips(this, 'warning', '打印参数缺失', '提示')
      // }
    },
    // printRecipe () {
    //   let toPrint = this.printParams[0]
    //   if (toPrint) {
    //     frPrint(toPrint.code, toPrint.params, toPrint.printParams)
    //     this.printParams.shift()
    //   }
    // },
    addBloodService (item) {
      let data = [{
        oldBloodAdviceId: item.id,
        bloodUnit: (item.adviceContent && JSON.parse(item.adviceContent).bloodUnit) || '',
        adviceType: '10000',
        serviceItem: '{"serviceClassification":"10000"}',
        doctorAdviceType: item.doctorAdviceType,
        preparationAdviceId: item.preparationAdviceId,
        matchingAdviceId: item.id,
        applyBloodNum: item.applyBloodNum,
        matchingBloodNum: item.matchingBloodNum
      }]
      data[0].adviceContent = JSON.stringify(data[0])
      this.$emit('add-update', data)
    },
    matchingBlood (item) {
      this.showMachBlood = true
      this.currentAdvice = item
    },
    async submitMachBlood () {
      if (!this.machBloodNum) {
        return this.$messageTips(this, 'warning', '请输入交叉配血量', '提示')
      }
      let params = {
        preparationAdviceId: this.currentAdvice.id,
        matchingBloodNum: this.machBloodNum,
        ifCreateTakeBlood: this.ifBloodAdvice ? 1 : 0
      }
      let res = await this.residentApi.createMatchingAdvice(params)
      if (res && res.data) {
        this.setAllAdviceList()
        this.showMachBlood = false
        this.$messageTips(this, 'success', '添加交叉配血成功', '提示')
      } else {
        this.showMachBlood = false
        this.$messageTips(this, 'warning', '添加交叉配血失败', '提示')
      }
    },
    async getCurrentStage () {
      if (!this.$route.query.hospitalizedNumber) {
        return false
      }
      let res = await this.residentApi.getStageInstanceIdByHospitalizedNumber({
        hospitalizedNumber: this.$route.query.hospitalizedNumber
      })
      if (res && res.data) {
        this.currentStageIds = res.data.stageInstanceIds || []
      }
    },
    // 获取全部医嘱数据并备份，方便于筛选
    setAllAdviceList (status, flag) {
      // 当获取的是全部医嘱的列表，调用获取路径信息接口，获取当前阶段ID，用于判断是否禁用操作按钮
      if (status !== '0' && status !== 0) {
        this.getCurrentStage()
      }
      let obj = {}
      let request
      if (this.type === 'path') {
        obj = {
          stageInstanceId: this.stageId,
          hospitalizedNumber: this.baseInfo.hospitalizedNumber,
          termType: [],
          adviceType: this.filters && status !== '0' && status !== 0 ? this.filters : [],
          status: status || (this.statusFilter ? '10' : ''),
          subVisitTypeList: [302]
        }
        if (this.trimfilters === -1 || status === '0' || status === 0) {
          obj.termType = [1, 0]
        } else {
          obj.termType.push(this.trimfilters)
        }
        // 临床路径已经不存在了，相关的逻辑去掉 by lvjiangtao@everjiankang.com 4.6.1
        // request = this.pathapi.adviceInstanceList // 获取临床路径列表
      } else {
        this.baseInfo.doctorType = 1
        obj = {
          hospitalizedNumber: this.baseInfo.hospitalizedNumber,
          doctorType: this.baseInfo.doctorType,
          adviceType: this.filters && status !== '0' && status !== 0 ? this.filters : [],
          visitType: 3
        }
        obj.status = status || (this.statusFilter ? '10' : '')
        obj.termType = []
        // 全部医嘱：住院和产房可看全部医嘱，麻醉医生只看自己的医嘱；
        // 待发送医嘱：均只可看自己的医嘱
        if (status) {
          obj.subVisitTypeList = [301, 305]
          if (this.$route.path.split('/')[1] === 'birth_doctors') {
            obj.subVisitTypeList = [304, 305]
          }
        }
        if (this.$route.path.split('/')[1] === 'ana') {
          obj.subVisitTypeList = [303]
        }
        if (this.trimfilters === -1 || status === '0' || status === 0) {
          obj.termType = [1, 0]
        } else {
          obj.termType.push(this.trimfilters)
        }
        request = this.phrapi.queryHospitalAdviceByHospitalNumber // 费用清单和医嘱
      }
      request(obj).then(rs => {
        if (rs && rs[0]) {
          // 获取开立状态医嘱
          if (status === '0' || status === 0) {
            // if (this.type !== 'path') {
            //   let list = []
            //   rs.forEach(v => {
            //     if (!v.stageInstanceId) {
            //       list.push(v)
            //     }
            //   })
            //   this.$emit('update', list.reverse())
            // } else {
            //   this.$emit('update', rs.reverse())
            // }
            this.$emit('update', rs.reverse())
          } else {
            this.allAdviceList = rs
            this.dataBack = this.filterList = JSON.parse(JSON.stringify(rs), true)
            this.checkOperation(rs)
          }
        } else {
          if (status === '0' || status === 0) {
            this.$emit('update', [])
          } else {
            this.allAdviceList = []
            this.dataBack = []
            this.filterList = []
          }
        }
      })
    },
    checkOperation (data) {
      let flag = false
      data.forEach(item => {
        if (item.status === 1 || item.termType === 1 && item.status === 10 || (item.status === 4 || item.termType === 0 && item.status === 10)) {
          flag = true
        }
      })
      this.$emit('operation', flag)
    },
    // 显示打印弹窗
    print () {
      this.printvisible = true
    },
    // 根据医嘱ID分组
    setGroupList () {
      let obj = {}
      if (!this.allAdviceList[0]) {
        return []
      }
      let n = 0
      this.allAdviceList.map(v => {
        if (v.adviceId) {
          if (obj[v.adviceId]) {
            if (v.isMain) {
              obj[v.adviceId].push(v)
            } else {
              obj[v.adviceId + ('&' + n + '')] = [v]
              n++
            }
          } else {
            obj[v.adviceId] = [v]
          }
          obj[v.adviceId] = objSortBy(obj[v.adviceId], 'sortNumber')
        }
      })
      this.dataList = obj
    },
    // 获取医嘱对应的订单编号集合
    getOrderIds (flag) {
      let ids = []
      this.dataList[flag.split('&')[0]].map(v => {
        ids.push(v.id)
      })
      return ids
    },
    // 撤回医嘱
    async cancelAdvice (flag) {
      let ids = this.getOrderIds(flag)
      const res = await adviceapi.cancelAdvice({ ids: ids })
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '医嘱撤回成功', '成功')
        this.setAllAdviceList()
      }
    },
    // 删除医嘱
    async deleteAdvice (flag) {
      let ids = this.getOrderIds(flag)
      const res = await adviceapi.deleteAdvice({ ids: ids })
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '删除成功', '成功')
        // this.updateService(flag)
        this.setAllAdviceList()
      }
    },
    // 撤回全部医嘱里的医嘱
    // updateService (flag) {
    //   // this.dataList[flag].map((item, i) => {
    //   //   this.waitSendData = this.waitSendData.concat(item)
    //   // })
    //   // 显示待发送医嘱区域
    //   // this.tabActive = '2'
    // },
    // 停止医嘱
    async stopAdvice (flag) {
      let ids = this.getOrderIds(flag)
      const res = await adviceapi.stopAdvice({ ids: ids })
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '医嘱已停止', '成功')
        this.setAllAdviceList()
      }
    },
    // 作废医嘱
    async invalidAdvice (flag) {
      let ids = this.getOrderIds(flag)
      const res = await adviceapi.invalidAdvice({ ids: ids })
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '医嘱已作废', '成功')
        this.setAllAdviceList()
      }
    },
    filterAdvice () {
      this.setAllAdviceList()
    }
  },
  watch: {
    'trimfilters' (val) {
      this.filterAdvice()
    },
    'toDay' (val) {
      this.filterAdvice()
    },
    'statusFilter' (val) {
      this.filterAdvice()
    },
    // 监听全部区域医嘱过滤条件
    'filters' (val) {
      this.filterAdvice()
    },
    // 监听全部区域里的医嘱数据源，如果发生改变重新分组
    'allAdviceList' (val) {
      this.setGroupList()
    }
  }
}
</script>

<style lang="scss" scoped>
.advice_list {
  font-size: 14px;
  .advice_list_wrap {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    .all-body {
      flex: 1;
    }
    .printAdvice {
      padding: 5px 10px;
      font-size: 12px;
      margin: 2px 5px 0 0;
    }
  }
  .header {
    .checklist {
      display: inline-block;
      margin-left: 20px;
      vertical-align: middle;
      /deep/ .el-radio + .el-radio,
      /deep/ .el-checkbox + .el-checkbox {
        margin-left: 20px;
        line-height: 1.5;
      }
      /deep/ .el-input__inner {
        height: 30px !important;
      }
      /deep/ .el-input__icon {
        line-height: 30px;
      }
    }
  }
  .all-body {
    overflow: auto;
    margin-top: 2px;
    position: relative;
    .table-wrap {
      font-size: 14px;
      border: 1px solid #cccccc;
      thead tr th {
        background: #eeeeee;
        padding: 3px 8px;
        line-height: 24px;
      }
      tbody > tr:nth-child(even) > td {
        background: #eeeeee;
      }
      tr.red td {
        color: #ee4433;
      }
      tr.green td {
        color: #5cbc2c;
      }
      tr.gray td {
        color: #bbbbbb;
      }
      .lineThrough {
        text-decoration: line-through;
      }
      .pathColor {
        color: #1c7bef;
      }
      .line {
        border-bottom: 1px solid #ddd;
      }
      .leftline {
        border-left: 1px solid #ddd;
        .eline {
          word-wrap: break-word;
          display: inline-block;
        }
        .ml20 {
          margin-left: 20px;
        }
      }
      .noline {
        border-bottom: none;
      }
      .table-item tr td {
        line-height: 24px;
        padding: 3px 8px;
        vertical-align: middle;
        border: none;
      }
      .el-button--danger {
        color: #fa5555;
        background: #fee;
        border-color: #fdbbbb;
      }
      .el-button--primary {
        color: #409eff;
        background: #ecf5ff;
        border-color: #b3d8ff;
      }
      .el-button--info {
        color: #878d99;
        background: #f3f4f5;
        border-color: #cfd1d6;
      }
      .el-button--success {
        color: #67c23a;
        background: #f0f9eb;
        border-color: #c2e7b0;
      }
    }
    .table-item {
      tbody > tr:nth-child(even) > td {
        background: inherit;
      }
    }
  }
  .hide {
    display: none;
  }
}
.dialog_machBlood {
  /deep/ .el-dialog {
    margin-top: 30vh !important;
    width: 420px;
    .el-dialog__title {
      font-weight: bold;
    }
    .el-dialog__headerbtn {
      top: 10px;
    }
  }
  .dialog_content {
    .conWrap {
      line-height: 36px;
      overflow: hidden;
      .con {
        float: left;
      }
      .el-input {
        width: 80px;
        margin-right: 30px;
        float: left;
        /deep/.el-input-group__append {
          padding: 0 8px;
        }
      }
    }
  }
  .dialog_footer {
    padding-top: 15px;
    display: flex;
    justify-content: space-between;
    line-height: 36px;
  }
}
// @media (max-height: 770px) {
//   .advice_list .all-body {
//     height: 305px;
//   }
//   .advice_list .h220 {
//     height: 144px;
//   }
//   .advice_list .mt20 {
//     margin-top: 10px;
//   }
// }
</style>
