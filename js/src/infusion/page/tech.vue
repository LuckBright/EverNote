<template>
  <div class="tech_main">
    <div class="tech-content">
      <techList @change="getExecute" @tabChange="tabChange" :key='key' v-if="+serviceType != -1"></techList>
      <!-- 补费组件 -->
      <tech-fee class="tech-fee"
        v-if="executes.length"
        :executes="executes"
        :disabled="disabled || executes.length && executes[0].visitType === 5"
        :provider="{id: tenantDeptId, name: tenantDeptName}"
      >
      </tech-fee>
    </div>
    <div class="tech-fee-tpl">
      <tpl-tabs
        ref="adviceTpl"
        class="tmpl-list"
        v-model="templateType"
        :query="tplQueryList"
        :tabs-list="tabsList"
        @quote="quote"
      ></tpl-tabs>
    </div>

    <el-dialog
        title="请选择业务类型、科室和诊室"
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="true"
        width="400px"
        @close='returnback'
      >
        <switchComp @close="close"></switchComp>
      </el-dialog>
      <div
        class="tech_right_bar"
        :class="rightSwitch ? 'active':''"
        ref="tech_right_bar"
        @mousedown="mousedown($event,'tech_right_bar')"
      >
        <div class="bar_switch" @click="rightSwitchBtn">
          <div>切换科室</div>
        </div>
        <switchComp ref="switchComp" @close="close"></switchComp>
      </div>
  </div>
</template>
<script>
import techList from '@/infusion/page/tech.list.vue'
import techFee from '@/infusion/components/infusion.fee.vue'
import hois from '@/arrange/page/reservation/hois.vue'
import api from '@/infusion/store/infusion.js'
import mousemove from '@/util/mousemove'
import switchComp from '@/infusion/components/switch.vue'
import patientListTab from '@/infusion/components/patient.list.tab.vue'
import { domClickHandle } from '@/util/common'
import storage from '@/util/storage.js'
import tplApi from '@/sob/store/tmpl.api.js' // 模版接口
import tplTabs from '@/inpatient/components/tab.tpl.vue' // 模版

export default {
  mixins: [mousemove],
  components: {
    techList,
    hois,
    switchComp,
    patientListTab, // 检验患者队列
    techFee, // 费用组件
    tplTabs // 费用模版
  },
  data () {
    return {
      api,
      resourceType: '',
      // 挂号 register、疫苗 vaccine、检验 lis、预检 pre-check、检查 pacs、输液 infusion、体检 health-checkup 治疗 cure
      // visitNumber=OP20190000003257&adviceType=800&patientId=hs5jQUDSFaRuvcH2nPU
      tenantDeptId: '',
      tenantDeptName: '',
      resourceId: '',
      dialogVisible: false,
      rightSwitch: false,
      key: 0,
      serviceType: '',
      executes: [], // 执行单
      templateType: '1',
      tabsList: [{label: '个人模版', value: '1'}, {label: '科室模版', value: '2'}],
      disabled: false
    }
  },
  mounted () {
    this.mousedownInit('tech_right_bar')
    domClickHandle('tech_right_bar', _ => {
      this.rightSwitch = false
    })
    if (this.$route.query.patientId) {
      this.$router.push({
        query: {}
      })
    }
  },
  created () {
    this.init()
    this.$bus.$off('queuecall', this.queuecall)
    this.$bus.$on('queuecall', this.queuecall)
  },
  watch: {
    '$route.params.serviceType': {
      handler (val) {
        this.serviceType = val + ''
        this.setResourceType()
      },
      immediate: true
    },
    '$route.params': {
      handler (val) {
        this.initParams()
      },
      immediate: true
    },
    '$store.state.currentUser.userId': {
      handler (val) {
        this.initParams()
      },
      immediate: true
    }
  },
  methods: {
    returnback () {
      if (!storage.getLocalStorage(`tech_value`)) {
        location.href = this.$ever.mainIndex + '/myclinic'
        this.dialogVisible = true
      }
    },
    close () {
      this.key++
      this.executes = []
      this.dialogVisible = false
      this.rightSwitch = false
      let obj = JSON.parse(localStorage.getItem('tech_value'))
      this.$router.push({
        name: 'tech_main',
        params: { serviceType: obj.serviceType }
      })
      this.init()
    },
    rightSwitchBtn () {
      if (this.moved) return
      this.rightSwitch = !this.rightSwitch
      this.$refs.switchComp.open(this.rightSwitch)
    },
    initParams () {
      if (!localStorage.getItem('tech_value')) {
        this.dialogVisible = true
      } else {
        // }

        let obj = JSON.parse(localStorage.getItem('tech_value'))
        if (!this.$store.state.currentUser.userId) return
        if (obj.doctorId !== this.$store.state.currentUser.userId) {
          localStorage.removeItem('tech_value')
          this.dialogVisible = true
          return
        }
        // this.key++
        this.$router.push({
          name: 'tech_main',
          params: { serviceType: obj.serviceType },
          query: this.$route.query
        })
      }
    },
    async jz () {
      let res = await api.treatment({
        'tenantDeptId': this.tenantDeptId,
        'resourceType': this.resourceType,
        'resourceId': this.resourceId,
        'callType': 'waiting',
        'triageId': this.$route.query.triageId,
        'apptId': this.$route.query.appointmentId
      })
      if (res && res.head && res.head.errCode === 0) {
        this.isEncounterByVisitNumber = true
        this.$notify({
          title: '成功',
          message: '接诊成功',
          type: 'success'
        })
        this.$bus.$emit('refresh_hois_list', 'jiezhen')
      }
    },
    async queuecall (patient) {
      if (!patient.patientId) return
      this.rowclick(patient)
    },
    rowclick (obj) {
      let query = {
        adviceId: obj.adviceId,
        patientId: obj.patientId,
        visitNumber: obj.visitNumber,
        triageId: obj.triageId, // 检查治疗需要这个id 接诊
        appointmentId: obj.appointmentId, // 预约id
        taskId: obj.taskId, // 执行单id
        timeStamp: this.$moment().valueOf(), // 区分点患者不刷新
        visitType: obj.visitType
      }
      if (obj.visitType === 1) { // 检查治疗队列，把住院号和就诊编号都放到visitNumber, 门诊补费需要新的不标准的visitNo
        query.visitNumber = obj.visitNo || obj.visitNumber
      }
      if (obj.visitType === 3) {
        query.hospitalizedNumber = obj.visitNumber
      }
      if (obj.history) query.status = 'history'
      this.$router.push({
        params: this.$route.params,
        path: this.$route.path,
        query: query
      })
    },
    setResourceType () {
      if (this.serviceType === '800') this.resourceType = 'pacs'
      if (this.serviceType === '801') this.resourceType = 'lis'
      if (this.serviceType === '802') this.resourceType = 'cure'
    },
    init () {
      this.disabled = false
      this.setResourceType()
      if (localStorage.getItem('tech_value')) {
        let obj = JSON.parse(localStorage.getItem('tech_value'))
        this.tenantDeptId = obj.provider && obj.provider.id
        this.tenantDeptName = obj.provider && obj.provider.name
        this.resourceId = obj.section && obj.section.id
      }
      this.$refs.adviceTpl && this.$refs.adviceTpl.init()
    },
    getExecute (data) {
      this.executes = data.filter(item => item.orgId === this.$store.state.currentUser.organizationId)
    },
    tabChange (status) {
      this.disabled = status
    },
    // 查询模版list
    tplQueryList (query) {
      /**
       * query {
       *  templateName,
       *  templateType
       * }
       */
      if (!this.tenantDeptId) {
        return []
      }
      let params = Object.assign({}, query, {
        offset: 0,
        pagesize: 1000,
        templateSource: 2,
        providerId: this.tenantDeptId
      })
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
  }
}
</script>
<style lang="scss" scoped>
.tech_main {
  display: flex;
  flex-direction: row;
  height: 100%;
  position: relative;
  .tech-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    width: 0;
  }
  .tech-fee-tpl {
    width: 240px;
    margin-left: 15px;
    border: 1px solid #ddd;
  }
  .right_area {
    flex: 1;
    padding-left: 10px;
  }
   .tech_right_bar {
    display: flex;
    // align-items: flex-end;
    position: fixed;
    right: -340px;
    top: 80%;
    width: 350px;
    padding-right: 20px;
    background: #fff;
    transition: all ease-out 0.3s;
    box-shadow: -4px 4px 10px 2px rgba(0, 0, 0, 0.2);
    border-radius: 4px 0 0px 4px;
    overflow: hidden;
    z-index: 100;
    &.active {
      right: 0;
    }
    span {
      padding-left: 10px;
    }
    .bar_switch {
      color: #fff;
      width: 20px;
      text-align: center;
      font-size: 14px;
      padding: 0px 5px 0;
      background: #1c7bef;
      cursor: pointer;
      position: relative;
      div{
        position: absolute;
        top: 50%;
        width: 20px;
        margin-top: -32px;
      }
    }
  }
}
.fee-tpl-btn {
  position: absolute;
  top: 6px;
  right: 10px;
}
</style>

