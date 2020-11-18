<template>
  <div class="recall-step">
    <!-- icon-jiantoufangxiang -->
    <!-- <i class="icon iconfont icon-jiantoufangxiang"></i> -->
    <div class="step_item">
      <i class="icon iconfont icon-zhaohuishenhe"></i>
      医师召回申请
    </div>
    <div class="arrow" v-if="step===3">
      <i class="icon iconfont icon-jiantoufangxiang"></i> 
    </div>
    <div class="step_item" v-if="step===3">
      <i class="icon iconfont icon-yishishenhe"></i>
      质控医生审核
    </div>
    <div class="arrow">
      <i class="icon iconfont icon-jiantoufangxiang"></i> 
    </div>
    <div class="step_item">
      <i class="icon iconfont icon-yishishenhe"></i>
      病案医师审核
    </div>
  </div>
</template>
<script>
export default {
  name: 'recall_step',
  props: {
    step: {
      type: Number,
      default: 2
    }
  }
}
</script>
<style lang="scss" scoped>
.recall-step{
  display: flex;
  flex-direction: row;
  padding-left:15px;
}
.active {
  .step_item {
    color:#1C7BF0;
    background: rgba(28,123,239,0.10);
    border: 1px solid #1C7BEF;
    border-radius: 2px;
  }
  .arrow {
    color: #1C7BEF;
  }
}
.step_item{
  margin:0 10px;
  width: 125px;
  height:36px;
  border:1px solid #1C7BEF;
  text-align: center;
  line-height:36px;
  color:#666;
  background: rgba(102,102,102,0.10);
  border: 1px solid #DDDDDD;
  border-radius: 2px;
}
.arrow{
  font-size:20px;
  color: #DDDDDD;
}
</style>
