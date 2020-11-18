<template>
  <div>
    <el-popover
      placement="bottom"
      v-model="taskVisible"
      @show="handleShow"
      width="500"
      visible-arrow="true"
      trigger="manual"
      :open-delay="500">
      <div class="layout_box task_box spe">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="当前待办" name="first">
            <ever-table
              ref="table"
              border
              :url="url"
              :columns="columns"
              :is-record-url-params="false"
              :tablePageSize="10"
              layout="total, prev, next, jumper"
              @eventChange="eventChange"
            ></ever-table>
          </el-tab-pane>
          <el-tab-pane label="历史待办" name="second">
            <ever-table
              ref="histable"
              border
              :url="hisurl"
              :columns="columnshis"
              :is-record-url-params="false"
              :tablePageSize="10"
              layout="total, prev, next, jumper"
              @eventChange="eventChange"
            ></ever-table>
          </el-tab-pane>
        </el-tabs>

      </div>
      <el-badge :is-dot="isNeed" slot="reference">
        <span @click="taskVisible = !taskVisible"><i class="iconfont icon-wudaiban"></i></span>
      </el-badge>
    </el-popover>
    <user-search-dialog :visible.sync="dialogVisible" @handleSubmit="delegateUser"></user-search-dialog>
  </div>
</template>

<script>
import urlMap from '@/systemset/urls'
import { request } from '@/util/req'
import staticvars from '@/store/staticvars'
import userSearchDialog from '@/components/usersearchdialog'

export default {
  data () {
    return {
      activeName: 'first',
      taskVisible: false,
      isNeed: false,
      initstorageId: '',
      storageId: '',
      storageItem: [],
      url: urlMap.process.getToDoTask,
      hisurl: urlMap.process.getToHisDoTask,
      dialogVisible: false,
      currentRow: {},
      currentKey: new Date().getTime(),
      selectUser: {},
      columns: [
        {
          prop: 'processName',
          label: '审批名称',
        },
        {
          prop: 'startUserName',
          label: '发起人',
        },
        {
          prop: 'startTime',
          label: '时间',
          width: 160
        },
        {
          prop: 'ever-op', // 该列的唯一标示
          type: 'btns',
          width: 120,
          label: '操作',
          btns: ({ row }) => {
            let baseBtns = [
              {
                prop: 'open',
                label: '去处理'
              },
              {
                prop: 'handleDelegate',
                label: '委派'
              },
            ]
            return baseBtns
          },
        },
      ],
      columnshis: [
        {
          prop: 'processName',
          label: '审批名称',
        },
        {
          prop: 'startUserName',
          label: '发起人',
        },
        {
          prop: 'startTime',
          label: '时间',
          width: 160
        },
        {
          prop: 'ever-op', // 该列的唯一标示
          type: 'btns',
          width: 120,
          label: '操作',
          btns: ({ row }) => {
            let baseBtns = [
              {
                prop: 'hisopen',
                label: '去查看'
              }
            ]
            return baseBtns
          },
        },
      ],
      params: {
        everQueryType: 'out',
      }
    }
  },
  created () {
    this.getNeedList()
  },
  methods: {
    handleClick () {
      console.log('histable')
    },
    list () {
      this.$refs.table.list()
      this.$refs.histable.list()
    },
    eventChange ({ prop, row }) {
      this[prop](row)
    },
    handleShow () {
      this.list()
    },
    // 是否需要显示气泡
    getNeedList () {
      request(urlMap.process.getToDoTask, {
        'pagesize': 2,
        'offset': 0
      }).then(res => {
        if (res.head.errCode === 0) {
          if (res.data && res.data.length > 0) {
            this.isNeed = true
          }
        }
      })
    },
    // 呼出选择委派人弹窗
    handleDelegate (row) {
      this.dialogVisible = true
      this.currentRow = row
    },
    // 选中人之后 调用流程委派接口
    delegateUser (user) {
      request(urlMap.process.delegate, {
        'targetUserId': user.id,
        'taskId': this.currentRow.taskId
      }).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '流程委派成功')
          this.dialogVisible = false
          this.list()
        }
      })
    },
    hisopen (row) {
      let _processUrl = this.$ever.systemsetIndex + '/approval/' + row.processInstanceId
      window.open(_processUrl)
    },
    // 逻辑调整为可以根据某些值来确定跳到什么地址，by lvjiangtao@everjiankang.com  后端逻辑 zhuhongwei@everjiankang.com
    // 每个流程数据内 variables 内的nodeIds 会有一个逗号分割的字符串，如果当前要办理的节点(isCurrentNode === 1)对应的activityId 属于nodeIds内的
    // 就跳转到 variables 内的 formUrl 同时多拼一个 taskId进去，否则就跳到公共的审批页面
    async open (row) {
      let _processUrl = this.$ever.systemsetIndex + '/approval/' + row.processInstanceId
      let tmp = row
      tmp.variables.forEach(element => {
        if (element.name === 'nodeIds') {
          tmp.nodeIds = element.text
        }
        if (element.name === 'formUrl') {
          tmp.formUrl = element.text
        }
      })
      let approvalName = ''
      let res = await request(urlMap.process.getInstanceInfoById, {
        'processInstanceId': row.processInstanceId,
      })
      if (res.head.errCode === 0) {
        res.data.forEach(item => {
          if (item.isCurrentNode === 1) {
            approvalName = item.activityId
          }
        })
        if (tmp.nodeIds && tmp.nodeIds.includes(approvalName)) {
          _processUrl = staticvars.prefix + tmp.formUrl + '&taskId=' + row.taskId
        }
      }
      window.open(_processUrl)
    },
  },
  components: {
    userSearchDialog
  }
}
</script>
<style lang="scss" scoped>
.el-badge {
  line-height: 18px;
}
</style>
