<template>
  <div id="footer">
    <div class="ever_print_footer">
      <div class="inner">
        <div class="footer_info">
          <div id="last_page">
            <ul class="person">
              <li v-for="(item, index) in footerSign" :key="index" :style="item.width ? 'width:' + item.width : ''">
                <span>{{item.name}}：</span>
              </li>
            </ul>
            <div style="clear: both"></div>
          </div>
          <span v-for="(item, index) in footerArr" :key="index">{{item.name}}：{{item.prev ? item.prev : ''}}{{(value && item.data) ? (item.data == 'createDate' && createDate ? createDate : value[item.data]) : ''}}</span>
          <!-- {{createDate}} -->
          <!-- <span style="text-align: right">第<var id="print_page_num">1</var>页/共<var id="print_page_total_num">1</var>页</span> -->
        </div>
        <!-- <p style="display: none"><span>第<var id="print_page_num">1</var>页/共<var id="print_page_total_num">1</var>页</span></p> -->
      </div>
    </div>
  </div>
</template>


<script>
  export default {
    props: ['value', 'footerArr', 'footerSign', 'createDate']
  }
</script>

<style lang="scss" scoped>
 @import 'src/workspace/assets/print-01';
 .ever_print_footer /deep/ .footer_info span:nth-child(3) {text-align: right}
 .ever_print_footer /deep/ .footer_info span { font-size: 13px; font-family: '微软雅黑' }
 .ever_print_footer .inner { line-height: 24px}
 #last_page { width:  100%; float: left; padding: 10px 0}
 ul.person { padding: 0; width: 100%; margin: 0}
 .person li { border-bottom: 1px solid #000; float: left; text-align: left; height: 20px;}
 .person li span { background: #fff; height: 25px; display: inline-block; padding-left: 20px}
 .person li:first-child span { padding-left: 0px}
</style>
