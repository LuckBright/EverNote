<template>
  <span class="cell-content">
    <span v-if="col.beforeHtmlFormatter" v-html="getStaticHtml(col.beforeHtmlFormatter)" @click="onClickHandle(col, col.beforeHtmlEvent, scope.row, scope)"></span><template v-if="col.component"><ever-table-cell-component :scope="scope" :col="col" :component="col.component" @eventChange="onClickHandle"></ever-table-cell-component></template><template v-else><span>{{content}}</span></template><span v-if="col.afterHtmlFormatter" v-html="getStaticHtml(col.afterHtmlFormatter)" @click="onClickHandle(col, col.afterHtmlEvent, scope.row)"></span>
  </span>
</template>

<script>
import everTableCellComponent from './evertablecellcomponent.vue'
export default {
  props: ['scope', 'col', 'content'],
  methods: {
    getStaticHtml (htmlFormatter) {
      return typeof htmlFormatter === 'function' ? htmlFormatter({ value: this.scope.row[this.col.prop], row: this.scope.row, col: this.col }) : htmlFormatter
    },
    onClickHandle (col, event, row, scope) {
      if (event) {
        this.$emit('eventChange', col, event.prop || event, row, typeof event.href === 'function' ? event.href({ row }) : event.href, event.target, scope)
      }
    }
  },
  components: { everTableCellComponent }
}
</script>

<style scoped lang="less">
</style>
