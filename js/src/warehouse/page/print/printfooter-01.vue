<template>
  <div id="footer">
    <div class="ever_print_footer">
      <div class="inner">
        <div class="footer_info">
          <div id="last_page">
            <ul class="person">
              <li><span>申请人：____________________________</span></li>
              <li><span>主任签字：______________________________</span></li>
              <!-- <li><span>代办人：_____________________</span></li>
              <li><span>成本会计签字：________________</span></li>
              <li><span>主管负责人签字：______________</span></li>
              <li><span>院长签字：___________________</span></li> -->
            </ul>
          </div>
          <div style="clear: both; height: 0"></div>
          <span v-for="(item, index) in footerArr" :key="index">{{item.name}}：{{item.prev ? item.prev : ''}}{{(value && item.data) ? (item.data == 'createDate' && createDate ? createDate : value[item.data]) : ''}}</span>
          <!-- <span style="text-align: right">第<var id="print_page_num">1</var>页/共<var id="print_page_total_num">1</var>页</span> -->
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
 .ever_print_footer /deep/ .footer_info span:nth-child(3) { -webkit-box-flex: 2; flex: 2}
 .ever_print_footer /deep/ .footer_info span { font-size: 13px; font-family: '微软雅黑'}
 .ever_print_footer .inner { line-height: 24px}
 #last_page { width:  100%; float: left;}
 ul.person { padding: 0px; width: 100%;}
 .person li { width: 50%; float: left; text-align: left; height: 24px;}
 .person li:nth-child(3n) { text-align: right;}
 .person li:nth-child(5), .person li:nth-child(2) { text-align: center;}
</style>
