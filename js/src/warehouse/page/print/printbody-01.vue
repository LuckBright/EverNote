<template>
  <div>
    <!-- <print-header id="print_header" :recordData="recordData" :printHeader="printHeader" title="领用单" :tableHead="tableHead"></print-header> -->
   <div class="medical_record_print ever_print_body page_content_wrap">
     <div v-for="(item,index) in value" :key="index" class="table_item">
       <span v-for="(sitem, sindex) in tableHead" :key="sindex" :style="'flex:' + (sitem.flex ? sitem.flex : 1)">
         <div v-if="sitem.list" class="print_table_header_small">
           <strong v-for="(list, key) in sitem.list" :key="key" style="flex:1">{{item[list.data]}}</strong>
         </div>
         <div v-else>
           <span v-if="sitem.type == 'date'">{{item[sitem.data] || ''}}</span>
           <span v-else>{{sitem.prev ? sitem.prev : ''}}{{item[sitem.data]}}</span>
         </div>
       </span>
     </div>
   </div>
  </div>
</template>
<script>
import printHeader from '../print/printheader'
export default {
  props: ['value', 'tableHead', 'recordData', 'printHeader'],
  components: {
    printHeader
  }
}
</script>
<style lang="scss" scoped>
.print_table_header_small strong {width: 50%; float: left; font-weight: normal;}
.table_item { border-bottom: 1px solid #000; text-align: center; line-height: 18px; padding: 5px 0}
// .ever_print_body .table_item span {width: 1%; text-align: center; padding: 0; white-space:nowrap; font-size: 12px}
.ever_print_body .table_item span {text-align: center; padding: 0; font-size: 12px}
.ever_print_body .table_item span:first-child { text-align: left;}
.table_item:last-child {border-bottom: none}
</style>
