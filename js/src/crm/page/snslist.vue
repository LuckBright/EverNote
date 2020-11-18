<template>
  <div>
    <el-row>
      <el-col :span="20">
        <ever-form2
          v-model="queryObj"
          :schema="querySchema"
          :inline="true"
          :is-query="true"
          @query="list(true)">
          <template slot="times">
            <ever-range-picker :start.sync="queryObj.startTime" :end.sync="queryObj.endTime"></ever-range-picker>
          </template>
        </ever-form2>
      </el-col>
      <el-col :span="4" align="right">
        <el-button @click="sendMessage">发短信</el-button>
      </el-col>
    </el-row>
    <div class="main-wrap">
      <el-table class="flex_column_full_hidden" :data="tableData" :border="false" :stripe="false">
        <el-table-column prop="id" label="短信ID" width="200" align="center"></el-table-column>
        <el-table-column prop="senderName" label="发送人" width="150"></el-table-column>
        <el-table-column prop="orgName" label="发送机构" width="200"></el-table-column>
        <el-table-column prop="receiverName" label="接收人" width="150"></el-table-column>
        <el-table-column prop="deptName" label="科室" width="150"></el-table-column>
        <el-table-column prop="content" label="短信内容" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="发送时间" width="180" align="center"></el-table-column>
        <el-table-column label="发送状态" width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status ? '发送成功' : '发送失败' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="current"
    ></ever-pagination>
    <send-message2
      ref="sendmessage"
      :data="allparams"
      @sendMsgSuccess="list"
    ></send-message2>
  </div>
</template>
<script>
import snsApi from '../store/snsapi'
import utillist from '../../util/list'
import sendMessage2 from '@/crm/page/sendmessage2'
import memberApi from '@/crm/store/memberapi'
import urlMap from '@/msgcenter/store/urls'
import { request } from '@/util/req'

let querySchema = [
  {
    name: 'times',
    label: '发送时间',
    comp: 'custom'
  },
  {
    name: 'status',
    label: '状态',
    comp: 'el-select',
    props: {
      placeholder: '选择发送状态',
      filterable: true,
      clearable: true,
      valueKey: 'name',
      options: [
        { id: '1', name: '发送成功' },
        { id: '0', name: '发送失败' }
      ]
    }
  }
]
export default {
  mixins: [utillist],
  data () {
    let queryObj = this.$ever.createObjFromSchema(querySchema)
    queryObj.times = []
    queryObj.createTime = ''
    queryObj.endTime = ''
    queryObj.receiverId = this.$route.params.patientId
    queryObj.optType = 0
    return {
      snsApi,
      querySchema,
      queryObj,
      tableData: [],
      selected: [],
      allparams: {}
    }
  },
  created () {
    this.$bus.$on('common:patientObj', val => {
      this.selected = [val]
    })
    memberApi.getBaseInfoById1({ patientId: this.$route.params.patientId }).then(res => {
      if (res && res.data) {
        let resData = res.data
        Object.assign(this.allparams, {
          msgType: 110, // 想要发动短信所属的大分类 必传
          ccMobiles: '', // 抄送人手机号 分号隔开'18618453594;18618453594;18618453594', 不传显示为空 非必传
          receivers: [
            {
              id: this.$route.params.patientId,  // patientId 必传
              name: resData.name,  // patientName 必传
              mobile: resData.mobile  // 手机号 必传 业务方决定用哪个手机号
            }
          ],
        })
      }
    })
    this.list()
  },
  methods: {
    sendMessage () {
      this.$refs.sendmessage.sendVisible = true
    },
    list () {
      request(urlMap.msg.sms.getRecordList, this.queryObj).then(res => {
        if (res.head.errCode === 0) {
          this.tableData = res.data.resultList
        }
      })
    }
  },
  components: {
    sendMessage2
  }
}
</script>
