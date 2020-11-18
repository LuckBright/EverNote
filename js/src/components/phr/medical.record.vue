<template>
    <div class="medical_record">
        <div class="kanzhen form">
            <phrform
              v-if="formObj.docDesignerId === '1'"
              :code="formObj.tplCode"
              :visit-id="formObj.visitNumber"
              :patient-id="formObj.patientId"
              :dpt-id="formObj.deptId"
              :data-id="formObj.id"
              v-model="form"
              ref="form"
              :nosubmit="true"
              :schemaId.sync="formObj.formTemplateId"
            ></phrform>
            <phrdoc
              v-if="formObj.docDesignerId === '2'"
              ref="phrdoc"
              :content.sync="html"
              :data-id="formObj.id"
              :dptId="formObj.deptId"
              :schema-id="formObj.formTemplateId"
              :visit-id="formObj.visitNumber"
              :patient-id="formObj.patientId"
              :editable="false"
            ></phrdoc>
            <div class="mask" v-if="formObj.docDesignerId === '1'"></div>
          </div>
    </div>
</template>
<script>
export default {
  props: {
    formObj: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      form: {},
      html: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.kanzhen {
    position: relative;
    padding-bottom: 36px;
    padding-top:15px;
    padding-right:10px;
}
.mask {
    position: absolute;
    left: 0;
    background: rgba(0, 0, 0, 0.01);
    margin: auto;
    height: 100%;
    width: 100%;
    top:0;
    z-index:999;
  }
</style>
