<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="基本信息" name="first">
      <patient-info :patient="patient" @success="patientSuccess" @update="update" ref="patientinfo"></patient-info>
    </el-tab-pane>
    <el-tab-pane label="补本补卡" name="second">
      <bind-card :patient="patient" :active-name="activeName"></bind-card>
    </el-tab-pane>
    <el-tab-pane label="会员" name="six">
      <memberbind :patientId="patientId"></memberbind>
    </el-tab-pane>
    <el-tab-pane label="积分" name="third">
      <integral :patientId="patientId"></integral>
    </el-tab-pane>
    <el-tab-pane label="充值" name="fourth">
      <recharge :patientId="patientId" ref="recharge"></recharge>
    </el-tab-pane>
    <el-tab-pane label="套餐" name="five"></el-tab-pane>
  </el-tabs>
</template>
<script>
  import patientInfo from '@/crm/components/patientinfo.mini'
  import integral from '@/crm/components/integral'
  import memberbind from '@/crm/components/memberbind'
  import bindCard from '@/arrange/page/register/dialog-bindcard'
  import recharge from '@/crm/components/recharge'
  export default {
    props: ['patient'],
    data () {
      return {
        activeName: 'first',
        patientId: ''
      }
    },
    watch: {
      'patient' (val) {
        if (val) {
          this.patientId = val.id
        } else {
          this.patientId = ''
          this.patient = ''
        }
      },
      'activeName' (val) {
        if (val !== 'first') {
          let tempObj = {
            isShow: false
          }
          this.$bus.$emit('showmore', tempObj)
        }
      }
    },
    methods: {
      handleClick (tab, event) {
        if (tab.name === 'five') {
          this.$emit('showSale')
        } else if (tab.name === 'fourth') {
          tab.$children[0].getCard()
        }
      },
      patientSuccess (val) {
        this.$emit('success', val)
      },
      update (val) {
        this.activeName = 'first'
      }
    },
    components: {
      patientInfo,
      integral,
      memberbind,
      recharge,
      bindCard
    }
  }
</script>
<style lang="scss" scoped>
</style>

