<template>
  <div class="layout_inner">
    <p>
      'totalCount' 一般不用传，公共的处理了
      <br>'pagesize' 一般不用传，公共的处理了
      <br>'current' 一般不用传，公共的处理了
      <br>'pageSizes' 一般不用传，公共的处理了
      <br>'justify':对齐方式 end center left
      <br>'layout' 需要显示的 元素 "'total, prev, pager, next'" 默认是最全的
      <br>'pagerCount'，一般不用传，公共的处理了
      <br>'small' boolean 个儿 大小
      <br>'noBg' booleadn 是否有背景，默认有，
      <br>
    </p>
    <h4>大多数，简单版</h4>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :pagerCount="pagerCount"
      :totalCount="totalCount"
    ></ever-pagination>
    <hr>
    <h4>完整参数</h4>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :pagerCount="pagerCount"
      :totalCount="totalCount"
      :layout="'total, prev, pager, next'"
      :justify="'start'"
      :noBg="true"
      :small="true"
    ></ever-pagination>
    <hr>
    <h4>warehouse nobg 样式</h4>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :pagerCount="pagerCount"
      :totalCount="totalCount"
      :layout="'total, prev, pager, next'"
      :noBg="true"
    ></ever-pagination>
    <hr>
  </div>
</template>
<script>
export default {
  data () {
    return {
      pagerCount: 7,
      totalCount: 123
    }
  },
  method: {
    handleSizeChange () {

    },
    handleCurrentChange () {

    }
  }
}
</script>

