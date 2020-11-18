<template>
  <div class="show" :key='allKey'>
    <div class="contents" v-if='provider'  :key='key'>
      <list class="list" :space='space' @success='getSurgeryExecuteById'></list>
      <div class="right" v-if='$route.query.patientId' :key='$route.query.id'>
        <patient-header
          class="layout_wrap_01"
          :patientId="$route.query.patientId"
          :visitNumber="$route.query.visitNumber || $route.query.hospitalizedNumber"
          :dptId='$route.query.providerId'
          code="018"
        ></patient-header>
        <div class='info'>
          状态：<span>{{surgeryStatus(info.surgeryStatus)}}</span>
          来源：<span>{{info.visitType == 1 ? '门诊' : info.visitType == 2 ? '急诊': '住院'}}</span>
          <template v-if='info.surgeryStatus == 70'>
            拒绝时间：<span>{{info.rejectTime | formatDateByExp("YYYY-MM-DD HH:mm:ss")}}</span>
            拒绝理由：<span>{{info.rejectReason || '--'}}</span>
          </template>
          <template v-else>
            安排时间：<span>{{info.appointmentDate}} - {{info.appointmentTime}}</span>
            手术间：<span>{{info.surgeryRoomName || '--'}}</span>
          </template>
        </div>
        <el-menu
            :default-active="activeIndex"
            class="el-menu-patient_mgt layout_tabs_wrap"
            mode="horizontal"
            @select="handleSelect"
            :collapse-transition="false"
            :router="false">
            <el-menu-item :index="`/csa/${space}/index`">手麻主页</el-menu-item>
            <el-menu-item :index="`/csa/${space}/exec`">执行登记</el-menu-item>
            <el-menu-item :index="`/csa/${space}/docs`">{{space  == 'nurse' ? '护理记录' : '病历记录' }}</el-menu-item>
            <el-menu-item :index="`/csa/${space}/fee`">费用记录</el-menu-item>
            <el-menu-item :index="`/csa/${space}/advice`">医嘱记录</el-menu-item>
          </el-menu>
          <router-view :provider="provider" class="csa-patient-content"></router-view>
      </div>
      <ever-no-data v-else tipTxt="请选择患者再操作"></ever-no-data>
    </div>
    <el-dialog
      title="请选择科室"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
      width="400px"
      @close='returnback'
      >
      <switchComp @close="close" @open='dialogVisible = true'></switchComp>
    </el-dialog>
    <div
      class="csa_right_bar"
      :class="rightSwitch ? 'active':''"
      ref="csa_right_bar"
      @mousedown="mousedown($event,'csa_right_bar')"
      >
      <div class="bar_switch" @click="rightSwitchBtn">
        <div>切换科室</div>
      </div>
      <switchComp :rightSwitch='rightSwitch' ref="switchComp" @close="close" @open='dialogVisible = true'></switchComp>
    </div>
  </div>
</template>
<script>
import api from '@/csa/store/csaapi.js'
import list from '@/csa/components/csa.patient.list.vue'
import patientHeader from '@/inpatient/components/common.head.js'
import mousemove from '@/util/mousemove'
import switchComp from '@/csa/components/switch.vue'
import { domClickHandle } from '@/util/common'
import { CSA_STATUS } from '@/csa/store/csa.js'
export default {
  mixins: [mousemove],
  data () {
    let space = this.$route.matched[0].meta.space = this.$route.matched[1].meta.space
    this.$route.matched[0].meta.role = this.$route.matched[1].meta.role
    return {
      api,
      activeIndex: `/csa/${space}/index`,
      space,
      oldActiveIndex: '',
      rightSwitch: false,
      dialogVisible: false,
      key: 1,
      provider: '',
      info: {},
      allKey: 0
    }
  },
  components: {
    list,
    switchComp,
    patientHeader,
  },
  mounted () {
    this.mousedownInit('csa_right_bar')
    domClickHandle('csa_right_bar', _ => {
      this.rightSwitch = false
    })
    this.activeIndex = this.$route.path
    let _this = this
    window.onstorage = function (e) {
      if (e.key === 'csa_value') {
        if (e.oldValue === e.newValue) return
        _this.$router.push({
          path: _this.$route.path
        })
        _this.allKey++
      }
    }
  },
  watch: {
    '$route.path': {
      handler (val) {
        this.activeIndex = this.$route.path
      },
    },
    '$store.state.currentUser.userId': {
      handler (val) {
        this.initParams()
      },
      immediate: true
    },
    '$route.query.executeId': {
      handler (val) {
        this.getSurgeryExecuteById()
      },
      immediate: true
    }
  },
  methods: {
    surgeryStatus (status) {
      let str = ''
      CSA_STATUS.forEach(ele => {
        if (ele.id === String(status))str = ele.name
      })
      return str
    },
    async getSurgeryExecuteById () {
      let res = await this.api.getSurgeryExecuteById({
        id: this.$route.query.id
      })
      if (res) {
        this.info = res.data || {}
      }
    },
    returnback () {
      if (!localStorage.getItem(`csa_value`)) {
        this.$router.replace({
          path: '/csa/plan'
        })
      }
    },
    rightSwitchBtn () {
      if (this.moved) return
      this.rightSwitch = !this.rightSwitch
      this.$refs.switchComp.open(this.rightSwitch)
    },
    success () {
    },
    close () {
      this.key++
      this.dialogVisible = false
      this.rightSwitch = false
      this.$router.push({
        path: this.$route.path
      })
      this.initParams()
    },
    initParams () {
      if (localStorage.getItem('csa_value')) {
        let obj = JSON.parse(localStorage.getItem('csa_value'))
        if (!this.$store.state.currentUser.userId) return
        if (obj.doctorId !== this.$store.state.currentUser.userId) {
          localStorage.removeItem('csa_value')
          this.dialogVisible = true
          return
        } else {
          this.provider = obj
        }
      }
    },
    handleClick () {

    },
    handleSelect (index) {
      this.oldActiveIndex = this.activeIndex
      this.activeIndex = index
      this.$router.replace({
        path: index,
        query: this.$route.query
      })
    }
  },
}
</script>
<style lang="scss" scope>
.show {
  // background: #fff;
  height: 100%;
  /deep/ .com_no_data{
    width: 100%;;
  }
  .info{
    background: #fff;
    line-height: 46px;
    font-size: 12px;
    padding-left: 10px;
    border-top: 1px solid #eee;
    span{
      color: #FAAD14;
      margin-right: 15px;
    }
  }
  .contents{
    display: flex;
    height: 100%;
  }
  .csa_right_bar {
    display: flex;
    position: fixed;
    right: -340px;
    top: 80%;
    width: 350px;
    height: 80px;
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
  .list{
    width: 300px;
    height: 100%;
    box-sizing: border-box;
  }
  .right{
    flex:1;
    display: flex;
    height: 100%;
    // overflow: auto;
    flex-direction: column;
    height: 100%;
    padding:0 10px;
    background: #f5f5f5;
    /deep/ .el-tabs{
      flex:1;
      display: flex;
      overflow: auto;
      flex-direction: column;
    }
    /deep/ .el-tabs__content{
      flex:1;
      overflow: auto;
    } 
  }
  .el-menu-patient_mgt{
    margin:10px 0;
  }
  .csa-patient-content {
    flex: 1;
    overflow-y: auto;
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
