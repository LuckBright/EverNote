<template>
  <div class="right-tree-container">
    <div class="right-tree-box">
      <binglitree @nodeclick="handleNodeClick" :shoushu="true"></binglitree>
    </div>
    <div class="tree-detail">
      <div class="tree-detail-inner right-main-container">
        <evereditor :html="html" v-if="html" :editable="false"></evereditor>
      </div>
    </div>
  </div>
</template>

<script>
import binglitree from './components/binglitree'
import evereditor from 'evereditor'
export default {
  data () {
    return {
      html: null
    }
  },
  methods: {
    handleNodeClick (data, node) {
      this.html = data.content
    }
  },
  components: {
    binglitree,
    evereditor
  }
}
</script>
<style scoped>
  /deep/ .ever__editor.medical .editor_content_wrap .editor__content {
    margin: 0;
  }
</style>
