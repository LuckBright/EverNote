<template>
  <div>
    <el-select
      class="block"
      :value="value[SHOU_SHU_BIAN_MA]"
      @change="change"
      @focus="focusHandler"
      value-key="id"
      clearable
      filterable
      remote
      placeholder="—"
      :remote-method="remoteMethod"
      :loading="loading"
    >
      <el-option v-for="item in options" :key="item.id" :label="item.code" :value="item">
        <span class="fl">{{ item.name }}</span>
        <span class="fr code">{{ item.code }}</span>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { keyMap } from '../phrmap'
import operation from '@/components/medicalindex/mixins/operation'
export default {
  mixins: [operation],
  data () {
    return {
      ...keyMap,
    }
  },
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
