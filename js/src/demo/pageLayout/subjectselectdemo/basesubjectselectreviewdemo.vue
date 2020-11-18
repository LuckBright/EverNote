<template>
  <div>
    {{subjectList}}
    <ever-subject-select ref="ss" v-model="subjectList"
                         multiple fields="orgSubjectCode" @after-not-match="afterNotMatch"></ever-subject-select>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        subjectList: [],
      }
    },
    created () {
      // 保证回显的数据格式必须为：
      this.subjectList = JSON.parse(`[ "5000.00922", "5000.9022", "5000.99133" ]`)
    },
    mounted () {
    },
    methods: {
      afterNotMatch () {
        console.log('出现未匹配的数据')
      }
    },
  }
</script>
