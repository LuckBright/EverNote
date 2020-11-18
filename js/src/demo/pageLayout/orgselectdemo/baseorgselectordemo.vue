<template>
  <div>
    {{orgList}}
    <ever-org-select ref="eos" v-model="orgList"
                     type="select" fields="code"
                     :props="{clearable: false}"
                     :params="params"
    ></ever-org-select>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        orgList: '',
        params: {everQueryType: 'isLogin'}
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
