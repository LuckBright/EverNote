<template>
  <div class="order-box">
    <draggable
      v-model="newQuestionData.itemList"
      group="people"
      @start="drag = true"
      @end="dragEnd"
    >
      <div
        v-for="(element, index) in newQuestionData.itemList"
        :key="element.id"
        class="order-item"
      >
        {{ index + 1 }}. {{ element.quItemName }}
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  props: ['value', 'questionData', 'answer'],
  components: {
    draggable
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      currentChecked: null,
      newQuestionData: { itemList: [] }
    }
  },
  created () {
    if (this.newQuestionData.itemList.length === 0) {
      this.newQuestionData = this.questionData
      this.$emit('change', this.newQuestionData.itemList)
    }
  },
  watch: {
    answer: {
      handler (val) {
        if (val) {
          this.newQuestionData = { itemList: [] }
          const tempVal = [...val]
          const tempres = tempVal.sort((a, b) => {
            const val1 = a.answer
            const val2 = b.answer
            return val1 - val2
          })
          tempres.forEach((item, index) => {
            const resOption = this.questionData.itemList.find(qitem => qitem.id === item.quItemId)
            this.newQuestionData.itemList.push(resOption)
          })
          this.$emit('change', [...this.newQuestionData.itemList])
        }
      },
      immediate: true,
    },
  },
  methods: {
    dragEnd () {
      this.$emit('change', [...this.newQuestionData.itemList])
    }
  }
}
</script>

<style lang="less" scoped>
@import '../less/check';
.order-item {
  padding: 5px 10px;
  border: solid 1px @box-border;
  border-radius: 5px;
  margin-bottom: 5px;
  background: @block-bg;
}
</style>
