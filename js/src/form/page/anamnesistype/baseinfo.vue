<template>
  <ever-temp
    type-code="1"
    list-api="baseInfo"
    add-api="addBase"
    edit-api="editBase"
    page-name="基本信息"
    add-title="添加基本信息"
    edit-title="修改基本信息"
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
