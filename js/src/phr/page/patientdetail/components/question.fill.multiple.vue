<template>
  <div>
    <div v-for="(item, index) in questionData.itemList" :key="item.id">
      <div class="subqu-title">{{ item.quItemName }}:</div>
      <question-fill
        @input="changeVal"
        :questionData="item"
        :answer="currentAnswer"
        :row="row"
        :quType="questionData.quType"
      ></question-fill>
    </div>
  </div>
</template>

<script>
import questionFill from './question.fill'
export default {
  components: {
    questionFill
  },
  props: ['value', 'questionData', 'answer', 'row'],
  model: {
    prop: 'value',
    event: 'input'
  },
  data () {
    return {
      currentAnswer: null,
      currentVal: '',
      resObj: []
    }
  },
  created () {
    this.currentVal = this.value
  },
  watch: {
    answer: {
      handler (val) {
        this.currentAnswer = val
      },
      immediate: true
    }
  },
  methods: {
    changeVal (res, obj) {
      const tempindex = this.resObj.findIndex((item, index) => {
        return item.id === obj.id
      })
      if (tempindex !== -1) {
        this.resObj[tempindex].value = res
      } else {
        this.resObj.push(Object.assign({}, obj, { value: res }))
      }

      let lastitem = this.questionData.itemList[this.questionData.itemList.length - 1]
      if (this.questionData.quType === 'FORMULA' && this.resObj.length >= (this.questionData.itemList.length - 1) && obj.id !== lastitem.id) {
        let formula = lastitem.formula
        this.resObj.forEach((ritem, rindex) => {
          if (rindex < this.questionData.itemList.length - 1) {
            let req = new RegExp(ritem.formula, 'g')
            formula = formula.replace(req, ritem.value)
          }
        })
        /* eslint-disable */
        this.currentAnswer = [Object.assign({}, lastitem, { value: eval(formula), answer: eval(formula), quItemId: lastitem.id })]
      }
      this.$emit('input', this.resObj)
    }
  }
}
</script>

<style lang="less" scoped>
.subqu-title {
  font-size: 13px;
  color: #666;
  padding: 3px 7px 2px;
}
</style>
