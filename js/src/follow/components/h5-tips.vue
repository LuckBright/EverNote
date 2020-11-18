<template>
<div>
    <div class="tips-wrapper">
        <div class="tips-box">
            <div class="tips-header">
                <div class="tips-box__title">
                    <p class="fz16">确定提交当前内容？</p>
                    <p class="fz14">Confirm to submit the current content?</p>
                </div>
            </div>
            <div class="tips-btns">
                <span @click="submit(0)">取消 No</span>
                <span @click="submit(1)">确定 Yes</span>
            </div>
        </div>
    </div>
    <div class="tips-top"></div>
 </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  methods: {
    submit (val) {
      this.$emit('getType', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.tips-wrapper{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 2011;
}
.tips-top{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
    background: #000;
    z-index: 2010;
}
.tips-box{
    display: inline-block;
    width: 280px;
    vertical-align: middle;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 18px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    text-align: left;
    overflow: hidden;
    backface-visibility: hidden;
    margin-top:200px;
}
.tips-header{padding:20px 20px 0 20px;text-align: center;box-sizing: border-box;}
.tips-btns{
    justify-content: space-around;
    margin-top:22px;
    border-top:1px solid #EEEEEE;
    span{
    display: inline-block;
    width:130px;
    text-align: center;
    vertical-align: middle;
    line-height: 50px;
    }
    span:nth-child(1){color: #666666;border-right:1px solid #EEEEEE;}
    span:nth-child(2){color: #00AAAD;}
}

.fz14{font-size:14px;margin-top: 4px;}
.fz16{font-size:16px;margin:0px;}
</style>
