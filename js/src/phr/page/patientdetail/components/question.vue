<template>
  <div class="qu-content">
    <div class="info-box">
      <img
        class="info-avatar"
        src="../../../util/infoavatar.png"
      />
      <span class="info">{{ formatTitle(questionData.quTitle) }}</span>
    </div>
    <div v-if="questionData.quType === 'FILLBLANK'">
      <div class="normal-qu-box">
        <!-- <div class="qu-title">{{ formatTitle(questionData.quTitle) }}</div> -->
      </div>
    </div>
    <div v-else class="normal-qu-box">
      <div class="qu-title">{{ formatTitle(questionData.quTitle) }}</div>
      <div class="qu-data-box">
        <template
          v-if="
            questionData.quType === 'RADIO' ||
              questionData.quType === 'CODE_RADIO'
          "
        >
          <question-radio
            v-model="currentVal"
            :questionData="questionData"
            :answer="answer"
            :text="text"
          ></question-radio>
        </template>
        <template
          v-if="
            questionData.quType === 'CHECKBOX' ||
              questionData.quType === 'CODE_CHECKBOX'
          "
        >
          <question-checkbox
            v-model="currentVal"
            :questionData="questionData"
            :answer="answer"
          ></question-checkbox>
        </template>
        <template v-if="questionData.quType === 'SCORE'">
          <question-score-multiple
            v-model="currentVal"
            :questionData="questionData"
            :answer="answer"
          ></question-score-multiple>
        </template>
        <template v-if="questionData.quType === 'ORDERQU'">
          <question-order
            v-model="currentVal"
            :questionData="questionData"
            :answer="answer"
          ></question-order>
        </template>
        <template v-if="questionData.quType === 'MULTIFILLBLANK'">
          <question-fill-multiple
            v-model="currentVal"
            :questionData="questionData"
            :answer="answer"
          ></question-fill-multiple>
        </template>
        <template v-if="questionData.quType === 'FORMULA'">
          <question-fill-multiple
            v-model="currentVal"
            :questionData="questionData"
            :answer="answer"
          ></question-fill-multiple>
        </template>
        <template v-if="questionData.quType === 'CHENRADIO'">
          <question-radio-multiple
            v-model="currentVal"
            :questionData="questionData"
            :answer="answer"
          ></question-radio-multiple>
        </template>
        <template v-if="questionData.quType === 'CHENCHECKBOX'">
          <question-checkbox-multiple
            v-model="currentVal"
            :questionData="questionData"
            :answer="answer"
          ></question-checkbox-multiple>
        </template>
        <template v-if="questionData.quType === 'CHENSCORE'">
          <question-score-group
            v-model="currentVal"
            :questionData="questionData"
            :answer="answer"
          ></question-score-group>
        </template>
        <template v-if="questionData.quType === 'CHENFBK'">
          <question-fill-group
            v-model="currentVal"
            :questionData="questionData"
            :answer="answer"
          ></question-fill-group>
        </template>
      </div>
    </div>
    <div class="answer-box">{{ text }}</div>
  </div>
</template>

<script>
import questionFill from './question.fill'
import questionFillMultiple from './question.fill.multiple'
import questionFillGroup from './question.fill.group'
import questionRadio from './question.radio'
import questionRadioMultiple from './question.radio.multiple'
import questionCheckbox from './question.checkbox'
import questionCheckboxMultiple from './question.checkbox.multiple'
import questionScoreMultiple from './question.score.multiple'
import questionScoreGroup from './question.score.group'
import questionOrder from './question.order'
export default {
  props: ['questionData', 'answer', 'type', 'text'],
  components: {
    questionFill,
    questionFillMultiple,
    questionFillGroup,
    questionRadio,
    questionRadioMultiple,
    questionCheckbox,
    questionCheckboxMultiple,
    questionScoreMultiple,
    questionScoreGroup,
    questionOrder
  },
  data () {
    return {
      answerFileList: [],
      currentVal: '',
      disabled: false,
    }
  },
  created () {
  },
  watch: {
    answer: {
      handler (val) {
        if (val && val.length !== 0) {
          if (this.questionData.quType === 'FILLBLANK') {
            this.currentVal = val[0].answer
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    formatTitle (quTitle) {
      return quTitle ? quTitle.replace(/<[^>]+>/g, '') : ''
    },
    sendAnswer () {
    },
    quDisable () {
      if (this.questionData && ['FILLBLANK', 'RADIO', 'CODE_RADIO', 'CHECKBOX', 'CODE_CHECKBOX', 'ORDERQU'].includes(this.questionData.quType)) {
        if ((this.currentVal && !Array.isArray(this.currentVal)) || (Array.isArray(this.currentVal) && this.currentVal.length !== 0)) {
          return false
        }
      } else if (this.questionData && this.questionData.quType === 'SCORE') {
        if (Array.isArray(this.currentVal) && this.currentVal.length === this.questionData.itemList.length) {
          return false
        }
      } else if (this.questionData && this.questionData.quType === 'MULTIFILLBLANK') {
        if (Array.isArray(this.currentVal) && this.currentVal.length === this.questionData.itemList.length) {
          return false
        }
      } else if (this.questionData && this.questionData.quType === 'FORMULA') {
        if (Array.isArray(this.currentVal) && this.currentVal.length === this.questionData.itemList.length) {
          return false
        }
      } else if (this.questionData && ['CHENRADIO', 'CHENCHECKBOX'].includes(this.questionData.quType)) {
        if (Array.isArray(this.currentVal) && this.currentVal.length === this.questionData.rowList.length) {
          return false
        }
      } else if (this.questionData && ['CHENSCORE'].includes(this.questionData.quType)) {
        if (Array.isArray(this.currentVal) && this.currentVal.length === this.questionData.rowList.length) {
          let tempFlag = false
          this.currentVal.forEach((item, index) => {
            if (item.value.length !== this.questionData.columnList.length) {
              tempFlag = true
            }
          })
          return tempFlag
        }
      } else if (this.questionData && ['CHENFBK'].includes(this.questionData.quType)) {
        if (Array.isArray(this.currentVal) && this.currentVal.length === this.questionData.rowList.length) {
          let tempFlag = false
          this.currentVal.forEach((item, index) => {
            if (item.value.length !== this.questionData.columnList.length) {
              tempFlag = true
            }
          })
          return tempFlag
        }
      }
      return true
    },
    isIphoneX () {
      // iPhone X、iPhone XS
      let isIPhoneX = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && window.screen.height === 812
      // iPhone XS Max
      let isIPhoneXSMax = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 414 && window.screen.height === 896
      // iPhone XR
      let isIPhoneXR = /iphone/gi.test(window.navigator.userAgent) && window.devicePixelRatio && window.devicePixelRatio === 2 && window.screen.width === 414 && window.screen.height === 896
      return (isIPhoneX || isIPhoneXSMax || isIPhoneXR)
    },
  },
}
</script>

<style lang="less" scoped>
.info-box {
  .info-avatar {
    vertical-align: middle;
    width: 43px;
    height: 43px;
  }
  .info {
    display: inline-block;
    padding: 10px;
    background-color: white;
    border-radius: 19px;
  }
  max-width: 90%;
  margin-bottom: 10px;
}
.answer-box {
  max-width: 90%;
  float: right;
  clear: both;
  padding: 10px;
  border-radius: 19px;
  background-color: #1C7BEF;
  margin: 10px 0px;
  color: white;
}
.top-input {
  position: relative;
  bottom: 15px;
}
.qu-content {
  clear: both;
  margin: 7px 10px 7px;
}
.fill-box {
  display: flex;
  .input-box {
    flex: 1;
    padding-right: 6px;
  }
}
.button-box {
  text-align: center;
  padding: 7px 0 7px;
  border-top: solid 1px #eee;
  /deep/ button {
    min-width: 80px;
  }
}
.normal-qu-box {
  clear: both;
  width: 90%;
  .qu-title {
    padding: 5px 0 0 10px;
    color: #666;
  }
  max-height: calc(~' 100vh - 100px ');
  background: #fff;
  border-radius: 5px;
  overflow: auto;
  .qu-data-box {
    margin: 7px 7px;
  }
}
.upload-box {
  border-top: 1px #ededed dashed;
  padding-top: 5px;
  position: relative;
  top: 3px;
}
</style>
