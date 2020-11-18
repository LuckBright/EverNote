<template>
  <el-dialog
    :visible.sync="v"
    title="登记信息"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
  >
    <el-row>
      <!-- 长春市保 -->
      <ccybmodify
        ref="jlccyb"
        :paramObj="paramObj"
        v-if="insuranceOrgId == jlccybCode"
        @register-success="handleSuccess"
        @cancel="cancel"
      ></ccybmodify>
      <!-- 吉林省保 -->
      <jlsbmodify
        ref="jlssb"
        :paramObj="paramObj"
        v-if="insuranceOrgId == jlssbCode"
        @register-success="handleSuccess"
        @cancel="cancel"
      ></jlsbmodify>
      <!-- 吉林蛟河 -->
      <jljhmodify
        ref="jljhyb"
        :paramObj="paramObj"
        v-if="insuranceOrgId == jljhCode"
        @register-success="handleSuccess"
        @cancel="cancel"
      ></jljhmodify>
      <!-- 三亚世侨 -->
      <sysqzyymodify
        ref="sysqzyyyb"
        :paramObj="paramObj"
        v-if="insuranceOrgId == sysqzyyCode"
        @register-success="handleSuccess"
        @cancel="cancel"
      ></sysqzyymodify>
      <!-- 广东长峰 -->
      <gdcfmodify
        ref="gdcfyb"
        :paramObj="paramObj"
        v-if="insuranceOrgId == gdcfybCode"
        @register-success="handleSuccess"
        @cancel="cancel"
      >
      </gdcfmodify>
    </el-row>
  </el-dialog>
</template>

<script>
import ccybmodify from '@/rcm/otmdiscomponent/modify-medical-info/jlcc-modify-medical-info.vue'
import jlsbmodify from '@/rcm/otmdiscomponent/modify-medical-info/jlsb-modify-medical-info.vue'
import jljhmodify from '@/rcm/otmdiscomponent/modify-medical-info/jljh-modify-medical-info.vue'
import sysqzyymodify from '@/rcm/otmdiscomponent/modify-medical-info/sysqzyy-modify-medical-info.vue'
import gdcfmodify from '@/rcm/otmdiscomponent/modify-medical-info/gdcf-modify-medical-info.vue'
import { jlccybCode, jlssbCode, jljhCode, sysqzyyCode, gdcfybCode, orgList } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
export default {
  props: {
    medicalRegisterInfo: {
      type: [Boolean]
    },
    paramObj: {
      type: [Object],
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      jlccybCode,
      jlssbCode,
      jljhCode,
      sysqzyyCode,
      gdcfybCode,
      orgList
    }
  },
  computed: {
    v: {
      get () {
        return this.medicalRegisterInfo
      },
      set (val) {
        this.$emit('update:medicalRegisterInfo', val)
      }
    },
    insuranceOrgId: {
      get () {
        return this.paramObj.insuranceOrgId
      }
    }
  },
  methods: {
    // 医保出院登记
    handleSuccess () {
      this.$emit('register-success')
      this.v = false
    },
    // 取消
    cancel () {
      this.v = false
    }
  },
  components: {
    ccybmodify,
    jlsbmodify,
    jljhmodify,
    sysqzyymodify,
    gdcfmodify
  }
}
</script>
