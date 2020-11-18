<!--  -->
<template>
  <div class="heading" :class="`heading${iconIndex}`">{{ title }}</div>
</template>

<script>
export default {
  props: {
    iconIndex: Number,
    title: String
  },
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
.heading {
  font-size: 20px;
  padding-top: 30px;
  text-align: center;
  margin-left: 21px;
  margin-bottom: 20px;
  position: relative;
  box-sizing: border-box;
  &::before {
    content: '';
    position: absolute;
    width: 21px;
    height: 21px;
    background-size: 100% 100%;
  }
}
.heading0 {
  &::before {
    left: 40px;
    background-image: url('../img/icon04.png');
  }
}
.heading1 {
  &::before {
    left: 38px;
    background-image: url('../img/icon01.png');
  }
}
.heading2 {
  &::before {
    left: 30px;
    background-image: url('../img/icon03.png');
  }
}
.heading3 {
  &::before {
    left: 20px;
    background-image: url('../img/icon02.png');
  }
}
.heading4 {
  text-align: unset;
  margin-left: 79px;
  &::before {
    left: -31px;
    background-image: url('../img/icon05.png');
  }
}
.heading5 {
  margin-top: 10px;
  &::before {
    left: 8px;
    background-image: url('../img/icon06.png');
  }
}
.heading6 {
  &::before {
    left: 30px;
    background-image: url('../img/icon07.png');
  }
}
</style>
