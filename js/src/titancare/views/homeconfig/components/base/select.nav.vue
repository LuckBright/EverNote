<template>
<div class="select-nav">
  <el-row :gutter="gutter">
    <el-col :span="span" :key="index" v-for="(item, index) in data">
      <div class="select-item" @click="select(item.value)">
        <div class="img-wrap" :class="{active: item.value === value}">
          <img :src="item.imgPath" alt="">
        </div>
        <p>{{item.text}}</p>
      </div>
    </el-col>
  </el-row>
</div>
</template>

<script>
export default {
  name: 'select.nav',
  props: {
    value: [String, Number],
    data: Array,
    gutter: {
      type: Number,
      default: 20
    }
  },
  computed: {
    span () {
      return 24 / this.data.length || 1
    }
  },
  methods: {
    select (value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>

<style scoped lang="less">
  .select-nav{
    .select-item{
      cursor: pointer;
      .img-wrap{
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        &.active{
          border: 1px solid rgba(28,123,239,0.90);
          border-radius: 4px;
          box-shadow: 0 0 4px 0 rgba(28,123,239,0.3);
        }
        img{
          width: 100%;
        }
      }
      p{
        margin-top: 10px;
        font-size: 14px;
        color: rgba(0,0,0,0.85);
        text-align: center;
      }
    }
  }

</style>
