<!--  -->
<template>
  <el-dialog
    title="套餐转移"
    :visible="visible"
    @update:visible="changeVisible"
    width="650px"
    :close-on-click-modal="false"
  >
    <h4>将剩余套餐转移给</h4>
    <div class="mt10 mb10">
      <ever-patient-select
        @select="selectPatient"
        v-model.trim="name"
      ></ever-patient-select>
    </div>
    <h4>请核对信息</h4>
    <div class="pos_re">
      <patientcard :data="patient"></patientcard>
      <i class="arrow el-icon-right"></i>
      <patientcard class="box-ml" :data="selectedPatient"></patientcard>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-popover placement="top" width="160" v-model="popVisible">
        <p>
          确认将“{{ patient.name }}”的套餐剩余内容转移给“{{
            selectedPatient.name
          }}”吗 ？转移后“{{ patient.name }}”将无法使用套餐。
        </p>
        <div style="text-align: right; margin: 0;">
          <el-button size="mini" type="text" @click="popVisible = false"
            >取消</el-button
          >
          <el-button type="primary" size="mini" @click="confirm" :loading="loading"
            >确定</el-button
          >
        </div>
        <el-button slot="reference" type="primary" :disabled="!selectedPatient.name">确 定</el-button>
      </el-popover>
      <el-button @click="changeVisible(false)">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import patientcard from '@/crm/page/packagesale/patientcard'
import api from '@/crm/store/packageapi'
export default {
  props: {
    visible: Boolean,
    patient: Object
  },
  data () {
    return {
      name: '',
      selectedPatient: {},
      popVisible: false,
      orderId: '',
      setMealId: '',
      loading: false
    }
  },

  components: {
    patientcard
  },

  computed: {},

  created () {
  },

  methods: {
    selectPatient (val) {
      this.selectedPatient = val || {}
      console.log('val >> ', val)
    },
    changeVisible (val) {
      this.$emit('update:visible', val)
    },
    async confirm () {
      this.loading = true
      await api.transferOrder({
        patientId: this.selectedPatient.id,
        orderId: this.patient.data.orderId,
        setMealId: this.patient.data.setMealId
      })
      this.loading = false
      this.$emit('update:visible', false)
      this.$emit('get')
      this.$message({type: 'success', message: '套餐转移成功！'})
    }
  }
}

</script>
<style lang='scss' scoped>
.box-card {
  width: 280px;
  height: 160px;
}
.arrow {
  font-size: 40px;
  position: absolute;
  top: 56px;
  left: 295px;
}
.box-ml {
  margin-left: 62px;
}
</style>
