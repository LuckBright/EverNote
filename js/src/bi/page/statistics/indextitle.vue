<!--  -->
<template>
  <div class="title-container">
    <span class="big-font">{{$store.state.currentUser.organizationName}}</span>
    <span class="small-font">统计分析平台</span>
  </div>
</template>

<script>
export default {
  props: {},
  data () {
    return {
    }
  },

  components: {},

  computed: {},

  created () { },

  methods: {}
}

</script>
<style lang='scss' scoped>
.title-container {
  height: 82px;
  box-sizing: border-box;
  padding-top: 30px;
  text-align: center;
  color: white;
  .big-font {
    font-size: 40px;
    font-weight: 500;
    color: #208fef;
  }
  .small-font {
    font-size: 28px;
    margin-left: 15px;
    font-weight: 400;
  }
}
</style>
