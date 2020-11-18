<template>
  <ever-temp
    type-code="9"
    list-api="operation"
    add-api="addOperation"
    edit-api="editOperation"
    page-name="手术信息"
    add-title="添加手术信息"
    edit-title="修改手术信息"
    :one-level-name="oneLevelName" 
    :two-level-name="twoLevelName"
    ></ever-temp>
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
