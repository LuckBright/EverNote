<template>
  <div class="hois">
    <header>
      <div class="patient_info clearfix" v-if="patientInfo && patientInfo.id && patientInfo.patientId">
        <span>{{patientInfo.next}}</span>
        {{patientInfo.patientName}} {{patientInfo.patientSex}} {{patientInfo.patientAge}}
      </div>
      <el-dropdown
        v-if="activeName==='0' && !isYj"
        split-button
        type="primary"
        class="shout"
        @command="getQueueNext"
        @click="getQueueCall"
      >叫号
        <span>{{frequency}}</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>过号</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-date-picker
        v-if="isYj"
        style="width: 100%;"
        value-format="yyyy-MM-dd"
        v-model="parms.searchTime"
        type="date"
        placeholder="选择日期">
      </el-date-picker>
    </header>
    <div v-if="show">
      <section>
        <div class="tabs">
          <el-tabs @tab-click="list" v-model="activeName">
            <el-tab-pane v-for="(item,i) in tabsMap" :key="i">
              <template v-if="(i==='4'&&!isYj) || (i!=='4')">
              <span slot="label" :key="i">
                {{item.name}}
                <i
                  v-if=" i !=='2' && i !=='4'"
                  class="rowsum"
                  :class="activeName == i ? 'activeNumber':''"
                >{{item.number}}</i>
              </span>
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>
      </section>
      <el-autocomplete
        class="quick"
        v-if="parms.searchType === 'quick'"
        v-model="saoma_input"
        popper-class="yihutopbarautocomplete"
        :fetch-suggestions="querySearch"
        :placeholder="$t('请输入患者姓名')"
        :trigger-on-focus="false"
        @select="handleSelect"
      ></el-autocomplete>
      <hois-list
        v-else
        @rowclickemit="rowemit"
        @search="list"
        @getPageInfo="getPageInfo"
        :ishistory="ishistory"
        :tablePage="offset"
        :tableDatas="tableData"
        :indexObj="indexObj"
        :activeName="activeName"
        :key="key"
        :totalCounts="totalCount"
      ></hois-list>
    </div>
  </div>
</template>
<script>
import api from '@/infusion/store/queuemanagement.js'
import api2 from '@/infusion/store/infusion.js'
import hoisList from './hoislist'
import { wsConnect } from '@/util/common/'
// tenantDeptId科室ID
// resourceId为医生ID
// resourceType类型 挂号: register、疫苗: vaccine、检验: lis、预检: pre-check、检查: pacs、输液: infusion、体检: health-checkup 治疗: cure
export default {
  props: [
    'tenantDeptId',
    'resourceType',
    'resourceId',
    'isYj'
  ],
  data () {
    return {
      show: true,
      api,
      api2,
      tableData: [],
      patientName: '',
      activeName: '0',
      patientInfo: '',
      offset: 1,
      pagesize: 20,
      frequency: 0,
      parms: {
        searchTime: this.$moment().format('YYYY-MM-DD'),
        tenantDeptId: this.tenantDeptId,
        resourceType: this.resourceType,
        resourceId: this.resourceId,
        pagesize: this.pagesize,
        searchType: 'waiting',
        searchTrem: ''
      },
      tabsMap: {
        '0': { name: '候诊', number: 0 },
        '1': { name: '已诊', number: 0 },
        '2': { name: '快速接诊', number: 0 },
        '3': { name: '未到诊', number: 0 },
        '4': { name: '历史', number: 0 }
      },
      saoma_input: '',
      jZModle: '',
      indexObj: {
        tabIndex: '0',
        rowIndex: -1,
        oldTabIndex: '0'
      },
      ishistory: false,
      key: new Date() + '',
      totalCount: 0
    }
  },
  watch: {
    'parms.searchTime' () {
      this.list('first')
    }
  },
  mounted () {
    if (this.parms.tenantDeptId && this.parms.resourceType && this.parms.resourceId) {
      this.receiveSocket()
    }
    if (this.$route.query.from === 'kanban') {
      this.activeName = '1'
      this.list({index: '1'})
    }
    this.$bus.$off('refresh_hois_list')
    this.$bus.$on('refresh_hois_list', (val) => {
      this.activeName = '1'
      this.list({index: '1'})
    })
    this.$bus.$off('yihu:autoAdmission')
    this.$bus.$on('yihu:autoAdmission', this.autoAdmission)
  },
  methods: {
    autoAdmission(val) {
      this.activeName = '0'
      this.list({index: '0'})
    },
    async list (value, cb) {
      if (!this.parms.resourceId || !this.parms.tenantDeptId) return false
      this.indexObj.tabIndex = this.activeName
      if (typeof (value) === 'object') {
        this.parms.offset = 0
        this.parms.patientId = value.patientId
        this.parms.searchTrem = value.patientName
        this.parms.startDate = value.startDate
        this.parms.endDate = value.endDate
      } else if (value === 'jiezhen') {
        this.patientInfo = ''
        this.frequency = 0
      } else if (value === 'page' && this.activeName === '4') {
        this.parms.offset = (this.offset - 1) * this.pagesize
        this.parms.pagesize = this.pagesize
      } else {
        this.parms.offset = 0
        this.parms.searchTrem = ''
        this.parms.patientId = ''
      }
      if (value && value.index) {
        if (value.index === '0') this.parms.searchType = 'waiting'
        if (value.index === '1') this.parms.searchType = 'already'
        if (value.index === '2') this.parms.searchType = 'quick'
        if (value.index === '3') this.parms.searchType = 'pending'
        if (value.index === '4') this.parms.searchType = 'history'
        this.ishistory = false
      }
      // 队列列表
      let res = await this.api.getQueue(this.parms)
      this.tableData = []
      if (res && res.head && res.head.errCode === 0 && this.parms.searchType !== 'history') {
        this.tabsMap['0'].number = res.data.waitingSize
        this.tabsMap['1'].number = res.data.alreadySize
        this.tabsMap['2'].number = res.data.quickSize
        this.tabsMap['3'].number = res.data.pendingSize
        if (value && value.index === '2') return false
        this.tableData = res.data.queues
      }
      // if (this.parms.searchTrem === '') this.tabsMap['4'].number = historyres.data.totalCount
      if (this.activeName === '4') {
        // 历史列表
        if (!value || (value.startDate && value.endDate) || value.patientId || value.type === 'search') {
          this.offset = 1
        }
        this.parms.offset = (this.offset - 1) * this.pagesize
        this.parms.pagesize = this.pagesize
        let historyres = await this.api.getHistoryQueue(this.parms)
        this.tableData = historyres.data.resultList
        this.totalCount = historyres.data.totalCount
        this.ishistory = true
      }
    },
    rowemit (value) {
      if (this.activeName === '0' || this.activeName === '1' || this.activeName === '4') {
        this.indexObj.oldTabIndex = value.tabIndex
        if (this.activeName === '4') value.history = true
        if (this.activeName === '0') {
          this.api2.treatment({
            callType: 'waiting',
            tenantDeptId: value.tenantDeptId,
            resourceType: 'register',
            resourceId: value.doctorId,
            triageId: value.triageId,
            apptId: value.appointmentId
          }).then(rs => {
            this.activeName = '1'
            this.list({index: '1'})
            this.$emit('rowclick', value)
          })
        } else {
          this.$emit('rowclick', value)
        }
      }
    },
    // 叫号
    getQueueCall () {
      let callType
      if (this.tableData.length === 0) return false
      if (this.activeName === '0') {
        callType = { 'callType': 'waiting' }
      } else if (this.activeName === '1') {
        callType = { 'callType': 'dept' }
      }
      this.api.getQueueCall(Object.assign(callType, this.parms)).then((res) => {
        if (res.data) {
          if (res.data.patientSex === '1') {
            res.data.patientSex = '男'
          }
          if (res.data.patientSex === '2') {
            res.data.patientSex = '女'
          }
          if (!res.data.patientAge) {
            res.data.patientAge = '--'
          }
          res.data.next = '下一个:'
          this.patientInfo = res.data
          if (this.patientInfo.id) {
            this.$bus.$emit('queuecall', res.data)
            this.frequency += 1
          }
        }
      })
    },
    // 过号
    getQueueNext () {
      let callType
      if (this.tableData.length === 0) return false
      if (this.activeName === '0') {
        callType = { 'callType': 'waiting' }
      }
      if (!this.patientInfo) {
        this.getQueueCall()
        return false
      }
      this.api.getQueueNext(Object.assign(callType, this.parms)).then((res) => {
        if (res.data) {
          if (res.data.patientSex === '1') {
            res.data.patientSex = '男'
          }
          if (res.data.patientSex === '2') {
            res.data.patientSex = '女'
          }
          if (!res.data.patientAge) {
            res.data.patientAge = '--'
          }
          res.data.next = '下一个:'
          this.patientInfo = res.data
          this.frequency = 1
          this.list()
        }
      })
    },
    receiveSocket () {
      wsConnect('/exchange/exchange.thc-queue.business.queue.en_queue/routingKey.thc-queue.business.queue.en_queue', (client, d) => {
        if (client) {
          let queueData = JSON.parse(d.body).body
          if (queueData.resourceId === this.parms.resourceId) {
            this.list()
          }
        }
      })
      this.list()
    },
    async querySearch (queryString, cb) {
      this.parms.searchType = 'quick'
      this.parms.searchTrem = queryString
      let res = await this.api.getQueue(this.parms).catch(() => {
        cb([])
      })
      res.data = res.data.queues || []
      var result = []
      if (res.data.length > 0) {
        for (let i = 0; i < res.data.length; i++) {
          let sex = res.data[i].patientSex === '1' ? '男' : '女'
          res.data[i].age = res.data[i].age || '--'
          if (!res.data[i].patientAge) {
            res.data[i].patientAge = '--'
          }
          result.push({
            value: (i + 1) + ' ' + res.data[i].patientName + ' ' + sex + ' ' + res.data[i].patientAge,
            item: res.data[i]
          })
        }
      }
      cb(result)
    },
    handleSelect (data) {
      this.$emit('rowclick', data.item)
    },
    getPageInfo (val) {
      this.offset = val.offset
      this.list('page')
    }
  },
  components: {
    hoisList
  }
}
</script>
<style lang="scss" scoped>
.hois {
  width: 350px;
  height: 100%;
  position: relative;
}
header {
  overflow: hidden;
  border: 1px solid #cccccc;
  background: #ffffff;
  padding: 10px;
  align-items: center;
  min-height: 50px;
}
.patient_info {
  line-height: 33px;
  display: inline-block;
  flex: 0.7;
  span {
    color: #999999;
  }
}
.patient_info {
  font-family: PingFangSC-Semibold;
  color: #000000;
  font-size: 14px;
  margin: 8px 0 6px;
}
.quick {
  display: block;
  width: 94%;
  margin: 60px auto 30px;
}
section {
  border: 1px solid #cccccc;
  background-color: #ffffff;
  position: absolute;
  top: 50px;
  bottom: 0px;
  width: 99.5%;
}
section /deep/ .el-tabs__nav-wrap::after {
  width: 0 !important;
}
.shout {
  float: right;
  span {
    float: right;
    margin-left: 4px;
    border-radius: 50%;
    width: 15px;
    height: 15px;
    background-color: #ffffff;
    opacity: 0.56;
    color: #000;
    line-height: 13px;
    padding: 0.5px;
    font-size: 12px;
  }
  /deep/ .el-button {
    padding: 7px !important;
  }
  /deep/ .el-dropdown__icon {
    height: 14px;
  }
}
.tabs {
  padding-top: 10px;
}
.tabs {
  position: relative;
}
.search {
  position: relative;
}
.search /deep/ .el-input__inner {
  background-color: #f1f1f1;
}
.activeNumber {
  color: #007aff !important;
}
.rowsum {
  background: #ebebeb;
  border-radius: 2px;
  padding: 0px 3px;
  color: #999999;
  font-size: 12px;
}
.search i {
  position: absolute;
  top: 7px;
  right: 20px;
  font-size: 22px;
}
.tabs /deep/ .el-tabs {
  flex: 0.9;
}
.tabs /deep/ .is-scrollable {
  padding: 0 0;
}
.tabs /deep/ .el-tabs__item {
  padding: 0 10px !important;
  font-size: 12px;
}
.draw-enter, .draw-leave-to /* .fade-leave-active below version 2.1.8 */ {
  max-height: 0;
}
.autocomplete /deep/ .el-autocomplete {
  width: 100% !important;
}
.el-dropdown-menu {
  padding: 1px 0 !important;
}
</style>
