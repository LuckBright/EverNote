<template>
  <div class="template-appoint">
    <el-select v-model="templateIdData" size="small" style="width:100%" :multiple="true">
      <el-option v-for="(item, i) in tableData" :key="i" :value="item.id" :label="item.name"></el-option>
    </el-select>
  </div>
</template>
<script>
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import '@/follow/assets/base.less'
import '@/follow/assets/index.less'
export default {
  props: ['deptId', 'patientObj', 'value'],
  data () {
    return {
      visible: false,
      tableData: [],
      totalCount: '',
      offset: 0,
      pagesize: 5,
      currentPage: 1,
      templateId: '',
      templateIdData: [],
      current: 1,
      params: {
        deptId: '2fc3c311-e0db-4320-b3bf-d16764bf531e',
        sysnodeMark: 1 // 预约完成事件
      },
      url: urlMap.follow.template.findByCriteria
    }
  },
  watch: {
    'value' (val) {
      this.templateIdData = val
    },
    'deptId' (val) {
      if (val) {
        this.deptId = val
        this.getTemplateList()
      }
    },
    'templateIdData': {
      handler (val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  created () {
    this.getTemplateList()
    this.$bus.$off('appoint:question')
    this.$bus.$on('appoint:question', val => {
      if (val && this.templateIdData && this.templateIdData[0]) {
        let params = {
          orgId: this.$store.state.currentUser.organizationId,
          orgName: this.$store.state.currentUser.organizationName,
          patientDeptIds: val.deptId,
          patientDeptNames: val.deptName,
          patientId: val.patientId,
          templateIds: this.templateIdData,
          visitNumber: val.visitNumber,
          doctorId: val.doctorId,
          doctorName: val.doctorName,
          dateStr: val.dateStr,
          startTimeStr: val.startTimeStr
        }
        this.dealFreeJob(params)
      }
    })
  },
  methods: {
    handleCurrentChange (val) {
      this.currentPage = val
      this.getTemplateList()
    },
    // 查询某个科室下的可用模板
    getTemplateList () {
      let params = {
        pagesize: 4,
        status: 1, // 启用模板
        currentPage: this.currentPage,
        deptId: this.deptId,
        sysnodeMark: 1, // 预约完成事件
        isSystem: 1 // 预约完成事件
      }
      if (params.deptId) {
        request(urlMap.follow.template.findByCriteria, params).then(res => {
          if (res.data && res.data.resultList && res.data.resultList[0]) {
            this.tableData = res.data.resultList
            this.totalCount = res.data.totalCount
            // this.templateId = res.data.resultList[0].id
          }
        })
      }
    },
    open (val) {
      this.visible = true
      if (val) {
        this.patientObj = val
      }
    },
    close () {
      this.visible = false
    },
    dealFreeJob (params) {
      request(urlMap.follow.task.dealFreeJob, params).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '添加成功！', '提示')
          this.templateIdData = []
          this.close()
        }
      })
    },
    eventChange ({ prop, row }) {
      this[prop] && this[prop](row)
    }
  },
}
</script>
<style lang="less" scoped>
.follow-appoint-dialog.ui_dialog_02 {
  .fz14 {
    font-size: 14px;
    font-weight: normal;
  }
}
</style>

