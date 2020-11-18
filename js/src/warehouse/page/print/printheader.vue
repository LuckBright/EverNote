<template>
  <div>
    <div class="ever_print_header pos_re">
      <div>
        <div class="ever_barcode ever_barcode_01 pos_ab" style="height: 50px!important;">
          <barcode v-if="recordData.patientId" :value="String(recordData.patientId)" :options="{ displayValue: true, width: 6, height: 180, fontSize: 72, margin: 12, textMargin: 0, font: '微软雅黑' }" tag="img"></barcode>
        </div>
        <h1><span>{{recordData.origName || $store.state.currentUser.organizationName}}</span><span>{{title}}</span></h1>
        <ul class="top_info">
          <li v-for="(item, index) in printHeader" :key="index" :style="item.width ? 'width:' + item.width : ''">
            {{item.name}}：{{item.data}}
          </li>
        </ul>
        <div class="print_table_header" v-if="tableHead && tableHead.length">
          <span v-for="(item, index) in tableHead" :key="index" :style="'flex:' + (item.flex ? item.flex : 1)" :class="item.class ? item.class : ''">
            {{item.name}}
            <div v-if="item.list" class="print_table_header_small">
              <strong v-for="(list, key) in item.list" :key="key" style="flex:1">{{list.name}}</strong>
            </div>
          </span>
        </div>
      </div>
      <div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['recordData', 'tableHead', 'title', 'printHeader'],
    data () {
      return {
        tableData: []
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss" scoped>
 @import 'src/workspace/assets/print-01';
 .ever_barcode_01.pos_ab { width: 100%; height: 50px;}
 .ever_barcode img {width: auto}
 .pos_ab {left: 20px; top: -10px}
 .ever_print_header { padding-bottom: 5px}
 .ever_print_header .top_info { border-bottom: 1px solid #000;}
 .ever_print_header .print_table_header { border-bottom: 1px solid #000;}
 .ever_print_header .print_table_header span { text-align: center; border-left: 1px solid #000; height: 40px; line-height: 40px; font-weight: normal; font-size: 13px}
 .ever_print_header .print_table_header span:last-child { border-right: 1px solid #000}
 .ever_print_header .print_table_header .lh { line-height: 20px;}
 .ever_print_header .top_info { padding-top: 10px}
 .ever_print_header .top_info li:last-child { text-align: right;}
 .print_table_header_small strong {width: 50%; display: inline-block; font-weight: normal; border-top: 1px solid #000; border-left: 1px solid #000;margin-left: -1px}
</style>
