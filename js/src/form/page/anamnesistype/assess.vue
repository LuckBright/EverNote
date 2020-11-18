<template>
  <ever-temp
    type-code="8"
    list-api="assess"
    add-api="addAssess"
    edit-api="editAssess"
    page-name="评估信息"
    add-title="添加评估信息"
    edit-title="修改评估信息"
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
