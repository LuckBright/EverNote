<template>
  <div class="layout_box" id="waitarea" @selectstart.prevent>
    <el-row class="headarea">
      <el-col :span="16" class="left">
        <ever-form2 :schema="querySchema" v-model="queryObj" :is-query="true" :inline="true">
          <template slot="termType">
            <el-radio-group v-model="queryObj.termType" @change="termChange">
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
      <el-col :span="8" align="right" class="right" v-if="!noOperate">
        <el-checkbox v-model="reformSort" size="small" :disabled="queryObj.termType !== 1" @change="reformSortChange">按重整排序</el-checkbox>
        <ever-confirm
          class="reform-btn"
          type="default"
          size="medium"
          :msg="'您确认进行重整医嘱吗?'"
          action="重整医嘱"
          :disabled="queryObj.termType !== 1 || fromMedical"
          @confirm="reformAdvice"
        >
        </ever-confirm>
        <!-- <el-button @click="reform">重整医嘱</el-button> -->
        <el-button @click="printAdvice" :disabled="!sendData || !sendData.length || curStatus === '0'">打印</el-button>
        <el-button @click="stopAdvice" :disabled="!sendSelect || !sendSelect.length || curStatus === '0' || disabled || fromMedical">停止</el-button>
        <el-button type="primary" @click="sendWaitData(false)" :loading="isSending" :disabled="!waitSelect || !waitSelect.length || curStatus !== '0' || disabled || fromMedical">提交</el-button>
      </el-col>
    </el-row>
    <div class="mainarea">
      <div class="divider" v-if="offset < this.totalCount">
        <div class="divider-text">
          展示近{{offset}}条数据
          <el-button type="text" class="more-data" @click="getMoreData" v-if="!moreLoading">更多</el-button>
          <i class="el-icon-loading" v-else></i>
        </div>
      </div>
      <advice-show-table
        ref="adviceShow"
        :visitType="3"
        :loading="loading"
        :showData="tableData"
        :columns="columns"
        :configOption="configOption"
        :contextList="contextList"
        :arraySpan="arraySpan"
        :noBorderSpan="noBorderSpan"
        :isDragCancel="isDragCancel"
        :showCheckbox="!noOperate"
        :selectable="selectable"
        :noOperate="noOperate"
        :default-sort="defaultSort"
        :is-limit-data="true"
        :is-virtual-scroll="true"
        @cell-dblclick="editWaitService"
        @menu="getMenuList"
        @contextSelect="contextSelect"
        @dragSelect="dragSelect"
        @selectionChange="selectionChange"
        @sortChange="sortChange"
      ></advice-show-table>
      <!-- 已提交区组件 -->
      <sendarea-hospital
        ref="sendarea"
        v-if="!noOperate"
        :base-info="baseInfo"
        :send-data="sendData"
        :disabled="disabled"
        @cancel="cancelRecipe"
        @continueSubmit="continueSubmit"
      ></sendarea-hospital>
      <!-- 医嘱打印组件 -->
      <advice-print :visible.sync="printvisible" v-if="!noOperate"></advice-print>
    </div>
  </div>
</template>
<script>
import waitareajs from '@/inpatient/components/waitarea.new.js'
import sendareaHospital from '@/inpatient/components/sendarea.hospital'
import adviceShowTable from '@/inpatient/components/medical.orders/advice.show.table'
import advicePrint from '@/inpatient/components/dialog-print.vue'
import { HOSPITAL_SENDADVICE } from '@/util/table-config'
import { objSortBy } from '@/util/common'
import i18n from '@/assets/locals/index'
import storage from '@/util/storage'

export default {
  mixins: [waitareajs],
  props: {
    noOperate: {       // 是否不需要操作，只是展示内容，true: 只展示，false: 正常，允许操作
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fromMedical: {
      type: Boolean,
      default: false
    }
  },
  data () {
    let querySchema = [
      {
        name: 'termType',
        label: '',
        comp: 'custom'
      },
      {
        name: 'serviceTypeList',
        label: '',
        comp: 'sys-select',
        props: {
          options: [],
          placeholder: '医嘱类型',
          field: {
            multiple: true,
            collapsetags: true
          }
        }
      },
      {
        name: 'statusList',
        label: '',
        comp: 'sys-select',
        span: 3,
        props: {
          options: [],
          placeholder: '医嘱状态',
          field: {
            multiple: true,
            collapsetags: true
          }
        }
      }
    ]
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.termType = 1
    queryObj.serviceTypeList = []
    queryObj.statusList = []
    return {
      queryObj,
      querySchema,
      isSending: false,
      isShowSend: true,
      printvisible: false,
      selectData: [],
      selectIds: [],
      curStatus: '',
      adviceStatusList: [
        {id: '1', name: '待审核'},
        {id: '2', name: '驳回'},
        {id: '5', name: '已完成'},
        {id: '10', name: '执行中'},
        {id: '12', name: '待停止'},
        {id: '11', name: '已作废'},
      ],
      limitDataCount: 50,
      offset: 0,
      totalCount: 0,
      moreLoading: false,
      reformSort: true,
      orderByFlag: 1,
      isSorting: false
    }
  },
  created () {
    this.init()
  },
  mounted () {
    this.getOptions()
  },
  methods: {
    // 初始化
    init () {
      let reformSort = storage.getSessionStorage('reformSort')
      this.reformSort = reformSort === null ? true : JSON.parse(reformSort)
      this.columns = this.getColumns()
      this.arraySpan = ['startTime', 'termType', 'executeProviderName', 'stopTime', 'stopByName', 'source', 'storageRoomName', 'doctorName', 'submitTime']
      this.noBorderSpan = ['serviceType', 'doctorAdviceName', 'doctorAdviceContent', 'entrust', 'status', 'advicePrice']
      this.configOption = {id: HOSPITAL_SENDADVICE}
      if (!this.noOperate && !this.disabled) {
        this.search()
      } else {
        this.getRecipeData()
        // this.configOption = {}
      }
    },
    initPage () {
      this.limitDataCount = 50
      this.offset = 0
      this.totalCount = 0
    },
    // 将接口返回的数据重组，父子医嘱放在一起
    resetData (data) {
      let list = []
      let obj = {}
      data.forEach((v, index) => {
        if (v.mainFlag !== 2) {
          v.originIndex = index
        }
        if (obj[v.mainGroupId]) {
          if (v.mainFlag === 1) {
            obj[v.mainGroupId].unshift(v)
          } else {
            obj[v.mainGroupId].push(v)
          }
        } else {
          obj[v.mainGroupId] = [v]
        }
      })
      Object.values(obj).sort((a, b) => {
        return a[0].originIndex > b[0].originIndex ? 1 : -1
      }).forEach(item => {
        list = list.concat(item)
      })
      return list
    },
    // 获取医嘱类型和医嘱状态options
    getOptions () {
      this.$ever.getFieldFromSchema(this.querySchema, 'statusList').props.options = this.adviceStatusList
      let serviceTypeOptions = []
      // 过滤值集中三级分类
      this.sysvalue.listOnce('THC_WH_OBJECT_SUB_TYPE').then(options => {
        options = objSortBy(options, 'orderNumber').reverse()
        options.forEach(item => {
          if (['798', '294', '296'].includes(item.parentId)) {
            serviceTypeOptions.push(item)
          }
        })
      })
      this.$ever.getFieldFromSchema(this.querySchema, 'serviceTypeList').props.options = serviceTypeOptions
    },
    // 获取查询医嘱列表参数
    getParams (query) {
      let params = {
        tenantId: this.$store.state.currentUser.tenantId,
        orgId: this.$store.state.currentUser.organizationId,
        // providerId: this.baseInfo.providerId || this.baseInfo.dptId,
        // doctorId: this.$store.state.currentUser.userId,
        patientId: this.baseInfo.patientId,
        hospitalizedNumber: this.baseInfo.hospitalizedNumber,
        channel: 1,    // 来源渠道，1-pc, 2-移动端
        visitType: 3
      }
      if (!query) {
        return params
      }
      return Object.assign(params, query)
    },
    // 获取待提交列表
    async getWaitData () {
      let tempWaitData = []
      let params = this.getParams({
        sourceExecuteId: 'isNull',
        statusList: [0],
        orderByFlag: 2, // 0：按照医嘱序号反序排序（之前的排序方式）；1: 按照重整医嘱时间排序,2：按照医嘱序号正序排序（之前的排序方式）；1
        termType: this.queryObj.termType >= 0 ? this.queryObj.termType : ''
      })
      let res = await this.recipeapi.getDoctorAdviceInfo(params)
      if (res && res.data && res.data.length) {
        res.data.forEach(item => {
          if (item.doctorId === this.$store.state.currentUser.userId) {
            tempWaitData.push(item)
          }
        })
        this.waitData = this.resetData(tempWaitData)
      } else {
        this.waitData = []
      }
    },
    async getRecipeDataForPage () {
      let query = {
        notStatusList: [0],
        sourceExecuteId: 'isNull',
        orderByFlag: this.orderByFlag, // 0：按照医嘱序号正序排序（之前的排序方式）；1：按照重整医嘱时间正序排序；
        pageSize: this.limitDataCount,
        offset: this.offset
      }
      for (let i in this.queryObj) {
        if (this.queryObj[i] !== -1) {
          query[i] = JSON.parse(JSON.stringify(this.queryObj[i]))
        }
      }
      if (this.queryObj.statusList.includes('5') && !this.queryObj.statusList.includes('6')) {
        query.statusList.push('6', '60')
      }
      if (!this.queryObj.statusList.includes('5') && this.queryObj.statusList.includes('6')) {
        query.statusList = query.statusList.filter(v => {
          return v !== '6' && v !== '60'
        })
      }
      let params = this.getParams(query)
      delete params.doctorId
      let res = await this.recipeapi.getDoctorAdviceInfoForPage(params)
      if (res && res.data && res.data.length) {
        res.data.reverse()
        this.totalCount = res.totalCount || 0
        let n = 0
        while (res.data[n].mainFlag === 2) {
          n++
        }
        let adviceReformId = res.data[n].adviceReformId
        let data = []
        if (this.reformSort && this.orderByFlag === 1) {
          res.data.forEach(item => {
            if (item.adviceReformId === adviceReformId || item.mainFlag === 2) {
              data.push(item)
            } else {
              data.push({
                mainGroupId: adviceReformId + 'a',
                startTime: item.startTime,
                serialNumber: item.serialNumber - 1,
                spanAll: true,
                adviceReformId: adviceReformId,
              })
              data.push(item)
              adviceReformId = item.adviceReformId
            }
          })
        } else {
          data = res.data
        }
        this.offset += this.limitDataCount
        return this.resetData(data)
      } else {
        return []
      }
    },
    // 获取提交列表
    async getRecipeData () {
      this.sendData = await this.getRecipeDataForPage()
    },
    // 选中列表，默认选中待提交区，参数不为0，选中已提交区
    selectWaitTable (status = 0) {
      this.$refs.adviceShow.scrollToBottom()
      this.$nextTick(() => {
        this.$refs.adviceShow.toggle((data) => {
          let list = []
          data.forEach(item => {
            if (status === 0) {
              if (item.status === 0) {
                list.push(item)
              }
            } else {
              if (item.status !== 0) {
                list.push(item)
              }
            }
          })
          return list
        })
      })
    },
    // checkbox 是否可用,勾选待提交区，已提交区禁用，反之
    selectable (row, index) {
      if (this.curStatus) {
        if (this.curStatus === '0') {
          return String(row.status) === '0'
        } else {
          return String(row.status) !== '0'
        }
      } else {
        return !this.disabled
      }
    },
    // checkbox 复选回调
    selectionChange (selection) {
      // 如果待提交和已提交都是未勾选状态，全选，勾选已提交区域，去掉待提交区域的勾选
      if (selection.length === this.waitData.length + this.sendData.length && selection.length !== this.waitData.length && selection.length !== this.sendData.length) {
        this.selectData = selection.filter(item => {
          return String(item.status) !== '0'
        })
        this.selectWaitTable(1)
      } else {
        this.selectData = selection
      }
      if (!selection.length) {
        this.curStatus = ''
      }
      this.selectIds = []
      this.selectData.forEach(v => {
        this.curStatus = String(v.status)
        this.selectIds.push(v.id)
      })
    },
    // 医嘱打印事件
    printAdvice () {
      this.printvisible = true
    },
    // 提交区，处方撤回成功，或停止成功，或作废成功，更新医嘱列表，flag： 0 更新全部列表，1 更新已提交列表
    cancelRecipe (flag) {
      this.curStatus = ''
      if (!flag) {
        this.search()
      } else {
        this.initPage()
        this.getRecipeData()
      }
    },
    // 医嘱停止事件
    stopAdvice () {
      let n = 0
      this.selectData.forEach(item => {
        if (String(item.termType) === '1' && String(item.status) === '10') n++
      })
      if (this.selectData.length !== n) {
        return this.$messageTips(this, 'warning', '停止医嘱失败，只能停止长期医嘱且医嘱状态是【执行中】的医嘱，请重新选择！', '提示')
      }
      this.$refs.sendarea.stopAdvice(this.selectData, '', this.selectIds)
    },
    // 提交待提交区域数据
    async sendWaitData (data) {
      if (!data) {
        let flag = false
        this.selectData.forEach(item => {
          if (String(item.status) !== '0' && !flag) {
            flag = true
          }
        })
        if (flag) {
          return this.$messageTips(this, 'warning', '非开立状态医嘱不可提交，请重新勾选后提交！', '提示')
        }
      }
      await this.setTicketCode()
      this.isSending = true
      let params = {
        hospitalizedNumber: this.baseInfo.hospitalizedNumber,
        patientId: this.baseInfo.patientId,
        doctorAdviceIdList: this.selectIds
      }
      // 如果是继续提交，将继续提交的医嘱id添加到params中
      if (data && data.length) {
        data.forEach(v => {
          params.doctorAdviceIdList.push(v.id)
        })
      }
      let res = await this.recipeapi.submitInpatientDoctorAdvice(params).catch(() => {
        this.isSending = false
      })
      if (res && res.head && res.head.errCode === 0) {
        this.isSending = false
        this.$messageTips(this, 'success', '医嘱项目已提交成功', '成功')
        this.curStatus = ''
        if (data) {
          this.initPage()
          this.getRecipeData()
        } else {
          this.search()
        }
      } else {
        this.isSending = false
      }
    },
    // 继续提交
    continueSubmit (data) {
      this.sendWaitData(data)
    },
    // 查询
    async search () {
      this.initPage()
      await this.getRecipeData()
      // 添加待提交区列表更新，防止其他人操作了待提交区数据，当前只查询更新已提交列表，出现数据重复问题
      this.getWaitData()
    },
    // 0 - 倒序 3 - 正序 2 - 重整
    // 默认 this.reformSort｜true 2 ｜false 0
    // 正序 0 ascending
    // 倒序 3 descending
    defaultSort (data) {
      return data
    },
    sortChange ({ column, prop, order }) {
      if (!order) {
        this.isSorting = false
        if (this.reformSort) {
          this.orderByFlag = 1
        } else {
          this.orderByFlag = 0
        }
        return
      }
      this.isSorting = true
      if (prop === 'startTime') {
        this.sortByStartTime(order)
      }
    },
    sortByStartTime (dir) {
      if (dir === 'ascending') {
        this.orderByFlag = 0
      }
      if (dir === 'descending') {
        this.orderByFlag = 3
      }
    },
    sortByTime (key) {
      // 排序规则：父子医嘱不能分开，默认按开始时间排序，开始时间相同按serialNumber序号排序,待提交区不参与排序
      return function (data, dir, isReform) {
        let waitDataList = []
        let sendDataList = []
        let sendGroupList = []
        let mainGroupObj = {}

        if (!dir) {
          // 开始时间是接口排序
          if (this.reformSort) {
            this.orderByFlag = 1
          } else {
            this.orderByFlag = 0
          }
        }

        data.forEach(item => {
          if (item.spanAll && !isReform) {
            return
          }
          let groupId = item.mainGroupId
          let mainFlag = item.mainFlag
          if (!mainGroupObj[groupId]) {
            mainGroupObj[groupId] = [item]
            return
          }
          if (mainFlag === 1) {
            mainGroupObj[groupId].unshift(item)
          } else {
            mainGroupObj[groupId].push(item)
          }
        })
        let mainGroupArr = Object.values(mainGroupObj)
        let sendTimeObj = {}
        mainGroupArr.forEach(item => {
          item[0].status === 0 ? waitDataList.push(...item) : (function () {
            let time = new Date(item[0][key]).getTime()
            if (sendTimeObj[time]) {
              sendTimeObj[time].push(item)
            } else {
              sendTimeObj[time] = [item]
            }
          })()
        })
        let timeKeys = Object.keys(sendTimeObj)
        if (dir === 'descending' || !dir) {
          timeKeys.sort((aKey, bKey) => {
            return aKey > bKey ? -1 : 1
          })
        }
        if (dir === 'ascending') {
          timeKeys.sort((aKey, bKey) => {
            return aKey < bKey ? -1 : 1
          })
        }
        timeKeys.forEach(item => {
          let sameTimeArr = sendTimeObj[item]
          sameTimeArr.sort((a, b) => {
            return a[0].serialNumber < b[0].serialNumber ? -1 : 1
          })
          sendGroupList.push(...sameTimeArr)
        })
        sendGroupList.forEach(item => {
          sendDataList.push(...item)
        })
        return [].concat(sendDataList, waitDataList)
      }
    },
    async getMoreData () {
      this.moreLoading = true
      let res = await this.getRecipeDataForPage()
      this.sendData.unshift(...res)
      this.moreLoading = false
    },
    // 重整医嘱
    reformAdvice () {
      this.recipeapi.reformAdvice({
        tenantId: this.$store.state.currentUser.tenantId,
        orgId: this.$store.state.currentUser.organizationId,
        patientId: this.baseInfo.patientId,
        patientName: this.baseInfo.patientName,
        visitNumber: this.baseInfo.hospitalizedNumber,
        channel: 1,
        visitType: 3
      }).then(res => {
        if (res) {
          this.$messageTips(this, 'success', '重整医嘱成功')
          this.reformSort = true
          this.search()
        }
      })
    },
    reformSortChange () {
      storage.setSessionStorage('reformSort', JSON.stringify(this.reformSort))
      if (this.isSorting) {
        return
      }
      if (this.reformSort) {
        this.orderByFlag = 1
      } else {
        this.orderByFlag = 0
      }
    },
    // 查询条件termType
    termChange (val) {
      this.$emit('termChange', val)
    },
    // 主动切换termType
    setTermType (val) {
      this.queryObj.termType = val
    },
    // 表头列
    getColumns () {
      return [
        {
          prop: 'startTime',
          label: i18n.t('开始时间'),
          showOverflowTooltip: true,
          minWidth: '9%',
          sortable: true,
          sortRemote: true,
          formatter: ({value}) => {
            if (value) {
              return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
            } else {
              return ''
            }
          }
        },
        {
          prop: 'termType',
          label: i18n.t('长/临'),
          showOverflowTooltip: true,
          minWidth: '5%',
          formatter: ({value}) => {
            return value === 0 ? '临时' : '长期'
          }
        },
        {
          slot: 'serviceType',
          prop: 'serviceType',
          label: i18n.t('类型'),
          minWidth: '7%',
          sortable: !this.noOperate,
          undraggable: true,
          required: true
        },
        {
          slot: 'doctorAdviceName',
          prop: 'doctorAdviceName',
          label: i18n.t('名称'),
          minWidth: '15%',
          undraggable: true,
          required: true
        },
        {
          slot: 'doctorAdviceContent',
          prop: 'doctorAdviceContent',
          label: i18n.t('内容'),
          minWidth: '20%',
          undraggable: true,
          required: true
        },
        {
          prop: 'entrust',
          label: i18n.t('嘱托'),
          showOverflowTooltip: true,
          minWidth: '10%'
        },
        {
          slot: 'status',
          prop: 'status',
          label: i18n.t('状态'),
          showOverflowTooltip: true,
          minWidth: '6%'
        },
        {
          prop: 'advicePrice',
          label: i18n.t('单次价格'),
          showOverflowTooltip: true,
          minWidth: '8%',
          align: 'right',
          hidden: true,
          formatter: ({value}) => {
            return '¥ ' + this.$filters.formatToFinacial(value, 2)
          }
        },
        {
          prop: 'executeProviderName',
          label: i18n.t('执行科室'),
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          prop: 'stopTime',
          label: i18n.t('停止时间'),
          showOverflowTooltip: true,
          minWidth: '8%',
          formatter: ({value}) => {
            if (value) {
              return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
            } else {
              return ''
            }
          }
        },
        {
          prop: 'stopByName',
          label: i18n.t('停止医生'),
          showOverflowTooltip: true,
          minWidth: '7%'
        },
        {
          prop: 'storageRoomName',
          label: i18n.t('库房'),
          showOverflowTooltip: true,
          minWidth: '8%',
          hidden: true,
          afterHtmlFormatter: ({ row }) => {
            let html = ''
            if (row.storageRoomName && row.mailFlag && this.visitType === 1) {
              html += `<i class="iconfont icon-youji1 iconYouji"></i>`
            }
            return html
          }
        },
        {
          slot: 'source',
          prop: 'source',
          label: i18n.t('渠道'),
          showOverflowTooltip: true,
          minWidth: '8%',
          hidden: true
        },
        {
          prop: 'doctorName',
          label: i18n.t('提交人'),
          showOverflowTooltip: true,
          minWidth: '7%',
          hidden: true
        },
        {
          prop: 'submitTime',
          label: i18n.t('提交时间'),
          showOverflowTooltip: true,
          minWidth: '10%',
          sortable: true,
          sortMethod: this.sortByTime('submitTime'),
          sortRemote: true,
          formatter: ({value}) => {
            if (value) {
              return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
            } else {
              return ''
            }
          }
        }
      ]
    }
  },
  components: {
    sendareaHospital,  // 已提交区组件
    adviceShowTable,   // 医嘱展示组件
    advicePrint        // 医嘱打印组件
  },
  computed: {
    tableData () {
      let list = []
      list = [].concat(this.sendData, this.waitData)
      return list
    },
    sendSelect () {
      return this.selectData.filter(v => {
        return v.status !== 0
      })
    },
    waitSelect () {
      return this.selectData.filter(v => {
        return v.status === 0
      })
    }
  },
  watch: {
    'queryObj': {
      handler (val) {
        if (val.termType === 1) {
          let reformSort = storage.getSessionStorage('reformSort')
          this.reformSort = reformSort === null ? true : JSON.parse(reformSort)
        } else {
          this.reformSort = false
        }
        this.search()
      },
      immediate: false,
      deep: true
    },
    orderByFlag (val) {
      this.initPage()
      this.getRecipeData()
    }
  }
}
</script>

<style scoped lang="scss">
#waitarea {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .headarea {
    margin-top: 10px;
    .left {
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
    }
    .right {
      .el-button {
        padding: 8px 10px;
      }
    }
  }
  .mainarea {
    flex: 1;
    overflow: hidden;
    // padding-bottom: 60px;
    display: flex;
    flex-direction: column;
  }
  .divider {
    width: 60%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    .divider-text {
      display: inline-block;
      margin: auto;
      padding: 0 20px;
      font-size: 14px;
      color: #444;
    }
    &::before, &::after {
      content: '';
      display: block;
      height: 1px;
      background-color: #dcdfe6;
      flex: 1
    }
  }
}
</style>
