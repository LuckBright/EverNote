<template>
  <div id="appointpanel" class="layout_box">
    <el-row>
      <el-col :span="18">
        <el-form class="search" :inline="true" :model="params" label-width="0">
          <el-form-item label>
            <el-select v-model="selectOrgan" placeholder="请选择机构" value-key="organId">
              <el-option
                v-for="(temp, i) in orgItemList"
                :key="i"
                :value="temp"
                :label="temp.organName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label class="long">
            <!-- <el-select v-model="selectDept" placeholder="请选择科室" value-key="deptId">
              <el-option v-for="item, i in deptList" :key="i" :value="item" :label="item.deptName"></el-option>
            </el-select>-->
            <el-select v-model="params.deptIds" multiple placeholder="请选择">
              <el-option
                v-for="item in deptList"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="resourceIds" multiple filterable placeholder="医生">
              <el-option
                v-for="item in optionsList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!--
          <el-form-item label="">
            <el-select v-model="params.resourceId" placeholder="请选择资源" clearable v-if="viewType === 'day'">
              <el-option v-for="item, i in appointmentResoureCntDtoList" :key="item.resourceId" :value="item.resourceId" :label="item.resourceName"></el-option>
            </el-select>
            <el-select v-model="params.resourceId" placeholder="请选择资源" clearable v-if="viewType === 'week'">
              <el-option v-for="item, i in arrangeList" :key="item.resourceId" :value="item.resourceId" :label="item.resourceName"></el-option>
            </el-select>
          </el-form-item>
          -->
          <el-form-item>
            <el-button type="primary" @click="onSearch" icon="el-icon-search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="6" align="right"></el-col>
    </el-row>
    <div class="pannel" :class="viewType === 'day' ? 'bh100' : 'bh50'">
      <div class="header">
        <span class="fr">
          <el-button size="medium" @click="getPrevWeeks">
            <i class="el-icon-arrow-left"></i>上一周
          </el-button>
          <el-button size="medium" @click="getNowWeeks">本周</el-button>
          <el-button size="medium" @click="getNextWeeks">
            下一周
            <i class="el-icon-arrow-right"></i>
          </el-button>
          <el-button
            size="medium"
            @click="changeView('day')"
            :type="viewType === 'day' ? 'primary' : ''"
          >日视图</el-button>
          <el-button
            size="medium"
            @click="changeView('week')"
            :type="viewType === 'week' ? 'primary' : ''"
          >周视图</el-button>
        </span>
        <span class="month">{{$moment(currentDay).format('YYYY年MM月')}}</span>
        <span class="war">
          <span>
            <i class="blue"></i> 待确认
          </span>
          <span>
            <i class="green"></i> 预约成功
          </span>
          <span>
            <i class="deepblue"></i> 已到诊
          </span>
          <span>
            <i class="orange"></i> 已迟到
          </span>
          <span>
            <i class="red"></i> 已爽约
          </span>
          <span>
            <i class="violet"></i> 等待
          </span>
          <span>
            <i class="gray"></i> 已取消
          </span>
        </span>
      </div>
      <el-row class="weeks" type="flex">
        <el-col
          align="center"
          v-for="(item, i) in weeks"
          :key="i"
          @click.native="changeDay(item.date)"
          :class="{on: item.date === currentDay || item.date === currentArrange.date}"
          class="weekitem"
        >
          <strong class="week fl">{{item.weekDate}}</strong>
          <em v-if="item.date === $moment().format('YYYY-MM-DD')">今</em>
        </el-col>
      </el-row>
      <div class="calendar">
        <div class="wrap">
          <div class="timescale_hack" :style="{width: (width + 1) + 'px'}"></div>
          <div class="timescale_header" ref="timescale_header">
            <table class="timescale" cellpadding="0" cellspacing="0">
              <tbody>
                <tr>
                  <td>
                    <div :style="{width: width + 'px'}" class="inner"></div>
                  </td>
                  <td v-for="i of splitCount + 1" :key="i">
                    <div :style="{width: i <= splitCount ? width + 'px' : 0}" class="inner">
                      <label>{{getTimeText(i)}}</label>
                      <em></em>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="pannel_right"
            @scroll="handleScroll"
            :style="{paddingLeft: (width + 1) + 'px'}"
            v-if="appointmentData && appointmentData[0]"
          >
            <table class="resource" cellpadding="0" cellspacing="0">
              <tbody ref="righttable">
                <template v-for="temp in appointmentData">
                  <template v-for="(resource, row) in temp.appointmentResoureCntDtoList">
                    <tr :key="row + '-' + 1">
                      <td v-for="i of splitCount + 1" :key="i">
                        <div
                          :style="{width: i <= splitCount ? width + 'px' : 0}"
                          v-if="i <= splitCount"
                          class="inner"
                        >
                          <div
                            class="body clearfix"
                            v-if="resource.appointmentTimerangeCntDtoList[i-1].canAppointOrAppointedList[0]"
                          >
                            <div
                              v-for="(appoint, j) in resource.appointmentTimerangeCntDtoList[i-1].canAppointOrAppointedList"
                              :key="j"
                              :class="{pointblock: appoint.appointmentDtoList.length > 0}"
                            >
                              <template v-for="(item, k) in appoint.appointmentDtoList">
                                <appointinfo
                                  :appoint="item"
                                  :key="j + '-' + k"
                                  :times="[startTime, endTime]"
                                  @success="onSearch"
                                  @sendMessage="sendMessage"
                                  v-if="isShowAppointInfo(i, j, resource, item)"
                                ></appointinfo>
                              </template>
                              <template v-if="appoint">
                                <addappoint
                                  title="添加预约"
                                  :value="appoint"
                                  :date="currentDay"
                                  :key="i + '-' + j + '-' + $moment()"
                                  :organ="selectOrgan"
                                  :times="[startTime, endTime]"
                                  :add-way="1"
                                  class="add"
                                  @success="onSearch"
                                  @lock="addAppointLock"
                                ></addappoint>
                              </template>
                            </div>
                            <div
                              v-if="!isOverdue(i) && resource.appointmentTimerangeCntDtoList[i-1].canPlus"
                            >
                              <addappoint
                                title="加号"
                                :key="i + '-' + $moment()"
                                :value="{deptId: temp.deptId, deptName: temp.deptName, resourceId: resource.resourceId, resourceName: resource.resourceName, resourceType: resource.resourceType, startTime: resource.appointmentTimerangeCntDtoList[i-1].startTime}"
                                :date="currentDay"
                                :organ="selectOrgan"
                                :times="[startTime, endTime]"
                                :add-way="2"
                                @success="onSearch"
                              ></addappoint>
                            </div>
                          </div>
                        </div>
                        <div class="mask" v-if="isOverdue(i)"></div>
                      </td>
                    </tr>
                    <tr v-if="resource.more" :key="row + '-' + 2">
                      <td :colspan="splitCount" :class="{gray: isOverdue()}">
                        <div class="inner">
                          <div class="body wait clearfix">
                            <appointinfo
                              class="fl"
                              v-for="(item, k) in resource.waitAppointList"
                              :appoint="item"
                              :key="k + '-' + $moment()"
                              :index="k"
                              :count="resource.waitAppointList.length"
                              :date="currentDay"
                              :times="[startTime,endTime]"
                              @success="onSearch"
                              @prve="index => {prevWait(index, i, j)}"
                              @next="index => {nextWait(index, i, j)}"
                              @sendMessage="sendMessage"
                            ></appointinfo>
                            <addappoint
                              title="添加等待"
                              :key="row + '-' + $moment()"
                              class="fl"
                              :value="{deptId: temp.deptId, deptName: temp.deptName, resourceId: resource.resourceId, resourceName: resource.resourceName, resourceType: resource.resourceType}"
                              :date="currentDay"
                              :organ="selectOrgan"
                              :times="[startTime, endTime]"
                              :add-way="3"
                              @success="onSearch"
                              v-if="!isOverdue()"
                            ></addappoint>
                          </div>
                        </div>
                      </td>
                      <td></td>
                    </tr>
                    <tr v-if="resource.more" :key="row + '-' + 3">
                      <td :colspan="splitCount" :class="{gray: isOverdue()}">
                        <div class="inner">
                          <div class="body cancel clearfix">
                            <appointinfo
                              v-for="(item, k) in resource.cancelAppointList"
                              :appoint="item"
                              :key="k + '-' + $moment()"
                              :date="currentDay"
                              :times="[startTime,endTime]"
                              @sendMessage="sendMessage"
                              @recongirm="onSearch"
                            ></appointinfo>
                          </div>
                        </div>
                      </td>
                      <td></td>
                    </tr>
                  </template>
                </template>
              </tbody>
            </table>
          </div>
          <div v-else>
            <table width="100%" cellpadding="0" cellspacing="0" class="noappoint">
              <tr>
                <td height="320" align="center" valign>{{defaultText}}</td>
              </tr>
            </table>
          </div>
          <div
            class="pannel_left"
            ref="pannel_left"
            :style="{width: (width + 1) + 'px'}"
            v-if="appointmentData && appointmentData[0]"
          >
            <table class="resourceleft" cellpadding="0" cellspacing="0">
              <tbody>
                <template v-for="temp in appointmentData">
                  <template v-for="(resource, row) in temp.appointmentResoureCntDtoList">
                    <tr :key="row + '-' + 1">
                      <td align="center" :style="{height: (itemsHeight[row * 3] - 1) + 'px'}">
                        <div :style="{width: width + 'px'}">
                          <strong class="ellipsis">{{resource.resourceName}}</strong>
                          <div class="ellipsis">({{temp.deptName}})</div>
                          <!--
                          <p class="more" @click="showMore(row, col)">
                            <label>{{!resource.more ? '更多' : '收起'}}</label>
                            <i :class="!resource.more ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"></i>
                          </p>
                          -->
                        </div>
                      </td>
                    </tr>
                    <tr v-if="resource.more" :key="row + '-' + 2">
                      <td :style="{height: (itemsHeight[row * 3 + 1] - 1) + 'px'}">
                        <div class="inner" :style="{width: width + 'px'}">
                          <strong>等待 ({{resource.waitAppointList ? resource.waitAppointList.length : 0}})</strong>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="resource.more" :key="row + '-' + 3">
                      <td :style="{height: (itemsHeight[row * 3 + 2] - 1) + 'px'}">
                        <div class="inner" :style="{width: width + 'px'}">
                          <strong>取消 ({{resource.cancelAppointList ? resource.cancelAppointList.length : 0}})</strong>
                        </div>
                      </td>
                    </tr>
                  </template>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <medical-insurance
        :settlement-id="settlementId"
        :key="settlementId"
        :visible.sync="insuranceVisible"
        :refund="false"
      ></medical-insurance>
      <rcm :visible.sync="rcmVisible" :settlement-id="settlementId"></rcm>
      <send-message
        ref="sendmessage"
        :users="currentPatient"
        :disabled="true"
        :allparams="allparams"
      ></send-message>
      <dialog-lock
        :show.sync="showLock"
        :value="currentLock"
        :organ="selectOrgan"
        :date="currentDay"
        @success="onSearch"
      ></dialog-lock>
    </div>
    <div class="arrange" v-if="viewType === 'week'">
      <i class="el-icon-error" @click="changeView('day')"></i>
      <div class="inner">
        <calendartable
          :arrange-week="weeks"
          :arrange-list="arrangeList"
          :trunkType="1"
          :operate="0"
          :td-width="194"
          @select="getArrangeAppoint"
        ></calendartable>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/arrange/store/appointapi'
import { getWeekDates } from '@/util/common'
import schedulingapi from '@/arrange/store/schedulingapi'
import addappoint from '@/arrange/page/reservation/appointform.vue'
import addwait from '@/arrange/page/reservation/appointwait.vue'
import addlock from '@/arrange/page/reservation/appointlock.vue'
import appointinfo from '@/arrange/page/reservation/appointinfo.vue'
import rcm from '@/workspace/page/reservation/rcm.vue'
import medicalInsurance from '@/workspace/page/reservation/paymentinfo'
import calendartable from '@/arrange/page/scheduling/calendar-table.vue'
import sendMessage from '@/crm/page/sendmessage'
import dialogLock from '@/arrange/page/reservation/dialog-lock.vue'
import storage from '@/util/storage'
export default {
  props: ['showMoreRow'],
  data () {
    return {
      api,
      storage,
      config: '',
      schedulingapi,
      allparams: {},
      optionsList: [],
      resourceIds: [],
      loading: false,
      more: this.showMoreRow || false,
      rcmVisible: false,
      insuranceVisible: false,
      viewType: 'day',
      settlementId: '',
      timeSplit: 60,
      width: 160,
      startTime: '06:00',
      endTime: '23:00',
      weeks: [],
      weeksCount: [],
      currentWeek: '',
      currentDay: '',
      currentArrange: '',
      selectDate: '',
      orgItemList: [],
      deptList: [],
      arrangeList: [],
      selectOrgan: '',
      selectDept: '',
      appointmentResoureCntDtoList: '',
      patient: '',
      currentPatient: [],
      defaultText: '该日没有医生排班',
      params: {
        organId: '',
        resourceId: '',
        deptIds: []
      },
      appointmentData: [],
      showLock: false,
      currentLock: '',
      currentDeptShow: false,
      currentDeptInfo: '',
      itemsHeight: []
    }
  },
  watch: {
    // getArrangeResource   获取 排班医生接口：支持多科室
    // getAppointmentDayCntListZhuozheng  查询 预约列表数据 ：支持多科室 多医生
    selectOrgan: {
      handler (val) {
        this.params.organId = val.organId
        // 有机构id之后查机构下面的科室 bylvjiangtao 2018-12-02
        if (val.organId) {
          this.getDeptData()
        }
      },
      deep: true
    },
    params: {
      handler (val) {
        if (val.organId && val.deptIds) {
          this.getWeekCount()
          if (this.viewType === 'week') {
            this.getArrangeList()
          }
          this.getAppointData()
        }
      },
      deep: true
    }
  },
  created () {
    this.$bus.$off('appoint:settlementId')
    this.$bus.$off('appoint:rcmVisible')
    this.$bus.$off('yihu:appointPayed')
    this.$bus.$off('form:handMessage')
    this.$bus.$on('appoint:settlementId', val => {
      this.settlementId = val.settlementId
      this.isMedicalInsurance = val.isMedicalInsurance
    })
    this.$bus.$on('appoint:rcmVisible', val => {
      if (this.isMedicalInsurance === 1) {
        // 判断是否医保卡
        this.insuranceVisible = true
      } else {
        this.rcmVisible = true
      }
    })
    this.$bus.$on('yihu:appointPayed', val => {
      if (val) {
        this.onSearch()
      }
    })
    this.$bus.$on('form:handMessage', v => {
      this.allparams = v
      this.allparams.msgType = 108
      if (this.$refs.sendmessage && this.$refs.sendmessage.sendVisible !== undefined) {
        this.$refs.sendmessage.sendVisible = true
      }
    })
    this.setArrangeConfig()
    // this.getOrgList()
    this.getNowWeeks()
  },
  methods: {
    setArrangeConfig () {
      this.schedulingapi.getArrangeConfig('APPOINT_NUM_LIMIT').then(rs => {
        this.config = rs.data
      })
    },
    getOptionsList () {
      let p = {
        timeTrunkType: 1,
        organId: this.params.organId,
        deptIds: this.params.deptIds,
        date: this.currentDay,
        startDate: '',
        endDate: ''
      }
      this.api.getArrangeResource(p).then((rs) => {
        if (rs.head.errCode || !rs.data || !rs.data[0]) {
          return false
        }
        this.optionsList = rs.data.map(item => {
          return { value: item.resourceId, label: item.resourceName }
        })
      })
    },
    addAppointLock (val) {
      this.currentLock = val
      this.showLock = true
    },
    onSearch (val) {
      if (val && val.sendMessage && !val.isSceneAppoint) {
        this.currentPatient = val.patient
      }
      if (!val) {
        this.params.resourceId = ''
        this.params.resourceName = ''
        this.currentArrange = ''
      }
      if (this.viewType === 'week') {
        this.getArrangeList()
      }
      this.getAppointData()
    },
    getTimeText (index) {
      let toDay =
        new Date('2000/1/1 ' + this.startTime).getTime() +
        (index - 1) * this.timeSplit * 60 * 1000
      return this.$moment(toDay).format('HH:mm')
    },
    isOverdue (index) {
      let timeText =
        this.getTimeText(index + 1) === '00:00'
          ? '24:00'
          : this.getTimeText(index + 1)
      let selectDate = index
        ? new Date(this.currentDay + ' ' + timeText)
        : new Date(this.currentDay + ' 23:59:59')
      let toDate = new Date()
      return toDate.getTime() > selectDate.getTime()
    },
    changeDay (val) {
      this.currentDay = val
      if (this.currentArrange) {
        this.currentArrange.date = val
      }
      this.getAppointData()
    },
    showMore (i, j) {
      this.appointmentData[j].appointmentResoureCntDtoList[i].more = !this
        .appointmentData[j].appointmentResoureCntDtoList[i].more
    },
    getCurrentWeek (time) {
      let current = time
        ? this.$moment(time).format('YYYY-MM-DD')
        : this.$moment().format('YYYY-MM-DD')
      let first = time
        ? this.$moment(time)
          .startOf('isoWeek')
          .format('YYYY-MM-DD')
        : this.$moment()
          .startOf('isoWeek')
          .format('YYYY-MM-DD')
      let last = time
        ? this.$moment(time)
          .endOf('isoWeek')
          .format('YYYY-MM-DD')
        : this.$moment()
          .endOf('isoWeek')
          .format('YYYY-MM-DD')
      return { first, current, last }
    },
    getOrgList () {
      this.api.getOrgList().then(rs => {
        rs.data.map(item => {
          this.orgItemList.push({
            organId: '' + item.clinicId,
            organName: item.clinicName
          })
        })
        if (this.storage.getLocalStorage('CLINICID')) {
          this.selectOrgan = this.orgItemList.filter(item => {
            return item.organId === this.storage.getLocalStorage('CLINICID')
          })[0]
        } else {
          this.selectOrgan = this.orgItemList[0]
        }
      })
    },
    getDeptData () {
      this.schedulingapi
        .getDeptData({
          clinicId: this.params.organId,
          deptTypes: ['1'],
          orgIds: [this.params.organId]
        })
        .then(rs => {
          if (rs && rs.data && rs.data[0]) {
            this.deptList = rs.data.map((v, i) => {
              let obj = {
                deptId: v.deptId,
                deptName: v.deptName,
                id: i
              }
              return obj
            })
            this.params.deptIds = [this.deptList[0].deptId]
          }
        })
    },
    getAppointData () {
      if (!this.params.organId || !this.params.deptIds || !this.params.deptIds[0]) {
        return false
      }
      this.defaultText = '正在加载预约数据，请等待...'
      let params = Object.assign(
        {
          timeTrunkType: 1,
          date: this.currentDay,
          showStartTime: this.startTime,
          showEndTime: this.endTime,
          timerange: this.timeSplit,
          patient: this.patient,
          resourceIds: this.resourceIds
        },
        this.params,
        this.currentArrange
      )
      this.api.list(params).then(rs => {
        if (rs.head.errCode || !rs.data || !rs.data[0]) {
          this.appointmentData = ''
          this.defaultText = '该日没有医生排班'
          return false
        }
        this.appointmentData = rs.data
        this.$nextTick(() => {
          this.itemsHeight = this.getItemsHeight()
        })
      })
    },
    getPrevWeeks () {
      let date = new Date(this.currentWeek.first)
      date.setDate(date.getDate() - 7)
      this.weeks = getWeekDates(date)
      this.currentWeek = this.getCurrentWeek(date)
      this.selectDate = [this.currentWeek.first, this.currentWeek.last]
      this.currentDay = this.weeks[0].date
      this.currentArrange = ''
      this.getWeekCount()
      this.getAppointData()
      if (this.viewType === 'week') {
        this.getArrangeList()
      }
    },
    getNextWeeks () {
      let date = new Date(this.currentWeek.first)
      date.setDate(date.getDate() + 7)
      this.weeks = getWeekDates(date)
      this.currentWeek = this.getCurrentWeek(date)
      this.selectDate = [this.currentWeek.first, this.currentWeek.last]
      this.currentDay = this.weeks[0].date
      this.currentArrange = ''
      this.getWeekCount()
      this.getAppointData()
      if (this.viewType === 'week') {
        this.getArrangeList()
      }
    },
    getNowWeeks () {
      this.weeks = getWeekDates()
      this.currentWeek = this.getCurrentWeek()
      this.selectDate = [this.currentWeek.first, this.currentWeek.last]
      this.currentDay = this.currentWeek.current
      this.currentArrange = ''
      this.getWeekCount()
      this.getAppointData()
      if (this.viewType === 'week') {
        this.getArrangeList()
      }
    },
    getWeekCount () {
      if (
        !this.params.organId ||
        !this.params.deptIds ||
        this.params.deptIds.length === 0
      ) {
        return false
      }
      let params = Object.assign(
        {
          timeTrunkType: 1,
          startDate: this.currentWeek.first,
          endDate: this.currentWeek.last
        },
        this.params
      )
      this.api.getWeeksCount(params).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        this.weeksCount = rs.data
      })
    },
    prevWait (index, i, j) {
      let waitAppointList = JSON.parse(
        JSON.stringify(
          this.appointmentData[j].appointmentResoureCntDtoList[i]
            .waitAppointList
        )
      )
      let temp = waitAppointList[index - 1]
      waitAppointList[index - 1] = waitAppointList[index]
      waitAppointList[index] = temp
      this.appointmentData[j].appointmentResoureCntDtoList[i].waitAppointList = waitAppointList
      this.changeWaitSort(waitAppointList)
    },
    nextWait (index, i, j) {
      let waitAppointList = JSON.parse(
        JSON.stringify(
          this.appointmentData[j].appointmentResoureCntDtoList[i]
            .waitAppointList
        )
      )
      let temp = waitAppointList[index + 1]
      waitAppointList[index + 1] = waitAppointList[index]
      waitAppointList[index] = temp
      this.appointmentData[j].appointmentResoureCntDtoList[i].waitAppointList = waitAppointList
      this.changeWaitSort(waitAppointList)
    },
    changeWaitSort (data) {
      let params = data.map(item => {
        return { id: item.id, sort: item.sort }
      })
      this.api.changeWaitSort(params)
    },
    sendMessage (val) {
      if (val.length === 0) {
        this.$messageTips(this, 'warning', '请选择接收短信客户', '警告')
        return false
      }
      this.currentPatient = [val[0].patient]
      this.allparams = val.length === 1 ? {
        msgType: 108,
        docName: val[0].appointmentDoctorName, // 医生姓名
        hosName: val[0].organName, // 医院姓名
        clinicName: val[0].providerName, // 诊室名称
        appointTime: `${this.$moment(val[0].appointmentDate).format('MM-DD')} ${val[0].appointmentStarttime}`, // 预约时间
        visitTime: val[0].arrivalTime ? this.$moment(val[0].arrivalTime).format('MM-DD HH:mm') : this.$moment().format('MM-DD'), // 就诊时间
        appointDate: this.$moment(val[0].appointmentDate).format('MM-DD'), // 预约日期
        appointStartTime: val[0].appointmentStarttime, // 预约开始时间
        appointEndTime: val[0].appointmentEndtime// 预约结束时间
      } : { msgType: 108 }
      this.$refs.sendmessage.sendVisible = true
    },
    changeView (str) {
      this.viewType = str
      this.currentArrange = ''
      this.onSearch()
    },
    getArrangeList () {
      this.params.startDate = this.selectDate[0]
      this.params.endDate = this.selectDate[1]
      this.params.timeTrunkType = 1
      this.params.deptId = this.params.deptIds[0] ? this.params.deptIds[0] : ''
      this.api.getArrangeResourceList(this.params).then(rs => {
        if (rs.head.errCode) {
          return false
        }
        let resourceArrangeResultList = []
        rs.data.map(item => {
          resourceArrangeResultList.push(...item.resourceArrangeResultList)
        })
        this.arrangeList = resourceArrangeResultList
      })
    },
    getArrangeAppoint (val) {
      this.currentDay = val.date
      this.currentArrange = val
      this.deptIds = val.deptIds
    },
    isShowAppointInfo (i, j, resource, item) {
      let flag = false
      if (this.config && this.config.configValue === '2') {
        return true
      }
      if (i <= 1) {
        return true
      }
      let prevList = resource.appointmentTimerangeCntDtoList[i - 2].canAppointOrAppointedList.filter(item => {
        return !item.isPlus
      })
      let currList = resource.appointmentTimerangeCntDtoList[i - 1].canAppointOrAppointedList.filter(item => {
        return !item.isPlus
      })
      if (
        (j === 0 &&
          (!prevList[0] ||
            !prevList[prevList.length - 1].appointmentDtoList[0] ||
            prevList[prevList.length - 1].appointmentDtoList[0].id !==
            item.id)) ||
        (j > 0 &&
          (!currList[j - 1] ||
            !currList[j - 1].appointmentDtoList[0] ||
            currList[j - 1].appointmentDtoList[0].id !== item.id))
      ) {
        flag = true
      }
      return flag
    },
    getItemsHeight () {
      let items = Array.from(this.$refs.righttable.querySelectorAll('tr'))
      let arr = []
      items.map(item => {
        arr.push(item.clientHeight)
      })
      return arr
    },
    handleScroll (e) {
      let X = e.target.scrollLeft
      let Y = e.target.scrollTop
      this.$refs.timescale_header.scrollLeft = X
      this.$refs.pannel_left.scrollTop = Y
    }
  },
  computed: {
    splitCount () {
      let startMinute =
        parseInt(this.startTime.split(':')[0]) * 60 +
        parseInt(this.startTime.split(':')[1])
      let endMinute =
        parseInt(this.endTime.split(':')[0]) * 60 +
        parseInt(this.endTime.split(':')[1])
      return Math.ceil((endMinute - startMinute) / this.timeSplit)
    }
  },
  components: {
    addappoint,
    appointinfo,
    addwait,
    addlock,
    rcm,
    medicalInsurance,
    sendMessage,
    calendartable,
    dialogLock
  }
}
</script>
<style scoped>
#appointpanel {
  background: #ebedef;
  font-size: 14px;
  position: relative;
  height: calc(100vh - 180px);
}
#appointpanel .pannel {
  padding: 10px 20px;
  background: #ffffff;
  border-radius: 3px;
  position: relative;
}
#appointpanel .bh100 {
  height: 100%;
}
#appointpanel .bh50 {
  height: 50%;
}
#appointpanel .search .adduser {
  margin-left: 20px;
  padding: 10px 20px;
}
#appointpanel .search .el-form-item {
  margin-bottom: 15px;
}
#appointpanel .header {
  padding: 5px 0 15px;
  overflow: hidden;
}
#appointpanel .header .el-button {
  margin-left: 0;
}
#appointpanel .header .month {
  font-size: 28px;
  font-weight: normal;
}
#appointpanel .header .war {
  padding-top: 6px;
  display: inline-block;
  vertical-align: top;
}
#appointpanel .header .war span {
  margin-left: 15px;
  font-size: 12px;
}
#appointpanel .header .war span i {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
#appointpanel .header .war span .blue {
  background: #1c7bef;
}
#appointpanel .header .war span .green {
  background: #61a812;
}
#appointpanel .header .war span .orange {
  background: #e38748;
}
#appointpanel .header .war span .red {
  background: #ee4433;
}
#appointpanel .header .war span .violet {
  background: #bd10e0;
}
#appointpanel .header .war span .gray {
  background: #666666;
}
#appointpanel .header .war span .deepblue {
  background: #366298;
}
#appointpanel .weeks {
  text-align: left;
  border-bottom: 2px solid #ddd;
}
#appointpanel .weeks .el-col {
  padding: 13px 0;
  text-align: center;
  border-bottom: 2px solid #ffffff;
  width: 140px;
  cursor: pointer;
  position: relative;
}
#appointpanel .weeks .el-col + .el-col {
  margin-left: 40px;
}
#appointpanel .weeks .el-col.on {
  border-bottom: 2px solid #1c7bef;
}
#appointpanel .weeks .el-col em {
  width: 16px;
  height: 16px;
  line-height: 16px;
  font-size: 12px;
  background: #1c7bef;
  color: #fff;
  position: absolute;
  right: 5px;
  top: -5px;
  font-style: normal;
  border-radius: 2px;
}

.calendar {
  overflow-x: auto;
  overflow-y: hidden;
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 0;
  top: 108px;
  z-index: 999;
  background: #fff;
}
.wrap {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  overflow: hidden;
}
.pannel_left {
  overflow: hidden;
  position: absolute;
  left: 0;
  bottom: 0;
  top: 38px;
  z-index: 10000;
  height: calc(100vh - 349px);
  background: #fff;
  border: 1px solid #ddd;
  border-top: none;
}
.pannel_right {
  position: relative;
  top: 0;
  overflow-x: auto;
  overflow-y: auto;
  height: calc(100vh - 330px);
  background: #fff;
}
.timescale_header {
  width: 100%;
  overflow: hidden;
}
.timescale_hack {
  position: absolute;
  height: 38px;
  left: -20px;
  top: -1px;
  z-index: 1001;
  background: #fff;
}
.arrange {
  margin-top: 10px;
  position: relative;
}
.arrange .el-icon-error {
  font-size: 24px;
  position: absolute;
  right: 0;
  top: -9px;
  color: #aaa;
  z-index: 999;
  cursor: pointer;
}
#appointpanel .timescale {
  table-layout: fixed;
  border: 1px solid #fff;
  border-bottom: 1px solid #ddd;
  border-spacing: 0;
}
#appointpanel .timescale tr td {
  height: 36px;
  line-height: 36px;
  position: relative;
  border-right: 1px solid #fff;
}
#appointpanel .timescale tr td label {
  position: relative;
  left: -18px;
}
#appointpanel .timescale tr td em {
  display: block;
  height: 5px;
  width: 3px;
  background: #ccc;
  position: absolute;
  bottom: -1px;
  left: -2px;
}
#appointpanel .timescale tr td:last-child {
  width: 0;
  border-right: none;
}

#appointpanel .resource tr td {
  position: relative;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  vertical-align: top;
  padding: 0;
  background: #fff;
}
#appointpanel .resourceleft tr td {
  border-bottom: 1px solid #ddd;
}
#appointpanel .resource tr td.gray {
  background: #eee;
}
#appointpanel .resourceleft tr td {
  text-align: center;
  vertical-align: middle;
  line-height: 1.75;
  position: relative;
}
#appointpanel .resourceleft tr td .more {
  cursor: pointer;
  color: #1c7bef;
  text-align: center;
}
#appointpanel .resourceleft tr td .inner > * {
  display: block;
}
#appointpanel .resourceleft tr td strong {
  font-size: 18px;
  padding: 5px 10px;
  display: block;
}
#appointpanel .resourceleft tr td span.job {
  color: #999;
}
#appointpanel .resource tr td:last-child {
  width: 0;
  border: none;
}
#appointpanel .resource tr:last-child td,
#appointpanel .resourceleft tr:last-child td {
  border-bottom: none;
}

#appointpanel .resource tr td .head {
  height: 33px;
  line-height: 33px;
  background: #efefef;
  text-align: center;
  border-bottom: 1px solid #ddd;
}
#appointpanel .resource tr td .body {
  padding: 5px;
  min-height: 84px;
}

#appointpanel .resource tr td .card {
  height: 64px;
  width: 136px;
  border-left: 2px solid #fff;
  padding: 5px;
  margin-bottom: 10px;
  line-height: 1.2;
  display: inline-block;
  float: left;
  position: relative;
}
#appointpanel .resource tr td .card span {
  display: block;
}
#appointpanel .resource tr td .card span.time {
  font-size: 12px;
  margin-bottom: 8px;
}
#appointpanel .resource tr td .card span.name {
  margin-bottom: 6px;
  font-size: 14px;
}
#appointpanel .resource tr td .card span.name em {
  font-style: normal;
}
#appointpanel .resource tr td .card i.icon-suo {
  font-size: 24px;
  position: absolute;
  right: 10px;
  top: 50%;
  margin-top: -16px;
}
#appointpanel .resource tr td .card.gray {
  background: #ccc;
  color: #666;
  border-color: #666;
}

#appointpanel .resource tr td .cancel /deep/ .card,
#appointpanel .resource tr td .wait /deep/ .card {
  margin-right: 13px;
  margin-bottom: 0;
}
#appointpanel .resource tr td .inner /deep/ .card {
  margin-bottom: 10px;
}
#appointpanel .resource tr td.gray /deep/ .card {
  opacity: 0.5;
}
#appointpanel .mask {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.1);
}
.noappoint {
  border: 1px dashed #ddd;
  font-size: 18px;
  margin-top: 10px;
  width: 96vw;
}
</style>
