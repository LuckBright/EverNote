<template>
  <div class="box_list">
    <el-row class="ever-row-01" v-if="patients && patients[0]">
      <el-col v-for="(item, index) in patients" :key="item.id" :class="{'prevent_click': isAdt}">
        <el-card
          ref='patient_card'
          class="patient_card"
          :class="className(item,index)"
          @dragenter.native="dragenter"
          @dragleave.native="dragleave"
        >
          <!-- 坏床 -->
          <div class="mainTop lock" v-if="item.bedType === 3" @drop="drop('lock')" @dragover.prevent >
            <p class="title clearfix">
              <el-tooltip :open-delay='300'
                effect="dark"
                :content="item.bedName"
                placement="top"
              >
                <b>{{item.bedName || '--'}}</b>
              </el-tooltip>
            </p>
            <div class="emptyBed">
              <img src="../../assets/img/lock.png" alt>
            </div>
          </div>
          <!-- 已分配床位 -->
          <div class="mainTop" v-else-if="item.bedType === 1" @click="check(item,index,$event)" @dblclick="dblclick(item)" @drop="drop('zc')" @dragover.prevent >
            <!-- 床号，科室，入院时间 -->
            <p class="title clearfix" :class='computedClass(item.condition)'>
                <!-- 床号-->
                <el-tooltip :open-delay='300'
                  effect="dark"
                  :content="item.bedName"
                  placement="top"
                >
                  <b class="bednum">{{item.bedName || '--'}}</b>
                </el-tooltip>
                <!-- 护理级别-->
                <span class="separate" v-if='item.nursinglevel'></span>
                <span class="care">
                  <i class='icon iconfont icon-Star' v-if='item.nursinglevel === "1"'></i>
                  <b class="lever1" v-else-if='item.nursinglevel === "2"'></b>
                  <b class="lever2" v-else-if='item.nursinglevel === "3"'></b>
                  <b class="lever3" v-else-if='item.nursinglevel === "4"'></b>
                </span>
                <sys-value type="CV06.00.220" :code="item.nursinglevel" class="nursinglevel"/>
              <span class="intime">
                <!-- {{item.hospitalizedTime | formatDateByExp}} -->
                <el-tooltip :open-delay='300'
                  effect="dark"
                  :content="item.hospitalTime ? '入科时间：' + moment(item.hospitalTime).format('YYYY-MM-DD HH:mm') :'--'"
                  placement="right"
                >
                  <span style="cursor:pointer;">入{{day(item.hospitalTime)}}天</span>
                </el-tooltip>
              </span>
            </p>
            <div style="min-height: 94px;">
              <!-- 姓名，年龄，性别，孩子 -->
              <div class="userinfo">
                <b>{{item.patientName || '--'}}</b>
                <span>{{ item.sex | formatSex}} {{ item.ageShowText}}</span>
                <div class="baby">
                  <span
                    v-for="items in item.neonateList"
                    :key="items.patientId"
                    @click="showXsedj(item, items)"
                  >
                    <!-- <p style="margin:0;line-height:30px">
                      <b
                        style="cursor:pointer"
                        @click="dblclickchild(items,item)"
                      >{{items.patientName}}</b>
                      <el-button
                        style="float:right;margin-right:10px;"
                        type="primary"
                        size="mini"
                        plain
                        @click="handleCommand('new', items)"
                      >打印腕带</el-button>
                    </p>
                    <p
                      style="margin:0;line-height:30px"
                    >出生日期：{{items.birth | formatDateByExp('YYYY-MM-DD HH:mm')}}</p>
                    <p style="margin:0;line-height:30px">性别：{{items.sex | formatSex}}</p> -->
                    <!-- 男 -->
                    <i
                      v-if='items.sex == "1" && items.bedStatus == 1'
                      slot="reference"
                      data-type="baby"
                      class="iconfont icon-yingernan boy"
                    ></i>
                    <!-- 女 -->
                    <i
                      v-else-if='items.sex == "2" && items.bedStatus == 1'
                      slot="reference"
                      data-type="baby"
                      class="iconfont icon-yingernv girl"
                    ></i>
                    <!-- 未知 -->
                    <i
                      v-else-if='items.sex != "2" && items.sex != "1" && items.bedStatus == 1'
                      slot="reference"
                      data-type="baby"
                      class="iconfont icon-yingerweizhi boy"
                    ></i>
                    <!-- <svg class="icon" aria-hidden="true" slot="reference" v-else-if='items.sex != "2" && items.sex != "1"'>
                      <use xlink:href="#iconweizhilichuang"></use>
                    </svg>
                    <svg
                      v-else-if='items.sex == "2"'
                      slot="reference"
                      id="图层_1"
                      data-name="图层 1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 19.5 16.45"
                      >
                      <defs></defs>
                      <title>girl</title>
                      <path
                        id="合并形状"
                        class="cls-11"
                        d="M15.37,6A5.5,5.5,0,0,0,8.5,11.31q0,.24,0,.47H5.9a.17.17,0,0,0-.13.05.17.17,0,0,0-.05.1.07.07,0,0,0,0,0,.24.24,0,0,0,0,.06,3.09,3.09,0,0,0,.16.52h0v0a3.32,3.32,0,0,0,1.78,1.89l.22.1a3.37,3.37,0,0,0,1.81.18,5.52,5.52,0,0,0,2,1.56A7.44,7.44,0,0,1,9,16.77a7.17,7.17,0,0,1-5.19-2.1,7.7,7.7,0,0,1-1.05-1.28,2.14,2.14,0,0,1-.71.11A2,2,0,0,1,.6,12.91a2,2,0,0,1,0-2.85,2,2,0,0,1,1.06-.55A7,7,0,0,1,5.5,3.57a.64.64,0,0,1-.24-.38h0A6,6,0,0,1,5.14,2,5.11,5.11,0,0,1,5.26.87v0a.64.64,0,0,1,.8-.43L7.35.77A1,1,0,0,1,8,1.7V1.6A.64.64,0,0,1,8.68,1h.64A.64.64,0,0,1,10,1.6V1.7a1,1,0,0,1,.69-.92L11.94.39a.64.64,0,0,1,.8.43v0a4.93,4.93,0,0,1,.11,1.07,6.37,6.37,0,0,1-.12,1.25h0a.64.64,0,0,1-.13.28A6,6,0,0,1,15.37,6ZM8,2.87H8ZM6,9.68a.79.79,0,1,0-.8-.79A.8.8,0,0,0,6,9.68Z"
                        transform="translate(0 -0.36)"
                      ></path>
                      <path
                        id="椭圆形"
                        class="cls-12"
                        d="M14,16.81a5.5,5.5,0,1,1,5.5-5.5A5.5,5.5,0,0,1,14,16.81Zm0-1a4.5,4.5,0,1,0-4.5-4.5A4.5,4.5,0,0,0,14,15.81Zm1.42-6.08V8.31l2.88,2.75-2.88,2.75V12.38a.29.29,0,0,0-.07-.19.22.22,0,0,0-.16-.08c-1.34,0-3.46-.19-4.89,1.69A4.67,4.67,0,0,1,15.19,10,.25.25,0,0,0,15.42,9.73Z"
                        transform="translate(0 -0.36)"
                      ></path>
                    </svg>
                    <svg
                    v-else-if='items.sex == "1"'
                      slot="reference"
                      id="图层_1"
                      data-name="图层 1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 19.5 16.68"
                      >
                      <defs></defs>
                      <title>boy</title>
                      <path
                        id="合并形状"
                        class="cls-13"
                        d="M15.55,6a5.5,5.5,0,0,0-7,5.28q0,.22,0,.44H5.9a.16.16,0,0,0-.13.05.18.18,0,0,0-.05.1.07.07,0,0,0,0,0,.25.25,0,0,0,0,.06,3.23,3.23,0,0,0,.16.53h0v0A3.37,3.37,0,0,0,7.67,14.5l.22.1a3.3,3.3,0,0,0,1.84.18,5.52,5.52,0,0,0,2,1.57A7.25,7.25,0,0,1,9,16.86,7.08,7.08,0,0,1,3.81,14.7,7.85,7.85,0,0,1,2.76,13.4a2.09,2.09,0,0,1-.71.12,2,2,0,0,1-1.45-.6A2.08,2.08,0,0,1,.6,10a2,2,0,0,1,1.06-.57A7.31,7.31,0,0,1,8.49,2.24v0a1.68,1.68,0,0,0-.5-2q4.15.77,3.74,2.41A6.23,6.23,0,0,1,15.55,6ZM6,9.6a.81.81,0,1,0-.8-.81A.81.81,0,0,0,6,9.6Z"
                        transform="translate(0 -0.18)"
                      ></path>
                      <path
                        id="椭圆形"
                        class="cls-12"
                        d="M14,16.81a5.5,5.5,0,1,1,5.5-5.5A5.5,5.5,0,0,1,14,16.81Zm0-1a4.5,4.5,0,1,0-4.5-4.5A4.5,4.5,0,0,0,14,15.81Zm1.42-6.08V8.31l2.88,2.75-2.88,2.75V12.38a.29.29,0,0,0-.07-.19.22.22,0,0,0-.16-.08c-1.34,0-3.46-.19-4.89,1.69A4.67,4.67,0,0,1,15.19,10,.25.25,0,0,0,15.42,9.73Z"
                        transform="translate(0 -0.18)"
                      ></path>
                    </svg> -->
                  </span>
                </div>
              </div>
              <!-- 主诊断 -->
              <div class="illinfo">
                <el-tooltip :open-delay='300'
                  effect="dark"
                  :content="item.diagnosisArray[0] && item.diagnosisArray[0].diseaseName || '--'"
                  placement="top"
                >
                  <span>{{item.diagnosisArray[0] && item.diagnosisArray[0].diseaseName || '--'}}</span>
                </el-tooltip>
              </div>
              <div class="peihu clearfix">
                <el-tooltip :open-delay='300' :content="item.providerName" placement="top">
                  <span >{{item.providerName || '--'}}</span>
                </el-tooltip>
                <el-tooltip :open-delay='300' :content="item.admitDoctorName" placement="top">
                  <span>医生：{{item.admitDoctorName || '--'}}</span>
                </el-tooltip>
                <!-- 医保 -->
                <el-tooltip :open-delay='300' :content="item.insuranceCompany || '--'" placement="top">
                  <span class="right">
                    {{item.insuranceCompany || '--'}}
                  </span>
                </el-tooltip>
              </div>
              <div class="status">
                <span class="pos">
                  <!-- （1）传染病：传染病  hover信息
                  （2）余额不足：余额不足
                  （3）欠费：欠费
                  （4）手术患者：待手术
                  （5）陪护：显示陪护医嘱内容
                  （6）饮食：显示饮食医嘱内容
                  （7）待出科：待出科
                  （8）待转科：待转科
                  （9）驳回：驳回理由，无驳回理由时显示被驳回-->
                  <!-- <el-tooltip :open-delay='300' class="item" effect="dark" content="待手术" placement="top" v-if="item.status&&item.status.operation && item.status.operation=='1'">
                    <i class="org">术</i>
                  </el-tooltip>-->
                  <!-- <el-tooltip :open-delay='300' class="item" effect="dark" content="病危" placement="top" v-if="item.status&&item.status.condition && item.status.condition=='1'">
                    <i class="red"><b>危</b></i> 危重患者改为床号的颜色变化
                  </el-tooltip>
                  <el-tooltip :open-delay='300' class="item" effect="dark" content="病重" placement="top" v-if="item.status&&item.status.condition && item.status.condition=='2'">
                    <i class="red"><b>重</b></i>
                  </el-tooltip>-->
                  <!-- <i class="red">新</i>
                  <el-tooltip :open-delay='300' class="item" effect="dark" content="待转科" placement="top">
                    <i class="blue">转</i>
                  </el-tooltip>-->
                  <el-tooltip :open-delay='300'
                    class="item"
                    effect="dark"
                    content="新入科"
                    placement="top"
                    v-if='item.iconList && item.iconList.isNewPatient == "1"'
                  >
                    <i class='iconfont icon-xin blue' style='fontSize:19px;'></i>
                  </el-tooltip>
                  <el-tooltip :open-delay='300'
                    v-if='item.iconList && (item.iconList.change === "1" || item.iconList.changeArea === "1")'
                    class="item"
                    effect="dark"
                    :content=" item.iconList.changeArea === '1' ? '已提交转病区申请' : '已提交转科申请'"
                    placement="top"
                  >
                    <i class='iconfont icon-zhuan blue' style='fontSize:19px;'></i>
                  </el-tooltip>
                  <el-tooltip v-if='item.iconList && item.iconList.crb == "1"' :open-delay='300' class="item" effect="dark" content="传染病" placement="top">
                    <i class='iconfont icon-chuanranbing1 cRed' style='fontSize:19px;'></i>
                  </el-tooltip>
                  <el-tooltip :open-delay='300'
                    class="item"
                    effect="dark"
                    content="欠费"
                    placement="top"
                    v-if='item.iconList && item.iconList.isNeedingPay == "1"'
                  >
                    <i class='iconfont icon-qian red' style='fontSize:19px;'></i>
                  </el-tooltip>
                  <el-tooltip :open-delay='300'
                    v-if='item.iconList && item.iconList.leave == "1"'
                    class="item"
                    effect="dark"
                    content="请假外出"
                    placement="top"
                  >
                    <i class='iconfont icon-jia1 green' style='fontSize:19px;'></i>
                  </el-tooltip>
                  <el-tooltip :open-delay='300'
                    v-if='item.iconList && (item.iconList.discharge == "1" ||  item.iconList.discharge == "-1")'
                    class="item"
                    effect="dark"
                    content="已开出院医嘱"
                    placement="top"
                  >
                    <!-- :content="item.status&&item.status.chuke?'预计出院时间:' + item.status.chuke : ''" -->
                    <i class="iconfont icon-yuchuyuan green" style="fontSize:19px;cursor:pointer;"></i>
                  </el-tooltip>
                </span>
              </div>
            </div>
          </div>
          <!-- 包床 -->
          <div class="mainTop" v-else-if="item.bedType === 2" @drop="drop('package')" @dragover.prevent>
            <p class="title clearfix">
              <el-tooltip :open-delay='300'
                class="item"
                effect="dark"
                :content="item.bedName"
                placement="top"
              >
                <b
                  class="bednum"
                >{{item.bedName || '--'}}</b>
              </el-tooltip>
            </p>
            <div class="baoBed clearfix">
              <p>{{item.patientName || '--'}} ({{item.packageBedName || '--'}}) 包床</p>
              <i class="iconfont icon-baochuang" style="color:#ccc;fontSize:85px;"></i>
            </div>
          </div>
          <!-- 空床 -->
          <div class="mainTop" v-else @drop="drop($event,item)" @dragover.prevent>
            <p class="title clearfix">
              <el-tooltip :open-delay='300'
                class="item"
                effect="dark"
                :content="item.bedName"
                placement="top"
              >
                <b
                  class="bednum"
                >{{item.bedName || '--'}}</b>
              </el-tooltip>
            </p>
            <div class="emptyBed">
              <img src="../../assets/img/emptyBed.png" alt>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <ever-no-data v-else tipTxt="暂无记录"></ever-no-data>
    <pay :visible.sync="payvisible" :objMessage="objMessage"></pay>
    <!-- <el-dialog title="转入产房" :visible.sync="dialog" width="500px">
      <el-select v-model="hospitalizedAreaId" placeholder="请选择转入的产房" style="width:100%">
        <el-option v-for="item in areaOption" :label="item.name" :value="item.id" :key="item.id"></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="turnToBirthRoom">确 定</el-button>
      </div>
    </el-dialog> -->
    <contextmenu className='patient_card' :menu='menu' @menu='createMenu' @select='selectBefore'></contextmenu>
    <patientinfo :areaId='areaId' :areaName='areaName' ref='patientinfo' @success='$emit("success")'  :key='key + "patientinfo"' @print='print'></patientinfo>
    <packedchange :areaId='areaId' :areaName='areaName' ref='packedchange' :key='key + "packedchange"' @success='$emit("success")'></packedchange>
    <leave :areaId='areaId' :areaName='areaName' ref='leave' :key='key + "leave"' @success='$emit("success")'></leave>
    <newborn :areaId='areaId' :areaName='areaName' ref='newborn' :key='key + "newborn"' @success='$emit("success")'></newborn>
    <transfer :areaId='areaId' :areaName='areaName' ref='transfer' :key='key + "transfer"' @success='$emit("success")' @adviceTurn='adviceTurn' :CHANGE_PROVIDER_KEY='CHANGE_PROVIDER_KEY'></transfer>
    <dialog-inspect :scene='2' @success='$emit("success")' :show.sync="showAddDialog"  :type="inspectType" :patient='inspectPatient'></dialog-inspect>
    <discharged :areaId='areaId' :areaName='areaName' ref='discharged' :key='key + "discharged"' @success='$emit("success")' @adviceTurn='adviceTurn'></discharged>
  </div>
</template>

<script>
import {isJsonString} from '@/util/common'
import {singlePrint, mutiplePrint} from '@/inpatient/components/sendarea.print.js'
import moment from 'moment'
import resident from '@/inpatient/store/resident.js'
import pay from '../components/dialog-pay.vue'
import storage from '@/util/storage.js'
import contextmenu from '@/workspace/components/contextmenu.vue'
import patientinfo from '@/inpatient/components/dialog/patient.info.vue'
import packedchange from '@/inpatient/components/dialog/packed.change.vue'
import leave from '@/inpatient/components/dialog/leave.vue'
import newborn from '@/inpatient/components/dialog/newborn.vue'
import transfer from '@/inpatient/components/dialog/transfer.vue'
import discharged from '@/inpatient/components/dialog/discharged.vue'
import sysvalue from '@/warehouse/store/sysvalueapi'
import dialogInspect from '@/arrange/page/appoint/dialog-addinspect.vue'
export default {
  props: ['patients', 'hasOption', 'isDoctor', 'space', 'isAdt', 'CHANGE_PROVIDER_KEY'], // hasOption 病床管理的时候不传此操作项
  data () {
    return {
      storage,
      moment,
      isJsonString,
      objMessage: {
        hospitalizedNumber: '',
        patientId: '',
        providerId: ''
      },
      checkIndex: -1,
      visible: false,
      today: [],
      payvisible: false,
      patientId: '',
      visitNumber: '',
      dialog: false,
      areaOption: [],
      hospitalizedAreaId: '',
      hospitalizedNumber: '',
      isObstetrics: '',
      menu: [],
      key: 1,
      areaId: '',
      areaName: '',
      showAddDialog: false,
      inspectType: 1,
      inspectPatient: {},
      scrollIntoViewIndex: -1
    }
  },
  watch: {
    'patients': {
      handler (val) {
        this.admitPaymentMethod()
        this.patients.forEach(ele => {
          ele.iconList = ele.iconList || {}
          ele.neonateList = ele.neonateList || []
          if (ele.iconList.nursinglevel)ele.nursinglevel = String(ele.iconList.nursinglevel)
          ele.insuranceCompany = ele.iconList.insuranceCompany || '--'
          let diagnosis = isJsonString(ele.iconList.diagnosisArray) ? JSON.parse(ele.iconList.diagnosisArray) : []
          ele.diagnosisArray = Array.isArray(diagnosis) ? diagnosis : []
          // ele.diagnosisArray.forEach(element => {
          //   element.groupList = element.groupList || []
          //   element.groupList.forEach(item => {
          //     if (item.name === '传染病') ele.iconList.crb = '1'
          //   })
          // })
        })
      },
      immediate: true
    }
  },
  created () {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    this.today = year + '-' + month + '-' + day
  },
  updatebed () {
    this.isObstetrics = storage.getSessionStorage('isObstetrics')
  },
  beforeDestroy () {
    this.$bus.$off('boxlistScrollIntoView', this.scrollIntoView)
  },
  mounted () {
    this.$bus.$on('boxlistScrollIntoView', this.scrollIntoView)
    let str = this.storage.getLocalStorage(`${this.space}Key`)
    if (str) {
      this.areaId = str.split(',')[0]
      this.areaName = str.split(',')[1]
    }
    this.isObstetrics = storage.getSessionStorage('isObstetrics')
  },
  methods: {
    scrollIntoView (patient) {
      this.patients.forEach((ele, index) => {
        if (ele.patientId === patient.patientId && ele.bedType === 1) {
          this.scrollIntoViewIndex = index
          setTimeout(_ => {
            this.scrollIntoViewIndex = -1
          }, 800)
          this.$refs.patient_card[index].$el.scrollIntoView({block: 'center'})
        }
      })
    },
    adviceTurn (row, column, patient) { // 跳转执行单
      let query = {
        patientId: row.patientId,
        patientName: row.patientName,
        hospitalizedNumber: patient.hospitalizedNumber,
        providerId: patient.providerId,
        providerName: patient.providerName,
        areaId: patient.hospitalizedAreaId,
        bedId: patient.bedId,
        bedName: patient.bedName,
        status: patient.status,
        doctorId: patient.chargeDoctorId
      }
      let str = ''
      for (let key in query) {
        str += `${key}=${query[key]}&`
      }
      // if (column.label === '执行单' && row.waittingExecuteCount !== 0) {
      //   window.open(`${this.$ever.hospitalIndex}/inpatient/advice/execute?${str}`)
      // }
      if (column.label === '待审核医嘱' && row.waittingChekAdviceCount !== 0) {
        window.open(`${this.$ever.hospitalIndex}/inpatient/advice/review?${str}`)
      }
    },
    admitPaymentMethod () {
      let obj = {}
      sysvalue.listOnce('CV07.10.005').then(res => {
        res.forEach(ele => {
          obj[ele.id] = ele.name
        })
        this.patients.forEach((ele, index) => {
          if (ele.admitPaymentMethod) return
          let admitPaymentMethod = obj[ele.iconList.admitPaymentMethod] || '--'
          this.$set(this.patients[index], 'admitPaymentMethod', admitPaymentMethod)
        })
      })
    },
    computedClass (status) {
      status = String(status)
      if (status === '2') return 'zhong'
      if (status === '3') return 'wei'
    },
    day (time) {
      if (time === null || time === undefined) return '--'
      time = this.$moment(time).format('YYYY-MM-DD')
      let day = Math.ceil(this.$moment().diff(time) / 3600 / 24 / 1000) - 1
      return day === 0 ? 1 : day
    },
    createMenu (index) {
      let menu1 = [
        {
          name: '患者信息',
          id: 'patient_info',
        },
        {
          name: '床位管理',
          id: '',
          child: [
            {
              name: '取消入科',
              id: 'cancle_allocated',
            },
            {
              name: '包床',
              id: 'package',
            },
            {
              name: '换床',
              id: 'change',
            },
          ]
        },
        {
          name: '转科',
          id: 'transfer_provider',
        },
        {
          name: '转病区',
          id: 'transfer_area',
        },
        {
          name: '出科',
          id: 'discharged',
        },
        {
          name: '外出管理',
          id: 'wcgl',
        },
        {
          name: '新生儿登记',
          id: 'xsedj',
        },
        {
          name: '医技预约',
          id: '',
          child: [
            {
              name: '检查预约',
              id: 'jcyy',
            },
            {
              name: '治疗预约',
              id: 'zlyy',
            },
          ]
        },
        {
          name: '打印腕带',
          id: 'dywd',
        },
        {
          name: '打印床头卡',
          id: 'dyctk',
        }
      ]
      let menu2 = [
        {
          name: '锁床',
          id: 'lock',
        }
      ]
      let menu3 = [
        {
          name: '取消锁床',
          id: 'unlock',
        }
      ]
      let menu4 = [
        {
          name: '解除包床',
          id: 'cancle_package',
        }
      ]
      this.checkIndex = index
      let patient = JSON.parse(JSON.stringify(this.patients[index]))
      if (patient.bedType === 1) {
        let icon = patient.iconList || {}
        this.menu = JSON.parse(JSON.stringify(menu1))
        if (String(patient.sex) !== '2') { // 禁用新生儿登记
          this.menu[6].disabled = true
        }
        if (!icon.isNewPatient) { // 禁用取消入科
          this.menu[1].child[0].disabled = true
        }
        if (this.CHANGE_PROVIDER_KEY === '1' && String(icon.change) !== '-1' && String(icon.change) !== '1') { // 配置转科医嘱+开转科医嘱才能转科
          this.menu[2].disabled = true
        }
        if (String(patient.operate) === '3') { // 转病区时候禁用转科
          this.menu[2].disabled = true
        }
        if (String(patient.operate) === '2') { // 转科时候禁用转病区
          this.menu[3].disabled = true
        }
        if (String(icon.discharge) !== '1' && String(icon.discharge) !== '-1') { // 待出科才能出院
          this.menu[4].disabled = true
        }
      } else if (patient.bedType === 2) this.menu = menu4
      else if (patient.bedType === 3) this.menu = menu3
      else this.menu = menu2
    },
    async lock (patient, type) {
      let str = type === 'lock' ? '确定要执行锁床操作吗？' : '确定要执行取消锁床操作吗？'
      this.$confirm(str, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
      .then(async _ => {
        let obj = {
          bedId: patient.bedId,
          roomId: patient.roomId,
          areaId: this.areaId
        }
        let res
        if (type === 'lock') {
          res = await resident.lockBed(obj).catch(_ => { this.$emit('success') })
        } else {
          res = await resident.releaseBed(obj).catch(_ => { this.$emit('success') })
        }
        if (res.head && res.head.errCode === 0) {
          str = type === 'lock' ? '锁床成功' : '取消锁床成功'
          this.$messageTips(this, 'success', str, '提示')
        }
        this.$emit('success')
      })
      .catch(_ => {})
    },
    showXsedj (item, items) {
      item.clickChild = items
      this.$refs.newborn.open(item, true)
    },
    async selectBefore (li) {
      if (['cancle_allocated', 'transfer_provider', 'transfer_area', 'discharged'].includes(li.id)) {
        let patient = this.patients[this.checkIndex]
        let res = await resident.getPackedBed({
          hospitalizedNumber: patient.hospitalizedNumber
        })
        if (res && res.data && res.data.length > 0) {
          this.$confirm('该操作需要先取消包床，是否取消全部包床?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.cancelPackedBedBatch(li, res.data)
          }).catch(() => {

          })
        } else {
          this.select(li)
        }
      } else {
        this.select(li)
      }
    },
    async cancelPackedBedBatch (li, bedIds) {
      let arr = []
      bedIds.forEach(item => {
        arr.push(item.bedId)
      })
      let patient = this.patients[this.checkIndex]
      let res = await resident.cancelPackedBedBatch({
        hospitalizedNumber: patient.hospitalizedNumber,
        bedIds: arr
      })
      this.$emit('success')
      if (res && res.head && res.head.errCode === 0) {
        this.select(li)
      }
    },
    select (li) {
      this.key++
      let patient = this.patients[this.checkIndex]
      this.$nextTick(() => {
        if (li.id === 'cancle_allocated') {
          this.$refs.discharged.open(patient, li.id)
        } else if (li.id === 'patient_info') {
          this.$refs.patientinfo.open({person: patient}, li.id)
        } else if (li.id === 'package' || li.id === 'change') {
          this.$refs.packedchange.open(patient, li.id, this.patients)
        } else if (li.id === 'wcgl') {
          this.$refs.leave.open(patient)
        } else if (li.id === 'xsedj') {
          this.$refs.newborn.open(patient)
        } else if (li.id === 'transfer_provider' || li.id === 'transfer_area') {
          this.$refs.transfer.open(patient, li.id)
        } else if (li.id === 'dywd' || li.id === 'dyctk') {
          this.print(patient, li.id)
        } else if (li.id === 'discharged') {
          this.$refs.discharged.open(patient, li.id)
        } else if (li.id === 'lock' || li.id === 'unlock') {
          this.lock(patient, li.id)
        } else if (li.id === 'cancle_package') {
          this.canclePackageck(patient)
        } else if (li.id === 'jcyy' || li.id === 'zlyy') {
          this.inspectType = li.id === 'jcyy' ? 2 : 3
          this.inspectPatient = {
            id: patient.patientId
          }
          this.showAddDialog = true
        }
      })
    },
    async canclePackageck (patient) {
      this.$confirm('确定要执行解除包床操作吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
      .then(async _ => {
        let res = await resident.cancelPackedBed(patient)
        if (res.head && res.head.errCode === 0) {
          this.$messageTips(this, 'success', '解除包床成功', '提示')
        }
        this.$emit('success')
      })
      .catch(_ => {})
    },
    print (patient, type) {
      let dywd = {
        code: 'ZY_CPOE_CHENG_REN_WAN_DAI',
        params: {
          patientId: patient.patientId,
          visitType: 2,
          hospitalizedNumber: patient.hospitalizedNumber
        }
      }
      let dyctk = {
        code: 'ZY_CPOE_CHUANG_TOU_KA',
        params: {
          patientId: patient.patientId,
          hospitalizedNumber: patient.hospitalizedNumber
        }
      }
      if (type === 'dywd') {
        singlePrint(dywd.code, dywd.params)
      } else if (type === 'dyctk') {
        singlePrint(dyctk.code, dyctk.params)
      } else if (type === 'double') {
        mutiplePrint([dyctk, dywd])
      }
    },
    className (item, index) {
      let str = ''
      if (item.errorFlag === 1) return ''
      if (index === this.scrollIntoViewIndex) str += 'patient_card_intoview'
      if (Number(item.hosStatus) === 11 && Number(item.hosStatusFlag) === 2) str += 'dai '
      if (item.status && item.status.operation && item.status.operation === '1' && item.bedStatus !== 1) str += 'mainTopshu '
      if (item.status && item.status.childbirth && item.status.childbirth === '1' && item.bedStatus !== 1 && this.from.indexOf('birth') === -1) str += 'mainTopchan '
      return str
    },
    modify_patient_info (item, val) {
      this.patientId = item
      this.visitNumber = val
      this.$refs.patient_info.open()
    },
    newbornm (obj) {
      this.$refs.newbornRegistration.open(obj)
    },
    check (item, index, e) {
      if (e.target.dataset.type === 'baby') {
        return
      }
      if (this.checkIndex === index) {
        this.$emit('pick', {})
        this.checkIndex = -1
      } else {
        this.$emit('pick', item)
        this.checkIndex = index
      }
    },
    dblclickchild (items, item) {
      this.dblclick({
        patientId: items.patientId,
        hospitalizedNumber: items.hospitalizedNumber,
        providerId: item.providerId,
        hospitalizedAreaId: item.hospitalizedAreaId,
        dptId: item.providerId,
        visitNumber: item.visitNumber,
        hosStatus: String(item.hosStatus),
        hosStatusFlag: item.hosStatusFlag,
        isChild: 1,
        neonateInBed: items.neonateInBed
      })
    },
    dblclick (item) {
      this.$emit('turn', item)
    },
    async updatebed (id, ifAvailable) {
      let res = await resident.updateHospitalBedRelationData({ id, ifAvailable })
      if (res.head.errCode === 0) {
        this.$messageTips(this, 'success', '床位设置成功', '提示')
      }
      this.$emit('success')
    },
    async handleCommand (val, item) {
      if (val === 'c') { // 腕带打印
        singlePrint('ZY_CPOE_CHENG_REN_WAN_DAI', {
          patientId: item.patientId,
          visitType: 2,
          hospitalizedNumber: item.hospitalizedNumber
        })
      } else if (val === 'new') { // 腕带打印
        singlePrint('ZY_CPOE_XIN_SHENG_ER_WAN_DAI', {
          patientId: item.patientId,
          visitType: 2,
          hospitalizedNumber: item.hospitalizedNumber
        })
      } else if (val === 'no') {
        this.updatebed(item.hospitalizedBedId, '3')
      } else if (val === 'yes') {
        this.updatebed(item.hospitalizedBedId, '1')
      } else if (val === 'd') {
        //  返回
        this.$confirm(`确定要返回到${item.inpatientAreaName}病区-${item.inpatientBedName}床么?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await resident.createOut({
            hospitalizedNumber: item.hospitalizedNumber
          })
          if (res.head && res.head.errCode === 0) {
            this.$notify({
              type: 'success',
              message: '转出成功!'
            })
            this.$emit('shuaxin')
          }
        }).catch(() => {

        })
      } else if (val === 'f') {
        let res = await resident.getSpaceRecordVoListForService({})
        if (res.data instanceof Array) {
          this.areaOption = res.data.filter(element => {
            return element.type === '875ea388-c13d-4969-9725-98e2c934ac1c'
          })
        }
        this.hospitalizedNumber = item.hospitalizedNumber
        this.hospitalizedAreaId = ''
        this.dialog = true
        // 转入产房
      }
    },
    async turnToBirthRoom () {
      let hospitalizedAreaName = ''
      this.dialog = false
      this.areaOption.forEach(element => {
        if (element.id === this.hospitalizedAreaId) {
          hospitalizedAreaName = element.name
        }
      })
      let res = await resident.createIn({
        hospitalizedAreaId: this.hospitalizedAreaId,
        hospitalizedAreaName,
        hospitalizedNumber: this.hospitalizedNumber
      })
      if (res.head && res.head.errCode === 0) {
        this.$notify({
          type: 'success',
          message: '转入成功!'
        })
        this.$emit('shuaxin')
      }
    },
    dragenter (ev) { // 1c7bef
      // if (ev.target.className === 'mainTop') {
      //   ev.srcElement.style.border = '1px solid #1c7bef'
      // }
    },
    dragleave (ev) {
      // if (ev.target.className === 'mainTop') {
      //   ev.srcElement.style.border = '1px solid #ddd'
      // }
    },
    drop (ev, item) { // zc hc bc
      this.key++
      let str
      if (ev === 'zc' || ev === 'package') str = '分床失败，该床位已被占用'
      if (ev === 'lock') str = '分床失败，该床位不可用'
      if (str) {
        this.$notify({
          title: '操作失败',
          type: 'warning',
          message: str
        })
        return
      }
      let obj = JSON.parse(ev.dataTransfer.getData('text/plain'))
      this.$confirm(`确定要将${obj.patientName}分配到【${item.bedName}】床么?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        this.$refs.patientinfo.open({person: obj, bed: item}, 'allocated')
      }).catch(() => {

      })
    },
    payCost (val) {
      this.objMessage.hospitalizedNumber = val.hospitalizedNumber
      this.objMessage.patientId = val.patientId
      this.objMessage.providerId = val.providerId
      this.payvisible = true
    },
    getDays (sDate1, sDate2) {
      var dateSpan,
        iDays
      sDate1 = Date.parse(sDate1)
      sDate2 = Date.parse(sDate2)
      dateSpan = sDate2 - sDate1
      dateSpan = Math.abs(dateSpan)
      iDays = Math.floor(dateSpan / (24 * 3600 * 1000))
      return iDays
    },
    createDoc (data) {
      if (data && data.patientId && data.hospitalizedNumber) {
        this.$router.push({
          name: 'inpatientDoc',
          query: {
            patientId: data.patientId,
            hospitalizedNumber: data.hospitalizedNumber
          }
        })
      } else {
        this.$messageTips(this, 'error', '任务信息有误，无法填写病历', '提示')
      }
    }
  },
  components: {
    pay,
    contextmenu,
    patientinfo,
    packedchange,
    leave,
    newborn,
    transfer,
    discharged,
    dialogInspect
  }
}
</script>
<style scoped lang='scss'>
@import "../assets/boxlist.scss";
.patient-edit {
  color: inherit;
}
.prevent_click {
  pointer-events: none;
}
.box_list .mainTop .intime {
  padding-bottom: 8px;
}
.box_list .payment {
  flex: 1;
  border-left: 1px solid #eee;
}
.box_list .payment:hover {
  color: #1c7bef;
}
.box_list .illbox {
  width: 100%;
  white-space: nowrap;
}
.box_list .ill {
  width: 50%;
}
.box_list .doctor {
  width: 50%;
}
</style>
