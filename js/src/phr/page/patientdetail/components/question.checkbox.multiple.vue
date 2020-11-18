<template>
  <div>
    <div v-for="(item, index) in questionData.rowList" :key="item.id">
      <div class="subqu-title">{{ item.quItemName }}:</div>
      <question-checkbox
        v-model="item.value"
        :questionData="questionData"
        :row="item"
        :answer="answer"
      ></question-checkbox>
    </div>
  </div>
</template>

<script>
import questionCheckbox from './question.checkbox'
export default {
  components: {
    questionCheckbox
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
  methods: {

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
