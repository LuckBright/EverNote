<template>
  <ul style="display:inline-block; white-space: nowrap; margin-left: -10px">
    <li v-for="i in range" :class="{active: i <= value}" style="display: inline;margin-right: 10px; cursor:pointer" @click="toggle(i)">
      +
    </li>
  </ul>
</template>
<script>
  export default {
    props: ['value'],
    data () {
      return {
        range: [1, 2, 3, 4]
      }
    },
    methods: {
      toggle (index) {
        if (index === this.value) {
          this.$emit('input', 0)
        } else {
          this.$emit('input', index)
        }
      }
    }
  }
</script>
<style scoped>
  ul {
    padding-left: 0px;
    margin-left: 10px;
  }
  li.active {
    color: blue;
  }
  li {
    font-weight: bold;
    font-size: 18px;
  }

</style>
