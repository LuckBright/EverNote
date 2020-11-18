<!--
  demo: <service-icon-handler v-model="scope.row" :show-key-list="iconList" @update="list()" @showDetail="showDetailFun" @printReg="showPrintReg"></service-icon-handler>
  参数：value  当前那一行预约数据
    showKeyList  显示哪些图标 传一个数组字符串进来
    iconList: ['cancelappoint'],
    iconstate 0 隐藏 10可用 20已完成 30不可用 40异常
  通知到父组件的方法
  @update="list()"   刷新页面
  @done="done()"    任务完成父组件执行
  @showDetail=""    取消预约
  @print=""  打印
-->
<template>
  <div class="service_icon_list spe" :key="Math.random()">
    <template v-for="item of showIcon">
      <!-- iconlist: {{showIcon}} -->
      <!-- 到院 -->
      <template v-if="item.name === 'arrival' && $hasPermission('Auth_btn_arrival')">
        <template v-if="item.iconState === 10">
          <div class="item" @click="diagnosis(value, 'arrival')" :key="item.name">
            <el-tooltip effect="dark" content="到院" placement="top-start">
              <i :class="'iconfont icon-daozhen1'" :style="'color: ' + item.color"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else>
          <div class="item noVis" :key="item.iconCode">
            <i :class="'iconfont icon-daozhen1'"></i>
          </div>
        </template>
      </template>
      <!-- 预检 -->
      <template v-else-if="item.name === 'yu_jian' && $hasPermission('Auth_btn_yujian')">
        <template v-if="item.iconState === 10">
          <div class="item" :key="item.name" @click="editPrecheck(value, false)">
            <el-tooltip effect="dark" content="预检" placement="top-start">
              <i :class="'iconfont icon-yujian'" :style="'color: ' + item.color"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else-if="item.iconState === 20">
          <div class="item" :key="item.name" @click="editPrecheck(value, true)">
            <el-tooltip effect="dark" content="预检已完成" placement="top-start">
              <i :class="'iconfont dColor ' + item.sicon"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else-if="item.iconState === 30">
          <div class="item" :key="item.name" @click="editPrecheck(value, true)">
            <el-tooltip effect="dark" content="预检不可用" placement="top-start">
              <i :class="'iconfont ' + item.icon" :style="'color: #ccc'"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else-if="item.iconState === 0">
          <div class="item noVis" :key="item.name">
            <i :class="'iconfont icon-yujian'"></i>
          </div>
        </template>
      </template>
      <!-- 接诊 -->
      <template v-else-if="item.name === 'jie_zhen' && $hasPermission('Auth_btn_jiezhen')">
        <template v-if="item.iconState === 10">
          <div class="item" @click="inspectRouter(value)" :key="item.iconCode">
            <el-tooltip effect="dark" content="接诊" placement="top-start">
              <i :class="'iconfont icon-jiezhen'" :style="'color: ' + item.color"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else-if="item.iconState === 20">
          <div class="item" :key="item.iconCode" @click="inspectRouter(value)">
            <el-tooltip effect="dark" content="接诊已完成" placement="top-start">
              <i :class="'iconfont dColor ' + item.sicon" :style="'color: ' + item.color"></i>
            </el-tooltip>
            <!--已完成状态按钮-->
          </div>
        </template>
        <template v-else>
          <div class="item noVis" :key="item.iconCode">
            <i :class="'iconfont icon-jiezhen'"></i>
          </div>
        </template>
      </template>
      <!-- 开耗材 -->
      <template v-else-if="item.name === 'kai_hao_cai' && $hasPermission('Auth_btn_consumable')">
        <template v-if="item.iconState === 10">
          <div class="item" @click="linkConsumable(value)" :key="item.name">
            <el-tooltip effect="dark" content="医疗主管" placement="top-start">
              <i :class="'iconfont '+ item.icon" :style="'color: ' + item.color"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else-if="item.iconState === 30">
          <div class="item" :key="item.name">
            <el-tooltip effect="dark" content="医疗主管不可用" placement="top-start">
              <i :class="'iconfont ' + item.icon" style="color: #ccc"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else>
          <div class="item noVis" :key="item.name">
            <i :class="'iconfont '+ item.icon"></i>
          </div>
        </template>
      </template>
      <!-- 发药 -->
      <template v-else-if="item.name === 'fa_yao' && $hasPermission('Auth_btn_fayao')">
        <template v-if="item.iconState === 10">
          <div class="item" @click="getDrugInfo(value)" :key="item.name">
            <el-tooltip effect="dark" content="发药" placement="top-start">
              <i :class="'iconfont icon-yaopinjinxingzhong'" :style="'color: ' + item.color"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else-if="item.iconState === 40">
          <div class="item" @click="getDrugInfo(value)" :key="item.name">
            <el-tooltip effect="dark" content="发药异常" placement="top-start">
              <i :class="'iconfont cRed ' + item.icon "></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else-if="item.iconState === 20">
          <div class="item" @click="getDrugInfo(value,true)" :key="item.name">
            <el-tooltip effect="dark" content="发药已完成" placement="top-start">
              <i :class="'iconfont dColor ' + item.sicon "></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else>
          <div class="item noVis" :key="item.name">
            <i :class="'iconfont ' + item.icon" style="color:#ccc"></i>
          </div>
        </template>
      </template>
      <!--检验-->
      <template v-if="item.name === 'jian_yan' && $hasPermission('Auth_btn_jianyan')">
        <template v-if="item.iconState === 10">
          <div class="item" @click="tech(value,'801')" :key="item.name">
            <el-tooltip effect="dark" content="检验" placement="top-start">
              <i :class="'iconfont ' + item.icon" :style="'color: ' + item.color"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else-if="item.iconState === 20">
          <div class="item" :key="item.name" @click="tech(value,'801')">
            <i :class="'iconfont dColor ' + item.sicon"></i>
          </div>
        </template>
        <template v-else-if="item.iconState === 30">
          <div class="item" :key="item.name" @click="tech(value,'801')">
            <el-tooltip effect="dark" content="检验不可用" placement="top-start">
              <i :class="'iconfont ' + item.icon" style="color: #ccc"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else-if="item.iconState === 40">
          <div class="item" :key="item.name" @click="tech(value,'801')">
            <el-tooltip effect="dark" content="检验异常" placement="top-start">
              <i :class="'iconfont cRed ' + item.icon"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else-if="item.iconState === 0">
          <div class="item noVis" :key="item.name">
            <i :class="'iconfont ' + item.icon"></i>
          </div>
        </template>
      </template>
      <!--检查-->
      <template v-else-if="item.name === 'jian_cha' && $hasPermission('Auth_btn_jiancha')">
        <template v-if="item.iconState === 10">
          <div class="item" @click="tech(value,'800')" :key="item.name">
            <el-tooltip effect="dark" content="检查" placement="top-start">
              <i :class="'iconfont ' + item.icon" :style="'color: ' + item.color"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else-if="item.iconState === 20">
          <div class="item" :key="item.name" @click="tech(value,'800')">
            <el-tooltip effect="dark" content="检查已完成" placement="top-start">
              <i :class="'iconfont dColor ' + item.sicon"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else-if="item.iconState === 40">
          <div class="item" :key="item.name" @click="tech(value,'800')">
            <el-tooltip effect="dark" content="检查异常" placement="top-start">
              <i :class="'iconfont cRed ' + item.icon"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else-if="item.iconState === 0">
          <div class="item noVis" :key="item.name">
            <i :class="'iconfont ' + item.icon"></i>
          </div>
        </template>
      </template>

      <!--处置-->
      <template v-else-if="item.name === 'chu_zhi' && $hasPermission('Auth_btn_chuzhi')">
        <template v-if="item.iconState === 10">
          <div class="item" @click="tech(value,'802')" :key="item.name">
            <el-tooltip effect="dark" content="处置" placement="top-start">
              <i :class="'iconfont ' + item.icon" :style="'color: ' + item.color"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else-if="item.iconState === 20">
          <div class="item" :key="item.name" @click="tech(value,'802')">
            <el-tooltip effect="dark" content="处置已完成" placement="top-start">
              <i :class="'iconfont dColor ' + item.sicon"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else>
          <div class="item noVis" :key="item.name">
            <i :class="'iconfont ' + item.icon"></i>
          </div>
        </template>
      </template>

      <!--保险结算-->
      <template
        v-else-if="item.name === 'bao_xian_jie_zhang' && $hasPermission('Auth_btn_baoxian')"
      >
        <template v-if="item.iconState === 10">
          <div class="item" @click="settlement(value, 1)" :key="item.name">
            <el-tooltip effect="dark" content="保险结账" placement="top-start">
              <i :class="'iconfont ' + item.icon" :style="'color: ' + item.color"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else>
          <div class="item noVis" :key="item.name">
            <i :class="'iconfont ' + item.icon" style="color: #ccc"></i>
          </div>
        </template>
      </template>

      <!--结算-->
      <template v-else-if="item.name === 'jie_zhang' && $hasPermission('Auth_btn_jiezhang')">
        <template v-if="item.iconState === 10">
          <div class="item" @click="settlement(value, 2)" :key="item.name">
            <el-tooltip effect="dark" content="结账" placement="top-start">
              <i :class="'iconfont ' + item.icon" :style="'color: ' + item.color"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else-if="item.iconState === 20">
          <div class="item" @click="settlement(value, 2)" :key="item.name">
            <!--客户中心消费记录-->
            <el-tooltip effect="dark" content="结账已完成" placement="top-start">
              <i :class="'iconfont dColor ' + item.sicon"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else>
          <div class="item noVis" :key="item.name">
            <i :class="'iconfont ' + item.icon" style="color: #ccc"></i>
          </div>
        </template>
      </template>
      <!-- 离院 -->
      <template v-if="item.name === 'li_yuan' && $hasPermission('Auth_btn_liyuan')">
        <template v-if="item.iconState === 10">
          <div class="item" @click="diagnosis(value, 'li_yuan')" :key="item.name">
            <el-tooltip effect="dark" content="离开" placement="top-start">
              <i :class="'iconfont ' + item.icon" :style="'color: ' + item.color"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else-if="item.iconState === 20">
          <div class="item" :key="item.name">
            <el-tooltip effect="dark" content="已离开" placement="top-start">
              <i :class="'iconfont dColor '+ item.sicon"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else>
          <div class="item noVis" :key="item.name">
            <i :class="'iconfont '+ item.icon" :style="'color: ' + item.color"></i>
          </div>
        </template>
      </template>
      <!-- 打印挂号条 -->
      <template v-if="item.name === 'da_yin' && $hasPermission('Auth_btn_dayin')">
        <template>
          <div class="item" @click="print(value)" :key="item.name">
            <el-tooltip effect="dark" content="打印" placement="top-start">
              <i :class="'iconfont icon-dayinght'" :style="'color: ' + item.color"></i>
            </el-tooltip>
          </div>
        </template>
      </template>
      <!-- 问卷 -->
      <template v-if="item.name === 'wen_juan' && $hasPermission('Auth_btn_wenjuan')">
        <template v-if="item.iconState === 10">
          <div class="item" @click="questionnaire(value)" :key="item.name">
            <el-tooltip effect="dark" content="问卷" placement="top-start">
              <i :class="'iconfont icon-wenjuan'" :style="'color: ' + item.color"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else-if="item.iconState === 20">
          <div class="item" @click="questionnaire(value)" :key="item.name">
            <el-tooltip effect="dark" content="问卷已完成" placement="top-start">
              <i :class="'iconfont icon-wenjuanyiwancheng dColor'"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else>
          <div class="item noVis" :key="item.name">
            <i :class="'iconfont ' + item.icon" style="color: #ccc"></i>
          </div>
        </template>
      </template>

      <!-- && checkTask(item.keys, value.myProcesses).length 为什么这个判断条件没进来？-->
      <!-- 取消预约 // 0,1,2,3,-3,-2,-4 可以取消，// 0, 可以确认 -->
      <template
        v-else-if="item.name === 'cancel_appointment' && $hasPermission('Auth_btn_cancel_appointment')"
      >
        <template v-if="item.iconState === 10">
          <div class="item" @click="cancelAppoint(value)" :key="item.name">
            <el-tooltip effect="dark" content="取消预约" placement="top-start">
              <i :class="'iconfont ' + item.icon" :style="'color: ' + item.color"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else>
          <div class="item noVis" :key="item.name">
            <i :class="'iconfont ' + item.icon" style="color: #ccc"></i>
          </div>
        </template>
      </template>
      <!--修改预约-->
      <template
        v-else-if="item.name === 'change_appointment' && $hasPermission('Auth_btn_change_appointment')"
      >
        <template v-if="item.iconState === 10">
          <div class="item" :key="item.iconCode" @click="linkAppiont">
            <el-tooltip effect="dark" content="修改预约" placement="top-start">
              <i :class="'iconfont icon-gaiyue1'" :style="'color: ' + item.color"></i>
            </el-tooltip>
          </div>
        </template>
        <template v-else>
          <div class="item noVis" :key="item.name">
            <i :class="'iconfont icon-gaiyue1'" style="color: #ccc"></i>
          </div>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import appointapi from '@/workspace/store/appointapi'
import { SERVICE_ICON } from './service.config'
import appointinfo from '@/arrange/page/reservation/appointinfo.vue'
import mainheaderapi from '@/workspace/store/mainheaderapi'
import serviceapi from '@/sob/store/service.panel'
export default {
  data () {
    return {
      appointapi,
      mainheaderapi,
      showIcon: [],
      SERVICE_ICON,
      taskDialog: false,
      currentTask: {},
      appoint: {},
      currentDay: '',
      value: {},
      iconMap: {},
      selectOrgan: {},
      isEdit: false
    }
  },
  props: [
    'listData',
    'showKeyList',
    'isRegister'
  ],
  watch: {
    listData: {
      handler (val) {
        this.value = Object.assign({}, this.value, val)
      },
      deep: true
    }
  },
  created () {
    this.iconMap = this.listData.iconStatesMap ? Object.values(this.listData.iconStatesMap) : []
    this.value = this.listData
    this.iconMap.map(el => {
      this.showIcon = SERVICE_ICON.filter(item => {
        if (item.name === el.iconCode) {
          item.iconState = el.iconState
        }
        return item
      })
      return el
    })
  },
  methods: {
    tech (data, serviceType) {
      let url = `${this.$ever.infusionIndex}/tech/main/-1?from=kanban&serviceType=${serviceType}`
      window.open(url, '_blank')
    },
    linkConsumable (value, isManage = true) { // 门急诊医生工作站
      let doctorId = value.triagedDoctorId || value.doctorId
      let url = this.$ever.yihuIndex + '/workspace/outpatient?' +
        'patientId=' + value.patientId +
        '&patientName=' + value.patientName +
        '&visitSn=' + value.visitNumber +
        '&from=kanban' +
        '&dptId=' + value.providerid +
        '&dptName=' + value.providerName +
        '&subsequentVisit=' + value.subsequentVisit +
        '&doctorId=' + doctorId
      let role = this.$store.state.currentUser.roles
      let status = ''
      role.forEach(element => { // 医疗部助理coderole写死928549446952681472
        if (element.roleCode + '' === '928549446952681472' && isManage) {
          status += 'ma '
        }
      })
      if (value.appointmentStateDesc === '已结诊') {
        status += 'history '
      }
      if (doctorId && doctorId !== this.$store.state.currentUser.userId) {
        status += 'others '
      }
      url += `&status=${status.trim().split(' ').join(',')}`
      window.open(url, '_blank')
    },
    // 接诊 门急诊医生工作站
    inspectRouter (value) {
      // 接诊调用刘征队列接口 临时解决方案
      // let data = value.iconStatesMap.jie_zhen.param
      serviceapi.clinicalReception({
        tenantDeptId: value.deptId,
        resourceType: 'register',
        resourceId: value.triagedDoctorId, // 分诊队列用doctorId
        callType: 'waiting',
        triageId: '',
        apptId: value.id
      }).then(rs => {
        if (rs.head.errCode === 0) {
          this.linkConsumable(value, false)
        } else {
          this.$messageTips(this, 'error', '数据传输中，请稍后再次执行接诊操作。')
        }
      })
    },
    getDuplicate (process, itemKeys) {
      if (!process.myProcesses || !process.myProcesses.checkment) {
        return []
      }
      let processArr = process.myProcesses.checkment
      let processkeys = processArr.map(v => v.key)
      var sortedArr = processkeys.concat(itemKeys).sort()
      var results = []
      for (var i = 0; i < sortedArr.length - 1; i++) {
        if (sortedArr[i + 1] === sortedArr[i]) {
          results.push(sortedArr[i])
        }
      }
      if (results.length) {
        return processArr.filter(v => v.key === results[0])
      }
      return []
    },
    print (value) {
      this.$emit('print', value)
    },
    questionnaire (value) {
      this.$emit('question', value)
    },
    checkTask (keys, data) {
      let dataKeys = Object.keys(data)
      let handlerKeys = []
      if (dataKeys && dataKeys.length) {
        dataKeys.forEach(item => {
          if (keys.includes(item)) {
            handlerKeys.push(item)
          }
        })
      }
      return handlerKeys
    },
    taskLength (keys, data) {
      let dataKeys = Object.keys(data)
      let len = 0
      if (dataKeys && dataKeys.length) {
        dataKeys.forEach(item => {
          if (keys.includes(item)) {
            if (data[item] && data[item].length) {
              len += data[item].length
            }
          }
        })
      }
      return len
    },
    getOrderLen (data) {
      let len = 0
      if (data && data.length) {
        data.forEach(item => {
          len += Number(item.orderItemNum || 0)
        })
      }
      return len
    },
    // 取消预约
    async cancelAppoint (value) {
      this.$emit('showDetail', value)
    },
    // 看诊任务（openType: 'jump', 跳转到看诊页面）
    taskGoRouter (data) {
      if (data.myProcesses.checkment[0].key !== 'checkment_reencountered') {
        mainheaderapi
          .deletqueueContentById({
            source: 1,
            visitNumber: data.visitNumber
          })
          .then(rs => {
            if (rs.head && rs.head.errCode === 0) {
              this.$messageTips(this, 'success', '接诊成功')
              this.routerLink(data)
              this.$emit('done')
            }
          })
      } else {
        this.routerLink(data)
      }
    },
    // 发药任务（openType: 'jump', 跳转到wh看诊页面）
    getDrugInfo (val, diff) {
      val.diff = diff
      this.$emit('senddrug', val)
    },
    // 跳转到我的任务卡片页面
    taskRouter (data, keys) {
      let pkeys = this.checkTask(keys, data.myProcesses)
      var query = {
        patientId: data.patientId,
        liststatus: 1,
        processkeys: pkeys
      }
      query = encodeURIComponent(JSON.stringify(query))
      var _url =
        this.$ever.yihuIndex +
        '/workspace/tasks?q=' +
        query +
        '&page=1&pagesize=20'
      window.open(_url, '_blank')
    },
    done () {
      this.$emit('done')
    },
    // 判断是否需要是先付费（创建任务用到的，本期未用到）
    // async isNeedPayWarning (value) {
    //   let params = {
    //     key: value.key || 'checkment_physical',
    //     orderId: value.orderid
    //   }
    //   // 流程节点需要校验是否收费
    //   const rs = await api.isNeedPayWarning(params)
    //   if (rs.data.isNeedPayWarning) {
    //     this.$messageTips(this, 'error', '暂未缴费，请先缴费', '提示')
    //     return false
    //   } else {
    //     return true
    //   }
    // },
    // 有结算的任务跳转到结算页面
    settlement (value, type) {
      // 1、hasUnPaidBill是否有账单 2、settlementIds计算单
      if (type === 1) {
        let tempParam = value.iconStatesMap.bao_xian_jie_zhang.param
        // 保险结算
        this.linkrcm(tempParam, value)
      } else {
        // 结账
        let tempParam = value.iconStatesMap.jie_zhang.param
        this.linkrcm(tempParam, value)
      }
    },
    linkrcm (tempParam, value) {
      if (tempParam.hasUnPaidBill) {
        if (tempParam.returnFlag) {
          let last = ''
          this.linkrcmurl(value, 'refunded', last)
        } else {
          let last = ''
          this.linkrcmurl(value, 'peddingsettlement', last)
        }
      } else {
        if (tempParam.settlementIds.length > 1) {
          let last = `&showDetail=1`
          this.linkrcmurl(value, 'settleddetail', last)
        } else if (tempParam.settlementIds.length === 1) {
          let last = `&isnoprint=true&settlementid=` + tempParam.settlementIds
          this.linkrcmurl(value, 'settled', last)
        }
      }
    },
    linkrcmurl (value, middle, last) {
      let url = `${this.$ever.rcmIndex}/rcm/reconstruct/${middle}?patientId=${
        value.patientId
        }&dptId=${
        value.providerid
        }&visitNumber=${value.visitNumber}&showlist=true${last}`
      window.open(url, '_blank')
    },
    diagnosis (value, key) {
      if (value.patient && value.patient.patientNumber === 'temporary') {
        // todo 临时档dialog补全信息并到诊
        this.$emit('fillmember', value)
      } else {
        this.$emit('diagnosis', value, key)
      }
    },
    editPrecheck (val, isedit) { // 修改预检
      this.$emit('editPrecheck', val, isedit)
    },
    linkAppiont () {
      this.$router.push({
        name: 'appointpanel',
      })
    },
    getNowFormatDate () {
      let date = new Date()
      let seperator1 = '-'
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      let currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    }
  },
  components: {
    appointinfo
  }
}
</script>
<style scoped>
.dColor {
  width: 16px;
  color: #00b636 !important;
}
.service_icon_list /deep/ .item {
  padding: 0 3px;
  margin: 0 2px;
}
</style>

