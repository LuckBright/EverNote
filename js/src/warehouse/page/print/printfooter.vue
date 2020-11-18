<template>
  <div>
    <div class="ever_print_footer">
      <div class="inner">
        <div class="footer_info">
          <span v-for="(item, index) in footerArr" :key="index" :style="'flex:' + (item.flex ? item.flex : 1)">{{item.name}}：{{item.prev ? item.prev : ''}}{{(value && item.data) ? (item.data == 'createDate' && createDate ? createDate : value[item.data]) : ''}}</span>
          <span>第<var id="print_page_num">1</var>页/共<var id="print_page_total_num">1</var>页</span>
        </div>
        <!-- <p style="display: none"><span>第<var id="print_page_num">1</var>页/共<var id="print_page_total_num">1</var>页</span></p> -->
      </div>
    </div>
  </div>
</template>


<script>
  export default {
    props: ['value', 'footerArr', 'createDate']
  }
</script>

<style lang="scss" scoped>
 @import 'src/workspace/assets/print-01';
 // .ever_print_footer /deep/ .footer_info span:nth-child(2) { -webkit-box-flex: 2; flex: 2; text-align: right;}
 .ever_print_footer /deep/ .footer_info span:last-child { text-align: right}
 .ever_print_footer /deep/ .footer_info span { font-size: 13px; font-family: '微软雅黑'}
 .ever_print_footer .inner { line-height: 24px}
</style>
