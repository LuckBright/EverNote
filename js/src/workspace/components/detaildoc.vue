<template>
  <el-dialog
    :visible.sync="flag"
    width="45%"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
  >
    <div slot="title">
      <div class="title">{{titleInfo}}</div>
    </div>
    <phrdoc
      v-if="flag"
      ref="phrdoc"
      :data-id="obj.medicalRecordId"
      :dptId="obj.deptId"
      :visit-id="obj.visitId"
      :patient-id="obj.patientId"
      :key="obj.id"
      :editable="false"
      :proof="true"
    ></phrdoc>
  </el-dialog>
</template>
<script>
export default {
  methods: {
    toggle () {
      this.flag = !this.flag
      this.titleInfo = this.obj.certificationName
    }
  },
  props: {
    obj: {
      type: Object
    }
  },
  data () {
    return {
      flag: false,
      titleInfo: ''
    }
  }
}
</script>
<style scoped lang="scss">
.title {
  font-size: 16px;
  color: #333333;
  line-height: 16px;
  margin-top: 6px;
}
</style>
