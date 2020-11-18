<template>
  <div class="station_layout full patient-mgt" :class="{'no-padding': !showPatientList}">
    <div class="fullscreen" v-if='full'>
      <list-waiting-full
        ref='listwaitingfull'
        class="patient-list"
        :space='space'
        :titleArr="titleArr"
        v-bind="relactiveProps"
        :areaId="areaId"
        :providerId='providerId'
        :key='areaId'
        :is-click-class="false"
        @waitingdbclick="turn"
        @closefull="closefull"
      ></list-waiting-full>
    </div>
    <div class="patient-sidebar flex_column_full_hidden" v-if='showPatientList'>
      <list-waiting
        ref='listwaiting'
        class="patient-list"
        :space='space'
        v-if='showPatientList'
        :titleArr="titleArr"
        v-bind="relactiveProps"
        :areaId="areaId"
        :providerId='providerId'
        :key='areaId'
        :is-click-class="false"
        @waitingdbclick="turn"
        @closefull="closefull"
        @stopadvice="stopadvice"
      ></list-waiting>
			<tpl-tabs
				ref="adviceTpl"
        class="tmpl-list"
        v-if="hasTpl"
        v-model="templateType"
        :query="tplQueryList"
        :tabs-list="tabsList"
        @quote="quote"
      ></tpl-tabs>
    </div>
    <div class="station_layout_wrap" v-if="show">
      <patient-header
        class="layout_wrap_01"
        v-if="patientId"
        :patientId="patientId"
        :visitNumber="$route.query.hospitalizedNumber || $route.query.hospitalizedNumberBak"
        :object="baseInfo"
        :code="code"
        :key='`${patientId},${$route.query.hospitalizedNumber || $route.query.hospitalizedNumberBak}`'
      ></patient-header>
      <div class="layout_wrap_main">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-patient_mgt layout_tabs_wrap"
          mode="horizontal"
          @select="handleSelect"
          :collapse-transition="false"
          :router="false"
        >
          <!-- 针对病案管理跳转此处查看病历 -->
          <template v-if="!showPatientList">
            <el-menu-item index="/resident/patientmgt/open">医嘱</el-menu-item>
            <el-menu-item index="/resident/patientmgt/docs">电子病历</el-menu-item>
          </template>
          <template v-else>
            <template v-if="space === 'resident'" >
              <el-menu-item index="/resident/patientmgt/open" v-if="$hasPermission('Auth_menu_resident_patientmgt_open')">医嘱</el-menu-item>
              <el-menu-item index="/resident/patientmgt/docs"  v-if="$hasPermission('Auth_menu_resident_patientmgt_docs')">电子病历</el-menu-item>
              <el-menu-item index="/resident/patientmgt/patientdetail/abstract" v-if="$hasPermission('Auth_menu_resident_patientmgt_history')">历史记录</el-menu-item>
            </template>
            <template v-else-if="space === 'inpatient'">
              <el-menu-item index="/inpatient/patientmgt/advice" v-if="$hasPermission('Auth_menu_hospitalnurse_PATIENT_MGT_YZ')">医嘱</el-menu-item>
              <el-menu-item
                index="/inpatient/patientmgt/docs"
                :key="randomKey"
                v-if="$hasPermission('Auth_menu_hospitalnurse_PATIENT_MGT_medical_docs')"
              >护理文书</el-menu-item>
              <el-menu-item index="/inpatient/patientmgt/fee"  v-if="$hasPermission('Auth_menu_hospitalnurse_PATIENT_MGT_fee')">费用明细</el-menu-item>
              <el-menu-item index="/inpatient/patientmgt/patientdetail/abstract" v-if="$hasPermission('Auth_menu_hospitalnurse_PATIENT_MGT_history')">历史记录</el-menu-item>
            </template>
          </template>
        </el-menu>
        <div class="layout_main_view patient-mgt-main">
          <div v-if='$route.path.indexOf("doctoradvice") > -1 && $route.query.visitTypeCode == "3"' style='right: 30px;top:20px;position: absolute;zIndex: 2;'><el-button type='primary' size='small' @click='print'>打印</el-button></div>
          <router-view
            :key="key"
            @keyAdd="key++"
            type="1"
            :role="space === 'resident' ? '1' : '2'"
            class="layout_main_view_inner"
          ></router-view>
        </div>
      </div>
    </div>
    <div v-else-if='space != "inpatient"' style="width: 100%;height: 100%;position: relative;">
      <ever-no-data  tipTxt="请选择患者，查看患者详情"></ever-no-data>
    </div>
    <div class="station_layout_wrap" v-if='space == "inpatient" && !show'>
      <bed :space='space' @turn='turn' ref='bed'></bed>
    </div>
    <advice-print :visible.sync="printvisible" :printInfo='{patientId:$route.query.patientId,hospitalizedNumber:$route.query.visitSerialNumber}'></advice-print>
  </div>
</template>
<script>
import telescopic from '@/inpatient/components/telescopic'
import patientHeader from '@/inpatient/components/common.head.js'
import api from '@/inpatient/store/resident.js'
import listWaiting from '@/inpatient/components/list.waiting.new' // 患者列表
import listWaitingFull from '@/inpatient/components/list.waiting.new.full' // 患者列表
import { getQueryUrl } from '@/inpatient/util/inpatientConfig'
import tplTabs from '@/inpatient/components/tab.tpl.vue' // 模版
import tplApi from '@/sob/store/tmpl.api.js' // 模版接口
import storage from '@/util/storage'
import bed from '@/inpatient/page/bed'
import '@/phr/assets/less/index.less'
import advicePrint from '@/inpatient/components/dialog-print.vue'
export default {
  props: ['space'],
  data () {
    return {
      storage,
      api,
      areaId: '',
      key: undefined,
      activeIndex: '',
      show: false,
      baseInfo: this.$route.query, // ys-- 医生工作台  hs--护士工作台,
      titleArr: ['病区患者', '待入科患者', '已出科患者', '我的患者', '科室患者'],
      code: '004', // 004 --- 住院医生工作站 005 --- 住院护士工作站
      pathStatus: '',
      obj: {},
      randomKey: 0,
      templateType: '1',
      hasTpl: false,
      showPatientList: true, // 针对病案管理跳转此处查看病历
      providerId: '',
      patientId: this.$route.query.patientId,
      full: localStorage.getItem('resident_full') === 'true',
      printvisible: false,
    }
  },
  created () {
    this.relactiveProps = {}
    if (this.space === 'inpatient') {
      this.titleArr = ['病区患者', '待入科患者', '已出科患者']
      let inpatientKey = localStorage.getItem('inpatientKey')
      if (inpatientKey) {
        this.areaId = inpatientKey.split(',')[0] || null
        this.relactiveProps = {
          areaId: this.areaId
        }
      }
      this.tabsList = [{label: '个人模版', value: '1'}, {label: '病区模版', value: '3'}]
    }
    if (this.space === 'resident') {
      this.titleArr = ['我的患者', '科室患者']
      let residentKey = localStorage.getItem('residentKey')
      if (residentKey) {
        this.providerId = residentKey.split(',')[0] || null
        this.relactiveProps = {
          providerId: this.providerId
        }
      }
      this.tabsList = [{label: '个人模版', value: '1'}, {label: '科室模版', value: '2'}]
    }
  },
  mounted () {
    this.$bus.$on('nav:preventActiveChange', () => {
      this.activeIndex = this.oldActiveIndex
    })
    this.$bus.$on('patient_mgt_shua', () => {
      this.key += 1
    })
  },
  computed: {
    docsPermission () {
      return this.$hasPermission('Auth_menu_inpatient_medical_docs')
    }
  },
  watch: {
    'docsPermission' (val) {
      if (val) {
        this.randomKey = Math.random()
      }
    },
    '$route.path': {
      handler (val) {
        /**
         * 住院医生 医嘱才展示医嘱模版
         * 住院护士 费用明细展示补费模版
         **/
        if (
          val.includes('/resident/patientmgt/open') ||
          (val.includes('/inpatient/patientmgt/fee') && this.$route.query.patientId)
        ) {
          this.hasTpl = true
        } else {
          this.hasTpl = false
        }
        // 住院医生电子病历
        if (val.includes('/inpatient/patientmgt/docs')) {
          this.activeIndex = '/inpatient/patientmgt/docs'
        } else {
          this.activeIndex = this.$route.path
        }
        this.oldActiveIndex = this.activeIndex
      },
      deep: true,
      immediate: true
    },
    'space': {
      handler (val) {
        if (this.space === 'resident') { // 患者信息头部
          this.code = '004' // 医生
        } else if (this.space === 'inpatient') {
          this.code = '005'
        }
      },
      immediate: true
    },
    '$route.query': {
      handler (val) {
        this.patientId = val.patientId
        this.show = !!val.patientId
        this.key = `${val.hospitalizedNumber || val.hospitalizedNumberBak},${val.patientId},${val.bedName}`
        this.baseInfo = val
        this.showPatientList = val.from !== 'medicalReview'
        if (this.$refs.listwaiting) this.$refs.listwaiting.bgClickClassByRouter()
      },
      immediate: true
    },
    '$route.query.patientId': {
      handler (val, oldVal) {
        if (!oldVal) return false
        storage.setLocalStorage('quoteTemplates', JSON.stringify([]))
        storage.setLocalStorage('recordTabs', JSON.stringify([]))
      },
      immediate: true
    }
  },
  methods: {
    print() {
      this.printvisible = true
    },
    closefull (full) {
      localStorage.setItem('resident_full', full)
      this.full = full
    },
    turn (item) {
      let path
      if (this.space === 'inpatient') {
        path = '/inpatient/patientmgt/fee'
      } else if (this.space === 'resident') {
        path = '/resident/patientmgt/open'
      }
      let query = {
        patientId: item.patientId,
        patientName: item.patientName,
        hospitalizedNumber: item.hospitalizedNumber,
        providerId: item.providerId,
        providerName: item.providerName,
        areaId: item.areaId,
        bedId: item.bedId,
        bedName: item.bedName,
        status: item.status,
        doctorId: item.chargeDoctorId,
        activeIndex: item.activeIndex
      }
      if (item.isChild) { // 判断是孩子还是大人
        query.isChild = 1
        // query.neonateInBed = item.neonateInBed
      }
      this.$router.push({
        path,
        query
      })
    },
    handleSelect (index) {
      this.oldActiveIndex = this.activeIndex
      this.activeIndex = index
      let query = this.$route.query
      if (index.indexOf('patientdetail') > -1 && !this.$route.query.hospitalizedNumberBak) {
        query.hospitalizedNumberBak = query.hospitalizedNumber
      }
      if (index.indexOf('patientdetail') === -1 && this.$route.query.hospitalizedNumberBak) {
        query.hospitalizedNumber = query.hospitalizedNumberBak
      }
      this.$router.replace({
        path: index,
        query: {
          ...query,
          fromType: this.space
        }
      })
    },
    waitingdbclick (patient) {
      let query = getQueryUrl(patient)
      let path = this.$route.path
      this.$router.replace({ path, query })
    },
    // 查询模版list
    tplQueryList (query) {
      /**
       * query {
       *  templateName,
       *  templateType
       * }
       */
      let params = Object.assign({}, query, {
        offset: 0,
        pagesize: 1000
      })
      if (this.space === 'inpatient') {
        params.templateSource = 2
        params.areaId = this.areaId
      }
      if (this.space === 'resident') {
        params.templateSource = 1
        params.sceneType = 3
        params.providerId = this.providerId
        params.templateSource = 1
      }
      return tplApi.list(params).then(res => {
        return res.list || []
      }).catch(() => [])
    },
    // 查询模版详情
    quote (id, cb) {
      tplApi.getById(id).then(rs => {
        if (!rs) {
          cb && cb()
          this.$messageTips(this, 'warning', '该模版没有数据')
          this.$refs.adviceTpl.queryTplList()
          return
        }
        this.$bus.$emit('hospitalTplQuote', JSON.parse(rs.content))
        cb && cb()
      })
    },
    // 左侧患者列表停止医嘱
    stopadvice (info) {
      let params = {
        orgId: storage.getStorageByClinic('CLINICID') || '',
        doctorId: info.chargeDoctorId,
        patientId: info.patientId,
        hospitalizedNumber: info.hospitalizedNumber,
        visitType: 3
      }
      this.api.stopInpatientAdviceByHospitalizedNumber(params).then(res => {
        if (res.head.errCode === 0) {
          this.$notify({
            title: '成功',
            type: 'success',
            message: '停止医嘱成功'
          })
        }
      })
    }
  },
  beforeDestroy () {
    this.$bus.$off('nav:preventActiveChange')
  },
  components: {
    bed,
    telescopic,
    patientHeader,
    listWaitingFull,
    listWaiting, // 患者列表
    tplTabs, // 模版列表
    advicePrint
  }
}
</script>
<style lang="scss">
.patient-mgt {
  height: 100%;
  padding-left: 220px;
  box-sizing: border-box;
  .fullscreen{
    position: absolute;
    top:0;
    left:0;
    padding-top: 50px;
    box-sizing:border-box;
    width: 100%;
    height: 100%;
    z-index: 99;
    background: #f5f5f5;
  }
  &.no-padding {
    padding-left: 0;
  }
  /deep/ .com_no_data{
    position: absolute;
    top: 40%;
    left: 50%;
    margin-left: -84px;
  }
  .patient-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom:0;
    z-index: 98;
    .patient-list {
      margin-top: 40px;
      flex: 2;
      overflow: hidden;
    }
    .tmpl-list {
      box-shadow: 10px 0px 10px rgba(0, 0, 0, 0.05);
      flex: 1;
      overflow: hidden;
    }
  }
  .station_layout_wrap {
    width: auto;
    display: flex;
    flex-direction: column;
    height: 100%;
    .layout_wrap_main {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }
    .layout_main_view {
      flex: 1;
      height: 100%;
      overflow: hidden;
      position: relative;
      .layout_main_view_inner {
        height: 100%;
      }
    }
  }
  .el-menu-item span {
    font-size: 16px;
    vertical-align: baseline;
  }
  .el-menu-patient_mgt.el-menu--horizontal > .el-menu-item {
    height: 34px;
    line-height: 34px;
    color: #000;
  }
  .el-menu-patient_mgt.el-menu--horizontal {
    border-bottom: solid 1px #ccc;
    background-color: rgba(255, 255, 255, 0);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    .is-active {
      background-color: rgba(255, 255, 255, 0);
      color: #1c7bef !important;
    }
    li {
      color: #000;
      font-size: 14px;
      font-weight: 600;
      height: 34px;
      line-height: 34px;
      &:hover {
        background-color: rgba(255, 255, 255, 0);
        color: #1c7bef;
      }
      &:focus{
        background-color: rgba(255, 255, 255, 0);
      }
    }
  }
}
</style>

