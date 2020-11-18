<template>
  <div id="patient_list" :style='{width:w}'>
    <hois
      :tenantDeptId='tenantDeptId'
      resourceType='register'
      :resourceId='$store.state.currentUser.userId'
      :key='tenantDeptId + $store.state.currentUser.userId'
      @rowclick='todayClick'
      ></hois>
  </div>
</template>
<script>
  import api from '../../store/mainheaderapi'
  import hois from '@/arrange/page/reservation/hois.vue'
  import {domClickHandle} from '@/util/common'
  import storage from '@/util/storage.js'
  import i18n from '@/assets/locals/index'
  export default {
    components: {hois},
    props: ['w', 'space'],
    data () {
      return {
        tipsOpen: false,
        count1: 0,
        count2: 0,
        count3: 0,
        callNum: 3,
        disabled: false,
        visible: false,
        emitW: 0,
        input: '',
        active: '1',
        tips: '',
        data: [],
        lists: [],
        currentPage: 1,
        historyTotalCount: 0,
        hisList: [],
        name: 0,
        patientObj: {},
        tenantDeptId: '',
        sesstionKey: ''
      }
    },
    filters: {
      subsequentVisitStatus (state) {
        let str = '--'
        switch (String(state)) {
          case '-1':
            str = i18n.t('未知')
            break
          case '0':
            str = i18n.t('初')
            break
          case '1':
            str = i18n.t('复')
            break
          case '2':
            str = i18n.t('转')
            break
          case '3':
            str = i18n.t('急')
            break
          case '4':
            str = i18n.t('体')
            break
          case '5':
            str = i18n.t('简')
            break
          case '6':
            str = i18n.t('疫')
            break
          case '7':
            str = i18n.t('团')
            break
        }
        return str
      },
      status (s) {
        let str = ''
        switch (s) {
          case 0:
            str = i18n.t('待确认')
            break
          case 1:
            str = i18n.t('已确认')
            break
          case 2:
            str = i18n.t('已到诊')
            break
          case 3:
            str = i18n.t('已接诊')
            break
          case 9:
            str = i18n.t('已结诊')
            break
          case -1:
            str = i18n.t('已取消')
            break
          case -2:
            str = i18n.t('迟到')
            break
          case -3:
            str = i18n.t('爽约')
            break
          case -4:
            str = i18n.t('待支付')
            break
          case -5:
            str = i18n.t('等待预约')
            break
          default:
            str = ''
        }
        return str
        // public static final Integer APPOINT_STATUS_APPOINTED = 0; //预约成功-待确认
        // public static final Integer APPOINT_STATUS_CONFIRMED = 1; //预约成功-已确认
        // public static final Integer APPOINT_STATUS_TREATMENT = 2; //已就诊(已到诊)
        // public static final Integer APPOINT_STATTUS_RECEIVE = 3;//已接诊
        // public static final Integer APPOINT_STATTUS_FINISH = 9;//已结诊
        // public static final Integer APPOINT_STATUS_CANCELED = -1; //已取消
        // public static final Integer APPOINT_STATUS_LATE = -2; //迟到
        // public static final Integer APPOINT_STATUS_MISS = -3; //爽约
        // public static final Integer APPOINT_STATUS_WAIT_PAY = -4; //待支付，未成功
        // public static final Integer APPOINT_STATUS_WAIT_APPOINT = -5; //等待预约（添加预约等待状态）
      }
    },
    methods: {
      opentips (val) {
        this.active = '1'
        this.$refs.todayPatient.opentips(val)
      },
      handClick () {
        this.currentPage = 1
        if (this.active === '1') {
          // this.$refs.todayPatient.init()
        } else {
          this.getHistoryList()
        }
      },
      setSessionStorage (query) {
        this.$router.push({
          path: '/workspace/outpatient',
          query: query
        })
        query.time = this.$moment().format('YYYY-MM-DD')
        storage.setSessionStorage('outpatientUrlParams', JSON.stringify(query))
      },
      async jz (visitNumber, visitName, callback) {
        if (visitNumber) {
          let res = await api.deletqueueContentById({
            source: 1,
            visitNumber
          })
          if (res.head && res.head.errCode === 0) {
            this.$notify({
              title: this.$t('接诊成功'),
              type: 'success',
              message: this.$t(`当前接诊患者：${visitName}`)
            })
            if (callback)callback()
            setTimeout(_ => {
              this.$refs.todayPatient.init()
            }, 500)
            this.$bus.$emit('workspace:checkIsEncounterByVisitNumber')
          }
        }
      },
      todayClick (obj) {
        // 没有doctorId的默认给当前医生id
        obj.doctorId = obj.triagedDoctorId || obj.doctorId || this.$store.state.currentUser.userId
        let query = {
          patientId: obj.patientId,
          patientName: obj.patientName,
          visitSn: obj.visitNumber,
          triageId: obj.triageId,
          appointmentId: obj.appointmentId,
          doctorId: obj.doctorId,
          timeStamp: this.$moment().valueOf(), // 区分点患者不刷新
          taskId: obj.taskId,
          subsequentVisit: obj.subsequentVisit, // 区分是体检还是普通看诊
          // examType: 2, // 区分总检还是分检    参数是体检的等着重构搞吧
          // orderId: obj.orderId,
          // orderItemId: obj.orderItemId,
          tabIndex: obj.tabIndex // 区分数据从哪个队列来，现在值是1用来取消接诊
        }
        let str = storage.getLocalStorage(this.sesstionKey)
        let arr = str.split(',')
        query.dptId = arr[0]
        query.dptName = arr[1]
        let status = ''
        if (obj.doctorId !== this.$store.state.currentUser.userId) {
          status += 'others '
        } else if (obj.doctorId === 'history' || obj.history) {
          status += 'history '
        }
        // let role = JSON.parse(this.$store.state.currentUser.roles)
        // role.forEach(element => { // 医疗部助理coderole写死928549446952681472
        //   if (element.roleCode + '' === '928549446952681472') {
        //     status += 'ma'
        //   }
        // })
        query.status = status.trim().split(' ').join(',')
        this.setSessionStorage(query)
      },
      async dz (obj) {
        // this.hidden()
        if (!obj.patientId) return
        let query = {
          patientId: obj.patientId,
          patientName: obj.patientName || obj.name,
          orderId: obj.orderId,
          orderItemId: obj.orderItemId,
          phrAccountId: obj.patientId,
          visitSn: obj.visitNumber,
          dptId: obj.deptId,
          dptName: obj.deptName,
          taskId: obj.objId,
          providerId: obj.providerId,
          subsequentVisit: obj.subsequentVisit,
          doctorId: obj.doctorId,
          examType: 2,
          timeStamp: this.$moment().valueOf()
        }
        if (query.doctorId === '_history') {
          query.doctorId = this.$store.state.currentUser.userId
        }
        let role = this.$store.state.currentUser.roles
        if (obj.doctorId && obj.doctorId !== this.$store.state.currentUser.userId || obj.doctorId === '_history') {
          query.status = 'disabled'
          // role.forEach(element => { // 医疗部助理coderole写死928549446952681472
          //   if (element.roleCode + '' === '928549446952681472') {
          //     delete query.disabled
          //   }
          // })
        }
        role.forEach(element => { // 医疗部助理coderole写死928549446952681472
          if (element.roleCode + '' === '928549446952681472') {
            query.role = 'ma'
          }
        })
        if (obj.fromQuick) {
          query.fromQuick = true
        }
        this.setSessionStorage(query)
        // if (obj.contentId) {
        //   let res = await api.deletqueueContentById({
        //     contentId: obj.contentId
        //   })
        //   if (res) {
        //     // 和左侧列表共用跳转方法
        //     this.setSessionStorage(query)
        //     this.visible = false
        //   }
        // } else {
        //   this.setSessionStorage(query)
        // }
      },
      async rowClick (row) {
        row.patient = row.patient || {} // 特殊情况下这两个可能为空
        row.yuyue = row.yuyue || {}
        this.dz({
          patientId: row.patient.id,
          name: row.patient.name,
          orderId: row.yuyue.orderid,
          orderItemId: row.yuyue.orderItemId,
          visitNumber: row.visitNumber,
          objId: row.taskId, // 历史患者列表里面缺失taskId，如果需要去找吴琼，2018-10-30
          deptId: row.providerId,
          deptName: row.providerName,
          subsequentVisit: row.yuyue.subsequentVisit,
          doctorId: '_history'
        })
      },
      current_change (page) {
        this.currentPage = page
        if (this.active === '1') {
        } else {
          this.getHistoryList()
        }
      },
      async getHistoryList () {
        // this.data = this.data || []
        // let result = await api.getMyHistoryPatientList({
        //   startTime: this.data[0], // String 否 开始日期（yyyy-MM-dd）
        //   endTime: this.data[1], // String 否 结束日期（yyyy-MM-dd）
        //   patientMsg: this.input, // String 否 患者信息
        //   pagesize: 1000, // int 否 分页显示的条数
        //   offset: 0 // int 否 页码（从0开始）
        // })
        // .catch(() => {})
        // if (result && result.data) {
        //   this.hisList = result.data
        //   this.historyTotalCount = result.totalCount
        // } else {
        //   this.hisList = []
        //   this.historyTotalCount = 0
        // }
      },
      hidden () {
        this.active = '1'
      },
      changeTips () {
        this.active = '1'
      }
    },
    mounted () {
      this.sesstionKey = `${this.space}Key`
      this.data.push(this.$moment(this.$moment().valueOf() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD'))
      this.data.push(this.$moment(this.$moment().valueOf() - 24 * 60 * 60 * 1000).format('YYYY-MM-DD'))
      domClickHandle('patient_list', _ => {
        this.hidden()
      })
      // this.$bus.$off('visiting_the_clinic')
      // this.$bus.$on('visiting_the_workspace', this.jz)
      this.$bus.$off('todayClick', this.todayClick)
      this.$bus.$on('todayClick', this.todayClick)
      if (!this.$route.query.patientId && storage.getSessionStorage('outpatientUrlParams')) {
        let query = JSON.parse(storage.getSessionStorage('outpatientUrlParams'))
        if (query.time === this.$moment().format('YYYY-MM-DD')) {
          delete query.time
          this.$router.push({
            path: '/workspace/outpatient',
            query: query
          })
        }
      }
      if (storage.getLocalStorage(this.sesstionKey)) {
        let str = storage.getLocalStorage(this.sesstionKey)
        let arr = str.split(',')
        this.tenantDeptId = arr[0]
      }
    },
    watch: {
      // 'data': {
      //   handler (val) {
      //     this.getHistoryList()
      //   },
      //   immediate: true
      // },
      // 'input': {
      //   handler (val) {
      //     this.getHistoryList()
      //   },
      //   immediate: true
      // }
    }
  }
</script>
<style lang='scss'>
  #patient_list{
    height:100%;
    background: #fff;
    .el-tabs{
      display: flex;
      flex-direction: column;
      .el-tabs__content{
        flex: 1;
      }
    }
    .el-tabs, .el-tab-pane {
      height: 100%;
    }
    .el-tabs__header {
      margin: 0 0 0px;
    }
    .historypatient{
      height: 100%;
      display: flex;
      flex-direction:column;
      .top{
        margin-top: 5px;
        padding:0 10px;
        margin-top: 10px;
        .input{
          width: 100%;
          float: left;
          margin-right: 10px;
        }
        .inputs{
          width: 100%;
        }
      }
      .historytable{
         flex: 1;
         height: 100%;
      }
    }
    // .el-table__body tr:hover > td {
    //   background-color: #1c7bef;
    //   color: #fff;
    // }

    // #lishihuanzhe{
      thead{
        th{
          background: #eee;
          color: #000;
        }
      }
      .pagination{
        text-align:right;
        position: absolute;
        bottom: 15px;
        right: 10px;
      }

    // }
    .el-table__body-wrapper {
      overflow-y: auto;
      &::-webkit-scrollbar {
        z-index: 11;
        width: 0px;
      }
      &::-webkit-scrollbar:horizontal {
        height: 6px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        width: 6px;
        background: #b4bccc;
      }
      &::-webkit-scrollbar-corner {
          background: #fff;
      }
      &::-webkit-scrollbar-track {
        background: #fff;
      }
      &::-webkit-scrollbar-track-piece {
        background: #fff;
        width: 6px;
      }
    }
    // .el-input{
    //   font-size: 12px;
    // }
    .input{
      width: 345px;
      display: block;
      margin:0 auto 10px;
    }
    .el-tabs__nav-prev,.el-tabs__nav-next{
      display:none;
    }

    .el-table::before{
      height: 0px;
    }
    .blue{
      color: #5CBC2C;
    }
    .tips_hou{
      background: #1c7bef;
    }
    .tips_hiu{
      background: #86cb3b;
    }
    .tips_kz{
        background: #1c7bef;
      }
    .tips_hz{
      background: #86cb3b;
    }
    .tips_tj{
      background: #F5A623;
    }
    .el-table{
      border:none;
      font-size:14px;
      .cell, th > div, th div{
        padding-right:0;
        padding-left:10px;
      }
      .scale{
        display: inline-block;
        font-size: 12px;
        transform: scaleX(.6) scaleY(.6);
      }
    }
  }
#patient_list .right_tips .tips_kz.call{
  height:50px;
  width:30px;
  padding: 2px 0;
  border:0px;
  border-radius: 0px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
#patient_list .right_tips .tips_kz.call span{
  line-height:10px;
  margin-top:2px;
  display: block;
  font-size:12px;
}
#patient_list .cBlue{
  background: #1c7bef;
  color:#ffffff;
}
#patient_list .cGray{
  background: #dddddd;
  color:#ffffff;
}
</style>
