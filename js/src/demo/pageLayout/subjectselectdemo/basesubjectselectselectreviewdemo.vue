<template>
  <div>
    {{subjectList}}
    <ever-subject-select ref="ess" v-model="subjectList" type="select" multiple></ever-subject-select>
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
      this.subjectList = JSON.parse(`[ { "orgSubjectId": "5000.A01", "orgSubjectCode": "5000.A01", "orgSubjectName": "预防保健科" }, { "orgSubjectId": "5000.A02", "orgSubjectCode": "5000.A02", "orgSubjectName": "全科医疗科" }, { "orgSubjectId": "5000.A03.03", "orgSubjectCode": "5000.A03.03", "orgSubjectName": "神经内科专业" } ]`)
    },
    mounted () {
    },
    methods: {
    },
  }
</script>
