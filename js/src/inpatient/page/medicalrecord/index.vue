<template>
    <div class="index">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="电子病历" name="layout">
              <medical-record-layout></medical-record-layout>
            </el-tab-pane>
            <el-tab-pane label="保存提示测试" name="save">
              <save-demo v-if="activeName==='save'"></save-demo>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import saveDemo from '@/inpatient/page/medicalrecord/savedemo'
import medicalRecordLayout from '@/inpatient/page/medicalrecord/medical.record.layout'
export default {
  components: {
    saveDemo,
    medicalRecordLayout
  },
  data () {
    return {
      activeName: 'layout'
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
