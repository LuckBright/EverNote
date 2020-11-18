/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-03-02 10:47:22
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-07-20 15:11:57
 */
<template>
  <el-container>
    <div class="main-head">
      <ever-form2
        onsubmit="return false;"
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true">
        <template slot="businessTime">
          <ever-range-picker
            dateType="daterange"
            width="260px"
            :noclear="true"
            :autoWidth="false"
            :start.sync="queryObj.businessCreateTime"
            :end.sync="queryObj.businessEndTime"
            :outformat="`YYYY-MM-DD HH:mm:ss`"
            :default-time="['00:00:00', '23:59:59']"
          ></ever-range-picker>
        </template>
        <template slot="default">
          <el-form-item>
            <el-button type="primary" @click="list">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
          <el-form-item class="fr">
            <el-button type="primary" @click="handlerPush" :loading="pushLoading">推送</el-button>
          </el-form-item>
        </template>
      </ever-form2>
    </div>
    <el-container class="page_layout_full_hidden mt10 bWhite">
      <el-main class="page_layout_full_hidden">
        <el-container class="flex_column_full_hidden station_layout_wrap ">
          <!-- 列表 -->
          <ever-table
            ref="table"
            table-class="no-margin-table flex_column_full_hidden x-hidden small-padding"
            class="flex_scroll flex_hidden"
            table-default-cell-value=" "
            :data="tableData"
            :show-checkbox="true"
            :selectable="selectable"
            :show-index="true"
            :checkbox-width="50"
            :table-loading="loading"
            :columns="tableColumns"
            @selection-change="handleSelectionChange"
            @eventChange="eventChange">
          </ever-table>
          <!-- 底部分页 -->
          <ever-pagination
            class="mt10"
            :page-sizes="pageSizes"
            :current="current"
            :total-count="totalCount"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange">
          </ever-pagination>
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import storageroomApi from '@/warehouse/store/storageroomapi.js'
import tableColumns from './task.table.columns'
import api from '@/order/store/task.js'
import { TASK_TYPE, DOCUMENT_TYPE, THIRD_PARTY, PUSH_STATUS } from '../../util/const'
import { dateFormat, debounce } from '@/util/common'
import list from '@/util/list'
import { tableDefaultCellValue } from '@/warehouse/views/util/constant'

const querySchema = [
  {
    label: '订单号',
    name: 'orderCode'
  },
  {
    label: '任务编号',
    style: 'width: 180px',
    name: 'code'
  },
  {
    label: '业务类型',
    name: 'scenes',
    comp: 'sys-select',
    initValue: [],
    props: {
      field: {
        multiple: true,
        collapsetags: true
      },
      options: TASK_TYPE,
    }
  },
  {
    label: '单据类型',
    name: 'orderType',
    comp: 'ever-select',
    style: 'width: 120px',
    props: {
      options: DOCUMENT_TYPE,
    }
  },
  {
    label: '物资名称',
    name: 'localMaterialId',
    comp: 'material-select',
    props: {
      params: { materialType: '' }
    },
    style: 'width: 310px;'
  },
  {
    label: '库房',
    name: 'storageRoomId',
    comp: 'ever-select',
    props: {
      options: []
    },
  },
  {
    label: '是否对接第三方',
    name: 'thirdParty',
    comp: 'sys-select',
    style: 'width: 130px',
    props: {
      options: THIRD_PARTY
    }
  },
  {
    label: '第三方供应商名称',
    name: 'producer',
    comp: 'ever-select',
    props: {
      options: []
    },
  },
  {
    label: '推送状态',
    name: 'pushStatus',
    comp: 'ever-select',
    style: 'width: 120px',
    props: {
      options: PUSH_STATUS
    }
  },
  {
    label: '下单日期',
    name: 'businessTime',
    comp: 'custom'
  },
]

export default {
  mixins: [list],
  data () {
    const queryObj = this.$ever.createObjFromSchema(querySchema)
    // 一个月前 加一天
    queryObj.businessCreateTime = dateFormat(this.$moment().subtract(1, 'months').add(1, 'd'), null, 'startDay')
    queryObj.businessEndTime = dateFormat(Date.now(), null, 'endDay')
    queryObj.requestSwitch = true
    return {
      tableDefaultCellValue,
      querySchema,
      queryObj,
      tableColumns,
      tableData: [],
      selection: [],
      api,
      firstLoading: false, // 第一次加载组件，不进行watch list
      pushLoading: false,
      listParams: {},
      initQueryObj: Object.assign({}, queryObj)
    }
  },
  computed: {
    renderColumns () {
      return []
    }
  },
  created () {
    // 获取机构下全部库房
    storageroomApi.list().then(res => { // 获取库房
      if (res && res.list.length) {
        this.$ever.getFieldFromSchema(this.querySchema, 'storageRoomId').props.options = res.list
      }
    })
    // 获取机构下关联的所有第三方供应商
    api.getOrgThridSupplier({}).then(res => {
      if (res && res.length) {
        this.$ever.getFieldFromSchema(this.querySchema, 'producer').props.options = res
      }
    })
    setTimeout(_ => {
      this.firstLoading = true
    }, 1000)
  },
  methods: {
    pushSuccessOrFial (num, isSuccess = true) {
      return `${isSuccess ? '成功' : '失败'} ${num} 条`
    },
    handlerPush () {
      if (!this.selection.length) {
        return this.everWarning('请选择要推送的任务。')
      }
      this.pushLoading = true

      // 区分退药任务和发药任务
      const taskIds = []
      const backTaskIds = []
      // dispensingMachineIds 判断推送状态是推送失败的+订单状态是已完成
      const dispensingMachineIds = []
      this.selection.forEach(item => {
        const { pushStatus, orderType, taskId, status } = item
        // 推送失败 + 订单已完成
        if (pushStatus === 2 && status === 3) {
          dispensingMachineIds.push(taskId)
        }
        if (orderType === 0) {
          taskIds.push(taskId)
        } else if (orderType === 1) {
          backTaskIds.push(taskId)
        }
      })
      api.createPushMessageByOwn({ taskIds, backTaskIds, dispensingMachineIds }).then(res => {
        const total = this.selection.length
        let whetherLoading = true
        let msg = '推送'
        const { flag, errorMessage, flagNum: failTotal } = res
        if (flag) {
          msg += this.pushSuccessOrFial(total)
        } else if (errorMessage) {
          // 错误信息优先展示
          whetherLoading = false
          msg = errorMessage
        } else {
          if (failTotal === total) {
            // 当全部推送失败时， 不需要更新数据
            whetherLoading = false
            msg += this.pushSuccessOrFial(failTotal, false)
          } else {
            const successTotal = total - failTotal
            msg += this.pushSuccessOrFial(successTotal) + '，' + this.pushSuccessOrFial(failTotal, false)
          }
        }

        this.$alert(msg + '。', '推送结果', {
          distinguishCancelAndClose: true,
          showClose: true,
          confirmButtonText: '确定'
        }).then(_ => {
          whetherLoading && this.list()
        })
      }).finally(_ => {
        this.pushLoading = false
      })
    },
    handleSelectionChange (selection) {
      // 表格选中项
      this.selection = selection
    },
    selectable (row) {
      // 推送状态为已推送则复选框不可选择
      // 1 已推送，2 推送失败
      let { pushStatus = 1, thirdParty } = row
      return pushStatus === 2 && thirdParty
    },
    eventChange ({ prop, row }) {
      this[prop] && this[prop](row)
    },
    handlerLookDetail (row) {
      // type === 3 住院类数据
      const { code, orderType, type } = row

      this.$router.push({
        name: 'task',
        params: {
          code,
          orderType,
          type
        }
      })
    },
    reset () {
      this.queryObj = Object.assign({}, this.initQueryObj)
    }
  },
  watch: {
    queryObj: {
      handler: debounce(function () {
        // 第一次请求使用默认查询，以后执行query查询第一页
        if (!this.firstLoading) {
          this.list()
        } else {
          this.handleCurrentChange(1)
        }
      }),
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
.drugstore /deep/ .el-table.no-margin-table {
  margin-top: 0;
}
</style>
