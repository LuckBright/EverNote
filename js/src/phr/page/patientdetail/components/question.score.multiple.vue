<template>
  <div class="score-box">
    <div
      :class="{ 'option-item': true }"
      v-for="(item, index) in questionData.itemList"
      :key="index"
    >
      <div class="qu-title">
        {{ item.quItemName }}
      </div>
      <div>
        <question-score
          :endScore="questionData.paramInt02"
          :questionData="item"
          @change="changeVal"
          :answer="answer"
          :row="row"
        ></question-score>
      </div>
    </div>
  </div>
</template>

<script>
import questionScore from './question.score'

export default {
  props: ['value', 'questionData', 'answer', 'row'],
  components: {
    questionScore
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  created () {
    this.newQuestionData = this.questionData
  },
  data () {
    return {
      newQuestionData: {},
      resObj: [],
      scoreBlockCount: [1, 2, 3, 4, 5]
    }
  },
  methods: {
    changeVal (obj, res) {
      const tempindex = this.resObj.findIndex((item, index) => {
        return item.id === obj.id
      })
      if (tempindex !== -1) {
        this.resObj[tempindex].value = res
      } else {
        this.resObj.push(Object.assign({}, obj, { value: res }))
      }
      this.$emit('change', this.resObj)
    }
  }
}
</script>

<style lang="less" scoped>
@import '../less/var';
</style>
