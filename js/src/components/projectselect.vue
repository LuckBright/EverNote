<template>
  <span>
    <el-select
      v-model="select"
      filterable
      clearable
      remote
      :placeholder="placeholder || '请输入关键词'"
      :visitNumber="visitNumber"
      :remote-method="remoteMethod"
      @change="change"
      style="width: 100%"
      value-key="itemId"
      @clear="clear"
    >
      <el-option
        v-for="item in patients"
        :key="item.itemId"
        :label="`${item.itemName}`"
        :value="item"
      >
        <!-- <span class="option-field">{{ item.accountCode }}</span>                 -->
      </el-option>
    </el-select>
  </span>
</template>
<script>
import { getMedicalRefundService } from '@/rcm/store/noprescriptionsettlement'
export default {
  props: ['value', 'placeholder', 'visitNumber'],
  data () {
    return {
      patients: []
    }
  },
  methods: {
    async remoteMethod (query) {
      query = query && String(query).trim()
      let params = {
        name: query,
        visitNumber: this.visitNumber
      }
      try {
        let data = await getMedicalRefundService(params)
        this.patients = data.data
      } catch (err) {

      }
    },
    change (val) {
      this.$emit('change', val)
    },
    // 点击清空时将filter结果重置
    clear () {
      this.remoteMethod()
    }
  },
  computed: {
    select: {
      set (newVal) {
        this.$emit('input', newVal)
        this.$emit('select', newVal)
      },
      get () {
        return this.value
      }
    }
  },
  created () {
    // this.remoteMethod()
  }
}
</script>
<style scoped>
.option-field {
  display: inline-block;
  margin-right: 10px;
}
</style>
