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
                <slot name="tip"></slot>
                <!-- <sub class="twinkling" v-if="hasNew"></sub> -->
              </span>
            </template>
            <slot name="infoCheck" v-if="menu.name==='infoCheck'"></slot>
            <medical-list 
              v-if="menu.name==='nurse'"
              :key="nurseKey"
              :readonly="readonly('nurse')"
              :visitId="visitId"
              :menuList="nursingList"
              @menuSelect="menuSelect"
              @quoteTpl="quoteTpl">
            </medical-list>
            <medical-list 
              v-if="menu.name==='doctor'"
              :key="doctorKey"
              :visitId="visitId"
              :readonly="readonly('doctor')"
              :menuList="doctorList"
              @menuSelect="menuSelect"
              @quoteTpl="quoteTpl"></medical-list>
          </el-collapse-item>
        </el-collapse>
</template>
<script>
import urlMap from '@/inpatient/urls'
import { request } from '@/util/req'
import medicalList from '@/inpatient/page/medicalrecord/medical.list'
import {menus} from '@/emr/config/medical.record.config.js'
import uuidv4 from 'uuid/v4'
export default {
  name: 'medical_record_menu',
  components: {
    medicalList
  },
  props: {
    visitId: {
      type: String
    },
    authority: {
      type: Number
    }
  },
  data () {
    return {
      menus,
      activeNames: ['3'],
      nursingList: [],
      doctorList: [],
      nurseKey: uuidv4(),
      doctorKey: uuidv4()
    }
  },
  computed: {
    readonly (type) {
      return (type) => {
        if (this.authority === 1) {
          return true
        }
        if (type === 'doctor') {
          return (this.$route.query.readonly === 'true') || (this.$route.meta && this.$route.meta.prole !== 1)
        } else if (type === 'nurse') {
          return (!this.$route.query.readonly === 'true') || this.$route.meta && this.$route.meta.prole !== 2
        }
      }
    }
  },
  created () {
    // 区分医生和护士默认展开右侧病历树结构
    if (this.$route.meta && this.$route.meta.prole === 2) {
      this.activeNames = ['2']
    }
    this.getNursingTree()
    this.getDoctorTree()
  },
  methods: {
    menuSelect (val) {
      this.$parent.menuSelect(val)
    },
    quoteTpl (val) {
      this.$parent.quoteTpl(val)
    },
    updateTree () {
      if (this.$route.meta && this.$route.meta.prole === 1) {
        this.getDoctorTree()
      } else if (this.$route.meta && this.$route.meta.prole === 2) {
        this.getNursingTree()
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
        this.doctorList = res.data
        this.doctorKey = uuidv4()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import './medical.record.layout.scss'
</style>
