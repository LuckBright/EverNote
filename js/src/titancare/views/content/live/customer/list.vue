<!--  -->
<template>
  <div class="customer-list" v-loading="!receivedList && !waitingList">
    <el-tabs
      class="tabs"
      type="border-card"
      v-model="activeTabName"
      @tab-click="handleClick"
    >
      <el-tab-pane name="1">
        <span class="tab-label inline-block" slot="label">未接</span>
        <div class="" v-if="waitingList && waitingList.length">
          <el-radio
            class="account"
            v-for="(item, index) in waitingList"
            border
            :key="item.patientAccount"
            v-model="radio"
            :label="index"
            @change="selectedWaiting"
            >{{ item.patientAccountName }}</el-radio
          >
        </div>
        <ever-no-data v-else></ever-no-data>
      </el-tab-pane>
      <el-tab-pane name="2">
        <span class="tab-label inline-block" slot="label">已接</span>
        <div class="" v-if="receivedList && receivedList.length">
          <el-radio
            class="account"
            v-for="(item, index) in receivedList"
            border
            :key="item.patientAccount"
            v-model="radio"
            :label="index"
            @change="selectedReceived"
            >{{ item.patientAccountName }}</el-radio
          >
        </div>
        <ever-no-data v-else></ever-no-data>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from '@/titancare/api/content/playback'

export default {
  props: {},
  data () {
    return {
      activeTabName: '1',
      waitingList: '',
      receivedList: '',
      radio: '',
      dataObj: {
        modal: true,
        waiting: {},
        received: {}
      }
    }
  },

  components: {},

  computed: {
    sig () {
      return this.$store.state.sig
    }
  },

  mounted () { },
  created () {
    this.liveRoom = { ...JSON.parse(this.$route.query.liveRoom) }
    this.init()
  },
  methods: {
    async init (account) {
      this.waitingConsultList()
      this.getConsultingImUsers(account)
    },
    async waitingConsultList () {
      this.waitingList = ''
      const waiting = await api.waitingConsultList({
        liveRecordId: this.liveRoom._liveRoom.videoRecordId,
        doctorAccountId: this.sig.userID,
        tenantId: localStorage.getItem('TENANTID')
      })
      this.waitingList = waiting.data && waiting.data.list ? waiting.data.list : []
    },
    async getConsultingImUsers (account) {
      this.receivedList = ''
      const received = await api.getConsultingImUsers({
        tenantId: localStorage.getItem('TENANTID'),
        liveRecordId: this.liveRoom._liveRoom.videoRecordId,
        doctorId: localStorage.getItem('USERID'),
        doctorAccountId: this.sig.userID
      })
      this.receivedList = received.data && received.data.list ? received.data.list : []
      if (account && this.receivedList.length) {
        for (let i = 0; i < this.receivedList.length; i++) {
          if (this.receivedList[i].patientAccount === account) {
            this.radio = i
            break
          }
        }
        this.activeTabName = '2'
      } else {
        if (this.activeTabName === '2' && this.receivedList.length) {
          this.radio = 0
        }
      }
      if (this.activeTabName === '2' && this.receivedList.length) {
        this.selectedReceived(this.radio)
      }
    },
    handleClick () {
      this.radio = ''
      this.dataObj.waiting = {}
      this.dataObj.received = {}
      this.dataObj.modal = true
      this.dataObj.activeTabName = this.activeTabName
      this.changeObj()
      this.init()
    },
    selectedWaiting (index) {
      this.dataObj.waiting = this.waitingList[index] ? this.waitingList[index] : {}
      this.changeObj()
    },
    selectedReceived (index) {
      this.dataObj.received = this.receivedList[index] ? this.receivedList[index] : {}
      this.dataObj.modal = false
      this.changeObj()
    },
    changeObj () {
      this.$emit('change', this.dataObj)
    }
  }
}

</script>
<style lang='scss' scoped>
.customer-list {
  padding: 10px;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  .account {
    width: 245px;
    margin-bottom: 5px;
    margin-left: 10px;
  }
  .tab-label {
    width: 108px;
    text-align: center;
  }
  .tabs {
    height: 98%;
    /deep/ .el-tabs__nav {
      display: flex;
      width: 100%;
      .el-tabs__item {
        flex: 1;
      }
      .el-tabs__item:nth-child(2) {
        padding: 0px 10px;
        border-right: none;
      }
    }
  }
}
</style>
