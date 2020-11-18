<template>
<div class="img-item" :class="classes">
  <template v-if="type === '1'">
    <ever-image style="width: 100%;height: 100%;" :src="itemData.img"></ever-image>
    <p class="title">{{itemData.title}}</p>
    <span class="sub-title">{{itemData.desc}}</span>
  </template>
  <template v-else-if="type === '2'">
    <template v-if="itemData.img">
      <ever-image style="width: 100%;height: 100%;" :src="itemData.img"></ever-image>
    </template>
    <template v-else>
      <div class="icon-wrap">
        <i class="el-icon-plus"></i>
      </div>
    </template>
  </template>
</div>
</template>

<script>
import filePath from '../mixins/filePath'

export default {
  name: 'add.imgtitle.item',
  mixins: [filePath],
  props: {
    type: {
      type: String,
      default: '2'
    },
    cell: {
      type: [Number, String],
      default: 3
    },
    itemData: {
      type: Object,
      default: () => { return {} }
    }
  },
  computed: {
    classes () {
      return `cell${this.cell} ${this.type === '2' ? 'dashed' : ''}`
    }
  }
}
</script>

<style scoped lang="less">
  .img-item{
    position: relative;
    display: inline-block;
    border-radius: 10px;
    cursor: pointer;
    background: #fff;
    .el-image{
      border-radius: 5px;
    }
    .icon-wrap{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
    .title{
      line-height: 1;
      font-size: 14px;
      color: #333333;
      margin-top: 10px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .sub-title{
      margin-top: 8px;
      font-size: 12px;
      color: #798192;
      line-height: 1.5;
      height: 36px;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      /* autoprefixer: off */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
    }
  }
  .dashed{
    border: 1px dashed #d9d9d9;
  }
  .cell1{
    width: 281px;
    height: 91px;
    border-radius: 10px;
    .icon-wrap{
      font-size: 18px;
    }
  }
  .cell2{
    width: 150px;
    height: 86px;
  }
  .cell3{
    width: 125px;
    height: 83px;
  }
</style>
