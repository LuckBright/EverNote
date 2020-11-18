<template>
  <div class="layout_box" id="waitarea" @selectstart.prevent>
    <el-row class="headarea">
      <el-col :span="14" class="left">
        <ever-form2 :schema="querySchema" v-model="queryObj" :is-query="true" :inline="true">
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
      <el-col :span="10" align="right" class="right">
        <el-checkbox v-model="reformSort" size="small" :disabled="queryObj.termTypes !== 1" @change="reformSortChange">按重整排序</el-checkbox>
        <el-button @click="printAdvice" :disabled="!showTableData.length">打印</el-button>
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
        class="patient-advice-table"
        ref="adviceShow"
        :visitType="3"
        :loading="loading"
        :showData="showTableData"
        :rowClass="rowClass"
        :columns="columns"
        :configOption="configOption"
        :contextList="contextList"
        :arraySpan="arraySpan"
        :noBorderSpan="noBorderSpan"
        :default-sort="defaultSort"
        @cell-dblclick="cellDblclick"
        @menu="getMenuList"
        @contextSelect="contextSelect"
        @sortChange="sortChange"
      ></advice-show-table>
      <!-- 关联费用和分解记录 -->
      <advice-info
        v-if="curClickHandle.length"
        :base-info="baseInfo"
        :cur-advice="curClickHandle"
        @close="adviceInfoClose"></advice-info>
      <!-- 医嘱打印组件 -->
      <advice-print :visible.sync="printvisible"></advice-print>
      <!-- 操作日志dialog -->
      <operation-log :data="currentHandleObj" :visible.sync="logVisible"></operation-log>
      <!-- 申请单打印组件 -->
      <applyform-print ref="applyformPrint"></applyform-print>
    </div>
  </div>
</template>
<script>
import sysvalue from '@/warehouse/store/sysvalueapi'
import recipeapi from '@/workspace/store/recipeapi'
import adviceShowTable from '@/inpatient/components/medical.orders/advice.show.table'
import advicePrint from '@/inpatient/components/dialog-print.vue'
import operationLog from '@/inpatient/components/medical.orders/operation.log'
import applyformPrint from '@/inpatient/page/advice.manage/applyform.print.dialog'
import { HOSPITAL_MGT_SENDADVICE } from '@/util/table-config'
import { objSortBy } from '@/util/common'
import { singlePrint } from '@/inpatient/components/sendarea.print.js'
import i18n from '@/assets/locals/index'
import storage from '@/util/storage'
import adviceInfo from './advice.info.vue'

export default {
  data () {
    let querySchema = [
      {
        name: 'termTypes',
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
    queryObj.termTypes = 1
    queryObj.serviceTypeList = []
    queryObj.statusList = []
    return {
      sysvalue,
      recipeapi,
      queryObj,
      querySchema,
      loading: false,
      printvisible: false,
      logVisible: false,
      currentHandleObj: {},
      tableData: [],
      showTableData: [],
      baseInfo: this.$route.query,
      rowClass: 'mgtContextRow',
      columns: [
        {
          prop: 'startTime',
          label: i18n.t('开始时间'),
          showOverflowTooltip: true,
          minWidth: '8%',
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
          minWidth: '6%',
          sortable: true,
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
          prop: 'executeProviderName',
          label: i18n.t('执行科室'),
          showOverflowTooltip: true,
          minWidth: '8%'
        },
        {
          slot: 'status',
          prop: 'status',
          label: i18n.t('状态'),
          showOverflowTooltip: true,
          minWidth: '6%'
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
          minWidth: '8%'
        },
        {
          prop: 'storageRoomName',
          label: i18n.t('库房'),
          showOverflowTooltip: true,
          minWidth: '8%',
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
          minWidth: '8%'
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
          prop: 'doctorName',
          label: i18n.t('提交人'),
          showOverflowTooltip: true,
          minWidth: '8%',
          hidden: true
        },
        {
          prop: 'submitTime',
          label: i18n.t('提交时间'),
          showOverflowTooltip: true,
          minWidth: '8%',
          sortable: true,
          sortMethod: this.sortByTime('submitTime'),
          formatter: ({value}) => {
            if (value) {
              return this.$moment(value).format('YYYY-MM-DD HH:mm') || ''
            } else {
              return ''
            }
          }
        }
      ],
      configOption: {id: HOSPITAL_MGT_SENDADVICE},
      arraySpan: ['startTime', 'termType', 'executeProviderName', 'stopTime', 'stopByName', 'source', 'storageRoomName'],
      noBorderSpan: ['serviceType', 'doctorAdviceName', 'doctorAdviceContent', 'entrust', 'status'],
      contextList: [
        { id: '1', name: '打印申请', disabled: false, methodName: 'printApply' },
        { id: '2', name: '操作日志', disabled: false, methodName: 'operationLog' }
      ],
      adviceStatusList: [
        {id: '1', name: '待审核'},
        {id: '2', name: '审核驳回'},
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
      isSorting: false,
      curClickHandle: [] // 当前点击的医嘱信息
    }
  },
  created () {
    this.search()
  },
  mounted () {
    this.getOptions()
  },
  methods: {
    initPage () {
      this.limitDataCount = 50
      this.offset = 0
      this.totalCount = 0
    },
    // 获取医嘱类型和医嘱状态options
    getOptions () {
      this.$ever.getFieldFromSchema(this.querySchema, 'statusList').props.options = this.adviceStatusList
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
      this.$ever.getFieldFromSchema(this.querySchema, 'serviceTypeList').props.options = serviceTypeList
    },
    async getRecipeDataForPage () {
      let params = {
        tenantId: this.$store.state.currentUser.tenantId,
        orgId: this.$store.state.currentUser.organizationId,
        // providerId: this.baseInfo.providerId || this.baseInfo.dptId,
        // doctorId: this.$store.state.currentUser.userId,
        patientId: this.baseInfo.patientId,
        hospitalizedNumber: this.baseInfo.hospitalizedNumber,
        channel: 1,    // 来源渠道，1-pc, 2-移动端
        visitType: 3,
        notStatusList: [0],
        sourceExecuteId: 'isNull',
        orderByFlag: this.orderByFlag, // 0：按照医嘱序号正序排序（之前的排序方式）；1：按照重整医嘱时间正序排序；
        pageSize: this.limitDataCount,
        offset: this.offset
      }
      params = Object.assign(params, JSON.parse(JSON.stringify(this.queryObj)))
      if (this.queryObj.termTypes > -1) {
        params.termType = this.queryObj.termTypes
      } else {
        delete params.termType
      }
      if (this.queryObj.statusList.includes('5') && !this.queryObj.statusList.includes('6')) {
        params.statusList.push('6', '60')
      }
      if (!this.queryObj.statusList.includes('5') && this.queryObj.statusList.includes('6')) {
        params.statusList = params.statusList.filter(v => {
          return v !== '6' && v !== '60'
        })
      }
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
        return data
      } else {
        return []
      }
      // if (res && res.data && res.data.length) {
      //   return res.data
      // } else {
      //   return []
      // }
    },
    // 获取列表数据
    async getRecipeData () {
      this.tableData = await this.getRecipeDataForPage()
    },
    // 医嘱打印事件
    printAdvice () {
      this.printvisible = true
    },
    // 右键操作按钮列表触发事件回调
    getMenuList ({ index }) {
      this.contextList.forEach((v) => {
        v.disabled = !this.getStatusShow(this.fuziData[this.showTableData[index].mainGroupId], index, v.id)
      })
    },
    // 右键操作按钮显示逻辑
    getStatusShow (data, index, id) {
      if (id === '1') {
        let n1 = 0
        data.forEach(v => {
          if (['800', '801', '10003', '802', '2125', '303', '304', '3002'].includes(v.serviceType)) n1++
        })
        return data.length === n1
      } else if (id === '2') {
        return true
      }
    },
    // 右键操作按钮列表点击回调
    contextSelect ({ item, index }) {
      this[item.methodName](this.showTableData[index], index)
    },
    // 操作日志
    operationLog (item, index) {
      this.currentHandleObj = item
      this.logVisible = true
    },
    // 打印申请
    printApply (item, index) {
      let print = this.$refs.applyformPrint.getPrintData([item])
      if (print && print.length) {
        singlePrint(print[0].code, print[0].params)
      }
    },
    // 查询
    search () {
      this.initPage()
      this.getRecipeData()
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
    reformSortChange () { // 按重整医嘱排序
      storage.setSessionStorage('reformSort', JSON.stringify(this.reformSort))
      if (this.isSorting) {
        return
      }
      if (this.reformSort) {
        this.orderByFlag = 1
      } else {
        this.orderByFlag = 0
      }
      // this.search()
    },
    async getMoreData () { // 加载更多
      this.moreLoading = true
      let res = await this.getRecipeDataForPage()
      this.tableData.unshift(...res)
      this.moreLoading = false
    },
    cellDblclick ({row}) { // 列表双击事件
      this.curClickHandle = this.fuziData[row.mainGroupId] || []
    },
    adviceInfoClose () { // 关闭展示关联费用和分解记录的组件
      this.curClickHandle = []
    }
  },
  components: {
    adviceShowTable, // 医嘱展示组件
    advicePrint, // 医嘱打印组件
    operationLog, // 操作日志组件
    applyformPrint, // 申请单打印组件
    adviceInfo // 费用明细，分解记录
  },
  computed: {
    fuziData () {
      let obj = {}
      this.showTableData.forEach(v => {
        if (obj[v.mainGroupId]) {
          obj[v.mainGroupId].push(v)
        } else {
          obj[v.mainGroupId] = [v]
        }
      })
      return obj
    }
  },
  watch: {
    'queryObj': {
      handler (val) {
        if (val.termTypes === 1) {
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
    'tableData': {
      handler (val) {
        let list = []
        let obj = {}
        val.forEach((v, index) => {
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
        this.showTableData = list
      },
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
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }
  .patient-advice-table {
    flex: 1;
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
