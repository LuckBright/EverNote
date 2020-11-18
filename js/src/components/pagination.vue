<template>
  <el-row type="flex" :justify="justify || 'end'" v-if="totalCount && totalCount > 0">
    <el-pagination
      :background="!noBg"
      :key="current"
      :page-sizes="pageSizes || [10, 20, 30, 50]"
      :page-size="pagesize1"
      :current-page.sync="currentPage"
      :layout="layout || 'total, sizes, prev, pager, next, jumper'"
      :pager-count="pagerCount || 7"
      :small="small"
      :total="totalCount"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    ></el-pagination>
  </el-row>
</template>

<script>
export default {
  name: 'pageination',
  props: ['totalCount', 'pagesize', 'current', 'pageSizes', 'justify', 'layout', 'pagerCount', 'small', 'noBg'],
  data () {
    return {
      currentPage: this.current || 1,
      pagesize1: this.pagesize || 20
    }
  },
  mounted () {
    setTimeout(() => {
      this.currentPage = this.current
    }, 500)
  },
  methods: {
    handleSizeChange () {
      this.pagesize1 = arguments[0]
      this.$emit('size-change', arguments[0])
    },
    handleCurrentChange (pagenum) {
      this.$emit('current-change', arguments[0])
    }
  },
  watch: {
    'current': function (newVal) {
      this.currentPage = newVal
    },
    'currentPage': function (newVal) {
      this.$emit('update:current', newVal)
    }
  }
}
</script>

