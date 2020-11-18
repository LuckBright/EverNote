<template>
  <div class="radio-box">
    <div
      :class="{ 'option-item': true, checked: item.id === currentChecked }"
      v-for="(item, index) in questionData.itemList"
      :key="index"
    >
      {{ item.quItemName }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['value', 'questionData', 'answer', 'row'],
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      currentChecked: null,
    }
  },
  created () {
  },
  watch: {
    answer: {
      handler (val) {
        if (val) {
          if (this.row) {
            if (val.length !== 0) {
              const tempres = val.filter(vitem => this.row.id === vitem.quRowId)
              const tempitem = this.questionData.itemList.find(item => item.id === tempres[0].quColId)
              this.doCheck(tempitem)
            }
          } else {
            if (val.length !== 0) {
              const tempitem = this.questionData.itemList.find(item => item.id === val[0].quItemId)
              this.doCheck(tempitem)
            }
          }
        }
      },
      immediate: true
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
@import '../less/check';
</style>
