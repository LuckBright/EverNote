<template>
  <!-- 预问诊-->
  <div class="pre-survery">
    <p>{{msgData.questionName || "--"}}</p>
    <div>查看详情</div>
  </div>
</template>
<script>
export default {
  props: {
    msgData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
  },
  data () {
    return {
    }
  },
  onUnload () {
  }
}
</script>
<style lang="less" scoped>
.pre-survery{
  font-size: 14px;
  color: #333333;
  width: 225px;
  background-color: #fff;
  border-radius: 4px;
  p{
  padding: 12.5px;
  font-weight: 700;
  }
  div {
    padding: 12.5px;
    font-size: 12px;
    text-align: center;
    border-top:1px solid #DDDDDD;
  }
}
</style>
