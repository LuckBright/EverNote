<template>
  <div>
    {{subjectList}}
    <ever-subject-select ref="ess" v-model="subjectList" type="select" fields="orgSubjectCode" @after-not-match="afterNotMatch"></ever-subject-select>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        subjectList: '5000.009272',
      }
    },
    created () {
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
