<template>
  <div>
    <el-select
      v-if="type === 'xi'"
      class="block"
      v-model="value[index][QI_TA_ZHEN_NAME]"
      @change="change"
      value-key="diseaseCode"
      clearable
      filterable
      remote
      placeholder="—"
      :remote-method="remoteMethod"
      :loading="loading"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.diseaseName"
        :value="item"
      >
        <span class="fl">{{ item.diseaseName }}</span>
        <span class="fr code">{{ item.diseaseCode }}</span>
      </el-option>
    </el-select>
    <el-select
      v-else
      class="block"
      v-model="value[index][ZHONG_ZHU_ZHENG_NAME]"
      @change="change"
      value-key="diseaseCode"
      clearable
      filterable
      remote
      placeholder="—"
      :remote-method="remoteMethod"
      :loading="loading"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.diseaseName"
        :value="item"
      >
        <span class="fl">{{ item.diseaseName }}</span>
        <span class="fr code">{{ item.diseaseCode }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import api from '@/workspace/store/medicalapi'
import { keyMap } from '../keymap'
export default {
  props: {
    value: Array,
    index: [Number, String],
    distype: {
      type: String,
      default: '0'
    },
    type: {
      type: String,
      default: 'zhong'
    }
  },
  data () {
    return {
      ...keyMap,
      options: [],
      list: [],
      loading: false,
      diseaseCode: ''
    }
  },
  computed: {},
  created () {},
  methods: {
    remoteMethod (name) {
      this.loading = true
      api
        .searchDiagnose({
          type: this.distype,
          origId: this.$store.state.currentUser.organizationId,
          name: name
        })
        .then(res => {
          this.loading = false
          this.options = res.data.resultList
        })
    },
    change (value) {
      if (value) {
        const { diseaseName, diseaseCode } = value
        this.$emit('change', { diseaseName, diseaseCode }, this.index)
      } else {
        this.$emit('change', { diseaseName: '', diseaseCode: '' }, this.index)
      }
    }
  },
  components: {},
  mounted () {}
}
</script>
<style scoped lang="scss">
.block {
  display: block;
}
.code {
  color: #8492a6;
  font-size: 13px;
  margin-left: 10px;
}
</style>
