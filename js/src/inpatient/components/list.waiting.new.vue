<template>
  <div class="list_waiting flex_column_1_hidden" id="list_waiting_new">
    <div class="condition" @keyup.enter='search'>
      <el-input class="input" v-model="searchValue" placeholder="请输入姓名或床号" width="180px">
        <i @click="search" slot="suffix" class="el-input__icon iconfont icon-shuxuegongzuotai-cha"></i>
      </el-input>
      <i v-if="space === 'resident'" @click='closefull' style='padding-left:10px;padding-right:5px;padding-top:5px;' class="iconfont icon-zhankai2"></i>
    </div>
    <el-collapse class="collapse flex_column_1_hidden" v-model="activeNames">
      <el-collapse-item :class="{'flex_column_1_hidden': activeNames.includes(indexs)}" v-for="(grandfather, indexs) in tableData" :name="indexs" :key="indexs">
        <template slot="title">
          {{grandfather.title}}
          <span
            class="list_number"
            v-if="grandfather.providerInpatientListNumber>0"
          >{{grandfather.providerInpatientListNumber}}</span>
          <span class="list_number" v-else>{{grandfather.info.length}}</span>
        </template>
        <div
          :class="{'collapse_item': true,'collapse_district': true, 'bq': grandfather.title === '病区患者'&&titleArr.length !== 1, 'drk': grandfather.title === '待入科患者', 'yck': grandfather.title === '已出科患者', 'wd': grandfather.title === '我的患者', 'ks': grandfather.title === '科室患者'}"
        >
          <div v-for="(father, index) in grandfather.info" :key="index">
            <div v-if="grandfather.title === '科室患者'">
              <div>
                <div class="ward_heade" style="cursor:pointer;" @click="isshow(index,indexs)">
                  <span>
                    <span>·····</span>
                    <i
                      :class="{'iconfont':true, 'icon-shang':father.show, 'icon-xia':!father.show}"
                    ></i>
                    {{father.areaName}}
                  </span>
                  <span class="list_number_child">{{father.maps.length}}</span>
                </div>
                <div v-for="(grandson, findex) in father.maps" :key="findex">
                  <ul v-if="father.show" :class="{'el-tree-node__content': true}">
                    <li
                      :class="{'hoverBg':grandson.onlyNumber == hoverIndex, 'clickBg':grandson.patientId + grandson.hospitalizedNumber == clickIndex}"
                      @mouseover="mouse(grandson.onlyNumber, true)"
                      @mouseout="mouse(grandson.onlyNumber)"
                    >
                      <list-waiting-new-child
                        @waitingclick="nameClick"
                        :father="father"
                        :grandfather="grandfather"
                        :grandson="grandson"
                        :hoverIndex="hoverIndex"
                      ></list-waiting-new-child>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-else>
              <ul
                :class="{'el-tree-node__content': grandfather.title === '已出科患者'|| grandfather.title === '我的患者' || father.isChild}"
              >
                <li
                  :draggable="grandfather.title === '待入科患者' && !father.isChild"
                  :class="{'hoverBg':father.onlyNumber==hoverIndex, 'clickBg':father.patientId + father.hospitalizedNumber ==clickIndex, 'isWaiting': grandfather.title === '待入科患者'}"
                  @mouseover="mouse(father.onlyNumber, true)"
                  @mouseout="mouse(father.onlyNumber)"
                  @click='scrollIntoView(father)'
                >
                  <list-waiting-new-child @waitingclick="nameClick" :father="father" :grandfather="grandfather" :hoverIndex="hoverIndex"></list-waiting-new-child>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <contextmenu
      :class-name="className"
      :menu="contextList"
      @menu="getMenuList"
      @select="contextSelect"
    ></contextmenu>
    <discharged ref="discharged" @success="success"></discharged>
    <inhospital :key="inhospitalKey" ref="inhospital"></inhospital>
    <leavedetails ref='leavedetails'></leavedetails>
  </div>
</template>

<script>
import onstorage from '@/inpatient/util/onstorage.js'
import socket from '@/inpatient/util/socket.js'
import api from '../store/hospitalleftlistapi'
import discharged from './dialog/discharged'
import residentapi from '@/inpatient/store/resident.js'
import listWaitingNewChild from '@/inpatient/components/list.waiting.new.child'
import contextmenu from '@/workspace/components/contextmenu'
import inhospital from '@/workspace/page/dialog-inhospital.vue'
import { singlePrint } from '@/inpatient/components/sendarea.print.js'
import leavedetails from '@/inpatient/components/leavedetails.vue'
// 搜索优化、定位、多选
export default {
  mixins: [socket, onstorage],
  props: {
    'titleArr': Array,
    'areaId': String,
    'providerId': String,
    'isCancel': Boolean,
    'isClickClass': {
      type: Boolean,
      default: true
    }
  },
  components: {contextmenu, discharged, listWaitingNewChild, inhospital, leavedetails},
  data () {
    return {
      activeNames: [],
      dragstartArr: [],
      contextList: [],
      contextListGroup: [
        { id: '1', name: '取消出科', disabled: false, methodName: 'cancel' },
        { id: '2', name: '打印腕带', disabled: false, methodName: 'print' },
        { id: '3', name: '停止医嘱', disabled: false, methodName: 'stop' },
        { id: '4', name: '新生儿入院', disabled: false, methodName: 'renascence' }
      ],
      hoverIndex: -1,
      clickIndex: this.$route.query.patientId ? this.$route.query.patientId + this.$route.query.hospitalizedNumber : -1,
      className: 'el-tree-node__content',
      tableData: [],
      clickTimer: null,
      searchValue: '',
      onlyNumber: 0,
      rightClickInfo: {},
      inhospitalKey: 1,
      flag: true,
      space: '',
      storageObj: {
        areaId: '',
        providerId: ''
      },
      waitsetTimeout: false,
      wsUrl: '/exchange/exchange.thc-workbench.business.area_inpatient_list_auto_refresh/routingKey.thc-workbench.business.area_inpatient_list_auto_refresh'
    }
  },
  created () {
    this.space = this.$route.matched[0].meta.space || 'inpatient'
    this.init()
  },
  computed: {
    _areaId () {
      return this.storageObj.areaId || this.areaId
    },
    _providerId () {
      return this.storageObj.providerId || this.providerId
    }
  },
  mounted () {
    this.contextList = [
      this.contextListGroup[0]
    ]
    this.$bus.$on('refresh_waiting_list', this.init)
    this.addstorage('inpatientKey', this.storageCallback)
    this.addstorage('residentKey', this.storageCallback)
  },
  methods: {
    closefull () {
      console.log('full')
      this.$emit('closefull', true)
    },
    storageCallback (key, oldValue, newValue) {
      let value = newValue.split(',')[0]
      if (key === 'inpatientKey') this.storageObj.areaId = value
      if (key === 'residentKey') this.storageObj.providerId = value
      this.$router.push({
        path: this.$route.path
      })
      this.$bus.$emit('storageChange', {key, oldValue, newValue})
      this.init()
    },
    wscallback (data) {
      let bed = false
      let listwaiting = false
      console.log(data) // 先保留，方便测试
      if (data.areaList && this.space === 'inpatient') {
        let inpatientKey = localStorage.getItem('inpatientKey')
        if (inpatientKey) {
          let areaId = inpatientKey.split(',')[0] || null
          if (data.areaList.includes(areaId)) {
            bed = true
            listwaiting = true
          }
        }
      }
      if (data.providerList && this.space === 'resident') {
        let residentKey = localStorage.getItem('residentKey')
        if (residentKey) {
          let providerId = residentKey.split(',')[0] || null
          if (data.providerList.includes(providerId)) {
            listwaiting = true
          }
        }
      }
      if (data.doctorList && this.space === 'resident') {
        let id = this.$store.state.currentUser.userId
        if (data.doctorList.includes(id)) {
          listwaiting = true
        }
      }
      if (listwaiting) this.init(true)
      if (bed) this.$bus.$emit('refresh_bedlist')
    },
    scrollIntoView (father) {
      this.$bus.$emit('boxlistScrollIntoView', father)
    },
    success () {
      this.init()
      this.$bus.$emit('refresh_bedlist')
    },
    search () {
      if (!this.flag) return false
      this.init()
      this.flag = false
    },
    async init (emit = false) {
      if (emit) this.searchValue = ''
      this.tableData = []
      let params = {
        areaId: this._areaId,
        search: this.searchValue
      }
      let paramsproviderId = {
        providerId: this._providerId,
        search: this.searchValue
      }
      if (this.titleArr.length === 2) {
        params.providerId = this._providerId
        await this.getListInfo('我的患者', 'getDoctorInpatientList', params)
        await this.getListInfo('科室患者', 'getProviderInpatientList', paramsproviderId)
        this.activeNames = [0, 1]
        this.flag = true
      } else {
        await this.getListInfo('病区患者', 'getAreaPatientList', params)
        this.activeNames = [0]
        this.flag = true
        if (this.titleArr.length !== 1) {
          await this.getListInfo('待入科患者', 'getWaittingList', params)
          await this.getListInfo('已出科患者', 'getAreaOutPatientList', params)
          this.activeNames = [0, 1, 2]
        }
      }
      let arr = []
      this.tableData.forEach(ele => {
        if (ele.info && ele.info[0] && ele.info[0].maps) {
          ele.info.forEach(element => {
            arr = arr.concat(element.maps)
          })
        } else {
          arr = arr.concat(ele.info)
        }
      })
      if (emit) this.$bus.$emit('hospital_patient_list_mq_refresh', arr)
    },
    async getListInfo (title, distribute, params) {
      let providerInpatientListNumber = 0
      let res = {}
      res = await api.getListInfo(distribute, params)
      if (res.head.errCode === 0) {
        if (title === '科室患者') {
          res.data.forEach(el => {
            el.show = true
          })
        }
        if (title === '病区患者') this.$bus.$emit('get_bq_list', res.data)
        let arr = []
        if (title === '科室患者') {
          let msg = ''
          for (let i in res.data) {
            res.data[i].maps = []
            for (let j in res.data[i].inPatientMsgs) {
              ++this.onlyNumber
              msg = res.data[i].inPatientMsgs[j]
              msg.onlyNumber = this.onlyNumber
              msg.title = '科室患者'
              ++providerInpatientListNumber
              res.data[i].maps.push(msg)
              if (msg.neonateList && msg.neonateList.length > 0) {
                msg.position = 'first'
                for (let k in msg.neonateList) {
                  let y = msg.neonateList[k]
                  if (k === (msg.neonateList.length - 1).toString()) {
                    this.copyMom('last', y, msg)
                  } else {
                    this.copyMom('middle', y, msg)
                  }
                  y.isChild = true
                  ++this.onlyNumber
                  y.onlyNumber = this.onlyNumber
                  y.title = '科室患者'
                  ++providerInpatientListNumber
                  res.data[i].maps.push(y)
                }
              }
            }
          }
        } else {
          res.data.forEach((vl, index) => {
            ++this.onlyNumber
            vl.onlyNumber = this.onlyNumber
            if (title === '已出科患者') vl.isCk = true
            arr.push(vl)
            if (vl.neonateList && vl.neonateList.length > 0) {
              vl.position = 'first'
              vl.neonateList.forEach((el, index) => {
                if (index === (vl.neonateList.length - 1)) {
                  this.copyMom('last', el, vl)
                } else {
                  this.copyMom('middle', el, vl)
                }
                el.isChild = true
                ++this.onlyNumber
                el.onlyNumber = this.onlyNumber
                if (title === '已出科患者') el.isCk = true
                arr.push(el)
              })
            }
            if (title === '待入科患者') {
              vl.ageShowText = vl.patientDto && vl.patientDto.ageShowText || '--'
            }
          })
          if (res.data.length !== arr.length) {
            res.data = arr
          }
        }
        this.tableData = this.tableData.filter(ele => {
          return ele.title !== title
        })
        this.tableData.push({
          title: title,
          providerInpatientListNumber: providerInpatientListNumber,
          info: res.data
        })
        if (title === '待入科患者') {
          if (this.waitsetTimeout)clearTimeout(this.waitsetTimeout)
          this.waitsetTimeout = setTimeout(() => {
            let domArr = document.getElementById('list_waiting_new').getElementsByClassName('isWaiting')
            for (let i = 0; i < domArr.length; i++) {
              this.dragstartArr[i] = (ev) => {
                ev.dataTransfer.setData('text/plain', JSON.stringify(res.data[i]))
              }
              domArr[i].addEventListener('dragstart', this.dragstartArr[i], false)
            }
          }, 300)
        }
      }
    },
    copyMom (name, el, vl) {
      el.position = name
      el.providerId = vl.providerId
      el.providerName = vl.providerName
      el.hospitalizedNumber = vl.hospitalizedNumber
      el.bedId = vl.bedId
      el.bedName = vl.bedName
      el.status = vl.status
      el.areaId = vl.areaId
      el.chargeDoctorId = vl.chargeDoctorId
      el.hospitalizedAreaId = vl.hospitalizedAreaId
      el.motherPatientId = vl.patientId
    },
    clearTm () {
      if (this.clickTimer) {
        window.clearTimeout(this.clickTimer)
        this.clickTimer = null
      }
    },
    nameClick (info) {
      // this.click(info.index, info.name, info.value)
      this.clickfun(info.value.patientId + info.value.hospitalizedNumber, info.name, info.value, false)
    },
    click (index, name, value) {
      this.clearTm()
      let self = this
      this.clickTimer = window.setTimeout(function () {
        self.clickfun(value.patientId + value.hospitalizedNumber, name, value, true)
      }, 500)
    },
    dbclick (index, name, value) {
      this.clearTm()
      this.clickfun(value.patientId + value.hospitalizedNumber, name, value, false)
    },
    clickfun (index, name, value, flag) {
      if ((this.clickIndex === index) && this.isCancel) {
        if (this.isClickClass) {
          this.clickIndex = -1
        }
        this.$emit('waitingdbclick', null)
      } else {
        if (this.isClickClass) {
          this.clickIndex = index
        }
        if (name === '待入科患者' && value.source !== 4) return false
        if (!flag) this.$emit('waitingdbclick', value)
        if (flag) this.$emit('waitingclick', value)
      }
    },
    mouse (index, flag) {
      this.hoverIndex = flag ? index : -1
    },
    async list () {
    },
    isshow (index, indexs) {
      this.tableData[indexs].info[index].show = !this.tableData[indexs].info[index].show
    },
    async getMenuList (index) {
      let arr = []
      this.tableData.forEach(el => {
        if (el.info.length === 0) return false
        el.info.forEach(vl => {
          if ((!vl.isChild && el.title === '病区患者') || (!vl.isChild && el.title === '待入科患者')) return false
          if (vl.isChild || el.title !== '待入科患者') {
            if (el.title === '病区患者') vl.title = '病区患者'
            if (el.title === '我的患者') vl.title = '我的患者'
            if (el.title === '科室患者') vl.title = '科室患者'
            if (el.title === '科室患者') {
              arr.push(...vl.maps)
            } else {
              arr.push(vl)
            }
          }
        })
      })
      if (arr[index].isChild && arr[index].title !== '我的患者' && arr[index].title !== '科室患者') {
        this.contextList = [
          this.contextListGroup[1]
        ]
      } else if (arr[index].title === '我的患者' || arr[index].title === '科室患者') {
        this.contextListGroup[3].disabled = !arr[index].isChild
        this.contextList = [
          this.contextListGroup[3]
        ]
      } else {
        this.contextList = []
        let res = await residentapi.getApplyByHospitalizedNumberList({
          hospitalizedNumber: arr[index].hospitalizedNumber
        })
        let list = [ { id: '10', name: '出院登记', disabled: true, methodName: 'leavedetail' } ]

        if (res && res.data && [7, 8].indexOf(res.data.status) > -1) {
          list[0].disabled = false
        }
        this.contextList = [
          ...list,
          this.contextListGroup[0]
        ]
      }
      if (arr[index].status === 3 && arr[index].isChild) this.contextListGroup[3].disabled = true
      this.rightClickInfo = arr[index]
    },
    contextSelect (object) {
      if (object.methodName === 'leavedetail') {
        this.$refs.leavedetails.open(JSON.parse(JSON.stringify(this.rightClickInfo)))
      }
      if (object.methodName === 'cancel') {
        this.$refs.discharged.open(this.rightClickInfo, object.methodName)
      } else if (object.methodName === 'stop') {
        this.warning()
        this.$emit('stopadvice', this.rightClickInfo)
      } else if (object.methodName === 'renascence') { // 新生儿入院
        this.warning()
        let obj = JSON.parse(JSON.stringify(this.rightClickInfo))
        obj.id = null
        this.inhospitalKey++
        this.$nextTick(_ => {
          this.$refs.inhospital.opens(obj, '1')
        })
      } else if (object.methodName === 'print') { // 腕带打印
        this.warning()
        singlePrint('ZY_CPOE_XIN_SHENG_ER_WAN_DAI', {
          patientId: this.rightClickInfo.patientId,
          visitType: 2,
          hospitalizedNumber: this.rightClickInfo.hospitalizedNumber
        })
      }
    },
    warning () {
      if (!this.rightClickInfo.bedStatus && this.rightClickInfo.isChild) {
        this.$notify({
          title: '警告',
          message: '当前患者状态已发生变化，请刷新后重试！',
          type: 'error'
        })
        return false
      }
    },
    // 根据路由判断选择的元素
    bgClickClassByRouter () {
      this.clickIndex = this.$route.query.patientId + this.$route.query.hospitalizedNumber || -1
    }
  },
  watch: {
    'searchValue': function (val) {
      if (!val) {
        this.init()
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.list_waiting {
  width: 220px;
  box-shadow: 10px 0px 10px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  height: 100%;
  background-color: #fff;
  z-index: 100;
  transition: all ease-out 0.4s;
  .condition {
    text-align: center;
    position: relative;
    padding: 10px 0;
    .input {
      width: 180px !important;
      font-size: 12px;
      /deep/ .el-input__icon{
        padding: 8px;
      }
    }
  }
  .collapse {
    /deep/ .el-collapse-item__wrap{
      flex: 1;
      overflow: auto;
    }
    /deep/ .el-collapse-item__header {
      padding-left: 10px;
      background-color: #f1f2f3;
      height: 28px;
      font-size: 12px;
      color: #666666;
      font-weight: 400;
    }
    .collapse_district {
      font-size: 12px;
      .hoverBg {
        background: #edf2f9;
      }
      .clickBg {
        background: #d7ebff;
      }
      i {
        font-size: 12px;
      }
      .ward_heade {
        span {
          color: #556b85;
        }
      }
    }
    .list_number,
    .list_number_child {
      padding: 4px 3px;
      margin-left: 5px;
      line-height: 10px;
      background-color: #dbdcdc;
      color: #007aff;
      font-weight: 500;
      border-radius: 2px;
    }
    .list_number_child {
      padding: 0px 3px;
    }
    ul {
      padding-left: 0px;
      margin: 0 auto;
      li {
        width: 100%;
        overflow: hidden;
        p {
          margin: 5px auto;
          float: left;
          .girl {
            color: #ffa1b2;
          }
          .boy {
            color: #5dccff;
          }
        }
      }
    }
  }
}
</style>
