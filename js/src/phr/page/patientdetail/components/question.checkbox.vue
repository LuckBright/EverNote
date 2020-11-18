<template>
  <div class="radio-box">
    <div
      :class="{
        'option-item': true,
        checked: currentCheckedArr.includes(item.id)
      }"
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
      currentCheckedArr: [],
      currentCheckedArrObj: []
    }
  },
  watch: {
    answer: {
      handler (val) {
        if (val && val.length !== 0) {
          if (this.row) {
            const tempres = val.filter(vitem => this.row.id === vitem.quRowId)
            tempres.forEach((ritem) => {
              const tempitem = this.questionData.itemList.find(oitem => oitem.id === ritem.quColId)
              this.checkIt(tempitem)
            })
          } else {
            val.forEach((item) => {
              const tempitem = this.questionData.itemList.find(oitem => oitem.id === item.quItemId)
              this.checkIt(tempitem)
            })
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    checkIt (item) {
      const tempIndex = this.currentCheckedArr.findIndex(id => id === item.id)
      if (tempIndex === -1) {
        this.currentCheckedArr.push(item.id)
        this.currentCheckedArrObj.push(item)
      }
      this.$emit('change', this.currentCheckedArrObj)
    },
  }
}
</script>

<style lang="less" scoped>
@import '../less/check';
</style>
