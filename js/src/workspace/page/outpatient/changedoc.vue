<template>
  <div class="formbox">
    <div class="form-content">
      <phrform
        v-if="!isDoc"
        :code="tplCode"
        :key="key"
        :visit-id="visitId"
        :patient-id="$route.query.patientId"
        :dpt-id="$route.query.dptId"
        :data-id="dataId"
        v-model="form"
        ref="form"
        :nosubmit="true"
        :schemaId.sync="schemaId"
        :node-type="nodeType"
      ></phrform>
      <phrdoc
        v-if="isDoc"
        ref="phrdoc"
        :data-id="dataId"
        :dptId="$route.query.dptId"
        :schema-id="schemaId"
        :visit-id="visitId"
        :patient-id="$route.query.patientId"
        :key="key"
        :nodeType="nodeType"
        :editable="true"
      ></phrdoc>
    </div>
  </div>
</template>

<script>
import phrapi from '@/form/store/phrapi'
import medicalRecordCommon from './medical.record.common'

export default {
  mixins: [medicalRecordCommon],
  props: ['schemaId', 'dataId', 'isDoc', 'tplCode', 'nodeType'],
  data () {
    return {
      form: {},
      visitId:
        this.$route.query.visitId ||
        this.$route.query.visitSn ||
        this.$route.query.hospitalizedNumber,
    }
  },
  computed: {
    key () {
      const date = new Date()
      return date.getTime()
    }
  },
  methods: {
    save (comment) {
      this.savePatientCase(comment)
    },
    async saveDoc (comment) {
      let obj = {
        text: this.$refs.phrdoc.getHtml()
      }
      obj.id = this.dataId
      await phrapi.createChangeLog(this.schemaId, obj, {
        visitId: this.visitId,
        patientId: this.$route.query.patientId,
        dptId: this.$route.query.dptId,
        processRemark: comment
      })
      this.$messageTips(this, 'success', '申请成功', '提示')
      this.$emit('success')
    },
    async savePhrForm (comment) {
      await phrapi.createChangeLog(
        this.schemaId,
        this.form,
        {
          visitId: this.visitId,
          patientId: this.$route.query.patientId,
          dptId: this.$route.query.dptId,
          processRemark: comment
        },
        this.tplCode
      )
      this.$messageTips(this, 'success', '申请成功', '提示')
      this.$emit('success')
    }
  },
  components: {}
}
</script>
<style scoped lang="scss">
.formbox {
  width: 1180px;
  height: 500px;
  overflow: auto;
  .form-content {
    padding: 0px;
    position: relative;
    /deep/ .ever__editor.medical {
      border: none;
    }
    /deep/ .ever__editor.medical .editor_content_wrap .editor__content {
      margin: 0 auto;
      box-shadow: none;
    }
    /deep/ .ever__editor.medical .editor_content_wrap {
      max-height: inherit;
    }
  }
  .form-padding-right {
    padding-right: 10px;
  }
}
</style>
