<template>
  <el-collapse v-model="activeNames">
          <el-collapse-item
            class="flex_col_1_auto"
            v-for="menu in menus"
            :key="menu.name"
            :name="menu.order"
          >
            <template slot="title">
              <svg class="icon"
                   aria-hidden="true">
                <use :xlink:href="menu.icon"></use>
              </svg>
              <span class="title_text">
                {{menu.content}}
                <slot name="tip" v-if="menu.name==='infoCheck'"></slot>
                <!-- <sub class="twinkling" v-if="hasNew"></sub> -->
              </span>
            </template>
            <slot name="infoCheck" v-if="menu.name==='infoCheck'"></slot>
            <medical-list
              v-if="menu.name==='nurse'"
              :key="nurseKey"
              :readonly="readonly('nurse')"
              :visitId="visitId"
              :patient-id="patientId"
              :patient-name="patientName"
              :menuList="nursingList"
              @menuSelect="menuSelect"
              @quoteTpl="quoteTpl">
            </medical-list>
            <medical-list
              v-if="menu.name==='doctor'"
              :key="doctorKey"
              :visitId="visitId"
              :patient-id="patientId"
              :patient-name="patientName"
              :readonly="readonly('doctor')"
              :menuList="doctorList"
              @menuSelect="menuSelect"
              @quoteTpl="quoteTpl"></medical-list>
              <medical-list
              v-if="menu.name==='clinic'"
              :key="clinicKey"
              :visitId="visitId"
              :patient-id="patientId"
              :patient-name="patientName"
              :readonly="readonly('clinic')"
              :menuList="clinicList"
              @menuSelect="menuSelect"
              @quoteTpl="quoteTpl"></medical-list>
          </el-collapse-item>
        </el-collapse>
</template>
<script>
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
import medicalList from '@/inpatient/page/medicalrecord/medical.list'
import {getMenuList} from '@/emr/config/medical.record.config.js'
import uuidv4 from 'uuid/v4'

function updateTreeCode (node) {
  if (!node.nodes) return
  for (let i = 0; i < node.nodes.length; i++) {
    node.nodes[i].rootCode = 'BING_CHENG_JI_LU'
    if (node.nodes[i].isInstance && node.nodes[i].anchor) {
      // let anchors = []
      try {
        node.nodes[i].anchors = JSON.parse(node.nodes[i].anchor)
        // delete node.nodes[i].anchor
        // if (anchors.length > 1) {
        //   console.log('anchors', anchors, node.nodes[i].name)
        //   anchors = anchors.map((v, index) => {
        //     let obj = Object.assign({}, node.nodes[i])
        //     obj.name = v[0] + obj.name
        //     obj.scrollIndex = index
        //     return obj
        //   })
        //   node.nodes.splice(i, 1)
        //   console.log(anchors)
        //   for (let j = 0; j < anchors.length; j++) {
        //     node.nodes.splice(i, 0, anchors[j])
        //     i++
        //   }
        // }
      } catch (e) {
      }
    }
    updateTreeCode(node.nodes[i])
  }
}

export default {
  name: 'medical_record_menu',
  components: {
    medicalList
  },
  props: {
    visitId: {
      type: String
    },
    patientId: {
      type: String
    },
    patientName: {
      type: String
    },
    authority: {
      type: Number
    },
    spaceName: {
      type: String
    },
    visitType: {
      type: Number
    }
  },
  data () {
    return {
      menus: [],
      activeNames: ['3'],
      nursingList: [],
      doctorList: [],
      clinicList: [],
      nurseKey: uuidv4(),
      doctorKey: uuidv4(),
      clinicKey: uuidv4()
    }
  },
  computed: {
    readonly (type) {
      return (type) => {
        if (this.authority === 1) {
          return true
        }
        if (this.visitType === 1 && this.spaceName === 'nurse') {
          return true
        }
        if (type === 'doctor') {
          return (this.$route.query.readonly === 'true' || ['medicalArchive'].includes(this.$route.query.from)) || (this.$route.meta && this.$route.meta.prole !== 1)
        } else if (type === 'nurse') {
          return (!this.$route.query.readonly === 'true' || ['medicalArchive'].includes(this.$route.query.from)) || this.$route.meta && this.$route.meta.prole !== 2
        } else {
          return false
        }
      }
    }
  },
  created () {
    this.menus = getMenuList(this.spaceName, this.visitType)
    if (this.visitType === 1) {
      this.activeNames = ['4']
    } else if (this.$route.meta && this.$route.meta.prole === 2) {
      this.activeNames = ['2']
    }
    // 区分医生和护士默认展开右侧病历树结构
    if (this.visitType === 1) {
      this.getClinicTree()
    } else {
      this.getNursingTree()
      this.getDoctorTree()
    }
  },
  methods: {
    menuSelect (val) {
      this.$parent.menuSelect(val)
    },
    quoteTpl (val) {
      this.$parent.quoteTpl(val)
    },
    updateTree () {
      if (this.$route.meta && this.$route.meta.prole === 1) { // 住院医生
        this.getDoctorTree()
      } else if (this.$route.meta && this.$route.meta.prole === 2) { // 住院护士
        this.getNursingTree()
      } else if (this.visitType === 1) { // 门诊
        this.getClinicTree()
      }
    },
    async getNursingTree () { // 护理文书需要的接口
      let res = await request(urlMap.medicalRecord.getInstanceTree, {
        type: '3', // 护理文书
        visitNumber: this.visitId
      })
      if (res && res.head && res.head.errCode === 0) {
        this.nursingList = res.data
        this.nurseKey = uuidv4()
      }
    },
    async getDoctorTree () {
      // 电子病历实例树
      let res = await request(urlMap.medicalRecord.getInstanceTree, {
        type: '1', // 1-住院医生 2-门诊 3-护理
        visitNumber: this.visitId
      })
      if (res && res.head && res.head.errCode === 0) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].rootCode = res.data[i].code
          if (res.data[i].code === 'BING_CHENG_JI_LU') {
            updateTreeCode(res.data[i])
            break
          }
        }
        // console.log(res.data)
        this.doctorList = res.data
        this.doctorKey = uuidv4()
      }
    },
    async getClinicTree () {
      // 电子病历实例树
      let res = await request(urlMap.medicalRecord.getInstanceTree, {
        type: '2', // 1-住院医生 2-门诊 3-护理
        visitNumber: this.visitId
      })
      if (res && res.head && res.head.errCode === 0) {
        this.clinicList = res.data
        this.clinicKey = uuidv4()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './medical.record.layout.scss'
</style>
