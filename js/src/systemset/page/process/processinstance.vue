<template>
  <div class="layout_inner oa">
    <div class="main-head js-main-head">
      <ever-form2
        v-model="queryObj"
        ref="form"
        :schema="querySchema"
        :inline="true"
        :is-query="true"
      >
        <template slot="default">
          <el-form-item>
            <el-button size="small" type="primary" @click="list()">查询</el-button>
          </el-form-item>
        </template>
        <template slot="processKey">
          <el-select v-model="queryObj.processKey">
            <el-option
              v-for="item in processList"
              :key="item.id"
              :value="item.processKey"
              :label="item.processName"></el-option>
          </el-select>
        </template>
        <template slot="type">
          <sys-type
            v-model="queryObj.type" code="THC_SYS_BUSINESS" use-object obj-simple @change="changeType"></sys-type>
        </template>
      </ever-form2>
    </div>
    <ever-table
      ref="table"
      :columns="columns"
      :url="url"
      primary-key="instanceId"
      fixed-elements="js-main-head"
      :params.sync="queryObj"
      :before-list="beforeList"
      @assign="assign"
      @detail="detail"
      @revoke="revoke"
    >
    </ever-table>
    <el-dialog :visible.sync="revokeDialog" :title="'撤销流程'">
      <el-input v-model="remark" placeholder="请填写撤销备注" type="textarea"></el-input>
      <div slot="footer">
        <el-button type="primary" @click="submitRevoke" :disabled="!remark">确定</el-button>
      </div>
    </el-dialog>
    <user-search-dialog :visible.sync="dialogVisible" @handleSubmit="delegateUser"></user-search-dialog>
    <!--    <el-dialog :visible.sync="detailDialog" :title="'流程详细'">-->
    <!--      <template v-if="detailItem">-->
    <!--        -->
    <!--      </template>-->
    <!--    </el-dialog>-->
    <!--    <div class="instance-list">-->
    <!--      <div class="empty" v-if="resultList.length === 0">-->
    <!--        暂无数据-->
    <!--      </div>-->
    <!--      <div v-else>-->
    <!--        <ul class="instance-list-img-ul">-->
    <!--          <li v-for="(item, index) in resultList" :key="index">-->
    <!--            <p>启动时间：{{item.startTime}}</p>-->
    <!--            <img :src="item.src" :alt="item.src">-->
    <!--          </li>-->
    <!--        </ul>-->
    <!--        <el-pagination-->
    <!--          :page-sizes="[2]"-->
    <!--          :page-size="2"-->
    <!--          layout="total, prev, pager, next"-->
    <!--          @prev-click="prevClick"-->
    <!--          @next-click="nextClick"-->
    <!--          @current-change="currentChange"-->
    <!--          :total="totalCount">-->
    <!--        </el-pagination>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>
<script>
  import { request } from '@/util/req'
  import urlMap from '@/systemset/urls'
  import '@/systemset/page/process/index.less'
  import { dateFormat } from '@/util/common'
  import userSearchDialog from '@/components/usersearchdialog'

  const processTypeList = [
    {
      id: '1',
      name: '正在运行中',
    },
    {
      id: '2',
      name: '历史',
    },
  ]
  const querySchema = [
    {
      name: 'processType',
      label: '流程类型',
      comp: 'select',
      props: {
        clearable: false,
        options: processTypeList,
      },
    },
    {
      name: 'processKey',
      label: '流程名称',
      comp: 'custom',
    },
    {
      name: 'type',
      label: '流程分类',
      comp: 'custom',
    },
    {
      name: 'timeRange',
      label: '时间范围',
      comp: 'date-picker',
      props: {
        type: 'datetimerange',
      },
    },
    {
      name: 'startUserId',
      label: '启动用户',
      comp: 'ever-staff-select',
      props: {
        params: {
          everQueryType: 'out',
        },
      },
    },
    {
      name: 'businessCode',
      label: '业务编码',
    },
  ]
  export default {
    components: { userSearchDialog },
    data: function () {
      const queryObj = this.$ever.createObjFromSchema(querySchema)
      queryObj.processType = '1'
      queryObj.typeCode = ''
      queryObj.typeName = ''
      queryObj.startTime = ''
      queryObj.endTime = ''
      return {
        dialogVisible: false,
        // detailSrc: '',
        remark: '',
        revokeItem: null,
        // detailItem: null,
        revokeDialog: false,
        // detailDialog: false,
        querySchema,
        queryObj,
        resultList: [],
        processList: [],
        url: urlMap.process.getUseInstanceImg,
        columns: [
          {
            prop: 'processName',
            label: '流程名称',
          },
          {
            prop: 'businessCode',
            label: '业务编码',
          },
          {
            prop: 'startUserName',
            label: '启动用户',
          },
          {
            prop: 'startTime',
            label: '启动时间',
          },
          {
            prop: 'op',
            label: '操作',
            type: 'btns',
            btns ({ row }) {
              return [
                ...(row.processType === '1' ? [ {
                  prop: 'assign',
                  label: '委派',
                }, {
                  prop: 'revoke',
                  label: '撤销',
                } ] : []),
                {
                  prop: 'detail',
                  label: '详情',
                },
              ]
            },
          },
        ],
      }
    },
    created () {
      request(urlMap.process.getProcesses).then(res => {
        this.processList = res.data
      })
    },
    mounted () {
    },
    methods: {
      delegateUser (user) {
        // 获取taskId
        request(urlMap.process.getInstanceInfoById, {processInstanceId: this.assignItem.instanceId}).then(res => {
          if (res.head.errCode === 0) {
            if (res.data && res.data.length) {
              const taskId = res.data[res.data.length - 1].taskId
              request(urlMap.process.delegate, {
                'targetUserId': user.id,
                taskId,
              }).then(res => {
                if (res.head.errCode === 0) {
                  this.$messageTips(this, 'success', '流程委派成功')
                  this.dialogVisible = false
                  this.list()
                }
              })
            }
          }
        })
      },
      submitRevoke () {
        if (!this.remark || !this.revokeItem) {
          return false
        }
        request(urlMap.process.deleteProcessByBusinessCode, {
          businessCode: this.revokeItem.businessCode,
          remark: this.remark,
        }).then(res => {
          if (res.head.errCode === 0) {
            this.$messageTips(this, 'success', '流程撤销成功')
            this.list()
            this.revokeDialog = false
            this.remark = ''
            this.revokeItem = null
          }
        })
      },
      assign ({ row }) {
        this.assignItem = row
        this.dialogVisible = true
      },
      detail ({ row }) {
        // this.detailDialog = true
        // this.detailItem = row
        // this.detailSrc = `${this.$ever.api}/process-engine/ext/process/getInstanceImgResource?processInstanceId=${row.instanceId}`
        this.$router.push({
          name: 'sysprocessinstancedetail',
          params: { instanceId: row.instanceId, processType: row.processType },
        })
      },
      revoke ({ row }) {
        this.revokeItem = row
        this.revokeDialog = true
      },
      beforeList () {
        if (this.queryObj.timeRange) {
          if (this.queryObj.startTime !== dateFormat(this.queryObj.timeRange[0])) {
            this.queryObj.startTime = dateFormat(this.queryObj.timeRange[0])
          }
          if (this.queryObj.endTime !== dateFormat(this.queryObj.timeRange[1])) {
            this.queryObj.endTime = dateFormat(this.queryObj.timeRange[1])
          }
        } else {
          this.queryObj.startTime = ''
          this.queryObj.endTime = ''
        }
        // 如果有 timeRange 却没有 startTime endTime 则不发送请求
        if (this.queryObj.timeRange &&
          this.queryObj.timeRange[0] &&
          this.queryObj.timeRange[1]
        ) {
          const tempStart = dateFormat(this.queryObj.timeRange[0])
          const tempEnd = dateFormat(this.queryObj.timeRange[1])
          return tempStart === this.queryObj.startTime && tempEnd === this.queryObj.endTime
        }
        return true
      },
      list () {
        // const params = Object.assign({}, this.queryObj)
        // if (this.queryObj.timeRange) {
        //   params.startTime = dateFormat(this.queryObj.timeRange[0])
        //   params.endTime = dateFormat(this.queryObj.timeRange[1])
        // }
        // request(urlMap.process.getUseInstanceImg, params).then(res => {
        //   this.resultList = res.data ? res.data.map(item => ({
        //     ...item,
        //     src: `${this.$ever.api}/process-engine/ext/process/getInstanceImgResource?processInstanceId=${item.instanceId}`,
        //   })) : []
        //   this.totalCount = res.totalCount
        // })
        this.$refs.table.list()
      },
      changeType (type) {
        this.queryObj.typeCode = type.code
        this.queryObj.typeName = type.name
      },
    },
  }
</script>
<style scoped lang="less">
</style>
