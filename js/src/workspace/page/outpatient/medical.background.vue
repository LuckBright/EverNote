<template>
  <div class="medical_background_wrap">
    <div class="header_wrap">
      <opration-log
        class="opration alg_l"
        v-if="formId"
        :id="String(formId)"
        :title="title"
        :schema-id="schemaId"
      ></opration-log>
    </div>
    <div class="phr_form_wrap">
      <!-- dataId为 -1，后端逻辑回显数据 -->
      <phrform v-model="formData" dataId="-1" :title="title" :schemaId.sync="schemaId" v-bind="$attrs" :all-disabled="$attrs.disabled" ref="phrform"></phrform>
    </div>
  </div>
</template>

<script>
import oprationLog from './oprationlog'
export default {
  data () {
    return {
      formData: {},
      title: '医疗背景',
      schemaId: ''
    }
  },
  components: {
    oprationLog
  },
  computed: {
    formId () {
      return this.formData && this.formData.id ? this.formData.id : ''
    }
  },
  methods: {
    save () {
      this.$refs.phrform.save()
    }
  }
}
</script>
<style lang="scss" scoped>
  .medical_background_wrap{
    &.write_record{
      position: relative;
      right: -100%;
      width: 0;
      transition: .3s ease-in-out;
      display: flex;
      flex-direction: column;
      margin-bottom: 56px;
      border-left: 1px solid #eee;
      .phr_form_wrap{
        flex: 1;
        border-bottom: 1px solid #eee;
        overflow: auto;
      }
      &.active{
        width: 40%;
        right: 0;
      }
    }
    .phr_form_wrap{
      padding: 20px 15px;
    }
    .header_wrap{
      text-align: right;
      padding: 10px 10px 0;
    }
  }
</style>
