<template>
  <div
    class="tooth"
    v-bind:class="{ selected: selected}"
    ref="tooth"
    @click="selectTooth(pos, value, type)"
  >
    <template v-if="pos === 'leftbottom' || pos === 'rightbottom'">
      <p class="p">{{value}}</p>
      <img class="img" :src="'/web'+imgsrc">
    </template>
    <template v-else>
      <img class="img" :src="'/web'+imgsrc">
      <p class="p">{{value}}</p>
    </template>
  </div>
</template>

<script>
export default {
  props: ['pos', 'value', 'type', 'imgsrc', 'selected'],
  data () {
    return {
      isActive: false
    }
  },
  created () {

  },
  methods: {
    selectTooth (pos, val, type) {
      this.isActive = !this.isActive
      this.$emit('getToothMsg', pos, val, type)
    }
  }
}
</script>

<style scoped>
.tooth {
  display: inline-block;
  border: 1px solid transparent;
  text-align: center;
  padding: 5px 2px;
  border-radius: 1px;
}
.tooth.selected,
.tooth:hover {
  background: #f1f1f1;
}
.tooth.selected {
  background: #f1f1f1;
}
.tooth .img {
  width: 30px;
  height: 80px;
}
.tooth .p {
  background: #fff;
  margin: 2px;
  height: 16px;
  line-height: 16px;
  font-size: 12px;
  border-radius: 2px;
}
</style>
