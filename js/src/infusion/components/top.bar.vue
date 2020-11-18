<template>
  <div class="top-bar clearfix">
    <el-autocomplete
    class="input"
    v-model="saoma_input"
    popper-class='yihutopbarautocomplete'
    :fetch-suggestions="querySearch"
    :placeholder="$t('请输入条码号')"
    :trigger-on-focus="false"
    @select="handleSelect"
    v-if="$hasPermission('Auth_menu_outdoctor_ksjz')"
    ></el-autocomplete>
    <slot name='button'></slot>
    <div class="gamestart">
        <el-button type="primary" size="small" @click='Visiting' :disabled="!jzShow">接诊</el-button>
    </div>
    <div class="next">
        <el-popover
        v-model='popover'
        placement="bottom"
        trigger="manual">
        <div class="nextcontent">
            <div class="callCustomer">叫号
            <span style="color:#f7890b;">(点击下一位当前叫号者过号)</span>
            <i class="el-icon-close" @click='popover = false' style="position: absolute;top: 9px;right: 7px;cursor: pointer;"></i>
            </div>
            <div v-if='patientObj.patientName' class="currentCustomer clearfix">
            <div style="float:left" type="text">当前叫号：<b style="fontSize:18px;marginRight:10px;color:#1c7bef;cursor:point" @click="dz(patientObj)">{{patientObj.patientName}}</b></div>
            <div style="float:left">下一位：<b  style="fontSize:18px;fontWeight:normal">{{patientObj.nextPatientName || '无'}}</b></div>
            </div>
            <div v-else class="noCustomer">目前没有患者候诊</div>
        </div>
            <div class="call" slot="reference" :class='nextDisabled ? "disabled": ""' @click='getPatient'>叫号</div>
        </el-popover>
        <el-dropdown size="small" type="primary" @command="getNext" trigger="click">
        <el-button type="primary" size="small"  icon="el-icon-arrow-down"></el-button>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item style="width:50px">下一位</el-dropdown-item>
        </el-dropdown-menu>
        </el-dropdown>
    </div>
</div>
</template>

<script>
import api from '@/infusion/store/infusion.js'
import storage from '@/util/storage'
export default {
  props: [],
  components: {

  },
  mounted () {
    if (this.$store.state.workbenchFlag === 'tech') {
      this.sesstionKey = 'TECH_WARD'
    } else if (this.$store.state.workbenchFlag === 'infusion') {
      this.sesstionKey = 'INFUSION_WARD'
    }
    this.stationId = storage.getSessionStorage(this.sesstionKey).split(',')[2]
    this.providerId = storage.getSessionStorage(this.sesstionKey).split(',')[0]
  },
  data () {
    return {
      api,
      jzShow: false,
      nextDisabled: false,
      saoma_input: '',
      popover: false,
      patientObj: {},
      stationId: '',
      providerId: '',
      jZModle: '',
      sesstionKey: ''
    }
  },
  watch: {
    '$route.query': {
      handler (val) {
        if (val.patientId) {
          this.jzDisable()
        }
      },
      immediate: true
    }
  },
  methods: {
    async medicalServiceFee () {

    },
    async jzDisable () {
      this.jzShow = false
      if (this.$route.query.appointmentId) {
        let res = await this.api.getVisitingPatient({
          visitNumber: this.$route.query.appointmentId
        })
        if (!res.data.id) this.jzShow = true
      }
      if (this.$route.query.quickcall === 1) this.jzShow = true
    },
    jump (query) {
      let name = ''
      if (this.$store.state.workbenchFlag === 'tech') {
        name = 'techPatientmgt'
      } else if (this.$store.state.workbenchFlag === 'infusion') {
        name = 'infusionPatientmgt'
      }
      this.$router.push({
        name,
        query: query
      })
    },
    dz (data) {
      this.$bus.emit('infusion_patient_flush')
      this.jump({
        patientId: data.patientId,
        visitNumber: data.visitNumber,
        providerId: data.providerId,
        appointmentId: data.appointmentId
      })
    },
    async Visiting () {
      this.jzShow = false
      await this.api.receiveTriageQueueByStationId({
        stationId: this.stationId,
        source: 2,
        patientId: this.$route.query.patientId
      })
      this.$bus.$emit('infusion_patient_flush')
      if (this.jZModle === 'call') {
        this.jump({
          patientId: this.patientObj.patientId,
          visitNumber: this.patientObj.visitNumber,
          providerId: this.patientObj.providerId || this.patientObj.deptId,
          appointmentId: this.patientObj.appointmentId
        })
      } else {
        this.jzDisable()
      }
    },
    async getPatient () {
      this.jZModle = 'call'
      let res = await this.api.callNumTriageQueueByStationId({stationId: this.stationId})
      this.patientObj = res.data
      this.popover = true
      this.jzShow = !!this.patientObj.patientId
    },
    async getNext () {
      let res = await this.api.queryNextTriageQueueByStationId({stationId: this.stationId})
      this.patientObj = res.data
    },
    async querySearch (queryString, cb) {
      let res = await this.api.findPatientList({patientMsg: queryString, providerId: this.providerId}).catch(() => {
        cb([])
      })
      res.data = res.data || []
      var result = []
      for (let i = 0; i < res.data.length; i++) {
        let sex = res.data[i].sex === '1' ? '男' : '女'
        res.data[i].age = res.data[i].age || '--'
        result.push({
          value: (i + 1) + ' ' + res.data[i].name + ' ' + sex + ' ' + res.data[i].age,
          item: res.data[i]
        })
      }
      cb(result)
    },
    handleSelect (data) {
      data = data.item
      this.jZModle = 'quick'
      this.jump({
        patientId: data.patientId,
        visitNumber: data.visitNumber,
        providerId: data.providerId,
        quickcall: 1
      })
    }
  }
}
</script>
<style lang="scss" scoped>
   /deep/ .el-popover{
    padding: 10px;
  }
  /deep/ .nextcontent{
    font-size: 14px;
    min-width: 250px;
    padding: 0px 20px 0px 10px;
    .callCustomer{
      color: #333;
      font-weight: 800;
      line-height: 30px;
      span{
        font-size: 12px;
      }
    }
    .noCustomer{
      color: #666;
      line-height: 35px;
    }
    .active{
      height: 30px;
      line-height: 30px;
      width:40px;
      position: relative;
      right:0px;
    }
  }
.top-bar {
    background: #fff;
    padding: 0 10px;
    line-height: 40px;
    margin: 0px -10px 5px;
    .input {
      width: 210px;
      float: left;
      /deep/ &::placeholder {
        font-size: 12px;
      }
    }
    /deep/ .el-input__inner {
      height: 30px;
    }

    /deep/ .el-input {
      font-size: 12px;
    }
    .gamestart,.next{
      float: right;
      margin-right: 10px;
    }
    .next{
      margin:10px 10px 8px 0;
      height: 24px;
      position: relative;
      border-radius: 4px;
      overflow: hidden;
      .el-dropdown{
        float: left;
        background: #1c7bef;
        height: 25px;
        line-height: 23px;
        .el-button{
          padding:  5px 6px;
        }
      }
      .call{
        font-size: 12px;
        color: #fff;
        text-indent: 11px;
        width: 40px;
        line-height: 25px;
        cursor: pointer;
      }
      .disabled{
        background: #ccc;
        color: #333;
        cursor:not-allowed;
      }
      & > span{
        height: 25px;
        line-height: 23px;
          background: #1c7bef;
        float: left;
      }
      b{
       height: 12px;
       width: 1px;
       background:rgba(255, 255, 255, 0.5);
       position: absolute;
       top:6px;
       left:60%;
       z-index: 2;
      }
    }





}
</style>
