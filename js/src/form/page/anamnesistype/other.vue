<template>
  <ever-temp
    type-code="6"
    list-api="other"
    add-api="addOther"
    edit-api="editOther"
    page-name="其他信息"
    add-title="添加其他信息"
    edit-title="修改其他信息"
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
