<template>
  <div>
    <div v-for="(item, index) in questionData.rowList" :key="item.id">
      <div class="subqu-title">{{ item.quItemName }}:</div>
      <div class="subqu-content">
        <question-fill-multiple
          v-model="item.value"
          :row="item"
          :questionData="questionData"
          type="group"
          :answer="answer"
        ></question-fill-multiple>
      </div>
    </div>
  </div>
</template>

<script>
import questionFillMultiple from './question.fill.multiple'
export default {
  components: {
    questionFillMultiple
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
    'questionData.rowList': {
      handler (val) {
        this.$emit('input', val.filter((item) => {
          let tempflag = true
          if (item.value && item.value.length !== 0) {
            const tempres = item.value.find((sitem, index) => {
              return !sitem.value
            })
            if (tempres) {
              tempflag = false
            }
          } else {
            tempflag = false
          }
          return tempflag
        }))
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
