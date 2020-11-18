<template>
  <div class="inpatient_doc_wrap layout_main_view_inner">
    <div class="doc_main page_layout_full_hidden">
      <medical-record-layout
        :patientId="patientId"
        :visitId="visitId"
        :dptId="dptId"
        :baseroute="baseroute"
        :key="patientId+visitId+dptId"
        :space-name="spaceName"
        :visit-type="visitType"
        :patient-name="patientName"
      ></medical-record-layout>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import medicalRecordLayout from '@/inpatient/page/medicalrecord/medical.record.layout'
// import storage from '@/util/storage'
// doctype1 一级分类：
/*
String IN_HOSPITAL = "1";    // 住院
String OUT_PATIENT = "2";    // 门诊
String EMERGENCY = "3";      // 急诊
String CHECK = "4";          // 体检
String FOLLOW_UP = "5";      // 随访
String OPERATION = "6";      // 手术
String NURSE = "7";          // 护理
String ANAESTHESIA = "8";    // 麻醉
*/
// doctype2 二级分类
/*
  入院管理  IN_HOSPITAL_MANAGE 1
  在院管理  ON_HOSPITAL_MANAGE 1
  出院管理  OUT_HOSPITAL_MANAGE 1
  知情同意书管理 AGREE_MANAGE 1
  手术管理  OPER_MANAGE 1
  麻醉管理  MAZUI_MANAGE 1
  评估、评分表管理  SCORE_MANAGE 1
  申请单管理 SHENQING_MANAGE 1
  护理单管理 HULI_MANAGE 1
  门诊急诊病历  MEN_ZHEN_JI_ZHEN_BING_LI 1
  病程管理  BING_CHENG_MANAGE
  体检管理  TI_JIAN_GUAN_LI 4
*/
// 一级分类不传加载住院type1。二级分类不传，则加载全部。
const patientId = 'ryaCtbQ8r8myE9o0X9m'// 'tA5cJUR26sYZDVn0T3h'
const visitId = 'BJOP202008692JT' // s 'BJOP202008617JT'
const dptId = '5000.500000'

export default {
  components: {
    medicalRecordLayout
  },
  props: {
    'doctype1': {
      type: Number,
      default: 1
    },
    'doctype2': Array,
    'baseroute': {
      type: String
    },
    spaceName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      csa: ['nurse', 'anesthetist'],
      random: Math.random(),
      visitId: this.$route.query.hospitalizedNumber || this.$route.query.visitNumber, // 'BJOP20190000001173'
      patientId: this.$route.query.patientId, // ‘cbiX1UNbTypwpsSEoYS
      dptId: this.$route.query.providerId, // '5aa35e89-a471-11e9-86bb-0242ac11000a' || this.$route.query.dptId,
      visitType: Number(this.$route.query.visitType) || 3,
      id: this.$route.params.id, // 模版id
      code: this.$route.params.code,
      designerId: '1',
      patientName: this.$route.query.patientName
    }
  },
  created () {
    // this.test()
  },
  methods: {
    test () {
      this.$router.push({
        path: `${this.baseroute}/docs`,
        query: {
          visitNumber: visitId,
          patientId: patientId,
          providerId: dptId,
          visitType: 1
        }
      })
    },
    handleFile () {
      this.random = Math.random()
      this.$router.push({
        path: `${this.baseroute}/docs/${this.$route.params.id}/${this.$route.params.dataId}/${this.$route.params.code}`,
        query: this.$route.query
      })
    },
    addTab (name, title, type) {
      this.$nextTick(() => {
        this.$refs.docstabs.addTab(name, title, type)
      })
    },
    updateMenu () {
      this.$refs.menu.load()
    },
    changeMoban (val) {
      this.id = val[0]
      this.code = val[1]
    },
    docTabDesigner (val) {
      this.designerId = val
    }
  }
}
</script>
<style lang="scss" scoped>
.limitH {
  overflow: auto;
}
.gray-bg {
  background-color: #f4f4f4;
}
.el-menu {
  border: none;
}
.doc_main{
  flex:1;
  width: 100%;
}
.doc_main .column {
  border-right: 1px solid #ccc;
}

.doc_main .column:last-child {
  border-right: none;
}
.doc_main .el-tabs {
  border: none;
}
.inpatient_doc_wrap {
  .main_wrap {
    display: flex;
    .main_menu {
      max-height: 1000px;
      overflow-x: hidden;
    }
  }
}
.el-menu /deep/ .el-submenu__title {
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-menu /deep/ .el-submenu__icon-arrow {
  right: initial;
  left: 8px;
}
.quote_column {
  .el-tabs {
    /deep/ .el-tabs__content {
      flex: 1;
      overflow: auto;
    }
    /deep/ .el-tabs__header {
      /deep/ .el-tabs__item.is-active {
        border-right-color: #e6e6e6;
        border-left-color: #e6e6e6;
      }
    }
  }
}
</style>
