<template>
  <ever-temp
    type-code="2"
    list-api="diagnosis"
    add-api="addDiagnose"
    edit-api="editDiagnose"
    page-name="诊断信息"
    add-title="添加诊断信息"
    edit-title="修改诊断信息"
    :one-level-name="oneLevelName" 
    :two-level-name="twoLevelName"></ever-temp>
</template>

<script>
  import everTemp from './basetemp'

  export default {
    components: {
      everTemp
    },
    props: {
      oneLevelName: {
        type: String
      },
      twoLevelName: {
        type: String
      }
    }
  }
</script>
