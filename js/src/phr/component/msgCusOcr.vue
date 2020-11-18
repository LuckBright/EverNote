<template>
  <!-- ocr-->
  <div class="pre-ocr">
    <div class="ocr-title">
      <p>{{msgData.recordName || '--'}}</p>
      <p><span>医院名称：</span>{{msgData.hospitalName || '--'}}</p>
      <p><span>报告时间：</span>{{msgData.recordTime || '--'}}</p>
    </div>
    <div class="ocr-btn">查看详情</div>
  </div>
</template>
<script>
// import { debounce, jsonStringify, WXShowLoading } from '@/utils'
// import mixinWebPageCtr from '@/mixin/webPageCtr'
// import { TEXT_COMMON } from '@/map'
export default {
  props: {
    msgData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  created () {
  }
}
</script>
<style lang="less" scoped>
.pre-ocr{
  font-size: 14px;
  color: #333333;
  background-color: #fff;
  border-radius: 8px;
  .ocr-title{
    padding: 12.5px;
    width: 225px;
    p {
      font-size: 14px;
      color: #999999;
      span{
        color: #333333
      }
    }
    p:first-child{
      color: #000000;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    p:nth-child(2){
      margin-bottom: 6px;
    }
  }
  .ocr-btn {
    padding:12.5px 0;
    font-size: 12px;
    text-align: center;
    border-top:1px solid #DDDDDD;
  }
}
</style>
