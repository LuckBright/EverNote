<template>
  <div>
    <div v-for="(item, index) in questionData.rowList" :key="item.id">
      <div class="subqu-title">{{ item.quItemName }}:</div>
      <div class="subqu-content">
        <question-score-multiple
          v-model="item.value"
          :questionData="questionData"
          :answer="answer"
          :row="item"
        ></question-score-multiple>
      </div>
    </div>
  </div>
</template>

<script>
import questionScoreMultiple from './question.score.multiple'

export default {
  components: {
    questionScoreMultiple
  },
  props: ['value', 'questionData', 'answer'],
  model: {
    prop: 'value',
    event: 'input'
  },
  data () {
    return {
      currentVal: '',
    }
  },
  created () {
    this.currentVal = this.value
  },
  watch: {
    questionData: {
      handler (val) {
        this.$emit('input', val.rowList.filter(item => item.value && item.value.length !== 0))
      },
      deep: true
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.subqu-title {
  font-size: 13px;
  padding: 3px 0px 2px;
}
.subqu-content {
  padding: 0 5px 5px;
  /deep/ .qu-title {
    font-size: 13px;
    color: #666;
  }
}
</style>
