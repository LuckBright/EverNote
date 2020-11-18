<template>
  <!-- 诊间随访 -->
  <el-dialog
    :visible.sync="visible"
    class="ui_dialog_0 spe add-follow"
    :close-on-click-modal="false"
    width="1200px"
  >
    <template slot="title">
      <div style="padding:10px 0 0 10px;">添加随访</div>
    </template>
    <div class="follow-patient" v-if="!isMember">
      <patient-baseinfo :patient="patient" :isOpen="visible"></patient-baseinfo>
      <patient-tasklist :patientObj="patientObj" :isOpen="visible"></patient-tasklist>
    </div>
    <Followtemplatedeteil
      :isInterclinic="isInterclinic"
      :isMember="isMember"
      @getTempId="getTempId"
      :isOpen="visible"
      :patientObj="patientObj"
    ></Followtemplatedeteil>
    <div class="footer">
      <el-button
        size="small"
        type="primary"
        v-ever-click-once="addFree"
        :disabled="addFree"
        @click="addFreeJob"
      >添加</el-button>
      <el-button size="small" type @click="closeDialog">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Followtemplatedeteil from './followtasklist.vue'
import patientTasklist from '@/follow/page/template/patient-task-list.vue'
import patientBaseinfo from '@/follow/page/template/patient-baseinfo.vue'
import { request } from '@/util/req'
import urlMap from '@/util/urls'
import memberapi from '@/crm/store/memberapi'
export default {
  components: {
    Followtemplatedeteil, patientTasklist, patientBaseinfo
  },
  props: {
    isMember: { // 是否是会员模块使用
      type: Boolean,
      default: false
    },
    isInterclinic: { // 是否是会员模块使用
      type: Boolean,
      default: false
    },
    patientIds: { // 是否是会员模块使用
      type: String,
      default: ''
    },
  },
  data () {
    return {
      visible: false,
      addFree: false,
      patientObj: {}, // 门急诊工作站传入
      patient: {},
      templateId: '',
      templateNodesDto: {
        id: '',
        nodeInfoList: []
      }
    }
  },
  created () {
  },
  watch: {
    'visible' (val) {
      if (!val) {
        this.patientObj = {}
      }
    }
  },
  methods: {
    open (val) {
      this.visible = true
      if (val) {
        this.patientObj = val
        // console.log(val, 'open')
        // this.patientObj = {
        //   patientId: 'Gjlu0LtA2Z5p2g4PFxb',
        //   providerId: '2fc3c311-e0db-4320-b3bf-d16764bf531e',
        //   providerName: '产科门诊',
        //   visitNumber: 'OP20190000002982',
        //   patient: {
        //     birthday: 317923200000,
        //     mobile: '15677788888',
        //     name: '路小路',
        //     sex: 1
        //   }
        // }
        if (this.patientObj && this.patientObj.patientId) {
          this.getUserAvtInfo(this.patientObj.patientId)
        }
      }
    },
    getUserAvtInfo (patientId) {
      memberapi.getBaseInfoById1({
        patientId: patientId
      }).then(res => {
        this.patient = res.data
      })
    },
    close () {
      this.visible = false
    },
    addFreeJob () {
      let params = {
        orgId: this.$store.state.currentUser.organizationId,
        orgName: this.$store.state.currentUser.organizationName,
        patientDeptIds: this.patientObj.providerId || '',
        patientDeptNames: this.patientObj.providerName || '',
        patientId: this.patientObj.patientId || this.patientIds,
        visitNumber: this.patientObj.visitNumber || '',
        templateId: this.templateId
      }
      this.sendTask(params)
    },
    sendTask (params) {
      request(this.isInterclinic ? urlMap.follow.task.freeJob : urlMap.follow.task.cunoinFreeJob, params).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '添加成功!')
          if (this.isMember) {
            this.$bus.$emit('addmemberfollow', true)
          }
          this.close()
        }
      })
    },
    closeDialog () {
      this.close()
    },
    getTempId (val) {
      this.templateId = val
    },
    reload () {
      this.close()
      this.$emit('reload')
    }
  }
}
</script>
<style scoped></style>

