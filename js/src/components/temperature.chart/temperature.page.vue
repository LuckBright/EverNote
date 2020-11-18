<template>
  <div class="temperature_page">
    <div class="col">当前{{currentPage}}页/共 {{totalPage}} 页</div>
    <div class="col">
      <el-pagination
          v-mod-text
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="7"
          layout="prev, pager, next,jumper"
          :total="totalPage*7">
      </el-pagination>
    </div>
    <div class="col"><el-button @click="query" size="mini" type="primary">查询</el-button></div>
    <div class="col"><slot name="print"></slot></div>
  </div>
</template>
<script>
export default {
  name: 'temperaturePage',
  props: {
    totalPage: {
      type: Number
    },
    curPage: {
      type: Number
    }
  },
  directives: {
    'modText': {
      bind (el) {
        el.querySelector('.el-pagination__jump').childNodes[0].textContent = '第'
      }
    }
  },
  data () {
    return {
      currentPage: this.curPage
    }
  },
  methods: {
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.$emit('query', val)
    },
    query () {
      if (this.currentPage < 1 || this.currentPage > this.totalPage) {
        this.$messageTips(this, 'warning', `输入值应该在1-${this.totalPage}范围内`, '提示')
        return
      }
      this.$emit('query', this.currentPage)
    },
  }
}
</script>
<style scoped lang="scss">
.temperature_page{
  display:flex;
  flex-direction: row;
  justify-content:flex-end;
  height:32px;
  line-height: 32px;
  font-size:14px;
  .col{
    margin:0 10px;
  }
}
</style>
