<template>
  <div class="manage-comp">
    <p class="created-btn">
      <el-button type="primary" @click="openCreatedLive(true)">创建直播</el-button>
    </p>
    <el-table
      :data="tableData"
      border
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        label="序号"
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="liveTitle"
        label="开播标题"
        width="350"
        show-overflow-tooltip
        >
      </el-table-column>
      <el-table-column
        prop="doctorName"
        label="直播医生"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="开播时间"
        width="180">
      </el-table-column>
      <el-table-column
        label="状态"
        width="100">
        <template slot-scope="scope">
          {{status[scope.row.auditStatus]}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button :disabled="!(scope.row.auditStatus === 2 || scope.row.auditStatus === 3)" type="text" @click="goLivePage(scope.row)">进入直播间</el-button>
          <el-button
            :disabled="scope.row.auditStatus !== 2"
            type="text"
            v-clipboard:copy="scope.row.address"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
          >复制链接</el-button
          >
          <el-button :disabled="!(scope.row.auditStatus === 2 || scope.row.auditStatus === 3)" type="text" @click="getLivePreview(scope.row)">预览</el-button>
          <el-button type="text" :disabled="!(scope.row.auditStatus === 2 || scope.row.auditStatus === 3)" @click="outLive(scope.row)">结束直播</el-button>
          <el-button :disabled="scope.row.auditStatus !== 1" type="text" @click="ideaBtn(scope.row.auditReason)">审核意见</el-button>
          <el-button type="text" :disabled="scope.row.placeTop !== 0" @click="placeTop(scope.row.id)">推荐到首页</el-button>
          <el-button type="text" :disabled="scope.row.placeTop !== 1" @click="placeDown(scope.row.id)">取消推荐到首页</el-button>
          <el-button type="text" @click="goLivePage(scope.row, '3')">带货数据</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      background
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>
    <el-dialog
      :title="createLiveName"
      :visible.sync="createdLiveDialog"
      width="50%"
      class="dialog-pd"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      >
      <create-live v-if="createdLiveDialog" ref="createLiveRef" :liveInfo="liveInfo"
      ></create-live>
      <p class="send-btn" style="padding-left:175px">
        <el-button type="primary" @click="sendInfo" :disabled="isCreateLiveBtn">保存</el-button>
        <el-button @click="createdLiveDialog = false">取消</el-button>
      </p>
    </el-dialog>
    <el-dialog
      title="审核意见"
      :visible.sync="ideaDialog"
      width="30%"
      class="dialog-pd"
    >
      <p>
        {{auditReason}}
      </p>
      <p>
        <el-button @click="ideaDialog = false" type="primary">确认</el-button>
      </p>
    </el-dialog>
    <el-dialog class="dialog-pd" title="结束直播" :visible.sync="outLiveDialog" width="30%">
      <p>
        确认结束直播？
      </p>
      <p>
        <el-button type="primary" @click="endLiveBtn" :loading="loading">确认</el-button>
      </p>
    </el-dialog>
  </div>
</template>
<script>
import createLive from './create.live'
import api from '@/titancare/api/content/live'
import { requestIh } from '@/util/req'
import urlMap from '@/titancare/utils/urls.js'
import { prviewSimulationMobile } from '@/util/common'

export default {
  components: {
    createLive
  },
  data () {
    return {
      tableData: [],
      createdLiveDialog: false,
      ideaDialog: false,
      createLiveName: '',
      liveInfo: {},
      outLiveDialog: false,
      status: {
        0: '待审核',
        1: '审核不通过',
        2: '待直播',
        3: '直播中',
        4: '直播结束'
      },
      auditReason: '',
      rowId: '',
      imSig: {},
      tenantId: localStorage.getItem('TENANTID'),
      loading: false,
      isCreateLiveBtn: false,
      currentPage: 1,
      pagesize: 10,
      totalCount: 0
    }
  },
  created () {
    this.getSig()
    this.getImgCdn()
  },
  methods: {
    handleSizeChange (val) {
      this.pagesize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.list()
    },
    getSig () {
      requestIh(urlMap.live.getLiveUserForDoctor, {}, 'get').then(rs => {
        if (rs.head.errCode === 0) {
          this.imSig = rs.data
        }
        this.handleCurrentChange(1)
      })
    },
    list () {
      this.loading = true
      let params = {
        pagesize: this.pagesize,
        offset: (this.currentPage - 1) * this.pagesize,
        tenantId: localStorage.getItem('TENANTID')
      }
      requestIh(urlMap.live.getLiveRecordList, params).then(rs => {
        if (!rs.errCode) {
          this.totalCount = rs.data.totalCount
          rs.data.resultList.forEach(item => {
            if (item.liveRoom && item.liveRoom.roomId) {
              item.address = `${this.$ever.host}${this.$ever.unionIndex}/mplogin?redirectUrl=/group-im/index&liveId=${item.id}&share=2`
            } else {
              item.address = ''
            }
          })
          this.tableData = rs.data.resultList
          this.loading = false
        }
      })
    },
    getLivePreview (row) {
      prviewSimulationMobile(row.address, '直播')
    },
    /**
     * 获取带货商品图片域名
     * */
    getImgCdn () {
      requestIh(urlMap.auth.token, {}, 'get').then(rs => {
        if (!rs.errCode) {
          localStorage.setItem('IMGCDN', `https://${rs.data.cdn}`)
        }
      })
    },
    /***
     * 进入直播
     * */
    goLivePage (row, activeName = '1') {
      let liveRoom = {
        userId: this.imSig.userID,
        userSig: this.imSig.userSig,
        roomId: row.liveRoom.roomId,
        'm3u8': row.pullStreamM3u8Url,
        id: row.id,
        appId: this.imSig.SDKAppID,
        streamName: row.streamName,
        _liveRoom: row.liveRoom,
        _im: this.imSig,
        activeName
      }
      this.$router.push({ name: 'livepage', query: { liveRoom: JSON.stringify(liveRoom) } })
    },
    /**
     * 创建直播
     * status true 创建直播 false 编辑直播
     * */
    openCreatedLive (status, row) {
      this.liveInfo = {}
      if (status) {
        this.createLiveName = '创建直播'
        this.liveInfo = { isEdit: true, tenantId: localStorage.getItem('TENANTID') }
      } else {
        this.createLiveName = '直播编辑'
        let obj = { ...row }
        obj.isEdit = false

        this.liveInfo = { ...obj, tenantId: localStorage.getItem('TENANTID') }
      }
      this.createdLiveDialog = true
    },
    sendInfo () {
      let obj = { ...this.$refs.createLiveRef.liveObj }
      if (obj.isEdit) {
        this.isCreateLiveBtn = true
        api.liveCreateLiveRecord(obj).then(rs => {
          if (!rs.errCode) {
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.handleCurrentChange(1)
            this.createdLiveDialog = false
          } else {
            obj.videoFaceUrl = ''
          }
          setTimeout(() => {
            this.isCreateLiveBtn = false
          }, 1000)
        })
      } else {
        api.updateLiveRecord(obj).then(rs => {
          if (!rs.errCode) {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.handleCurrentChange(1)
            this.createdLiveDialog = false
          }
        })
      }
    },
    /**
     * 审核意见
     * */
    ideaBtn (info) {
      this.auditReason = info
      this.ideaDialog = true
    },
    /**
     * 复制
     * */
    onCopy () {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    onError () {
      this.$message.error('复制失败')
    },
    /**
     * 结束直播
     * */
    outLive (row) {
      this.rowId = row.id
      this.outLiveDialog = true
    },
    endLiveBtn () {
      this.loading = true
      api.endLive(this.rowId).then(rs => {
        if (!rs.errCode) {
          this.$message({
            message: '结束成功',
            type: 'success'
          })
          this.outLiveDialog = false
        }
        this.handleCurrentChange(1)
      })
    },
    /**
     * 取消置顶
     * */
    placeDown (id) {
      this.loading = true
      api.placeDown({ id }).then(rs => {
        if (!rs.errCode) {
          this.$message({
            message: '取消成功',
            type: 'success'
          })
        }
        this.handleCurrentChange(1)
      })
    },
    /**
     * 置顶
     * */
    placeTop (id) {
      this.loading = true
      api.placeTop({ id }).then(rs => {
        if (!rs.errCode) {
          this.$message({
            message: '成功',
            type: 'success'
          })
        }
        this.handleCurrentChange(1)
      })
    }
  }
}
</script>
<style lang="less" scoped>
  .manage-comp {
    .created-btn {
      margin-top: 0;
      text-align: right;
    }
  }
  .pagination {
    text-align: right;
  }
  .dialog-pd {
    /deep/ .el-dialog__body {
      padding: 0 20px 20px;
    }
    .send-btn {
      box-sizing: border-box;
      padding-left: 135px;
    }
  }
</style>
