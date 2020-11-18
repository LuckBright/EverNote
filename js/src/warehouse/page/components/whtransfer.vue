<template>
  <div>
    <el-transfer
    v-model="transfer"
    :filterable="filterable ? true : false"
    :filter-placeholder="placeholder"
    :data="data"
    :props="{
      key: customKey ? customKey : 'id',
      label: customLabel ? customLabel : 'name'
    }"
    :titles="titles"></el-transfer>
  </div>
</template>
<script>
export default {
  props: ['titles', 'data', 'value', 'filterable', 'placeholder', 'customKey', 'customLabel'],
  data () {
    return {}
  },
  computed: {
    'transfer': {
      set (nV) {
        console.log(nV, '----')
        this.$emit('input', nV)
      },
      get () {
        return this.value || []
      }
    }
  },
  methods: {}
}
</script>
