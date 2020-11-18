<template>
  <input
    ref="inputDom"
    :class="{ 'm-input': true }"
    :value="currentVal"
    disabled="true"
    :type="quType === 'FORMULA' ? 'number' : 'text'"
  />
</template>

<script>
export default {
  props: ['value', 'questionData', 'answer', 'row', 'type', 'quType', 'text'],
  model: {
    prop: 'value',
    event: 'input'
  },
  data () {
    return {
      currentVal: ''
    }
  },
  created () {
    this.currentVal = this.text
    if (this.value) {
      this.currentVal = this.value
    }
  },
  watch: {
    val (val) {
      this.currentVal = val
    },
    answer: {
      handler (val) {
        if (val && val.length !== 0) {
          if (this.row) {
            const tempres = val.filter(vitem => this.row.id === vitem.quRowId)
            const tempitem = tempres.find((ritem) => {
              return ritem.quColId === this.questionData.id
            })
            if (tempitem) {
              this.currentVal = tempitem.answer
              this.$emit('input', tempitem.answer, this.questionData)
            }
          } else {
            const tempitem = val.find((item) => {
              return item.quItemId === this.questionData.id
            })
            if (tempitem) {
              this.currentVal = tempitem.answer
              this.$emit('input', tempitem.answer, this.questionData)
            }
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    inputChange (e) {
      this.$emit('input', e.target.value, this.questionData)
    },
    inputFocus (e) {
      if (this.type === 'pc') {
        return
      }
    },
    setScrollTop () {
      let top = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      window.scrollTo(0, top + 1)
      setTimeout(() => {
        window.scrollTo(0, top)
      }, 300)
    }
  },
}
</script>

<style lang="less" scoped>
.m-input {
  -webkit-appearance: none;
  height: 40px;
  box-sizing: border-box;
  border: solid 1px #ededed;
  border-radius: 200px;
  width: 100%;
  outline: 0 !important;
  padding: 5px 20px;
}
.top-input {
  position: relative;
  bottom: 15px;
}
</style>
