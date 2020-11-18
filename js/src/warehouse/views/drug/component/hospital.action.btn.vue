<template>
  <el-footer class="alg_c bWhite bor_top_1 ptb10" :height="footerHeight + 2" size="small">
    <el-button :disabled="disabled" v-if="!isUddPackage" type="primary" size="small" @click="clickBtn(1)">打印</el-button>
    <template v-if="isUddPackage && !isInvented">
      <el-button :disabled="disabled" v-if="isPreparation" type="primary" size="small" @click="clickBtn(2)">摆药</el-button>
      <el-button :disabled="disabled" v-else type="primary" size="small" @click="clickBtn(3)">发药</el-button>
    </template>
  </el-footer>
</template>

<script>
import HospitalParameters from '@/warehouse/views/drug/mixin/hospital.parameters.js'

export default {
  mixins: [HospitalParameters],
  props: {
    disabled: {
      type: Boolean,
      default: true
    }, // 打印
    isUddPackage: { // 是否是udd药包
      type: Boolean,
      default: false
    },
    isPreparation: Boolean, // 是否是摆药
    isInvented: Number // 是否是虚拟库房
  },
  methods: {
    clickBtn (type) {
      // type: 1: 打印 2：摆药 3：发药 4：无法到货 5：取消
      this.$emit('hospital-action-btn', type)
    }
  },
  computed: {

  }
}
</script>
