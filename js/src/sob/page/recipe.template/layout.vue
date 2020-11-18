<template>
  <div class="flex_layout_full oh">
    <div class="layout_inner" style="width: 100%">
      <el-tabs v-model="tplType">
        <el-tab-pane label="个人模版" name="1"></el-tab-pane>
        <el-tab-pane v-if="role === '1'" label="科室模版" name="2"></el-tab-pane>
        <el-tab-pane v-if="role === '2'" label="病区模版" name="3"></el-tab-pane>
      </el-tabs>
      <tpl :tpl-type="tplType" :visit-type="visitType" :jurisdict="jurisdictData" :role="role"></tpl>
    </div>
  </div>
</template>

<script>
import storage from '@/util/storage'
import api from '@/sob/store/tmpl.api.js'
import tpl from './tpl.vue'

export default {
  data () {
    return {
      tplType: this.$route.query.type || storage.getLocalStorage('prescriptionTemplateType') || '1',
      visitType: this.$route.params.visitType ? parseInt(this.$route.params.visitType) : '',
      userId: this.$store.state.currentUser.userId,
      jurisdictData: [] // 管理区域
    }
  },
  created () {
    let sceneGroup = {
      'resident': 3, // 住院医生工作站
      'birth_doctors': 7, // 产房医生工作站
      'workspace': 1, // 门急诊医生工作站
      'ana': 6, // 麻醉医生工作
      'csa': 6 // 临床手术麻醉 门急诊手术工作站 手术室护士工作站
    }
    let spaceName = this.$route.matched[0].meta.space
    this.role = this.$route.matched[0].meta.role || '1' // 1-医生 2-护士
    // scene 使用场景  1-门诊 2-急诊 3-住院 4-体检 5-随访 6-手术麻醉 7-产房
    this.scene = sceneGroup[spaceName]
    this.getJurisdicts()
  },
  watch: {
    '$route.params.visitType' (val) {
      this.visitType = parseInt(val)
    },
    '$store.state.currentUser': {
      handler (val) {
        this.userId = val.userId
      },
      deep: true
    },
    'userId' () {
      this.getJurisdicts()
    }
  },
  methods: {
    changeTag () {
      return false
    },
    async getJurisdicts () {
      this.jurisdictData = []
      if (!this.userId) {
        return
      }
      // 医生获取科室
      if (this.role === '1') {
        let officeCode = this.visitType === 1 ? '01.02' : '01.01'
        let params = {
          outSubjectGetTenantSubjectListByConditionReqDTO: {
            type2CodeList: [officeCode]
          },
          outStaffGetStaffListByConditionReqDTO: {
            idList: [this.userId],
            usePermissionStatus: 'Y',
            status: 'Y',
          }
        }
        const res = await api.getDoctorOffice(params)
        if (res && res.length) {
          let dpts = []
          res.forEach(item => {
            if (item.id) {
              dpts.push(item.id)
            }
          })
          this.jurisdictData = dpts
        }
      }
      // 护士获取病区
      if (this.role === '2') {
        let params = {
          staffIdList: [this.userId]
        }
        const res = await api.getNurseArea(params)
        if (res && res.length) {
          let areas = []
          res.forEach(item => {
            if (item.id) {
              areas.push(item.id)
            }
          })
          this.jurisdictData = areas
        }
      }
    }
  },
  components: {
    tpl
  }
}
</script>
