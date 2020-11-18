<template>
  <div>
    <el-carousel :height="moduleData.styleType === 1 ? '140px' : '120px'" indicator-position="outside" :autoplay="false">
      <el-carousel-item v-for="(item, index) in moduleData.moduleArr" :key="index">
        <el-image
          style="width: 100%; height: 100%"
          :src="$ever.fileUrl2 + item.img"
          fit="cover"></el-image>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  props: [ 'moduleData' ],
  data () {
    return {
    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
  /deep/ .el-carousel__indicator{
    .el-carousel__button{
      background: #cccccc;
      width: 5px;
      height: 5px;
      border-radius: 200px;
    }
  }
  /deep/ img{
    border-radius: 10px;
  }
  /*/deep/ .el-carousel__indicators--outside button{*/
  /*  opacity: 1;*/
  /*}*/
  /deep/ .el-carousel__indicator.is-active button{
    background: #2F69F8;
    width: 10px;
  }
  /deep/ .el-carousel__indicator--horizontal{
    padding: 8px 4px 0px;
  }
</style>
