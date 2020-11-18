<template>
  <div>
    {{orgList}}
    <ever-org-select ref="eos" v-model="orgList" type="select" multiple></ever-org-select>
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
      this.orgList = JSON.parse(`[ { "id": "5000", "code": "5000", "name": "尚医至信总部" }, { "id": "5000001", "code": "5000001", "name": "尚医至信" } ]`)
      // this.orgList = JSON.parse(`[ { "id": "5000", "code": "5000", "name": "尚医至信总部" }, { "id": "5000001", "code": "5000001", "name": "尚医至信" } ]`)
    },
    mounted () {
    },
    methods: {
    },
  }
</script>
