<template>
  <ever-temp
    type-code="4"
    list-api="sign"
    add-api="addSign"
    edit-api="editSign"
    page-name="体征信息"
    add-title="添加体征信息"
    edit-title="修改体征信息"
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
