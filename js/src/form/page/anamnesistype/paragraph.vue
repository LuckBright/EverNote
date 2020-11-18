<template>
  <ever-temp
    type-code="3"
    list-api="paragraph"
    add-api="addParagraph"
    edit-api="editParagraph"
    search-name="段落名称"
    page-name="段落信息"
    add-title="添加段落信息"
    edit-title="修改段落信息"
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
