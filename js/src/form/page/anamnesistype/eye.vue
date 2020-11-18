<template>
  <ever-temp
    type-code="7"
    list-api="eye"
    add-api="addEye"
    edit-api="editEye"
    page-name="眼科信息"
    add-title="添加眼科信息"
    edit-title="修改眼科信息"
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
