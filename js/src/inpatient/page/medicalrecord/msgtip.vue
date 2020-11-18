<template>
  <div class="msg_tip">
    <el-row class="title"
            :gutter="10">
      <el-col :span="24">
        <i class="iconfont icon-tishixinxi title_icon"></i>提示消息
      </el-col>
    </el-row>
    <el-row class="content"
            :gutter="10">
      <el-col :span="11"
              class="center">
              <el-popover
                placement="bottom-start"
                title=""
                width="200"
                trigger="click"
                >
                <el-table :data="upcomingTimeoutData" width="100%">
                  <el-table-column  property="time" label="剩余时长" width="100">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{ scope.row.time }} {{ scope.row.timeUnitName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column  property="categoryName" label="病历名称" width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-button type="text" @click="openMedicalRecord(scope.row)">{{ scope.row.categoryName|showEnd }}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                 <el-badge :value="upcomingTimeoutSize"
                            class="item"
                            type="warning"
                            slot="reference">
                    <span>即将超时</span>
                  </el-badge>
              </el-popover>
      </el-col>
      <el-col :span="2">
        <i class="border">|</i>
      </el-col>
      <el-col :span="11"
              class="left">
              <el-popover
                placement="bottom"
                title=""
                width="200"
                trigger="click"
                >
                <el-table :data="timedoutData">
                  <el-table-column property="time" label="超时时长" width="100">
                    <template slot-scope="scope">
                      <span style="margin-left: 10px">{{ scope.row.time }} {{ scope.row.timeUnitName }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column  property="categoryName" label="病历名称" width="200" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <el-button type="text" @click="openMedicalRecord(scope.row)">{{ scope.row.categoryName|showEnd }}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                 <el-badge :value="timedoutSize"
                            class="item"
                            slot="reference">
                    <span>已经超时</span>
                  </el-badge>
              </el-popover>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import urlMap from '@/inpatient/urls'
// import templateManageUrl from '@/emr/urls'
import { request } from '@/util/req'
import storage from '@/util/storage'
export default {
  props: {
    patientId: {
      type: String
    },
    visitId: {
      type: String
    }
  },
  data () {
    return {
      upcomingTimeoutData: [],
      upcomingTimeoutSize: 0,
      timedoutData: [],
      timedoutSize: 0
    }
  },
  filters: {
    showEnd (val) {
      return val.split('/').slice(-1).join('')
    }
  },
  created () {
    this.getQualityControl()
    setInterval(() => {
      if (this.$route.path.indexOf('/resident/patientmgt/docs') !== -1) {
        this.getQualityControl()
      }
    }, 1000 * 60 * 5)// 5分钟同步一次数据
  },
  methods: {
    getQualityControl () {
      let params = {
        'tenantId': storage.getLocalStorage('TENANTID'),
        'orgId': storage.getLocalStorage('CLINICID'),
        'role': this.$route.meta ? this.$route.meta.qualityControl : null,
        'patientId': this.patientId,
        'visitId': this.visitId
      }
      request(urlMap.medicalRecord.qualityControl, params).then(res => {
        if (res.head.errCode === 0) {
          this.upcomingTimeoutData = res.data.upcomingTimeout.items
          this.upcomingTimeoutSize = res.data.upcomingTimeout.size
          this.timedoutData = res.data.timedOut.items
          this.timedoutSize = res.data.timedOut.size
        }
      })
    },
    menuSelect (obj) {
      // 0当前节点id，
      // 1是否提交，
      // 2病历名称，
      // 3病历模版id,
      // 4病历是否更新,
      // 5判断是不是实例是否可以引用模版,
      // 6模版类型name（确定在哪个节点上建立的病历）
      // 7,模版类型id
      // 8,模版code
      // 9，模版类型1表单2模版
      // 10，// 1-住院 2-门诊 3-护理
      // 11,模版关联id，通过templateScopeId可以知道当前模版在某个集团或者科室下面的门诊还是住院
      if (obj.code === 'ZHU_YUAN_BING_AN_SHOU_YE' && obj.isInstance) {
        this.curNode = {
          code: obj.code,
          type: 'bingli',
          id: obj.id,
          title: '病案首页',
          isUpdate: false,
          recordType: 1
        }
        this.$emit('menuSelect', this.curNode)
      } else if (obj.code === 'TI_WEN_DAN') {
        this.curNode = {
          code: obj.code,
          type: 'signentry',
          id: obj.id,
          title: obj.name,
          isUpdate: false,
          recordType: 3
          // name: 'sign',

        }
        this.$emit('menuSelect', this.curNode)
      } else if (obj.code === 'TI_WEN_JI_LU_DAN') {
        this.curNode = {
          code: obj.code,
          type: 'signcheck',
          id: 'TI_WEN_JI_LU_DAN',
          title: '体温单',
          isUpdate: false,
          recordType: 3
        }
        this.$emit('menuSelect', this.curNode)
      } else {
        this.curNode = {
          designerId: obj.designerId,
          id: obj.id,
          status: obj.status, // 提交状态1保存状态2是提交状态
          title: obj.name,
          type: 'bingli',
          formTemplateId: obj.formTemplateId,
          isUpdate: false,
          editable: false,
          isInstance: obj.isInstance,
          categoryName: obj.categoryName,
          categoryId: obj.categoryId,
          code: obj.code,
          recordType: Number(obj.type), // 需要判断病历是不是只读的，护士看医生病历，医生看护理文书
          templateScopeId: obj.templateScopeId,
          rootCode: obj.rootCode || obj.code
        }
        if (!this.curNode.isInstance) return false
        this.$emit('menuSelect', this.curNode)
      }
    },
    getInstanceInfo (medicalRecordId) {
      request(urlMap.medicalRecord.getInstance, {
        id: medicalRecordId
      }, 'get').then(res => {
        if (res.head.errCode === 0) {
          this.menuSelect(res.data)
        }
      })
    },
    openMedicalRecord (obj) {
      if (obj.medicalRecordId) {
        this.getInstanceInfo(obj.medicalRecordId)
        // 如果有病历id的情况
      } else {
        // 没有病历id，新建病历
        // obj.categoryCode
        this.$emit('quoteTpl', {code: obj.categoryCode})
        // request(templateManageUrl.templateManage.getCategoryId, {code: obj.code}).then(res => {
        //   if (res.head.errCode === 0) {
        //     // this.form.categoryId = res.data.id
        //     this.$emit('quoteTpl', res.data)
        //   }
        // })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.msg_tip {
  background: #f9f9f9;
  height: 60px;
  text-align: left;
  line-height: 30px;
  padding-left: 10px;
  border-bottom: 1px solid #ddd;

  color: #333333;
  .title {
    font-size: 14px;
    font-weight: bold;
  }
  .title_icon {
    margin-right: 10px;
    color: #666;
  }
  .content {
    font-size: 12px;
    .left {
      text-align: left;
    }
    .right {
      text-align: right;
    }
    /deep/.el-badge__content.is-fixed {
      transform: translateY(18%) translateX(153%);
    }
  }
}
</style>
