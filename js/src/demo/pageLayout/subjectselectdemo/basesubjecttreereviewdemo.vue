<template>
  <div style="height: 400px; overflow: auto;">
    {{subjectList2}}
    <ever-subject-select ref="ess" v-model="subjectList2" type="tree" multiple></ever-subject-select>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        subjectList2: [],
      }
    },
    created () {
      // 保证回显的数据格式必须为：
      this.subjectList2 = [ '5000.A03.01', '5000.A03.04', '5000.A03.05', '5000.A03.07', '5000.A03.10', '5000.A03.11' ]
    },
    mounted () {
    },
    methods: {
    },
  }
</script>
