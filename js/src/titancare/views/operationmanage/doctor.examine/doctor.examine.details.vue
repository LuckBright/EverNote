<template>
  <div v-loading.body="loading" id='examine-box'>
    <ever-bread-crumb name="审核详情" is-custom-back @back="topTitleClick"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="basic_info_container">
        <div>
          <p>手机号:</p>
          <p>{{json.mobile}}</p>
        </div>
        <div>
          <p >申请时间:</p>
          <p>{{json.applyTime}}</p>
        </div>
        <div>
          <p>申请执业医院:</p>
          <p>{{json.tenantName}}</p>
        </div>
      </div>
      <div style="padding: 0 20px;">
        <el-tabs v-model="activeName">
          <el-tab-pane label="申请信息" name="first">
            <examine-info :data="json" ref="authentication"></examine-info>
          </el-tab-pane>
          <el-tab-pane label="操作日志" name="third">
            <operation-log :data="json"></operation-log>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/titancare/api/operation/index'
import ExamineInfo from './examine.info'
import OperationLog from './operation.log'

export default {
  data () {
    return {
      api,
      moreBtn: false,
      activeName: 'first',
      loading: false,
      json: {},
      isExtension: false
    }
  },
  components: {
    ExamineInfo,
    OperationLog
  },
  methods: {
    getInfo () {
      this.loading = true
      // 判断是否从推广统计页面跳转
      let params = this.isExtension ? { docAccountIds: [this.$route.query.id] } : { ids: [this.$route.query.id] }
      api.searchCertDoctor(params).then(rs => {
        this.loading = false
        if (!rs.errCode && rs.data.resultList.length) {
          this.json = rs.data.resultList[0]
          this.json.idCardFile = Array.isArray(this.json.idCardFile) ? this.json.idCardFile.map(item => { return item.value }).join() : ''
          this.json.pracFile = Array.isArray(this.json.pracFile) ? this.json.pracFile.map(item => { return item.value }).join() : ''
          this.json.gradFile = Array.isArray(this.json.gradFile) ? this.json.gradFile.map(item => { return item.value }).join() : ''
          this.json.certFile = Array.isArray(this.json.certFile) ? this.json.certFile.map(item => { return item.value }).join() : ''
          this.json.breastpieceFile = Array.isArray(this.json.breastpieceFile) ? this.json.breastpieceFile.map(item => { return item.value }).join() : ''
          this.json.label = this.json.label ? this.json.label.split(',') : []
        }
      }, rj => {
        this.$notify.error({
          message: '获取数据失败'
        })
        this.loading = false
      })
    },
    topTitleClick () {
      this.$router.push({ path: '/titancare/operation/doctor', query: this.$route.query })
    },
    goBack () {
      this.topTitleClick()
    }
  },
  created () {
    if ('source' in this.$route.query) {
      this.isExtension = true
    }
    this.getInfo()
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.goBack, false)
    }
  },
  watch: {
    '$route.query.query.id': {
      handler: function (val, oldval) {
        if (val) {
          this.id = this.$route.query.id
          this.getInfo()
        }
      },
      deep: true
    }
  },
  destroyed () {
    window.removeEventListener('popstate', this.goBack, false)
  }
}
</script>
<style lang="less" scoped>
  .layout_inner {
    box-shadow: none;
    border-radius: 0;
    /*height: 100%;*/
    padding-bottom: 20px;
  }
  .more_container {
    display: flex;
    .more_l {
      flex: 1;
      border-right: 2px solid #e4e7ed;
      border-bottom: 2px solid #e4e7ed;
      padding: 20px 20px 0 0;
      & /deep/ .el-input {
        width: 100%;
      }
      & /deep/ .el-select {
        width: 100%;
      }
    }
    .more_r {
      flex: 1;
      padding: 20px 20px 0 0;
      border-bottom: 2px solid #e4e7ed;
      & /deep/ .el-row .el-col label::before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
    }
  }
  .basic_info_container {
    display: flex;
    div {
      margin-left: 20px;
      & p:first-child {
        color: #606266;
      }
    }
  }
</style>
