<template>
  <div>
    {{orgList}}
    <ever-org-select ref="eos" v-model="orgList" type="tree" multiple></ever-org-select>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        orgList: [],
      }
    },
    created () {
    },
    mounted () {
    },
    methods: {
    },
  }
</script>
