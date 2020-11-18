<template>
  <div class="score-box">
    <div
      :class="{ 'score-block-item': true, checked: item <= currentChecked }"
      v-for="(item, index) in scoreBlockCount"
    >
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['value', 'questionData', 'endScore', 'answer', 'row'],
  data () {
    return {
      currentChecked: 0,
      scoreBlockCount: []
    }
  },
  created () {
    const endScore = this.endScore || 5
    for (let i = 1; i <= endScore; i++) {
      this.scoreBlockCount.push(i)
    }
  },
  watch: {
    answer: {
      handler (val) {
        if (val && val.length !== 0) {
          if (this.row) {
            const tempres = val.filter(vitem => this.row.id === vitem.quRowId)
            const tempitem = tempres.find((ritem) => {
              return ritem.quColId === this.questionData.id
            })
            this.checkScore(tempitem.answer)
          } else {
            const tempitem = val.find((item) => {
              return item.quItemId === this.questionData.id
            })
            this.checkScore(tempitem.answer)
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    checkScore (item) {
      this.currentChecked = item
      this.$emit('change', this.questionData, item)
    },
  }
}
</script>

<style lang="less" scoped>
@import '../less/var';
.score-box {
  display: flex;
}
.score-block-item {
  background: @block-bg;
  text-align: center;
  flex: 1;
  display: inline-block;
  border-right: solid 1px #fff;
  padding: 3px 0 2px;
  &.checked {
    background: @primary-color;
    color: #fff;
  }
}
.result-score {
  flex: 1;
}
</style>
