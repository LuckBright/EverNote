<template>
  <div class="advice_execute">
    <div class="layout_inner">
      <el-row class="main-head">
        <el-col :span="18">
          <ever-form2 :schema="querySchema" v-model="queryObj" :inline="true" :is-query="true" @query="queryListbefore">
            <template slot="termTypes">
              <el-radio-group v-model="queryObj.termTypes">
                <el-radio :label="1">长嘱</el-radio>
                <el-radio :label="0">临嘱</el-radio>
                <el-radio :label="-1">全部</el-radio>
              </el-radio-group>
            </template>
            <template slot="default">
              <el-button type="primary" @click="search" class="search-btn" size="small">查询</el-button>
            </template>
          </ever-form2>
        </el-col>
        <el-col :span="6" class="alg_r">
          <!-- <el-button size="small" @click="printEvent(false)" :disabled="!selectData.length">打印执行单</el-button> -->
          <el-button type="primary" size="small" @click="selectExecute(false)" :disabled="isComfirm || !selectData.length">批量执行</el-button>
        </el-col>
      </el-row>
      <div class="main-wrap">
        <advice-show-table
          ref="adviceShow"
          :visitType="3"
          :showData="allData"
          :rowClass="rowClass"
          :columns="columns"
          :configOption="configOption"
          :contextList="contextList"
          :arraySpan="arraySpan"
          :noBorderSpan="noBorderSpan"
          :showCheckbox="true"
          setMainGroupId="mainGroupIdFlag"
          :key="key"
          @menu="getMenuList"
          @contextSelect="contextSelect"
          @selectionChange="selectionChange"
        >
          <template slot="executeStatus"  slot-scope='scope'>
            <span>{{executeStatusList.find(val => { return String(scope.row.executeStatus) === val.id }) && executeStatusList.find(val => { return String(scope.row.executeStatus) === val.id }).name || String(scope.row.executeStatus) || '--'}}</span>
            <el-tooltip  placement="right" effect="light" v-if="['10', '55'].includes(String(scope.row.executeStatus)) || scope.row.exmploy === '7'">
              <span slot="content" v-if="scope.row.records">
                <span v-if="scope.row.records[0].status === 4 && scope.row.records[0].result">皮试结果：{{scope.row.records[0].result}}</span>
                <span v-if="scope.row.records[0].status === 3 && scope.row.records[0].reason">无法执行原因：
                  <sys-value type="THC_CPOE_HOSP_NURES_NOT_EXCUTE_REASON" :code="scope.row.records[0].reason"></sys-value>
                </span>
                <span v-if="scope.row.records[0].remark">
                  <br v-if="scope.row.records[0].status != 2"/>
                  {{scope.row.records[0].status === 2 ? '取消执行原因：' : '备注：'}}
                  {{scope.row.records[0].remark}}
                </span>
              </span>
              <svg class="icon" aria-hidden="true" v-if="scope.row.records && scope.row.records[0].status && scope.row.records[0].status !== 1" style="font-size: 16px;">>
                <use xlink:href="#icon-beibohui1"></use>
              </svg>
              <svg class="icon" aria-hidden="true" v-if="scope.row.records && scope.row.employ === '7' && scope.row.records[0].status === 1" style="font-size: 16px;">
                <use xlink:href="#icon-pishi"></use>
              </svg>
            </el-tooltip>
          </template>
          <template slot="completeTimes"  slot-scope='scope'>
       			<template>
              <el-date-picker
                v-model="scope.row.completeTimes"
                format="MM/dd HH:mm"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                :clearable="false"
                @change="updateExecute(scope.row, 'completeTimes')"
              ></el-date-picker>
            </template>
          </template>
          <template slot="executeBy"  slot-scope='scope'>
            <template>
              <el-select
                v-model="scope.row.executeBy"
                style="width: 100%"
                placeholder="请选择执行人"
                @change="updateExecute(scope.row, 'executeBy')">
                <el-option v-for="item in nursersData" :key="item.id" :value="item.id" :label="item.name">{{item.name}}</el-option>
              </el-select>
            </template>
          </template>
        </advice-show-table>
      </div>
      <el-row type="flex" justify="end">
        <ever-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :totalCount="totalCount"
          :current="current"
        ></ever-pagination>
      </el-row>
      <dialog-com class="specDialog" v-model="handleVisible" :title="dialogTitle" @save="confirmEvent" @input="celExecuteAdvice" :hospitalizedNumber="curObj.hospitalizedNumber" :patientId="curObj.patientId">
        <ever-form2
          ref="handleform"
          :schema="handleSchema"
          v-model="handleObj"
          labelWidth="80px"
          label-position="right"
          :rules="handleRules"
          :nosubmit="true"
          :showMessage="true"
        >
          <template slot="serviceNameList">
            <div class="wrap">
              <p v-for="(item, index) in handleObj.serviceNameList" :key="item.id" class="serviceName">
                <span class="leftIcon" v-if="handleObj.serviceNameList.length > 1">
                  <span class="top" v-if="!index"></span>
                  <span class="middle" v-else-if="index < handleObj.serviceNameList.length - 1"></span>
                  <span class="bottom" v-else></span>
                </span>
                {{item.serviceName}}
              </p>
            </div>
          </template>
        </ever-form2>
      </dialog-com>
      <el-dialog
        title="执行提示"
        width="500px"
        :visible.sync="tipsVisible"
        :close-on-click-modal="false"
        class="ui_dialog_02 tips_dialog">
        <p><i class="iconfont icon-tixing1"></i><span>以下医嘱所需的物资未出库，是否继续执行？</span></p>
        <ul>
          <li v-for="item in noSendData" :key="item.id">{{item.doctorAdviceName}}</li>
        </ul>
        <div slot="footer" class="dialog-footer">
          <el-button  @click="tipsVisible=false">取消</el-button>
          <el-button type="primary" @click="continueExecute">确认</el-button>
        </div>
      </el-dialog>
      <!-- 患者列表监听 -->
      <inpatient-refresh
        ref="inpatientRefresh"
        :query="this.$route.query"
        :checks="['bedId', 'areaId', 'providerId']"
        @refresh="refresh"
      ></inpatient-refresh>
    </div>
  </div>
</template>
<script>
import storage from '@/util/storage'
import api from '@/inpatient/store/advice/execute'
import staffapi from '@/inpatient/store/resident.js'
import sysvalue from '@/warehouse/store/sysvalueapi'
import executeConfig from './execute.config.js'
import adviceShowTable from '@/inpatient/components/medical.orders/advice.show.table'
import dialogCom from '@/inpatient/components/dialog/dialog.vue'
import { mutiplePrint } from '@/inpatient/components/sendarea.print.js'
import { objSortBy } from '@/util/common'
import inpatientRefresh from '@/inpatient/components/inpatient.refresh.vue'

export default {
  mixins: [executeConfig],
  props: {
    baseInfo: {
      type: Object,
      default: () => { return {} }
    },
    hospitalizedNumberList: {
      type: Array,
      default: () => { return [] }
    },
    clearInfo: Function
  },
  data () {
    return {
      api,
      sysvalue,
      tableData: [],
      selectData: [],
      selectIds: [],
      applyList: [],
      nursersData: [],
      dialogTitle: '',
      handleSchema: [],
      handleObj: {},
      handleRules: {},
      curMethod: {},
      curObj: {},
      pishiData: [],
      pishiResult: {},
      noSendData: [],
      handleVisible: false,
      isComfirm: false,
      tipsVisible: false,
      key: 0,
      contextList: [
        { id: '1', name: '执行', disabled: false, methodName: 'executeAdvice', confirmMethod: 'conExecuteAdvice' },
        { id: '2', name: '取消执行', disabled: false, methodName: 'cancelExecute', confirmMethod: 'conCancelExecute' },
        { id: '3', name: '无法执行', disabled: false, methodName: 'noExecute', confirmMethod: 'conNoExecute' }
      ],
      totalCount: 0,
      pageSizes: [10, 20, 30, 50, 100],
      pagesize: 20,
      current: 1,
    }
  },
  components: {
    adviceShowTable,   // 医嘱显示组件
    dialogCom,         // dialog弹窗组件
    inpatientRefresh // 患者列表监听
  },
  created () {
  },
  mounted () {
    this.getOptions()
    this.getNursers()
  },
  methods: {
    queryListbefore () {
      this.reset()
      this.queryList()
    },
    reset () {
      this.current = 1
    },
    handleCurrentChange (val) {
      this.current = val
      this.queryList()
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.queryList()
    },
    // 获取医嘱类型options
    getOptions () {
      let serviceTypeList = []
      // 过滤值集中三级分类
      this.sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(options => {
        options = objSortBy(options, 'orderNumber').reverse()
        options.forEach(item => {
          if (['798', '294', '296'].includes(item.parentId)) {
            serviceTypeList.push(item)
          }
        })
      })
      this.$ever.getFieldFromSchema(this.querySchema, 'serviceTypes').props.options = serviceTypeList
      this.$ever.getFieldFromSchema(this.querySchema, 'executeStatusList').props.options = this.executeStatusList
    },
    // 获取护士人员列表
    async getNursers () {
      let res = await staffapi.getStaffListByCondition({
        // typeCodeList: ['NURSE'],  // 值集：thc_wh_person_category
        sickAreaIdList: [storage.getLocalStorage('inpatientKey').split(',')[0]]
      })
      if (res && res.data && res.data.resultList && res.data.resultList.length) {
        this.nursersData = res.data.resultList
      } else {
        this.nursersData = []
      }
    },
    // 查询列表
    queryList () {
      let queryObj = JSON.parse(JSON.stringify(this.queryObj))
      if (queryObj.termTypes > -1) {
        queryObj.termType = String(queryObj.termTypes)
      } else if (queryObj.termType) {
        delete queryObj.termType
      }
      queryObj.hospitalizedNumber = this.baseInfo.hospitalizedNumber
      queryObj.patientId = this.baseInfo.patientId
      queryObj.patientName = this.baseInfo.patientName
      queryObj.page = this.current
      queryObj.pagesize = this.pagesize
      queryObj.offset = (this.current - 1) * this.pagesize
      if (!queryObj.hospitalizedNumber) {
        queryObj.hospitalizedNumberList = this.hospitalizedNumberList
      } else if (queryObj.hospitalizedNumberList) {
        delete queryObj.hospitalizedNumberList
      }
      if (queryObj.hospitalizedNumber || queryObj.hospitalizedNumberList.length) {
        this.queryEvent(queryObj)
      }
    },
    async queryEvent (queryObj) {
      let res = await api.list(queryObj)
      if (res && res.list && res.list.length) {
        this.tableData = res.list
        this.totalCount = res.totalCount
      } else {
        this.tableData = []
        this.totalCount = 0
      }
    },
    // 更新执行时间/执行人
    async updateExecute (val, str) {
      if (val.id) {
        let postdata = {
          ids: []
        }
        this.fuziData[val.mainGroupIdFlag].forEach(v => {
          postdata.ids.push(v.id)
        })
        if (str === 'completeTimes') {
          postdata.completeTime = val.completeTimes
        }
        if (str === 'executeBy') {
          postdata.executeBy = val.executeBy
          postdata.executeName = this.nursersData.find(value => { return value.id === val.executeBy }).name
        }
        const res = await api.updateOutpatientExecuteBatch(postdata)
        if (res && res.head && res.head.errCode === 0) {
          this.$messageTips(this, 'success', '修改成功', '提示')
          this.queryList()
        }
      }
    },
    // table checkbox 回调事件
    selectionChange (val) {
      this.selectIds = []
      this.selectData = val
      if (val && val.length) {
        val.map(item => {
          this.selectIds.push(item.id)
        })
      }
    },
    // 右键操作按钮列表触发事件回调
    getMenuList ({index}) {
      this.contextList.forEach((v) => {
        v.disabled = !this.getStatusShow(this.fuziData[this.allData[index].mainGroupIdFlag], index, v.id)
      })
    },
    // 操作按钮显示判断逻辑
    getStatusShow (data, index, id) {
      if (id === '1') {
        // 未执行的 待停止，可执行
        let n1 = 0
        data.forEach(v => {
          if (['10', '51'].includes(String(v.status))) n1++
        })
        return data.length === n1
      } else if (id === '2') {
        // 已完成的，可取消执行
        let n2 = 0
        data.forEach(v => {
          if (['30'].includes(String(v.status))) n2++
        })
        return data.length === n2
      } else if (id === '3') {
        // 未执行的 待停止，可无法执行
        let n3 = 0
        data.forEach(v => {
          if (['10', '51'].includes(String(v.status))) n3++
        })
        return data.length === n3
      }
    },
    // 右键操作按钮列表点击回调
    contextSelect ({ item, index }) {
      this.curMethod = item
      this.curObj = this.allData[index]
      this[item.methodName](this.allData[index], index)
    },
    // 右键执行
    executeAdvice (item, index) {
      // 用法是皮试，调用执行记录弹窗，填写皮试结果等再确认保存；用法不是皮试，直接调用接口
      if (item.employ === '7') {
        this.isComfirm = true
        this.pishiData = this.fuziData[item.mainGroupIdFlag]
      } else {
        let postdata = {
          ids: [],
          drugSendFlag: 1
        }
        this.fuziData[item.mainGroupIdFlag].forEach(v => {
          postdata.ids.push(v.id)
        })
        this.confirmExecute(postdata)
      }
    },
    // 取消执行
    cancelExecute (item, index) {
      this.handleSchema = this.cancelExecuteSchema
      this.handleObj = this.cancelExecuteObj
      this.handleRules = this.cancelExecuteRules
      this.isComfirm = true
      this.handleVisible = true
      this.dialogTitle = '取消执行'
    },
    // 无法执行
    noExecute (item, index) {
      this.handleSchema = this.noExecuteSchema
      this.handleObj = this.noExecuteObj
      this.handleRules = this.noExecuteRules
      this.isComfirm = true
      this.handleVisible = true
      this.dialogTitle = '无法执行'
    },
    // dialog 确认回调
    confirmEvent () {
      this.$refs.handleform.$refs.form.validate(valid => {
        if (valid) {
          this[this.curMethod.confirmMethod]()
        }
      })
    },
    // dialog 确认执行
    async conExecuteAdvice () {
      let executePost = {
        ids: [],
        drugSendFlag: 1
      }
      this.fuziData[JSON.parse(JSON.stringify(this.pishiData))[0].mainGroupIdFlag].forEach(v => {
        executePost.ids.push(v.id)
      })
      this.pishiResult[this.pishiData[0].id] = JSON.parse(JSON.stringify(this.handleObj))
      // 先执行，确认执行后再保存皮试结果
      this.confirmExecute(executePost, JSON.parse(JSON.stringify(this.pishiData[0])))
      this.celExecuteAdvice()
    },
    // 执行记录 关闭dialog 事件
    celExecuteAdvice () {
      // 改变pishidata，父子医嘱一起处理，调用下一个执行记录弹窗
      if (this.pishiData.length) {
        this.pishiData = this.pishiData.splice(this.fuziData[JSON.parse(JSON.stringify(this.pishiData))[0].mainGroupIdFlag].length, this.pishiData.length)
      }
    },
    // 确认取消执行
    conCancelExecute () {
      let postdata = {
        outpatientExecuteIds: [],
        status: 2,  //  1皮试  2取消执行  3无法执行
        remark: this.handleObj.result
      }
      this.fuziData[this.curObj.mainGroupIdFlag].forEach(v => {
        postdata.outpatientExecuteIds.push(v.id)
      })
      this.saveExecute(postdata)
    },
    // 确认无法执行
    conNoExecute () {
      let postdata = {
        outpatientExecuteIds: [],
        status: 3,  //  1皮试  2取消执行  3无法执行
        reason: this.handleObj.noExecuteReason,
        remark: this.handleObj.description
      }
      this.fuziData[this.curObj.mainGroupIdFlag].forEach(v => {
        postdata.outpatientExecuteIds.push(v.id)
      })
      this.saveExecute(postdata)
    },
    // 保存执行记录皮试结果、取消执行弹窗、无法执行弹窗结果
    async saveExecute (params) {
      const res = await api.executeResultBatch(params)
      if (res && res.head && res.head.errCode === 0) {
        this.$messageTips(this, 'success', '操作成功', '提示')
        this.handleVisible = false
        this.queryList()
        this.key++
      }
    },
    // 批量执行
    selectExecute () {
      let ids = []
      this.selectData.forEach(v => {
        if (v.employ === '7') {
          this.pishiData.push(v)
        } else {
          ids.push(v.id)
        }
      })
      if (ids.length) {
        this.confirmExecute({ids: ids, drugSendFlag: 1})
      }
    },
    // 执行事件
    async confirmExecute (params, pishiObj) {
      const res = await api.executeAdvice(params)
      if (res && res.head && res.head.errCode === 0) {
        if (res.data && res.data.length) {
          this.noSendData = res.data.map(val => {
            let data = this.allData.find(v => { return v.id === val.id }) || {}
            val.doctorAdviceName = data.adviceJson.doctorAdviceName
            val.employ = data.employ
            val.mainGroupIdFlag = data.mainGroupIdFlag
            return val
          })
          this.tipsVisible = true
        } else {
          this.$messageTips(this, 'success', '医嘱执行成功', '提示')
          this.queryList()
          this.tipsVisible = false
          this.noSendData = []
        }
        // 先执行，确认执行后再保存皮试结果
        // if (pishiObj && (!res.data.length || !params.drugSendFlag)) {
        if (pishiObj && !res.data.length) {
          let postdata = {
            outpatientExecuteIds: [],
            status: 1,  //  1皮试  2取消执行  3无法执行
            result: this.pishiResult[pishiObj.id].pishiResult === '1' ? '阴性' : '阳性',
            remark: this.pishiResult[pishiObj.id].description
          }
          this.fuziData[pishiObj.mainGroupIdFlag].forEach(v => {
            postdata.outpatientExecuteIds.push(v.id)
          })
          // 保存皮试结果及备注
          this.saveExecute(postdata)
        }
        this.isComfirm = false
      } else {
        this.isComfirm = false
      }
    },
    // 继续执行
    continueExecute () {
      let postdata = {
        ids: [],
        drugSendFlag: 0   // 是否校验出库状态  0否 1是
      }
      let flag = false
      this.noSendData.forEach(item => {
        postdata.ids.push(item.id)
        if (item.employ === '7') flag = true
      })
      this.confirmExecute(postdata, flag ? this.noSendData[0] : false)
    },
    // 打印执行单
    printEvent () {
      // if (!this.queryObj.executeTypeCodeList.length) {
      //   return this.$messageTips(this, 'warning', '请选择希望打印的执行单类型', '提示')
      // }
      let print = []
      mutiplePrint(print)
    },
    // 查询
    search () {
      this.reset()
      this.queryList()
    },
    // 患者状态发生变化
    refresh (key, patient, list) {
      if (key === 'storage') {
        this.$router.push({query: {
          areaId: storage.getLocalStorage('inpatientKey').split(',')[0]
        }})
        this.queryObj.areaIds = [storage.getLocalStorage('inpatientKey').split(',')[0]]
        this.clearInfo && this.clearInfo()
        return
      }
      if (!patient && this.inpatientNumber !== list.length) {
        this.$router.push({query: {
          areaId: this.$route.query.areaId
        }})
        this.clearInfo && this.clearInfo()
        this.inpatientNumber = list.length
        this.queryList()
        return
      }
      this.inpatientNumber = list.length
    }
  },
  computed: {
    allData () {
      let data = []
      this.tableData.forEach(v => {
        v.mainGroupIdFlag = v.mainGroupId + '_' + v.planTime
        v.completeTimes = v.completeTime ? this.$moment(v.completeTime).format('YYYY-MM-DD HH:mm:ss') : ''
        v.executeStatus = v.status
        if (v.childAdviceExecuteList && v.childAdviceExecuteList.length) {
          v.childAdviceExecuteList.forEach(m => {
            m.mainGroupIdFlag = m.mainGroupId + '_' + m.planTime
            m.completeTimes = m.completeTime ? this.$moment(m.completeTime).format('YYYY-MM-DD HH:mm:ss') : ''
            m.executeStatus = m.status
            data.push(m)
          })
        } else {
          data.push(v)
        }
      })
      return data
    },
    fuziData () {
      let obj = {}
      this.allData.forEach(v => {
        if (obj[v.mainGroupIdFlag]) {
          obj[v.mainGroupIdFlag].push(v)
        } else {
          obj[v.mainGroupIdFlag] = [v]
        }
      })
      return obj
    }
  },
  watch: {
    pishiData (val) {
      if (val && val.length) {
        setTimeout(() => {
          this.handleVisible = true
          this.handleSchema = this.executeSchema
          this.handleObj = this.executeObj
          this.handleRules = this.executeRules
          this.handleObj.pishiResult = ''
          this.handleObj.description = ''
          this.handleObj.serviceNameList = this.fuziData[val[0].mainGroupIdFlag]
          this.curObj = val[0]
          this.dialogTitle = '执行记录'
        }, 200)
      } else {
        this.handleVisible = false
      }
    },
    'queryObj.termTypes': {
      handler (val) {
        this.reset()
        this.queryList()
      }
    },
    'baseInfo': {
      handler (val) {
        this.reset()
        this.queryList()
      },
      deep: true
    },
    'hospitalizedNumberList': {
      handler (val) {
        this.reset()
        this.queryList()
      },
      deep: true
    },
    'handleVisible': {
      handler (val) {
        this.reset()
        if (!val) {
          this.isComfirm = val
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.advice_execute {
  height: 100%;
  .layout_inner {
    padding: 0 0 0 10px;
    background: transparent;
    height: 100%;
    display: flex;
    flex-direction: column;
    .main-head {
      margin-top: 12px;
      /deep/.el-form {
        .el-radio-group {
          .el-radio {
            margin-right: 20px;
          }
        }
        .el-form-item {
          margin: 0 10px 2px 0;
        }
      }
      .alg_r {
        line-height: 30px;
      }
    }
    .main-wrap {
      overflow: auto;
    }
  }
  /deep/ .tips_dialog {
    /deep/ .el-dialog__footer{
      border-top:none;
    }
    button {
      padding-left: 15px;
      padding-right: 15px;
    }
    /deep/ .el-dialog__body {
      padding: 0 10px;
      p {
        margin: 0;
        font-weight: bold;
        overflow: hidden;
        .iconfont {
          float: left;
          color:#1C7BEF;
          font-size: 20px;
          margin-right: 8px;
        }
        span {
          float: left;
          line-height: 23px;
        }
      }
      ul {
        padding-left: 30px;
        color: #666666;
        margin: 5px 0;
        li {
          line-height: 25px;
        }
      }
    }
  }
  /deep/ .el-form {
    .wrap {
      padding: 6px 0;
      .serviceName {
        margin: 0;
        line-height: 20px;
        display: flex;
        .leftIcon {
          width: 6px;
          position: relative;
          margin-right: 6px;
          .top {
            border-top: 3px solid;
            border-left: 3px solid;
            width: 100%;
            position: absolute;
            top: 8px;
            bottom: 0;
          }
          .middle {
            border-left: 3px solid;
            width: 100%;
            position: absolute;
            top: 0;
            bottom: 0;
          }
          .bottom {
            border-bottom: 3px solid;
            border-left: 3px solid;
            width: 100%;
            height: 8px;
            position: absolute;
            top: 0;
          }
        }
      }
    }
  }
  /deep/ .specDialog {
    /deep/ .el-dialog__body {
      overflow: visible;
      /deep/ .el-textarea {
        textarea {
          overflow: hidden;
        }
      }
    }
  }
}
</style>
