<template>
  <div>
    <div v-if="options && options.length">
      <span v-for="(option,index) in options" :key="index" class="item" :class="{active: value === option.id}" @click="setSelect(option)">
        {{option.name}}
      </span>
    </div>
    <div v-else><span>无</span></div>
  </div>
</template>
<script>
  export default {
    props: ['options', 'value'],
    methods: {
      setSelect (option) {
        this.selected = option
      }
    },
    computed: {
      selected: {
        set (val) {
          this.$emit('input', val.id)
        },
        get () {
          return this.value
        }
      }
    }
  }
</script>
<style scoped>
  .item {
    margin-right: 10px;
    cursor: pointer;
  }
  .item.active {
    color: #1C7BEF;
  }
</style>
